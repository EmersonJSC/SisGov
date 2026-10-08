import { expect, it } from "vitest";
import {
  approveProposal,
  beginPolicyRevocation,
  changePolicyTarget,
  createInheritedPolicyState,
  createPolicyStateFromApproval,
  createProposal,
  openProposalVote,
  postponeProposal,
  presentProposal,
  rejectProposal,
  updateImplementedLevel,
  withdrawProposal,
  type PolicyLevelRules,
  type Proposal,
  type ProposalTimingRules,
} from "../domain/game";

const timing: ProposalTimingRules = { normalWaitTurns: 1, maximumWaitTurns: 2 };

const rules: PolicyLevelRules = {
  policyDefinitionId: "atencao-basica",
  unit: "moeda_milhoes_2024_ano",
  domain: { minimum: 0, maximum: 10000 },
};

function proposal(id = "proposta-saude-1", desiredLevel = 5000) {
  const created = createProposal(
    {
      id,
      policyDefinitionId: "atencao-basica",
      desiredLevel,
      createdAtTurn: 3,
    },
    rules,
  );
  if (!created.ok) throw new Error(created.error.message);
  return created.value;
}

function approve(value: Proposal) {
  const presented = presentProposal(value, 3, timing);
  if (!presented.ok) throw new Error(presented.error.message);
  const voting = openProposalVote(presented.value, 4);
  if (!voting.ok) throw new Error(voting.error.message);
  const approved = approveProposal(voting.value, 4);
  if (!approved.ok) throw new Error(approved.error.message);
  return approved.value;
}

function enterVote(value: Proposal) {
  const presented = presentProposal(value, 3, timing);
  if (!presented.ok) throw new Error(presented.error.message);
  const voting = openProposalVote(presented.value, 4);
  if (!voting.ok) throw new Error(voting.error.message);
  return voting.value;
}

it("records a proposal's authorization lifecycle", () => {
  const created = proposal();
  const presented = presentProposal(created, 3, timing);
  if (!presented.ok) throw new Error(presented.error.message);
  const voting = openProposalVote(presented.value, 4);
  if (!voting.ok) throw new Error(voting.error.message);
  const approved = approveProposal(voting.value, 4);
  if (!approved.ok) throw new Error(approved.error.message);

  expect(approved.value).toMatchObject({
    status: "aprovada",
    decidedAtTurn: 4,
    history: [
      { status: "rascunho", turn: 3 },
      { status: "apresentada", turn: 3 },
      { status: "em_votacao", turn: 4 },
      { status: "aprovada", turn: 4 },
    ],
  });
});

it("rejects invalid transitions and a decision dated before the last transition", () => {
  expect(rejectProposal(proposal(), 4)).toMatchObject({
    ok: false,
    error: { code: "ESTADO_INVALIDO" },
  });
  const presented = presentProposal(proposal(), 5, timing);
  if (!presented.ok) throw new Error(presented.error.message);
  expect(openProposalVote(presented.value, 4)).toMatchObject({
    ok: false,
    error: { code: "ESTADO_INVALIDO" },
  });
});

it("uses configured voting deadlines and permits one explained postponement", () => {
  const presented = presentProposal(proposal(), 3, timing);
  if (!presented.ok) throw new Error(presented.error.message);
  expect(presented.value).toMatchObject({
    presentedAtTurn: 3,
    voteDueTurn: 4,
    voteDeadlineTurn: 5,
  });
  expect(openProposalVote(presented.value, 3).ok).toBe(false);
  expect(postponeProposal(presented.value, 4, " ").ok).toBe(false);
  const postponed = postponeProposal(presented.value, 4, "Falta parecer");
  if (!postponed.ok) throw new Error(postponed.error.message);
  expect(postponed.value).toMatchObject({ voteDueTurn: 5, postponedAtTurn: 4 });
  expect(postponed.value.history.at(-1)).toEqual({
    status: "apresentada",
    turn: 4,
    reason: "Falta parecer",
  });
  expect(postponeProposal(postponed.value, 5, "Mais prazo").ok).toBe(false);
  expect(openProposalVote(postponed.value, 4).ok).toBe(false);
  expect(openProposalVote(postponed.value, 6).ok).toBe(false);
  const voting = openProposalVote(postponed.value, 5);
  if (!voting.ok) throw new Error(voting.error.message);
  expect(approveProposal(voting.value, 6).ok).toBe(false);
  expect(rejectProposal(voting.value, 5).ok).toBe(true);
});

it("does not permit postponement when the configured maximum equals the normal deadline", () => {
  const presented = presentProposal(proposal(), 3, {
    normalWaitTurns: 1,
    maximumWaitTurns: 1,
  });
  if (!presented.ok) throw new Error(presented.error.message);
  expect(postponeProposal(presented.value, 4, "Pedido").ok).toBe(false);
  expect(openProposalVote(presented.value, 4).ok).toBe(true);
  expect(
    presentProposal(proposal(), 3, {
      normalWaitTurns: 2,
      maximumWaitTurns: 1,
    }).ok,
  ).toBe(false);
  expect(
    presentProposal(proposal(), 3, {
      normalWaitTurns: 1,
      maximumWaitTurns: 3,
    }),
  ).toMatchObject({ ok: false, error: { code: "DEFINICAO_INVALIDA" } });
});

it("validates desired levels against a policy domain or explicit options", () => {
  expect(
    createProposal(
      {
        id: "fora-do-dominio",
        policyDefinitionId: rules.policyDefinitionId,
        desiredLevel: 10001,
        createdAtTurn: 1,
      },
      rules,
    ),
  ).toMatchObject({ ok: false, error: { code: "NIVEL_INVALIDO" } });

  const discreteRules: PolicyLevelRules = {
    ...rules,
    domain: {},
    options: [0, 1],
  };
  expect(
    createProposal(
      {
        id: "opcao-invalida",
        policyDefinitionId: rules.policyDefinitionId,
        desiredLevel: 0.5,
        createdAtTurn: 1,
      },
      discreteRules,
    ),
  ).toMatchObject({ ok: false, error: { code: "NIVEL_INVALIDO" } });
});

it("permits gradual execution between legal options without authorizing an intermediate choice", () => {
  const discrete: PolicyLevelRules = {
    ...rules,
    domain: { minimum: 0, maximum: 1 },
    options: [0, 1],
  };
  const inherited = createInheritedPolicyState(
    {
      id: "lei-binaria",
      policyDefinitionId: discrete.policyDefinitionId,
      desiredLevel: 1,
      implementedLevel: 0.25,
      scenarioId: "brasil",
      inheritedAtTurn: 0,
    },
    discrete,
  );
  expect(inherited).toMatchObject({
    ok: true,
    value: { desiredLevel: 1, implementedLevel: 0.25 },
  });
  if (!inherited.ok) return;
  expect(
    updateImplementedLevel(inherited.value, 0.5, 1, discrete),
  ).toMatchObject({
    ok: true,
    value: { implementedLevel: 0.5 },
  });
  expect(changePolicyTarget(inherited.value, 0.5, 1, discrete)).toMatchObject({
    ok: false,
    error: { code: "NIVEL_INVALIDO" },
  });
  expect(
    updateImplementedLevel(inherited.value, 1.5, 1, discrete),
  ).toMatchObject({
    ok: false,
    error: { code: "NIVEL_INVALIDO" },
  });
});

it("allows only one open proposal per policy and preserves terminal history", () => {
  const open = proposal();
  expect(
    createProposal(
      {
        id: "proposta-concorrente",
        policyDefinitionId: rules.policyDefinitionId,
        desiredLevel: 4000,
        createdAtTurn: 4,
      },
      rules,
      [open],
    ),
  ).toMatchObject({ ok: false, error: { code: "CONFLITO_DE_PROPOSTA" } });

  const rejected = rejectProposal(enterVote(open), 4);
  if (!rejected.ok) throw new Error(rejected.error.message);
  expect(
    createProposal(
      {
        id: "proposta-posterior",
        policyDefinitionId: rules.policyDefinitionId,
        desiredLevel: 4000,
        createdAtTurn: 5,
      },
      rules,
      [rejected.value],
    ).ok,
  ).toBe(true);
});

it("does not create a policy state from a rejected proposal", () => {
  const rejected = rejectProposal(enterVote(proposal()), 4);
  if (!rejected.ok) throw new Error(rejected.error.message);

  expect(
    createPolicyStateFromApproval(
      "politica-vigente-1",
      rejected.value,
      rules,
      0,
    ),
  ).toMatchObject({ ok: false, error: { code: "DECISAO_INVALIDA" } });
});

it("creates an inherited policy without inventing a proposal", () => {
  const inherited = createInheritedPolicyState(
    {
      id: "politica-vigente-atencao-basica",
      policyDefinitionId: rules.policyDefinitionId,
      desiredLevel: 6000,
      implementedLevel: 5000,
      scenarioId: "brasil-primeiro-cenario",
      inheritedAtTurn: 0,
    },
    rules,
  );
  if (!inherited.ok) throw new Error(inherited.error.message);

  expect(inherited.value).toMatchObject({
    status: "vigente",
    legalStatus: "vigente",
    desiredLevel: 6000,
    implementedLevel: 5000,
    origin: { kind: "herdada", scenarioId: "brasil-primeiro-cenario" },
    history: [{ kind: "herdada", turn: 0 }],
  });
});

it("creates an authorized policy only from an approved proposal and tracks its origin", () => {
  const approved = approve(proposal());
  const policy = createPolicyStateFromApproval(
    "politica-vigente-1",
    approved,
    rules,
    0,
  );
  if (!policy.ok) throw new Error(policy.error.message);

  expect(policy.value).toMatchObject({
    id: "politica-vigente-1",
    status: "vigente",
    legalStatus: "vigente",
    desiredLevel: 5000,
    implementedLevel: 0,
    origin: { kind: "aprovada", proposalId: "proposta-saude-1", turn: 4 },
  });
});

it("keeps desired and implemented levels separate and records changes", () => {
  const created = createInheritedPolicyState(
    {
      id: "politica-vigente-1",
      policyDefinitionId: rules.policyDefinitionId,
      desiredLevel: 5000,
      implementedLevel: 3000,
      scenarioId: "brasil-primeiro-cenario",
      inheritedAtTurn: 0,
    },
    rules,
  );
  if (!created.ok) throw new Error(created.error.message);
  const target = changePolicyTarget(created.value, 7000, 1, rules);
  if (!target.ok) throw new Error(target.error.message);
  const implementation = updateImplementedLevel(target.value, 4000, 1, rules);
  if (!implementation.ok) throw new Error(implementation.error.message);

  expect(implementation.value).toMatchObject({
    desiredLevel: 7000,
    implementedLevel: 4000,
    history: [
      { kind: "herdada", turn: 0 },
      {
        kind: "meta_alterada",
        turn: 1,
        desiredLevel: 7000,
        implementedLevel: 3000,
      },
      {
        kind: "implantacao_atualizada",
        turn: 1,
        desiredLevel: 7000,
        implementedLevel: 4000,
      },
    ],
  });
});

it("rejects implementation that overshoots the current goal", () => {
  const inherited = createInheritedPolicyState(
    {
      id: "politica-vigente-1",
      policyDefinitionId: rules.policyDefinitionId,
      desiredLevel: 5000,
      implementedLevel: 3000,
      scenarioId: "brasil-primeiro-cenario",
      inheritedAtTurn: 0,
    },
    rules,
  );
  if (!inherited.ok) throw new Error(inherited.error.message);

  expect(updateImplementedLevel(inherited.value, 6000, 1, rules)).toMatchObject(
    {
      ok: false,
      error: { code: "NIVEL_INVALIDO" },
    },
  );
});

it("revokes gradually and closes only when implementation reaches zero", () => {
  const inherited = createInheritedPolicyState(
    {
      id: "politica-vigente-1",
      policyDefinitionId: rules.policyDefinitionId,
      desiredLevel: 5000,
      implementedLevel: 3000,
      scenarioId: "brasil-primeiro-cenario",
      inheritedAtTurn: 0,
    },
    rules,
  );
  if (!inherited.ok) throw new Error(inherited.error.message);
  const revoking = beginPolicyRevocation(inherited.value, 1, rules);
  if (!revoking.ok) throw new Error(revoking.error.message);
  const closed = updateImplementedLevel(revoking.value, 0, 2, rules);
  if (!closed.ok) throw new Error(closed.error.message);

  expect(revoking.value).toMatchObject({
    status: "em_revogacao",
    legalStatus: "revogada",
    desiredLevel: 0,
    implementedLevel: 3000,
  });
  expect(closed.value).toMatchObject({
    status: "encerrada",
    legalStatus: "revogada",
    implementedLevel: 0,
  });
  expect(revoking.value.history.at(-1)).toMatchObject({
    kind: "revogacao_iniciada",
    legalStatus: "revogada",
    implementedLevel: 3000,
  });
  expect(updateImplementedLevel(closed.value, 100, 3, rules)).toMatchObject({
    ok: false,
    error: { code: "ESTADO_INVALIDO" },
  });
});

it("loads a country already revoking a law without treating it as legally active", () => {
  const inherited = createInheritedPolicyState(
    {
      id: "lei-em-revogacao",
      policyDefinitionId: rules.policyDefinitionId,
      desiredLevel: 0,
      implementedLevel: 100,
      status: "em_revogacao",
      scenarioId: "pais-a",
      inheritedAtTurn: 0,
    },
    rules,
  );
  expect(inherited).toMatchObject({
    ok: true,
    value: {
      status: "em_revogacao",
      legalStatus: "revogada",
      implementedLevel: 100,
    },
  });
  if (!inherited.ok) return;
  expect(changePolicyTarget(inherited.value, 500, 1, rules)).toMatchObject({
    ok: false,
    error: { code: "ESTADO_INVALIDO" },
  });
});

it("finishes asymptotic revocation at a threshold declared by the law", () => {
  const revocationRules: PolicyLevelRules = {
    ...rules,
    domain: { minimum: 0, maximum: 1 },
    options: [0, 1],
    revocationEpsilon: 0.01,
  };
  const inherited = createInheritedPolicyState(
    {
      id: "lei-assintotica",
      policyDefinitionId: revocationRules.policyDefinitionId,
      desiredLevel: 1,
      implementedLevel: 1,
      scenarioId: "pais-a",
      inheritedAtTurn: 0,
    },
    revocationRules,
  );
  if (!inherited.ok) throw new Error(inherited.error.message);
  const revoking = beginPolicyRevocation(inherited.value, 1, revocationRules);
  if (!revoking.ok) throw new Error(revoking.error.message);
  expect(
    updateImplementedLevel(revoking.value, 0.005, 2, revocationRules),
  ).toMatchObject({
    ok: true,
    value: {
      status: "encerrada",
      legalStatus: "revogada",
      implementedLevel: 0,
    },
  });
  expect(
    beginPolicyRevocation(inherited.value, 1, {
      ...revocationRules,
      revocationEpsilon: -1,
    }),
  ).toMatchObject({ ok: false, error: { code: "DEFINICAO_INVALIDA" } });
});

it("lets the execution flow choose gradual revocation steps", () => {
  const revocationRules: PolicyLevelRules = {
    ...rules,
    domain: { minimum: 0, maximum: 1 },
    options: [0, 1],
    revocationEpsilon: 0.01,
  };
  const inherited = createInheritedPolicyState(
    {
      id: "lei-com-revogacao-gradual",
      policyDefinitionId: rules.policyDefinitionId,
      desiredLevel: 1,
      implementedLevel: 1,
      scenarioId: "pais-a",
      inheritedAtTurn: 0,
    },
    revocationRules,
  );
  if (!inherited.ok) throw new Error(inherited.error.message);
  const revoking = beginPolicyRevocation(inherited.value, 1, revocationRules);
  if (!revoking.ok) throw new Error(revoking.error.message);
  const firstStep = updateImplementedLevel(
    revoking.value,
    0.75,
    2,
    revocationRules,
  );
  if (!firstStep.ok) throw new Error(firstStep.error.message);

  expect(firstStep.value).toMatchObject({
    status: "em_revogacao",
    implementedLevel: 0.75,
  });
  expect(
    updateImplementedLevel(firstStep.value, 0.25, 3, revocationRules),
  ).toMatchObject({ ok: true, value: { implementedLevel: 0.25 } });
});

it("permits withdrawal only before voting and records the transition", () => {
  const withdrawn = withdrawProposal(proposal(), 3);
  if (!withdrawn.ok) throw new Error(withdrawn.error.message);
  expect(withdrawn.value.history.at(-1)).toEqual({
    status: "retirada",
    turn: 3,
  });

  const active = approve(proposal());
  expect(withdrawProposal(active, 5)).toMatchObject({
    ok: false,
    error: { code: "ESTADO_INVALIDO" },
  });
});
