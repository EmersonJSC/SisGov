import { describe, expect, it } from "vitest";
import type { Fato } from "../fatos";
import type { Lei, ValorLei } from "../leis";
import {
  ajusteDaCompetencia,
  ajusteDaLei,
  andarGoverno,
  caixaDaLei,
  candidatosDoPartido,
  competenciaEfetiva,
  corrupcaoDeEquilibrio,
  iniciarGoverno,
  instituicoesDaCaixa,
  instituicoesSoltas,
  ministrosPorPartido,
  motivoGovernoInvalido,
  situacaoDoOrgao,
  type Ficha,
  type GovernoDoPais,
  type Instituicao,
  type Molde,
  type RegrasGoverno,
} from ".";

const lei = (id: string, esfera: string, extra: Partial<Lei> = {}): Lei =>
  ({
    versao: 1,
    id,
    camada: "jogabilidade",
    esfera,
    forma: "continua",
    unidade: "fracao",
    faixa: { min: 0, max: 0.1 },
    passo: 0.01,
    efeitos: [],
    ...extra,
  }) as Lei;

const leis: Record<string, Lei> = Object.fromEntries(
  [
    lei("verba-saude", "saude", { conta: "gasto" }),
    lei("vacina", "saude"),
    lei("verba-defesa", "defesa", { conta: "gasto" }),
    lei("museus", "cultura"),
    lei("esporte", "esporte"),
    lei("pesca", "agro"),
    lei("cargos", "estado"),
    lei("eleicao", "eleicoes"),
  ].map((l) => [l.id, l]),
);
const valores: Record<string, ValorLei> = {
  "verba-saude": 0.05,
  vacina: 0.05,
  "verba-defesa": 0.02,
  museus: 0.01,
  esporte: 0.01,
  pesca: 0.01,
  cargos: 0.05,
  eleicao: 0.01,
};

const instituicoes: Instituicao[] = [
  { id: "saude", nome: "Saúde" },
  { id: "defesa", nome: "Defesa" },
  { id: "cultura", nome: "Cultura" },
  { id: "esporte", nome: "Esporte" },
  { id: "agro", nome: "Agro" },
  { id: "estado", nome: "Estado" },
  { id: "eleicoes", nome: "Eleições", semMinistro: true },
];
const moldes: Molde[] = [
  {
    id: "economia",
    nome: "Economia",
    tipo: "superministério",
    instituicoes: ["saude", "defesa"],
  },
];

const ficha = (id: string, extra: Partial<Ficha> = {}): Ficha => ({
  id,
  nome: id,
  competencia: 50,
  habilidade: 50,
  carisma: 50,
  honestidade: 50,
  lealdade: 50,
  bussola: {},
  origem: "tecnico",
  ...extra,
});
const pessoas = [
  ficha("a", { origem: "p1", competencia: 90 }),
  ficha("b", { competencia: 20, honestidade: 10 }),
  ficha("c", { competencia: 60, honestidade: 95 }),
  ficha("d", { origem: "p1", competencia: 40 }),
  ficha("e", { origem: "p1", competencia: 75 }),
  ficha("f", { origem: "p2" }),
];
const regras: RegrasGoverno = {
  instituicoes,
  moldes,
  pessoas,
  leis: { cargos: "cargos" },
};
/** Caixa: id, ministro e instituições; a do id "gabinete" é a sobra. */
const pais = (...caixas: [string, string, string[]][]): GovernoDoPais => ({
  ministerios: caixas.map(([id, ministro, inst]) => ({
    id,
    nome: id,
    ministro,
    instituicoes: inst,
    ...(id === "gabinete" ? { sobra: true } : {}),
  })),
  pessoas,
});
const medio = pais(
  ["gabinete", "a", []],
  ["saude", "b", ["saude"]],
  ["defesa", "c", ["defesa"]],
  ["cultura", "d", ["cultura"]],
  ["esporte", "f", ["esporte"]],
);

describe("ministério e ficha", () => {
  it("competência alta adianta e reforça; baixa atrasa e enfraquece", () => {
    expect(ajusteDaCompetencia(90)).toMatchObject({ atraso: -1 });
    expect(ajusteDaCompetencia(50)).toEqual({ atraso: 0, forca: 1 });
    expect(ajusteDaCompetencia(20)).toMatchObject({ atraso: 1 });
    expect(ajusteDaCompetencia(90).forca).toBeGreaterThan(1);
    expect(ajusteDaCompetencia(20).forca).toBeLessThan(1);
  });

  it("superministério divide a competência do ministro", () => {
    expect(competenciaEfetiva(80, 2)).toBe(80);
    expect(competenciaEfetiva(80, 3)).toBe(80);
    expect(competenciaEfetiva(80, 12)).toBeCloseTo(40);
  });

  it("a lei vai à caixa da instituição dela, à sobra do gabinete ou a ninguém", () => {
    const g = iniciarGoverno(medio, regras, leis, valores);
    const caixa = (id: string) => caixaDaLei(regras, g.caixas, leis[id])?.id;
    expect(caixa("museus")).toBe("cultura");
    expect(caixa("esporte")).toBe("esporte");
    expect(caixa("vacina")).toBe("saude");
    // ninguém leva agro nem estado: sobra do gabinete
    expect(caixa("pesca")).toBe("gabinete");
    expect(caixa("cargos")).toBe("gabinete");
    // eleições fica com um dos poderes, sem ministro
    expect(caixa("eleicao")).toBeUndefined();
  });

  it("conta as instituições da caixa; a sobra leva as soltas e conta mais", () => {
    const g = iniciarGoverno(medio, regras, leis, valores);
    const conta = (id: string) =>
      instituicoesDaCaixa(
        regras,
        g.caixas,
        g.caixas.find((c) => c.id === id)!,
      );
    expect(conta("saude")).toBe(1);
    expect(instituicoesSoltas(regras, g.caixas)).toEqual(["agro", "estado"]);
    // agro e estado mais as 3 da sobra
    expect(conta("gabinete")).toBe(5);
  });

  it("o ajuste de uma lei é o do ministro da caixa dela", () => {
    const g = iniciarGoverno(medio, regras, leis, valores);
    // ministro ruim da saúde atrasa; sem ministro anda como um mediano
    expect(ajusteDaLei(regras, g.caixas, leis.vacina).atraso).toBe(1);
    expect(ajusteDaLei(regras, g.caixas, leis.eleicao)).toEqual({
      atraso: 0,
      forca: 1,
    });
  });

  it("conta ministérios por partido (técnico não conta) e candidatos livres", () => {
    const g = iniciarGoverno(medio, regras, leis, valores);
    expect(ministrosPorPartido(regras, g.caixas)).toEqual({ p1: 2, p2: 1 });
    expect(
      candidatosDoPartido(regras, g.caixas, "p1").map((p) => p.id),
    ).toEqual(["e"]);
    expect(candidatosDoPartido(regras, g.caixas, "p3")).toEqual([]);
  });
});

describe("órgãos e corrupção", () => {
  const entrada = (
    estado: ReturnType<typeof iniciarGoverno>,
    v: Record<string, ValorLei> = valores,
    extra: { fatos?: Fato[]; turno?: number } = {},
  ) => ({
    regras,
    estado,
    leis,
    valores: v,
    turno: extra.turno ?? 1,
    fatos: extra.fatos ?? [],
    pedidos: [],
    cargos: v.cargos === undefined ? 0 : (v.cargos as number) / 0.1,
  });

  it("começa em equilíbrio: sem decisão, a corrupção não anda", () => {
    const g = iniciarGoverno(medio, regras, leis, valores);
    const depois = andarGoverno(entrada(g)).estado;
    for (const [instituicao, o] of Object.entries(g.orgaos))
      expect(depois.orgaos[instituicao].corrupcao).toBeCloseTo(o.corrupcao, 6);
    expect(g.orgaos.saude.corrupcao).toBeGreaterThan(g.orgaos.defesa.corrupcao);
    expect(g.orgaos.defesa.corrupcao).toBeCloseTo(
      corrupcaoDeEquilibrio(0.5, 95),
    );
  });

  it("rendimento é verba ÷ necessidade", () => {
    const g = iniciarGoverno(medio, regras, leis, valores);
    const s = (v: Record<string, ValorLei>) =>
      situacaoDoOrgao(g.orgaos.saude, leis, v, "saude");
    expect(s(valores).rendimento).toBe(1);
    expect(s({ ...valores, "verba-saude": 0.025 }).rendimento).toBeCloseTo(0.5);
    // esfera sem verba em lei rende o que rende
    const defesaSem = situacaoDoOrgao(
      { necessidade: 0, leisBase: 0, corrupcao: 0 },
      leis,
      valores,
      "cultura",
    );
    expect(defesaSem.rendimento).toBe(1);
  });

  it("verba de sobra, cargos e ministro desonesto sobem a corrupção", () => {
    const g = iniciarGoverno(medio, regras, leis, valores);
    const base = andarGoverno(entrada(g)).estado.orgaos;
    const sobra = andarGoverno(entrada(g, { ...valores, "verba-saude": 0.08 }))
      .estado.orgaos;
    expect(sobra.saude.corrupcao).toBeGreaterThan(base.saude.corrupcao);
    const cargos = andarGoverno(entrada(g, { ...valores, cargos: 0.1 })).estado
      .orgaos;
    expect(cargos.defesa.corrupcao).toBeGreaterThan(base.defesa.corrupcao);
    // ministro honesto (c) segura; desonesto (b) é pior
    const desonesto = iniciarGoverno(
      pais(
        ["gabinete", "a", []],
        ["saude", "c", ["saude"]],
        ["defesa", "b", ["defesa"]],
        ["cultura", "d", ["cultura"]],
        ["esporte", "f", ["esporte"]],
      ),
      regras,
      leis,
      valores,
    );
    expect(desonesto.orgaos.defesa.corrupcao).toBeGreaterThan(
      g.orgaos.defesa.corrupcao,
    );
  });

  it("corrupção que cruza o limite vira escândalo, com o ministro", () => {
    const g = iniciarGoverno(medio, regras, leis, valores);
    const cheio = {
      ...g,
      orgaos: { ...g.orgaos, saude: { ...g.orgaos.saude, corrupcao: 59 } },
    };
    const r = andarGoverno(entrada(cheio, { ...valores, "verba-saude": 0.1 }));
    expect(r.fatos).toContainEqual(
      expect.objectContaining({
        tipo: "escandalo",
        sobre: "saude",
        quem: ["b"],
      }),
    );
    // já estava acima: não repete o escândalo
    const acima = {
      ...g,
      orgaos: { ...g.orgaos, saude: { ...g.orgaos.saude, corrupcao: 70 } },
    };
    expect(andarGoverno(entrada(acima)).fatos).toEqual([]);
  });
});

describe("nomear e moeda Ministério", () => {
  const g = iniciarGoverno(medio, regras, leis, valores);
  const base = { regras, estado: g, leis, valores, turno: 3, cargos: 0.5 };

  it("troca o ministro e o partido do demitido fica ressentido", () => {
    const r = andarGoverno({
      ...base,
      fatos: [],
      pedidos: [{ tipo: "nomear", caixa: "gabinete", ministro: "e" }],
    });
    expect(r.estado.caixas.find((c) => c.id === "gabinete")?.ministro).toBe(
      "e",
    );
    expect(r.fatos.map((f) => f.tipo)).toEqual(
      expect.arrayContaining(["ministro-nomeado", "ministro-demitido"]),
    );
    expect(r.fatos.find((f) => f.tipo === "ministro-demitido")?.quem).toEqual([
      "p1",
    ]);
  });

  it("demitir técnico não ressente ninguém", () => {
    const r = andarGoverno({
      ...base,
      fatos: [],
      pedidos: [{ tipo: "nomear", caixa: "saude", ministro: "e" }],
    });
    expect(r.fatos.map((f) => f.tipo)).not.toContain("ministro-demitido");
  });

  it("pedido inválido para o turno", () => {
    const pedir = (caixa: string, ministro: string) =>
      andarGoverno({
        ...base,
        fatos: [],
        pedidos: [{ tipo: "nomear", caixa, ministro }],
      });
    expect(() => pedir("nao-existe", "e")).toThrow(/não existe/);
    expect(() => pedir("saude", "a")).toThrow(/já é ministro/);
    expect(() => pedir("saude", "zzz")).toThrow(/não existe/);
  });

  it("moeda Ministério entrega a caixa ao melhor candidato do partido", () => {
    const oferta: Fato = {
      tipo: "ministerio-oferecido",
      turno: 3,
      tamanho: "medio",
      sobre: "defesa",
      quem: ["p1"],
      restam: 2,
    };
    const r = andarGoverno({ ...base, fatos: [oferta], pedidos: [] });
    expect(r.estado.caixas.find((c) => c.id === "defesa")?.ministro).toBe("e");
    // oferta de outro turno já foi cumprida
    const velha = andarGoverno({
      ...base,
      fatos: [{ ...oferta, turno: 2 }],
      pedidos: [],
    });
    expect(velha.estado.caixas.find((c) => c.id === "defesa")?.ministro).toBe(
      "c",
    );
  });
});

describe("o governo do país", () => {
  const partidos = ["p1", "p2"];
  const checar = (p: GovernoDoPais, r: RegrasGoverno = regras) =>
    motivoGovernoInvalido(r, p, partidos);

  it("aceita o governo certo", () => {
    expect(checar(medio)).toBeNull();
  });

  it("recusa instituição em duas caixas, falta de gabinete e ministro repetido", () => {
    const base: [string, string, string[]][] = [
      ["gabinete", "a", []],
      ["saude", "b", ["saude"]],
    ];
    expect(checar(pais(...base, ["economia", "c", ["saude"]]))).toMatch(
      /duas caixas/,
    );
    expect(checar(pais(["saude", "b", ["saude"]]))).toMatch(/sobra/);
    expect(checar(pais(["gabinete", "a", []], ["saude", "a", []]))).toMatch(
      /duas caixas/,
    );
    expect(checar(pais(["gabinete", "a", []], ["saude", "zzz", []]))).toMatch(
      /não existe/,
    );
    expect(checar(pais(...base, ["x", "c", ["falsa"]]))).toMatch(/não existe/);
    expect(checar(pais(...base, ["x", "c", ["eleicoes"]]))).toMatch(
      /não tem ministro/,
    );
  });

  it("recusa pessoa com nota fora de 0–100 ou de origem desconhecida", () => {
    const ruim = {
      ...regras,
      pessoas: [...pessoas, ficha("g", { competencia: 120 })],
    };
    expect(checar(medio, ruim)).toMatch(/notas/);
    const de = {
      ...regras,
      pessoas: [...pessoas, ficha("g", { origem: "p9" })],
    };
    expect(checar(medio, de)).toMatch(/origem/);
  });
});
