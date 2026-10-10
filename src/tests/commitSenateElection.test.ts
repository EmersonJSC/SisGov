import { expect, it } from "vitest";
import { commitSenateElection } from "../game/commitSenateElection";
import { createGame } from "../game/createGame";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

it("substitui apenas as cadeiras vencidas e preserva o total", () => {
  const loaded = loadDistributedScenario("testes/legado/brasil/pais.json");
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const game = createGame(
    "senado",
    loaded.value.definition,
    loaded.value.graph,
  );
  if (!game.ok) throw new Error(game.diagnostics[0]?.message);
  const result = commitSenateElection(game.value, {
    outgoingPartyIds: ["partido-civico", "partido-social"],
    electedPartyIds: ["partido-liberal", "partido-liberal"],
  });
  expect(result).toMatchObject({
    ok: true,
    value: {
      political: {
        senateSeatsByParty: {
          "partido-civico": 32,
          "partido-social": 26,
          "partido-liberal": 23,
        },
      },
    },
  });
});
