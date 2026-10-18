import { createGame } from "../../game/createGame";
import { criarEleicao } from "../../game/eleicao";
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
    /** Nome e sigla do partido do jogador (V1-39). */
    partido?: Readonly<{ nome?: string; sigla?: string }>;
    /** Id do presidente, entre os `primeirosCandidatos` da mesma semente. */
    presidente?: string;
    /** Eleição no fim do mandato (V1-39); padrão: ligada. Testes longos desligam. */
    eleicao?: boolean;
  }> = {},
): Resultado<Partida> {
  const conteudo = carregarConteudo(opcoes.pais ?? "ilha-teste");
  if (!conteudo.ok) return conteudo;
  const { content, graph } = conteudo.value;
  const game = createGame("partida", content, graph, {
    randomSeed: opcoes.semente ?? 1,
    occurrences: opcoes.ocorrencias ?? true,
  });
  if (!game.ok) return falha(game.diagnostics);
  const election =
    opcoes.eleicao === false
      ? undefined
      : criarEleicao({
          content,
          pais: opcoes.pais ?? "ilha-teste",
          semente: opcoes.semente ?? 1,
          partido: opcoes.partido,
          presidente: opcoes.presidente,
          valores: game.value.execution.values,
          congresso: game.value.congress,
        });
  const comEleicao = election ? { ...game.value, election } : game.value;
  return {
    ok: true,
    value: {
      modo: opcoes.modo ?? "teste",
      content,
      graph,
      game: comEleicao,
      piloto: comEleicao,
      acoes: 0,
    },
  };
}
