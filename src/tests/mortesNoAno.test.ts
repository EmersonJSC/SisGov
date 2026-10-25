import { describe, expect, it } from "vitest";
import { criarPartida, type Partida } from "../app/partida";
import { calculateDerivedValue } from "../engine/mechanisms/derivedVariables";

describe("mortes no ano", () => {
  it("calcula a taxa anual por mil habitantes e reage à mortalidade", () => {
    const criada = criarPartida({ ocorrencias: false });
    if (!criada.ok) throw new Error(criada.erros.join(" "));
    const partida = criada.value as Partida;
    const values = partida.game.execution.values;
    const variable = partida.content.variables.variaveis.find(
      (item) => item.id === "mortes_no_ano",
    );
    if (!variable) throw new Error("Variável mortes_no_ano ausente.");
    const expected = (values.populacao * values.taxa_mortalidade) / 1000;
    expect(values.mortes_no_ano).toBeCloseTo(expected, 4);
    expect(
      Math.abs(values.mortes_no_ano - (213_000_000 * 7) / 1000),
    ).toBeLessThan(((213_000_000 * 7) / 1000) * 0.01);
    expect(
      calculateDerivedValue(variable, {
        ...values,
        taxa_mortalidade: values.taxa_mortalidade + 3,
      }),
    ).toBeGreaterThan(values.mortes_no_ano);
  });
});
