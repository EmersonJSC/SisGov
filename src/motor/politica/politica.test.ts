import { describe, expect, it } from "vitest";
import type { Grupo, TipoGrupo } from "../grupos";
import type { Lei } from "../leis";
import {
  coligacaoAtual,
  motivoCongressoInvalido,
  votar,
  type Congresso,
} from ".";

const lei: Lei = {
  versao: 1,
  id: "l",
  camada: "jogabilidade",
  forma: "continua",
  unidade: "fracao",
  faixa: { min: 0, max: 0.3 },
  passo: 0.01,
  // subir a lei vai para a direita: perto de a, longe de b
  bussola: { min: { economico: -1 }, max: { economico: 1 } },
  efeitos: [],
};

const opcoes: Lei = {
  versao: 1,
  id: "o",
  camada: "jogabilidade",
  forma: "opcoes",
  opcoes: [
    { id: "x", bussola: { economico: 1 }, efeitos: [] },
    { id: "y", bussola: { economico: -1 }, efeitos: [] },
  ],
};

// gov 40, aliado (neutro) 15, ped (defende b) 30, opo (neutro) 15
const congresso: Congresso = {
  partidos: [
    { id: "gov", cadeiras: 40, defende: { a: 1 } },
    { id: "aliado", cadeiras: 15, defende: { c: 1 } },
    { id: "ped", cadeiras: 30, defende: { b: 1 } },
    { id: "opo", cadeiras: 15, defende: { c: 1 } },
  ],
  governo: "gov",
  maioria: 0.5,
};
const base = ["gov", "aliado"];

// a à direita, b à esquerda, c não liga para a economia
const tipo = (id: string, economico: number, peso: number): TipoGrupo => ({
  id,
  membros: {},
  cobra: [],
  bussola: { economico },
  peso: { economico: peso },
});
const tipos = [tipo("a", 1, 1), tipo("b", -1, 1), tipo("c", 0, 0)];

describe("congresso", () => {
  it("base vota sim, oposição neutra vota não, grupo contra vota não", () => {
    const v = votar(congresso, base, tipos, lei, 0.1, 0.15);
    expect(v.votos).toEqual({
      gov: "sim",
      aliado: "sim",
      ped: "nao",
      opo: "nao",
    });
    expect(v.sim).toBe(55);
    expect(v.aprovada).toBe(true);
    // descer a lei: ped (b quer menos) passa a votar sim
    expect(votar(congresso, base, tipos, lei, 0.1, 0.05).votos.ped).toBe("sim");
  });

  it("sem maioria, cai", () => {
    expect(votar(congresso, ["gov"], tipos, lei, 0.1, 0.15).aprovada).toBe(
      false,
    );
  });

  it("exorbitante: mais de 1/3 da faixa, todos votam não", () => {
    const v = votar(congresso, base, tipos, lei, 0.1, 0.25);
    expect(v.exorbitante).toBe(true);
    expect(v.sim).toBe(0);
    expect(v.aprovada).toBe(false);
    // lei não legislada conta do mínimo
    expect(
      votar(congresso, base, tipos, lei, undefined, 0.11).exorbitante,
    ).toBe(true);
  });

  it("lei de opções usa a posição de cada opção", () => {
    expect(votar(congresso, base, tipos, opcoes, "x", "y").votos.ped).toBe(
      "sim",
    );
    expect(votar(congresso, base, tipos, opcoes, "y", "x").votos.ped).toBe(
      "nao",
    );
  });

  it("partido da base sai com os grupos abaixo de 35", () => {
    const g = (satisfacao: number): Grupo => ({
      pessoas: 1,
      renda_real: 1,
      satisfacao,
      radicais: 5,
      lealistas: 5,
    });
    const grupos = { a: g(10), b: g(50), c: g(34) };
    expect(coligacaoAtual(congresso, base, grupos)).toEqual(["gov"]);
    expect(coligacaoAtual(congresso, base, { ...grupos, c: g(35) })).toEqual(
      base,
    );
  });

  it("valida o congresso do país", () => {
    expect(motivoCongressoInvalido(congresso, base, ["a", "b", "c"])).toBe(
      null,
    );
    expect(motivoCongressoInvalido(congresso, base, ["a", "b"])).toMatch(
      /grupo "c"/,
    );
    expect(
      motivoCongressoInvalido(congresso, ["aliado"], ["a", "b", "c"]),
    ).toMatch(/incluir o governo/);
  });
});
