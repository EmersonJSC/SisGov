import type { ContentDiagnostic, ValidationResult } from "../engine";
import type { GameState } from "./createGame";
import type { NationalElectionResult } from "./elections";

export type PresidentialElectionCommit = Readonly<{
  electionId: string;
  turn: number;
  playerCandidateId: string;
  result: NationalElectionResult;
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

/** Commits only a result prepared from the current random snapshot. */
export function commitPresidentialElection(
  game: GameState,
  input: PresidentialElectionCommit,
): ValidationResult<GameState> {
  if (
    !input.electionId.trim() ||
    !Number.isSafeInteger(input.turn) ||
    input.turn < game.currentTurn
  )
    return invalid(
      "election",
      "A identidade ou o turno da eleição é inválido.",
    );
  if (
    game.elections.some((election) => election.electionId === input.electionId)
  )
    return invalid("election.id", "Esta eleição já foi confirmada.");
  if (input.result.sourceRandom) {
    if (!game.random)
      return invalid(
        "random",
        "A partida não possui estado aleatório para confirmar o desempate.",
      );
    if (
      game.random.algorithm !== input.result.sourceRandom.algorithm ||
      game.random.seed !== input.result.sourceRandom.seed ||
      game.random.state !== input.result.sourceRandom.state
    )
      return invalid(
        "random.state",
        "O desempate não foi preparado a partir do estado aleatório atual.",
      );
  }
  const status =
    input.result.winnerId === input.playerCandidateId
      ? "novo_mandato"
      : "derrota";
  return {
    ok: true,
    value: {
      ...game,
      random: input.result.random ?? game.random,
      elections: [
        ...game.elections,
        {
          electionId: input.electionId,
          turn: input.turn,
          winnerId: input.result.winnerId,
          status,
          tieRolls: [...input.result.tieRolls],
        },
      ],
      gameStatus: status === "derrota" ? "encerrada" : "ativa",
    },
  };
}
