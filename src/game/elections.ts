import type { ContentDiagnostic, ValidationResult } from "../engine";
import { drawRandomValues, type RandomState } from "./randomState";

export type ElectionCandidate = Readonly<{ id: string; votes: number }>;
export type NationalElectionResult = Readonly<{
  winnerId: string;
  tiedCandidateIds: readonly string[];
  tieRolls: readonly number[];
  sourceRandom?: RandomState;
  random?: RandomState;
}>;
export type TerritorialElectionResult = Readonly<{
  electedPartyIds: readonly string[];
  tieRolls: readonly number[];
  random?: RandomState;
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

function validateCandidates(
  candidates: readonly ElectionCandidate[],
): ValidationResult<readonly ElectionCandidate[]> {
  if (candidates.length < 2)
    return invalid("candidates", "A eleição exige ao menos duas candidaturas.");
  const ids = new Set<string>();
  for (const [index, candidate] of candidates.entries()) {
    if (!candidate.id.trim() || ids.has(candidate.id))
      return invalid(
        `candidates.${index}.id`,
        "A candidatura precisa ter ID único.",
      );
    if (!Number.isFinite(candidate.votes) || candidate.votes < 0)
      return invalid(
        `candidates.${index}.votes`,
        "A votação precisa ser finita e não negativa.",
      );
    ids.add(candidate.id);
  }
  if (candidates.every((candidate) => candidate.votes === 0))
    return invalid("candidates", "A eleição exige ao menos um voto.");
  return { ok: true, value: candidates };
}

/** Draws d20 only for an actual electoral tie, repeating only when d20 also ties. */
function breakTie(
  candidates: readonly ElectionCandidate[],
  state: RandomState,
): ValidationResult<
  Readonly<{ winnerId: string; rolls: readonly number[]; state: RandomState }>
> {
  let contenders = [...candidates];
  let current = state;
  const rolls: number[] = [];
  while (contenders.length > 1) {
    const draw = drawRandomValues(current, contenders.length);
    if (!draw.ok) return draw;
    const round = draw.value.values.map((value) => Math.floor(value * 20) + 1);
    rolls.push(...round);
    const highest = Math.max(...round);
    contenders = contenders.filter((_, index) => round[index] === highest);
    current = draw.value.state;
  }
  return {
    ok: true,
    value: { winnerId: contenders[0].id, rolls, state: current },
  };
}

/** Implements the constitutional `pluralidade_nacional` mechanism. */
export function resolveNationalPlurality(
  candidates: readonly ElectionCandidate[],
  random?: RandomState,
): ValidationResult<NationalElectionResult> {
  const validated = validateCandidates(candidates);
  if (!validated.ok) return validated;
  const highest = Math.max(...candidates.map((candidate) => candidate.votes));
  const tied = candidates.filter((candidate) => candidate.votes === highest);
  if (tied.length === 1)
    return {
      ok: true,
      value: { winnerId: tied[0].id, tiedCandidateIds: [], tieRolls: [] },
    };
  if (!random)
    return invalid(
      "random",
      "Empate eleitoral exige estado aleatório para o d20.",
    );
  const resolved = breakTie(tied, random);
  if (!resolved.ok) return resolved;
  return {
    ok: true,
    value: {
      winnerId: resolved.value.winnerId,
      tiedCandidateIds: tied.map((candidate) => candidate.id),
      tieRolls: resolved.value.rolls,
      sourceRandom: random,
      random: resolved.value.state,
    },
  };
}

/** Implements D'Hondt's sequential highest-quotient allocation for one territory. */
export function resolveHighestQuotientsByUnit(
  parties: readonly ElectionCandidate[],
  seats: number,
  random?: RandomState,
): ValidationResult<TerritorialElectionResult> {
  const validated = validateCandidates(parties);
  if (!validated.ok) return validated;
  if (!Number.isSafeInteger(seats) || seats <= 0)
    return invalid("seats", "A unidade precisa ter vagas inteiras positivas.");
  const elected: string[] = [];
  const won: Record<string, number> = Object.fromEntries(
    parties.map((party) => [party.id, 0]),
  );
  const tieRolls: number[] = [];
  let current = random;
  for (let seat = 0; seat < seats; seat += 1) {
    const quotients = parties.map((party) => ({
      id: party.id,
      votes: party.votes / (won[party.id] + 1),
    }));
    const highest = Math.max(...quotients.map((party) => party.votes));
    const tied = quotients.filter((party) => party.votes === highest);
    let winnerId: string;
    if (tied.length === 1) winnerId = tied[0].id;
    else {
      if (!current)
        return invalid(
          "random",
          "Empate eleitoral exige estado aleatório para o d20.",
        );
      const resolved = breakTie(tied, current);
      if (!resolved.ok) return resolved;
      winnerId = resolved.value.winnerId;
      tieRolls.push(...resolved.value.rolls);
      current = resolved.value.state;
    }
    elected.push(winnerId);
    won[winnerId] += 1;
  }
  return {
    ok: true,
    value: { electedPartyIds: elected, tieRolls, random: current },
  };
}
