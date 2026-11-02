import { describe, expect, it } from "vitest";
import {
  andarOpinioes,
  lerPotencias,
  motivoOpinioesInvalidas,
  opiniaoDesejada,
  reputacao,
  posicaoDoPais,
  segurancaExterna,
  validarPotencias,
} from ".";
import type { Lei } from "../leis";

const base = () => ({
  versao: 1,
  indice_reputacao: "reputacao",
  potencias: [
    {
      id: "a",
      nome: "A",
      descricao: "",
      bussola: { economico: 0.5, social: 0 },
      peso: 0.6,
      relacoes: { b: -0.5 },
    },
    {
      id: "b",
      nome: "B",
      descricao: "",
      bussola: { economico: -0.5, social: 0.5 },
      peso: 0.4,
      relacoes: { a: -0.5 },
    },
  ],
});

const motivos = (dado: unknown) =>
  validarPotencias(dado).map((e) => `${e.campo}: ${e.motivo}`);

describe("validar potências", () => {
  it("aceita o mundo certo", () => {
    expect(motivos(base())).toEqual([]);
    expect(lerPotencias(base())).toHaveLength(2);
  });

  it("recusa potência sem posição", () => {
    const d = base();
    delete (d.potencias[0] as Partial<(typeof d.potencias)[0]>).bussola;
    expect(motivos(d)).toContain("potencias[0].bussola: precisa ter posição");
  });

  it("recusa potência sem um dos eixos", () => {
    const d = base();
    d.potencias[1].bussola = { economico: 0.2 } as never;
    expect(motivos(d)).toContain(
      "potencias[1].bussola.social: falta a posição",
    );
  });

  it("recusa relação com potência que não existe", () => {
    const d = base();
    (d.potencias[0].relacoes as unknown as Record<string, number>).c = 0.3;
    expect(motivos(d)).toContain(
      'potencias[0].relacoes.c: potência "c" não existe',
    );
  });

  it("recusa relação faltando, consigo mesma e diferente nos dois lados", () => {
    const d = base();
    d.potencias[1].relacoes = { b: 0 } as never;
    expect(motivos(d)).toEqual(
      expect.arrayContaining([
        "potencias[1].relacoes.b: relação consigo mesma",
        'potencias[1].relacoes: falta a relação com "a"',
      ]),
    );
    const e = base();
    e.potencias[1].relacoes = { a: 0.5 };
    expect(motivos(e)).toContain(
      'relacoes: "a" e "b" têm valores diferentes (-0.5 e 0.5)',
    );
  });

  it("recusa pesos que não somam 1 e id repetido", () => {
    const d = base();
    d.potencias[1].peso = 0.5;
    expect(motivos(d).some((m) => m.includes("soma dos pesos"))).toBe(true);
    const e = base();
    e.potencias[1].id = "a";
    expect(motivos(e)).toContain('potencias[1].id: "a" repetido');
  });

  it("lerPotencias lança com os erros", () => {
    const d = base();
    d.potencias[0].peso = 2;
    expect(() => lerPotencias(d)).toThrow("peso");
  });
});

const imposto: Lei = {
  versao: 1,
  id: "imposto",
  camada: "jogabilidade",
  forma: "continua",
  unidade: "fracao",
  faixa: { min: 0, max: 0.4 },
  passo: 0.01,
  bussola: { min: { economico: 1 }, max: { economico: -1 } },
  efeitos: [],
};
const pena: Lei = {
  versao: 1,
  id: "pena",
  camada: "jogabilidade",
  forma: "opcoes",
  opcoes: [
    { id: "abolida", bussola: { social: -0.4 }, efeitos: [] },
    { id: "graves", bussola: { social: 0.8 }, efeitos: [] },
  ],
};
const semBussola: Lei = {
  ...pena,
  id: "sem",
  opcoes: [{ id: "x", efeitos: [] }],
};
const leis = { imposto, pena, sem: semBussola };

describe("posição do país", () => {
  it("é a média das leis, eixo por eixo; lei sem o eixo não entra", () => {
    // Imposto no meio da faixa: econômico 0. Só a pena fala do social.
    expect(
      posicaoDoPais(leis, { imposto: 0.2, pena: "graves", sem: "x" }),
    ).toEqual({ economico: 0, social: 0.8 });
    expect(
      posicaoDoPais(leis, { imposto: 0.1, pena: "abolida" }).economico,
    ).toBeCloseTo(0.5);
  });

  it("eixo sem lei nenhuma fica em 0", () => {
    expect(posicaoDoPais({ sem: semBussola }, { sem: "x" })).toEqual({
      economico: 0,
      social: 0,
    });
  });
});

describe("opinião das potências", () => {
  const [a] = lerPotencias(base());

  it("desejada: 100 na mesma posição, 0 no canto oposto", () => {
    expect(opiniaoDesejada(a, { economico: 0.5, social: 0 })).toBeCloseTo(100);
    const longe = { ...a, bussola: { economico: 1, social: 1 } };
    expect(opiniaoDesejada(longe, { economico: -1, social: -1 })).toBeCloseTo(
      0,
    );
  });

  it("desejada é curva: perdoa o pouco e despenca perto do oposto", () => {
    const meio = { economico: 0.5, social: 0 };
    // f = distância ÷ 2√2; 100 × (1 − f²)
    const em = (f: number) => ({
      ...meio,
      economico: 0.5 - f * 2 * Math.SQRT2,
    });
    expect(opiniaoDesejada(a, em(0.25))).toBeCloseTo(93.75);
    expect(opiniaoDesejada(a, em(0.5))).toBeCloseTo(75);
    expect(opiniaoDesejada(a, em(0.75))).toBeCloseTo(43.75);
  });

  it("anda 10% rumo à desejada por turno", () => {
    const pais = { economico: 0.5, social: 0 };
    expect(andarOpinioes([a], { a: 50 }, pais).a).toBeCloseTo(55);
    expect(andarOpinioes([a], { a: 100 }, pais).a).toBeCloseTo(100);
  });

  it("recusa opiniões de partida erradas", () => {
    const ps = lerPotencias(base());
    expect(motivoOpinioesInvalidas(ps, { a: 50, b: 50 })).toBeNull();
    expect(motivoOpinioesInvalidas(ps, undefined)).toMatch(/faltam/);
    expect(motivoOpinioesInvalidas(ps, { a: 50 })).toMatch(/falta.*"b"/);
    expect(motivoOpinioesInvalidas(ps, { a: 50, b: 50, c: 1 })).toMatch(/"c"/);
    expect(motivoOpinioesInvalidas(ps, { a: 50, b: 120 })).toMatch(/0 e 100/);
  });
});

describe("reputação", () => {
  it("é a média das opiniões pesada pelo peso", () => {
    const potencias = lerPotencias(base());
    expect(reputacao(potencias, { a: 80, b: 30 })).toBeCloseTo(
      0.6 * 80 + 0.4 * 30,
    );
  });

  it("recusa mundo sem o índice da reputação", () => {
    const { indice_reputacao: _, ...dado } = base();
    expect(motivos(dado)).toContain(
      "indice_reputacao: precisa ser o id do índice da reputação",
    );
  });
});

describe("segurança externa", () => {
  it("sem corte: cai conforme a reputação cai, nunca passa do poder", () => {
    expect(segurancaExterna(60, 100)).toBe(60);
    expect(segurancaExterna(60, 90)).toBe(50);
    expect(segurancaExterna(60, 70)).toBe(30);
    expect(segurancaExterna(60, 0)).toBe(0);
    expect(segurancaExterna(10, 50)).toBe(0);
    expect(segurancaExterna(100, 100)).toBe(100);
  });

  it("os índices de defesa são opcionais, mas precisam ser ids", () => {
    const ok = { ...base(), indice_poder_defensivo: "pd" };
    expect(motivos(ok)).toEqual([]);
    expect(motivos({ ...ok, indice_seguranca_externa: 3 })).toEqual([
      "indice_seguranca_externa: precisa ser o id de um índice",
    ]);
  });
});
