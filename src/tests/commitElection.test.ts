import { expect, it } from "vitest";
import { commitPresidentialElection } from "../game/commitElection";
import { createGame } from "../game/createGame";
import { resolveNationalPlurality } from "../game/elections";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

it("confirma vitória sem reiniciar o país e encerra somente ao perder", () => {
  const loaded = loadDistributedScenario("testes/legado/brasil/pais.json");
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const created = createGame(
    "eleicao",
    loaded.value.definition,
    loaded.value.graph,
    { randomSeed: 9 },
  );
  if (!created.ok) throw new Error(created.diagnostics[0]?.message);
  const victory = resolveNationalPlurality([
    { id: "jogador", votes: 51 },
    { id: "outro", votes: 49 },
  ]);
  if (!victory.ok) throw new Error(victory.diagnostics[0]?.message);
  const won = commitPresidentialElection(created.value, {
    electionId: "presidencial-1",
    turn: 1,
    playerCandidateId: "jogador",
    result: victory.value,
  });
  expect(won).toMatchObject({
    ok: true,
    value: {
      gameStatus: "ativa",
      elections: [{ status: "novo_mandato" }],
    },
  });
  const defeat = resolveNationalPlurality([
    { id: "jogador", votes: 49 },
    { id: "outro", votes: 51 },
  ]);
  if (!defeat.ok) throw new Error(defeat.diagnostics[0]?.message);
  if (!won.ok) throw new Error(won.diagnostics[0]?.message);
  expect(
    commitPresidentialElection(won.value, {
      electionId: "presidencial-2",
      turn: 2,
      playerCandidateId: "jogador",
      result: defeat.value,
    }),
  ).toMatchObject({
    ok: true,
    value: {
      gameStatus: "encerrada",
      elections: [{ status: "novo_mandato" }, { status: "derrota" }],
    },
  });
});

it("recusa confirmar um d20 preparado de uma semente diferente", () => {
  const loaded = loadDistributedScenario("testes/legado/brasil/pais.json");
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const created = createGame(
    "eleicao",
    loaded.value.definition,
    loaded.value.graph,
    { randomSeed: 9 },
  );
  if (!created.ok) throw new Error(created.diagnostics[0]?.message);
  const other = createGame(
    "outra",
    loaded.value.definition,
    loaded.value.graph,
    { randomSeed: 10 },
  );
  if (!other.ok || !other.value.random)
    throw new Error("aleatoriedade ausente");
  const tie = resolveNationalPlurality(
    [
      { id: "jogador", votes: 50 },
      { id: "outro", votes: 50 },
    ],
    other.value.random,
  );
  if (!tie.ok) throw new Error(tie.diagnostics[0]?.message);
  expect(
    commitPresidentialElection(created.value, {
      electionId: "presidencial",
      turn: 1,
      playerCandidateId: "jogador",
      result: tie.value,
    }),
  ).toMatchObject({ ok: false, diagnostics: [{ field: "random.state" }] });
});
