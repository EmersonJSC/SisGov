/** Formato dos dados da eleição (V1-39, docs/v1/desenho/eleicao.md). */
import type { PontoDaBussola } from "../bussola";

type Eixo = "economia" | "costumes";

/** `mundo/eleicao.json`: o método, igual para todo país. */
export type RegrasDaEleicao = Readonly<{
  tipo: "mundo-eleicao";
  versaoEsquema: 1;
  metodo: string;
  voto: Readonly<{
    pesoEconomico: Readonly<Record<string, number>>;
    escalas: Readonly<Record<string, number>>;
    pesoDoGoverno: number;
    custoDeGovernar: number;
    carisma: number;
    experiencia: number;
    carreira: number;
    convergencia: number;
    pesoDosCostumes: number;
    /** Quanto a distância na bússola afasta o voto na urna presidencial. */
    sensibilidade: number;
    vantagemDoCargo: number;
  }>;
  /** Desvio-padrão (pontos percentuais) da sorte no resultado final. */
  ruido: number;
  pesquisas: Readonly<{ tamanhoDaAmostra: number; viesDoInstituto: number }>;
  estranhamento: Readonly<{
    tolerancia: number;
    pesoNoVoto: number;
    quedaDaDisciplina: number;
    disciplinaMinima: number;
    passoDaIdeologia: number;
  }>;
}>;

export type Ideologia = Readonly<{
  id: string;
  lado: string;
  /** Partidos de `bussola/referencias.json` que dão o centro. */
  referencias: readonly string[];
  carreiras: readonly string[];
  /** A frase em que o próprio personagem se declara (só os mais francos). */
  explicita: string;
}>;

export type Carreira = Readonly<{
  id: string;
  nome: Readonly<{ m: string; f: string }>;
  segmentos: readonly string[];
  experiencia: readonly [number, number];
  carisma: readonly [number, number];
  /** Quanto a carreira puxa a franqueza (−1, 0 ou +1). */
  franqueza: number;
  frase: string;
}>;

export type Opiniao = Readonly<{
  tema: string;
  eixo: Eixo;
  posicao: number;
  /** 1 sutil, 2 clara, 3 explícita. */
  intensidade: number;
  texto: string;
}>;

/** `mundo/personagens.json`: ideologias, carreiras, opiniões e moldes. */
export type MundoDosPersonagens = Readonly<{
  tipo: "mundo-personagens";
  versaoEsquema: 1;
  metodo: string;
  /** Desvio do ponto do personagem em volta do centro da ideologia. */
  desvio: number;
  /** Intensidades que cada franqueza usa. */
  franqueza: Readonly<Record<string, readonly number[]>>;
  /** Quantas frases explícitas (intensidade 3) cada franqueza mostra. */
  explicitasDaFranqueza: Readonly<Record<string, number>>;
  opinioesPorPersonagem: readonly [number, number];
  idade: readonly [number, number];
  molde: string;
  caminhos: readonly string[];
  ideologias: readonly Ideologia[];
  carreiras: readonly Carreira[];
  opinioes: readonly Opiniao[];
}>;

export type PessoaReal = Readonly<{
  id: string;
  nome: string;
  genero: "m" | "f";
  nascimento: number;
  estado: string;
  /** Personalidade de `bussola/referencias.json` que dá o ponto. */
  referencia: string;
  biografia: string;
  /** Cargos de destaque; dão a experiência (até 3). */
  cargos: number;
}>;

/** `paises/<pais>/eleicao.json`: as regras eleitorais do país. */
export type EleicaoDoPais = Readonly<{
  tipo: "pais-eleicao";
  versaoEsquema: 1;
  /** Turnos do mandato até a eleição (a eleição é o último). */
  turnoDaEleicao: number;
  maioria: number;
  segundoTurno: boolean;
  limiteDeMandatos: number;
  campos: readonly Readonly<{ id: string; bancadas: readonly string[] }>[];
  comparecimento: Readonly<{
    atributo: string;
    valores: Readonly<Record<string, number>>;
  }>;
  brancosENulos: number;
  /** Parte de cada casa renovada, alternando de eleição em eleição. */
  renovacao: Readonly<Record<string, readonly number[]>>;
  /** Turnos do mandato com pesquisa publicada. */
  pesquisas: readonly number[];
  /** Turno do mandato em que o partido recebe os nomes para a próxima eleição. */
  turnoDaEscolha: number;
  escolha: Readonly<{ quantidade: number; reais: number }>;
  personagensReais: boolean;
  nomes: Readonly<{ m: readonly string[]; f: readonly string[] }>;
  sobrenomes: readonly string[];
  estados: readonly Readonly<{ nome: string; peso: number }>[];
  reais: readonly PessoaReal[];
  /** Ano do turno 0 (para a idade dos personagens). */
  anoInicial: number;
}>;

/** Um personagem pronto. Lado e ideologia ficam só no motor. */
export type Personagem = Readonly<{
  id: string;
  nome: string;
  real: boolean;
  genero: "m" | "f";
  nascimento: number;
  estado: string;
  carreira: string;
  ponto: PontoDaBussola;
  lado: string;
  ideologia: string;
  carisma: number;
  experiencia: number;
  franqueza: number;
  biografia: string;
  opinioes: readonly string[];
  /** Segmentos que a carreira atrai. */
  segmentos: readonly string[];
}>;

export type Pesquisa = Readonly<{
  turno: number;
  /** Intenção de voto no 1º turno, em % dos válidos, por candidato. */
  primeiro: Readonly<Record<string, number>>;
  /** 2º turno simulado: % do candidato do partido contra cada adversário. */
  segundo: Readonly<Record<string, number>>;
  margem: number;
}>;

export type Rodada = Readonly<{
  /** % dos votos válidos de cada candidato. */
  votos: Readonly<Record<string, number>>;
  comparecimento: number;
}>;

export type ResultadoDaEleicao = Readonly<{
  turno: number;
  mandato: number;
  candidato: Personagem;
  adversarios: readonly Personagem[];
  primeiro: Rodada;
  segundo?: Rodada;
  vencedor: string;
  venceu: boolean;
  /** % do candidato do partido na última rodada, em cada segmento. */
  porSegmento: Readonly<Record<string, number>>;
}>;

export type EstadoDaEleicao = Readonly<{
  partido: Readonly<{
    nome: string;
    sigla: string;
    /** A ideologia do partido (não é a bússola, que é do país). */
    ideologia: PontoDaBussola;
  }>;
  presidente: Personagem;
  /** Mandatos seguidos do presidente atual, contando o de agora. */
  mandatosDoPresidente: number;
  mandato: number;
  inicioDoMandato: number;
  /** Inflação, desemprego e renda no começo do mandato (voto econômico). */
  economiaNoInicio: Readonly<Record<string, number>>;
  adversarios: readonly Personagem[];
  /** Nomes que o partido pode lançar na próxima eleição. */
  opcoes: readonly Personagem[];
  candidato?: Personagem;
  pesquisas: readonly Pesquisa[];
  vies: number;
  /** Chance de as cadeiras do partido votarem com o governo. */
  disciplina?: number;
  resultados: readonly ResultadoDaEleicao[];
  semente: number;
  sorteios: number;
}>;
