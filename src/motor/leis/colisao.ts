// Colisão: duas leis que não valem juntas. Fora isso, toda combinação vale.
import type { Lei } from "./tipos";
import type { ValorLei } from "./valor";

/** Par de leis que não podem estar as duas em vigor (ligadas). */
export type Colisao = readonly [string, string];

/** A lei está ligada: contínua fora do mínimo; de degraus, em vigor (16/nov). */
export function leiAtiva(lei: Lei, valor: ValorLei | undefined): boolean {
  if (valor === undefined) return false;
  if (lei.forma === "continua") return valor !== lei.faixa.min;
  // lei revista (16/nov): não há degrau "nada", todo degrau em vigor liga
  if (lei.primeiro_degrau_conta) return true;
  return valor !== lei.opcoes[0]?.id;
}

/** Valores em vigor somados aos pedidos que ligam uma lei; revogar só vale no turno seguinte. */
export function valoresComPedidos(
  leis: Record<string, Lei>,
  valores: Record<string, ValorLei>,
  pedidos: readonly { lei: string; valor: ValorLei }[],
): Record<string, ValorLei> {
  const soma = { ...valores };
  for (const p of pedidos)
    if (leis[p.lei] && leiAtiva(leis[p.lei], p.valor)) soma[p.lei] = p.valor;
  return soma;
}

/** Leis ativas que colidem com `id`, se `id` ficar ativa. */
export function colisoesDe(
  id: string,
  colisoes: readonly Colisao[],
  leis: Record<string, Lei>,
  valores: Record<string, ValorLei>,
): string[] {
  const achadas: string[] = [];
  for (const [a, b] of colisoes) {
    const outra = a === id ? b : b === id ? a : undefined;
    if (outra && leis[outra] && leiAtiva(leis[outra], valores[outra]))
      achadas.push(outra);
  }
  return achadas;
}
