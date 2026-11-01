import { describe, expect, it } from "vitest";
import { lerPotencias, validarPotencias } from ".";

const base = () => ({
  versao: 1,
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
    expect(motivos(d)).toContain("potencias[1].bussola.social: falta a posição");
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
