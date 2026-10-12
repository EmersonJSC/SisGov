import type {
  ContentDiagnostic,
  ValidationResult,
} from "../diagnostics/contentDiagnostic";
import type { ScenarioGraph } from "../graph/buildGraph";
import { graphIndex } from "../graph/graphIndex";
import type { ResolvedPackage } from "../model/resolvePackage";

export type AuthorizedPolicyChange = Readonly<{
  policyId: string;
  intensity: number;
}>;

export type ControlCommand = Readonly<{
  controlId: string;
  value: number;
  policyId: string;
}>;

export type PolicyCommandBatch = Readonly<{
  controlCommands: readonly ControlCommand[];
  activeRelationIds: readonly string[];
}>;

function issue(field: string, message: string): ContentDiagnostic {
  return { code: "COMANDO_INVALIDO", file: "$comando", field, message };
}

const contentCache = new WeakMap<
  ResolvedPackage,
  Readonly<{
    policiesById: ReadonlyMap<string, ResolvedPackage["policies"][number]>;
    variablesById: ReadonlyMap<
      string,
      ResolvedPackage["variables"]["variaveis"][number]
    >;
  }>
>();

function contentIndex(content: ResolvedPackage) {
  let index = contentCache.get(content);
  if (!index) {
    index = {
      policiesById: new Map(
        content.policies.map((policy) => [policy.id, policy]),
      ),
      variablesById: new Map(
        content.variables.variaveis.map((variable) => [variable.id, variable]),
      ),
    };
    contentCache.set(content, index);
  }
  return index;
}

/** Traduz escolhas já autorizadas em controles aplicados e relações ativas. */
export function translateAuthorizedPolicies(
  content: ResolvedPackage,
  graph: ScenarioGraph,
  changes: readonly AuthorizedPolicyChange[],
): ValidationResult<PolicyCommandBatch> {
  const diagnostics: ContentDiagnostic[] = [];
  const { policiesById, variablesById } = contentIndex(content);
  const { bySource, relationRank } = graphIndex(graph);
  const controlCommands: ControlCommand[] = [];
  const activeRelationIds: string[] = [];
  const changedControls = new Set<string>();

  for (const [index, change] of changes.entries()) {
    const field = `politicas[${index}]`;
    const policy = policiesById.get(change.policyId);
    if (!policy) {
      diagnostics.push(
        issue(`${field}.policyId`, "A política não existe neste cenário."),
      );
      continue;
    }
    if (!Number.isFinite(change.intensity)) {
      diagnostics.push(
        issue(`${field}.intensity`, "A intensidade deve ser um número finito."),
      );
      continue;
    }
    const control = variablesById.get(policy.controle.variavel);
    if (!control) {
      diagnostics.push(
        issue(
          `${field}.controle.variavel`,
          "A variável de controle da política não existe neste cenário.",
        ),
      );
      continue;
    }
    if (changedControls.has(control.id)) {
      diagnostics.push(
        issue(
          `${field}.policyId`,
          "Duas mudanças não podem comandar o mesmo controle no mesmo lote.",
        ),
      );
      continue;
    }
    const { minimo, maximo } = control.dominio;
    if (
      (minimo !== undefined && change.intensity < minimo) ||
      (maximo !== undefined && change.intensity > maximo)
    ) {
      diagnostics.push(
        issue(
          `${field}.intensity`,
          "A intensidade está fora do domínio do controle.",
        ),
      );
      continue;
    }
    changedControls.add(control.id);
    controlCommands.push({
      controlId: control.id,
      value: change.intensity,
      policyId: policy.id,
    });
    for (const relation of bySource.get(policy.id) ?? [])
      activeRelationIds.push(relation.id);
  }

  if (diagnostics.length > 0) return { ok: false, diagnostics };
  return {
    ok: true,
    value: {
      controlCommands: controlCommands.sort((left, right) =>
        left.controlId.localeCompare(right.controlId),
      ),
      // Mesma ordem de `localeCompare`, pela posição já calculada no grafo.
      activeRelationIds: activeRelationIds.sort(
        (left, right) => relationRank.get(left)! - relationRank.get(right)!,
      ),
    },
  };
}
