import type { ContentDiagnostic, ValidationResult } from "../engine";
import { drawRandomValues, type RandomState } from "./randomState";

export type VoteSupportComponents = Readonly<{
  base: number;
  affinity: number;
  publicOpinion: number;
}>;

export type VoteSupportWeights = Readonly<{
  base: number;
  affinity: number;
  publicOpinion: number;
}>;

export type ParliamentaryVoteSampling = Readonly<{
  probabilities: readonly number[];
  randomDraws: readonly number[];
  votesFor: number;
  votesAgainst: number;
}>;

export type StatefulParliamentaryVoteSampling = Readonly<{
  sourceState: RandomState;
  state: RandomState;
  sampling: ParliamentaryVoteSampling;
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

function unitInterval(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}

/** Combines scenario-provided support components without embedding their weights. */
export function calculateVoteProbability(
  components: VoteSupportComponents,
  weights: VoteSupportWeights,
): ValidationResult<number> {
  for (const [field, value] of Object.entries(components))
    if (!unitInterval(value))
      return invalid(`support.${field}`, "Use um valor entre 0 e 1.");
  for (const [field, value] of Object.entries(weights))
    if (!Number.isFinite(value) || value < 0)
      return invalid(
        `weights.${field}`,
        "O peso deve ser finito e não negativo.",
      );
  const totalWeight = weights.base + weights.affinity + weights.publicOpinion;
  if (totalWeight <= 0)
    return invalid("weights", "A soma dos pesos deve ser maior que zero.");
  return {
    ok: true,
    value:
      (components.base * weights.base +
        components.affinity * weights.affinity +
        components.publicOpinion * weights.publicOpinion) /
      totalWeight,
  };
}

/** Samples one supplied random draw per seat; the partida owns the draw source. */
export function sampleParliamentaryVotes(
  probabilities: readonly number[],
  randomDraws: readonly number[],
): ValidationResult<ParliamentaryVoteSampling> {
  if (probabilities.length === 0)
    return invalid(
      "vote.probabilities",
      "A votação exige pelo menos uma cadeira.",
    );
  if (probabilities.length !== randomDraws.length)
    return invalid(
      "vote.randomDraws",
      "É preciso um sorteio para cada cadeira.",
    );
  for (const [index, probability] of probabilities.entries())
    if (!unitInterval(probability))
      return invalid(
        `vote.probabilities.${index}`,
        "A probabilidade deve estar entre 0 e 1.",
      );
  for (const [index, draw] of randomDraws.entries())
    if (!unitInterval(draw))
      return invalid(
        `vote.randomDraws.${index}`,
        "O sorteio deve estar entre 0 e 1.",
      );
  const votesFor = probabilities.reduce(
    (count, probability, index) =>
      count + (randomDraws[index] < probability ? 1 : 0),
    0,
  );
  return {
    ok: true,
    value: {
      probabilities: [...probabilities],
      randomDraws: [...randomDraws],
      votesFor,
      votesAgainst: probabilities.length - votesFor,
    },
  };
}

/**
 * Consumes exactly one persistent pseudo-random draw per parliamentary seat.
 * The returned state is the only state that may be committed to the partida.
 */
export function sampleParliamentaryVotesFromState(
  probabilities: readonly number[],
  state: RandomState,
): ValidationResult<StatefulParliamentaryVoteSampling> {
  const draws = drawRandomValues(state, probabilities.length);
  if (!draws.ok) return draws;
  const sampling = sampleParliamentaryVotes(probabilities, draws.value.values);
  if (!sampling.ok) return sampling;
  return {
    ok: true,
    value: {
      sourceState: state,
      state: draws.value.state,
      sampling: sampling.value,
    },
  };
}
