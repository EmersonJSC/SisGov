// Lei não legislada: o país não declarou, a partida abre e o jogador propõe.
import { describe, expect, it } from "vitest";
import { criarPartida, jogar, mesesParaEleicao } from ".";

describe("lei não legislada", () => {
  it("fica fora do estado e passa a arrecadar quando proposta", () => {
    const partida = criarPartida("teste", 42, { semCongresso: true });
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
      { tipo: "mudar_lei", lei: "areas-protegidas", valor: 0.2 },
    ]).estado;
    expect(caiu.votacoes[0].aprovada).toBe(false);
    expect(caiu.leis["areas-protegidas"]).toBe(0.1);
    expect(caiu.efeitos).toEqual(jogar(partida, 1).estado.efeitos);

    const sem = jogar(criarPartida("teste", 42, { semCongresso: true }), 1, [
      { tipo: "mudar_lei", lei: "areas-protegidas", valor: 0.2 },
    ]).estado;
    expect(sem.leis["areas-protegidas"]).toBe(0.2);
  });
});

describe("eleição", () => {
  it("conta os meses até a eleição: 48 no começo, 2 no último turno antes dela", () => {
    const partida = criarPartida("teste", 42);
    expect(mesesParaEleicao(partida)).toBe(48);
    expect(mesesParaEleicao(jogar(partida, 5))).toBe(38);
    expect(mesesParaEleicao(jogar(partida, 23))).toBe(2);
  });

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

describe("opinião das potências", () => {
  it("começa a do país e anda pela bússola quando a lei muda", () => {
    const partida = criarPartida("teste", 42, { semCongresso: true });
    expect(partida.estado.opinioes["uniao-continental"]).toBe(85);
    const igual = jogar(partida, 12).estado.opinioes;
    const pena = jogar(partida, 12, [
      { tipo: "mudar_lei", lei: "pena-de-morte", valor: "crimes-graves" },
    ]).estado.opinioes;
    // Pena de morte é autoritária: quem é autoritário gosta, quem não é, não.
    expect(pena["liga-do-golfo"]).toBeGreaterThan(igual["liga-do-golfo"]);
    expect(pena["federacao-do-leste"]).toBeGreaterThan(igual["federacao-do-leste"]);
    expect(pena["uniao-continental"]).toBeLessThan(igual["uniao-continental"]);
  });
});

describe("reputação internacional", () => {
  it("é a média das opiniões pesada, no turno 0 e depois", () => {
    const media = (p: ReturnType<typeof criarPartida>) =>
      p.regras.potencias!.reduce(
        (s, x) => s + x.peso * p.estado.opinioes[x.id],
        0,
      );
    const partida = criarPartida("teste", 42, { semCongresso: true });
    const indice = partida.regras.indiceReputacao!;
    expect(partida.estado.jogabilidade[indice]).toBeCloseTo(media(partida));
    const depois = jogar(partida, 3, [
      { tipo: "mudar_lei", lei: "pena-de-morte", valor: "crimes-graves" },
    ]);
    expect(depois.estado.jogabilidade[indice]).toBeCloseTo(media(depois));
    expect(depois.estado.jogabilidade[indice]).not.toBeCloseTo(
      partida.estado.jogabilidade[indice],
    );
  });
});
