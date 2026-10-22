/**
 * Família da lei (docs/arte/briefing-icones-gpt.md, seção 4): decide a cor da
 * bolha no mapa e a prateleira no painel da área.
 */
import type { VisaoLei } from "../../app/partida";
import { ehConstitucional } from "./layout";

export type Familia = "imposto" | "verba" | "regra" | "constituicao";

export function familiaDaLei(lei: VisaoLei): Familia {
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
  { familia: "regra", titulo: "Regras" },
  { familia: "constituicao", titulo: "Constituição" },
];
