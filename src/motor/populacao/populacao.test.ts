import { describe, expect, it } from "vitest";
import { calcularPops, motivoPopsInvalidos, type TipoPop } from ".";

const TIPOS: TipoPop[] = [
  { id: "a", estrato: "pobre", bussola: {} },
  { id: "b", estrato: "rico", bussola: {} },
];
const PAIS = {
  a: { parcela_pessoas: 0.8, parcela_renda: 0.4 },
  b: { parcela_pessoas: 0.2, parcela_renda: 0.6 },
};

describe("pops", () => {
  it("divide renda, imposto e transferência", () => {
    const pops = calcularPops(TIPOS, PAIS, {
      populacao: 100,
      pib_nominal: 1000,
      imposto_renda: 100,
      transferencias: { pobre: 80 },
    });
    expect(pops.a).toEqual({
      pessoas: 80,
      renda_bruta: 5,
      imposto: 0.5,
      transferencia: 1,
      renda: 5.5,
    });
    expect(pops.b.renda).toBe(30 - 3);
  });

  it("recusa parcelas que não somam 1 e pop que falta", () => {
    expect(motivoPopsInvalidos(TIPOS, PAIS)).toBeNull();
    expect(
      motivoPopsInvalidos(TIPOS, {
        ...PAIS,
        b: { ...PAIS.b, parcela_renda: 0.5 },
      }),
    ).toMatch(/parcela_renda soma/);
    expect(motivoPopsInvalidos(TIPOS, { a: PAIS.a })).toMatch(/falta o pop b/);
  });
});
