import { describe, expect, it } from "vitest";
import type { Grupo } from "../grupos";
import type { Lei } from "../leis";
import { apurar, turnosMandato } from ".";

const g = (pessoas: number, satisfacao: number): Grupo => ({
  pessoas,
  renda_real: 1,
  satisfacao,
  radicais: 5,
  lealistas: 5,
});

const mandato: Lei = {
  versao: 1,
  id: "m",
  camada: "essencial",
  forma: "opcoes",
  opcoes: [
    { id: "curto", mandato_anos: 4, efeitos: [] },
    { id: "longo", mandato_anos: 5, efeitos: [] },
  ],
};
const outra: Lei = {
  versao: 1,
  id: "o",
  camada: "jogabilidade",
  forma: "opcoes",
  opcoes: [
    { id: "x", efeitos: [] },
    { id: "y", efeitos: [] },
  ],
};

describe("eleição", () => {
  it("duração vem da opção vigente da lei com mandato_anos", () => {
    const leis = { m: mandato, o: outra };
    expect(turnosMandato(leis, { o: "x", m: "curto" })).toBe(24);
    expect(turnosMandato(leis, { o: "x", m: "longo" })).toBe(30);
    expect(turnosMandato(leis, { o: "x" })).toBe(null);
  });

  it("apoio é a satisfação pesada pelas pessoas menos o desgaste", () => {
    // média = (90×60 + 10×40) / 100 = 58
    const e = apurar(24, { a: g(90, 60), b: g(10, 40) }, 2);
    expect(e.apoio).toBeCloseTo(56);
    expect(e.adversario).toBeCloseTo(44);
    expect(e.margem).toBeCloseTo(12);
    expect(e.venceu).toBe(true);
  });

  it("grupo grande decide; empate perde", () => {
    expect(apurar(24, { a: g(10, 90), b: g(90, 40) }, 0).venceu).toBe(false);
    expect(apurar(24, { a: g(1, 50) }, 0).venceu).toBe(false);
  });
});
