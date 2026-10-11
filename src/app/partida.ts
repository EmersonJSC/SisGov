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
  type OccurrenceFile,
  type ResolvedPackage,
  type VariableDefinition,
  type ScenarioGraph,
} from "../engine";
import { contextNodeId, efficacyNodeId } from "../engine/model/lawNodes";
import { changePolicyTarget } from "../domain/game";
import {
  answerDilemma,
  occurrenceCatalog,
  occurrenceChance,
  optionAvailable,
  rollTurn,
  type OccurrenceState,
} from "../game/occurrences";
import {
  applyRequirementFalls,
  policyRequirements,
  requirementBlock,
  requirementMet,
} from "../game/policyRequirements";
import { createGame, lawTargets, type GameState } from "../game/createGame";
import { commitPolicyAction } from "../game/commitPolicyAction";
import { prepareMonthlyContent } from "../game/prepareMonthlyContent";
import { prepareGameQuarter } from "../game/prepareGameQuarter";
import { commitGameQuarter } from "../game/commitGameQuarter";
import { policyLevelRulesFromContent } from "../game/policyRulesFromContent";
import { advancePolicyImplementation } from "../game/advancePolicyImplementation";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";
import type { EstruturaDeGoverno } from "../game/ministerios";

/** Ministérios de cada país (D-64), pelo nome da pasta do país. */
const ESTRUTURAS: Readonly<Record<string, EstruturaDeGoverno>> =
  Object.fromEntries(
    Object.entries(
      import.meta.glob<EstruturaDeGoverno>(
        "../conteudo/paises/*/ministerios.json",
        { eager: true, import: "default" },
      ),
    ).map(([caminho, estrutura]) => [caminho.split("/").at(-2)!, estrutura]),
  );

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
  /**
   * O mesmo país no piloto automático: sem nenhuma decisão do jogador.
   * Anda junto com a partida e serve só para mostrar a marca do jogador
   * (o que mudou por causa dele, não pelo movimento natural da rede).
   * É o próprio `game` enquanto o jogador não mudou nada.
   */
  piloto: GameState;
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
  /** Ministérios (nome real) a que esta lei pertence; hoje um só. */
  ministerios: readonly string[];
  ministerio: string;
  /** Id do ministério dono da lei (D-64). */
  ministerioId: string;
  /** Áreas do governo (esferas do mapa) onde a lei mora. */
  areas: readonly string[];
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
  /** O jogador mudou a meta desta lei (em relação ao país sozinho). */
  alteradaPorVoce: boolean;
  /**
   * Quanto a lei mexe nas contas por ano, na moeda do país, lido da rede:
   * positivo arrecada (seta para a receita), negativo custa (seta para o
   * gasto). 0 se a lei não toca o orçamento.
   */
  saldoAnual: number;
  /**
   * Lei filha (SG138): a lei mãe, as opções dela que liberam esta lei, a
   * opção de base desta (para onde ela cai) e se a exigência está cumprida.
   */
  exige?: VisaoExigencia;
  /** Leis filhas desta: caem para a base se esta sair das opções delas. */
  filhas: readonly VisaoFilha[];
}>;

export type VisaoExigencia = Readonly<{
  lei: string;
  nome: string;
  opcoes: readonly string[];
  base: string;
  atendida: boolean;
  /** Por que esta lei depende da mãe. */
  motivo?: string;
}>;

export type VisaoFilha = Readonly<{
  id: string;
  nome: string;
  /** Valores desta lei (a mãe) que mantêm a filha. */
  valores: readonly number[];
  /** A filha está fora da base (cairia se a mãe saísse das opções). */
  ativa: boolean;
}>;

/** Lei que cai para a base por causa de uma mudança (SG138). */
export type VisaoQueda = Readonly<{ id: string; nome: string; base: string }>;

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
  /**
   * Contexto do cenário (D-55): a parte do valor que as leis e a rede não
   * explicam (história, geografia, cultura). Fixo desde o turno 0.
   */
  contexto?: number;
  /**
   * Valor que a bolha teria sem nenhuma decisão do jogador (o país no
   * piloto automático). Só existe depois que o jogador muda alguma lei.
   */
  semVoce?: number;
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
  /**
   * A seta sai de uma ocorrência em curso (SG106): o nome do evento ou da
   * opção de dilema escolhida. Ocorrências paradas não aparecem.
   */
  ocorrencia?: Readonly<{ id: string; nome: string }>;
}>;

/** Os nós do orçamento na rede (SG157, D-47): são bolhas como as outras. */
export const BOLHAS_DO_ORCAMENTO = {
  receita: "arrecadacao",
  gasto: "gasto_publico",
  juros: "juros_da_divida",
  resultado: "resultado_fiscal",
  divida: "divida_publica",
} as const;

type Contas = Readonly<
  Record<keyof typeof BOLHAS_DO_ORCAMENTO | "cofre", number>
>;

/**
 * As contas do governo, lidas das bolhas do orçamento. Receita, gasto, juros
 * e resultado são por ano; resultado = receita − gasto − juros (positivo é
 * superávit). O déficit soma na dívida e o superávit abate (D-49). A rede
 * guarda a dívida líquida: abaixo de zero, ela é o `cofre` (fase 4) e os
 * `juros` ficam negativos (é o rendimento do cofre). `divida` e `cofre` nunca
 * são negativos.
 */
export type VisaoContas = Contas &
  Readonly<{
    /** PIB do país por ano, na moeda do país. */
    pib: number;
    /** As mesmas contas em % do PIB, como estão na rede. */
    percentualPib: Contas;
  }>;

/** Uma razão para um grupo estar mais ou menos satisfeito. */
export type VisaoMotivo = Readonly<{
  /** Id da lei ou da bolha que empurra o grupo. */
  id: string;
  nome: string;
  tipo: "lei" | "bolha";
  /** Pontos de satisfação que ela dá (+) ou tira (−) agora. */
  pontos: number;
}>;

/** Grupo social para a lista lateral (SG143). */
export type VisaoGrupo = Readonly<{
  id: string;
  nome: string;
  /** Satisfação de 0 a 100. */
  satisfacao: number;
  /** Parte do eleitorado (0–1); a aprovação é a média pelos pesos. */
  peso: number;
  /** O que mais aumenta a satisfação, do maior para o menor. */
  gosta: readonly VisaoMotivo[];
  /** O que mais derruba a satisfação, do maior para o menor. */
  odeia: readonly VisaoMotivo[];
}>;

export type VisaoPartida = Readonly<{
  pais: string;
  /** Cenário em jogo (ex.: "Brasil 2026"). */
  cenario: string;
  turno: number;
  contas: VisaoContas;
  leis: readonly VisaoLei[];
  bolhas: readonly VisaoBolha[];
  ligacoes: readonly VisaoLigacao[];
  /** Grupos sociais, do mais satisfeito ao menos satisfeito. */
  grupos: readonly VisaoGrupo[];
  /** Eventos, dilemas e situações (SG106). */
  ocorrencias: VisaoOcorrencias;
  /** Áreas do governo e seus ministérios, na ordem do anel (D-64). */
  governo: readonly VisaoArea[];
}>;

export type VisaoMinisterio = Readonly<{
  id: string;
  nome: string;
  cargo: string;
  leis: readonly string[];
  /** Pode ser extinto (não é do núcleo do governo). */
  extinguivel: boolean;
}>;

export type VisaoArea = Readonly<{
  id: string;
  titulo: string;
  curto: string;
  faz: string;
  /** Cargo de quem dá o rosto da área ("Fazenda"). */
  cargo: string;
  ministerios: readonly VisaoMinisterio[];
}>;

/** Seta de uma ocorrência: o que ela mexe enquanto dura. */
export type VisaoEfeitoOcorrencia = Readonly<{
  id: string;
  nome: string;
  unidade: string;
  /** Pontos na unidade da bolha (em estoque, por mês). */
  pontos: number;
  avaliacao?: string;
}>;

export type VisaoOpcaoDilema = Readonly<{
  id: string;
  rotulo: string;
  descricao: string;
  disponivel: boolean;
  /** Por que está indisponível. */
  motivo?: string;
  duracaoMeses: number;
  efeitos: readonly VisaoEfeitoOcorrencia[];
  /** Leis que a opção muda: id, nome e o novo valor (rótulo da opção). */
  leis: readonly Readonly<{ id: string; nome: string; para: string }>[];
  /** O que o piloto automático escolheria (não fazer nada). */
  padrao: boolean;
}>;

type CamposOcorrencia = Readonly<{
  id: string;
  nome: string;
  manchete: string;
  descricao: string;
  area: string;
  origem: string;
  /** 1 local, 2 regional, 3 nacional, 4 catástrofe. */
  nivel: number;
  avaliacao?: string;
  /** Valores das variáveis do texto (cidade, empresa…). */
  variaveis?: Readonly<Record<string, string>>;
}>;

export type VisaoDilema = CamposOcorrencia &
  Readonly<{
    /** Ocorrência que trouxe o dilema (desdobramento). */
    causa?: Readonly<{ id: string; nome: string }>;
    aberto: number;
    opcoes: readonly VisaoOpcaoDilema[];
  }>;

export type VisaoOcorrenciaAtiva = CamposOcorrencia &
  Readonly<{
    tipo: "evento" | "dilema";
    /** Opção escolhida, se for a resposta a um dilema. */
    opcao?: string;
    mesesRestantes: number;
    inicio: number;
    efeitos: readonly VisaoEfeitoOcorrencia[];
  }>;

export type VisaoRegistro = Readonly<{
  tipo: "evento" | "dilema" | "situacao";
  id: string;
  nome: string;
  manchete: string;
  nivel: number;
  turno: number;
  fim?: number;
  opcao?: string;
  variaveis?: Readonly<Record<string, string>>;
  automatica?: boolean;
  avaliacao?: string;
}>;

export type VisaoOcorrencias = Readonly<{
  /** Dilemas esperando resposta: o turno não passa enquanto houver. */
  mesa: readonly VisaoDilema[];
  emCurso: readonly VisaoOcorrenciaAtiva[];
  /** Do mais recente ao mais antigo. */
  historico: readonly VisaoRegistro[];
}>;

export type RelatorioTurno = Readonly<{
  turno: number;
  /** Contas antes e depois do trimestre (por ano, na moeda do país). */
  contasAntes: VisaoContas;
  contas: VisaoContas;
  /** Contas como estariam sem as decisões do jogador. */
  contasSemVoce: VisaoContas;
  /** As bolhas que mais mudaram no trimestre, da maior mudança para a menor. */
  mudancas: readonly Readonly<{
    id: string;
    nome: string;
    antes: number;
    depois: number;
    /** Parte da mudança deste turno que veio das decisões do jogador. */
    porVoce: number;
    /** Parte que viria de qualquer jeito (o país andando sozinho). */
    sozinho: number;
  }>[];
  /** Quantas leis estão diferentes do país no piloto automático. */
  leisAlteradas: number;
  /** Respostas a dilemas em curso diferentes da opção padrão (SG106). */
  dilemasDiferentes: number;
  /** O jornal do turno (SG106): o que aconteceu e o que chegou à mesa. */
  ocorrencias: Readonly<{
    eventos: readonly VisaoRegistro[];
    dilemas: readonly VisaoRegistro[];
    surgiram: readonly VisaoRegistro[];
    acabaram: readonly VisaoRegistro[];
  }>;
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
  /**
   * A simulação parou antes do horizonte pedido: a prévia mostra só os meses
   * calculados e aqui diz por quê (SG159).
   */
  interrompida?: string;
}>;

/** Maior horizonte da prévia, em trimestres (5 anos). */
export const MAXIMO_TRIMESTRES_PREVIA = 20;

/** Escala de desenho da bolha: a faixa visual, ou o domínio (SG159). */
function escalaDe(variable: VariableDefinition) {
  return {
    minimo: variable.faixaVisual?.minimo ?? variable.dominio.minimo ?? 0,
    maximo: variable.faixaVisual?.maximo ?? variable.dominio.maximo ?? 100,
  };
}

function falha<T>(diagnostics: readonly { message: string }[]): Resultado<T> {
  return { ok: false, erros: diagnostics.map((item) => item.message) };
}

export function criarPartida(
  opcoes: Readonly<{
    pais?: string;
    modo?: ModoPartida;
    semente?: number;
    /** Eventos e dilemas (SG106); padrão: ligados. */
    ocorrencias?: boolean;
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
    occurrences: opcoes.ocorrencias ?? true,
  });
  if (!game.ok) return falha(game.diagnostics);
  return {
    ok: true,
    value: {
      modo: opcoes.modo ?? "teste",
      content,
      graph,
      game: game.value,
      piloto: game.value,
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
  // Pedir a meta que já está valendo não é uma nova ação (SG159).
  const atual = game.policies.find((s) => s.policyDefinitionId === leiId);
  if (atual && Math.abs(atual.desiredLevel - nivel) < 1e-9)
    return { ok: true, value: partida };
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

/**
 * Leis filhas que cairiam para a base se a lei mudasse para `nivel` (SG138),
 * em cascata. Não muda a partida: serve para avisar antes de assinar.
 */
export function leisQueCaem(
  partida: Partida,
  leiId: string,
  nivel: number,
): readonly VisaoQueda[] {
  const { game, content } = partida;
  const hipotese = game.policies.map((state) =>
    state.policyDefinitionId === leiId
      ? { ...state, desiredLevel: nivel }
      : state,
  );
  const { fallen } = applyRequirementFalls(content, hipotese, game.currentTurn);
  const exigencias = policyRequirements(content);
  return fallen.map((queda) => ({
    id: queda.policyId,
    nome:
      content.policies.find((p) => p.id === queda.policyId)?.nome ??
      queda.policyId,
    base: exigencias.get(queda.policyId)?.baseLabel ?? "",
  }));
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
  // lei filha (SG138): fora da base, só com a mãe numa opção exigida
  const bloqueio = requirementBlock(content, game.policies, leiId, nivel);
  if (bloqueio) return { ok: false, erros: [bloqueio] };
  const changed = changePolicyTarget(
    game.policies[index],
    nivel,
    game.currentTurn,
    definition.value.rules,
  );
  if (!changed.ok) return { ok: false, erros: [changed.error.message] };
  const mudadas = [...game.policies];
  mudadas[index] = changed.value;
  // a mãe mudou: as filhas que dependiam dela caem para a base
  const { policies } = applyRequirementFalls(
    content,
    mudadas,
    game.currentTurn,
  );
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
  /** A simulação parou antes do horizonte: o motivo (a série é o que deu). */
  interrompida?: string;
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
    if (!simulado.ok) {
      // devolve o trecho que deu para calcular (SG159)
      const motivo = simulado.diagnostics.map((d) => d.message).join(" ");
      if (!valores.length) return falha(simulado.diagnostics);
      return {
        ok: true,
        value: { valores, leis, interrompida: `turno ${t + 1}: ${motivo}` },
      };
    }
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

/** Bolhas que diferem entre duas simulações, da maior diferença para a menor. */
function compararSeries(
  partida: Partida,
  base: Serie,
  alt: Serie,
  meses: number,
): EfeitoPrevisto[] {
  const { content, game } = partida;
  const now = game.execution.values;
  return content.variables.variaveis
    .filter((variable) => variable.tipo !== "controle")
    .map((variable): EfeitoPrevisto & { peso: number } => {
      const semMudanca = base.valores
        .slice(0, meses)
        .map((v) => v[variable.id] ?? 0);
      const comMudanca = alt.valores
        .slice(0, meses)
        .map((v) => v[variable.id] ?? 0);
      const escala = escalaDe(variable);
      const amplitude = escala.maximo - escala.minimo || 1;
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
  if (
    !Number.isInteger(trimestres) ||
    trimestres < 1 ||
    trimestres > MAXIMO_TRIMESTRES_PREVIA
  )
    return {
      ok: false,
      erros: [
        `O horizonte da prévia deve ser um número inteiro de 1 a ${MAXIMO_TRIMESTRES_PREVIA} trimestres.`,
      ],
    };
  const changed = aplicarMeta(partida, leiId, nivel);
  if (!changed.ok) return changed;
  const base = serieSemMudanca(partida, trimestres);
  if (!base.ok) return base;
  const alt = simularTrimestres(changed.value, trimestres);
  if (!alt.ok) return alt;
  // Só compara os meses que as duas simulações calcularam.
  const meses = Math.min(base.value.valores.length, alt.value.valores.length);
  const interrompida = alt.value.interrompida ?? base.value.interrompida;
  const efeitos = compararSeries(partida, base.value, alt.value, meses);
  const implantacao = alt.value.leis
    .slice(0, meses)
    .map(
      (states) =>
        states.find((state) => state.policyDefinitionId === leiId)
          ?.implementedLevel ?? nivel,
    );
  return {
    ok: true,
    value: {
      leiId,
      nivel,
      implantacao,
      efeitos,
      ...(interrompida ? { interrompida } : {}),
    },
  };
}

/** O piloto automático (D-58) responde a mesa com a opção padrão. */
function responderComPadrao(partida: Partida, game: GameState): GameState {
  let atual: Partida = { ...partida, game };
  for (const pendente of game.occurrences?.pending ?? []) {
    const dilema = occurrenceCatalog(partida.content).byId.get(
      pendente.occurrenceId,
    );
    if (!dilema?.padrao) continue;
    const r = responder(atual, dilema.id, dilema.padrao, true);
    if (r.ok) atual = r.value;
  }
  return atual.game;
}

/** Sorteio do turno: eventos, mesa de dilemas e situações (SG106). */
function sortearTurno(
  content: ResolvedPackage,
  game: GameState,
): { game: GameState; jornal: RelatorioTurno["ocorrencias"] } {
  const vazio = { eventos: [], dilemas: [], surgiram: [], acabaram: [] };
  if (!game.occurrences) return { game, jornal: vazio };
  const r = rollTurn({
    content,
    state: game.occurrences,
    values: game.execution.values,
    turn: game.currentTurn,
    seed: game.random?.seed ?? 1,
    laws: lawTargets(content, game.policies),
  });
  const turno = game.currentTurn;
  const registro = (
    tipo: VisaoRegistro["tipo"],
    id: string,
  ): VisaoRegistro | undefined => {
    const achado = [...r.state.history]
      .reverse()
      .find((h) => h.kind === tipo && h.id === id);
    if (tipo === "situacao")
      return registroDeSituacao(content, id, turno, achado?.turn);
    if (tipo === "dilema") {
      const pendente = r.state.pending.find((p) => p.occurrenceId === id);
      return registroDeOcorrencia(content, {
        kind: "dilema",
        id,
        turn: turno,
        ...(pendente?.vars ? { vars: pendente.vars } : {}),
      });
    }
    return achado ? registroDeOcorrencia(content, achado) : undefined;
  };
  const lista = (tipo: VisaoRegistro["tipo"], ids: readonly string[]) =>
    ids
      .map((id) => registro(tipo, id))
      .filter((x): x is VisaoRegistro => x !== undefined);
  return {
    game: { ...game, occurrences: r.state },
    jornal: {
      eventos: lista("evento", r.events),
      dilemas: lista("dilema", r.dilemmas),
      surgiram: lista("situacao", r.situationsStarted),
      acabaram: r.situationsEnded.map((id) =>
        registroDeSituacao(content, id, turno, undefined),
      ),
    },
  };
}

/** Troca as variáveis do texto ({cidade}, {ministro}…) pelos valores sorteados. */
function preencher(
  texto: string,
  vars?: Readonly<Record<string, string>>,
): string {
  const cheio = texto.replace(
    /\{([a-z_]+)\}/g,
    (_, nome: string) => vars?.[nome] ?? GENERICO[nome] ?? nome,
  );
  // "{ministro} é acusado…" começa a frase com maiúscula
  return cheio.charAt(0).toUpperCase() + cheio.slice(1);
}

/** Quando o país não tem a lista, um termo genérico. */
const GENERICO: Readonly<Record<string, string>> = {
  cidade: "uma cidade",
  bairro: "um bairro",
  estado: "um estado",
  regiao: "uma região",
  empresa: "uma grande empresa",
  vizinho: "um país vizinho",
  banco: "um grande banco",
  faccao: "uma facção criminosa",
  partido_aliado: "um partido aliado",
  potencia: "uma potência estrangeira",
  gentilico: "nacional",
  gentilicos: "cidadãos do país",
  palacio: "palácio do governo",
  festa: "A festa popular",
  sistema_saude: "sistema público de saúde",
  ministro: "um ministro do governo",
  ministerio: "do governo",
  pasta: "governo",
};

function registroDeSituacao(
  content: ResolvedPackage,
  id: string,
  turno: number,
  inicio: number | undefined,
): VisaoRegistro {
  const variable = content.variables.variaveis.find((v) => v.id === id);
  return {
    tipo: "situacao",
    id,
    nome: variable?.nome ?? id,
    manchete: variable?.nome ?? id,
    nivel: 2,
    turno: inicio ?? turno,
    avaliacao: "negativa",
  };
}

function registroDeOcorrencia(
  content: ResolvedPackage,
  record: OccurrenceState["history"][number],
): VisaoRegistro | undefined {
  if (record.kind === "situacao")
    return registroDeSituacao(content, record.id, record.turn, record.turn);
  const o = occurrenceCatalog(content).byId.get(record.id);
  if (!o) return undefined;
  const opcao = o.opcoes?.find((x) => x.id === record.optionId);
  return {
    tipo: record.kind,
    id: record.id,
    nome: preencher(o.nome, record.vars),
    manchete: preencher(o.manchete ?? o.nome, record.vars),
    nivel: o.nivel ?? 2,
    turno: record.turn,
    ...(record.endedTurn !== undefined ? { fim: record.endedTurn } : {}),
    ...(opcao ? { opcao: opcao.rotulo } : {}),
    ...(record.vars ? { variaveis: record.vars } : {}),
    ...(record.automatic ? { automatica: true } : {}),
    ...(o.avaliacao ? { avaliacao: o.avaliacao } : {}),
  };
}

function responder(
  partida: Partida,
  dilemaId: string,
  opcaoId: string,
  automatica = false,
): Resultado<Partida> {
  const { content, game } = partida;
  if (!game.occurrences)
    return { ok: false, erros: ["Esta partida não tem dilemas."] };
  const r = answerDilemma({
    content,
    state: game.occurrences,
    occurrenceId: dilemaId,
    optionId: opcaoId,
    turn: game.currentTurn,
    seed: game.random?.seed ?? 1,
    values: game.execution.values,
    automatic: automatica,
  });
  if (!r.ok) return { ok: false, erros: [r.error] };
  let atual: Partida = {
    ...partida,
    game: { ...game, occurrences: r.state },
  };
  // a opção pode mudar leis (ex.: socorro externo impõe teto de gastos)
  for (const lei of r.laws) {
    const mudada = aplicarMeta(atual, lei.lei, lei.nivel);
    if (mudada.ok) atual = { ...mudada.value, acoes: atual.acoes };
  }
  return { ok: true, value: atual };
}

/**
 * O presidente escolhe uma opção do dilema na mesa (SG106). A opção começa a
 * valer na hora (o nó dela liga no próximo turno) e pode mudar leis.
 */
export function responderDilema(
  partida: Partida,
  dilemaId: string,
  opcaoId: string,
): Resultado<Partida> {
  const r = responder(partida, dilemaId, opcaoId);
  return r.ok
    ? { ok: true, value: { ...r.value, acoes: partida.acoes + 1 } }
    : r;
}

/** Prévia de uma opção do dilema: o país com ela, comparado com o país sem resposta. */
export function preverDilema(
  partida: Partida,
  dilemaId: string,
  opcaoId: string,
  trimestres = 4,
): Resultado<
  Readonly<{ efeitos: readonly EfeitoPrevisto[]; interrompida?: string }>
> {
  if (
    !Number.isInteger(trimestres) ||
    trimestres < 1 ||
    trimestres > MAXIMO_TRIMESTRES_PREVIA
  )
    return {
      ok: false,
      erros: [
        `O horizonte da prévia deve ser um número inteiro de 1 a ${MAXIMO_TRIMESTRES_PREVIA} trimestres.`,
      ],
    };
  const respondida = responder(partida, dilemaId, opcaoId);
  if (!respondida.ok) return respondida;
  const base = serieSemMudanca(partida, trimestres);
  if (!base.ok) return base;
  const alt = simularTrimestres(respondida.value, trimestres);
  if (!alt.ok) return alt;
  const meses = Math.min(base.value.valores.length, alt.value.valores.length);
  const interrompida = alt.value.interrompida ?? base.value.interrompida;
  return {
    ok: true,
    value: {
      efeitos: compararSeries(partida, base.value, alt.value, meses),
      ...(interrompida ? { interrompida } : {}),
    },
  };
}

/** Passa um trimestre: três meses de implantação, rede e contas públicas. */
export function encerrarTurno(
  partida: Partida,
): Resultado<Readonly<{ partida: Partida; relatorio: RelatorioTurno }>> {
  const { content, game } = partida;
  // SG106: o turno não passa com dilema na mesa
  const mesa = game.occurrences?.pending ?? [];
  if (mesa.length > 0) {
    const nomes = mesa
      .map((p) => occurrenceCatalog(content).byId.get(p.occurrenceId)?.nome)
      .join(", ");
    return {
      ok: false,
      erros: [
        `${mesa.length === 1 ? "Há um dilema" : `Há ${mesa.length} dilemas`} na mesa (${nomes}). Escolha uma opção antes de encerrar o turno.`,
      ],
    };
  }
  // O piloto automático responde sozinho, sempre com a opção padrão.
  const piloto = responderComPadrao(partida, partida.piloto);
  const simulated = simularTrimestre(partida);
  if (!simulated.ok) return falha(simulated.diagnostics);
  const prepared = simulated.value;
  const rolado = sortearTurno(
    content,
    commitGameQuarter(game, prepared.prepared),
  );
  const next = rolado.game;
  // O piloto automático só precisa andar à parte se o jogador mudou algo.
  let pilotoNext = next;
  if (piloto !== game) {
    const sozinho = simularTrimestre({ ...partida, game: piloto });
    if (!sozinho.ok) return falha(sozinho.diagnostics);
    pilotoNext = sortearTurno(
      content,
      commitGameQuarter(piloto, sozinho.value.prepared),
    ).game;
  }
  const before = game.execution.values;
  const after = next.execution.values;
  const pilotoBefore = piloto.execution.values;
  const pilotoAfter = pilotoNext.execution.values;
  const mudancas = content.variables.variaveis
    .filter((variable) => variable.tipo !== "controle")
    .map((variable) => {
      const id = variable.id;
      const antes = before[id] ?? 0;
      const depois = after[id] ?? 0;
      const sozinho = (pilotoAfter[id] ?? 0) - (pilotoBefore[id] ?? 0);
      return {
        id,
        nome: variable.nome,
        antes,
        depois,
        porVoce: depois - antes - sozinho,
        sozinho,
      };
    })
    .filter(
      (item) =>
        Math.abs(item.depois - item.antes) > 1e-6 ||
        Math.abs(item.porVoce) > 1e-6,
    )
    .sort(
      (a, b) => Math.abs(b.depois - b.antes) - Math.abs(a.depois - a.antes),
    );
  return {
    ok: true,
    value: {
      partida: { ...partida, game: next, piloto: pilotoNext },
      relatorio: {
        turno: next.currentTurn,
        contasAntes: lerContas(content, before),
        contas: lerContas(content, after),
        contasSemVoce: lerContas(content, pilotoAfter),
        mudancas,
        leisAlteradas: leisAlteradas(next, pilotoNext).size,
        dilemasDiferentes: dilemasDiferentes(next, pilotoNext),
        ocorrencias: rolado.jornal,
      },
    },
  };
}

/** Opções de dilema em curso que o piloto (sempre a padrão) não escolheu. */
function dilemasDiferentes(game: GameState, piloto: GameState): number {
  if (game === piloto) return 0;
  const chave = (a: { occurrenceId: string; optionId?: string }) =>
    `${a.occurrenceId}:${a.optionId}`;
  const doPiloto = new Set(
    (piloto.occurrences?.active ?? []).filter((a) => a.optionId).map(chave),
  );
  return (game.occurrences?.active ?? []).filter(
    (a) => a.optionId && !doPiloto.has(chave(a)),
  ).length;
}

/** Leis cuja meta o jogador mudou em relação ao piloto automático. */
function leisAlteradas(game: GameState, piloto: GameState): Set<string> {
  if (game === piloto) return new Set();
  const metas = new Map(
    piloto.policies.map((state) => [
      state.policyDefinitionId,
      state.desiredLevel,
    ]),
  );
  return new Set(
    game.policies
      .filter(
        (state) =>
          Math.abs(
            state.desiredLevel -
              (metas.get(state.policyDefinitionId) ?? state.desiredLevel),
          ) > 1e-9,
      )
      .map((state) => state.policyDefinitionId),
  );
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
  const lidas = Object.fromEntries(
    ids.map(([conta, id]) => [conta, values[id] ?? 0]),
  ) as Record<keyof typeof BOLHAS_DO_ORCAMENTO, number>;
  const percentualPib: Contas = {
    ...lidas,
    divida: Math.max(0, lidas.divida),
    cofre: Math.max(0, -lidas.divida),
  };
  const emMoeda = Object.fromEntries(
    Object.entries(percentualPib).map(([conta, v]) => [conta, (v * pib) / 100]),
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

/**
 * Situação na régua da tela: o motor guarda só o quanto ela passou do ponto
 * de surgimento; a tela mostra a soma inteira, para o jogador ver quando ela
 * está chegando perto de surgir (ex.: juros em 26% da receita, surge em 32%).
 */
/** Aprovação do governo: a média dos grupos pelos pesos (SG143). */
const APROVACAO = "popularidade_governo";

/** Por que cada grupo está como está: as setas que chegam nele, agora. */
function gruposDaPartida(
  partida: Partida,
  values: Readonly<Record<string, number>>,
  /** Leis mudadas pelo jogador: num empate, o motivo dele vem primeiro (D-58). */
  doJogador: ReadonlySet<string>,
): VisaoGrupo[] {
  const { content, graph } = partida;
  const lawByControl = new Map(
    content.policies.map((policy) => [policy.controle.variavel, policy]),
  );
  const delivered = (id: string) => {
    const law = lawByControl.get(id);
    if (law === undefined) return values[id];
    const ceiling = graph.nodesById[id]?.dominio.maximo;
    const effect = (values[id] ?? 0) * (values[efficacyNodeId(law.id)] ?? 1);
    return ceiling !== undefined ? Math.min(effect, ceiling) : effect;
  };
  const peso = new Map(
    graph.relations
      .filter((r) => r.targetId === APROVACAO)
      .map((r) => [r.originId, r.parameters.coeficiente ?? 0]),
  );
  // Muitas leis batem no teto da oscilação (±10): em meio ponto de
  // diferença, a lei que o jogador mudou vem antes das outras.
  const degrau = (m: VisaoMotivo) => Math.round(Math.abs(m.pontos) * 2);
  const maiores = (lista: VisaoMotivo[]) =>
    lista
      .sort(
        (a, b) =>
          degrau(b) - degrau(a) ||
          Number(doJogador.has(b.id)) - Number(doJogador.has(a.id)) ||
          Math.abs(b.pontos) - Math.abs(a.pontos),
      )
      .slice(0, 5);
  return content.variables.variaveis
    .filter((variable) => variable.tipo === "grupo")
    .map((variable): VisaoGrupo => {
      const motivos: VisaoMotivo[] = [];
      for (const relation of graph.relations) {
        if (relation.targetId !== variable.id) continue;
        if (relation.originId.startsWith("contexto:")) continue;
        const origem = relation.readsLevel
          ? values[relation.originId]
          : delivered(relation.originId);
        if (origem === undefined) continue;
        const c = calculateContribution(relation, origem, delivered);
        if (!c.ok || Math.abs(c.value.value) < 0.05) continue;
        const lei = lawByControl.get(relation.originId);
        motivos.push({
          id: lei?.id ?? relation.originId,
          nome: lei?.nome ?? graph.nodesById[relation.originId]?.nome ?? "",
          tipo: lei ? "lei" : "bolha",
          pontos: c.value.value,
        });
      }
      return {
        id: variable.id,
        nome: variable.nome,
        satisfacao: values[variable.id] ?? 0,
        peso: peso.get(variable.id) ?? 0,
        gosta: maiores(motivos.filter((m) => m.pontos > 0)),
        odeia: maiores(motivos.filter((m) => m.pontos < 0)),
      };
    })
    .sort((a, b) => b.satisfacao - a.satisfacao);
}

function brutoDasSituacoes(
  partida: Partida,
  values: Readonly<Record<string, number>>,
): (id: string, surgimento: number) => number {
  const { content, graph } = partida;
  const lawByControl = new Map(
    content.policies.map((policy) => [policy.controle.variavel, policy.id]),
  );
  const delivered = (id: string) => {
    const law = lawByControl.get(id);
    if (law === undefined) return values[id];
    const ceiling = graph.nodesById[id]?.dominio.maximo;
    const effect = (values[id] ?? 0) * (values[efficacyNodeId(law)] ?? 1);
    return ceiling !== undefined ? Math.min(effect, ceiling) : effect;
  };
  return (id, surgimento) => {
    const now = values[id] ?? 0;
    if (now > 0) return now + surgimento;
    let soma = 0;
    for (const relation of graph.relations) {
      // aproximação: as setas com atraso entram com os valores de agora
      if (relation.targetId !== id) continue;
      const origem = relation.readsLevel
        ? values[relation.originId]
        : delivered(relation.originId);
      if (origem === undefined) continue;
      const c = calculateContribution(relation, origem, delivered);
      if (c.ok) soma += c.value.value;
    }
    return Math.min(surgimento, Math.max(0, soma));
  };
}

/** Tudo o que a tela precisa desenhar, sem tipos do motor. */
export function verPartida(partida: Partida): VisaoPartida {
  const { content, game } = partida;
  const values = game.execution.values;
  const saldo = saldoDasLeis(partida, values);
  const alteradas = leisAlteradas(game, partida.piloto);
  const states = new Map(
    game.policies.map((state) => [state.policyDefinitionId, state]),
  );
  const exigencias = policyRequirements(content);
  const nomeDaLei = new Map(content.policies.map((p) => [p.id, p.nome]));
  const governo = governoDaPartida(content);
  const lugares = new Map(
    governo.flatMap((area) =>
      area.ministerios.flatMap((m) =>
        m.leis.map((lei) => [lei, { area: area.id, ministerio: m }] as const),
      ),
    ),
  );
  const lugarDaLei = (id: string) => {
    const lugar = lugares.get(id);
    return {
      ministerio: lugar?.ministerio.nome ?? "",
      ministerios: lugar ? [lugar.ministerio.nome] : [],
      ministerioId: lugar?.ministerio.id ?? "",
      areas: lugar ? [lugar.area] : [],
    };
  };
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
    const definicao = policyLevelRulesFromContent(content, policy.id);
    const regras = definicao.ok ? definicao.value.rules : undefined;
    return {
      id: policy.id,
      nome: policy.nome,
      descricao: policy.descricao ?? "",
      grupo: policy.grupo,
      area: policy.area ?? "",
      ...lugarDaLei(policy.id),
      processo: policy.processoAutorizacao,
      nivel,
      meta: state?.desiredLevel ?? nivel,
      // limites efetivos: os mesmos que a partida aceita (SG159)
      minimo: regras?.domain.minimum ?? variable?.dominio.minimo,
      maximo: regras?.domain.maximum ?? variable?.dominio.maximo,
      unidade: policy.controle.unidade,
      opcoes: opcoes?.map(({ id, rotulo, valor }) => ({
        id,
        rotulo,
        valor,
        saldoAnual: saldo(policy.id, valor),
      })),
      opcaoAtual: nearest?.id,
      saldoAnual: saldo(policy.id),
      alteradaPorVoce: alteradas.has(policy.id),
      ...exigenciaDa(policy.id),
      filhas: [...exigencias.values()]
        .filter((r) => r.parentId === policy.id)
        .map((r) => ({
          id: r.childId,
          nome: nomeDaLei.get(r.childId) ?? r.childId,
          valores: r.allowedLevels,
          ativa:
            Math.abs(
              (states.get(r.childId)?.desiredLevel ?? r.baseLevel) -
                r.baseLevel,
            ) > 1e-9,
        })),
    };
  });
  function exigenciaDa(id: string): { exige?: VisaoExigencia } {
    const r = exigencias.get(id);
    if (!r) return {};
    return {
      exige: {
        lei: r.parentId,
        nome: nomeDaLei.get(r.parentId) ?? r.parentId,
        opcoes: r.allowedLabels,
        base: r.baseLabel,
        atendida: requirementMet(r, game.policies),
        ...(r.reason ? { motivo: r.reason } : {}),
      },
    };
  }
  const brutoDe = brutoDasSituacoes(partida, values);
  const comPiloto = partida.piloto !== game;
  const pilotoValues = partida.piloto.execution.values;
  const brutoPiloto = brutoDasSituacoes(partida, pilotoValues);
  const bolhas = content.variables.variaveis
    .filter((variable) => variable.tipo !== "controle")
    .map((variable) => ({
      id: variable.id,
      nome: variable.nome,
      tipo: variable.tipo,
      unidade: variable.unidade,
      area: variable.area ?? "",
      avaliacao: variable.avaliacao,
      valor:
        variable.tipo === "situacao"
          ? brutoDe(variable.id, variable.surgimento ?? 0)
          : (values[variable.id] ?? 0),
      ...escalaDe(variable),
      surgimento: variable.surgimento,
      ...(values[contextNodeId(variable.id)] !== undefined
        ? { contexto: values[contextNodeId(variable.id)] }
        : {}),
      ...(comPiloto
        ? {
            semVoce:
              variable.tipo === "situacao"
                ? brutoPiloto(variable.id, variable.surgimento ?? 0)
                : (pilotoValues[variable.id] ?? 0),
          }
        : {}),
    }));
  const controlToLaw = new Map(
    content.policies.map((policy) => [policy.controle.variavel, policy.id]),
  );
  // SG106: as setas de ocorrência só aparecem enquanto ela está em curso
  const catalogo = occurrenceCatalog(content);
  const emCurso = new Map(
    (game.occurrences?.active ?? []).map((a) => [a.control, a]),
  );
  const ligacoes = content.consequences.flatMap((consequence) => {
    const parametros = consequence.parametros;
    const dona = catalogo.ownerByControl.get(consequence.origem);
    let ocorrencia: VisaoLigacao["ocorrencia"];
    if (dona) {
      const ativa = emCurso.get(consequence.origem);
      if (!ativa) return [];
      const o = catalogo.byId.get(dona);
      const opcao = o?.opcoes?.find((x) => x.id === ativa.optionId);
      ocorrencia = {
        id: dona,
        nome: opcao
          ? `${preencher(o?.nome ?? dona, ativa.vars)}: ${opcao.rotulo}`
          : preencher(o?.nome ?? dona, ativa.vars),
      };
    }
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
      ...(ocorrencia ? { ocorrencia } : {}),
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
    cenario: content.initialState.cenario?.nome ?? content.manifest?.nome ?? "",
    turno: game.currentTurn,
    contas: lerContas(content, values),
    grupos: gruposDaPartida(partida, values, alteradas),
    ocorrencias: ocorrenciasDaPartida(partida),
    governo,
    leis,
    bolhas,
    ligacoes,
  };
}

/**
 * Áreas e ministérios do país (D-64). País sem `ministerios.json` (os
 * pacotes de teste) cai no campo `ministerio` de cada lei: uma área por
 * ministério citado.
 */
function governoDaPartida(content: ResolvedPackage): VisaoArea[] {
  const estrutura = ESTRUTURAS[content.manifest?.id ?? ""];
  if (estrutura) {
    const existe = new Set(content.policies.map((p) => p.id));
    return estrutura.areas.map((area) => {
      const ministerios = estrutura.ministerios
        .filter((m) => m.area === area.id)
        .map((m) => ({
          id: m.id,
          nome: m.nome,
          cargo: m.cargo,
          leis: m.leis.filter((lei) => existe.has(lei)),
          extinguivel: Boolean(m.extincao),
        }));
      return {
        id: area.id,
        titulo: area.titulo,
        curto: area.curto,
        faz: area.faz,
        cargo:
          ministerios.find((m) => m.id === area.coordenador)?.cargo ??
          ministerios[0]?.cargo ??
          "",
        ministerios,
      };
    });
  }
  const porNome = new Map<string, string[]>();
  for (const policy of content.policies) {
    const nome = policy.ministerio ?? policy.area ?? "Governo";
    porNome.set(nome, [...(porNome.get(nome) ?? []), policy.id]);
  }
  return [...porNome].map(([nome, leis]) => {
    const curto = nome.replace(/^Ministério (da|do|dos|das|de) /, "");
    return {
      id: nome,
      titulo: curto,
      curto,
      faz: "",
      cargo: curto,
      ministerios: [{ id: nome, nome, cargo: curto, leis, extinguivel: false }],
    };
  });
}

/** Setas que saem do nó de uma ocorrência (o que ela mexe enquanto dura). */
function efeitosDoNo(
  content: ResolvedPackage,
  controle: string,
): VisaoEfeitoOcorrencia[] {
  const variaveis = new Map(content.variables.variaveis.map((v) => [v.id, v]));
  return content.consequences
    .filter((c) => c.origem === controle)
    .map((c) => {
      const alvo = variaveis.get(c.alvo);
      return {
        id: c.alvo,
        nome: alvo?.nome ?? c.alvo,
        unidade: alvo?.unidade ?? c.unidade,
        pontos: c.parametros.coeficiente ?? 0,
        ...(alvo?.avaliacao ? { avaliacao: alvo.avaliacao } : {}),
      };
    });
}

function camposDe(
  o: OccurrenceFile,
  lugar: Readonly<Record<string, string>> | undefined,
): CamposOcorrencia {
  return {
    id: o.id,
    nome: preencher(o.nome, lugar),
    manchete: preencher(o.manchete ?? o.nome, lugar),
    descricao: preencher(o.descricao ?? "", lugar),
    area: o.area ?? "",
    origem: o.origem ?? "",
    nivel: o.nivel ?? 2,
    ...(o.avaliacao ? { avaliacao: o.avaliacao } : {}),
    ...(lugar ? { variaveis: lugar } : {}),
  };
}

function ocorrenciasDaPartida(partida: Partida): VisaoOcorrencias {
  const { content, game } = partida;
  const state = game.occurrences;
  if (!state) return { mesa: [], emCurso: [], historico: [] };
  const catalogo = occurrenceCatalog(content);
  const values = game.execution.values;
  const nomeDaLei = new Map(content.policies.map((p) => [p.id, p]));
  const mesa = state.pending.flatMap((p): VisaoDilema[] => {
    const o = catalogo.byId.get(p.occurrenceId);
    if (!o) return [];
    const causa = p.causeId
      ? catalogo.byId.get(p.causeId.split(".")[0])
      : undefined;
    return [
      {
        ...camposDe(o, p.vars),
        aberto: p.openedTurn,
        ...(causa
          ? { causa: { id: causa.id, nome: preencher(causa.nome, p.vars) } }
          : {}),
        opcoes: (o.opcoes ?? []).map((op) => {
          const disponivel = optionAvailable(op, values);
          return {
            id: op.id,
            rotulo: preencher(op.rotulo, p.vars),
            descricao: preencher(op.descricao ?? "", p.vars),
            disponivel,
            ...(disponivel ? {} : { motivo: op.motivoRequer }),
            duracaoMeses: op.duracaoMeses,
            efeitos: efeitosDoNo(content, op.controle),
            leis: (op.leis ?? []).map((l) => {
              const lei = nomeDaLei.get(l.lei);
              const opcao = lei?.controle.opcoes?.find(
                (x) => Math.abs(x.valor - l.nivel) < 1e-9,
              );
              return {
                id: l.lei,
                nome: lei?.nome ?? l.lei,
                para: opcao?.rotulo ?? String(l.nivel),
              };
            }),
            padrao: op.id === o.padrao,
          };
        }),
      },
    ];
  });
  const emCurso = state.active.flatMap((a): VisaoOcorrenciaAtiva[] => {
    const o = catalogo.byId.get(a.occurrenceId);
    if (!o) return [];
    const opcao = o.opcoes?.find((x) => x.id === a.optionId);
    return [
      {
        ...camposDe(o, a.vars),
        tipo: o.tipo === "dilema" ? "dilema" : "evento",
        ...(opcao ? { opcao: opcao.rotulo } : {}),
        mesesRestantes: a.monthsLeft,
        inicio: a.startedTurn,
        efeitos: efeitosDoNo(content, a.control),
      },
    ];
  });
  const historico = [...state.history]
    .reverse()
    .slice(0, 40)
    .map((r) => registroDeOcorrencia(content, r))
    .filter((x): x is VisaoRegistro => x !== undefined);
  return { mesa, emCurso, historico };
}

/** Chance de uma ocorrência neste momento e o porquê (para a tela). */
export function chanceDaOcorrencia(
  partida: Partida,
  id: string,
):
  | Readonly<{
      chance: number;
      base: number;
      fatores: readonly Readonly<{
        id: string;
        nome: string;
        multiplica: number;
      }>[];
    }>
  | undefined {
  const o = occurrenceCatalog(partida.content).byId.get(id);
  if (!o) return undefined;
  const c = occurrenceChance(
    o,
    partida.game.execution.values,
    partida.game.occurrences,
  );
  const nomes = new Map(
    partida.content.variables.variaveis.map((v) => [v.id, v.nome]),
  );
  return {
    chance: c.chance,
    base: c.base,
    fatores: c.factors.map((f) => ({
      id: f.variable,
      nome: nomes.get(f.variable) ?? f.variable,
      multiplica: f.multiplier,
    })),
  };
}
