/**
 * População sintética (V1-08, desenho/populacao.md §3.2): monta os perfis do
 * eleitorado de um país por ajuste proporcional iterativo (IPF). Lê os
 * totais de cada atributo e as afinidades em `paises/<pais>/populacao.json`,
 * ajusta a tabela cruzada até cada total bater, corta os perfis pequenos,
 * ajusta de novo e grava `paises/<pais>/perfis.json`. O jogo só lê o
 * arquivo gerado.
 *
 * Uso: npm run populacao:gerar              (Brasil)
 *      npm run populacao:gerar -- outro-pais
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

type Totais = Record<
  string,
  { fonte: string; valores: Record<string, number> }
>;
type Afinidade = { se: Record<string, string>; fator: number; motivo: string };

const pais = process.argv[2] ?? "brasil";
const pasta = `src/conteudo/paises/${pais}`;
const populacao = JSON.parse(readFileSync(`${pasta}/populacao.json`, "utf8"));
const totais: Totais = populacao.totais;
const afinidades: Afinidade[] = populacao.afinidades ?? [];
/** Corte dos perfis pequenos, em fração do eleitorado. */
const CORTE = Number(process.argv[3] ?? 0.0001);

const atributos = Object.keys(totais);
const valores = atributos.map((a) => Object.keys(totais[a].valores));
const alvos = atributos.map((a, i) =>
  valores[i].map((v) => totais[a].valores[v]),
);
const tamanhos = valores.map((lista) => lista.length);
const celulas = tamanhos.reduce((n, t) => n * t, 1);

/** Índices de cada atributo da célula c (o último atributo varia mais rápido). */
function decompor(c: number): number[] {
  const out = new Array<number>(atributos.length);
  for (let i = atributos.length - 1; i >= 0; i--) {
    out[i] = c % tamanhos[i];
    c = Math.floor(c / tamanhos[i]);
  }
  return out;
}
const indices = Array.from({ length: celulas }, (_, c) => decompor(c));

// Semente: uniforme vezes os fatores das afinidades que a célula atende.
const regras = afinidades.map((a) => ({
  fator: a.fator,
  teste: Object.entries(a.se).map(([atributo, valor]) => {
    const i = atributos.indexOf(atributo);
    const j = valores[i]?.indexOf(valor) ?? -1;
    if (i < 0 || j < 0)
      throw new Error(`Afinidade com ${atributo}=${valor} desconhecido.`);
    return [i, j] as const;
  }),
}));
let peso = indices.map((ix) =>
  regras.reduce(
    (f, r) => (r.teste.every(([i, j]) => ix[i] === j) ? f * r.fator : f),
    1,
  ),
);

/** IPF: ajusta um atributo por vez até o maior erro ficar abaixo de 1e-9. */
function ajustar(pesos: number[]): {
  pesos: number[];
  voltas: number;
  erro: number;
} {
  const w = [...pesos];
  let erro = Infinity;
  let voltas = 0;
  while (erro > 1e-9 && voltas < 500) {
    voltas += 1;
    for (let i = 0; i < atributos.length; i++) {
      const soma = new Array<number>(tamanhos[i]).fill(0);
      for (let c = 0; c < w.length; c++) soma[indices[c][i]] += w[c];
      for (let c = 0; c < w.length; c++) {
        const j = indices[c][i];
        if (soma[j] > 0) w[c] *= alvos[i][j] / soma[j];
      }
    }
    erro = 0;
    const total = w.reduce((s, x) => s + x, 0);
    for (let i = 0; i < atributos.length; i++) {
      const soma = new Array<number>(tamanhos[i]).fill(0);
      for (let c = 0; c < w.length; c++) soma[indices[c][i]] += w[c] / total;
      for (let j = 0; j < tamanhos[i]; j++)
        erro = Math.max(erro, Math.abs(soma[j] - alvos[i][j]));
    }
  }
  return { pesos: w, voltas, erro };
}

const primeiro = ajustar(peso);
peso = primeiro.pesos.map((w) => (w < CORTE ? 0 : w));
const cortado = primeiro.pesos.reduce((s, w) => (w < CORTE ? s + w : s), 0);
const segundo = ajustar(peso);
const total = segundo.pesos.reduce((s, w) => s + w, 0);

// Peso com 7 casas; a sobra do arredondamento vai para o maior perfil.
const perfis = segundo.pesos
  .map((w, c) => ({ w: Math.round((w / total) * 1e7) / 1e7, c }))
  .filter((p) => p.w > 0)
  .sort((a, b) => b.w - a.w);
const sobra = 1 - perfis.reduce((s, p) => s + p.w, 0);
perfis[0].w = Math.round((perfis[0].w + sobra) * 1e7) / 1e7;

const saida = {
  tipo: "pais-perfis",
  gerado: `npm run populacao:gerar -- ${pais} (não edite à mão)`,
  metodo: `IPF sobre ${celulas} células; ${primeiro.voltas} voltas; corte de perfis abaixo de ${CORTE * 100}% (${(cortado * 100).toFixed(2)}% do eleitorado redistribuído); novo ajuste em ${segundo.voltas} voltas, maior erro ${segundo.erro.toExponential(1)}.`,
  atributos,
  valores: Object.fromEntries(atributos.map((a, i) => [a, valores[i]])),
  fontes: Object.fromEntries(atributos.map((a) => [a, totais[a].fonte])),
  perfis: perfis.map((p) => [p.w, ...indices[p.c]]),
};
// Um perfil por linha: o arquivo fica legível no diff.
const linhas = JSON.stringify({ ...saida, perfis: [] }, null, 2).replace(
  '"perfis": []',
  `"perfis": [\n${saida.perfis.map((p) => `    ${JSON.stringify(p)}`).join(",\n")}\n  ]`,
);
writeFileSync(`${pasta}/perfis.json`, `${linhas}\n`);
execSync(`npx prettier --write ${pasta}/perfis.json`, { stdio: "ignore" });
console.log(
  `${perfis.length} perfis de ${celulas} células; cortado ${(cortado * 100).toFixed(2)}%; erro ${segundo.erro.toExponential(1)}.`,
);
