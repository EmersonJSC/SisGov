import { describe, expect, it } from "vitest";
import type { Lei } from "../leis";
import type { Pop } from "../populacao";
import {
  alvosEstoques,
  calcularGrupos,
  motivoGruposInvalidos,
  type Marco,
  type TipoGrupo,
} from ".";

const pop = (pessoas: number, renda: number): Pop => ({
  pessoas,
  renda_bruta: renda,
  imposto: 0,
  transferencia: 0,
  renda,
});

const tipo: TipoGrupo = {
  id: "g",
  membros: { a: 1, b: 0.5 },
  cobra: [{ indice: "x", sentido: -1 }],
};

const lei: Lei = {
  versao: 1,
  id: "l",
  camada: "jogabilidade",
  forma: "continua",
  unidade: "fracao",
  faixa: { min: 0, max: 0.5 },
  passo: 0.01,
  grupos: { g: "mais" },
  efeitos: [],
};

const marco: Marco = {
  indices: { x: 10 },
  leis: { l: 0.1 },
  renda_real: { g: 100 },
};

describe("grupos", () => {
  it("renda, índice e lei somam na satisfação", () => {
    const pops = { a: pop(10, 100), b: pop(20, 100) };
    const igual = calcularGrupos(
      [tipo],
      { l: lei },
      {
        pops,
        indice_precos: 100,
        indices: { x: 10 },
        vigentes: { l: 0.1 },
        marco,
      },
    );
    expect(igual.g.pessoas).toBe(20);
    expect(igual.g.satisfacao).toBe(50);
    expect(igual.g.radicais).toBe(5);

    // renda +10% (10), índice x cai 3 (+3), lei +0,1 em faixa 0,5 (+10)
    const melhor = calcularGrupos(
      [tipo],
      { l: lei },
      {
        pops: { a: pop(10, 110), b: pop(20, 110) },
        indice_precos: 100,
        indices: { x: 7 },
        vigentes: { l: 0.2 },
        marco,
      },
    );
    expect(melhor.g.satisfacao).toBeCloseTo(73);
  });

  it("renda que cresce no ritmo esperado não muda a satisfação", () => {
    const entrada = {
      pops: { a: pop(10, 110), b: pop(20, 110) },
      indice_precos: 100,
      indices: { x: 10 },
      vigentes: { l: 0.1 },
      marco,
    };
    const no_ritmo = calcularGrupos(
      [tipo],
      { l: lei },
      {
        ...entrada,
        esperado: 1.1,
      },
    );
    expect(no_ritmo.g.satisfacao).toBeCloseTo(50);
    expect(no_ritmo.g.renda_real).toBeCloseTo(110);
    const acima = calcularGrupos(
      [tipo],
      { l: lei },
      {
        ...entrada,
        esperado: 1.05,
      },
    );
    expect(acima.g.satisfacao).toBeGreaterThan(54);
  });

  it("radicais andam 1 ponto por turno rumo ao alvo", () => {
    expect(alvosEstoques(50)).toEqual({ radicais: 5, lealistas: 5 });
    expect(alvosEstoques(20).radicais).toBe(35);
    const anteriores = {
      g: {
        pessoas: 0,
        renda_real: 0,
        satisfacao: 0,
        radicais: 5,
        lealistas: 10,
      },
    };
    const g = calcularGrupos(
      [tipo],
      { l: lei },
      {
        pops: { a: pop(10, 50), b: pop(20, 50) },
        indice_precos: 100,
        indices: { x: 30 },
        vigentes: { l: 0 },
        marco,
        anteriores,
      },
    );
    expect(g.g.satisfacao).toBeLessThan(35);
    expect(g.g.radicais).toBe(6);
    expect(g.g.lealistas).toBe(9);
  });

  it("valida membros, índices e grupos citados nas leis", () => {
    expect(motivoGruposInvalidos([tipo], ["a", "b"], ["x"], { l: lei })).toBe(
      null,
    );
    expect(motivoGruposInvalidos([tipo], ["a"], ["x"], {})).toMatch(
      /pop "b" não existe/,
    );
    expect(motivoGruposInvalidos([tipo], ["a", "b"], [], {})).toMatch(
      /índice "x"/,
    );
    expect(motivoGruposInvalidos([], ["a", "b"], ["x"], { l: lei })).toMatch(
      /grupo "g" não existe/,
    );
  });
});
