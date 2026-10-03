import { describe, expect, it } from "vitest";
import {
  advanceExecution,
  createExecution,
  translateAuthorizedPolicies,
} from "../engine";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

function example() {
  const loaded = loadDistributedScenario("exemplo/cenario.json");
  if (!loaded.ok) throw new Error("O pacote de exemplo deveria carregar.");
  return loaded.value;
}

describe("advanceExecution", () => {
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
