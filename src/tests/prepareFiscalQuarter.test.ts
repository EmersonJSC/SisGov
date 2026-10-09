import { expect, it } from "vitest";
import { createGame } from "../game/createGame";
import { prepareFiscalQuarter } from "../game/prepareFiscalQuarter";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

it("combina políticas e contabilidade nos três meses sem mutar a partida", () => {
  const loaded = loadDistributedScenario("paises/brasil/pais.json");
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const game = createGame(
    "trimestre-fiscal",
    loaded.value.definition,
    loaded.value.graph,
  );
  if (!game.ok) throw new Error(game.diagnostics[0]?.message);
  const initialFiscal = {
    cash: 1000,
    totalDebt: 10000,
    debtIssuedDuringGame: 0,
    inheritedMonthlyInterest: 100,
    monthlyNewDebtInterestRate: 0.01,
  };
  const result = prepareFiscalQuarter(loaded.value.definition, initialFiscal, [
    game.value.policies,
    game.value.policies,
    game.value.policies,
  ]);

  expect(result).toMatchObject({ ok: true });
  if (!result.ok) return;
  expect(result.value.months).toHaveLength(3);
  expect(result.value.months[0].flows).toHaveLength(5);
  expect(result.value.accounting.months[0].interestExpense).toBe(100);
  expect(result.value.accounting.state).toMatchObject({
    cash: 0,
    totalDebt: 10711.4,
    debtIssuedDuringGame: 711.4,
  });
  expect(initialFiscal).toEqual({
    cash: 1000,
    totalDebt: 10000,
    debtIssuedDuringGame: 0,
    inheritedMonthlyInterest: 100,
    monthlyNewDebtInterestRate: 0.01,
  });
});

it("recusa trimestre incompleto antes de contabilizar qualquer mês", () => {
  const loaded = loadDistributedScenario("paises/brasil/pais.json");
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const game = createGame(
    "trimestre-incompleto",
    loaded.value.definition,
    loaded.value.graph,
  );
  if (!game.ok) throw new Error(game.diagnostics[0]?.message);
  const result = prepareFiscalQuarter(
    loaded.value.definition,
    {
      cash: 0,
      totalDebt: 0,
      debtIssuedDuringGame: 0,
      inheritedMonthlyInterest: 0,
      monthlyNewDebtInterestRate: 0,
    },
    [game.value.policies],
  );
  expect(result).toMatchObject({
    ok: false,
    diagnostics: [{ field: "fiscal" }],
  });
});
