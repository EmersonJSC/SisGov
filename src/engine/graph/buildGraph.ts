import type {
  ConsequenceFile,
  OccurrenceFile,
  PolicyFile,
  VariableDefinition,
} from "../model/contentTypes";
import type { ResolvedPackage } from "../model/resolvePackage";

export type GraphNode = Readonly<VariableDefinition>;

export type GraphRelation = Readonly<{
  id: string;
  sourceId: string;
  sourceType: PolicyFile["tipo"] | OccurrenceFile["tipo"];
  sourcePath: string;
  consequenceId: string;
  consequencePath: string;
  originId: string;
  targetId: string;
  mechanism: ConsequenceFile["mecanismo"];
  parameters: ConsequenceFile["parametros"];
  unit: string;
  delaySteps: number;
  duration: ConsequenceFile["duracao"];
}>;

export type ScenarioGraph = Readonly<{
  nodesById: Readonly<Record<string, GraphNode>>;
  relationsById: Readonly<Record<string, GraphRelation>>;
  relations: readonly GraphRelation[];
}>;

function addRelations(
  source: PolicyFile | OccurrenceFile,
  consequencesById: Readonly<Record<string, ConsequenceFile>>,
  pathsById: Readonly<Record<string, string>>,
): GraphRelation[] {
  return source.consequencias.map((consequenceId, useIndex) => {
    const consequence = consequencesById[consequenceId];
    return {
      id: `${source.id}:${useIndex}:${consequence.id}`,
      sourceId: source.id,
      sourceType: source.tipo,
      sourcePath: pathsById[source.id],
      consequenceId: consequence.id,
      consequencePath: pathsById[consequence.id],
      originId: consequence.origem,
      targetId: consequence.alvo,
      mechanism: consequence.mecanismo,
      parameters: consequence.parametros,
      unit: consequence.unidade,
      delaySteps: consequence.atrasoPassos,
      duration: consequence.duracao,
    };
  });
}

/** Converte conteúdo válido em nós e relações com origem auditável. */
export function buildGraph(content: ResolvedPackage): ScenarioGraph {
  const nodesById: Record<string, GraphNode> = {};
  for (const variable of content.variables.variaveis)
    nodesById[variable.id] = variable;

  const consequencesById: Record<string, ConsequenceFile> = {};
  for (const consequence of content.consequences)
    consequencesById[consequence.id] = consequence;
  const sources = [
    ...content.policies,
    ...content.events,
    ...content.situations,
    ...content.dilemmas,
  ].sort((left, right) => left.id.localeCompare(right.id));
  const relations = sources
    .flatMap((source) =>
      addRelations(source, consequencesById, content.pathsById),
    )
    .sort((left, right) => left.id.localeCompare(right.id));
  const relationsById: Record<string, GraphRelation> = {};
  for (const relation of relations) relationsById[relation.id] = relation;

  return { nodesById, relationsById, relations };
}
