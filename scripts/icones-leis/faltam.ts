// Lista as leis de uma esfera que ainda não têm ícone, com o nome e a descrição
// para desenhar (npm run icones:faltam <esfera>).
import { readdirSync, readFileSync } from "node:fs";
import { LEIS_DESENHADAS } from "./leis";

const PASTA_LEIS = "src/conteudo/mundo/leis";
const esfera = process.argv[2];
if (!esfera) throw new Error("diga a esfera: npm run icones:faltam saude");

const feitas = LEIS_DESENHADAS[esfera] ?? {};
const leis = readdirSync(PASTA_LEIS)
  .map(
    (f) =>
      JSON.parse(readFileSync(`${PASTA_LEIS}/${f}`, "utf8")) as {
        id: string;
        nome: string;
        esfera: string;
        descricao?: string;
      },
  )
  .filter((l) => l.esfera === esfera && !feitas[l.id]);

for (const l of leis)
  console.log(`${l.id}\n  ${l.nome}: ${l.descricao ?? ""}\n`);
console.log(`${leis.length} sem ícone em "${esfera}".`);
