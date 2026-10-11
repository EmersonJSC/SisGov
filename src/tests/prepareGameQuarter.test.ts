import { expect, it } from "vitest";
import { createGame } from "../game/createGame";
import { policyLevelRulesFromContent } from "../game/policyRulesFromContent";
import { commitGameQuarter } from "../game/commitGameQuarter";
import { prepareGameQuarter } from "../game/prepareGameQuarter";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

it("prepara e confirma os três meses do turno sem livro fiscal à parte (SG105)", () => {
  const loaded = loadDistributedScenario("testes/legado/brasil/pais.json");
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const content = loaded.value.definition;
  const game = createGame("partida-integrada", content, loaded.value.graph);
  if (!game.ok) throw new Error(game.diagnostics[0]?.message);
  const prepared = prepareGameQuarter(content, loaded.value.graph, game.value, [
    game.value.policies,
    game.value.policies,
    game.value.policies,
  ]);
  expect(prepared).toMatchObject({ ok: true });
  if (!prepared.ok) return;
  expect(prepared.value.execution.step).toBe(3);
  expect(prepared.value.months).toHaveLength(3);
  expect(game.value.execution.step).toBe(0);
  expect(game.value.currentTurn).toBe(0);

  const committed = commitGameQuarter(game.value, prepared.value);
  expect(committed.currentTurn).toBe(1);
  expect(committed.execution.step).toBe(3);
  expect("fiscal" in committed).toBe(false);
  expect(game.value.execution.step).toBe(0);
});

it("SG136: limite da lei em % do PIB vira valor com o PIB do país", () => {
  const loaded = loadDistributedScenario("testes/legado/brasil/pais.json");
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const content = structuredClone(loaded.value.definition);
  delete content.initialState.limitesProprios;
  // Atenção básica: até 1% do PIB (12.000.000) = 120.000.
  expect(policyLevelRulesFromContent(content, "atencao-basica")).toMatchObject({
    ok: true,
    value: { rules: { domain: { minimum: 0, maximum: 120000 } } },
  });
  // Com o limite próprio do Brasil, vale o mais apertado (2.400 a 6.000).
  expect(
    policyLevelRulesFromContent(loaded.value.definition, "atencao-basica"),
  ).toMatchObject({
    ok: true,
    value: { rules: { domain: { minimum: 2400, maximum: 6000 } } },
  });
});
