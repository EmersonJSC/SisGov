// Juros: a taxa sobe quando a dívida passa da tolerância do país.
// Fonte e simplificações em calculos.md.

export interface ParametrosJuros {
  /** Juro real neutro, em % ao ano. Declarado pelo país. */
  neutro: number;
  /** Dívida (% do PIB) a partir da qual o mercado cobra prêmio. Declarada pelo país. */
  tolerancia_divida: number;
}

/** Pontos percentuais de prêmio por ponto de dívida acima da tolerância. */
export const PREMIO_POR_PONTO = 0.05;

/** Fração do caminho até a taxa-alvo andada a cada turno. */
export const AJUSTE_POR_TURNO = 0.2;

/** Taxa nominal que o mercado cobra, em % ao ano. */
export function taxaAlvo(
  divida: number,
  inflacao: number,
  parametros: ParametrosJuros,
): number {
  const excesso = Math.max(0, divida - parametros.tolerancia_divida);
  return parametros.neutro + inflacao + PREMIO_POR_PONTO * excesso;
}

/** Taxa do próximo turno: anda uma parte do caminho até o alvo. */
export function proximaTaxa(atual: number, alvo: number): number {
  return Math.max(0, atual + AJUSTE_POR_TURNO * (alvo - atual));
}
