import { describe, expect, it } from "vitest";
import type { Grupo } from "../grupos";
import type { Lei } from "../leis";
import {
  apurar,
  cumprimento,
  desgasteDaQuebra,
  efeitoDaPromessa,
  finalistas,
  montarChapas,
  pesoDoGrupo,
  primeiroTurno,
  segundoTurno,
  tamanhoDaMeta,
  turnosMandato,
  vencedorNoPrimeiroTurno,
} from ".";

const g = (pessoas: number, satisfacao: number): Grupo => ({
  pessoas,
  renda_real: 1,
  satisfacao,
  radicais: 5,
  lealistas: 5,
});

const mandato: Lei = {
  versao: 1,
  id: "m",
  camada: "essencial",
  canal: "espera",
  espera: "teste",
  forma: "opcoes",
  opcoes: [
    { id: "curto", mandato_anos: 4, efeitos: [] },
    { id: "longo", mandato_anos: 5, efeitos: [] },
  ],
};
const outra: Lei = {
  versao: 1,
  id: "o",
  camada: "jogabilidade",
  canal: "espera",
  espera: "teste",
  forma: "opcoes",
  opcoes: [
    { id: "x", efeitos: [] },
    { id: "y", efeitos: [] },
  ],
};

describe("eleição", () => {
  it("duração vem da opção vigente da lei com mandato_anos", () => {
    const leis = { m: mandato, o: outra };
    expect(turnosMandato(leis, { o: "x", m: "curto" })).toBe(24);
    expect(turnosMandato(leis, { o: "x", m: "longo" })).toBe(30);
    expect(turnosMandato(leis, { o: "x" })).toBe(null);
  });

  it("apoio é a satisfação pesada pelas pessoas menos o desgaste", () => {
    // média = (90×60 + 10×40) / 100 = 58
    const e = apurar(24, { a: g(90, 60), b: g(10, 40) }, 2);
    expect(e.apoio).toBeCloseTo(56);
    expect(e.adversario).toBeCloseTo(44);
    expect(e.margem).toBeCloseTo(12);
    expect(e.venceu).toBe(true);
  });

  it("grupo grande decide; empate perde", () => {
    expect(apurar(24, { a: g(10, 90), b: g(90, 40) }, 0).venceu).toBe(false);
    expect(apurar(24, { a: g(1, 50) }, 0).venceu).toBe(false);
  });
});

describe("chapas", () => {
  const partido = (
    id: string,
    cadeiras: number,
    defende: Record<string, number>,
  ) => ({
    id,
    cadeiras,
    defende,
  });
  const partidos = [
    partido("gov", 40, { a: 1 }),
    partido("aliado", 10, { a: 0.5, b: 0.5 }),
    partido("op1", 30, { c: 1 }),
    partido("op2", 20, { c: 0.8, d: 0.2 }),
    partido("op3", 15, { e: 1 }),
  ];

  it("o governo leva a coligação; a oposição lança uma chapa por partido", () => {
    const { governo, oposicao } = montarChapas(partidos, "gov", [
      "gov",
      "aliado",
    ]);
    expect(governo.partidos).toEqual(["gov", "aliado"]);
    expect(governo.afinidade).toEqual({ a: 1.5, b: 0.5 });
    expect(oposicao.map((c) => c.id)).toEqual(["op1", "op3"]);
  });

  it("partidos da oposição que defendem o mesmo se coligam numa chapa", () => {
    const { oposicao } = montarChapas(partidos, "gov", ["gov", "aliado"]);
    expect(oposicao[0].partidos).toEqual(["op1", "op2"]);
    expect(oposicao[1].partidos).toEqual(["op3"]);
  });

  it("sem partidos, o governo enfrenta uma oposição só", () => {
    const { governo, oposicao } = montarChapas([], "", []);
    expect(governo.id).toBe("governo");
    expect(oposicao.map((c) => c.id)).toEqual(["oposicao"]);
  });
});

describe("os votos", () => {
  const governo = {
    id: "g",
    partidos: ["g"],
    governo: true,
    afinidade: { x: 1 },
  };
  const esq = {
    id: "e",
    partidos: ["e"],
    governo: false,
    afinidade: { x: 0.2, y: 1 },
  };
  const dir = {
    id: "d",
    partidos: ["d"],
    governo: false,
    afinidade: { y: 0.2, x: 0.1 },
  };
  const grupos = { x: g(50, 70), y: g(50, 30) };
  const entrada = (desgaste = 0, ajuste = () => 0) => ({
    grupos,
    governo,
    oposicao: [esq, dir],
    desgaste,
    ajuste,
  });

  it("cada grupo dá ao governo a sua satisfação e reparte o resto", () => {
    const r = primeiroTurno(entrada());
    expect(r.porGrupo.x.g).toBeCloseTo(0.7);
    expect(r.porGrupo.y.g).toBeCloseTo(0.3);
    expect(r.votos.g).toBeCloseTo(0.5);
    expect(Object.values(r.votos).reduce((s, v) => s + v, 0)).toBeCloseTo(1);
    // o grupo y quer mais a chapa e do que a d
    expect(r.porGrupo.y.e).toBeGreaterThan(r.porGrupo.y.d);
  });

  it("o desgaste e a promessa mexem no voto do governo", () => {
    expect(primeiroTurno(entrada(10)).votos.g).toBeCloseTo(0.4);
    expect(primeiroTurno(entrada(0, () => 0.1)).votos.g).toBeCloseTo(0.6);
  });

  it("passa quem tem mais da metade; senão vão ao segundo os dois mais votados", () => {
    const r = primeiroTurno(entrada(0, () => 0.1));
    expect(vencedorNoPrimeiroTurno(r)).toBe("g");
    const fraco = primeiroTurno(entrada(10));
    expect(vencedorNoPrimeiroTurno(fraco)).toBeNull();
    expect(finalistas(fraco)).toContain("g");
  });

  it("segundo turno: o governo só recebe votos de chapa parecida com ele", () => {
    const r = primeiroTurno(entrada(10));
    const dois = segundoTurno(r, grupos, [governo, esq, dir], "g", "e");
    expect(dois.votos.g + dois.votos.e).toBeCloseTo(1);
    // d defende pouco do que g defende: quase nada vai ao governo
    expect(dois.votos.g).toBeGreaterThanOrEqual(r.votos.g);
    expect(dois.votos.g - r.votos.g).toBeLessThan(r.votos.d);
  });
});

describe("promessa de campanha", () => {
  const dominio = { min: 0, max: 100 };

  it("prometer pouco dá quase nada; prometer muito dá o tamanho cheio", () => {
    expect(tamanhoDaMeta(50, 52, dominio)).toBeLessThan(0.1);
    expect(tamanhoDaMeta(30, 60, dominio)).toBe(1);
    expect(tamanhoDaMeta(30, 80, dominio)).toBe(1);
  });

  const promessa = {
    alvo: { tipo: "indice" as const, id: "saude" },
    de: 52,
    meta: 65,
    feitaEm: 0,
    tamanho: 1,
  };

  it("chegar perto vale em parte", () => {
    expect(cumprimento(promessa, 62)).toBeCloseTo(10 / 13);
    expect(cumprimento(promessa, 70)).toBe(1);
    expect(cumprimento(promessa, 40)).toBe(0);
  });

  it("cumprida dá voto, quebrada tira, e o tamanho multiplica", () => {
    expect(efeitoDaPromessa(1, 1)).toBeGreaterThan(0);
    expect(efeitoDaPromessa(1, 0)).toBeCloseTo(-efeitoDaPromessa(1, 1));
    expect(efeitoDaPromessa(1, 0.5)).toBeCloseTo(0);
    expect(efeitoDaPromessa(0.5, 1)).toBeCloseTo(efeitoDaPromessa(1, 1) / 2);
  });

  it("só a promessa quebrada soma desgaste", () => {
    expect(desgasteDaQuebra(1, 0.2)).toBeGreaterThan(0);
    expect(desgasteDaQuebra(1, 0.8)).toBe(0);
  });

  const grupo = (cobra: string[]) => ({
    id: "t",
    membros: {},
    cobra: cobra.map((indice) => ({ indice, sentido: 1 as const })),
    bussola: {},
    peso: {},
  });

  it("o índice principal pesa em todos; o subíndice mais em quem o cobra", () => {
    expect(pesoDoGrupo(promessa, grupo([]), ["saude"], undefined)).toBe(1);
    const sub = { ...promessa, alvo: { tipo: "indice" as const, id: "ruido" } };
    expect(
      pesoDoGrupo(sub, grupo(["ruido"]), ["saude"], undefined),
    ).toBeGreaterThan(pesoDoGrupo(sub, grupo([]), ["saude"], undefined));
  });

  it("o programa pesa mais em quem gostou dele", () => {
    const prog = { ...promessa, alvo: { tipo: "programa" as const, id: "p" } };
    expect(pesoDoGrupo(prog, grupo([]), [], { t: 0.5 })).toBeGreaterThan(
      pesoDoGrupo(prog, grupo([]), [], { t: -0.5 }),
    );
  });
});
