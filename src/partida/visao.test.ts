import { describe, expect, it } from "vitest";
import { criarPartida, jogar, montarVisao } from ".";
import { leisDasFichas } from "../motor";

describe("visão da partida para o mapa", () => {
  const partida = criarPartida("teste", 1);
  const visao = montarVisao(partida);

  it("toda lei do mundo está numa área, com nome", () => {
    // As leis das fichas de setor ficam fora do mapa: a decisão é na ficha.
    const daFicha = leisDasFichas(partida.regras.mercado!.fichas!);
    expect(visao.leis).toHaveLength(
      Object.keys(partida.regras.leis).length - daFicha.size,
    );
    const areas = new Set(visao.governo.map((a) => a.id));
    for (const lei of visao.leis) {
      expect(areas.has(lei.area)).toBe(true);
      expect(lei.nome).not.toMatch(/-/);
    }
  });

  it("toda ligação liga dois nós que existem no mapa", () => {
    const nos = new Set([
      ...visao.leis.map((l) => l.id),
      ...visao.bolhas.map((b) => b.id),
    ]);
    for (const l of visao.ligacoes) {
      expect(nos.has(l.origem)).toBe(true);
      expect(nos.has(l.alvo)).toBe(true);
    }
  });

  it("lei contínua em %, lei de opções na posição da opção vigente", () => {
    const renda = visao.leis.find((l) => l.id === "imposto-renda")!;
    expect(renda.nivel).toBeCloseTo(
      Number(partida.estado.leis["imposto-renda"]) * 100,
    );
    const pena = visao.leis.find((l) => l.id === "pena-de-morte")!;
    expect(pena.opcoes![pena.nivel].id).toBe(
      partida.estado.leis["pena-de-morte"],
    );
    expect(visao.leis.find((l) => l.id === "duracao-mandato")!.processo).toBe(
      "emenda-constitucional",
    );
  });

  it("grupos viram bolhas com a satisfação do turno", () => {
    const depois = montarVisao(jogar(partida, 3));
    const g = depois.bolhas.find((b) => b.tipo === "grupo")!;
    expect(g.valor).toBe(jogar(partida, 3).estado.grupos[g.id].satisfacao);
  });

  it("lei que o país não legislou fica no mínimo da faixa, sem NaN", () => {
    const pobre = montarVisao(criarPartida("teste-pobre", 7));
    const areas = pobre.leis.find((l) => l.id === "areas-protegidas")!;
    expect(areas.naoLegislada).toBe(true);
    expect(areas.nivel).toBe(areas.minimo);
    for (const l of pobre.leis) expect(Number.isFinite(l.nivel)).toBe(true);
  });
});
