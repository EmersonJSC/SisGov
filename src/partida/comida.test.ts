// Fatia 6c: a comida mexe no apoio dos grupos e na reputação, nos dois sentidos,
// e o apoio volta aos poucos quando a comida volta ao normal.
import { describe, expect, it } from "vitest";
import { criarPartida, jogar, type Partida } from ".";

const ABASTECIMENTO = "abastecimento";

const comGraos = (p: Partida, graos: number): Partida => {
  const m = p.regras.mercado!;
  return {
    ...p,
    regras: {
      ...p.regras,
      mercado: { ...m, cobertura: { ...m.cobertura, graos } },
    },
  };
};

const base = () => criarPartida("teste", 42, { semCongresso: true });
const trab = (p: Partida) => p.estado.grupos["trabalhadores"].satisfacao;
const j = (p: Partida, id: string) => p.estado.jogabilidade[id];

describe("reação à comida (6c)", () => {
  const normal = jogar(base(), 6);
  const pior = jogar(comGraos(base(), 40), 6);
  const melhor = jogar(comGraos(base(), 160), 6);

  it("o abastecimento nasce no turno 0 e muda com a comida", () => {
    expect(base().estado.jogabilidade[ABASTECIMENTO]).toBeGreaterThan(0);
    expect(j(pior, ABASTECIMENTO)).toBeLessThan(j(normal, ABASTECIMENTO));
    expect(j(melhor, ABASTECIMENTO)).toBeGreaterThan(j(normal, ABASTECIMENTO));
  });

  it("comida pior baixa apoio, saúde e reputação e sobe a pobreza", () => {
    expect(trab(pior)).toBeLessThan(trab(normal));
    expect(j(pior, "saude")).toBeLessThan(j(normal, "saude"));
    expect(j(pior, "pobreza")).toBeGreaterThan(j(normal, "pobreza"));
    expect(j(pior, "reputacao_internacional")).toBeLessThan(
      j(normal, "reputacao_internacional"),
    );
  });

  it("comida melhor sobe os mesmos, e mais fraco que a piora", () => {
    expect(trab(melhor)).toBeGreaterThan(trab(normal));
    expect(j(melhor, "saude")).toBeGreaterThan(j(normal, "saude"));
    expect(j(melhor, "pobreza")).toBeLessThan(j(normal, "pobreza"));
    expect(j(melhor, "reputacao_internacional")).toBeGreaterThan(
      j(normal, "reputacao_internacional"),
    );
    const queda = j(normal, "saude") - j(pior, "saude");
    const ganho = j(melhor, "saude") - j(normal, "saude");
    expect(ganho).toBeLessThan(queda);
  });

  it("voltando ao normal, o apoio volta aos poucos", () => {
    const crise = jogar(comGraos(base(), 40), 4);
    const fundo = trab(crise);
    const volta = jogar(comGraos(crise, 130), 6);
    expect(trab(volta)).toBeGreaterThan(fundo);
    expect(j(volta, "saude")).toBeGreaterThan(j(crise, "saude"));
  });

  it("mesma partida e mesma semente dão o mesmo resultado", () => {
    expect(jogar(comGraos(base(), 40), 6).estado).toEqual(pior.estado);
  });
});
