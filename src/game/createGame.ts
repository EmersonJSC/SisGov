import {
  createExecution,
  createPackageContentIdentity,
  type ContentDiagnostic,
  type EngineExecution,
  type ScenarioGraph,
} from "../engine";
import type { ResolvedPackage } from "../engine";
import {
  createInheritedPolicyState,
  type PolicyLevelRules,
  type PolicyState,
  type Proposal,
} from "../domain/game";

export type GameState = Readonly<{
  id: string;
  scenario: Readonly<{
    id: string;
    schemaVersion: number;
    contentIdentity: string;
  }>;
  currentTurn: number;
  proposals: readonly Proposal[];
  policies: readonly PolicyState[];
  execution: EngineExecution;
}>;
export type CreateGameResult =
  | { ok: true; value: GameState }
  | { ok: false; diagnostics: readonly ContentDiagnostic[] };

function failure(
  content: ResolvedPackage,
  field: string,
  message: string,
): CreateGameResult {
  return {
    ok: false,
    diagnostics: [
      {
        code: "COERENCIA_INVALIDA",
        file: content.pathsById[content.initialState.id],
        field,
        message,
      },
    ],
  };
}

export function createGame(
  id: string,
  content: ResolvedPackage,
  graph: ScenarioGraph,
): CreateGameResult {
  if (!id.trim()) return failure(content, "id", "A partida precisa de ID.");
  const policyById = new Map(
    content.policies.map((policy) => [policy.id, policy]),
  );
  const variableById = new Map(
    content.variables.variaveis.map((variable) => [variable.id, variable]),
  );
  const seen = new Set<string>();
  const policies: PolicyState[] = [];
  for (const [index, initial] of (
    content.initialState.politicasVigentes ?? []
  ).entries()) {
    const field = `politicasVigentes.${index}`;
    if (seen.has(initial.politica))
      return failure(
        content,
        field,
        `Política vigente duplicada: ${initial.politica}.`,
      );
    seen.add(initial.politica);
    const policy = policyById.get(initial.politica);
    if (!policy)
      return failure(
        content,
        field,
        `Política inexistente: ${initial.politica}.`,
      );
    const control = variableById.get(policy.controle.variavel);
    if (!control)
      return failure(
        content,
        field,
        `Controle inexistente para ${initial.politica}.`,
      );
    const rules: PolicyLevelRules = {
      policyDefinitionId: policy.id,
      unit: control.unidade,
      domain: {
        minimum: control.dominio.minimo,
        maximum: control.dominio.maximo,
      },
      options: policy.controle.opcoes?.map((option) => option.valor),
    };
    const state = createInheritedPolicyState(
      {
        id: `${id}:policy:${policy.id}`,
        policyDefinitionId: policy.id,
        desiredLevel: initial.nivelDesejado,
        implementedLevel: initial.nivelImplantado,
        scenarioId: content.manifest.id,
        inheritedAtTurn: 0,
      },
      rules,
    );
    if (!state.ok) return failure(content, field, state.error.message);
    policies.push(state.value);
  }
  return {
    ok: true,
    value: {
      id,
      scenario: {
        id: content.manifest.id,
        schemaVersion: content.manifest.versaoEsquema,
        contentIdentity: createPackageContentIdentity(content),
      },
      currentTurn: 0,
      proposals: [],
      policies,
      execution: createExecution(content, graph),
    },
  };
}
