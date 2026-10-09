import type { FiscalState } from "../domain/fiscal";
import type {
  PreparedFiscalMonth,
  PreparedFiscalQuarter,
} from "./prepareFiscalQuarter";

export type FiscalQuarterReportTotals = Readonly<{
  revenue: number;
  primaryExpense: number;
  primaryResult: number;
  interestExpense: number;
  nominalResult: number;
  issuance: number;
  newDebtInterestNextMonth: number;
}>;

export type FiscalQuarterReport = Readonly<{
  months: readonly PreparedFiscalMonth[];
  totals: FiscalQuarterReportTotals;
  finalState: FiscalState;
}>;

/**
 * Builds a presentation DTO from an already prepared quarter.
 * It only aggregates values; accounting remains in monthlyAccounting.ts.
 */
export function buildFiscalQuarterReport(
  prepared: PreparedFiscalQuarter,
): FiscalQuarterReport {
  const totals = prepared.months.reduce(
    (summary, month) => ({
      revenue: summary.revenue + month.accounting.revenue,
      primaryExpense: summary.primaryExpense + month.accounting.primaryExpense,
      primaryResult: summary.primaryResult + month.accounting.primaryResult,
      interestExpense:
        summary.interestExpense + month.accounting.interestExpense,
      nominalResult: summary.nominalResult + month.accounting.nominalResult,
      issuance: summary.issuance + month.accounting.issuance,
      newDebtInterestNextMonth: month.accounting.newDebtInterestNextMonth,
    }),
    {
      revenue: 0,
      primaryExpense: 0,
      primaryResult: 0,
      interestExpense: 0,
      nominalResult: 0,
      issuance: 0,
      newDebtInterestNextMonth: 0,
    },
  );
  return {
    months: prepared.months,
    totals,
    finalState: prepared.accounting.state,
  };
}
