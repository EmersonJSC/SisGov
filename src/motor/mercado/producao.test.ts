import { describe, expect, it } from "vitest";
import { lerMercado } from "./index";
import { balancoDoPais, validarCobertura, validarProdutores } from "./producao";

const mercado = lerMercado({
  versao: 1,
  setores: [{ id: "essenciais", nome: "Essenciais", descricao: "x" }],
  produtos: [
    { id: "alimentos", nome: "Alimentos", setor: "essenciais" },
    { id: "remedios", nome: "Remédios", setor: "essenciais" },
  ],
});
const potencias = ["norte", "sul"];
const produtores = {
  alimentos: { norte: 0.5, sul: 0.5 },
  remedios: { norte: 1 },
};
const campos = (erros: { campo: string }[]) => erros.map((e) => e.campo);

describe("produtores do mundo", () => {
  it("aceita todo produto com partes somando 1", () => {
    expect(
      validarProdutores({ versao: 1, produtores }, mercado, potencias),
    ).toEqual([]);
  });

  it("barra produto sem fornecedor, potência inexistente e soma errada", () => {
    const erros = validarProdutores(
      {
        versao: 1,
        produtores: { alimentos: { norte: 0.5, lua: 0.5 }, fantasma: {} },
      },
      mercado,
      potencias,
    );
    expect(campos(erros)).toEqual([
      "produtores.fantasma",
      "produtores.alimentos.lua",
      "produtores.alimentos",
      "produtores.remedios",
    ]);
  });
});

describe("cobertura do país", () => {
  it("aceita de 0 a 200 e barra falta, excesso e produto desconhecido", () => {
    expect(
      validarCobertura(
        { versao: 1, cobertura: { alimentos: 0, remedios: 200 } },
        mercado,
      ),
    ).toEqual([]);
    expect(
      campos(
        validarCobertura(
          { versao: 1, cobertura: { alimentos: 201, lua: 5 } },
          mercado,
        ),
      ),
    ).toEqual(["cobertura.lua", "cobertura.alimentos", "cobertura.remedios"]);
  });
});

describe("balanço do país", () => {
  const balanco = balancoDoPais({
    mercado,
    produtores,
    cobertura: { alimentos: 120, remedios: 60 },
  });
  const [alimentos, remedios] = balanco.setores[0].produtos;

  it("exporta o que passa de 100 e importa o que falta", () => {
    expect(alimentos).toMatchObject({
      cobertura: 120,
      importa: 0,
      exporta: 20,
    });
    expect(remedios).toMatchObject({ cobertura: 60, importa: 40, exporta: 0 });
  });

  it("reparte a importação entre os fornecedores", () => {
    expect(remedios.fornecedores).toEqual([{ potencia: "norte", parte: 40 }]);
  });

  it("dependência: média do que se compra de cada potência", () => {
    expect(balanco.dependencia).toEqual({ norte: 20 });
  });
});
