import { describe, expect, it } from "vitest";
import {
  alvoComBancoCentral,
  estourosFiscais,
  indiceDaPrevidencia,
  vazamento,
} from ".";

describe("fisco", () => {
  it("cobrir mais gente do que há no estrato vaza o resto para cima", () => {
    expect(vazamento(0.2, 0.5)).toBe(0);
    expect(vazamento(undefined, 0.5)).toBe(0);
    expect(vazamento(1, 0.5)).toBe(0.5);
  });

  it("meta de inflação abaixo da inflação sobe o juro do Banco Central", () => {
    const com = (meta: number) =>
      alvoComBancoCentral(14, 5, { meta, autonomia: 1, peso_da_meta: 0.5 });
    expect(com(3)).toBeGreaterThan(com(5));
    expect(com(5)).toBe(14);
  });

  it("BC autônomo ignora a taxa pedida; sem autonomia, vale a do governo", () => {
    const pedido = { taxa: 8, meta: 5, peso_da_meta: 0.5 };
    expect(alvoComBancoCentral(14, 5, { ...pedido, autonomia: 1 })).toBe(14);
    expect(alvoComBancoCentral(14, 5, { ...pedido, autonomia: 0 })).toBe(8);
    expect(alvoComBancoCentral(14, 5, { ...pedido, autonomia: 0.5 })).toBe(11);
  });

  it("cada regra estoura pelo seu número", () => {
    const regra = {
      lei_teto_gasto: "teto",
      lei_meta_resultado: "meta",
      lei_limite_divida: "limite",
      lei_teto_carga: "carga",
      folga_da_meta: 0.25,
      pisos: [],
    };
    const valores = { teto: 0.02, meta: 0, limite: 80, carga: 0.3 };
    const conta = {
      gastoReal: 1.01,
      anos: 1,
      resultado_primario: -0.1,
      divida_publica: 70,
      arrecadacao: 29,
    };
    expect(estourosFiscais(regra, valores, conta)).toEqual([]);
    expect(
      estourosFiscais(regra, valores, {
        gastoReal: 1.05,
        anos: 1,
        resultado_primario: -1,
        divida_publica: 90,
        arrecadacao: 31,
      }),
    ).toEqual(["teto_gasto", "meta_resultado", "limite_divida", "teto_carga"]);
    // sem a lei, a regra não existe
    expect(
      estourosFiscais(regra, {}, { ...conta, divida_publica: 200 }),
    ).toEqual([]);
  });

  it("déficit da previdência vira índice dentro do domínio", () => {
    expect(indiceDaPrevidencia(3, 10, { min: 0, max: 100 })).toBe(30);
    expect(indiceDaPrevidencia(-2, 10, { min: 0, max: 100 })).toBe(0);
    expect(indiceDaPrevidencia(20, 10, { min: 0, max: 100 })).toBe(100);
  });
});
