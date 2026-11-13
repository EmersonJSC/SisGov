import { describe, expect, it } from "vitest";
import { criarPartida, montarVisao } from "../../partida";
import { RAIO_MAXIMO, RAIO_MINIMO } from "./organico";
import {
  dinheiroDaLei,
  pesosDaVisao,
  raioDoPeso,
  visaoTemDados,
} from "./visoes";

describe("visões do mapa", () => {
  const visao = montarVisao(criarPartida("brasil-2026", 1));

  it("a visão das ligações não muda o tamanho", () => {
    expect(pesosDaVisao(visao, "ligacoes")).toBeNull();
  });

  it("o raio vai do mínimo ao máximo", () => {
    expect(raioDoPeso(0)).toBe(RAIO_MINIMO);
    expect(raioDoPeso(1)).toBe(RAIO_MAXIMO);
  });

  it("dinheiro: imposto arrecada, verba gasta, as outras ficam em zero", () => {
    const imposto = visao.leis.find((l) => l.fluxo?.tipo === "imposto")!;
    const verba = visao.leis.find((l) => l.fluxo?.tipo === "verba")!;
    expect(dinheiroDaLei(imposto)).toBeGreaterThan(0);
    expect(dinheiroDaLei(verba)).toBeLessThan(0);
    const semFluxo = visao.leis.find((l) => !l.fluxo)!;
    expect(dinheiroDaLei(semFluxo)).toBe(0);
  });

  it("dinheiro: a lei que mais move o caixa pesa mais que a que não move", () => {
    const pesos = pesosDaVisao(visao, "dinheiro")!;
    const valores = visao.leis.map((l) => pesos.get(l.id)!);
    expect(Math.max(...valores)).toBe(1);
    const semFluxo = visao.leis.find((l) => !l.fluxo)!;
    expect(pesos.get(semFluxo.id)).toBe(0);
  });

  it("todo peso fica entre 0 e 1", () => {
    for (const id of ["popularidade", "dinheiro", "nivel"] as const)
      for (const p of pesosDaVisao(visao, id)!.values()) {
        expect(p).toBeGreaterThanOrEqual(0);
        expect(p).toBeLessThanOrEqual(1);
      }
  });

  it("diz quando o motor ainda não tem o dado", () => {
    expect(visaoTemDados(visao, "dinheiro")).toBe(true);
    expect(visaoTemDados(visao, "nivel")).toBe(true);
    expect(visaoTemDados(visao, "popularidade")).toBe(false);
  });
});
