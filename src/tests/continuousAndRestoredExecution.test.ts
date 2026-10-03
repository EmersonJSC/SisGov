import { describe, expect, it } from "vitest";
import {
  advanceExecution,
  createExecution,
  evaluateEvent,
  exportExecution,
  restoreExecution,
  translateAuthorizedPolicies,
  type EngineExecution,
  type ScenarioGraph,
} from "../engine";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

describe("execução contínua e retomada", () => {
  it("mantém trajetória, explicações, histórico e pendências iguais", () => {
    const loaded = loadDistributedScenario("exemplo/cenario.json");
    if (!loaded.ok) throw new Error("O cenário deveria carregar.");
    const originalRelation = loaded.value.graph.relations[0];
    const delayedRelation = { ...originalRelation, delaySteps: 1 };
    const delayedGraph: ScenarioGraph = {
      ...loaded.value.graph,
      relations: [delayedRelation],
      relationsById: { [delayedRelation.id]: delayedRelation },
    };
    const batch = translateAuthorizedPolicies(
      loaded.value.definition,
      delayedGraph,
      [{ policyId: "material-escolar", intensity: 20 }],
    );
    if (!batch.ok) throw new Error("O comando deveria ser válido.");

    const advance = (execution: EngineExecution) => {
      const result = advanceExecution(
        loaded.value.definition,
        delayedGraph,
        execution,
        batch.value,
      );
      if (!result.ok) throw new Error("O passo deveria ser válido.");
      return result.value;
    };

    const first = advance(
      createExecution(loaded.value.definition, delayedGraph),
    );
    const second = advance(first.execution);
    const auxiliary = {
      occurrences: {
        activeSituationIds: ["sobrecarga"],
        occurredEventIds: ["enchente"],
        pendingDilemmas: [
          { dilemmaId: "vacinas", optionIds: ["idosos", "profissionais"] },
        ],
      },
      gradualMemory: { "implantacao:material-escolar": 7.5 },
    };
    const serialized = JSON.stringify(
      exportExecution(loaded.value.definition, second.execution, auxiliary),
    );
    const restored = restoreExecution(
      loaded.value.definition,
      JSON.parse(serialized),
    );
    if (!restored.ok) throw new Error("O snapshot deveria restaurar.");

    const continuousThird = advance(second.execution);
    const restoredThird = advance(restored.value.execution);

    expect(restoredThird).toEqual(continuousThird);
    expect(restored.value.auxiliary).toEqual(auxiliary);
    expect(restoredThird.execution.history).toHaveLength(1);
    expect(restoredThird.explanations[0]).toMatchObject({
      result: 40.4,
      contributions: [{ sourceValue: 20, contribution: 0.4 }],
    });
    expect(
      evaluateEvent(
        {
          id: "enchente",
          triggerWhen: {
            tipo: "comparacao",
            variavel: "educacao_publica",
            operador: "maior_que",
            valor: 0,
          },
        },
        restored.value.auxiliary.occurrences.occurredEventIds.includes(
          "enchente",
        ),
        restoredThird.execution.values,
      ),
    ).toEqual({ ok: true, value: false });
  });
});
