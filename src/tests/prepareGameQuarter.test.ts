import { expect, it } from "vitest";
import { createGame } from "../game/createGame";
import { commitGameQuarter } from "../game/commitGameQuarter";
import { prepareGameQuarter } from "../game/prepareGameQuarter";
import { buildFiscalQuarterReport } from "../game/fiscalReport";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

it("prepara e confirma motor e fiscal juntos em três meses", () => {
  const loaded = loadDistributedScenario(
    "brasil-primeiro-cenario/cenario.json",
  );
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const content = structuredClone(loaded.value.definition);
  content.initialState.fiscal = {
    periodoInicial: "2026-01",
    referenciaPrecos: "teste",
    unidadeMonetaria: "creditos",
    origem: { tipo: "hipotese", descricao: "Teste." },
    caixa: 10000,
    dividaTotal: 10000,
    jurosHerdadosMensais: 100,
    taxaJurosDividaNovaMensal: 0.01,
  };
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
  expect(prepared.value.fiscal.months).toHaveLength(3);
  expect(game.value.execution.step).toBe(0);
  expect(game.value.currentTurn).toBe(0);

  const committed = commitGameQuarter(game.value, prepared.value);
  expect(committed.currentTurn).toBe(1);
  expect(committed.execution.step).toBe(3);
  expect(committed.fiscal).toEqual(prepared.value.fiscal.accounting.state);
  expect(game.value.execution.step).toBe(0);
});

it("não prepara turno integrado sem ficha fiscal", () => {
  const loaded = loadDistributedScenario(
    "brasil-primeiro-cenario/cenario.json",
  );
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const content = structuredClone(loaded.value.definition);
  delete content.initialState.fiscal;
  const game = createGame("partida-sem-fiscal", content, loaded.value.graph);
  if (!game.ok) throw new Error(game.diagnostics[0]?.message);
  const result = prepareGameQuarter(content, loaded.value.graph, game.value, [
    game.value.policies,
    game.value.policies,
    game.value.policies,
  ]);
  expect(result).toMatchObject({
    ok: false,
    diagnostics: [{ field: "fiscal" }],
  });
});

it("leva os custos das cinco políticas ao financiamento mensal do trimestre", () => {
  const loaded = loadDistributedScenario(
    "brasil-primeiro-cenario/cenario.json",
  );
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const content = structuredClone(loaded.value.definition);
  content.initialState.fiscal = {
    periodoInicial: "2026-01",
    referenciaPrecos: "teste",
    unidadeMonetaria: "creditos",
    origem: {
      tipo: "hipotese",
      descricao: "Ciclo sintético de financiamento.",
    },
    caixa: 0,
    dividaTotal: 100,
    jurosHerdadosMensais: 5,
    taxaJurosDividaNovaMensal: 0.01,
  };
  const game = createGame(
    "partida-fiscal-integrada",
    content,
    loaded.value.graph,
  );
  if (!game.ok) throw new Error(game.diagnostics[0]?.message);
  const prepared = prepareGameQuarter(content, loaded.value.graph, game.value, [
    game.value.policies,
    game.value.policies,
    game.value.policies,
  ]);
  if (!prepared.ok) throw new Error(prepared.diagnostics[0]?.message);

  expect(
    prepared.value.fiscal.months.map((month) => month.accounting.issuance),
  ).toEqual([475, 479.75, 484.5475]);
  expect(prepared.value.fiscal.accounting.state.cash).toBe(0);
  expect(prepared.value.fiscal.accounting.state.totalDebt).toBeCloseTo(
    1539.2975,
  );
  expect(
    prepared.value.fiscal.accounting.state.debtIssuedDuringGame,
  ).toBeCloseTo(1439.2975);
  expect(prepared.value.fiscal.months[1].accounting.interestExpense).toBe(9.75);
  expect(prepared.value.fiscal.months[2].accounting.interestExpense).toBe(
    14.5475,
  );
  expect(
    prepared.value.fiscal.months[0].accounting.newDebtInterestNextMonth,
  ).toBe(4.75);
  expect(
    prepared.value.fiscal.months[2].accounting.newDebtInterestNextMonth,
  ).toBeCloseTo(14.392975);
  const report = buildFiscalQuarterReport(prepared.value.fiscal);
  expect(report.totals.revenue).toBe(0);
  expect(report.totals.primaryExpense).toBeCloseTo(1410);
  expect(report.totals.issuance).toBeCloseTo(1439.2975);
  expect(report.finalState).toEqual(prepared.value.fiscal.accounting.state);
});

it("SG103: o Brasil real tem ficha fiscal e um turno gera resultado finito", () => {
  const loaded = loadDistributedScenario(
    "brasil-primeiro-cenario/cenario.json",
  );
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const game = createGame(
    "brasil-fiscal",
    loaded.value.definition,
    loaded.value.graph,
  );
  if (!game.ok) throw new Error(game.diagnostics[0]?.message);
  expect(game.value.fiscal).toMatchObject({
    cash: 900000,
    totalDebt: 7000000,
    debtIssuedDuringGame: 0,
  });
  const prepared = prepareGameQuarter(
    loaded.value.definition,
    loaded.value.graph,
    game.value,
    [game.value.policies, game.value.policies, game.value.policies],
  );
  if (!prepared.ok) throw new Error(prepared.diagnostics[0]?.message);
  for (const month of prepared.value.fiscal.months) {
    expect(Number.isFinite(month.accounting.nominalResult)).toBe(true);
    expect(month.accounting.primaryResult).toBeLessThan(0);
    expect(month.accounting.cashAfter).toBeGreaterThanOrEqual(0);
  }
  expect(prepared.value.fiscal.months[0].flows).toHaveLength(5);
});
