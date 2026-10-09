import {
  createExecution,
  createPackageContentIdentity,
  type ContentDiagnostic,
  type ElectoralLawDefinition,
  type EngineExecution,
  type ScenarioGraph,
} from "../engine";
import type { ResolvedPackage } from "../engine";
import {
  createInheritedPolicyState,
  type PolicyLevelRules,
  type PolicyState,
  type Proposal,
} from "../domain/game";
import type { AggregateCreditState, FiscalState } from "../domain/fiscal";
import { createRandomState, type RandomState } from "./randomState";

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
  proposals: readonly Proposal[];
  policies: readonly PolicyState[];
  electoralLaws: readonly ElectoralLawState[];
  political?: PoliticalGameState;
  fiscal?: FiscalState;
  credit?: AggregateCreditState;
  random?: RandomState;
  execution: EngineExecution;
}>;

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
  options: Readonly<{ randomSeed?: number }> = {},
): CreateGameResult {
  if (!id.trim()) return failure(content, "id", "A partida precisa de ID.");
  const random =
    options.randomSeed === undefined
      ? undefined
      : createRandomState(options.randomSeed);
  if (random && !random.ok)
    return failure(content, "random.seed", random.diagnostics[0].message);
  const policyById = new Map(
    content.policies.map((policy) => [policy.id, policy]),
  );
  const variableById = new Map(
    content.variables.variaveis.map((variable) => [variable.id, variable]),
  );
  const seen = new Set<string>();
  const policies: PolicyState[] = [];
  for (const [index, initial] of (
    content.initialState.politicasVigentes ?? []
  ).entries()) {
    const field = `politicasVigentes.${index}`;
    if (seen.has(initial.politica))
      return failure(
        content,
        field,
        `Política vigente duplicada: ${initial.politica}.`,
      );
    seen.add(initial.politica);
    const policy = policyById.get(initial.politica);
    if (!policy)
      return failure(
        content,
        field,
        `Política inexistente: ${initial.politica}.`,
      );
    const control = variableById.get(policy.controle.variavel);
    if (!control)
      return failure(
        content,
        field,
        `Controle inexistente para ${initial.politica}.`,
      );
    const rules: PolicyLevelRules = {
      policyDefinitionId: policy.id,
      unit: control.unidade,
      domain: {
        minimum: control.dominio.minimo,
        maximum: control.dominio.maximo,
      },
      options: policy.controle.opcoes?.map((option) => option.valor),
    };
    const state = createInheritedPolicyState(
      {
        id: `${id}:policy:${policy.id}`,
        policyDefinitionId: policy.id,
        desiredLevel: initial.nivelDesejado,
        implementedLevel: initial.nivelImplantado,
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
  const fiscal = content.initialState.fiscal
    ? {
        cash: content.initialState.fiscal.caixa,
        totalDebt: content.initialState.fiscal.dividaTotal,
        debtIssuedDuringGame: 0,
        inheritedMonthlyInterest:
          content.initialState.fiscal.jurosHerdadosMensais,
        monthlyNewDebtInterestRate:
          content.initialState.fiscal.taxaJurosDividaNovaMensal,
      }
    : undefined;
  const credit = content.initialState.fiscal?.credito
    ? {
        outstandingPrincipal:
          content.initialState.fiscal.credito.principalPendente,
        performingPrincipal:
          content.initialState.fiscal.credito.principalPerformante,
        defaultedPrincipal:
          content.initialState.fiscal.credito.principalInadimplente,
        bankCapital: content.initialState.fiscal.credito.capitalAgregado,
        monthlyInterestRevenue:
          content.initialState.fiscal.credito.receitaJurosMensal,
      }
    : undefined;
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
      proposals: [],
      policies,
      electoralLaws,
      political,
      fiscal,
      credit,
      random: random?.value,
      execution: createExecution(content, graph),
    },
  };
}
