// Pops: fatias da população com renda calculada pelo motor. Tipos vêm do
// mundo, parcelas do país. Comportamento em populacao.md.

import type { PontoBussola } from "../leis";

export const ESTRATOS = ["pobre", "medio", "rico"] as const;
export type Estrato = (typeof ESTRATOS)[number];

export function ehEstrato(v: unknown): v is Estrato {
  return ESTRATOS.includes(v as never);
}

/** Tipo de pop do mundo. */
export interface TipoPop {
  id: string;
  estrato: Estrato;
  /** Onde o pop começa na bússola (−1 a +1 por eixo); desliza com a vida. */
  bussola: PontoBussola;
}

/** O que o país declara de cada tipo de pop (frações que somam 1). */
export interface PopPais {
  parcela_pessoas: number;
  parcela_renda: number;
}

/** Pop no estado. Valores por pessoa, ao ano, na moeda do país. */
export interface Pop {
  pessoas: number;
  renda_bruta: number;
  imposto: number;
  transferencia: number;
  /** Renda disponível: bruta − imposto + transferência. */
  renda: number;
}

/** Valores anuais na moeda do país. */
export interface EntradaPops {
  populacao: number;
  pib_nominal: number;
  imposto_renda: number;
  transferencias: Partial<Record<Estrato, number>>;
}

/** Motivo de as parcelas do país não fecharem, ou null. */
export function motivoPopsInvalidos(
  tipos: TipoPop[],
  pais: Record<string, PopPais>,
): string | null {
  for (const id of Object.keys(pais))
    if (!tipos.some((t) => t.id === id)) return `pop "${id}" não existe`;
  let pessoas = 0;
  let renda = 0;
  for (const { id } of tipos) {
    const p = pais[id];
    if (!p) return `falta o pop ${id}`;
    if (!(p.parcela_pessoas > 0) || !(p.parcela_renda >= 0))
      return `pop ${id}: parcela_pessoas > 0 e parcela_renda ≥ 0`;
    pessoas += p.parcela_pessoas;
    renda += p.parcela_renda;
  }
  if (Math.abs(pessoas - 1) > 1e-6)
    return `parcela_pessoas soma ${pessoas}, precisa ser 1`;
  if (Math.abs(renda - 1) > 1e-6)
    return `parcela_renda soma ${renda}, precisa ser 1`;
  return null;
}

export function calcularPops(
  tipos: TipoPop[],
  pais: Record<string, PopPais>,
  entrada: EntradaPops,
): Record<string, Pop> {
  const pessoasEstrato: Partial<Record<Estrato, number>> = {};
  for (const t of tipos)
    pessoasEstrato[t.estrato] =
      (pessoasEstrato[t.estrato] ?? 0) +
      pais[t.id].parcela_pessoas * entrada.populacao;

  const pops: Record<string, Pop> = {};
  for (const t of tipos) {
    const { parcela_pessoas, parcela_renda } = pais[t.id];
    const pessoas = parcela_pessoas * entrada.populacao;
    const renda_bruta = (parcela_renda * entrada.pib_nominal) / pessoas;
    const imposto = (parcela_renda * entrada.imposto_renda) / pessoas;
    const transferencia =
      (entrada.transferencias[t.estrato] ?? 0) /
      (pessoasEstrato[t.estrato] as number);
    pops[t.id] = {
      pessoas,
      renda_bruta,
      imposto,
      transferencia,
      renda: renda_bruta - imposto + transferencia,
    };
  }
  return pops;
}
