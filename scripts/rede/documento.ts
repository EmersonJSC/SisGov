/**
 * Gera docs/conteudo/rede.md lendo os JSONs do mundo pelo próprio motor.
 * Os JSONs são a única fonte da rede; este arquivo só descreve o que está lá.
 *
 * Uso: npm run rede:documento
 */
import { writeFileSync } from "node:fs";
import { createExecution, type GraphRelation } from "../../src/engine";
import { loadDistributedScenario } from "../../src/scenarios/loadScenarioPackage";

const loaded = loadDistributedScenario("paises/brasil/pais.json");
if (!loaded.ok) throw new Error(JSON.stringify(loaded.diagnostics, null, 2));
const { definition, graph } = loaded.value;
const start = createExecution(definition, graph);
const lawByControl = new Map(
  definition.policies.map((law) => [law.controle.variavel, law]),
);

const name = (id: string): string => {
  const law = lawByControl.get(id);
  if (law) return `Lei: ${law.nome}`;
  const node = graph.nodesById[id];
  return node ? node.nome : id;
};

const positive = (relation: GraphRelation): boolean => {
  const p = relation.parameters;
  if (p.pontos)
    return (
      p.pontos.reduce((a, [, y]) => (Math.abs(y) > Math.abs(a) ? y : a), 0) >= 0
    );
  return (relation.mechanism === "saturacao" ? p.maximo! : p.coeficiente!) >= 0;
};

const label = (relation: GraphRelation, targetId: string): string => {
  if (relation.originId === targetId) return "desgaste natural (por trimestre)";
  const p = relation.parameters;
  let text =
    relation.mechanism === "limiar" && p.direcao === "abaixo"
      ? `falta de ${name(relation.originId).toLowerCase()}`
      : name(relation.originId);
  if (relation.normalization?.fator)
    text += ` × ${name(relation.normalization.fator).toLowerCase()}`;
  if (relation.scale) text += ` × ${name(relation.scale.fator).toLowerCase()}`;
  if (relation.normalization?.divisor)
    text += ` ÷ ${name(relation.normalization.divisor).toLowerCase()}`;
  if (relation.mechanism !== "afim")
    text += ` (${relation.mechanism.replace("_", " ")})`;
  if (relation.delaySteps > 0)
    text += ` — ${relation.delaySteps} trimestre(s) de atraso`;
  return text;
};

const kinds: Record<string, string> = {
  estoque: "bolha lenta",
  calculado: "índice",
  situacao: "situação",
};

const sections = Object.values(graph.nodesById)
  .filter(
    (node) => node.tipo !== "controle" && node.id !== "carga_evento_demanda",
  )
  .map((node) => {
    const incoming = graph.relations.filter(
      (relation) =>
        relation.targetId === node.id &&
        relation.originId !== "carga_evento_demanda",
    );
    if (incoming.length === 0) return "";
    const pos = incoming.filter(positive).map((r) => label(r, node.id));
    const neg = incoming
      .filter((r) => !positive(r))
      .map((r) => label(r, node.id));
    const kind = node.id.includes(":")
      ? "lei"
      : (kinds[node.tipo] ?? node.tipo);
    const value = start.values[node.id];
    return [
      `### ${node.nome} (${kind}) — Brasil no turno 0: ${Number(value.toFixed(2))}`,
      "",
      `- **Positivo ←** ${pos.length ? [...new Set(pos)].join(", ") : "—"}`,
      `- **Negativo ←** ${neg.length ? [...new Set(neg)].join(", ") : "—"}`,
      "",
    ].join("\n");
  })
  .filter(Boolean);

const header = `# A rede do mundo — bolha por bolha

**Gerado** por \`npm run rede:documento\` a partir dos JSONs em
\`src/conteudo/mundo/\`. Não edite este arquivo: edite os JSONs e gere de novo.

A rede é do **mundo** (vale para todos os países, D-39). As forças das
ligações são hipóteses escolhidas uma a uma; **não há calibragem
automática**: enquanto faltam leis, a rede fica desequilibrada de propósito.
O equilíbrio para o jogador é trabalho do balanceamento (M7), com
\`npm run rede:simular\`.

Leitura: "falta de X" é o quanto X está abaixo do máximo da escala. Não
existe valor-base escondido: cada bolha é só o que está listado (D-40).
**Bolhas lentas** acumulam ao longo do tempo; o país declara só o ponto de
partida delas.

`;

writeFileSync("docs/conteudo/rede.md", header + sections.join("\n"));
console.log(`docs/conteudo/rede.md: ${sections.length} bolhas`);
