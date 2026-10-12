import { describe, expect, it } from "vitest";
import type {
  GraphRelation,
  ResolvedPackage,
  ScenarioGraph,
  VariableDefinition,
} from "../engine";
import { computeNetwork } from "../engine/runtime/computeNetwork";

// Dois estoques da mesma unidade que transbordam um no outro (V1-07): o cofre
// (bem, teto 10) e a dívida. Cada um recebe a taxa de um controle do teste.
const cofre: VariableDefinition = {
  id: "cofre",
  tipo: "estoque",
  nome: "Cofre",
  unidade: "percentual_pib",
  dominio: { minimo: 0 },
  transbordo: { estoque: "divida", sentido: "oposto", teto: 10 },
};
const divida: VariableDefinition = {
  id: "divida",
  tipo: "estoque",
  nome: "Dívida",
  unidade: "percentual_pib",
  dominio: { minimo: 0 },
  transbordo: { estoque: "cofre", sentido: "oposto" },
};
const controle = (id: string): VariableDefinition => ({
  id,
  tipo: "controle",
  nome: id,
  unidade: "percentual_pib_por_passo",
  dominio: {},
});
const fluxo = (origem: string, alvo: string): GraphRelation => ({
  id: `rede:${origem}`,
  sourceId: origem,
  sourceType: "rede",
  sourcePath: "teste",
  consequenceId: origem,
  consequencePath: "teste",
  originId: origem,
  targetId: alvo,
  mechanism: "afim",
  parameters: { coeficiente: 1, termoConstante: 0 },
  unit: "percentual_pib_por_passo",
  delaySteps: 0,
  duration: { modo: "continuo" },
});
const relacoes = [fluxo("para_cofre", "cofre"), fluxo("para_divida", "divida")];
const variaveis = [
  cofre,
  divida,
  controle("para_cofre"),
  controle("para_divida"),
];
const graph: ScenarioGraph = {
  nodesById: Object.fromEntries(variaveis.map((v) => [v.id, v])),
  relationsById: Object.fromEntries(relacoes.map((r) => [r.id, r])),
  relations: relacoes,
};
const content = {
  manifest: {},
  policies: [],
  variables: { variaveis },
} as unknown as ResolvedPackage;

function mes(
  antes: { cofre: number; divida: number },
  taxas: { cofre: number; divida: number },
) {
  const previous = {
    ...antes,
    para_cofre: taxas.cofre,
    para_divida: taxas.divida,
  };
  const r = computeNetwork({
    content,
    graph,
    previous,
    controls: {},
    activeRelations: relacoes,
    readDelayed: () => previous,
    duration: 1,
  });
  if (!r.ok) throw new Error(r.diagnostics[0].message);
  return { cofre: r.value.values.cofre, divida: r.value.values.divida };
}

describe("transbordo entre estoques (V1-07)", () => {
  it("cofre que fica negativo vira dívida", () => {
    expect(mes({ cofre: 2, divida: 50 }, { cofre: -5, divida: 0 })).toEqual({
      cofre: 0,
      divida: 53,
    });
  });

  it("dívida paga além do zero vira cofre", () => {
    expect(mes({ cofre: 0, divida: 1 }, { cofre: 0, divida: -4 })).toEqual({
      cofre: 3,
      divida: 0,
    });
  });

  it("com dívida, o cofre acima do teto abate a dívida", () => {
    expect(mes({ cofre: 9, divida: 5 }, { cofre: 3, divida: 0 })).toEqual({
      cofre: 10,
      divida: 3,
    });
  });

  it("sem dívida, o cofre passa do teto: o dinheiro não some", () => {
    expect(mes({ cofre: 9, divida: 0 }, { cofre: 3, divida: 0 })).toEqual({
      cofre: 12,
      divida: 0,
    });
  });
});
