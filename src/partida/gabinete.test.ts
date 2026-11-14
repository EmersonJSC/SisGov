import { describe, expect, it } from "vitest";
import {
  caixaNova,
  governoPronto,
  instituicoesDoGabinete,
  moverInstituicao,
  nomeAutomatico,
  rendeNaCaixa,
  soltasDoGabinete,
} from "./gabinete";
import { prepararComeco } from "./inicio";

const doPais = prepararComeco("brasil-2026", 42).caixas;

describe("gabinete da tela inicial", () => {
  it("cada governo pronto tem uma só caixa da sobra e não repete instituição", () => {
    const comMinistro = instituicoesDoGabinete().filter((i) => !i.poder);
    for (const t of ["enxuto", "classico", "pais", "inchado"] as const) {
      const g = governoPronto(t, doPais);
      expect(g.filter((c) => c.sobra)).toHaveLength(1);
      const todas = g.flatMap((c) => c.instituicoes);
      expect(new Set(todas).size).toBe(todas.length);
      expect(todas.every((i) => comMinistro.some((x) => x.id === i))).toBe(
        true,
      );
    }
  });

  it("a régua cresce: enxuto < clássico < do país < inchado", () => {
    const n = (["enxuto", "classico", "pais", "inchado"] as const).map(
      (t) => governoPronto(t, doPais).length,
    );
    expect([...n].sort((a, b) => a - b)).toEqual(n);
    expect(new Set(n).size).toBe(n.length);
  });

  it("mover leva a instituição de uma caixa para outra, ou para a sobra", () => {
    const g = governoPronto("classico", []);
    const movido = moverInstituicao(g, "saude", "educacao");
    expect(movido.find((c) => c.id === "educacao")?.instituicoes).toEqual([
      "educacao",
      "saude",
    ]);
    expect(movido.find((c) => c.id === "saude")?.instituicoes).toEqual([]);
    expect(soltasDoGabinete(moverInstituicao(g, "saude", null))).toContain(
      "saude",
    );
  });

  it("eleições e regras dos poderes ficam com os poderes: não entram em caixa", () => {
    const g = governoPronto("classico", []);
    expect(moverInstituicao(g, "eleicoes", "educacao")).toBe(g);
    expect(moverInstituicao(g, "regras-dos-poderes", "educacao")).toBe(g);
    expect(soltasDoGabinete(g)).not.toContain("eleicoes");
  });

  it("quem cuida de mais instituições rende menos", () => {
    const g = governoPronto("enxuto", []);
    const economia = g.find((c) => c.id === "economia")!;
    const defesa = g.find((c) => c.id === "defesa")!;
    expect(rendeNaCaixa(80, g, economia)).toBeLessThan(
      rendeNaCaixa(80, g, defesa),
    );
    expect(rendeNaCaixa(80, g, defesa)).toBe(80);
  });

  it("dá nome do molde parecido, ou monta um com as instituições", () => {
    expect(nomeAutomatico(["impostos", "moeda-e-bancos"])).toBe("Fazenda");
    expect(nomeAutomatico([])).toBe("Ministério sem pasta");
    expect(nomeAutomatico(["defesa", "turismo"])).toBe("Defesa e Turismo");
  });

  it("caixa nova não repete id", () => {
    const g = governoPronto("enxuto", []);
    const a = caixaNova(g);
    expect(caixaNova([...g, a]).id).not.toBe(a.id);
  });
});
