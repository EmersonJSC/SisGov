import { expect, it } from "vitest";
import { validatePackageCoherence } from "../engine";
import { createGame } from "../game/createGame";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

function brasil() {
  const loaded = loadDistributedScenario(
    "brasil-primeiro-cenario/cenario.json",
  );
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  return loaded.value;
}

it("creates independent games from the same country without advancing simulation", () => {
  const loaded = brasil();
  const first = createGame("partida-a", loaded.definition, loaded.graph);
  const second = createGame("partida-b", loaded.definition, loaded.graph);
  if (!first.ok) throw new Error(first.diagnostics[0]?.message);
  if (!second.ok) throw new Error(second.diagnostics[0]?.message);

  expect(first.value).toMatchObject({
    currentTurn: 0,
    proposals: [],
    scenario: { id: "brasil-primeiro-cenario" },
    execution: { step: 0 },
  });
  expect(first.value.policies).toHaveLength(5);
  expect(
    first.value.policies.find(
      (policy) => policy.policyDefinitionId === "atencao-basica",
    ),
  ).toMatchObject({
    policyDefinitionId: "atencao-basica",
    origin: { kind: "herdada", scenarioId: "brasil-primeiro-cenario" },
  });

  first.value.execution.values.recursos_atencao_basica = 999;
  expect(second.value.execution.values.recursos_atencao_basica).toBe(4000);
  expect(loaded.definition.initialState.valores.recursos_atencao_basica).toBe(
    4000,
  );
  expect(first.value.execution).not.toBe(second.value.execution);
  expect(first.value.policies).not.toBe(second.value.policies);
  expect(first.value.scenario.contentIdentity).toBe(
    second.value.scenario.contentIdentity,
  );
});

it("rejects an empty game identity with an initial-state diagnostic", () => {
  const loaded = brasil();
  expect(createGame("", loaded.definition, loaded.graph)).toMatchObject({
    ok: false,
    diagnostics: [
      {
        file: "brasil-primeiro-cenario/estado-inicial.json",
        field: "id",
      },
    ],
  });
});

it("changes identity when country content changes", () => {
  const loaded = brasil();
  const changed = structuredClone(loaded.definition);
  if (!changed.organizacaoPolitica)
    throw new Error("A organização política é obrigatória neste cenário.");
  changed.organizacaoPolitica.formaInicial = "forma-alterada-para-teste";
  const original = createGame(
    "partida-original",
    loaded.definition,
    loaded.graph,
  );
  const altered = createGame("partida-alterada", changed, loaded.graph);
  if (!original.ok) throw new Error(original.diagnostics[0]?.message);
  if (!altered.ok) throw new Error(altered.diagnostics[0]?.message);
  expect(original.value.scenario.contentIdentity).not.toBe(
    altered.value.scenario.contentIdentity,
  );
});

it("reports invalid inherited policies before a game is created", () => {
  const loaded = brasil();
  const content = structuredClone(loaded.definition);
  content.initialState.politicasVigentes = [
    {
      politica: "politica-ausente",
      nivelDesejado: 1,
      nivelImplantado: 1,
    },
    {
      politica: "atencao-basica",
      nivelDesejado: 999999,
      nivelImplantado: 999999,
    },
    {
      politica: "atencao-basica",
      nivelDesejado: 4000,
      nivelImplantado: 4000,
    },
  ];
  const result = validatePackageCoherence(content);
  expect(result.ok).toBe(false);
  if (!result.ok)
    expect(result.diagnostics).toMatchObject([
      {
        file: "brasil-primeiro-cenario/estado-inicial.json",
        field: "politicasVigentes.0.politica",
      },
      {
        file: "brasil-primeiro-cenario/estado-inicial.json",
        field: "politicasVigentes.1",
      },
      {
        file: "brasil-primeiro-cenario/estado-inicial.json",
        field: "politicasVigentes.2.politica",
      },
    ]);
});
