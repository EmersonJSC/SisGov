import {
  advanceExecution,
  createExecution,
  createPackageContentIdentity,
  resolveInheritedLawLevels,
  type ContentDiagnostic,
  type ElectoralLawDefinition,
  type EngineExecution,
  type ScenarioGraph,
} from "../engine";
import type { ResolvedPackage } from "../engine";
import { createInheritedPolicyState, type PolicyState } from "./leis";
import { preparePolicyExecution } from "./preparePolicyExecution";
import { policyLevelRulesFromContent } from "./policyRulesFromContent";
import { createRandomState, type RandomState } from "./randomState";
import {
  emptyOccurrenceState,
  occurrenceCatalog,
  rollTurn,
  type OccurrenceState,
} from "./occurrences";
import { createPressureState, type PressureState } from "./pressao";

export type GameState = Readonly<{
  id: string;
  scenario: Readonly<{
    id: string;
    schemaVersion: number;
    contentIdentity: string;
  }>;
  currentTurn: number;
  gameStatus: "ativa" | "encerrada";
  elections: readonly Readonly<{
    electionId: string;
    turn: number;
    winnerId: string;
    status: "novo_mandato" | "derrota";
    tieRolls: readonly number[];
  }>[];
  policies: readonly PolicyState[];
  electoralLaws: readonly ElectoralLawState[];
  political?: PoliticalGameState;
  random?: RandomState;
  /** Eventos, dilemas e situações (SG106); ausente sem catálogo. */
  occurrences?: OccurrenceState;
  /** Grupos de pressão (V1-09); ausente sem grupos no pacote. */
  pressure?: PressureState;
  execution: EngineExecution;
}>;

/** Metas das leis por controle (para as reações das ocorrências). */
export function lawTargets(
  content: ResolvedPackage,
  policies: readonly PolicyState[],
): Record<string, number> {
  const controlOf = new Map(
    content.policies.map((policy) => [policy.id, policy.controle.variavel]),
  );
  const targets: Record<string, number> = {};
  for (const state of policies) {
    const control = controlOf.get(state.policyDefinitionId);
    if (control !== undefined)
      targets[control] = state.status === "encerrada" ? 0 : state.desiredLevel;
  }
  return targets;
}

export type PoliticalGameState = Readonly<{
  origin: Readonly<{ type: "observado" | "hipotese"; description: string }>;
  basePartySupport: Readonly<Record<string, number>>;
  partySupport: Readonly<Record<string, number>>;
  profiles: readonly Readonly<{
    id: string;
    electoralWeight: number;
    associations: readonly Readonly<{ groupId: string; weight: number }>[];
  }>[];
  referenceWeights: Readonly<Record<string, number>>;
  contributionsByRelation: Readonly<Record<string, number>>;
  senateSeatsByParty: Readonly<Record<string, number>>;
  governmentCoalitionPartyIds: readonly string[];
}>;

export type ElectoralLawState = Readonly<{
  lawDefinitionId: string;
  electionId: string;
  institutionId: string;
  scope: ElectoralLawDefinition["alcance"];
  mechanism: ElectoralLawDefinition["mecanismo"];
  parameters: Readonly<Record<string, string | number>>;
}>;
export type CreateGameResult =
  | { ok: true; value: GameState }
  | { ok: false; diagnostics: readonly ContentDiagnostic[] };

function failure(
  content: ResolvedPackage,
  field: string,
  message: string,
): CreateGameResult {
  return {
    ok: false,
    diagnostics: [
      {
        code: "COERENCIA_INVALIDA",
        file: content.pathsById[content.initialState.id],
        field,
        message,
      },
    ],
  };
}

export function createGame(
  id: string,
  content: ResolvedPackage,
  graph: ScenarioGraph,
  options: Readonly<{
    randomSeed?: number;
    /** Liga eventos e dilemas (SG106); padrão: sim, se houver catálogo. */
    occurrences?: boolean;
  }> = {},
): CreateGameResult {
  if (!id.trim()) return failure(content, "id", "A partida precisa de ID.");
  const random =
    options.randomSeed === undefined
      ? undefined
      : createRandomState(options.randomSeed);
  if (random && !random.ok)
    return failure(content, "random.seed", random.diagnostics[0].message);
  const seen = new Set<string>();
  const policies: PolicyState[] = [];
  for (const [index, initial] of (
    content.initialState.leisVigentes ?? []
  ).entries()) {
    const field = `leisVigentes[${index}]`;
    if (seen.has(initial.lei))
      return failure(content, field, `Lei vigente duplicada: ${initial.lei}.`);
    seen.add(initial.lei);
    const definition = policyLevelRulesFromContent(content, initial.lei);
    if (!definition.ok)
      return failure(content, field, definition.diagnostics[0].message);
    const { policy, rules } = definition.value;
    const levels = resolveInheritedLawLevels(policy, initial);
    if (!levels.ok)
      return failure(content, `${field}.${levels.field}`, levels.message);
    const state = createInheritedPolicyState(
      {
        id: `${id}:policy:${policy.id}`,
        policyDefinitionId: policy.id,
        desiredLevel: levels.desiredLevel,
        implementedLevel: levels.implementedLevel,
        scenarioId: content.manifest.id,
        inheritedAtTurn: 0,
      },
      rules,
    );
    if (!state.ok) return failure(content, field, state.error.message);
    policies.push(state.value);
  }
  const electoralLawById = new Map(
    (content.policyCatalog?.leisEleitorais ?? []).map((law) => [law.id, law]),
  );
  const initialForm = content.organizacaoPolitica?.formasDeGoverno.find(
    (form) => form.id === content.organizacaoPolitica?.formaInicial,
  );
  const electoralLaws: ElectoralLawState[] = [];
  const electoralScopes = new Set<string>();
  for (const [index, lawId] of (
    content.initialState.leisEleitoraisVigentes ?? []
  ).entries()) {
    const field = `leisEleitoraisVigentes.${index}`;
    const law = electoralLawById.get(lawId);
    if (!law)
      return failure(content, field, `Lei eleitoral inexistente: ${lawId}.`);
    if (!initialForm)
      return failure(
        content,
        field,
        "Lei eleitoral exige forma de governo inicial válida.",
      );
    if (!initialForm.eleicoesAtivas.includes(law.eleicao))
      return failure(content, field, `Eleição inativa: ${law.eleicao}.`);
    if (!initialForm.instituicoesAtivas.includes(law.instituicao))
      return failure(
        content,
        field,
        `Instituição inativa: ${law.instituicao}.`,
      );
    const scope = `${law.eleicao}\u0000${law.alcance}`;
    if (electoralScopes.has(scope))
      return failure(
        content,
        field,
        `Lei eleitoral incompatível já vigente para ${law.eleicao}.`,
      );
    electoralScopes.add(scope);
    electoralLaws.push({
      lawDefinitionId: law.id,
      electionId: law.eleicao,
      institutionId: law.instituicao,
      scope: law.alcance,
      mechanism: law.mecanismo,
      parameters: { ...law.parametros },
    });
  }
  const political = content.initialState.politica
    ? {
        origin: {
          type: content.initialState.politica.origem.tipo,
          description: content.initialState.politica.origem.descricao,
        },
        basePartySupport: Object.fromEntries(
          content.initialState.politica.partidos.map((party) => [
            party.id,
            content.initialState.politica!.perfis.reduce(
              (sum, profile) =>
                sum + profile.pesoEleitoral * profile.preferenciaBase[party.id],
              0,
            ),
          ]),
        ),
        partySupport: Object.fromEntries(
          content.initialState.politica.partidos.map((party) => [
            party.id,
            content.initialState.politica!.perfis.reduce(
              (sum, profile) =>
                sum + profile.pesoEleitoral * profile.preferenciaBase[party.id],
              0,
            ),
          ]),
        ),
        profiles: content.initialState.politica.perfis.map((profile) => ({
          id: profile.id,
          electoralWeight: profile.pesoEleitoral,
          associations: profile.associacoes.map((association) => ({
            groupId: association.grupo,
            weight: association.peso,
          })),
        })),
        referenceWeights: Object.fromEntries(
          content.initialState.politica.partidos.map((party) => [
            party.id,
            party.pesoReferencia ?? 0,
          ]),
        ),
        contributionsByRelation: {},
        senateSeatsByParty: {
          ...content.initialState.politica.cadeirasSenadoPorPartido,
        },
        governmentCoalitionPartyIds: [
          ...content.initialState.politica.coalizaoGoverno,
        ],
      }
    : undefined;
  let execution = createExecution(content, graph);
  // Aquecimento (V1-07): o país anda sozinho, com as leis herdadas e sem
  // ocorrências, do começo dos dados até o turno 0.
  const warmUp = content.initialState.cenario?.aquecimentoMeses ?? 0;
  if (warmUp > 0) {
    const batch = preparePolicyExecution(content, graph, policies);
    if (!batch.ok)
      return failure(content, "aquecimento", batch.diagnostics[0].message);
    for (let month = 0; month < warmUp; month += 1) {
      const advanced = advanceExecution(
        content,
        graph,
        execution,
        batch.value,
        1,
        { explain: false },
      );
      if (!advanced.ok)
        return failure(content, "aquecimento", advanced.diagnostics[0].message);
      execution = advanced.value.execution;
    }
  }
  // SG106: o primeiro turno já começa com um dilema na mesa
  const occurrences =
    options.occurrences !== false && occurrenceCatalog(content).all.length > 0
      ? rollTurn({
          content,
          state: emptyOccurrenceState(),
          values: execution.values,
          turn: 0,
          seed: random?.value.seed ?? 1,
          laws: lawTargets(content, policies),
          onlyDilemmas: true,
        }).state
      : undefined;
  const pressure = createPressureState(content, execution.values);
  return {
    ok: true,
    value: {
      id,
      scenario: {
        id: content.manifest.id,
        schemaVersion: content.manifest.versaoEsquema,
        contentIdentity: createPackageContentIdentity(content),
      },
      currentTurn: 0,
      gameStatus: "ativa",
      elections: [],
      policies,
      electoralLaws,
      political,
      random: random?.value,
      ...(occurrences ? { occurrences } : {}),
      ...(pressure ? { pressure } : {}),
      execution,
    },
  };
}
