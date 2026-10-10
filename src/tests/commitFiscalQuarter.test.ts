import { expect, it } from "vitest";
import { createGame } from "../game/createGame";
import { commitFiscalQuarter } from "../game/commitFiscalQuarter";
import { prepareFiscalQuarter } from "../game/prepareFiscalQuarter";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

it("confirma o fiscal em um novo snapshot sem alterar a partida anterior", () => {
  const loaded = loadDistributedScenario("testes/legado/brasil/pais.json");
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const content = structuredClone(loaded.value.definition);
  content.initialState.fiscal = {
    periodoInicial: "2026-01",
    referenciaPrecos: "teste",
    unidadeMonetaria: "creditos",
    origem: { tipo: "hipotese", descricao: "Teste." },
    caixa: 1000,
    dividaTotal: 10000,
    jurosHerdadosMensais: 100,
    taxaJurosDividaNovaMensal: 0.01,
  };
  const game = createGame("partida-fiscal", content, loaded.value.graph);
  if (!game.ok) throw new Error(game.diagnostics[0]?.message);
  const prepared = prepareFiscalQuarter(content, game.value.fiscal!, [
    game.value.policies,
    game.value.policies,
    game.value.policies,
  ]);
  if (!prepared.ok) throw new Error(prepared.diagnostics[0]?.message);
  const committed = commitFiscalQuarter(game.value, prepared.value);
  expect(committed).toMatchObject({ ok: true });
  if (!committed.ok) return;
  expect(committed.value.fiscal).toEqual(prepared.value.accounting.state);
  expect(game.value.fiscal).toMatchObject({ cash: 1000, totalDebt: 10000 });
  expect(committed.value.currentTurn).toBe(0);
  expect(committed.value.execution).toBe(game.value.execution);
});

it("não confirma trimestre fiscal em partida sem configuração fiscal", () => {
  const loaded = loadDistributedScenario("testes/legado/brasil/pais.json");
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const content = structuredClone(loaded.value.definition);
  delete content.initialState.fiscal;
  const game = createGame("partida-sem-fiscal", content, loaded.value.graph);
  if (!game.ok) throw new Error(game.diagnostics[0]?.message);
  const result = commitFiscalQuarter(game.value, {
    accounting: {
      state: {
        cash: 0,
        totalDebt: 0,
        debtIssuedDuringGame: 0,
        inheritedMonthlyInterest: 0,
        monthlyNewDebtInterestRate: 0,
      },
      months: [],
    },
    months: [],
  });
  expect(result).toMatchObject({
    ok: false,
    diagnostics: [{ field: "fiscal" }],
  });
});
