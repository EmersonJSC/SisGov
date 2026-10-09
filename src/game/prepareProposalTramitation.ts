import type { ContentDiagnostic, ValidationResult } from "../engine";
import {
  openProposalVote,
  presentProposal,
  type Proposal,
  type ProposalTimingRules,
} from "../domain/game";

export const defaultProposalTiming: ProposalTimingRules = {
  normalWaitTurns: 1,
  maximumWaitTurns: 2,
};

function invalid(field: string, message: string): ValidationResult<never> {
  const diagnostic: ContentDiagnostic = {
    code: "COMANDO_INVALIDO",
    file: "$partida",
    field,
    message,
  };
  return { ok: false, diagnostics: [diagnostic] };
}

/** Advances only the mechanical part of proposal scheduling for one turn. */
export function prepareProposalTramitation(
  proposals: readonly Proposal[],
  turn: number,
  timing: ProposalTimingRules = defaultProposalTiming,
): ValidationResult<readonly Proposal[]> {
  const next: Proposal[] = [];
  for (const [index, proposal] of proposals.entries()) {
    const field = `proposals.${index}`;
    if (proposal.status === "rascunho") {
      const presented = presentProposal(proposal, turn, timing);
      if (!presented.ok) return invalid(field, presented.error.message);
      next.push(presented.value);
      continue;
    }
    if (proposal.status === "apresentada") {
      if (proposal.voteDueTurn !== undefined && proposal.voteDueTurn < turn)
        return invalid(
          field,
          `A proposta ${proposal.id} passou do prazo de votação.`,
        );
      if (proposal.voteDueTurn === turn) {
        const voting = openProposalVote(proposal, turn);
        if (!voting.ok) return invalid(field, voting.error.message);
        next.push(voting.value);
        continue;
      }
    }
    next.push(proposal);
  }
  return { ok: true, value: next };
}
