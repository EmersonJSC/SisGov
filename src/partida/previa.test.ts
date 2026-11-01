import { describe, expect, it } from "vitest";
import { criarPartida, previaDaLei, valorDoNivel } from "./index";

const partida = criarPartida("teste", 7);

describe("prévia direta da lei", () => {
  it("nível da tela vira valor do motor, no passo da lei", () => {
    expect(valorDoNivel(partida, "imposto-renda", 25.3)).toBe(0.255);
    expect(valorDoNivel(partida, "licenciamento-ambiental", 2)).toBe(
      "rigoroso",
    );
  });

  it("o valor vigente não muda nada", () => {
    const p = previaDaLei(partida, "imposto-renda", 0.2);
    expect(p).toEqual({ indices: [], grupos: [] });
  });

  it("subir e descer a mesma lei dá sinais opostos", () => {
    const sobe = previaDaLei(partida, "transferencia-renda", 0.04);
    const desce = previaDaLei(partida, "transferencia-renda", 0.01);
    expect(sobe.grupos.length).toBeGreaterThan(0);
    for (const g of sobe.grupos) {
      const oposto = desce.grupos.find((d) => d.id === g.id);
      expect(Math.sign(oposto?.pontos ?? 0)).toBe(-Math.sign(g.pontos));
    }
  });

  it("trocar de opção mexe nos índices com o atraso em meses", () => {
    const p = previaDaLei(partida, "licenciamento-ambiental", "rigoroso");
    expect(p.indices.length).toBeGreaterThan(0);
    for (const i of p.indices) expect(i.atrasoMeses % 2).toBe(0);
  });
});
