// Contas do Tesouro: receita, gasto, juros, cofre e dívida separados.
// Comportamento em contas.md.

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

/** Sobra vai para o cofre; falta sai do cofre e, sem cofre, vira dívida. */
export function fecharTurno(tesouro: Tesouro, fluxos: Fluxos): Tesouro {
  const resultado = fluxos.receita - fluxos.gasto - fluxos.juros;
  if (resultado >= 0)
    return { ...tesouro, cofre: tesouro.cofre + resultado, resultado };
  const doCofre = Math.min(tesouro.cofre, -resultado);
  return {
    cofre: tesouro.cofre - doCofre,
    divida: tesouro.divida + (-resultado - doCofre),
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
