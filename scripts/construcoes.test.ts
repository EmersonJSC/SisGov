// 12b, pilar 1: o PIB vem das construções. Direção, não número.
import { describe, expect, it } from "vitest";
import { criarPartida } from "../src/partida";
import { lucroDosSetores, andarConstrucoes } from "../src/motor/mercado";
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

  describe("lucro e fechamento (1b)", () => {
    const partida = criarPartida("teste", 1, { semCongresso: true });
    const c = partida.estado.construcoes!;
    const regra = partida.regras.mercado!.mercado.obras!;
    const preco0 = c.lucro!.preco0;
    const privados = Object.keys(c.prontas).filter(
      (id) => c.inicio[id]! - c.lucro!.salarios[id]! > 0,
    );
    const alvo = privados[0]!;
    const queda = Object.fromEntries(
      Object.entries(preco0).map(([id, v]) => [id, id === alvo ? v * 0.1 : v]),
    );

    it("no turno 0 a margem relativa é 1 e ninguém tem prejuízo", () => {
      const l = lucroDosSetores(c, preco0, 0.2, 0.2);
      for (const id of privados) {
        expect(l[id]!.relativa).toBeCloseTo(1, 6);
        expect(l[id]!.liquido).toBeGreaterThan(0);
      }
    });

    it("preço em queda dá prejuízo, e 3 turnos seguidos fecham o setor", () => {
      let atual = c;
      for (let i = 0; i < 4; i++) {
        const lucro = lucroDosSetores(atual, queda, 0.2, 0.2);
        expect(lucro[alvo]!.liquido).toBeLessThan(0);
        atual = andarConstrucoes(regra, atual, 5, {
          investimento: 0,
          atraso: 0,
          perdaExtra: 0,
          lucro,
        });
      }
      const sem = andarConstrucoes(regra, c, 5, {
        investimento: 0,
        atraso: 0,
        perdaExtra: 0,
      });
      expect(atual.lucro!.seguidos[alvo]).toBe(4);
      expect(atual.prontas[alvo]).toBeLessThan(sem.prontas[alvo]! * 0.97);
    });

    it("setor sem lucro no turno 0 (Estado) nunca fecha", () => {
      const estatais = Object.keys(c.prontas).filter(
        (id) => !privados.includes(id),
      );
      const lucro = lucroDosSetores(c, queda, 0.2, 0.2);
      for (const id of estatais) expect(lucro[id]).toBeUndefined();
    });

    it("o capital vai para onde a margem melhorou", () => {
      const alta = Object.fromEntries(
        Object.entries(preco0).map(([id, v]) => [
          id,
          id === alvo ? v * 1.2 : v,
        ]),
      );
      const lucro = lucroDosSetores(c, alta, 0.2, 0.2);
      const f = andarConstrucoes(regra, c, 5, {
        investimento: 1,
        atraso: 0,
        perdaExtra: 0,
        lucro,
      });
      const base = andarConstrucoes(regra, c, 5, {
        investimento: 1,
        atraso: 0,
        perdaExtra: 0,
      });
      const novo = (r: typeof f) =>
        r.obras.filter((o) => o.setor === alvo).at(-1)!.tamanho;
      expect(novo(f)).toBeGreaterThan(novo(base));
    });
  });
});
