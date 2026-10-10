import { expect, it } from "vitest";
import { createGame } from "../game/createGame";
import { validatePolicyAction } from "../game/validatePolicyAction";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

function setup(randomSeed?: number) {
  const loaded = loadDistributedScenario("testes/legado/brasil/pais.json");
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const created = createGame(
    "validacao",
    loaded.value.definition,
    loaded.value.graph,
    randomSeed === undefined ? {} : { randomSeed },
  );
  if (!created.ok) throw new Error(created.diagnostics[0]?.message);
  return { content: loaded.value.definition, game: created.value };
}

it("encaminha ajuste autorizado sem mutar a partida nem consumir acaso", () => {
  const { content, game } = setup(44);
  const before = structuredClone(game);
  expect(validatePolicyAction(game, content, "atencao-basica", 3800)).toEqual({
    ok: true,
    value: {
      route: "executiva",
      policyId: "atencao-basica",
      desiredLevel: 3800,
    },
  });
  expect(game).toEqual(before);
});

it("usa o domínio do JSON: atenção básica abaixo de 2400 é recusada", () => {
  const { content, game } = setup();
  expect(
    validatePolicyAction(game, content, "atencao-basica", 2000),
  ).toMatchObject({ ok: false, diagnostics: [{ field: "desiredLevel" }] });
  expect(
    validatePolicyAction(game, content, "atencao-basica", 6000),
  ).toMatchObject({ ok: true });
});

it("bloqueia requisito ausente e encaminha política não vigente para proposta", () => {
  const { content: original, game } = setup();
  const content = structuredClone(original);
  const policy = structuredClone(original.policies[0]);
  policy.id = "nova-politica";
  content.policies = [...content.policies, policy];
  expect(
    validatePolicyAction(game, content, "nova-politica", 1, {
      requiredActivePolicyIds: ["ausente"],
    }),
  ).toMatchObject({
    ok: false,
    diagnostics: [{ field: "authorization.requiredActivePolicyIds" }],
  });
  expect(validatePolicyAction(game, content, "nova-politica", 1)).toMatchObject(
    { ok: true, value: { route: "proposta" } },
  );
});

it("recusa política fora do conteúdo", () => {
  const { content, game } = setup();
  expect(validatePolicyAction(game, content, "inexistente", 1)).toMatchObject({
    ok: false,
    diagnostics: [{ field: "politica" }],
  });
});
