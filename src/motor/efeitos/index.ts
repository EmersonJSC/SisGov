// Fila de efeitos. Cada lei em vigor contribui pontos para índices de
// jogabilidade; ao mudar a lei, a contribuição anda do valor antigo ao novo
// em `atraso_turnos` turnos. Regras em efeitos.md.
import type { Forca, Lei, ValorLei } from "../leis";
import { efeitosDoValor } from "../leis";

/** Pontos (escala 0–100) do efeito inteiro. Aprovado em 31/out/2026. */
export const PONTOS_FORCA: Record<Forca, number> = {
  fraca: 1,
  media: 3,
  forte: 6,
};

export interface EfeitoEmCurso {
  lei: string;
  indice: string;
  /** Contribuição quando a lei mudou. */
  de: number;
  /** Contribuição quando o efeito chegar inteiro. */
  para: number;
  atraso: number;
  /** Turnos desde a mudança. */
  idade: number;
}

/** Contribuição de hoje: anda de `de` a `para` em linha reta. */
export function contribuicao(e: EfeitoEmCurso): number {
  const fracao = e.atraso === 0 ? 1 : Math.min(1, e.idade / e.atraso);
  return e.de + (e.para - e.de) * fracao;
}

function alvos(lei: Lei, valor: ValorLei) {
  const porIndice = new Map<string, { pontos: number; atraso: number }>();
  for (const { efeito, intensidade } of efeitosDoValor(lei, valor)) {
    const atual = porIndice.get(efeito.indice) ?? { pontos: 0, atraso: 0 };
    porIndice.set(efeito.indice, {
      pontos:
        atual.pontos +
        efeito.sentido * PONTOS_FORCA[efeito.forca] * intensidade,
      atraso: Math.max(atual.atraso, efeito.atraso_turnos),
    });
  }
  return porIndice;
}

/** Fila de quem já está em vigor no começo da partida: tudo inteiro. */
export function filaInicial(
  leis: Record<string, Lei>,
  vigentes: Record<string, ValorLei>,
): EfeitoEmCurso[] {
  return Object.entries(vigentes).flatMap(([id, valor]) =>
    [...alvos(leis[id], valor)].map(([indice, { pontos, atraso }]) => ({
      lei: id,
      indice,
      de: pontos,
      para: pontos,
      atraso,
      idade: atraso,
    })),
  );
}

/** Troca as entradas da lei pelas do valor novo, partindo de onde estavam. */
export function enfileirar(
  fila: readonly EfeitoEmCurso[],
  lei: Lei,
  valor: ValorLei,
): EfeitoEmCurso[] {
  const antigas = fila.filter((e) => e.lei === lei.id);
  const novos = alvos(lei, valor);
  const indices = new Set([...antigas.map((e) => e.indice), ...novos.keys()]);
  const trocadas: EfeitoEmCurso[] = [];
  for (const indice of indices) {
    const antiga = antigas.find((e) => e.indice === indice);
    const novo = novos.get(indice);
    const de = antiga ? contribuicao(antiga) : 0;
    const para = novo?.pontos ?? 0;
    if (de === 0 && para === 0) continue;
    trocadas.push({
      lei: lei.id,
      indice,
      de,
      para,
      atraso: novo?.atraso ?? antiga?.atraso ?? 0,
      idade: 0,
    });
  }
  return [...fila.filter((e) => e.lei !== lei.id), ...trocadas];
}

/** Um turno a mais para todos; quem chegou inteiro fica parado. */
export function envelhecer(fila: readonly EfeitoEmCurso[]): EfeitoEmCurso[] {
  return fila.map((e) =>
    e.idade >= e.atraso ? e : { ...e, idade: e.idade + 1 },
  );
}

/** Soma das contribuições de hoje por índice. */
export function somaPorIndice(
  fila: readonly EfeitoEmCurso[],
): Record<string, number> {
  const soma: Record<string, number> = {};
  for (const e of fila)
    soma[e.indice] = (soma[e.indice] ?? 0) + contribuicao(e);
  return soma;
}
