import { describe, expect, it } from "vitest";
import { criarPartida, type Partida } from "../app/partida";
import { calculateDerivedValue } from "../engine/mechanisms/derivedVariables";

describe("pessoas ocupadas", () => {
  it("calcula a população ocupada e diminui quando o desemprego sobe", () => {
    const criada = criarPartida({ ocorrencias: false });
    if (!criada.ok) throw new Error(criada.erros.join(" "));
    const partida = criada.value as Partida;
    const values = partida.game.execution.values;
    const variable = partida.content.variables.variaveis.find(
      (item) => item.id === "ocupados",
    );
    if (!variable) throw new Error("Variável ocupados ausente.");
    const formula =
      values.populacao *
      (values.idade_de_trabalhar / 100) *
      (values.participacao_trabalho / 100) *
      (1 - values.desemprego / 100);
    expect(values.ocupados).toBeCloseTo(formula, 4);
    const withMoreUnemployment = calculateDerivedValue(variable, {
      ...values,
      desemprego: values.desemprego + 10,
    });
    expect(withMoreUnemployment).toBeLessThan(values.ocupados);
  });
});
