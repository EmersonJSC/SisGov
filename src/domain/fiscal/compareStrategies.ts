import {
  accountFiscalQuarter,
  type FiscalQuarterResult,
  type FiscalState,
  type FiscalMonthInput,
} from "./monthlyAccounting";

export type FiscalStrategy = Readonly<{
  id: string;
  label: string;
  months: readonly FiscalMonthInput[];
}>;

export type FiscalStrategyResult = Readonly<{
  strategy: FiscalStrategy;
  accounting: FiscalQuarterResult;
}>;

export type FiscalStrategyComparisonResult = Readonly<{
  initialState: FiscalState;
  strategies: readonly FiscalStrategyResult[];
}>;

export type FiscalStrategyComparisonValidationResult =
  | { ok: true; value: FiscalStrategyComparisonResult }
  | { ok: false; error: string };

/**
 * Prepares independent strategy previews from one baseline. It never commits
 * a strategy and never chains one strategy's debt into another's forecast.
 */
export function compareFiscalStrategies(
  initialState: FiscalState,
  strategies: readonly FiscalStrategy[],
): FiscalStrategyComparisonValidationResult {
  if (strategies.length === 0)
    return {
      ok: false,
      error: "A comparação exige pelo menos uma estratégia.",
    };
  const ids = new Set<string>();
  const results: FiscalStrategyResult[] = [];
  for (const [index, strategy] of strategies.entries()) {
    if (!strategy.id.trim())
      return { ok: false, error: `A estratégia ${index} precisa de ID.` };
    if (!strategy.label.trim())
      return {
        ok: false,
        error: `A estratégia ${strategy.id} precisa de rótulo.`,
      };
    if (ids.has(strategy.id))
      return {
        ok: false,
        error: `A estratégia ${strategy.id} está duplicada.`,
      };
    ids.add(strategy.id);
    const accounting = accountFiscalQuarter(initialState, strategy.months);
    if (!accounting.ok)
      return {
        ok: false,
        error: `A estratégia ${strategy.id} é inválida: ${accounting.error}`,
      };
    results.push({ strategy, accounting: accounting.value });
  }
  return { ok: true, value: { initialState, strategies: results } };
}
