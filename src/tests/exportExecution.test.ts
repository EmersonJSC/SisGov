import { describe, expect, it } from "vitest";
import { createExecution, exportExecution } from "../engine";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

describe("exportExecution", () => {
  it("exporta identidade, execução, histórico e ocorrências sem compartilhar objetos", () => {
    const loaded = loadDistributedScenario("exemplo/cenario.json");
    if (!loaded.ok) throw new Error("O cenário deveria carregar.");
    const execution = createExecution(
      loaded.value.definition,
      loaded.value.graph,
    );
    const snapshot = exportExecution(loaded.value.definition, execution, {
      occurrences: {
        activeSituationIds: ["sobrecarga"],
        occurredEventIds: ["enchente"],
        pendingDilemmas: [
          { dilemmaId: "vacinas", optionIds: ["idosos", "profissionais"] },
        ],
      },
      gradualMemory: { "implantacao:material-escolar": 5 },
    });

    expect(JSON.parse(JSON.stringify(snapshot))).toEqual(snapshot);
    expect(snapshot).toMatchObject({
      format: "sisgov-engine-snapshot",
      snapshotVersion: 1,
      executorVersion: 1,
      package: { id: "pais-exemplo", schemaVersion: 1 },
      execution: { step: 0 },
      auxiliary: {
        occurrences: {
          activeSituationIds: ["sobrecarga"],
          occurredEventIds: ["enchente"],
        },
        gradualMemory: { "implantacao:material-escolar": 5 },
      },
    });

    execution.values.educacao_publica = 90;
    expect(snapshot.execution.values.educacao_publica).toBe(40);
  });
});
