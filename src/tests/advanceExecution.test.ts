import { describe, expect, it } from "vitest";
import {
  advanceExecution,
  buildGraph,
  createExecution,
  resolvePackage,
  translateAuthorizedPolicies,
} from "../engine";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

function example() {
  const loaded = loadDistributedScenario("exemplo/cenario.json");
  if (!loaded.ok) throw new Error("O pacote de exemplo deveria carregar.");
  return loaded.value;
}

describe("advanceExecution", () => {
  it("lê a mesma fotografia para uma cadeia independentemente da ordem das variáveis", () => {
    function run(variables: readonly object[]) {
      const files = {
        "cenario.json": JSON.stringify({
          id: "cadeia-teste",
          tipo: "cenario",
          versaoEsquema: 1,
          nome: "Cadeia de teste",
          estadoInicial: "estado.json",
          variaveis: "variaveis.json",
          politicas: ["politica.json"],
          consequencias: ["ab.json", "bc.json"],
        }),
        "estado.json": JSON.stringify({
          id: "estado",
          tipo: "estado-inicial",
          versaoEsquema: 1,
          valores: { a: 0, b: 40, c: 30 },
        }),
        "variaveis.json": JSON.stringify({
          id: "variaveis",
          tipo: "variaveis",
          versaoEsquema: 1,
          variaveis: variables,
        }),
        "politica.json": JSON.stringify({
          id: "politica",
          tipo: "programa",
          versaoEsquema: 1,
          nome: "Política",
          descricao: "Teste",
          processoAutorizacao: "decisao-executiva",
          controle: { variavel: "a", modo: "verba", unidade: "moeda" },
          consequencias: ["ab", "bc"],
        }),
        "ab.json": JSON.stringify({
          id: "ab",
          tipo: "consequencia",
          versaoEsquema: 1,
          origem: "a",
          alvo: "b",
          mecanismo: "afim",
          parametros: { coeficiente: 1, termoConstante: 0 },
          unidade: "indice_0_100",
          atrasoPassos: 0,
          duracao: { modo: "continuo" },
        }),
        "bc.json": JSON.stringify({
          id: "bc",
          tipo: "consequencia",
          versaoEsquema: 1,
          origem: "b",
          alvo: "c",
          mecanismo: "afim",
          parametros: { coeficiente: 1, termoConstante: -10 },
          unidade: "indice_0_100",
          atrasoPassos: 0,
          duracao: { modo: "continuo" },
        }),
      };
      const resolved = resolvePackage("cenario.json", files);
      if (!resolved.ok) throw new Error("O pacote de teste deveria resolver.");
      const graph = buildGraph(resolved.value);
      const result = advanceExecution(
        resolved.value,
        graph,
        createExecution(resolved.value, graph),
        {
          controlCommands: [{ controlId: "a", policyId: "politica", value: 1 }],
          activeRelationIds: graph.relations.map((relation) => relation.id),
        },
      );
      if (!result.ok) throw new Error("O passo deveria ser válido.");
      return result.value.execution.values;
    }

    const a = {
      id: "a",
      tipo: "controle",
      nome: "A",
      unidade: "moeda",
      dominio: { minimo: 0 },
      valorInicial: 0,
    };
    const b = {
      id: "b",
      tipo: "calculado",
      nome: "B",
      unidade: "indice_0_100",
      dominio: { minimo: 0, maximo: 100 },
      valorInicial: 40,
    };
    const c = {
      id: "c",
      tipo: "calculado",
      nome: "C",
      unidade: "indice_0_100",
      dominio: { minimo: 0, maximo: 100 },
      valorInicial: 0,
    };

    expect(run([a, b, c])).toEqual({ a: 1, b: 41, c: 30 });
    expect(run([a, c, b])).toEqual({ a: 1, c: 30, b: 41 });
  });

  it("confirma controle e consequência no mesmo passo", () => {
    const scenario = example();
    const execution = createExecution(scenario.definition, scenario.graph);
    const batch = translateAuthorizedPolicies(
      scenario.definition,
      scenario.graph,
      [{ policyId: "material-escolar", intensity: 20 }],
    );
    if (!batch.ok) throw new Error("O lote deveria ser válido.");

    expect(
      advanceExecution(
        scenario.definition,
        scenario.graph,
        execution,
        batch.value,
      ),
    ).toEqual({
      ok: true,
      value: {
        execution: {
          step: 1,
          values: { verba_educacao: 20, educacao_publica: 40.4 },
          initialValues: { verba_educacao: 0, educacao_publica: 40 },
          history: [],
          historyLimit: 0,
          relationMemory: { firedRelationIds: [], fixedRemaining: {} },
        },
        explanations: [
          {
            targetId: "educacao_publica",
            previousValue: 40,
            baseValue: 40,
            contributions: [
              {
                relationId: "material-escolar:0:melhora-educacao",
                policyOrEventId: "material-escolar",
                consequenceId: "melhora-educacao",
                originId: "verba_educacao",
                targetId: "educacao_publica",
                sourceValue: 20,
                coefficient: 0.02,
                constant: 0,
                contribution: 0.4,
              },
            ],
            result: 40.4,
          },
        ],
      },
    });
    expect(execution).toEqual({
      step: 0,
      values: { verba_educacao: 0, educacao_publica: 40 },
      initialValues: { verba_educacao: 0, educacao_publica: 40 },
      history: [],
      historyLimit: 0,
      relationMemory: { firedRelationIds: [], fixedRemaining: {} },
    });
  });

  it("falha sem modificar a execução anterior", () => {
    const scenario = example();
    const execution = createExecution(scenario.definition, scenario.graph);
    const result = advanceExecution(
      scenario.definition,
      scenario.graph,
      execution,
      {
        controlCommands: [
          {
            controlId: "verba_educacao",
            policyId: "material-escolar",
            value: Number.POSITIVE_INFINITY,
          },
        ],
        activeRelationIds: [],
      },
    );

    expect(result).toMatchObject({ ok: false });
    expect(execution).toEqual({
      step: 0,
      values: { verba_educacao: 0, educacao_publica: 40 },
      initialValues: { verba_educacao: 0, educacao_publica: 40 },
      history: [],
      historyLimit: 0,
      relationMemory: { firedRelationIds: [], fixedRemaining: {} },
    });
  });

  it("aplica no turno seguinte uma consequência com atraso de um passo", () => {
    const loaded = loadDistributedScenario("alternativo/cenario.json");
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) return;
    const { definition, graph } = loaded.value;
    const batch = translateAuthorizedPolicies(definition, graph, [
      { policyId: "bolsa-estudo", intensity: 20 },
    ]);
    expect(batch.ok).toBe(true);
    if (!batch.ok) return;

    const first = advanceExecution(
      definition,
      graph,
      createExecution(definition, graph),
      batch.value,
    );
    expect(first).toMatchObject({
      ok: true,
      value: { execution: { step: 1, values: { acesso_educacao: 52 } } },
    });
    if (!first.ok) return;

    expect(
      advanceExecution(definition, graph, first.value.execution, batch.value),
    ).toMatchObject({
      ok: true,
      value: { execution: { step: 2, values: { acesso_educacao: 52.2 } } },
    });
  });
});
