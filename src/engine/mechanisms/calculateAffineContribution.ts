import type { ValidationResult } from "../diagnostics/contentDiagnostic";
import type { GraphRelation } from "../graph/buildGraph";

export type AffineContribution = Readonly<{
  relationId: string;
  sourceValue: number;
  coefficient: number;
  constant: number;
  value: number;
}>;

function failure(
  field: string,
  message: string,
): ValidationResult<AffineContribution> {
  return {
    ok: false,
    diagnostics: [
      { code: "CALCULO_INVALIDO", file: "$execucao", field, message },
    ],
  };
}

/** Calcula a influência de uma relação ativa sem alterar o valor de destino. */
export function calculateAffineContribution(
  relation: GraphRelation,
  sourceValue: number,
): ValidationResult<AffineContribution> {
  if (relation.mechanism !== "afim") {
    return failure("mecanismo", "A relação não usa o mecanismo afim.");
  }
  if (!Number.isFinite(sourceValue)) {
    return failure("origem", "O valor de origem deve ser finito.");
  }
  const coefficient = relation.parameters.coeficiente;
  const constant = relation.parameters.termoConstante;
  const value = sourceValue * coefficient + constant;
  if (!Number.isFinite(value)) {
    return failure("resultado", "A contribuição calculada não é finita.");
  }
  return {
    ok: true,
    value: {
      relationId: relation.id,
      sourceValue,
      coefficient,
      constant,
      value,
    },
  };
}
