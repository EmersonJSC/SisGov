import { describe, expect, it } from "vitest";
import type { Lei } from "../leis";
import type { Pop } from "../populacao";
import {
  alvosEstoques,
  calcularGrupos,
  motivoGruposInvalidos,
  pontosLei,
  posicaoDaLei,
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
  bussola: { economico: 1, social: 0.5 },
  peso: { economico: 1 },
};

const lei: Lei = {
  versao: 1,
  id: "l",
  camada: "jogabilidade",
  forma: "continua",
  unidade: "fracao",
  faixa: { min: 0, max: 0.5 },
  passo: 0.01,
  // subir a lei vai para a direita, rumo ao grupo
  bussola: { min: { economico: -1 }, max: { economico: 1 } },
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

    // renda +10% (10), índice x cai 3 (+3), lei +0,1 em faixa 0,5: anda
    // 0,4 rumo ao grupo × peso 1 × 50 = 20, preso em 15
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
    expect(melhor.g.satisfacao).toBeCloseTo(78);
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

  it("bússola: eixo por eixo, aproximar soma e afastar tira", () => {
    const centro: TipoGrupo = {
      ...tipo,
      bussola: { economico: 0, social: 1 },
      peso: { economico: 1 },
    };
    const social: Lei = {
      ...lei,
      bussola: { min: { social: -1 }, max: { social: 1 } },
    };
    // eixo sem peso não conta: o grupo é autoritário, mas não liga
    expect(pontosLei(centro, social, 0.5, 0)).toBe(0);
    // centro reclama da lei que vai para qualquer ponta
    expect(pontosLei(centro, lei, 0.3, 0.25)).toBeCloseTo(-10);
    expect(pontosLei(centro, lei, 0.2, 0.25)).toBeCloseTo(-10);
    // lei não legislada conta como o mínimo da faixa
    expect(pontosLei(tipo, lei, 0.05, undefined)).toBeCloseTo(10);
    // uma lei só move no máximo 15
    expect(pontosLei(centro, lei, 0, 0.25)).toBe(-15);
    const opcoes: Lei = {
      versao: 1,
      id: "o",
      camada: "jogabilidade",
      forma: "opcoes",
      opcoes: [
        { id: "x", bussola: { economico: -0.5 }, efeitos: [] },
        { id: "y", bussola: {}, efeitos: [] },
        { id: "z", efeitos: [] },
      ],
    };
    expect(pontosLei(tipo, opcoes, "y", "x")).toBeCloseTo(15);
    expect(pontosLei(tipo, opcoes, "y", "y")).toBe(0);
    // opção sem posição não puxa para lado nenhum
    expect(pontosLei(tipo, opcoes, "z", "x")).toBe(0);
    expect(posicaoDaLei(lei, 0.375)).toEqual({ economico: 0.5, social: 0 });
  });

  it("valida membros, índices e a bússola", () => {
    expect(motivoGruposInvalidos([tipo], ["a", "b"], ["x"])).toBe(null);
    expect(motivoGruposInvalidos([tipo], ["a"], ["x"])).toMatch(
      /pop "b" não existe/,
    );
    expect(motivoGruposInvalidos([tipo], ["a", "b"], [])).toMatch(/índice "x"/);
    expect(
      motivoGruposInvalidos(
        [{ ...tipo, bussola: { social: 2 } }],
        ["a", "b"],
        ["x"],
      ),
    ).toMatch(/bússola social/);
    expect(
      motivoGruposInvalidos(
        [{ ...tipo, peso: { economico: -1 } }],
        ["a", "b"],
        ["x"],
      ),
    ).toMatch(/peso economico/);
  });
});
