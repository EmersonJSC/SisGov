// Deriva: índice que anda sozinho pelos turnos, empurrado por outro índice.
// O índice é a base + as leis; a deriva move a base. Regras em deriva.md.
import type { Forca } from "../leis";

/** Parte da distância ao começo que vira passo a cada turno. */
export const TAXA_DERIVA: Record<Forca, number> = {
  fraca: 0.02,
  media: 0.05,
  forte: 0.1,
};

export interface Deriva {
  /** Índice que anda. */
  indice: string;
  /** Índice que empurra (jogabilidade ou essencial). */
  por: string;
  /** +1: anda junto com quem empurra; −1: ao contrário. */
  sentido: 1 | -1;
  forca: Forca;
  /** Pontos do índice por unidade de quem empurra (padrão 1). */
  escala?: number;
  /** Lei contínua que freia a ligação: no máximo da faixa, corta inteira. */
  freio?: string;
}

/**
 * Bases do próximo turno. `freios` diz, por lei, quanto ela freia (0 a 1). Quem empurra mede contra o turno 0: o país começa
 * parado. A base fica dentro do domínio, já contando as leis (sem acumular
 * para além do teto).
 */
export function andarDerivas(
  derivas: Deriva[],
  base: Record<string, number>,
  indices: Record<string, number>,
  marco: Record<string, number>,
  leis: Record<string, number>,
  dominios: Record<string, { min: number; max: number }>,
  freios: Record<string, number> = {},
): Record<string, number> {
  const nova = { ...base };
  for (const d of derivas) {
    const atual = indices[d.por];
    const inicio = marco[d.por];
    if (atual === undefined || inicio === undefined || !(d.indice in nova))
      continue;
    const solta = 1 - (d.freio ? (freios[d.freio] ?? 0) : 0);
    nova[d.indice] +=
      d.sentido *
      TAXA_DERIVA[d.forca] *
      (atual - inicio) *
      (d.escala ?? 1) *
      solta;
  }
  for (const d of derivas) {
    const { min, max } = dominios[d.indice];
    const somaLeis = leis[d.indice] ?? 0;
    nova[d.indice] = Math.min(
      max - somaLeis,
      Math.max(min - somaLeis, nova[d.indice]),
    );
  }
  return nova;
}
