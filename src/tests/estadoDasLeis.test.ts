// Estado das leis na partida: herdada, meta, implantação e revogação.
import { expect, it } from "vitest";
import {
  beginPolicyRevocation,
  changePolicyTarget,
  createInheritedPolicyState,
  updateImplementedLevel,
  validatePolicyLevel,
  type PolicyLevelRules,
} from "../game/leis";

const rules: PolicyLevelRules = {
  policyDefinitionId: "atencao-basica",
  unit: "moeda_milhoes_2024_ano",
  domain: { minimum: 0, maximum: 10000 },
};

it("validates desired levels against a policy domain or explicit options", () => {
  expect(validatePolicyLevel(10001, rules)).toMatchObject({
    ok: false,
    error: { code: "NIVEL_INVALIDO" },
  });
  const discreteRules: PolicyLevelRules = {
    ...rules,
    domain: {},
    options: [0, 1],
  };
  expect(validatePolicyLevel(0.5, discreteRules)).toMatchObject({
    ok: false,
    error: { code: "NIVEL_INVALIDO" },
  });
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
