// O jornal do turno: as notícias de maior impacto, tiradas da mesa de fatos.
import { forcaDoFato, type Fato, type Tamanho, type TipoFato } from "../fatos";

/** Quantas notícias o jornal traz. */
export const NOTICIAS_NO_JORNAL = 3;

const PESO_DO_TAMANHO: Record<Tamanho, number> = {
  pequeno: 1,
  medio: 2,
  grande: 3,
};

/** O quanto cada tipo de fato rende de notícia; o que não está aqui vale 1. */
const PESO_DO_TIPO: Partial<Record<TipoFato, number>> = {
  "eleicao-vencida": 3,
  "eleicao-perdida": 3,
  escandalo: 2.5,
  "manchete-contra": 1.5,
  "programa-formado": 1.5,
  "segundo-turno": 2.5,
  "meta-quebrada": 1.5,
  "meta-cumprida": 1.2,
  "veto-derrubado": 1.3,
  "decreto-derrubado": 1.3,
  "partido-saiu-da-base": 1.3,
  "ministro-demitido": 1.2,
  decreto: 1.2,
  "papel-assinado": 0.5,
  "papel-ignorado": 0.5,
  "ministro-nomeado": 0.7,
};

/** Impacto da notícia: tamanho × quanto ainda é novidade × o apelo do tipo. */
export function impactoDoFato(fato: Fato): number {
  return (
    PESO_DO_TAMANHO[fato.tamanho] *
    forcaDoFato(fato) *
    (PESO_DO_TIPO[fato.tipo] ?? 1)
  );
}

/**
 * O jornal do turno: só o que aconteceu agora, do maior impacto para o menor.
 * Empate fica na ordem em que os fatos foram escritos.
 */
export function jornalDoTurno(
  fatos: readonly Fato[],
  turno: number,
  quantas = NOTICIAS_NO_JORNAL,
): Fato[] {
  return fatos
    .filter((f) => f.turno === turno)
    .map((fato, ordem) => ({ fato, ordem, impacto: impactoDoFato(fato) }))
    .sort((a, b) => b.impacto - a.impacto || a.ordem - b.ordem)
    .slice(0, quantas)
    .map((n) => n.fato);
}
