/**
 * Ligações dos 9 segmentos novos (V1-08, desenho/populacao.md §4). Cada
 * regra diz de onde o segmento recebe e de qual segmento antigo copia a
 * ligação (mecanismo, coeficiente, atraso), na ordem de preferência. Índice
 * sem ligação para copiar recebe ±0,3 pelo sentido dele (maior_melhor sobe a
 * satisfação; maior_pior desce). Lei sem ligação para copiar fica de fora e
 * aparece no relatório. Rodar de novo regrava os mesmos arquivos.
 *
 * Uso: npm run populacao:ligacoes
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

type Regra = {
  segmento: string;
  /** Leis (id) e índices (id da bolha). */
  leis: string[];
  indices: string[];
  /** Segmentos antigos de onde copiar, na ordem. */
  copia: string[];
  /** Multiplica o coeficiente copiado das leis (Católicos: metade). */
  fator?: number;
};

const COSTUMES = [
  "aborto",
  "lei-de-drogas",
  "cannabis-legal",
  "casamento-e-uniao-civil",
  "educacao-domiciliar",
  "laicidade-do-estado",
];
const AMBIENTE = [
  "codigo-florestal",
  "licenciamento-ambiental",
  "precificacao-carbono",
  "matriz-energetica",
  "energia-nuclear",
  "regime-do-petroleo-e-mineracao",
  "agrotoxicos",
  "terras-indigenas",
];

const REGRAS: Regra[] = [
  {
    segmento: "grupo_ricos",
    leis: [
      "imposto-grandes-fortunas",
      "imposto-heranca",
      "tributacao-dividendos",
      "imposto-renda-pessoas",
    ],
    indices: ["risco_pais", "taxa_juros"],
    copia: ["grupo_empresarios"],
  },
  {
    segmento: "grupo_informais",
    leis: [
      "trabalho-por-aplicativo",
      "legislacao-trabalhista",
      "transferencia-de-renda",
    ],
    indices: ["desemprego", "informalidade", "renda_familias"],
    copia: ["grupo_pobres", "grupo_trabalhadores"],
  },
  {
    segmento: "grupo_agricultura_familiar",
    leis: [
      "reforma-agraria",
      "previdencia-rural",
      "seguranca-alimentar",
      "agrotoxicos",
    ],
    indices: ["producao_agropecuaria", "estiagem"],
    copia: ["grupo_pobres", "grupo_agro"],
  },
  {
    segmento: "grupo_familias_com_filhos",
    leis: [
      "escola-tempo-integral",
      "licenca-parental",
      "transferencia-de-renda",
      "politica-de-natalidade",
    ],
    indices: ["aprendizagem", "preco_alimentos"],
    copia: ["grupo_classe_media", "grupo_pobres"],
  },
  {
    segmento: "grupo_evangelicos",
    leis: COSTUMES,
    indices: [],
    copia: ["grupo_conservadores"],
  },
  {
    segmento: "grupo_catolicos",
    leis: COSTUMES,
    indices: ["pobreza"],
    copia: ["grupo_conservadores", "grupo_pobres"],
    fator: 0.5,
  },
  {
    segmento: "grupo_ambientalistas",
    leis: AMBIENTE,
    indices: ["desmatamento", "emissoes", "queimadas"],
    copia: ["grupo_progressistas"],
  },
  {
    segmento: "grupo_periferias",
    leis: [
      "policias-dos-estados",
      "cameras-corporais",
      "transporte-publico",
      "programa-habitacao-popular",
    ],
    indices: [
      "violencia_letal",
      "mobilidade_urbana",
      "infraestrutura_saneamento",
    ],
    copia: ["grupo_pobres", "grupo_trabalhadores", "grupo_jovens"],
  },
  {
    segmento: "grupo_interior",
    leis: [
      "investimento-em-infraestrutura",
      "incentivos-fiscais-regionais",
      "programa-medicos-no-interior",
    ],
    indices: ["producao_agropecuaria", "desigualdade_regional"],
    copia: ["grupo_agro", "grupo_trabalhadores"],
  },
];

const RAIZ = "src/conteudo";
const ler = (path: string) =>
  JSON.parse(readFileSync(`${RAIZ}/${path}`, "utf8"));
const gravar = (path: string, json: unknown) =>
  writeFileSync(`${RAIZ}/${path}`, `${JSON.stringify(json, null, 2)}\n`);
const hifen = (id: string) => id.replaceAll("_", "-");

const mundo = ler("mundo/mundo.json");
const variaveis = new Map<string, { avaliacao?: string }>(
  ler("mundo/indicadores/variaveis.json").variaveis.map((v: { id: string }) => [
    v.id,
    v,
  ]),
);
const leiPorId = new Map<string, { path: string; controle: string }>();
for (const path of ler("mundo/catalogo-leis.json").politicas as string[]) {
  const lei = ler(path);
  leiPorId.set(lei.id, { path, controle: lei.controle.variavel });
}
type Consequencia = Record<string, unknown> & {
  id: string;
  origem: string;
  alvo: string;
  parametros: Record<string, number>;
};
const existentes: Consequencia[] = (mundo.consequencias as string[]).map(ler);
const ligacao = (origem: string, alvo: string) =>
  existentes.find((c) => c.origem === origem && c.alvo === alvo);

const gravados: string[] = [];
const faltam: string[] = [];
const escrever = (
  base: Consequencia,
  id: string,
  alvo: string,
  fator: number,
) => {
  const nova: Consequencia = {
    ...base,
    id,
    alvo,
    parametros: {
      ...base.parametros,
      ...(base.parametros.coeficiente !== undefined
        ? {
            coeficiente:
              Math.round(base.parametros.coeficiente * fator * 1e6) / 1e6,
          }
        : {}),
    },
  };
  const path = `mundo/consequencias/${id}.json`;
  gravar(path, nova);
  if (!(mundo.consequencias as string[]).includes(path))
    (mundo.consequencias as string[]).push(path);
  gravados.push(`${RAIZ}/${path}`);
};

for (const regra of REGRAS) {
  const fator = regra.fator ?? 1;
  const nome = hifen(regra.segmento);
  for (const leiId of regra.leis) {
    const lei = leiPorId.get(leiId);
    if (!lei) throw new Error(`Lei desconhecida: ${leiId}`);
    const fonte = regra.copia
      .map((s) => ligacao(lei.controle, s))
      .find((c) => c !== undefined);
    if (!fonte) {
      faltam.push(
        `${regra.segmento} ← ${leiId} (nenhum de ${regra.copia.join(", ")} tem ligação)`,
      );
      continue;
    }
    const id = `${leiId}--${nome}`;
    escrever(fonte, id, regra.segmento, fator);
    const arquivo = ler(lei.path);
    if (!arquivo.consequencias.includes(id)) {
      arquivo.consequencias.push(id);
      gravar(lei.path, arquivo);
      gravados.push(`${RAIZ}/${lei.path}`);
    }
  }
  for (const indice of regra.indices) {
    const v = variaveis.get(indice);
    if (!v) throw new Error(`Índice desconhecido: ${indice}`);
    const id = `${hifen(indice)}--${nome}`;
    const fonte = regra.copia
      .map((s) => ligacao(indice, s))
      .find((c) => c !== undefined);
    const sinal = v.avaliacao === "maior_pior" ? -1 : 1;
    const base: Consequencia = fonte ?? {
      id,
      tipo: "consequencia",
      versaoEsquema: 1,
      origem: indice,
      alvo: regra.segmento,
      mecanismo: "afim",
      parametros: { coeficiente: 0.3 * sinal, termoConstante: 0 },
      unidade: "indice_0_100",
      atrasoPassos: 0,
      duracao: { modo: "continuo" },
    };
    escrever(base, id, regra.segmento, 1);
  }
}
gravar("mundo/mundo.json", mundo);
gravados.push(`${RAIZ}/mundo/mundo.json`);
if (existsSync("node_modules/.bin/prettier"))
  execSync(`npx prettier --write ${[...new Set(gravados)].join(" ")}`, {
    stdio: "ignore",
  });
console.log(`${gravados.length} arquivos gravados.`);
if (faltam.length)
  console.log(`Sem ligação para copiar:\n  ${faltam.join("\n  ")}`);
