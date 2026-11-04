// Estoque de casas: quantas famílias têm casa formal, quantas moram em casa
// precária e quantas casas estão em obra. Déficit e favela saem dessa conta.
// O motor não conhece nomes de lei nem de índice. Regras em moradia.md.
import type { RegraDasObras } from "../mercado/construcoes";
import { atrasoDasObras } from "../mercado/construcoes";

const TURNOS_POR_ANO = 6;

/** O que o mundo declara (`mundo/moradia/moradia.json`). */
export interface RegraDaMoradia {
  indice_deficit: string;
  indice_favela: string;
  indice_preco: string;
  /** Lei contínua (fração do PIB) com que o governo constrói. */
  lei_verba: string;
  pessoas_por_familia: number;
  /** Preço de uma casa do governo, em anos de PIB por pessoa. */
  custo_casa: number;
  /** Parte da distância à favela "natural" que anda por turno (0 a 1). */
  autoconstrucao: number;
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
}

/** Famílias do país: as pessoas dos pops divididas pelo tamanho da família. */
export const familias = (regra: RegraDaMoradia, populacao: number) =>
  populacao / regra.pessoas_por_familia;

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
 * Um turno: casas desgastam, as obras prontas entram, quem ficou sem casa
 * levanta casa precária, e governo e empresas começam obras novas.
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
  const semCasa = total - formais;
  const alvo = semCasa * m.parte_precaria;
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
  return { ...m, formais, precarias, obras: fila };
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
