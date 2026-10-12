/**
 * Sensibilidade (V1-07, desenho/rede.md §5): triagem de Morris com as leis
 * como fatores. Para cada lei e índice, μ* (média do efeito absoluto) e σ
 * (desvio: não linear ou dependente de outra lei). Fora do `npm test`.
 *
 * Uso: npm run rede:sensibilidade                  (2 trajetórias, 4 turnos)
 *      npm run rede:sensibilidade -- 10 8 saida.md (10 trajetórias, 8 turnos)
 *
 * Cada lei anda no domínio do controle dela (aberto: de 0 ao dobro do valor
 * de partida), numa grade de 4 níveis. Custo: (leis + 1) × trajetórias
 * partidas de N turnos.
 */
import { writeFileSync } from "node:fs";
import {
  advanceExecution,
  createExecution,
  translateAuthorizedPolicies,
} from "../../src/engine";
import { prepareMonthlyContent } from "../../src/game/prepareMonthlyContent";
import { loadDistributedScenario } from "../../src/game/pais/loadScenarioPackage";

const [trajectories = 2, turns = 4] = process.argv
  .slice(2, 4)
  .map((arg) => Number(arg));
const outputFile = process.argv[4];

const loaded = loadDistributedScenario("paises/brasil/pais.json");
if (!loaded.ok) throw new Error(JSON.stringify(loaded.diagnostics, null, 2));
const monthly = prepareMonthlyContent(loaded.value.definition);
if (!monthly.ok) throw new Error(JSON.stringify(monthly.diagnostics, null, 2));
const { content, graph } = monthly.value;
const start = createExecution(content, graph);

const laws = content.policies.map((law) => {
  const domain = graph.nodesById[law.controle.variavel]?.dominio ?? {};
  const now = start.values[law.controle.variavel] ?? 0;
  const low = domain.minimo ?? 0;
  const high = domain.maximo ?? Math.max(low + 1, now * 2);
  return { id: law.id, low, high };
});
const outputs = Object.values(graph.nodesById)
  .filter(
    (node) =>
      (node.tipo === "calculado" || node.tipo === "estoque") &&
      !node.id.includes(":"),
  )
  .map((node) => node.id);

function play(levels: readonly number[]): number[] {
  let execution = start;
  const batch = translateAuthorizedPolicies(
    content,
    graph,
    laws.map((law, i) => ({
      policyId: law.id,
      intensity: law.low + (law.high - law.low) * levels[i],
    })),
  );
  if (!batch.ok) throw new Error(JSON.stringify(batch.diagnostics));
  for (let month = 0; month < turns * 3; month += 1) {
    const step = advanceExecution(content, graph, execution, batch.value, 1, {
      explain: false,
    });
    if (!step.ok) throw new Error(JSON.stringify(step.diagnostics));
    execution = step.value.execution;
  }
  return outputs.map((id) => execution.values[id]);
}

// Gerador determinístico (mulberry32) para a triagem se repetir.
let seed = 20251;
const random = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const delta = 2 / 3;
// effects[law][output] = efeitos elementares de cada trajetória
const effects = laws.map(() => outputs.map(() => [] as number[]));
const began = Date.now();
for (let r = 0; r < trajectories; r += 1) {
  const x = laws.map(() => (random() < 0.5 ? 0 : 1 / 3));
  const order = laws.map((_, i) => i).sort(() => random() - 0.5);
  let previous = play(x);
  for (const i of order) {
    x[i] += delta;
    const current = play(x);
    outputs.forEach((_, o) =>
      effects[i][o].push((current[o] - previous[o]) / delta),
    );
    previous = current;
  }
  console.error(
    `trajetória ${r + 1}/${trajectories} em ${Date.now() - began} ms`,
  );
}

const stats = laws.map((law, i) => ({
  law: law.id,
  byOutput: outputs.map((id, o) => {
    const ee = effects[i][o];
    const mean = ee.reduce((s, e) => s + e, 0) / ee.length;
    return {
      id,
      muStar: ee.reduce((s, e) => s + Math.abs(e), 0) / ee.length,
      sigma: Math.sqrt(ee.reduce((s, e) => s + (e - mean) ** 2, 0) / ee.length),
    };
  }),
}));

const lines: string[] = [
  `# Sensibilidade (Morris): ${trajectories} trajetórias, ${turns} turnos`,
  "",
  "## Leis inertes (μ* < 0,05 em todo índice)",
  "",
];
for (const s of stats)
  if (s.byOutput.every((o) => o.muStar < 0.05)) lines.push(`- ${s.law}`);
lines.push(
  "",
  "## Índices dominados por uma lei (mais de 60% da soma de μ*)",
  "",
);
outputs.forEach((id, o) => {
  const total = stats.reduce((sum, s) => sum + s.byOutput[o].muStar, 0);
  const top = [...stats].sort(
    (a, b) => b.byOutput[o].muStar - a.byOutput[o].muStar,
  )[0];
  if (total > 0 && top.byOutput[o].muStar / total > 0.6)
    lines.push(
      `- ${id}: ${top.law} (${Math.round((100 * top.byOutput[o].muStar) / total)}%)`,
    );
});
lines.push(
  "",
  "## Pares com σ alto (não linear ou com interação), 20 maiores",
  "",
);
stats
  .flatMap((s) => s.byOutput.map((o) => ({ law: s.law, ...o })))
  .filter((p) => p.muStar > 0.05)
  .sort((a, b) => b.sigma - a.sigma)
  .slice(0, 20)
  .forEach((p) =>
    lines.push(
      `- ${p.law} → ${p.id}: σ ${p.sigma.toFixed(2)}, μ* ${p.muStar.toFixed(2)}`,
    ),
  );
const text = lines.join("\n") + "\n";
if (outputFile) writeFileSync(outputFile, text);
console.log(text);
