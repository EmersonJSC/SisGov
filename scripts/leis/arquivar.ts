/**
 * Tira leis do jogo sem apagar nada (molde-das-leis.md, seção 4): a lei e os
 * seus efeitos vão para src/conteudo/_arquivo-leis-antigas/, e ela sai do
 * catálogo, dos ministérios, do estado inicial dos países, da bússola, dos
 * programas de governo e das exigências, mães, travas e vínculos das outras
 * leis. No fim, lista onde o id ainda aparece no código, para revisar.
 * Uso: npx vite-node scripts/leis/arquivar.ts <id> [<id> ...]
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

type Json = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const RAIZ = join(import.meta.dirname, "..", "..");
const C = join(RAIZ, "src/conteudo");
const ARQ = join(C, "_arquivo-leis-antigas");
const ler = (p: string): Json => JSON.parse(readFileSync(join(C, p), "utf8"));
const gravar = (p: string, v: unknown) =>
  writeFileSync(join(C, p), JSON.stringify(v, null, 2) + "\n");
const lista = (r: unknown): Json[] =>
  r === undefined ? [] : ((Array.isArray(r) ? r : [r]) as Json[]);

export function semReferencias(lei: Json, fora: ReadonlySet<string>): Json {
  const tira = (r: unknown) => lista(r).filter((x) => !fora.has(x.lei));
  const nova: Json = { ...lei };
  if (lei.requer && !Array.isArray(lei.requer) && lei.requer.lei) {
    const r = tira(lei.requer);
    if (r.length === 0) delete nova.requer;
  } else if (Array.isArray(lei.requer) && lei.requer.some((x: Json) => x.lei))
    nova.requer = tira(lei.requer);
  if (lei.dependeDe) nova.dependeDe = tira(lei.dependeDe);
  if (nova.dependeDe?.length === 0) delete nova.dependeDe;
  if (lei.trava) nova.trava = tira(lei.trava);
  if (nova.trava?.length === 0) delete nova.trava;
  if (lei.vinculos) nova.vinculos = tira(lei.vinculos);
  if (nova.vinculos?.length === 0) delete nova.vinculos;
  if (lei.excludentes)
    nova.excludentes = lei.excludentes.filter((x: string) => !fora.has(x));
  if (lei.mae?.leis?.some((x: string) => fora.has(x))) {
    const leis = lei.mae.leis.filter((x: string) => !fora.has(x));
    if (leis.length) nova.mae = { ...lei.mae, leis };
    else delete nova.mae;
  }
  if (lei.controle?.opcoes)
    nova.controle = {
      ...lei.controle,
      opcoes: lei.controle.opcoes.map((o: Json) => {
        if (!o.requer) return o;
        const requer = tira(o.requer);
        const { requer: _r, ...resto } = o; // eslint-disable-line @typescript-eslint/no-unused-vars
        return requer.length ? { ...resto, requer } : resto;
      }),
    };
  return nova;
}

if (process.argv.length > 2) {
  const ids = process.argv.slice(2);
  const fora = new Set(ids);
  mkdirSync(join(ARQ, "leis"), { recursive: true });
  mkdirSync(join(ARQ, "consequencias"), { recursive: true });
  const variaveis = new Set<string>();

  const cat = ler("mundo/catalogo-leis.json");
  const mundo = ler("mundo/mundo.json");
  for (const id of ids) {
    const arquivo = existsSync(join(C, `mundo/leis/${id}.json`))
      ? `mundo/leis/${id}.json`
      : `_arquivo-leis-antigas/leis/${id}.json`;
    const lei = ler(arquivo);
    variaveis.add(lei.controle.variavel);
    cat.politicas = cat.politicas.filter(
      (p: string) => p !== `mundo/leis/${id}.json`,
    );
    const caminhos = (lei.consequencias ?? []).map(
      (c: string) => `mundo/consequencias/${c}.json`,
    );
    mundo.consequencias = mundo.consequencias.filter(
      (c: string) => !caminhos.includes(c),
    );
    for (const c of caminhos)
      if (existsSync(join(C, c)))
        renameSync(
          join(C, c),
          join(ARQ, "consequencias", c.split("/").at(-1)!),
        );
    if (arquivo.startsWith("mundo/"))
      renameSync(join(C, arquivo), join(ARQ, "leis", `${id}.json`));
    console.log(`arquivada: ${id} (${caminhos.length} efeitos)`);
  }
  // Efeitos de outras bolhas sobre a eficácia da lei que saiu.
  const eficacia = new Set(ids.map((id) => `eficacia:${id}`));
  for (const c of [...mundo.consequencias] as string[]) {
    if (!existsSync(join(C, c))) continue;
    if (!eficacia.has(ler(c).alvo)) continue;
    mundo.consequencias = mundo.consequencias.filter((x: string) => x !== c);
    renameSync(join(C, c), join(ARQ, "consequencias", c.split("/").at(-1)!));
    console.log(`efeito na eficácia arquivado: ${c}`);
  }
  gravar("mundo/catalogo-leis.json", cat);
  gravar("mundo/mundo.json", mundo);

  // Grupos de pressão que acompanhavam a lei.
  const semLei = (o: unknown): unknown => {
    if (Array.isArray(o))
      return o
        .filter(
          (x) => !(x && typeof x === "object" && fora.has((x as Json).lei)),
        )
        .map(semLei);
    if (o && typeof o === "object")
      return Object.fromEntries(
        Object.entries(o).map(([k, v]) => [k, semLei(v)]),
      );
    return o;
  };
  gravar("mundo/pressao.json", semLei(ler("mundo/pressao.json")));

  const pol = ler("paises/brasil/politica.json");
  for (const m of pol.ministerios.ministerios)
    m.leis = m.leis.filter((l: string) => !fora.has(l));
  gravar("paises/brasil/politica.json", pol);

  for (const p of ["paises/brasil/leis.json", "testes/pais-minimo/leis.json"]) {
    if (!existsSync(join(C, p))) continue;
    const b = ler(p);
    for (const v of variaveis) delete b.controles?.[v];
    if (Array.isArray(b.emVigor))
      b.emVigor = b.emVigor.filter(
        (x: Json | string) => !fora.has(typeof x === "string" ? x : x.lei),
      );
    gravar(p, b);
  }

  const bus = ler("mundo/bussola.json");
  for (const id of ids) delete bus.leis[id];
  gravar("mundo/bussola.json", bus);

  const vars = ler("mundo/indicadores/variaveis.json");
  vars.variaveis = vars.variaveis.filter((v: Json) => !variaveis.has(v.id));
  gravar("mundo/indicadores/variaveis.json", vars);

  const prog = ler("bussola/programas.json");
  let linhas = 0;
  const limpa = (o: unknown): unknown => {
    if (Array.isArray(o))
      return o
        .filter((x) => {
          const sai = x && typeof x === "object" && fora.has((x as Json).lei);
          if (sai) linhas++;
          return !sai;
        })
        .map(limpa);
    if (o && typeof o === "object")
      return Object.fromEntries(
        Object.entries(o).map(([k, v]) => [k, limpa(v)]),
      );
    return o;
  };
  gravar("bussola/programas.json", limpa(prog));
  console.log(`programas: ${linhas} linhas tiradas`);

  for (const f of readdirSync(join(C, "mundo/leis"))) {
    const p = `mundo/leis/${f}`;
    const antes = readFileSync(join(C, p), "utf8");
    const nova = semReferencias(JSON.parse(antes), fora);
    if (JSON.stringify(nova) !== JSON.stringify(JSON.parse(antes))) {
      gravar(p, nova);
      console.log(`referência tirada em: ${f}`);
    }
  }

  const resto = execSync(
    `grep -rlE "${[...ids, ...variaveis].join("|")}" src --include=*.ts --include=*.tsx --include=*.json | grep -v _arquivo-leis-antigas || true`,
    { cwd: RAIZ, encoding: "utf8" },
  ).trim();
  if (resto) console.log(`ainda aparece em:\n${resto}`);
}
