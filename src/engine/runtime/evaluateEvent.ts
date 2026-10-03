import {
  evaluateCondition,
  type Condition,
} from "../mechanisms/evaluateCondition";
import type { ValidationResult } from "../diagnostics/contentDiagnostic";

export type EventDefinition = Readonly<{ id: string; triggerWhen: Condition }>;

/** Dispara somente quando a condição é verdadeira e o evento ainda não ocorreu. */
export function evaluateEvent(
  event: EventDefinition,
  occurred: boolean,
  values: Readonly<Record<string, number>>,
): ValidationResult<boolean> {
  if (occurred) return { ok: true, value: false };
  return evaluateCondition(event.triggerWhen, values);
}
