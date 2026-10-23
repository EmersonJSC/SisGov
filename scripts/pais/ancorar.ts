/**
 * Ancora o turno 0 nos índices declarados (valores.json): a largada acomoda
 * as leis com a eficácia neutra e o aquecimento a leva à do país, então o
 * turno 0 se afasta do declarado. Mede o desvio depois do aquecimento e
 * grava `ajusteDoContexto` (metade do desvio por rodada, até fechar).
 * Rodar depois de mudar leis do país ou setas que elas tocam.
 * Uso: npm run pais:ancorar            (Brasil)
 *      npm run pais:ancorar -- pais-minimo
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createGame } from "../../src/game/createGame";
import { prepareMonthlyContent } from "../../src/game/prepareMonthlyContent";
import { loadDistributedScenario } from "../../src/game/pais/loadScenarioPackage";

const pais = process.argv.slice(2).find((a) => !a.startsWith("-")) ?? "brasil";
const pasta = pais === "pais-minimo" ? "testes/pais-minimo" : `paises/${pais}`;
const arquivo = `src/conteudo/${pasta}/valores.json`;
const loaded = loadDistributedScenario(`${pasta}/pais.json`);
if (!loaded.ok) throw new Error(JSON.stringify(loaded.diagnostics, null, 2));
const monthly = prepareMonthlyContent(loaded.value.definition);
if (!monthly.ok) throw new Error(JSON.stringify(monthly.diagnostics, null, 2));
const { content, graph } = monthly.value;
const alvos = content.initialState.indicesIniciais ?? {};
const ids = Object.keys(alvos).filter(
  (id) => graph.nodesById[id] && graph.nodesById[id].tipo !== "situacao",
);
const ajuste: Record<string, number> = {};
let pior = Infinity;
for (let rodada = 0; rodada < 16 && pior > 0.02; rodada += 1) {
  const jogo = createGame(
    "ancorar",
    {
      ...content,
      initialState: {
        ...content.initialState,
        ajusteDoContexto: { ...ajuste },
      },
    },
    graph,
    { occurrences: false },
  );
  if (!jogo.ok) throw new Error(JSON.stringify(jogo.diagnostics));
  const v = jogo.value.execution.values;
  pior = 0;
  let soma = 0;
  for (const id of ids) {
    const falta = alvos[id] - v[id];
    pior = Math.max(pior, Math.abs(falta));
    soma += Math.abs(falta);
    ajuste[id] = (ajuste[id] ?? 0) + 0.6 * falta;
  }
  console.log(
    `rodada ${rodada}: maior desvio ${pior.toFixed(3)}, soma ${soma.toFixed(2)}`,
  );
}
const valores = JSON.parse(readFileSync(arquivo, "utf-8")) as Record<
  string,
  unknown
>;
valores.ajusteDoContexto = Object.fromEntries(
  Object.entries(ajuste)
    .filter(([, x]) => Math.abs(x) > 1e-4)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, x]) => [id, Math.round(x * 1e4) / 1e4]),
);
writeFileSync(arquivo, JSON.stringify(valores, null, 2) + "\n");
console.log(`gravado em ${arquivo}`);
