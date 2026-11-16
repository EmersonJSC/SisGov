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

/**
 * Quórum que a lei pede no Congresso (motor/politica): comum (mais sim que
 * não), absoluta (imposto, dívida), constitucional (regras do poder) ou
 * mandato (duração e reeleição). Fora do voto (16/nov): decreto (o
 * presidente muda sem votação) e petrea (nenhuma lei muda).
 */
export const CLASSES = [
  "comum",
  "absoluta",
  "constitucional",
  "mandato",
  "decreto",
  "petrea",
] as const;
export type ClasseLei = (typeof CLASSES)[number];

/**
 * Canal: o caminho por onde a lei chega à vida do pop (plano das leis, 14/nov).
 * imposto (cálculo de arrecadação), verba (gasto que vai à instituição),
 * transferencia (gasto que vira renda de um estrato), preco (preço ou custo de
 * um setor), regra (um módulo lê a lei), direito (muda uma liberdade). Lei
 * cujo canal ainda não existe no motor fica em "espera", com o motivo.
 */
export const CANAIS = [
  "imposto",
  "verba",
  "transferencia",
  "preco",
  "regra",
  "direito",
  "espera",
] as const;
export type Canal = (typeof CANAIS)[number];

/**
 * Jeito: como o jogador mexe na lei (regras de classificação, GDD 4.3).
 * regua (um número), verba (régua de gasto em % do PIB), niveis (escada de 3 a
 * 5 degraus reais) ou escolha (opções sem ordem). Obrigatório depois da triagem.
 */
export const JEITOS = ["regua", "verba", "niveis", "escolha"] as const;
export type Jeito = (typeof JEITOS)[number];

/**
 * Tipo: lei (fica valendo), prazo (acaba sozinha depois de `prazo_turnos` e
 * volta a não legislada) ou ato (acontece uma vez, não fica no mapa).
 */
export const TIPOS = ["lei", "prazo", "ato"] as const;
export type TipoLei = (typeof TIPOS)[number];

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
  /** Ausente = comum. */
  classe?: ClasseLei;
  /** Instituição onde a lei mora (13/nov; o campo ainda se chama esfera). O ministério sai da caixa que leva a instituição. */
  esfera?: string;
  /** Como a lei chega ao pop. */
  canal: Canal;
  /** Só no canal "espera": o que falta ("triagem" até a onda dela, ou a mecânica). */
  espera?: string;
  /** Como o jogador mexe; obrigatório na lei já triada. */
  jeito?: Jeito;
  /** Ausente = lei. */
  tipo?: TipoLei;
  /** Só no tipo "prazo": quantos turnos ela vale antes de voltar a não legislada. */
  prazo_turnos?: number;
}

export interface LeiContinua extends LeiBase {
  forma: "continua";
  /**
   * "fracao": faixa entre 0 e 1. "meses"/"anos": faixa na unidade real.
   * "livre": faixa na unidade de `rotulo_unidade` ("km/h", "mandatos",
   * "% das penas atuais"); o motor só usa a posição na faixa.
   */
  unidade: "fracao" | "meses" | "anos" | "livre";
  /** Nome da unidade na tela; obrigatório na unidade "livre". */
  rotulo_unidade?: string;
  faixa: { min: number; max: number };
  passo: number;
  /**
   * Arrecadação pela base do motor. Com `estrato`, a alíquota cobra só da parte
   * da base que é daquele estrato (ex.: imposto de renda do rico).
   */
  calculo?: { base: IdBase; modelo: "laffer"; estrato?: Estrato };
  /** "gasto": o valor é gasto do governo, em fração do PIB (motor/contas). */
  conta?: "gasto";
  /**
   * Lei de gasto que vira renda de pops: de um estrato, de vários (com o peso
   * de cada um) ou de um pop só, pelo id (motor/populacao).
   */
  para?:
    | { estrato: Estrato }
    | { pesos: Partial<Record<Estrato, number>> }
    | { pop: string };
  /**
   * A lei encolhe uma base de imposto (ex.: "a partir de quanto cobra",
   * desconto por filho): no mínimo da faixa a base fica inteira; no máximo,
   * vale `ate` dela. Com `estrato`, só a parte daquele estrato (motor/calculos).
   */
  encolhe?: { base: IdBase; estrato?: Estrato; ate: number };
  /**
   * A lei muda o gasto de outra lei de verba (ex.: idade mínima e a verba das
   * aposentadorias): o gasto dela é multiplicado por `min` no mínimo da faixa e
   * por `max` no máximo (motor/contas).
   */
  escala_gasto?: { lei: string; min: number; max: number };
  /**
   * Receita enquanto a lei vale, em % do PIB por ano no máximo da faixa (ex.:
   * anistia fiscal traz dívida atrasada). Cai a cada uso repetido (motor/contas).
   */
  arrecada?: number;
  /**
   * Tomadas que a lei liga (ex.: `informal`, `trava_emigrar`): o número vale
   * no máximo da faixa e zero no mínimo (motor/leis/valor › tomada).
   */
  valores?: Record<string, number>;
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
  /**
   * Números que as fichas de setor leem desta opção pelo papel da lei
   * (motor/mercado/ficha); o motor não conhece os nomes das chaves.
   */
  valores?: Record<string, number>;
  efeitos: Efeito[];
}

export interface LeiOpcoes extends LeiBase {
  forma: "opcoes";
  opcoes: Opcao[];
  /**
   * A opção em vigor multiplica o gasto de outra lei de verba pelo número
   * `valores.gasto` dela (motor/contas).
   */
  escala_gasto?: { lei: string };
}

export type Lei = LeiContinua | LeiOpcoes;
