/** Tramitação e votação (V1-12, docs/v1/desenho/tramitacao.md). */
import type { PontoDaBussola } from "../bussola";

/** Nível da lei para o Congresso. */
export type NivelNoCongresso =
  "lei-ordinaria" | "lei-complementar" | "emenda" | "decreto" | "petrea";

export type Pressa = "normal" | "urgencia" | "emergencia";

/** Uma votação a fazer: a casa e a rodada (emenda tem duas por casa). */
export type Etapa = Readonly<{ casa: string; rodada: number }>;

/** O que a lei faria, previsto no envio (base do voto das bancadas). */
export type PrevisaoDoProjeto = Readonly<{
  /** Pontos de humor de cada segmento ao fim do horizonte (com − sem). */
  segmentos: Readonly<Record<string, number>>;
  /** Opinião pública: pontos de humor do eleitorado todo (média pelos perfis). */
  opiniao: number;
  /** Ponto do país antes e depois, na bússola. */
  antes: PontoDaBussola;
  depois: PontoDaBussola;
  /** Dano das leis a cada grupo de pressão: depois − antes (−: a lei ajuda). */
  dano: Readonly<Record<string, number>>;
}>;

export type Projeto = Readonly<{
  id: string;
  lei: string;
  nivel: number;
  tipo: Exclude<NivelNoCongresso, "decreto" | "petrea">;
  pressa: Pressa;
  /** O projeto tira a lei do mapa (revogação), em vez de mudar o nível. */
  revogar?: boolean;
  /** Medida provisória: já vale; o que havia antes, para desfazer se cair. */
  medidaProvisoria?: Readonly<{ emVigor: boolean; nivel: number }>;
  enviadoNoTurno: number;
  /** Votações que faltam, na ordem. */
  etapas: readonly Etapa[];
  previsao: PrevisaoDoProjeto;
  /** Pedido de uma bancada esperando a sua resposta. */
  aguardando?: string;
  /** Já houve um pedido por este projeto (só um por projeto). */
  pediu?: boolean;
  /** A votação da etapa atual já foi adiada uma vez (na segunda, cai). */
  adiou?: boolean;
}>;

export type ResultadoDaVotacao = "avancou" | "passou" | "adiou" | "caiu";

export type Votacao = Readonly<{
  turno: number;
  projeto: string;
  lei: string;
  casa: string;
  rodada: number;
  sim: number;
  nao: number;
  quorum: number;
  resultado: ResultadoDaVotacao;
  /** Votos sim e cadeiras de cada bancada. */
  porBancada: Readonly<
    Record<string, Readonly<{ sim: number; cadeiras: number }>>
  >;
}>;

export type TipoDePedido = "ministerio" | "verba" | "apoio";

export type Pedido = Readonly<{
  id: string;
  projeto: string;
  bancada: string;
  tipo: TipoDePedido;
  turno: number;
  /** No pedido de apoio: a lei que a bancada quer na fila. */
  lei?: string;
  nivel?: number;
}>;

/** Fim de um projeto que não passou: caiu ou a medida provisória caducou. */
export type Saida = Readonly<{
  turno: number;
  projeto: string;
  lei: string;
  motivo: "caiu" | "caducou" | "passou";
}>;

export type EstadoDaTramitacao = Readonly<{
  fila: readonly Projeto[];
  votacoes: readonly Votacao[];
  pedidos: readonly Pedido[];
  saidas: readonly Saida[];
  /** Emenda rejeitada só volta no ano seguinte: lei → primeiro turno livre. */
  bloqueadas: Readonly<Record<string, number>>;
  /** Modos emergência usados em cada ano (ano = turno ÷ 4). */
  emergencias: Readonly<Record<string, number>>;
  /** Pedidos respondidos: o que cada bancada ganhou (ou ouviu não). */
  acordos: readonly Acordo[];
  proximoId: number;
}>;

export type Acordo = Readonly<{
  turno: number;
  bancada: string;
  tipo: TipoDePedido;
  aceito: boolean;
}>;

export const tramitacaoVazia: EstadoDaTramitacao = {
  fila: [],
  votacoes: [],
  pedidos: [],
  saidas: [],
  bloqueadas: {},
  emergencias: {},
  acordos: [],
  proximoId: 1,
};
