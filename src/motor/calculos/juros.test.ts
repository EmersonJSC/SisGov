import { describe, expect, it } from "vitest";
import { proximaTaxa, taxaAlvo } from "./juros";

const pais = { neutro: 4, tolerancia_divida: 60 };

describe("juros", () => {
  it("dentro da tolerância, alvo = neutro + inflação", () => {
    expect(taxaAlvo(40, 4, pais)).toBe(8);
    expect(taxaAlvo(60, 4, pais)).toBe(8);
  });

  it("acima da tolerância, o prêmio cresce com a dívida", () => {
    expect(taxaAlvo(80, 4, pais)).toBeCloseTo(9);
    expect(taxaAlvo(120, 4, pais)).toBeCloseTo(11);
  });

  it("a taxa anda rumo ao alvo sem pular", () => {
    const t = proximaTaxa(8, 11);
    expect(t).toBeGreaterThan(8);
    expect(t).toBeLessThan(11);
  });
});
