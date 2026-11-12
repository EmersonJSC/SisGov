// Os votos: cada grupo reparte os seus entre o governo e as chapas da oposição.
import type { Grupo } from "../grupos";
import { semelhanca } from "./chapas";
import type { Chapa, Rodada } from "./tipos";

/** Todo grupo dá um pouco a toda chapa, para ninguém ficar com zero. */
const PISO_DA_AFINIDADE = 0.02;
/** Peso mínimo da semelhança ao repartir os votos de uma chapa que saiu. */
const PISO_DA_TRANSFERENCIA = 0.1;
/** Quem já deixou de votar no governo no primeiro turno só volta a ele em parte. */
const REJEICAO_AO_GOVERNO = 0.25;
const METADE = 0.5;

const limitar = (v: number) => Math.max(0, Math.min(1, v));

export interface EntradaDoVoto {
  grupos: Record<string, Grupo>;
  governo: Chapa;
  oposicao: Chapa[];
  desgaste: number;
  /** Fração a mais (ou a menos) de voto no governo que um grupo dá por causa da promessa. */
  ajuste: (grupo: string) => number;
}

/**
 * Primeiro turno. O grupo dá ao governo a sua satisfação (menos o desgaste, mais
 * o que a promessa pesou); o resto vai para as chapas da oposição, na
 * proporção do que cada uma defende o grupo.
 */
export function primeiroTurno(e: EntradaDoVoto): Rodada {
  const total = Object.values(e.grupos).reduce((s, g) => s + g.pessoas, 0);
  const porGrupo = Object.fromEntries(
    Object.entries(e.grupos).map(([id, g]) => {
      const governo = limitar((g.satisfacao - e.desgaste) / 100 + e.ajuste(id));
      const pesos = e.oposicao.map(
        (c) => (c.afinidade[id] ?? 0) + PISO_DA_AFINIDADE,
      );
      const soma = pesos.reduce((s, p) => s + p, 0);
      return [
        id,
        {
          [e.governo.id]: governo,
          ...Object.fromEntries(
            e.oposicao.map((c, i) => [c.id, ((1 - governo) * pesos[i]) / soma]),
          ),
        },
      ];
    }),
  );
  const chapas = [e.governo, ...e.oposicao];
  const votos = Object.fromEntries(
    chapas.map((c) => [
      c.id,
      Object.entries(e.grupos).reduce(
        (s, [id, g]) => s + (g.pessoas / total) * porGrupo[id][c.id],
        0,
      ),
    ]),
  );
  return { votos, porGrupo };
}

/** Quem passou da metade, se alguém passou. */
export function vencedorNoPrimeiroTurno(rodada: Rodada): string | null {
  return (
    Object.entries(rodada.votos).find(([, v]) => v > METADE + 1e-12)?.[0] ??
    null
  );
}

/** Os dois mais votados, do primeiro para o segundo. */
export function finalistas(rodada: Rodada): [string, string] {
  const [a, b] = Object.entries(rodada.votos).sort((x, y) => y[1] - x[1]);
  return [a[0], b[0]];
}

/**
 * Segundo turno entre o governo e o rival. Quem votou numa chapa que saiu vai
 * para o governo na medida em que a chapa dele se parece com o governo (e só em
 * parte, pela rejeição), e o resto vai para o rival.
 */
export function segundoTurno(
  primeiro: Rodada,
  grupos: Record<string, Grupo>,
  chapas: Chapa[],
  governo: string,
  rival: string,
): Rodada {
  const chapa = (id: string) => chapas.find((c) => c.id === id) as Chapa;
  const total = Object.values(grupos).reduce((s, g) => s + g.pessoas, 0);
  const saiu = chapas.filter((c) => c.id !== governo && c.id !== rival);
  /** Fração dos votos da chapa que saiu e vai para o governo. */
  const paraOGoverno = (de: Chapa) => {
    const g =
      semelhanca(de.afinidade, chapa(governo).afinidade) * REJEICAO_AO_GOVERNO;
    const r = semelhanca(de.afinidade, chapa(rival).afinidade);
    return g / (g + r + PISO_DA_TRANSFERENCIA);
  };
  const porGrupo = Object.fromEntries(
    Object.entries(primeiro.porGrupo).map(([g, votos]) => {
      const doGoverno = saiu.reduce(
        (s, c) => s + votos[c.id] * paraOGoverno(c),
        votos[governo],
      );
      return [g, { [governo]: doGoverno, [rival]: 1 - doGoverno }];
    }),
  );
  const votos = Object.fromEntries(
    [governo, rival].map((id) => [
      id,
      Object.entries(grupos).reduce(
        (s, [g, grupo]) => s + (grupo.pessoas / total) * porGrupo[g][id],
        0,
      ),
    ]),
  );
  return { votos, porGrupo };
}
