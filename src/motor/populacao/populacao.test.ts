import { describe, expect, it } from "vitest";
import {
  calcularPops,
  andarEmprego,
  migrarNaFaixa,
  migrarPops,
  taxaDeDesemprego,
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

describe("fontes da renda (15/nov)", () => {
  const entrada = {
    populacao: 100,
    pib_nominal: 1000,
    imposto_renda: 0,
    transferencias: {},
  };
  const parte = (pops: ReturnType<typeof calcularPops>, id: string) =>
    (pops[id].pessoas * pops[id].renda_bruta) / 1000;

  it("com toda fonte valendo 1, a renda é a declarada", () => {
    const pops = calcularPops(TIPOS, PAIS, {
      ...entrada,
      fontes: { partes: { a: { x: 1 }, b: { y: 1 } }, indice: {} },
    });
    expect(parte(pops, "a")).toBeCloseTo(0.4);
    expect(parte(pops, "b")).toBeCloseTo(0.6);
  });

  it("a fonte que cresce tira das outras; a soma continua o PIB", () => {
    const pops = calcularPops(TIPOS, PAIS, {
      ...entrada,
      fontes: {
        partes: { a: { x: 1 }, b: { y: 0.5, fixa: 0.5 } },
        indice: { x: 1.5 },
      },
    });
    // a: 0,4 × 1,5 = 0,6; b: 0,6 × 1 = 0,6; dividido por 1,2.
    expect(parte(pops, "a")).toBeCloseTo(0.5);
    expect(parte(pops, "a") + parte(pops, "b")).toBeCloseTo(1);
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

describe("troca na mesma faixa (B5)", () => {
  const tipos: TipoPop[] = [
    { id: "x", estrato: "medio", bussola: {}, muda: { para: "y" } },
    { id: "y", estrato: "medio", bussola: {} },
  ];
  const pais = {
    x: { parcela_pessoas: 0.5, parcela_renda: 0.5 },
    y: { parcela_pessoas: 0.5, parcela_renda: 0.5 },
  };
  const pop = (renda: number) => ({
    pessoas: 50,
    renda_bruta: renda,
    imposto: 0,
    transferencia: 0,
    renda,
  });
  const entrada = (rendaY: number) => ({
    pops: { x: pop(10), y: pop(rendaY) },
    populacao: 100,
    renda_pop: { x: 10, y: 10 },
    indice_precos: 100,
    esperado: 1,
    indices: {},
  });

  it("sem melhora do destino, ninguém muda", () => {
    expect(migrarNaFaixa(tipos, pais, undefined, entrada(10.4))).toEqual({});
  });

  it("destino que melhorou mais puxa um pouco da gente", () => {
    const m = migrarNaFaixa(tipos, pais, undefined, entrada(13));
    expect(m.y).toBeGreaterThan(0);
    expect((m.x ?? 0) + (m.y ?? 0)).toBeCloseTo(0);
  });

  it("recusa trocar para outro estrato", () => {
    expect(
      motivoEscadasInvalidas([
        { id: "x", estrato: "medio", bussola: {}, muda: { para: "y" } },
        { id: "y", estrato: "rico", bussola: {} },
      ]),
    ).toMatch(/mesmo estrato/);
  });
});

describe("vagas e desemprego (C)", () => {
  const pais = {
    op: { parcela_pessoas: 0.5, parcela_renda: 0.5 },
    des: { parcela_pessoas: 0.1, parcela_renda: 0.05 },
    apo: { parcela_pessoas: 0.4, parcela_renda: 0.45 },
  };
  const regra = { desempregados: "des", fora_da_forca: ["apo"] };
  const vazio = { fora: {}, demitidos: [] };

  it("taxa conta só a força de trabalho", () => {
    expect(taxaDeDesemprego(regra, { op: 50, des: 10, apo: 40 })).toBeCloseTo(
      10 / 60,
    );
  });

  it("vagas iguais: ninguém muda", () => {
    const r = andarEmprego(pais, regra, vazio, undefined, { op: 1 });
    expect(r.demitidos[0]).toBe(0);
  });

  it("falta vaga: uma parte vai para os desempregados, aos poucos", () => {
    const r = andarEmprego(pais, regra, vazio, undefined, { op: 0.8 });
    // Alvo: 10% da população fora; o passo fecha 30% disso.
    expect(r.migracao.des).toBeCloseTo(0.03);
    expect(r.migracao.op).toBeCloseTo(-0.03);
    const volta = andarEmprego(pais, regra, r, r.migracao, { op: 1 });
    expect(volta.migracao.des).toBeLessThan(r.migracao.des);
  });
});
