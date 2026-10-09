import type { ContentDiagnostic, ValidationResult } from "../engine";
import type { GameState } from "./createGame";
import type { PreparedFiscalQuarter } from "./prepareFiscalQuarter";

function invalid(field: string, message: string): ValidationResult<never> {
  const diagnostic: ContentDiagnostic = {
    code: "COMANDO_INVALIDO",
    file: "$partida",
    field,
    message,
  };
  return { ok: false, diagnostics: [diagnostic] };
}

/** Applies only a previously prepared fiscal result to a new game snapshot. */
export function commitFiscalQuarter(
  game: GameState,
  prepared: PreparedFiscalQuarter,
): ValidationResult<GameState> {
  if (!game.fiscal)
    return invalid(
      "fiscal",
      "A partida não possui ficha fiscal inicial para confirmar o trimestre.",
    );
  return {
    ok: true,
    value: {
      ...game,
      fiscal: prepared.accounting.state,
    },
  };
}
