// Etapas do turno: economia. Comportamento em turno.md.
import { sortearNormal } from "../../acaso";
import { taxaAlvo, proximaTaxa, type IdBase, BASES } from "../../calculos";
import {
  type Fluxos,
  type Tesouro,
  fecharTurno,
  regraFiscal,
} from "../../contas";
import type { Estado, IndicesEssenciais } from "../../estado";
import type { ValorLei } from "../../leis";
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
    const taxa = Math.max(0, base * animo + volatilidade * z);
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
 * 5. Preços e juros: a inflação (ainda fixa, do país) sobe os preços e o PIB
 * nominal; a taxa de juros anda rumo ao alvo dado pela dívida.
 */
export const precosEJuros: Etapa = (regras, estado) => {
  const e = estado.essenciais;
  const alvo = taxaAlvo(e.divida_publica, e.inflacao, regras.pais.juros);
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
/** 5b. Capacidade: as obras pagas pelas leis chegam e a capacidade desgasta. */
export const capacidades: Etapa = (regras, estado) => ({
  ...estado,
  capacidade: andarCapacidade(
    regras.mercado?.mercado.capacidades ?? [],
    estado.capacidade,
    estado.leis,
  ),
});
/** Arrecadação anual de cada base, na moeda do país. */
export function arrecadacaoPorBase(
  regras: Regras,
  leis: Record<string, ValorLei>,
  e: IndicesEssenciais,
): Partial<Record<IdBase, number>> {
  const total: Partial<Record<IdBase, number>> = {};
  for (const [id, valor] of Object.entries(leis)) {
    const lei = regras.leis[id];
    if (lei.forma !== "continua" || !lei.calculo) continue;
    const base = lei.calculo.base;
    const parametros = regras.pais.bases[base] ?? {
      ...BASES[base].padrao,
      parcela_pib: 0,
    };
    total[base] =
      (total[base] ?? 0) +
      BASES[base].arrecadar(
        valor as number,
        e.pib_nominal * parametros.parcela_pib,
        parametros,
      );
  }
  return total;
}
/** Arrecadação das leis com cálculo, em % do PIB nominal. */
export function arrecadacao(
  regras: Regras,
  leis: Record<string, ValorLei>,
  e: IndicesEssenciais,
): number {
  const porBase = Object.values(arrecadacaoPorBase(regras, leis, e));
  return (porBase.reduce((a, b) => a + b, 0) / e.pib_nominal) * 100;
}
/** Gasto das leis com `conta: "gasto"`, em % do PIB nominal. */
export function gastoDasLeis(
  regras: Regras,
  leis: Record<string, ValorLei>,
): number {
  let total = 0;
  for (const [id, valor] of Object.entries(leis)) {
    const lei = regras.leis[id];
    if (lei.forma === "continua" && lei.conta === "gasto")
      total += (valor as number) * 100;
  }
  return total;
}
/** Receita, gasto e juros de um turno, na moeda do país. */
export function fluxosDoTurno(regras: Regras, estado: Estado): Fluxos {
  const e = estado.essenciais;
  const receitaPct =
    arrecadacao(regras, estado.leis, e) + regras.pais.receita_fora_das_leis;
  const pibTurno = e.pib_nominal / TURNOS_POR_ANO;
  return {
    receita: (receitaPct / 100) * pibTurno,
    gasto:
      ((gastoDasLeis(regras, estado.leis) +
        regras.pais.gasto_fora_das_leis +
        (estado.atendimento?.custo ?? 0) * 100) /
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
  const tesouro = fecharTurno(
    estado.tesouro,
    fluxos,
    regraFiscal(regras.leis, estado.leis),
  );
  return {
    ...estado,
    tesouro,
    essenciais: mostrarContas(estado.essenciais, fluxos, tesouro),
  };
};
