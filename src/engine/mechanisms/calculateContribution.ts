import type { ValidationResult } from "../diagnostics/contentDiagnostic";
import type { GraphRelation } from "../graph/buildGraph";

/** Resultado de uma relação, com o que é preciso para explicá-la ao jogador. */
export type Contribution = Readonly<{
  relationId: string;
  mechanism: GraphRelation["mechanism"];
  /** Valor da origem como está no nó. */
  sourceValue: number;
  /** Valor que entrou no mecanismo (igual à origem, ou a razão normalizada). */
  inputValue: number;
  /** Valor do divisor, quando há normalização. */
  divisorValue?: number;
  value: number;
}>;

function failure(field: string, message: string): ValidationResult<never> {
  return {
    ok: false,
    diagnostics: [
      { code: "CALCULO_INVALIDO", file: "$execucao", field, message },
    ],
  };
}

/** Aplica o mecanismo da relação a uma entrada já normalizada. */
function applyMechanism(
  relation: GraphRelation,
  x: number,
): ValidationResult<number> {
  const p = relation.parameters;
  switch (relation.mechanism) {
    case "afim":
      return { ok: true, value: x * p.coeficiente! + p.termoConstante! };
    case "saturacao":
      if (x < 0)
        return failure(
          "origem",
          "Saturação exige origem maior ou igual a zero.",
        );
      return { ok: true, value: p.maximo! * (1 - Math.exp(-x / p.escala!)) };
    case "retornos_decrescentes":
      if (x < 0)
        return failure(
          "origem",
          "Retornos decrescentes exigem origem maior ou igual a zero.",
        );
      return {
        ok: true,
        value: p.coeficiente! * p.escala! * Math.log1p(x / p.escala!),
      };
    case "limiar": {
      const excess = p.direcao === "abaixo" ? p.limiar! - x : x - p.limiar!;
      // Antes do ponto o efeito é exatamente zero (nunca −0).
      return { ok: true, value: excess > 0 ? p.coeficiente! * excess : 0 };
    }
  }
}

/**
 * Calcula a influência de uma relação ativa sem alterar o valor de destino.
 * Determinística: mesma entrada, mesmo resultado (D-39).
 */
export function calculateContribution(
  relation: GraphRelation,
  sourceValue: number,
  readValue: (nodeId: string) => number | undefined,
): ValidationResult<Contribution> {
  if (!Number.isFinite(sourceValue))
    return failure("origem", "O valor de origem deve ser finito.");
  let inputValue = sourceValue;
  let divisorValue: number | undefined;
  if (relation.normalization) {
    divisorValue = readValue(relation.normalization.divisor);
    if (
      divisorValue === undefined ||
      !Number.isFinite(divisorValue) ||
      divisorValue === 0
    )
      return failure(
        "normalizacao.divisor",
        `O divisor ${relation.normalization.divisor} precisa ser finito e diferente de zero.`,
      );
    inputValue =
      (sourceValue / divisorValue) *
      (relation.normalization.multiplicador ?? 1);
  }
  const applied = applyMechanism(relation, inputValue);
  if (!applied.ok) return applied;
  if (!Number.isFinite(applied.value))
    return failure("resultado", "A contribuição calculada não é finita.");
  return {
    ok: true,
    value: {
      relationId: relation.id,
      mechanism: relation.mechanism,
      sourceValue,
      inputValue,
      ...(divisorValue === undefined ? {} : { divisorValue }),
      value: applied.value,
    },
  };
}
