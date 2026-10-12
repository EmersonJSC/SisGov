/**
 * Medidas de calibragem (V1-07, desenho/rede.md §4). Funções puras sobre
 * séries do mesmo tamanho: `real` (dados) e `simulado` (motor).
 */

export type TheilDecomposition = Readonly<{
  /** Erro quadrático médio. */
  mse: number;
  /** Viés: a rede erra o nível. */
  bias: number;
  /** Variância: a rede oscila mais ou menos que o real. */
  variance: number;
  /** Covariância: ruído que não se explica. bias + variance + covariance = 1. */
  covariance: number;
}>;

const mean = (xs: readonly number[]) =>
  xs.reduce((sum, x) => sum + x, 0) / xs.length;

/** Estatística de Theil decomposta (Sterman 1984). */
export function theilDecomposition(
  real: readonly number[],
  simulated: readonly number[],
): TheilDecomposition {
  if (real.length === 0 || real.length !== simulated.length)
    throw new Error("Séries vazias ou de tamanhos diferentes.");
  const n = real.length;
  const mse = real.reduce((sum, a, i) => sum + (simulated[i] - a) ** 2, 0) / n;
  if (mse === 0) return { mse, bias: 0, variance: 0, covariance: 0 };
  const meanA = mean(real);
  const meanS = mean(simulated);
  const sdA = Math.sqrt(real.reduce((s, a) => s + (a - meanA) ** 2, 0) / n);
  const sdS = Math.sqrt(
    simulated.reduce((s, x) => s + (x - meanS) ** 2, 0) / n,
  );
  const cov =
    real.reduce((s, a, i) => s + (a - meanA) * (simulated[i] - meanS), 0) / n;
  const r = sdA > 0 && sdS > 0 ? cov / (sdA * sdS) : 1;
  return {
    mse,
    bias: (meanS - meanA) ** 2 / mse,
    variance: (sdS - sdA) ** 2 / mse,
    covariance: (2 * (1 - r) * sdS * sdA) / mse,
  };
}

/**
 * Implausibilidade do history matching (Vernon et al. 2010): acima de 3, o
 * conjunto de coeficientes não concorda com o real.
 */
export function implausibility(
  real: number,
  simulated: number,
  realVariance: number,
  modelVariance: number,
): number {
  return Math.abs(real - simulated) / Math.sqrt(realVariance + modelVariance);
}
