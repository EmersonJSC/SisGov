import { describe, expect, it } from "vitest";
import {
  advanceExecution,
  createExecution,
  translateAuthorizedPolicies,
  type EngineExecution,
} from "../engine";
import { prepareMonthlyContent } from "../game/prepareMonthlyContent";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

/** Retrato do Brasil de hoje usado na calibragem (docs/conteudo/rede.md). */
const brazilToday: Record<string, number> = {
  capital_humano: 45,
  capital_produtivo: 50,
  cobertura_aps: 72,
  pressao_hospitalar: 54,
  saude_populacao: 60,
  frequencia_escolar: 75,
  qualidade_educacao: 40,
  participacao_trabalho_cuidadoras: 62,
  oportunidades_juvenis: 45,
  qualificacao_trabalho: 50,
  produtividade: 50,
  atividade_economica: 50,
  investimento: 40,
  confianca_empresarial: 50,
  desemprego: 9,
  renda_familias: 50,
  consumo: 50,
  pobreza: 30,
  desigualdade: 55,
  violencia_letal: 21,
  crime_organizado: 40,
  protecao_efetiva_mulheres: 42,
  sensacao_seguranca: 40,
  corrupcao: 40,
  capacidade_estatal: 50,
  confianca_instituicoes: 45,
  crise_atendimento: 0,
  onda_violencia: 0,
  recessao: 0,
};

function brazil() {
  const loaded = loadDistributedScenario("paises/brasil/pais.json");
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

describe("SG142 — a rede do mundo com o Brasil de hoje", () => {
  it("o Brasil começa no retrato calibrado, sem declarar nenhum índice", () => {
    const { definition, graph } = brazil();
    const declared = Object.keys(definition.initialState.valores);
    for (const id of declared)
      expect(["controle", "estoque"]).toContain(graph.nodesById[id].tipo);
    const start = createExecution(definition, graph);
    for (const [id, value] of Object.entries(brazilToday))
      expect(start.values[id], id).toBeCloseTo(value, 2);
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

  it("20 turnos sem mudar nada: valores válidos e o país fica onde está", () => {
    const { execution, graph } = play(20);
    for (const [id, value] of Object.entries(execution.values)) {
      const node = graph.nodesById[id];
      expect(Number.isFinite(value), id).toBe(true);
      if (node.dominio.minimo !== undefined)
        expect(value, id).toBeGreaterThanOrEqual(node.dominio.minimo);
      if (node.dominio.maximo !== undefined)
        expect(value, id).toBeLessThanOrEqual(node.dominio.maximo);
    }
    for (const [id, value] of Object.entries(brazilToday))
      expect(Math.abs(execution.values[id] - value), id).toBeLessThan(0.5);
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
    expect(after.desemprego).toBeLessThan(before.desemprego);
  });

  it("cortar a merenda: frequência cai já, capital humano e qualificação depois", () => {
    const before = base();
    const year = play(4, { "alimentacao-escolar": 0 }).execution.values;
    const decade = play(40, { "alimentacao-escolar": 0 }).execution.values;
    expect(year.frequencia_escolar).toBeLessThan(before.frequencia_escolar - 5);
    expect(before.capital_humano - year.capital_humano).toBeLessThan(
      before.capital_humano - decade.capital_humano,
    );
    expect(decade.qualificacao_trabalho).toBeLessThan(
      before.qualificacao_trabalho - 1,
    );
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
