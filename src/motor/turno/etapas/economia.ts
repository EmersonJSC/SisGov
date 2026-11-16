// Etapas do turno: economia. Comportamento em turno.md.
import { sortearNormal } from "../../acaso";
import {
  taxaAlvo,
  proximaTaxa,
  type Base,
  type IdBase,
  BASES,
} from "../../calculos";
import {
  type Fluxos,
  type Tesouro,
  fecharTurno,
  regraFiscal,
} from "../../contas";
import type { Estado, IndicesEssenciais } from "../../estado";
import {
  alvoComBancoCentral,
  estourosFiscais,
  numeroDaOpcao,
  punicao,
} from "../../fisco";
import { novoFato, type Fato } from "../../fatos";
import { tomada, type Lei, type ValorLei } from "../../leis";
import { ESTRATOS, pedacos, type Estrato } from "../../populacao";
import {
  situacaoDaCapacidade,
  animoDoInvestimento,
  freioDoCrescimento,
  investimentoBase,
  lucroDosSetores,
  precoDosSetores,
  andarConstrucoes,
  tamanhoDaEconomia,
  pressaoNosPrecos,
  andarCapacidade,
} from "../../mercado";
import { TURNOS_POR_ANO, type Etapa } from "../comum";
import type { Regras } from "../regras";

/** Taxa anual (%) aplicada a um turno. */
export const doTurno = (anualPct: number) =>
  Math.pow(1 + anualPct / 100, 1 / TURNOS_POR_ANO);
/**
 * Capacidade contra demanda de cada rede (motor/mercado, fatia 7), com o
 * estado de hoje. Vazio sem mercado.
 */
export function situacoesDeCapacidade(regras: Regras, estado: Estado) {
  const m = regras.mercado;
  if (!m) return [];
  const real = (e: IndicesEssenciais) => e.pib_nominal / e.indice_precos;
  const marco = estado.marco.indices;
  const inicio =
    marco.pib_nominal !== undefined && marco.indice_precos !== undefined
      ? marco.pib_nominal / marco.indice_precos
      : real(estado.essenciais);
  return (m.mercado.capacidades ?? []).map((c) => ({
    capacidade: c,
    situacao: situacaoDaCapacidade(c, estado.capacidade, {
      pessoas: estado.essenciais.populacao,
      pessoasBase: m.populacaoBase,
      pibReal: inicio > 0 ? real(estado.essenciais) / inicio : 1,
      leis: estado.leis,
    }),
  }));
}
/** Soma das alíquotas das leis que cobram sobre o lucro (fração). */
export function impostoSobreLucro(
  regras: Regras,
  leis: Record<string, ValorLei>,
): number {
  let total = 0;
  for (const [id, valor] of Object.entries(leis)) {
    const lei = regras.leis[id];
    if (lei?.forma === "continua" && lei.calculo?.base === "lucro")
      total += valor as number;
  }
  return total;
}
/** Ânimo do investimento: juro e imposto sobre lucro contra o turno 0. */
export function animoDoPais(regras: Regras, estado: Estado): number {
  const e = estado.essenciais;
  const marco = estado.marco.indices;
  return animoDoInvestimento(
    e.taxa_juros,
    // Régua: o juro de equilíbrio do turno 0, não o declarado (que anda até ele).
    taxaAlvo(
      marco.divida_publica ?? e.divida_publica,
      marco.inflacao ?? e.inflacao,
      regras.pais.juros,
    ),
    impostoSobreLucro(regras, estado.leis),
    impostoSobreLucro(regras, estado.marco.leis),
  );
}
/**
 * 4. Economia real. Com construções (12b): o investimento privado, freado por
 * juro e imposto sobre lucro, abre obras; o PIB real anda com a capacidade
 * pronta. Sem elas: o sorteio do crescimento. Nos dois, a falta de capacidade
 * (ex.: energia) freia.
 */
export const economiaReal: Etapa = (regras, estado) => {
  const { tendencia, volatilidade } = regras.pais.crescimento;
  const [z, acaso] = sortearNormal(estado.acaso);
  const freio = situacoesDeCapacidade(regras, estado).reduce(
    (soma, { capacidade, situacao }) =>
      soma + freioDoCrescimento(capacidade, situacao),
    0,
  );
  const e = estado.essenciais;
  const regra = regras.mercado?.mercado.obras;
  const c = estado.construcoes;
  let anual = tendencia + volatilidade * z - freio;
  let construcoes = c;
  if (regra && c) {
    const marco = estado.marco.indices;
    const atraso = estado.jogabilidade[regra.indice_atraso] ?? 0;
    const animo = animoDoPais(regras, estado);
    const base = investimentoBase(
      regra,
      tendencia,
      marco[regra.indice_atraso] ?? atraso,
    );
    const fugiu = 1 - parteDaRendaFora(regras, estado);
    const taxa = Math.max(0, base * animo * fugiu + volatilidade * z);
    const capacidade = Object.values(c.prontas).reduce((s, v) => s + v, 0);
    const lucro = regras.mercado
      ? lucroDosSetores(
          c,
          precoDosSetores(regras.mercado.mercado, estado.precos),
          impostoSobreLucro(regras, estado.leis),
          impostoSobreLucro(regras, estado.marco.leis),
        )
      : undefined;
    construcoes = andarConstrucoes(regra, c, tendencia + regra.desgaste * 100, {
      investimento: (taxa / 100 / TURNOS_POR_ANO) * capacidade,
      atraso,
      perdaExtra: freio,
      lucro,
    });
    const fator = tamanhoDaEconomia(construcoes) / tamanhoDaEconomia(c);
    anual = (Math.pow(fator, TURNOS_POR_ANO) - 1) * 100;
  }
  return {
    ...estado,
    acaso,
    construcoes,
    essenciais: {
      ...e,
      crescimento_real: anual,
      pib_nominal: e.pib_nominal * doTurno(anual),
    },
  };
};
/**
 * Juro-alvo do turno: o do mercado (dívida e inflação); com o Banco Central
 * (motor/fisco), a meta de inflação puxa e a autonomia diz quanto vale a taxa
 * pedida pelo governo.
 */
export function alvoDoJuro(regras: Regras, estado: Estado): number {
  const e = estado.essenciais;
  const mercado = taxaAlvo(e.divida_publica, e.inflacao, regras.pais.juros);
  const j = regras.fisco?.juros;
  if (!j) return mercado;
  const num = (id: string) => {
    const v = estado.leis[id];
    return typeof v === "number" ? v * 100 : undefined;
  };
  return alvoComBancoCentral(mercado, e.inflacao, {
    meta: num(j.lei_meta),
    taxa: num(j.lei_taxa),
    autonomia: numeroDaOpcao(
      regras.leis[j.lei_autonomia],
      estado.leis[j.lei_autonomia],
      "autonomia",
      0,
    ),
    peso_da_meta: j.peso_da_meta,
  });
}
/**
 * 5. Preços e juros: a inflação (ainda fixa, do país) sobe os preços e o PIB
 * nominal; a taxa de juros anda rumo ao alvo dado pela dívida.
 */
export const precosEJuros: Etapa = (regras, antes) => {
  const estado = inflacaoDoRombo(regras, antes);
  const e = estado.essenciais;
  const alvo = alvoDoJuro(regras, estado);
  // O preço de uma rede em falta (ex.: energia) soma à inflação sentida.
  const pressao = situacoesDeCapacidade(regras, estado).reduce(
    (soma, { capacidade, situacao }) =>
      soma + pressaoNosPrecos(capacidade, situacao),
    0,
  );
  return {
    ...estado,
    essenciais: {
      ...e,
      indice_precos: e.indice_precos * doTurno(e.inflacao + pressao),
      pib_nominal: e.pib_nominal * doTurno(e.inflacao + pressao),
      taxa_juros: proximaTaxa(e.taxa_juros, alvo),
    },
  };
};
/**
 * Rombo e salário (15/nov, GDD 3.7): cada 1% do PIB de rombo acima do primeiro
 * ano empurra a inflação; ela anda `passo` do caminho por turno. A inflação acima
 * da normal (a do turno 0) vira perda no salário, que volta aos poucos.
 */
export function inflacaoDoRombo(regras: Regras, estado: Estado): Estado {
  const r = regras.fisco?.inflacao;
  const s = estado.inflacao;
  if (!r || !s) return estado;
  const e = estado.essenciais;
  const normal = estado.marco.indices.inflacao ?? e.inflacao;
  const rombo = Math.max(0, s.rombo0 - e.resultado_primario);
  const inflacao =
    e.inflacao + (normal + r.peso_rombo * rombo - e.inflacao) * r.passo;
  const volta = 1 - Math.pow(1 - r.recompoe_por_ano, 1 / TURNOS_POR_ANO);
  const comeu = Math.max(0, inflacao - normal) / 100 / TURNOS_POR_ANO;
  return {
    ...estado,
    essenciais: { ...e, inflacao },
    inflacao: { ...s, perda: Math.min(1, s.perda * (1 - volta) + comeu) },
  };
}
/** 5b. Capacidade: as obras pagas pelas leis chegam e a capacidade desgasta. */
export const capacidades: Etapa = (regras, estado) => ({
  ...estado,
  capacidade: andarCapacidade(
    regras.mercado?.mercado.capacidades ?? [],
    estado.capacidade,
    estado.leis,
  ),
});
/** Posição do valor na faixa da régua, de 0 (mínimo) a 1 (máximo). */
const posicaoNaFaixa = (lei: Lei, valor: ValorLei | undefined) =>
  lei.forma === "continua" && typeof valor === "number"
    ? Math.min(
        1,
        Math.max(0, (valor - lei.faixa.min) / (lei.faixa.max - lei.faixa.min)),
      )
    : 0;
/** Parte da renda de cada estrato que está fora do país (motor/populacao, passo G). */
export function dinheiroFora(
  regras: Regras,
  estado: Estado,
): Partial<Record<Estrato, number>> {
  const d = regras.saida?.dinheiro;
  const v = estado.saida?.dinheiro ?? 0;
  if (!d || !(v > 0)) return {};
  return Object.fromEntries(d.estratos.map((es) => [es, v]));
}
/** Parte da renda do país que está fora: não vira investimento aqui. */
const parteDaRendaFora = (regras: Regras, estado: Estado) =>
  Object.entries(dinheiroFora(regras, estado)).reduce(
    (s, [es, v]) => s + (parteDaRenda(regras)[es as Estrato] ?? 0) * v,
    0,
  );
/** Parte da renda do país que é de cada estrato, pela declaração do país. */
export function parteDaRenda(regras: Regras): Partial<Record<Estrato, number>> {
  const parte: Partial<Record<Estrato, number>> = {};
  for (const t of regras.pops)
    for (const [e, , pr] of pedacos(t))
      parte[e] =
        (parte[e] ?? 0) + (regras.pais.pops[t.id]?.parcela_renda ?? 0) * pr;
  return parte;
}
/**
 * Quanto sobra da base para um estrato depois das leis que a encolhem (ex.:
 * "a partir de quanto cobra", desconto por filho). 1 = base inteira.
 */
export function fatorDaBase(
  regras: Regras,
  leis: Record<string, ValorLei>,
  base: IdBase,
  estrato: Estrato | undefined,
): number {
  let fator = 1;
  for (const [id, valor] of Object.entries(leis)) {
    const lei = regras.leis[id];
    const en = lei?.forma === "continua" ? lei.encolhe : undefined;
    if (!en || en.base !== base) continue;
    if (en.estrato && en.estrato !== estrato) continue;
    fator *= 1 - posicaoNaFaixa(lei, valor) * (1 - en.ate);
  }
  return fator;
}
/** Arrecadação anual de cada lei com cálculo, na moeda do país. */
export function arrecadacaoPorLei(
  regras: Regras,
  leis: Record<string, ValorLei>,
  e: IndicesEssenciais,
  fora: Partial<Record<Estrato, number>> = {},
): Record<string, number> {
  const parte = parteDaRenda(regras);
  const total: Record<string, number> = {};
  for (const [id, valor] of Object.entries(leis)) {
    const lei = regras.leis[id];
    if (lei?.forma !== "continua" || !lei.calculo) continue;
    const { base, estrato } = lei.calculo;
    const foge = (BASES[base] as Base).foge === true;
    const parametros = regras.pais.bases[base] ?? {
      ...BASES[base].padrao,
      parcela_pib: 0,
    };
    // a lei do estrato cobra só da parte dele; a de todos, de cada parte (país
    // sem pops declarados: a base inteira, com o que encolhe para todos)
    const semPops = ESTRATOS.every((es) => !parte[es]);
    const tamanho = semPops
      ? estrato
        ? 0
        : fatorDaBase(regras, leis, base, undefined)
      : (estrato ? [estrato] : [...ESTRATOS]).reduce(
          (soma: number, es: Estrato) =>
            soma +
            (parte[es] ?? 0) *
              fatorDaBase(regras, leis, base, es) *
              (foge ? 1 - (fora[es] ?? 0) : 1),
          0,
        );
    total[id] = BASES[base].arrecadar(
      valor as number,
      e.pib_nominal * parametros.parcela_pib * tamanho,
      parametros,
    );
  }
  return total;
}
/** Arrecadação anual de cada base, na moeda do país. */
export function arrecadacaoPorBase(
  regras: Regras,
  leis: Record<string, ValorLei>,
  e: IndicesEssenciais,
  fora: Partial<Record<Estrato, number>> = {},
): Partial<Record<IdBase, number>> {
  const total: Partial<Record<IdBase, number>> = {};
  for (const [id, valor] of Object.entries(
    arrecadacaoPorLei(regras, leis, e, fora),
  )) {
    const lei = regras.leis[id];
    if (lei.forma !== "continua" || !lei.calculo) continue;
    total[lei.calculo.base] = (total[lei.calculo.base] ?? 0) + valor;
  }
  return total;
}
/**
 * Imposto que sai do bolso de cada estrato, por ano: a lei do estrato cobra
 * dele; a lei de todos se divide pela renda entre os estratos que pagam a base.
 */
export function impostoPorEstrato(
  regras: Regras,
  leis: Record<string, ValorLei>,
  e: IndicesEssenciais,
  fora: Partial<Record<Estrato, number>> = {},
): Partial<Record<Estrato, number>> {
  const parte = parteDaRenda(regras);
  const total: Partial<Record<Estrato, number>> = {};
  for (const [id, valor] of Object.entries(
    arrecadacaoPorLei(regras, leis, e, fora),
  )) {
    const lei = regras.leis[id];
    if (lei.forma !== "continua" || !lei.calculo) continue;
    const { base, estrato } = lei.calculo;
    const quem = estrato ? [estrato] : (BASES[base] as Base).incide;
    if (!quem) continue;
    const soma = quem.reduce((s, es) => s + (parte[es] ?? 0), 0);
    for (const es of quem)
      total[es] =
        (total[es] ?? 0) + (soma > 0 ? (valor * (parte[es] ?? 0)) / soma : 0);
  }
  return total;
}
/** Arrecadação das leis com cálculo, em % do PIB nominal. */
export function arrecadacao(
  regras: Regras,
  leis: Record<string, ValorLei>,
  e: IndicesEssenciais,
  fora: Partial<Record<Estrato, number>> = {},
): number {
  const porBase = Object.values(arrecadacaoPorBase(regras, leis, e, fora));
  return (porBase.reduce((a, b) => a + b, 0) / e.pib_nominal) * 100;
}
/**
 * Quanto o gasto de cada lei de verba é multiplicado pelas leis que mudam o
 * gasto dela (ex.: idade mínima e a verba das aposentadorias). 1 = como está.
 */
export function escalaDoGasto(
  regras: Regras,
  leis: Record<string, ValorLei>,
): Record<string, number> {
  const escala: Record<string, number> = {};
  for (const [id, valor] of Object.entries(leis)) {
    const lei = regras.leis[id];
    const es = lei?.escala_gasto;
    if (!es) continue;
    let fator = 1;
    if (lei.forma === "continua" && "min" in es) {
      const p = posicaoNaFaixa(lei, valor);
      fator = es.min + (es.max - es.min) * p;
    } else if (lei.forma === "opcoes")
      fator = lei.opcoes.find((o) => o.id === valor)?.valores?.gasto ?? 1;
    escala[es.lei] = (escala[es.lei] ?? 1) * fator;
  }
  return escala;
}
/** Gasto efetivo de cada lei de verba, em % do PIB, com a escala das outras. */
export function gastoPorLei(
  regras: Regras,
  leis: Record<string, ValorLei>,
  /** Corte automático da regra fiscal (motor/fisco): fração tirada de toda verba. */
  corte = 0,
): Record<string, number> {
  const escala = escalaDoGasto(regras, leis);
  const gasto: Record<string, number> = {};
  for (const [id, valor] of Object.entries(leis)) {
    const lei = regras.leis[id];
    if (lei?.forma === "continua" && lei.conta === "gasto")
      gasto[id] = (valor as number) * 100 * (escala[id] ?? 1) * (1 - corte);
    // Custo de serviço (16/nov): a tomada `custo`, em % do PIB, para a lei
    // de opções ou de régua que não é verba (ex.: remédio grátis na farmácia).
    const custo = tomada(regras.leis, { [id]: valor }, "custo");
    if (custo) gasto[id] = (gasto[id] ?? 0) + custo * (1 - corte);
  }
  return gasto;
}
/** Gasto das leis com `conta: "gasto"`, em % do PIB nominal. */
export function gastoDasLeis(
  regras: Regras,
  leis: Record<string, ValorLei>,
  corte = 0,
): number {
  return Object.values(gastoPorLei(regras, leis, corte)).reduce(
    (a, b) => a + b,
    0,
  );
}
/** Quanto cada uso a mais de uma lei com prazo rende (quem deve espera a próxima). */
export const QUEDA_POR_USO = 0.7;
/**
 * Receita das leis que arrecadam enquanto valem (ex.: anistia fiscal), em % do
 * PIB por ano: `arrecada` no máximo da faixa, menos a cada uso repetido.
 */
export function arrecadacaoDasJanelas(regras: Regras, estado: Estado): number {
  let total = 0;
  for (const [id, valor] of Object.entries(estado.leis)) {
    const lei = regras.leis[id];
    if (lei?.forma !== "continua" || !lei.arrecada) continue;
    const usos = Math.max(1, estado.usos?.[id] ?? 1);
    total +=
      lei.arrecada *
      posicaoNaFaixa(lei, valor) *
      Math.pow(QUEDA_POR_USO, usos - 1);
  }
  return total;
}
/** Receita, gasto e juros de um turno, na moeda do país. */
export function fluxosDoTurno(regras: Regras, estado: Estado): Fluxos {
  const e = estado.essenciais;
  const receitaPct =
    arrecadacao(regras, estado.leis, e, dinheiroFora(regras, estado)) +
    regras.pais.receita_fora_das_leis +
    arrecadacaoDasJanelas(regras, estado);
  const pibTurno = e.pib_nominal / TURNOS_POR_ANO;
  return {
    receita: (receitaPct / 100) * pibTurno,
    gasto:
      ((gastoDasLeis(regras, estado.leis, estado.fiscal?.corte) +
        regras.pais.gasto_fora_das_leis +
        (estado.atendimento?.custo ?? 0) * 100 +
        (estado.emprego?.seguro ?? 0)) /
        100) *
      pibTurno,
    juros: ((e.taxa_juros / 100) * estado.tesouro.divida) / TURNOS_POR_ANO,
  };
}
/** Contas em % do PIB nominal; fluxos anualizados. */
export function mostrarContas(
  e: IndicesEssenciais,
  fluxos: Fluxos,
  tesouro: Tesouro,
): IndicesEssenciais {
  const pct = (v: number) => (v / e.pib_nominal) * 100;
  const anual = (v: number) => pct(v * TURNOS_POR_ANO);
  return {
    ...e,
    arrecadacao: anual(fluxos.receita),
    gasto_publico: anual(fluxos.gasto),
    juros_pagos: anual(fluxos.juros),
    resultado_primario: anual(fluxos.receita - fluxos.gasto),
    resultado_fiscal: anual(fluxos.receita - fluxos.gasto - fluxos.juros),
    cofre: pct(tesouro.cofre),
    divida_publica: pct(tesouro.divida),
  };
}
/** 6. Contas: receita, gasto e juros fecham o turno no cofre e na dívida. */
export const contas: Etapa = (regras, estado) => {
  const fluxos = fluxosDoTurno(regras, estado);
  const fechado = fecharTurno(
    estado.tesouro,
    fluxos,
    regraFiscal(regras.leis, estado.leis),
  );
  // ato de calote: a parte perdoada sai da dívida de uma vez
  const perdao = (estado.perdao ?? 0) * Math.max(0, fechado.divida);
  const tesouro = {
    ...fechado,
    divida: fechado.divida - perdao,
    perdao: perdao > 0 ? perdao : undefined,
  };
  const essenciais = mostrarContas(estado.essenciais, fluxos, tesouro);
  return conferirRegraFiscal(regras, {
    ...estado,
    tesouro,
    essenciais,
    perdao: undefined,
  });
};
/**
 * Regra fiscal (motor/fisco): confere teto de gasto, meta de resultado,
 * limite da dívida e teto da carga com as contas do turno. Regra estourada
 * vira fato, e a punição em vigor vale no turno seguinte (corte das verbas,
 * trava de aumento; crime de responsabilidade deixa o fato grande).
 */
export function conferirRegraFiscal(regras: Regras, estado: Estado): Estado {
  const regra = regras.fisco?.regra_fiscal;
  if (!regra) return estado;
  const e = estado.essenciais;
  const marco = estado.marco.indices;
  const real = (gasto: number, pib: number, precos: number) =>
    (gasto * pib) / precos;
  const gasto0 =
    marco.gasto_publico !== undefined &&
    marco.pib_nominal !== undefined &&
    marco.indice_precos !== undefined
      ? real(marco.gasto_publico, marco.pib_nominal, marco.indice_precos)
      : undefined;
  const estouros = estourosFiscais(regra, estado.leis, {
    gastoReal: gasto0
      ? real(e.gasto_publico, e.pib_nominal, e.indice_precos) / gasto0
      : 1,
    anos: estado.turno / TURNOS_POR_ANO,
    resultado_primario: e.resultado_primario,
    divida_publica: e.divida_publica,
    arrecadacao: e.arrecadacao,
  });
  const p = punicao(regras.leis, regra, estado.leis);
  const novos = estouros.filter(
    (x) => !(estado.fiscal?.estouros ?? []).includes(x),
  );
  const leiDe: Record<string, string | undefined> = {
    teto_gasto: regra.lei_teto_gasto,
    meta_resultado: regra.lei_meta_resultado,
    limite_divida: regra.lei_limite_divida,
    teto_carga: regra.lei_teto_carga,
  };
  const fatos: Fato[] = novos.map((x) =>
    novoFato({
      tipo: "regra-fiscal-estourou",
      turno: estado.turno,
      tamanho: p.crime ? "grande" : "medio",
      sobre: leiDe[x],
    }),
  );
  const estourou = estouros.length > 0;
  return {
    ...estado,
    fiscal: {
      estouros,
      corte: estourou ? p.corte : 0,
      trava: estourou && p.trava,
    },
    fatos: [...(estado.fatos ?? []), ...fatos],
  };
}
