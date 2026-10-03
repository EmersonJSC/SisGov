import type { ValidationResult } from "../diagnostics/contentDiagnostic";

export type NumericContribution = Readonly<{
  relationId: string;
  value: number;
}>;

export type CalculatedValue = Readonly<{
  targetId: string;
  baseValue: number;
  contributions: readonly NumericContribution[];
  value: number;
}>;

function failure(
  field: string,
  message: string,
): ValidationResult<CalculatedValue> {
  return {
    ok: false,
    diagnostics: [
      { code: "CALCULO_INVALIDO", file: "$execucao", field, message },
    ],
  };
}

/** Recalcula um indicador pela base mais as causas ativas deste passo. */
export function combineCalculatedValue(
  targetId: string,
  baseValue: number,
  contributions: readonly NumericContribution[],
): ValidationResult<CalculatedValue> {
  if (!Number.isFinite(baseValue))
    return failure("base", "O valor-base deve ser finito.");
  if (
    contributions.some((contribution) => !Number.isFinite(contribution.value))
  ) {
    return failure("contribuicoes", "Toda contribuição deve ser finita.");
  }
  const ordered = [...contributions].sort((left, right) =>
    left.relationId.localeCompare(right.relationId),
  );
  const value = ordered.reduce(
    (total, contribution) => total + contribution.value,
    baseValue,
  );
  if (!Number.isFinite(value))
    return failure("resultado", "O valor calculado não é finito.");
  return {
    ok: true,
    value: { targetId, baseValue, contributions: ordered, value },
  };
}
