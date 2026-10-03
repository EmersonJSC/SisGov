import type { ValidationResult } from "../diagnostics/contentDiagnostic";
import type { VariableDefinition } from "../model/contentTypes";

export type StockRate = Readonly<{
  relationId: string;
  value: number;
  unit: string;
}>;

export type StockUpdate = Readonly<{
  stockId: string;
  previousValue: number;
  duration: number;
  rates: readonly StockRate[];
  value: number;
}>;

function rateUnitFor(stockUnit: string): string | undefined {
  const units: Record<string, string> = {
    moeda: "moeda_por_passo",
    quantidade: "quantidade_por_passo",
  };
  return units[stockUnit];
}

function failure(
  field: string,
  message: string,
): ValidationResult<StockUpdate> {
  return {
    ok: false,
    diagnostics: [
      { code: "CALCULO_INVALIDO", file: "$execucao", field, message },
    ],
  };
}

/** Atualiza um saldo acumulado pela soma de taxas durante a duração informada. */
export function updateStock(
  stock: VariableDefinition,
  previousValue: number,
  rates: readonly StockRate[],
  duration: number,
): ValidationResult<StockUpdate> {
  if (stock.tipo !== "estoque")
    return failure("estoque", "A variável precisa ser um estoque.");
  if (!Number.isFinite(previousValue))
    return failure("saldoAnterior", "O saldo anterior deve ser finito.");
  if (!Number.isFinite(duration) || duration <= 0)
    return failure("duracao", "A duração deve ser positiva e finita.");
  const expectedRateUnit = rateUnitFor(stock.unidade);
  if (!expectedRateUnit)
    return failure("unidade", `Não há unidade de taxa para ${stock.unidade}.`);
  if (
    rates.some(
      (rate) => !Number.isFinite(rate.value) || rate.unit !== expectedRateUnit,
    )
  ) {
    return failure(
      "taxas",
      `Cada taxa precisa ter unidade ${expectedRateUnit} e valor finito.`,
    );
  }
  const orderedRates = [...rates].sort((left, right) =>
    left.relationId.localeCompare(right.relationId),
  );
  const value =
    previousValue +
    orderedRates.reduce((total, rate) => total + rate.value, 0) * duration;
  if (!Number.isFinite(value))
    return failure("resultado", "O novo saldo não é finito.");
  const { minimo, maximo } = stock.dominio;
  if (
    (minimo !== undefined && value < minimo) ||
    (maximo !== undefined && value > maximo)
  ) {
    return failure("resultado", "O novo saldo está fora do domínio declarado.");
  }
  return {
    ok: true,
    value: {
      stockId: stock.id,
      previousValue,
      duration,
      rates: orderedRates,
      value,
    },
  };
}
