import { expect, it } from "vitest";
import { createD4ReferenceSandbox } from "../scenarios/d4ReferenceSandbox";
import {
  measureFinances,
  measureInfluence,
  metricDiameter,
  sizeMap,
  MAP_PIXELS_PER_UNIT,
} from "../mapMetrics";
import { buildInfluenceLayout } from "../influenceLayout";

it("cresce pela área, preserva zero e limita extremos", () => {
  expect(metricDiameter(null, 100)).toBe(44);
  expect(metricDiameter(0, 0)).toBe(44);
  expect(metricDiameter(100, 100)).toBe(112);
  expect(metricDiameter(1000, 100)).toBe(112);
  expect(metricDiameter(50, 100) ** 2).toBeCloseTo((44 ** 2 + 112 ** 2) / 2);
});
it("compara receitas e despesas sem contar saldo novamente ou zerar ausências", () => {
  const { content, graph, visualMap } = createD4ReferenceSandbox();
  const metrics = measureFinances(
    content,
    graph,
    content.initialState.valores,
    visualMap.financialTargets,
  );
  expect(metrics.get("verba_001")).toEqual({ value: 8, income: 0, expense: 8 });
  expect(metrics.get("verba_046")).toEqual({ value: 8, income: 8, expense: 0 });
  expect(metrics.get("saude_populacao")?.value).toBeNull();
  const sizes = sizeMap(content, metrics);
  expect(sizes.get("verba_005")).toBeGreaterThan(sizes.get("verba_001")!);
  expect(sizes.get("verba_001")).toBe(sizes.get("verba_046"));
});
it("preserva valores iguais e considera a força, não só o número de relações", () => {
  const { content, graph } = createD4ReferenceSandbox();
  const influence = measureInfluence(graph, content.initialState.valores);
  expect(influence.get("verba_005")).toBeGreaterThan(
    influence.get("verba_001")!,
  );
  expect(influence.get("verba_001")).toBe(influence.get("verba_006"));
});
it("reserva o tamanho real dos dois filtros sem colisões entre bolinhas", () => {
  const { content, graph, visualMap } = createD4ReferenceSandbox();
  const finances = sizeMap(
    content,
    measureFinances(
      content,
      graph,
      content.initialState.valores,
      visualMap.financialTargets,
    ),
  );
  const influence = measureInfluence(graph, content.initialState.valores);
  const sizes = sizeMap(
    content,
    new Map([...influence].map(([id, value]) => [id, { value }])),
  );
  const radii = new Map(
    content.variables.variaveis.map((v) => [
      v.id,
      Math.max(finances.get(v.id) ?? 44, sizes.get(v.id) ?? 44) /
        (2 * MAP_PIXELS_PER_UNIT),
    ]),
  );
  const layout = buildInfluenceLayout(content, influence, visualMap, radii);
  const nodes = [...layout.positions];
  for (let i = 0; i < nodes.length; i++)
    for (let j = i + 1; j < nodes.length; j++) {
      const [aId, a] = nodes[i],
        [bId, b] = nodes[j];
      expect(
        Math.hypot(a.x - b.x, a.y - b.y),
        `${aId} / ${bId}`,
      ).toBeGreaterThanOrEqual(
        (radii.get(aId) ?? 1.375) + (radii.get(bId) ?? 1.375),
      );
    }
});
