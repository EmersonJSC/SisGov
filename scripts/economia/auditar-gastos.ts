/** Mostra de onde sai o gasto público no turno inicial do Brasil. */
import { criarPartida } from "../../src/app/partida";
import { advanceExecution } from "../../src/engine";
import { preparePolicyExecution } from "../../src/game/preparePolicyExecution";

const criada = criarPartida({ ocorrencias: false, eleicao: false });
if (!criada.ok) throw new Error(criada.erros.join("; "));
const { content, graph, game } = criada.value;
const batch = preparePolicyExecution(content, graph, game.policies);
if (!batch.ok) throw new Error(batch.diagnostics[0].message);
const step = advanceExecution(content, graph, game.execution, batch.value, 1, {
  explain: true,
});
if (!step.ok) throw new Error(step.diagnostics[0].message);
const gasto = step.value.explanations.find(
  (item) => item.targetId === "gasto_publico",
);
if (!gasto) throw new Error("Gasto público sem explicação");
const rows = gasto.contributions
  .map((item) => ({
    origem: item.originId,
    lei: graph.relationsById[item.relationId]?.sourceType === "lei",
    pontosPib: item.contribution,
  }))
  .sort((a, b) => Math.abs(b.pontosPib) - Math.abs(a.pontosPib));
console.log(
  JSON.stringify(
    {
      gastoAtual: game.execution.values.gasto_publico,
      gastoProximoMes: gasto.result,
      base: gasto.baseValue,
      semLei: rows.filter((row) => !row.lei),
      comLei: rows.filter((row) => row.lei),
    },
    null,
    2,
  ),
);
