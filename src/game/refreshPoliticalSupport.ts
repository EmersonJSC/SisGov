import type {
  ContentDiagnostic,
  ResolvedPackage,
  ValidationResult,
} from "../engine";
import { refreshPoliticalSupport, type GroupEffect } from "./socialSupport";
import type { GameState } from "./createGame";

function invalid(field: string, message: string): ValidationResult<never> {
  return {
    ok: false,
    diagnostics: [
      {
        code: "COMANDO_INVALIDO",
        file: "$partida",
        field,
        message,
      } satisfies ContentDiagnostic,
    ],
  };
}

function intensity(value: number, reference: number): number {
  return Math.max(0, Math.min(1, value / reference));
}

/** Rebuilds the social snapshot from JSON relations and current game state. */
export function refreshPoliticalSupportForGame(
  content: ResolvedPackage,
  game: GameState,
): ValidationResult<GameState> {
  if (!game.political || !content.initialState.politica)
    return invalid("political", "A partida não declara estado político.");
  const effects: GroupEffect[] = [];
  for (const relation of content.initialState.politica.relacoes) {
    const source =
      relation.origem.tipo === "politica"
        ? game.policies.find(
            (policy) => policy.policyDefinitionId === relation.origem.id,
          )?.implementedLevel
        : game.execution.values[relation.origem.id];
    if (source === undefined)
      return invalid(
        `politica.relacoes.${relation.id}`,
        "A fonte da relação não existe no estado da partida.",
      );
    effects.push({
      relationId: relation.id,
      groupId: relation.grupo,
      points:
        relation.pontosEmReferencia *
        intensity(source, relation.origem.referencia),
    });
  }
  const refreshed = refreshPoliticalSupport(
    game.political.profiles,
    effects,
    game.political.governmentCoalitionPartyIds,
    game.political.basePartySupport,
    game.political.referenceWeights,
  );
  if (!refreshed.ok) return refreshed;
  return {
    ok: true,
    value: {
      ...game,
      political: {
        ...game.political,
        partySupport: refreshed.value.partySupport,
        contributionsByRelation: refreshed.value.contributionsByRelation,
      },
    },
  };
}
