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

  it("subir e descer dá sinais opostos a quem está de um lado só", () => {
    const sobe = previaDaLei(partida, "transferencia-renda", 0.04);
    const desce = previaDaLei(partida, "transferencia-renda", 0.01);
    const pontos = (p: typeof sobe, id: string) =>
      p.grupos.find((g) => g.id === id)?.pontos ?? 0;
    // trabalhadores à esquerda da lei, empresários à direita
    expect(pontos(sobe, "trabalhadores")).toBeGreaterThan(0);
    expect(pontos(desce, "trabalhadores")).toBeLessThan(0);
    expect(pontos(sobe, "empresarios")).toBeLessThan(0);
    expect(pontos(desce, "empresarios")).toBeGreaterThan(0);
    // a classe média está em cima da lei: reclama dos dois lados
    expect(pontos(sobe, "classe-media")).toBeLessThan(0);
    expect(pontos(desce, "classe-media")).toBeLessThan(0);
  });

  it("trocar de opção mexe nos índices com o atraso em meses", () => {
    const p = previaDaLei(partida, "licenciamento-ambiental", "rigoroso");
    expect(p.indices.length).toBeGreaterThan(0);
    for (const i of p.indices) expect(i.atrasoMeses % 2).toBe(0);
  });
});
