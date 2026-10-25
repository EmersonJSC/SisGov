import { describe, expect, it } from "vitest";
import { criarPartida, encerrarTurno, type Partida } from "../app/partida";
import { calculateDerivedValue } from "../engine/mechanisms/derivedVariables";

function nova() {
  const criada = criarPartida({
    semente: 7,
    ocorrencias: false,
    eleicao: false,
  });
  if (!criada.ok) throw new Error(criada.erros.join("; "));
  return criada.value;
}

function avancar(p: Partida, turnos: number) {
  for (let i = 0; i < turnos; i++) {
    const resultado = encerrarTurno(p);
    if (!resultado.ok) throw new Error(resultado.erros.join("; "));
    p = resultado.value.partida;
  }
  return p;
}

describe("salários", () => {
  it("calcula massa salarial, reajusta o salário médio e reage ao desemprego", () => {
    const partida = nova();
    const inicio = partida.game.execution.values;
    const massa = partida.content.variables.variaveis.find(
      (variavel) => variavel.id === "massa_salarial",
    );
    const ocupados = partida.content.variables.variaveis.find(
      (variavel) => variavel.id === "ocupados",
    );
    if (!massa) throw new Error("Variável massa_salarial ausente.");
    if (!ocupados) throw new Error("Variável ocupados ausente.");

    expect(inicio.massa_salarial).toBeCloseTo(
      inicio.ocupados * inicio.salario_medio * 0.000001,
      4,
    );
    const maisDesemprego = {
      ...inicio,
      desemprego: inicio.desemprego + 10,
    };
    const ocupadosComMaisDesemprego = calculateDerivedValue(
      ocupados,
      maisDesemprego,
    );
    if (ocupadosComMaisDesemprego === undefined)
      throw new Error("Não foi possível calcular ocupados.");
    const maisOcupados = {
      ...maisDesemprego,
      ocupados: ocupadosComMaisDesemprego,
    };
    expect(calculateDerivedValue(massa, maisOcupados)).toBeLessThan(
      inicio.massa_salarial,
    );
    expect(
      avancar(partida, 4).game.execution.values.salario_medio,
    ).toBeGreaterThan(inicio.salario_medio);
  });
});
