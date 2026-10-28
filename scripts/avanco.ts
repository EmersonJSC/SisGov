/**
 * Avanço do projeto: quanto do jogo está de pé.
 *
 * Não confundir com `reguas.json` e `ReguaDaLei.tsx`, que são a escala de
 * faixas dentro do jogo. Isto aqui é ferramenta de quem desenvolve: nada
 * disto aparece para quem joga.
 *
 * Existe porque texto escrito à mão mente. O PLANO afirmou "11 passos de
 * conta" e a verdade era 4; afirmou "~440 frases" e eram ~250. Número que
 * ninguém recalcula envelhece em silêncio e dá sensação de avanço no lugar de
 * avanço.
 *
 * Duas fontes, e a diferença importa:
 * - o **PLANO** é o status que o autor mantém (o que está fechado);
 * - o **conteúdo** é medida objetiva (quantas bolhas, quantas leis).
 *
 * Não sonda arquivo para dizer se uma mecânica está pronta: "existe
 * eleicao.ts" não é "a eleição funciona", e essa sonda chegou a marcar 83% de
 * um ciclo que o PLANO diz estar aberto. Por isso a base construída conta
 * tamanho, não conclusão: diz o que está de pé, não o que está fechado.
 *
 * A base vem primeiro de propósito. A ordem de 25/out é a lista do que falta,
 * e medir só por ela trata o projeto como se tivesse começado naquele dia —
 * ignora as semanas e as dezenas de milhares de linhas anteriores, e devolve
 * uma porcentagem que parece estagnação.
 *
 * Uso: npx vite-node scripts/avanco.ts
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";

const RAIZ = new URL("..", import.meta.url).pathname;
const ler = (caminho: string): string => readFileSync(RAIZ + caminho, "utf8");
const json = (caminho: string): unknown => JSON.parse(ler(caminho));

const PORCENTO = 100;
const LARGURA = 24;
const REGUA = 60;

const barra = (feito: number, total: number): string => {
  const cheio = total > 0 ? Math.round((feito / total) * LARGURA) : 0;
  const pct = total > 0 ? Math.round((feito / total) * PORCENTO) : 0;
  return `${"█".repeat(cheio)}${"·".repeat(LARGURA - cheio)} ${feito}/${total} (${pct}%)`;
};

const titulo = (texto: string) =>
  console.log(`\n${texto}\n${"─".repeat(REGUA)}`);

// ───────────────────────────────────────────── base já construída
/** Conta arquivos de código numa pasta, descendo nas subpastas. */
function contarCodigo(pasta: string): number {
  const caminho = RAIZ + pasta;
  if (!existsSync(caminho)) return 0;
  return readdirSync(caminho, { withFileTypes: true }).reduce(
    (soma, item) =>
      soma +
      (item.isDirectory()
        ? contarCodigo(`${pasta}/${item.name}`)
        : /\.tsx?$/.test(item.name)
          ? 1
          : 0),
    0,
  );
}

function contarLinhas(pasta: string): number {
  const caminho = RAIZ + pasta;
  if (!existsSync(caminho)) return 0;
  return readdirSync(caminho, { withFileTypes: true }).reduce(
    (soma, item) =>
      soma +
      (item.isDirectory()
        ? contarLinhas(`${pasta}/${item.name}`)
        : /\.tsx?$/.test(item.name)
          ? ler(`${pasta}/${item.name}`).split("\n").length
          : 0),
    0,
  );
}

/**
 * O que já está de pé. "De pé" não é "fechado": o Congresso e a eleição
 * existem e ainda mudam (itens 6 e 7 da ordem). Isto mede tamanho, não
 * conclusão — serve para lembrar que o projeto não começou em 25/out.
 */
const BASE: readonly (readonly [string, string])[] = [
  ["motor de simulação", "src/engine"],
  ["leis, tramitação e ministérios", "src/game"],
  ["camada da partida", "src/app"],
  ["mapa, janelas, jornal e tablet", "src/ui"],
];

titulo("0. BASE JÁ CONSTRUÍDA — o que está de pé");
console.log(
  BASE.map(
    ([nome, pasta]) =>
      `  ${nome.padEnd(32)} ${String(contarCodigo(pasta)).padStart(3)} arquivos`,
  ).join("\n"),
);
const totalArquivos = BASE.reduce((s, [, p]) => s + contarCodigo(p), 0);
const totalLinhas = BASE.reduce((s, [, p]) => s + contarLinhas(p), 0);
console.log(
  `\n  ${totalArquivos} arquivos de código · ${totalLinhas.toLocaleString("pt-BR")} linhas`,
);
console.log(
  "  (tamanho, não conclusão: a ordem abaixo é a lista do que ainda falta)",
);

// ───────────────────────────────────────────── a ordem do PLANO
/**
 * Casa uma linha numerada com caixa de marcação da ordem de 25/out, com ou sem
 * negrito no nome. Aceita "3. [ ] Grupos: apoio de cada grupo" e
 * "1. [x] **Economia em reais e caixa** (…)"; recusa "- [ ] B3. Fundo
 * soberano", que é sub-item de outra seção.
 * https://regex101.com/?regex=%5E(%5C%5Cd%2B)%5C%5C.%20%5C%5C%5B(%20%7Cx)%5C%5C%5D%20(.%2B)%24
 */
const LINHA_DA_ORDEM = /^(\d+)\. \[( |x)\] (.+)$/;
/** Tira o negrito e corta no primeiro parêntese, dois-pontos ou ponto. */
const NOME_CURTO = /^\*{0,2}([^*(:.]+)/;

type Item = Readonly<{ numero: number; feito: boolean; nome: string }>;

const ordem: Item[] = ler("PLANO.md")
  .split("\n")
  .map((linha) => LINHA_DA_ORDEM.exec(linha))
  .filter((achado): achado is RegExpExecArray => achado !== null)
  .map((achado) => ({
    numero: Number(achado[1]),
    feito: achado[2] === "x",
    nome: (NOME_CURTO.exec(achado[3])?.[1] ?? achado[3]).trim(),
  }));

titulo("1. MECÂNICAS DA ORDEM (PLANO, 25/out) — status do autor");
console.log(
  ordem
    .map((i) => `  ${i.feito ? "✓" : "·"} ${i.numero}. ${i.nome}`)
    .join("\n"),
);
console.log(`\n  ${barra(ordem.filter((i) => i.feito).length, ordem.length)}`);

// ───────────────────────────────────────────── o ciclo jogável
/**
 * A pergunta que mais importa: dá para jogar do começo ao fim? O PLANO põe o
 * ciclo inteiro antes de qualquer calibragem, e o ciclo são estes itens da
 * ordem — não a existência dos arquivos.
 */
const DO_CICLO = [3, 5, 6] as const;
const ciclo = ordem.filter((i) => DO_CICLO.includes(i.numero as 3 | 5 | 6));

titulo("2. O CICLO JOGÁVEL — governar, desgastar, perder a eleição");
console.log(
  ciclo
    .map((i) => `  ${i.feito ? "✓" : "·"} ${i.numero}. ${i.nome}`)
    .join("\n"),
);
console.log(`\n  ${barra(ciclo.filter((i) => i.feito).length, ciclo.length)}`);
console.log("  (enquanto isto não fecha, calibrar número é trabalho refeito)");

// ───────────────────────────────────────────── país em frases
type Variavel = Readonly<{
  id: string;
  tipo: string;
  nome: string;
  area?: string;
  faixas?: unknown;
  medida?: { unidade?: string; tecnico?: boolean };
}>;

const variaveis = (
  json("src/conteudo/mundo/indicadores/variaveis.json") as {
    variaveis: Variavel[];
  }
).variaveis;

const NO_MAPA = ["calculado", "estoque", "grupo", "situacao"];
const bolhas = variaveis.filter(
  (v) => NO_MAPA.includes(v.tipo) && v.area !== "Dados internos",
);

/**
 * Porcentagem de uma quantia contínua, que não vira "um em cada N". Casa
 * "carga tributária bruta (% do PIB)"; recusa "% da população com plano".
 * https://regex101.com/?regex=%25%20do%20PIB%7C%25%20da%20receita
 */
const CONTINUA =
  /% do PIB|% da receita|% do sal|% da renda|\/ renda|% da folha|encargos sobre/i;
/**
 * Taxa ou índice, que se lê em pontos e não em gente. Casa "inflação ao
 * consumidor em 12 meses (%)"; recusa "% de ocupados informais".
 * https://regex101.com/?regex=inflac%7Cjuros%7CGini
 */
const TAXA =
  /inflac|juros|c[aâ]mbio|crescimento|diferen[cç]a de rendimento|Gini|[ií]ndice/i;
/**
 * Quantidade que se entende sozinha. Casa "área desmatada por ano (mil km²)";
 * recusa "índice de Gini da renda".
 * https://regex101.com/?regex=mil%20km%7Ctonelada
 */
const QUANTIDADE =
  /R\$|milh[õo]|bilh[õa]|mil km|km²|tonelada|t CO|por habitante|anos|pessoas|dias|leitos|homic/i;

const ESCRITA = "faixa escrita (dá redação)";

/** Dos jeitos de ter frase, só a faixa escrita custa redação. */
function jeito(v: Variavel): string {
  if (v.tipo === "grupo") return "regra dos grupos (uma só)";
  if (v.tipo === "situacao") return "regra das situações (uma só)";
  const u = v.medida?.unidade ?? "";
  if (!u || CONTINUA.test(u)) return ESCRITA;
  if (/%/.test(u) && !TAXA.test(u)) return "função emCada (pronta)";
  if (QUANTIDADE.test(u)) return "modelo com número";
  return ESCRITA;
}

const porJeito = bolhas.reduce<Map<string, number>>(
  (conta, b) => conta.set(jeito(b), (conta.get(jeito(b)) ?? 0) + 1),
  new Map(),
);
const precisaRedacao = porJeito.get(ESCRITA) ?? 0;

titulo("3. PAÍS EM FRASES — medida objetiva, do conteúdo");
console.log(`  bolhas no mapa: ${bolhas.length}`);
console.log(
  `  já com frase no conteúdo: ${bolhas.filter((b) => b.faixas).length}`,
);
console.log("\n  de onde a frase vem:");
console.log(
  [...porJeito]
    .sort((a, b) => b[1] - a[1])
    .map(([nome, n]) => `    ${String(n).padStart(4)}  ${nome}`)
    .join("\n"),
);
console.log(
  `\n  sai de código:      ${barra(bolhas.length - precisaRedacao, bolhas.length)}`,
);
console.log(`  pede redação:       ${precisaRedacao} bolhas`);

// ───────────────────────────────────────────── conteúdo
const META_LEIS = 250;
const catalogo = json("src/conteudo/mundo/catalogo-leis.json") as {
  politicas?: unknown[];
};

titulo("4. CONTEÚDO");
console.log(
  `  leis no catálogo:   ${barra(catalogo.politicas?.length ?? 0, META_LEIS)}`,
);
console.log(`  indicadores no mapa: ${bolhas.length}`);
console.log("");
