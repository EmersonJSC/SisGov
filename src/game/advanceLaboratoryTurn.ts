import {
  advanceExecution,
  applyGradualResponse,
  evaluateEvent,
  evaluateSituation,
  translateAuthorizedPolicies,
  type EngineExecution,
  type ResolvedPackage,
  type ScenarioGraph,
  type TargetExplanation,
  type ValidationResult,
} from "../engine";

export type LaboratoryState = {
  execution: EngineExecution;
  targets: ReadonlyMap<string, number>;
  pending: ReadonlyMap<string, number>;
  activeSituationIds: ReadonlySet<string>;
  occurredEventIds: ReadonlySet<string>;
};
export type LaboratoryTurn = {
  execution: EngineExecution;
  targets: Map<string, number>;
  activeSituationIds: Set<string>;
  occurredEventIds: Set<string>;
  newEventIds: readonly string[];
  explanations: readonly TargetExplanation[];
};

/** Technical laboratory only: no parliamentary approval or debt financing yet.
 * Prepare the whole result without changing live execution, targets or pending decisions. */
export function advanceLaboratoryTurn(
  content: ResolvedPackage,
  graph: ScenarioGraph,
  state: LaboratoryState,
): ValidationResult<LaboratoryTurn> {
  const targets = new Map(state.targets);
  for (const [id, value] of state.pending) targets.set(id, value);
  const changes = [];
  for (const policy of content.policies) {
    const current = state.execution.values[policy.controle.variavel];
    const target = targets.get(policy.id) ?? current;
    const control = graph.nodesById[policy.controle.variavel];
    if (
      !Number.isFinite(target) ||
      !control ||
      (control.dominio.minimo !== undefined &&
        target < control.dominio.minimo) ||
      (control.dominio.maximo !== undefined && target > control.dominio.maximo)
    )
      return {
        ok: false,
        diagnostics: [
          {
            code: "COMANDO_INVALIDO",
            file: policy.id,
            field: "meta",
            message: `Meta inválida para ${policy.nome}: ${target}.`,
          },
        ],
      };
    const rate = policy.respostaTemporal;
    const response = applyGradualResponse(
      current,
      target,
      rate ? (target >= current ? rate.implantacao : rate.degradacao) : 1,
    );
    if (!response.ok) return response;
    changes.push({ policyId: policy.id, intensity: response.value.value });
  }
  for (const id of targets.keys()) {
    if (!content.policies.some((policy) => policy.id === id))
      return {
        ok: false,
        diagnostics: [
          {
            code: "COMANDO_INVALIDO",
            file: "$comando",
            field: "meta",
            message: `Política desconhecida: ${id}.`,
          },
        ],
      };
  }
  const batch = translateAuthorizedPolicies(content, graph, changes);
  if (!batch.ok) return batch;
  const activeOccurrenceIds = new Set([
    ...state.activeSituationIds,
    ...state.occurredEventIds,
  ]);
  const result = advanceExecution(content, graph, state.execution, {
    ...batch.value,
    activeRelationIds: [
      ...batch.value.activeRelationIds,
      ...graph.relations
        .filter((relation) => activeOccurrenceIds.has(relation.sourceId))
        .map((r) => r.id),
    ].sort(),
  });
  if (!result.ok) return result;
  const activeSituationIds = new Set(state.activeSituationIds);
  const occurredEventIds = new Set(state.occurredEventIds);
  const newEventIds: string[] = [];
  for (const situation of content.situations) {
    if (!situation.entraQuando || !situation.saiQuando) continue;
    const evaluated = evaluateSituation(
      {
        id: situation.id,
        enterWhen: situation.entraQuando,
        exitWhen: situation.saiQuando,
      },
      activeSituationIds.has(situation.id),
      result.value.execution.values,
    );
    if (!evaluated.ok) return evaluated;
    if (evaluated.value) activeSituationIds.add(situation.id);
    else activeSituationIds.delete(situation.id);
  }
  for (const event of content.events) {
    if (!event.entraQuando) continue;
    const evaluated = evaluateEvent(
      { id: event.id, triggerWhen: event.entraQuando },
      occurredEventIds.has(event.id),
      result.value.execution.values,
    );
    if (!evaluated.ok) return evaluated;
    if (evaluated.value) {
      occurredEventIds.add(event.id);
      newEventIds.push(event.id);
    }
  }
  return {
    ok: true,
    value: {
      ...result.value,
      targets,
      activeSituationIds,
      occurredEventIds,
      newEventIds,
    },
  };
}
