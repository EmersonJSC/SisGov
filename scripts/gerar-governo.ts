// Gera src/conteudo/paises/<id>/governo.json: ministérios do país (aba
// Ministérios - países), pessoas inventadas com ficha e quem manda em cada
// caixa. Roda com `npm run governo -- <id> "<País na planilha>"`. Mesma
// semente, mesmo governo. Nomes são inventados: conferir antes de mostrar.
import { readFileSync, writeFileSync } from "node:fs";
import { motivoGovernoInvalido, type Ficha, type Molde } from "../src/motor";
import { lerPlanilha } from "./xlsx";

const [id = "brasil-2026", nomeNaPlanilha = "Brasil"] = process.argv.slice(2);
const PASTA = `src/conteudo/paises/${id}`;
const SEMENTE = 20261112;
const PESSOAS_POR_PARTIDO = 3;
const TECNICOS = 24;

const NOTA_MINIMA = 25;
const NOTA_MAXIMA = 90;
const BUSSOLA_MAXIMA = 0.7;

const nomes = [
  "Adalberto",
  "Alice",
  "Bruno",
  "Beatriz",
  "Caio",
  "Camila",
  "Daniel",
  "Diana",
  "Eduardo",
  "Elisa",
  "Fabio",
  "Flavia",
  "Gael",
  "Helena",
  "Heitor",
  "Irene",
  "Jonas",
  "Julia",
  "Kleber",
  "Laura",
  "Mateus",
  "Marina",
  "Nelson",
  "Olivia",
  "Paulo",
  "Rafaela",
  "Samuel",
  "Tereza",
  "Vitor",
  "Yara",
];
const silabas = [
  "val",
  "mor",
  "tre",
  "san",
  "dri",
  "kel",
  "bor",
  "nez",
  "lar",
  "quin",
  "ves",
  "tan",
  "mir",
  "gal",
  "ros",
  "pen",
  "dol",
  "fer",
  "zan",
  "cor",
  "lis",
  "bra",
];
const finais = [
  "a",
  "o",
  "i",
  "ez",
  "ini",
  "ado",
  "eira",
  "ola",
  "ense",
  "ardo",
];

/** Gerador de números repetível (mulberry32). */
function semear(semente: number) {
  let a = semente;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const sorte = semear(SEMENTE);
const entre = (min: number, max: number) =>
  Math.round(min + sorte() * (max - min));
const um = <T>(lista: T[]): T => lista[Math.floor(sorte() * lista.length)];
const bussola = () => ({
  economico: +(sorte() * 2 * BUSSOLA_MAXIMA - BUSSOLA_MAXIMA).toFixed(2),
  social: +(sorte() * 2 * BUSSOLA_MAXIMA - BUSSOLA_MAXIMA).toFixed(2),
});

const usados = new Set<string>();
function nome(): string {
  const sobre = `${um(silabas)}${um(silabas)}${um(finais)}`;
  const completo = `${um(nomes)} ${sobre[0].toUpperCase()}${sobre.slice(1)}`;
  if (usados.has(completo)) return nome();
  usados.add(completo);
  return completo;
}

const congresso = JSON.parse(
  readFileSync(`${PASTA}/congresso.json`, "utf8"),
) as {
  governo: string;
  coligacao: string[];
  partidos: { id: string }[];
};
const moldes = (
  JSON.parse(
    readFileSync("src/conteudo/mundo/ministerios/moldes.json", "utf8"),
  ) as { moldes: Molde[] }
).moldes;

// ---- ministérios do país
const linha = (
  lerPlanilha("docs/jogo/leis.xlsx").get("Ministérios - países") ?? []
).find((l) => l["País"] === nomeNaPlanilha);
if (!linha)
  throw new Error(`a aba Ministérios - países não tem "${nomeNaPlanilha}"`);
const semNota = (s: string) => s.replace(/\s*\(.*\)\s*$/, "").trim();
const pedidos = linha["Ministérios hoje (moldes da aba Ministérios)"]
  .split(";")
  .map(semNota);
const escolhidos = pedidos.map((p) => {
  const achados = moldes.filter((m) => m.nome === p);
  const prefixo = moldes.filter((m) => m.nome.startsWith(p));
  const molde =
    achados.length === 1
      ? achados[0]
      : prefixo.length === 1
        ? prefixo[0]
        : null;
  if (!molde) throw new Error(`molde "${p}" não achado ou ambíguo`);
  return molde;
});

// ---- pessoas: algumas de cada partido, mais técnicos
function ficha(idPessoa: string, origem: string): Ficha {
  const tecnico = origem === "tecnico";
  return {
    id: idPessoa,
    nome: nome(),
    competencia: entre(tecnico ? 55 : NOTA_MINIMA + 10, NOTA_MAXIMA),
    habilidade: entre(NOTA_MINIMA + 5, NOTA_MAXIMA),
    carisma: entre(NOTA_MINIMA, NOTA_MAXIMA),
    honestidade: entre(NOTA_MINIMA, NOTA_MAXIMA),
    lealdade: entre(tecnico ? 50 : 40, NOTA_MAXIMA),
    bussola: bussola(),
    origem,
  };
}
let contador = 0;
const proximoId = () => `p${String(++contador).padStart(3, "0")}`;
const pessoas: Ficha[] = [
  ...congresso.partidos.flatMap((p) =>
    Array.from({ length: PESSOAS_POR_PARTIDO }, () => ficha(proximoId(), p.id)),
  ),
  ...Array.from({ length: TECNICOS }, () => ficha(proximoId(), "tecnico")),
];

// ---- quem manda em cada caixa: o gabinete é do governo; o resto alterna entre
// a base (um partido por vez) e técnicos
const rodizio = [
  ...congresso.coligacao.filter((p) => p !== congresso.governo),
  congresso.governo,
];
const livre = (origem: string) =>
  pessoas.find((p) => p.origem === origem && !tomados.has(p.id)) as Ficha;
const tomados = new Set<string>();
const ministerios = escolhidos.map((m, i) => {
  const origem = m.sobra
    ? congresso.governo
    : i % 2 === 0
      ? "tecnico"
      : rodizio[Math.floor(i / 2) % rodizio.length];
  const quem = livre(origem) ?? livre("tecnico");
  tomados.add(quem.id);
  return { molde: m.id, ministro: quem.id };
});

const governo = {
  versao: 1,
  leis: { cargos: "cargos-de-livre-nomeacao" },
  ministerios,
  pessoas,
};
const motivo = motivoGovernoInvalido(
  { moldes, pessoas },
  governo,
  congresso.partidos.map((p) => p.id),
);
if (motivo) throw new Error(`governo inválido: ${motivo}`);
writeFileSync(`${PASTA}/governo.json`, `${JSON.stringify(governo, null, 2)}\n`);
console.log(
  `${ministerios.length} ministérios, ${pessoas.length} pessoas em ${PASTA}/governo.json`,
);
