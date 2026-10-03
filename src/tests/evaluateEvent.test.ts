import { describe, expect, it } from "vitest";
import { evaluateEvent } from "../engine";

describe("evaluateEvent", () => {
  it("dispara uma vez e não se repete", () => {
    const event = {
      id: "enchente",
      triggerWhen: {
        tipo: "comparacao" as const,
        variavel: "chuva",
        operador: "maior_ou_igual" as const,
        valor: 90,
      },
    };
    expect(evaluateEvent(event, false, { chuva: 95 })).toEqual({
      ok: true,
      value: true,
    });
    expect(evaluateEvent(event, true, { chuva: 95 })).toEqual({
      ok: true,
      value: false,
    });
  });
});
