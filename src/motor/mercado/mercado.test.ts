import { describe, expect, it } from "vitest";
import { lerMercado, validarMercado } from ".";

const base = () => ({
  versao: 1,
  setores: [
    { id: "essenciais", nome: "Essenciais", descricao: "" },
    { id: "luxo", nome: "Luxo", descricao: "" },
  ],
  produtos: [
    { id: "alimentos", nome: "Alimentos", setor: "essenciais" },
    { id: "joias", nome: "Joias", setor: "luxo" },
  ],
});

const motivos = (dado: unknown) =>
  validarMercado(dado).map((e) => `${e.campo}: ${e.motivo}`);

describe("validar mercado", () => {
  it("aceita o mercado certo", () => {
    expect(motivos(base())).toEqual([]);
    expect(lerMercado(base()).produtos).toHaveLength(2);
  });

  it("recusa produto sem setor e produto de setor que não existe", () => {
    const d = base();
    delete (d.produtos[0] as Partial<(typeof d.produtos)[0]>).setor;
    expect(motivos(d)).toContain("produtos[0].setor: precisa ter setor");
    const e = base();
    e.produtos[1].setor = "fantasma";
    expect(motivos(e)).toContain(
      'produtos[1].setor: setor "fantasma" não existe',
    );
  });

  it("recusa id repetido e nome vazio", () => {
    const d = base();
    d.setores[1].id = "essenciais";
    d.produtos[1].id = "alimentos";
    d.produtos[1].nome = "";
    expect(motivos(d)).toEqual(
      expect.arrayContaining([
        'setores[1].id: "essenciais" repetido',
        'produtos[1].id: "alimentos" repetido',
        "produtos[1].nome: precisa ter nome",
      ]),
    );
  });

  it("recusa setor sem nenhum produto", () => {
    const d = base();
    d.produtos.pop();
    expect(motivos(d)).toContain(
      'setores: o setor "luxo" não tem nenhum produto',
    );
  });

  it("recusa lista vazia e versão errada", () => {
    expect(motivos({ versao: 2, setores: [], produtos: [] })).toEqual([
      "versao: precisa ser 1",
      "setores: precisa ter ao menos um setor",
      "produtos: precisa ter ao menos um produto",
    ]);
  });

  it("lerMercado lança com os erros", () => {
    const d = base();
    d.produtos[0].setor = "x";
    expect(() => lerMercado(d)).toThrow("setor");
  });
});
