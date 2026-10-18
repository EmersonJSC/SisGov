import { describe, expect, it } from "vitest";
import {
  CICLO_EMPRESAS_PILOTO,
  gerarRodada,
  simularCicloEmpresas,
  sugerirInvestimentoPublico,
  limitesDePropriedade,
  validarDefinicao,
} from "../engine";

const BASE = {
  turnos: 12,
  demandaInicial: 100,
  crescimentoDemandaAnual: 2,
  capacidadeInicial: 100,
  caixaInicial: 500,
  investimentoPublico: 10,
  investimentoPrivado: 10,
  prazoInvestimento: 2,
  participacaoPublica: 50,
  participacaoMinimaPermitida: 0,
  participacaoMaximaPermitida: 100,
  transacoes: [],
  nacionalizacaoPermitida: false,
  valorEmpresaInicial: 200,
  preco: 10,
  variacaoPrecoAnual: 0,
  custoUnitario: 7,
  variacaoCustoAnual: 0,
  aliquotaEscolhida: 25,
  sensibilidadeEvasao: 0.7,
  taxaDistribuicaoLucro: 0.5,
};

describe("gerador interno do grafo", () => {
  it("mantém o ciclo piloto como rascunho quando os elos ainda são hipóteses", () => {
    expect(
      validarDefinicao(CICLO_EMPRESAS_PILOTO).filter((f) => f.bloqueante),
    ).toEqual([]);
    expect(gerarRodada(CICLO_EMPRESAS_PILOTO).estado).toBe("rascunho");
    expect(
      CICLO_EMPRESAS_PILOTO.nos.some((n) => n.tipo === "lei" && !n.decisao),
    ).toBe(false);
  });

  it("não compila uma lei sem decisão e consequência conectada", () => {
    const def = {
      ...CICLO_EMPRESAS_PILOTO,
      nos: CICLO_EMPRESAS_PILOTO.nos.map((n) =>
        n.id === "regime-propriedade" ? { ...n, decisao: undefined } : n,
      ),
    };
    expect(
      validarDefinicao(def).some((f) => f.codigo === "LEI_SEM_ESCOLHA"),
    ).toBe(true);
  });

  it("registra compra ou venda como mudança patrimonial e de caixa", () => {
    const compra = simularCicloEmpresas({
      ...BASE,
      turnos: 1,
      transacoes: [{ turno: 1, tipo: "compra", pontosPercentuais: 10 }],
    })[0];
    const venda = simularCicloEmpresas({
      ...BASE,
      turnos: 1,
      transacoes: [{ turno: 1, tipo: "venda", pontosPercentuais: -10 }],
    })[0];
    expect(compra.participacaoPublica).toBe(60);
    expect(compra.compraOuVenda).toBe(20);
    expect(venda.participacaoPublica).toBe(40);
    expect(venda.compraOuVenda).toBe(-20);
    expect(compra.caixaPublico).toBeLessThan(venda.caixaPublico);
  });

  it("faz a regra constitucional limitar permissões, sem alterar participação por conta própria", () => {
    expect(limitesDePropriedade("privada")).toEqual({ minimo: 0, maximo: 0 });
    expect(limitesDePropriedade("mista")).toEqual({ minimo: 0, maximo: 100 });
    expect(limitesDePropriedade("publica")).toEqual({
      minimo: 100,
      maximo: 100,
    });
    expect(() =>
      simularCicloEmpresas({
        ...BASE,
        participacaoPublica: 50,
        participacaoMinimaPermitida: 100,
        participacaoMaximaPermitida: 100,
      }),
    ).toThrow(/participação inicial/);
  });

  it("exige permissão de nacionalização e registra compensação como saída patrimonial", () => {
    const p = {
      ...BASE,
      turnos: 1,
      nacionalizacaoPermitida: true,
      transacoes: [
        {
          turno: 1,
          tipo: "nacionalizacao" as const,
          pontosPercentuais: 10,
          valorPorPonto: 3,
        },
      ],
    };
    const state = simularCicloEmpresas(p)[0];
    expect(state.nacionalizacao).toBe(30);
    expect(state.participacaoPublica).toBe(60);
    expect(() =>
      simularCicloEmpresas({ ...p, nacionalizacaoPermitida: false }),
    ).toThrow(/não permite nacionalização/);
  });

  it("só acrescenta capacidade depois do prazo do investimento", () => {
    const rodada = simularCicloEmpresas({
      ...BASE,
      turnos: 3,
      prazoInvestimento: 2,
    });
    expect(rodada[0].capacidade).toBe(100);
    expect(rodada[1].capacidade).toBe(100);
    expect(rodada[2].capacidade).toBeGreaterThan(100);
  });

  it("aceita alíquotas extremas e deixa a base reagir sem teto nominal", () => {
    const moderada = simularCicloEmpresas({
      ...BASE,
      turnos: 1,
      aliquotaEscolhida: 25,
    })[0];
    const extrema = simularCicloEmpresas({
      ...BASE,
      turnos: 1,
      aliquotaEscolhida: 1000,
    })[0];
    expect(extrema.imposto).toBeGreaterThanOrEqual(0);
    expect(extrema.imposto).toBeLessThan(moderada.imposto);
  });

  it("busca investimento dentro dos candidatos declarados e respeita o piso de caixa", () => {
    const sugestao = sugerirInvestimentoPublico(BASE, [0, 10, 20], 0)!;
    expect([0, 10, 20]).toContain(sugestao.valor);
    expect(sugestao.viavel).toBe(true);
  });
});
