import { describe, expect, it } from "vitest";
import { mapaDoMundo } from "../../partida";
import {
  anguloMedio,
  diferencaAngular,
  espalhar,
  FOLGA,
  montarLayout,
  RAIOS,
} from "./layout";

const TAU = Math.PI * 2;
const graus = (r: number) => (r * 180) / Math.PI;

describe("mapa em três anéis", () => {
  const layout = montarLayout(mapaDoMundo);

  it("as fatias somam 360° e não se sobrepõem", () => {
    const soma = layout.fatias.reduce((t, f) => t + (f.fim - f.inicio), 0);
    expect(soma).toBeCloseTo(TAU);
    layout.fatias.forEach((f, i) => {
      const proxima = layout.fatias[(i + 1) % layout.fatias.length];
      expect(f.fim).toBeCloseTo(
        i === layout.fatias.length - 1 ? TAU : proxima.inicio,
      );
    });
  });

  it("toda lei fica dentro da fatia da sua área", () => {
    expect(layout.leis).toHaveLength(mapaDoMundo.leis.length);
    for (const lei of mapaDoMundo.leis) {
      const fatia = layout.fatias.find((f) => f.id === lei.area)!;
      const no = layout.leis.find((n) => n.id === lei.id)!;
      expect(no.angulo).toBeGreaterThan(fatia.inicio);
      expect(no.angulo).toBeLessThan(fatia.fim);
    }
  });

  it("o índice fica perto do ângulo médio das leis que o mexem", () => {
    for (const ind of layout.indices) {
      const leis = mapaDoMundo.leis.filter((l) => l.indices.includes(ind.id));
      if (!leis.length) continue;
      const media = anguloMedio(
        leis.map((l) => layout.leis.find((n) => n.id === l.id)!.angulo),
      )!;
      expect(graus(diferencaAngular(ind.angulo, media))).toBeLessThanOrEqual(
        35,
      );
    }
  });

  it("grupo e índice sem ligação também ganham lugar", () => {
    expect(layout.indices).toHaveLength(mapaDoMundo.indices.length);
    expect(layout.grupos).toHaveLength(mapaDoMundo.grupos.length);
    for (const n of [...layout.indices, ...layout.grupos])
      expect(Number.isFinite(n.x + n.y)).toBe(true);
  });

  it("nada se sobrepõe no mesmo anel", () => {
    for (const [nos, raio] of [
      [layout.leis, RAIOS.leis],
      [layout.indices, RAIOS.indices],
      [layout.grupos, RAIOS.grupos],
    ] as const) {
      for (let i = 0; i < nos.length; i++)
        for (let j = i + 1; j < nos.length; j++)
          expect(
            diferencaAngular(nos[i].angulo, nos[j].angulo) * raio,
          ).toBeGreaterThanOrEqual(FOLGA - 0.01);
    }
  });

  it("espalhar mantém a ordem e respeita a folga", () => {
    const r = espalhar(
      [
        { id: "a", angulo: 1 },
        { id: "b", angulo: 1.01 },
        { id: "c", angulo: 1.02 },
      ],
      0.3,
    );
    expect(r.get("a")!).toBeLessThan(r.get("b")!);
    expect(r.get("b")!).toBeLessThan(r.get("c")!);
    expect(r.get("b")! - r.get("a")!).toBeGreaterThanOrEqual(0.299);
  });
});
