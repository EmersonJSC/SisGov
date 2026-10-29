import type { PerfilDoEleitor } from "./tipos";
import { satisfacaoDoPerfil } from "./calculo";

/**
 * Radicais e lealistas (Grupos, passo 3): quem está com opinião forte, contra
 * ou a favor do governo. Não decidem a eleição (o apoio dos grupos decide);
 * medem a polarização e o clima contra o partido.
 *
 * São função pura da satisfação, sem estoque: a satisfação do grupo já
 * acumula aos poucos, então o radical também. Os dois não somam 100%: quem
 * está no meio não tem opinião forte.
 */

/** Satisfação em que metade do grupo é radical (ou lealista). */
export const PONTO_RADICAL = 30;
export const PONTO_LEALISTA = 70;
/** Quanto a satisfação precisa andar para a fração mudar de ritmo. */
const ABERTURA = 8;

const logistica = (x: number): number => 1 / (1 + Math.exp(-x));

/** Fração de um grupo com a satisfação dada que é radical (0 a 1). */
export const fracaoDeRadicais = (satisfacao: number): number =>
  logistica((PONTO_RADICAL - satisfacao) / ABERTURA);

/** Fração de um grupo com a satisfação dada que é lealista (0 a 1). */
export const fracaoDeLealistas = (satisfacao: number): number =>
  logistica((satisfacao - PONTO_LEALISTA) / ABERTURA);

export type HumorDoPais = Readonly<{
  /** Parte do eleitorado ativamente contra o governo (0 a 1). */
  radicais: number;
  /** Parte do eleitorado ativamente a favor (0 a 1). */
  lealistas: number;
  /** País dividido ao meio: alto só quando os dois lados são grandes. */
  dividido: number;
}>;

/**
 * O país somado por perfil, e não por grupo: o eleitor que está em vários
 * grupos conta uma vez só.
 */
export function humorDoPais(
  perfis: readonly PerfilDoEleitor[],
  pesoDoSegmento: Readonly<Record<string, number>>,
  valores: Readonly<Record<string, number>>,
): HumorDoPais {
  let total = 0;
  let radicais = 0;
  let lealistas = 0;
  for (const p of perfis) {
    const s = satisfacaoDoPerfil(p, pesoDoSegmento, valores);
    total += p.peso;
    radicais += p.peso * fracaoDeRadicais(s);
    lealistas += p.peso * fracaoDeLealistas(s);
  }
  if (total <= 0) return { radicais: 0, lealistas: 0, dividido: 0 };
  const r = radicais / total;
  const l = lealistas / total;
  return { radicais: r, lealistas: l, dividido: 2 * Math.min(r, l) };
}
