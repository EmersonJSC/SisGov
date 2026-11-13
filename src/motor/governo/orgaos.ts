// Órgãos: um por instituição, sob a caixa que a leva. A verba vem da lei; a necessidade
// é o trabalho que as leis pedem; verba demais, cargos e ministro desonesto
// viram corrupção interna.
import type { Lei, ValorLei } from "../leis";
import { leiAtiva } from "../leis";
import { leisPorInstituicao } from "./indices";
import { caixaDaInstituicao, fichaDe } from "./ministerios";
import type { Caixa, Orgao, RegrasGoverno } from "./tipos";

const MAXIMO = 100;
/** Cada lei ativa a mais na instituição pede esta fração a mais de trabalho. */
const TRABALHO_POR_LEI = 0.05;
/** A necessidade não cai abaixo desta fração da do começo. */
const NECESSIDADE_MINIMA = 0.2;
/** A corrupção que já existe se desfaz esta fração por turno. */
const DESFAZ_POR_TURNO = 0.08;
/** Pontos de corrupção por turno: verba a mais que o trabalho (por 100%), cargos e ministro desonesto. */
const POR_SOBRA = 12;
const POR_CARGOS = 1.2;
const POR_DESONESTIDADE = 1.6;
/** Corrupção que vira escândalo ao cruzar. */
export const LIMITE_DO_ESCANDALO = 60;

const limitar = (v: number) => Math.max(0, Math.min(MAXIMO, v));

/** Instituição sem ministro (independente) se comporta como com um ministro honesto assim. */
const HONESTIDADE_SEM_MINISTRO = 70;

const daInstituicao = (leis: Record<string, Lei>, instituicao: string) =>
  leisPorInstituicao(leis).get(instituicao) ?? [];

/** Honestidade de quem chefia a instituição. */
const honestidadeDoChefe = (
  r: RegrasGoverno,
  caixas: readonly Caixa[],
  instituicao: string,
): { honestidade: number; ministro: string | null } => {
  const caixa = caixaDaInstituicao(r, caixas, instituicao);
  return caixa
    ? {
        honestidade: fichaDe(r, caixa.ministro).honestidade,
        ministro: caixa.ministro,
      }
    : { honestidade: HONESTIDADE_SEM_MINISTRO, ministro: null };
};

/** Verba da instituição hoje: soma das leis de gasto, em % do PIB. */
export function verbaDaInstituicao(
  leis: Record<string, Lei>,
  valores: Record<string, ValorLei>,
  instituicao: string,
): number {
  return daInstituicao(leis, instituicao).reduce(
    (soma, l) =>
      l.forma === "continua" && l.conta === "gasto"
        ? soma + ((valores[l.id] as number | undefined) ?? 0) * 100
        : soma,
    0,
  );
}

/** Leis ativas da instituição (valor diferente do mínimo ou do primeiro degrau). */
const leisAtivas = (
  leis: Record<string, Lei>,
  valores: Record<string, ValorLei>,
  instituicao: string,
) =>
  daInstituicao(leis, instituicao).filter(
    (l) => valores[l.id] !== undefined && leiAtiva(l, valores[l.id]),
  ).length;

/** Corrupção em que o órgão se estabiliza com este ministro e estes cargos. */
export const corrupcaoDeEquilibrio = (cargos: number, honestidade: number) =>
  limitar(
    (cargos * POR_CARGOS +
      ((MAXIMO - honestidade) / MAXIMO) * POR_DESONESTIDADE) /
      DESFAZ_POR_TURNO,
  );

/**
 * Órgãos do começo: a necessidade é a verba de hoje (rendimento 1) e a
 * corrupção já está no equilíbrio do governo de hoje, então nada muda
 * sozinho: só nomear, cargos e verba mexem nela.
 */
export function iniciarOrgaos(
  r: RegrasGoverno,
  caixas: readonly Caixa[],
  leis: Record<string, Lei>,
  valores: Record<string, ValorLei>,
  cargos: number,
): Record<string, Orgao> {
  return Object.fromEntries(
    r.instituicoes.map(({ id }) => [
      id,
      {
        necessidade: verbaDaInstituicao(leis, valores, id),
        leisBase: leisAtivas(leis, valores, id),
        corrupcao: corrupcaoDeEquilibrio(
          cargos,
          honestidadeDoChefe(r, caixas, id).honestidade,
        ),
      },
    ]),
  );
}

/** Trabalho que as leis pedem à instituição hoje, na mesma unidade da verba. */
export function necessidadeAgora(
  o: Orgao,
  leis: Record<string, Lei>,
  valores: Record<string, ValorLei>,
  instituicao: string,
): number {
  const a_mais = leisAtivas(leis, valores, instituicao) - o.leisBase;
  return (
    o.necessidade * Math.max(NECESSIDADE_MINIMA, 1 + TRABALHO_POR_LEI * a_mais)
  );
}

/** Verba ÷ necessidade; sem verba em lei o órgão rende o que rende (1). */
export function rendimentoDoOrgao(verba: number, necessidade: number): number {
  return necessidade > 0 ? verba / necessidade : 1;
}

export interface SituacaoDoOrgao {
  verba: number;
  necessidade: number;
  rendimento: number;
  corrupcao: number;
}

export function situacaoDoOrgao(
  o: Orgao,
  leis: Record<string, Lei>,
  valores: Record<string, ValorLei>,
  instituicao: string,
): SituacaoDoOrgao {
  const verba = verbaDaInstituicao(leis, valores, instituicao);
  const necessidade = necessidadeAgora(o, leis, valores, instituicao);
  return {
    verba,
    necessidade,
    rendimento: rendimentoDoOrgao(verba, necessidade),
    corrupcao: o.corrupcao,
  };
}

/** Corrupção de um órgão no turno seguinte. */
export function corrupcaoSeguinte(
  atual: number,
  rendimento: number,
  cargos: number,
  honestidade: number,
): number {
  const sobra = Math.max(0, rendimento - 1) * POR_SOBRA;
  const desonesto = ((MAXIMO - honestidade) / MAXIMO) * POR_DESONESTIDADE;
  return limitar(
    atual * (1 - DESFAZ_POR_TURNO) + sobra + cargos * POR_CARGOS + desonesto,
  );
}

export interface ResultadoDosOrgaos {
  orgaos: Record<string, Orgao>;
  /** Órgãos que cruzaram o limite do escândalo neste turno, com o ministro (null sem ministro). */
  escandalos: { instituicao: string; ministro: string | null }[];
}

/**
 * Um turno de corrupção em todos os órgãos. `cargos` é o valor da lei de
 * cargos de livre nomeação, de 0 a 1 da faixa dela.
 */
export function andarOrgaos(
  r: RegrasGoverno,
  caixas: readonly Caixa[],
  leis: Record<string, Lei>,
  valores: Record<string, ValorLei>,
  orgaos: Record<string, Orgao>,
  cargos: number,
): ResultadoDosOrgaos {
  const andados = Object.entries(orgaos).map(([instituicao, o]) => {
    const chefe = honestidadeDoChefe(r, caixas, instituicao);
    const { rendimento } = situacaoDoOrgao(o, leis, valores, instituicao);
    const corrupcao = corrupcaoSeguinte(
      o.corrupcao,
      rendimento,
      cargos,
      chefe.honestidade,
    );
    const cruzou =
      o.corrupcao < LIMITE_DO_ESCANDALO && corrupcao >= LIMITE_DO_ESCANDALO;
    return { instituicao, orgao: { ...o, corrupcao }, cruzou, chefe };
  });
  return {
    orgaos: Object.fromEntries(andados.map((a) => [a.instituicao, a.orgao])),
    escandalos: andados
      .filter((a) => a.cruzou)
      .map((a) => ({ instituicao: a.instituicao, ministro: a.chefe.ministro })),
  };
}
