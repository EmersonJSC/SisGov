import type { ScenarioGraph } from "../graph/buildGraph";
import { efficacyNodeId, isContextNode } from "../model/lawNodes";
import type { ResolvedPackage } from "../model/resolvePackage";

/**
 * Regras da rede sem números soltos (V1-07, desenho/rede.md §9). Influenciar
 * é ser origem, fator ou divisor de uma relação; receber é ser destino de
 * uma relação que não vem do contexto.
 */
export type NetworkRules = Readonly<{
  /**
   * Índices e situações que não influenciam nada. Só informação: um índice
   * pode ser só resultado (decisão do autor, 12/out).
   */
  withoutOutput: readonly string[];
  /** Índices e situações que nada influencia (fora o contexto). */
  withoutInput: readonly string[];
  /** Leis cujo efeito nenhum índice muda (nem na eficácia, nem como fator). */
  unmodulatedLaws: readonly string[];
  /** Calculados e estoques sem `medida`. */
  withoutMeasure: readonly string[];
}>;

const indexTypes = new Set(["calculado", "estoque", "situacao"]);

export function checkNetworkRules(
  content: ResolvedPackage,
  graph: ScenarioGraph,
): NetworkRules {
  const nodes = Object.values(graph.nodesById);
  // Nós de lei (eficácia, apoio) e de contexto têm id com ":"; não são índices.
  const indices = nodes.filter(
    (node) => indexTypes.has(node.tipo) && !node.id.includes(":"),
  );
  const isIndex = new Set(indices.map((node) => node.id));
  const influencing = new Set<string>();
  const influenced = new Set<string>();
  for (const relation of graph.relations) {
    influencing.add(relation.originId);
    if (relation.normalization?.fator)
      influencing.add(relation.normalization.fator);
    if (relation.normalization?.divisor)
      influencing.add(relation.normalization.divisor);
    if (!isContextNode(relation.originId)) influenced.add(relation.targetId);
  }
  // Aprovação pelos perfis (V1-08): o alvo é influenciado pelos segmentos.
  const approval = graph.profileApproval;
  if (approval) {
    influenced.add(approval.targetId);
    for (const id of approval.inputs) influencing.add(id);
  }
  const modulated = (lawId: string) =>
    influenced.has(efficacyNodeId(lawId)) ||
    graph.relations.some(
      (relation) =>
        relation.sourceId === lawId &&
        [relation.normalization?.fator, relation.normalization?.divisor].some(
          (id) => id !== undefined && isIndex.has(id),
        ),
    );
  const sorted = (ids: string[]) =>
    ids.sort((left, right) => left.localeCompare(right));
  return {
    withoutOutput: sorted(
      indices.filter((node) => !influencing.has(node.id)).map((n) => n.id),
    ),
    withoutInput: sorted(
      indices.filter((node) => !influenced.has(node.id)).map((n) => n.id),
    ),
    unmodulatedLaws: sorted(
      content.policies.filter((law) => !modulated(law.id)).map((l) => l.id),
    ),
    withoutMeasure: sorted(
      indices
        .filter((node) => node.tipo !== "situacao" && !node.medida)
        .map((node) => node.id),
    ),
  };
}
