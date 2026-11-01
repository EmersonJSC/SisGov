// Posições do mapa em três anéis. Funções puras: ângulo em radianos, 0 no
// topo, sentido horário. Ver mapa.md.
import type { MapaDoMundo } from "../../partida";

const TAU = Math.PI * 2;

export const RAIOS = { leis: 150, indices: 340, grupos: 520 } as const;
/** Distância mínima de arco entre dois nós do mesmo anel. */
export const FOLGA = 24;
/** Peso mínimo de uma fatia, em leis. */
const MINIMO_DA_FATIA = 3;

export interface NoMapa {
  id: string;
  angulo: number;
  x: number;
  y: number;
}

export interface Fatia {
  id: string;
  inicio: number;
  fim: number;
}

export interface LayoutMapa {
  fatias: Fatia[];
  leis: NoMapa[];
  indices: NoMapa[];
  grupos: NoMapa[];
}

const normalizar = (a: number) => ((a % TAU) + TAU) % TAU;

/** Menor distância entre dois ângulos. */
export function diferencaAngular(a: number, b: number): number {
  const d = Math.abs(normalizar(a) - normalizar(b));
  return Math.min(d, TAU - d);
}

export function ponto(angulo: number, raio: number) {
  return { x: raio * Math.sin(angulo), y: -raio * Math.cos(angulo) };
}

function no(id: string, angulo: number, raio: number): NoMapa {
  const a = normalizar(angulo);
  return { id, angulo: a, ...ponto(a, raio) };
}

/** Ângulo médio, com peso; `null` se não há nada para medir. */
export function anguloMedio(angulos: number[]): number | null {
  if (!angulos.length) return null;
  const s = angulos.reduce((t, a) => t + Math.sin(a), 0);
  const c = angulos.reduce((t, a) => t + Math.cos(a), 0);
  return Math.hypot(s, c) < 1e-9 ? angulos[0] : normalizar(Math.atan2(s, c));
}

/**
 * Afasta os nós de um anel até haver `folga` radianos entre vizinhos, sem
 * trocar a ordem. Se não couberem, usa uma divisão igual do anel.
 */
export function espalhar(
  itens: { id: string; angulo: number }[],
  folga: number,
): Map<string, number> {
  const n = itens.length;
  const ordem = [...itens].sort((a, b) => a.angulo - b.angulo);
  const a = ordem.map((i) => normalizar(i.angulo));
  const gap = Math.min(folga, (0.98 * TAU) / Math.max(n, 1));
  for (let volta = 0; volta < 2000 && n > 1; volta++) {
    let mexeu = false;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const d = j === 0 ? a[j] + TAU - a[i] : a[j] - a[i];
      if (d < gap - 1e-9) {
        const empurra = (gap - d) / 2;
        a[i] -= empurra;
        a[j] += empurra;
        mexeu = true;
      }
    }
    if (!mexeu) break;
  }
  return new Map(ordem.map((i, k) => [i.id, normalizar(a[k])]));
}

/** Põe os que não têm ângulo no maior vão entre os que têm. */
function completar(
  fixos: { id: string; angulo: number }[],
  soltos: string[],
): { id: string; angulo: number }[] {
  const todos = [...fixos];
  for (const id of soltos) {
    const ordem = [...todos].sort((a, b) => a.angulo - b.angulo);
    if (!ordem.length) {
      todos.push({ id, angulo: 0 });
      continue;
    }
    let melhor = { vao: -1, meio: 0 };
    ordem.forEach((p, i) => {
      const q = ordem[(i + 1) % ordem.length];
      const vao = q.angulo - p.angulo + (i === ordem.length - 1 ? TAU : 0);
      if (vao > melhor.vao) melhor = { vao, meio: p.angulo + vao / 2 };
    });
    todos.push({ id, angulo: normalizar(melhor.meio) });
  }
  return todos;
}

function anel(
  desejados: { id: string; angulo: number | null }[],
  raio: number,
): NoMapa[] {
  const fixos = desejados.filter(
    (d): d is { id: string; angulo: number } => d.angulo !== null,
  );
  const soltos = desejados.filter((d) => d.angulo === null).map((d) => d.id);
  const angulos = espalhar(completar(fixos, soltos), FOLGA / raio);
  return desejados.map((d) => no(d.id, angulos.get(d.id) as number, raio));
}

export function montarLayout(mapa: MapaDoMundo): LayoutMapa {
  const peso = (n: number) => Math.max(n, MINIMO_DA_FATIA);
  const total = mapa.areas.reduce((t, a) => t + peso(a.leis.length), 0);
  let inicio = 0;
  const fatias: Fatia[] = [];
  const leis: NoMapa[] = [];
  for (const area of mapa.areas) {
    const fim = inicio + (TAU * peso(area.leis.length)) / total;
    fatias.push({ id: area.id, inicio, fim });
    // as leis ocupam o miolo da fatia, centradas
    const usado = (fim - inicio) * (area.leis.length / peso(area.leis.length));
    const comeco = inicio + (fim - inicio - usado) / 2;
    area.leis.forEach((id, i) =>
      leis.push(
        no(id, comeco + ((i + 0.5) / area.leis.length) * usado, RAIOS.leis),
      ),
    );
    inicio = fim;
  }
  const anguloDaLei = new Map(leis.map((l) => [l.id, l.angulo]));

  const indices = anel(
    mapa.indices.map((ind) => ({
      id: ind.id,
      angulo: anguloMedio(
        mapa.leis
          .filter((l) => l.indices.includes(ind.id))
          .map((l) => anguloDaLei.get(l.id) as number),
      ),
    })),
    RAIOS.indices,
  );
  const anguloDoIndice = new Map(indices.map((i) => [i.id, i.angulo]));

  const grupos = anel(
    mapa.grupos.map((g) => {
      const doIndice = g.indices
        .filter((i) => anguloDoIndice.has(i))
        .map((i) => anguloDoIndice.get(i) as number);
      const dasLeis = g.leis.map((l) => anguloDaLei.get(l) as number);
      return {
        id: g.id,
        angulo: anguloMedio(doIndice.length ? doIndice : dasLeis),
      };
    }),
    RAIOS.grupos,
  );
  return { fatias, leis, indices, grupos };
}
