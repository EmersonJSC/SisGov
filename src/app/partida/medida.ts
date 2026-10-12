import type { VariableMeasure } from "../../engine";

/**
 * Valor do motor (0 a 100) na medida real do índice (V1-07): reta entre
 * `zero` e `cem`. Sem balizas, o valor do motor já está na unidade.
 */
export function valorNaMedida(medida: VariableMeasure, valor: number): number {
  if (medida.zero === undefined || medida.cem === undefined) return valor;
  return medida.zero + ((medida.cem - medida.zero) * valor) / 100;
}
