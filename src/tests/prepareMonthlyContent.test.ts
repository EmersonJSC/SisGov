import { expect, it } from "vitest";
import { createExecution, validateContentFile } from "../engine";
import { prepareMonthlyContent } from "../game/prepareMonthlyContent";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

function scenario() {
  const loaded = loadDistributedScenario(
    "brasil-primeiro-cenario/cenario.json",
  );
  if (!loaded.ok) throw new Error("Cenário inválido");
  return loaded.value.definition;
}

it("converts quarterly delays and fixed durations before building the graph", () => {
  const original = scenario();
  const before = structuredClone(original);
  const prepared = prepareMonthlyContent(original);
  expect(prepared.ok).toBe(true);
  if (!prepared.ok) return;
  const { content, graph } = prepared.value;
  expect(content.manifest.unidadeTemporal).toBe("mes");
  const monthlyRate = content.policies[0].respostaTemporal!.implantacao;
  expect(1 - (1 - monthlyRate) ** 3).toBeCloseTo(
    original.policies[0].respostaTemporal!.implantacao,
  );
  expect(
    content.consequences.find((effect) => effect.id === "evento-eleva-pressao")
      ?.duracao,
  ).toEqual({ modo: "fixo", passos: 9 });
  for (const relation of graph.relations) {
    const source = original.consequences.find(
      (effect) => effect.id === relation.consequenceId,
    )!;
    expect(relation.delaySteps).toBe(source.atrasoPassos * 3);
  }
  expect(createExecution(content, graph).historyLimit).toBe(9);
  expect(original).toEqual(before);
  const again = prepareMonthlyContent(content);
  expect(again).toEqual(prepared);
});

it("converts recurring rates but preserves levels and one-shot totals", () => {
  const original = scenario();
  const base = original.consequences[0];
  original.consequences = [
    {
      ...base,
      id: "rate",
      unidade: "moeda_por_passo",
      duracao: { modo: "continuo" },
      parametros: { coeficiente: 6, termoConstante: 9 },
    },
    {
      ...base,
      id: "once",
      unidade: "moeda_por_passo",
      duracao: { modo: "unico" },
      parametros: { coeficiente: 6, termoConstante: 9 },
    },
    ...original.consequences,
  ];
  const result = prepareMonthlyContent(original);
  expect(result.ok).toBe(true);
  if (!result.ok) return;
  expect(result.value.content.consequences[0].parametros).toEqual({
    coeficiente: 2,
    termoConstante: 3,
  });
  expect(result.value.content.consequences[1].parametros).toEqual({
    coeficiente: 6,
    termoConstante: 9,
  });
  expect(result.value.content.consequences[2].parametros).toEqual(
    base.parametros,
  );
});

it("rejects undefined units for monthly preparation and invalid units in JSON", () => {
  const original = scenario();
  delete original.manifest.unidadeTemporal;
  expect(prepareMonthlyContent(original).ok).toBe(false);
  expect(
    validateContentFile(
      "cenario.json",
      JSON.stringify({ ...original.manifest, unidadeTemporal: "dia" }),
    ).ok,
  ).toBe(false);
});
