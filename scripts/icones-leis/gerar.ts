// Gera os ícones (npm run icones [esfera]). Receita em .claude/skills/sisgov-icones.
//   - grava src/assets/svg/esferas/<esfera>.svg e src/assets/svg/leis/<esfera>/<lei>.svg;
//   - grava src/assets/svg/indices/<indice>.svg;
//   - soma as leis ao manifest-leis.json, as esferas ao manifest-esferas.json e os
//     índices ao manifest-indices.json;
//   - escreve a folha de contato docs/arte/folha-de-icones.html (só a esfera
//     pedida, se houver) e conta quantas leis faltam em cada esfera.
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { ESFERAS } from "./esferas";
import { INDICES } from "./indices";
import { svgDaEsfera, svgDaLei } from "./estilo";
import { LEIS_DESENHADAS } from "./leis";

const RAIZ = "src/assets/svg";
const PASTA_LEIS = "src/conteudo/mundo/leis";
const FOLHA = "docs/arte/folha-de-icones.html";
const VARIAVEIS = "src/conteudo/mundo/indicadores/variaveis.json";
/** Tinta da folha: a dos impostos e a das demais (a do jogo vem da bolha). */
const VERMELHO = "#9e2a2b";
const PRETO = "#252320";

interface Lei {
  id: string;
  nome: string;
  esfera: string;
}
interface Indice {
  id: string;
  nome: string;
  area: string;
}
interface Manifesto {
  version: number;
  base: string;
  icons: Record<string, { area: string; name: string; path: string }>;
}

const todas: Lei[] = readdirSync(PASTA_LEIS)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(`${PASTA_LEIS}/${f}`, "utf8")) as Lei);
const porId = new Map(todas.map((l) => [l.id, l]));
const indices = (
  JSON.parse(readFileSync(VARIAVEIS, "utf8")) as { variaveis: Indice[] }
).variaveis;

/** Lei fora da lista ou na esfera errada é erro: o desenho não pode se perder. */
function conferir() {
  const erros: string[] = [];
  for (const [esfera, leis] of Object.entries(LEIS_DESENHADAS)) {
    if (!ESFERAS[esfera]) erros.push(`esfera "${esfera}" não existe`);
    for (const id of Object.keys(leis)) {
      const lei = porId.get(id);
      if (!lei) erros.push(`lei "${id}" não existe`);
      else if (lei.esfera !== esfera)
        erros.push(`lei "${id}" é da esfera "${lei.esfera}", não "${esfera}"`);
    }
  }
  for (const i of indices)
    if (!INDICES[i.id]) erros.push(`índice "${i.id}" sem ícone`);
  for (const id of Object.keys(INDICES))
    if (!indices.some((i) => i.id === id))
      erros.push(`ícone de índice "${id}" não tem índice`);
  if (erros.length) throw new Error(erros.join("\n"));
}

function gravar(caminho: string, svg: string) {
  mkdirSync(dirname(caminho), { recursive: true });
  writeFileSync(caminho, svg + "\n");
}

function lerManifesto(arquivo: string, base: string): Manifesto {
  try {
    return JSON.parse(readFileSync(arquivo, "utf8")) as Manifesto;
  } catch {
    return { version: 1, base, icons: {} };
  }
}

function gravarTudo() {
  const esferas = lerManifesto(`${RAIZ}/manifest-esferas.json`, RAIZ);
  for (const [id, e] of Object.entries(ESFERAS)) {
    gravar(`${RAIZ}/esferas/${id}.svg`, svgDaEsfera(e.desenho));
    esferas.icons[id] = { area: id, name: e.nome, path: `esferas/${id}.svg` };
  }
  writeFileSync(
    `${RAIZ}/manifest-esferas.json`,
    JSON.stringify(esferas, null, 2) + "\n",
  );
  const manifestoIndices = lerManifesto(`${RAIZ}/manifest-indices.json`, RAIZ);
  for (const i of indices) {
    gravar(`${RAIZ}/indices/${i.id}.svg`, svgDaEsfera(INDICES[i.id]));
    manifestoIndices.icons[i.id] = {
      area: i.area,
      name: i.nome,
      path: `indices/${i.id}.svg`,
    };
  }
  writeFileSync(
    `${RAIZ}/manifest-indices.json`,
    JSON.stringify(manifestoIndices, null, 2) + "\n",
  );
  const leis = lerManifesto(`${RAIZ}/manifest-leis.json`, RAIZ);
  for (const [esfera, desenhos] of Object.entries(LEIS_DESENHADAS))
    for (const [id, desenho] of Object.entries(desenhos)) {
      const path = `leis/${esfera}/${id}.svg`;
      gravar(`${RAIZ}/${path}`, svgDaLei(desenho, ESFERAS[esfera].desenho));
      leis.icons[id] = { area: esfera, name: porId.get(id)!.nome, path };
    }
  writeFileSync(
    `${RAIZ}/manifest-leis.json`,
    JSON.stringify(leis, null, 2) + "\n",
  );
}

/** Um selo de papel com o ícone, em dois tamanhos (grande para o traço, pequeno para o mapa). */
function carta(svg: string, nome: string, tinta: string) {
  const selo = (px: number) =>
    `<span class="d" style="width:${px}px;height:${px}px;color:${tinta}">${svg.replace("<svg ", `<svg width="${px}" height="${px}" `)}</span>`;
  return `<figure>${selo(110)}${selo(44)}<figcaption>${nome}</figcaption></figure>`;
}

function folha(so?: string) {
  const ids = so ? [so] : Object.keys(ESFERAS);
  const secaoEsferas = ids.map((id) =>
    carta(svgDaEsfera(ESFERAS[id].desenho), ESFERAS[id].nome, PRETO),
  );
  const secoesLeis = ids
    .filter((id) => LEIS_DESENHADAS[id])
    .map((id) => {
      const tinta = id === "impostos" ? VERMELHO : PRETO;
      const cartas = Object.entries(LEIS_DESENHADAS[id]).map(([lei, d]) =>
        carta(svgDaLei(d, ESFERAS[id].desenho), porId.get(lei)!.nome, tinta),
      );
      return `<h2>${ESFERAS[id].nome}</h2><main>${cartas.join("")}</main>`;
    });
  const secaoIndices = so
    ? ""
    : `<h2>Índices</h2><main>${indices.map((i) => carta(svgDaEsfera(INDICES[i.id]), i.nome, PRETO)).join("")}</main>`;
  writeFileSync(
    FOLHA,
    `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Folha de ícones</title>
<style>
body{margin:0;padding:24px;background:#303331;color:#efe4cc;font:13px "Courier New",monospace}
h1{font:700 18px Georgia,serif;letter-spacing:.1em;text-transform:uppercase;color:#d4af37}
h2{font:700 14px Georgia,serif;letter-spacing:.1em;text-transform:uppercase;margin:26px 0 10px}
main{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px}
figure{margin:0;padding:12px;background:#1c1e21;border:1px solid #0a0b0c;display:grid;grid-template-columns:auto auto;justify-content:start;align-items:end;gap:14px}
.d{display:grid;place-items:center;border-radius:50%;background:#efe4cc;box-shadow:inset 0 0 0 3px #efe4cc,inset 0 0 0 4.5px currentColor,0 2px 6px rgba(0,0,0,.6)}
.d svg{width:78%;height:78%}
figcaption{grid-column:1/-1;font-size:12px;opacity:.85}
</style><h1>Ícones (npm run icones${so ? ` ${so}` : ""})</h1><h2>Esferas</h2><main>${secaoEsferas.join("")}</main>${secoesLeis.join("")}${secaoIndices}</html>`,
  );
}

/** Quantas leis de cada esfera ainda não têm desenho. */
function faltam(): string[] {
  return Object.keys(ESFERAS).flatMap((esfera) => {
    const total = todas.filter((l) => l.esfera === esfera).length;
    const feitas = Object.keys(LEIS_DESENHADAS[esfera] ?? {}).length;
    return feitas < total ? [`${esfera}: ${feitas}/${total}`] : [];
  });
}

const so = process.argv[2];
if (so && !ESFERAS[so]) throw new Error(`esfera "${so}" não existe`);
conferir();
gravarTudo();
folha(so);
const pendentes = faltam();
console.log(
  `${Object.keys(INDICES).length} índices, ${Object.keys(ESFERAS).length} esferas e ${Object.values(LEIS_DESENHADAS).flatMap(Object.keys).length} leis gravadas. Folha: ${FOLHA}`,
);
console.log(
  pendentes.length ? `Faltam:\n  ${pendentes.join("\n  ")}` : "Nenhuma falta.",
);
