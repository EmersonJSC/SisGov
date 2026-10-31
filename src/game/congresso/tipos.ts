/** Formato dos dados do Congresso (V1-11, docs/v1/desenho/congresso.md). */
import type { PontoDaBussola } from "../bussola";
import type { MemoriaDaPopulacao } from "./memoria";

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
  /** Memória das pessoas (ver `memoria.ts`). */
  memoria: Readonly<{
    /** Parte da lembrança que some a cada turno (0 a 1). */
    esquecimentoPorTurno: number;
    desemprego: Readonly<{
      /** Tags que o motivo carrega, para os outros módulos o reconhecerem. */
      tags: readonly string[];
      /** Pontos de gratidão de quem já foi desempregado e voltou a trabalhar. */
      gratidao: number;
      /** Pontos de desalento de quem está desempregado há muito tempo. */
      desalento: number;
      /** Meses de desemprego em que o desalento chega ao máximo. */
      mesesDoDesalento: number;
    }>;
  }>;
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
      /** Pontos que cada bancada perde quando o jogador tenta mudar uma pétrea. */
      petrea: number;
      /** Pontos de satisfação que cada grupo perde na mesma tentativa. */
      petreaNaPopulacao: number;
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
  /** Pontos de satisfação que o bolso soma ou tira (`bolsoNaSatisfacao`). */
  bolso?: number;
  /** O que a pessoa lembra (`memoria.ts`); sem memória, ausente. */
  memoria?: readonly MotivoDeMemoria[];
}>;

/** Um motivo que veio da memória: já em pontos, com as tags do JSON. */
export type MotivoDeMemoria = Readonly<{
  id: string;
  pontos: number;
  tags: readonly string[];
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
  /**
   * Pessoas já sorteadas, por chave de quem pediu (por exemplo, o post da rede
   * social). Clicar de novo traz a mesma pessoa. Ausente em partida salva
   * antes disso.
   */
  pessoas?: Readonly<Record<string, PessoaSorteada>>;
  /** O que cada linha do eleitorado lembra; ausente em partida antiga. */
  memoria?: MemoriaDaPopulacao;
}>;

/**
 * Uma pessoa tirada de um perfil. Guarda só quem ela é: o que ela pensa vem
 * do perfil, ao vivo, a cada vez que se olha.
 */
export type PessoaSorteada = Readonly<{
  /** Chave de quem pediu a pessoa. */
  chave: string;
  /** Índice do perfil de onde ela saiu (linha fixa do pacote). */
  perfil: number;
  nome: string;
  genero: "m" | "f";
  idade: number;
}>;

/** Id do partido do jogador nas cadeiras. */
export const JOGADOR = "jogador";
