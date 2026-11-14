import { describe, expect, it } from "vitest";
import { chapaSugerida, criarPartida, montarVisao } from ".";

describe("poderes na visão", () => {
  const partida = criarPartida("brasil-2026", 1);
  const p = montarVisao(partida).poderes!;

  it("a Câmara tem os partidos do país, do maior para o menor", () => {
    const { camara } = p.legislativo;
    expect(camara.partidos.length).toBeGreaterThan(10);
    expect(camara.total).toBeGreaterThan(400);
    const cadeiras = camara.partidos.map((x) => x.cadeiras);
    expect(cadeiras).toEqual([...cadeiras].sort((a, b) => b - a));
  });

  it("o Senado vem com as cadeiras dele", () => {
    expect(p.legislativo.senado).not.toBeNull();
    expect(p.legislativo.senado!.total).toBeLessThan(
      p.legislativo.camara.total,
    );
  });

  it("todo partido tem nome e cor", () => {
    for (const x of p.legislativo.camara.partidos) {
      expect(x.nome.length).toBeGreaterThan(1);
      expect(x.cor).toMatch(/^#/);
    }
  });

  it("no começo nenhuma lei espera voto", () => {
    expect(p.legislativo.emVotacao).toEqual([]);
  });

  it("só um partido é o do governo", () => {
    const governo = p.legislativo.camara.partidos.filter((x) => x.governo);
    expect(governo).toHaveLength(1);
  });

  it("o Judiciário na órbita é só a corte suprema; os tribunais que ela preside ficam no miolo", () => {
    expect(p.judiciario.pronto).toBe(true);
    expect(new Set(p.judiciario.juizes.map((j) => j.id)).size).toBe(
      p.judiciario.juizes.length,
    );
    expect(p.judiciario.juizes).toHaveLength(11);
    expect(new Set(p.judiciario.juizes.map((j) => j.tribunal))).toEqual(
      new Set(["stf"]),
    );
    // no miolo, o STF e o TSE, que tira o presidente do STF
    const ids = new Set(p.judiciario.juizes.map((j) => j.id));
    expect(p.judiciario.tribunais?.map((t) => t.id)).toEqual(["stf", "tse"]);
    for (const t of p.judiciario.tribunais ?? [])
      expect(ids.has(t.presidente ?? "")).toBe(true);
    expect(p.judiciario.tribunais?.[0].presidente).not.toBe(
      p.judiciario.tribunais?.[1].presidente,
    );
    expect(p.judiciario.eleitoral).toBe("tse");
  });

  it("com o partido do jogador, ele governa e ganha a cor do latão", () => {
    const semente = 42;
    const com = criarPartida("brasil-2026", semente, {
      comeco: {
        partido: { nome: "Partido da Virada", sigla: "PVR" },
        chapa: chapaSugerida("brasil-2026", semente),
      },
    });
    const governo = montarVisao(com).poderes!.legislativo.camara.partidos.find(
      (x) => x.governo,
    )!;
    expect(governo.nome).toBe("Partido da Virada");
    expect(governo.cor).toBe("#d4af37");
  });
});
