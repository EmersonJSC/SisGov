import {
  advanceExecution,
  type EngineExecution,
  type ResolvedPackage,
  type ScenarioGraph,
  type ValidationResult,
} from "../engine";
import type { GameState } from "./createGame";
import { preparePolicyExecution } from "./preparePolicyExecution";
import {
  advanceOccurrenceMonths,
  occurrenceMonth,
  type OccurrenceState,
} from "./occurrences";
import type { PolicyState } from "./leis";

/** Um mês do trimestre. Sem explicações: o turno não as lê (V1-07). */
export type PreparedGameMonth = Readonly<{
  execution: EngineExecution;
}>;

export type PreparedGameQuarter = Readonly<{
  execution: EngineExecution;
  months: readonly PreparedGameMonth[];
  policies: readonly PolicyState[];
  /** Ocorrências depois dos três meses (o que acabou saiu das ativas). */
  occurrences?: OccurrenceState;
}>;

function invalid(field: string, message: string): ValidationResult<never> {
  return {
    ok: false,
    diagnostics: [
      { code: "COMANDO_INVALIDO", file: "$partida", field, message },
    ],
  };
}

/**
 * Prepares the quarter's policy execution without mutating the game. The
 * public accounts (revenue, spending, interest, debt) live in the network
 * (SG157); there is no separate fiscal ledger (SG105).
 */
export function prepareGameQuarter(
  content: ResolvedPackage,
  graph: ScenarioGraph,
  game: GameState,
  monthlyPolicyStates: readonly (readonly PolicyState[])[],
): ValidationResult<PreparedGameQuarter> {
  if (monthlyPolicyStates.length !== 3)
    return invalid("turno", "Um turno trimestral exige três estados mensais.");

  let execution = game.execution;
  const months: PreparedGameMonth[] = [];
  for (const [index, states] of monthlyPolicyStates.entries()) {
    const batch = preparePolicyExecution(content, graph, states);
    if (!batch.ok) return batch;
    // SG106: eventos em curso e escolhas de dilema ligam os próprios nós
    const occurrence = game.occurrences
      ? occurrenceMonth(content, graph, game.occurrences, index)
      : undefined;
    const merged = occurrence
      ? {
          controlCommands: [
            ...batch.value.controlCommands,
            ...occurrence.commands,
          ],
          activeRelationIds: [
            ...batch.value.activeRelationIds,
            ...occurrence.relationIds,
          ],
        }
      : batch.value;
    const advanced = advanceExecution(content, graph, execution, merged, 1, {
      explain: false,
    });
    if (!advanced.ok) return advanced;
    execution = advanced.value.execution;
    months.push({ execution });
    if (execution.step !== game.execution.step + index + 1)
      return invalid(
        `meses.${index}`,
        "O passo do motor não avançou sequencialmente.",
      );
  }

  return {
    ok: true,
    value: {
      execution,
      months,
      policies: monthlyPolicyStates[2],
      ...(game.occurrences
        ? {
            occurrences: advanceOccurrenceMonths(
              game.occurrences,
              3,
              game.currentTurn + 1,
            ),
          }
        : {}),
    },
  };
}
