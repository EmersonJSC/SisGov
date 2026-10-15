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
};

const RESERVA = ["#4f7fa8", "#9a5f8f", "#5f8f6b", "#a8774f", "#6a6fb0"];

export function corDaArea(id: string, indice: number): string {
  return CORES[id] ?? RESERVA[indice % RESERVA.length];
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
