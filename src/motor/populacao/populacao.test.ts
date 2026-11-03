import { describe, expect, it } from "vitest";
import {
  calcularPops,
  migrarPops,
  motivoEscadasInvalidas,
  motivoPopsInvalidos,
  type TipoPop,
} from ".";

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

describe("mobilidade de estrato (R11.6)", () => {
  const TIPOS_M: TipoPop[] = [
    {
      id: "a",
      estrato: "pobre",
      bussola: {},
      sobe: { para: "b", exige: "esc" },
    },
    { id: "b", estrato: "rico", bussola: {}, desce: "a" },
  ];
  const entrada = (renda: number, esc: number) => ({
    pops: calcularPops(TIPOS_M, PAIS, {
      populacao: 100,
      pib_nominal: 1000,
      imposto_renda: 0,
      transferencias: {},
    }),
    populacao: 100,
    renda_pop: { a: 5, b: 30 },
    indice_precos: 100,
    esperado: 1,
    indices: { esc },
    renda,
  });
  const migrar = (
    renda: number,
    esc: number,
    antes?: Record<string, number>,
  ) => {
    const e = entrada(renda, esc);
    e.pops.a = { ...e.pops.a, renda: renda };
    e.pops.b = { ...e.pops.b, renda: 30 * (renda / 5) };
    return migrarPops(TIPOS_M, PAIS, antes, e);
  };

  it("renda acima do esperado com instrução faz gente subir", () => {
    const m = migrar(6.25, 100);
    expect(m.a).toBeLessThan(0);
    expect(m.b).toBeCloseTo(-(m.a ?? 0), 12);
  });

  it("sem instrução ninguém sobe", () => {
    expect(migrar(6.25, 0).a ?? 0).toBe(0);
  });

  it("renda abaixo do esperado faz gente descer, sem exigir instrução", () => {
    const m = migrar(3.75, 0);
    expect(m.b).toBeLessThan(0);
    expect(m.a).toBeGreaterThan(0);
  });

  it("o passo e o teto de 30% valem", () => {
    const m = migrar(6.25, 100);
    expect(Math.abs(m.a ?? 0)).toBeCloseTo(0.8 * 0.01, 12);
    let acc: Record<string, number> | undefined;
    for (let i = 0; i < 200; i++) acc = migrar(6.25, 100, acc);
    expect(acc!.a).toBeGreaterThanOrEqual(-0.3 * 0.8 - 1e-12);
    expect(acc!.b).toBeLessThanOrEqual(0.3 * 0.2 + 1e-12);
  });

  it("quem muda passa a ganhar como o pop novo; o PIB fecha e a gente também", () => {
    const pops = calcularPops(TIPOS_M, PAIS, {
      populacao: 100,
      pib_nominal: 1000,
      imposto_renda: 0,
      transferencias: {},
      migracao: { a: -0.1, b: 0.1 },
    });
    expect(pops.a.pessoas + pops.b.pessoas).toBeCloseTo(100, 9);
    expect(
      pops.a.pessoas * pops.a.renda_bruta + pops.b.pessoas * pops.b.renda_bruta,
    ).toBeCloseTo(1000, 6);
    expect(pops.b.pessoas).toBeCloseTo(30, 9);
  });

  it("recusa escada para estrato errado ou pop que não existe", () => {
    expect(motivoEscadasInvalidas(TIPOS_M)).toBeNull();
    expect(
      motivoEscadasInvalidas([
        { ...TIPOS_M[0], sobe: { para: "x", exige: "e" } },
      ]),
    ).toMatch(/não existe/);
    expect(
      motivoEscadasInvalidas([TIPOS_M[0], { ...TIPOS_M[1], desce: "b" }]),
    ).toMatch(/estrato mais baixo/);
  });
});
