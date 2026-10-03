import type { ResolvedPackage } from "../model/resolvePackage";
import type { ScenarioGraph } from "../graph/buildGraph";
import type { PolicyCommandBatch } from "./translatePolicyCommands";

export type ExecutionSnapshot = Readonly<{
  step: number;
  values: Readonly<Record<string, number>>;
  commands: PolicyCommandBatch;
}>;

export type EngineExecution = {
  step: number;
  values: Record<string, number>;
  initialValues: Readonly<Record<string, number>>;
  history: readonly ExecutionSnapshot[];
  historyLimit: number;
  relationMemory: Readonly<{
    firedRelationIds: readonly string[];
    fixedRemaining: Readonly<Record<string, number>>;
  }>;
};

/** Copia o estado inicial para uma nova partida numérica independente. */
export function createExecution(
  content: ResolvedPackage,
  graph: ScenarioGraph,
): EngineExecution {
  const initialValues = { ...content.initialState.valores };
  return {
    step: 0,
    values: { ...initialValues },
    initialValues,
    history: [],
    historyLimit: Math.max(
      0,
      ...graph.relations.map((relation) => relation.delaySteps),
    ),
    relationMemory: { firedRelationIds: [], fixedRemaining: {} },
  };
}

/** Lê um retrato anterior; antes do início da partida, usa os valores iniciais. */
export function readExecutionSnapshot(
  execution: EngineExecution,
  stepsAgo: number,
): Readonly<Record<string, number>> {
  if (!Number.isInteger(stepsAgo) || stepsAgo < 0)
    return execution.initialValues;
  if (stepsAgo === 0) return execution.values;
  const targetStep = execution.step - stepsAgo;
  const snapshot = execution.history.find(
    (candidate) => candidate.step === targetStep,
  );
  if (!snapshot) return execution.initialValues;
  const valuesAtStart = { ...snapshot.values };
  for (const command of snapshot.commands.controlCommands)
    valuesAtStart[command.controlId] = command.value;
  return valuesAtStart;
}
