import { createGame } from "../../game/createGame";
import { prepareMonthlyContent } from "../../game/prepareMonthlyContent";
import { loadDistributedScenario } from "../../game/pais/loadScenarioPackage";
import type { Resultado, ModoPartida, Partida } from "./tipos";
import { falha } from "./comum";

/** O conteúdo do país, pronto para a partida (também ao carregar, V1-33). */
export function carregarConteudo(
  pais: string,
): Resultado<Pick<Partida, "content" | "graph">> {
  const loaded = loadDistributedScenario(`paises/${pais}/pais.json`);
  if (!loaded.ok) return falha(loaded.diagnostics);
  const prepared = prepareMonthlyContent(loaded.value.definition);
  if (!prepared.ok) return falha(prepared.diagnostics);
  return { ok: true, value: prepared.value };
}

export function criarPartida(
  opcoes: Readonly<{
    pais?: string;
    modo?: ModoPartida;
    semente?: number;
    /** Eventos e dilemas (SG106); padrão: ligados. */
    ocorrencias?: boolean;
  }> = {},
): Resultado<Partida> {
  const conteudo = carregarConteudo(opcoes.pais ?? "brasil");
  if (!conteudo.ok) return conteudo;
  const { content, graph } = conteudo.value;
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
