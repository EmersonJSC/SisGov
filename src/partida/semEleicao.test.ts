// Teste sem eleição (16/nov): perder não encerra a partida.
import { describe, expect, it } from "vitest";
import { criarPartida, jogar } from ".";

describe("sem eleição", () => {
  it("passa do fim do mandato sem encerrar", () => {
    const p = criarPartida("brasil-2026", 42, {
      semCongresso: true,
      semEleicao: true,
    });
    const depois = jogar(p, 30);
    expect(depois.estado.encerrada).toBeFalsy();
    expect(depois.estado.turno).toBe(p.estado.turno + 30);
  });
});
