import { describe, expect, it } from "vitest";
import { avancar, criarPartida, montarVisao } from ".";
import { situacaoDoIndice } from "./saudeDosIndices";

const indice = (
  extra: Partial<Parameters<typeof situacaoDoIndice>[0]> = {},
) => ({
  avaliacao: "maior_melhor",
  valor: 50,
  minimo: 0,
  maximo: 100,
  ...extra,
});

describe("saúde de um índice", () => {
  it("maior é melhor: o valor é a saúde", () => {
    expect(situacaoDoIndice(indice({ valor: 80 })).saude).toBe(80);
  });

  it("maior é pior: a saúde é o contrário do valor", () => {
    const r = situacaoDoIndice(indice({ avaliacao: "maior_pior", valor: 80 }));
    expect(r.saude).toBe(20);
  });

  it("usa a faixa do índice, não só 0 a 100", () => {
    const r = situacaoDoIndice(indice({ valor: 30, minimo: 0, maximo: 60 }));
    expect(r.saude).toBe(50);
  });

  it("índice neutro nunca alerta", () => {
    const r = situacaoDoIndice(indice({ avaliacao: "neutra", valor: 0 }));
    expect(r.alerta).toBe("normal");
    expect(r.saude).toBeUndefined();
  });
});

describe("alerta de um índice", () => {
  it("saúde baixa e estável é preocupante, não crítica", () => {
    const r = situacaoDoIndice(indice({ valor: 20, anterior: 20 }));
    expect(r.alerta).toBe("preocupante");
    expect(r.tendencia).toBe("estavel");
  });

  it("saúde baixa e piorando é crítica", () => {
    const r = situacaoDoIndice(indice({ valor: 10, anterior: 20 }));
    expect(r.alerta).toBe("critico");
    expect(r.tendencia).toBe("piorando");
    expect(r.mudancaDaSaude).toBe(-10);
  });

  it("saúde boa mas piorando 5 pontos ou mais já preocupa (o ar que piora)", () => {
    const r = situacaoDoIndice(indice({ valor: 70, anterior: 76 }));
    expect(r.alerta).toBe("preocupante");
  });

  it("saúde acima de 66 e sem piorar é boa", () => {
    expect(situacaoDoIndice(indice({ valor: 80, anterior: 79 })).alerta).toBe(
      "bom",
    );
  });

  it("no meio da faixa e estável é normal", () => {
    expect(situacaoDoIndice(indice({ valor: 50, anterior: 50 })).alerta).toBe(
      "normal",
    );
  });

  it("sem turno anterior a tendência é estável", () => {
    const r = situacaoDoIndice(indice({ valor: 50 }));
    expect(r.tendencia).toBe("estavel");
    expect(r.mudancaDaSaude).toBeUndefined();
  });

  it("subindo 5 pontos ou mais é melhorando", () => {
    const r = situacaoDoIndice(indice({ valor: 60, anterior: 50 }));
    expect(r.tendencia).toBe("melhorando");
  });
});

describe("na visão da partida", () => {
  it("todo índice de jogabilidade traz um alerta e uma tendência", () => {
    const visao = montarVisao(criarPartida("brasil-2026", 1));
    const indices = visao.bolhas.filter((b) => b.tipo === "calculado");
    expect(indices.length).toBeGreaterThan(100);
    for (const b of indices) {
      expect(b.alerta).toBeDefined();
      expect(b.tendencia).toBeDefined();
    }
  });

  it("depois de um turno, o motor guarda o valor anterior e a visão mede a mudança", () => {
    const antes = criarPartida("brasil-2026", 1);
    const depois = avancar(antes, []);
    expect(depois.estado.anterior).toEqual(antes.estado.jogabilidade);
    const medidos = montarVisao(depois).bolhas.filter(
      (b) => b.mudancaDaSaude !== undefined,
    );
    expect(medidos.length).toBeGreaterThan(50);
  });
});
