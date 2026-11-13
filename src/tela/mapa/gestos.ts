/**
 * Lê a roda do mouse e o trackpad. No notebook, a pinça e o Ctrl com a roda
 * chegam como `wheel` com `ctrlKey`, e dois dedos movendo chegam como `wheel`
 * em pixels, nos dois eixos; no mouse, a roda dá degraus grandes e inteiros no
 * eixo vertical. Cada um tem o seu gesto: pinça e roda dão zoom, dois dedos
 * arrastam o mapa. Funções puras.
 */
export type Rolagem =
  | Readonly<{ tipo: "zoom"; expoente: number }>
  | Readonly<{ tipo: "arrasto"; dx: number; dy: number }>;

const PIXELS_POR_LINHA = 16;
const MODO_EM_LINHAS = 1;
/** Um clique de roda (100 pixels) dá cerca de 17% de zoom. */
const SENSIBILIDADE_DA_RODA = 0.0016;
/** A pinça manda muitos eventos pequenos e contínuos. */
const SENSIBILIDADE_DA_PINCA = 0.01;
/** Roda de mouse: o degrau é grande; o trackpad manda valores pequenos. */
const MENOR_DEGRAU_DA_RODA = 50;

export function interpretarRolagem(
  e: Readonly<{
    deltaX: number;
    deltaY: number;
    deltaMode: number;
    ctrlKey: boolean;
  }>,
): Rolagem {
  const pixels = e.deltaMode === MODO_EM_LINHAS ? PIXELS_POR_LINHA : 1;
  const dx = e.deltaX * pixels;
  const dy = e.deltaY * pixels;
  if (e.ctrlKey) return { tipo: "zoom", expoente: dy * SENSIBILIDADE_DA_PINCA };
  const roda =
    e.deltaMode === MODO_EM_LINHAS ||
    (dx === 0 && Math.abs(dy) >= MENOR_DEGRAU_DA_RODA && Number.isInteger(dy));
  return roda
    ? { tipo: "zoom", expoente: dy * SENSIBILIDADE_DA_RODA }
    : { tipo: "arrasto", dx, dy };
}
