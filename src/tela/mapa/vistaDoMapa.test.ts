import { describe, expect, it } from "vitest";
import {
  enquadrarPontos,
  miolo,
  mundoDe,
  viewBoxDe,
  zoomEm,
} from "./vistaDoMapa";

const caixa = { w: 1000, h: 500 };

describe("câmera do mapa", () => {
  it("a altura segue a proporção da caixa", () => {
    expect(viewBoxDe({ cx: 0, cy: 0, w: 2000 }, caixa)).toBe(
      "-1000.0 -500.0 2000.0 1000.0",
    );
  });

  it("o centro da tela é o centro da vista", () => {
    const p = mundoDe({ cx: 40, cy: -20, w: 800 }, caixa, { x: 500, y: 250 });
    expect(p.x).toBeCloseTo(40);
    expect(p.y).toBeCloseTo(-20);
  });

  it("o zoom mantém parado o ponto sob o cursor", () => {
    const v = { cx: 0, cy: 0, w: 2000 };
    const tela = { x: 800, y: 100 };
    const antes = mundoDe(v, caixa, tela);
    const depois = mundoDe(
      zoomEm(v, caixa, tela, 0.5, { minimo: 100, maximo: 5000 }),
      caixa,
      tela,
    );
    expect(depois.x).toBeCloseTo(antes.x);
    expect(depois.y).toBeCloseTo(antes.y);
  });

  it("o zoom respeita os limites", () => {
    const v = { cx: 0, cy: 0, w: 2000 };
    const perto = zoomEm(v, caixa, { x: 0, y: 0 }, 0.0001, {
      minimo: 300,
      maximo: 5000,
    });
    expect(perto.w).toBe(300);
  });

  it("enquadrar mostra todos os pontos", () => {
    const v = enquadrarPontos(
      [
        { x: -500, y: 0, raio: 10 },
        { x: 500, y: 100, raio: 10 },
      ],
      caixa,
    );
    expect(v.w).toBeGreaterThanOrEqual(1020);
    expect(v.cx).toBeCloseTo(0);
  });

  it("o miolo deixa de fora as bolhas mais distantes", () => {
    const pontos = Array.from({ length: 10 }, (_, i) => ({ x: i * 10, y: 0 }));
    const dentro = miolo(pontos);
    expect(dentro).toHaveLength(9);
    expect(dentro).not.toContainEqual({ x: 90, y: 0 });
  });
});
