// Formato da lei (passo 3, aprovado em 31/out/2026). O JSON fica em
// src/conteudo/mundo/leis/<id>.json; o motor só conhece este formato.
import type { IdBase } from "../calculos";
import type { Estrato } from "../populacao";

export const FORCAS = ["fraca", "media", "forte"] as const;
export type Forca = (typeof FORCAS)[number];

/**
 * Eixos da bússola. Para somar um eixo, acrescentar o nome aqui e declarar a
 * posição nos JSONs: a conta anda sobre esta lista.
 * `economico`: esquerda (−) ↔ direita (+); `social`: libertário (−) ↔
 * autoritário (+).
 */
export const EIXOS = ["economico", "social"] as const;
export type Eixo = (typeof EIXOS)[number];

/** Posição na bússola, de −1 a +1; eixo ausente = 0 (motor/grupos). */
export type PontoBussola = Partial<Record<Eixo, number>>;

export const CAMADAS = ["essencial", "jogabilidade"] as const;
export type Camada = (typeof CAMADAS)[number];

/** Efeito de jogabilidade. Receita, PIB e juros vêm do cálculo, não daqui. */
export interface Efeito {
  /** Id de um índice de jogabilidade do mundo. */
  indice: string;
  sentido: 1 | -1;
  forca: Forca;
  /** Turnos (2 meses cada) até o efeito chegar inteiro. */
  atraso_turnos: number;
}

interface LeiBase {
  versao: 1;
  id: string;
  camada: Camada;
}

export interface LeiContinua extends LeiBase {
  forma: "continua";
  /** "fracao": faixa entre 0 e 1. "meses"/"anos": faixa na unidade real. */
  unidade: "fracao" | "meses" | "anos";
  faixa: { min: number; max: number };
  passo: number;
  calculo?: { base: IdBase; modelo: "laffer" };
  /** "gasto": o valor é gasto do governo, em fração do PIB (motor/contas). */
  conta?: "gasto";
  /** Lei de gasto que vira renda de um estrato de pops (motor/populacao). */
  para?: { estrato: Estrato };
  /**
   * Posição na bússola no mínimo da faixa (`min`) e em `ate` (`max`); acima de
   * `ate` a lei fica na ponta. Sem `ate`, vale o máximo da faixa.
   */
  bussola?: { min: PontoBussola; max: PontoBussola; ate?: number };
  efeitos: Efeito[];
}

export interface Opcao {
  id: string;
  /** Posição desta opção na bússola (motor/grupos). */
  bussola?: PontoBussola;
  /** Duração do mandato, na lei de mandato (motor/eleicao). */
  mandato_anos?: number;
  /** Fração da falta paga pelo cofre; o resto vira dívida (motor/contas). */
  deficit_do_cofre?: number;
  /** Fração da sobra que vai ao cofre; o resto abate a dívida (motor/contas). */
  superavit_ao_cofre?: number;
  efeitos: Efeito[];
}

export interface LeiOpcoes extends LeiBase {
  forma: "opcoes";
  opcoes: Opcao[];
}

export type Lei = LeiContinua | LeiOpcoes;
