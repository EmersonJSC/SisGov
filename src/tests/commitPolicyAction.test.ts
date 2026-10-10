import { expect, it } from "vitest";
import { commitPolicyAction } from "../game/commitPolicyAction";
import { createGame } from "../game/createGame";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

function setup() {
  const loaded = loadDistributedScenario("testes/legado/brasil/pais.json");
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  const game = createGame("acoes", loaded.value.definition, loaded.value.graph);
  if (!game.ok) throw new Error(game.diagnostics[0]?.message);
  return { content: loaded.value.definition, game: game.value };
}

it("confirma ajuste executivo após a validação, sem criar proposta", () => {
  const { content, game } = setup();
  const result = commitPolicyAction(game, content, {
    id: "ajuste-aps",
    policyId: "atencao-basica",
    desiredLevel: 3800,
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
  const { content: original, game } = setup();
  const content = structuredClone(original);
  content.policies = [
    ...content.policies,
    {
      ...structuredClone(original.policies[0]),
      id: "lei-nova",
      processoAutorizacao: "voto-senado",
    },
  ];
  const result = commitPolicyAction(game, content, {
    id: "proposta-lei-nova",
    policyId: "lei-nova",
    desiredLevel: 1,
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
