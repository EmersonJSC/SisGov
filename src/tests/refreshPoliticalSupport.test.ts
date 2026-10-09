import { expect, it } from "vitest";
import { createGame } from "../game/createGame";
import { refreshPoliticalSupportForGame } from "../game/refreshPoliticalSupport";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

it("deriva relações políticas e de indicador do JSON sem acumulá-las", () => {
  const loaded = loadDistributedScenario("paises/brasil/pais.json");
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const created = createGame(
    "apoio",
    loaded.value.definition,
    loaded.value.graph,
  );
  if (!created.ok) throw new Error(created.diagnostics[0]?.message);
  const once = refreshPoliticalSupportForGame(
    loaded.value.definition,
    created.value,
  );
  if (!once.ok) throw new Error(once.diagnostics[0]?.message);
  const twice = refreshPoliticalSupportForGame(
    loaded.value.definition,
    once.value,
  );
  expect(once.value.political?.contributionsByRelation).toEqual(
    twice.ok ? twice.value.political?.contributionsByRelation : undefined,
  );
  expect(once.value.political?.partySupport).toEqual(
    twice.ok ? twice.value.political?.partySupport : undefined,
  );
  expect(once.value.political?.contributionsByRelation).toMatchObject({
    "aps-trabalhadores": expect.any(Number),
    "frequencia-jovens": expect.any(Number),
  });
});
