import { expect, it } from "vitest";
import { advanceExecution, buildGraph, createExecution } from "../engine";
import {
  beginPolicyRevocation,
  createInheritedPolicyState,
  updateImplementedLevel,
} from "../domain/game";
import { preparePolicyExecution } from "../game/preparePolicyExecution";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

it("keeps a fixed-duration effect after legal revocation and zero implementation", () => {
  const loaded = loadDistributedScenario("exemplo/cenario.json");
  if (!loaded.ok) throw new Error("O cenário de teste deveria carregar.");
  const content = {
    ...loaded.value.definition,
    consequences: loaded.value.definition.consequences.map((consequence) => ({
      ...consequence,
      parametros: { coeficiente: 0, termoConstante: 5 },
      duracao: { modo: "fixo" as const, passos: 3 },
    })),
  };
  const graph = buildGraph(content);
  const rules = {
    policyDefinitionId: "material-escolar",
    unit: "moeda",
    domain: { minimum: 0, maximum: 100 },
  };
  const created = createInheritedPolicyState(
    {
      id: "estado-material-escolar",
      policyDefinitionId: "material-escolar",
      desiredLevel: 20,
      implementedLevel: 20,
      scenarioId: "exemplo",
      inheritedAtTurn: 0,
    },
    rules,
  );
  if (!created.ok) throw new Error(created.error.message);
  const firstBatch = preparePolicyExecution(content, graph, [created.value]);
  if (!firstBatch.ok) throw new Error("O lote inicial deveria ser válido.");
  expect(firstBatch.value.activeRelationIds).toHaveLength(1);
  const first = advanceExecution(
    content,
    graph,
    createExecution(content, graph),
    firstBatch.value,
  );
  if (!first.ok) throw new Error("O primeiro passo deveria funcionar.");
  const revoking = beginPolicyRevocation(created.value, 1, rules);
  if (!revoking.ok) throw new Error(revoking.error.message);
  const ended = updateImplementedLevel(revoking.value, 0, 2, rules);
  if (!ended.ok) throw new Error(ended.error.message);
  const secondBatch = preparePolicyExecution(content, graph, [ended.value]);
  if (!secondBatch.ok)
    throw new Error("O lote após revogação deveria ser válido.");
  expect(secondBatch.value.activeRelationIds).toEqual([]);
  expect(secondBatch.value.controlCommands[0].value).toBe(0);
  const second = advanceExecution(
    content,
    graph,
    first.value.execution,
    secondBatch.value,
  );
  if (!second.ok) throw new Error("O efeito remanescente deveria continuar.");
  expect(ended.value).toMatchObject({
    legalStatus: "revogada",
    implementedLevel: 0,
  });
  expect(second.value.execution.relationMemory.fixedRemaining).toEqual(
    expect.objectContaining({ [graph.relations[0].id]: 1 }),
  );
  expect(second.value.explanations[0].contributions[0].contribution).toBe(5);
});
