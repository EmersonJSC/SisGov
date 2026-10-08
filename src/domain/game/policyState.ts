import { domainFailure, type DomainResult } from "./result";
import {
  validateImplementedPolicyLevel,
  validatePolicyLevel,
  type PolicyLevelRules,
} from "./policyRules";
import type { Proposal } from "./proposal";

/** Implementation lifecycle; legal authority is stored separately. */
export const policyStatuses = ["vigente", "em_revogacao", "encerrada"] as const;

export type PolicyStatus = (typeof policyStatuses)[number];

export type LegalPolicyStatus = "vigente" | "revogada";

export type PolicyOrigin =
  | Readonly<{
      kind: "aprovada";
      proposalId: string;
      turn: number;
    }>
  | Readonly<{
      kind: "herdada";
      scenarioId: string;
      turn: number;
    }>;

export type PolicyStateChange = Readonly<{
  kind:
    | "autorizada"
    | "herdada"
    | "meta_alterada"
    | "implantacao_atualizada"
    | "revogacao_iniciada"
    | "encerrada";
  turn: number;
  legalStatus: LegalPolicyStatus;
  desiredLevel: number;
  implementedLevel: number;
}>;

export type PolicyState = Readonly<{
  id: string;
  policyDefinitionId: string;
  status: PolicyStatus;
  /** Legal authority is independent of remaining implementation and effects. */
  legalStatus: LegalPolicyStatus;
  desiredLevel: number;
  implementedLevel: number;
  origin: PolicyOrigin;
  /** Effects with their own duration remain in the engine's relation memory. */
  history: readonly PolicyStateChange[];
}>;

export type InheritedPolicyState = Readonly<{
  id: string;
  policyDefinitionId: string;
  desiredLevel: number;
  implementedLevel: number;
  status?: "vigente" | "em_revogacao";
  scenarioId: string;
  inheritedAtTurn: number;
}>;

function validTurn(turn: number): boolean {
  return Number.isInteger(turn) && turn >= 0;
}

function validLevels(
  desiredLevel: number,
  implementedLevel: number,
  rules: PolicyLevelRules,
): DomainResult<true> {
  const desired = validatePolicyLevel(desiredLevel, rules);
  if (!desired.ok) return desired;
  const implemented = validateImplementedPolicyLevel(implementedLevel, rules);
  if (!implemented.ok) return implemented;
  return { ok: true, value: true };
}

function createState(
  input: Omit<PolicyState, "history">,
  kind: PolicyStateChange["kind"],
): PolicyState {
  return {
    ...input,
    history: [
      {
        kind,
        turn: input.origin.turn,
        legalStatus: input.legalStatus,
        desiredLevel: input.desiredLevel,
        implementedLevel: input.implementedLevel,
      },
    ],
  };
}

/** A aprovação autoriza a política; a implantação continua sendo gradual. */
export function createPolicyStateFromApproval(
  id: string,
  proposal: Proposal,
  rules: PolicyLevelRules,
  implementedLevel: number,
): DomainResult<PolicyState> {
  if (!id)
    return domainFailure(
      "ESTADO_INVALIDO",
      "A política vigente precisa de ID.",
    );
  if (proposal.status !== "aprovada")
    return domainFailure(
      "DECISAO_INVALIDA",
      "Apenas uma proposta aprovada pode criar uma política vigente.",
    );
  if (proposal.policyDefinitionId !== rules.policyDefinitionId)
    return domainFailure(
      "DEFINICAO_INVALIDA",
      "A proposta e as regras precisam apontar para a mesma política.",
    );
  const authorizedAtTurn = proposal.decidedAtTurn;
  if (authorizedAtTurn === undefined || !validTurn(authorizedAtTurn))
    return domainFailure(
      "ESTADO_INVALIDO",
      "O turno de autorização é inválido.",
    );
  const levels = validLevels(proposal.desiredLevel, implementedLevel, rules);
  if (!levels.ok) return levels;
  return {
    ok: true,
    value: createState(
      {
        id,
        policyDefinitionId: proposal.policyDefinitionId,
        status: "vigente",
        legalStatus: "vigente",
        desiredLevel: proposal.desiredLevel,
        implementedLevel,
        origin: {
          kind: "aprovada",
          proposalId: proposal.id,
          turn: authorizedAtTurn,
        },
      },
      "autorizada",
    ),
  };
}

/** Política já existente no cenário, sem inventar uma proposta de origem. */
export function createInheritedPolicyState(
  input: InheritedPolicyState,
  rules: PolicyLevelRules,
): DomainResult<PolicyState> {
  if (!input.id || !input.scenarioId)
    return domainFailure(
      "ESTADO_INVALIDO",
      "A política herdada precisa de identidade e cenário de origem.",
    );
  if (input.policyDefinitionId !== rules.policyDefinitionId)
    return domainFailure(
      "DEFINICAO_INVALIDA",
      "A política herdada e as regras precisam apontar para a mesma definição.",
    );
  if (!validTurn(input.inheritedAtTurn))
    return domainFailure("ESTADO_INVALIDO", "O turno herdado é inválido.");
  const levels = validLevels(input.desiredLevel, input.implementedLevel, rules);
  if (!levels.ok) return levels;
  return {
    ok: true,
    value: createState(
      {
        id: input.id,
        policyDefinitionId: input.policyDefinitionId,
        status: input.status ?? "vigente",
        legalStatus: input.status === "em_revogacao" ? "revogada" : "vigente",
        desiredLevel: input.desiredLevel,
        implementedLevel: input.implementedLevel,
        origin: {
          kind: "herdada",
          scenarioId: input.scenarioId,
          turn: input.inheritedAtTurn,
        },
      },
      "herdada",
    ),
  };
}

export function changePolicyTarget(
  state: PolicyState,
  desiredLevel: number,
  turn: number,
  rules: PolicyLevelRules,
): DomainResult<PolicyState> {
  if (state.status !== "vigente" || state.legalStatus !== "vigente")
    return domainFailure(
      "ESTADO_INVALIDO",
      "A meta só pode mudar enquanto a política estiver vigente.",
    );
  if (!validTurn(turn) || turn < state.history.at(-1)!.turn)
    return domainFailure("ESTADO_INVALIDO", "O turno da alteração é inválido.");
  const level = validatePolicyLevel(desiredLevel, rules);
  if (!level.ok) return level;
  if (state.policyDefinitionId !== rules.policyDefinitionId)
    return domainFailure(
      "DEFINICAO_INVALIDA",
      "A política vigente e as regras apontam para definições diferentes.",
    );
  return {
    ok: true,
    value: {
      ...state,
      desiredLevel,
      history: [
        ...state.history,
        {
          kind: "meta_alterada",
          turn,
          legalStatus: state.legalStatus,
          desiredLevel,
          implementedLevel: state.implementedLevel,
        },
      ],
    },
  };
}

export function updateImplementedLevel(
  state: PolicyState,
  implementedLevel: number,
  turn: number,
  rules: PolicyLevelRules,
): DomainResult<PolicyState> {
  if (state.status === "encerrada")
    return domainFailure(
      "ESTADO_INVALIDO",
      "Uma política encerrada não pode voltar a ser implantada.",
    );
  if (!validTurn(turn) || turn < state.history.at(-1)!.turn)
    return domainFailure(
      "ESTADO_INVALIDO",
      "O turno de implantação é inválido.",
    );
  const level = validateImplementedPolicyLevel(implementedLevel, rules);
  if (!level.ok) return level;
  if (state.policyDefinitionId !== rules.policyDefinitionId)
    return domainFailure(
      "DEFINICAO_INVALIDA",
      "A política vigente e as regras apontam para definições diferentes.",
    );
  if (
    state.status === "vigente" &&
    ((state.desiredLevel >= state.implementedLevel &&
      (implementedLevel < state.implementedLevel ||
        implementedLevel > state.desiredLevel)) ||
      (state.desiredLevel < state.implementedLevel &&
        (implementedLevel > state.implementedLevel ||
          implementedLevel < state.desiredLevel)))
  )
    return domainFailure(
      "NIVEL_INVALIDO",
      "A implantação deve avançar em direção à meta vigente sem ultrapassá-la.",
    );
  if (
    state.status === "em_revogacao" &&
    implementedLevel > state.implementedLevel
  )
    return domainFailure(
      "ESTADO_INVALIDO",
      "A implantação não pode aumentar enquanto a política está sendo revogada.",
    );
  const status =
    state.status === "em_revogacao" &&
    implementedLevel <= (rules.revocationEpsilon ?? 0)
      ? "encerrada"
      : state.status;
  const finalLevel = status === "encerrada" ? 0 : implementedLevel;
  return {
    ok: true,
    value: {
      ...state,
      status,
      implementedLevel: finalLevel,
      history: [
        ...state.history,
        {
          kind: status === "encerrada" ? "encerrada" : "implantacao_atualizada",
          turn,
          legalStatus: state.legalStatus,
          desiredLevel: state.desiredLevel,
          implementedLevel: finalLevel,
        },
      ],
    },
  };
}

export function beginPolicyRevocation(
  state: PolicyState,
  turn: number,
  rules: PolicyLevelRules,
): DomainResult<PolicyState> {
  if (state.status !== "vigente" || state.legalStatus !== "vigente")
    return domainFailure(
      "ESTADO_INVALIDO",
      "Somente uma política vigente pode iniciar revogação.",
    );
  if (!validTurn(turn) || turn < state.history.at(-1)!.turn)
    return domainFailure("ESTADO_INVALIDO", "O turno de revogação é inválido.");
  if (state.policyDefinitionId !== rules.policyDefinitionId)
    return domainFailure(
      "DEFINICAO_INVALIDA",
      "A política vigente e as regras apontam para definições diferentes.",
    );
  const zero = validateImplementedPolicyLevel(0, rules);
  if (!zero.ok) {
    if (zero.error.code === "DEFINICAO_INVALIDA") return zero;
    return domainFailure(
      "NIVEL_INVALIDO",
      "A regra da política não permite nível zero para revogação.",
    );
  }
  return {
    ok: true,
    value: {
      ...state,
      status: "em_revogacao",
      legalStatus: "revogada",
      desiredLevel: 0,
      history: [
        ...state.history,
        {
          kind: "revogacao_iniciada",
          turn,
          legalStatus: "revogada",
          desiredLevel: 0,
          implementedLevel: state.implementedLevel,
        },
      ],
    },
  };
}
