import { expect, it } from "vitest";
import { createGame } from "../game/createGame";
import { validatePolicyAction } from "../game/validatePolicyAction";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

it("encaminha ajuste autorizado sem mutar a partida nem consumir acaso", () => {
  const loaded = loadDistributedScenario(
    "brasil-primeiro-cenario/cenario.json",
  );
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const created = createGame(
    "validacao",
    loaded.value.definition,
    loaded.value.graph,
    { randomSeed: 44 },
  );
  if (!created.ok) throw new Error(created.diagnostics[0]?.message);
  const policy = loaded.value.definition.policies.find(
    (item) => item.id === "atencao-basica",
  );
  if (!policy) throw new Error("política ausente");
  const before = structuredClone(created.value);
  expect(
    validatePolicyAction(created.value, policy, 3800, {
      policyDefinitionId: policy.id,
      unit: policy.controle.unidade,
      domain: { minimum: 0, maximum: 5000 },
    }),
  ).toEqual({
    ok: true,
    value: {
      route: "executiva",
      policyId: "atencao-basica",
      desiredLevel: 3800,
    },
  });
  expect(created.value).toEqual(before);
});

it("bloqueia requisito ausente e encaminha política não vigente para proposta", () => {
  const loaded = loadDistributedScenario(
    "brasil-primeiro-cenario/cenario.json",
  );
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const created = createGame(
    "validacao",
    loaded.value.definition,
    loaded.value.graph,
  );
  if (!created.ok) throw new Error(created.diagnostics[0]?.message);
  const policy = structuredClone(loaded.value.definition.policies[0]);
  policy.id = "nova-politica";
  expect(
    validatePolicyAction(
      created.value,
      policy,
      1,
      {
        policyDefinitionId: policy.id,
        unit: policy.controle.unidade,
        domain: { minimum: 0, maximum: 2 },
      },
      { requiredActivePolicyIds: ["ausente"] },
    ),
  ).toMatchObject({
    ok: false,
    diagnostics: [{ field: "authorization.requiredActivePolicyIds" }],
  });
  expect(
    validatePolicyAction(created.value, policy, 1, {
      policyDefinitionId: policy.id,
      unit: policy.controle.unidade,
      domain: { minimum: 0, maximum: 2 },
    }),
  ).toMatchObject({ ok: true, value: { route: "proposta" } });
});
