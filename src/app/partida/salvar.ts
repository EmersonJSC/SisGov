/**
 * Salvar e carregar a partida (V1-33). O arquivo guarda só o estado do jogo;
 * as leis e as regras vêm do conteúdo do jogo, e a identidade do conteúdo
 * confere que são as mesmas de quando a partida foi salva.
 */
import { createPackageContentIdentity } from "../../engine";
import type { GameState } from "../../game/createGame";
import { carregarConteudo } from "./criar";
import type { ModoPartida, Partida, Resultado } from "./tipos";

/** Sobe quando o formato do arquivo muda; versão diferente é recusada. */
export const VERSAO_DO_SALVO = 1;
const FORMATO = "sisgov-partida";

type PartidaSalva = Readonly<{
  formato: typeof FORMATO;
  versao: number;
  salvoEm: string;
  pais: string;
  conteudo: string;
  modo: ModoPartida;
  acoes: number;
  game: GameState;
  /** `null`: o piloto automático é o próprio jogo (nada mudou ainda). */
  piloto: GameState | null;
  /** Dados da tela (o histórico do jornal), guardados como vieram. */
  anexos?: Readonly<Record<string, unknown>>;
}>;

const erro = (mensagem: string): Resultado<never> => ({
  ok: false,
  erros: [mensagem],
});

/** O texto (JSON) da partida salva. */
export function salvarPartida(
  partida: Partida,
  anexos?: Readonly<Record<string, unknown>>,
): string {
  const salva: PartidaSalva = {
    formato: FORMATO,
    versao: VERSAO_DO_SALVO,
    salvoEm: new Date().toISOString(),
    pais: partida.game.scenario.id,
    conteudo: partida.game.scenario.contentIdentity,
    modo: partida.modo,
    acoes: partida.acoes,
    game: partida.game,
    piloto: partida.piloto === partida.game ? null : partida.piloto,
    ...(anexos ? { anexos } : {}),
  };
  return JSON.stringify(salva);
}

const ehObjeto = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Lê o texto salvo; recusa arquivo de outro formato, versão ou conteúdo. */
export function carregarPartida(texto: string): Resultado<{
  partida: Partida;
  salvoEm: string;
  anexos: Readonly<Record<string, unknown>>;
}> {
  let dados: unknown;
  try {
    dados = JSON.parse(texto);
  } catch {
    return erro("O arquivo não é uma partida do SisGov.");
  }
  if (!ehObjeto(dados) || dados.formato !== FORMATO)
    return erro("O arquivo não é uma partida do SisGov.");
  if (dados.versao !== VERSAO_DO_SALVO)
    return erro(
      `Esta partida foi salva no formato ${String(dados.versao)}, e este jogo só lê o formato ${VERSAO_DO_SALVO}.`,
    );
  const { pais, conteudo, modo, acoes, game, piloto } = dados;
  if (
    typeof pais !== "string" ||
    typeof conteudo !== "string" ||
    (modo !== "teste" && modo !== "real") ||
    typeof acoes !== "number" ||
    !ehObjeto(game) ||
    !ehObjeto(game.execution) ||
    !(piloto === null || ehObjeto(piloto))
  )
    return erro("A partida salva está incompleta ou corrompida.");
  const carregado = carregarConteudo(pais);
  if (!carregado.ok) return carregado;
  const { content, graph } = carregado.value;
  if (createPackageContentIdentity(content) !== conteudo)
    return erro(
      "Esta partida foi salva com outra versão das leis e regras do jogo e não pode ser carregada.",
    );
  const jogo = game as unknown as GameState;
  return {
    ok: true,
    value: {
      partida: {
        modo,
        content,
        graph,
        game: jogo,
        piloto: piloto ? (piloto as unknown as GameState) : jogo,
        acoes,
      },
      salvoEm: typeof dados.salvoEm === "string" ? dados.salvoEm : "",
      anexos: ehObjeto(dados.anexos) ? dados.anexos : {},
    },
  };
}
