import type {
  ConsequenceFile,
  OccurrenceFile,
  PolicyFile,
  VariableDefinition,
} from "../model/contentTypes";
import { contextNodeId, lawInfluenceNodes } from "../model/lawNodes";
import type { ResolvedPackage } from "../model/resolvePackage";
import { profileApprovalInputs } from "../mechanisms/profileApproval";

export type GraphNode = Readonly<VariableDefinition>;

export type GraphRelation = Readonly<{
  id: string;
  sourceId: string;
  /** "rede": ligação entre bolhas, sempre ativa (D-41). */
  sourceType: PolicyFile["tipo"] | OccurrenceFile["tipo"] | "rede";
  sourcePath: string;
  consequenceId: string;
  consequencePath: string;
  originId: string;
  targetId: string;
  mechanism: ConsequenceFile["mecanismo"];
  parameters: ConsequenceFile["parametros"];
  normalization?: ConsequenceFile["normalizacao"];
  /** Lê o nível da lei sem a eficácia (conta de dinheiro, SG157). */
  readsLevel?: boolean;
  /** Resultado × fator ÷ referência (custo que reage, D-52). */
  scale?: ConsequenceFile["escala"];
  unit: string;
  delaySteps: number;
  duration: ConsequenceFile["duracao"];
}>;

export type ScenarioGraph = Readonly<{
  nodesById: Readonly<Record<string, GraphNode>>;
  relationsById: Readonly<Record<string, GraphRelation>>;
  relations: readonly GraphRelation[];
  /** Aprovação pelos perfis (V1-08): o alvo lê estes segmentos no mês. */
  profileApproval?: Readonly<{ targetId: string; inputs: readonly string[] }>;
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
      normalization: consequence.normalizacao,
      ...(consequence.leitura === "nivel" ? { readsLevel: true } : {}),
      ...(consequence.escala ? { scale: consequence.escala } : {}),
      unit: consequence.unidade,
      delaySteps: consequence.atrasoPassos,
      duration: consequence.duracao,
    };
  });
}

/** Converte conteúdo válido em nós e relações com origem auditável. */
export function buildGraph(content: ResolvedPackage): ScenarioGraph {
  const nodesById: Record<string, GraphNode> = {};
  for (const variable of [
    ...content.variables.variaveis,
    ...lawInfluenceNodes(content.policies),
  ])
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
  const listed = new Set(sources.flatMap((source) => source.consequencias));
  // Consequência que sai de uma bolha (índice, situação ou estoque) e não
  // pertence a lei nem a ocorrência é uma ligação da rede: vale sempre.
  const network: GraphRelation[] = content.consequences
    .filter(
      (consequence) =>
        !listed.has(consequence.id) &&
        nodesById[consequence.origem] !== undefined &&
        nodesById[consequence.origem].tipo !== "controle",
    )
    .map((consequence) => ({
      id: `rede:${consequence.id}`,
      sourceId: consequence.origem,
      sourceType: "rede" as const,
      sourcePath: content.pathsById[consequence.id],
      consequenceId: consequence.id,
      consequencePath: content.pathsById[consequence.id],
      originId: consequence.origem,
      targetId: consequence.alvo,
      mechanism: consequence.mecanismo,
      parameters: consequence.parametros,
      normalization: consequence.normalizacao,
      ...(consequence.leitura === "nivel" ? { readsLevel: true } : {}),
      ...(consequence.escala ? { scale: consequence.escala } : {}),
      unit: consequence.unidade,
      delaySteps: consequence.atrasoPassos,
      duration: { modo: "continuo" as const },
    }));
  // Contexto do cenário (D-55): um nó fixo por bolha com valor inicial.
  const scenario = content.initialState.cenario?.nome ?? "país";
  const context: GraphRelation[] = Object.keys(
    content.initialState.indicesIniciais ?? {},
  )
    .filter((id) => nodesById[id] !== undefined)
    .map((id) => {
      const nodeId = contextNodeId(id);
      nodesById[nodeId] = {
        id: nodeId,
        tipo: "controle",
        nome: `Contexto do ${scenario}`,
        unidade: nodesById[id].unidade,
        dominio: {},
      };
      return {
        id: `rede:${nodeId}`,
        sourceId: nodeId,
        sourceType: "rede" as const,
        sourcePath: content.pathsById[content.initialState.id] ?? "",
        consequenceId: nodeId,
        consequencePath: content.pathsById[content.initialState.id] ?? "",
        originId: nodeId,
        targetId: id,
        mechanism: "afim" as const,
        parameters: { coeficiente: 1, termoConstante: 0 },
        unit: nodesById[id].unidade,
        delaySteps: 0,
        duration: { modo: "continuo" as const },
      };
    });
  const relations = [
    ...sources.flatMap((source) =>
      addRelations(source, consequencesById, content.pathsById),
    ),
    ...network,
    ...context,
  ].sort((left, right) => left.id.localeCompare(right.id));
  const relationsById: Record<string, GraphRelation> = {};
  for (const relation of relations) relationsById[relation.id] = relation;

  const approval = content.manifest.aprovacaoPorPerfis;
  return {
    nodesById,
    relationsById,
    relations,
    ...(approval
      ? {
          profileApproval: {
            targetId: approval.alvo,
            inputs: profileApprovalInputs(approval),
          },
        }
      : {}),
  };
}
