import { describe, expect, it } from "vitest";
import { evaluateDilemma } from "../engine";

describe("evaluateDilemma", () => {
  it("cria uma escolha pendente sem aplicar opção", () => {
    const dilemma = {
      id: "vacinas",
      triggerWhen: {
        tipo: "comparacao" as const,
        variavel: "estoque",
        operador: "menor_que" as const,
        valor: 10,
      },
      optionIds: ["priorizar_idosos", "priorizar_profissionais"],
    };
    expect(evaluateDilemma(dilemma, undefined, { estoque: 5 })).toEqual({
      ok: true,
      value: {
        dilemmaId: "vacinas",
        optionIds: ["priorizar_idosos", "priorizar_profissionais"],
      },
    });
  });
});
