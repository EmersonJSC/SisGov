/**
 * SG157 fase 1 (D-50): produto entre nós pela normalização.
 * entrada = origem × fator ÷ divisor × multiplicador.
 */
import { describe, expect, it } from "vitest";
import {
  advanceExecution,
  buildGraph,
  calculateContribution,
  createExecution,
  resolvePackage,
  translateAuthorizedPolicies,
  validateContentFile,
  validatePackageCoherence,
  type ConsequenceFile,
  type GraphRelation,
} from "../engine";
import { calculatedBubbleOrder } from "../engine/runtime/computeNetwork";

function relation(
  normalization: ConsequenceFile["normalizacao"],
): GraphRelation {
  return {
    id: "r",
    sourceId: "lei",
    sourceType: "lei",
    sourcePath: "lei.json",
    consequenceId: "c",
    consequencePath: "c.json",
    originId: "aliquota",
    targetId: "receita",
    mechanism: "afim",
    parameters: { coeficiente: 1, termoConstante: 0 },
    normalization,
    unit: "moeda_ano",
    delaySteps: 0,
    duration: { modo: "continuo" },
  };
}

describe("SG157 — produto entre nós (normalizacao.fator)", () => {
  it("multiplica a origem pelo fator (alíquota × base)", () => {
    const result = calculateContribution(
      relation({ fator: "consumo", multiplicador: 0.5 }),
      20,
      (id) => (id === "consumo" ? 60 : undefined),
    );
    expect(result).toMatchObject({
      ok: true,
      value: { sourceValue: 20, inputValue: 600, factorValue: 60, value: 600 },
    });
  });

  it("combina fator e divisor", () => {
    const result = calculateContribution(
      relation({ fator: "divida", divisor: "pib", multiplicador: 100 }),
      10,
      (id) => ({ divida: 900, pib: 12000 })[id],
    );
    // 10 × 900 ÷ 12000 × 100 = 75
    expect(result.ok && result.value.inputValue).toBeCloseTo(75);
  });

  it("falha quando o fator não tem valor", () => {
    expect(
      calculateContribution(
        relation({ fator: "consumo" }),
        20,
        () => undefined,
      ),
    ).toMatchObject({
      ok: false,
      diagnostics: [{ field: "normalizacao.fator" }],
    });
  });

  it("valida: exige divisor ou fator; aceita só o fator", () => {
    const check = (normalizacao: unknown) =>
      validateContentFile(
        "c.json",
        JSON.stringify({
          id: "c",
          tipo: "consequencia",
          versaoEsquema: 1,
          origem: "a",
          alvo: "b",
          mecanismo: "afim",
          parametros: { coeficiente: 1, termoConstante: 0 },
          unidade: "moeda_ano",
          atrasoPassos: 0,
          duracao: { modo: "continuo" },
          normalizacao,
        }),
      );
    expect(check({ fator: "consumo", multiplicador: 0.01 }).ok).toBe(true);
    expect(check({ multiplicador: 2 })).toMatchObject({
      ok: false,
      diagnostics: [expect.objectContaining({ field: "normalizacao" })],
    });
    expect(check({ fator: "" })).toMatchObject({
      ok: false,
      diagnostics: [expect.objectContaining({ field: "normalizacao.fator" })],
    });
  });

  function pkg(fator: string) {
    const json = (value: object) => JSON.stringify(value);
    return {
      "cenario.json": json({
        id: "p",
        tipo: "cenario",
        versaoEsquema: 1,
        nome: "P",
        estadoInicial: "estado.json",
        variaveis: "variaveis.json",
        politicas: ["lei.json"],
        consequencias: ["c.json", "base.json"],
      }),
      "estado.json": json({
        id: "estado",
        tipo: "estado-inicial",
        versaoEsquema: 1,
        valores: { aliquota: 0, renda: 1000 },
      }),
      "variaveis.json": json({
        id: "variaveis",
        tipo: "variaveis",
        versaoEsquema: 1,
        variaveis: [
          {
            id: "aliquota",
            tipo: "controle",
            nome: "Alíquota",
            unidade: "percentual_0_100",
            dominio: { minimo: 0, maximo: 100 },
            valorInicial: 0,
          },
          {
            // estoque: ligação da rede (bolha → bolha), vale sempre
            id: "renda",
            tipo: "estoque",
            nome: "Renda",
            unidade: "moeda",
            dominio: { minimo: 0 },
          },
          {
            // id depois de "receita" na ordem alfabética: só a dependência
            // pelo fator faz a base ser calculada antes.
            id: "zbase",
            tipo: "calculado",
            nome: "Base",
            unidade: "indice_0_100",
            dominio: { minimo: 0, maximo: 100 },
          },
          {
            id: "receita",
            tipo: "calculado",
            nome: "Receita",
            unidade: "moeda_ano",
            dominio: { minimo: 0 },
          },
        ],
      }),
      "lei.json": json({
        id: "lei",
        tipo: "lei",
        versaoEsquema: 2,
        grupo: "tributaria",
        nome: "Imposto",
        descricao: "Teste",
        processoAutorizacao: "x",
        controle: { variavel: "aliquota", unidade: "percentual_0_100" },
        tributo: { base: "zbase" },
        consequencias: ["c"],
      }),
      "c.json": json({
        id: "c",
        tipo: "consequencia",
        versaoEsquema: 1,
        origem: "aliquota",
        alvo: "receita",
        mecanismo: "afim",
        parametros: { coeficiente: 1, termoConstante: 0 },
        normalizacao: { fator, multiplicador: 0.5 },
        unidade: "moeda_ano",
        atrasoPassos: 0,
        duracao: { modo: "continuo" },
      }),
      "base.json": json({
        id: "base",
        tipo: "consequencia",
        versaoEsquema: 1,
        origem: "renda",
        alvo: "zbase",
        mecanismo: "afim",
        parametros: { coeficiente: 0.01, termoConstante: 0 },
        unidade: "indice_0_100",
        atrasoPassos: 0,
        duracao: { modo: "continuo" },
      }),
    };
  }

  it("no passo do motor: base calculada antes e explicação com o fator", () => {
    const resolved = resolvePackage("cenario.json", pkg("zbase"));
    if (!resolved.ok) throw new Error(resolved.diagnostics[0].message);
    const coherent = validatePackageCoherence(resolved.value);
    if (!coherent.ok) throw new Error(coherent.diagnostics[0].message);
    const graph = buildGraph(coherent.value);
    const order = calculatedBubbleOrder(graph);
    expect(order.indexOf("zbase")).toBeLessThan(order.indexOf("receita"));
    const batch = translateAuthorizedPolicies(coherent.value, graph, [
      { policyId: "lei", intensity: 20 },
    ]);
    if (!batch.ok) throw new Error(batch.diagnostics[0].message);
    const step = advanceExecution(
      coherent.value,
      graph,
      createExecution(coherent.value, graph),
      batch.value,
    );
    if (!step.ok) throw new Error(step.diagnostics[0].message);
    // base = 1000 × 0,01 = 10; receita = 20 × 10 × 0,5 = 100
    expect(step.value.execution.values.zbase).toBeCloseTo(10);
    expect(step.value.execution.values.receita).toBeCloseTo(100);
    expect(
      step.value.explanations.find((item) => item.targetId === "receita")!
        .contributions[0],
    ).toMatchObject({ factorId: "zbase", factorValue: 10, inputValue: 100 });
  });

  it("recusa fator inexistente", () => {
    expect(resolvePackage("cenario.json", pkg("nao-existe"))).toMatchObject({
      ok: false,
      diagnostics: [
        expect.objectContaining({
          code: "REFERENCIA_QUEBRADA",
          field: "normalizacao.fator",
        }),
      ],
    });
  });
});
