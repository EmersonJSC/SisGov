import { describe, expect, it } from "vitest";
import { ELIPSE_GRUPOS, posicionarPotencias, raioDaPotencia } from "./layout";

const lista = [
  { id: "a", peso: 0.3 },
  { id: "b", peso: 0.25 },
  { id: "c", peso: 0.25 },
  { id: "d", peso: 0.1 },
  { id: "e", peso: 0.1 },
];

describe("posicionarPotencias", () => {
  it("põe todas fora do anel dos grupos, sem se encostarem", () => {
    const pos = [...posicionarPotencias(lista).values()];
    expect(pos).toHaveLength(5);
    for (const p of pos) {
      expect(Math.abs(p.x)).toBeGreaterThan(0);
      expect(
        Math.hypot(p.x / ELIPSE_GRUPOS.rx, p.y / ELIPSE_GRUPOS.ry),
      ).toBeGreaterThan(1.1);
    }
    for (let i = 0; i < pos.length; i++)
      for (let j = i + 1; j < pos.length; j++)
        expect(
          Math.hypot(pos[i].x - pos[j].x, pos[i].y - pos[j].y),
        ).toBeGreaterThan(pos[i].r + pos[j].r);
  });

  it("não muda de lugar entre chamadas e o raio cresce com o peso", () => {
    expect(posicionarPotencias(lista)).toEqual(posicionarPotencias(lista));
    expect(raioDaPotencia(0.3)).toBeGreaterThan(raioDaPotencia(0.1));
  });

  it("sem potências, sem anel", () => {
    expect(posicionarPotencias([]).size).toBe(0);
  });
});
