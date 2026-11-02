import { describe, expect, it } from "vitest";
import { empregoDoPais, lerMercado, validarOcupacao } from "./index";
import {
  andarChoques,
  andarPrecos,
  cicloDoMundo,
  maisBarata,
  precosIniciais,
} from "./preco";
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

describe("ciclo e choques", () => {
  it("ciclo vale 1 no turno 0, sobe 8% no quarto do período e é igual sempre", () => {
    expect(cicloDoMundo(0)).toBe(1);
    expect(cicloDoMundo(6)).toBeCloseTo(1.08);
    expect(cicloDoMundo(18)).toBeCloseTo(0.92);
  });

  it("choque empurra o alvo e some aos poucos", () => {
    const inicial = precosIniciais(mercado, producao);
    const sem = andarPrecos(mercado, producao, inicial, 1);
    const com = andarPrecos(mercado, producao, inicial, 1, { alimentos: 1.5 });
    expect(com.alimentos.valor).toBeGreaterThan(sem.alimentos.valor);
    const depois = andarChoques(mercado, { alimentos: 1.5 }, 1);
    expect(depois.alimentos).toBeCloseTo(1.3);
    expect(andarChoques(mercado, { alimentos: 1.01 }, 1).alimentos).toBe(
      undefined,
    );
  });

  it("sorteia choques só de vez em quando, sempre iguais para o mesmo turno", () => {
    let total = 0;
    for (let t = 1; t <= 500; t++) {
      const a = andarChoques(mercado, {}, t);
      expect(a).toEqual(andarChoques(mercado, {}, t));
      for (const f of Object.values(a)) {
        total++;
        expect(f >= 1.3 && f <= 1.8 || f >= 1 / 1.8 && f <= 1 / 1.3).toBe(true);
      }
    }
    expect(total).toBeGreaterThan(5);
    expect(total).toBeLessThan(60);
  });
});

describe("emprego, salário e lucro", () => {
  const ocupacao = {
    dono: { setores: { essenciais: 1 }, capital: 1 },
    gente: { setores: { essenciais: 1 }, capital: 0 },
    informal: { setores: {}, capital: 0 },
  };
  const pops = {
    dono: { pessoas: 10, renda_bruta: 400 },
    gente: { pessoas: 60, renda_bruta: 100 },
    informal: { pessoas: 30, renda_bruta: 50 },
  };
  const r = empregoDoPais(mercado, ocupacao, pops);

  it("conta empregos, salário e lucro; informal fica fora", () => {
    expect(r.semEmprego).toBe(30);
    expect(r.setores[0].empregos).toBe(60);
    expect(r.setores[0].lucro).toBeCloseTo((100 * 4000) / 11500);
    expect(r.setores[0].salario).toBeCloseTo(100 / 115);
  });

  it("nada se perde: salário + lucro + informais = PIB", () => {
    const pib = 4000 + 6000 + 1500;
    const informais = (100 * 1500) / pib;
    expect(r.setores[0].massa + r.setores[0].lucro + informais).toBeCloseTo(100);
  });

  it("barra setor inexistente, soma errada e capital fora", () => {
    const erros = validarOcupacao(
      [
        { id: "a", setores: { lua: 1 }, capital: 0 },
        { id: "b", setores: { essenciais: 0.5 }, capital: 0 },
        { id: "c", setores: {}, capital: 2 },
      ],
      mercado,
    );
    expect(erros.map((e) => e.campo)).toEqual([
      "a.setores.lua",
      "b.setores",
      "c.capital",
    ]);
  });
});
