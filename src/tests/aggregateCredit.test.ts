import { expect, it } from "vitest";
import {
  accountAggregateCreditMonth,
  addCreditTaxRevenue,
} from "../domain/fiscal";

const state = {
  outstandingPrincipal: 1000,
  performingPrincipal: 1000,
  defaultedPrincipal: 0,
  bankCapital: 100,
  monthlyInterestRevenue: 10,
};

const input = {
  requestedPrincipal: 250,
  monthlyInterestRate: 0.02,
  expectedDefaultRate: 0.1,
  capitalRequirementRatio: 0.5,
  activityPerCredit: 2,
  taxRateOnActivity: 0.1,
};

it("limita crédito pela capacidade, preserva taxa da carteira e conecta atividade à receita", () => {
  const result = accountAggregateCreditMonth(state, input);
  expect(result).toMatchObject({ ok: true });
  if (!result.ok) return;
  expect(result.value).toMatchObject({
    approvedPrincipal: 200,
    rejectedPrincipal: 50,
    creditCapacity: 200,
    interestChargedOnNewCredit: 4,
    interestRevenue: 13.6,
    expectedDefaultLoss: 120,
    activityGenerated: 400,
    taxRevenue: 40,
    state: {
      outstandingPrincipal: 1200,
      performingPrincipal: 1080,
      defaultedPrincipal: 120,
      monthlyInterestRevenue: 13.6,
    },
  });
  expect(result.value.state.bankCapital).toBeCloseTo(-6.4);
  expect(
    addCreditTaxRevenue({ revenue: 10, primaryExpense: 3 }, result.value),
  ).toEqual({
    revenue: 50,
    primaryExpense: 3,
  });
  expect(state).toEqual({
    outstandingPrincipal: 1000,
    performingPrincipal: 1000,
    defaultedPrincipal: 0,
    bankCapital: 100,
    monthlyInterestRevenue: 10,
  });
});

it("aplica default esperado à carteira existente sem reprecificar seu juro", () => {
  const result = accountAggregateCreditMonth(
    {
      outstandingPrincipal: 100,
      performingPrincipal: 80,
      defaultedPrincipal: 20,
      bankCapital: 50,
      monthlyInterestRevenue: 2,
    },
    {
      requestedPrincipal: 0,
      monthlyInterestRate: 0.5,
      expectedDefaultRate: 0.25,
      capitalRequirementRatio: 0.5,
      activityPerCredit: 1,
      taxRateOnActivity: 0.2,
    },
  );
  expect(result).toMatchObject({
    ok: true,
    value: {
      interestRevenue: 2,
      expectedDefaultLoss: 20,
      state: { performingPrincipal: 60, defaultedPrincipal: 40 },
    },
  });
});

it("recusa carteira inconsistente e taxa de inadimplência fora da escala", () => {
  const invalidState = accountAggregateCreditMonth(
    { ...state, outstandingPrincipal: 900 },
    input,
  );
  expect(invalidState).toMatchObject({ ok: false });
  if (!invalidState.ok)
    expect(invalidState.error).toContain("A carteira precisa fechar");
  expect(
    accountAggregateCreditMonth(state, { ...input, expectedDefaultRate: 1.1 }),
  ).toMatchObject({
    ok: false,
    error: "expectedDefaultRate precisa estar entre 0 e 1.",
  });
});
