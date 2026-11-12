// Índices sobre dados que não mudam na partida (as leis do mundo e os moldes),
// calculados uma vez por objeto. Evita varrer as 500 leis a cada órgão e a
// cada turno. São só caches: sem eles o resultado é o mesmo.
import type { Lei } from "../leis";
import type { Molde, RegrasGoverno } from "./tipos";

const porLeis = new WeakMap<object, Map<string, Lei[]>>();
const chaves = new WeakMap<object, string[]>();
const porMolde = new WeakMap<object, Map<string, Molde>>();

/** Leis agrupadas por esfera. */
export function leisPorEsfera(leis: Record<string, Lei>): Map<string, Lei[]> {
  const guardado = porLeis.get(leis);
  if (guardado) return guardado;
  const mapa = new Map<string, Lei[]>();
  for (const l of Object.values(leis))
    if (l.esfera) mapa.set(l.esfera, [...(mapa.get(l.esfera) ?? []), l]);
  porLeis.set(leis, mapa);
  return mapa;
}

/** Cada par esfera:subesfera que existe nas leis, uma vez. */
export function chavesDeEsfera(leis: Record<string, Lei>): string[] {
  const guardado = chaves.get(leis);
  if (guardado) return guardado;
  const todas = [
    ...new Set(
      Object.values(leis).map((l) => `${l.esfera}:${l.subesfera ?? ""}`),
    ),
  ];
  chaves.set(leis, todas);
  return todas;
}

/** Molde pelo id. */
export function moldePorId(r: RegrasGoverno, id: string): Molde | undefined {
  let mapa = porMolde.get(r);
  if (!mapa) {
    mapa = new Map(r.moldes.map((m) => [m.id, m]));
    porMolde.set(r, mapa);
  }
  return mapa.get(id);
}
