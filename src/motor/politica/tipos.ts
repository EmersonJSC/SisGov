// Tipos do Congresso (passo 3). Comportamento em politica.md.
import type { ClasseLei, ValorLei } from "../leis";

export interface Partido {
  id: string;
  cadeiras: number;
  /** Grupos que o partido representa e o peso de cada um. */
  defende: Record<string, number>;
  /** Fração da bancada que segue o partido (0 a 1); o resto vota livre. */
  coesao?: number;
  /** Quanto o partido liga para as contas públicas (0 a 1). */
  contas?: number;
}

/** Leis do mundo que o Congresso lê; o país diz quais são pelo id. */
export interface LeisDoCongresso {
  /** Quórum das votações. */
  quorum?: string;
  /** Poder de decreto (opções em ordem crescente de alcance). */
  decreto?: string;
  /** Cargos de livre nomeação (reserva da moeda "cargos"). */
  cargos?: string;
  /** Emendas dos parlamentares (reserva da moeda "emenda"). */
  emendas?: string;
}

export interface Congresso {
  partidos: Partido[];
  /** Partido do jogador. */
  governo: string;
  /** Fração das cadeiras que os votos sim precisam passar (0,5 = metade). */
  maioria: number;
  /** Cadeiras de cada partido no Senado; sem isto o país tem só a Câmara. */
  senado?: Record<string, number>;
  /** Leis que cada casa vota por turno; as demais esperam na fila. */
  carga?: number;
  leis?: LeisDoCongresso;
  /**
   * O que vale para o papel de lei que o presidente ignora até o prazo:
   * sanção tácita (padrão) ou veto tácito.
   */
  ignorar?: "sancao" | "veto";
}

export type Voto = "sim" | "nao";
export type Casa = "camara" | "senado";

export const MOEDAS = [
  "ceder",
  "cargos",
  "emenda",
  "promessa",
  "ministerio",
] as const;
export type Moeda = (typeof MOEDAS)[number];

export interface PedidoMudarLei {
  tipo: "mudar_lei";
  lei: string;
  valor: ValorLei;
}

/** Oferece uma moeda a um partido para uma lei que está na pauta. */
export interface PedidoOferecer {
  tipo: "oferecer";
  lei: string;
  moeda: Moeda;
  /** Quem recebe; "ceder" vale para a lei inteira e não precisa. */
  partido?: string;
  /** Na moeda "promessa": a lei que o governo promete ao partido. */
  promessa?: { lei: string; valor: ValorLei };
}

export interface PedidoDecretar {
  tipo: "decretar";
  lei: string;
  valor: ValorLei;
}

/** Veta uma lei que chegou emendada à mesa. */
export interface PedidoVetar {
  tipo: "vetar";
  lei: string;
  observacao?: string;
}

/** Assina a lei emendada que está na mesa. */
export interface PedidoAssinar {
  tipo: "assinar";
  lei: string;
}

/** Convida um partido da oposição para a base. */
export interface PedidoConvidar {
  tipo: "convidar";
  partido: string;
}

export type PedidoCongresso =
  | PedidoMudarLei
  | PedidoOferecer
  | PedidoDecretar
  | PedidoVetar
  | PedidoAssinar
  | PedidoConvidar;

export interface Oferta {
  moeda: Moeda;
  partido?: string;
}

export type CasaDaTramitacao = Casa | "camara-volta";

/** Lei em andamento no Congresso. */
export interface Tramitacao {
  lei: string;
  valor: ValorLei;
  casa: CasaDaTramitacao;
  /** Turno em que a casa pode votar. */
  desde: number;
  ofertas: Oferta[];
}

export interface Promessa {
  partido: string;
  lei: string;
  valor: ValorLei;
  /** Turno em que o prazo acaba. */
  prazo: number;
}

export interface Decreto {
  lei: string;
  valor: ValorLei;
  antes: ValorLei | undefined;
  /** Turno em que o Congresso confirma ou derruba; null = sem confirmação. */
  confirmaEm: number | null;
}

/** O que o Congresso guarda de turno a turno (motor/politica). */
export interface EstadoCongresso {
  /** Relação do governo com cada partido, 0 a 100. */
  termometro: Record<string, number>;
  /** Quanto cada partido já aprendeu a cobrar; encarece a próxima moeda. */
  preco: Record<string, number>;
  /** Quanto cada casa aguenta ser atropelada, 0 a 100. */
  paciencia: Record<Casa, number>;
  pauta: Tramitacao[];
  /** Lei emendada esperando assinatura ou veto. */
  sancao: Tramitacao[];
  /** Lei derrotada: só volta a ser proposta neste turno ou depois. */
  barradas: { lei: string; ate: number }[];
  promessas: Promessa[];
  decretos: Decreto[];
  cargosUsados: number;
  emendasUsadas: number;
}

export interface Votacao {
  lei: string;
  valor: ValorLei;
  /** Perdeu a maioria por causa da conta da lei. */
  exorbitante: boolean;
  /** Voto da parte fiel de cada partido; vazio quando não há Congresso. */
  votos: Record<string, Voto>;
  /** Voto dos livres, só nos partidos em que difere do fiel. */
  livres?: Record<string, Voto>;
  sim: number;
  nao: number;
  /** Cadeiras de partidos perto do zero (podem mudar com uma moeda). */
  indecisos?: number;
  /** Total de cadeiras da casa. */
  total?: number;
  /** Fração de sim que a lei precisava. */
  quorum?: number;
  classe?: ClasseLei;
  casa?: Casa;
  origem?:
    | "pedido"
    | "emenda"
    | "volta"
    | "decreto"
    | "decreto-derrubado"
    | "derrubada-do-veto";
  /** Nota de cada partido, −1 a +1. */
  notas?: Record<string, number>;
  /** Passou nesta votação. */
  aprovada: boolean;
  /** O valor da lei muda já (última casa sem emenda, decreto, sanção). */
  muda_lei: boolean;
  observacao?: string;
}
