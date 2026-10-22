/**
 * Gera docs/jogo/leis/inventario.md: as leis de hoje por área nova, com a
 * família sugerida, o que falta para o molde e a lei parecida.
 * Uso: npm run leis:inventario
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { avisosPorArea } from "../../src/game/pais/fichaV3";
import { areaDasLeisNoPais, sugerirLinha, type LeiBruta } from "./sugerir";

const RAIZ = join(import.meta.dirname, "..", "..");
const ler = <T>(caminho: string): T =>
  JSON.parse(readFileSync(join(RAIZ, caminho), "utf8")) as T;

const pasta = "src/conteudo/mundo/leis";
const leis = readdirSync(join(RAIZ, pasta))
  .filter((f) => f.endsWith(".json"))
  .map((f) => ler<LeiBruta>(`${pasta}/${f}`));
const areas = ler<{ areas: { id: string; titulo: string }[] }>(
  "src/conteudo/mundo/areas.json",
).areas;
const politica = ler<{
  ministerios: { ministerios: { id: string; leis?: string[] }[] };
}>("src/conteudo/paises/brasil/politica.json");

const areaDaLei = areaDasLeisNoPais(politica.ministerios.ministerios);
const linhas = leis.map((l) => sugerirLinha(l, areaDaLei, leis));

const NOME_DA_FAMILIA = {
  imposto: "imposto",
  verba: "verba",
  programa: "programa",
  regra: "regra",
  constitucional: "constitucional",
  petrea: "pétrea",
} as const;

const avisos = avisosPorArea(
  linhas.map((l) => ({ id: l.id, area: l.areaSugerida })),
  areas.map((a) => a.id),
);

const grupos = [
  ...areas.map((a) => ({ id: a.id, titulo: a.titulo })),
  { id: "centro", titulo: "Centro (pétreas)" },
];

const partes: string[] = [
  "# Inventário das leis (gerado)",
  "",
  "> Gerado por `npm run leis:inventario` a partir das leis de hoje. **Não",
  "> editar à mão, exceto a coluna Destino.** Área e família são sugestões; quem",
  "> decide é o autor. Destino: **entra** · **junta com <id>** · **sai**.",
  "> Regras: [molde-das-leis.md](../mecanicas/molde-das-leis.md).",
  "",
  `Total: ${linhas.length} leis.`,
  "",
  "## Áreas com menos de 8 leis (aviso)",
  "",
  ...(avisos.length ? avisos.map((a) => `- ${a}`) : ["- nenhuma"]),
  "",
];

for (const g of grupos) {
  const daArea = linhas
    .filter((l) => l.areaSugerida === g.id)
    .sort((a, b) => a.familiaSugerida.localeCompare(b.familiaSugerida));
  if (daArea.length === 0) continue;
  partes.push(
    `## ${g.titulo} (${daArea.length})`,
    "",
    "| Lei | id | Família | O que falta | Parecida com | Destino |",
    "| --- | --- | --- | --- | --- | --- |",
    ...daArea.map(
      (l) =>
        `| ${l.nome} | \`${l.id}\` | ${NOME_DA_FAMILIA[l.familiaSugerida]} | ${l.faltas.join("; ") || "—"} | ${l.parecidaCom ? `\`${l.parecidaCom}\`` : ""} | |`,
    ),
    "",
  );
}

const saida = join(RAIZ, "docs/jogo/leis/inventario.md");
writeFileSync(saida, partes.join("\n"));
console.log(`${linhas.length} leis → ${saida}`);
for (const a of avisos) console.log(`aviso: ${a}`);
