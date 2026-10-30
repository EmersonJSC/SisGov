import { expect, it } from "vitest";
import { MESES_POR_TURNO } from "../game/calendario";
import { createGame } from "../game/createGame";
import { policyLevelRulesFromContent } from "../game/policyRulesFromContent";
import { commitGameQuarter } from "../game/commitGameQuarter";
import { prepareGameQuarter } from "../game/prepareGameQuarter";
import { loadDistributedScenario } from "../game/pais/loadScenarioPackage";

it("prepara e confirma os meses do turno sem livro fiscal à parte (SG105)", () => {
  const loaded = loadDistributedScenario("testes/legado/brasil/pais.json");
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const content = loaded.value.definition;
  const game = createGame("partida-integrada", content, loaded.value.graph);
  if (!game.ok) throw new Error(game.diagnostics[0]?.message);
  const prepared = prepareGameQuarter(content, loaded.value.graph, game.value, [
    game.value.policies,
    game.value.policies,
  ]);
  expect(prepared).toMatchObject({ ok: true });
  if (!prepared.ok) return;
  expect(prepared.value.execution.step).toBe(MESES_POR_TURNO);
  expect(prepared.value.months).toHaveLength(MESES_POR_TURNO);
  expect(game.value.execution.step).toBe(0);
  expect(game.value.currentTurn).toBe(0);

  const committed = commitGameQuarter(game.value, prepared.value);
  expect(committed.currentTurn).toBe(1);
  expect(committed.execution.step).toBe(MESES_POR_TURNO);
  expect("fiscal" in committed).toBe(false);
  expect(game.value.execution.step).toBe(0);
});

it("SG136: limite individual antigo não restringe o domínio monetário", () => {
  const loaded = loadDistributedScenario("testes/legado/brasil/pais.json");
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const content = structuredClone(loaded.value.definition);
  delete content.initialState.limitesProprios;
  // A faixa monetária vem do controle do mundo, sem teto individual.
  expect(policyLevelRulesFromContent(content, "atencao-basica")).toMatchObject({
    ok: true,
    value: { rules: { domain: { minimum: 0, maximum: undefined } } },
  });
  // O limite próprio antigo do Brasil também não reduz a faixa.
  expect(
    policyLevelRulesFromContent(loaded.value.definition, "atencao-basica"),
  ).toMatchObject({
    ok: true,
    value: { rules: { domain: { minimum: 0, maximum: undefined } } },
  });
});
