import { describe, expect, it } from "vitest";
import { evaluateSituation } from "../engine";

const overload = {
  id: "sobrecarga",
  enterWhen: {
    tipo: "comparacao" as const,
    variavel: "pressao",
    operador: "maior_ou_igual" as const,
    valor: 0.7,
  },
  exitWhen: {
    tipo: "comparacao" as const,
    variavel: "pressao",
    operador: "menor_que" as const,
    valor: 0.4,
  },
};

describe("evaluateSituation", () => {
  it("entra acima de 0,7, mantém-se na faixa e sai abaixo de 0,4", () => {
    expect(evaluateSituation(overload, false, { pressao: 0.7 })).toEqual({
      ok: true,
      value: true,
    });
    expect(evaluateSituation(overload, true, { pressao: 0.5 })).toEqual({
      ok: true,
      value: true,
    });
    expect(evaluateSituation(overload, true, { pressao: 0.3 })).toEqual({
      ok: true,
      value: false,
    });
  });
});
