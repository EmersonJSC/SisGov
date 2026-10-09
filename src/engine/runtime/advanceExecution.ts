import type { ValidationResult } from "../diagnostics/contentDiagnostic";
import type { GraphRelation, ScenarioGraph } from "../graph/buildGraph";
import type { ResolvedPackage } from "../model/resolvePackage";
import {
  computeNetwork,
  type ContributionExplanation,
  type TargetExplanation,
} from "./computeNetwork";
import type { EngineExecution } from "./createExecution";
import { readExecutionSnapshot } from "./createExecution";
import type { PolicyCommandBatch } from "./translatePolicyCommands";

export type { ContributionExplanation, TargetExplanation };

export type StepExecutionResult = Readonly<{
  execution: EngineExecution;
  explanations: readonly TargetExplanation[];
  /** Intensidade de cada nó neste mês (D-43). */
  intensities: Readonly<Record<string, number>>;
}>;

function failure(
  field: string,
  message: string,
): ValidationResult<StepExecutionResult> {
  return {
    ok: false,
    diagnostics: [
      { code: "CALCULO_INVALIDO", file: "$execucao", field, message },
    ],
  };
}

function inDomain(value: number, minimum?: number, maximum?: number): boolean {
  return (
    (minimum === undefined || value >= minimum) &&
    (maximum === undefined || value <= maximum)
  );
}

/** Avança um mês da rede viva sem alterar a execução recebida. */
export function advanceExecution(
  content: ResolvedPackage,
  graph: ScenarioGraph,
  execution: EngineExecution,
  batch: PolicyCommandBatch,
  duration = 1,
): ValidationResult<StepExecutionResult> {
  if (!Number.isFinite(duration) || duration <= 0)
    return failure("duracao", "A duração deve ser positiva e finita.");
  const controls: Record<string, number> = {};
  for (const command of batch.controlCommands) {
    const node = graph.nodesById[command.controlId];
    if (!node || node.tipo !== "controle")
      return failure(
        "comandos",
        "O comando precisa apontar para um controle existente.",
      );
    if (command.controlId in controls)
      return failure(
        "comandos",
        "O lote contém dois comandos para o mesmo controle.",
      );
    if (
      !Number.isFinite(command.value) ||
      !inDomain(command.value, node.dominio.minimo, node.dominio.maximo)
    ) {
      return failure("comandos", "O valor aplicado ao controle é inválido.");
    }
    controls[command.controlId] = command.value;
  }

  const requestedIds = new Set(batch.activeRelationIds);
  if ([...requestedIds].some((id) => !graph.relationsById[id]))
    return failure("relacoesAtivas", "O lote ativou uma relação inexistente.");
  const fired = new Set(execution.relationMemory.firedRelationIds);
  const fixedRemaining = { ...execution.relationMemory.fixedRemaining };
  const activeRelations: GraphRelation[] = graph.relations.filter(
    (relation) => {
      // Ligações da rede valem sempre (D-41).
      if (relation.sourceType === "rede") return true;
      const requested = requestedIds.has(relation.id);
      if (relation.duration.modo === "continuo") return requested;
      if (relation.duration.modo === "unico") {
        if (!requested || fired.has(relation.id)) return false;
        fired.add(relation.id);
        return true;
      }
      if (requested && fixedRemaining[relation.id] === undefined)
        fixedRemaining[relation.id] = relation.duration.passos;
      if ((fixedRemaining[relation.id] ?? 0) <= 0) return false;
      fixedRemaining[relation.id] -= 1;
      return true;
    },
  );

  const network = computeNetwork({
    content,
    graph,
    previous: execution.values,
    controls,
    activeRelations,
    readDelayed: (stepsAgo) => readExecutionSnapshot(execution, stepsAgo),
    duration,
  });
  if (!network.ok) return network;

  return {
    ok: true,
    value: {
      execution: {
        step: execution.step + 1,
        values: network.value.values,
        initialValues: execution.initialValues,
        history: [
          {
            step: execution.step,
            values: { ...execution.values },
            commands: {
              controlCommands: [...batch.controlCommands],
              activeRelationIds: [...batch.activeRelationIds],
            },
          },
          ...execution.history,
        ].slice(0, execution.historyLimit),
        historyLimit: execution.historyLimit,
        relationMemory: {
          firedRelationIds: [...fired].sort((left, right) =>
            left.localeCompare(right),
          ),
          fixedRemaining,
        },
      },
      explanations: network.value.explanations,
      intensities: network.value.intensities,
    },
  };
}
