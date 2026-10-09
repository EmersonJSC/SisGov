import type {
  ContentDiagnostic,
  PolicyFile,
  ValidationResult,
} from "../engine";
import {
  validatePolicyLevel,
  type PolicyLevelRules,
  type Proposal,
} from "../domain/game";
import type { GameState } from "./createGame";

export type PolicyActionAuthorization = Readonly<{
  requiredActivePolicyIds?: readonly string[];
  excludedActivePolicyIds?: readonly string[];
}>;

export type PolicyActionValidation = Readonly<{
  route: "executiva" | "proposta";
  policyId: string;
  desiredLevel: number;
}>;

function invalid(field: string, message: string): ValidationResult<never> {
  return {
    ok: false,
    diagnostics: [
      {
        code: "COMANDO_INVALIDO",
        file: "$partida",
        field,
        message,
      } satisfies ContentDiagnostic,
    ],
  };
}

function openProposalFor(
  proposals: readonly Proposal[],
  policyId: string,
): boolean {
  return proposals.some(
    (proposal) =>
      proposal.policyDefinitionId === policyId &&
      ["rascunho", "apresentada", "em_votacao"].includes(proposal.status),
  );
}

/**
 * Read-only gate before a command becomes either an executive adjustment or a
 * parliamentary proposal. It has no random draw and does not mutate GameState.
 */
export function validatePolicyAction(
  game: GameState,
  policy: PolicyFile,
  desiredLevel: number,
  rules: PolicyLevelRules,
  authorization: PolicyActionAuthorization = {},
): ValidationResult<PolicyActionValidation> {
  const level = validatePolicyLevel(desiredLevel, rules);
  if (!level.ok) return invalid("desiredLevel", level.error.message);
  if (policy.id !== rules.policyDefinitionId)
    return invalid(
      "policy",
      "A definição e as regras apontam para políticas diferentes.",
    );
  const active = new Set(
    game.policies
      .filter((state) => state.legalStatus === "vigente")
      .map((state) => state.policyDefinitionId),
  );
  for (const requirement of authorization.requiredActivePolicyIds ?? [])
    if (!active.has(requirement))
      return invalid(
        "authorization.requiredActivePolicyIds",
        `A ação exige a política vigente ${requirement}.`,
      );
  for (const excluded of authorization.excludedActivePolicyIds ?? [])
    if (active.has(excluded))
      return invalid(
        "authorization.excludedActivePolicyIds",
        `A ação é incompatível com a política vigente ${excluded}.`,
      );
  if (openProposalFor(game.proposals, policy.id))
    return invalid("proposals", `Já existe proposta aberta para ${policy.id}.`);
  const current = game.policies.find(
    (state) => state.policyDefinitionId === policy.id,
  );
  const hasExecutiveAuthorization =
    policy.processoAutorizacao.startsWith("execucao-");
  return {
    ok: true,
    value: {
      route: current && hasExecutiveAuthorization ? "executiva" : "proposta",
      policyId: policy.id,
      desiredLevel: level.value,
    },
  };
}
