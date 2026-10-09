/**
 * Simula cenários de N turnos com o motor de verdade e mostra a diferença
 * para o país sem mudanças. Ferramenta de balanceamento; não altera nada.
 *
 * Uso: npm run rede:simular                (cenários padrão, 40 turnos)
 *      npm run rede:simular -- 20 atencao-basica=6000 creches-publicas=1600
 */
import {
  advanceExecution,
  createExecution,
  translateAuthorizedPolicies,
} from "../../src/engine";
import { prepareMonthlyContent } from "../../src/game/prepareMonthlyContent";
import { loadDistributedScenario } from "../../src/scenarios/loadScenarioPackage";

const loaded = loadDistributedScenario("paises/brasil/pais.json");
if (!loaded.ok) throw new Error(JSON.stringify(loaded.diagnostics, null, 2));
const monthly = prepareMonthlyContent(loaded.value.definition);
if (!monthly.ok) throw new Error(JSON.stringify(monthly.diagnostics, null, 2));
const { content, graph } = monthly.value;

function play(turns: number, levels: Record<string, number>) {
  let execution = createExecution(content, graph);
  for (let month = 0; month < turns * 3; month += 1) {
    const batch = translateAuthorizedPolicies(
      content,
      graph,
      content.policies.map((law) => ({
        policyId: law.id,
        intensity: levels[law.id] ?? execution.values[law.controle.variavel],
      })),
    );
    if (!batch.ok) throw new Error(JSON.stringify(batch.diagnostics));
    const step = advanceExecution(content, graph, execution, batch.value);
    if (!step.ok) throw new Error(JSON.stringify(step.diagnostics));
    execution = step.value.execution;
  }
  return execution.values;
}

const args = process.argv.slice(2);
const turns = Number(args[0]) || 40;
const custom = args.slice(1).map((pair) => pair.split("="));
const scenarios: [string, Record<string, number>][] = custom.length
  ? [
      [
        args.slice(1).join(" "),
        Object.fromEntries(custom.map(([k, v]) => [k, Number(v)])),
      ],
    ]
  : [
      ["atenção básica 4000 → 6000", { "atencao-basica": 6000 }],
      ["atenção básica 4000 → 2400", { "atencao-basica": 2400 }],
      ["merenda 300 → 0", { "alimentacao-escolar": 0 }],
      ["prevenção 600 → 1400", { "prevencao-seguranca": 1400 }],
      ["creches 500 → 1600", { "creches-publicas": 1600 }],
    ];

const start = createExecution(content, graph).values;
const base = play(turns, {});
const shown = Object.values(graph.nodesById).filter(
  (node) => node.tipo !== "controle" && !node.id.includes(":"),
);
console.log(`\nPaís sem mudanças: turno 0 → turno ${turns}`);
for (const node of shown)
  if (Math.abs(base[node.id] - start[node.id]) > 0.5)
    console.log(
      `  ${node.nome}: ${start[node.id].toFixed(1)} → ${base[node.id].toFixed(1)}`,
    );
for (const [title, levels] of scenarios) {
  const values = play(turns, levels);
  console.log(`\n${title} — diferença no turno ${turns}:`);
  for (const node of shown) {
    const delta = values[node.id] - base[node.id];
    if (Math.abs(delta) > 0.05)
      console.log(`  ${node.nome}: ${delta > 0 ? "+" : ""}${delta.toFixed(2)}`);
  }
}
