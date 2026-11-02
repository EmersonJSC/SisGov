import { describe, expect, it } from "vitest";
import { contaDoPais, precoDoPais, type Mercado } from "./index";
import { precosIniciais } from "./preco";

const mercado: Mercado = {
  setores: [{ id: "e", nome: "E", descricao: "" }],
  cestas: [{ id: "comida", nome: "Comida", tamanho: 0.1 }],
  produtos: [
    {
      id: "graos",
      nome: "Grãos",
      setor: "e",
      cesta: { id: "comida", peso: 0.6 },
      unidade: { nome: "fazendas", tamanho: 0.05 },
    },
    {
      id: "frutas",
      nome: "Frutas",
      setor: "e",
      cesta: { id: "comida", peso: 0.4 },
    },
  ],
};
// Duas potências com 100 em tudo: preço do mundo no base, sem excedente.
const sem = { a: { graos: 100, frutas: 100 }, b: { graos: 100, frutas: 100 } };
// Potências com muito excedente de grãos.
const com = { a: { graos: 200, frutas: 100 }, b: { graos: 150, frutas: 100 } };

const conta = (
  potencias: typeof sem,
  cobertura: Record<string, number>,
  pessoas = 1000,
) =>
  contaDoPais(
    mercado,
    potencias,
    cobertura,
    1000,
    pessoas,
    precosIniciais(mercado, potencias),
  );

describe("demanda dos pops (fatia 6a)", () => {
  it("a mesma entrada dá o mesmo resultado", () => {
    expect(conta(sem, { graos: 80, frutas: 100 })).toEqual(
      conta(sem, { graos: 80, frutas: 100 }),
    );
  });

  it("população maior sobe a demanda; a cobertura cai", () => {
    const antes = conta(sem, { graos: 100, frutas: 100 }).produtos.graos!;
    const depois = conta(sem, { graos: 100, frutas: 100 }, 1500).produtos
      .graos!;
    expect(depois.demanda).toBeCloseTo(antes.demanda * 1.5, 6);
    expect(depois.cobertura).toBeLessThan(antes.cobertura);
  });

  it("cesta atendida e preço no base: preço no base", () => {
    const c = conta(sem, { graos: 100, frutas: 100 }).produtos;
    expect(c.graos!.preco).toBeCloseTo(100, 6);
    expect(c.frutas!.preco).toBeCloseTo(100, 6);
  });

  it("sobra de produção deixa o preço abaixo do base", () => {
    const c = conta(sem, { graos: 150, frutas: 100 }).produtos;
    expect(c.graos!.preco).toBeLessThan(100);
  });

  it("falta sem ninguém para vender sobe o preço até o teto de 175%", () => {
    const c = conta(sem, { graos: 10, frutas: 100 }).produtos.graos!;
    expect(c.importa).toBe(0);
    expect(c.preco).toBeLessThanOrEqual(175 + 1e-9);
    expect(c.preco).toBeGreaterThan(150);
  });

  it("com excedente lá fora, o país compra a falta pelo preço do mundo", () => {
    const c = conta(com, { graos: 50, frutas: 100 }).produtos.graos!;
    expect(c.importa).toBeGreaterThan(0);
    expect(c.oferta).toBeCloseTo(c.demanda, 6);
  });

  it("mostra quantas unidades a produção equivale", () => {
    const c = conta(sem, { graos: 100, frutas: 100 }).produtos.graos!;
    expect(c.unidades?.nome).toBe("fazendas");
    expect(c.unidades!.quantas).toBeCloseTo(c.producao / 0.05, 6);
  });

  it("a faixa do preço vai de 25% a 175% do base", () => {
    expect(precoDoPais(10, 1000, 0, 100)).toBeCloseTo(25, 6);
    expect(precoDoPais(1000, 10, 0, 100)).toBeCloseTo(175, 6);
  });
});
