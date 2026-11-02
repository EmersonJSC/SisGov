import { describe, expect, it } from "vitest";
import type { Lei } from "../leis";
import {
  fecharTurno,
  motivoContaNaoFecha,
  regraFiscal,
  type Fluxos,
  type RegraFiscal,
  type Tesouro,
} from ".";

const falta: Fluxos = { receita: 90, gasto: 100, juros: 0 }; // resultado −10
const sobra: Fluxos = { receita: 110, gasto: 100, juros: 0 }; // resultado +10
const base: Tesouro = { cofre: 30, divida: 50, resultado: 0 };

function fecha(t: Tesouro, f: Fluxos, r?: RegraFiscal) {
  const depois = fecharTurno(t, f, r);
  expect(motivoContaNaoFecha(t, depois)).toBeNull();
  return depois;
}

describe("fecharTurno, falta", () => {
  it("sai do cofre por padrão", () => {
    const t = fecha(base, falta);
    expect([t.cofre, t.divida]).toEqual([20, 50]);
  });
  it("vira dívida", () => {
    const t = fecha(base, falta, { deficitDoCofre: 0, superavitAoCofre: 1 });
    expect([t.cofre, t.divida]).toEqual([30, 60]);
  });
  it("metade e metade", () => {
    const t = fecha(base, falta, { deficitDoCofre: 0.5, superavitAoCofre: 1 });
    expect([t.cofre, t.divida]).toEqual([25, 55]);
  });
  it("cofre curto: o que falta vira dívida", () => {
    const t = fecha({ ...base, cofre: 4 }, falta);
    expect([t.cofre, t.divida]).toEqual([0, 56]);
  });
});

describe("fecharTurno, sobra", () => {
  it("vai ao cofre por padrão", () => {
    const t = fecha(base, sobra);
    expect([t.cofre, t.divida]).toEqual([40, 50]);
  });
  it("abate a dívida", () => {
    const t = fecha(base, sobra, { deficitDoCofre: 1, superavitAoCofre: 0 });
    expect([t.cofre, t.divida]).toEqual([30, 40]);
  });
  it("metade e metade", () => {
    const t = fecha(base, sobra, { deficitDoCofre: 1, superavitAoCofre: 0.5 });
    expect([t.cofre, t.divida]).toEqual([35, 45]);
  });
  it("dívida menor que o abatimento: o resto vai ao cofre", () => {
    const t = fecha({ ...base, divida: 3 }, sobra, {
      deficitDoCofre: 1,
      superavitAoCofre: 0,
    });
    expect([t.cofre, t.divida]).toEqual([37, 0]);
  });
});

describe("regraFiscal", () => {
  const leis = {
    a: {
      forma: "opcoes",
      opcoes: [
        { id: "x", deficit_do_cofre: 0, efeitos: [] },
        { id: "y", deficit_do_cofre: 1, efeitos: [] },
      ],
    },
    b: {
      forma: "opcoes",
      opcoes: [{ id: "z", superavit_ao_cofre: 0.5, efeitos: [] }],
    },
  } as unknown as Record<string, Lei>;
  it("lê a opção vigente de cada lei, sem saber o nome delas", () => {
    expect(regraFiscal(leis, { a: "x", b: "z" })).toEqual({
      deficitDoCofre: 0,
      superavitAoCofre: 0.5,
    });
  });
  it("sem lei no mundo, usa o padrão", () => {
    expect(regraFiscal({}, {})).toEqual({
      deficitDoCofre: 1,
      superavitAoCofre: 1,
    });
  });
});
