/**
 * Calibragem (V1-07, desenho/rede.md §4.2): roda o país trimestre a
 * trimestre sem o jogador, a partir dos valores declarados, e compara com a
 * série real em `paises/<pais>/calibragem.json`, índice por índice, pela
 * estatística de Theil (viés, variância, covariância). Não altera nada.
 *
 * calibragem.json: { "trimestres": [ { "indice": valor, ... }, ... ] }, um
 * objeto por trimestre a partir do começo dos dados (o primeiro é o próprio
 * valor declarado e não entra na conta).
 *
 * Uso: npm run rede:calibrar              (Brasil)
 *      npm run rede:calibrar -- pais-minimo
 */
import { readFileSync } from "node:fs";
import { advanceExecution, theilDecomposition } from "../../src/engine";
import { createGame } from "../../src/game/createGame";
import { prepareMonthlyContent } from "../../src/game/prepareMonthlyContent";
import { preparePolicyExecution } from "../../src/game/preparePolicyExecution";
import { loadDistributedScenario } from "../../src/game/pais/loadScenarioPackage";

const pais = process.argv[2] ?? "brasil";
const pasta = pais === "pais-minimo" ? "testes/pais-minimo" : `paises/${pais}`;
let serie: { trimestres: Record<string, number>[] };
try {
  serie = JSON.parse(
    readFileSync(`src/conteudo/${pasta}/calibragem.json`, "utf-8"),
  ) as typeof serie;
} catch {
  console.log(
    `Sem série real em src/conteudo/${pasta}/calibragem.json; nada a comparar.`,
  );
  process.exit(0);
}
const loaded = loadDistributedScenario(`${pasta}/pais.json`);
if (!loaded.ok) throw new Error(JSON.stringify(loaded.diagnostics, null, 2));
const monthly = prepareMonthlyContent(loaded.value.definition);
if (!monthly.ok) throw new Error(JSON.stringify(monthly.diagnostics, null, 2));
const { content, graph } = monthly.value;
// Sem aquecimento: a série começa nos valores declarados.
const game = createGame(
  "calibragem",
  {
    ...content,
    initialState: {
      ...content.initialState,
      cenario: { nome: "calibragem", aquecimentoMeses: 0 },
    },
  },
  graph,
  { occurrences: false },
);
if (!game.ok) throw new Error(JSON.stringify(game.diagnostics));
const batch = preparePolicyExecution(content, graph, game.value.policies);
if (!batch.ok) throw new Error(JSON.stringify(batch.diagnostics));

let execution = game.value.execution;
const simulated: Record<string, number>[] = [{ ...execution.values }];
for (let quarter = 1; quarter < serie.trimestres.length; quarter += 1) {
  for (let month = 0; month < 3; month += 1) {
    const step = advanceExecution(content, graph, execution, batch.value, 1, {
      explain: false,
    });
    if (!step.ok) throw new Error(JSON.stringify(step.diagnostics));
    execution = step.value.execution;
  }
  simulated.push({ ...execution.values });
}

const ids = Object.keys(serie.trimestres[1] ?? {});
console.log("índice\tEQM\tviés\tvariância\tcovariância");
for (const id of ids) {
  const real = serie.trimestres.slice(1).map((q) => q[id]);
  const sim = simulated.slice(1).map((v) => v[id]);
  if (real.some((x) => x === undefined) || sim.some((x) => x === undefined))
    continue;
  const t = theilDecomposition(real, sim);
  console.log(
    [id, t.mse.toFixed(3), t.bias, t.variance, t.covariance]
      .map((x) => (typeof x === "number" ? x.toFixed(2) : x))
      .join("\t"),
  );
}
