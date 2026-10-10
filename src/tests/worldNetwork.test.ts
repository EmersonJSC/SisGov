import { describe, expect, it } from "vitest";
import {
  advanceExecution,
  createExecution,
  translateAuthorizedPolicies,
  type EngineExecution,
} from "../engine";
import { prepareMonthlyContent } from "../game/prepareMonthlyContent";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

function brazil() {
  const loaded = loadDistributedScenario("testes/legado/brasil/pais.json");
  if (!loaded.ok) throw new Error(JSON.stringify(loaded.diagnostics));
  return loaded.value;
}

/** Joga N turnos (3 meses cada) com os níveis dados; devolve o estado final. */
function play(turns: number, levels: Record<string, number> = {}) {
  const { definition } = brazil();
  const monthly = prepareMonthlyContent(definition);
  if (!monthly.ok) throw new Error(JSON.stringify(monthly.diagnostics));
  const { content, graph } = monthly.value;
  let execution: EngineExecution = createExecution(content, graph);
  for (let month = 0; month < turns * 3; month += 1) {
    const batch = translateAuthorizedPolicies(
      content,
      graph,
      content.policies.map((policy) => ({
        policyId: policy.id,
        intensity:
          levels[policy.id] ?? execution.values[policy.controle.variavel],
      })),
    );
    if (!batch.ok) throw new Error(JSON.stringify(batch.diagnostics));
    const step = advanceExecution(content, graph, execution, batch.value);
    if (!step.ok) throw new Error(JSON.stringify(step.diagnostics));
    execution = step.value.execution;
  }
  return { execution, graph };
}

describe("SG142 — a rede do mundo", () => {
  it("o Brasil declara só leis e bolhas lentas; o resto nasce calculado", () => {
    const { definition, graph } = brazil();
    for (const id of Object.keys(definition.initialState.valores))
      expect(["controle", "estoque"]).toContain(graph.nodesById[id].tipo);
    const start = createExecution(definition, graph);
    expect(start.values.escolaridade).toBe(45);
    expect(start.values.pib).toBeGreaterThan(0);
    expect(start.values.saude_populacao).toBeGreaterThan(0);
  });

  it("nenhuma bolha isolada: cada índice e situação recebe e envia", () => {
    const { graph } = brazil();
    const calculated = Object.values(graph.nodesById).filter(
      (node) =>
        (node.tipo === "calculado" || node.tipo === "situacao") &&
        !node.id.includes(":") &&
        node.id !== "carga_evento_demanda",
    );
    expect(calculated.length).toBeGreaterThanOrEqual(25);
    for (const node of calculated) {
      expect(
        graph.relations.some((relation) => relation.targetId === node.id),
        `${node.id} sem origem`,
      ).toBe(true);
      expect(
        graph.relations.some((relation) => relation.originId === node.id),
        `${node.id} sem destino`,
      ).toBe(true);
    }
  });

  it("nenhum número escondido: nenhuma ligação tem termo constante", () => {
    const { definition } = brazil();
    for (const consequence of definition.consequences)
      expect(consequence.parametros.termoConstante ?? 0, consequence.id).toBe(
        0,
      );
  });

  it("20 turnos sem mudar nada: todos os valores válidos", () => {
    const { execution, graph } = play(20);
    for (const [id, value] of Object.entries(execution.values)) {
      const node = graph.nodesById[id];
      expect(Number.isFinite(value), id).toBe(true);
      if (node.dominio.minimo !== undefined)
        expect(value, id).toBeGreaterThanOrEqual(node.dominio.minimo);
      if (node.dominio.maximo !== undefined)
        expect(value, id).toBeLessThanOrEqual(node.dominio.maximo);
    }
  });
});

describe("SG142 — decisões se propagam pela rede", () => {
  const base = () => play(20).execution.values;

  it("mais verba na atenção básica: saúde sobe e, aos poucos, a economia", () => {
    const before = base();
    const after = play(20, { "atencao-basica": 6000 }).execution.values;
    expect(after.cobertura_aps).toBeGreaterThan(before.cobertura_aps + 10);
    expect(after.pressao_hospitalar).toBeLessThan(before.pressao_hospitalar);
    expect(after.saude_populacao).toBeGreaterThan(before.saude_populacao);
    expect(after.produtividade).toBeGreaterThan(before.produtividade);
    expect(after.pib).toBeGreaterThan(before.pib);
    expect(after.desemprego).toBeLessThan(before.desemprego);
  });

  it("cortar a merenda: a escolaridade (bolha lenta) cai devagar, ano após ano", () => {
    const yearBase = play(4).execution.values;
    const decadeBase = play(40).execution.values;
    const year = play(4, { "alimentacao-escolar": 0 }).execution.values;
    const decade = play(40, { "alimentacao-escolar": 0 }).execution.values;
    const lossYear = yearBase.escolaridade - year.escolaridade;
    const lossDecade = decadeBase.escolaridade - decade.escolaridade;
    expect(lossYear).toBeGreaterThan(0);
    expect(lossDecade).toBeGreaterThan(lossYear * 3);
    expect(decade.qualificacao_trabalho).toBeLessThan(
      decadeBase.qualificacao_trabalho,
    );
    expect(decade.pib).toBeLessThan(decadeBase.pib);
  });

  it("cortar a atenção básica ao mínimo faz a crise no atendimento nascer", () => {
    const before = base();
    const after = play(12, { "atencao-basica": 2400 }).execution.values;
    expect(before.crise_atendimento).toBe(0);
    expect(after.crise_atendimento).toBeGreaterThan(0);
    // A crise pede mais verba (apoio) e faz a verba render menos (eficácia).
    expect(after["apoio:atencao-basica"]).toBeGreaterThan(0);
    expect(after["eficacia:atencao-basica"]).toBeLessThan(
      before["eficacia:atencao-basica"],
    );
  });

  it("creches: mais renda e menos pobreza", () => {
    const before = base();
    const after = play(20, { "creches-publicas": 1600 }).execution.values;
    expect(after.participacao_trabalho_cuidadoras).toBeGreaterThan(
      before.participacao_trabalho_cuidadoras,
    );
    expect(after.renda_familias).toBeGreaterThan(before.renda_familias);
    expect(after.pobreza).toBeLessThan(before.pobreza);
  });
});
