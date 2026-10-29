import { describe, expect, it } from "vitest";
import { criarPartida, encerrarTurno, type Partida } from "../app/partida";

function turno(partida: Partida): Partida {
  const resultado = encerrarTurno(partida);
  if (!resultado.ok) throw new Error(resultado.erros.join(" "));
  return resultado.value.partida;
}

describe("população", () => {
  it("sobe com natalidade maior que mortalidade e desce no caso inverso", () => {
    const criada = criarPartida({ ocorrencias: false });
    if (!criada.ok) throw new Error(criada.erros.join(" "));
    const inicial = criada.value.game.execution.values.populacao;
    let partida = criada.value;
    for (let i = 0; i < 4; i++) partida = turno(partida);
    expect(partida.game.execution.values.populacao).toBeGreaterThan(inicial);

    const antesDaQueda = partida.game.execution.values.populacao;
    // natalidade e mortalidade são calculadas: o teste as derruba a cada turno
    for (let i = 0; i < 4; i++) {
      const valores = partida.game.execution.values as Record<string, number>;
      valores.natalidade = 0;
      valores.saude_populacao = 0;
      partida = turno(partida);
    }
    expect(partida.game.execution.values.populacao).toBeLessThan(antesDaQueda);
  });
});
