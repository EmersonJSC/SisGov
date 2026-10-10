import type { ResolvedPackage } from "../model/resolvePackage";
import type { ScenarioGraph } from "../graph/buildGraph";
import type { PolicyCommandBatch } from "./translatePolicyCommands";
import { contextNodeId, lawNodeBase } from "../model/lawNodes";
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
/** Passadas máximas e tolerância para o país do turno 0 se acomodar. */
const settlePasses = 1500;
const settleTolerance = 1e-9;

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
  // O turno 0 é o país já funcionando: repete o cálculo (sem acumular
  // estoques) até leis e bolhas se acomodarem — ex.: a eficácia de uma lei
  // já reflete a corrupção do país, em vez de partir do neutro.
  const activeRelations = graph.relations.filter(
    (relation) =>
      relation.sourceType === "rede" ||
      (relation.sourceType === "lei" &&
        relation.duration.modo === "continuo" &&
        (everyLawActive || inherited.has(relation.sourceId))),
  );
  // Contexto do cenário (D-55): a cada passada, o nó `contexto:<bolha>`
  // corrige metade da distância entre o que a rede dá e o valor declarado.
  // Situação com valor 0 mira metade do ponto de surgimento (longe de surgir).
  const targets = Object.entries(content.initialState.indicesIniciais ?? {})
    .filter(([id]) => graph.nodesById[id] !== undefined)
    .map(([id, value]) => {
      const node = graph.nodesById[id];
      const emergence = node.surgimento ?? 0;
      const raw =
        node.tipo === "situacao"
          ? value > 0
            ? value + emergence
            : emergence / 2
          : value;
      return {
        id,
        context: contextNodeId(id),
        raw,
        situation: node.tipo === "situacao",
      };
    });
  let settled: Record<string, number> = start;
  let gap = Infinity;
  for (let pass = 0; pass < settlePasses; pass += 1) {
    const network = computeNetwork({
      content,
      graph,
      previous: settled,
      controls: {},
      activeRelations,
      readDelayed: () => settled,
      duration: 1,
      accumulateStocks: false,
    });
    // Pacotes inválidos já foram recusados pela coerência; se a rede não
    // fechar, a partida começa do estado declarado e o erro aparece no passo.
    if (!network.ok) break;
    const previous = settled;
    settled = { ...network.value.values };
    gap = 0;
    if (targets.length) {
      const reached = new Map(
        network.value.explanations.map((item) => [item.targetId, item]),
      );
      for (const target of targets) {
        const item = reached.get(target.id);
        if (!item) continue;
        // Índice: compara o valor para onde a bolha vai (já limitado ao
        // domínio); situação: a soma antes do surgimento.
        const now = target.situation ? item.rawValue : item.targetValue;
        const miss = target.raw - now;
        gap = Math.max(gap, Math.abs(miss));
        settled[target.context] = (settled[target.context] ?? 0) + miss / 2;
      }
    }
    if (
      gap < 1e-7 &&
      Object.keys(settled).every(
        (id) => Math.abs(settled[id] - previous[id]) < settleTolerance,
      )
    )
      break;
  }
  const initialValues = settled;
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
