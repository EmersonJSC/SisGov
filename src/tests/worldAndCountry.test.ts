import { expect, it } from "vitest";
import { createGame } from "../game/createGame";
import { policyLevelRulesFromContent } from "../game/policyRulesFromContent";
import { loadDistributedScenario } from "../game/pais/loadScenarioPackage";

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
  for (const [path, raw] of Object.entries(worldFiles)) {
    // Ficha v3 (V1-05): a história e as fontes citam países de propósito
    // (conteudo.md 1.2); o resto da ficha continua neutro.
    const json = JSON.parse(raw) as Record<string, unknown>;
    // Medida dos índices (V1-07): as fontes citam institutos de propósito.
    const semFontesDaMedida = Array.isArray(json.variaveis)
      ? JSON.stringify({
          ...json,
          variaveis: (json.variaveis as Record<string, unknown>[]).map((v) => ({
            ...v,
            medida: v.medida && { ...v.medida, fontes: undefined },
          })),
        })
      : raw;
    const text =
      json.versaoEsquema === 3
        ? JSON.stringify({ ...json, historia: undefined, fontes: undefined })
        : semFontesDaMedida;
    for (const forbidden of [/brasil/i, /moeda_milhoes/, /\bSUS\b/, /gov\.br/])
      expect(forbidden.test(text), `${path} cita ${forbidden}`).toBe(false);
  }
});

it("SG153: o Brasil carrega como antes (níveis, limites e gastos)", () => {
  const brasil = load("testes/legado/brasil/pais.json");
  expect(brasil.definition.manifest.mundo).toBe(
    "testes/legado/mundo/mundo.json",
  );
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
});

it("SG153: outro país usa o mesmo mundo com outro pacote de leis", () => {
  const brasil = load("testes/legado/brasil/pais.json");
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
  const brasil = load("testes/legado/brasil/pais.json");
  const content = structuredClone(brasil.definition);
  content.initialState.leisVigentes = content.initialState.leisVigentes!.map(
    (entry) =>
      entry.lei === "atencao-basica" ? { ...entry, nivel: 7000 } : entry,
  );
  const game = createGame("acima-do-limite", content, brasil.graph);
  expect(game.ok).toBe(false);
});
