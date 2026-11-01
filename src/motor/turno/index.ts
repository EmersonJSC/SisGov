// Turno: avancarTurno(regras, estado, pedidos) → novo estado, sem alterar o
// anterior. Ordem fixa (plano, seção 5); etapa que ainda não existe pula.
// O acaso mora no estado (motor/acaso). Comportamento em turno.md.
import { semear, sortearNormal } from "../acaso";
import { BASES, ehBase, proximaTaxa, taxaAlvo, type IdBase } from "../calculos";
import {
  fecharTurno,
  motivoContaNaoFecha,
  type Fluxos,
  type Tesouro,
} from "../contas";
import { enfileirar, envelhecer, filaInicial, somaPorIndice } from "../efeitos";
import type { Estado, IndicesEssenciais } from "../estado";
import { motivoValorInvalido, type ValorLei } from "../leis";
import {
  calcularPops,
  motivoPopsInvalidos,
  type Estrato,
  type Pop,
} from "../populacao";
import type { Pedido, Regras } from "./regras";

export type { ParametrosBase, ParametrosPais, Pedido, Regras } from "./regras";

const TURNOS_POR_ANO = 6;

type Etapa = (regras: Regras, estado: Estado, pedidos: Pedido[]) => Estado;

const pular: Etapa = (_, estado) => estado;

/** 1. Congresso: entra no passo 8. Até lá, todo pedido passa. */
const congresso = pular;

/** 2. Leis novas: o valor muda e os efeitos entram na fila. */
const leisNovas: Etapa = (regras, estado, pedidos) => {
  let { leis, efeitos } = estado;
  for (const pedido of pedidos) {
    const lei = regras.leis[pedido.lei];
    if (!lei) throw new Error(`pedido: lei "${pedido.lei}" não existe`);
    const motivo = motivoValorInvalido(lei, pedido.valor);
    if (motivo) throw new Error(`pedido: ${pedido.lei} ${motivo}`);
    if (leis[lei.id] === pedido.valor) continue;
    leis = { ...leis, [lei.id]: pedido.valor };
    efeitos = enfileirar(efeitos, lei, pedido.valor);
  }
  return { ...estado, leis, efeitos };
};

/** 3. Efeitos andam um turno em direção ao inteiro. */
const efeitosVencem: Etapa = (_, estado) => ({
  ...estado,
  efeitos: envelhecer(estado.efeitos),
});

/** Taxa anual (%) aplicada a um turno. */
const doTurno = (anualPct: number) =>
  Math.pow(1 + anualPct / 100, 1 / TURNOS_POR_ANO);

/** 4. Economia real, por enquanto só o sorteio do crescimento. */
const economiaReal: Etapa = (regras, estado) => {
  const { tendencia, volatilidade } = regras.pais.crescimento;
  const [z, acaso] = sortearNormal(estado.acaso);
  const anual = tendencia + volatilidade * z;
  const e = estado.essenciais;
  return {
    ...estado,
    acaso,
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
const precosEJuros: Etapa = (regras, estado) => {
  const e = estado.essenciais;
  const alvo = taxaAlvo(e.divida_publica, e.inflacao, regras.pais.juros);
  return {
    ...estado,
    essenciais: {
      ...e,
      indice_precos: e.indice_precos * doTurno(e.inflacao),
      pib_nominal: e.pib_nominal * doTurno(e.inflacao),
      taxa_juros: proximaTaxa(e.taxa_juros, alvo),
    },
  };
};

/** Arrecadação anual de cada base, na moeda do país. */
function arrecadacaoPorBase(
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
function arrecadacao(
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
function fluxosDoTurno(regras: Regras, estado: Estado): Fluxos {
  const e = estado.essenciais;
  const receitaPct =
    arrecadacao(regras, estado.leis, e) + regras.pais.receita_fora_das_leis;
  const pibTurno = e.pib_nominal / TURNOS_POR_ANO;
  return {
    receita: (receitaPct / 100) * pibTurno,
    gasto:
      ((gastoDasLeis(regras, estado.leis) + regras.pais.gasto_fora_das_leis) /
        100) *
      pibTurno,
    juros: ((e.taxa_juros / 100) * estado.tesouro.divida) / TURNOS_POR_ANO,
  };
}

/** Contas em % do PIB nominal; fluxos anualizados. */
function mostrarContas(
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
const contas: Etapa = (regras, estado) => {
  const fluxos = fluxosDoTurno(regras, estado);
  const tesouro = fecharTurno(estado.tesouro, fluxos);
  return {
    ...estado,
    tesouro,
    essenciais: mostrarContas(estado.essenciais, fluxos, tesouro),
  };
};

function jogabilidade(regras: Regras, estado: Estado) {
  const soma = somaPorIndice(estado.efeitos);
  const indices: Record<string, number> = {};
  for (const [id, base] of Object.entries(estado.base)) {
    const { min, max } = regras.dominios[id];
    indices[id] = Math.min(max, Math.max(min, base + (soma[id] ?? 0)));
  }
  return indices;
}

/** 7. Índices de jogabilidade: base do país + contribuições das leis. */
const indicesJogabilidade: Etapa = (regras, estado) => ({
  ...estado,
  jogabilidade: jogabilidade(regras, estado),
});

/** Renda dos pops com as leis e o PIB do estado (motor/populacao). */
function pops(regras: Regras, estado: Estado): Record<string, Pop> {
  const e = estado.essenciais;
  const transferencias: Partial<Record<Estrato, number>> = {};
  for (const [id, valor] of Object.entries(estado.leis)) {
    const lei = regras.leis[id];
    if (lei.forma !== "continua" || !lei.para) continue;
    const { estrato } = lei.para;
    transferencias[estrato] =
      (transferencias[estrato] ?? 0) + (valor as number) * e.pib_nominal;
  }
  return calcularPops(regras.pops, regras.pais.pops, {
    populacao: e.populacao,
    pib_nominal: e.pib_nominal,
    imposto_renda: arrecadacaoPorBase(regras, estado.leis, e).renda ?? 0,
    transferencias,
  });
}

/** 8. Pops e grupos: renda dos pops; grupos no 7b. */
const popsEGrupos: Etapa = (regras, estado) => ({
  ...estado,
  pops: pops(regras, estado),
});

/** 9. Política: passos 8 e 9. */
const politica = pular;

/** 10. Invariantes: falhou, para com erro. */
const invariantes: Etapa = (regras, estado) => {
  const falhas: string[] = [];
  for (const [id, v] of Object.entries(estado.essenciais))
    if (!Number.isFinite(v)) falhas.push(`${id} não é número finito`);
  if (estado.essenciais.ocupados > estado.essenciais.populacao)
    falhas.push("ocupados > população");
  if (estado.tesouro.cofre < 0) falhas.push("cofre negativo");
  if (estado.tesouro.divida < 0) falhas.push("dívida negativa");
  for (const [id, v] of Object.entries(estado.jogabilidade)) {
    const { min, max } = regras.dominios[id];
    if (!(v >= min && v <= max)) falhas.push(`${id} fora de ${min}–${max}`);
  }
  for (const [id, valor] of Object.entries(estado.leis)) {
    const motivo = motivoValorInvalido(regras.leis[id], valor);
    if (motivo) falhas.push(`lei ${id} ${motivo}`);
  }
  const pessoas = Object.values(estado.pops).reduce((s, p) => s + p.pessoas, 0);
  if (Math.abs(pessoas - estado.essenciais.populacao) > 1)
    falhas.push("pops não somam a população");
  for (const [id, p] of Object.entries(estado.pops))
    if (!Object.values(p).every(Number.isFinite) || p.renda < 0)
      falhas.push(`pop ${id} com renda inválida`);
  if (falhas.length > 0)
    throw new Error(
      `invariante no turno ${estado.turno}: ${falhas.join("; ")}`,
    );
  return estado;
};

const ETAPAS: Etapa[] = [
  congresso,
  leisNovas,
  efeitosVencem,
  economiaReal,
  precosEJuros,
  contas,
  indicesJogabilidade,
  popsEGrupos,
  politica,
  invariantes,
];

export function avancarTurno(
  regras: Regras,
  estado: Estado,
  pedidos: Pedido[] = [],
): Estado {
  const proximo = { ...estado, turno: estado.turno + 1 };
  const novo = ETAPAS.reduce((e, etapa) => etapa(regras, e, pedidos), proximo);
  // Parte da etapa 10: precisa do estado anterior.
  const motivo = motivoContaNaoFecha(estado.tesouro, novo.tesouro);
  if (motivo) throw new Error(`invariante no turno ${novo.turno}: ${motivo}`);
  return novo;
}

export interface Inicio {
  semente: number;
  essenciais: IndicesEssenciais;
  /** Índices de jogabilidade como o país está hoje, com as leis que tem. */
  jogabilidade: Record<string, number>;
  leis: Record<string, ValorLei>;
}

/**
 * Estado do turno 0. Confere leis e índices; as leis vigentes já estão
 * inteiras. Lei do mundo que o país não declarou fica não legislada: não
 * arrecada, não gasta, não mexe em índice, e pode ser proposta na partida.
 */
export function estadoInicial(regras: Regras, inicio: Inicio): Estado {
  for (const id of Object.keys(inicio.leis))
    if (!(id in regras.leis)) throw new Error(`país: lei "${id}" não existe`);
  for (const id of Object.keys(regras.dominios))
    if (!(id in inicio.jogabilidade))
      throw new Error(`país: falta o índice ${id}`);
  for (const base of Object.keys(regras.pais.bases))
    if (!ehBase(base)) throw new Error(`país: base "${base}" não existe`);
  const motivoPops = motivoPopsInvalidos(regras.pops, regras.pais.pops);
  if (motivoPops) throw new Error(`país: ${motivoPops}`);

  const efeitos = filaInicial(regras.leis, inicio.leis);
  const soma = somaPorIndice(efeitos);
  const base: Record<string, number> = {};
  for (const [id, v] of Object.entries(inicio.jogabilidade))
    base[id] = v - (soma[id] ?? 0);

  const { pib_nominal, cofre, divida_publica } = inicio.essenciais;
  const tesouro: Tesouro = {
    cofre: (cofre / 100) * pib_nominal,
    divida: (divida_publica / 100) * pib_nominal,
    resultado: 0,
  };
  const estado: Estado = {
    turno: 0,
    acaso: semear(inicio.semente),
    essenciais: { ...inicio.essenciais },
    tesouro,
    jogabilidade: { ...inicio.jogabilidade },
    base,
    leis: { ...inicio.leis },
    efeitos,
    pops: {},
  };
  // Turno 0 mostra as contas sem fechar: cofre e dívida são os declarados.
  const fluxos = fluxosDoTurno(regras, estado);
  return invariantes(
    regras,
    {
      ...estado,
      essenciais: mostrarContas(estado.essenciais, fluxos, tesouro),
      pops: pops(regras, estado),
    },
    [],
  );
}
