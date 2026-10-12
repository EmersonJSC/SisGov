import type {
  ContentDiagnostic,
  ResolvedPackage,
  ValidationResult,
} from "../engine";
import { validatePolicyLevel } from "./leis";
import type { GameState } from "./createGame";
import { policyInForce, requirementBlock } from "./policyRequirements";
import { policyLevelRulesFromContent } from "./policyRulesFromContent";

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

/**
 * Read-only gate before a command becomes an executive adjustment. Changes
 * that need the Congress are refused until version 2 (V1-04). It has no random draw and does not mutate GameState.
 */
export function validatePolicyAction(
  game: GameState,
  content: ResolvedPackage,
  policyId: string,
  desiredLevel: number,
  authorization: PolicyActionAuthorization = {},
): ValidationResult<PolicyActionValidation> {
  const definition = policyLevelRulesFromContent(content, policyId);
  if (!definition.ok) return definition;
  const { policy, rules } = definition.value;
  const level = validatePolicyLevel(desiredLevel, rules);
  if (!level.ok) return invalid("desiredLevel", level.error.message);
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
  // SG138: lei filha só sai da base com a mãe numa opção exigida; pétrea
  // não muda (D-65)
  const blocked = requirementBlock(
    content,
    game.policies,
    policy.id,
    level.value,
  );
  if (blocked) return invalid("desiredLevel", blocked);
  const current = policyInForce(game.policies, policy.id);
  const hasExecutiveAuthorization =
    policy.processoAutorizacao.startsWith("execucao-") ||
    policy.processoAutorizacao === "decreto";
  return {
    ok: true,
    value: {
      route: current && hasExecutiveAuthorization ? "executiva" : "proposta",
      policyId: policy.id,
      desiredLevel: level.value,
    },
  };
}
