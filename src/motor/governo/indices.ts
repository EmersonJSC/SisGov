// Índices sobre dados que não mudam na partida (as leis e as instituições do
// mundo), calculados uma vez por objeto. Evita varrer as 500 leis a cada órgão
// e a cada turno. São só caches: sem eles o resultado é o mesmo.
import type { Lei } from "../leis";
import type { Instituicao, RegrasGoverno } from "./tipos";

const porLeis = new WeakMap<object, Map<string, Lei[]>>();
const porId = new WeakMap<object, Map<string, Instituicao>>();

/** Leis agrupadas pela instituição onde moram. */
export function leisPorInstituicao(
  leis: Record<string, Lei>,
): Map<string, Lei[]> {
  const guardado = porLeis.get(leis);
  if (guardado) return guardado;
  const mapa = Object.values(leis).reduce((m, l) => {
    if (l.esfera) m.set(l.esfera, [...(m.get(l.esfera) ?? []), l]);
    return m;
  }, new Map<string, Lei[]>());
  porLeis.set(leis, mapa);
  return mapa;
}

/** Instituição pelo id. */
export function instituicaoPorId(
  r: RegrasGoverno,
  id: string,
): Instituicao | undefined {
  let mapa = porId.get(r);
  if (!mapa) {
    mapa = new Map(r.instituicoes.map((i) => [i.id, i]));
    porId.set(r, mapa);
  }
  return mapa.get(id);
}
