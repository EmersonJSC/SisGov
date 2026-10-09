import type { ContentDiagnostic, ValidationResult } from "../engine";
import type { GameState } from "./createGame";

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

/** Replaces exactly the expired territorial seats; all other mandates remain. */
export function commitSenateElection(
  game: GameState,
  input: Readonly<{
    outgoingPartyIds: readonly string[];
    electedPartyIds: readonly string[];
  }>,
): ValidationResult<GameState> {
  if (!game.political)
    return invalid("political", "A partida não declara composição política.");
  if (
    input.outgoingPartyIds.length === 0 ||
    input.outgoingPartyIds.length !== input.electedPartyIds.length
  )
    return invalid(
      "seats",
      "A eleição exige a mesma quantidade não vazia de saídas e eleitos.",
    );
  const seats = { ...game.political.senateSeatsByParty };
  for (const partyId of [...input.outgoingPartyIds, ...input.electedPartyIds])
    if (!(partyId in seats))
      return invalid("seats.partyId", `Partido inexistente: ${partyId}.`);
  for (const partyId of input.outgoingPartyIds) {
    if (seats[partyId] <= 0)
      return invalid(
        "seats.outgoing",
        `Não há cadeira vigente de ${partyId} para vencer.`,
      );
    seats[partyId] -= 1;
  }
  for (const partyId of input.electedPartyIds) seats[partyId] += 1;
  return {
    ok: true,
    value: {
      ...game,
      political: { ...game.political, senateSeatsByParty: seats },
    },
  };
}
