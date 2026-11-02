// Fatia 8: ficha do setor. Cada mudança é uma lei de opções; o mercado e o
// cofre obedecem à ficha e às leis gerais de propriedade.
import { describe, expect, it } from "vitest";
import { criarPartida, jogar, type Partida, type Pedido } from ".";
import { ajustesDoEstado, contaDoPais } from "../motor";

const base = () => criarPartida("teste", 42, { semCongresso: true });
const pedir = (...pares: [string, string][]): Pedido[] =>
  pares.map(([lei, valor]) => ({ tipo: "mudar_lei", lei, valor }));
const conta = (p: Partida) => {
  const m = p.regras.mercado!;
  return contaDoPais(
    m.mercado,
    m.producao,
    m.cobertura,
    m.populacaoBase,
    p.estado.essenciais.populacao,
    p.estado.precos,
    ajustesDoEstado(p.regras, p.estado),
  );
};
const linha = (p: Partida, id: string) =>
  conta(p).produtos[id] ?? conta(p).outros[id]!;
const importa = (p: Partida, ids: string[]) =>
  ids.reduce((s, id) => s + linha(p, id).importa, 0);
const aco = ["aco", "maquinas", "veiculos", "avioes"];

describe("importação e preço (passo 1)", () => {
  it("importação fechada corta o que entra de fora", () => {
    const aberta = jogar(base(), 1);
    const fechada = jogar(base(), 1, pedir(["industria-importacao", "fechada"]));
    expect(importa(aberta, aco)).toBeGreaterThan(0);
    expect(importa(fechada, aco)).toBe(0);
  });

  it("cota deixa entrar só metade", () => {
    const aberta = importa(jogar(base(), 1), aco);
    const cota = importa(
      jogar(base(), 1, pedir(["industria-importacao", "cota"])),
      aco,
    );
    expect(cota).toBeCloseTo(aberta / 2, 3);
  });

  it("teto de preço segura o preço mas o produtor produz menos", () => {
    const livre = jogar(base(), 1, pedir(["industria-importacao", "fechada"]));
    const teto = jogar(
      base(),
      1,
      pedir(["industria-importacao", "fechada"], ["industria-preco", "teto"]),
    );
    const l = linha(livre, "avioes");
    const t = linha(teto, "avioes");
    expect(l.preco).toBeGreaterThan(115);
    expect(t.preco).toBeLessThanOrEqual(115);
    expect(t.producao).toBeLessThan(l.producao);
  });

  it("piso de preço encarece e faz produzir mais", () => {
    const livre = jogar(base(), 1);
    const piso = jogar(base(), 1, pedir(["luxo-preco", "piso"]));
    const l = linha(livre, "joias");
    const p = linha(piso, "joias");
    expect(p.preco).toBeGreaterThanOrEqual(90);
    expect(p.preco).toBeGreaterThanOrEqual(l.preco);
    expect(p.producao).toBeGreaterThanOrEqual(l.producao);
  });

  it("produto sem cesta também tem conta (setores de ficha)", () => {
    const p = jogar(base(), 1);
    expect(linha(p, "chips").demanda).toBeGreaterThan(0);
  });

  it("falta criada pela ficha freia o crescimento", () => {
    const sem = jogar(base(), 6);
    const fechado = jogar(
      base(),
      6,
      pedir(
        ["industria-importacao", "fechada"],
        ["tecnologia-importacao", "fechada"],
        ["transporte-importacao", "fechada"],
      ),
    );
    expect(fechado.estado.essenciais.pib_nominal).toBeLessThan(
      sem.estado.essenciais.pib_nominal,
    );
  });
});

describe("dono do setor (passos 1, 2 e 5)", () => {
  it("a fatia do Estado anda aos poucos, 10 pontos por turno", () => {
    const p = jogar(base(), 3, pedir(["alimentos-dono", "estatal"]));
    expect(p.estado.fichas["alimentos"]!.fatia).toBeCloseTo(0.3, 6);
  });

  it("estatizar custa a indenização, pelo prazo da lei", () => {
    const aVista = jogar(base(), 1, pedir(["alimentos-dono", "estatal"]));
    const justo = aVista.estado.propriedade.gasto;
    expect(justo).toBeGreaterThan(1.1);
    expect(justo).toBeLessThan(1.3);
    const parcelado = jogar(
      base(),
      1,
      pedir(["alimentos-dono", "estatal"], ["prazo-pagamento", "parcelado"]),
    );
    expect(parcelado.estado.propriedade.gasto).toBeLessThan(justo / 4);
    expect(parcelado.estado.propriedade.fila).toHaveLength(5);
  });

  it("confisco não paga, mas assusta as potências", () => {
    const normal = jogar(base(), 1, pedir(["alimentos-dono", "estatal"]));
    const confisco = jogar(
      base(),
      1,
      pedir(["alimentos-dono", "estatal"], ["indenizacao", "confisco"]),
    );
    expect(confisco.estado.propriedade.gasto).toBeLessThan(
      normal.estado.propriedade.gasto / 100,
    );
    const media = (p: Partida) =>
      Object.values(p.estado.opinioes).reduce((s, v) => s + v, 0);
    expect(media(confisco)).toBeLessThan(media(normal));
  });

  it("a lei geral pode proibir o Estado de ter empresa", () => {
    const p = jogar(
      base(),
      3,
      pedir(["setores-do-estado", "nenhum"], ["moradia-dono", "estatal"]),
    );
    expect(p.estado.fichas["moradia"]!.fatia).toBe(0);
  });

  it("vender rende dinheiro ao cofre pelo método da lei", () => {
    const leilao = jogar(base(), 1, pedir(["saude-dono", "privada"]));
    const funcionarios = jogar(
      base(),
      1,
      pedir(["saude-dono", "privada"], ["metodo-venda", "funcionarios"]),
    );
    expect(leilao.estado.propriedade.receita).toBeGreaterThan(0);
    expect(funcionarios.estado.propriedade.receita).toBeCloseTo(
      leilao.estado.propriedade.receita * 0.4,
      1,
    );
  });

  it("preço mínimo alto trava a venda quando os compradores desconfiam", () => {
    const p = base();
    const desconfiada: Partida = {
      ...p,
      estado: {
        ...p.estado,
        opinioes: Object.fromEntries(
          Object.keys(p.estado.opinioes).map((id) => [id, 20]),
        ),
      },
    };
    const trava = jogar(
      desconfiada,
      2,
      pedir(["saude-dono", "privada"], ["preco-minimo-venda", "alto"]),
    );
    expect(trava.estado.fichas["saude"]!.fatia).toBe(0.5);
    const solta = jogar(
      desconfiada,
      2,
      pedir(["saude-dono", "privada"], ["preco-minimo-venda", "baixo"]),
    );
    expect(solta.estado.fichas["saude"]!.fatia).toBeLessThan(0.5);
  });

  it("o Congresso vota a mudança da ficha como qualquer lei", () => {
    const comCongresso = criarPartida("teste", 42);
    const p = jogar(comCongresso, 1, pedir(["alimentos-dono", "estatal"]));
    const v = p.estado.votacoes.find((x) => x.lei === "alimentos-dono");
    expect(v).toBeDefined();
    expect(v!.sim + v!.nao).toBeGreaterThan(0);
  });
});

describe("capital estrangeiro (passo 6)", () => {
  it("teto zero manda o capital de fora embora; livre deixa entrar", () => {
    const nenhum = jogar(base(), 6, pedir(["industria-estrangeiro", "nenhum"]));
    const livre = jogar(base(), 6, pedir(["industria-estrangeiro", "livre"]));
    expect(nenhum.estado.fichas["industria"]!.estrangeiro).toBe(0);
    expect(livre.estado.fichas["industria"]!.estrangeiro).toBeGreaterThan(
      base().estado.fichas["industria"]!.estrangeiro,
    );
  });

  it("imposto alto na remessa rende ao cofre e afasta o capital", () => {
    const baixo = jogar(base(), 6, pedir(["remessa-de-lucro", "baixa"]));
    const alto = jogar(base(), 6, pedir(["remessa-de-lucro", "alta"]));
    expect(alto.estado.propriedade.receita).toBeGreaterThan(
      baixo.estado.propriedade.receita,
    );
    expect(alto.estado.fichas["industria"]!.estrangeiro).toBeLessThan(
      baixo.estado.fichas["industria"]!.estrangeiro,
    );
  });

  it("acordo fechado esfria a opinião das potências", () => {
    const aberto = jogar(base(), 6);
    const fechado = jogar(base(), 6, pedir(["acordo-com-potencias", "fechado"]));
    const media = (p: Partida) =>
      Object.values(p.estado.opinioes).reduce((s, v) => s + v, 0);
    expect(media(fechado)).toBeLessThan(media(aberto));
  });
});

describe("os nove setores (passo 7)", () => {
  it("cada ficha tem as quatro leis e começa com o que o país declarou", () => {
    const p = base();
    const fichas = p.regras.mercado!.fichas!.fichas;
    expect(fichas.map((f) => f.id)).toEqual([
      "alimentos",
      "saude",
      "energia",
      "transporte",
      "moradia",
      "industria",
      "tecnologia",
      "defesa",
      "luxo",
    ]);
    for (const f of fichas) {
      expect(p.estado.fichas[f.id]).toBeDefined();
      for (const lei of Object.values(f.leis))
        expect(p.estado.leis[lei]).toBeDefined();
    }
  });

  it("a partida sem pedido segue igual com as fichas no começo (determinista)", () => {
    expect(jogar(base(), 12).estado).toEqual(jogar(base(), 12).estado);
  });
});
