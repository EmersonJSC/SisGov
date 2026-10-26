import { describe, expect, it } from "vitest";
import type { VariableDefinition } from "../engine/model/contentTypes";
import {
  calculateDerivedValue,
  orderDerivedVariables,
} from "../engine/mechanisms/derivedVariables";
import { validateContentFile } from "../engine";

const derivado = (
  id: string,
  fatores: {
    var: string;
    escala?: number;
    complemento?: boolean;
    inverso?: boolean;
  }[],
): VariableDefinition => ({
  id,
  tipo: "derivado",
  nome: id,
  unidade: "quantidade",
  dominio: { minimo: 0 },
  formula: { termos: [{ sinal: 1, fatores }] },
});

describe("variáveis derivadas", () => {
  it("calcula produtos, complementos e termos somados", () => {
    const node = {
      ...derivado("resultado", [
        { var: "populacao" },
        { var: "participacao", escala: 0.01 },
        { var: "desemprego", escala: 0.01, complemento: true },
      ]),
      formula: {
        termos: [
          {
            sinal: 1 as const,
            fatores: [
              { var: "populacao" },
              { var: "participacao", escala: 0.01 },
              { var: "desemprego", escala: 0.01, complemento: true },
            ],
          },
          { sinal: -1 as const, fatores: [{ var: "deducao" }] },
        ],
      },
    };
    expect(
      calculateDerivedValue(node, {
        populacao: 1000,
        participacao: 50,
        desemprego: 10,
        deducao: 20,
      }),
    ).toBe(430);
  });

  it("ordena dependências e recusa ciclos", () => {
    const primeiro = derivado("primeiro", [{ var: "base" }]);
    const segundo = derivado("segundo", [{ var: "primeiro" }]);
    expect(
      orderDerivedVariables([segundo, primeiro])?.map((v) => v.id),
    ).toEqual(["primeiro", "segundo"]);
    const cicloA = derivado("ciclo_a", [{ var: "ciclo_b" }]);
    const cicloB = derivado("ciclo_b", [{ var: "ciclo_a" }]);
    expect(orderDerivedVariables([cicloA, cicloB])).toBeUndefined();
  });

  it("divide por um fator inverso e não calcula com divisor zero", () => {
    const node = derivado("resultado", [
      { var: "a" },
      { var: "b", inverso: true },
    ]);
    expect(calculateDerivedValue(node, { a: 10, b: 4 })).toBe(2.5);
    expect(calculateDerivedValue(node, { a: 10, b: 0 })).toBeUndefined();
  });

  it("recusa fator inverso e complemento ao mesmo tempo", () => {
    const node = derivado("resultado", [
      { var: "a", inverso: true, complemento: true },
    ]);
    const result = validateContentFile(
      "variaveis.json",
      JSON.stringify({
        id: "teste",
        tipo: "variaveis",
        versaoEsquema: 1,
        variaveis: [node],
      }),
    );
    expect(result).toMatchObject({
      ok: false,
      diagnostics: [
        expect.objectContaining({
          message:
            "Um fator não pode ser inverso e complemento ao mesmo tempo.",
        }),
      ],
    });
  });
});
