import { expect, it } from "vitest";
import {
  advanceExecution,
  buildGraph,
  createExecution,
  type ConsequenceFile,
  type ResolvedPackage,
} from "../engine";
import { prepareMonthlyContent } from "../game/prepareMonthlyContent";
import { createD4ReferenceSandbox } from "../scenarios/d4ReferenceSandbox";

function fixture(
  duration: ConsequenceFile["duracao"],
  income = 120,
  expense = -90,
): ResolvedPackage {
  const base = createD4ReferenceSandbox().content;
  const consequences: ConsequenceFile[] = [income, expense].map(
    (value, index) => ({
      id: `flow-${index}`,
      tipo: "consequencia",
      versaoEsquema: 1,
      origem: "control",
      alvo: "cash",
      mecanismo: "afim",
      parametros: { coeficiente: 0, termoConstante: value },
      unidade: "moeda_por_passo",
      atrasoPassos: 0,
      duracao: duration,
    }),
  );
  return {
    ...base,
    initialState: { ...base.initialState, valores: { control: 1, cash: 100 } },
    variables: {
      ...base.variables,
      variaveis: [
        {
          id: "control",
          tipo: "controle",
          nome: "Controle",
          unidade: "quantidade",
          dominio: {},
          valorInicial: 1,
        },
        {
          id: "cash",
          tipo: "estoque",
          nome: "Caixa",
          unidade: "moeda",
          dominio: {},
          valorInicial: 100,
        },
      ],
    },
    policies: [
      {
        ...base.policies[0],
        id: "policy",
        controle: {
          variavel: "control",
          modo: "intensidade",
          unidade: "quantidade",
        },
        consequencias: consequences.map((effect) => effect.id),
      },
    ],
    consequences,
    events: [],
    situations: [],
    dilemmas: [],
  };
}

function run(content: ResolvedPackage, steps: number) {
  const graph = buildGraph(content);
  let execution = createExecution(content, graph);
  const balances: number[] = [];
  for (let step = 0; step < steps; step += 1) {
    const result = advanceExecution(content, graph, execution, {
      controlCommands: [],
      activeRelationIds: graph.relations.map((relation) => relation.id),
    });
    if (!result.ok) throw new Error(JSON.stringify(result.diagnostics));
    execution = result.value.execution;
    balances.push(execution.values.cash);
  }
  return { execution, balances };
}

function monthly(content: ResolvedPackage) {
  const result = prepareMonthlyContent(content);
  if (!result.ok) throw new Error(JSON.stringify(result.diagnostics));
  return result.value.content;
}

it("converts flow bases, limits, conditions and downstream coefficients together", () => {
  const original = fixture({ modo: "continuo" }, 0, 0);
  original.variables.variaveis.push({
    id: "flow",
    tipo: "calculado",
    nome: "Fluxo",
    unidade: "moeda_por_passo",
    dominio: { minimo: 0, maximo: 300 },
    valorInicial: 90,
  });
  original.initialState.valores.flow = 90;
  original.consequences = original.consequences.map((effect) => ({
    ...effect,
    origem: "flow",
    parametros: { coeficiente: 1, termoConstante: 0 },
  }));
  original.events = [
    {
      id: "threshold",
      tipo: "evento",
      versaoEsquema: 1,
      nome: "Limiar",
      consequencias: [],
      entraQuando: {
        tipo: "comparacao",
        variavel: "flow",
        operador: "maior_que",
        valor: 60,
      },
    },
  ];
  const converted = monthly(original);
  expect(converted.initialState.valores.flow).toBe(30);
  expect(
    converted.variables.variaveis.find((v) => v.id === "flow"),
  ).toMatchObject({ valorInicial: 30, dominio: { minimo: 0, maximo: 100 } });
  expect(converted.events[0].entraQuando?.valor).toBe(20);
  expect(run(converted, 3).execution.values.cash).toBe(
    run(original, 1).execution.values.cash,
  );
});

it("integrates changing controls using each month's rate instead of the final level three times", () => {
  const converted = monthly(fixture({ modo: "continuo" }, 0, 0));
  converted.consequences = converted.consequences.map((effect, index) => ({
    ...effect,
    parametros: { coeficiente: index === 0 ? 1 : 0, termoConstante: 0 },
  }));
  const graph = buildGraph(converted);
  let execution = createExecution(converted, graph);
  for (const value of [10, 20, 30]) {
    const next = advanceExecution(converted, graph, execution, {
      controlCommands: [{ controlId: "control", policyId: "policy", value }],
      activeRelationIds: graph.relations.map((r) => r.id),
    });
    if (!next.ok) throw new Error(JSON.stringify(next.diagnostics));
    execution = next.value.execution;
  }
  expect(execution.values.cash).toBe(160);
});

it("propagates calculated nodes from the previous monthly snapshot, independently of variable order", () => {
  const content = monthly(fixture({ modo: "continuo" }, 0, 0));
  content.variables.variaveis.push({
    id: "middle",
    tipo: "calculado",
    nome: "Intermediário",
    unidade: "moeda_por_passo",
    dominio: {},
    valorInicial: 0,
  });
  content.initialState.valores.middle = 0;
  content.consequences = content.consequences.map((effect, index) => ({
    ...effect,
    origem: index === 0 ? "control" : "middle",
    alvo: index === 0 ? "middle" : "cash",
    parametros: { coeficiente: index === 0 ? 30 : 1, termoConstante: 0 },
  }));
  expect(run(content, 3).balances).toEqual([100, 130, 160]);
  content.variables.variaveis.reverse();
  expect(run(content, 3).balances).toEqual([100, 130, 160]);
});

it.each([
  [120, -90],
  [90, -120],
  [90, -90],
])(
  "preserves accumulated recurring income %s and expense %s across 60 quarters",
  (income, expense) => {
    const original = fixture({ modo: "continuo" }, income, expense);
    const quarterly = run(original, 60);
    const converted = run(monthly(original), 180);
    for (let quarter = 0; quarter < 60; quarter += 1) {
      expect(converted.balances[quarter * 3 + 2]).toBeCloseTo(
        quarterly.balances[quarter],
        8,
      );
    }
    expect(converted.execution.values.cash).toBeCloseTo(
      100 + 60 * (income + expense),
      8,
    );
  },
);

it("applies a one-shot amount once, without dividing or tripling it", () => {
  const original = fixture({ modo: "unico" });
  const converted = run(monthly(original), 9);
  expect(converted.balances).toEqual(Array(9).fill(130));
  expect(converted.execution.values.cash).toBe(
    run(original, 3).execution.values.cash,
  );
  expect(converted.execution.relationMemory.firedRelationIds).toHaveLength(2);
});

it("accumulates a three-quarter fixed effect over nine months, then stops", () => {
  const original = fixture({ modo: "fixo", passos: 3 });
  const converted = run(monthly(original), 12);
  expect(converted.balances).toEqual([
    110, 120, 130, 140, 150, 160, 170, 180, 190, 190, 190, 190,
  ]);
  expect(converted.execution.values.cash).toBe(
    run(original, 4).execution.values.cash,
  );
});

it("preserves the opening stock and does not convert an already monthly package twice", () => {
  const original = fixture({ modo: "continuo" });
  const converted = monthly(original);
  expect(converted.initialState.valores.cash).toBe(100);
  expect(run(monthly(converted), 3)).toEqual(run(converted, 3));
  expect(original.consequences[0].parametros.termoConstante).toBe(120);
});
