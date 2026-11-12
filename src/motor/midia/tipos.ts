// Tipos da Mídia (passo 7). Comportamento em midia.md.
import type { Fato } from "../fatos";
import type { PontoBussola } from "../leis";

export const DONOS = ["privado", "estatal", "estrangeiro", "rede"] as const;
export type Dono = (typeof DONOS)[number];

/** Uma mídia do país (nome inventado, dono, lado, quem assiste). */
export interface Midia {
  id: string;
  nome: string;
  dono: Dono;
  bussola: PontoBussola;
  /** Fração de cada grupo que assiste, de 0 a 1. */
  audiencia: Record<string, number>;
  /** 0 a 100: quanto o pop acredita no que ela diz. */
  credibilidade: number;
}

export interface RegrasMidia {
  midias: Midia[];
}

export interface EstadoMidia {
  credibilidade: Record<string, number>;
  /** As notícias do último turno, da maior para a menor. */
  jornal: Fato[];
}
