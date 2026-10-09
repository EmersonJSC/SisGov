import type {
  ContentDiagnostic,
  PolicyFile,
  ValidationResult,
} from "../engine";
import {
  changePolicyTarget,
  createProposal,
  type PolicyLevelRules,
} from "../domain/game";
import type { GameState } from "./createGame";
import {
  validatePolicyAction,
  type PolicyActionAuthorization,
} from "./validatePolicyAction";

export type PolicyActionCommand = Readonly<{
  id: string;
  policy: PolicyFile;
  desiredLevel: number;
  rules: PolicyLevelRules;
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
  command: PolicyActionCommand,
): ValidationResult<GameState> {
  const validated = validatePolicyAction(
    game,
    command.policy,
    command.desiredLevel,
    command.rules,
    command.authorization,
  );
  if (!validated.ok) return validated;
  if (!command.id.trim()) return invalid("id", "A ação precisa ter ID.");
  if (validated.value.route === "proposta") {
    const proposal = createProposal(
      {
        id: command.id,
        policyDefinitionId: command.policy.id,
        desiredLevel: command.desiredLevel,
        createdAtTurn: game.currentTurn,
      },
      command.rules,
      game.proposals,
    );
    if (!proposal.ok) return invalid("proposal", proposal.error.message);
    return {
      ok: true,
      value: { ...game, proposals: [...game.proposals, proposal.value] },
    };
  }
  const index = game.policies.findIndex(
    (state) => state.policyDefinitionId === command.policy.id,
  );
  if (index < 0)
    return invalid("policy", "A rota executiva exige política vigente.");
  const changed = changePolicyTarget(
    game.policies[index],
    command.desiredLevel,
    game.currentTurn,
    command.rules,
  );
  if (!changed.ok) return invalid("policy", changed.error.message);
  const policies = [...game.policies];
  policies[index] = changed.value;
  return { ok: true, value: { ...game, policies } };
}
