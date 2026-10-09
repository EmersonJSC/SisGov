export type FiscalState = Readonly<{
  cash: number;
  totalDebt: number;
  debtIssuedDuringGame: number;
  inheritedMonthlyInterest: number;
  monthlyNewDebtInterestRate: number;
}>;

export type FiscalMonthInput = Readonly<{
  revenue: number;
  primaryExpense: number;
}>;

export type FiscalMonthResult = Readonly<{
  revenue: number;
  primaryExpense: number;
  cashBefore: number;
  totalDebtBefore: number;
  state: FiscalState;
  primaryResult: number;
  interestExpense: number;
  nominalResult: number;
  issuance: number;
  cashAfter: number;
  totalDebtAfter: number;
  newDebtInterestNextMonth: number;
}>;

export type FiscalValidationResult =
  { ok: true; value: FiscalMonthResult } | { ok: false; error: string };

export type FiscalQuarterResult = Readonly<{
  state: FiscalState;
  months: readonly FiscalMonthResult[];
}>;

export type FiscalQuarterValidationResult =
  { ok: true; value: FiscalQuarterResult } | { ok: false; error: string };

/**
 * Applies the V1 monthly fiscal identities. Interest uses only the debt issued
 * before this month, so an issuance starts accruing interest in the next month.
 * This function is pure: callers can prepare a whole turn before committing it.
 */
export function accountFiscalMonth(
  state: FiscalState,
  input: FiscalMonthInput,
): FiscalValidationResult {
  const invalid = validateState(state) ?? validateInput(input);
  if (invalid) return { ok: false, error: invalid };

  const interestExpense =
    state.inheritedMonthlyInterest +
    state.monthlyNewDebtInterestRate * state.debtIssuedDuringGame;
  const primaryResult = input.revenue - input.primaryExpense;
  const nominalResult = primaryResult - interestExpense;
  const provisionalCash = state.cash + nominalResult;
  const issuance = Math.max(0, -provisionalCash);
  const cashAfter = provisionalCash + issuance;
  const totalDebtAfter = state.totalDebt + issuance;
  const debtIssuedDuringGameAfter = state.debtIssuedDuringGame + issuance;

  return {
    ok: true,
    value: {
      revenue: input.revenue,
      primaryExpense: input.primaryExpense,
      cashBefore: state.cash,
      totalDebtBefore: state.totalDebt,
      primaryResult,
      interestExpense,
      nominalResult,
      issuance,
      cashAfter,
      totalDebtAfter,
      newDebtInterestNextMonth:
        state.monthlyNewDebtInterestRate * debtIssuedDuringGameAfter,
      state: {
        ...state,
        cash: cashAfter,
        totalDebt: totalDebtAfter,
        debtIssuedDuringGame: debtIssuedDuringGameAfter,
      },
    },
  };
}

/**
 * Prepares exactly one political quarter. No input object is mutated, so a
 * malformed later month cannot partially commit the earlier fiscal months.
 */
export function accountFiscalQuarter(
  initialState: FiscalState,
  months: readonly FiscalMonthInput[],
): FiscalQuarterValidationResult {
  if (months.length !== 3)
    return { ok: false, error: "Um turno fiscal exige exatamente três meses." };

  let state = initialState;
  const results: FiscalMonthResult[] = [];
  for (const input of months) {
    const result = accountFiscalMonth(state, input);
    if (!result.ok) return result;
    results.push(result.value);
    state = result.value.state;
  }
  return { ok: true, value: { state, months: results } };
}

function validateState(state: FiscalState): string | undefined {
  for (const [field, value] of Object.entries(state)) {
    if (!Number.isFinite(value))
      return `${field} precisa ser um número finito.`;
    if (value < 0) return `${field} não pode ser negativo.`;
  }
  if (state.debtIssuedDuringGame > state.totalDebt)
    return "debtIssuedDuringGame não pode exceder totalDebt.";
  return undefined;
}

function validateInput(input: FiscalMonthInput): string | undefined {
  for (const [field, value] of Object.entries(input)) {
    if (!Number.isFinite(value))
      return `${field} precisa ser um número finito.`;
    if (value < 0) return `${field} não pode ser negativo.`;
  }
  return undefined;
}
