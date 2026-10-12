import type {
  ContentDiagnostic,
  ResolvedPackage,
  ValidationResult,
} from "../engine";
import { changePolicyTarget } from "./leis";
import type { GameState } from "./createGame";
import { applyRequirementFalls } from "./policyRequirements";
import { policyLevelRulesFromContent } from "./policyRulesFromContent";
import {
  validatePolicyAction,
  type PolicyActionAuthorization,
} from "./validatePolicyAction";

export type PolicyActionCommand = Readonly<{
  id: string;
  policyId: string;
  desiredLevel: number;
  authorization?: PolicyActionAuthorization;
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

/** Applies the route returned by the read-only validator as one new snapshot. */
export function commitPolicyAction(
  game: GameState,
  content: ResolvedPackage,
  command: PolicyActionCommand,
): ValidationResult<GameState> {
  const validated = validatePolicyAction(
    game,
    content,
    command.policyId,
    command.desiredLevel,
    command.authorization,
  );
  if (!validated.ok) return validated;
  const definition = policyLevelRulesFromContent(content, command.policyId);
  if (!definition.ok) return definition;
  const { rules } = definition.value;
  if (!command.id.trim()) return invalid("id", "A ação precisa ter ID.");
  // V1-04: o Congresso fica para a versão 2; sem rota executiva, a mudança
  // é recusada em vez de virar uma proposta que nunca é votada.
  if (validated.value.route === "proposta")
    return invalid(
      "policy",
      "Esta mudança precisa do Congresso, que entra na versão 2.",
    );
  const index = game.policies.findIndex(
    (state) => state.policyDefinitionId === command.policyId,
  );
  if (index < 0)
    return invalid("policy", "A rota executiva exige política vigente.");
  const changed = changePolicyTarget(
    game.policies[index],
    command.desiredLevel,
    game.currentTurn,
    rules,
  );
  if (!changed.ok) return invalid("policy", changed.error.message);
  const policies = [...game.policies];
  policies[index] = changed.value;
  // SG138: filhas que dependiam desta lei caem para a base
  const falls = applyRequirementFalls(content, policies, game.currentTurn);
  return { ok: true, value: { ...game, policies: falls.policies } };
}
