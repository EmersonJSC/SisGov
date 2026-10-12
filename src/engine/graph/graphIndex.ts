import type { GraphRelation, ScenarioGraph } from "./buildGraph";

/**
 * Índices do grafo calculados uma vez por grafo (V1-07, desempenho): o grafo
 * não muda durante a partida, então a busca por origem, a ordem das relações
 * e a posição de cada nó não precisam ser refeitas a cada mês.
 */
export type GraphIndex = Readonly<{
  /** Relações de cada lei ou ocorrência (`sourceId`), na ordem do grafo. */
  bySource: ReadonlyMap<string, readonly GraphRelation[]>;
  /** Todas as relações em ordem de id (`localeCompare`). */
  sortedById: readonly GraphRelation[];
  /** Posição de cada relação em `sortedById`. */
  relationRank: ReadonlyMap<string, number>;
  /** Posição de cada nó na ordem de id (`localeCompare`). */
  nodeRank: ReadonlyMap<string, number>;
}>;

const cache = new WeakMap<ScenarioGraph, GraphIndex>();

export function graphIndex(graph: ScenarioGraph): GraphIndex {
  const cached = cache.get(graph);
  if (cached) return cached;
  const bySource = new Map<string, GraphRelation[]>();
  for (const relation of graph.relations) {
    const list = bySource.get(relation.sourceId);
    if (list) list.push(relation);
    else bySource.set(relation.sourceId, [relation]);
  }
  const sortedById = [...graph.relations].sort((left, right) =>
    left.id.localeCompare(right.id),
  );
  const relationRank = new Map(
    sortedById.map((relation, rank) => [relation.id, rank]),
  );
  const nodeRank = new Map(
    Object.keys(graph.nodesById)
      .sort((left, right) => left.localeCompare(right))
      .map((id, rank) => [id, rank]),
  );
  const index: GraphIndex = { bySource, sortedById, relationRank, nodeRank };
  cache.set(graph, index);
  return index;
}
