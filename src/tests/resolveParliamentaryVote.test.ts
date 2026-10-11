import { expect, it } from "vitest";
import {
  createProposal,
  openProposalVote,
  presentProposal,
  type PolicyLevelRules,
} from "../domain/game";
import { resolveParliamentaryVote } from "../game/resolveParliamentaryVote";
import { commitParliamentaryVote } from "../game/resolveParliamentaryVote";
import { sampleParliamentaryVotesFromState } from "../game/sampleParliamentaryVotes";
import { createGame } from "../game/createGame";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

const rules: PolicyLevelRules = {
  policyDefinitionId: "politica-teste",
  unit: "unidade",
  domain: { minimum: 0, maximum: 100 },
};

function votingProposal() {
  const created = createProposal(
    {
      id: "proposta-voto",
      policyDefinitionId: "politica-teste",
      desiredLevel: 50,
      createdAtTurn: 0,
    },
    rules,
  );
  if (!created.ok) throw new Error(created.error.message);
  const presented = presentProposal(created.value, 0, {
    normalWaitTurns: 1,
    maximumWaitTurns: 2,
  });
  if (!presented.ok) throw new Error(presented.error.message);
  const voting = openProposalVote(presented.value, 1);
  if (!voting.ok) throw new Error(voting.error.message);
  return voting.value;
}

it("aprova quando os votos atingem o quórum recebido", () => {
  const result = resolveParliamentaryVote({
    proposal: votingProposal(),
    turn: 1,
    seats: 10,
    votesFor: 6,
    votesAgainst: 3,
    requiredVotes: 6,
  });
  expect(result).toMatchObject({
    ok: true,
    value: { approved: true, abstentions: 1, proposal: { status: "aprovada" } },
  });
});

it("rejeita quando os votos ficam abaixo do quórum", () => {
  const result = resolveParliamentaryVote({
    proposal: votingProposal(),
    turn: 1,
    seats: 10,
    votesFor: 5,
    votesAgainst: 5,
    requiredVotes: 6,
  });
  expect(result).toMatchObject({
    ok: true,
    value: { approved: false, proposal: { status: "rejeitada" } },
  });
});

it("recusa contagem impossível ou proposta fora de votação", () => {
  expect(
    resolveParliamentaryVote({
      proposal: votingProposal(),
      turn: 1,
      seats: 10,
      votesFor: 9,
      votesAgainst: 2,
      requiredVotes: 6,
    }),
  ).toMatchObject({ ok: false, diagnostics: [{ field: "vote.votes" }] });
  const proposal = votingProposal();
  expect(
    resolveParliamentaryVote({
      proposal: { ...proposal, status: "apresentada" },
      turn: 1,
      seats: 10,
      votesFor: 6,
      votesAgainst: 0,
      requiredVotes: 6,
    }),
  ).toMatchObject({ ok: false, diagnostics: [{ field: "proposal.status" }] });
});

it("aplica a decisão em um novo snapshot da partida", () => {
  const loaded = loadDistributedScenario("testes/legado/brasil/pais.json");
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const content = structuredClone(loaded.value.definition);
  const game = createGame("partida-voto", content, loaded.value.graph);
  if (!game.ok) throw new Error(game.diagnostics[0]?.message);
  const proposal = votingProposal();
  const withProposal = { ...game.value, proposals: [proposal] };
  const result = resolveParliamentaryVote({
    proposal,
    turn: 1,
    seats: 10,
    votesFor: 6,
    votesAgainst: 4,
    requiredVotes: 6,
  });
  if (!result.ok) throw new Error(result.diagnostics[0]?.message);
  const committed = commitParliamentaryVote(withProposal, result.value);
  expect(committed).toMatchObject({
    ok: true,
    value: { proposals: [{ status: "aprovada" }] },
  });
  expect(withProposal.proposals[0].status).toBe("em_votacao");
});

it("confirma a decisão e o avanço do sorteio no mesmo snapshot", () => {
  const loaded = loadDistributedScenario("testes/legado/brasil/pais.json");
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const game = createGame(
    "partida-voto-aleatorio",
    loaded.value.definition,
    loaded.value.graph,
    {
      randomSeed: 123,
    },
  );
  if (!game.ok || !game.value.random)
    throw new Error("Partida aleatória deveria ser criada.");
  const proposal = votingProposal();
  const withProposal = { ...game.value, proposals: [proposal] };
  const sampling = sampleParliamentaryVotesFromState(
    [1, 0, 1],
    game.value.random,
  );
  if (!sampling.ok) throw new Error(sampling.diagnostics[0]?.message);
  const result = resolveParliamentaryVote({
    proposal,
    turn: 1,
    seats: 3,
    votesFor: sampling.value.sampling.votesFor,
    votesAgainst: sampling.value.sampling.votesAgainst,
    requiredVotes: 2,
  });
  if (!result.ok) throw new Error(result.diagnostics[0]?.message);
  const committed = commitParliamentaryVote(
    withProposal,
    result.value,
    sampling.value,
  );
  expect(committed).toMatchObject({
    ok: true,
    value: { proposals: [{ status: "aprovada" }] },
  });
  if (committed.ok)
    expect(committed.value.random).toEqual(sampling.value.state);
  expect(withProposal.random).toEqual(game.value.random);
});
