import { describe, expect, it } from "vitest";
import { criarPartida, montarVisao } from "../../partida";
import { FAIXA_DO_RAIO } from "./organico";
import {
  dinheiroDaLei,
  pesosDaVisao,
  raioDoPeso,
  visaoTemDados,
} from "./visoes";

describe("visões do mapa", () => {
  const visao = montarVisao(criarPartida("brasil-2026", 1));

  it("a visão padrão não muda o tamanho", () => {
    expect(pesosDaVisao(visao, "prioridade")).toBeNull();
  });

  it("a visão das ligações pesa mais quem mexe com mais coisa", () => {
    const pesos = pesosDaVisao(visao, "ligacoes")!;
    const valores = [...pesos.values()];
    expect(Math.max(...valores)).toBe(1);
    expect(Math.min(...valores)).toBe(0);
  });

  it("o raio vai do mínimo ao máximo da faixa de cada degrau", () => {
    expect(raioDoPeso(0, "lei")).toBe(FAIXA_DO_RAIO.lei.minimo);
    expect(raioDoPeso(1, "lei")).toBe(FAIXA_DO_RAIO.lei.maximo);
    expect(raioDoPeso(1, "indice")).toBe(FAIXA_DO_RAIO.indice.maximo);
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
    for (const id of ["ligacoes", "popularidade", "dinheiro", "nivel"] as const)
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
