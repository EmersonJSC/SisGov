/**
 * Passa leis do formato v2 para o molde v4 (molde-das-leis.md) sem mudar
 * nenhum número: os efeitos (arquivos em mundo/consequencias) entram na lei
 * com o mesmo id, origem, mecanismo, parâmetros, atraso e unidade. Os
 * arquivos antigos vão para src/conteudo/_arquivo-leis-antigas/consequencias/.
 * Uso: npx vite-node scripts/leis/paraV4.ts scripts/leis/molde/<area>.json
 */
import {
  existsSync,
  mkdirSync,
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
  trava?: unknown[];
  dinheiro?: Record<string, unknown>;
  publico?: { quem: string; pessoas: number };
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

export function paraV4(
  lei: Json,
  efeitosV2: Json[],
  e: Edicao,
  area: string,
): Json {
  const variavel = lei.controle.variavel;
  const efeitos = efeitosV2.map((c) => ({
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
  const opcoes = (lei.controle.opcoes ?? [])
    .filter((o: Json) => !e.opcoes || o.id in e.opcoes)
    .map((o: Json) => ({ ...o, propoe: e.opcoes?.[o.id] ?? "" }));
  const dinheiro =
    e.dinheiro ??
    (lei.tributo
      ? { tipo: "receita", ...lei.tributo }
      : lei.orcamento
        ? { tipo: "gasto", ...lei.orcamento }
        : undefined);
  return {
    id: lei.id,
    tipo: "lei",
    versaoEsquema: 4,
    familia: e.familia,
    nome: e.nome ?? lei.nome,
    decide: e.decide,
    ...(e.familia === "petrea" ? {} : { area }),
    ...(e.exemplo ? { exemplo: e.exemplo } : {}),
    ...nivelDe(lei.processoAutorizacao),
    ...(lei.revogavel !== undefined ? { revogavel: lei.revogavel } : {}),
    controle: { ...lei.controle, ...(opcoes.length ? { opcoes } : {}) },
    ...(dinheiro ? { dinheiro } : {}),
    ...(e.publico ? { publico: e.publico } : {}),
    ...(e.trava ? { trava: e.trava } : {}),
    ...(lei.respostaTemporal
      ? {
          implantacao: {
            entrada: lei.respostaTemporal.implantacao,
            saida: lei.respostaTemporal.degradacao,
          },
        }
      : {}),
    ...(lei.implantacaoTurnos
      ? { implantacaoTurnos: lei.implantacaoTurnos }
      : {}),
    ...(lei.mae ? { mae: lei.mae } : {}),
    ...(lei.requer ? { dependeDe: [lei.requer].flat() } : {}),
    ...(lei.mesa ? { mesa: lei.mesa } : {}),
    ...(lei.vinculos ? { vinculos: lei.vinculos } : {}),
    efeitos,
  };
}

if (process.argv[2]) {
  const dados = ler(join(RAIZ, process.argv[2])) as {
    area: string;
    leis: Edicao[];
  };
  const mundoPath = join(CONTEUDO, "mundo/mundo.json");
  const mundo = ler(mundoPath);
  mkdirSync(ARQUIVO, { recursive: true });
  for (const e of dados.leis) {
    const path = join(CONTEUDO, `mundo/leis/${e.id}.json`);
    const lei = ler(path);
    if (lei.versaoEsquema !== 2) {
      console.log(`${e.id}: já está no formato ${lei.versaoEsquema}, pulei`);
      continue;
    }
    const caminhos = (lei.consequencias as string[]).map(
      (c) => `mundo/consequencias/${c}.json`,
    );
    const efeitos = caminhos.map((c) => ler(join(CONTEUDO, c)));
    const extras = Object.keys(lei).filter(
      (k) =>
        ![
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
        ].includes(k),
    );
    if (extras.length)
      throw new Error(`${e.id}: campos sem destino: ${extras}`);
    gravar(path, paraV4(lei, efeitos, e, dados.area));
    const fora = new Set(caminhos);
    mundo.consequencias = (mundo.consequencias as string[]).filter(
      (c) => !fora.has(c),
    );
    for (const c of caminhos) {
      const destino = join(ARQUIVO, c.split("/").at(-1)!);
      if (!existsSync(destino)) renameSync(join(CONTEUDO, c), destino);
    }
    console.log(`${e.id}: v4 com ${efeitos.length} efeitos`);
  }
  gravar(mundoPath, mundo);
}
