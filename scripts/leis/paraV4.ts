/**
 * Passa leis do formato v2 ou v3 para o molde v4 (molde-das-leis.md) sem
 * mudar nenhum número: os efeitos (na v2, arquivos em mundo/consequencias)
 * entram na lei com o mesmo id, origem, mecanismo, parâmetros, atraso e
 * unidade. Os arquivos antigos vão para src/conteudo/_arquivo-leis-antigas/.
 * A trava das constitucionais, se o arquivo de dados não trouxer, sai das
 * leis que já dependem delas (requer, dependeDe e pisoPorLei).
 * Uso: npx vite-node scripts/leis/paraV4.ts scripts/leis/molde/<area>.json
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

type Edicao = {
  id: string;
  familia: string;
  decide: string;
  nome?: string;
  exemplo?: string;
  opcoes?: Record<string, string>;
  trava?: Trava[];
  dinheiro?: Record<string, unknown>;
  publico?: { quem: string; pessoas: number };
};
type Trava = {
  opcao: string;
  lei: string;
  minimo?: number;
  proibe?: true;
  opcoes?: string[];
};
type Json = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const RAIZ = join(import.meta.dirname, "..", "..");
const CONTEUDO = join(RAIZ, "src/conteudo");
const ARQUIVO = join(CONTEUDO, "_arquivo-leis-antigas/consequencias");
const ler = (p: string): Json => JSON.parse(readFileSync(p, "utf8"));
const gravar = (p: string, v: unknown) =>
  writeFileSync(p, JSON.stringify(v, null, 2) + "\n");

function nivelDe(processo: string): { nivel: string; petrea?: true } {
  if (processo === "clausula-petrea")
    return { nivel: "constituicao", petrea: true };
  if (processo === "emenda-constitucional") return { nivel: "constituicao" };
  if (processo === "decreto" || processo === "execucao-programa-autorizado")
    return { nivel: "decreto" };
  return { nivel: "lei" };
}

const lista = (r: unknown): Json[] =>
  r === undefined ? [] : ((Array.isArray(r) ? r : [r]) as Json[]);

/** O que as outras leis já dizem que depende desta (para a trava). */
export function travasDerivadas(mae: Json, todas: readonly Json[]): Trava[] {
  const opcoesDaMae: string[] = (mae.controle.opcoes ?? []).map(
    (o: Json) => o.id,
  );
  const travas: Trava[] = [];
  for (const filha of todas) {
    if (filha.id === mae.id) continue;
    for (const r of [...lista(filha.requer), ...lista(filha.dependeDe)])
      if (r.lei === mae.id)
        for (const x of opcoesDaMae)
          if (!r.opcoes.includes(x))
            travas.push({ opcao: x, lei: filha.id, proibe: true });
    const porOpcao = new Map<string, string[]>();
    for (const o of filha.controle.opcoes ?? [])
      for (const r of lista(o.requer))
        if (r.lei === mae.id)
          for (const x of opcoesDaMae)
            if (!r.opcoes.includes(x))
              porOpcao.set(x, [...(porOpcao.get(x) ?? []), o.id]);
    for (const [x, opcoes] of porOpcao)
      travas.push({ opcao: x, lei: filha.id, opcoes });
    const piso = filha.controle.pisoPorLei;
    if (piso?.lei === mae.id)
      for (const m of piso.minimos ?? [])
        if (m.valor > 0)
          travas.push({ opcao: m.opcao, lei: filha.id, minimo: m.valor });
  }
  return travas;
}

function efeitosDaV2(lei: Json, consequencias: Json[]): Json[] {
  const variavel = lei.controle.variavel;
  return consequencias.map((c) => ({
    id: c.id,
    alvo: c.alvo,
    ...(c.origem !== variavel ? { origem: c.origem } : {}),
    mecanismo: c.mecanismo,
    parametros: c.parametros,
    atraso: c.atrasoPassos,
    ...(c.duracao && c.duracao.modo !== "continuo"
      ? { duracao: c.duracao }
      : {}),
    ...(c.normalizacao ? { normalizacao: c.normalizacao } : {}),
    ...(c.leitura ? { leitura: c.leitura } : {}),
    ...(c.escala ? { escala: c.escala } : {}),
    unidade: c.unidade,
  }));
}

export function paraV4(
  lei: Json,
  efeitos: Json[],
  e: Edicao,
  area: string,
  trava: Trava[],
): Json {
  const opcoes = (lei.controle.opcoes ?? [])
    .filter((o: Json) => !e.opcoes || o.id in e.opcoes)
    .map((o: Json) => ({ ...o, propoe: e.opcoes?.[o.id] ?? "" }));
  const v3 = lei.versaoEsquema === 3;
  const dinheiro =
    e.dinheiro ??
    (v3
      ? lei.dinheiro
      : lei.tributo
        ? { tipo: "receita", ...lei.tributo }
        : lei.orcamento
          ? { tipo: "gasto", ...lei.orcamento }
          : undefined);
  const nivel = v3
    ? { nivel: lei.nivel, ...(lei.petrea ? { petrea: true } : {}) }
    : nivelDe(lei.processoAutorizacao);
  const implantacao = v3
    ? lei.implantacao
    : lei.respostaTemporal && {
        entrada: lei.respostaTemporal.implantacao,
        saida: lei.respostaTemporal.degradacao,
      };
  const dependeDe = v3 ? lei.dependeDe : lei.requer && lista(lei.requer);
  return {
    id: lei.id,
    tipo: "lei",
    versaoEsquema: 4,
    familia: e.familia,
    nome: e.nome ?? lei.nome,
    decide: e.decide,
    ...(e.familia === "petrea" ? {} : { area }),
    ...(e.exemplo ? { exemplo: e.exemplo } : {}),
    ...nivel,
    ...(lei.revogavel !== undefined ? { revogavel: lei.revogavel } : {}),
    controle: { ...lei.controle, ...(opcoes.length ? { opcoes } : {}) },
    ...(dinheiro ? { dinheiro } : {}),
    ...(e.publico ? { publico: e.publico } : {}),
    ...(trava.length ? { trava } : {}),
    ...(implantacao ? { implantacao } : {}),
    ...(lei.implantacaoTurnos
      ? { implantacaoTurnos: lei.implantacaoTurnos }
      : {}),
    ...(lei.mae ? { mae: lei.mae } : {}),
    ...(dependeDe?.length ? { dependeDe } : {}),
    // na v3, `requer` são características do país (não leis)
    ...(v3 && lei.requer ? { requer: lei.requer } : {}),
    ...(lei.mesa ? { mesa: lei.mesa } : {}),
    ...(lei.vinculos ? { vinculos: lei.vinculos } : {}),
    ...(lei.excludentes ? { excludentes: lei.excludentes } : {}),
    ...(lei.custoPolitico ? { custoPolitico: lei.custoPolitico } : {}),
    ...(lei.populacao ? { populacao: lei.populacao } : {}),
    ...(lei.historia ? { historia: lei.historia } : {}),
    ...(lei.fontes ? { fontes: lei.fontes } : {}),
    efeitos,
  };
}

const CAMPOS_V2 = [
  "id",
  "tipo",
  "versaoEsquema",
  "grupo",
  "nome",
  "descricao",
  "area",
  "ministerio",
  "processoAutorizacao",
  "nivelLegal",
  "controle",
  "tributo",
  "orcamento",
  "respostaTemporal",
  "implantacaoTurnos",
  "mae",
  "requer",
  "mesa",
  "vinculos",
  "consequencias",
  "revogavel",
];
const CAMPOS_V3 = [
  "id",
  "tipo",
  "versaoEsquema",
  "grupo",
  "nome",
  "descricao",
  "area",
  "ministerio",
  "nivel",
  "petrea",
  "revogavel",
  "controle",
  "custoPolitico",
  "dinheiro",
  "implantacao",
  "dependeDe",
  "mesa",
  "vinculos",
  "excludentes",
  "requer",
  "efeitos",
  "populacao",
  "historia",
  "fontes",
  "mae",
  "implantacaoTurnos",
];

if (process.argv[2]) {
  const dados = ler(join(RAIZ, process.argv[2])) as {
    area: string;
    leis: Edicao[];
  };
  const pasta = join(CONTEUDO, "mundo/leis");
  const todas = readdirSync(pasta).map((f) => ler(join(pasta, f)));
  const mundoPath = join(CONTEUDO, "mundo/mundo.json");
  const mundo = ler(mundoPath);
  mkdirSync(ARQUIVO, { recursive: true });
  for (const e of dados.leis) {
    const path = join(pasta, `${e.id}.json`);
    const lei = ler(path);
    if (lei.versaoEsquema === 4) {
      console.log(`${e.id}: já está no molde, pulei`);
      continue;
    }
    const campos = lei.versaoEsquema === 3 ? CAMPOS_V3 : CAMPOS_V2;
    const extras = Object.keys(lei).filter((k) => !campos.includes(k));
    if (extras.length)
      throw new Error(`${e.id}: campos sem destino: ${extras}`);
    const trava =
      e.trava ??
      (e.familia === "constitucional" ? travasDerivadas(lei, todas) : []);
    if (e.familia === "constitucional" && trava.length === 0) {
      console.log(`${e.id}: SEM TRAVA, ficou no formato antigo`);
      continue;
    }
    let efeitos: Json[];
    let caminhos: string[] = [];
    if (lei.versaoEsquema === 3) efeitos = lei.efeitos;
    else {
      caminhos = (lei.consequencias as string[]).map(
        (c) => `mundo/consequencias/${c}.json`,
      );
      efeitos = efeitosDaV2(
        lei,
        caminhos.map((c) => ler(join(CONTEUDO, c))),
      );
    }
    if (efeitos.length === 0) {
      console.log(`${e.id}: SEM EFEITO, ficou no formato antigo`);
      continue;
    }
    gravar(path, paraV4(lei, efeitos, e, dados.area, trava));
    const fora = new Set(caminhos);
    mundo.consequencias = (mundo.consequencias as string[]).filter(
      (c) => !fora.has(c),
    );
    for (const c of caminhos) {
      const destino = join(ARQUIVO, c.split("/").at(-1)!);
      if (!existsSync(destino)) renameSync(join(CONTEUDO, c), destino);
    }
    console.log(
      `${e.id}: v4 com ${efeitos.length} efeitos${trava.length ? `, ${trava.length} travas` : ""}`,
    );
  }
  gravar(mundoPath, mundo);
}
