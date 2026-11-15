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
  /**
   * Outro pop da mesma faixa para onde a gente vai quando ele melhora mais
   * (ex.: o eletricista que abre a oficina). `exige` é um índice que freia.
   */
  muda?: { para: string; exige?: string };
  /** Onde o pop começa na bússola (−1 a +1 por eixo); desliza com a vida. */
  bussola: PontoBussola;
  /** Parte da renda paga pelo Estado (0 a 1); anda com o gasto público. */
  publico?: number;
  /**
   * Quem não tem setor e vive do que outros pops pagam (ex.: doméstico):
   * peso de cada estrato que paga; a renda anda com a renda dele.
   */
  pago_por?: Partial<Record<Estrato, number>>;
  /** Peso do pop no dinheiro desviado pela corrupção dos órgãos. */
  desvio?: number;
  /**
   * Pop sem estrato fixo (ex.: aposentados): parte das pessoas e da renda em
   * cada estrato (cada uma soma 1). Imposto e transferência de estrato pegam
   * cada pedaço no seu; `estrato` fica para subir e descer.
   */
  divisao?: Partial<Record<Estrato, { pessoas: number; renda: number }>>;
  /**
   * Vive da família (ex.: crianças): quanto gasta contra um adulto da casa
   * (0,5 = metade). Não tem renda do PIB: os adultos do mesmo estrato dão a
   * parte dele. Não paga imposto de estrato; a conta da casa conta com ele.
   */
  dependente?: number;
  /** Quanto do pop pode emigrar no fundo do poço (0 a 1); sem isso, vale o do estrato (passo G). */
  emigra?: number;
  /** Quanto o pop liga para cada chave de direito das leis (−1 a 1; passo H). */
  direitos?: Record<string, number>;
  /**
   * Só no dependente: filhos por adulto de cada estrato, em peso (ex.: o
   * pobre 1,3, o rico 0,7). A divisão do dependente sai dos adultos do país.
   */
  filhos?: Partial<Record<Estrato, number>>;
}

/**
 * Divide o dependente com `filhos` pelos estratos dos adultos do país: a
 * parte de cada estrato é adultos × peso dos filhos.
 */
export function comFilhos(
  tipos: TipoPop[],
  pais: Record<string, PopPais>,
): TipoPop[] {
  const adultos: Partial<Record<Estrato, number>> = {};
  for (const t of tipos)
    if (t.dependente === undefined)
      for (const [e, pp] of pedacos(t))
        adultos[e] =
          (adultos[e] ?? 0) + (pais[t.id]?.parcela_pessoas ?? 0) * pp;
  return tipos.map((t) => {
    if (t.dependente === undefined || !t.filhos) return t;
    const pesos = ESTRATOS.map(
      (e) => [e, (adultos[e] ?? 0) * (t.filhos?.[e] ?? 0)] as const,
    );
    const soma = pesos.reduce((a, [, v]) => a + v, 0);
    if (!(soma > 0)) return t;
    const divisao = Object.fromEntries(
      pesos
        .filter(([, v]) => v > 0)
        .map(([e, v]) => [e, { pessoas: v / soma, renda: v / soma }]),
    );
    return { ...t, divisao };
  });
}

/** Pedaços do pop por estrato: [estrato, parte das pessoas, parte da renda]. */
export function pedacos(t: TipoPop): [Estrato, number, number][] {
  return t.divisao
    ? (
        Object.entries(t.divisao) as [
          Estrato,
          { pessoas: number; renda: number },
        ][]
      ).map(([e, d]) => [e, d.pessoas, d.renda])
    : [[t.estrato, 1, 1]];
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
  /** Renda disponível: bruta − imposto + transferência + família. */
  renda: number;
  /** O que a família dá (+, ao dependente) ou tira (−, do adulto), por pessoa (passo E). */
  familia?: number;
  /** O que sobra depois das cestas, descontada a inflação (passo D). */
  poder?: number;
  /** Padrão de vida: 50 = o do turno 0, 1 a 99 (passo D). */
  padrao?: number;
  /** Parte do pop que cada serviço atende (0 a 1; passo H). */
  servicos?: Record<string, number>;
  /** Direito que o pop sente, das leis em vigor (−1 a 1; passo H). */
  direito?: number;
  /** Vive da família: fica fora da conta da casa (passo E). */
  dependente?: boolean;
  /**
   * A casa do pop: os adultos e os dependentes do mesmo estrato que vivem com
   * eles. `pessoas` conta todos; `renda` é a renda por pessoa da casa.
   */
  casa?: { pessoas: number; renda: number };
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
  /** Transferência a um pop só (ex.: aposentadoria), dividida pelas pessoas dele. */
  transferencias_pop?: Record<string, number>;
  /** Quem trocou de pop até hoje, em fração da população (soma zero). */
  migracao?: Migracao;
  /** De onde vem a renda; sem isso, cada pop fica com a parte declarada do PIB. */
  fontes?: FontesDaRenda;
}

/** Fração da população que entrou (+) ou saiu (−) de cada pop. */
export type Migracao = Record<string, number>;

/** Dentro de um pop, a renda vai da média −50% à média +50%. */
export const ESPALHO = 0.5;

type PopDaConta = {
  pessoas: number;
  renda: number;
  dependente?: boolean;
  casa?: { pessoas: number; renda: number };
};
/** Quem paga a conta da casa: a casa de cada pop (com os dependentes dentro). */
const daCasa = (pops: Record<string, PopDaConta>) =>
  Object.values(pops)
    .filter((p) => !p.dependente)
    .map((p) => p.casa ?? p);

/** Renda média das pessoas dos pops (sem quem vive da família). */
export function rendaMedia(pops: Record<string, PopDaConta>): number {
  const lista = daCasa(pops);
  const pessoas = lista.reduce((s, p) => s + p.pessoas, 0);
  const renda = lista.reduce((s, p) => s + p.pessoas * p.renda, 0);
  return pessoas > 0 ? renda / pessoas : 0;
}

/** Parte das pessoas (0 a 1) com renda abaixo de `minimo`, sem quem vive da família. */
export function parteAbaixoDe(
  pops: Record<string, PopDaConta>,
  minimo: number,
): number {
  const lista = daCasa(pops);
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
  const rendaEstrato: Partial<Record<Estrato, number>> = {};
  for (const t of tipos)
    for (const [e, pp, pr] of pedacos(t)) {
      pessoasEstrato[e] =
        (pessoasEstrato[e] ?? 0) + fracao(t.id) * entrada.populacao * pp;
      if (t.dependente === undefined)
        rendaEstrato[e] = (rendaEstrato[e] ?? 0) + rendaDe(t.id) * pr;
    }

  const pops: Record<string, Pop> = {};
  for (const t of tipos) {
    const parcela_renda = rendaDe(t.id);
    const pessoas = fracao(t.id) * entrada.populacao;
    const renda_bruta = (parcela_renda * entrada.pib_nominal) / pessoas;
    let doEstrato = 0;
    let doEstratoTransf = 0;
    for (const [e, pp, pr] of pedacos(t)) {
      const imp = entrada.impostos?.[e] ?? 0;
      if (imp > 0)
        doEstrato += ((parcela_renda * pr) / (rendaEstrato[e] as number)) * imp;
      doEstratoTransf +=
        ((entrada.transferencias[e] ?? 0) * pessoas * pp) /
        (pessoasEstrato[e] as number);
    }
    const imposto =
      (parcela_renda * entrada.imposto_renda + doEstrato) / pessoas;
    const transferencia =
      pessoas > 0
        ? (doEstratoTransf + (entrada.transferencias_pop?.[t.id] ?? 0)) /
          pessoas
        : 0;
    pops[t.id] = {
      pessoas,
      renda_bruta,
      imposto,
      transferencia,
      renda: renda_bruta - imposto + transferencia,
      ...(t.dependente !== undefined ? { dependente: true } : {}),
    };
  }
  return comFamilia(tipos, pops);
}

/**
 * A família sustenta os dependentes (passo E). Em cada estrato há `k`
 * dependentes por adulto; cada adulto fica com 1 unidade de consumo e cada
 * dependente com `dependente` (0,5 = metade). O adulto dá aos seus a parte da
 * renda que é deles, no nível dele; o dependente fica com a média do que
 * recebe. A casa do adulto junta os dele: renda da casa ÷ todos dela. Nenhum
 * dinheiro some, só muda de mão dentro da casa.
 */
function comFamilia(
  tipos: TipoPop[],
  pops: Record<string, Pop>,
): Record<string, Pop> {
  const adultos: Partial<Record<Estrato, number>> = {};
  const dependentes: Partial<Record<Estrato, number>> = {};
  const consumo: Partial<Record<Estrato, number>> = {};
  for (const t of tipos) {
    const p = pops[t.id];
    if (!p) continue;
    for (const [e, pp] of pedacos(t)) {
      if (t.dependente !== undefined) {
        dependentes[e] = (dependentes[e] ?? 0) + p.pessoas * pp;
        consumo[e] = (consumo[e] ?? 0) + p.pessoas * pp * t.dependente;
      } else adultos[e] = (adultos[e] ?? 0) + p.pessoas * pp;
    }
  }
  if (Object.keys(dependentes).length === 0) return pops;
  /** Dependentes e unidades de consumo deles por adulto do estrato. */
  const porAdulto = (e: Estrato) => {
    const a = adultos[e] ?? 0;
    return a > 0
      ? { gente: (dependentes[e] ?? 0) / a, consumo: (consumo[e] ?? 0) / a }
      : { gente: 0, consumo: 0 };
  };
  const recebido: Partial<Record<Estrato, number>> = {};
  const saida: Record<string, Pop> = { ...pops };
  for (const t of tipos) {
    const p = pops[t.id];
    if (!p || t.dependente !== undefined) continue;
    let familia = 0;
    let casaGente = 0;
    for (const [e, pp] of pedacos(t)) {
      const k = porAdulto(e);
      const da = (pp * p.renda * k.consumo) / (1 + k.consumo);
      familia -= da;
      recebido[e] = (recebido[e] ?? 0) + da * p.pessoas;
      casaGente += pp * (1 + k.gente);
    }
    saida[t.id] = {
      ...p,
      familia,
      renda: p.renda + familia,
      casa: { pessoas: p.pessoas * casaGente, renda: p.renda / casaGente },
    };
  }
  for (const t of tipos) {
    const p = pops[t.id];
    if (!p || t.dependente === undefined) continue;
    let familia = 0;
    for (const [e, pp] of pedacos(t)) {
      const d = consumo[e] ?? 0;
      if (d > 0) familia += (pp * (recebido[e] ?? 0) * t.dependente) / d;
    }
    saida[t.id] = { ...p, familia, renda: p.renda + familia };
  }
  return saida;
}

/** Motivo de `publico` e `pago_por` dos tipos não fecharem, ou null. */
export function motivoFontesInvalidas(tipos: TipoPop[]): string | null {
  for (const t of tipos) {
    if (t.publico !== undefined && !(t.publico >= 0 && t.publico <= 1))
      return `pop ${t.id}: publico precisa ser de 0 a 1`;
    if (t.desvio !== undefined && !(t.desvio > 0))
      return `pop ${t.id}: desvio precisa ser maior que 0`;
    if (t.divisao) {
      const partes = Object.entries(t.divisao);
      const soma = (k: "pessoas" | "renda") =>
        partes.reduce((a, [, d]) => a + (d?.[k] ?? 0), 0);
      if (
        partes.length === 0 ||
        !partes.every(
          ([e, d]) => ehEstrato(e) && d && d.pessoas >= 0 && d.renda >= 0,
        ) ||
        Math.abs(soma("pessoas") - 1) > 1e-6 ||
        Math.abs(soma("renda") - 1) > 1e-6
      )
        return `pop ${t.id}: divisao precisa de estratos com pessoas e renda que somam 1`;
    }
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

/** Motivo de as escadas (sobe/desce/muda) dos tipos não fecharem, ou null. */
export function motivoEscadasInvalidas(tipos: TipoPop[]): string | null {
  const ordem = (e: Estrato) => ESTRATOS.indexOf(e);
  const por = (id: string) => tipos.find((t) => t.id === id);
  for (const t of tipos) {
    if (t.muda) {
      const alvo = por(t.muda.para);
      if (!alvo)
        return `pop ${t.id}: muda para "${t.muda.para}", que não existe`;
      if (alvo.estrato !== t.estrato || alvo.id === t.id)
        return `pop ${t.id}: muda para ${alvo.id}, que precisa ser outro pop do mesmo estrato`;
    }
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

/** Fração do pop que muda para outro da mesma faixa por turno, no máximo. */
export const PASSO_NA_FAIXA = 0.005;
/** O destino precisa ter melhorado 5% a mais que o pop desde o turno 0. */
const VANTAGEM_MINIMA = 1.05;
/** Vantagem a mais (25%) para a força ser total. */
const VANTAGEM_CHEIA = 0.25;

/**
 * Um turno de troca na mesma faixa (terceiro caminho, 15/nov): quando o pop
 * de destino melhorou mais que o de origem desde o turno 0, um pouco da gente
 * muda, freada pelo índice que o destino exige. A população total não muda.
 */
export function migrarNaFaixa(
  tipos: TipoPop[],
  pais: Record<string, PopPais>,
  atual: Migracao | undefined,
  e: EntradaMigracao,
): Migracao {
  const novo: Migracao = { ...atual };
  if (!e.renda_pop) return novo;
  const melhora = (id: string) => {
    const marco = e.renda_pop?.[id];
    const pop = e.pops[id];
    return marco && pop ? (pop.renda * 100) / e.indice_precos / marco : 0;
  };
  for (const t of tipos) {
    if (!t.muda) continue;
    const daqui = melhora(t.id);
    const dali = melhora(t.muda.para);
    const pop = e.pops[t.id];
    if (!(daqui > 0) || !(dali > 0) || !pop) continue;
    const vantagem = dali / daqui;
    const exige = t.muda.exige
      ? entre((e.indices[t.muda.exige] ?? 0) / 100, 0, 1)
      : 1;
    const forca =
      entre((vantagem - VANTAGEM_MINIMA) / VANTAGEM_CHEIA, 0, 1) * exige;
    if (forca <= 0) continue;
    const alvo = t.muda.para;
    const saiu = novo[t.id] ?? 0;
    const entrou = novo[alvo] ?? 0;
    const fluxo = Math.min(
      (pop.pessoas / e.populacao) * PASSO_NA_FAIXA * forca,
      saiu + LIMITE_MIGRACAO * pais[t.id].parcela_pessoas,
      LIMITE_MIGRACAO * pais[alvo].parcela_pessoas - entrou,
    );
    if (fluxo <= 0) continue;
    novo[t.id] = saiu - fluxo;
    novo[alvo] = entrou + fluxo;
  }
  return novo;
}

/** Quem procura trabalho e quem fica fora da conta (mundo, `pops.json`). */
export interface RegraDoEmprego {
  /** Pop de quem procura trabalho e não acha. */
  desempregados: string;
  /** Pops fora da força de trabalho: não entram na taxa de desemprego. */
  fora_da_forca: string[];
  /** Lei do seguro-desemprego: parte do salário que o demitido recebe (0 a 1). */
  lei_valor?: string;
  /** Lei do seguro-desemprego: por quantos meses. */
  lei_duracao?: string;
}

/** Emprego na partida (passo C, 15/nov). */
export interface EmpregoNoEstado {
  /** Fração da população de cada pop que perdeu a vaga (negativo = contratou de fora). */
  fora: Record<string, number>;
  /** Demitidos por turno, em fração da população, o mais recente primeiro. */
  demitidos: number[];
  /** Seguro-desemprego pago, em % do PIB por ano. */
  seguro: number;
  /** Taxa de desemprego do pop no turno 0 (régua do índice). */
  taxa0: number;
  /** Índices declarados pelo país no turno 0. */
  desemprego0: number;
  ocupados0: number;
}

/** Parte da diferença entre quem trabalha e as vagas que se fecha por turno. */
const RITMO_DEMISSAO = 0.3;
const RITMO_CONTRATACAO = 0.25;
/** Desempregados nunca caem abaixo desta fração do que o país declarou. */
const PISO_DESEMPREGADOS = 0.3;
/** Um pop não perde mais que esta fração da gente para o desemprego. */
const TETO_DEMISSAO = 0.6;
/** Turnos de demitidos guardados (2 anos; o seguro mais longo do mundo cabe). */
const TURNOS_DEMITIDOS = 12;

/** Taxa de desemprego: desempregados ÷ força de trabalho (0 a 1). */
export function taxaDeDesemprego(
  regra: RegraDoEmprego,
  pessoas: Record<string, number>,
): number {
  const total = Object.values(pessoas).reduce((a, v) => a + v, 0);
  const fora = regra.fora_da_forca.reduce((a, id) => a + (pessoas[id] ?? 0), 0);
  const forca = total - fora;
  return forca > 0 ? (pessoas[regra.desempregados] ?? 0) / forca : 0;
}

/**
 * Um turno de vagas (passo C). `vagas` diz, por pop, quantas vagas há contra
 * as do turno 0 (1 = iguais). Falta vaga: uma parte da diferença vai para os
 * desempregados; sobra vaga: uma parte volta deles. A população não muda.
 */
export function andarEmprego(
  pais: Record<string, PopPais>,
  regra: RegraDoEmprego,
  atual: Pick<EmpregoNoEstado, "fora" | "demitidos">,
  migracao: Migracao | undefined,
  vagas: Record<string, number>,
): { fora: Record<string, number>; demitidos: number[]; migracao: Migracao } {
  const mig: Migracao = { ...migracao };
  const d = regra.desempregados;
  const fora = { ...atual.fora };
  const passos: [string, number][] = [];
  for (const [id, v] of Object.entries(vagas)) {
    const parcela = pais[id]?.parcela_pessoas ?? 0;
    if (!(parcela > 0) || id === d) continue;
    const alvo = parcela * (1 - v);
    const agora = fora[id] ?? 0;
    const falta = alvo - agora;
    let passo = falta * (falta > 0 ? RITMO_DEMISSAO : RITMO_CONTRATACAO);
    if (passo > 0) {
      const resta = parcela + (mig[id] ?? 0);
      passo = Math.min(
        passo,
        Math.max(0, resta - parcela * (1 - TETO_DEMISSAO)),
      );
    }
    if (passo !== 0) passos.push([id, passo]);
  }
  const demitidos = passos.reduce((a, [, p]) => a + Math.max(0, p), 0);
  const contratados = passos.reduce((a, [, p]) => a + Math.max(0, -p), 0);
  const parcelaD = pais[d]?.parcela_pessoas ?? 0;
  const disponivel = Math.max(
    0,
    parcelaD + (mig[d] ?? 0) + demitidos - PISO_DESEMPREGADOS * parcelaD,
  );
  const escala = contratados > disponivel ? disponivel / contratados : 1;
  let paraD = 0;
  for (const [id, p] of passos) {
    const passo = p < 0 ? p * escala : p;
    fora[id] = (fora[id] ?? 0) + passo;
    mig[id] = (mig[id] ?? 0) - passo;
    paraD += passo;
  }
  mig[d] = (mig[d] ?? 0) + paraD;
  return {
    fora,
    demitidos: [demitidos, ...atual.demitidos].slice(0, TURNOS_DEMITIDOS),
    migracao: mig,
  };
}

/** Ciclo da vida (passo E, mundo `pops.json › demografia`). */
export interface RegraDaDemografia {
  criancas: string;
  estudantes: string;
  aposentados: string;
  /** Anos de criança (0 a 14 = 15): quem cresce vira estudante. */
  anos_crianca: number;
  /** Lei da idade mínima de aposentadoria (anos): mais baixa aposenta mais gente. */
  lei_idade?: string;
}

/** Cada 10 anos a menos na idade mínima dobram quem se aposenta por turno. */
const ANOS_PARA_DOBRAR = 10;
/** A aposentadoria não cai abaixo desta fração do ritmo do turno 0. */
const APOSENTA_MINIMO = 0.2;

/**
 * Um turno do ciclo da vida: a criança cresce e vira estudante, o estudante
 * se forma e vai para quem trabalha, o trabalhador se aposenta, o aposentado
 * morre e nasce o mesmo tanto de crianças, no ritmo do turno 0 (a população
 * não muda). Os ritmos
 * saem do país no turno 0: sem lei, nada anda. `idade` é a idade mínima de
 * hoje menos a do turno 0 (em anos).
 */
export function andarDemografia(
  tipos: TipoPop[],
  pais: Record<string, PopPais>,
  regra: RegraDaDemografia,
  atual: Migracao | undefined,
  idade: number,
): Migracao {
  const mig: Migracao = { ...atual };
  const parte = (id: string) =>
    (pais[id]?.parcela_pessoas ?? 0) + (mig[id] ?? 0);
  const { criancas, estudantes, aposentados } = regra;
  const inicial = (id: string) => pais[id]?.parcela_pessoas ?? 0;
  const turnos = regra.anos_crianca * 6;
  if (!(inicial(criancas) > 0) || !(turnos > 0)) return mig;
  // Quantos nascem por turno no país do turno 0; todo ritmo sai disso.
  const nascem0 = inicial(criancas) / turnos;
  const especiais = new Set([criancas, estudantes, aposentados]);
  const trabalham = tipos.filter((t) => !especiais.has(t.id)).map((t) => t.id);
  const trabalham0 = trabalham.reduce((a, id) => a + inicial(id), 0);
  const hoje = trabalham.reduce((a, id) => a + Math.max(0, parte(id)), 0);
  const fator = Math.max(APOSENTA_MINIMO, 1 - idade / ANOS_PARA_DOBRAR);
  // Nascer e morrer ficam no ritmo do turno 0 (a população não muda); só
  // cai se sobram menos aposentados que no começo.
  const morrem =
    inicial(aposentados) > 0
      ? nascem0 * Math.min(1, parte(aposentados) / inicial(aposentados))
      : 0;
  const crescem = parte(criancas) / turnos;
  const formam =
    inicial(estudantes) > 0
      ? (parte(estudantes) * nascem0) / inicial(estudantes)
      : 0;
  const aposentam = trabalham0 > 0 ? (hoje * nascem0 * fator) / trabalham0 : 0;
  const mover = (de: string, para: string, v: number) => {
    mig[de] = (mig[de] ?? 0) - v;
    mig[para] = (mig[para] ?? 0) + v;
  };
  mover(aposentados, criancas, morrem);
  mover(criancas, estudantes, crescem);
  if (hoje > 0)
    for (const id of trabalham) {
      const peso = Math.max(0, parte(id)) / hoje;
      mover(estudantes, id, formam * peso);
      mover(id, aposentados, aposentam * peso);
    }
  return mig;
}

/** Estado (ou província) do país, passo F: parte da população e parte dela no campo. */
export interface Territorio {
  id: string;
  nome: string;
  /** Parte da população do país (a soma dá 1). */
  pessoas: number;
  /** Parte da gente do estado que vive no campo (0 a 1). */
  campo: number;
}

/** Por que a lista de estados não serve; null se serve. */
export function motivoTerritoriosInvalidos(
  territorios: Territorio[],
): string | null {
  if (territorios.length === 0) return "precisa de pelo menos um estado";
  const ids = new Set<string>();
  for (const t of territorios) {
    if (ids.has(t.id)) return `estado "${t.id}" repetido`;
    ids.add(t.id);
    if (!(t.pessoas > 0)) return `estado "${t.id}": pessoas > 0`;
    if (!(t.campo >= 0 && t.campo <= 1))
      return `estado "${t.id}": campo entre 0 e 1`;
  }
  const soma = territorios.reduce((s, t) => s + t.pessoas, 0);
  if (Math.abs(soma - 1) > 0.01)
    return `as partes das pessoas somam ${soma.toFixed(3)}, precisam dar 1`;
  return null;
}

/**
 * Quantos de cada pop moram em cada estado. Os pops do campo seguem a gente
 * do campo de cada estado; os outros seguem a da cidade. Sem estados, o país
 * é um estado só ("pais"). A soma por pop dá o pop inteiro.
 */
export function popsPorTerritorio(
  territorios: Territorio[] | undefined,
  campo: string[],
  pops: Record<string, Pop>,
): Record<string, Record<string, number>> {
  const lista = territorios?.length
    ? territorios
    : [{ id: "pais", nome: "", pessoas: 1, campo: 0 }];
  const rural = lista.reduce((s, t) => s + t.pessoas * t.campo, 0);
  const urbano = lista.reduce((s, t) => s + t.pessoas * (1 - t.campo), 0);
  const doCampo = new Set(campo);
  const total = lista.reduce((s, t) => s + t.pessoas, 0);
  return Object.fromEntries(
    lista.map((t) => {
      const parteRural = rural > 0 ? (t.pessoas * t.campo) / rural : t.pessoas / total;
      const parteUrbana =
        urbano > 0 ? (t.pessoas * (1 - t.campo)) / urbano : t.pessoas / total;
      return [
        t.id,
        Object.fromEntries(
          Object.entries(pops).map(([id, p]) => [
            id,
            p.pessoas * (doCampo.has(id) ? parteRural : parteUrbana),
          ]),
        ),
      ];
    }),
  );
}

export {
  andarDinheiro,
  andarEmigracao,
  andarInformal,
  piora,
  type RegraDaSaida,
  type SaidaNoEstado,
} from "./saida";
export {
  coberturaDosPops,
  direitoDoPop,
  rendaDoEstrato,
  type Servico,
} from "./servicos";
