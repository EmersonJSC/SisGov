/**
 * Aparência do mapa: cores, ordem das esferas e medidas.
 *
 * Tudo aqui é só da tela. Mudar uma cor ou a ordem das esferas não muda
 * nenhuma relação do motor (regra 6 do projeto).
 */

/**
 * Cor de cada área do governo (D-64). A ordem do anel, os títulos e os
 * ministérios de cada área vêm do conteúdo do país (`politica.json`, campo `ministerios`).
 */
const CORES: Readonly<Record<string, string>> = {
  economia: "#2f6bb3",
  empresas: "#1d8a86",
  trabalho: "#dd6a2a",
  previdencia: "#b8508a",
  saude: "#d33f4e",
  educacao: "#d9921f",
  infraestrutura: "#7a6a58",
  ambiente: "#3f9445",
  seguranca: "#6f4fb0",
  direitos: "#c2577a",
  governo: "#8a6a45",
  // Áreas por assunto (molde-das-leis.md, 2.4), com as cores das antigas.
  "contas-publicas": "#2f6bb3",
  "economia-e-empresas": "#1d8a86",
  "protecao-social": "#b8508a",
  "educacao-e-cultura": "#d9921f",
  "infraestrutura-e-energia": "#7a6a58",
  "ambiente-e-campo": "#3f9445",
  "seguranca-e-defesa": "#6f4fb0",
  "direitos-e-costumes": "#c2577a",
  "governo-e-instituicoes": "#8a6a45",
  propriedade: "#4f7a8c",
  "terra-e-moradia": "#9a7b2f",
};

const RESERVA = ["#4f7fa8", "#9a5f8f", "#5f8f6b", "#a8774f", "#6a6fb0"];

export function corDaArea(id: string, indice: number): string {
  return CORES[id] ?? RESERVA[indice % RESERVA.length];
}

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

/** Nome curto para a esfera: "Ministério da Saúde" vira "Saúde". */
export function nomeCurto(ministerio: string): string {
  return ministerio.replace(/^Ministério (da|do|dos|das|de) /, "");
}

export const COR_PRESIDENCIA = "#1d6b4f";
export const COR_OURO = "#c9a24a";

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
