/**
 * Relatório da rede sem números soltos (V1-07, desenho/rede.md §9): por
 * índice, o valor declarado do país, o contexto (a parte que a rede não
 * explica), quantas ligações entram e saem; e as leis cujo efeito nenhum
 * índice muda. Não altera nada.
 *
 * Uso: npm run rede:contexto              (Brasil, ordenado pelo contexto)
 *      npm run rede:contexto -- seg       (só índices cujo id contém "seg")
 */
import { checkNetworkRules, createExecution } from "../../src/engine";
import { contextNodeId, isContextNode } from "../../src/engine/model/lawNodes";
import { prepareMonthlyContent } from "../../src/game/prepareMonthlyContent";
import { loadDistributedScenario } from "../../src/game/pais/loadScenarioPackage";

const filter = process.argv[2] ?? "";
const loaded = loadDistributedScenario("paises/brasil/pais.json");
if (!loaded.ok) throw new Error(JSON.stringify(loaded.diagnostics, null, 2));
const monthly = prepareMonthlyContent(loaded.value.definition);
if (!monthly.ok) throw new Error(JSON.stringify(monthly.diagnostics, null, 2));
const { content, graph } = monthly.value;
const values = createExecution(content, graph).values;
const rules = checkNetworkRules(content, graph);
const declared = content.initialState.indicesIniciais ?? {};

const inputs = new Map<string, number>();
const outputs = new Map<string, number>();
const bump = (map: Map<string, number>, id: string) =>
  map.set(id, (map.get(id) ?? 0) + 1);
for (const relation of graph.relations) {
  if (isContextNode(relation.originId)) continue;
  bump(inputs, relation.targetId);
  for (const id of new Set([
    relation.originId,
    relation.normalization?.fator,
    relation.normalization?.divisor,
  ]))
    if (id) bump(outputs, id);
}

const rows = Object.values(graph.nodesById)
  .filter((node) => ["calculado", "estoque", "situacao"].includes(node.tipo))
  .filter((node) => !node.id.includes(":") && node.id.includes(filter))
  .map((node) => ({
    id: node.id,
    declarado: declared[node.id],
    contexto: values[contextNodeId(node.id)] ?? 0,
    entram: inputs.get(node.id) ?? 0,
    saem: outputs.get(node.id) ?? 0,
    medida: node.medida ? "sim" : "",
  }))
  .sort((a, b) => Math.abs(b.contexto) - Math.abs(a.contexto));

const n = (value: number | undefined) =>
  value === undefined ? "" : value.toFixed(2);
console.log("índice\tdeclarado\tcontexto\tentram\tsaem\tmedida");
for (const row of rows)
  console.log(
    [
      row.id,
      n(row.declarado),
      n(row.contexto),
      row.entram,
      row.saem,
      row.medida,
    ].join("\t"),
  );
// Mesma conta da trava (redeTrava.test.ts): todo valor declarado do país.
const contexts = Object.keys(declared).map((id) =>
  Math.abs(values[contextNodeId(id)] ?? 0),
);
const above = (limit: number) =>
  contexts.filter((value) => value > limit).length;
console.log(`
Contexto acima de 5: ${above(5)}; de 25: ${above(25)}; de 50: ${above(50)} (de ${contexts.length} valores declarados).
Não influenciam nada (${rules.withoutOutput.length}): ${rules.withoutOutput.join(", ")}
Nada os influencia (${rules.withoutInput.length}): ${rules.withoutInput.join(", ")}
Leis sem índice mudando o efeito (${rules.unmodulatedLaws.length}): ${rules.unmodulatedLaws.join(", ")}
Sem medida real (${rules.withoutMeasure.length}).`);
