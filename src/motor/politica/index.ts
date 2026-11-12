// Política: Congresso. Partidos, cadeiras e coligação são do país; o motor não
// conhece os nomes. Comportamento em politica.md.
import type { Grupo } from "../grupos";
import type { Lei, ValorLei } from "../leis";
import type { Congresso, Partido } from "./tipos";

export * from "./tipos";
export {
  cenarioDe,
  decretoAlcanca,
  alcanceDoDecreto,
  esfriarEEsquentar,
  iniciarCongresso,
  placarPrevisto,
  tramitar,
  valorCedido,
  TERMOMETRO_AMEACA,
  TERMOMETRO_CONVITE,
  TERMOMETRO_SAIDA,
  type EntradaTramitar,
  type SaidaTramitar,
} from "./tramitacao";
export {
  contaDaLei,
  INDECISO,
  opiniao,
  PACIENCIA_BAIXA,
  quorumDa,
  votar,
  type Cenario,
} from "./voto";

/** Motivo de o Congresso do país não fechar, ou null. */
export function motivoCongressoInvalido(
  congresso: Congresso,
  coligacao: string[],
  grupos: string[],
): string | null {
  const ids = congresso.partidos.map((p) => p.id);
  if (new Set(ids).size !== ids.length) return "partido repetido";
  for (const p of congresso.partidos) {
    if (!(Number.isInteger(p.cadeiras) && p.cadeiras > 0))
      return `partido ${p.id}: cadeiras precisa ser inteiro > 0`;
    for (const [g, peso] of Object.entries(p.defende)) {
      if (!grupos.includes(g))
        return `partido ${p.id}: grupo "${g}" não existe`;
      if (!(peso > 0)) return `partido ${p.id}: peso de ${g} precisa ser > 0`;
    }
    for (const campo of ["coesao", "contas"] as const) {
      const v = p[campo];
      if (v !== undefined && !(v >= 0 && v <= 1))
        return `partido ${p.id}: ${campo} precisa estar entre 0 e 1`;
    }
  }
  if (!ids.includes(congresso.governo))
    return `governo: partido "${congresso.governo}" não existe`;
  for (const id of coligacao)
    if (!ids.includes(id)) return `coligação: partido "${id}" não existe`;
  if (!coligacao.includes(congresso.governo))
    return "coligação: precisa incluir o governo";
  if (!(congresso.maioria > 0 && congresso.maioria < 1))
    return "maioria precisa estar entre 0 e 1";
  for (const id of Object.keys(congresso.senado ?? {}))
    if (!ids.includes(id)) return `senado: partido "${id}" não existe`;
  return null;
}

/** Satisfação média dos grupos que o partido defende, pesada pelo peso. */
export function satisfacaoDoPartido(
  partido: Partido,
  grupos: Record<string, Grupo>,
): number {
  let soma = 0;
  let pesos = 0;
  for (const [g, peso] of Object.entries(partido.defende)) {
    soma += peso * grupos[g].satisfacao;
    pesos += peso;
  }
  return soma / pesos;
}

/** Lei do mundo que o motor usa sem conhecer o nome: só tipos. */
export type { Lei, ValorLei };
