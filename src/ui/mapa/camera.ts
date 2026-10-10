/**
 * Câmera do mapa com limites: o zoom tem mínimo e máximo, e o mapa não pode
 * ser arrastado para fora da sua área.
 */
import type { Limites } from "./layout";

/** Ponto do mundo no centro da tela e escala (pixels por unidade). */
export type Camera = Readonly<{ x: number; y: number; k: number }>;

export type Tela = Readonly<{ largura: number; altura: number }>;

/** Abaixo disto os ícones dos nós deixam de ser reconhecíveis. */
export const ESCALA_MINIMA_ABSOLUTA = 0.2;
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

/**
 * Visão geral: o mapa inteiro, ou o máximo dele que a escala mínima permite,
 * na parte da tela que os painéis laterais deixam livre.
 */
export function visaoGeral(
  limites: Limites,
  tela: Tela,
  ocupado: Ocupado = {},
): Camera {
  const c = enquadrar(limites, {
    largura: tela.largura - (ocupado.esquerda ?? 0) - (ocupado.direita ?? 0),
    altura: tela.altura,
  });
  // a escala final (presa ao mínimo) decide quanto deslocar o centro para o
  // meio da área livre
  const { k } = limitar(c, limites, tela, ocupado);
  const desvio = ((ocupado.esquerda ?? 0) - (ocupado.direita ?? 0)) / 2 / k;
  return limitar({ k, x: c.x - desvio, y: c.y }, limites, tela, ocupado);
}

/** Pixels da tela cobertos por painéis fixos de cada lado. */
export type Ocupado = Readonly<{ esquerda?: number; direita?: number }>;

/**
 * Prende a câmera: zoom entre o mínimo e o máximo, e o mapa sempre dentro da
 * vista. `ocupado` são os pixels cobertos pelos painéis laterais; o mapa pode
 * correr para o lado o bastante para sair de baixo deles.
 */
export function limitar(
  camera: Camera,
  limites: Limites,
  tela: Tela,
  ocupado: Ocupado = {},
): Camera {
  // com painéis abertos, dá para afastar até o mapa caber no que sobra
  const livre = {
    largura: tela.largura - (ocupado.esquerda ?? 0) - (ocupado.direita ?? 0),
    altura: tela.altura,
  };
  const k = Math.min(
    ESCALA_MAXIMA,
    Math.max(escalaMinima(limites, livre), camera.k),
  );
  const meiaLargura = tela.largura / 2 / k;
  const meiaAltura = tela.altura / 2 / k;
  const prender = (valor: number, min: number, max: number, meia: number) =>
    max - min <= meia * 2
      ? (min + max) / 2
      : Math.min(max - meia, Math.max(min + meia, valor));
  // o mapa "ganha" a largura dos painéis: pode passar por baixo deles
  const minX = limites.minX - (ocupado.esquerda ?? 0) / k;
  const maxX = limites.maxX + (ocupado.direita ?? 0) / k;
  return {
    k,
    x: prender(camera.x, minX, maxX, meiaLargura),
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
  /** Pixels cobertos por painéis que o círculo deve evitar. */
  ocupado: Ocupado = {},
): Camera {
  const esquerda = ocupado.esquerda ?? 0;
  const direita = ocupado.direita ?? 0;
  const livre = tela.largura - esquerda - direita;
  const k = Math.min(
    ESCALA_MAXIMA,
    Math.min(livre, tela.altura) / (2 * r * 1.12),
  );
  // desloca o centro para que o círculo fique no meio da área livre
  return { k, x: x + (direita - esquerda) / 2 / k, y };
}
