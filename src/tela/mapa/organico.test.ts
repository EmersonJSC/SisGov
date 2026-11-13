import { describe, expect, it } from "vitest";
import { criarPartida, montarVisao } from "../../partida";
import { FAIXA_DO_RAIO, montarOrganico, RAIO_DA_INSTITUICAO } from "./organico";

describe("mapa orgânico", () => {
  const visao = montarVisao(criarPartida("brasil-2026", 1));
  const doMapa = { ...visao, leis: visao.leis.filter((l) => !l.naoLegislada) };
  const PASSOS_DO_TESTE = 200;
  const mapa = montarOrganico(doMapa, PASSOS_DO_TESTE);

  it("põe cada lei e cada índice uma vez", () => {
    const indices = doMapa.bolhas.filter((b) => b.tipo !== "grupo").length;
    const governo =
      (doMapa.hierarquia?.ministros.length ?? 0) +
      (doMapa.hierarquia?.instituicoes.length ?? 0);
    expect(mapa.nos).toHaveLength(doMapa.leis.length + indices + governo);
    expect(new Set(mapa.nos.map((n) => n.id)).size).toBe(mapa.nos.length);
  });

  it("os índices ganham uma das áreas do governo, pelas leis ligadas a eles", () => {
    const areas = new Set(doMapa.governo.map((a) => a.id));
    const indices = mapa.nos.filter((n) => n.tipo === "indice");
    const comArea = indices.filter((n) => areas.has(n.area));
    expect(comArea.length).toBeGreaterThan(indices.length * 0.8);
  });

  it("a prioridade é ministro, instituição, índice e lei, do maior para o menor", () => {
    const maior = (tipo: string) =>
      Math.max(
        ...mapa.nos.filter((n) => n.tipo === tipo).map((n) => n.raioBase),
      );
    const menor = (tipo: string) =>
      Math.min(
        ...mapa.nos.filter((n) => n.tipo === tipo).map((n) => n.raioBase),
      );
    expect(menor("ministro")).toBeGreaterThan(maior("instituicao"));
    expect(menor("instituicao")).toBeGreaterThan(maior("indice"));
    expect(menor("indice")).toBeGreaterThan(maior("lei"));
  });

  it("as faixas das visões não deixam lei ou índice passar para o degrau de cima", () => {
    expect(FAIXA_DO_RAIO.lei.maximo).toBeLessThan(
      FAIXA_DO_RAIO.indice.minimo + 1,
    );
    expect(FAIXA_DO_RAIO.indice.maximo).toBeLessThan(RAIO_DA_INSTITUICAO);
  });

  it("os iguais de cima não ficam colados: ministro com ministro, instituição com instituição", () => {
    const menorDistancia = (tipo: string) => {
      const dele = mapa.nos.filter((n) => n.tipo === tipo);
      return Math.min(
        ...dele.flatMap((a, i) =>
          dele
            .slice(i + 1)
            .map((b) => Math.hypot(a.x - b.x, a.y - b.y) - a.raio - b.raio),
        ),
      );
    };
    expect(menorDistancia("ministro")).toBeGreaterThan(30);
    expect(menorDistancia("instituicao")).toBeGreaterThan(15);
  });

  it("nenhuma bolha encosta em outra", () => {
    const sobrepostas = mapa.nos.flatMap((a, i) =>
      mapa.nos
        .slice(i + 1)
        .filter((b) => Math.hypot(a.x - b.x, a.y - b.y) < a.raio + b.raio - 1),
    );
    expect(sobrepostas).toHaveLength(0);
  });

  it("grupos e potências ficam fora das bolhas", () => {
    const maior = Math.max(...mapa.nos.map((n) => Math.hypot(n.x, n.y)));
    for (const g of mapa.grupos)
      expect(Math.hypot(g.x, g.y)).toBeGreaterThan(maior);
    for (const p of mapa.potencias)
      expect(Math.hypot(p.x, p.y)).toBeGreaterThan(maior);
  });

  // monta o mapa inteiro de novo: leva uns 4 s, e mais com a máquina ocupada
  it("dá o mesmo resultado sempre", { timeout: 20_000 }, () => {
    const outro = montarOrganico(doMapa, PASSOS_DO_TESTE);
    expect(outro.nos.map((n) => [n.x, n.y])).toEqual(
      mapa.nos.map((n) => [n.x, n.y]),
    );
  });
});
