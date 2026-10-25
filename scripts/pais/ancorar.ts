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
const economia = JSON.parse(
  readFileSync(`src/conteudo/${pasta}/economia.json`, "utf-8"),
) as { arrecadacaoDePartida?: Record<string, number> };
const fatores: Record<string, number> = {};
if (economia.arrecadacaoDePartida) {
  const partida = createGame("ancorar-impostos", content, graph, {
    occurrences: false,
  });
  if (!partida.ok) throw new Error(JSON.stringify(partida.diagnostics));
  const v = partida.value.execution.values;
  const patrimonio =
    v.patrimonio_imoveis_urbanos + v.patrimonio_terras + v.patrimonio_financeiro;
  const impostos = [
    ["consumo", "aliquota_imposto_sobre_consumo", v.consumo_familias, 150],
    ["renda_pessoas", "aliquota_imposto_renda_pessoas", v.massa_salarial, 130],
    ["renda_empresas", "aliquota_imposto_renda_empresas", v.lucros, 90],
    ["dividendos", "aliquota_tributacao_dividendos", v.lucros, 100],
    ["heranca", "aliquota_imposto_heranca", v.mortes_no_ano * patrimonio / v.populacao, 80],
    ["fortunas", "aliquota_imposto_grandes_fortunas", patrimonio, 8],
    ["imoveis_urbanos", "aliquota_imposto_propriedade_urbana_rural", v.patrimonio_imoveis_urbanos, 6],
    ["terras", "aliquota_imposto_terras_rurais", v.patrimonio_terras, 6],
    ["transacoes", "aliquota_imposto_transacoes_financeiras", v.pib_nominal, 3],
  ] as const;
  for (const [id, aliquotaId, base, zera] of impostos) {
    const aliquota = v[aliquotaId];
    const alvo = economia.arrecadacaoDePartida[id];
    if (alvo === undefined) throw new Error(`Arrecadação de partida ausente: ${id}`);
    fatores[`fator_partida_${id}`] = aliquota > 0
      ? Math.round((100 * (alvo * v.pib_nominal / 100) /
          (aliquota / 100 * base * (1 - aliquota / zera))) * 1e6) / 1e6
      : 60;
  }
  const arquivoLeis = `src/conteudo/${pasta}/leis.json`;
  const leis = JSON.parse(readFileSync(arquivoLeis, "utf-8")) as {
    controles: Record<string, number>;
  };
  Object.assign(leis.controles, fatores);
  writeFileSync(arquivoLeis, JSON.stringify(leis, null, 2) + "\n");
  console.log(`fatores de partida gravados em ${arquivoLeis}`);
}
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
        valores: { ...content.initialState.valores, ...fatores },
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
