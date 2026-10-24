import { describe, expect, it } from "vitest";
import { criarPartida, encerrarTurno, type Partida } from "../app/partida";

function turno(partida: Partida): Partida {
  const resultado = encerrarTurno(partida);
  if (!resultado.ok) throw new Error(resultado.erros.join(" "));
  return resultado.value.partida;
}

describe("PIB nominal", () => {
  it("cresce em reais depois de quatro turnos sem mudar nada", () => {
    const criada = criarPartida({ ocorrencias: false });
    if (!criada.ok) throw new Error(criada.erros.join(" "));
    const inicial = criada.value.game.execution.values.pib_nominal;
    let partida = criada.value;
    for (let i = 0; i < 4; i++) partida = turno(partida);
    expect(partida.game.execution.values.pib_nominal).toBeGreaterThan(inicial);
  });
});
