/**
 * Câmera do mapa com limites: o zoom tem mínimo e máximo, e o mapa não pode
 * ser arrastado para fora da sua área.
 */
import type { Limites } from "./layout";

/** Ponto do mundo no centro da tela e escala (pixels por unidade). */
export type Camera = Readonly<{ x: number; y: number; k: number }>;

export type Tela = Readonly<{ largura: number; altura: number }>;

/** Abaixo disto os ícones dos nós deixam de ser reconhecíveis. */
export const ESCALA_MINIMA_ABSOLUTA = 0.3;
/** Acima disto o mapa vira um punhado de bolhas gigantes. */
export const ESCALA_MAXIMA = 1.35;

export function enquadrar(limites: Limites, tela: Tela, margem = 24): Camera {
  const largura = limites.maxX - limites.minX;
  const altura = limites.maxY - limites.minY;
  const k = Math.min(
    (tela.largura - margem * 2) / largura,
    (tela.altura - margem * 2) / altura,
  );
  return {
    x: (limites.minX + limites.maxX) / 2,
    y: (limites.minY + limites.maxY) / 2,
    k,
  };
}

export function escalaMinima(limites: Limites, tela: Tela): number {
  return Math.min(
    ESCALA_MAXIMA,
    Math.max(ESCALA_MINIMA_ABSOLUTA, enquadrar(limites, tela).k),
  );
}

/** Visão geral: o mapa inteiro, ou o máximo dele que a escala mínima permite. */
export function visaoGeral(limites: Limites, tela: Tela): Camera {
  return limitar(enquadrar(limites, tela), limites, tela);
}

/**
 * Prende a câmera: zoom entre o mínimo e o máximo, e o mapa sempre dentro da
 * vista. `ocupadoDireita` são os pixels cobertos pelo painel lateral; o mapa
 * pode correr para a esquerda o bastante para sair de baixo dele.
 */
export function limitar(
  camera: Camera,
  limites: Limites,
  tela: Tela,
  ocupadoDireita = 0,
): Camera {
  const k = Math.min(
    ESCALA_MAXIMA,
    Math.max(escalaMinima(limites, tela), camera.k),
  );
  const meiaLargura = tela.largura / 2 / k;
  const meiaAltura = tela.altura / 2 / k;
  const prender = (valor: number, min: number, max: number, meia: number) =>
    max - min <= meia * 2
      ? (min + max) / 2
      : Math.min(max - meia, Math.max(min + meia, valor));
  const folga = ocupadoDireita / k;
  return {
    k,
    x:
      limites.maxX - limites.minX + folga <= meiaLargura * 2
        ? (limites.minX + limites.maxX + folga) / 2
        : Math.min(
            limites.maxX + folga - meiaLargura,
            Math.max(limites.minX + meiaLargura, camera.x),
          ),
    y: prender(camera.y, limites.minY, limites.maxY, meiaAltura),
  };
}

/** Aproxima ou afasta mantendo fixo o ponto da tela (px, py). */
export function zoomNoPonto(
  camera: Camera,
  fator: number,
  px: number,
  py: number,
  tela: Tela,
): Camera {
  const mundoX = camera.x + (px - tela.largura / 2) / camera.k;
  const mundoY = camera.y + (py - tela.altura / 2) / camera.k;
  const k = camera.k * fator;
  return {
    k,
    x: mundoX - (px - tela.largura / 2) / k,
    y: mundoY - (py - tela.altura / 2) / k,
  };
}

export function paraTela(camera: Camera, tela: Tela) {
  return `translate(${tela.largura / 2 - camera.x * camera.k}px, ${
    tela.altura / 2 - camera.y * camera.k
  }px) scale(${camera.k})`;
}

/** Câmera que mostra um círculo do mundo dentro de uma área da tela. */
export function focarCirculo(
  x: number,
  y: number,
  r: number,
  tela: Tela,
  /** Pixels ocupados à direita (painel) que o círculo deve evitar. */
  ocupadoDireita = 0,
): Camera {
  const livre = tela.largura - ocupadoDireita;
  const k = Math.min(
    ESCALA_MAXIMA,
    Math.min(livre, tela.altura) / (2 * r * 1.12),
  );
  // desloca o centro para que o círculo fique no meio da área livre
  return { k, x: x + ocupadoDireita / 2 / k, y };
}
