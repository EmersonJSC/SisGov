import { describe, expect, it } from "vitest";
import { chapaSugerida, criarPartida, montarVisao } from ".";

describe("hierarquia do governo na visão", () => {
  const partida = criarPartida("brasil-2026", 1);
  const h = montarVisao(partida).hierarquia;

  it("existe quando o país tem governo", () => {
    expect(h).toBeDefined();
    expect(h!.ministros.length).toBeGreaterThan(20);
    expect(h!.instituicoes.length).toBe(30);
  });

  it("toda instituição tem um ministro que existe", () => {
    const ids = new Set(h!.ministros.map((m) => m.id));
    for (const i of h!.instituicoes) expect(ids.has(i.ministro)).toBe(true);
  });

  it("toda lei tem um ministério responsável que existe", () => {
    const visao = montarVisao(partida);
    const ids = new Set(h!.ministros.map((m) => m.id));
    for (const l of visao.leis)
      expect(ids.has(h!.ministroDaLei[l.id])).toBe(true);
  });

  it("cada instituição aparece na lista do ministro dela", () => {
    for (const i of h!.instituicoes) {
      const dono = h!.ministros.find((m) => m.id === i.ministro)!;
      expect(dono.instituicoes).toContain(i.id);
    }
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
