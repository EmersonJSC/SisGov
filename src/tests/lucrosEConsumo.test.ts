import { describe, expect, it } from "vitest";
import { criarPartida } from "../app/partida";
import { calculateDerivedValue } from "../engine/mechanisms/derivedVariables";

describe("lucros e consumo das famílias", () => {
  it("calcula as fórmulas e reage à massa salarial e à propensão", () => {
    const criada = criarPartida({ semente: 7, ocorrencias: false });
    if (!criada.ok) throw new Error(criada.erros.join("; "));
    const partida = criada.value;
    const values = partida.game.execution.values;
    const lucros = partida.content.variables.variaveis.find(
      (variavel) => variavel.id === "lucros",
    );
    const consumo = partida.content.variables.variaveis.find(
      (variavel) => variavel.id === "consumo_familias",
    );
    if (!lucros || !consumo) throw new Error("Variáveis econômicas ausentes.");

    expect(values.lucros).toBeCloseTo(
      values.pib_nominal -
        values.massa_salarial -
        values.pib_nominal * values.carga_impostos_consumo * 0.01,
      4,
    );
    expect(values.consumo_familias).toBeCloseTo(
      (values.massa_salarial + values.lucros * 0.3) *
        values.propensao_consumo *
        0.01,
      4,
    );
    expect(
      calculateDerivedValue(lucros, {
        ...values,
        massa_salarial: values.massa_salarial + 100,
      }),
    ).toBeLessThan(values.lucros);
    expect(
      calculateDerivedValue(consumo, {
        ...values,
        propensao_consumo: values.propensao_consumo + 5,
      }),
    ).toBeGreaterThan(values.consumo_familias);
  });
});
