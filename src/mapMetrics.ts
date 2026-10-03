import type { ResolvedPackage, ScenarioGraph } from "./engine";

export type MapFilter = "influence" | "financial";
export type FinancialRole = "income" | "expense" | "balance";
export type NodeMetric = {
  value: number | null;
  income?: number;
  expense?: number;
};
export const MAP_PIXELS_PER_UNIT = 16;
export const MIN_NODE_DIAMETER = 44;
export const MAX_NODE_DIAMETER = 112;

/** Área, e não diâmetro, cresce linearmente com a métrica. */
export function metricDiameter(value: number | null, maximum: number): number {
  const ratio =
    value === null || !Number.isFinite(value) || maximum <= 0
      ? 0
      : Math.max(0, Math.min(1, value / maximum));
  return Math.sqrt(
    MIN_NODE_DIAMETER ** 2 +
      ratio * (MAX_NODE_DIAMETER ** 2 - MIN_NODE_DIAMETER ** 2),
  );
}

/** Força direta no nível atual; sem recursão nem mistura de unidades monetárias. */
export function measureInfluence(
  graph: ScenarioGraph,
  values: Readonly<Record<string, number>>,
): Map<string, number> {
  const result = new Map<string, number>();
  for (const relation of graph.relations) {
    if (
      relation.sourceType === "evento" ||
      relation.sourceType === "situacao" ||
      relation.sourceType === "dilema"
    )
      continue;
    const target = graph.nodesById[relation.targetId];
    const range =
      (target?.dominio.maximo ?? NaN) - (target?.dominio.minimo ?? 0);
    if (!Number.isFinite(range) || range <= 0) continue;
    const effect =
      Math.abs(
        relation.parameters.coeficiente * (values[relation.originId] ?? 0) +
          relation.parameters.termoConstante,
      ) / range;
    for (const id of [relation.originId, relation.targetId])
      result.set(id, (result.get(id) ?? 0) + effect);
  }
  return result;
}

/** Receitas e despesas brutas não se anulam; saldo duplicado é ignorado. */
export function measureFinances(
  content: ResolvedPackage,
  graph: ScenarioGraph,
  values: Readonly<Record<string, number>>,
  targets: Readonly<Record<string, FinancialRole>> = {},
): Map<string, NodeMetric> {
  const result = new Map<string, NodeMetric>();
  for (const policy of content.policies) {
    const id = policy.controle.variavel;
    let income = 0,
      expense = 0,
      known = false;
    for (const relation of graph.relations.filter(
      (item) => item.sourceId === policy.id,
    )) {
      const role = targets[relation.targetId];
      if (role !== "income" && role !== "expense") continue;
      if (relation.unit !== "moeda_milhoes_2024_ano") continue;
      known = true;
      const amount = Math.abs(
        relation.parameters.coeficiente * (values[relation.originId] ?? 0) +
          relation.parameters.termoConstante,
      );
      if (role === "income") income += amount;
      else expense += amount;
    }
    if (
      !known &&
      policy.controle.unidade === "moeda_milhoes_2024_ano" &&
      policy.controle.modo === "orcamento"
    ) {
      known = true;
      if (policy.tipo === "imposto") income = Math.abs(values[id] ?? 0);
      else expense = Math.abs(values[id] ?? 0);
    }
    result.set(id, { value: known ? income + expense : null, income, expense });
  }
  for (const variable of content.variables.variaveis) {
    if (variable.tipo === "controle") continue;
    const role = targets[variable.id];
    result.set(variable.id, {
      value: role ? Math.abs(values[variable.id] ?? 0) : null,
    });
  }
  return result;
}

/** Agregados são comparados com agregados, para não apagar as políticas. */
export function sizeMap(
  content: ResolvedPackage,
  metrics: ReadonlyMap<string, NodeMetric>,
): Map<string, number> {
  const controls = new Set(
    content.policies.map((policy) => policy.controle.variavel),
  );
  const maxima = [0, 0];
  for (const [id, metric] of metrics) {
    const group = controls.has(id) ? 0 : 1;
    maxima[group] = Math.max(maxima[group], metric.value ?? 0);
  }
  return new Map(
    [...metrics].map(([id, metric]) => [
      id,
      metricDiameter(metric.value, maxima[controls.has(id) ? 0 : 1]),
    ]),
  );
}
