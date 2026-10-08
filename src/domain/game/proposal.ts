import { domainFailure, type DomainResult } from "./result";
import { validatePolicyLevel, type PolicyLevelRules } from "./policyRules";

export const proposalStatuses = [
  "rascunho",
  "apresentada",
  "em_votacao",
  "aprovada",
  "rejeitada",
  "retirada",
] as const;

export type ProposalStatus = (typeof proposalStatuses)[number];

export type Proposal = Readonly<{
  id: string;
  policyDefinitionId: string;
  desiredLevel: number;
  status: ProposalStatus;
  createdAtTurn: number;
  presentedAtTurn?: number;
  voteDueTurn?: number;
  voteDeadlineTurn?: number;
  postponedAtTurn?: number;
  decidedAtTurn?: number;
  history: readonly ProposalHistoryEntry[];
}>;

export type ProposalHistoryEntry = Readonly<{
  status: ProposalStatus;
  turn: number;
  reason?: string;
}>;

export type ProposalTimingRules = Readonly<{
  normalWaitTurns: number;
  maximumWaitTurns: number;
}>;

/** V1 keeps proposals short: presentation plus at most two turns until voting. */
export const maximumProposalWaitTurns = 2;

export type NewProposal = Readonly<{
  id: string;
  policyDefinitionId: string;
  desiredLevel: number;
  createdAtTurn: number;
}>;

function validTurn(turn: number): boolean {
  return Number.isSafeInteger(turn) && turn >= 0;
}

function transition(
  proposal: Proposal,
  expected: ProposalStatus,
  target: ProposalStatus,
  turn: number,
): DomainResult<Proposal> {
  if (proposal.status !== expected)
    return domainFailure(
      "ESTADO_INVALIDO",
      `A proposta ${proposal.id} está em ${proposal.status}; a transição exige ${expected}.`,
    );
  if (!validTurn(turn) || turn < proposal.history.at(-1)!.turn)
    return domainFailure("ESTADO_INVALIDO", "O turno da decisão é inválido.");
  const history = [...proposal.history, { status: target, turn }];
  return {
    ok: true,
    value:
      target === "aprovada" || target === "rejeitada"
        ? { ...proposal, status: target, decidedAtTurn: turn, history }
        : { ...proposal, status: target, history },
  };
}

export function createProposal(
  input: NewProposal,
  rules: PolicyLevelRules,
  existingProposals: readonly Proposal[] = [],
): DomainResult<Proposal> {
  if (!input.id || !input.policyDefinitionId)
    return domainFailure(
      "ESTADO_INVALIDO",
      "A proposta precisa ter identidade e política definida.",
    );
  if (input.policyDefinitionId !== rules.policyDefinitionId)
    return domainFailure(
      "DEFINICAO_INVALIDA",
      "A proposta e as regras precisam apontar para a mesma política.",
    );
  const level = validatePolicyLevel(input.desiredLevel, rules);
  if (!level.ok) return level;
  if (!validTurn(input.createdAtTurn))
    return domainFailure("ESTADO_INVALIDO", "O turno de criação é inválido.");
  if (existingProposals.some((proposal) => proposal.id === input.id))
    return domainFailure(
      "ESTADO_INVALIDO",
      `Já existe uma proposta com o ID ${input.id}.`,
    );
  if (
    existingProposals.some(
      (proposal) =>
        proposal.policyDefinitionId === input.policyDefinitionId &&
        (proposal.status === "rascunho" ||
          proposal.status === "apresentada" ||
          proposal.status === "em_votacao"),
    )
  )
    return domainFailure(
      "CONFLITO_DE_PROPOSTA",
      `Já existe uma proposta aberta para a política ${input.policyDefinitionId}.`,
    );
  return {
    ok: true,
    value: {
      ...input,
      status: "rascunho",
      history: [{ status: "rascunho", turn: input.createdAtTurn }],
    },
  };
}

export function presentProposal(
  proposal: Proposal,
  turn: number,
  timing: ProposalTimingRules,
): DomainResult<Proposal> {
  if (
    !Number.isSafeInteger(timing.normalWaitTurns) ||
    timing.normalWaitTurns < 1 ||
    !Number.isSafeInteger(timing.maximumWaitTurns) ||
    timing.maximumWaitTurns < timing.normalWaitTurns ||
    timing.maximumWaitTurns > maximumProposalWaitTurns ||
    !validTurn(turn + timing.maximumWaitTurns)
  )
    return domainFailure(
      "DEFINICAO_INVALIDA",
      "Os prazos da proposta são inválidos.",
    );
  const presented = transition(proposal, "rascunho", "apresentada", turn);
  if (!presented.ok) return presented;
  return {
    ok: true,
    value: {
      ...presented.value,
      presentedAtTurn: turn,
      voteDueTurn: turn + timing.normalWaitTurns,
      voteDeadlineTurn: turn + timing.maximumWaitTurns,
    },
  };
}

/** SG058-B decides whether postponement is politically allowed; this records it once. */
export function postponeProposal(
  proposal: Proposal,
  turn: number,
  reason: string,
): DomainResult<Proposal> {
  if (
    proposal.status !== "apresentada" ||
    proposal.postponedAtTurn !== undefined ||
    proposal.voteDueTurn === undefined ||
    proposal.voteDeadlineTurn === undefined ||
    proposal.voteDueTurn >= proposal.voteDeadlineTurn
  )
    return domainFailure("ESTADO_INVALIDO", "A proposta não admite adiamento.");
  if (turn !== proposal.voteDueTurn)
    return domainFailure(
      "ESTADO_INVALIDO",
      "O adiamento só ocorre no fechamento previsto.",
    );
  if (!reason.trim())
    return domainFailure(
      "DECISAO_INVALIDA",
      "O adiamento exige motivo visível.",
    );
  return {
    ok: true,
    value: {
      ...proposal,
      postponedAtTurn: turn,
      voteDueTurn: proposal.voteDeadlineTurn,
      history: [...proposal.history, { status: "apresentada", turn, reason }],
    },
  };
}

export function openProposalVote(
  proposal: Proposal,
  turn: number,
): DomainResult<Proposal> {
  if (turn !== proposal.voteDueTurn || turn > (proposal.voteDeadlineTurn ?? -1))
    return domainFailure(
      "ESTADO_INVALIDO",
      "A proposta não está no turno de votação.",
    );
  return transition(proposal, "apresentada", "em_votacao", turn);
}

export function approveProposal(
  proposal: Proposal,
  turn: number,
): DomainResult<Proposal> {
  if (turn !== proposal.voteDueTurn)
    return domainFailure(
      "ESTADO_INVALIDO",
      "A votação precisa fechar no turno previsto.",
    );
  return transition(proposal, "em_votacao", "aprovada", turn);
}

export function rejectProposal(
  proposal: Proposal,
  turn: number,
): DomainResult<Proposal> {
  if (turn !== proposal.voteDueTurn)
    return domainFailure(
      "ESTADO_INVALIDO",
      "A votação precisa fechar no turno previsto.",
    );
  return transition(proposal, "em_votacao", "rejeitada", turn);
}

export function withdrawProposal(
  proposal: Proposal,
  turn: number,
): DomainResult<Proposal> {
  if (proposal.status !== "rascunho" && proposal.status !== "apresentada")
    return domainFailure(
      "ESTADO_INVALIDO",
      "Só uma proposta em rascunho ou apresentada pode ser retirada.",
    );
  return transition(proposal, proposal.status, "retirada", turn);
}
