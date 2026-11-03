// Grupos de interesse: leem os pops, os índices e as leis. Tipos vêm do
// mundo. Comportamento em grupos.md.
import {
  EIXOS,
  fracaoDaBussola,
  type Lei,
  type PontoBussola,
  type ValorLei,
} from "../leis";
import type { Pop, TipoPop } from "../populacao";

/** Tipo de grupo do mundo. */
export interface TipoGrupo {
  id: string;
  /** Fração de cada pop que pertence ao grupo (0 a 1). */
  membros: Record<string, number>;
  /** Índices que o grupo cobra e o sentido que quer (1 subir, -1 descer). */
  cobra: { indice: string; sentido: 1 | -1 }[];
  /** Posição na bússola (−1 a +1 por eixo). */
  bussola: PontoBussola;
  /** O quanto o grupo liga para cada eixo (0 a 1); ausente = 0. */
  peso: PontoBussola;
}

/** Grupo no estado. */
export interface Grupo {
  pessoas: number;
  /** Renda real média dos membros (renda ÷ nível de preços × 100). */
  renda_real: number;
  satisfacao: number;
  /** % do grupo. */
  radicais: number;
  /** % do grupo. */
  lealistas: number;
}

/** Turno 0: a referência contra a qual os grupos medem tudo. */
export interface Marco {
  indices: Record<string, number>;
  leis: Record<string, ValorLei>;
  renda_real: Record<string, number>;
  /** Renda real de cada pop; sem ela, a vida não empurra o pop. */
  renda_pop?: Record<string, number>;
}

/** Quanto cada pop andou na bússola desde o começo. */
export type Deslize = Record<string, PontoBussola>;

const NEUTRO = 50;
const LIMITE_RENDA = 25;
const LIMITE_INDICE = 15;
/** Pontos por 1 unidade de eixo que a lei se aproxima do grupo (peso 1). */
const PONTOS_EIXO = 50;
/** Uma lei só, contra o marco, move o grupo no máximo isto. */
const LIMITE_LEI = 15;
const BASE_ESTOQUE = 5;
const LIMIAR_RADICAL = 35;
const LIMIAR_LEAL = 65;
const GANHO_ESTOQUE = 2;
const PASSO_ESTOQUE = 1;

/** Quanto um pop anda por turno em cada força (vida e governo). */
const PASSO_BUSSOLA = 0.02;
/** Quanto um pop pode se afastar do ponto onde começou. */
const LIMITE_DESLIZE = 0.3;
/** Renda real que empurra o pop com força cheia (±25% do esperado). */
const LIMITE_VIDA = 0.25;

const prender = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/** Motivo de os grupos não fecharem, ou null. */
export function motivoGruposInvalidos(
  tipos: TipoGrupo[],
  pops: string[],
  indices: string[],
): string | null {
  const ids = tipos.map((t) => t.id);
  for (const t of tipos) {
    const membros = Object.entries(t.membros);
    if (membros.length === 0) return `grupo ${t.id}: sem membros`;
    for (const [pop, f] of membros) {
      if (!pops.includes(pop)) return `grupo ${t.id}: pop "${pop}" não existe`;
      if (!(f > 0 && f <= 1))
        return `grupo ${t.id}: fração de ${pop} fora de (0, 1]`;
    }
    for (const c of t.cobra)
      if (!indices.includes(c.indice))
        return `grupo ${t.id}: índice "${c.indice}" não existe`;
    for (const eixo of EIXOS) {
      const pos = t.bussola[eixo] ?? 0;
      const peso = t.peso[eixo] ?? 0;
      if (!(pos >= -1 && pos <= 1))
        return `grupo ${t.id}: bússola ${eixo} fora de [-1, 1]`;
      if (!(peso >= 0 && peso <= 1))
        return `grupo ${t.id}: peso ${eixo} fora de [0, 1]`;
    }
  }
  if (new Set(ids).size !== ids.length) return "grupo repetido";
  return null;
}

/** Pessoas e renda real média dos membros de um grupo. */
export function rendaDoGrupo(
  tipo: TipoGrupo,
  pops: Record<string, Pop>,
  indice_precos: number,
): { pessoas: number; renda_real: number } {
  let pessoas = 0;
  let renda = 0;
  for (const [id, f] of Object.entries(tipo.membros)) {
    pessoas += pops[id].pessoas * f;
    renda += pops[id].pessoas * f * pops[id].renda;
  }
  return { pessoas, renda_real: ((renda / pessoas) * 100) / indice_precos };
}

/**
 * Onde a lei fica na bússola com este valor. Lei contínua: na reta entre o
 * mínimo e o máximo da faixa (não legislada = mínimo). Lei de opções: a
 * posição da opção (nenhuma = sem posição). Null: a lei não tem posição.
 */
export function posicaoDaLei(
  lei: Lei,
  valor: ValorLei | undefined,
): PontoBussola | null {
  if (lei.forma === "continua") {
    if (!lei.bussola) return null;
    const t = fracaoDaBussola(lei, valor as number | undefined);
    const ponto: PontoBussola = {};
    for (const eixo of EIXOS) {
      const de = lei.bussola.min[eixo] ?? 0;
      ponto[eixo] = de + t * ((lei.bussola.max[eixo] ?? 0) - de);
    }
    return ponto;
  }
  return lei.opcoes.find((o) => o.id === valor)?.bussola ?? null;
}

/**
 * Pontos que a lei dá ao grupo ao ir de `antes` para `agora`: eixo por eixo,
 * o quanto ela se aproximou dele × o peso do eixo × 50, até ±15.
 */
export function pontosLei(
  tipo: TipoGrupo,
  lei: Lei,
  agora: ValorLei | undefined,
  antes: ValorLei | undefined,
): number {
  const de = posicaoDaLei(lei, antes);
  const para = posicaoDaLei(lei, agora);
  let pontos = 0;
  for (const eixo of EIXOS) {
    const peso = tipo.peso[eixo] ?? 0;
    if (!peso) continue;
    const g = tipo.bussola[eixo] ?? 0;
    // sem posição (opção sem bússola): não puxa o grupo para lado nenhum
    const longe = (p: PontoBussola | null) =>
      p ? Math.abs((p[eixo] ?? 0) - g) : null;
    const d0 = longe(de);
    const d1 = longe(para);
    if (d0 === null || d1 === null) continue;
    pontos += (d0 - d1) * peso * PONTOS_EIXO;
  }
  return prender(pontos, -LIMITE_LEI, LIMITE_LEI);
}

/** Pontos que as leis dão ao grupo, contra o marco. */
export function pontosLeis(
  tipo: TipoGrupo,
  leis: Record<string, Lei>,
  agora: Record<string, ValorLei>,
  marco: Record<string, ValorLei>,
): number {
  let pontos = 0;
  for (const lei of Object.values(leis))
    pontos += pontosLei(tipo, lei, agora[lei.id], marco[lei.id]);
  return pontos;
}

/** Satisfação de 0 a 100; 50 no marco. */
export function satisfacao(
  tipo: TipoGrupo,
  renda_real: number,
  indices: Record<string, number>,
  leis: Record<string, Lei>,
  vigentes: Record<string, ValorLei>,
  marco: Marco,
): number {
  const variacao = (renda_real / marco.renda_real[tipo.id] - 1) * 100;
  let pontos = prender(variacao, -LIMITE_RENDA, LIMITE_RENDA);
  for (const { indice, sentido } of tipo.cobra)
    pontos += prender(
      sentido * (indices[indice] - marco.indices[indice]),
      -LIMITE_INDICE,
      LIMITE_INDICE,
    );
  pontos += pontosLeis(tipo, leis, vigentes, marco.leis);
  return prender(NEUTRO + pontos, 0, 100);
}

/** Para onde radicais e lealistas andam com esta satisfação. */
export function alvosEstoques(sat: number): {
  radicais: number;
  lealistas: number;
} {
  return {
    radicais: BASE_ESTOQUE + GANHO_ESTOQUE * Math.max(0, LIMIAR_RADICAL - sat),
    lealistas: BASE_ESTOQUE + GANHO_ESTOQUE * Math.max(0, sat - LIMIAR_LEAL),
  };
}

const andar = (de: number, para: number) =>
  de + prender(para - de, -PASSO_ESTOQUE, PASSO_ESTOQUE);

export interface EntradaGrupos {
  pops: Record<string, Pop>;
  indice_precos: number;
  indices: Record<string, number>;
  vigentes: Record<string, ValorLei>;
  marco: Marco;
  /**
   * Quanto a renda real cresce desde o marco no ritmo normal do país
   * (1 = nada). O grupo mede a renda contra o que espera, não contra o marco.
   */
  esperado?: number;
  /** Grupos do turno anterior; sem eles, radicais e lealistas começam na base. */
  anteriores?: Record<string, Grupo>;
}

export function calcularGrupos(
  tipos: TipoGrupo[],
  leis: Record<string, Lei>,
  entrada: EntradaGrupos,
): Record<string, Grupo> {
  const grupos: Record<string, Grupo> = {};
  for (const t of tipos) {
    const { pessoas, renda_real } = rendaDoGrupo(
      t,
      entrada.pops,
      entrada.indice_precos,
    );
    const sat = satisfacao(
      t,
      renda_real / (entrada.esperado ?? 1),
      entrada.indices,
      leis,
      entrada.vigentes,
      entrada.marco,
    );
    const alvo = alvosEstoques(sat);
    const antes = entrada.anteriores?.[t.id];
    grupos[t.id] = {
      pessoas,
      renda_real,
      satisfacao: sat,
      radicais: antes ? andar(antes.radicais, alvo.radicais) : BASE_ESTOQUE,
      lealistas: antes ? andar(antes.lealistas, alvo.lealistas) : BASE_ESTOQUE,
    };
  }
  return grupos;
}

/**
 * Os grupos com a bússola de hoje: a declarada mais a média, por pessoas, do
 * quanto os pops deles andaram. Sem deslize, são os próprios tipos.
 */
export function gruposComDeslize(
  tipos: TipoGrupo[],
  pops: Record<string, Pop>,
  deslize: Deslize | undefined,
): TipoGrupo[] {
  if (!deslize) return tipos;
  return tipos.map((t) => {
    let total = 0;
    const soma: Record<string, number> = {};
    for (const [id, f] of Object.entries(t.membros)) {
      const peso = (pops[id]?.pessoas ?? 0) * f;
      total += peso;
      for (const eixo of EIXOS)
        soma[eixo] = (soma[eixo] ?? 0) + peso * (deslize[id]?.[eixo] ?? 0);
    }
    if (total === 0) return t;
    const bussola: PontoBussola = {};
    for (const eixo of EIXOS)
      bussola[eixo] = prender(
        (t.bussola[eixo] ?? 0) + soma[eixo] / total,
        -1,
        1,
      );
    return { ...t, bussola };
  });
}

export interface EntradaDeslize {
  pops: Record<string, Pop>;
  /** Grupos já calculados neste turno. */
  grupos: Record<string, Grupo>;
  /** Tipos dos grupos, para saber a que grupos cada pop pertence. */
  tipos: TipoGrupo[];
  /** Onde o país está na bússola (média das leis). */
  pais: Required<PontoBussola>;
  indice_precos: number;
  esperado: number;
  marco: Marco;
}

/**
 * Um turno de vida dos pops na bússola. Duas forças, de até ±0,02 por eixo:
 * - vida (econômico): renda real abaixo do esperado puxa o pop para a
 *   esquerda, acima para a direita;
 * - governo (os dois eixos): pop satisfeito (média dos seus grupos) se
 *   aproxima da posição do país, insatisfeito se afasta.
 * Cada pop fica a no máximo 0,3 de onde começou e dentro de −1 a +1.
 */
export function deslizarPops(
  tipos: TipoPop[],
  atual: Deslize | undefined,
  e: EntradaDeslize,
): Deslize {
  const novo: Deslize = {};
  for (const t of tipos) {
    let peso = 0;
    let soma = 0;
    for (const g of e.tipos) {
      const f = g.membros[t.id];
      if (!f || !e.grupos[g.id]) continue;
      peso += f;
      soma += f * e.grupos[g.id].satisfacao;
    }
    const gosto = peso ? (soma / peso - NEUTRO) / NEUTRO : 0;
    const marcoRenda = e.marco.renda_pop?.[t.id];
    const renda = (e.pops[t.id].renda * 100) / e.indice_precos;
    const vida = marcoRenda
      ? prender(
          renda / marcoRenda / e.esperado - 1,
          -LIMITE_VIDA,
          LIMITE_VIDA,
        ) / LIMITE_VIDA
      : 0;
    const ponto: PontoBussola = {};
    for (const eixo of EIXOS) {
      const base = t.bussola[eixo] ?? 0;
      const desl = atual?.[t.id]?.[eixo] ?? 0;
      const aqui = base + desl;
      let passo = PASSO_BUSSOLA * gosto * prender(e.pais[eixo] - aqui, -1, 1);
      if (eixo === "economico") passo += PASSO_BUSSOLA * vida;
      const alvo = prender(
        prender(desl + passo, -LIMITE_DESLIZE, LIMITE_DESLIZE),
        -1 - base,
        1 - base,
      );
      ponto[eixo] = alvo;
    }
    novo[t.id] = ponto;
  }
  return novo;
}
