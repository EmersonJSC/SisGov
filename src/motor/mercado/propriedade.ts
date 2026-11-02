// Propriedade: o turno das fichas (src/motor/mercado/mercado.md, fatia 8).
// A fatia do Estado e o capital de fora andam rumo ao que as leis dizem; o
// que isso custa ou rende entra no cofre pelas leis gerais (indenização,
// prazo, método de venda, política da estatal, remessa de lucro).
import type { Lei, ValorLei } from "../leis";
import {
  geral,
  interesseDosCompradores,
  moverFicha,
  type Fichas,
  type FichasNoEstado,
} from "./ficha";

/** Parcelas ainda por pagar (um turno por posição) e o fluxo do turno, em % do PIB. */
export interface Propriedade {
  fila: number[];
  receita: number;
  gasto: number;
}

export const SEM_PROPRIEDADE: Propriedade = { fila: [], receita: 0, gasto: 0 };

/** Lucro anual do setor, em fração do valor dele (base da remessa e da estatal). */
const LUCRO_ANUAL = 0.08;
const TURNOS_POR_ANO = 6;
/** Preço de venda: piso e quanto o interesse dos compradores acrescenta. */
const VENDA_BASE = 0.5;
const VENDA_INTERESSE = 0.6;

export interface ResultadoDaPropriedade {
  fichas: FichasNoEstado;
  propriedade: Propriedade;
  opinioes: Record<string, number>;
  /** Fichas com venda travada por falta de comprador neste turno. */
  semComprador: string[];
}

const somarFila = (fila: number[], parcelas: number, total: number) =>
  Array.from({ length: Math.max(fila.length, parcelas) }, (_, i) =>
    (fila[i] ?? 0) + (i < parcelas ? total / parcelas : 0),
  );

/** Um turno de propriedade: move as fichas e fecha o dinheiro do turno. */
export function andarPropriedade(
  fichas: Fichas | undefined,
  leis: Record<string, Lei>,
  vigentes: Record<string, ValorLei>,
  atuais: FichasNoEstado,
  anterior: Propriedade,
  opinioes: Record<string, number>,
): ResultadoDaPropriedade {
  if (!fichas)
    return {
      fichas: atuais,
      propriedade: SEM_PROPRIEDADE,
      opinioes,
      semComprador: [],
    };
  const g = (p: Parameters<typeof geral>[3], chave: string, padrao: number) =>
    geral(fichas, leis, vigentes, p, chave, padrao);
  const interesse = interesseDosCompradores(opinioes);
  const novas: FichasNoEstado = {};
  const semComprador: string[] = [];
  let fila = anterior.fila;
  let receita = 0;
  let gasto = 0;
  let susto = 0;
  fichas.fichas.forEach((f) => {
    const atual = atuais[f.id];
    if (!atual) return;
    const m = moverFicha(fichas, f, atual, leis, vigentes, interesse);
    novas[f.id] = { ...atual, fatia: m.fatia, estrangeiro: m.estrangeiro };
    if (m.semComprador) semComprador.push(f.id);
    if (m.delta > 0) {
      // Estatização: indenização no prazo da lei; confisco assusta quem investe.
      const total = m.delta * f.valor * g("indenizacao", "pagar", 1);
      fila = somarFila(fila, Math.max(1, g("prazo", "parcelas", 1)), total);
      susto += m.delta * g("indenizacao", "susto", 0) * (1 + atual.estrangeiro);
    }
    if (m.delta < 0) {
      // Venda: o comprador paga pelo interesse que tem; o método tira a sua parte.
      const preco = VENDA_BASE + VENDA_INTERESSE * interesse;
      receita += -m.delta * f.valor * preco * g("metodo", "receita", 1);
    }
    // Fluxos de todo turno, só o que mudou contra o turno 0 (o país já os tem).
    const deEstado = (m.fatia - atual.fatia0) * f.valor * LUCRO_ANUAL;
    gasto -= (deEstado * g("politica", "cofre", 0)) / TURNOS_POR_ANO;
    receita +=
      ((m.estrangeiro - atual.estrangeiro0) *
        f.valor *
        LUCRO_ANUAL *
        g("remessa", "imposto", 0)) /
      TURNOS_POR_ANO;
    gasto +=
      ((m.estrangeiro - atual.estrangeiro0) *
        f.valor *
        LUCRO_ANUAL *
        g("fabrica_de_fora", "custo", 0)) /
      TURNOS_POR_ANO;
    gasto +=
      (f.valor * LUCRO_ANUAL * g("antitruste", "custo", 0) * (1 - m.fatia)) /
      TURNOS_POR_ANO;
  });
  // A parcela deste turno sai agora; o resto fica para os próximos.
  gasto += fila[0] ?? 0;
  fila = fila.slice(1);
  const abertura = g("acordo", "opiniao", 0);
  const novasOpinioes = Object.fromEntries(
    Object.entries(opinioes).map(([id, o]) => [
      id,
      Math.min(100, Math.max(0, o - susto + abertura)),
    ]),
  );
  return {
    fichas: novas,
    propriedade: { fila, receita, gasto },
    opinioes: novasOpinioes,
    semComprador,
  };
}
