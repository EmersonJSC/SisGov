// Tipos dos Programas (passo 6). Comportamento em programas.md.
import type { Lei, ValorLei } from "../leis";
import type { Fato } from "../fatos";
import type { TipoGrupo } from "../grupos";

/** Para onde a lei precisa andar para contar no programa. */
export type Direcao = "sobe" | "desce" | "muda";

/**
 * Quanto a lei precisa andar: "degrau" (um degrau da escada, ou um passo da
 * régua), "ativa" (a lei liga ou desliga) ou uma fração da régua (0,1 = 10%).
 */
export type Minimo = "degrau" | "ativa" | number;

export interface LeiDoPrograma {
  lei: string;
  direcao: Direcao;
  minimo: Minimo;
}

/** As quatro palavras que o gerador usa para dar nome ao programa. */
export interface Palavras {
  tema: string;
  bem: string;
  mal: string;
  publico: string;
}

/** Programa do mundo (aba Programas): um jeito de governar feito de leis. */
export interface Programa {
  id: string;
  nome: string;
  lado: string;
  /** Quantas leis precisam andar para o programa se formar. */
  minimo: number;
  palavras: Palavras;
  leis: LeiDoPrograma[];
}

/** O que o motor lê: programas do mundo, moldes de nome e nomes do país. */
export interface RegrasProgramas {
  programas: Programa[];
  /** "Mais {bem}", "{tema} para {publico}"…; o gerador troca as chaves. */
  moldes: string[];
  /** Nome próprio que o país deu a um programa, por id. */
  nomesDoPais: Record<string, string>;
  /** Programas que o país já tem no começo da partida. */
  formados: FormadoDoPais[];
}

/** Programa que o país já tem no começo, com a lembrança dos grupos se ele quiser dizê-la. */
export interface FormadoDoPais {
  programa: string;
  /** Nota de cada grupo, de −1 a +1; ausente = vem das leis de hoje. */
  lembranca?: Record<string, number>;
}

/** Um programa que já existiu: formado agora ou desfeito (nostalgia). */
export interface VidaDoPrograma {
  situacao: "formado" | "desfeito";
  /** Turno em que ficou assim. */
  desde: number;
  nome: string;
  /** Quanto cada grupo gostou (+) ou detestou (−) do programa, de −1 a +1. */
  lembranca: Record<string, number>;
  /** Valor das leis no começo do mandato em que o programa se formou. */
  referencia: Record<string, ValorLei>;
  /** Quantas vezes o programa se formou. */
  vezes: number;
}

export interface EstadoProgramas {
  /** Mandato (turno em que começou) a que `referencia` pertence. */
  mandato: number;
  /** Valor das leis no começo do mandato: de onde elas "andam". */
  referencia: Record<string, ValorLei>;
  /** Programas com o mínimo cumprido, esperando o ministro mais fraco: turno em que começou. */
  formando: Record<string, number>;
  vidas: Record<string, VidaDoPrograma>;
}

/** Tudo o que um turno de programas lê. */
export interface EntradaProgramas {
  regras: RegrasProgramas;
  estado: EstadoProgramas;
  leis: Record<string, Lei>;
  valores: Record<string, ValorLei>;
  tipos: TipoGrupo[];
  turno: number;
  /** Turno em que o mandato começou. */
  mandato: number;
  /** Turnos a mais que a lei leva por causa do ministro dela (0 se não há governo). */
  atrasoDaLei: (lei: Lei) => number;
}

export interface SaidaProgramas {
  estado: EstadoProgramas;
  fatos: Fato[];
}

/** Como um programa está hoje, para a tela. */
export interface SituacaoDoPrograma {
  id: string;
  /** Leis que já andaram o que o programa pede. */
  andadas: string[];
  /** Leis que ainda não andaram. */
  faltam: string[];
  minimo: number;
}
