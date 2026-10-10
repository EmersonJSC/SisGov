/**
 * Camada da partida: a única porta de entrada da interface.
 *
 * A tela chama só estas funções e lê só a `VisaoPartida`. Ela nunca importa
 * nada de `engine/`, `game/` ou `domain/`. Contrato em
 * `docs/arquitetura/api-da-partida.md`.
 */
import {
  calculateContribution,
  type GraphRelation,
  type ResolvedPackage,
  type ScenarioGraph,
} from "../engine";
import { efficacyNodeId } from "../engine/model/lawNodes";
import { changePolicyTarget } from "../domain/game";
import { createGame, type GameState } from "../game/createGame";
import { commitPolicyAction } from "../game/commitPolicyAction";
import { prepareMonthlyContent } from "../game/prepareMonthlyContent";
import { prepareGameQuarter } from "../game/prepareGameQuarter";
import { commitGameQuarter } from "../game/commitGameQuarter";
import { policyLevelRulesFromContent } from "../game/policyRulesFromContent";
import { advancePolicyImplementation } from "../game/advancePolicyImplementation";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

export type Resultado<T> =
  { ok: true; value: T } | { ok: false; erros: readonly string[] };

/**
 * `teste`: toda mudança de lei vale na hora (o Congresso ainda não vota).
 * `real`: leis que exigem o Congresso viram proposta (votação ainda não ligada).
 */
export type ModoPartida = "teste" | "real";

export type Partida = Readonly<{
  modo: ModoPartida;
  content: ResolvedPackage;
  graph: ScenarioGraph;
  game: GameState;
  acoes: number;
}>;

export type VisaoOpcao = Readonly<{
  id: string;
  rotulo: string;
  valor: number;
  /**
   * Quanto a lei arrecadaria (+) ou custaria (−) por ano nesta opção, com o
   * país como está agora (moeda do país). 0 se não toca o orçamento.
   */
  saldoAnual: number;
}>;

export type VisaoLei = Readonly<{
  id: string;
  nome: string;
  descricao: string;
  grupo: "orcamentaria" | "regulatoria" | "tributaria" | "institucional";
  area: string;
  /** Ministérios a que esta política pertence; hoje o conteúdo expõe um. */
  ministerios: readonly string[];
  ministerio: string;
  /**
   * Como a lei muda: `emenda-constitucional`, `lei-ordinaria`,
   * `execucao-programa-autorizado`… A tela põe as constitucionais também na
   * área da Presidência.
   */
  processo: string;
  /** Nível que já está funcionando (anda até a meta mês a mês). */
  nivel: number;
  /** Nível escolhido pelo jogador. */
  meta: number;
  minimo?: number;
  maximo?: number;
  unidade: string;
  opcoes?: readonly VisaoOpcao[];
  /** Opção mais próxima do nível em funcionamento. */
  opcaoAtual?: string;
  /**
   * Quanto a lei mexe nas contas por ano, na moeda do país, lido da rede:
   * positivo arrecada (seta para a receita), negativo custa (seta para o
   * gasto). 0 se a lei não toca o orçamento.
   */
  saldoAnual: number;
}>;

export type VisaoBolha = Readonly<{
  id: string;
  nome: string;
  tipo: string;
  unidade: string;
  area: string;
  avaliacao?: string;
  valor: number;
  /** Escala da bolha (do domínio no conteúdo). */
  minimo: number;
  maximo: number;
  /** Situação: valor a partir do qual ela surge. */
  surgimento?: number;
}>;

export type VisaoLigacao = Readonly<{
  id: string;
  origem: string;
  alvo: string;
  sinal: 1 | -1;
  /** Atraso declarado no conteúdo, convertido para meses. */
  atrasoMeses: number;
  /**
   * `afim` (proporcional), `limiar` (só reage depois de certo ponto),
   * `pontos` (um valor para cada opção da lei, ligado em retas) ou `produto`
   * (a origem multiplica outra: base × alíquota, dívida × taxa, desemprego ×
   * seguro).
   */
  mecanismo: string;
}>;

/** Os nós do orçamento na rede (SG157, D-47): são bolhas como as outras. */
export const BOLHAS_DO_ORCAMENTO = {
  receita: "arrecadacao",
  gasto: "gasto_publico",
  juros: "juros_da_divida",
  resultado: "resultado_fiscal",
  divida: "divida_publica",
} as const;

type Contas = Readonly<Record<keyof typeof BOLHAS_DO_ORCAMENTO, number>>;

/**
 * As contas do governo, lidas das bolhas do orçamento. Receita, gasto, juros
 * e resultado são por ano; resultado = receita − gasto − juros (positivo é
 * superávit). Não há caixa: o déficit soma na dívida e o superávit abate
 * (D-49).
 */
export type VisaoContas = Contas &
  Readonly<{
    /** PIB do país por ano, na moeda do país. */
    pib: number;
    /** As mesmas contas em % do PIB, como estão na rede. */
    percentualPib: Contas;
  }>;

export type VisaoPartida = Readonly<{
  pais: string;
  turno: number;
  contas: VisaoContas;
  leis: readonly VisaoLei[];
  bolhas: readonly VisaoBolha[];
  ligacoes: readonly VisaoLigacao[];
}>;

export type RelatorioTurno = Readonly<{
  turno: number;
  /** Contas antes e depois do trimestre (por ano, na moeda do país). */
  contasAntes: VisaoContas;
  contas: VisaoContas;
  /** As bolhas que mais mudaram no trimestre, da maior mudança para a menor. */
  mudancas: readonly Readonly<{
    id: string;
    nome: string;
    antes: number;
    depois: number;
  }>[];
}>;

/** Trajetória de uma bolha nos três meses do próximo turno. */
export type EfeitoPrevisto = Readonly<{
  id: string;
  nome: string;
  unidade: string;
  avaliacao?: string;
  /** Valor agora, antes do turno. */
  atual: number;
  /** Valor ao fim de cada mês (3 por turno) sem a mudança. */
  semMudanca: readonly number[];
  /** Valor ao fim de cada mês com a mudança. */
  comMudanca: readonly number[];
}>;

export type PrevisaoLei = Readonly<{
  leiId: string;
  nivel: number;
  /** Nível em funcionamento ao fim de cada mês, com a mudança. */
  implantacao: readonly number[];
  /** Bolhas que a mudança altera, da maior diferença (na escala de cada uma) para a menor. */
  efeitos: readonly EfeitoPrevisto[];
}>;

function falha<T>(diagnostics: readonly { message: string }[]): Resultado<T> {
  return { ok: false, erros: diagnostics.map((item) => item.message) };
}

export function criarPartida(
  opcoes: Readonly<{
    pais?: string;
    modo?: ModoPartida;
    semente?: number;
  }> = {},
): Resultado<Partida> {
  const loaded = loadDistributedScenario(
    `paises/${opcoes.pais ?? "brasil"}/pais.json`,
  );
  if (!loaded.ok) return falha(loaded.diagnostics);
  const prepared = prepareMonthlyContent(loaded.value.definition);
  if (!prepared.ok) return falha(prepared.diagnostics);
  const { content, graph } = prepared.value;
  const game = createGame("partida", content, graph, {
    randomSeed: opcoes.semente ?? 1,
  });
  if (!game.ok) return falha(game.diagnostics);
  return {
    ok: true,
    value: {
      modo: opcoes.modo ?? "teste",
      content,
      graph,
      game: game.value,
      acoes: 0,
    },
  };
}

/** Escolhe um novo nível (ou o valor de uma opção) para uma lei. */
export function mudarLei(
  partida: Partida,
  leiId: string,
  nivel: number,
): Resultado<Partida> {
  const { game, content } = partida;
  const definition = policyLevelRulesFromContent(content, leiId);
  if (!definition.ok) return falha(definition.diagnostics);
  if (partida.modo === "real") {
    const committed = commitPolicyAction(game, content, {
      id: `acao-${partida.acoes + 1}`,
      policyId: leiId,
      desiredLevel: nivel,
    });
    if (!committed.ok) return falha(committed.diagnostics);
    return {
      ok: true,
      value: { ...partida, game: committed.value, acoes: partida.acoes + 1 },
    };
  }
  return aplicarMeta(partida, leiId, nivel);
}

/** Muda a meta da lei direto na partida, sem passar pelo Congresso. */
function aplicarMeta(
  partida: Partida,
  leiId: string,
  nivel: number,
): Resultado<Partida> {
  const { game, content } = partida;
  const definition = policyLevelRulesFromContent(content, leiId);
  if (!definition.ok) return falha(definition.diagnostics);
  const index = game.policies.findIndex(
    (state) => state.policyDefinitionId === leiId,
  );
  if (index < 0)
    return { ok: false, erros: [`A lei ${leiId} não está vigente.`] };
  const changed = changePolicyTarget(
    game.policies[index],
    nivel,
    game.currentTurn,
    definition.value.rules,
  );
  if (!changed.ok) return { ok: false, erros: [changed.error.message] };
  const policies = [...game.policies];
  policies[index] = changed.value;
  return {
    ok: true,
    value: {
      ...partida,
      game: { ...game, policies },
      acoes: partida.acoes + 1,
    },
  };
}

/** Os três meses do próximo turno, sem gravar nada na partida. */
function simularTrimestre(partida: Partida) {
  const { content, graph, game } = partida;
  const months = [];
  let states = game.policies;
  for (let month = 0; month < 3; month++) {
    const advanced = advancePolicyImplementation(
      content,
      states,
      game.currentTurn,
    );
    if (!advanced.ok) return advanced;
    states = advanced.value;
    months.push(states);
  }
  const prepared = prepareGameQuarter(content, graph, game, months);
  if (!prepared.ok) return prepared;
  return { ok: true as const, value: { prepared: prepared.value, months } };
}

type Serie = Readonly<{
  /** Valores das bolhas ao fim de cada mês. */
  valores: readonly Readonly<Record<string, number>>[];
  /** Estados das leis ao fim de cada mês. */
  leis: readonly (readonly GameState["policies"][number][])[];
}>;

/** Várias rodadas seguidas, sem gravar nada na partida. */
function simularTrimestres(
  partida: Partida,
  trimestres: number,
): Resultado<Serie> {
  const valores: Readonly<Record<string, number>>[] = [];
  const leis: (readonly GameState["policies"][number][])[] = [];
  let atual = partida;
  for (let t = 0; t < trimestres; t++) {
    const simulado = simularTrimestre(atual);
    if (!simulado.ok) return falha(simulado.diagnostics);
    const { prepared, months } = simulado.value;
    prepared.months.forEach((mes) => valores.push(mes.execution.values));
    months.forEach((estados) => leis.push(estados));
    atual = { ...atual, game: commitGameQuarter(atual.game, prepared) };
  }
  return { ok: true, value: { valores, leis } };
}

/** A série sem mudança só depende da partida: guarda para não refazer. */
const seriesBase = new WeakMap<Partida, Map<number, Resultado<Serie>>>();

function serieSemMudanca(partida: Partida, trimestres: number) {
  const porHorizonte =
    seriesBase.get(partida) ?? new Map<number, Resultado<Serie>>();
  seriesBase.set(partida, porHorizonte);
  if (!porHorizonte.has(trimestres))
    porHorizonte.set(trimestres, simularTrimestres(partida, trimestres));
  return porHorizonte.get(trimestres)!;
}

/**
 * Prévia: o que muda nos próximos `trimestres` turnos (3 meses cada) se a
 * lei for para `nivel` agora. Compara a simulação com e sem a mudança; a
 * diferença é o efeito da lei. Nada é gravado. A prévia supõe que a mudança
 * vale na hora (como no modo `teste`).
 */
export function preverLei(
  partida: Partida,
  leiId: string,
  nivel: number,
  trimestres = 1,
): Resultado<PrevisaoLei> {
  const changed = aplicarMeta(partida, leiId, nivel);
  if (!changed.ok) return changed;
  const base = serieSemMudanca(partida, trimestres);
  if (!base.ok) return base;
  const alt = simularTrimestres(changed.value, trimestres);
  if (!alt.ok) return alt;
  const { content, game } = partida;
  const now = game.execution.values;
  const efeitos = content.variables.variaveis
    .filter((variable) => variable.tipo !== "controle")
    .map((variable): EfeitoPrevisto & { peso: number } => {
      const semMudanca = base.value.valores.map((v) => v[variable.id] ?? 0);
      const comMudanca = alt.value.valores.map((v) => v[variable.id] ?? 0);
      const amplitude =
        (variable.dominio.maximo ?? 100) - (variable.dominio.minimo ?? 0) || 1;
      const peso =
        Math.max(
          ...comMudanca.map((value, i) => Math.abs(value - semMudanca[i])),
        ) / amplitude;
      return {
        id: variable.id,
        nome: variable.nome,
        unidade: variable.unidade,
        avaliacao: variable.avaliacao,
        atual: now[variable.id] ?? 0,
        semMudanca,
        comMudanca,
        peso,
      };
    })
    .filter((item) => item.peso > 1e-7)
    .sort((a, b) => b.peso - a.peso)
    .map((item): EfeitoPrevisto => ({
      id: item.id,
      nome: item.nome,
      unidade: item.unidade,
      avaliacao: item.avaliacao,
      atual: item.atual,
      semMudanca: item.semMudanca,
      comMudanca: item.comMudanca,
    }));
  const implantacao = alt.value.leis.map(
    (states) =>
      states.find((state) => state.policyDefinitionId === leiId)
        ?.implementedLevel ?? nivel,
  );
  return { ok: true, value: { leiId, nivel, implantacao, efeitos } };
}

/** Passa um trimestre: três meses de implantação, rede e contas públicas. */
export function encerrarTurno(
  partida: Partida,
): Resultado<Readonly<{ partida: Partida; relatorio: RelatorioTurno }>> {
  const { content, game } = partida;
  const simulated = simularTrimestre(partida);
  if (!simulated.ok) return falha(simulated.diagnostics);
  const prepared = simulated.value;
  const next = commitGameQuarter(game, prepared.prepared);
  const before = game.execution.values;
  const after = next.execution.values;
  const mudancas = content.variables.variaveis
    .filter((variable) => variable.tipo !== "controle")
    .map((variable) => ({
      id: variable.id,
      nome: variable.nome,
      antes: before[variable.id] ?? 0,
      depois: after[variable.id] ?? 0,
    }))
    .filter((item) => Math.abs(item.depois - item.antes) > 1e-6)
    .sort((a, b) => Math.abs(b.depois - b.antes) - Math.abs(a.depois - a.antes))
    .slice(0, 15);
  return {
    ok: true,
    value: {
      partida: { ...partida, game: next },
      relatorio: {
        turno: next.currentTurn,
        contasAntes: lerContas(content, before),
        contas: lerContas(content, after),
        mudancas,
      },
    },
  };
}

/** PIB anual na moeda do país: o nó `pib_nominal` ou o declarado pelo país. */
function pibNominal(
  content: ResolvedPackage,
  values: Readonly<Record<string, number>>,
): number {
  return values.pib_nominal ?? content.initialState.economia?.pibAnual ?? 0;
}

function lerContas(
  content: ResolvedPackage,
  values: Readonly<Record<string, number>>,
): VisaoContas {
  const pib = pibNominal(content, values);
  const ids = Object.entries(BOLHAS_DO_ORCAMENTO) as [
    keyof typeof BOLHAS_DO_ORCAMENTO,
    string,
  ][];
  const percentualPib = Object.fromEntries(
    ids.map(([conta, id]) => [conta, values[id] ?? 0]),
  ) as Contas;
  const emMoeda = Object.fromEntries(
    ids.map(([conta]) => [conta, (percentualPib[conta] * pib) / 100]),
  ) as Contas;
  return { ...emMoeda, pib, percentualPib };
}

/**
 * Quanto cada lei arrecada (+) ou custa (−) por ano: a soma das setas dela
 * para a receita e para o gasto, com os valores de agora. `saldo(lei, nivel)`
 * responde para qualquer nível (o de cada opção, por exemplo).
 */
function saldoDasLeis(
  partida: Partida,
  values: Readonly<Record<string, number>>,
): (leiId: string, nivel?: number) => number {
  const { content, graph } = partida;
  const pib = pibNominal(content, values);
  const lawByControl = new Map(
    content.policies.map((policy) => [policy.controle.variavel, policy.id]),
  );
  const delivered = (id: string) => {
    const law = lawByControl.get(id);
    return law === undefined
      ? values[id]
      : (values[id] ?? 0) * (values[efficacyNodeId(law)] ?? 1);
  };
  const porLei = new Map<
    string,
    { relation: GraphRelation; sinal: 1 | -1 }[]
  >();
  for (const relation of graph.relations) {
    const sinal =
      relation.targetId === BOLHAS_DO_ORCAMENTO.receita
        ? 1
        : relation.targetId === BOLHAS_DO_ORCAMENTO.gasto
          ? -1
          : 0;
    if (sinal === 0 || relation.sourceType !== "lei") continue;
    porLei.set(relation.sourceId, [
      ...(porLei.get(relation.sourceId) ?? []),
      { relation, sinal },
    ]);
  }
  return (leiId, nivel) => {
    let saldo = 0;
    for (const { relation, sinal } of porLei.get(leiId) ?? []) {
      const law = lawByControl.get(relation.originId);
      const level = nivel ?? values[relation.originId];
      const origem =
        nivel === undefined && !relation.readsLevel
          ? delivered(relation.originId)
          : relation.readsLevel || law === undefined
            ? level
            : level * (values[efficacyNodeId(law)] ?? 1);
      if (origem === undefined) continue;
      const contribution = calculateContribution(relation, origem, delivered);
      if (contribution.ok)
        saldo += (sinal * contribution.value.value * pib) / 100;
    }
    return saldo;
  };
}

/** Tudo o que a tela precisa desenhar, sem tipos do motor. */
export function verPartida(partida: Partida): VisaoPartida {
  const { content, game } = partida;
  const values = game.execution.values;
  const saldo = saldoDasLeis(partida, values);
  const states = new Map(
    game.policies.map((state) => [state.policyDefinitionId, state]),
  );
  const leis = content.policies.map((policy): VisaoLei => {
    const state = states.get(policy.id);
    const nivel = state?.implementedLevel ?? 0;
    const opcoes = policy.controle.opcoes;
    const nearest = opcoes?.reduce((best, option) =>
      Math.abs(option.valor - nivel) < Math.abs(best.valor - nivel)
        ? option
        : best,
    );
    const variable = content.variables.variaveis.find(
      (item) => item.id === policy.controle.variavel,
    );
    return {
      id: policy.id,
      nome: policy.nome,
      descricao: policy.descricao ?? "",
      grupo: policy.grupo,
      area: policy.area ?? "",
      ministerio: policy.ministerio ?? policy.area ?? "",
      ministerios: [policy.ministerio ?? policy.area ?? ""].filter(Boolean),
      processo: policy.processoAutorizacao,
      nivel,
      meta: state?.desiredLevel ?? nivel,
      minimo: variable?.dominio.minimo,
      maximo: variable?.dominio.maximo,
      unidade: policy.controle.unidade,
      opcoes: opcoes?.map(({ id, rotulo, valor }) => ({
        id,
        rotulo,
        valor,
        saldoAnual: saldo(policy.id, valor),
      })),
      opcaoAtual: nearest?.id,
      saldoAnual: saldo(policy.id),
    };
  });
  const bolhas = content.variables.variaveis
    .filter((variable) => variable.tipo !== "controle")
    .map((variable) => ({
      id: variable.id,
      nome: variable.nome,
      tipo: variable.tipo,
      unidade: variable.unidade,
      area: variable.area ?? "",
      avaliacao: variable.avaliacao,
      valor: values[variable.id] ?? 0,
      minimo: variable.dominio.minimo ?? 0,
      maximo: variable.dominio.maximo ?? 100,
      surgimento: variable.surgimento,
    }));
  const controlToLaw = new Map(
    content.policies.map((policy) => [policy.controle.variavel, policy.id]),
  );
  const ligacoes = content.consequences.flatMap((consequence) => {
    const parametros = consequence.parametros;
    // Tabela de pontos (custo por opção): o sinal é o da maior saída.
    const forte = parametros.pontos
      ? parametros.pontos.reduce(
          (best, [, y]) => (Math.abs(y) > Math.abs(best) ? y : best),
          0,
        )
      : Number(parametros.coeficiente ?? 1);
    const ligacao: VisaoLigacao = {
      id: consequence.id,
      origem: controlToLaw.get(consequence.origem) ?? consequence.origem,
      alvo: consequence.alvo,
      sinal: forte < 0 ? -1 : 1,
      // O conteúdo da partida já é mensal (prepareMonthlyContent).
      atrasoMeses: consequence.atrasoPassos,
      mecanismo: consequence.mecanismo,
    };
    // Produto (D-50) e custo que reage (D-52): o outro nó também empurra o
    // alvo (consumo → receita, dívida → juros, desemprego → gasto), e o
    // jogador precisa ver essa seta.
    const outros = [consequence.normalizacao?.fator, consequence.escala?.fator];
    return [
      ligacao,
      ...outros
        .filter((id): id is string => id !== undefined)
        .map((id) => ({
          ...ligacao,
          id: `${consequence.id}~${id}`,
          origem: id,
          mecanismo: "produto",
        })),
    ];
  });
  return {
    pais: content.manifest?.nome ?? "",
    turno: game.currentTurn,
    contas: lerContas(content, values),
    leis,
    bolhas,
    ligacoes,
  };
}
