import { expect, it } from "vitest";
import { commitPolicyAction } from "../game/commitPolicyAction";
import { createGame } from "../game/createGame";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

it("confirma ajuste executivo após a validação, sem criar proposta", () => {
  const loaded = loadDistributedScenario(
    "brasil-primeiro-cenario/cenario.json",
  );
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const game = createGame("acoes", loaded.value.definition, loaded.value.graph);
  if (!game.ok) throw new Error(game.diagnostics[0]?.message);
  const policy = loaded.value.definition.policies.find(
    (item) => item.id === "atencao-basica",
  );
  if (!policy) throw new Error("política ausente");
  const result = commitPolicyAction(game.value, {
    id: "ajuste-aps",
    policy,
    desiredLevel: 3800,
    rules: {
      policyDefinitionId: policy.id,
      unit: policy.controle.unidade,
      domain: { minimum: 0, maximum: 5000 },
    },
  });
  expect(result).toMatchObject({
    ok: true,
    value: {
      proposals: [],
      policies: expect.arrayContaining([
        expect.objectContaining({
          policyDefinitionId: "atencao-basica",
          desiredLevel: 3800,
        }),
      ]),
    },
  });
});

it("cria proposta para política sem autorização executiva corrente", () => {
  const loaded = loadDistributedScenario(
    "brasil-primeiro-cenario/cenario.json",
  );
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const game = createGame("acoes", loaded.value.definition, loaded.value.graph);
  if (!game.ok) throw new Error(game.diagnostics[0]?.message);
  const policy = {
    ...loaded.value.definition.policies[0],
    id: "lei-nova",
    processoAutorizacao: "voto-senado",
  };
  const result = commitPolicyAction(game.value, {
    id: "proposta-lei-nova",
    policy,
    desiredLevel: 1,
    rules: {
      policyDefinitionId: policy.id,
      unit: policy.controle.unidade,
      domain: { minimum: 0, maximum: 2 },
    },
  });
  expect(result).toMatchObject({
    ok: true,
    value: {
      proposals: [
        expect.objectContaining({
          id: "proposta-lei-nova",
          status: "rascunho",
        }),
      ],
    },
  });
});
