import {
  translateAuthorizedPolicies,
  type PolicyCommandBatch,
  type ResolvedPackage,
  type ScenarioGraph,
  type ValidationResult,
} from "../engine";
import type { PolicyState } from "../domain/game";

function invalid(
  field: string,
  message: string,
): ValidationResult<PolicyCommandBatch> {
  return {
    ok: false,
    diagnostics: [
      { code: "COMANDO_INVALIDO", file: "$partida", field, message },
    ],
  };
}

/** Bridge from political state to the existing numerical executor. */
export function preparePolicyExecution(
  content: ResolvedPackage,
  graph: ScenarioGraph,
  states: readonly PolicyState[],
): ValidationResult<PolicyCommandBatch> {
  const seen = new Set<string>();
  for (const [index, state] of states.entries()) {
    const field = `policies[${index}]`;
    if (seen.has(state.policyDefinitionId))
      return invalid(field, "Há dois estados para a mesma lei.");
    seen.add(state.policyDefinitionId);
    if (
      (state.status === "vigente" && state.legalStatus !== "vigente") ||
      (state.status !== "vigente" && state.legalStatus !== "revogada")
    )
      return invalid(
        field,
        "Vigência jurídica e estado de implantação são incompatíveis.",
      );
  }
  const translated = translateAuthorizedPolicies(
    content,
    graph,
    states.map((state) => ({
      policyId: state.policyDefinitionId,
      intensity: state.status === "encerrada" ? 0 : state.implementedLevel,
    })),
  );
  if (!translated.ok) return translated;
  const activePolicies = new Set(
    states
      .filter(
        (state) => state.status !== "encerrada" && state.implementedLevel > 0,
      )
      .map((state) => state.policyDefinitionId),
  );
  return {
    ok: true,
    value: {
      ...translated.value,
      activeRelationIds: translated.value.activeRelationIds.filter((id) =>
        activePolicies.has(graph.relationsById[id].sourceId),
      ),
    },
  };
}
