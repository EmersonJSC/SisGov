import { describe, expect, it } from "vitest";
import { createExecution, readExecutionSnapshot } from "../engine";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

describe("createExecution", () => {
  it("cria partidas independentes sem alterar o pacote", () => {
    const loaded = loadDistributedScenario("testes/exemplo/cenario.json");

    expect(loaded.ok).toBe(true);
    if (!loaded.ok) return;
    const first = createExecution(loaded.value.definition, loaded.value.graph);
    const second = createExecution(loaded.value.definition, loaded.value.graph);
    first.values.educacao_publica = 75;
    first.step = 3;

    // Turno 0: o país declara só a lei; o índice nasce calculado (D-41).
    expect(second).toEqual({
      step: 0,
      values: {
        verba_educacao: 0,
        educacao_publica: 0,
        "eficacia:material-escolar": 1,
        "apoio:material-escolar": 0,
      },
      initialValues: {
        verba_educacao: 0,
        educacao_publica: 0,
        "eficacia:material-escolar": 1,
        "apoio:material-escolar": 0,
      },
      history: [],
      historyLimit: 0,
      relationMemory: { firedRelationIds: [], fixedRemaining: {} },
    });
    expect(loaded.value.definition.initialState.valores).toEqual({
      verba_educacao: 0,
    });
  });

  it("usa os valores iniciais quando ainda não existe histórico suficiente", () => {
    const loaded = loadDistributedScenario("testes/exemplo/cenario.json");
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) return;

    const execution = createExecution(
      loaded.value.definition,
      loaded.value.graph,
    );
    expect(readExecutionSnapshot(execution, 1)).toEqual(
      execution.initialValues,
    );
  });
});
