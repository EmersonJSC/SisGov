import type { GameState } from "./createGame";
import type { PreparedGameQuarter } from "./prepareGameQuarter";

/** Commits one already-prepared quarter as a new immutable game snapshot. */
export function commitGameQuarter(
  game: GameState,
  prepared: PreparedGameQuarter,
): GameState {
  return {
    ...game,
    currentTurn: game.currentTurn + 1,
    policies: prepared.policies,
    proposals: prepared.proposals,
    fiscal: prepared.fiscal.accounting.state,
    execution: prepared.execution,
  };
}
