import { describe, expect, it } from "vitest";
import {
  carregarPartida,
  chapaSugerida,
  criarPartida,
  jogar,
  ministrosSugeridos,
  nomesPartidos,
  perfilDeUmaPessoa,
  prepararComeco,
  salvarPartida,
  type ComecoDoJogador,
} from ".";

const PAIS = "brasil-2026";
const SEMENTE = 42;
const comeco = (extra: Partial<ComecoDoJogador> = {}): ComecoDoJogador => ({
  partido: { nome: "Partido da Virada", sigla: "PVR" },
  chapa: chapaSugerida(PAIS, SEMENTE),
  ...extra,
});

describe("começo do jogador", () => {
  it("as pessoas vêm do gerador: mesma semente, mesmo elenco", () => {
    const a = prepararComeco(PAIS, SEMENTE).pessoas;
    expect(a.length).toBeGreaterThan(60);
    expect(prepararComeco(PAIS, SEMENTE).pessoas).toEqual(a);
    expect(prepararComeco(PAIS, 43).pessoas).not.toEqual(a);
  });

  it("o partido novo governa, com poucas cadeiras, e o total não muda", () => {
    const sem = criarPartida(PAIS, SEMENTE);
    const com = criarPartida(PAIS, SEMENTE, { comeco: comeco() });
    const cadeiras = (p: typeof sem) =>
      p.regras.congresso?.partidos.reduce((s, x) => s + x.cadeiras, 0);
    expect(cadeiras(com)).toBe(cadeiras(sem));
    expect(com.regras.congresso?.governo).toBe("pvr");
    const novo = com.regras.congresso?.partidos.find((p) => p.id === "pvr");
    expect(novo?.cadeiras).toBeGreaterThan(10);
    expect(novo?.cadeiras).toBeLessThan(60);
    expect(nomesPartidos(PAIS, com.opcoes.comeco).pvr).toBe(
      "Partido da Virada",
    );
  });

  it("o partido que governava vira oposição; coligar o põe na base", () => {
    const fora = criarPartida(PAIS, SEMENTE, { comeco: comeco() });
    expect(fora.estado.coligacao).not.toContain("pt");
    const dentro = criarPartida(PAIS, SEMENTE, {
      comeco: comeco({ coligarGoverno: true }),
    });
    expect(dentro.estado.coligacao).toContain("pt");
    expect(dentro.estado.coligacao).toContain("pvr");
  });

  it("a coligação nasce dos partidos das pessoas da chapa", () => {
    const { pessoas } = prepararComeco(PAIS, SEMENTE);
    const c = comeco();
    const origens = Object.values(c.chapa)
      .map((id) => pessoas.find((p) => p.id === id)?.origem)
      .filter((o) => o && o !== "tecnico");
    const partida = criarPartida(PAIS, SEMENTE, { comeco: c });
    for (const o of origens) expect(partida.estado.coligacao).toContain(o);
  });

  it("ministros sorteados não incluem a chapa; o que o jogador põe fica", () => {
    const c = comeco();
    const sorteio = ministrosSugeridos(PAIS, SEMENTE, c.chapa);
    const ids = Object.values(sorteio);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of Object.values(c.chapa)) expect(ids).not.toContain(id);
    const outro = ministrosSugeridos(PAIS, SEMENTE, c.chapa, 1);
    expect(outro).not.toEqual(sorteio);
    const partida = criarPartida(PAIS, SEMENTE, {
      comeco: { ...c, ministros: outro },
    });
    expect(partida.estado.governo?.caixas.map((x) => x.ministro)).toEqual(
      Object.keys(outro).map((m) => outro[m]),
    );
  });

  it("recusa sigla repetida, chapa com pessoa repetida e ministro da chapa", () => {
    const c = comeco();
    const tenta = (x: ComecoDoJogador) => () =>
      criarPartida(PAIS, SEMENTE, { comeco: x });
    expect(
      tenta({ ...c, partido: { nome: "Outro Partido", sigla: "PT" } }),
    ).toThrow(/sigla/);
    expect(
      tenta({ ...c, chapa: { ...c.chapa, vice: c.chapa.presidente } }),
    ).toThrow(/repete/);
    expect(tenta({ ...c, ministros: { fazenda: c.chapa.candidato } })).toThrow(
      /chapa/,
    );
  });

  it("salva, carrega e joga um mandato com o partido novo", () => {
    const partida = criarPartida(PAIS, SEMENTE, { comeco: comeco() });
    const volta = carregarPartida(salvarPartida(partida));
    expect(volta.estado).toEqual(partida.estado);
    expect(jogar(volta, 3).estado.turno).toBe(3);
  });
});

describe("perfil de rede", () => {
  it("é gerado da ficha, sem rótulo de lado, e é sempre o mesmo", () => {
    const { pessoas } = prepararComeco(PAIS, SEMENTE);
    const perfil = perfilDeUmaPessoa(PAIS, SEMENTE, pessoas[0].id);
    expect(perfil).toEqual(perfilDeUmaPessoa(PAIS, SEMENTE, pessoas[0].id));
    expect(perfil?.usuario.startsWith("@")).toBe(true);
    expect(perfil?.posts.length).toBeGreaterThanOrEqual(2);
    expect(perfil?.segue).toHaveLength(3);
    expect(JSON.stringify(perfil)).not.toMatch(/esquerda|direita/i);
  });
});

describe("cheat sem Senado", () => {
  it("o país joga só com a Câmara e a partida continua rodando", () => {
    const com = criarPartida(PAIS, SEMENTE);
    const sem = criarPartida(PAIS, SEMENTE, { semSenado: true });
    expect(com.regras.congresso?.senado).toBeDefined();
    expect(sem.regras.congresso?.senado).toBeUndefined();
    expect(jogar(sem, 2).estado.turno).toBe(2);
  });
});
