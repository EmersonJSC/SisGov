import { expect, it } from "vitest";
import {
  calculateVoteProbability,
  sampleParliamentaryVotes,
  sampleParliamentaryVotesFromState,
} from "../game/sampleParliamentaryVotes";
import { createRandomState } from "../game/randomState";

it("combina apoio base, afinidade e opinião com pesos do cenário", () => {
  const result = calculateVoteProbability(
    { base: 0.8, affinity: 0.6, publicOpinion: 0.4 },
    { base: 0.5, affinity: 0.3, publicOpinion: 0.2 },
  );
  expect(result).toMatchObject({ ok: true });
  if (result.ok) expect(result.value).toBeCloseTo(0.66);
});

it("usa um sorteio controlado por cadeira sem esconder estado aleatório", () => {
  const result = sampleParliamentaryVotes([0.8, 0.4, 0.2], [0.1, 0.5, 0.1]);
  expect(result).toEqual({
    ok: true,
    value: {
      probabilities: [0.8, 0.4, 0.2],
      randomDraws: [0.1, 0.5, 0.1],
      votesFor: 2,
      votesAgainst: 1,
    },
  });
});

it("recusa sorteio ausente ou componente fora da escala", () => {
  expect(sampleParliamentaryVotes([0.5], [])).toMatchObject({
    ok: false,
    diagnostics: [{ field: "vote.randomDraws" }],
  });
  expect(
    calculateVoteProbability(
      { base: 1.1, affinity: 0, publicOpinion: 0 },
      { base: 1, affinity: 0, publicOpinion: 0 },
    ),
  ).toMatchObject({ ok: false, diagnostics: [{ field: "support.base" }] });
});

it("consome um sorteio por cadeira e devolve o estado para o próximo voto", () => {
  const created = createRandomState(123);
  if (!created.ok) throw new Error("Semente deveria ser válida.");
  const first = sampleParliamentaryVotesFromState([0.5, 0.5], created.value);
  if (!first.ok) throw new Error(first.diagnostics[0]?.message);
  const second = sampleParliamentaryVotesFromState([0.5], first.value.state);
  if (!second.ok) throw new Error(second.diagnostics[0]?.message);

  expect(first.value.sampling.randomDraws).toHaveLength(2);
  expect(second.value.sampling.randomDraws).toHaveLength(1);
  expect(first.value.state.state).not.toBe(created.value.state);
  expect(second.value.state.state).not.toBe(first.value.state.state);
});
