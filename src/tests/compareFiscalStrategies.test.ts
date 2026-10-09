import { expect, it } from "vitest";
import { compareFiscalStrategies } from "../domain/fiscal";

const initialState = {
  cash: 0,
  totalDebt: 100,
  debtIssuedDuringGame: 0,
  inheritedMonthlyInterest: 5,
  monthlyNewDebtInterestRate: 0.01,
};

it("compara gasto, investimento, economia e tributação a partir da mesma base", () => {
  const result = compareFiscalStrategies(initialState, [
    {
      id: "gasto",
      label: "Gasto corrente",
      months: Array.from({ length: 3 }, () => ({
        revenue: 100,
        primaryExpense: 120,
      })),
    },
    {
      id: "investimento",
      label: "Investimento",
      months: Array.from({ length: 3 }, () => ({
        revenue: 100,
        primaryExpense: 140,
      })),
    },
    {
      id: "economia",
      label: "Economia",
      months: Array.from({ length: 3 }, () => ({
        revenue: 100,
        primaryExpense: 80,
      })),
    },
    {
      id: "tributacao",
      label: "Tributação",
      months: Array.from({ length: 3 }, () => ({
        revenue: 130,
        primaryExpense: 100,
      })),
    },
  ]);

  expect(result).toMatchObject({ ok: true });
  if (!result.ok) return;
  const byId = new Map(
    result.value.strategies.map((item) => [item.strategy.id, item.accounting]),
  );
  expect(byId.get("investimento")?.state.totalDebt).toBeGreaterThan(
    byId.get("gasto")?.state.totalDebt ?? 0,
  );
  expect(byId.get("economia")?.state.cash).toBe(45);
  expect(byId.get("tributacao")?.state.cash).toBe(75);
  expect(byId.get("economia")?.state.totalDebt).toBe(100);
  expect(byId.get("tributacao")?.state.totalDebt).toBe(100);
});

it("não encadeia uma estratégia na outra e rejeita trimestre incompleto", () => {
  const result = compareFiscalStrategies(initialState, [
    {
      id: "a",
      label: "A",
      months: [
        { revenue: 100, primaryExpense: 100 },
        { revenue: 100, primaryExpense: 100 },
        { revenue: 100, primaryExpense: 100 },
      ],
    },
    {
      id: "b",
      label: "B",
      months: [{ revenue: 100, primaryExpense: 100 }],
    },
  ]);
  expect(result).toMatchObject({ ok: false });
  if (!result.ok) expect(result.error).toContain("A estratégia b é inválida");
  expect(initialState).toEqual({
    cash: 0,
    totalDebt: 100,
    debtIssuedDuringGame: 0,
    inheritedMonthlyInterest: 5,
    monthlyNewDebtInterestRate: 0.01,
  });
});
