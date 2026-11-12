// A promessa de campanha: meta do mandato, com prêmio pelo tamanho.
import type { TipoGrupo } from "../grupos";
import type { PromessaDeCampanha } from "./tipos";

/** Fração do domínio de um índice que já é uma promessa de tamanho cheio. */
const TAMANHO_CHEIO = 0.3;
/** PromessaDeCampanha de programa: a dificuldade dele é a mesma para todos. */
export const TAMANHO_DE_PROGRAMA = 0.5;
/** Voto a mais (ou a menos) no governo, na promessa cheia cumprida (ou quebrada). */
const EFEITO_MAXIMO = 0.06;
/** Desgaste que uma promessa cheia e quebrada soma. */
const DESGASTE_DA_QUEBRA = 1;
/** Peso da promessa nos grupos que se importam com ela, e nos que não. */
const PESO_DE_QUEM_SE_IMPORTA = 2;
const PESO_DE_QUEM_NAO_SE_IMPORTA = 0.25;

const limitar = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

/** Dificuldade de uma meta de índice: quanto do domínio ela atravessa. */
export function tamanhoDaMeta(
  de: number,
  meta: number,
  dominio: { min: number; max: number },
): number {
  const faixa = dominio.max - dominio.min;
  return faixa > 0
    ? limitar(Math.abs(meta - de) / faixa / TAMANHO_CHEIO, 0, 1)
    : 0;
}

/** Quanto da meta foi cumprido, de 0 a 1 (chegar perto vale em parte). */
export function cumprimento(
  promessa: PromessaDeCampanha,
  atual: number,
): number {
  const total = promessa.meta - promessa.de;
  return total === 0 ? 1 : limitar((atual - promessa.de) / total, 0, 1);
}

/** Voto no governo que a promessa dá (+) ou tira (−): cumprir tudo = +, nada = −. */
export const efeitoDaPromessa = (tamanho: number, cumprido: number): number =>
  tamanho * (2 * cumprido - 1) * EFEITO_MAXIMO;

/** Desgaste que a promessa quebrada soma (nada se foi cumprida pela metade ou mais). */
export const desgasteDaQuebra = (tamanho: number, cumprido: number): number =>
  cumprido < 0.5 ? tamanho * DESGASTE_DA_QUEBRA : 0;

/**
 * Quanto cada grupo sente a promessa: o índice principal pesa em todos; um
 * subíndice, mais em quem o cobra; um programa, mais em quem gostou dele.
 */
export function pesoDoGrupo(
  promessa: PromessaDeCampanha,
  tipo: TipoGrupo,
  principais: readonly string[],
  lembranca: Record<string, number> | undefined,
): number {
  const { alvo } = promessa;
  if (alvo.tipo === "indice" && principais.includes(alvo.id)) return 1;
  const seImporta =
    alvo.tipo === "indice"
      ? tipo.cobra.some((c) => c.indice === alvo.id)
      : lembranca
        ? (lembranca[tipo.id] ?? 0) > 0
        : true;
  return seImporta ? PESO_DE_QUEM_SE_IMPORTA : PESO_DE_QUEM_NAO_SE_IMPORTA;
}
