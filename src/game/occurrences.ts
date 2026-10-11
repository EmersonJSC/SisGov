/**
 * Ocorrências na partida (SG106): eventos que o país sofre, dilemas que o
 * presidente decide e situações que surgem e somem. Desenho em
 * docs/arquitetura/ocorrencias.md.
 *
 * - Cada evento em curso (e cada opção de dilema escolhida) liga o próprio nó
 *   (controle 0–1) por alguns meses; as setas saem desse nó.
 * - O sorteio é por hash da semente, do turno e da ocorrência: a mesma
 *   partida repete igual e o piloto automático recebe os mesmos números.
 * - Dilemas e eventos saem pela chance que o contexto dá (nem todo turno tem);
 *   a mesa tem no máximo um dilema por turno, e um dilema novo só chega
 *   `TURNOS_ENTRE_DILEMAS` turnos depois do anterior (pedido do autor, 11/out:
 *   eram dilemas demais).
 */
import type {
  DilemmaOptionFile,
  OccurrenceCondition,
  OccurrenceFile,
  OccurrenceFollowUp,
  ResolvedPackage,
  ScenarioGraph,
} from "../engine";

export type ActiveOccurrence = Readonly<{
  occurrenceId: string;
  optionId?: string;
  control: string;
  monthsLeft: number;
  startedTurn: number;
  /** Variáveis do texto ({cidade}, {empresa}…), escolhidas ao acontecer. */
  vars?: Readonly<Record<string, string>>;
}>;

export type PendingDilemma = Readonly<{
  occurrenceId: string;
  openedTurn: number;
  /** Variáveis do texto ({cidade}, {empresa}…), escolhidas ao acontecer. */
  vars?: Readonly<Record<string, string>>;
  /** Ocorrência que trouxe este dilema (desdobramento). */
  causeId?: string;
}>;

export type ArmedOccurrence = Readonly<{
  occurrenceId: string;
  dueTurn: number;
  chance: number;
  causeId: string;
  /** Variáveis do texto ({cidade}, {empresa}…), escolhidas ao acontecer. */
  vars?: Readonly<Record<string, string>>;
}>;

export type LawChange = Readonly<{
  turn: number;
  control: string;
  from: number;
  to: number;
}>;

export type OccurrenceRecord = Readonly<{
  kind: "evento" | "dilema" | "situacao";
  id: string;
  turn: number;
  endedTurn?: number;
  optionId?: string;
  /** Variáveis do texto ({cidade}, {empresa}…), escolhidas ao acontecer. */
  vars?: Readonly<Record<string, string>>;
  causeId?: string;
  /** O dilema foi respondido pelo piloto automático. */
  automatic?: boolean;
}>;

export type OccurrenceState = Readonly<{
  active: readonly ActiveOccurrence[];
  pending: readonly PendingDilemma[];
  armed: readonly ArmedOccurrence[];
  /** Há quantos turnos seguidos a condição de cada ocorrência vale. */
  conditionTurns: Readonly<Record<string, number>>;
  /** Mudanças de lei feitas pelo jogador (para as reações). */
  lawChanges: readonly LawChange[];
  /** Metas das leis no último sorteio, para achar o que mudou. */
  lawSnapshot: Readonly<Record<string, number>>;
  lastStarted: Readonly<Record<string, number>>;
  timesSeen: Readonly<Record<string, number>>;
  /** Situações acima do ponto de surgimento no último sorteio. */
  situations: Readonly<Record<string, boolean>>;
  lastDilemmaArea?: string;
  history: readonly OccurrenceRecord[];
}>;

/** Quantos eventos e dilemas podem começar num turno. */
export const MAX_EVENTOS_GRANDES_POR_TURNO = 1;
export const MAX_EVENTOS_LOCAIS_POR_TURNO = 1;
export const MAX_DILEMAS_POR_TURNO = 1;
/** Dilema novo só depois de tantos turnos do último (desdobramento também). */
export const TURNOS_ENTRE_DILEMAS = 3;
/** Depois de vista, a chance cai (segunda vez ×0,3, terceira ×0,1). */
const SEEN_DECAY = [1, 0.3, 0.1];
const LAW_CHANGE_MEMORY = 12;

// ---------------------------------------------------------------------------
// Sorteio por hash (semente, turno, chave)
// ---------------------------------------------------------------------------

function hash32(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  // mistura final (xorshift)
  h ^= h << 13;
  h ^= h >>> 17;
  h ^= h << 5;
  return h >>> 0;
}

/** Número em [0, 1) fixo para (semente, turno, chave). */
export function roll(seed: number, turn: number, key: string): number {
  return hash32(`${seed}|${turn}|${key}`) / 0x100000000;
}

// ---------------------------------------------------------------------------
// Catálogo
// ---------------------------------------------------------------------------

export type OccurrenceCatalog = Readonly<{
  all: readonly OccurrenceFile[];
  byId: ReadonlyMap<string, OccurrenceFile>;
  /** Todos os nós de ocorrência (eventos e opções). */
  controls: readonly string[];
  /** Relações que saem de cada nó. */
  relationsByControl: ReadonlyMap<string, readonly string[]>;
  /** Ocorrência dona de cada nó. */
  ownerByControl: ReadonlyMap<string, string>;
}>;

const catalogs = new WeakMap<ResolvedPackage, OccurrenceCatalog>();

export function occurrenceCatalog(
  content: ResolvedPackage,
  graph?: ScenarioGraph,
): OccurrenceCatalog {
  const cached = catalogs.get(content);
  if (cached && (!graph || cached.relationsByControl.size > 0)) return cached;
  const all = [...content.events, ...content.dilemmas].filter(
    (o) => o.gatilho !== undefined,
  );
  const controls = new Set<string>();
  const ownerByControl = new Map<string, string>();
  for (const o of all) {
    if (o.controle) {
      controls.add(o.controle);
      ownerByControl.set(o.controle, o.id);
    }
    for (const option of o.opcoes ?? []) {
      controls.add(option.controle);
      ownerByControl.set(option.controle, o.id);
    }
  }
  const relationsByControl = new Map<string, string[]>();
  for (const relation of graph?.relations ?? []) {
    if (relation.sourceType !== "evento" && relation.sourceType !== "dilema")
      continue;
    if (!controls.has(relation.originId)) continue;
    const list = relationsByControl.get(relation.originId) ?? [];
    list.push(relation.id);
    relationsByControl.set(relation.originId, list);
  }
  const catalog = {
    all,
    byId: new Map(all.map((o) => [o.id, o])),
    controls: [...controls].sort(),
    relationsByControl,
    ownerByControl,
  };
  catalogs.set(content, catalog);
  return catalog;
}

// ---------------------------------------------------------------------------
// Condições e chance
// ---------------------------------------------------------------------------

export function conditionHolds(
  condition: OccurrenceCondition | undefined,
  values: Readonly<Record<string, number>>,
): boolean {
  if (!condition) return true;
  if (condition.tipo === "comparacao") {
    const v = values[condition.variavel];
    if (!Number.isFinite(v)) return false;
    switch (condition.operador) {
      case "maior_que":
        return v > condition.valor;
      case "maior_ou_igual":
        return v >= condition.valor;
      case "menor_que":
        return v < condition.valor;
      case "menor_ou_igual":
        return v <= condition.valor;
      default:
        return Math.abs(v - condition.valor) < 1e-6;
    }
  }
  if (condition.tipo === "nao")
    return !conditionHolds(condition.condicao, values);
  if (condition.tipo === "e")
    return condition.condicoes.every((c) => conditionHolds(c, values));
  return condition.condicoes.some((c) => conditionHolds(c, values));
}

export type ChanceFactor = Readonly<{
  variable: string;
  value: number;
  multiplier: number;
}>;

export type ChanceExplanation = Readonly<{
  base: number;
  factors: readonly ChanceFactor[];
  /** Redução por já ter acontecido antes. */
  seenMultiplier: number;
  chance: number;
}>;

/** Chance por turno, com o motivo de cada fator (sem os portões). */
export function occurrenceChance(
  occurrence: OccurrenceFile,
  values: Readonly<Record<string, number>>,
  state?: OccurrenceState,
): ChanceExplanation {
  const trigger = occurrence.gatilho;
  const base = trigger?.chance ?? 0;
  const factors = (trigger?.fatores ?? []).map((factor): ChanceFactor => {
    const value = values[factor.variavel] ?? 0;
    const t = Math.min(
      1,
      Math.max(0, (value - factor.de) / (factor.ate - factor.de)),
    );
    return {
      variable: factor.variavel,
      value,
      multiplier: 1 + (factor.multiplica - 1) * t,
    };
  });
  const seen = state?.timesSeen[occurrence.id] ?? 0;
  const seenMultiplier = SEEN_DECAY[Math.min(seen, SEEN_DECAY.length - 1)];
  const chance = Math.min(
    1,
    factors.reduce((p, f) => p * f.multiplier, base) * seenMultiplier,
  );
  return { base, factors, seenMultiplier, chance };
}

function reactionMatches(
  occurrence: OccurrenceFile,
  state: OccurrenceState,
  turn: number,
): boolean {
  const reaction = occurrence.gatilho?.reacao;
  if (!reaction) return true;
  return state.lawChanges.some((change) => {
    if (change.control !== reaction.controle) return false;
    if (turn - change.turn > reaction.janelaTurnos || change.turn > turn)
      return false;
    if (reaction.para)
      return reaction.para.some((v) => Math.abs(v - change.to) < 1e-6);
    if (reaction.sobe !== undefined)
      return change.to - change.from >= reaction.sobe;
    return change.from - change.to >= (reaction.desce ?? Infinity);
  });
}

/** Pode acontecer neste turno (antes da sorte)? */
export function isEligible(
  occurrence: OccurrenceFile,
  state: OccurrenceState,
  values: Readonly<Record<string, number>>,
  turn: number,
): boolean {
  const trigger = occurrence.gatilho;
  if (!trigger) return false;
  if (occurrence.unica && (state.timesSeen[occurrence.id] ?? 0) > 0)
    return false;
  const last = state.lastStarted[occurrence.id];
  if (
    last !== undefined &&
    turn - last < Math.max(1, occurrence.intervaloMinimoTurnos ?? 1)
  )
    return false;
  if (state.active.some((a) => a.occurrenceId === occurrence.id)) return false;
  if (state.pending.some((p) => p.occurrenceId === occurrence.id)) return false;
  if (!conditionHolds(trigger.condicao, values)) return false;
  if (
    trigger.porTurnos !== undefined &&
    (state.conditionTurns[occurrence.id] ?? 0) < trigger.porTurnos
  )
    return false;
  return reactionMatches(occurrence, state, turn);
}

// ---------------------------------------------------------------------------
// Estado
// ---------------------------------------------------------------------------

export function emptyOccurrenceState(): OccurrenceState {
  return {
    active: [],
    pending: [],
    armed: [],
    conditionTurns: {},
    lawChanges: [],
    lawSnapshot: {},
    lastStarted: {},
    timesSeen: {},
    situations: {},
    history: [],
  };
}

/** Comandos do mês: todo nó de ocorrência (0 ou 1) e as setas ligadas. */
export function occurrenceMonth(
  content: ResolvedPackage,
  graph: ScenarioGraph,
  state: OccurrenceState,
  month: number,
): {
  commands: { controlId: string; value: number; policyId: string }[];
  relationIds: string[];
} {
  const catalog = occurrenceCatalog(content, graph);
  const on = new Set(
    state.active.filter((a) => a.monthsLeft > month).map((a) => a.control),
  );
  const commands = catalog.controls
    .filter((id) => graph.nodesById[id] !== undefined)
    .map((controlId) => ({
      controlId,
      value: on.has(controlId) ? 1 : 0,
      policyId: catalog.ownerByControl.get(controlId) ?? controlId,
    }));
  const relationIds = [...on].flatMap(
    (control) => catalog.relationsByControl.get(control) ?? [],
  );
  return { commands, relationIds };
}

/** Depois de `months` meses: o que acabou sai das ativas e vai ao histórico. */
export function advanceOccurrenceMonths(
  state: OccurrenceState,
  months: number,
  turn: number,
): OccurrenceState {
  if (state.active.length === 0) return state;
  const active: ActiveOccurrence[] = [];
  const ended = new Set<string>();
  for (const item of state.active) {
    const left = item.monthsLeft - months;
    if (left > 0) active.push({ ...item, monthsLeft: left });
    else ended.add(`${item.occurrenceId}|${item.optionId ?? ""}`);
  }
  const history = state.history.map((record) =>
    record.endedTurn === undefined &&
    record.kind !== "situacao" &&
    ended.has(`${record.id}|${record.optionId ?? ""}`)
      ? { ...record, endedTurn: turn }
      : record,
  );
  return { ...state, active, history };
}

/** Variáveis citadas nos textos de uma ocorrência: {cidade}, {empresa}… */
export function occurrenceVariables(o: OccurrenceFile): string[] {
  const texts = [
    o.nome,
    o.manchete ?? "",
    o.descricao ?? "",
    ...(o.opcoes ?? []).flatMap((op) => [op.rotulo, op.descricao ?? ""]),
  ];
  const names = new Set<string>();
  for (const text of texts)
    for (const m of text.matchAll(/\{([a-z_]+)\}/g)) names.add(m[1]);
  return [...names].sort();
}

/**
 * Escolhe o valor de cada variável do texto: lugares e nomes vêm do pacote
 * do país (`lugares`); {ministro}, {ministerio} ("da Saúde") e {pasta}
 * ("Saúde") vêm da área da ocorrência ou, fora de um ministério, da lista
 * `ministerio` do país (até existirem ministros com nome). Variáveis herdadas (desdobramento) ficam.
 */
function pickVars(
  content: ResolvedPackage,
  o: OccurrenceFile,
  seed: number,
  turn: number,
  inherited?: Readonly<Record<string, string>>,
): Readonly<Record<string, string>> | undefined {
  const vars: Record<string, string> = { ...(inherited ?? {}) };
  const lists = content.initialState.lugares ?? {};
  // o ministério: o da área da ocorrência ("da Saúde"); numa área sem
  // ministério (Casa Civil), um sorteado da lista `ministerio` do país
  const pick = (name: string, list: readonly string[]) =>
    list[Math.floor(roll(seed, turn, `var:${o.id}:${name}`) * list.length)];
  const daArea = o.area?.startsWith("Ministério ")
    ? o.area.replace(/^Ministério /, "")
    : undefined;
  const ministerio =
    vars.ministerio ??
    daArea ??
    (lists.ministerio?.length
      ? pick("ministerio", lists.ministerio)
      : undefined);
  for (const name of occurrenceVariables(o)) {
    if (vars[name] !== undefined) continue;
    const list = lists[name];
    if (name === "ministerio" || name === "ministro" || name === "pasta") {
      if (name === "ministerio") vars[name] = ministerio ?? "do governo";
      else if (name === "ministro")
        vars[name] = ministerio
          ? `o ministro ${ministerio}`
          : "um ministro do governo";
      else
        vars[name] = ministerio
          ? ministerio.replace(/^(da|do|dos|das|de) /, "")
          : "governo";
    } else if (list && list.length) vars[name] = pick(name, list);
  }
  return Object.keys(vars).length ? vars : undefined;
}

function armFollowUps(
  list: readonly OccurrenceFollowUp[] | undefined,
  causeId: string,
  seed: number,
  turn: number,
  vars: Readonly<Record<string, string>> | undefined,
): ArmedOccurrence[] {
  return (list ?? []).map((item) => {
    const [from, to] = item.emTurnos;
    const delay =
      from +
      Math.floor(
        roll(seed, turn, `prazo:${causeId}:${item.ocorrencia}`) *
          (to - from + 1),
      );
    return {
      occurrenceId: item.ocorrencia,
      dueTurn: turn + delay,
      chance: item.chance,
      causeId,
      ...(vars ? { vars } : {}),
    };
  });
}

export type TurnOccurrences = Readonly<{
  state: OccurrenceState;
  events: readonly string[];
  dilemmas: readonly string[];
  situationsStarted: readonly string[];
  situationsEnded: readonly string[];
}>;

/**
 * Sorteio do turno (depois do trimestre simulado): registra situações e
 * mudanças de lei, dispara eventos e põe dilemas na mesa.
 */
export function rollTurn(input: {
  content: ResolvedPackage;
  state: OccurrenceState;
  values: Readonly<Record<string, number>>;
  turn: number;
  seed: number;
  /** Metas atuais das leis, por controle. */
  laws: Readonly<Record<string, number>>;
  /** Sem eventos (só a mesa de dilemas), como no início da partida. */
  onlyDilemmas?: boolean;
}): TurnOccurrences {
  const { content, values, turn, seed, laws } = input;
  const catalog = occurrenceCatalog(content);
  let state = input.state;

  // mudanças de lei desde o último sorteio (reações)
  const changes: LawChange[] = [];
  for (const [control, to] of Object.entries(laws)) {
    const from = state.lawSnapshot[control];
    if (from !== undefined && Math.abs(from - to) > 1e-9)
      changes.push({ turn, control, from, to });
  }
  state = {
    ...state,
    lawSnapshot: { ...laws },
    lawChanges: [
      ...state.lawChanges.filter((c) => turn - c.turn <= LAW_CHANGE_MEMORY),
      ...changes,
    ],
  };

  // situações que surgiram e acabaram
  const situationsStarted: string[] = [];
  const situationsEnded: string[] = [];
  const situations: Record<string, boolean> = {};
  const situationRecords: OccurrenceRecord[] = [];
  for (const variable of content.variables.variaveis) {
    if (variable.tipo !== "situacao" || variable.surgimento === undefined)
      continue;
    const on = (values[variable.id] ?? 0) > variable.surgimento;
    situations[variable.id] = on;
    const was = state.situations[variable.id] ?? false;
    if (on && !was) {
      situationsStarted.push(variable.id);
      situationRecords.push({ kind: "situacao", id: variable.id, turn });
    } else if (!on && was) situationsEnded.push(variable.id);
  }
  const history = state.history.map((r) =>
    r.kind === "situacao" &&
    r.endedTurn === undefined &&
    situationsEnded.includes(r.id)
      ? { ...r, endedTurn: turn }
      : r,
  );
  state = {
    ...state,
    situations,
    history: [...history, ...situationRecords],
  };

  // gatilhos de condição mantida
  const conditionTurns: Record<string, number> = {};
  for (const o of catalog.all)
    if (o.gatilho?.condicao)
      conditionTurns[o.id] = conditionHolds(o.gatilho.condicao, values)
        ? (state.conditionTurns[o.id] ?? 0) + 1
        : 0;
  state = { ...state, conditionTurns };

  const started: OccurrenceRecord[] = [];
  const active: ActiveOccurrence[] = [...state.active];
  const pending: PendingDilemma[] = [...state.pending];
  const armed: ArmedOccurrence[] = [];
  const lastStarted: Record<string, number> = { ...state.lastStarted };
  const timesSeen: Record<string, number> = { ...state.timesSeen };

  const startEvent = (
    o: OccurrenceFile,
    causeId?: string,
    inherited?: Readonly<Record<string, string>>,
  ) => {
    const where = pickVars(content, o, seed, turn, inherited);
    if (o.controle && o.duracaoMeses)
      active.push({
        occurrenceId: o.id,
        control: o.controle,
        monthsLeft: o.duracaoMeses,
        startedTurn: turn,
        ...(where ? { vars: where } : {}),
      });
    lastStarted[o.id] = turn;
    timesSeen[o.id] = (timesSeen[o.id] ?? 0) + 1;
    started.push({
      kind: "evento",
      id: o.id,
      turn,
      ...(where ? { vars: where } : {}),
      ...(causeId ? { causeId } : {}),
    });
    armed.push(...armFollowUps(o.desdobramentos, o.id, seed, turn, where));
  };
  const openDilemma = (
    o: OccurrenceFile,
    causeId?: string,
    inherited?: Readonly<Record<string, string>>,
  ) => {
    const where = pickVars(content, o, seed, turn, inherited);
    pending.push({
      occurrenceId: o.id,
      openedTurn: turn,
      ...(where ? { vars: where } : {}),
      ...(causeId ? { causeId } : {}),
    });
    lastStarted[o.id] = turn;
    timesSeen[o.id] = (timesSeen[o.id] ?? 0) + 1;
  };
  const view = () => ({ ...state, active, pending, lastStarted, timesSeen });

  // consequências armadas que vencem agora
  const followUpDilemmas: {
    o: OccurrenceFile;
    cause: string;
    /** Variáveis do texto ({cidade}, {empresa}…), escolhidas ao acontecer. */
    vars?: Readonly<Record<string, string>>;
  }[] = [];
  for (const item of state.armed) {
    if (item.dueTurn > turn) {
      armed.push(item);
      continue;
    }
    const o = catalog.byId.get(item.occurrenceId);
    if (!o) continue;
    if (roll(seed, turn, `armada:${item.causeId}:${o.id}`) >= item.chance)
      continue;
    if (o.tipo === "dilema") {
      if (!view().pending.some((p) => p.occurrenceId === o.id))
        followUpDilemmas.push({ o, cause: item.causeId, vars: item.vars });
    } else if (
      !input.onlyDilemmas &&
      !active.some((a) => a.occurrenceId === o.id)
    )
      startEvent(o, item.causeId, item.vars);
  }

  // eventos sorteados (um grande e um local por turno, no máximo)
  if (!input.onlyDilemmas) {
    const drawn = catalog.all
      .filter((o) => o.tipo === "evento" && (o.gatilho?.chance ?? 0) > 0)
      .map((o) => {
        const r = roll(seed, turn, `evento:${o.id}`);
        const eligible = isEligible(o, view(), values, turn);
        const { chance } = occurrenceChance(o, values, view());
        return { o, ratio: eligible && r < chance ? r / chance : Infinity };
      })
      .filter((x) => Number.isFinite(x.ratio))
      .sort((a, b) => a.ratio - b.ratio);
    const big = drawn.filter((x) => (x.o.nivel ?? 2) >= 2);
    const local = drawn.filter((x) => (x.o.nivel ?? 2) < 2);
    for (const x of [
      ...big.slice(0, MAX_EVENTOS_GRANDES_POR_TURNO),
      ...local.slice(0, MAX_EVENTOS_LOCAIS_POR_TURNO),
    ])
      startEvent(x.o);
  }

  // desdobramentos de eventos deste turno que vencem já (emTurnos 0 não existe:
  // ficam para o próximo turno, como "a enchente do turno 3, o dilema do 4")

  // a mesa de dilemas: desdobramento → crise → reação → cotidiano
  const ultimoDilema = Math.max(
    -Infinity,
    ...catalog.all
      .filter((o) => o.tipo === "dilema")
      .map((o) => state.lastStarted[o.id] ?? -Infinity),
  );
  if (pending.length === 0 && turn - ultimoDilema >= TURNOS_ENTRE_DILEMAS) {
    for (const f of followUpDilemmas.slice(0, MAX_DILEMAS_POR_TURNO))
      openDilemma(f.o, f.cause, f.vars);
    if (pending.length < MAX_DILEMAS_POR_TURNO) {
      const dilemmas = catalog.all.filter((o) => o.tipo === "dilema");
      const rolled = (origin: string) =>
        dilemmas
          .filter((o) => o.origem === origin)
          .map((o) => {
            const r = roll(seed, turn, `dilema:${o.id}`);
            const eligible = isEligible(o, view(), values, turn);
            const { chance } = occurrenceChance(o, values, view());
            return { o, ratio: eligible && r < chance ? r / chance : Infinity };
          })
          .filter((x) => Number.isFinite(x.ratio))
          .sort((a, b) => a.ratio - b.ratio);
      // crise e reação antes do cotidiano; o cotidiano também é sorteado
      // pela chance (nem todo turno tem dilema), e a mesma área do último
      // dilema pesa menos
      const ordem = [
        ...rolled("crise"),
        ...rolled("reacao"),
        ...rolled("cotidiano").sort(
          (a, b) =>
            a.ratio * (a.o.area === state.lastDilemmaArea ? 2 : 1) -
            b.ratio * (b.o.area === state.lastDilemmaArea ? 2 : 1),
        ),
      ];
      if (ordem.length > 0 && pending.length < MAX_DILEMAS_POR_TURNO)
        openDilemma(ordem[0].o);
    }
  }

  const opened = pending.filter((p) => p.openedTurn === turn);
  const lastArea = opened.length
    ? catalog.byId.get(opened.at(-1)!.occurrenceId)?.area
    : state.lastDilemmaArea;
  return {
    state: {
      ...state,
      active,
      pending,
      armed,
      lastStarted,
      timesSeen,
      ...(lastArea ? { lastDilemmaArea: lastArea } : {}),
      history: [...state.history, ...started],
    },
    events: started.map((r) => r.id),
    dilemmas: opened.map((p) => p.occurrenceId),
    situationsStarted,
    situationsEnded,
  };
}

/** A opção pode ser escolhida agora? */
export function optionAvailable(
  option: DilemmaOptionFile,
  values: Readonly<Record<string, number>>,
): boolean {
  return conditionHolds(option.requer, values);
}

export type AnswerResult =
  | Readonly<{
      ok: true;
      state: OccurrenceState;
      laws: readonly { lei: string; nivel: number }[];
    }>
  | Readonly<{ ok: false; error: string }>;

/** O presidente escolhe uma opção: ela começa a valer e sai da mesa. */
export function answerDilemma(input: {
  content: ResolvedPackage;
  state: OccurrenceState;
  occurrenceId: string;
  optionId: string;
  turn: number;
  seed: number;
  values: Readonly<Record<string, number>>;
  automatic?: boolean;
}): AnswerResult {
  const { content, state, occurrenceId, optionId, turn, seed } = input;
  const pending = state.pending.find((p) => p.occurrenceId === occurrenceId);
  if (!pending) return { ok: false, error: "Este dilema não está na mesa." };
  const dilemma = occurrenceCatalog(content).byId.get(occurrenceId);
  const option = dilemma?.opcoes?.find((o) => o.id === optionId);
  if (!dilemma || !option)
    return { ok: false, error: "Opção inexistente neste dilema." };
  if (!optionAvailable(option, input.values))
    return {
      ok: false,
      error: option.motivoRequer ?? "Esta opção não está disponível agora.",
    };
  const record: OccurrenceRecord = {
    kind: "dilema",
    id: occurrenceId,
    turn: pending.openedTurn,
    optionId,
    ...(pending.vars ? { vars: pending.vars } : {}),
    ...(pending.causeId ? { causeId: pending.causeId } : {}),
    ...(input.automatic ? { automatic: true } : {}),
  };
  return {
    ok: true,
    laws: option.leis ?? [],
    state: {
      ...state,
      pending: state.pending.filter((p) => p !== pending),
      active: [
        ...state.active,
        {
          occurrenceId,
          optionId,
          control: option.controle,
          monthsLeft: option.duracaoMeses,
          startedTurn: turn,
          ...(pending.vars ? { vars: pending.vars } : {}),
        },
      ],
      armed: [
        ...state.armed,
        ...armFollowUps(
          option.desdobramentos,
          `${occurrenceId}.${optionId}`,
          seed,
          turn,
          pending.vars,
        ),
      ],
      history: [...state.history, record],
    },
  };
}
