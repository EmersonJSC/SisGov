import type { ContentDiagnostic, ValidationResult } from "../engine";
import { approveProposal, rejectProposal, type Proposal } from "../domain/game";
import type { GameState } from "./createGame";
import type { StatefulParliamentaryVoteSampling } from "./sampleParliamentaryVotes";

export type ParliamentaryVoteInput = Readonly<{
  proposal: Proposal;
  turn: number;
  seats: number;
  votesFor: number;
  votesAgainst: number;
  requiredVotes: number;
}>;

export type ParliamentaryVoteResult = Readonly<{
  proposal: Proposal;
  approved: boolean;
  seats: number;
  votesFor: number;
  votesAgainst: number;
  abstentions: number;
  requiredVotes: number;
}>;

function invalid(field: string, message: string): ValidationResult<never> {
  const diagnostic: ContentDiagnostic = {
    code: "COMANDO_INVALIDO",
    file: "$partida",
    field,
    message,
  };
  return { ok: false, diagnostics: [diagnostic] };
}

/** Decides an already-open vote from counted votes; it does not generate chance. */
export function resolveParliamentaryVote(
  input: ParliamentaryVoteInput,
): ValidationResult<ParliamentaryVoteResult> {
  const values = [
    ["seats", input.seats],
    ["votesFor", input.votesFor],
    ["votesAgainst", input.votesAgainst],
    ["requiredVotes", input.requiredVotes],
  ] as const;
  for (const [field, value] of values) {
    if (!Number.isSafeInteger(value) || value < 0)
      return invalid(
        `vote.${field}`,
        "A contagem precisa ser um inteiro não negativo.",
      );
  }
  if (input.seats === 0)
    return invalid("vote.seats", "A votação exige cadeiras ativas.");
  if (input.votesFor + input.votesAgainst > input.seats)
    return invalid(
      "vote.votes",
      "Os votos não podem exceder as cadeiras ativas.",
    );
  if (input.requiredVotes > input.seats || input.requiredVotes === 0)
    return invalid(
      "vote.requiredVotes",
      "O quórum precisa estar entre uma e todas as cadeiras.",
    );
  if (input.proposal.status !== "em_votacao")
    return invalid("proposal.status", "A proposta precisa estar em votação.");

  const approved = input.votesFor >= input.requiredVotes;
  const decided = approved
    ? approveProposal(input.proposal, input.turn)
    : rejectProposal(input.proposal, input.turn);
  if (!decided.ok) return invalid("proposal", decided.error.message);
  return {
    ok: true,
    value: {
      proposal: decided.value,
      approved,
      seats: input.seats,
      votesFor: input.votesFor,
      votesAgainst: input.votesAgainst,
      abstentions: input.seats - input.votesFor - input.votesAgainst,
      requiredVotes: input.requiredVotes,
    },
  };
}

/** Replaces only the voted proposal in a new game snapshot. */
export function commitParliamentaryVote(
  game: GameState,
  result: ParliamentaryVoteResult,
  sampling?: StatefulParliamentaryVoteSampling,
): ValidationResult<GameState> {
  const index = game.proposals.findIndex(
    (proposal) => proposal.id === result.proposal.id,
  );
  if (index < 0)
    return invalid(
      "proposal.id",
      `Proposta inexistente: ${result.proposal.id}.`,
    );
  if (game.proposals[index].status !== "em_votacao")
    return invalid(
      "proposal.status",
      "A proposta da partida não está mais em votação.",
    );
  let random = game.random;
  if (sampling) {
    if (!game.random)
      return invalid(
        "random",
        "A partida não possui estado aleatório para confirmar a amostra.",
      );
    if (
      game.random.algorithm !== sampling.sourceState.algorithm ||
      game.random.seed !== sampling.sourceState.seed ||
      game.random.state !== sampling.sourceState.state
    )
      return invalid(
        "random.state",
        "A amostra não foi produzida pelo estado aleatório atual.",
      );
    if (
      result.votesFor !== sampling.sampling.votesFor ||
      result.votesAgainst !== sampling.sampling.votesAgainst
    )
      return invalid(
        "vote.randomDraws",
        "A decisão não corresponde à amostra de votos preparada.",
      );
    random = sampling.state;
  }
  const proposals = [...game.proposals];
  proposals[index] = result.proposal;
  return { ok: true, value: { ...game, proposals, random } };
}
