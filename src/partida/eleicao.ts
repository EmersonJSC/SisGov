// A pesquisa de voto: o primeiro turno como seria hoje, para a tela.
import { montarChapas, primeiroTurno } from "../motor";
import type { Partida } from ".";

export interface IntencaoDeVoto {
  /** Id da chapa. */
  chapa: string;
  /** Partidos da chapa, pelo id (vazio sem Congresso). */
  partidos: string[];
  governo: boolean;
  /** Fração dos votos, de 0 a 1. */
  votos: number;
}

/**
 * Como seria o primeiro turno se a eleição fosse hoje, sem contar a promessa
 * (ela só é avaliada no primeiro turno de verdade). Da mais votada para a menos.
 */
export function pesquisaDeVoto(partida: Partida): IntencaoDeVoto[] {
  const { regras, estado } = partida;
  const c = regras.congresso;
  const { governo, oposicao } = montarChapas(
    (c?.partidos ?? []).map((p) => ({
      id: p.id,
      cadeiras: p.cadeiras,
      defende: p.defende,
    })),
    c?.governo ?? "",
    estado.coligacao,
  );
  const { votos } = primeiroTurno({
    grupos: estado.grupos,
    governo,
    oposicao,
    desgaste: estado.desgaste,
    ajuste: () => 0,
  });
  return [governo, ...oposicao]
    .map((ch) => ({
      chapa: ch.id,
      partidos: ch.partidos,
      governo: ch.governo,
      votos: votos[ch.id],
    }))
    .sort((a, b) => b.votos - a.votos);
}
