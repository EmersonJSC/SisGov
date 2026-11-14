/**
 * Aparência do mapa: cores dos ministérios e das ligações, e medidas.
 *
 * Tudo aqui é só da tela. Mudar uma cor não muda nenhuma relação do motor.
 */
import type { VisaoPartida } from "../../partida";

const COR_SEM_MINISTERIO = "#666666";
const VOLTA = 360;
/** Saturação e luz das cores dos ministérios (HSL, em %). */
const SATURACAO = 52;
const LUZ = 50;
const HEX = 16;
const CANAL = 255;
const CENTO = 100;

/**
 * Cor do ministério: cada um com um matiz, espalhados pela roda na ordem do
 * anel, para vizinhos ficarem diferentes. Hex, porque o fundo lê em canvas.
 */
export function corDoMinisterio(i: number, total: number): string {
  const h = (i * VOLTA) / Math.max(1, total);
  const s = SATURACAO / CENTO;
  const l = LUZ / CENTO;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const canal = (n: number) =>
    Math.round((l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))) * CANAL)
      .toString(HEX)
      .padStart(2, "0");
  return `#${canal(0)}${canal(8)}${canal(4)}`;
}

/** Cor de uma ligação conforme o efeito é bom ou ruim para o país. */
export const COR_EFEITO = {
  melhora: "#1f9a6a",
  piora: "#d1495b",
  neutro: "#5f7290",
} as const;

/** Medidas do mundo (unidades do SVG, não pixels de tela). */
export const MEDIDAS = {
  raioPresidencia: 405,
  distanciaAnel: 580,
  raioFechada: 170,
  raioFechadaRecuada: 140,
  raioAberta: 380,
  distanciaAberta: 455,
  folgaEsferas: 12,
  raioLei: 23,
  raioLeiRevelada: 19,
  raioBolha: 30,
  /** Bolha no máximo da escala, com o anel (ver intensidade.ts). */
  raioBolhaMaximo: 70,
  /** Grupo social (SG143): medalhão bem maior que as bolhas, que incha
   *  com a satisfação, entre o mínimo e o máximo. */
  raioGrupo: 58,
  raioGrupoMaximo: 104,
  inicioBolhas: 940,
  raioRetratoMinistro: 72,
  raioRetratoPresidente: 105,
} as const;

/** Cor do ministério que cuida da lei; cinza se nenhum cuida (fica com um poder). */
export function corDaLei(visao: VisaoPartida, lei: string): string {
  const h = visao.hierarquia;
  const i = h?.ministros.findIndex((m) => m.id === h.ministroDaLei[lei]) ?? -1;
  return h && i >= 0
    ? corDoMinisterio(i, h.ministros.length)
    : COR_SEM_MINISTERIO;
}
