import type { ValidationResult } from "../diagnostics/contentDiagnostic";
import type { ScenarioGraph } from "../graph/buildGraph";
import { calculateAffineContribution } from "../mechanisms/calculateAffineContribution";
import {
  combineCalculatedValue,
  type NumericContribution,
} from "../mechanisms/combineCalculatedValue";
import { updateStock, type StockRate } from "../mechanisms/updateStock";
import type { ResolvedPackage } from "../model/resolvePackage";
import type { EngineExecution } from "./createExecution";
import { readExecutionSnapshot } from "./createExecution";
import type { PolicyCommandBatch } from "./translatePolicyCommands";

export type ContributionExplanation = Readonly<{
  relationId: string;
  policyOrEventId: string;
  consequenceId: string;
  originId: string;
  targetId: string;
  sourceValue: number;
  coefficient: number;
  constant: number;
  contribution: number;
}>;

export type TargetExplanation = Readonly<{
  targetId: string;
  previousValue: number;
  baseValue: number;
  contributions: readonly ContributionExplanation[];
  result: number;
}>;

export type StepExecutionResult = Readonly<{
  execution: EngineExecution;
  explanations: readonly TargetExplanation[];
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

/** Prepara um passo inteiro e só devolve valores novos quando todos os cálculos forem válidos. */
export function advanceExecution(
  content: ResolvedPackage,
  graph: ScenarioGraph,
  execution: EngineExecution,
  batch: PolicyCommandBatch,
  duration = 1,
): ValidationResult<StepExecutionResult> {
  if (!Number.isFinite(duration) || duration <= 0)
    return failure("duracao", "A duração deve ser positiva e finita.");
  const nextValues = { ...execution.values };
  const changedControls = new Set<string>();
  for (const command of batch.controlCommands) {
    const node = graph.nodesById[command.controlId];
    if (!node || node.tipo !== "controle")
      return failure(
        "comandos",
        "O comando precisa apontar para um controle existente.",
      );
    if (changedControls.has(command.controlId))
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
    changedControls.add(command.controlId);
    nextValues[command.controlId] = command.value;
  }

  const requestedIds = new Set(batch.activeRelationIds);
  if ([...requestedIds].some((id) => !graph.relationsById[id]))
    return failure("relacoesAtivas", "O lote ativou uma relação inexistente.");
  const fired = new Set(execution.relationMemory.firedRelationIds);
  const fixedRemaining = { ...execution.relationMemory.fixedRemaining };
  const activeRelations = graph.relations.filter((relation) => {
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
  });
  const contributionsByTarget = new Map<string, NumericContribution[]>();
  const explanationsByTarget = new Map<string, ContributionExplanation[]>();
  for (const relation of activeRelations) {
    const sourceValue =
      relation.delaySteps === 0
        ? nextValues[relation.originId]
        : readExecutionSnapshot(execution, relation.delaySteps)[
            relation.originId
          ];
    const calculated = calculateAffineContribution(relation, sourceValue);
    if (!calculated.ok)
      return { ok: false, diagnostics: calculated.diagnostics };
    const target = contributionsByTarget.get(relation.targetId) ?? [];
    target.push({ relationId: relation.id, value: calculated.value.value });
    contributionsByTarget.set(relation.targetId, target);
    const explanations = explanationsByTarget.get(relation.targetId) ?? [];
    explanations.push({
      relationId: relation.id,
      policyOrEventId: relation.sourceId,
      consequenceId: relation.consequenceId,
      originId: relation.originId,
      targetId: relation.targetId,
      sourceValue: calculated.value.sourceValue,
      coefficient: calculated.value.coefficient,
      constant: calculated.value.constant,
      contribution: calculated.value.value,
    });
    explanationsByTarget.set(relation.targetId, explanations);
  }
  const targetExplanations: TargetExplanation[] = [];

  for (const variable of content.variables.variaveis) {
    const contributions = contributionsByTarget.get(variable.id) ?? [];
    if (variable.tipo === "calculado") {
      const combined = combineCalculatedValue(
        variable.id,
        variable.valorInicial,
        contributions,
      );
      if (!combined.ok) return { ok: false, diagnostics: combined.diagnostics };
      if (
        !inDomain(
          combined.value.value,
          variable.dominio.minimo,
          variable.dominio.maximo,
        )
      ) {
        return failure(
          `valores.${variable.id}`,
          `O valor calculado de ${variable.nome} (${variable.id}) foi ${combined.value.value}; domínio permitido: ${variable.dominio.minimo ?? "sem mínimo"} a ${variable.dominio.maximo ?? "sem máximo"}.`,
        );
      }
      nextValues[variable.id] = combined.value.value;
      targetExplanations.push({
        targetId: variable.id,
        previousValue: execution.values[variable.id],
        baseValue: variable.valorInicial,
        contributions: [...(explanationsByTarget.get(variable.id) ?? [])].sort(
          (left, right) => left.relationId.localeCompare(right.relationId),
        ),
        result: combined.value.value,
      });
    }
    if (variable.tipo === "estoque") {
      const rates: StockRate[] = contributions.map((contribution) => ({
        ...contribution,
        unit: graph.relationsById[contribution.relationId].unit,
      }));
      const updated = updateStock(
        variable,
        execution.values[variable.id],
        rates,
        duration,
      );
      if (!updated.ok) return { ok: false, diagnostics: updated.diagnostics };
      nextValues[variable.id] = updated.value.value;
    }
  }
  return {
    ok: true,
    value: {
      execution: {
        step: execution.step + 1,
        values: nextValues,
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
      explanations: targetExplanations.sort((left, right) =>
        left.targetId.localeCompare(right.targetId),
      ),
    },
  };
}
