import { describe, expect, it } from "vitest";
import type { GraphRelation, ResolvedPackage, ScenarioGraph } from "../engine";
import { computeNetwork } from "../engine/runtime/computeNetwork";

// Rede mínima: um estoque (a pressão) empurra uma situação com entrada 50 e
// saída 30. O estoque não acumula: cada mês recebe a pressão do teste.
const crise = {
  id: "crise",
  tipo: "situacao" as const,
  nome: "Crise",
  unidade: "indice_0_100",
  dominio: { minimo: 0, maximo: 100 },
  entrada: 50,
  saida: 30,
};
const pressao = {
  id: "pressao",
  tipo: "estoque" as const,
  nome: "Pressão",
  unidade: "indice_0_100",
  dominio: { minimo: 0, maximo: 100 },
};
const relacao: GraphRelation = {
  id: "rede:pressao--crise",
  sourceId: "pressao",
  sourceType: "rede",
  sourcePath: "teste",
  consequenceId: "pressao--crise",
  consequencePath: "teste",
  originId: "pressao",
  targetId: "crise",
  mechanism: "afim",
  parameters: { coeficiente: 1, termoConstante: 0 },
  unit: "indice_0_100",
  delaySteps: 0,
  duration: { modo: "continuo" },
};
const graph: ScenarioGraph = {
  nodesById: { crise, pressao },
  relationsById: { [relacao.id]: relacao },
  relations: [relacao],
};
const content = {
  manifest: { respostaDasBolhas: 1 },
  policies: [],
  variables: { variaveis: [crise, pressao] },
} as unknown as ResolvedPackage;

function mes(anterior: number, pressaoAgora: number): number {
  const previous = { crise: anterior, pressao: pressaoAgora };
  const r = computeNetwork({
    content,
    graph,
    previous,
    controls: {},
    activeRelations: [relacao],
    readDelayed: () => previous,
    duration: 1,
    accumulateStocks: false,
  });
  if (!r.ok) throw new Error(r.diagnostics[0].message);
  return r.value.values.crise;
}

describe("situação com entrada e saída (V1-07)", () => {
  it("surge na entrada e só acaba na saída", () => {
    let crise = 0;
    const passos: [number, number][] = [
      [40, 0], // abaixo da entrada: não surge
      [55, 25], // passou da entrada: surge, valor = soma − saída
      [40, 10], // entre saída e entrada: continua
      [30, 0], // chegou à saída: acaba
      [45, 0], // entre os dois de novo: continua sem existir
      [50, 20], // na entrada: surge
    ];
    for (const [soma, esperado] of passos) {
      crise = mes(crise, soma);
      expect(crise, `soma ${soma}`).toBe(esperado);
    }
  });

  it("acabar leva o valor a zero mesmo com resposta lenta", () => {
    const lenta = {
      ...content,
      manifest: { respostaDasBolhas: 0.5 },
    } as unknown as ResolvedPackage;
    const previous = { crise: 20, pressao: 10 };
    const r = computeNetwork({
      content: lenta,
      graph,
      previous,
      controls: {},
      activeRelations: [relacao],
      readDelayed: () => previous,
      duration: 1,
      accumulateStocks: false,
    });
    expect(r.ok && r.value.values.crise).toBe(0);
  });
});

describe("situação em níveis (V1-09)", () => {
  // Três passagens: sobe em 40, 60 e 80; desce em 30, 50 e 70.
  const nivel = {
    id: "crise",
    tipo: "situacao" as const,
    nome: "Nível",
    unidade: "nivel",
    dominio: { minimo: 0, maximo: 3 },
    niveis: [
      { entrada: 40, saida: 30 },
      { entrada: 60, saida: 50 },
      { entrada: 80, saida: 70 },
    ],
  };
  const emNiveis = {
    ...content,
    variables: { variaveis: [nivel, pressao] },
  } as unknown as ResolvedPackage;
  const grafo: ScenarioGraph = {
    ...graph,
    nodesById: { crise: nivel, pressao },
  };
  const passo = (anterior: number, soma: number) => {
    const previous = { crise: anterior, pressao: soma };
    const r = computeNetwork({
      content: emNiveis,
      graph: grafo,
      previous,
      controls: {},
      activeRelations: [relacao],
      readDelayed: () => previous,
      duration: 1,
      accumulateStocks: false,
    });
    if (!r.ok) throw new Error(r.diagnostics[0].message);
    return r.value.values.crise;
  };

  it("sobe e desce um degrau por passo, com histerese em cada passagem", () => {
    let n = 0;
    const passos: [number, number][] = [
      [35, 0], // abaixo da primeira entrada
      [90, 1], // muito acima: sobe só um degrau
      [90, 2],
      [90, 3],
      [95, 3], // no teto
      [75, 3], // entre saída e entrada da última passagem: fica
      [70, 2], // na saída: desce
      [55, 2], // entre 50 e 60: fica
      [10, 1], // muito abaixo: desce só um degrau
      [10, 0],
      [10, 0],
    ];
    for (const [soma, esperado] of passos) {
      n = passo(n, soma);
      expect(n, `soma ${soma}`).toBe(esperado);
    }
  });
});
