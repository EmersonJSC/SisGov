import type { ScenarioGraph } from "../graph/buildGraph";
import type { ResolvedPackage } from "../model/resolvePackage";

export type PackageWarningCode =
  | "CICLO"
  | "COMPONENTE_DESCONECTADO"
  | "CONTEUDO_NAO_UTILIZADO"
  | "ARQUIVO_ORFAO";

export type PackageWarning = Readonly<{
  code: PackageWarningCode;
  message: string;
  ids?: readonly string[];
  file?: string;
}>;

export type PackageAnalysis = Readonly<{
  cycles: readonly (readonly string[])[];
  disconnectedComponents: readonly (readonly string[])[];
  unusedContentIds: readonly string[];
  orphanFiles: readonly string[];
  warnings: readonly PackageWarning[];
}>;

function sorted(values: Iterable<string>): string[] {
  return [...values].sort((left, right) => left.localeCompare(right));
}

function findCycles(graph: ScenarioGraph): string[][] {
  const adjacency = new Map<string, string[]>();
  for (const id of Object.keys(graph.nodesById)) adjacency.set(id, []);
  for (const relation of graph.relations) {
    adjacency.get(relation.originId)?.push(relation.targetId);
  }
  let index = 0;
  const indexes = new Map<string, number>();
  const lowLinks = new Map<string, number>();
  const stack: string[] = [];
  const onStack = new Set<string>();
  const cycles: string[][] = [];
  const visit = (node: string): void => {
    indexes.set(node, index);
    lowLinks.set(node, index);
    index += 1;
    stack.push(node);
    onStack.add(node);
    for (const next of adjacency.get(node) ?? []) {
      if (!indexes.has(next)) {
        visit(next);
        lowLinks.set(node, Math.min(lowLinks.get(node)!, lowLinks.get(next)!));
      } else if (onStack.has(next)) {
        lowLinks.set(node, Math.min(lowLinks.get(node)!, indexes.get(next)!));
      }
    }
    if (lowLinks.get(node) !== indexes.get(node)) return;
    const component: string[] = [];
    let next: string;
    do {
      next = stack.pop()!;
      onStack.delete(next);
      component.push(next);
    } while (next !== node);
    const selfRelation =
      component.length === 1 && (adjacency.get(node) ?? []).includes(node);
    if (component.length > 1 || selfRelation) cycles.push(sorted(component));
  };
  for (const id of sorted(adjacency.keys())) if (!indexes.has(id)) visit(id);
  return cycles.sort((left, right) =>
    left.join("|").localeCompare(right.join("|")),
  );
}

function findDisconnectedComponents(graph: ScenarioGraph): string[][] {
  const adjacency = new Map<string, Set<string>>();
  for (const id of Object.keys(graph.nodesById)) adjacency.set(id, new Set());
  for (const relation of graph.relations) {
    adjacency.get(relation.originId)?.add(relation.targetId);
    adjacency.get(relation.targetId)?.add(relation.originId);
  }
  const components: string[][] = [];
  const visited = new Set<string>();
  for (const start of sorted(adjacency.keys())) {
    if (visited.has(start)) continue;
    const component: string[] = [];
    const pending = [start];
    visited.add(start);
    while (pending.length > 0) {
      const node = pending.pop()!;
      component.push(node);
      for (const next of adjacency.get(node) ?? []) {
        if (!visited.has(next)) {
          visited.add(next);
          pending.push(next);
        }
      }
    }
    components.push(sorted(component));
  }
  return components.length > 1 ? components : [];
}

export function analyzePackage(
  content: ResolvedPackage,
  graph: ScenarioGraph,
  distributedFiles: readonly string[] = [],
): PackageAnalysis {
  const cycles = findCycles(graph);
  const disconnectedComponents = findDisconnectedComponents(graph);
  const usedConsequences = new Set(
    graph.relations.map((relation) => relation.consequenceId),
  );
  const unusedContentIds = sorted([
    ...content.consequences
      .filter((item) => !usedConsequences.has(item.id))
      .map((item) => item.id),
    ...[
      ...content.policies,
      ...content.events,
      ...content.situations,
      ...content.dilemmas,
    ]
      .filter((item) => item.consequencias.length === 0)
      .map((item) => item.id),
  ]);
  const includedFiles = new Set(Object.values(content.pathsById));
  const orphanFiles = sorted(
    distributedFiles.filter((file) => !includedFiles.has(file)),
  );
  const warnings: PackageWarning[] = [
    ...cycles.map((ids) => ({
      code: "CICLO" as const,
      ids,
      message: `Ciclo entre: ${ids.join(", ")}.`,
    })),
    ...disconnectedComponents.map((ids) => ({
      code: "COMPONENTE_DESCONECTADO" as const,
      ids,
      message: `Componente desconectado: ${ids.join(", ")}.`,
    })),
    ...unusedContentIds.map((id) => ({
      code: "CONTEUDO_NAO_UTILIZADO" as const,
      ids: [id],
      message: `Conteúdo sem uso numérico: ${id}.`,
    })),
    ...orphanFiles.map((file) => ({
      code: "ARQUIVO_ORFAO" as const,
      file,
      message: `Arquivo distribuído sem uso no manifesto: ${file}.`,
    })),
  ];
  return {
    cycles,
    disconnectedComponents,
    unusedContentIds,
    orphanFiles,
    warnings,
  };
}
