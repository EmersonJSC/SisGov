// Pops: fatias da população com renda calculada pelo motor. Tipos vêm do
// mundo, parcelas do país. Comportamento em populacao.md.

import type { PontoBussola } from "../leis";

export const ESTRATOS = ["pobre", "medio", "rico"] as const;
export type Estrato = (typeof ESTRATOS)[number];

export function ehEstrato(v: unknown): v is Estrato {
  return ESTRATOS.includes(v as never);
}

/** Para onde vai quem sobe: o pop de cima e o índice que a subida exige. */
export interface Escada {
  para: string;
  /** Índice (0 a 100) que dá a chance de subir, ex.: onde estudar. */
  exige: string;
}

/** Tipo de pop do mundo. */
export interface TipoPop {
  id: string;
  estrato: Estrato;
  /** Quem sobe de estrato vai para este pop; sem isso, ninguém sobe. */
  sobe?: Escada;
  /** Quem desce de estrato vai para este pop; sem isso, ninguém desce. */
  desce?: string;
  /** Onde o pop começa na bússola (−1 a +1 por eixo); desliza com a vida. */
  bussola: PontoBussola;
  /** Parte da renda paga pelo Estado (0 a 1); anda com o gasto público. */
  publico?: number;
  /**
   * Quem não tem setor e vive do que outros pops pagam (ex.: doméstico):
   * peso de cada estrato que paga; a renda anda com a renda dele.
   */
  pago_por?: Partial<Record<Estrato, number>>;
}

/**
 * De onde vem a renda bruta (fase dos pops, 15/nov). Cada pop tem uma parte da
 * renda em cada fonte, medida no turno 0; cada fonte vale hoje um tanto do que
 * valia. A soma das rendas continua sendo o PIB: a fonte que cresce tira das
 * outras.
 */
export interface FontesDaRenda {
  /** Pop → fonte → parte da renda bruta do pop (soma 1). */
  partes: Record<string, Record<string, number>>;
  /** Fonte → quanto vale hoje ÷ no turno 0 (ausente = 1). */
  indice: Record<string, number>;
}

/** O que o país declara de cada tipo de pop (frações que somam 1). */
export interface PopPais {
  parcela_pessoas: number;
  parcela_renda: number;
}

/** Pop no estado. Valores por pessoa, ao ano, na moeda do país. */
export interface Pop {
  pessoas: number;
  renda_bruta: number;
  imposto: number;
  transferencia: number;
  /** Renda disponível: bruta − imposto + transferência. */
  renda: number;
}

/** Valores anuais na moeda do país. */
export interface EntradaPops {
  populacao: number;
  pib_nominal: number;
  /** Imposto de renda de todos, dividido pela parte da renda de cada pop. */
  imposto_renda: number;
  /**
   * Imposto cobrado de um estrato só (ex.: imposto de renda do rico, imposto
   * sobre patrimônio), dividido pela renda dentro do estrato.
   */
  impostos?: Partial<Record<Estrato, number>>;
  transferencias: Partial<Record<Estrato, number>>;
  /** Quem trocou de pop até hoje, em fração da população (soma zero). */
  migracao?: Migracao;
  /** De onde vem a renda; sem isso, cada pop fica com a parte declarada do PIB. */
  fontes?: FontesDaRenda;
}

/** Fração da população que entrou (+) ou saiu (−) de cada pop. */
export type Migracao = Record<string, number>;

/** Dentro de um pop, a renda vai da média −50% à média +50%. */
const ESPALHO = 0.5;

/** Renda média das pessoas dos pops. */
export function rendaMedia(
  pops: Record<string, { pessoas: number; renda: number }>,
): number {
  const lista = Object.values(pops);
  const pessoas = lista.reduce((s, p) => s + p.pessoas, 0);
  const renda = lista.reduce((s, p) => s + p.pessoas * p.renda, 0);
  return pessoas > 0 ? renda / pessoas : 0;
}

/** Parte das pessoas (0 a 1) com renda abaixo de `minimo`. */
export function parteAbaixoDe(
  pops: Record<string, { pessoas: number; renda: number }>,
  minimo: number,
): number {
  const lista = Object.values(pops);
  const pessoas = lista.reduce((s, p) => s + p.pessoas, 0);
  if (pessoas <= 0) return 0;
  const abaixo = lista.reduce((soma, p) => {
    if (p.renda <= 0) return soma + p.pessoas;
    const piso = p.renda * (1 - ESPALHO);
    const faixa = p.renda * 2 * ESPALHO;
    return soma + p.pessoas * Math.min(1, Math.max(0, (minimo - piso) / faixa));
  }, 0);
  return abaixo / pessoas;
}

/** Motivo de as parcelas do país não fecharem, ou null. */
export function motivoPopsInvalidos(
  tipos: TipoPop[],
  pais: Record<string, PopPais>,
): string | null {
  for (const id of Object.keys(pais))
    if (!tipos.some((t) => t.id === id)) return `pop "${id}" não existe`;
  let pessoas = 0;
  let renda = 0;
  for (const { id } of tipos) {
    const p = pais[id];
    if (!p) return `falta o pop ${id}`;
    if (!(p.parcela_pessoas > 0) || !(p.parcela_renda >= 0))
      return `pop ${id}: parcela_pessoas > 0 e parcela_renda ≥ 0`;
    pessoas += p.parcela_pessoas;
    renda += p.parcela_renda;
  }
  if (Math.abs(pessoas - 1) > 1e-6)
    return `parcela_pessoas soma ${pessoas}, precisa ser 1`;
  if (Math.abs(renda - 1) > 1e-6)
    return `parcela_renda soma ${renda}, precisa ser 1`;
  return null;
}

export function calcularPops(
  tipos: TipoPop[],
  pais: Record<string, PopPais>,
  entrada: EntradaPops,
): Record<string, Pop> {
  const mig = entrada.migracao ?? {};
  const fontes = entrada.fontes;
  const mexeu = fontes !== undefined || Object.values(mig).some((v) => v !== 0);
  const fracao = (id: string) => pais[id].parcela_pessoas + (mig[id] ?? 0);
  // Quanto as fontes do pop valem hoje contra o turno 0.
  const fator = (id: string) => {
    const partes = fontes?.partes[id];
    if (!partes) return 1;
    let f = 0;
    for (const [fonte, parte] of Object.entries(partes))
      f += parte * (fontes.indice[fonte] ?? 1);
    return f;
  };
  // Quem muda de pop passa a ganhar como o pop novo; a soma da renda continua
  // sendo o PIB.
  const pesoRenda = (id: string) =>
    (fracao(id) * pais[id].parcela_renda * fator(id)) /
    pais[id].parcela_pessoas;
  const total = mexeu ? tipos.reduce((s, t) => s + pesoRenda(t.id), 0) : 1;
  const rendaDe = (id: string) =>
    mexeu && total > 0 ? pesoRenda(id) / total : pais[id].parcela_renda;

  const pessoasEstrato: Partial<Record<Estrato, number>> = {};
  for (const t of tipos)
    pessoasEstrato[t.estrato] =
      (pessoasEstrato[t.estrato] ?? 0) + fracao(t.id) * entrada.populacao;

  const rendaEstrato: Partial<Record<Estrato, number>> = {};
  for (const t of tipos)
    rendaEstrato[t.estrato] = (rendaEstrato[t.estrato] ?? 0) + rendaDe(t.id);

  const pops: Record<string, Pop> = {};
  for (const t of tipos) {
    const parcela_renda = rendaDe(t.id);
    const pessoas = fracao(t.id) * entrada.populacao;
    const renda_bruta = (parcela_renda * entrada.pib_nominal) / pessoas;
    const doEstrato = entrada.impostos?.[t.estrato] ?? 0;
    const imposto =
      (parcela_renda * entrada.imposto_renda +
        (doEstrato > 0
          ? (parcela_renda / (rendaEstrato[t.estrato] as number)) * doEstrato
          : 0)) /
      pessoas;
    const transferencia =
      (entrada.transferencias[t.estrato] ?? 0) /
      (pessoasEstrato[t.estrato] as number);
    pops[t.id] = {
      pessoas,
      renda_bruta,
      imposto,
      transferencia,
      renda: renda_bruta - imposto + transferencia,
    };
  }
  return pops;
}

/** Motivo de `publico` e `pago_por` dos tipos não fecharem, ou null. */
export function motivoFontesInvalidas(tipos: TipoPop[]): string | null {
  for (const t of tipos) {
    if (t.publico !== undefined && !(t.publico >= 0 && t.publico <= 1))
      return `pop ${t.id}: publico precisa ser de 0 a 1`;
    if (t.pago_por) {
      const pesos = Object.entries(t.pago_por);
      if (pesos.length === 0) return `pop ${t.id}: pago_por vazio`;
      for (const [e, p] of pesos)
        if (!ehEstrato(e) || !(p! > 0))
          return `pop ${t.id}: pago_por precisa de estratos com peso > 0`;
    }
  }
  return null;
}

/** Motivo de as escadas (sobe/desce) dos tipos não fecharem, ou null. */
export function motivoEscadasInvalidas(tipos: TipoPop[]): string | null {
  const ordem = (e: Estrato) => ESTRATOS.indexOf(e);
  const por = (id: string) => tipos.find((t) => t.id === id);
  for (const t of tipos) {
    if (t.sobe) {
      const alvo = por(t.sobe.para);
      if (!alvo)
        return `pop ${t.id}: sobe para "${t.sobe.para}", que não existe`;
      if (ordem(alvo.estrato) <= ordem(t.estrato))
        return `pop ${t.id}: sobe para ${alvo.id}, que não é de estrato mais alto`;
      if (!t.sobe.exige) return `pop ${t.id}: sobe precisa de "exige"`;
    }
    if (t.desce) {
      const alvo = por(t.desce);
      if (!alvo) return `pop ${t.id}: desce para "${t.desce}", que não existe`;
      if (ordem(alvo.estrato) >= ordem(t.estrato))
        return `pop ${t.id}: desce para ${alvo.id}, que não é de estrato mais baixo`;
    }
  }
  return null;
}

/** Fração da população de um pop que troca de estrato por turno, no máximo. */
export const PASSO_ESTRATO = 0.01;
/** Quanto a renda real do pop foge do esperado para a força ser total (25%). */
const LIMITE_VIDA_ESTRATO = 0.25;
/** Um pop ganha ou perde no máximo 30% do que declarou. */
export const LIMITE_MIGRACAO = 0.3;

export interface EntradaMigracao {
  pops: Record<string, Pop>;
  populacao: number;
  /** Renda real de cada pop no turno 0; sem ela ninguém muda de estrato. */
  renda_pop: Record<string, number> | undefined;
  indice_precos: number;
  /** Quanto a renda real cresce no ritmo normal desde o turno 0. */
  esperado: number;
  /** Os índices do jogo (essenciais e jogabilidade), de 0 a 100. */
  indices: Record<string, number>;
}

const entre = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/**
 * Um turno de mobilidade. Renda real acima do esperado faz um pouco de gente
 * subir, na medida do índice que o pop exige (ex.: instrução); abaixo do
 * esperado faz um pouco descer. A população total não muda.
 */
export function migrarPops(
  tipos: TipoPop[],
  pais: Record<string, PopPais>,
  atual: Migracao | undefined,
  e: EntradaMigracao,
): Migracao {
  const novo: Migracao = { ...atual };
  if (!e.renda_pop) return novo;
  for (const t of tipos) {
    const marco = e.renda_pop[t.id];
    const pop = e.pops[t.id];
    if (!marco || !pop) continue;
    const renda = (pop.renda * 100) / e.indice_precos;
    const vida =
      entre(
        renda / marco / e.esperado - 1,
        -LIMITE_VIDA_ESTRATO,
        LIMITE_VIDA_ESTRATO,
      ) / LIMITE_VIDA_ESTRATO;
    let alvo: string | undefined;
    let forca = 0;
    if (vida > 0 && t.sobe) {
      alvo = t.sobe.para;
      forca = vida * entre((e.indices[t.sobe.exige] ?? 0) / 100, 0, 1);
    } else if (vida < 0 && t.desce) {
      alvo = t.desce;
      forca = -vida;
    }
    if (!alvo || forca <= 0) continue;
    const daqui = pais[t.id].parcela_pessoas;
    const dali = pais[alvo].parcela_pessoas;
    const saiu = novo[t.id] ?? 0;
    const entrou = novo[alvo] ?? 0;
    const fluxo = Math.min(
      (pop.pessoas / e.populacao) * PASSO_ESTRATO * forca,
      saiu + LIMITE_MIGRACAO * daqui,
      LIMITE_MIGRACAO * dali - entrou,
    );
    if (fluxo <= 0) continue;
    novo[t.id] = saiu - fluxo;
    novo[alvo] = entrou + fluxo;
  }
  return novo;
}
