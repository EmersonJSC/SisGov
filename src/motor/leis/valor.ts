// Valor de uma lei em vigor: fração (contínua) ou id de opção.
import type { Lei, LeiContinua } from "./tipos";

export type ValorLei = number | string;

/** Motivo de o valor não servir para a lei, ou null se serve. */
export function motivoValorInvalido(lei: Lei, valor: ValorLei): string | null {
  if (lei.forma === "continua") {
    if (typeof valor !== "number" || !Number.isFinite(valor))
      return "precisa ser número";
    if (valor < lei.faixa.min || valor > lei.faixa.max)
      return `fora da faixa ${lei.faixa.min}–${lei.faixa.max}`;
    return null;
  }
  if (!lei.opcoes.some((op) => op.id === valor))
    return `opção "${String(valor)}" não existe`;
  return null;
}

/**
 * Efeitos ativos com a intensidade de cada um (0 a 1). Contínua: posição do
 * valor na faixa (mínimo = nada, máximo = inteiro). Opções: os da opção, inteiros.
 */
export function efeitosDoValor(lei: Lei, valor: ValorLei) {
  if (lei.forma === "continua") {
    const intensidade =
      ((valor as number) - lei.faixa.min) / (lei.faixa.max - lei.faixa.min);
    return lei.efeitos.map((efeito) => ({ efeito, intensidade }));
  }
  const opcao = lei.opcoes.find((op) => op.id === valor);
  return (opcao?.efeitos ?? []).map((efeito) => ({ efeito, intensidade: 1 }));
}

/** Onde a lei contínua está entre o `min` e o `max` da bússola (0 a 1). */
export function fracaoDaBussola(
  lei: LeiContinua,
  valor: number | undefined,
): number {
  const { min, max } = lei.faixa;
  const ate = lei.bussola?.ate ?? max;
  const t = ((valor ?? min) - min) / (ate - min);
  return Math.min(1, Math.max(0, t));
}
