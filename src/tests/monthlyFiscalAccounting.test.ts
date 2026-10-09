import { expect, it } from "vitest";
import { accountFiscalMonth, accountFiscalQuarter } from "../domain/fiscal";

it("finances the first deficit and delays interest on its issuance", () => {
  const result = accountFiscalMonth(
    {
      cash: 0,
      totalDebt: 100,
      debtIssuedDuringGame: 0,
      inheritedMonthlyInterest: 5,
      monthlyNewDebtInterestRate: 0.01,
    },
    { revenue: 100, primaryExpense: 100 },
  );

  expect(result).toMatchObject({
    ok: true,
    value: {
      revenue: 100,
      primaryExpense: 100,
      cashBefore: 0,
      totalDebtBefore: 100,
      primaryResult: 0,
      interestExpense: 5,
      nominalResult: -5,
      issuance: 5,
      cashAfter: 0,
      totalDebtAfter: 105,
      newDebtInterestNextMonth: 0.05,
      state: { cash: 0, totalDebt: 105, debtIssuedDuringGame: 5 },
    },
  });
});

it("charges interest on new debt only from the following month", () => {
  const result = accountFiscalMonth(
    {
      cash: 0,
      totalDebt: 105,
      debtIssuedDuringGame: 5,
      inheritedMonthlyInterest: 5,
      monthlyNewDebtInterestRate: 0.01,
    },
    { revenue: 100, primaryExpense: 100 },
  );

  expect(result).toMatchObject({
    ok: true,
    value: {
      interestExpense: 5.05,
      issuance: 5.05,
      newDebtInterestNextMonth: 0.1005,
      state: { cash: 0, totalDebt: 110.05, debtIssuedDuringGame: 10.05 },
    },
  });
});

it("keeps a surplus in cash without amortizing debt", () => {
  const result = accountFiscalMonth(
    {
      cash: 0,
      totalDebt: 100,
      debtIssuedDuringGame: 0,
      inheritedMonthlyInterest: 5,
      monthlyNewDebtInterestRate: 0.01,
    },
    { revenue: 120, primaryExpense: 100 },
  );

  expect(result).toMatchObject({
    ok: true,
    value: {
      issuance: 0,
      state: { cash: 15, totalDebt: 100, debtIssuedDuringGame: 0 },
    },
  });
});

it("uses available cash before issuing debt", () => {
  const result = accountFiscalMonth(
    {
      cash: 10,
      totalDebt: 100,
      debtIssuedDuringGame: 0,
      inheritedMonthlyInterest: 5,
      monthlyNewDebtInterestRate: 0.01,
    },
    { revenue: 100, primaryExpense: 100 },
  );

  expect(result).toMatchObject({
    ok: true,
    value: {
      issuance: 0,
      state: { cash: 5, totalDebt: 100, debtIssuedDuringGame: 0 },
    },
  });
});

it("rejects invalid monetary state without modifying it", () => {
  const result = accountFiscalMonth(
    {
      cash: 0,
      totalDebt: 1,
      debtIssuedDuringGame: 2,
      inheritedMonthlyInterest: 0,
      monthlyNewDebtInterestRate: 0,
    },
    { revenue: 1, primaryExpense: 1 },
  );

  expect(result).toEqual({
    ok: false,
    error: "debtIssuedDuringGame não pode exceder totalDebt.",
  });
});

it("prepares three fiscal months in sequence without mutating its initial state", () => {
  const initial = {
    cash: 0,
    totalDebt: 100,
    debtIssuedDuringGame: 0,
    inheritedMonthlyInterest: 5,
    monthlyNewDebtInterestRate: 0.01,
  };
  const result = accountFiscalQuarter(initial, [
    { revenue: 100, primaryExpense: 100 },
    { revenue: 100, primaryExpense: 100 },
    { revenue: 120, primaryExpense: 100 },
  ]);

  expect(result).toMatchObject({
    ok: true,
    value: {
      months: [{ issuance: 5 }, { issuance: 5.05 }, { issuance: 0 }],
      state: {
        cash: 14.8995,
        totalDebt: 110.05,
        debtIssuedDuringGame: 10.05,
      },
    },
  });
  expect(initial).toEqual({
    cash: 0,
    totalDebt: 100,
    debtIssuedDuringGame: 0,
    inheritedMonthlyInterest: 5,
    monthlyNewDebtInterestRate: 0.01,
  });
});

it("rejects an incomplete quarter before producing a fiscal state", () => {
  const result = accountFiscalQuarter(
    {
      cash: 0,
      totalDebt: 0,
      debtIssuedDuringGame: 0,
      inheritedMonthlyInterest: 0,
      monthlyNewDebtInterestRate: 0,
    },
    [{ revenue: 1, primaryExpense: 1 }],
  );

  expect(result).toEqual({
    ok: false,
    error: "Um turno fiscal exige exatamente três meses.",
  });
});
