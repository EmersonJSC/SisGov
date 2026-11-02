// Turno: avancarTurno(regras, estado, pedidos) → novo estado, sem alterar o
// anterior. Ordem fixa (plano, seção 5).
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
import { apurar, DESGASTE_POR_TURNO, turnosMandato } from "../eleicao";
import {
  INDICES_ESSENCIAIS,
  type Estado,
  type IndicesEssenciais,
} from "../estado";
import {
  calcularGrupos,
  motivoGruposInvalidos,
  rendaDoGrupo,
  type Marco,
} from "../grupos";
import { motivoValorInvalido, type ValorLei } from "../leis";
import {
  andarOpinioes,
  motivoOpinioesInvalidas,
  posicaoDoPais,
  reputacao,
  segurancaExterna,
} from "../mundo";
import {
  coligacaoAtual,
  motivoCongressoInvalido,
  votar,
  type Votacao,
} from "../politica";
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

/**
 * 1. Congresso: cada pedido que muda uma lei vai a voto (motor/politica).
 * Sem Congresso nas regras, todo pedido passa.
 */
const congresso: Etapa = (regras, estado, pedidos) => {
  const votacoes: Votacao[] = [];
  for (const pedido of pedidos) {
    const lei = regras.leis[pedido.lei];
    if (!lei) throw new Error(`pedido: lei "${pedido.lei}" não existe`);
    const motivo = motivoValorInvalido(lei, pedido.valor);
    if (motivo) throw new Error(`pedido: ${pedido.lei} ${motivo}`);
    const atual = estado.leis[lei.id];
    if (atual === pedido.valor) continue;
    votacoes.push(
      regras.congresso
        ? votar(
            regras.congresso,
            estado.coligacao,
            regras.grupos,
            lei,
            atual,
            pedido.valor,
          )
        : {
            lei: lei.id,
            valor: pedido.valor,
            exorbitante: false,
            votos: {},
            sim: 0,
            nao: 0,
            aprovada: true,
          },
    );
  }
  return { ...estado, votacoes };
};

/** 2. Leis novas: o que passou muda de valor e os efeitos entram na fila. */
const leisNovas: Etapa = (regras, estado) => {
  let { leis, efeitos } = estado;
  for (const v of estado.votacoes) {
    if (!v.aprovada) continue;
    leis = { ...leis, [v.lei]: v.valor };
    efeitos = enfileirar(efeitos, regras.leis[v.lei], v.valor);
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

/** A reputação é a média das opiniões, pesada pelo peso (motor/mundo). */
function comReputacao(regras: Regras, estado: Estado): Estado {
  const { potencias, indiceReputacao } = regras;
  if (!potencias || !indiceReputacao) return estado;
  const rep = reputacao(potencias, estado.opinioes);
  const jogabilidade = { ...estado.jogabilidade, [indiceReputacao]: rep };
  const { indicePoderDefensivo: poder, indiceSegurancaExterna: seguranca } =
    regras;
  if (poder && seguranca)
    jogabilidade[seguranca] = segurancaExterna(jogabilidade[poder], rep);
  return { ...estado, jogabilidade };
}

/** 7b. Mundo: cada potência anda a opinião rumo à desejada (motor/mundo). */
const mundo: Etapa = (regras, estado) => {
  if (!regras.potencias) return estado;
  const opinioes = andarOpinioes(
    regras.potencias,
    estado.opinioes,
    posicaoDoPais(regras.leis, estado.leis),
  );
  return comReputacao(regras, { ...estado, opinioes });
};

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

/** Essenciais e jogabilidade num mapa só, para os grupos. */
const todosIndices = (estado: Estado): Record<string, number> => ({
  ...estado.essenciais,
  ...estado.jogabilidade,
});

/** Grupos com os pops já calculados no estado (motor/grupos). */
function grupos(regras: Regras, estado: Estado, marco: Marco) {
  return calcularGrupos(regras.grupos, regras.leis, {
    pops: estado.pops,
    indice_precos: estado.essenciais.indice_precos,
    indices: todosIndices(estado),
    vigentes: estado.leis,
    marco,
    esperado: Math.pow(
      doTurno(regras.pais.crescimento.tendencia),
      estado.turno,
    ),
    anteriores: estado.turno === 0 ? undefined : estado.grupos,
  });
}

/** 8. Pops e grupos: renda dos pops, depois satisfação dos grupos. */
const popsEGrupos: Etapa = (regras, estado) => {
  const comPops = { ...estado, pops: pops(regras, estado) };
  return { ...comPops, grupos: grupos(regras, comPops, estado.marco) };
};

/**
 * 9. Política: a base olha os seus grupos (passo 8); o desgaste sobe e, no
 * fim do mandato, há eleição (motor/eleicao).
 */
const politica: Etapa = (regras, estado) => {
  const coligacao = regras.congresso
    ? coligacaoAtual(regras.congresso, estado.coligacao, estado.grupos)
    : estado.coligacao;
  const desgaste = estado.desgaste + DESGASTE_POR_TURNO;
  const comDesgaste = { ...estado, coligacao, desgaste };
  const mandato = turnosMandato(regras.leis, estado.leis);
  if (mandato === null || estado.turno - estado.inicio_mandato < mandato)
    return comDesgaste;
  const eleicao = apurar(estado.turno, estado.grupos, desgaste);
  return {
    ...comDesgaste,
    eleicao,
    inicio_mandato: eleicao.venceu ? estado.turno : estado.inicio_mandato,
    encerrada: !eleicao.venceu,
  };
};

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
  for (const [id, g] of Object.entries(estado.grupos))
    if (
      !Object.values(g).every(Number.isFinite) ||
      !(g.satisfacao >= 0 && g.satisfacao <= 100) ||
      g.radicais < 0 ||
      g.lealistas < 0 ||
      g.radicais + g.lealistas > 100
    )
      falhas.push(`grupo ${id} inválido`);
  if (regras.congresso && !estado.coligacao.includes(regras.congresso.governo))
    falhas.push("coligação sem o governo");
  for (const [id, v] of Object.entries(estado.opinioes))
    if (!(Number.isFinite(v) && v >= 0 && v <= 100))
      falhas.push(`opinião de ${id} fora de 0–100`);
  if (!(Number.isFinite(estado.desgaste) && estado.desgaste >= 0))
    falhas.push("desgaste inválido");
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
  mundo,
  popsEGrupos,
  politica,
  invariantes,
];

export function avancarTurno(
  regras: Regras,
  estado: Estado,
  pedidos: Pedido[] = [],
): Estado {
  if (estado.encerrada)
    throw new Error("partida encerrada: o governo perdeu a eleição");
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
  /** Partidos da base no começo (com Congresso). */
  coligacao?: string[];
  /** Opinião de partida de cada potência (com potências). */
  opinioes?: Record<string, number>;
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
  const motivoGrupos = motivoGruposInvalidos(
    regras.grupos,
    regras.pops.map((p) => p.id),
    [...INDICES_ESSENCIAIS, ...Object.keys(regras.dominios)],
  );
  if (motivoGrupos) throw new Error(`mundo: ${motivoGrupos}`);
  const coligacao = inicio.coligacao ?? [];
  if (regras.congresso) {
    const motivo = motivoCongressoInvalido(
      regras.congresso,
      coligacao,
      regras.grupos.map((g) => g.id),
    );
    if (motivo) throw new Error(`país: congresso: ${motivo}`);
  }

  if (regras.potencias) {
    if (!regras.indiceReputacao || !(regras.indiceReputacao in regras.dominios))
      throw new Error("mundo: falta o índice da reputação");
    for (const id of [
      regras.indicePoderDefensivo,
      regras.indiceSegurancaExterna,
    ])
      if (id && !(id in regras.dominios))
        throw new Error(`mundo: falta o índice "${id}"`);
    if (!regras.indicePoderDefensivo !== !regras.indiceSegurancaExterna)
      throw new Error("mundo: poder defensivo e segurança externa vão juntos");
    const motivo = motivoOpinioesInvalidas(regras.potencias, inicio.opinioes);
    if (motivo) throw new Error(`país: ${motivo}`);
  }

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
    grupos: {},
    marco: { indices: {}, leis: {}, renda_real: {} },
    opinioes: regras.potencias ? { ...inicio.opinioes } : {},
    coligacao: [...coligacao],
    votacoes: [],
    desgaste: 0,
    inicio_mandato: 0,
    eleicao: null,
    encerrada: false,
  };
  // Turno 0 mostra as contas sem fechar: cofre e dívida são os declarados.
  const fluxos = fluxosDoTurno(regras, estado);
  const comPops: Estado = {
    ...comReputacao(regras, estado),
    essenciais: mostrarContas(estado.essenciais, fluxos, tesouro),
    pops: pops(regras, estado),
  };
  // O marco é o próprio turno 0: grupos começam em 50.
  const marco: Marco = {
    indices: todosIndices(comPops),
    leis: { ...comPops.leis },
    renda_real: Object.fromEntries(
      regras.grupos.map((t) => [
        t.id,
        rendaDoGrupo(t, comPops.pops, comPops.essenciais.indice_precos)
          .renda_real,
      ]),
    ),
  };
  return invariantes(
    regras,
    { ...comPops, marco, grupos: grupos(regras, comPops, marco) },
    [],
  );
}
