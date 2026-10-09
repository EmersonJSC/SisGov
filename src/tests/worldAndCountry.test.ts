import { expect, it } from "vitest";
import { createGame } from "../game/createGame";
import { policyLevelRulesFromContent } from "../game/policyRulesFromContent";
import { preparePolicyFiscalFlows } from "../game/preparePolicyFiscalFlows";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

const worldFiles = import.meta.glob<string>("../conteudo/mundo/**/*.json", {
  eager: true,
  query: "?raw",
  import: "default",
});

function load(path: string) {
  const loaded = loadDistributedScenario(path);
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  return loaded.value;
}

it("SG153: nenhum arquivo do mundo cita país, moeda concreta ou fonte nacional", () => {
  const paths = Object.keys(worldFiles);
  expect(paths.length).toBeGreaterThan(20);
  for (const [path, text] of Object.entries(worldFiles))
    for (const forbidden of [/brasil/i, /moeda_milhoes/, /\bSUS\b/, /gov\.br/])
      expect(forbidden.test(text), `${path} cita ${forbidden}`).toBe(false);
});

it("SG153: o Brasil carrega como antes (níveis, limites e gastos)", () => {
  const brasil = load("paises/brasil/pais.json");
  expect(brasil.definition.manifest.mundo).toBe("mundo/mundo.json");
  expect(brasil.definition.policies).toHaveLength(5);
  const game = createGame("brasil", brasil.definition, brasil.graph);
  if (!game.ok) throw new Error(game.diagnostics[0]?.message);
  expect(
    Object.fromEntries(
      game.value.policies.map((state) => [
        state.policyDefinitionId,
        state.desiredLevel,
      ]),
    ),
  ).toEqual({
    "atencao-basica": 4000,
    "protecao-mulheres": 240,
    "prevencao-seguranca": 600,
    "alimentacao-escolar": 300,
    "creches-publicas": 500,
  });
  const rules = policyLevelRulesFromContent(
    brasil.definition,
    "atencao-basica",
  );
  expect(rules).toMatchObject({
    ok: true,
    value: { rules: { domain: { minimum: 2400, maximum: 6000 } } },
  });
  const flows = preparePolicyFiscalFlows(
    brasil.definition,
    game.value.policies,
  );
  if (!flows.ok) throw new Error(flows.diagnostics[0]?.message);
  expect(
    flows.value.flows.reduce((sum, flow) => sum + flow.amount, 0),
  ).toBeCloseTo(5640 / 12);
});

it("SG153: outro país usa o mesmo mundo com outro pacote de leis", () => {
  const brasil = load("paises/brasil/pais.json");
  const other = load("testes/pais-teste/pais.json");
  expect(other.definition.policies.map((law) => law.id)).toEqual(
    brasil.definition.policies.map((law) => law.id),
  );
  expect(other.definition.consequences).toEqual(brasil.definition.consequences);
  const game = createGame("outro", other.definition, other.graph);
  if (!game.ok) throw new Error(game.diagnostics[0]?.message);
  expect(
    game.value.policies.map((state) => [
      state.policyDefinitionId,
      state.desiredLevel,
    ]),
  ).toEqual([
    ["atencao-basica", 9000],
    ["alimentacao-escolar", 100],
  ]);
  // Sem limites próprios, vale só o domínio do mundo.
  expect(
    policyLevelRulesFromContent(other.definition, "atencao-basica"),
  ).toMatchObject({
    ok: true,
    value: { rules: { domain: { minimum: 0, maximum: undefined } } },
  });
});

it("SG153: limite próprio do país é aplicado e validado", () => {
  const brasil = load("paises/brasil/pais.json");
  const content = structuredClone(brasil.definition);
  content.initialState.leisVigentes = content.initialState.leisVigentes!.map(
    (entry) =>
      entry.lei === "atencao-basica" ? { ...entry, nivel: 7000 } : entry,
  );
  const game = createGame("acima-do-limite", content, brasil.graph);
  expect(game.ok).toBe(false);
});
