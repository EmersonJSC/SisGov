// 12b, pilar 1: o PIB vem das construções. Direção, não número.
import { describe, expect, it } from "vitest";
import { criarPartida } from "../src/partida";
import { construtora, corrupto, resumo } from "./construcoes";

const media = (f: (s: number) => number) =>
  [1, 2, 3, 4].reduce((a, s) => a + f(s), 0) / 4;

describe("construções", () => {
  it("o turno 0 tem construções em todo setor com renda e obras na fila", () => {
    const c = criarPartida("teste", 1).estado.construcoes!;
    expect(Object.values(c.prontas).every((v) => v >= 0)).toBe(true);
    expect(c.obras.length).toBeGreaterThan(0);
  });

  it.each([
    ["teste", 2],
    ["teste-pobre", 3],
  ])("sem o jogador mexer, %s cresce perto da tendência", (pais, tendencia) => {
    expect(media((s) => resumo(pais, s).anual)).toBeCloseTo(tendencia, 0);
  });

  it("imposto sobre lucro alto freia o PIB; baixo acelera", () => {
    const hoje = media((s) => resumo("teste", s).anual);
    expect(media((s) => resumo("teste", s, 0.5).anual)).toBeLessThan(hoje);
    expect(media((s) => resumo("teste", s, 0).anual)).toBeGreaterThan(hoje);
  });

  it("corrupção alta freia as obras", () => {
    const hoje = media((s) => resumo("teste", s).anual);
    expect(
      media((s) => resumo("teste", s, undefined, corrupto).anual),
    ).toBeLessThan(hoje);
  });

  it("construção civil forte faz a fila andar", () => {
    const fraca = media((s) => resumo("teste", s, 0).anual);
    const forte = media((s) => resumo("teste", s, 0, construtora).anual);
    expect(forte).toBeGreaterThan(fraca);
    expect(
      media((s) => resumo("teste", s, 0, construtora).emObra),
    ).toBeLessThan(media((s) => resumo("teste", s, 0).emObra));
  });
});
