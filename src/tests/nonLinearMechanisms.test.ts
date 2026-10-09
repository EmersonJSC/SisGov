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
import { scaleConsequenceParameters } from "../game/prepareMonthlyContent";

function relation(
  mechanism: ConsequenceFile["mecanismo"],
  parameters: ConsequenceFile["parametros"],
  normalization?: ConsequenceFile["normalizacao"],
): GraphRelation {
  return {
    id: "r",
    sourceId: "lei",
    sourceType: "lei",
    sourcePath: "lei.json",
    consequenceId: "c",
    consequencePath: "c.json",
    originId: "x",
    targetId: "y",
    mechanism,
    parameters,
    normalization,
    unit: "indice_0_100",
    delaySteps: 0,
    duration: { modo: "continuo" },
  };
}

function value(
  rel: GraphRelation,
  x: number,
  nodes: Record<string, number> = {},
): number {
  const result = calculateContribution(rel, x, (id) => nodes[id]);
  if (!result.ok) throw new Error(result.diagnostics[0].message);
  return result.value.value;
}

describe("SG141 — mecanismos não lineares", () => {
  it("saturação se aproxima do teto e nunca passa dele", () => {
    const rel = relation("saturacao", { maximo: 20, escala: 10 });
    expect(value(rel, 0)).toBe(0);
    expect(value(rel, 10)).toBeCloseTo(20 * (1 - Math.exp(-1)));
    expect(value(rel, 1000)).toBeCloseTo(20);
    expect(value(rel, 1000)).toBeLessThanOrEqual(20);
    // Teto negativo: efeito que reduz o alvo, também limitado.
    expect(
      value(relation("saturacao", { maximo: -5, escala: 1 }), 50),
    ).toBeCloseTo(-5);
  });

  it("retornos decrescentes: cada unidade a mais rende menos", () => {
    const rel = relation("retornos_decrescentes", {
      coeficiente: 2,
      escala: 10,
    });
    expect(value(rel, 0)).toBe(0);
    // Perto de zero a inclinação é o coeficiente.
    expect(value(rel, 0.001) / 0.001).toBeCloseTo(2, 2);
    const first = value(rel, 10);
    const second = value(rel, 20) - first;
    const third = value(rel, 30) - value(rel, 20);
    expect(second).toBeLessThan(first);
    expect(third).toBeLessThan(second);
    expect(value(rel, 20)).toBeLessThan(2 * value(rel, 10));
  });

  it("limiar só age depois do ponto, acima ou abaixo", () => {
    const above = relation("limiar", {
      limiar: 50,
      coeficiente: 0.5,
      direcao: "acima",
    });
    expect(value(above, 40)).toBe(0);
    expect(value(above, 50)).toBe(0);
    expect(value(above, 70)).toBe(10);
    const below = relation("limiar", {
      limiar: 50,
      coeficiente: -1,
      direcao: "abaixo",
    });
    expect(value(below, 60)).toBe(0);
    expect(value(below, 45)).toBe(-5);
  });

  it("afim continua igual", () => {
    expect(
      value(relation("afim", { coeficiente: 0.02, termoConstante: 1 }), 20),
    ).toBeCloseTo(1.4);
  });

  it("normalização: o mecanismo lê a razão (gasto ÷ PIB × 100)", () => {
    const rel = relation(
      "retornos_decrescentes",
      { coeficiente: 1, escala: 1 },
      { divisor: "pib", multiplicador: 100 },
    );
    const result = calculateContribution(rel, 600, (id) =>
      id === "pib" ? 12000 : undefined,
    );
    expect(result).toMatchObject({
      ok: true,
      value: { sourceValue: 600, inputValue: 5, divisorValue: 12000 },
    });
    // Mesmo % do PIB em países de tamanhos diferentes → mesmo efeito (D-40).
    expect(value(rel, 600, { pib: 12000 })).toBeCloseTo(
      value(rel, 60, { pib: 1200 }),
    );
    expect(calculateContribution(rel, 600, () => 0)).toMatchObject({
      ok: false,
      diagnostics: [{ field: "normalizacao.divisor" }],
    });
  });

  it("é determinístico e recusa entrada negativa onde não faz sentido", () => {
    const rel = relation("saturacao", { maximo: 1, escala: 1 });
    expect(value(rel, 3)).toBe(value(rel, 3));
    expect(calculateContribution(rel, -1, () => undefined)).toMatchObject({
      ok: false,
    });
  });
});

describe("SG141 — conversão trimestre → mês é exata", () => {
  const cases: [ConsequenceFile["mecanismo"], ConsequenceFile["parametros"]][] =
    [
      ["afim", { coeficiente: 0.7, termoConstante: 2 }],
      ["saturacao", { maximo: 12, escala: 4 }],
      ["retornos_decrescentes", { coeficiente: 3, escala: 5 }],
      ["limiar", { limiar: 6, coeficiente: 2, direcao: "acima" }],
      ["limiar", { limiar: 6, coeficiente: -2, direcao: "abaixo" }],
    ];
  for (const [mechanism, parameters] of cases)
    it(`${mechanism} ${parameters.direcao ?? ""}: g(x) = f(k·x) / d`, () => {
      const quarterly = relation(mechanism, parameters);
      for (const [k, d] of [
        [3, 3],
        [3, 1],
        [1, 3],
      ])
        for (const x of [0, 0.5, 2, 3, 9, 40]) {
          const monthly = relation(
            mechanism,
            scaleConsequenceParameters(mechanism, parameters, k, d),
          );
          expect(value(monthly, x)).toBeCloseTo(
            value(quarterly, k * x) / d,
            10,
          );
        }
    });
});

describe("SG141 — validação do conteúdo", () => {
  function consequence(fields: Record<string, unknown>): string {
    return JSON.stringify({
      id: "c",
      tipo: "consequencia",
      versaoEsquema: 1,
      origem: "a",
      alvo: "b",
      unidade: "indice_0_100",
      atrasoPassos: 0,
      duracao: { modo: "continuo" },
      ...fields,
    });
  }
  const check = (fields: Record<string, unknown>) =>
    validateContentFile("c.json", consequence(fields));

  it("aceita cada mecanismo com seus parâmetros", () => {
    expect(
      check({ mecanismo: "saturacao", parametros: { maximo: 5, escala: 2 } })
        .ok,
    ).toBe(true);
    expect(
      check({
        mecanismo: "retornos_decrescentes",
        parametros: { coeficiente: 1, escala: 2 },
      }).ok,
    ).toBe(true);
    expect(
      check({
        mecanismo: "limiar",
        parametros: { limiar: 1, coeficiente: 1, direcao: "abaixo" },
      }).ok,
    ).toBe(true);
    expect(
      check({
        mecanismo: "saturacao",
        parametros: { maximo: 5, escala: 2 },
        normalizacao: { divisor: "pib", multiplicador: 100 },
      }).ok,
    ).toBe(true);
  });

  it("recusa mecanismo desconhecido e parâmetros errados", () => {
    expect(check({ mecanismo: "exponencial", parametros: {} })).toMatchObject({
      ok: false,
      diagnostics: [
        expect.objectContaining({ code: "MECANISMO_NAO_SUPORTADO" }),
      ],
    });
    const fieldsOf = (fields: Record<string, unknown>) => {
      const result = check(fields);
      return result.ok ? [] : result.diagnostics.map((item) => item.field);
    };
    expect(
      fieldsOf({ mecanismo: "saturacao", parametros: { maximo: 5 } }),
    ).toContain("parametros.escala");
    expect(
      fieldsOf({
        mecanismo: "saturacao",
        parametros: { maximo: 5, escala: 0 },
      }),
    ).toContain("parametros.escala");
    expect(
      fieldsOf({
        mecanismo: "saturacao",
        parametros: { coeficiente: 1, termoConstante: 0 },
      }),
    ).toContain("coeficiente");
    expect(
      fieldsOf({
        mecanismo: "limiar",
        parametros: { limiar: 1, coeficiente: 1, direcao: "lado" },
      }),
    ).toContain("parametros.direcao");
    expect(
      fieldsOf({
        mecanismo: "afim",
        parametros: { coeficiente: 1, termoConstante: 0 },
        normalizacao: { divisor: "pib", multiplicador: 0 },
      }),
    ).toContain("normalizacao.multiplicador");
  });
});

describe("SG141 — integração no passo do motor", () => {
  function pkg(consequence: Record<string, unknown>, divisorMinimum = 1) {
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
        consequencias: ["c.json"],
      }),
      "estado.json": json({
        id: "estado",
        tipo: "estado-inicial",
        versaoEsquema: 1,
        valores: { gasto: 0, pib: 1000 },
      }),
      "variaveis.json": json({
        id: "variaveis",
        tipo: "variaveis",
        versaoEsquema: 1,
        variaveis: [
          {
            id: "gasto",
            tipo: "controle",
            nome: "Gasto",
            unidade: "moeda",
            dominio: { minimo: 0 },
            valorInicial: 0,
          },
          {
            id: "pib",
            tipo: "controle",
            nome: "PIB",
            unidade: "moeda",
            dominio: { minimo: divisorMinimum },
            valorInicial: 1000,
          },
          {
            id: "saude",
            tipo: "calculado",
            nome: "Saúde",
            unidade: "indice_0_100",
            dominio: { minimo: 0, maximo: 100 },
          },
        ],
      }),
      "lei.json": json({
        id: "lei",
        tipo: "lei",
        versaoEsquema: 2,
        grupo: "orcamentaria",
        nome: "Lei",
        descricao: "Teste",
        processoAutorizacao: "x",
        controle: { variavel: "gasto", unidade: "moeda" },
        orcamento: { modo: "valor_fixo" },
        consequencias: ["c"],
      }),
      "c.json": json({
        id: "c",
        tipo: "consequencia",
        versaoEsquema: 1,
        origem: "gasto",
        alvo: "saude",
        unidade: "indice_0_100",
        atrasoPassos: 0,
        duracao: { modo: "continuo" },
        ...consequence,
      }),
    };
  }

  it("um passo usa saturação sobre % do PIB e explica o mecanismo", () => {
    const resolved = resolvePackage(
      "cenario.json",
      pkg({
        mecanismo: "saturacao",
        parametros: { maximo: 20, escala: 2 },
        normalizacao: { divisor: "pib", multiplicador: 100 },
      }),
    );
    if (!resolved.ok) throw new Error(resolved.diagnostics[0].message);
    const coherent = validatePackageCoherence(resolved.value);
    if (!coherent.ok) throw new Error(coherent.diagnostics[0].message);
    const graph = buildGraph(coherent.value);
    const batch = translateAuthorizedPolicies(coherent.value, graph, [
      { policyId: "lei", intensity: 40 },
    ]);
    if (!batch.ok) throw new Error(batch.diagnostics[0].message);
    const step = advanceExecution(
      coherent.value,
      graph,
      createExecution(coherent.value, graph),
      batch.value,
    );
    if (!step.ok) throw new Error(step.diagnostics[0].message);
    // 40 ÷ 1000 × 100 = 4% do PIB → 20·(1 − e^(−2)).
    // Índice sem base (D-41): é só o que recebe.
    const expected = 20 * (1 - Math.exp(-2));
    expect(step.value.execution.values.saude).toBeCloseTo(expected);
    expect(
      step.value.explanations.find((item) => item.targetId === "saude")!
        .contributions[0],
    ).toMatchObject({
      mechanism: "saturacao",
      inputValue: 4,
      divisorId: "pib",
      divisorValue: 1000,
    });
  });

  it("recusa divisor que pode ser zero e divisor inexistente", () => {
    const zero = resolvePackage(
      "cenario.json",
      pkg(
        {
          mecanismo: "afim",
          parametros: { coeficiente: 1, termoConstante: 0 },
          normalizacao: { divisor: "pib" },
        },
        0,
      ),
    );
    if (!zero.ok) throw new Error(zero.diagnostics[0].message);
    expect(validatePackageCoherence(zero.value)).toMatchObject({
      ok: false,
      diagnostics: [expect.objectContaining({ field: "normalizacao.divisor" })],
    });
    expect(
      resolvePackage(
        "cenario.json",
        pkg({
          mecanismo: "afim",
          parametros: { coeficiente: 1, termoConstante: 0 },
          normalizacao: { divisor: "nao-existe" },
        }),
      ),
    ).toMatchObject({
      ok: false,
      diagnostics: [expect.objectContaining({ code: "REFERENCIA_QUEBRADA" })],
    });
  });
});
