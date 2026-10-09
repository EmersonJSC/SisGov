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
  expect(first.value.electoralLaws).toEqual([
    expect.objectContaining({
      lawDefinitionId: "eleicao-presidencial-pluralidade-nacional",
      electionId: "presidencial",
      mechanism: "pluralidade_nacional",
      parameters: { turnos: 1 },
    }),
    expect.objectContaining({
      lawDefinitionId: "eleicao-senatorial-maiores-quotientes",
      electionId: "senatorial",
      mechanism: "maiores_quotientes_por_unidade",
      parameters: { desempate: "d20" },
    }),
  ]);
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

it("rejects missing and overlapping inherited electoral laws", () => {
  const loaded = brasil();
  const missing = structuredClone(loaded.definition);
  missing.initialState.leisEleitoraisVigentes = ["lei-ausente"];
  expect(createGame("partida-sem-lei", missing, loaded.graph)).toMatchObject({
    ok: false,
    diagnostics: [{ field: "leisEleitoraisVigentes.0" }],
  });

  const overlapping = structuredClone(loaded.definition);
  if (!overlapping.policyCatalog)
    throw new Error("Catálogo eleitoral é obrigatório neste cenário.");
  overlapping.policyCatalog.leisEleitorais = [
    ...(overlapping.policyCatalog.leisEleitorais ?? []),
    {
      id: "presidencial-concorrente",
      nome: "Regra presidencial concorrente",
      ambito: "constitucional",
      eleicao: "presidencial",
      instituicao: "presidencia",
      alcance: "nacional",
      mecanismo: "pluralidade_nacional",
      parametros: { turnos: 1 },
    },
  ];
  overlapping.initialState.leisEleitoraisVigentes = [
    "eleicao-presidencial-pluralidade-nacional",
    "presidencial-concorrente",
  ];
  expect(validatePackageCoherence(overlapping)).toMatchObject({ ok: false });
  expect(
    createGame("partida-conflito", overlapping, loaded.graph),
  ).toMatchObject({
    ok: false,
    diagnostics: [{ field: "leisEleitoraisVigentes.1" }],
  });
});

it("copies fiscal state declared by a country without treating it as an engine constant", () => {
  const loaded = brasil();
  const content = structuredClone(loaded.definition);
  content.initialState.fiscal = {
    periodoInicial: "2026-01",
    referenciaPrecos: "preços constantes de teste",
    unidadeMonetaria: "créditos de teste",
    origem: { tipo: "hipotese", descricao: "Teste de integração." },
    caixa: 10,
    dividaTotal: 100,
    jurosHerdadosMensais: 5,
    taxaJurosDividaNovaMensal: 0.01,
    credito: {
      principalPendente: 100,
      principalPerformante: 80,
      principalInadimplente: 20,
      capitalAgregado: 50,
      receitaJurosMensal: 2,
    },
  };
  const game = createGame("partida-fiscal", content, loaded.graph);
  if (!game.ok) throw new Error(game.diagnostics[0]?.message);

  expect(game.value.fiscal).toEqual({
    cash: 10,
    totalDebt: 100,
    debtIssuedDuringGame: 0,
    inheritedMonthlyInterest: 5,
    monthlyNewDebtInterestRate: 0.01,
  });
  expect(game.value.fiscal).not.toBe(content.initialState.fiscal);
  expect(game.value.credit).toEqual({
    outstandingPrincipal: 100,
    performingPrincipal: 80,
    defaultedPrincipal: 20,
    bankCapital: 50,
    monthlyInterestRevenue: 2,
  });
});

it("persists an explicit random seed in the game snapshot", () => {
  const loaded = brasil();
  const game = createGame(
    "partida-aleatoria",
    loaded.definition,
    loaded.graph,
    {
      randomSeed: 123,
    },
  );
  if (!game.ok) throw new Error(game.diagnostics[0]?.message);
  expect(game.value.random).toEqual({
    algorithm: "xorshift32-v1",
    seed: 123,
    state: 123,
  });
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
  changed.organizacaoPolitica.formasDeGoverno[0].nome =
    "Forma alterada para teste de identidade";
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
  content.initialState.leisVigentes = [
    { lei: "politica-ausente", nivel: 1 },
    { lei: "atencao-basica", nivel: 999999 },
    { lei: "atencao-basica", nivel: 4000 },
  ];
  const result = validatePackageCoherence(content);
  expect(result.ok).toBe(false);
  if (!result.ok)
    expect(result.diagnostics).toMatchObject([
      {
        file: "brasil-primeiro-cenario/estado-inicial.json",
        field: "leisVigentes[0].lei",
      },
      {
        file: "brasil-primeiro-cenario/estado-inicial.json",
        field: "leisVigentes[1]",
      },
      {
        file: "brasil-primeiro-cenario/estado-inicial.json",
        field: "leisVigentes[2].lei",
      },
    ]);
});
