// Registro de bases de cálculo. A lei aponta a base pelo id; o motor não
// conhece a lei. Base nova = entrada nova aqui.
import { arrecadacaoRenda, PADRAO_RENDA, type ParametrosRenda } from "./renda";

export interface Base {
  /** Arrecadação na moeda do país para a alíquota (fração) e a base cheia. */
  arrecadar(
    aliquota: number,
    base: number,
    parametros?: ParametrosRenda,
  ): number;
  padrao: ParametrosRenda;
}

// Consumo e lucro usam a mesma curva (Laffer + evasão); muda só o que o país
// declara (tamanho da base, pico e evasão). Ver calculos.md.
export const BASES = {
  renda: { arrecadar: arrecadacaoRenda, padrao: PADRAO_RENDA },
  consumo: { arrecadar: arrecadacaoRenda, padrao: PADRAO_RENDA },
  lucro: { arrecadar: arrecadacaoRenda, padrao: PADRAO_RENDA },
} satisfies Record<string, Base>;

export type IdBase = keyof typeof BASES;

export function ehBase(id: string): id is IdBase {
  return Object.hasOwn(BASES, id);
}

export { arrecadacaoRenda, elasticidadeDoPico, PADRAO_RENDA } from "./renda";
export type { ParametrosRenda } from "./renda";
export {
  AJUSTE_POR_TURNO,
  PREMIO_POR_PONTO,
  proximaTaxa,
  taxaAlvo,
} from "./juros";
export type { ParametrosJuros } from "./juros";
