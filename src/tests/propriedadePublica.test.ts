import { describe, expect, it } from "vitest";
import { criarPartida, encerrarTurno } from "../app/partida";
import { aplicarMeta } from "../app/partida/leis";
import { saldoDasLeis } from "../app/partida/contas";

function nova() {
  const resultado = criarPartida({
    modo: "real",
    semente: 7,
    ocorrencias: false,
    eleicao: false,
  });
  if (!resultado.ok) throw new Error(resultado.erros.join("; "));
  return resultado.value;
}

describe("Participação pública na propriedade produtiva", () => {
  it("aceita os cinco níveis de participação da escala", () => {
    for (const nivel of [0, 25, 50, 75, 100]) {
      const alterada = aplicarMeta(
        nova(),
        "propriedade-dos-meios-de-producao",
        nivel,
      );
      expect(alterada.ok).toBe(true);
      if (!alterada.ok) continue;
      expect(
        alterada.value.game.policies.find(
          (policy) =>
            policy.policyDefinitionId === "propriedade-dos-meios-de-producao",
        )?.desiredLevel,
      ).toBe(nivel);
    }
  });

  it("vincula o saldo fiscal recorrente à participação pública", () => {
    const executar = (nivel: number) => {
      const aplicada = aplicarMeta(
        nova(),
        "propriedade-dos-meios-de-producao",
        nivel,
      );
      if (!aplicada.ok) throw new Error(aplicada.erros.join("; "));
      let partida = aplicada.value;
      for (let turno = 0; turno < 16; turno++) {
        const resultado = encerrarTurno(partida);
        if (!resultado.ok) throw new Error(resultado.erros.join("; "));
        partida = resultado.value.partida;
      }
      return saldoDasLeis(
        partida,
        partida.game.execution.values,
      )("propriedade-dos-meios-de-producao");
    };

    const privada = executar(0);
    const publica = executar(100);
    expect(publica).toBeGreaterThan(privada);
  });
});
