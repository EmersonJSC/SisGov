// Turno: avancarTurno(regras, estado, pedidos) → novo estado, sem alterar o
// anterior. Ordem fixa (plano, seção 5).
// O acaso mora no estado (motor/acaso). Comportamento em turno.md.
import { semear, sortearNormal } from "../acaso";
import { BASES, ehBase, proximaTaxa, taxaAlvo, type IdBase } from "../calculos";
import {
  fecharTurno,
  regraFiscal,
  motivoContaNaoFecha,
  type Fluxos,
  type Tesouro,
} from "../contas";
import { andarDerivas } from "../deriva";
import { enfileirar, envelhecer, filaInicial, somaPorIndice } from "../efeitos";
import { apurar, DESGASTE_POR_TURNO, turnosMandato } from "../eleicao";
import {
  INDICES_ESSENCIAIS,
  type Estado,
  type IndicesEssenciais,
} from "../estado";
import {
  calcularGrupos,
  deslizarPops,
  gruposComDeslize,
  motivoGruposInvalidos,
  rendaDoGrupo,
  type Marco,
} from "../grupos";
import {
  andarCapacidade,
  andarChoques,
  andarConstrucoes,
  animoDoInvestimento,
  construcoesIniciais,
  lucroDosSetores,
  precoDosSetores,
  empregoDoPais,
  migrarSetores,
  investimentoBase,
  tamanhoDaEconomia,
  andarPrecos,
  capacidadeInicial,
  contaDoPais,
  freioDoCrescimento,
  pressaoNosPrecos,
  reacaoCivil,
  situacaoDaCapacidade,
  precosIniciais,
  reacaoDaCesta,
  segurancaDaCesta,
} from "../mercado";
import {
  colisoesDe,
  leiAtiva,
  motivoValorInvalido,
  valoresComPedidos,
  type ValorLei,
} from "../leis";
import {
  andarMoradia,
  familias,
  indicesDaMoradia,
  moradiaInicial,
  pessoasNoCampo,
  type RegraDaMoradia,
} from "../moradia";
import {
  andarAtendimento,
  atendimentoInicial,
  desigualdadeDaRede,
  desvioDaRede,
  fluxoDeProfissionais,
  fraquezaDaRede,
  indiceDoAtendimento,
  indiceDosProfissionais,
  trabalhoDoAtendimento,
  type LeisDoAtendimento,
  type RegraDoAtendimento,
} from "../atendimento";
import {
  andarSaneamento,
  indiceDoSaneamento,
  rendaParaAConta,
  ritmoDoSetor,
  saneamentoInicial,
  trabalhoEmObra,
  type LeisDoSaneamento,
  type RegraDoSaneamento,
} from "../saneamento";
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
  migrarPops,
  motivoPopsInvalidos,
  parteAbaixoDe,
  rendaMedia,
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
  const anteriores: Pedido[] = [];
  for (const pedido of pedidos) {
    const lei = regras.leis[pedido.lei];
    if (!lei) throw new Error(`pedido: lei "${pedido.lei}" não existe`);
    const motivo = motivoValorInvalido(lei, pedido.valor);
    if (motivo) throw new Error(`pedido: ${pedido.lei} ${motivo}`);
    const valores = valoresComPedidos(regras.leis, estado.leis, anteriores);
    const colide = leiAtiva(lei, pedido.valor)
      ? colisoesDe(lei.id, regras.colisoes ?? [], regras.leis, valores)
      : [];
    if (colide.length)
      throw new Error(`pedido: ${lei.id} colide com ${colide.join(", ")}`);
    anteriores.push(pedido);
    const atual = estado.leis[lei.id];
    if (atual === pedido.valor) continue;
    votacoes.push(
      regras.congresso
        ? votar(
            regras.congresso,
            estado.coligacao,
            gruposComDeslize(regras.grupos, estado.pops, estado.deslize),
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
function animoDoPais(regras: Regras, estado: Estado): number {
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
const economiaReal: Etapa = (regras, estado) => {
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
const precosEJuros: Etapa = (regras, estado) => {
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
const capacidades: Etapa = (regras, estado) => ({
  ...estado,
  capacidade: andarCapacidade(
    regras.mercado?.mercado.capacidades ?? [],
    estado.capacidade,
    estado.leis,
  ),
});

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

/** Cestas cujo índice o mundo declara (ex.: abastecimento, acesso a remédios). */
const cestasComIndice = (regras: Regras) =>
  (regras.mercado?.mercado.cestas ?? []).filter((c) => c.indice);

/**
 * Segurança média da população em cada cesta com índice, com os preços e a
 * renda de hoje (motor/mercado, fatias 6c e 6d).
 */
function indicesDasCestas(
  regras: Regras,
  estado: Estado,
): Record<string, number> {
  const cestas = cestasComIndice(regras);
  const m = regras.mercado;
  if (cestas.length === 0 || !m) return {};
  const conta = contaDoPais(
    m.mercado,
    m.producao,
    m.cobertura,
    m.populacaoBase,
    estado.essenciais.populacao,
    estado.precos,
  );
  const seguranca = segurancaDaCesta(m.mercado, conta, estado.pops);
  const indices: Record<string, number> = {};
  for (const cesta of cestas) {
    const media = seguranca.find((c) => c.id === cesta.id)?.media;
    if (cesta.indice && media !== undefined) indices[cesta.indice] = media;
  }
  return indices;
}

/**
 * Pontos que as cestas somam em outros índices (6c e 6d). Usa o índice do
 * turno anterior: o efeito chega com um turno de atraso.
 */
function reacaoDasCestas(regras: Regras, estado: Estado) {
  const soma: Record<string, number> = {};
  for (const cesta of cestasComIndice(regras)) {
    const atual = cesta.indice && estado.jogabilidade[cesta.indice];
    const marco = cesta.indice && estado.marco.indices[cesta.indice];
    if (!cesta.reacao || atual === undefined || marco === undefined) continue;
    const pontos = reacaoDaCesta(cesta.reacao, Number(atual) - Number(marco));
    for (const [id, v] of Object.entries(pontos))
      soma[id] = (soma[id] ?? 0) + v;
  }
  // Falta de capacidade que chega aos civis (ex.: apagão em crise grave).
  for (const { capacidade, situacao } of situacoesDeCapacidade(regras, estado))
    for (const [id, v] of Object.entries(reacaoCivil(capacidade, situacao)))
      soma[id] = (soma[id] ?? 0) + v;
  return soma;
}

function jogabilidade(regras: Regras, estado: Estado) {
  const soma = somaPorIndice(estado.efeitos);
  const cestas = reacaoDasCestas(regras, estado);
  const indices: Record<string, number> = {};
  for (const [id, base] of Object.entries(estado.base)) {
    const { min, max } = regras.dominios[id];
    indices[id] = Math.min(
      max,
      Math.max(min, base + (soma[id] ?? 0) + (cestas[id] ?? 0)),
    );
  }
  // Os índices das cestas não têm base: são calculados no passo 8 e passam adiante.
  for (const { indice } of cestasComIndice(regras))
    if (indice && indice in estado.jogabilidade)
      indices[indice] = estado.jogabilidade[indice];
  return indices;
}

/** Capacidade do setor que constrói: hoje ÷ turno 0. */
function tamanhoDoSetor(regras: Regras, estado: Estado): number {
  const obras = regras.mercado?.mercado.obras;
  const c = estado.construcoes;
  if (!obras || !c?.inicio[obras.setor]) return 1;
  return (c.prontas[obras.setor] ?? 0) / c.inicio[obras.setor];
}

/** Quanto as obras andam neste turno: casas, rede e hospitais disputam o mesmo setor. */
export function ritmoDasObras(regras: Regras, estado: Estado): number {
  const { saneamento: regra, moradia } = regras;
  const s = estado.saneamento;
  if (!regra || !moradia || !s) return 1;
  return ritmoDoSetor(
    regra,
    tamanhoDoSetor(regras, estado),
    trabalhoEmObra(
      regra,
      moradia.custo_casa,
      estado.moradia?.obras ?? [],
      s.obras,
    ) +
      (regras.atendimento
        ? trabalhoDoAtendimento(
            regras.atendimento,
            estado.atendimento?.obras ?? [],
          )
        : 0),
    s.trabalho_inicial,
  );
}

/** Número da opção em vigor (`valores.parte`); sem a lei, 0. */
function parteDaLei(
  regras: Regras,
  valores: Record<string, ValorLei>,
  id: string,
  chave = "parte",
): number {
  const lei = regras.leis[id];
  if (lei?.forma !== "opcoes") return 0;
  return lei.opcoes.find((o) => o.id === valores[id])?.valores?.[chave] ?? 0;
}

/** O que as leis pedem à rede, em números. */
export function leisDoSaneamento(
  regras: Regras,
  regra: RegraDoSaneamento,
  valores: Record<string, ValorLei>,
): LeisDoSaneamento {
  const verba = valores[regra.lei_verba];
  return {
    verba: typeof verba === "number" ? verba : 0,
    concessao: parteDaLei(regras, valores, regra.lei_concessao),
    teto: parteDaLei(regras, valores, regra.lei_teto),
    tratamento: parteDaLei(regras, valores, regra.lei_tratamento),
  };
}

/** O que as leis pedem à rede de atendimento, em números. */
export function leisDoAtendimento(
  regras: Regras,
  regra: RegraDoAtendimento,
  valores: Record<string, ValorLei>,
): LeisDoAtendimento {
  const verba = valores[regra.lei_verba];
  const basica = valores[regra.lei_basica];
  const soma = (conta: (id: string) => number) =>
    regra.leis_alcance.reduce((total, id) => total + conta(id), 0);
  const alcanceDe = (id: string) => parteDaLei(regras, valores, id, "alcance");
  const alcance = soma(alcanceDe);
  return {
    verba: typeof verba === "number" ? verba : 0,
    abertura: parteDaLei(regras, valores, regra.lei_abertura),
    limite: parteDaLei(regras, valores, regra.lei_limite),
    basica: typeof basica === "number" ? basica : 0,
    alcance,
    fraco:
      alcance > 0
        ? soma(
            (id) => alcanceDe(id) * parteDaLei(regras, valores, id, "fraco"),
          ) / alcance
        : 0,
    abandono: soma((id) => parteDaLei(regras, valores, id, "abandono")),
    seguro: parteDaLei(regras, valores, regra.lei_seguro),
    informal: parteDaLei(regras, valores, regra.lei_seguro, "informal"),
  };
}

/** Renda real dos pops: a de hoje e a do turno 0, com as pessoas de hoje. */
function rendasReais({ pops, essenciais, marco }: Estado) {
  const hoje: Record<string, { pessoas: number; renda: number }> = {};
  const inicio: typeof hoje = {};
  for (const [id, { pessoas, renda }] of Object.entries(pops)) {
    const real = (renda * 100) / essenciais.indice_precos;
    hoje[id] = { pessoas, renda: real };
    inicio[id] = { pessoas, renda: marco.renda_pop?.[id] ?? real };
  }
  return { hoje, inicio };
}

/**
 * Parte das famílias que não paga uma conta, a mais que no turno 0. Os mínimos
 * são de renda, em vezes a renda média do turno 0.
 */
export function apertoDoBolso(
  estado: Estado,
  minimo: number,
  minimoInicial: number,
): number {
  const { hoje, inicio } = rendasReais(estado);
  const media = rendaMedia(inicio);
  return (
    parteAbaixoDe(hoje, minimo * media) -
    parteAbaixoDe(inicio, minimoInicial * media)
  );
}

/** Parte das pessoas com renda para pagar um plano de saúde. */
export function comBolsoParaPlano(
  regra: RegraDoAtendimento,
  estado: Estado,
): number {
  const { hoje, inicio } = rendasReais(estado);
  return 1 - parteAbaixoDe(hoje, regra.renda_plano * rendaMedia(inicio));
}

/** Parte das pessoas com salário em folha. */
export const pessoasNaFolha = (
  regra: RegraDoAtendimento,
  pops: Estado["pops"],
  populacao: number,
) =>
  regra.pops_folha.reduce((soma, id) => soma + pops[id].pessoas, 0) / populacao;

/** Índice do emprego informal: a parte das pessoas no pop informal. */
export const indiceDoInformal = (
  regra: RegraDoAtendimento,
  pops: Estado["pops"],
  populacao: number,
) => (pops[regra.pop_informal].pessoas / populacao) * 100;

/** Quanto o preço pesa no bolso, a mais que no turno 0 (motor/moradia). */
export function apertoDaMoradia(
  regra: RegraDaMoradia,
  estado: Estado,
  preco: number,
): number {
  return apertoDoBolso(
    estado,
    regra.renda_por_ponto * preco,
    regra.renda_por_ponto * estado.marco.indices[regra.indice_preco],
  );
}

/**
 * 6b. Moradia: casas desgastam, ficam prontas e começam (motor/moradia). O que
 * a contagem andou move a base do déficit e da favela.
 */
const moradia: Etapa = (regras, estado) => {
  const regra = regras.moradia;
  const obras = regras.mercado?.mercado.obras;
  const m = estado.moradia;
  if (!regra || !obras || !m || !estado.construcoes) return estado;
  const { populacao } = estado.essenciais;
  const marco = estado.marco.indices;
  const verba = estado.leis[regra.lei_verba];
  const atraso = estado.jogabilidade[obras.indice_atraso] ?? 0;
  const preco0 = marco[regra.indice_preco];
  const nova = andarMoradia(regra, obras, m, {
    populacao,
    verba: typeof verba === "number" ? verba : 0,
    atraso,
    atraso_inicial: marco[obras.indice_atraso] ?? atraso,
    setor: tamanhoDoSetor(regras, estado),
    ritmo: ritmoDasObras(regras, estado),
    preco: preco0 > 0 ? estado.jogabilidade[regra.indice_preco] / preco0 : 1,
    animo: animoDoPais(regras, estado),
    familias_campo: familias(regra, pessoasNoCampo(regra, estado.pops)),
    concentracao:
      estado.jogabilidade[regra.indice_terra] - marco[regra.indice_terra],
    aperto: apertoDaMoradia(
      regra,
      estado,
      estado.jogabilidade[regra.indice_preco],
    ),
  });
  const antes = indicesDaMoradia(regra, m, populacao);
  const depois = indicesDaMoradia(regra, nova, populacao);
  return {
    ...estado,
    moradia: nova,
    base: {
      ...estado.base,
      [regra.indice_deficit]:
        estado.base[regra.indice_deficit] + depois.deficit - antes.deficit,
      [regra.indice_favela]:
        estado.base[regra.indice_favela] + depois.favela - antes.favela,
    },
  };
};

/**
 * 6c. Saneamento: a rede desgasta, as ligações ficam prontas e começam
 * (motor/saneamento). O que a contagem andou move a base dos índices.
 */
const saneamento: Etapa = (regras, estado) => {
  const regra = regras.saneamento;
  const obras = regras.mercado?.mercado.obras;
  const s = estado.saneamento;
  if (!regra || !regras.moradia || !obras || !s) return estado;
  const { populacao } = estado.essenciais;
  const atraso = estado.jogabilidade[obras.indice_atraso] ?? 0;
  const casas = estado.moradia;
  const leis = leisDoSaneamento(regras, regra, estado.leis);
  const nova = andarSaneamento(regra, s, {
    populacao,
    leis,
    atraso,
    atraso_inicial: estado.marco.indices[obras.indice_atraso] ?? atraso,
    setor: tamanhoDoSetor(regras, estado),
    animo: animoDoPais(regras, estado),
    sem_lucro:
      (casas?.precarias ?? 0) +
      familias(regras.moradia, pessoasNoCampo(regras.moradia, estado.pops)),
    ritmo: ritmoDasObras(regras, estado),
    aperto: apertoDoBolso(
      estado,
      rendaParaAConta(regra, leis),
      rendaParaAConta(
        regra,
        leisDoSaneamento(regras, regra, estado.marco.leis),
      ),
    ),
  });
  const { base } = estado;
  return {
    ...estado,
    saneamento: nova,
    base: {
      ...base,
      [regra.indice]:
        base[regra.indice] +
        indiceDoSaneamento(regra, nova, populacao) -
        indiceDoSaneamento(regra, s, populacao),
      [regra.indice_vida]: base[regra.indice_vida] + nova.vida - s.vida,
      [regra.indice_ambiente]:
        base[regra.indice_ambiente] + nova.ambiente - s.ambiente,
    },
  };
};

/**
 * 6d. Atendimento: vagas, planos e profissionais andam (motor/atendimento). Quem
 * se forma ou para muda de pop; quem emigra sai da população. O que a contagem
 * andou move a base dos índices.
 */
const atendimento: Etapa = (regras, estado) => {
  const regra = regras.atendimento;
  const obras = regras.mercado?.mercado.obras;
  const s = estado.atendimento;
  const pop = regra && estado.pops[regra.pop_profissionais];
  if (!regra || !obras || !s || !pop) return estado;
  const { populacao } = estado.essenciais;
  const marco = estado.marco.indices;
  const instrucao = estado.jogabilidade[regra.indice_instrucao];
  const instrucao0 = marco[regra.indice_instrucao];
  const renda0 = estado.marco.renda_pop?.[regra.pop_profissionais];
  const leis = leisDoAtendimento(regras, regra, estado.leis);
  const nova = andarAtendimento(regra, s, {
    populacao,
    leis,
    atraso: estado.jogabilidade[obras.indice_atraso] ?? 0,
    ritmo: ritmoDasObras(regras, estado),
    com_bolso: comBolsoParaPlano(regra, estado),
    na_folha: pessoasNaFolha(regra, estado.pops, populacao),
  });
  const { turmas, formados, param, emigrados } = fluxoDeProfissionais(
    regra,
    s,
    {
      populacao,
      profissionais: pop.pessoas,
      instrucao: instrucao0 > 0 ? instrucao / instrucao0 : 1,
      renda: renda0
        ? (pop.renda * 100) / estado.essenciais.indice_precos / renda0
        : 1,
      abandono: leis.abandono,
    },
  );
  const profissionais = pop.pessoas + formados - param - emigrados;
  const novaPopulacao = populacao - emigrados;
  const troca = (formados - param - emigrados) / populacao;
  const migracao = {
    ...estado.migracao,
    [regra.pop_profissionais]:
      (estado.migracao?.[regra.pop_profissionais] ?? 0) + troca,
    [regra.pop_origem]: (estado.migracao?.[regra.pop_origem] ?? 0) - troca,
  };
  for (const id of regra.pops_encargo) {
    const saiu =
      regras.pais.pops[id].parcela_pessoas * (nova.encargo - s.encargo);
    migracao[id] = (migracao[id] ?? 0) - saiu;
    migracao[regra.pop_informal] = (migracao[regra.pop_informal] ?? 0) + saiu;
  }
  const rede = {
    populacao: novaPopulacao,
    profissionais,
    vagas: nova.vagas,
    planos: nova.planos,
    seguro: nova.seguro,
    alcance: nova.alcance,
    cobertura: nova.cobertura,
    fraco: leis.fraco,
  };
  const indice = indiceDoAtendimento(regra, rede);
  const desvio = desvioDaRede(regra, rede);
  const desigualdade = desigualdadeDaRede(regra, rede);
  const fraqueza = fraquezaDaRede(regra, rede);
  const indice_profissionais = indiceDosProfissionais(
    regra,
    profissionais,
    novaPopulacao,
  );
  const indice_informal = indiceDoInformal(regra, estado.pops, novaPopulacao);
  const { base } = estado;
  return {
    ...estado,
    essenciais: { ...estado.essenciais, populacao: novaPopulacao },
    migracao,
    atendimento: {
      ...nova,
      turmas,
      indice,
      indice_profissionais,
      indice_informal,
      desvio,
      desigualdade,
      fraqueza,
    },
    base: {
      ...base,
      [regra.indice]: base[regra.indice] + indice - s.indice,
      [regra.indice_profissionais]:
        base[regra.indice_profissionais] +
        indice_profissionais -
        s.indice_profissionais,
      [regra.indice_informal]:
        base[regra.indice_informal] + indice_informal - s.indice_informal,
      [regra.indice_desvio]: base[regra.indice_desvio] + desvio - s.desvio,
      [regra.indice_desigualdade]:
        base[regra.indice_desigualdade] + desigualdade - s.desigualdade,
      [regra.indice_vida]: base[regra.indice_vida] - fraqueza + s.fraqueza,
    },
  };
};

/** 7. Índices de jogabilidade: base do país + contribuições das leis; a deriva move a base. */
const indicesJogabilidade: Etapa = (regras, estado) => {
  const base = regras.derivas
    ? andarDerivas(
        regras.derivas,
        estado.base,
        todosIndices(estado),
        estado.marco.indices,
        somaPorIndice(estado.efeitos),
        regras.dominios,
      )
    : estado.base;
  const comBase = { ...estado, base };
  return { ...comBase, jogabilidade: jogabilidade(regras, comBase) };
};

/** A reputação é a média das opiniões, pesada pelo peso (motor/mundo). */
function comReputacao(regras: Regras, estado: Estado): Estado {
  const { potencias, indiceReputacao } = regras;
  if (!potencias || !indiceReputacao) return estado;
  const { min, max } = regras.dominios[indiceReputacao];
  const dasCestas = reacaoDasCestas(regras, estado)[indiceReputacao] ?? 0;
  const rep = Math.min(
    max,
    Math.max(min, reputacao(potencias, estado.opinioes) + dasCestas),
  );
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

/** 7c. Preço do mundo anda rumo ao que a oferta pede (motor/mercado). */
const precosDoMundo: Etapa = (regras, estado) => {
  if (!regras.mercado) return estado;
  const { mercado, producao } = regras.mercado;
  const choques = andarChoques(mercado, estado.choques, estado.turno);
  return {
    ...estado,
    choques,
    precos: andarPrecos(
      mercado,
      producao,
      estado.precos,
      estado.turno,
      choques,
    ),
  };
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
    migracao: estado.migracao,
  });
}

/** Essenciais e jogabilidade num mapa só, para os grupos. */
const todosIndices = (estado: Estado): Record<string, number> => ({
  ...estado.essenciais,
  ...estado.jogabilidade,
});

/** Quanto a renda real cresce no ritmo normal do país desde o turno 0. */
const rendaEsperada = (regras: Regras, estado: Estado) =>
  Math.pow(doTurno(regras.pais.crescimento.tendencia), estado.turno);

/** Grupos com os pops já calculados no estado (motor/grupos). */
function grupos(regras: Regras, estado: Estado, marco: Marco) {
  return calcularGrupos(
    gruposComDeslize(regras.grupos, estado.pops, estado.deslize),
    regras.leis,
    {
      pops: estado.pops,
      indice_precos: estado.essenciais.indice_precos,
      indices: todosIndices(estado),
      vigentes: estado.leis,
      marco,
      esperado: rendaEsperada(regras, estado),
      anteriores: estado.turno === 0 ? undefined : estado.grupos,
    },
  );
}

/** Pops andam na bússola com a vida e com o governo (motor/grupos). */
function deslize(regras: Regras, estado: Estado) {
  return deslizarPops(regras.pops, estado.deslize, {
    pops: estado.pops,
    grupos: estado.grupos,
    tipos: regras.grupos,
    pais: posicaoDoPais(regras.leis, estado.leis),
    indice_precos: estado.essenciais.indice_precos,
    esperado: rendaEsperada(regras, estado),
    marco: estado.marco,
  });
}

/** Gente sobe e desce de estrato com a renda e a instrução (motor/populacao). */
function migracao(regras: Regras, estado: Estado) {
  return migrarPops(regras.pops, regras.pais.pops, estado.migracao, {
    pops: estado.pops,
    populacao: estado.essenciais.populacao,
    renda_pop: estado.marco.renda_pop,
    indice_precos: estado.essenciais.indice_precos,
    esperado: rendaEsperada(regras, estado),
    indices: todosIndices(estado),
  });
}

/** Gente estuda e muda para o setor que paga mais (motor/mercado/emprego). */
function setores(regras: Regras, estado: Estado) {
  const m = regras.mercado;
  if (!m) return estado.setores;
  return migrarSetores(
    m.mercado,
    m.ocupacao,
    estado.setores,
    estado.pops,
    todosIndices(estado),
  );
}

/** Índices das cestas de hoje no estado, para os grupos e o turno seguinte. */
function comIndicesDasCestas(regras: Regras, estado: Estado): Estado {
  const indices = indicesDasCestas(regras, estado);
  if (Object.keys(indices).length === 0) return estado;
  return { ...estado, jogabilidade: { ...estado.jogabilidade, ...indices } };
}

/** 8. Pops e grupos: renda dos pops, depois satisfação dos grupos. */
const popsEGrupos: Etapa = (regras, estado) => {
  const comPops = comIndicesDasCestas(regras, {
    ...estado,
    pops: pops(regras, estado),
  });
  const comGrupos = {
    ...comPops,
    grupos: grupos(regras, comPops, estado.marco),
  };
  return {
    ...comGrupos,
    deslize: deslize(regras, comGrupos),
    migracao: migracao(regras, comGrupos),
    setores: setores(regras, comGrupos),
  };
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
  const casas = estado.moradia;
  if (
    casas &&
    !(
      Number.isFinite(casas.formais) &&
      Number.isFinite(casas.precarias) &&
      casas.formais >= 0 &&
      casas.precarias >= 0
    )
  )
    falhas.push("estoque de casas inválido");
  const rede = estado.saneamento;
  if (
    rede &&
    !(
      Number.isFinite(rede.ligadas) &&
      Number.isFinite(rede.cortadas) &&
      rede.cortadas >= 0 &&
      rede.ligadas >= rede.cortadas
    )
  )
    falhas.push("rede de saneamento inválida");
  const saude = estado.atendimento;
  if (
    saude &&
    !(
      Number.isFinite(saude.vagas) &&
      Number.isFinite(saude.planos) &&
      saude.vagas >= 0 &&
      saude.planos >= 0
    )
  )
    falhas.push("rede de atendimento inválida");
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
  capacidades,
  contas,
  moradia,
  saneamento,
  atendimento,
  indicesJogabilidade,
  mundo,
  precosDoMundo,
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
  return {
    ...novo,
    mudanca: {
      pib: novo.essenciais.pib_nominal - estado.essenciais.pib_nominal,
      divida: novo.tesouro.divida - estado.tesouro.divida,
    },
  };
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
  const calculados = new Set(
    regras.mercado?.mercado.cestas.map((c) => c.indice),
  );
  for (const id of Object.keys(regras.dominios))
    if (!(id in inicio.jogabilidade) && !calculados.has(id))
      throw new Error(`país: falta o índice ${id}`);
  for (const d of regras.derivas ?? []) {
    if (!(d.indice in regras.dominios))
      throw new Error(`mundo: deriva de índice "${d.indice}" que não existe`);
    if (!(d.por in regras.dominios) && !(d.por in inicio.essenciais))
      throw new Error(`mundo: deriva empurrada por "${d.por}", que não existe`);
  }
  for (const [a, b] of regras.colisoes ?? []) {
    for (const id of [a, b])
      if (!(id in regras.leis))
        throw new Error(`mundo: colisão com lei "${id}", que não existe`);
    const leis = regras.leis;
    if (leiAtiva(leis[a], inicio.leis[a]) && leiAtiva(leis[b], inicio.leis[b]))
      throw new Error(`país: "${a}" e "${b}" colidem e começam as duas`);
  }
  for (const base of Object.keys(regras.pais.bases))
    if (!ehBase(base)) throw new Error(`país: base "${base}" não existe`);
  for (const c of regras.mercado?.mercado.capacidades ?? [])
    for (const f of c.fontes) {
      const lei = regras.leis[f.lei];
      if (!lei || lei.forma !== "continua")
        throw new Error(
          `mundo: fonte "${f.id}" aponta a lei "${f.lei}", que não é contínua`,
        );
      if (!(f.id in regras.mercado!.capacidade))
        throw new Error(`país: falta a capacidade da fonte "${f.id}"`);
    }
  for (const c of regras.mercado?.mercado.capacidades ?? [])
    for (const camada of c.camadas ?? []) {
      const lei = regras.leis[camada.lei];
      if (!lei || lei.forma !== "opcoes")
        throw new Error(
          `mundo: camada "${camada.lei}" não é uma lei de opções`,
        );
      for (const id of Object.keys(camada.opcoes))
        if (!lei.opcoes.some((o) => o.id === id))
          throw new Error(
            `mundo: camada "${camada.lei}" cita a opção "${id}", que a lei não tem`,
          );
    }
  const obras = regras.mercado?.mercado.obras;
  if (obras && !(obras.indice_atraso in regras.dominios))
    throw new Error(
      `mundo: obras: o índice "${obras.indice_atraso}" não existe`,
    );
  if (regras.moradia) {
    const r = regras.moradia;
    if (!obras) throw new Error("mundo: moradia precisa da regra das obras");
    for (const id of [
      r.indice_deficit,
      r.indice_favela,
      r.indice_preco,
      r.indice_terra,
    ])
      if (!(id in regras.dominios))
        throw new Error(`mundo: moradia: o índice "${id}" não existe`);
    for (const id of r.pops_campo)
      if (!regras.pops.some((p) => p.id === id))
        throw new Error(`mundo: moradia: o pop "${id}" não existe`);
    if (regras.leis[r.lei_verba]?.forma !== "continua")
      throw new Error(`mundo: moradia: "${r.lei_verba}" não é lei contínua`);
    if (
      inicio.jogabilidade[r.indice_favela] >
      inicio.jogabilidade[r.indice_deficit]
    )
      throw new Error("país: favela maior que o déficit habitacional");
  }
  if (regras.saneamento) {
    const r = regras.saneamento;
    if (!regras.moradia || !obras)
      throw new Error("mundo: saneamento precisa da moradia e das obras");
    for (const id of [r.indice, r.indice_vida, r.indice_ambiente])
      if (!(id in regras.dominios))
        throw new Error(`mundo: saneamento: o índice "${id}" não existe`);
    if (regras.leis[r.lei_verba]?.forma !== "continua")
      throw new Error(`mundo: saneamento: "${r.lei_verba}" não é lei contínua`);
    for (const id of [r.lei_concessao, r.lei_teto, r.lei_tratamento])
      if (regras.leis[id]?.forma !== "opcoes")
        throw new Error(`mundo: saneamento: "${id}" não é lei de opções`);
  }
  if (regras.atendimento) {
    const r = regras.atendimento;
    if (!obras) throw new Error("mundo: atendimento precisa das obras");
    for (const id of [
      r.indice,
      r.indice_profissionais,
      r.indice_instrucao,
      r.indice_desvio,
      r.indice_desigualdade,
      r.indice_vida,
      r.indice_informal,
    ])
      if (!(id in regras.dominios))
        throw new Error(`mundo: atendimento: o índice "${id}" não existe`);
    for (const id of [
      r.pop_profissionais,
      r.pop_origem,
      r.pop_informal,
      ...r.pops_folha,
      ...r.pops_encargo,
    ])
      if (!regras.pops.some((p) => p.id === id))
        throw new Error(`mundo: atendimento: o pop "${id}" não existe`);
    for (const id of [r.lei_verba, r.lei_basica])
      if (regras.leis[id]?.forma !== "continua")
        throw new Error(`mundo: atendimento: "${id}" não é lei contínua`);
    for (const id of [
      r.lei_abertura,
      r.lei_limite,
      r.lei_seguro,
      ...r.leis_alcance,
    ])
      if (regras.leis[id]?.forma !== "opcoes")
        throw new Error(`mundo: atendimento: "${id}" não é lei de opções`);
  }
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
    precos: regras.mercado
      ? precosIniciais(regras.mercado.mercado, regras.mercado.producao)
      : {},
    capacidade: regras.mercado
      ? capacidadeInicial(
          regras.mercado.mercado.capacidades ?? [],
          regras.mercado.capacidade,
          inicio.leis,
        )
      : {},
    choques: {},
    coligacao: [...coligacao],
    votacoes: [],
    desgaste: 0,
    inicio_mandato: 0,
    eleicao: null,
    encerrada: false,
  };
  // Turno 0 mostra as contas sem fechar: cofre e dívida são os declarados.
  const fluxos = fluxosDoTurno(regras, estado);
  const comPops: Estado = comIndicesDasCestas(regras, {
    ...comReputacao(regras, estado),
    essenciais: mostrarContas(estado.essenciais, fluxos, tesouro),
    pops: pops(regras, estado),
  });
  // Construções do turno 0: cada setor vale a renda que paga (motor/mercado).
  const m = regras.mercado;
  if (m?.mercado.obras) {
    const emprego = empregoDoPais(m.mercado, m.ocupacao, comPops.pops);
    comPops.construcoes = construcoesIniciais(
      m.mercado.obras,
      Object.fromEntries(emprego.setores.map((s) => [s.id, s.massa + s.lucro])),
      regras.pais.crescimento.tendencia,
      comPops.jogabilidade[m.mercado.obras.indice_atraso] ?? 0,
      {
        salarios: Object.fromEntries(
          emprego.setores.map((s) => [s.id, s.massa]),
        ),
        preco0: precoDosSetores(m.mercado, comPops.precos),
      },
    );
  }
  if (regras.moradia && m?.mercado.obras) {
    const r = regras.moradia;
    const verba = comPops.leis[r.lei_verba];
    comPops.moradia = moradiaInicial(r, m.mercado.obras, {
      populacao: comPops.essenciais.populacao,
      deficit: comPops.jogabilidade[r.indice_deficit],
      favela: comPops.jogabilidade[r.indice_favela],
      verba: typeof verba === "number" ? verba : 0,
      atraso: comPops.jogabilidade[m.mercado.obras.indice_atraso] ?? 0,
    });
  }
  if (regras.saneamento && regras.moradia && m?.mercado.obras) {
    const r = regras.saneamento;
    const leis = leisDoSaneamento(regras, r, comPops.leis);
    comPops.saneamento = saneamentoInicial(r, {
      populacao: comPops.essenciais.populacao,
      saneamento: comPops.jogabilidade[r.indice],
      leis,
      atraso: comPops.jogabilidade[m.mercado.obras.indice_atraso] ?? 0,
      sem_bolso: parteAbaixoDe(
        comPops.pops,
        rendaParaAConta(r, leis) * rendaMedia(comPops.pops),
      ),
      trabalho_casas: trabalhoEmObra(
        r,
        regras.moradia.custo_casa,
        comPops.moradia?.obras ?? [],
        [],
      ),
    });
  }
  if (regras.atendimento && m?.mercado.obras) {
    const r = regras.atendimento;
    const { populacao } = comPops.essenciais;
    const profissionais = comPops.pops[r.pop_profissionais].pessoas;
    const atendimento = comPops.jogabilidade[r.indice];
    comPops.atendimento = atendimentoInicial(r, {
      populacao,
      profissionais,
      atendimento,
      leis: leisDoAtendimento(regras, r, comPops.leis),
      atraso: comPops.jogabilidade[m.mercado.obras.indice_atraso] ?? 0,
      com_bolso:
        1 -
        parteAbaixoDe(comPops.pops, r.renda_plano * rendaMedia(comPops.pops)),
      na_folha: pessoasNaFolha(r, comPops.pops, populacao),
      informal: indiceDoInformal(r, comPops.pops, populacao),
    });
    const teto = indiceDoAtendimento(r, {
      populacao,
      profissionais,
      vagas: populacao,
      planos: comPops.atendimento.planos,
      seguro: comPops.atendimento.seguro,
    });
    if (atendimento > teto + 1e-6)
      throw new Error("país: atendimento maior que o dos profissionais");
  }
  // O marco é o próprio turno 0: grupos começam em 50.
  const marco: Marco = {
    renda_pop: Object.fromEntries(
      Object.entries(comPops.pops).map(([id, p]) => [
        id,
        (p.renda * 100) / comPops.essenciais.indice_precos,
      ]),
    ),
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
