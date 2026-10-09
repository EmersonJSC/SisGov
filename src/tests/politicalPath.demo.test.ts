// DEMONSTRAÇÃO COM VALORES FORÇADOS — NÃO É TESTE DE ACEITE.
// Força sorteios = 1, implantação manual e jogador = vencedor (PLANO.md, C2).
// Será substituído pelos roteiros reais do SG119 e então apagado.
import { expect, it } from "vitest";
import { createProposal } from "../domain/game";
import { commitApprovedProposal } from "../game/commitApprovedProposal";
import {
  commitParliamentaryVote,
  resolveParliamentaryVote,
} from "../game/resolveParliamentaryVote";
import { resolveNationalPlurality } from "../game/elections";
import { commitPresidentialElection } from "../game/commitElection";
import { createGame } from "../game/createGame";
import { policyLevelRulesFromContent } from "../game/policyRulesFromContent";
import { prepareProposalTramitation } from "../game/prepareProposalTramitation";
import { refreshPoliticalSupportForGame } from "../game/refreshPoliticalSupport";
import { sampleParliamentaryVotesFromState } from "../game/sampleParliamentaryVotes";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

function setup() {
  const loaded = loadDistributedScenario("paises/brasil/pais.json");
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const created = createGame(
    "percurso",
    loaded.value.definition,
    loaded.value.graph,
    { randomSeed: 77 },
  );
  if (!created.ok || !created.value.random)
    throw new Error("partida aleatória indisponível");
  const policy = loaded.value.definition.policies.find(
    (item) => item.id === "atencao-basica",
  );
  if (!policy) throw new Error("política ausente");
  const definition = policyLevelRulesFromContent(
    loaded.value.definition,
    policy.id,
  );
  if (!definition.ok) throw new Error(definition.diagnostics[0]?.message);
  const { rules } = definition.value;
  const proposal = createProposal(
    {
      id: "aps-aumentar",
      policyDefinitionId: policy.id,
      desiredLevel: 5000,
      createdAtTurn: 0,
    },
    rules,
    created.value.proposals,
  );
  if (!proposal.ok) throw new Error(proposal.error.message);
  const presented = prepareProposalTramitation([proposal.value], 0);
  if (!presented.ok) throw new Error(presented.diagnostics[0]?.message);
  const voting = prepareProposalTramitation(presented.value, 1);
  if (!voting.ok) throw new Error(voting.diagnostics[0]?.message);
  return {
    loaded: loaded.value,
    game: { ...created.value, currentTurn: 1, proposals: voting.value },
    rules,
  };
}

it("percurso: uma medida popular pode ser rejeitada pela bancada", () => {
  const { game } = setup();
  const result = resolveParliamentaryVote({
    proposal: game.proposals[0],
    turn: 1,
    seats: 81,
    votesFor: 40,
    votesAgainst: 41,
    requiredVotes: 41,
  });
  if (!result.ok) throw new Error(result.diagnostics[0]?.message);
  const committed = commitParliamentaryVote(game, result.value);
  expect(committed).toMatchObject({
    ok: true,
    value: { proposals: [expect.objectContaining({ status: "rejeitada" })] },
  });
  if (!committed.ok) return;
  expect(
    committed.value.policies.find(
      (item) => item.policyDefinitionId === "atencao-basica",
    )?.desiredLevel,
  ).toBe(4000);
});

it("percurso: uma medida impopular pode passar, reagir e decidir a eleição", () => {
  const { loaded, game } = setup();
  const sample = sampleParliamentaryVotesFromState(
    Array.from({ length: 81 }, () => 1),
    game.random!,
  );
  if (!sample.ok) throw new Error(sample.diagnostics[0]?.message);
  const result = resolveParliamentaryVote({
    proposal: game.proposals[0],
    turn: 1,
    seats: 81,
    votesFor: sample.value.sampling.votesFor,
    votesAgainst: sample.value.sampling.votesAgainst,
    requiredVotes: 41,
  });
  if (!result.ok) throw new Error(result.diagnostics[0]?.message);
  const voted = commitParliamentaryVote(game, result.value, sample.value);
  if (!voted.ok) throw new Error(voted.diagnostics[0]?.message);
  const authorized = commitApprovedProposal(
    voted.value,
    loaded.definition,
    "aps-aumentar",
  );
  if (!authorized.ok) throw new Error(authorized.diagnostics[0]?.message);
  const implemented = {
    ...authorized.value,
    policies: authorized.value.policies.map((state) =>
      state.policyDefinitionId === "atencao-basica"
        ? { ...state, implementedLevel: 5000 }
        : state,
    ),
  };
  const reacted = refreshPoliticalSupportForGame(
    loaded.definition,
    implemented,
  );
  if (!reacted.ok || !reacted.value.political)
    throw new Error("reação ausente");
  const election = resolveNationalPlurality(
    Object.entries(reacted.value.political.partySupport).map(([id, votes]) => ({
      id,
      votes,
    })),
  );
  if (!election.ok) throw new Error(election.diagnostics[0]?.message);
  const closed = commitPresidentialElection(reacted.value, {
    electionId: "presidencial-teste",
    turn: 1,
    playerCandidateId: election.value.winnerId,
    result: election.value,
  });
  expect(closed).toMatchObject({
    ok: true,
    value: {
      gameStatus: "ativa",
      elections: [expect.objectContaining({ status: "novo_mandato" })],
      political: {
        contributionsByRelation: expect.objectContaining({
          "aps-trabalhadores": expect.any(Number),
        }),
      },
    },
  });
});
