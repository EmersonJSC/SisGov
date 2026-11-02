// Estado da partida e índices essenciais. Os essenciais são do motor; os de
// jogabilidade ficam no JSON do mundo. Unidade de cada um em
// src/conteudo/mundo/indicadores/variaveis.json.
import type { Acaso } from "../acaso";
import type { Tesouro } from "../contas";
import type { EfeitoEmCurso } from "../efeitos";
import type { Eleicao } from "../eleicao";
import type { Grupo, Marco } from "../grupos";
import type { ValorLei } from "../leis";
import type { Votacao } from "../politica";
import type { Preco } from "../mercado";
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
  /** Jogabilidade sem as leis: o que sobra tirando as contribuições. */
  base: Record<string, number>;
  leis: Record<string, ValorLei>;
  efeitos: EfeitoEmCurso[];
  /** Pops por id do tipo (motor/populacao). */
  pops: Record<string, Pop>;
  /** Grupos por id do tipo (motor/grupos). */
  grupos: Record<string, Grupo>;
  /** Turno 0, referência dos grupos. */
  marco: Marco;
  /** Opinião de cada potência sobre o país, 0 a 100 (motor/mundo). */
  opinioes: Record<string, number>;
  /** Preço do mundo por produto (motor/mercado); vazio sem mercado. */
  precos: Record<string, Preco>;
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
}
