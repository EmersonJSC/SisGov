import { describe, expect, it } from "vitest";
import { lerMercado } from "./index";
import { andarPrecos, maisBarata, precosIniciais } from "./preco";
import {
  balancoDoPais,
  partesDoExcedente,
  validarCobertura,
  validarProducaoDoMundo,
} from "./producao";

const mercado = lerMercado({
  versao: 1,
  setores: [{ id: "essenciais", nome: "Essenciais", descricao: "x" }],
  produtos: [
    { id: "alimentos", nome: "Alimentos", setor: "essenciais" },
    { id: "remedios", nome: "Remédios", setor: "essenciais" },
  ],
});
const potencias = ["norte", "sul"];
const producao = {
  norte: { alimentos: 150, remedios: 150 },
  sul: { alimentos: 100, remedios: 40 },
};
const campos = (erros: { campo: string }[]) => erros.map((e) => e.campo);

describe("produção das potências", () => {
  it("aceita quando cada potência declara todo produto", () => {
    expect(
      validarProducaoDoMundo({ versao: 1, producao }, mercado, potencias),
    ).toEqual([]);
  });

  it("barra potência inexistente, sem produção e produto faltando", () => {
    const erros = validarProducaoDoMundo(
      { versao: 1, producao: { norte: { alimentos: 150 }, lua: {} } },
      mercado,
      potencias,
    );
    expect(campos(erros)).toEqual([
      "producao.lua",
      "producao.norte.cobertura.remedios",
      "producao.sul",
    ]);
  });
});

describe("fornecedores pelo excedente", () => {
  it("quem passa de 100 vende, na proporção do excedente", () => {
    expect(
      partesDoExcedente({ a: { x: 150 }, b: { x: 130 }, c: { x: 90 } }, "x"),
    ).toEqual([
      ["a", 50 / 80],
      ["b", 30 / 80],
      ["c", 0],
    ]);
  });

  it("sem excedente nenhum, entram todas pela cobertura", () => {
    expect(partesDoExcedente({ a: { x: 60 }, b: { x: 20 } }, "x")).toEqual([
      ["a", 0.75],
      ["b", 0.25],
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
    ).toEqual(["cobertura.lua", "cobertura.alimentos"]);
  });

  it("o país pode deixar produto de fora (compra tudo)", () => {
    expect(
      validarCobertura({ versao: 1, cobertura: { alimentos: 80 } }, mercado),
    ).toEqual([]);
    const sem = balancoDoPais({ mercado, producao, cobertura: {} });
    expect(sem.setores[0].produtos[0]).toMatchObject({
      cobertura: 0,
      importa: 100,
    });
  });
});

describe("balanço do país", () => {
  const balanco = balancoDoPais({
    mercado,
    producao: { ...producao, norte: { alimentos: 150, remedios: 150 } },
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

describe("preço do mundo", () => {
  const inicial = precosIniciais(mercado, producao);

  it("começa no alvo, sem variação; falta de oferta encarece", () => {
    expect(inicial.alimentos.variacao).toBe(0);
    expect(inicial.alimentos.valor).toBeCloseTo(100 * Math.pow(200 / 250, 1.5));
    expect(inicial.remedios.valor).toBeGreaterThan(100);
  });

  it("anda rumo ao alvo, é igual para o mesmo turno e fica nos limites", () => {
    const duro = { alimentos: { valor: 200, variacao: 0 } };
    const a = andarPrecos(mercado, producao, { ...inicial, ...duro }, 3);
    const b = andarPrecos(mercado, producao, { ...inicial, ...duro }, 3);
    expect(a).toEqual(b);
    expect(a.alimentos.valor).toBeLessThan(200);
    expect(a.alimentos.variacao).toBeLessThan(0);
    for (const p of Object.values(a)) {
      expect(p.valor).toBeGreaterThanOrEqual(40);
      expect(p.valor).toBeLessThanOrEqual(250);
    }
  });

  it("vende mais barato quem mais produz", () => {
    expect(maisBarata(producao, "remedios")).toBe("norte");
    expect(maisBarata({ a: { x: 0 } }, "x")).toBeUndefined();
  });
});
