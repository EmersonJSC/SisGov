// Contas do Tesouro: receita, gasto, juros, cofre e dívida separados.
// Comportamento em contas.md.

import type { Lei, ValorLei } from "../leis";

/** Estoques do Tesouro, na moeda do país. */
export interface Tesouro {
  cofre: number;
  divida: number;
  /** Resultado nominal do último turno, na moeda do país. */
  resultado: number;
}

/** Fluxos de um turno, na moeda do país. */
export interface Fluxos {
  receita: number;
  gasto: number;
  juros: number;
}

/** Regra fiscal do país, lida das leis de déficit e de superávit. */
export interface RegraFiscal {
  /** Fração da falta paga pelo cofre; o resto vira dívida. */
  deficitDoCofre: number;
  /** Fração da sobra que vai ao cofre; o resto abate a dívida. */
  superavitAoCofre: number;
}

/** Sem lei no mundo: falta sai do cofre, sobra vai ao cofre. */
export const REGRA_FISCAL_PADRAO: RegraFiscal = {
  deficitDoCofre: 1,
  superavitAoCofre: 1,
};

/** Lê a regra das opções vigentes que a declaram; o que faltar fica no padrão. */
export function regraFiscal(
  leis: Record<string, Lei>,
  vigentes: Record<string, ValorLei>,
): RegraFiscal {
  let regra = REGRA_FISCAL_PADRAO;
  for (const [id, valor] of Object.entries(vigentes)) {
    const lei = leis[id];
    if (!lei || lei.forma !== "opcoes") continue;
    const op = lei.opcoes.find((o) => o.id === valor);
    if (op?.deficit_do_cofre !== undefined)
      regra = { ...regra, deficitDoCofre: op.deficit_do_cofre };
    if (op?.superavit_ao_cofre !== undefined)
      regra = { ...regra, superavitAoCofre: op.superavit_ao_cofre };
  }
  return regra;
}

/**
 * Sobra: a fração `superavitAoCofre` vai ao cofre, o resto abate a dívida (o
 * que passar da dívida também vai ao cofre). Falta: a fração `deficitDoCofre`
 * sai do cofre (no máximo o que há nele), o resto vira dívida.
 */
export function fecharTurno(
  tesouro: Tesouro,
  fluxos: Fluxos,
  regra: RegraFiscal = REGRA_FISCAL_PADRAO,
): Tesouro {
  const resultado = fluxos.receita - fluxos.gasto - fluxos.juros;
  if (resultado >= 0) {
    const aoCofre = resultado * regra.superavitAoCofre;
    const abate = Math.min(resultado - aoCofre, Math.max(0, tesouro.divida));
    return {
      cofre: tesouro.cofre + resultado - abate,
      divida: tesouro.divida - abate,
      resultado,
    };
  }
  const falta = -resultado;
  const doCofre = Math.min(tesouro.cofre, falta * regra.deficitDoCofre);
  return {
    cofre: tesouro.cofre - doCofre,
    divida: tesouro.divida + (falta - doCofre),
    resultado,
  };
}

/** Motivo se cofre − dívida não andou exatamente o resultado; senão null. */
export function motivoContaNaoFecha(
  antes: Tesouro,
  depois: Tesouro,
): string | null {
  const variacao = depois.cofre - depois.divida - (antes.cofre - antes.divida);
  const escala = Math.max(1, Math.abs(antes.divida), Math.abs(antes.cofre));
  if (Math.abs(variacao - depois.resultado) <= escala * 1e-9) return null;
  return `contabilidade não fecha: cofre − dívida variou ${variacao}, resultado ${depois.resultado}`;
}
