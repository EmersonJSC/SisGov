import { describe, expect, it } from "vitest";
import { criarPartida, encerrarTurno, verPartida } from "../app/partida";
import { aplicarMeta } from "../app/partida/leis";

describe("Cooperação internacional", () => {
  it("contabiliza no gasto público a contribuição de 0,7%", () => {
    const criar = () => {
      const resultado = criarPartida({
        modo: "real",
        semente: 7,
        ocorrencias: false,
        eleicao: false,
      });
      if (!resultado.ok) throw new Error(resultado.erros.join("; "));
      return resultado.value;
    };

    const referencia = encerrarTurno(criar());
    if (!referencia.ok) throw new Error(referencia.erros.join("; "));

    const alterada = aplicarMeta(criar(), "cooperacao-internacional", 100);
    if (!alterada.ok) throw new Error(alterada.erros.join("; "));
    const executada = encerrarTurno(alterada.value);
    if (!executada.ok) throw new Error(executada.erros.join("; "));

    const gastoReferencia = verPartida(referencia.value.partida).contas
      .percentualPib.gasto;
    const gastoComCooperacao = verPartida(executada.value.partida).contas
      .percentualPib.gasto;
    expect(gastoComCooperacao - gastoReferencia).toBeGreaterThan(0.6);
    expect(gastoComCooperacao - gastoReferencia).toBeLessThan(0.67);
  });
});
