import { describe, expect, it } from "vitest";
import { chapaSugerida, criarPartida, montarVisao } from ".";

describe("hierarquia do governo na visão", () => {
  const partida = criarPartida("brasil-2026", 1);
  const h = montarVisao(partida).hierarquia;

  it("existe quando o país tem governo", () => {
    expect(h).toBeDefined();
    expect(h!.ministros.length).toBeGreaterThan(20);
    expect(h!.instituicoes.length).toBe(37);
  });

  it("toda instituição tem um ministro que existe, menos as dos poderes", () => {
    const ids = new Set(h!.ministros.map((m) => m.id));
    const sem = h!.instituicoes.filter((i) => i.ministro === null);
    expect(sem.map((i) => i.id).sort()).toEqual([
      "eleicoes",
      "regras-dos-poderes",
    ]);
    for (const i of h!.instituicoes)
      if (i.ministro !== null) expect(ids.has(i.ministro)).toBe(true);
  });

  it("toda lei tem um ministério que existe, menos as das instituições dos poderes", () => {
    const visao = montarVisao(partida);
    const ids = new Set(h!.ministros.map((m) => m.id));
    const dosPoderes = new Set(
      h!.instituicoes.filter((i) => i.ministro === null).map((i) => i.id),
    );
    for (const l of visao.leis)
      if (!dosPoderes.has(l.esfera ?? ""))
        expect(ids.has(h!.ministroDaLei[l.id])).toBe(true);
  });

  it("cada instituição aparece na lista do ministro dela", () => {
    for (const i of h!.instituicoes.filter((x) => x.ministro !== null)) {
      const dono = h!.ministros.find((m) => m.id === i.ministro)!;
      expect(dono.instituicoes).toContain(i.id);
    }
  });

  it("a verba de cada ministério é a soma da das instituições dele", () => {
    for (const m of h!.ministros) {
      const soma = h!.instituicoes
        .filter((i) => i.ministro === m.id)
        .reduce((s, i) => s + i.verba, 0);
      expect(m.verba).toBeCloseTo(soma);
    }
    expect(h!.instituicoes.some((i) => i.verba > 0)).toBe(true);
    expect(h!.instituicoes.every((i) => i.verba >= 0)).toBe(true);
  });

  it("sem o começo do jogador não há trindade", () => {
    expect(h!.trindade).toBeNull();
  });

  it("com o começo do jogador, a trindade traz o partido e os três rostos", () => {
    const semente = 42;
    const com = criarPartida("brasil-2026", semente, {
      comeco: {
        partido: { nome: "Partido da Virada", sigla: "PVR" },
        chapa: chapaSugerida("brasil-2026", semente),
      },
    });
    const t = montarVisao(com).hierarquia!.trindade!;
    expect(t.sigla).toBe("PVR");
    expect(t.cor).toMatch(/^#/);
    const ids = [t.presidente.id, t.candidato.id, t.vice.id];
    expect(new Set(ids).size).toBe(3);
  });
});
