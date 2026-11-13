/**
 * Câmera do mapa: o que aparece é um retângulo do mundo, centrado em (cx, cy) e
 * com `w` unidades de largura; a altura vem da proporção da caixa na tela.
 * Funções puras.
 */
export type Vista = Readonly<{ cx: number; cy: number; w: number }>;
export type Caixa = Readonly<{ w: number; h: number }>;
export type Ponto = Readonly<{ x: number; y: number }>;

const METADE = 0.5;
const MARGEM = 1.12;
const ARREDONDAR = 1;

export const alturaDaVista = (v: Vista, c: Caixa) =>
  c.w > 0 ? (v.w * c.h) / c.w : v.w;

export function viewBoxDe(v: Vista, c: Caixa): string {
  const h = alturaDaVista(v, c);
  return [v.cx - v.w * METADE, v.cy - h * METADE, v.w, h]
    .map((n) => n.toFixed(ARREDONDAR))
    .join(" ");
}

/** Ponto do mundo sob um ponto da tela (relativo ao canto da caixa). */
export function mundoDe(v: Vista, c: Caixa, tela: Ponto): Ponto {
  const h = alturaDaVista(v, c);
  return {
    x: v.cx - v.w * METADE + (tela.x / c.w) * v.w,
    y: v.cy - h * METADE + (tela.y / c.h) * h,
  };
}

/** Aproxima ou afasta mantendo o ponto do mundo sob o cursor parado. */
export function zoomEm(
  v: Vista,
  c: Caixa,
  tela: Ponto,
  fator: number,
  limites: Readonly<{ minimo: number; maximo: number }>,
): Vista {
  const w = Math.min(limites.maximo, Math.max(limites.minimo, v.w * fator));
  const razao = w / v.w;
  const alvo = mundoDe(v, c, tela);
  const h = alturaDaVista(v, c);
  const esquerda = alvo.x - (alvo.x - (v.cx - v.w * METADE)) * razao;
  const topo = alvo.y - (alvo.y - (v.cy - h * METADE)) * razao;
  return {
    cx: esquerda + w * METADE,
    cy: topo + alturaDaVista({ ...v, w }, c) * METADE,
    w,
  };
}

/** Vista que mostra todos os pontos, com uma folga. */
export function enquadrarPontos(
  pontos: readonly (Ponto & { raio: number })[],
  c: Caixa,
): Vista {
  const caixa = pontos.reduce(
    (m, p) => ({
      x0: Math.min(m.x0, p.x - p.raio),
      x1: Math.max(m.x1, p.x + p.raio),
      y0: Math.min(m.y0, p.y - p.raio),
      y1: Math.max(m.y1, p.y + p.raio),
    }),
    { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity },
  );
  const proporcao = c.h > 0 ? c.w / c.h : 1;
  const w = Math.max(caixa.x1 - caixa.x0, (caixa.y1 - caixa.y0) * proporcao);
  return {
    cx: (caixa.x0 + caixa.x1) * METADE,
    cy: (caixa.y0 + caixa.y1) * METADE,
    w: w * MARGEM,
  };
}

const FRACAO_DO_MIOLO = 0.9;

/** O miolo do mapa: as bolhas mais perto do centro, sem as soltas lá fora. */
export function miolo<T extends Ponto>(pontos: readonly T[]): T[] {
  const porDistancia = [...pontos].sort(
    (a, b) => Math.hypot(a.x, a.y) - Math.hypot(b.x, b.y),
  );
  return porDistancia.slice(
    0,
    Math.ceil(porDistancia.length * FRACAO_DO_MIOLO),
  );
}
