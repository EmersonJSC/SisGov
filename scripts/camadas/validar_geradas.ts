/** Valida com o validador do motor as leis geradas por gerar_leis.py. */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateContentFile } from "../../src/engine";

const pasta = process.argv[2] ?? "scripts/camadas/saida/leis";
const tipoPasta = pasta.split("/").pop();
let ok = 0;
let erros = 0;
for (const nome of readdirSync(pasta)) {
  const json = readFileSync(join(pasta, nome), "utf8");
  const r = validateContentFile(`${tipoPasta}/${nome}`, json);
  if (r.ok) ok++;
  else {
    erros++;
    for (const d of r.diagnostics.slice(0, 3))
      console.log(`${nome}: ${d.code} ${d.field ?? ""} ${d.message}`);
  }
}
console.log(`${ok} válidas, ${erros} com erro`);
