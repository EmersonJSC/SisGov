// Leis → planilha: escreve as abas Leis, Leis - degraus e Leis - efeitos na
// `docs/jogo/gdd.xlsx` a partir dos JSONs do jogo. Guarda o Veredito e as Notas
// que já estavam na aba e traz do acervo (`leis.xlsx`) o que ele pensou de cada
// lei. As outras abas não mudam. Roda com `npm run leis:planilha`.
import { readdirSync, readFileSync } from "node:fs";
import ExcelJS from "exceljs";
import type { Lei } from "../../src/motor";
import { lerPlanilha } from "../xlsx";
import {
  ABA_DEGRAUS,
  ABA_EFEITOS,
  ABA_LEIS,
  COLUNAS_DEGRAUS,
  COLUNAS_EFEITOS,
  COLUNAS_LEIS,
  PASTA_DAS_LEIS,
  PLANILHA,
  linhaDaLei,
  linhasDosDegraus,
  linhasDosEfeitos,
  type Linha,
} from "./molde";

const ACERVO = "docs/jogo/leis.xlsx";
/** Colunas do acervo que vêm para a aba Leis, só para leitura. */
const DO_ACERVO = {
  "Chega ao pop (acervo)": "Chega ao pop por",
  "Ganho (acervo)": "Ganho",
  "Custo (acervo)": "Custo",
} as const;
/** Colunas que o autor e a triagem escrevem: a planilha guarda, o JSON não. */
const DE_TRABALHO = ["Veredito", "Canal proposto", "Notas"] as const;
const LARGURA = 18;
const LARGURA_DO_TEXTO = 48;
const LARGAS = new Set([
  "O que muda",
  "Notas",
  "Ganho (acervo)",
  "Custo (acervo)",
]);

const leis: Lei[] = readdirSync(PASTA_DAS_LEIS)
  .filter((a) => a.endsWith(".json"))
  .sort()
  .map((a) => JSON.parse(readFileSync(`${PASTA_DAS_LEIS}/${a}`, "utf8")));

// o acervo acha a lei pelo arquivo ou pelo nome
const acervo = lerPlanilha(ACERVO).get("Leis") ?? [];
const doAcervo = (lei: Lei) => {
  const nome = (lei as Lei & { nome?: string }).nome;
  const linha =
    acervo.find((a) => a.Arquivo === lei.id) ??
    acervo.find((a) => a.Lei === nome);
  return Object.fromEntries(
    Object.entries(DO_ACERVO).map(([aqui, la]) => [
      aqui,
      linha?.[la] || undefined,
    ]),
  );
};

const livro = new ExcelJS.Workbook();
await livro.xlsx.readFile(PLANILHA);

/** O que a triagem já escreveu na aba Leis, por id. */
const trabalho = new Map<string, Linha>();
const antiga = livro.getWorksheet(ABA_LEIS);
if (antiga) {
  const cabecalho = (antiga.getRow(1).values as unknown[]).map(String);
  antiga.eachRow((linha, n) => {
    if (n === 1) return;
    const celulas = linha.values as unknown[];
    const id = String(celulas[cabecalho.indexOf("id")] ?? "");
    trabalho.set(
      id,
      Object.fromEntries(
        DE_TRABALHO.map((c) => [c, celulas[cabecalho.indexOf(c)] as string]),
      ),
    );
  });
}

/** Troca a aba pela nova, no mesmo lugar (ou no fim). */
function escrever(nome: string, colunas: readonly string[], linhas: Linha[]) {
  const velha = livro.getWorksheet(nome);
  if (velha) livro.removeWorksheet(velha.id);
  const aba = livro.addWorksheet(nome, {
    views: [{ state: "frozen", ySplit: 1, xSplit: 1 }],
  });
  aba.columns = colunas.map((c) => ({
    header: c,
    key: c,
    width: LARGAS.has(c) ? LARGURA_DO_TEXTO : LARGURA,
  }));
  aba.getRow(1).font = { bold: true };
  aba.addRows(linhas);
  aba.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: colunas.length },
  };
}

const colunasDaAba = [...COLUNAS_LEIS, ...Object.keys(DO_ACERVO)];
escrever(
  ABA_LEIS,
  colunasDaAba,
  leis.map((l) => ({
    ...linhaDaLei(l),
    ...doAcervo(l),
    ...trabalho.get(l.id),
  })),
);
escrever(ABA_DEGRAUS, COLUNAS_DEGRAUS, leis.flatMap(linhasDosDegraus));
escrever(ABA_EFEITOS, COLUNAS_EFEITOS, leis.flatMap(linhasDosEfeitos));
await livro.xlsx.writeFile(PLANILHA);
console.log(
  `${PLANILHA}: ${leis.length} leis, ${leis.flatMap(linhasDosDegraus).length} degraus, ${leis.flatMap(linhasDosEfeitos).length} efeitos`,
);
