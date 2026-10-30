/**
 * O ministro como porta-voz (M8.3, fatia D): o pedido de lei que ele traz ao
 * presidente, a resposta e o favor que ela deixa nos grupos leais a ele.
 */
import type { GameState } from "../../game/createGame";
import { pacoteVivo } from "../../game/congresso";
import { gruposNaBussola } from "../../game/gabinete";
import {
  decairFavores,
  favorDaResposta,
  sortearPedido,
} from "../../game/pedidos";
import { notasDoGabinete } from "./bussola";
import { ESTRUTURAS } from "./comum";
import { mudarLei } from "./leis";
import { estadoDaTramitacao } from "./tramitacao";
import type { Partida, Resultado } from "./tipos";

export type VisaoPedidoDoMinistro = Readonly<{
  area: string;
  ministro: string;
  lei: string;
  /** Rótulo da opção que ele pede. */
  opcao: string;
  /** Grupos leais a ele, que o pedido representa. */
  leais: readonly string[];
}>;

const leisDasAreas = (partida: Pick<Partida, "content">) =>
  Object.fromEntries(
    (ESTRUTURAS[partida.content.manifest?.id ?? ""]?.ministerios ?? []).reduce(
      (mapa, m) => mapa.set(m.area, [...(mapa.get(m.area) ?? []), ...m.leis]),
      new Map<string, readonly string[]>(),
    ),
  );

/**
 * Passa o turno: o favor antigo perde força, o pedido que ninguém respondeu
 * caduca e, de vez em quando, um ministro traz um novo (nunca mais de um).
 */
export function passarPedidos(partida: Partida): GameState {
  const { game, content } = partida;
  const e = game.election;
  if (!e?.ministros) return game;
  const notas = notasDoGabinete(partida);
  const pacote = pacoteVivo(content, game.execution.values);
  const grupos = new Map(
    (pacote ? gruposNaBussola(pacote) : []).map((g) => [g.id, g]),
  );
  const alvos = Object.fromEntries(
    notas.flatMap((n) => {
      const gs = n.leais.flatMap((id) => grupos.get(id) ?? []);
      const peso = gs.reduce((s, g) => s + g.peso, 0);
      return peso > 0
        ? [
            [
              n.area,
              {
                economia:
                  gs.reduce((s, g) => s + g.peso * g.ponto.economia, 0) / peso,
                costumes:
                  gs.reduce((s, g) => s + g.peso * g.ponto.costumes, 0) / peso,
              },
            ],
          ]
        : [];
    }),
  );
  const pedido = sortearPedido({
    content,
    policies: game.policies,
    ministros: e.ministros,
    leais: notas,
    alvos,
    leisDaArea: leisDasAreas(partida),
    excluir: new Set(estadoDaTramitacao(game).fila.map((p) => p.lei)),
    seed: game.random?.seed ?? 1,
    turno: game.currentTurn,
  });
  const { pedido: _caducado, ...resto } = e;
  return {
    ...game,
    election: {
      ...resto,
      favores: decairFavores(e.favores),
      ...(pedido ? { pedido } : {}),
    },
  };
}

/** O pedido em aberto, para a tela. */
export function verPedidoDoMinistro(
  partida: Pick<Partida, "game" | "content">,
  rotuloDaArea: (area: string) => string | undefined,
): VisaoPedidoDoMinistro | undefined {
  const e = partida.game.election;
  const pedido = e?.pedido;
  const ministro = pedido && e?.ministros?.[pedido.area];
  const policy =
    pedido && partida.content.policies.find((p) => p.id === pedido.lei);
  if (!pedido || !ministro || !policy) return undefined;
  const opcao = policy.controle.opcoes?.find((o) => o.id === pedido.opcao);
  return {
    area: rotuloDaArea(pedido.area) ?? pedido.area,
    ministro: ministro.nome,
    lei: policy.nome,
    opcao: opcao?.rotulo ?? pedido.opcao,
    leais:
      notasDoGabinete(partida).find((n) => n.area === pedido.area)?.leais ?? [],
  };
}

/**
 * O presidente responde ao ministro. Aceitar leva a lei adiante (ao Congresso,
 * se a lei pede) e agrada os grupos leais a ele; recusar os desagrada.
 */
export function responderAoMinistro(
  partida: Partida,
  aceitar: boolean,
): Resultado<Partida> {
  const e = partida.game.election;
  const pedido = e?.pedido;
  if (!e || !pedido)
    return { ok: false, erros: ["Nenhum ministro pediu nada."] };
  let atual = partida;
  if (aceitar) {
    const r = mudarLei(partida, pedido.lei, pedido.nivel);
    if (!r.ok) return r;
    atual = r.value;
  }
  const leais =
    notasDoGabinete(partida).find((n) => n.area === pedido.area)?.leais ?? [];
  const { pedido: _respondido, ...resto } = atual.game.election ?? e;
  return {
    ok: true,
    value: {
      ...atual,
      game: {
        ...atual.game,
        election: {
          ...resto,
          favores: favorDaResposta(e.favores, leais, aceitar),
        },
      },
    },
  };
}
