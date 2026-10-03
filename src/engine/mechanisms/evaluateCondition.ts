import type { ValidationResult } from "../diagnostics/contentDiagnostic";

export type Condition =
  | Readonly<{
      tipo: "comparacao";
      variavel: string;
      operador:
        | "maior_que"
        | "maior_ou_igual"
        | "menor_que"
        | "menor_ou_igual"
        | "igual";
      valor: number;
    }>
  | Readonly<{ tipo: "e" | "ou"; condicoes: readonly Condition[] }>
  | Readonly<{ tipo: "nao"; condicao: Condition }>;

/** Avalia somente operadores declarados pelo motor; JSON nunca executa código. */
export function evaluateCondition(
  condition: Condition,
  values: Readonly<Record<string, number>>,
): ValidationResult<boolean> {
  if (condition.tipo === "comparacao") {
    const value = values[condition.variavel];
    if (!Number.isFinite(value) || !Number.isFinite(condition.valor)) {
      return {
        ok: false,
        diagnostics: [
          {
            code: "CALCULO_INVALIDO",
            file: "$condicao",
            field: "variavel",
            message: "A condição referencia valor ausente ou inválido.",
          },
        ],
      };
    }
    const operators = {
      maior_que: value > condition.valor,
      maior_ou_igual: value >= condition.valor,
      menor_que: value < condition.valor,
      menor_ou_igual: value <= condition.valor,
      igual: value === condition.valor,
    };
    return { ok: true, value: operators[condition.operador] };
  }
  if (condition.tipo === "nao") {
    const result = evaluateCondition(condition.condicao, values);
    return result.ok ? { ok: true, value: !result.value } : result;
  }
  const results = condition.condicoes.map((item) =>
    evaluateCondition(item, values),
  );
  const invalid = results.find((item) => !item.ok);
  if (invalid && !invalid.ok) return invalid;
  const booleans = results.map(
    (item) => (item as { ok: true; value: boolean }).value,
  );
  return {
    ok: true,
    value:
      condition.tipo === "e" ? booleans.every(Boolean) : booleans.some(Boolean),
  };
}
