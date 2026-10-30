/**
 * Carisma vivo do presidente (M8.2): a cada turno o desvio anda atrás da
 * satisfação média do eleitorado e da promessa quebrada.
 */
import type { GameState } from "../../game/createGame";
import { pacoteVivo } from "../../game/congresso";
import { andarCarisma } from "../../game/carisma";
import { gruposNaBussola } from "../../game/gabinete";
import { descumprimentoDoGoverno, perdaDaPromessa } from "../../game/promessa";
import { valoresComReacao } from "./bussola";
import type { Partida } from "./tipos";

/** Satisfação média dos grupos, pesada pelo tamanho deles. */
function satisfacaoMedia(partida: Partida): number | undefined {
  const pacote = pacoteVivo(partida.content, partida.game.execution.values);
  if (!pacote) return undefined;
  const valores = valoresComReacao(partida);
  const grupos = gruposNaBussola(pacote).filter(
    (g) => valores[g.id] !== undefined,
  );
  const peso = grupos.reduce((s, g) => s + g.peso, 0);
  return peso === 0
    ? undefined
    : grupos.reduce((s, g) => s + g.peso * valores[g.id], 0) / peso;
}

/** Passa o turno do carisma do presidente. */
export function passarCarisma(partida: Partida): GameState {
  const { game, content } = partida;
  const e = game.election;
  const media = satisfacaoMedia(partida);
  if (!e || media === undefined) return game;
  const d = descumprimentoDoGoverno({ content, game });
  const perda = d ? perdaDaPromessa(d) : 0;
  return {
    ...game,
    election: {
      ...e,
      carismaViva: andarCarisma(e.carismaViva ?? 0, media, perda),
    },
  };
}
