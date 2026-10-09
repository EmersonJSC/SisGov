import { expect, it } from "vitest";
import { createGame } from "../game/createGame";
import { preparePolicyFiscalFlows } from "../game/preparePolicyFiscalFlows";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

function brasil() {
  const loaded = loadDistributedScenario("paises/brasil/pais.json");
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  return loaded.value;
}

it("converte os custos anuais declarados pelas políticas em despesa mensal", () => {
  const loaded = brasil();
  const game = createGame("partida-fiscal", loaded.definition, loaded.graph);
  if (!game.ok) throw new Error(game.diagnostics[0]?.message);
  const result = preparePolicyFiscalFlows(
    loaded.definition,
    game.value.policies,
  );
  expect(result).toMatchObject({ ok: true });
  if (!result.ok) return;
  expect(result.value.flows).toHaveLength(5);
  const lawExpense = result.value.flows.reduce(
    (sum, flow) => sum + flow.amount,
    0,
  );
  expect(lawExpense).toBeCloseTo(470);
  // SG136: o mês soma leis e agregados da ficha do país.
  expect(result.value.aggregates).toHaveLength(6);
  expect(result.value.month.revenue).toBeCloseTo(2200000 / 12);
  expect(result.value.month.primaryExpense).toBeCloseTo(2250000 / 12);
});

it("acompanha a implantação durante a revogação gradual", () => {
  const loaded = brasil();
  const game = createGame("partida-parcial", loaded.definition, loaded.graph);
  if (!game.ok) throw new Error(game.diagnostics[0]?.message);
  const policies = game.value.policies.map((policy) =>
    policy.policyDefinitionId === "atencao-basica"
      ? {
          ...policy,
          status: "em_revogacao" as const,
          legalStatus: "revogada" as const,
          implementedLevel: 2000,
        }
      : policy,
  );
  const result = preparePolicyFiscalFlows(loaded.definition, policies);
  expect(result).toMatchObject({ ok: true });
  if (!result.ok) return;
  expect(
    result.value.flows.find(
      (flow) => flow.policyDefinitionId === "atencao-basica",
    ),
  ).toMatchObject({ nature: "primaryExpense", amount: 166.66666666666666 });
  expect(
    result.value.flows.reduce((sum, flow) => sum + flow.amount, 0),
  ).toBeCloseTo(303.3333333333333);
});
