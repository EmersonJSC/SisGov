// Lei não legislada: o país não declarou, a partida abre e o jogador propõe.
import { describe, expect, it } from "vitest";
import { montarMesa } from "../motor";
import { criarPartida, jogar, mesesParaEleicao, placarDaLei } from ".";

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
      { tipo: "mudar_lei", lei: "areas-protegidas", valor: 0.3 },
    ]).estado;
    expect(caiu.votacoes[0].aprovada).toBe(false);
    expect(caiu.leis["areas-protegidas"]).toBe(0.1);
    expect(caiu.efeitos).toEqual(jogar(partida, 1).estado.efeitos);

    const sem = jogar(criarPartida("teste", 42, { semCongresso: true }), 1, [
      { tipo: "mudar_lei", lei: "areas-protegidas", valor: 0.3 },
    ]).estado;
    expect(sem.leis["areas-protegidas"]).toBe(0.3);
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
    expect(partida.estado.opinioes["uniao-continental"]).toBe(99);
    const igual = jogar(partida, 12).estado.opinioes;
    const pena = jogar(partida, 12, [
      { tipo: "mudar_lei", lei: "pena-de-morte", valor: "crimes-graves" },
    ]).estado.opinioes;
    // Pena de morte é autoritária: quem é autoritário gosta, quem não é, não.
    expect(pena["liga-do-golfo"]).toBeGreaterThan(igual["liga-do-golfo"]);
    expect(pena["federacao-do-leste"]).toBeGreaterThan(
      igual["federacao-do-leste"],
    );
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
    // A fome e a carência também mexem na reputação (reação da cesta): 1 casa.
    expect(depois.estado.jogabilidade[indice]).toBeCloseTo(media(depois), 1);
    expect(depois.estado.jogabilidade[indice]).not.toBeCloseTo(
      partida.estado.jogabilidade[indice],
    );
  });
});

describe("segurança externa", () => {
  it("vale poder defensivo menos a perda de reputação, no turno 0 e depois", () => {
    const esperada = (p: ReturnType<typeof criarPartida>) => {
      const { indiceReputacao, indicePoderDefensivo } = p.regras;
      const j = p.estado.jogabilidade;
      return j[indicePoderDefensivo!] - (100 - j[indiceReputacao!]);
    };
    const partida = criarPartida("teste", 42, { semCongresso: true });
    const id = partida.regras.indiceSegurancaExterna!;
    expect(partida.estado.jogabilidade[id]).toBeCloseTo(esperada(partida));
    const depois = jogar(partida, 3, [
      { tipo: "mudar_lei", lei: "pena-de-morte", valor: "crimes-graves" },
    ]);
    expect(depois.estado.jogabilidade[id]).toBeCloseTo(esperada(depois));
    // anda para o mesmo lado da reputação (o poder defensivo não mudou)
    const rep = partida.regras.indiceReputacao!;
    const dRep =
      depois.estado.jogabilidade[rep] - partida.estado.jogabilidade[rep];
    const dSeg =
      depois.estado.jogabilidade[id] - partida.estado.jogabilidade[id];
    expect(dRep).not.toBeCloseTo(0);
    expect(Math.sign(dSeg)).toBe(Math.sign(dRep));
    expect(dSeg).toBeCloseTo(dRep);
  });
});

describe("fatos do turno", () => {
  it("votação e eleição vão para a mesa; a mesa envelhece", () => {
    const partida = criarPartida("teste", 42);
    const um = jogar(partida, 1, [
      { tipo: "mudar_lei", lei: "areas-protegidas", valor: 0.3 },
    ]).estado;
    expect(um.fatos).toContainEqual(
      expect.objectContaining({
        tipo: "lei-rejeitada",
        turno: 1,
        sobre: "areas-protegidas",
      }),
    );
    expect(jogar(partida, 2).estado.fatos ?? []).not.toContainEqual(
      expect.objectContaining({ sobre: "areas-protegidas" }),
    );
    const fim = jogar(partida, 24).estado;
    expect(fim.fatos).toContainEqual(
      expect.objectContaining({ tipo: "eleicao-perdida", turno: 24 }),
    );
  });

  it("mesma semente e mesmos pedidos, mesma mesa", () => {
    const pedidos = [
      { tipo: "mudar_lei" as const, lei: "transferencia-renda", valor: 0.04 },
    ];
    const a = jogar(criarPartida("teste", 7), 12, pedidos).estado.fatos;
    const b = jogar(criarPartida("teste", 7), 12, pedidos).estado.fatos;
    expect(a).toEqual(b);
  });
});

describe("congresso novo", () => {
  it("o placar previsto é o placar da votação, sem sorteio", () => {
    const partida = criarPartida("teste", 42);
    const previsto = placarDaLei(partida, "areas-protegidas", 0.3);
    const real = jogar(partida, 1, [
      { tipo: "mudar_lei", lei: "areas-protegidas", valor: 0.3 },
    ]).estado.votacoes[0];
    expect(previsto?.votos).toEqual(real.votos);
    expect([previsto?.sim, previsto?.nao]).toEqual([real.sim, real.nao]);
    expect(placarDaLei(partida, "areas-protegidas", 0.1)).toBeNull();
  });

  it("Brasil: Câmara num turno, Senado no seguinte, e só então a lei muda", () => {
    const partida = criarPartida("brasil-2026", 1);
    const pedido = [
      { tipo: "mudar_lei" as const, lei: "areas-protegidas", valor: 0.2 },
    ];
    const um = jogar(partida, 1, pedido).estado;
    expect(um.votacoes.map((v) => v.casa)).toEqual(["camara"]);
    expect(um.leis["areas-protegidas"]).toBe(0.3);
    const dois = jogar(partida, 2, pedido).estado;
    expect(dois.votacoes.map((v) => v.casa)).toEqual(["senado"]);
    expect(dois.leis["areas-protegidas"]).toBe(0.2);
  });

  it("classe da lei: imposto pede quórum absoluto; mandato, mais", () => {
    const { regras } = criarPartida("brasil-2026", 1);
    expect(regras.leis["imposto-renda"].classe).toBe("absoluta");
    expect(regras.leis["duracao-mandato"].classe).toBe("mandato");
    expect(regras.leis["quorum-das-votacoes"].classe).toBe("constitucional");
  });
});

describe("mesa", () => {
  /** Uma lei emendada esperando carimbo, como o Congresso a deixa. */
  function comPapel() {
    const partida = criarPartida("brasil-2026", 1);
    const espera = {
      lei: "areas-protegidas",
      valor: 0.2,
      casa: "camara-volta" as const,
      desde: 1,
      ofertas: [],
    };
    const congresso = {
      ...(partida.estado.congresso as NonNullable<
        typeof partida.estado.congresso
      >),
      sancao: [espera],
    };
    return {
      ...partida,
      estado: {
        ...partida.estado,
        congresso,
        mesa: montarMesa(0, [espera], []),
      },
    };
  }

  it("papel assinado vira lei e deixa um aviso na mesa", () => {
    const partida = comPapel();
    const id = partida.estado.mesa?.[0].id as string;
    const depois = jogar(partida, 1, [
      { tipo: "carimbar", papel: id, carimbo: "assinar" },
    ]).estado;
    expect(depois.leis["areas-protegidas"]).toBe(0.2);
    expect(depois.fatos?.map((f) => f.tipo)).toContain("papel-assinado");
    expect(depois.mesa?.map((p) => [p.tipo, p.motivo])).toEqual([
      ["aviso", "lei-aprovada"],
    ]);
  });

  it("papel vetado vai à derrubada do veto, com a observação", () => {
    const partida = comPapel();
    const id = partida.estado.mesa?.[0].id as string;
    const depois = jogar(partida, 1, [
      { tipo: "carimbar", papel: id, carimbo: "vetar", observacao: "caro" },
    ]).estado;
    expect(depois.fatos?.map((f) => f.tipo)).toContain("papel-vetado");
    expect(depois.votacoes[0]).toMatchObject({
      origem: "derrubada-do-veto",
      observacao: "caro",
    });
  });

  it("papel ignorado segue a regra do país: sanção tácita no Brasil", () => {
    const depois = jogar(comPapel(), 1).estado;
    expect(depois.fatos?.map((f) => f.tipo)).toContain("papel-ignorado");
    expect(depois.leis["areas-protegidas"]).toBe(0.2);
  });

  it("a mesa não guarda papel resolvido", () => {
    const depois = jogar(comPapel(), 2).estado;
    expect(depois.mesa).toEqual([]);
  });
});
