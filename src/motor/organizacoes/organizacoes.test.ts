import { describe, expect, it } from "vitest";
import { semear } from "../acaso";
import type { Grupo, TipoGrupo } from "../grupos";
import {
  andarOrganizacoes,
  organizacoesIniciais,
  type RegrasOrganizacoes,
  type TurnoDasOrganizacoes,
} from ".";

const regras = (nascer = 1, inteligencia = 0): RegrasOrganizacoes => ({
  regra: {
    limiar: 0.005,
    turnos_para_nascer: nascer,
    ritmo: 0.5,
    fim_turnos: 2,
    sem_armas: 0.05,
    niveis: { relevante: 0.0001, grave: 0.0005, critica: 0.002 },
    indices: { polarizacao: 20 },
    teto: 15,
    inteligencia,
    revolta: 1,
  },
  moldes: [
    {
      id: "rua",
      tipos: ["Marcha"],
      ideias: ["Livre"],
      armas: false,
      adesao: 0.1,
    },
    {
      id: "armado",
      tipos: ["Liga"],
      ideias: ["Vermelha"],
      bussola: { economico: -1, social: 0 },
      armas: true,
      adesao: 0.01,
    },
  ],
});
const tipo = (id: string, economico: number, armas = false): TipoGrupo => ({
  id,
  membros: {},
  cobra: [],
  bussola: { economico, social: 0 },
  peso: { economico: 1, social: 0 },
  ...(armas ? { armas: true } : {}),
});
const tipos = [
  tipo("esquerda", -1),
  tipo("armada", -1, true),
  tipo("direita", 1),
];
const grupo = (radicais: number): Grupo => ({
  pessoas: 1_000_000,
  renda_real: 0,
  satisfacao: 50,
  radicais,
  lealistas: 5,
});
const turno = (
  radicais: Record<string, number>,
  mais: Partial<TurnoDasOrganizacoes> = {},
): TurnoDasOrganizacoes => ({
  turno: 1,
  populacao: 3_000_000,
  grupos: Object.fromEntries(
    tipos.map((t) => [t.id, grupo(radicais[t.id] ?? 5)]),
  ),
  tipos,
  lugares: {
    a: { esquerda: 100, armada: 0, direita: 0 },
    b: { esquerda: 300, armada: 0, direita: 0 },
  },
  pessoas_lugar: { a: 100, b: 1000 },
  repressao: 0,
  inteligencia: 0,
  ...mais,
});

describe("organizações", () => {
  it("radical na base não faz organização; acima dela, nasce", () => {
    const calmo = andarOrganizacoes(
      regras(),
      organizacoesIniciais(),
      turno({}),
      semear(1),
    );
    expect(calmo.organizacoes.vivas).toEqual([]);
    const r = andarOrganizacoes(
      regras(),
      organizacoesIniciais(),
      turno({ esquerda: 30, armada: 30 }),
      semear(1),
    );
    const moldes = r.organizacoes.vivas.map((o) => o.molde).sort();
    expect(moldes).toEqual(["armado", "rua"]);
    expect(r.acontecidos.every((a) => a.tipo === "nasceu")).toBe(true);
    expect(r.organizacoes.pontos.polarizacao).toBeGreaterThan(0);
  });

  it("nasce depois de turnos seguidos acima do limiar, onde os radicais pesam mais", () => {
    let o = organizacoesIniciais();
    for (let i = 0; i < 2; i++) {
      o = andarOrganizacoes(
        regras(3),
        o,
        turno({ esquerda: 60 }),
        semear(i),
      ).organizacoes;
      expect(o.vivas).toEqual([]);
    }
    // Um turno abaixo zera a conta.
    o = andarOrganizacoes(regras(3), o, turno({}), semear(5)).organizacoes;
    for (let i = 0; i < 2; i++)
      o = andarOrganizacoes(
        regras(3),
        o,
        turno({ esquerda: 60 }),
        semear(i),
      ).organizacoes;
    expect(o.vivas).toEqual([]);
    o = andarOrganizacoes(
      regras(3),
      o,
      turno({ esquerda: 60 }),
      semear(7),
    ).organizacoes;
    expect(o.vivas.map((x) => x.molde)).toEqual(["rua"]);
    // Em a, 100 de 100 são do grupo; em b, 300 de 1000: nasce em a.
    expect(o.vivas[0].lugar).toBe("a");
  });

  it("molde armado só recebe grupo que pode pegar em armas", () => {
    const r = andarOrganizacoes(
      regras(),
      organizacoesIniciais(),
      turno({ esquerda: 60 }),
      semear(1),
    );
    expect(r.organizacoes.vivas.map((o) => o.molde)).toEqual(["rua"]);
  });

  it("repressão corta a gente e soma radicais em quem alimenta", () => {
    const comeco = andarOrganizacoes(
      regras(),
      organizacoesIniciais(),
      turno({ esquerda: 30, armada: 30 }),
      semear(1),
    ).organizacoes;
    const solto = andarOrganizacoes(
      regras(),
      comeco,
      turno({ esquerda: 30, armada: 30 }),
      semear(2),
    );
    const preso = andarOrganizacoes(
      regras(),
      comeco,
      turno({ esquerda: 30, armada: 30 }, { repressao: 1 }),
      semear(2),
    );
    const gente = (x: typeof solto) =>
      x.organizacoes.vivas.reduce((s, o) => s + o.gente, 0);
    expect(gente(preso)).toBeLessThan(gente(solto));
    expect(preso.revolta.armada).toBeGreaterThan(0);
    expect(preso.revolta.direita ?? 0).toBeLessThan(preso.revolta.armada);
  });

  it("inteligência pega os chefes: a organização grande racha com outro nome", () => {
    let o = organizacoesIniciais();
    for (let i = 0; i < 6; i++)
      o = andarOrganizacoes(
        regras(),
        o,
        turno({ esquerda: 60 }),
        semear(i),
      ).organizacoes;
    const r = andarOrganizacoes(
      regras(1, 1),
      o,
      turno({ esquerda: 60 }, { inteligencia: 1 }),
      semear(9),
    );
    const rua = r.organizacoes.vivas.filter((x) => x.molde === "rua");
    expect(rua.length).toBe(2);
    expect(new Set(rua.map((x) => x.nome)).size).toBe(2);
    expect(r.acontecidos.some((a) => a.tipo === "rachou")).toBe(true);
  });

  it("sem radicais bastante por alguns turnos, acaba", () => {
    const comeco = andarOrganizacoes(
      regras(),
      organizacoesIniciais(),
      turno({ esquerda: 30 }),
      semear(1),
    ).organizacoes;
    let r = andarOrganizacoes(regras(), comeco, turno({}), semear(2));
    expect(r.organizacoes.vivas.length).toBe(1);
    r = andarOrganizacoes(regras(), r.organizacoes, turno({}), semear(3));
    expect(r.organizacoes.vivas).toEqual([]);
    expect(r.acontecidos[0]?.tipo).toBe("acabou");
    expect(r.organizacoes.pontos.polarizacao).toBe(0);
  });
});
