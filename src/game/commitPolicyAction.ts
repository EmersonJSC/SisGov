import type {
  ContentDiagnostic,
  ResolvedPackage,
  ValidationResult,
} from "../engine";
import { changePolicyTarget, createProposal } from "../domain/game";
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
  if (validated.value.route === "proposta") {
    const proposal = createProposal(
      {
        id: command.id,
        policyDefinitionId: command.policyId,
        desiredLevel: command.desiredLevel,
        createdAtTurn: game.currentTurn,
      },
      rules,
      game.proposals,
    );
    if (!proposal.ok) return invalid("proposal", proposal.error.message);
    return {
      ok: true,
      value: { ...game, proposals: [...game.proposals, proposal.value] },
    };
  }
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
