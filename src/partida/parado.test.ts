// Ficar parado não pode dar ponto (15/nov): sem lei nova, a rede de saúde do
// turno 0 já está no ponto das leis em vigor e não sobe sozinha.
import { describe, expect, it } from "vitest";
import { apoioAtual, criarPartida, jogar } from ".";

describe("governo parado", () => {
  const p = criarPartida("brasil-2026", 42);
  const fim = jogar(p, 10, []).estado;

  it("saúde e atendimento ficam onde começaram", () => {
    for (const id of ["saude", "atendimento"])
      expect(
        Math.abs(fim.jogabilidade[id] - p.estado.jogabilidade[id]),
      ).toBeLessThan(0.5);
  });

  it("a aprovação não sobe sozinha", () => {
    expect(apoioAtual(fim)).toBeLessThanOrEqual(apoioAtual(p.estado));
  });

  it("nenhum índice do jogo salta do turno 0 para o turno 1", () => {
    const antes = p.estado.jogabilidade;
    const depois = jogar(p, 1, []).estado.jogabilidade;
    const saltos = Object.keys(antes).filter(
      (k) => Math.abs(depois[k] - antes[k]) > 0.3,
    );
    expect(saltos).toEqual([]);
  });
});
