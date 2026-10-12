/**
 * Grupos de pressão na partida (V1-09, docs/v1/desenho/pressao.md).
 *
 * - O nível de cada grupo é um nó do motor (situação em níveis); aqui fica só
 *   o registro: em que turno subiu ou desceu.
 * - Patrocínio oculto: o dinheiro chega pelo controle `acesso_<grupo>__<quem>`
 *   (1) até uma investigação revelar o par; aí o acesso vai a 0 e o
 *   `revelado_<grupo>` a 1 (o grupo perde legitimidade).
 * - Investigação: o jogador abre sobre um grupo; a cada turno, cada
 *   patrocinador oculto dele é descoberto com chance
 *   capacidade ÷ (capacidade + c × poder). Sem achar nada em `turnos`
 *   turnos, ela acaba vazia.
 */
import type {
  PressureGroupManifest,
  PressureGroupsManifest,
  ResolvedPackage,
  ScenarioGraph,
} from "../engine";
import { roll } from "./randomState";

export type PressureLevelChange = Readonly<{
  turn: number;
  groupId: string;
  from: number;
  to: number;
}>;

export type Investigation = Readonly<{
  groupId: string;
  startedTurn: number;
  turnsLeft: number;
}>;

/** Fim de uma investigação: os patrocinadores achados (vazio: nada). */
export type InvestigationResult = Readonly<{
  groupId: string;
  startedTurn: number;
  turn: number;
  sponsorIds: readonly string[];
}>;

export type PressureState = Readonly<{
  /** Nível de cada grupo no último sorteio. */
  levels: Readonly<Record<string, number>>;
  changes: readonly PressureLevelChange[];
  /** Pares revelados, `grupo|patrocinador`. */
  revealed: readonly string[];
  investigations: readonly Investigation[];
  results: readonly InvestigationResult[];
}>;

export const parRevelado = (groupId: string, sponsorId: string) =>
  `${groupId}|${sponsorId}`;

export function pressureGroups(
  content: ResolvedPackage,
): PressureGroupsManifest | undefined {
  return content.manifest.gruposDePressao;
}

function levelOf(
  group: PressureGroupManifest,
  values: Readonly<Record<string, number>>,
): number {
  return Math.round(values[group.nivel] ?? 0);
}

/** Estado do turno 0: os níveis que a rede deu. */
export function createPressureState(
  content: ResolvedPackage,
  values: Readonly<Record<string, number>>,
): PressureState | undefined {
  const config = pressureGroups(content);
  if (!config) return undefined;
  return {
    levels: Object.fromEntries(
      config.grupos.map((group) => [group.id, levelOf(group, values)]),
    ),
    changes: [],
    revealed: [],
    investigations: [],
    results: [],
  };
}

/** Comandos do mês: acesso de cada patrocínio e revelação de cada grupo. */
export function pressureMonth(
  content: ResolvedPackage,
  graph: ScenarioGraph,
  state: PressureState,
): { controlId: string; value: number; policyId: string }[] {
  const config = pressureGroups(content);
  if (!config) return [];
  const revealed = new Set(state.revealed);
  const commands: { controlId: string; value: number; policyId: string }[] = [];
  for (const group of config.grupos) {
    let any = false;
    for (const p of group.patrocinio) {
      const cut = revealed.has(parRevelado(group.id, p.patrocinador));
      if (cut && !p.publico) any = true;
      if (graph.nodesById[p.acesso])
        commands.push({
          controlId: p.acesso,
          value: cut ? 0 : 1,
          policyId: `pressao:${group.id}`,
        });
    }
    if (group.revelado && graph.nodesById[group.revelado])
      commands.push({
        controlId: group.revelado,
        value: any ? 1 : 0,
        policyId: `pressao:${group.id}`,
      });
  }
  return commands;
}

/**
 * O que mais empurra a pressão do grupo agora, para o texto da ação
 * ("O motivo: …"). Patrocínio não entra: oculto, não aparece.
 */
export function pressureCause(
  group: PressureGroupManifest,
  values: Readonly<Record<string, number>>,
): string | undefined {
  let best: { nome: string; pontos: number } | undefined;
  for (const causa of group.causas) {
    const raw = values[causa.origem] ?? 0;
    const pib = values.pib_nominal ?? 0;
    const x = causa.porPib ? (pib > 0 ? (raw / pib) * 100 : 0) : raw;
    const pontos = causa.coeficiente * x + causa.constante;
    if (!best || pontos > best.pontos) best = { nome: causa.nome, pontos };
  }
  return best && best.pontos > 0 ? best.nome : undefined;
}

/** Ação de grupo: o grupo e se é pesada (nível 3). */
export type GroupAction = Readonly<{
  group: PressureGroupManifest;
  heavy: boolean;
}>;

const actionMaps = new WeakMap<
  ResolvedPackage,
  ReadonlyMap<string, GroupAction>
>();

/** Ações de grupo por evento. */
export function groupActions(
  content: ResolvedPackage,
): ReadonlyMap<string, GroupAction> {
  const cached = actionMaps.get(content);
  if (cached) return cached;
  const map = new Map<string, GroupAction>();
  for (const group of pressureGroups(content)?.grupos ?? [])
    for (const acao of group.acoes)
      map.set(acao.evento, { group, heavy: acao.nivel >= 3 });
  actionMaps.set(content, map);
  return map;
}

export type PressureTurn = Readonly<{
  state: PressureState;
  changes: readonly PressureLevelChange[];
  finished: readonly InvestigationResult[];
  /** Eventos que a revelação dispara (relação com o país do patrocinador). */
  events: readonly string[];
}>;

/** Depois do trimestre: registra os níveis e anda as investigações. */
export function rollPressure(input: {
  content: ResolvedPackage;
  state: PressureState;
  values: Readonly<Record<string, number>>;
  turn: number;
  seed: number;
}): PressureTurn {
  const { content, state, values, turn, seed } = input;
  const config = pressureGroups(content);
  if (!config) return { state, changes: [], finished: [], events: [] };

  const changes: PressureLevelChange[] = [];
  const levels: Record<string, number> = {};
  for (const group of config.grupos) {
    const to = levelOf(group, values);
    const from = state.levels[group.id] ?? to;
    levels[group.id] = to;
    if (to !== from) changes.push({ turn, groupId: group.id, from, to });
  }

  const groups = new Map(config.grupos.map((g) => [g.id, g]));
  const sponsors = new Map(config.patrocinadores.map((s) => [s.id, s]));
  const revealed = new Set(state.revealed);
  const capacity = Math.max(0, values[config.investigacao.capacidade] ?? 0);
  const investigations: Investigation[] = [];
  const finished: InvestigationResult[] = [];
  const events: string[] = [];
  for (const item of state.investigations) {
    const group = groups.get(item.groupId);
    if (!group) continue;
    const found = group.patrocinio
      .filter(
        (p) =>
          !p.publico && !revealed.has(parRevelado(group.id, p.patrocinador)),
      )
      .filter((p) => {
        const poder = sponsors.get(p.patrocinador)?.poder ?? 1;
        const hide = config.investigacao.c * poder;
        const chance = capacity + hide > 0 ? capacity / (capacity + hide) : 0;
        return (
          roll(seed, turn, `investigacao:${group.id}:${p.patrocinador}`) <
          chance
        );
      })
      .map((p) => p.patrocinador);
    const left = item.turnsLeft - 1;
    if (found.length === 0 && left > 0) {
      investigations.push({ ...item, turnsLeft: left });
      continue;
    }
    for (const id of found) {
      revealed.add(parRevelado(group.id, id));
      const evento = sponsors.get(id)?.eventoRevelado;
      if (evento && !events.includes(evento)) events.push(evento);
    }
    finished.push({
      groupId: group.id,
      startedTurn: item.startedTurn,
      turn,
      sponsorIds: found,
    });
  }

  return {
    state: {
      levels,
      changes: [...state.changes, ...changes],
      revealed: [...revealed],
      investigations,
      results: [...state.results, ...finished],
    },
    changes,
    finished,
    events,
  };
}

export type OpenInvestigationResult =
  | Readonly<{ ok: true; state: PressureState }>
  | Readonly<{ ok: false; error: string }>;

/** O jogador manda investigar quem financia um grupo. */
export function openInvestigation(
  content: ResolvedPackage,
  state: PressureState,
  groupId: string,
  turn: number,
): OpenInvestigationResult {
  const config = pressureGroups(content);
  const group = config?.grupos.find((g) => g.id === groupId);
  if (!config || !group)
    return { ok: false, error: "Grupo de pressão inexistente." };
  if (state.investigations.some((i) => i.groupId === groupId))
    return { ok: false, error: `${group.nome}: já há uma investigação.` };
  if (state.investigations.length >= config.investigacao.aoMesmoTempo)
    return {
      ok: false,
      error: `No máximo ${config.investigacao.aoMesmoTempo} investigações ao mesmo tempo.`,
    };
  return {
    ok: true,
    state: {
      ...state,
      investigations: [
        ...state.investigations,
        { groupId, startedTurn: turn, turnsLeft: config.investigacao.turnos },
      ],
    },
  };
}
