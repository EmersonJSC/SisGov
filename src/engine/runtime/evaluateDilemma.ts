import {
  evaluateCondition,
  type Condition,
} from "../mechanisms/evaluateCondition";
import type { ValidationResult } from "../diagnostics/contentDiagnostic";

export type DilemmaDefinition = Readonly<{
  id: string;
  triggerWhen: Condition;
  optionIds: readonly string[];
}>;
export type PendingDilemma = Readonly<{
  dilemmaId: string;
  optionIds: readonly string[];
}>;

/** Cria uma escolha pendente; opções não aplicam efeitos antes da resposta. */
export function evaluateDilemma(
  dilemma: DilemmaDefinition,
  pending: PendingDilemma | undefined,
  values: Readonly<Record<string, number>>,
): ValidationResult<PendingDilemma | undefined> {
  if (pending) return { ok: true, value: pending };
  const triggered = evaluateCondition(dilemma.triggerWhen, values);
  if (!triggered.ok) return triggered;
  return triggered.value
    ? {
        ok: true,
        value: { dilemmaId: dilemma.id, optionIds: dilemma.optionIds },
      }
    : { ok: true, value: undefined };
}
