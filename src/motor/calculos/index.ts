// Registro de bases de cálculo. A lei aponta a base pelo id; o motor não
// conhece a lei. Base nova = entrada nova aqui.
import type { Estrato } from "../populacao";
import { arrecadacaoRenda, PADRAO_RENDA, type ParametrosRenda } from "./renda";

export interface Base {
  /** Arrecadação na moeda do país para a alíquota (fração) e a base cheia. */
  arrecadar(
    aliquota: number,
    base: number,
    parametros?: ParametrosRenda,
  ): number;
  padrao: ParametrosRenda;
  /**
   * Estratos que pagam a base do bolso (a renda deles cai). Sem isso, a base
   * não tira renda dos pops direto (consumo e lucro chegam por preço e lucro).
   */
  incide?: readonly Estrato[];
  /** O dinheiro do estrato que está fora do país não paga esta base (passo G). */
  foge?: boolean;
}

const TODOS = ["pobre", "medio", "rico"] as const;
const RICO = ["rico"] as const;

// Consumo, lucro, emissões e terra usam a mesma curva (Laffer + evasão); muda só o que o país
// declara (tamanho da base, pico e evasão). Ver calculos.md.
export const BASES = {
  renda: {
    arrecadar: arrecadacaoRenda,
    padrao: PADRAO_RENDA,
    incide: TODOS,
    foge: true,
  },
  consumo: { arrecadar: arrecadacaoRenda, padrao: PADRAO_RENDA },
  lucro: { arrecadar: arrecadacaoRenda, padrao: PADRAO_RENDA },
  emissoes: { arrecadar: arrecadacaoRenda, padrao: PADRAO_RENDA },
  // Valor da terra e do imóvel parados (motor/calculos/calculos.md).
  terra: { arrecadar: arrecadacaoRenda, padrao: PADRAO_RENDA },
  // Fortuna parada: herança, bens de luxo, quem sai do país (onda 1, 14/nov).
  patrimonio: {
    arrecadar: arrecadacaoRenda,
    padrao: PADRAO_RENDA,
    incide: RICO,
    foge: true,
  },
  // Dinheiro aplicado e ações acima de um valor.
  aplicacoes: {
    arrecadar: arrecadacaoRenda,
    padrao: PADRAO_RENDA,
    incide: RICO,
    foge: true,
  },
  // Imóvel caro, em que se mora ou que se aluga.
  imovel: { arrecadar: arrecadacaoRenda, padrao: PADRAO_RENDA, incide: RICO },
  // Lucro que a empresa paga ao dono (dividendos).
  capital: {
    arrecadar: arrecadacaoRenda,
    padrao: PADRAO_RENDA,
    incide: RICO,
    foge: true,
  },
  // Lucro dos bancos (imposto extra sobre eles; o crédito encarece pelo índice).
  bancos: { arrecadar: arrecadacaoRenda, padrao: PADRAO_RENDA },
  // Cada transferência e pagamento pelo banco: pega todo mundo.
  movimentacao: {
    arrecadar: arrecadacaoRenda,
    padrao: PADRAO_RENDA,
    incide: TODOS,
  },
  // Salário com carteira: paga quem trabalha, não o rico que vive de renda.
  folha: {
    arrecadar: arrecadacaoRenda,
    padrao: PADRAO_RENDA,
    incide: ["pobre", "medio"] as const,
  },
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
