import { describe, expect, it } from "vitest";
import { arrecadacaoRenda } from "./renda";

const renda = 1000;
const pais = { pico: 0.5, evasao: 0.1 };
const curva = (t: number) => arrecadacaoRenda(t, renda, pais);

describe("base renda", () => {
  it("não arrecada com alíquota zero nem cheia", () => {
    expect(curva(0)).toBe(0);
    expect(curva(1)).toBe(0);
  });

  it("cresce até o pico declarado pelo país e cai depois", () => {
    expect(curva(0.3)).toBeLessThan(curva(0.45));
    expect(curva(0.45)).toBeLessThan(curva(0.5));
    expect(curva(0.55)).toBeLessThan(curva(0.5));
    expect(curva(0.8)).toBeLessThan(curva(0.55));
  });

  it("o mesmo imposto se comporta diferente com outro pico", () => {
    const outro = { pico: 0.7, evasao: 0.1 };
    expect(arrecadacaoRenda(0.65, renda, outro)).toBeGreaterThan(
      arrecadacaoRenda(0.6, renda, outro),
    );
    expect(curva(0.65)).toBeLessThan(curva(0.6));
  });

  it("evasão maior arrecada menos", () => {
    const evasivo = { pico: 0.5, evasao: 0.3 };
    expect(arrecadacaoRenda(0.3, renda, evasivo)).toBeLessThan(curva(0.3));
  });

  it("nunca negativa", () => {
    for (const t of [-0.1, 0.01, 0.99, 1.5]) {
      expect(curva(t)).toBeGreaterThanOrEqual(0);
    }
  });
});
