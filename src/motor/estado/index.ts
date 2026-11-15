// Estado da partida e índices essenciais. Os essenciais são do motor; os de
// jogabilidade ficam no JSON do mundo. Unidade de cada um em
// src/conteudo/mundo/indicadores/variaveis.json.
import type { Acaso } from "../acaso";
import type { Tesouro } from "../contas";
import type { EfeitoEmCurso } from "../efeitos";
import type { Eleicao } from "../eleicao";
import type { Grupo, Marco } from "../grupos";
import type { PontoBussola, ValorLei } from "../leis";
import type { Fato } from "../fatos";
import type { EstadoGoverno } from "../governo";
import type { EstadoDaCampanha } from "../eleicao";
import type { EstadoMidia } from "../midia";
import type { EstadoProgramas } from "../programas";
import type { PapelDaMesa } from "../mesa";
import type { EstadoJudiciario } from "../judiciario";
import type { EstadoCongresso } from "../politica";
import type { MoradiaNoEstado } from "../moradia";
import type { AtendimentoNoEstado } from "../atendimento";
import type { SaneamentoNoEstado } from "../saneamento";
import type { Votacao } from "../politica";
import type {
  CapacidadeNoEstado,
  ConstrucoesNoEstado,
  Preco,
} from "../mercado";
import type { Pop } from "../populacao";

export const INDICES_ESSENCIAIS = [
  "populacao",
  "ocupados",
  "desemprego",
  "pib",
  "crescimento_real",
  "indice_precos",
  "inflacao",
  "pib_nominal",
  "arrecadacao",
  "gasto_publico",
  "juros_pagos",
  "resultado_primario",
  "resultado_fiscal",
  "cofre",
  "divida_publica",
  "taxa_juros",
] as const;

export type IdIndiceEssencial = (typeof INDICES_ESSENCIAIS)[number];

export type IndicesEssenciais = Record<IdIndiceEssencial, number>;

/** Tudo o que muda de turno a turno. Nunca alterado no lugar. */
export interface Estado {
  /** Turnos jogados (2 meses cada). */
  turno: number;
  acaso: Acaso;
  essenciais: IndicesEssenciais;
  /** Cofre e dívida na moeda do país; os essenciais mostram em % do PIB. */
  tesouro: Tesouro;
  jogabilidade: Record<string, number>;
  /** Os índices de jogabilidade nos últimos turnos, o mais recente primeiro: a tela mede a tendência por eles. */
  anteriores?: Record<string, number>[];
  /** Jogabilidade sem as leis: o que sobra tirando as contribuições. */
  base: Record<string, number>;
  leis: Record<string, ValorLei>;
  efeitos: EfeitoEmCurso[];
  /** Pops por id do tipo (motor/populacao). */
  pops: Record<string, Pop>;
  /** Grupos por id do tipo (motor/grupos). */
  grupos: Record<string, Grupo>;
  /**
   * Quanto cada pop andou na bússola desde o começo (motor/grupos); ausente
   * em partida salva antes do deslize = zero.
   */
  deslize?: Record<string, PontoBussola>;
  /**
   * Quem subiu ou desceu de estrato: fração da população que entrou (+) ou
   * saiu (−) de cada pop (motor/populacao); ausente = ninguém mudou.
   */
  migracao?: Record<string, number>;
  /** Setores de cada pop hoje (estudo muda); sem isso vale o declarado. */
  setores?: Record<string, Record<string, number>>;
  /** Turno 0, referência dos grupos. */
  marco: Marco;
  /** Opinião de cada potência sobre o país, 0 a 100 (motor/mundo). */
  opinioes: Record<string, number>;
  /** Preço do mundo por produto (motor/mercado); vazio sem mercado. */
  precos: Record<string, Preco>;
  /** Capacidade pronta e obras de cada fonte (motor/mercado); vazio sem mercado. */
  capacidade: CapacidadeNoEstado;
  /**
   * Construções dos setores e fila de obras (motor/mercado, 12b); ausente sem
   * regra das obras no mundo ou em partida salva antes dela.
   */
  construcoes?: ConstrucoesNoEstado;
  /** Estoque de casas (motor/moradia); ausente sem a regra ou em partida salva antes dela. */
  moradia?: MoradiaNoEstado;
  /** Juízes e vagas de cada tribunal (motor/judiciario); ausente sem Judiciário ou em partida salva antes dele. */
  judiciario?: EstadoJudiciario;
  /** Leis com pedido de revogar em tramitação: aprovadas, voltam a "não legislada". */
  revogacoes?: string[];
  /**
   * Regra fiscal deste turno (motor/fisco): regras estouradas e o que a
   * punição faz (corte das verbas, trava de aumento). Ausente sem as regras.
   */
  fiscal?: { estouros: string[]; corte: number; trava: boolean };
  /** Leis com prazo em vigor: turno em que acabam (motor/leis). */
  prazos?: Record<string, number>;
  /** Quantas vezes cada lei com prazo ou ato já foi usado. */
  usos?: Record<string, number>;
  /** Parte da dívida perdoada por um ato deste turno (sai nas contas). */
  perdao?: number;
  /** Rede de água e esgoto (motor/saneamento); ausente sem a regra ou em partida salva antes dela. */
  saneamento?: SaneamentoNoEstado;
  /** Rede de atendimento (motor/atendimento); ausente sem a regra ou em partida salva antes dela. */
  atendimento?: AtendimentoNoEstado;
  /**
   * O que mudou no último turno, na moeda do país: PIB nominal e dívida.
   * Ausente no turno 0 e em partida salva antes desta função.
   */
  mudanca?: { pib: number; divida: number };
  /** Choques ativos sobre o alvo do preço, por produto (1 = nenhum). */
  choques: Record<string, number>;
  /** Partidos da base do governo (motor/politica). */
  coligacao: string[];
  /** Votações do turno (motor/politica). */
  votacoes: Votacao[];
  /** Pontos que o governo perdeu com o tempo (motor/eleicao). */
  desgaste: number;
  /** Turno em que o mandato atual começou. */
  inicio_mandato: number;
  /** Última eleição, ou null antes da primeira. */
  eleicao: Eleicao | null;
  /** O governo perdeu a eleição: a partida acabou. */
  encerrada: boolean;
  /**
   * Mesa de fatos (motor/fatos): o que aconteceu nos últimos turnos; ausente
   * em partida salva antes dela = mesa vazia.
   */
  fatos?: Fato[];
  /** Termômetro, paciência, pauta e decretos (motor/politica); ausente sem Congresso. */
  congresso?: EstadoCongresso;
  /** Ministros por caixa e corrupção dos órgãos (motor/governo); ausente sem governo. */
  governo?: EstadoGoverno;
  /** Promessa de campanha e primeiro turno (motor/eleicao); ausente = sem promessa. */
  campanha?: EstadoDaCampanha;
  /** Credibilidade das mídias e o jornal do último turno (motor/midia). */
  midia?: EstadoMidia;
  /** Programas formados, em formação e desfeitos (motor/programas); ausente sem programas. */
  programas?: EstadoProgramas;
  /** Papéis na mesa do presidente (motor/mesa); ausente = mesa vazia. */
  mesa?: PapelDaMesa[];
}
