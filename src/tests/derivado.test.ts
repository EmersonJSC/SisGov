import { describe, expect, it } from "vitest";
import type { VariableDefinition } from "../engine/model/contentTypes";
import {
  calculateDerivedValue,
  orderDerivedVariables,
} from "../engine/mechanisms/derivedVariables";

const derivado = (
  id: string,
  fatores: { var: string; escala?: number; complemento?: boolean }[],
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
});
