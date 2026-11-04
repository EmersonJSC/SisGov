// Estoque de casas: quantas famílias têm casa formal, quantas moram em casa
// precária e quantas casas estão em obra. Déficit e favela saem dessa conta.
// O motor não conhece nomes de lei nem de índice. Regras em moradia.md.
import type { RegraDasObras } from "../mercado/construcoes";
import { atrasoDasObras } from "../mercado/construcoes";
import type { Pop } from "../populacao";

const TURNOS_POR_ANO = 6;

/** O que o mundo declara (`mundo/moradia/moradia.json`). */
export interface RegraDaMoradia {
  indice_deficit: string;
  indice_favela: string;
  indice_preco: string;
  indice_terra: string;
  indice_pobreza: string;
  /** Pops que vivem do campo. */
  pops_campo: string[];
  /** Lei contínua (fração do PIB) com que o governo constrói. */
  lei_verba: string;
  pessoas_por_familia: number;
  /** Preço de uma casa do governo, em anos de PIB por pessoa. */
  custo_casa: number;
  /** Parte da distância à favela "natural" que anda por turno (0 a 1). */
  autoconstrucao: number;
  /** Parte das famílias do campo que perde lugar por ponto de concentração. */
  campo_por_ponto: number;
  /** Parte da distância ao êxodo "natural" que anda por turno (0 a 1). */
  exodo_velocidade: number;
  /** Parte a mais de quem levanta casa precária por ponto de pobreza. */
  pobreza_por_ponto: number;
}

export interface ObraDeCasas {
  casas: number;
  /** Turnos de trabalho que faltam (pode ser fracionário). */
  falta: number;
}

export interface MoradiaNoEstado {
  formais: number;
  precarias: number;
  obras: ObraDeCasas[];
  /** Casas que as empresas começam por turno no ritmo do turno 0. */
  ritmo_privado: number;
  /** Quem fica sem casa formal e levanta casa precária, no turno 0 (0 a 1). */
  parte_precaria: number;
  /** Famílias que saíram do campo desde o turno 0; negativo: entraram. Ausente em partida salva antes dele. */
  exodo?: number;
}

export interface TurnoDaMoradia {
  populacao: number;
  /** Valor da lei de verba (fração do PIB). */
  verba: number;
  /** Índice de atraso de hoje e do turno 0 (0 a 100). */
  atraso: number;
  atraso_inicial: number;
  /** Capacidade do setor que constrói: hoje ÷ turno 0. */
  setor: number;
  /** Preço da moradia: hoje ÷ turno 0. */
  preco: number;
  /** Ânimo do investimento (juro e imposto), 0 a 2. */
  animo: number;
  /** Famílias dos pops do campo. */
  familias_campo: number;
  /** Concentração de terra e pobreza: pontos acima do turno 0. */
  concentracao: number;
  pobreza: number;
}

/** Famílias do país: as pessoas dos pops divididas pelo tamanho da família. */
export const familias = (regra: RegraDaMoradia, populacao: number) =>
  populacao / regra.pessoas_por_familia;

/** Pessoas dos pops que vivem do campo. */
export const pessoasNoCampo = (
  regra: RegraDaMoradia,
  pops: Record<string, Pop>,
) => regra.pops_campo.reduce((soma, id) => soma + pops[id].pessoas, 0);

/** Famílias que deixam o campo neste turno; negativo: voltam para ele. */
function movimentoDoCampo(
  regra: RegraDaMoradia,
  exodo: number,
  formais: number,
  total: number,
  turno: TurnoDaMoradia,
): number {
  const fora = Math.min(1, regra.campo_por_ponto * turno.concentracao);
  const passo =
    regra.exodo_velocidade * (turno.familias_campo * fora - exodo);
  // Sai quem tem casa formal; volta quem não tem.
  return Math.max(formais - total, Math.min(formais, passo));
}

/** Casas que a verba paga num turno; a corrupção encarece. */
function casasDoGoverno(
  regra: RegraDaMoradia,
  populacao: number,
  verba: number,
  atraso: number,
): number {
  const custo = regra.custo_casa * atrasoDasObras(atraso).custo;
  return (verba * populacao) / custo / TURNOS_POR_ANO;
}

/**
 * Estoque do turno 0, contado a partir dos índices do país. As obras em
 * andamento repõem o desgaste: o país começa parado.
 */
export function moradiaInicial(
  regra: RegraDaMoradia,
  obras: RegraDasObras,
  pais: {
    populacao: number;
    deficit: number;
    favela: number;
    verba: number;
    atraso: number;
  },
): MoradiaNoEstado {
  const total = familias(regra, pais.populacao);
  const formais = total * (1 - pais.deficit / 100);
  const reposicao = (formais * obras.desgaste) / TURNOS_POR_ANO;
  const governo = casasDoGoverno(
    regra,
    pais.populacao,
    pais.verba,
    pais.atraso,
  );
  const lento = atrasoDasObras(pais.atraso).prazo;
  const fila: ObraDeCasas[] = [];
  for (let t = 1; t <= Math.ceil(obras.prazo * lento); t++)
    fila.push({ casas: reposicao, falta: Math.min(obras.prazo, t / lento) });
  return {
    formais,
    precarias: total * (pais.favela / 100),
    obras: fila,
    ritmo_privado: Math.max(0, reposicao - governo),
    parte_precaria: pais.deficit > 0 ? pais.favela / pais.deficit : 0,
  };
}

/**
 * Um turno: casas desgastam, as obras prontas entram, famílias saem do campo
 * ou voltam, quem ficou sem casa levanta casa precária, e governo e empresas
 * começam obras novas.
 */
export function andarMoradia(
  regra: RegraDaMoradia,
  obras: RegraDasObras,
  m: MoradiaNoEstado,
  turno: TurnoDaMoradia,
): MoradiaNoEstado {
  const total = familias(regra, turno.populacao);
  const passo = 1 / atrasoDasObras(turno.atraso).prazo;
  let formais = m.formais * (1 - obras.desgaste / TURNOS_POR_ANO);
  const fila: ObraDeCasas[] = [];
  for (const obra of m.obras) {
    const falta = obra.falta - passo;
    if (falta <= 1e-9) formais += obra.casas;
    else fila.push({ ...obra, falta });
  }
  formais = Math.min(total, formais);
  const exodo = m.exodo ?? 0;
  const movimento = movimentoDoCampo(regra, exodo, formais, total, turno);
  formais -= movimento;
  const semCasa = total - formais;
  const parte = Math.min(
    1,
    Math.max(0, m.parte_precaria + regra.pobreza_por_ponto * turno.pobreza),
  );
  const alvo = semCasa * parte;
  const precarias = Math.min(
    semCasa,
    m.precarias + regra.autoconstrucao * (alvo - m.precarias),
  );
  const custo =
    atrasoDasObras(turno.atraso_inicial).custo /
    atrasoDasObras(turno.atraso).custo;
  const privadas =
    m.ritmo_privado * turno.setor * turno.preco * turno.animo * custo;
  const governo = casasDoGoverno(
    regra,
    turno.populacao,
    turno.verba,
    turno.atraso,
  );
  fila.push({ casas: privadas + governo, falta: obras.prazo });
  return {
    ...m,
    formais,
    precarias,
    obras: fila,
    exodo: exodo + movimento,
  };
}

/** Pontos de déficit que uma verba tira por ano (em % das famílias). */
export function pontosDaVerbaPorAno(
  regra: RegraDaMoradia,
  verba: number,
  atraso: number,
): number {
  const custo = regra.custo_casa * atrasoDasObras(atraso).custo;
  return ((verba * regra.pessoas_por_familia) / custo) * 100;
}

/** Pontos de déficit que a concentração move, quando o êxodo termina. */
export function pontosDoExodo(
  regra: RegraDaMoradia,
  concentracao: number,
  noCampo: number,
  populacao: number,
): number {
  return regra.campo_por_ponto * concentracao * (noCampo / populacao) * 100;
}

/** Déficit e favela contados, em % das famílias. */
export function indicesDaMoradia(
  regra: RegraDaMoradia,
  m: MoradiaNoEstado,
  populacao: number,
) {
  const total = familias(regra, populacao);
  return {
    deficit: (1 - m.formais / total) * 100,
    favela: (m.precarias / total) * 100,
  };
}
