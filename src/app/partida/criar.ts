import { createGame } from "../../game/createGame";
import { prepareMonthlyContent } from "../../game/prepareMonthlyContent";
import { loadDistributedScenario } from "../../scenarios/loadScenarioPackage";
import type { Resultado, ModoPartida, Partida } from "./tipos";
import { falha } from "./comum";

export function criarPartida(
  opcoes: Readonly<{
    pais?: string;
    modo?: ModoPartida;
    semente?: number;
    /** Eventos e dilemas (SG106); padrão: ligados. */
    ocorrencias?: boolean;
  }> = {},
): Resultado<Partida> {
  const loaded = loadDistributedScenario(
    `paises/${opcoes.pais ?? "brasil"}/pais.json`,
  );
  if (!loaded.ok) return falha(loaded.diagnostics);
  const prepared = prepareMonthlyContent(loaded.value.definition);
  if (!prepared.ok) return falha(prepared.diagnostics);
  const { content, graph } = prepared.value;
  const game = createGame("partida", content, graph, {
    randomSeed: opcoes.semente ?? 1,
    occurrences: opcoes.ocorrencias ?? true,
  });
  if (!game.ok) return falha(game.diagnostics);
  return {
    ok: true,
    value: {
      modo: opcoes.modo ?? "teste",
      content,
      graph,
      game: game.value,
      piloto: game.value,
      acoes: 0,
    },
  };
}
