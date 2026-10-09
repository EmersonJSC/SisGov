import type { ResolvedPackage } from "../model/resolvePackage";
import type { ScenarioGraph } from "../graph/buildGraph";
import type { PolicyCommandBatch } from "./translatePolicyCommands";
import { lawNodeBase } from "../model/lawNodes";
import { computeNetwork } from "./computeNetwork";

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

/**
 * Cria a execução do turno 0. O país declara só leis (controles) e estoques;
 * índices e situações nascem calculados pela rede (D-41), com as leis
 * vigentes do país ativas e a eficácia/apoio das leis no neutro.
 */
export function createExecution(
  content: ResolvedPackage,
  graph: ScenarioGraph,
): EngineExecution {
  const declared = content.initialState.valores;
  const start: Record<string, number> = {};
  for (const node of Object.values(graph.nodesById)) {
    const neutral = lawNodeBase(node.id);
    if (neutral !== undefined) start[node.id] = neutral;
    else if (node.tipo === "controle" || node.tipo === "estoque")
      start[node.id] =
        declared[node.id] ?? node.valorInicial ?? node.dominio.minimo ?? 0;
    else start[node.id] = 0;
  }
  const inherited = new Set(
    (content.initialState.leisVigentes ?? []).map((entry) => entry.lei),
  );
  const everyLawActive = content.initialState.leisVigentes === undefined;
  const network = computeNetwork({
    content,
    graph,
    previous: start,
    controls: {},
    activeRelations: graph.relations.filter(
      (relation) =>
        relation.sourceType === "rede" ||
        (relation.sourceType === "lei" &&
          relation.duration.modo === "continuo" &&
          (everyLawActive || inherited.has(relation.sourceId))),
    ),
    readDelayed: () => start,
    duration: 1,
    accumulateStocks: false,
  });
  // Pacotes inválidos já foram recusados pela coerência; se a rede inicial
  // não fechar, a partida começa do estado declarado e o erro aparece no passo.
  const initialValues = network.ok ? network.value.values : start;
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
