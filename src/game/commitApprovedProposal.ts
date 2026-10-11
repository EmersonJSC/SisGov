import type {
  ContentDiagnostic,
  ResolvedPackage,
  ValidationResult,
} from "../engine";
import {
  changePolicyTarget,
  createPolicyStateFromApproval,
} from "../domain/game";
import type { GameState } from "./createGame";
import { applyRequirementFalls, policyInForce } from "./policyRequirements";
import { policyLevelRulesFromContent } from "./policyRulesFromContent";

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

/** Makes an approved parliamentary proposal authoritative in the political state. */
export function commitApprovedProposal(
  game: GameState,
  content: ResolvedPackage,
  proposalId: string,
): ValidationResult<GameState> {
  const proposal = game.proposals.find((item) => item.id === proposalId);
  if (!proposal) return invalid("proposal.id", "Proposta inexistente.");
  if (proposal.status !== "aprovada")
    return invalid("proposal.status", "A proposta precisa estar aprovada.");
  const definition = policyLevelRulesFromContent(
    content,
    proposal.policyDefinitionId,
  );
  if (!definition.ok) return definition;
  const { rules } = definition.value;
  const index = game.policies.findIndex(
    (state) => state.policyDefinitionId === proposal.policyDefinitionId,
  );
  const inForce = policyInForce(game.policies, proposal.policyDefinitionId);
  if (index >= 0 && inForce) {
    const changed = changePolicyTarget(
      game.policies[index],
      proposal.desiredLevel,
      proposal.decidedAtTurn!,
      rules,
    );
    if (!changed.ok) return invalid("policy", changed.error.message);
    const policies = [...game.policies];
    policies[index] = changed.value;
    // SG138: filhas que dependiam desta lei caem para a base
    const falls = applyRequirementFalls(
      content,
      policies,
      proposal.decidedAtTurn!,
    );
    return { ok: true, value: { ...game, policies: falls.policies } };
  }
  // lei do catálogo (D-65), ou revogada antes: volta a valer, e a
  // implantação parte do que restou dela
  const previous = index >= 0 ? game.policies[index] : undefined;
  const created = createPolicyStateFromApproval(
    previous?.id ?? `${game.id}:policy:${proposal.policyDefinitionId}`,
    proposal,
    rules,
    previous?.implementedLevel ?? 0,
  );
  if (!created.ok) return invalid("policy", created.error.message);
  const policies = [...game.policies];
  if (index >= 0) policies[index] = created.value;
  else policies.push(created.value);
  return { ok: true, value: { ...game, policies } };
}
