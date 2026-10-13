/** Formato dos dados do Congresso (V1-11, docs/v1/desenho/congresso.md). */
import type { PontoDaBussola } from "../bussola";

/** `mundo/congresso.json`: regras que valem para todo país. */
export type RegrasDoCongresso = Readonly<{
  tipo: "mundo-congresso";
  versaoEsquema: 1;
  metodo: string;
  /** Peso de cada valor de atributo no ponto do perfil, por eixo. */
  pontoDoPerfil: Readonly<{
    economia: Readonly<Record<string, Readonly<Record<string, number>>>>;
    costumes: Readonly<Record<string, Readonly<Record<string, number>>>>;
  }>;
  /** Quanto a distância na bússola afasta o voto (logit). */
  sensibilidade: number;
  partidoDoJogador: Readonly<{
    fatiaInicial: number;
    bonusDoGoverno: number;
    partidoNovo: number;
  }>;
  trocaTroca: Readonly<{ taxaPorAno: number; turnosPorAno: number }>;
  disposicao: Readonly<{ pesoDoEleitor: number; distanciaZero: number }>;
  influencia: Readonly<{
    minimo: number;
    maximo: number;
    passo: number;
    pesoNaFrente: number;
    pesoDaPressao: number;
    teto: number;
  }>;
  /** Frentes parlamentares: grupos de pressão que votam juntos. */
  frentes: readonly Readonly<{
    id: string;
    nome: string;
    grupos: readonly string[];
  }>[];
  tramitacao: Readonly<{
    adiaSeFaltarAte: number;
    emergenciasPorAno: number;
    prazoDaMedidaProvisoria: number;
    turnosDaPrevisao: number;
    humor: Readonly<{
      urgencia: number;
      emergencia: number;
      medidaProvisoria: number;
      medidaProvisoriaDepoisDaDerrota: number;
      memoria: number;
    }>;
    pedidos: Readonly<{
      chanceMinima: number;
      chanceMaxima: number;
      ministerio: number;
      verba: number;
      apoio: number;
      recusa: number;
      ciume: number;
      verbaEmPctDoPib: number;
    }>;
    fila: Readonly<{
      maximoPorCasa: number;
      apoioMinimo: number;
      prioridadeDaUrgencia: number;
      prioridadeDaEmergencia: number;
    }>;
  }>;
  voto: Readonly<{
    pesoDosSegmentos: number;
    pesoDaBussola: number;
    pesoDaDisposicao: number;
    pesoDasFrentes: number;
    inclinacao: number;
    escalaDosSegmentos: number;
    escalaDaBussola: number;
    escalaDasFrentes: number;
    disciplinaDoJogador: number;
  }>;
}>;

export type BancadaDaBussola = Readonly<{
  id: string;
  nome: string;
  /** Partidos de `bussola/referencias.json` que dão o ponto. */
  referencias: readonly string[];
}>;

export type GrupoDaProva = Readonly<{
  id: string;
  bancadas: readonly string[];
  camara: Readonly<{ cadeiras: number; partidos: string }>;
  senado: Readonly<{ cadeiras: number; partidos: string }>;
}>;

/** `bussola/congresso.json`: as bancadas e a eleição real que serve de prova. */
export type CongressoDaBussola = Readonly<{
  tipo: "congresso-bussola";
  versaoEsquema: 1;
  metodo: string;
  bancadas: readonly BancadaDaBussola[];
  prova: Readonly<{
    pais: string;
    tolerancia: number;
    fontes: readonly string[];
    grupos: readonly GrupoDaProva[];
  }>;
}>;

/** Uma bancada pronta: o ponto já calculado. */
export type Bancada = Readonly<{
  id: string;
  nome: string;
  ponto: PontoDaBussola;
}>;

/** Um perfil do eleitorado, lido do pacote. */
export type PerfilDoEleitor = Readonly<{
  peso: number;
  atributos: Readonly<Record<string, string>>;
  segmentos: readonly string[];
  ponto: PontoDaBussola;
}>;

/** Cadeiras de cada bancada (e do partido do jogador) numa casa. */
export type Cadeiras = Readonly<Record<string, number>>;

export type TrocaDeCadeiras = Readonly<{
  turno: number;
  casa: string;
  /** Cadeiras ganhas (+) ou perdidas (−) por bancada. */
  saldo: Cadeiras;
}>;

export type EstadoDoCongresso = Readonly<{
  /** Cadeiras por casa. */
  casas: Readonly<Record<string, Cadeiras>>;
  /**
   * As mesmas cadeiras sem arredondar: o troca-troca anda aqui, para que
   * mudanças pequenas se acumulem de um ano para o outro.
   */
  exatas: Readonly<Record<string, Readonly<Record<string, number>>>>;
  /**
   * Pontos de disposição que cada bancada ganhou ou perdeu com o governo
   * (acordos, urgências, medidas provisórias; V1-12). Somem aos poucos.
   */
  humor: Readonly<Record<string, number>>;
  /** Fator de influência de cada grupo de pressão (1 = os recursos dele). */
  influencia: Readonly<Record<string, number>>;
  trocas: readonly TrocaDeCadeiras[];
}>;

/** Id do partido do jogador nas cadeiras. */
export const JOGADOR = "jogador";
