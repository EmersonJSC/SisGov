// Tipos da eleição nova (passo 8). Comportamento em eleicao.md.

/** Uma candidatura: o governo e a coligação dele, ou partidos da oposição juntos. */
export interface Chapa {
  /** Id do maior partido da chapa ("governo" e "oposicao" sem Congresso). */
  id: string;
  partidos: string[];
  governo: boolean;
  /** Quanto a chapa defende cada grupo: soma do que os partidos dela defendem. */
  afinidade: Record<string, number>;
}

/** O que a chapa precisa saber de um partido. */
export interface PartidoEleitoral {
  id: string;
  cadeiras: number;
  defende: Record<string, number>;
}

/** Uma rodada de votos: fração dos votos de cada chapa, no país e em cada grupo. */
export interface Rodada {
  /** Fração dos votos de cada chapa (soma 1). */
  votos: Record<string, number>;
  /** Fração dos votos de cada chapa dentro de cada grupo (soma 1 por grupo). */
  porGrupo: Record<string, Record<string, number>>;
}

export interface AlvoDaPromessa {
  tipo: "indice" | "programa";
  id: string;
}

/** A meta do mandato (R13.11). */
export interface PromessaDeCampanha {
  alvo: AlvoDaPromessa;
  /** Valor do índice quando prometeu (0 num programa). */
  de: number;
  /** Valor prometido (1 num programa). */
  meta: number;
  feitaEm: number;
  /** Dificuldade de 0 a 1: quanto maior, maior o prêmio e o custo. */
  tamanho: number;
}

/** O que a campanha guarda até o fim do mandato. */
export interface EstadoDaCampanha {
  promessa?: PromessaDeCampanha;
  /** Tamanho das promessas trocadas no meio do mandato: cada uma conta como quebrada. */
  quebradas: number[];
  /** Resultado do primeiro turno e o que a promessa pesou nele. */
  primeiro?: { rodada: Rodada; promessa: number };
}

/** O jogador promete uma meta, ou troca a que tinha (e quebra a antiga). */
export interface PedidoPrometer {
  tipo: "prometer";
  alvo: AlvoDaPromessa;
  /** Valor que promete atingir (só para índice). */
  meta?: number;
}
