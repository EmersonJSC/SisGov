/**
 * Aparência do mapa: cores, ordem das esferas e medidas.
 *
 * Tudo aqui é só da tela. Mudar uma cor ou a ordem das esferas não muda
 * nenhuma relação do motor (regra 6 do projeto).
 */

/** Ordem das esferas no anel, em sentido horário a partir do topo. */
export const ORDEM_MINISTERIOS: readonly string[] = [
  "Ministério da Fazenda",
  "Ministério da Economia",
  "Ministério do Trabalho",
  "Ministério da Previdência",
  "Ministério da Saúde",
  "Ministério da Educação",
  "Ministério das Cidades",
  "Ministério do Meio Ambiente",
  "Ministério da Justiça",
  "Ministério dos Direitos Humanos",
  "Ministério da Defesa e Relações Exteriores",
  "Casa Civil",
];

const CORES: Readonly<Record<string, string>> = {
  "Ministério da Fazenda": "#2f6bb3",
  "Ministério da Economia": "#1d8a86",
  "Ministério do Trabalho": "#dd6a2a",
  "Ministério da Previdência": "#b8508a",
  "Ministério da Saúde": "#d33f4e",
  "Ministério da Educação": "#d9921f",
  "Ministério das Cidades": "#7a6a58",
  "Ministério do Meio Ambiente": "#3f9445",
  "Ministério da Justiça": "#6f4fb0",
  "Ministério dos Direitos Humanos": "#c2577a",
  "Ministério da Defesa e Relações Exteriores": "#4d6a2c",
  "Casa Civil": "#8a6a45",
};

/**
 * O tema de cada ministério, como o jogador procura: "onde mexo em
 * impostos?", "onde privatizo?". O título vai na esfera; `faz` explica numa
 * linha o que mora ali.
 */
export const TEMAS: Readonly<
  Record<
    string,
    Readonly<{ titulo: string; curto: string; cargo: string; faz: string }>
  >
> = {
  "Ministério da Fazenda": {
    titulo: "Impostos",
    curto: "Impostos",
    cargo: "Fazenda",
    faz: "Impostos sobre renda, consumo, lucros, herança e fortunas; regra fiscal e fundo soberano.",
  },
  "Ministério da Economia": {
    titulo: "Economia e empresas",
    curto: "Economia",
    cargo: "Economia",
    faz: "Estatizar ou privatizar, juros, câmbio, bancos, preços, indústria, importações e investimento estrangeiro.",
  },
  "Ministério do Trabalho": {
    titulo: "Trabalho e emprego",
    curto: "Trabalho",
    cargo: "Trabalho",
    faz: "Salário mínimo, jornada, CLT, sindicatos, seguro-desemprego, FGTS e aplicativos.",
  },
  "Ministério da Previdência": {
    titulo: "Previdência e assistência",
    curto: "Previdência",
    cargo: "Previdência",
    faz: "Aposentadoria, pensões, benefícios a idosos, transferência de renda e combate à fome.",
  },
  "Ministério da Saúde": {
    titulo: "Saúde",
    curto: "Saúde",
    cargo: "Saúde",
    faz: "Sistema de saúde, piso da saúde, vacinas, remédios, planos de saúde e saúde mental.",
  },
  "Ministério da Educação": {
    titulo: "Educação e ciência",
    curto: "Educação",
    cargo: "Educação",
    faz: "Escolas, universidades, ensino técnico, professores, pesquisa e cultura.",
  },
  "Ministério das Cidades": {
    titulo: "Infraestrutura e cidades",
    curto: "Cidades",
    cargo: "Cidades",
    faz: "Obras, estradas, saneamento, transporte público e moradia popular.",
  },
  "Ministério do Meio Ambiente": {
    titulo: "Meio ambiente e energia",
    curto: "Meio ambiente",
    cargo: "Meio Ambiente",
    faz: "Florestas, licenças, agrotóxicos, carbono, terras indígenas, reforma agrária, petróleo e energia.",
  },
  "Ministério da Justiça": {
    titulo: "Segurança e justiça",
    curto: "Segurança",
    cargo: "Justiça",
    faz: "Polícia, armas, penas, presídios, drogas e crime organizado.",
  },
  "Ministério dos Direitos Humanos": {
    titulo: "Direitos e sociedade",
    curto: "Direitos",
    cargo: "Direitos Humanos",
    faz: "Aborto, casamento, cotas, igualdade, religião, redes sociais, dados pessoais e apostas.",
  },
  "Ministério da Defesa e Relações Exteriores": {
    titulo: "Defesa e exterior",
    curto: "Defesa e exterior",
    cargo: "Defesa e Exterior",
    faz: "Forças Armadas, serviço militar, acordos comerciais, imigração e refugiados.",
  },
  "Casa Civil": {
    titulo: "Instituições e política",
    curto: "Instituições",
    cargo: "Casa Civil",
    faz: "Sistema de governo, eleições, reeleição, Judiciário, imprensa, transparência e corrupção.",
  },
};

/** Título da esfera: o tema ("Impostos"), ou o nome curto do ministério. */
export function temaDoMinisterio(ministerio: string): string {
  return TEMAS[ministerio]?.titulo ?? nomeCurto(ministerio);
}

/** Título curto, para a esfera vista de longe: "Economia", "Cidades". */
export function temaCurto(ministerio: string): string {
  return TEMAS[ministerio]?.curto ?? nomeCurto(ministerio);
}

/** O cargo, curto: "Fazenda", "Casa Civil". */
export function cargoDoMinisterio(ministerio: string): string {
  return TEMAS[ministerio]?.cargo ?? nomeCurto(ministerio);
}

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
  inicioBolhas: 940,
  raioRetratoMinistro: 72,
  raioRetratoPresidente: 105,
} as const;
