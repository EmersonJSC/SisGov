import {
  evaluateCondition,
  type Condition,
} from "../mechanisms/evaluateCondition";
import type { ValidationResult } from "../diagnostics/contentDiagnostic";

export type SituationDefinition = Readonly<{
  id: string;
  enterWhen: Condition;
  exitWhen: Condition;
}>;

/** Atualiza uma situação persistente sem aplicar efeitos no mesmo instante. */
export function evaluateSituation(
  situation: SituationDefinition,
  active: boolean,
  values: Readonly<Record<string, number>>,
): ValidationResult<boolean> {
  const condition = active ? situation.exitWhen : situation.enterWhen;
  const result = evaluateCondition(condition, values);
  if (!result.ok) return result;
  return { ok: true, value: active ? !result.value : result.value };
}
