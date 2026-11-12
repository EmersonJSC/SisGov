// Gera src/conteudo/mundo/programas/programas.json a partir das abas
// Programas e Programas - leis de docs/jogo/leis.xlsx. Roda com
// `npm run programas`. A lei é achada pelo nome; a que ainda não está no jogo
// sai do programa, e o programa que não consegue mais se formar sai também.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { lerPlanilha, type Linha } from "./xlsx";

const PASTA_LEIS = "src/conteudo/mundo/leis";
const SAIDA = "src/conteudo/mundo/programas/programas.json";
/** Fração da régua que vale como "1 fatia" ou "10% da régua". */
const DEZ_POR_CENTO = 0.1;

const kebab = (s: string): string =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

type Direcao = "sobe" | "desce" | "muda";
type Minimo = "degrau" | "ativa" | number;

/** "desce (idade menor)" desce; "igual…" e "muda" só pedem mudança; o resto sobe. */
function direcaoDe(texto: string): Direcao {
  if (texto.startsWith("desce")) return "desce";
  if (texto.startsWith("igual") || texto === "muda") return "muda";
  return "sobe";
}

function minimoDe(texto: string): Minimo {
  if (texto === "—") return "ativa";
  if (texto.endsWith("da régua") || texto === "1 fatia") return DEZ_POR_CENTO;
  return "degrau";
}

const porNome = new Map<string, string>();
for (const arquivo of readdirSync(PASTA_LEIS)) {
  const lei = JSON.parse(readFileSync(join(PASTA_LEIS, arquivo), "utf8"));
  porNome.set(lei.nome, lei.id);
}

const planilha = lerPlanilha("docs/jogo/leis.xlsx");
const aba = (nome: string): Linha[] => planilha.get(nome) ?? [];
const ligacoes = aba("Programas - leis");

const sairam: string[] = [];
const leisFora: string[] = [];
const ambiguas = new Set<string>();
const programas = aba("Programas").flatMap((p) => {
  const nome = p["Programa"];
  const leis = ligacoes
    .filter((l) => l["Programa"] === nome)
    .flatMap((l) => {
      const lei = porNome.get(l["Lei"]);
      if (!lei) {
        leisFora.push(`${nome}: ${l["Lei"]}`);
        return [];
      }
      const direcao = l["Direção"];
      if (!/^(sobe|desce|liga)/.test(direcao)) ambiguas.add(direcao);
      return [
        { lei, direcao: direcaoDe(direcao), minimo: minimoDe(l["Mínimo"]) },
      ];
    });
  const [, minimo] = p["Forma-se com"].match(/^(\d+) de/) ?? [];
  if (leis.length < Number(minimo)) {
    sairam.push(`${nome}: ${leis.length} leis no jogo, pede ${minimo}`);
    return [];
  }
  return [
    {
      id: kebab(nome),
      nome,
      lado: p["Lado"],
      minimo: Number(minimo),
      palavras: {
        tema: p["Tema"],
        bem: p["Bem"],
        mal: p["Mal"],
        publico: p["Público"],
      },
      leis,
    },
  ];
});

writeFileSync(
  SAIDA,
  `${JSON.stringify({ versao: 1, origem: "planilha", programas }, null, 2)}\n`,
);
console.log(
  `Programas gravados: ${programas.length} de ${aba("Programas").length}`,
);
console.log(`Leis que não estão no jogo (${leisFora.length}):`, leisFora);
console.log(`Programas que ficaram de fora (${sairam.length}):`, sairam);
console.log("Direções fora de sobe, desce e liga (conferir):", [...ambiguas]);
