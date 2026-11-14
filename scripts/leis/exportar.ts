// Planilha → leis: lê as abas Leis, Leis - degraus e Leis - efeitos da
// `docs/jogo/gdd.xlsx`, confere cada lei com o validador do motor e reescreve
// só os JSONs que mudaram. Com erro em qualquer lei, não escreve nada. Lei que
// tem JSON e saiu da planilha só é apagada com `--apagar`. Roda com
// `npm run leis`.
import {
  existsSync,
  readFileSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { format } from "prettier";
import { validarLei } from "../../src/motor";
import indicadores from "../../src/conteudo/mundo/indicadores/variaveis.json";
import { lerPlanilha } from "../xlsx";
import {
  ABA_DEGRAUS,
  ABA_EFEITOS,
  ABA_LEIS,
  PASTA_DAS_LEIS,
  PLANILHA,
  leisDasAbas,
} from "./molde";

const apagar = process.argv.includes("--apagar");
const abas = lerPlanilha(PLANILHA);
const aba = (nome: string) => {
  const linhas = abas.get(nome);
  if (!linhas) throw new Error(`${PLANILHA}: falta a aba "${nome}"`);
  return linhas;
};
const leis = leisDasAbas(aba(ABA_LEIS), aba(ABA_DEGRAUS), aba(ABA_EFEITOS));

const indices = indicadores.variaveis
  .filter((v) => v.camada !== "essencial")
  .map((v) => v.id);
const erros = leis.flatMap((l) =>
  validarLei(l, `${l.id}.json`, indices).map(
    (e) => `${l.id}: ${e.campo} ${e.motivo}`,
  ),
);
if (erros.length) {
  console.error(`${erros.length} erro(s); nada foi escrito:`);
  erros.forEach((e) => console.error(`  ${e}`));
  process.exit(1);
}

const textos = await Promise.all(
  leis.map(async (l) => ({
    id: l.id,
    texto: await format(JSON.stringify(l), { parser: "json" }),
  })),
);
const mudaram = textos.filter(({ id, texto }) => {
  const arquivo = `${PASTA_DAS_LEIS}/${id}.json`;
  return !existsSync(arquivo) || readFileSync(arquivo, "utf8") !== texto;
});
mudaram.forEach(({ id, texto }) =>
  writeFileSync(`${PASTA_DAS_LEIS}/${id}.json`, texto),
);

const naPlanilha = new Set(leis.map((l) => l.id));
const sobrando = readdirSync(PASTA_DAS_LEIS)
  .filter((a) => a.endsWith(".json"))
  .map((a) => a.slice(0, -".json".length))
  .filter((id) => !naPlanilha.has(id));
if (apagar)
  sobrando.forEach((id) => unlinkSync(`${PASTA_DAS_LEIS}/${id}.json`));

console.log(
  `${leis.length} leis na planilha; ${mudaram.length} arquivo(s) reescrito(s).`,
);
if (sobrando.length)
  console.log(
    `${sobrando.length} lei(s) sem linha na planilha${apagar ? " apagada(s)" : " (use --apagar)"}: ${sobrando.join(", ")}`,
  );
