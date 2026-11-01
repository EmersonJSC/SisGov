// Eleição e desgaste (passo 9). O motor acha a lei de mandato pelo
// `mandato_anos` das opções; não conhece o nome dela. Comportamento em
// eleicao.md.
import type { Grupo } from "../grupos";
import type { Lei, ValorLei } from "../leis";

/** Desgaste de um mandato de 4 anos (24 turnos), espalhado por turno. */
export const DESGASTE_POR_TURNO = 2.25 / 24;
const TURNOS_POR_ANO = 6;
const METADE = 50;

export interface VotoGrupo {
  satisfacao: number;
  pessoas: number;
}

export interface Eleicao {
  turno: number;
  /** Satisfação média pesada pelas pessoas, menos o desgaste. */
  apoio: number;
  adversario: number;
  desgaste: number;
  /** Apoio − adversário; positiva, o governo venceu. */
  margem: number;
  venceu: boolean;
  grupos: Record<string, VotoGrupo>;
}

/** Turnos do mandato pela lei vigente, ou null se o país não tem eleição. */
export function turnosMandato(
  leis: Record<string, Lei>,
  vigentes: Record<string, ValorLei>,
): number | null {
  for (const [id, valor] of Object.entries(vigentes)) {
    const lei = leis[id];
    if (lei.forma !== "opcoes") continue;
    const anos = lei.opcoes.find((o) => o.id === valor)?.mandato_anos;
    if (anos !== undefined) return anos * TURNOS_POR_ANO;
  }
  return null;
}

/** Satisfação média dos grupos, pesada pelas pessoas. */
export function satisfacaoMedia(grupos: Record<string, Grupo>): number {
  let soma = 0;
  let pessoas = 0;
  for (const g of Object.values(grupos)) {
    soma += g.pessoas * g.satisfacao;
    pessoas += g.pessoas;
  }
  return soma / pessoas;
}

export function apurar(
  turno: number,
  grupos: Record<string, Grupo>,
  desgaste: number,
): Eleicao {
  const apoio = satisfacaoMedia(grupos) - desgaste;
  const adversario = 100 - apoio;
  return {
    turno,
    apoio,
    adversario,
    desgaste,
    margem: apoio - adversario,
    venceu: apoio > METADE,
    grupos: Object.fromEntries(
      Object.entries(grupos).map(([id, g]) => [
        id,
        { satisfacao: g.satisfacao, pessoas: g.pessoas },
      ]),
    ),
  };
}
