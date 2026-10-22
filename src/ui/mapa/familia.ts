/**
 * Família da lei (docs/arte/briefing-icones-gpt.md, seção 4): decide a cor da
 * bolha no mapa e a prateleira no painel da área.
 */
import type { VisaoLei } from "../../app/partida";
import { ehConstitucional } from "./layout";

export type Familia =
  "imposto" | "verba" | "programa" | "regra" | "constituicao";

export function familiaDaLei(lei: VisaoLei): Familia {
  // Lei do molde v4 declara a família (molde-das-leis.md, 2.1).
  if (lei.familia)
    return lei.familia === "constitucional" || lei.familia === "petrea"
      ? "constituicao"
      : lei.familia;
  if (lei.nivelLegal === "petrea" || lei.nivelLegal === "constitucional")
    return "constituicao";
  if (ehConstitucional(lei)) return "constituicao";
  if (lei.grupo === "tributaria") return "imposto";
  if (lei.grupo === "orcamentaria") return "verba";
  return "regra";
}

/** Prateleiras do painel, na ordem em que aparecem. */
export const PRATELEIRAS: readonly Readonly<{
  familia: Familia;
  titulo: string;
}>[] = [
  { familia: "imposto", titulo: "Impostos" },
  { familia: "verba", titulo: "Verbas" },
  { familia: "programa", titulo: "Programas" },
  { familia: "regra", titulo: "Regras" },
  { familia: "constituicao", titulo: "Constituição" },
];
