import type { ResolvedPackage, ValidationResult } from "../engine";
import {
  accountFiscalQuarter,
  type FiscalQuarterResult,
  type FiscalState,
} from "../domain/fiscal";
import type { PolicyState } from "../domain/game";
import {
  preparePolicyFiscalFlows,
  type AggregateFiscalFlow,
  type PolicyFiscalFlow,
} from "./preparePolicyFiscalFlows";

export type PreparedFiscalMonth = Readonly<{
  flows: readonly PolicyFiscalFlow[];
  /** Receitas e despesas que ainda não são leis. */
  aggregates: readonly AggregateFiscalFlow[];
  accounting: FiscalQuarterResult["months"][number];
}>;

export type PreparedFiscalQuarter = Readonly<{
  accounting: FiscalQuarterResult;
  months: readonly PreparedFiscalMonth[];
}>;

function invalid(field: string, message: string): ValidationResult<never> {
  return {
    ok: false,
    diagnostics: [
      { code: "COMANDO_INVALIDO", file: "$partida", field, message },
    ],
  };
}

/** Prepares policy flows and accounting together without committing either. */
export function prepareFiscalQuarter(
  content: ResolvedPackage,
  initialFiscalState: FiscalState,
  monthlyPolicyStates: readonly (readonly PolicyState[])[],
): ValidationResult<PreparedFiscalQuarter> {
  if (monthlyPolicyStates.length !== 3)
    return invalid(
      "fiscal",
      "Um trimestre exige estados de política para três meses.",
    );

  const prepared = [];
  for (const [index, states] of monthlyPolicyStates.entries()) {
    const flows = preparePolicyFiscalFlows(content, states);
    if (!flows.ok) return flows;
    prepared.push(flows.value);
    if (
      !Number.isFinite(flows.value.month.revenue) ||
      !Number.isFinite(flows.value.month.primaryExpense)
    )
      return invalid(
        `fiscal.meses.${index}`,
        "O fluxo fiscal mensal precisa ser finito.",
      );
  }

  const accounting = accountFiscalQuarter(
    initialFiscalState,
    prepared.map(({ month }) => month),
  );
  if (!accounting.ok) return invalid("fiscal", accounting.error);
  return {
    ok: true,
    value: {
      accounting: accounting.value,
      months: prepared.map((month, index) => ({
        flows: month.flows,
        aggregates: month.aggregates,
        accounting: accounting.value.months[index],
      })),
    },
  };
}
