import type { ValidationResult } from "../diagnostics/contentDiagnostic";

export type GradualResponse = Readonly<{
  previousValue: number;
  targetValue: number;
  fraction: number;
  value: number;
}>;

/** Aproxima um valor do alvo sem substituir imediatamente o estado anterior. */
export function applyGradualResponse(
  previousValue: number,
  targetValue: number,
  fraction: number,
): ValidationResult<GradualResponse> {
  if (
    ![previousValue, targetValue, fraction].every(Number.isFinite) ||
    fraction <= 0 ||
    fraction > 1
  ) {
    return {
      ok: false,
      diagnostics: [
        {
          code: "CALCULO_INVALIDO",
          file: "$execucao",
          field: "fracao",
          message: "A fração deve ser finita e estar entre 0 (exclusivo) e 1.",
        },
      ],
    };
  }
  const value = previousValue + (targetValue - previousValue) * fraction;
  return { ok: true, value: { previousValue, targetValue, fraction, value } };
}
