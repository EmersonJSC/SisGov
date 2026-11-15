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

/** O valor de lei desligada: o mínimo da régua ou o primeiro degrau. */
export const valorDesligado = (lei: Lei): ValorLei =>
  lei.forma === "continua" ? lei.faixa.min : lei.opcoes[0].id;

/**
 * Efeitos ativos com a intensidade de cada um (0 a 1). Contínua: posição do
 * valor na faixa (mínimo = nada, máximo = inteiro). Opções: os da opção, inteiros.
 */
export function efeitosDoValor(lei: Lei, valor: ValorLei | undefined) {
  // não legislada: nenhum efeito
  if (valor === undefined) return [];
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

/**
 * Soma de uma tomada em todas as leis em vigor: a opção dá `valores[chave]`;
 * a régua dá `valores[chave]` × a posição na faixa. O motor não conhece as leis,
 * só a chave.
 */
export function tomada(
  leis: Record<string, Lei>,
  vigentes: Record<string, ValorLei>,
  chave: string,
): number {
  let soma = 0;
  for (const [id, valor] of Object.entries(vigentes)) {
    const lei = leis[id];
    if (!lei) continue;
    if (lei.forma === "opcoes") {
      soma += lei.opcoes.find((o) => o.id === valor)?.valores?.[chave] ?? 0;
      continue;
    }
    const v = lei.valores?.[chave];
    if (v === undefined || typeof valor !== "number") continue;
    const { min, max } = lei.faixa;
    soma += max > min ? (v * (valor - min)) / (max - min) : 0;
  }
  return soma;
}
