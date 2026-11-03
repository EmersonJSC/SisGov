// Contrato: todo JSON de lei do mundo passa no validador do motor.
import { describe, expect, it } from "vitest";
import { validarLei } from "../motor/leis";
import {
  lerMercado,
  lerPotencias,
  validarOcupacao,
  validarCobertura,
  validarProducaoDoMundo,
} from "../motor";
import produtos from "../conteudo/mundo/mercado/produtos.json";
import produtores from "../conteudo/mundo/mercado/produtores.json";
import pops from "../conteudo/mundo/pops/pops.json";
import potencias from "../conteudo/mundo/potencias/potencias.json";
import { paisesDisponiveis } from ".";
import variaveis from "../conteudo/mundo/indicadores/variaveis.json";

const leis = import.meta.glob("../conteudo/mundo/leis/*.json", {
  eager: true,
  import: "default",
});
const paisesProducao = import.meta.glob("../conteudo/paises/*/producao.json", {
  eager: true,
  import: "default",
});
const jogabilidade = variaveis.variaveis
  .filter((v) => v.camada !== "essencial")
  .map((v) => v.id);

describe("contrato das leis", () => {
  it("existe ao menos uma lei", () => {
    expect(Object.keys(leis).length).toBeGreaterThan(0);
  });

  for (const [arquivo, lei] of Object.entries(leis)) {
    it(arquivo.replace("../conteudo/", ""), () => {
      expect(validarLei(lei, arquivo, jogabilidade)).toEqual([]);
    });
  }
});

describe("contrato das potências", () => {
  it("o JSON das potências passa no validador", async () => {
    const { validarPotencias } = await import("../motor/mundo");
    const potencias =
      await import("../conteudo/mundo/potencias/potencias.json");
    expect(validarPotencias(potencias.default)).toEqual([]);
  });
});

describe("contrato do mercado", () => {
  it("o JSON dos setores e produtos passa no validador", async () => {
    const { validarMercado } = await import("../motor/mercado");
    const mercado = await import("../conteudo/mundo/mercado/produtos.json");
    expect(validarMercado(mercado.default)).toEqual([]);
  });
});

describe("contrato dos pops", () => {
  it("são 25, cada um com bússola de −1 a +1", () => {
    expect(pops.pops).toHaveLength(25);
    for (const p of pops.pops)
      for (const v of [p.bussola.economico, p.bussola.social])
        expect(Math.abs(v), p.id).toBeLessThanOrEqual(1);
  });
});

describe("contrato da produção", () => {
  it("produção das potências e cobertura de cada país passam nos validadores", () => {
    const mercado = lerMercado(produtos);
    const ids = lerPotencias(potencias).map((p) => p.id);
    expect(validarProducaoDoMundo(produtores, mercado, ids)).toEqual([]);
    expect(validarOcupacao(pops.pops, mercado)).toEqual([]);
    for (const pais of paisesDisponiveis()) {
      const dado = paisesProducao[`../conteudo/paises/${pais}/producao.json`];
      expect(validarCobertura(dado, mercado), pais).toEqual([]);
    }
  });
});
