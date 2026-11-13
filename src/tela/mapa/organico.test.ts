import { describe, expect, it } from "vitest";
import { criarPartida, montarVisao } from "../../partida";
import { montarOrganico } from "./organico";

describe("mapa orgânico", () => {
  const visao = montarVisao(criarPartida("brasil-2026", 1));
  const doMapa = { ...visao, leis: visao.leis.filter((l) => !l.naoLegislada) };
  const PASSOS_DO_TESTE = 200;
  const mapa = montarOrganico(doMapa, PASSOS_DO_TESTE);

  it("põe cada lei e cada índice uma vez", () => {
    const indices = doMapa.bolhas.filter((b) => b.tipo !== "grupo").length;
    expect(mapa.nos).toHaveLength(doMapa.leis.length + indices);
    expect(new Set(mapa.nos.map((n) => n.id)).size).toBe(mapa.nos.length);
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

  it("dá o mesmo resultado sempre", () => {
    const outro = montarOrganico(doMapa, PASSOS_DO_TESTE);
    expect(outro.nos.map((n) => [n.x, n.y])).toEqual(
      mapa.nos.map((n) => [n.x, n.y]),
    );
  });
});
