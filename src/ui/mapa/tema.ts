/**
 * Aparência do mapa: cores, ordem das esferas e medidas.
 *
 * Tudo aqui é só da tela. Mudar uma cor ou a ordem das esferas não muda
 * nenhuma relação do motor (regra 6 do projeto).
 */

/** Ordem das esferas no anel, em sentido horário a partir do topo. */
export const ORDEM_MINISTERIOS: readonly string[] = [
  "Ministério da Fazenda",
  "Ministério do Desenvolvimento",
  "Ministério do Meio Ambiente e Infraestrutura",
  "Ministério do Trabalho",
  "Ministério da Previdência",
  "Ministério da Saúde",
  "Ministério da Educação",
  "Ministério dos Direitos e da Defesa",
  "Ministério da Justiça",
  "Casa Civil",
];

const CORES: Readonly<Record<string, string>> = {
  "Ministério da Fazenda": "#2f6bb3",
  "Ministério do Desenvolvimento": "#1d8a86",
  "Ministério do Meio Ambiente e Infraestrutura": "#3f9445",
  "Ministério do Trabalho": "#dd6a2a",
  "Ministério da Previdência": "#b8508a",
  "Ministério da Saúde": "#d33f4e",
  "Ministério da Educação": "#d9921f",
  "Ministério dos Direitos e da Defesa": "#66792c",
  "Ministério da Justiça": "#6f4fb0",
  "Casa Civil": "#8a6a45",
};

const RESERVA = ["#4f7fa8", "#9a5f8f", "#5f8f6b", "#a8774f", "#6a6fb0"];

export function corDoMinisterio(nome: string, indice: number): string {
  return CORES[nome] ?? RESERVA[indice % RESERVA.length];
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
  raioBolhaMaximo: 48,
  /** Grupo social (SG143): medalhão bem maior que as bolhas, que incha
   *  com a satisfação, entre o mínimo e o máximo. */
  raioGrupo: 58,
  raioGrupoMaximo: 104,
  inicioBolhas: 840,
  raioRetratoMinistro: 72,
  raioRetratoPresidente: 105,
} as const;
