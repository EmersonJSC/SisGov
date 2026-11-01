// O que não muda durante a partida: leis do mundo, domínio dos índices e
// parâmetros do país. Monta-se em partida/ a partir do conteúdo.
import type { IdBase, ParametrosJuros, ParametrosRenda } from "../calculos";
import type { TipoGrupo } from "../grupos";
import type { Lei, ValorLei } from "../leis";
import type { Potencia } from "../mundo";
import type { Congresso } from "../politica";
import type { PopPais, TipoPop } from "../populacao";

export interface ParametrosBase extends ParametrosRenda {
  /** Base cheia como fração do PIB nominal (renda tributável com alíquota zero). */
  parcela_pib: number;
}

export interface ParametrosPais {
  bases: Partial<Record<IdBase, ParametrosBase>>;
  /** Crescimento real ao ano, em %: tendência e desvio do sorteio. */
  crescimento: { tendencia: number; volatilidade: number };
  /** Imposto que ainda não virou lei, em % do PIB (motor/contas). */
  receita_fora_das_leis: number;
  /** Gasto que ainda não virou lei, em % do PIB (motor/contas). */
  gasto_fora_das_leis: number;
  juros: ParametrosJuros;
  /** Parte da população e da renda de cada tipo de pop (motor/populacao). */
  pops: Record<string, PopPais>;
}

export interface Regras {
  leis: Record<string, Lei>;
  /** Domínio de cada índice de jogabilidade. */
  dominios: Record<string, { min: number; max: number }>;
  /** Tipos de pop do mundo. */
  pops: TipoPop[];
  /** Tipos de grupo do mundo. */
  grupos: TipoGrupo[];
  pais: ParametrosPais;
  /** Grandes potências do mundo; sem elas, não há opinião (motor/mundo). */
  potencias?: Potencia[];
  /** Índice que recebe a reputação (média das opiniões das potências). */
  indiceReputacao?: string;
  /** Congresso do país; sem ele, todo pedido passa (motor/politica). */
  congresso?: Congresso;
}

export interface PedidoMudarLei {
  tipo: "mudar_lei";
  lei: string;
  valor: ValorLei;
}

export type Pedido = PedidoMudarLei;
