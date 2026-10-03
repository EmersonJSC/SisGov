import { describe, expect, it } from "vitest";
import { evaluateCondition } from "../engine";

describe("evaluateCondition", () => {
  it("combina comparações sem executar código", () => {
    expect(
      evaluateCondition(
        {
          tipo: "e",
          condicoes: [
            {
              tipo: "comparacao",
              variavel: "educacao",
              operador: "menor_que",
              valor: 50,
            },
            {
              tipo: "nao",
              condicao: {
                tipo: "comparacao",
                variavel: "divida",
                operador: "maior_que",
                valor: 100,
              },
            },
          ],
        },
        { educacao: 40, divida: 90 },
      ),
    ).toEqual({ ok: true, value: true });
  });
});
