// Órgãos: um por esfera, sob a caixa dela. A verba vem da lei; a necessidade
// é o trabalho que as leis pedem; verba demais, cargos e ministro desonesto
// viram corrupção interna.
import type { Lei, ValorLei } from "../leis";
import { leiAtiva } from "../leis";
import { leisPorEsfera } from "./indices";
import { fichaDe, caixaDaLei } from "./ministerios";
import type { Caixa, Orgao, RegrasGoverno } from "./tipos";

const MAXIMO = 100;
/** Cada lei ativa a mais na esfera pede esta fração a mais de trabalho. */
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

/** Esferas do mundo, na ordem em que aparecem nas leis. */
export const esferasDoMundo = (leis: Record<string, Lei>): string[] => [
  ...leisPorEsfera(leis).keys(),
];

const daEsfera = (leis: Record<string, Lei>, esfera: string) =>
  leisPorEsfera(leis).get(esfera) ?? [];

/** Verba da esfera hoje: soma das leis de gasto, em % do PIB. */
export function verbaDaEsfera(
  leis: Record<string, Lei>,
  valores: Record<string, ValorLei>,
  esfera: string,
): number {
  return daEsfera(leis, esfera).reduce(
    (soma, l) =>
      l.forma === "continua" && l.conta === "gasto"
        ? soma + ((valores[l.id] as number | undefined) ?? 0) * 100
        : soma,
    0,
  );
}

/** Leis ativas da esfera (valor diferente do mínimo ou do primeiro degrau). */
const leisAtivas = (
  leis: Record<string, Lei>,
  valores: Record<string, ValorLei>,
  esfera: string,
) =>
  daEsfera(leis, esfera).filter(
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
  caixas: Caixa[],
  leis: Record<string, Lei>,
  valores: Record<string, ValorLei>,
  cargos: number,
): Record<string, Orgao> {
  return Object.fromEntries(
    esferasDoMundo(leis).map((esfera) => {
      const { ministro } = caixaDaLei(r, caixas, { id: esfera, esfera });
      return [
        esfera,
        {
          necessidade: verbaDaEsfera(leis, valores, esfera),
          leisBase: leisAtivas(leis, valores, esfera),
          corrupcao: corrupcaoDeEquilibrio(
            cargos,
            fichaDe(r, ministro).honestidade,
          ),
        },
      ];
    }),
  );
}

/** Trabalho que as leis pedem à esfera hoje, na mesma unidade da verba. */
export function necessidadeAgora(
  o: Orgao,
  leis: Record<string, Lei>,
  valores: Record<string, ValorLei>,
  esfera: string,
): number {
  const a_mais = leisAtivas(leis, valores, esfera) - o.leisBase;
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
  esfera: string,
): SituacaoDoOrgao {
  const verba = verbaDaEsfera(leis, valores, esfera);
  const necessidade = necessidadeAgora(o, leis, valores, esfera);
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
  /** Órgãos que cruzaram o limite do escândalo neste turno, com o ministro. */
  escandalos: { esfera: string; ministro: string }[];
}

/**
 * Um turno de corrupção em todos os órgãos. `cargos` é o valor da lei de
 * cargos de livre nomeação, de 0 a 1 da faixa dela.
 */
export function andarOrgaos(
  r: RegrasGoverno,
  caixas: Caixa[],
  leis: Record<string, Lei>,
  valores: Record<string, ValorLei>,
  orgaos: Record<string, Orgao>,
  cargos: number,
): ResultadoDosOrgaos {
  const escandalos: ResultadoDosOrgaos["escandalos"] = [];
  const novos = Object.fromEntries(
    Object.entries(orgaos).map(([esfera, o]) => {
      const ministro = fichaDe(
        r,
        caixaDaLei(r, caixas, { id: esfera, esfera }).ministro,
      );
      const { rendimento } = situacaoDoOrgao(o, leis, valores, esfera);
      const corrupcao = corrupcaoSeguinte(
        o.corrupcao,
        rendimento,
        cargos,
        ministro.honestidade,
      );
      if (o.corrupcao < LIMITE_DO_ESCANDALO && corrupcao >= LIMITE_DO_ESCANDALO)
        escandalos.push({ esfera, ministro: ministro.id });
      return [esfera, { ...o, corrupcao }];
    }),
  );
  return { orgaos: novos, escandalos };
}
