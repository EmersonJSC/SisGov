// Base "renda": imposto sobre a renda com curva de Laffer e evasão.
// Fonte e simplificações em calculos.md.

export interface ParametrosRenda {
  /** Alíquota (fração) em que a arrecadação para de crescer. Declarada pelo país. */
  pico: number;
  /** Fração da base que escapa do fisco. Declarada pelo país. */
  evasao: number;
}

export const PADRAO_RENDA: ParametrosRenda = { pico: 0.6, evasao: 0.1 };

/** Elasticidade da renda tributável que põe o pico da curva em `pico`. */
export function elasticidadeDoPico(pico: number): number {
  return (1 - pico) / pico;
}

/**
 * Arrecadação na moeda do país.
 * @param aliquota fração (0,275 = 27,5%)
 * @param renda renda tributável com alíquota zero, na moeda do país
 */
export function arrecadacaoRenda(
  aliquota: number,
  renda: number,
  parametros: ParametrosRenda = PADRAO_RENDA,
): number {
  if (aliquota <= 0 || renda <= 0) return 0;
  if (aliquota >= 1) return 0;
  const e = elasticidadeDoPico(parametros.pico);
  const baseDeclarada = renda * Math.pow(1 - aliquota, e);
  return aliquota * baseDeclarada * (1 - parametros.evasao);
}
