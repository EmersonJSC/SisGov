import { describe, expect, it } from "vitest";
import { calculateAffineContribution } from "../engine";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

function relation() {
  const loaded = loadDistributedScenario("exemplo/cenario.json");
  if (!loaded.ok) throw new Error("O pacote de exemplo deveria carregar.");
  return loaded.value.graph.relations[0];
}

describe("calculateAffineContribution", () => {
  it.each([
    [20, 0.4],
    [-10, -0.2],
    [0, 0],
  ])("calcula a contribuição para origem %s", (sourceValue, expected) => {
    expect(calculateAffineContribution(relation(), sourceValue)).toMatchObject({
      ok: true,
      value: { sourceValue, coefficient: 0.02, constant: 0, value: expected },
    });
  });
});
