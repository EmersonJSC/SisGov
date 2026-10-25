import { describe, expect, it } from "vitest";
import { criarPartida, encerrarTurno, type Partida } from "../app/partida";

function avancar(p: Partida, turnos: number) {
  for (let i = 0; i < turnos; i++) {
    const resultado = encerrarTurno(p);
    if (!resultado.ok) throw new Error(resultado.erros.join("; "));
    p = resultado.value.partida;
  }
  return p;
}

describe("patrimônios", () => {
  it("os três patrimônios crescem em quatro turnos", () => {
    const criada = criarPartida({
      semente: 7,
      ocorrencias: false,
      eleicao: false,
    });
    if (!criada.ok) throw new Error(criada.erros.join("; "));
    const inicial = criada.value.game.execution.values;
    const final = avancar(criada.value, 4).game.execution.values;

    for (const id of [
      "patrimonio_imoveis_urbanos",
      "patrimonio_terras",
      "patrimonio_financeiro",
    ]) {
      expect(final[id]).toBeGreaterThan(inicial[id]);
    }
  });
});
