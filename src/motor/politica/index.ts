// Política: Congresso (passo 8). Partidos, cadeiras e coligação são do país;
// o motor não conhece os nomes. Comportamento em politica.md.
import { pontosLei, type Grupo, type TipoGrupo } from "../grupos";
import type { Lei, ValorLei } from "../leis";

export interface Partido {
  id: string;
  cadeiras: number;
  /** Grupos que o partido representa e o peso de cada um. */
  defende: Record<string, number>;
}

export interface Congresso {
  partidos: Partido[];
  /** Partido do jogador. */
  governo: string;
  /** Fração das cadeiras que os votos sim precisam passar (0,5 = metade). */
  maioria: number;
}

export type Voto = "sim" | "nao";

export interface Votacao {
  lei: string;
  valor: ValorLei;
  exorbitante: boolean;
  /** Voto de cada partido; vazio quando não há Congresso. */
  votos: Record<string, Voto>;
  sim: number;
  nao: number;
  aprovada: boolean;
}

/** Fração da faixa que um pedido só pode andar sem ser exorbitante. */
const EXORBITANTE = 1 / 3;
/** Folga do arredondamento: andar exatamente 1/3 da faixa não é exorbitante. */
const FOLGA = 1e-9;
/** Satisfação abaixo da qual um partido da base sai da coligação. */
const LIMIAR_SAIDA = 35;

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
  }
  if (!ids.includes(congresso.governo))
    return `governo: partido "${congresso.governo}" não existe`;
  for (const id of coligacao)
    if (!ids.includes(id)) return `coligação: partido "${id}" não existe`;
  if (!coligacao.includes(congresso.governo))
    return "coligação: precisa incluir o governo";
  if (!(congresso.maioria > 0 && congresso.maioria < 1))
    return "maioria precisa estar entre 0 e 1";
  return null;
}

/** Lei contínua que anda mais de 1/3 da faixa num pedido só. */
export function ehExorbitante(
  lei: Lei,
  de: ValorLei | undefined,
  para: ValorLei,
): boolean {
  if (lei.forma !== "continua") return false;
  const { min, max } = lei.faixa;
  const antes = (de as number | undefined) ?? min;
  return Math.abs((para as number) - antes) > EXORBITANTE * (max - min) + FOLGA;
}

/** Folga do arredondamento: opinião menor que isto conta como nenhuma. */
const SEM_OPINIAO = 1e-9;

/**
 * O quanto os grupos que o partido defende querem a mudança (+ a favor):
 * peso × os pontos que a bússola da lei daria a cada grupo.
 */
export function opiniao(
  partido: Partido,
  tipos: TipoGrupo[],
  lei: Lei,
  de: ValorLei | undefined,
  para: ValorLei,
): number {
  let soma = 0;
  for (const [grupo, peso] of Object.entries(partido.defende)) {
    const tipo = tipos.find((t) => t.id === grupo);
    if (tipo) soma += peso * pontosLei(tipo, lei, para, de);
  }
  return Math.abs(soma) < SEM_OPINIAO ? 0 : soma;
}

export function votar(
  congresso: Congresso,
  coligacao: string[],
  tipos: TipoGrupo[],
  lei: Lei,
  de: ValorLei | undefined,
  para: ValorLei,
): Votacao {
  const exorbitante = ehExorbitante(lei, de, para);
  const votos: Record<string, Voto> = {};
  let sim = 0;
  let total = 0;
  for (const p of congresso.partidos) {
    total += p.cadeiras;
    let voto: Voto;
    if (exorbitante) voto = "nao";
    else if (p.id === congresso.governo) voto = "sim";
    else {
      const o = opiniao(p, tipos, lei, de, para);
      if (o !== 0) voto = o > 0 ? "sim" : "nao";
      else voto = coligacao.includes(p.id) ? "sim" : "nao";
    }
    votos[p.id] = voto;
    if (voto === "sim") sim += p.cadeiras;
  }
  return {
    lei: lei.id,
    valor: para,
    exorbitante,
    votos,
    sim,
    nao: total - sim,
    aprovada: sim > congresso.maioria * total,
  };
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

/** Coligação depois de os partidos da base olharem os seus grupos. */
export function coligacaoAtual(
  congresso: Congresso,
  coligacao: string[],
  grupos: Record<string, Grupo>,
): string[] {
  return coligacao.filter((id) => {
    if (id === congresso.governo) return true;
    const p = congresso.partidos.find((x) => x.id === id) as Partido;
    return satisfacaoDoPartido(p, grupos) >= LIMIAR_SAIDA;
  });
}
