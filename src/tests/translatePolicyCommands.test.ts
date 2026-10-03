import { describe, expect, it } from "vitest";
import { translateAuthorizedPolicies } from "../engine";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

function exampleScenario() {
  const loaded = loadDistributedScenario("exemplo/cenario.json");
  if (!loaded.ok) throw new Error("O pacote de exemplo deveria carregar.");
  return loaded.value;
}

describe("translateAuthorizedPolicies", () => {
  it("traduz uma política autorizada em controle e relação ativa", () => {
    const scenario = exampleScenario();

    expect(
      translateAuthorizedPolicies(scenario.definition, scenario.graph, [
        { policyId: "material-escolar", intensity: 20 },
      ]),
    ).toEqual({
      ok: true,
      value: {
        controlCommands: [
          {
            controlId: "verba_educacao",
            value: 20,
            policyId: "material-escolar",
          },
        ],
        activeRelationIds: ["material-escolar:0:melhora-educacao"],
      },
    });
  });

  it("não ativa relação de política que não entrou no lote", () => {
    const scenario = exampleScenario();

    expect(
      translateAuthorizedPolicies(scenario.definition, scenario.graph, []),
    ).toEqual({
      ok: true,
      value: { controlCommands: [], activeRelationIds: [] },
    });
  });

  it("recusa duas mudanças para o mesmo controle", () => {
    const scenario = exampleScenario();
    const result = translateAuthorizedPolicies(
      scenario.definition,
      scenario.graph,
      [
        { policyId: "material-escolar", intensity: 10 },
        { policyId: "material-escolar", intensity: 20 },
      ],
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.diagnostics).toContainEqual(
        expect.objectContaining({
          code: "COMANDO_INVALIDO",
          field: "politicas[1].policyId",
        }),
      );
    }
  });

  it("recusa política sem variável de controle em vez de ignorá-la", () => {
    const scenario = exampleScenario();
    scenario.definition.policies[0].controle.variavel = "controle-inexistente";

    expect(
      translateAuthorizedPolicies(scenario.definition, scenario.graph, [
        { policyId: "material-escolar", intensity: 20 },
      ]),
    ).toMatchObject({
      ok: false,
      diagnostics: [
        {
          code: "COMANDO_INVALIDO",
          field: "politicas[0].controle.variavel",
        },
      ],
    });
  });
});
