/**
 * Mostra quantas leis do catálogo já estão no formato de ficha v3 (V1-05) e
 * confere as fichas migradas com o verificador. Não altera nada.
 *
 * Uso: npm run fichas:migracao
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import {
  expandirFichasV3,
  relatorioDeMigracao,
} from "../../src/game/pais/fichaV3";

const raiz = "src/conteudo";
const arquivos: Record<string, string> = {};
const ler = (pasta: string) => {
  for (const nome of readdirSync(pasta)) {
    const caminho = join(pasta, nome);
    if (statSync(caminho).isDirectory()) ler(caminho);
    else if (nome.endsWith(".json"))
      arquivos[relative(raiz, caminho)] = readFileSync(caminho, "utf8");
  }
};
ler(raiz);

const relatorio = relatorioDeMigracao(arquivos, "mundo/catalogo-leis.json");
console.log(
  `Fichas v3: ${relatorio.migradas.length} de ${relatorio.total}. Faltam ${relatorio.faltam.length}.`,
);
for (const id of relatorio.migradas) console.log(`  v3  ${id}`);
const verificado = expandirFichasV3(arquivos);
if (verificado.ok) console.log("Todas as fichas v3 passam no verificador.");
else {
  console.log("Fichas com problema:");
  for (const d of verificado.diagnostics)
    console.log(`  ${d.file} ${d.field}: ${d.message}`);
  process.exitCode = 1;
}
