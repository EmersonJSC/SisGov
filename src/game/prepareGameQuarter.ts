import {
  advanceExecution,
  type EngineExecution,
  type ResolvedPackage,
  type ScenarioGraph,
  type TargetExplanation,
  type ValidationResult,
} from "../engine";
import type { GameState } from "./createGame";
import {
  prepareFiscalQuarter,
  type PreparedFiscalQuarter,
} from "./prepareFiscalQuarter";
import { preparePolicyExecution } from "./preparePolicyExecution";
import type { PolicyState } from "../domain/game";
import {
  defaultProposalTiming,
  prepareProposalTramitation,
} from "./prepareProposalTramitation";

export type PreparedGameMonth = Readonly<{
  execution: EngineExecution;
  explanations: readonly TargetExplanation[];
}>;

export type PreparedGameQuarter = Readonly<{
  execution: EngineExecution;
  fiscal: PreparedFiscalQuarter;
  months: readonly PreparedGameMonth[];
  policies: readonly PolicyState[];
  proposals: GameState["proposals"];
}>;

function invalid(field: string, message: string): ValidationResult<never> {
  return {
    ok: false,
    diagnostics: [
      { code: "COMANDO_INVALIDO", file: "$partida", field, message },
    ],
  };
}

/** Prepares policy execution and fiscal accounting without mutating the game. */
export function prepareGameQuarter(
  content: ResolvedPackage,
  graph: ScenarioGraph,
  game: GameState,
  monthlyPolicyStates: readonly (readonly PolicyState[])[],
): ValidationResult<PreparedGameQuarter> {
  if (!game.fiscal)
    return invalid("fiscal", "A partida não possui ficha fiscal inicial.");
  if (monthlyPolicyStates.length !== 3)
    return invalid("turno", "Um turno trimestral exige três estados mensais.");

  const fiscal = prepareFiscalQuarter(
    content,
    game.fiscal,
    monthlyPolicyStates,
  );
  if (!fiscal.ok) return fiscal;
  const proposals = prepareProposalTramitation(
    game.proposals,
    game.currentTurn + 1,
    defaultProposalTiming,
  );
  if (!proposals.ok) return proposals;

  let execution = game.execution;
  const months: PreparedGameMonth[] = [];
  for (const [index, states] of monthlyPolicyStates.entries()) {
    const batch = preparePolicyExecution(content, graph, states);
    if (!batch.ok) return batch;
    const advanced = advanceExecution(content, graph, execution, batch.value);
    if (!advanced.ok) return advanced;
    execution = advanced.value.execution;
    months.push({
      execution,
      explanations: advanced.value.explanations,
    });
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
      fiscal: fiscal.value,
      months,
      policies: monthlyPolicyStates[2],
      proposals: proposals.value,
    },
  };
}
