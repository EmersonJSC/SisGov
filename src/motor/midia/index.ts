// Mídia: as mídias do país e o jornal do turno. O motor não conhece nomes:
// as mídias são do país (`paises/<id>/midias.json`), o texto das manchetes é
// do mundo. Comportamento em midia.md.
import type { Fato } from "../fatos";
import { EIXOS } from "../leis";
import { jornalDoTurno } from "./jornal";
import { DONOS, type EstadoMidia, type RegrasMidia } from "./tipos";

export * from "./tipos";
export { NOTICIAS_NO_JORNAL, impactoDoFato, jornalDoTurno } from "./jornal";

/** Começo da partida: cada mídia com a credibilidade que o país declarou. */
export function iniciarMidia(regras: RegrasMidia): EstadoMidia {
  return {
    credibilidade: Object.fromEntries(
      regras.midias.map((m) => [m.id, m.credibilidade]),
    ),
    jornal: [],
  };
}

/** Fim do turno: o jornal reúne as notícias de maior impacto. */
export function fecharJornal(
  estado: EstadoMidia,
  fatos: readonly Fato[],
  turno: number,
): EstadoMidia {
  return { ...estado, jornal: jornalDoTurno(fatos, turno) };
}

const entre = (v: number, min: number, max: number) => v >= min && v <= max;

/** Motivo de as mídias não servirem ao país, ou null se servem. */
export function motivoMidiasInvalidas(
  regras: RegrasMidia,
  grupos: string[],
): string | null {
  const ids = new Set<string>();
  for (const m of regras.midias) {
    if (ids.has(m.id)) return `mídia "${m.id}" repetida`;
    ids.add(m.id);
    if (!DONOS.includes(m.dono))
      return `${m.id}: dono "${m.dono}" desconhecido`;
    if (!entre(m.credibilidade, 0, 100))
      return `${m.id}: credibilidade fora de 0 a 100`;
    for (const eixo of EIXOS)
      if (!entre(m.bussola[eixo] ?? 0, -1, 1))
        return `${m.id}: bússola ${eixo} fora de −1 a +1`;
    for (const [grupo, fracao] of Object.entries(m.audiencia)) {
      if (!grupos.includes(grupo))
        return `${m.id}: audiência de grupo que não existe: "${grupo}"`;
      if (!entre(fracao, 0, 1))
        return `${m.id}: audiência de ${grupo} fora de 0 a 1`;
    }
  }
  return null;
}
