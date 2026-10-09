import type { FiscalMonthInput } from "./monthlyAccounting";

export type AggregateCreditState = Readonly<{
  outstandingPrincipal: number;
  performingPrincipal: number;
  defaultedPrincipal: number;
  bankCapital: number;
  monthlyInterestRevenue: number;
}>;

export type AggregateCreditMonthInput = Readonly<{
  requestedPrincipal: number;
  monthlyInterestRate: number;
  expectedDefaultRate: number;
  capitalRequirementRatio: number;
  activityPerCredit: number;
  taxRateOnActivity: number;
}>;

export type AggregateCreditMonthResult = Readonly<{
  state: AggregateCreditState;
  requestedPrincipal: number;
  approvedPrincipal: number;
  rejectedPrincipal: number;
  creditCapacity: number;
  interestChargedOnNewCredit: number;
  interestRevenue: number;
  expectedDefaultLoss: number;
  activityGenerated: number;
  taxRevenue: number;
}>;

export type AggregateCreditValidationResult =
  | { ok: true; value: AggregateCreditMonthResult }
  | { ok: false; error: string };

/**
 * Advances one aggregate credit month without repricing existing credit.
 * Default is an expected deterministic loss in this extension, not a hidden
 * random draw; a future scenario may replace it with an explicit mechanism.
 */
export function accountAggregateCreditMonth(
  state: AggregateCreditState,
  input: AggregateCreditMonthInput,
): AggregateCreditValidationResult {
  const stateError = validateState(state);
  if (stateError) return { ok: false, error: stateError };
  const inputError = validateInput(input);
  if (inputError) return { ok: false, error: inputError };

  const creditCapacity =
    Math.max(0, state.bankCapital) / input.capitalRequirementRatio;
  const approvedPrincipal = Math.min(input.requestedPrincipal, creditCapacity);
  const rejectedPrincipal = input.requestedPrincipal - approvedPrincipal;
  const existingDefaultLoss =
    state.performingPrincipal * input.expectedDefaultRate;
  const newPerformingPrincipal =
    approvedPrincipal * (1 - input.expectedDefaultRate);
  const newDefaultLoss = approvedPrincipal * input.expectedDefaultRate;
  const expectedDefaultLoss = existingDefaultLoss + newDefaultLoss;
  const performingPrincipal =
    state.performingPrincipal - existingDefaultLoss + newPerformingPrincipal;
  const defaultedPrincipal = state.defaultedPrincipal + expectedDefaultLoss;
  const interestRevenue =
    state.monthlyInterestRevenue +
    newPerformingPrincipal * input.monthlyInterestRate;
  const bankCapital = state.bankCapital + interestRevenue - expectedDefaultLoss;
  const activityGenerated = approvedPrincipal * input.activityPerCredit;

  return {
    ok: true,
    value: {
      requestedPrincipal: input.requestedPrincipal,
      approvedPrincipal,
      rejectedPrincipal,
      creditCapacity,
      interestChargedOnNewCredit: approvedPrincipal * input.monthlyInterestRate,
      interestRevenue,
      expectedDefaultLoss,
      activityGenerated,
      taxRevenue: activityGenerated * input.taxRateOnActivity,
      state: {
        outstandingPrincipal: state.outstandingPrincipal + approvedPrincipal,
        performingPrincipal,
        defaultedPrincipal,
        bankCapital,
        monthlyInterestRevenue:
          state.monthlyInterestRevenue +
          newPerformingPrincipal * input.monthlyInterestRate,
      },
    },
  };
}

/** Adds the credit-generated tax flow without changing the accounting state. */
export function addCreditTaxRevenue(
  fiscalMonth: FiscalMonthInput,
  creditMonth: AggregateCreditMonthResult,
): FiscalMonthInput {
  return {
    ...fiscalMonth,
    revenue: fiscalMonth.revenue + creditMonth.taxRevenue,
  };
}

function validateState(state: AggregateCreditState): string | undefined {
  for (const [field, value] of Object.entries(state)) {
    if (!Number.isFinite(value))
      return `${field} precisa ser um número finito.`;
    if (field !== "bankCapital" && value < 0)
      return `${field} não pode ser negativo.`;
  }
  const classified = state.performingPrincipal + state.defaultedPrincipal;
  if (Math.abs(classified - state.outstandingPrincipal) > 1e-9)
    return "A carteira precisa fechar entre crédito performante e inadimplente.";
  return undefined;
}

function validateInput(input: AggregateCreditMonthInput): string | undefined {
  if (
    !Number.isFinite(input.requestedPrincipal) ||
    input.requestedPrincipal < 0
  )
    return "requestedPrincipal precisa ser finito e não negativo.";
  if (
    !Number.isFinite(input.monthlyInterestRate) ||
    input.monthlyInterestRate < 0
  )
    return "monthlyInterestRate precisa ser finita e não negativa.";
  if (
    !Number.isFinite(input.expectedDefaultRate) ||
    input.expectedDefaultRate < 0 ||
    input.expectedDefaultRate > 1
  )
    return "expectedDefaultRate precisa estar entre 0 e 1.";
  if (
    !Number.isFinite(input.capitalRequirementRatio) ||
    input.capitalRequirementRatio <= 0
  )
    return "capitalRequirementRatio precisa ser maior que zero.";
  if (!Number.isFinite(input.activityPerCredit) || input.activityPerCredit < 0)
    return "activityPerCredit precisa ser finito e não negativo.";
  if (
    !Number.isFinite(input.taxRateOnActivity) ||
    input.taxRateOnActivity < 0 ||
    input.taxRateOnActivity > 1
  )
    return "taxRateOnActivity precisa estar entre 0 e 1.";
  return undefined;
}
