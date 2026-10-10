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
  /** Valor do divisor, quando há normalização com divisor. */
  divisorValue?: number;
  /** Valor do fator, quando há normalização com fator (produto, D-50). */
  factorValue?: number;
  /** Valor do fator da escala (custo que reage, D-52). */
  scaleValue?: number;
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

/** Reta entre os dois pontos vizinhos; fora da tabela, o ponto da ponta. */
export function interpolate(
  points: readonly (readonly [number, number])[],
  x: number,
): number {
  if (x <= points[0][0]) return points[0][1];
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i];
    if (x <= x1) {
      const [x0, y0] = points[i - 1];
      return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
    }
  }
  return points[points.length - 1][1];
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
    case "pontos":
      return { ok: true, value: interpolate(p.pontos!, x) };
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
  let factorValue: number | undefined;
  const normalization = relation.normalization;
  if (normalization) {
    if (normalization.divisor !== undefined) {
      divisorValue = readValue(normalization.divisor);
      if (
        divisorValue === undefined ||
        !Number.isFinite(divisorValue) ||
        divisorValue === 0
      )
        return failure(
          "normalizacao.divisor",
          `O divisor ${normalization.divisor} precisa ser finito e diferente de zero.`,
        );
    }
    if (normalization.fator !== undefined) {
      factorValue = readValue(normalization.fator);
      if (factorValue === undefined || !Number.isFinite(factorValue))
        return failure(
          "normalizacao.fator",
          `O fator ${normalization.fator} precisa ser finito.`,
        );
    }
    inputValue =
      ((sourceValue * (factorValue ?? 1)) / (divisorValue ?? 1)) *
      (normalization.multiplicador ?? 1);
  }
  const applied = applyMechanism(relation, inputValue);
  if (!applied.ok) return applied;
  let value = applied.value;
  let scaleValue: number | undefined;
  if (relation.scale) {
    scaleValue = readValue(relation.scale.fator);
    if (scaleValue === undefined || !Number.isFinite(scaleValue))
      return failure(
        "escala.fator",
        `O fator ${relation.scale.fator} precisa ser finito.`,
      );
    value = (value * scaleValue) / relation.scale.referencia;
  }
  if (!Number.isFinite(value))
    return failure("resultado", "A contribuição calculada não é finita.");
  return {
    ok: true,
    value: {
      relationId: relation.id,
      mechanism: relation.mechanism,
      sourceValue,
      inputValue,
      ...(divisorValue === undefined ? {} : { divisorValue }),
      ...(factorValue === undefined ? {} : { factorValue }),
      ...(scaleValue === undefined ? {} : { scaleValue }),
      value,
    },
  };
}
