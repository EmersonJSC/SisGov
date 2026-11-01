// Lei não legislada: o país não declarou, a partida abre e o jogador propõe.
import { describe, expect, it } from "vitest";
import { criarPartida, jogar } from ".";

describe("lei não legislada", () => {
  it("fica fora do estado e passa a arrecadar quando proposta", () => {
    const partida = criarPartida("teste", 42);
    expect(partida.estado.leis["imposto-poluicao"]).toBeUndefined();
    const sem = jogar(partida, 1).estado.essenciais.arrecadacao;
    const com = jogar(partida, 1, [
      { tipo: "mudar_lei", lei: "imposto-poluicao", valor: 0.2 },
    ]).estado;
    expect(com.leis["imposto-poluicao"]).toBe(0.2);
    expect(com.essenciais.arrecadacao).toBeGreaterThan(sem);
  });
});

describe("congresso", () => {
  it("lei só muda com voto: a que cai não muda nem enfileira efeito", () => {
    const partida = criarPartida("teste", 42);
    const caiu = jogar(partida, 1, [
      { tipo: "mudar_lei", lei: "imposto-renda", valor: 0.3 },
    ]).estado;
    expect(caiu.votacoes[0].aprovada).toBe(false);
    expect(caiu.leis["imposto-renda"]).toBe(0.2);
    expect(caiu.efeitos).toEqual(jogar(partida, 1).estado.efeitos);

    const sem = jogar(criarPartida("teste", 42, { semCongresso: true }), 1, [
      { tipo: "mudar_lei", lei: "imposto-renda", valor: 0.3 },
    ]).estado;
    expect(sem.leis["imposto-renda"]).toBe(0.3);
  });
});
