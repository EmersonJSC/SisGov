// Formato da lei (passo 3, aprovado em 31/out/2026). O JSON fica em
// src/conteudo/mundo/leis/<id>.json; o motor só conhece este formato.
import type { IdBase } from "../calculos";
import type { Estrato } from "../populacao";

export const FORCAS = ["fraca", "media", "forte"] as const;
export type Forca = (typeof FORCAS)[number];

/** Posição na bússola, de −1 a +1; eixo ausente = 0 (motor/grupos). */
export interface PontoBussola {
  /** Esquerda (−) ↔ direita (+). */
  economico?: number;
  /** Verde, libertário (−) ↔ tradicional, autoritário (+). */
  social?: number;
}

export const EIXOS = ["economico", "social"] as const;

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
  unidade: "fracao";
  faixa: { min: number; max: number };
  passo: number;
  calculo?: { base: IdBase; modelo: "laffer" };
  /** "gasto": o valor é gasto do governo, em fração do PIB (motor/contas). */
  conta?: "gasto";
  /** Lei de gasto que vira renda de um estrato de pops (motor/populacao). */
  para?: { estrato: Estrato };
  /** Posição na bússola no mínimo e no máximo da faixa (motor/grupos). */
  bussola?: { min: PontoBussola; max: PontoBussola };
  efeitos: Efeito[];
}

export interface Opcao {
  id: string;
  /** Posição desta opção na bússola (motor/grupos). */
  bussola?: PontoBussola;
  /** Duração do mandato, na lei de mandato (motor/eleicao). */
  mandato_anos?: number;
  efeitos: Efeito[];
}

export interface LeiOpcoes extends LeiBase {
  forma: "opcoes";
  opcoes: Opcao[];
}

export type Lei = LeiContinua | LeiOpcoes;
