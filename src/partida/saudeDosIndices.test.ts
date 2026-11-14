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

  it("saúde boa mas piorando 2 pontos ou mais já preocupa (o ar que piora)", () => {
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

  it("subindo 2 pontos ou mais é melhorando; menos que isso é estável", () => {
    expect(
      situacaoDoIndice(indice({ valor: 52, anterior: 50 })).tendencia,
    ).toBe("melhorando");
    expect(
      situacaoDoIndice(indice({ valor: 51.5, anterior: 50 })).tendencia,
    ).toBe("estavel");
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

  it("o motor guarda até 4 turnos, o mais recente primeiro, e a visão mede a mudança", () => {
    const antes = criarPartida("brasil-2026", 1);
    const depois = avancar(antes, []);
    expect(depois.estado.anteriores).toEqual([antes.estado.jogabilidade]);
    let p = depois;
    for (let i = 0; i < 5; i++) p = avancar(p, []);
    expect(p.estado.anteriores).toHaveLength(4);
    expect(
      montarVisao(p).bolhas.find((b) => b.saude !== undefined)
        ?.mesesDaTendencia,
    ).toBe(8);
    const medidos = montarVisao(depois).bolhas.filter(
      (b) => b.mudancaDaSaude !== undefined,
    );
    expect(medidos.length).toBeGreaterThan(50);
  });

  it("parado, quase nenhum índice tem seta; mexendo nas leis, aparecem setas", () => {
    const comSeta = (p: ReturnType<typeof criarPartida>) =>
      montarVisao(p).bolhas.filter(
        (b) => b.tendencia === "piorando" || b.tendencia === "melhorando",
      ).length;
    let parado = criarPartida("brasil-2026", 1, { semCongresso: true });
    let mexendo = parado;
    const leis = Object.values(parado.regras.leis)
      .filter((l) => l.forma === "continua")
      .slice(0, 40);
    mexendo = avancar(
      mexendo,
      leis.map((l) => ({
        tipo: "mudar_lei" as const,
        lei: l.id,
        valor: l.forma === "continua" ? l.faixa.max : 0,
      })),
    );
    parado = avancar(parado, []);
    for (let i = 0; i < 4; i++) {
      parado = avancar(parado, []);
      mexendo = avancar(mexendo, []);
    }
    expect(comSeta(parado)).toBeLessThanOrEqual(3);
    expect(comSeta(mexendo)).toBeGreaterThan(5);
  });
});
