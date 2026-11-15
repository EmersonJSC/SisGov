// O que não muda durante a partida: leis do mundo, domínio dos índices e
// parâmetros do país. Monta-se em partida/ a partir do conteúdo.
import type { IdBase, ParametrosJuros, ParametrosRenda } from "../calculos";
import type { Deriva } from "../deriva";
import type { TipoGrupo } from "../grupos";
import type { Colisao, Lei } from "../leis";
import type { MercadoDoPais } from "../mercado";
import type { RegraDaMoradia } from "../moradia";
import type { RegraDoAtendimento } from "../atendimento";
import type { RegraDoSaneamento } from "../saneamento";
import type { Potencia } from "../mundo";
import type { PedidoNomear, RegrasGoverno } from "../governo";
import type { PedidoPrometer } from "../eleicao";
import type { PedidoCarimbar } from "../mesa";
import type { PedidoIndicar, RegrasJudiciario } from "../judiciario";
import type { RegrasMidia } from "../midia";
import type { RegrasProgramas } from "../programas";
import type { Congresso, PedidoCongresso } from "../politica";
import type {
  PopPais,
  RegraDaDemografia,
  RegraDoEmprego,
  TipoPop,
} from "../populacao";
import type { RegrasDoFisco } from "../fisco";

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
  /** Índices de defesa (motor/mundo); se os dois existem, a segurança externa é calculada. */
  indicePoderDefensivo?: string;
  indiceSegurancaExterna?: string;
  /** Produção do país e fornecedores do mundo (motor/mercado); só leitura por ora. */
  mercado?: MercadoDoPais;
  /** Ministros e órgãos; sem ele, as leis chegam como estão escritas (motor/governo). */
  governo?: RegrasGoverno;
  /** Índices principais do mundo: a promessa neles pesa no voto de todos (motor/eleicao). */
  indicesPrincipais?: string[];
  /** Mídias do país; sem elas o jornal sai igual (motor/midia). */
  midia?: RegrasMidia;
  /** Programas do mundo e nomes do país; sem eles, nada se forma (motor/programas). */
  programas?: RegrasProgramas;
  /** Congresso do país; sem ele, todo pedido passa (motor/politica). */
  congresso?: Congresso;
  /** Índices que andam sozinhos, empurrados por outros (motor/deriva). */
  derivas?: Deriva[];
  /** Estoque de casas (motor/moradia); precisa da regra das obras. */
  moradia?: RegraDaMoradia;
  /** Rede de água e esgoto (motor/saneamento); precisa da moradia e das obras. */
  saneamento?: RegraDoSaneamento;
  /** Rede de atendimento (motor/atendimento); precisa das obras. */
  atendimento?: RegraDoAtendimento;
  /** Desempregados e força de trabalho (motor/populacao); sem ela, o desemprego fica o declarado. */
  emprego?: RegraDoEmprego;
  /** Ciclo da vida (motor/populacao, passo E); sem ela, ninguém nasce nem envelhece. */
  demografia?: RegraDaDemografia;
  /** Tribunais, juízes e quem escolhe (motor/judiciario); sem ele, não há Judiciário. */
  judiciario?: RegrasJudiciario;
  /** Papéis das leis de dinheiro (motor/fisco); sem ele, as regras não valem. */
  fisco?: RegrasDoFisco;
  /** Pares de leis que não valem juntas (motor/leis/colisao). */
  colisoes?: Colisao[];
}

export type { PedidoMudarLei } from "../politica";

/** Todo pedido do jogador num turno (motor/politica). */
export type Pedido =
  | PedidoCongresso
  | PedidoCarimbar
  | PedidoNomear
  | PedidoPrometer
  | PedidoIndicar;
