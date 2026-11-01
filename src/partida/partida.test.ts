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

describe("eleição", () => {
  it("governo parado perde no turno 24 e a partida acaba", () => {
    const partida = criarPartida("teste", 42);
    const antes = jogar(partida, 23).estado;
    expect(antes.eleicao).toBeNull();
    expect(antes.desgaste).toBeCloseTo((2.25 * 23) / 24);
    const fim = jogar(partida, 24).estado;
    expect(fim.eleicao?.turno).toBe(24);
    expect(fim.eleicao?.venceu).toBe(false);
    expect(fim.encerrada).toBe(true);
    expect(() => jogar({ ...partida, estado: fim }, 1)).toThrow(/encerrada/);
  });

  it("governo que agrada o maior grupo vence e começa outro mandato", () => {
    const fim = jogar(criarPartida("teste", 42), 24, [
      { tipo: "mudar_lei", lei: "transferencia-renda", valor: 0.04 },
    ]).estado;
    expect(fim.eleicao?.venceu).toBe(true);
    expect(fim.encerrada).toBe(false);
    expect(fim.inicio_mandato).toBe(24);
    expect(fim.desgaste).toBeCloseTo(2.25);
  });
});
