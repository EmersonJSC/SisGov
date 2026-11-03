// R8.5: os pops andam na bússola com a vida; a bússola dos grupos anda junto.
import { describe, expect, it } from "vitest";
import { criarPartida, jogar } from ".";

const base = () => criarPartida("teste", 42, { semCongresso: true });

describe("pops deslizam na bússola (R8.5)", () => {
  const p0 = base();
  const p12 = jogar(base(), 12);

  it("no turno 0 ninguém andou", () => {
    expect(p0.estado.deslize ?? {}).toEqual({});
  });

  it("depois de 12 turnos há deslize, dentro do teto de 0,3", () => {
    const d = p12.estado.deslize ?? {};
    expect(Object.keys(d).length).toBe(p12.regras.pops.length);
    let andou = 0;
    for (const ponto of Object.values(d))
      for (const v of Object.values(ponto)) {
        expect(Math.abs(v ?? 0)).toBeLessThanOrEqual(0.3 + 1e-9);
        if (Math.abs(v ?? 0) > 1e-6) andou++;
      }
    expect(andou).toBeGreaterThan(0);
  });
});
