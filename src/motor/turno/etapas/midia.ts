// Etapas do turno: mídia. Comportamento em turno.md.
import { fecharJornal, iniciarMidia } from "../../midia";
import type { Etapa } from "../comum";

/**
 * 9b. Mídia: depois de todos os módulos que escrevem fatos, o jornal reúne as
 * notícias de maior impacto do turno (motor/midia).
 */
export const midia: Etapa = (regras, estado) => ({
  ...estado,
  midia: fecharJornal(
    estado.midia ?? iniciarMidia(regras.midia ?? { midias: [] }),
    estado.fatos ?? [],
    estado.turno,
  ),
});
