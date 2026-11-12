// Exportador da planilha (passo 1 da ordem de 12/nov): docs/jogo/leis.xlsx
// → src/conteudo/mundo. A planilha é a fonte; o que este script grava leva
// "origem": "planilha" e é regravado a cada execução. Leis e índices escritos
// à mão (sem origem) ficam como estão.
//
//   npm run exportar
//
// Fica de fora por ora (o motor ainda não lê): régua por setor, dois
// controles, divisão de 100%, lei com prazo, meta e prazo, e régua numa
// unidade que não seja %, anos ou meses.
import {
  existsSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { lerPlanilha, type Linha } from "./xlsx";
import { INDICES_ESSENCIAIS } from "../src/motor/estado";
import { validarLei } from "../src/motor/leis/validar";

const PLANILHA = "docs/jogo/leis.xlsx";
const PASTA_LEIS = "src/conteudo/mundo/leis";
const VARIAVEIS = "src/conteudo/mundo/indicadores/variaveis.json";
const AREAS = "src/conteudo/mundo/areas/areas.json";

/** Área do mapa de cada esfera da planilha (o mapa ainda tem 8 áreas). */
const AREA_DA_ESFERA: Record<string, string> = {
  Impostos: "economia",
  "Orçamento e dívida": "economia",
  "Moeda e bancos": "economia",
  Trabalho: "economia",
  Previdência: "economia",
  "Comércio exterior e capital": "economia",
  Saúde: "saude",
  Vícios: "saude",
  "Assistência social": "protecao-social",
  Educação: "protecao-social",
  "Cultura e esporte": "protecao-social",
  "Ciência e pesquisa": "protecao-social",
  "Segurança pública": "seguranca",
  "Justiça e prisões": "seguranca",
  Defesa: "seguranca",
  "Defesa civil": "seguranca",
  "Relações exteriores": "seguranca",
  Imigração: "seguranca",
  "Direitos e liberdades": "seguranca",
  "Estado e eleições": "seguranca",
  "Comunicação e tecnologia": "seguranca",
  "Meio ambiente": "ambiente",
  "Agricultura e pesca": "ambiente",
  Energia: "infraestrutura-e-energia",
  "Mineração e petróleo": "infraestrutura-e-energia",
  "Infraestrutura e transporte": "infraestrutura-e-energia",
  "Empresas e estatais": "propriedade",
  Terra: "terra-e-moradia",
  Moradia: "terra-e-moradia",
  Saneamento: "terra-e-moradia",
};
const ORIGEM = "planilha";

type Json = Record<string, unknown>;

/** "Verba da saúde" → "verba-da-saude". */
const kebab = (s: string): string =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const snake = (s: string): string => kebab(s).replace(/-/g, "_");

/** "−0,5" → -0.5; "+0,7" → 0.7; "—" → undefined. */
function numero(s: string): number | undefined {
  const limpo = s.replace(/−/g, "-").replace(",", ".").replace(/\s/g, "");
  const n = Number.parseFloat(limpo);
  return Number.isFinite(n) ? n : undefined;
}

/** Eixo da bússola: "0 a +0,6" → [0, 0.6]; "+0,3" → [0.3, 0.3]. */
function eixo(s: string): [number, number] {
  const partes = s.split(/\s+a\s+/).map(numero);
  const a = partes[0] ?? 0;
  const b = partes[1] ?? a;
  return [a, b];
}

const arred = (n: number): number => Math.round(n * 100) / 100;

// ---------- índices ----------

const variaveis = JSON.parse(readFileSync(VARIAVEIS, "utf8")) as {
  variaveis: Json[];
};
const doMundo = variaveis.variaveis.filter((v) => v.origem !== ORIGEM);
const idPorNome = new Map<string, string>(
  doMundo.map((v) => [String(v.nome), String(v.id)]),
);

const abas = lerPlanilha(PLANILHA);
const aba = (nome: string): Linha[] => {
  const linhas = abas.get(nome);
  if (!linhas) throw new Error(`${PLANILHA}: aba "${nome}" não existe`);
  return linhas;
};

const novosIndices: Json[] = [];
for (const l of aba("Índices")) {
  const nome = l["Índice"];
  if (!nome || idPorNome.has(nome)) continue;
  const id = snake(nome);
  idPorNome.set(nome, id);
  novosIndices.push({
    id,
    tipo: "calculado",
    nome,
    camada: "jogabilidade",
    unidade: "indice_0_100",
    dominio: { minimo: 0, maximo: 100 },
    inicial: 50,
    area: l["Esfera"],
    avaliacao: /menor/i.test(l["Bom é"]) ? "maior_pior" : "maior_melhor",
    medida: { unidade: l["O que mede"] || nome, zero: 0, cem: 100 },
    origem: ORIGEM,
  });
}
const essenciais = new Set<string>(INDICES_ESSENCIAIS);
const indicesJogo = [...doMundo, ...novosIndices]
  .filter((v) => v.camada !== "essencial")
  .map((v) => String(v.id));

// ---------- efeitos (passo 6 do roteiro) ----------

const roteiro = new Map(aba("Leis - roteiro").map((l) => [l["Lei"], l]));
const nomesIndices = [...idPorNome.keys()].sort((a, b) => b.length - a.length);
const COLUNA_INDICES = "6. Índices\nO que muda na tela?";

/** Sentido de um trecho: "cai", "piora" → −1; "sobe", "melhora" → +1. */
function sentidoDe(trecho: string): 1 | -1 | undefined {
  if (/\b(cai|caem|desce|descem|piora|pioram|menos|diminui)/i.test(trecho))
    return -1;
  if (/\b(sobe|sobem|melhora|melhoram|mais|cresce|aumenta)/i.test(trecho))
    return 1;
  return undefined;
}

interface EfeitoLido {
  indice: string;
  sentido: 1 | -1;
}

/** "Atendimento sobe, depois Saúde; Gasto sobe" → atendimento +1, saude +1. */
function efeitosDe(texto: string): EfeitoLido[] {
  const lidos = new Map<string, EfeitoLido>();
  for (const frase of texto.split(/[;.]/)) {
    const geral = sentidoDe(frase);
    for (const trecho of frase.split(/,|\be\b|\bdepois\b/)) {
      const sentido = sentidoDe(trecho) ?? geral;
      if (!sentido) continue;
      let resto = trecho;
      for (const nome of nomesIndices) {
        if (!resto.includes(nome)) continue;
        resto = resto.replace(nome, "");
        const id = idPorNome.get(nome) ?? "";
        if (essenciais.has(id) || !indicesJogo.includes(id)) continue;
        if (!lidos.has(id)) lidos.set(id, { indice: id, sentido });
      }
    }
  }
  return [...lidos.values()];
}

const FORCA: Record<string, string> = {
  fraca: "fraca",
  média: "media",
  media: "media",
  forte: "forte",
};

// ---------- leis ----------

const aMao = new Set(
  readdirSync(PASTA_LEIS)
    .filter((f) => f.endsWith(".json"))
    .filter(
      (f) =>
        (JSON.parse(readFileSync(join(PASTA_LEIS, f), "utf8")) as Json)
          .origem !== ORIGEM,
    )
    .map((f) => f.replace(/\.json$/, "")),
);
const geradasAntes = new Set<string>();
for (const f of readdirSync(PASTA_LEIS))
  if (f.endsWith(".json") && !aMao.has(f.replace(/\.json$/, ""))) {
    geradasAntes.add(f.replace(/\.json$/, ""));
    unlinkSync(join(PASTA_LEIS, f));
  }
const areas = JSON.parse(readFileSync(AREAS, "utf8")) as {
  areas: { id: string; leis: string[] }[];
};
for (const a of areas.areas)
  a.leis = a.leis.filter((id) => !geradasAntes.has(id));

const FORMA_ESPECIAL =
  /por setor|dois controles|divisão|prazo|meta|por país|escolha de setor/i;
const contagem: Record<string, number> = {};
const conta = (k: string): void => {
  contagem[k] = (contagem[k] ?? 0) + 1;
};
const fora: string[] = [];
const erros: string[] = [];

/** "0 a 12 % do PIB" → faixa e unidade do motor, ou o motivo de não caber. */
function faixaDe(texto: string):
  | {
      min: number;
      max: number;
      unidade: string;
      rotulo?: string;
      passo?: number;
      gasto: boolean;
    }
  | string {
  const m = /^\s*([−\-+]?[\d.,]+)\s*a\s*([−\-+]?[\d.,]+)\s*(.*)$/.exec(texto);
  if (!m || texto.includes(";")) return "faixa sem formato simples";
  const min = numero(m[1].replace(/\./g, ""));
  const max = numero(m[2].replace(/\./g, ""));
  const resto = m[3].trim();
  if (min === undefined || max === undefined || min < 0 || min >= max)
    return "faixa com números inválidos";
  // acima de 100% não cabe em fração: vira unidade livre, de 5 em 5 pontos
  if (resto.startsWith("%") && max > 100)
    return {
      min,
      max,
      unidade: "livre",
      rotulo: resto,
      passo: 5,
      gasto: false,
    };
  if (resto.startsWith("%"))
    return {
      min: min / 100,
      max: max / 100,
      unidade: "fracao",
      gasto: /do PIB/i.test(resto),
    };
  if (/^anos\b/.test(resto)) return { min, max, unidade: "anos", gasto: false };
  if (/^meses\b/.test(resto))
    return { min, max, unidade: "meses", gasto: false };
  if (!resto) return "faixa sem unidade";
  // "x o salário médio" anda de 0,1 em 0,1; contagens (dias, mandatos, km/h) de 1 em 1
  return {
    min,
    max,
    unidade: "livre",
    rotulo: resto,
    passo: resto.startsWith("x ") ? 0.1 : 1,
    gasto: false,
  };
}

for (const l of aba("Leis")) {
  if (l["Tipo"] !== "Lei") continue;
  const nome = l["Lei"];
  const arquivo = l["Arquivo"];
  if (arquivo && aMao.has(arquivo)) {
    conta("à mão (mantida)");
    continue;
  }
  const id = kebab(nome);
  if (aMao.has(id)) {
    conta("à mão (mantida)");
    continue;
  }
  const forma = l["Forma"];
  if (FORMA_ESPECIAL.test(forma)) {
    fora.push(`${nome}: forma "${forma}"`);
    continue;
  }
  const forca = FORCA[l["Força"].toLowerCase()] ?? "media";
  const atraso = Math.max(0, Math.round(numero(l["Atraso (turnos)"]) ?? 1));
  const lidos = efeitosDe(roteiro.get(nome)?.[COLUNA_INDICES] ?? "");
  const [e0, e1] = eixo(l["Econômico (− esquerda, + direita)"]);
  const [s0, s1] = eixo(l["Social (− libertário, + tradicional)"]);
  const base: Json = {
    versao: 1,
    id,
    nome,
    descricao: l["O que faz"],
    camada: "jogabilidade",
    origem: ORIGEM,
  };
  let lei: Json;
  if (l["Degraus"]) {
    const degraus = l["Degraus"]
      .split(";")
      .map((d) => d.trim())
      .filter(Boolean);
    if (degraus.length < 2) {
      fora.push(`${nome}: menos de 2 degraus`);
      continue;
    }
    const n = degraus.length - 1;
    const ids = new Set<string>();
    lei = {
      ...base,
      forma: "opcoes",
      opcoes: degraus.map((rotulo, i) => {
        let oid = kebab(rotulo) || `degrau-${i + 1}`;
        while (ids.has(oid)) oid = `${oid}-${i + 1}`;
        ids.add(oid);
        const t = i / n;
        const forcaDoDegrau =
          t <= 1 / 3 ? "fraca" : t <= 2 / 3 ? "media" : "forte";
        return {
          id: oid,
          rotulo,
          bussola: {
            economico: arred(e0 + (e1 - e0) * t),
            social: arred(s0 + (s1 - s0) * t),
          },
          efeitos:
            i === 0
              ? []
              : lidos.map((e) => ({
                  ...e,
                  forca: forcaDoDegrau,
                  atraso_turnos: atraso,
                })),
        };
      }),
    };
    conta("degraus");
  } else {
    const faixa = faixaDe(l["Faixa"]);
    if (typeof faixa === "string") {
      fora.push(`${nome}: ${faixa} ("${l["Faixa"]}")`);
      continue;
    }
    const passoBruto = (faixa.max - faixa.min) / 20;
    const passo =
      faixa.passo ??
      (faixa.unidade === "fracao" ? Math.max(0.0005, passoBruto) : 1);
    lei = {
      ...base,
      forma: "continua",
      unidade: faixa.unidade,
      ...(faixa.rotulo ? { rotulo_unidade: faixa.rotulo } : {}),
      faixa: { min: faixa.min, max: faixa.max },
      passo: arred(passo * 10000) / 10000,
      ...(faixa.gasto ? { conta: "gasto" } : {}),
      bussola: {
        min: { economico: e0, social: s0 },
        max: { economico: e1, social: s1 },
      },
      efeitos: lidos.map((e) => ({ ...e, forca, atraso_turnos: atraso })),
    };
    conta("régua");
  }
  if (aMao.has(String(lei.id)) || existsSync(join(PASTA_LEIS, `${id}.json`))) {
    fora.push(`${nome}: id "${id}" repetido`);
    continue;
  }
  const problemas = validarLei(lei, `${id}.json`, indicesJogo);
  if (problemas.length) {
    erros.push(
      `${nome}: ${problemas.map((p) => `${p.campo} ${p.motivo}`).join("; ")}`,
    );
    continue;
  }
  const area = areas.areas.find((a) => a.id === AREA_DA_ESFERA[l["Esfera"]]);
  if (!area) {
    fora.push(`${nome}: esfera "${l["Esfera"]}" sem área no mapa`);
    continue;
  }
  area.leis.push(id);
  writeFileSync(
    join(PASTA_LEIS, `${id}.json`),
    `${JSON.stringify(lei, null, 2)}\n`,
  );
}

writeFileSync(
  VARIAVEIS,
  `${JSON.stringify({ ...variaveis, variaveis: [...doMundo, ...novosIndices] }, null, 2)}\n`,
);

writeFileSync(AREAS, `${JSON.stringify(areas, null, 2)}\n`);

console.log("Leis gravadas:", contagem);
console.log("Índices novos:", novosIndices.length);
console.log(`Fora por ora (${fora.length}):`);
for (const f of fora) console.log("  ", f);
if (erros.length) {
  console.log(`Com erro no validador (${erros.length}):`);
  for (const e of erros) console.log("  ", e);
  process.exitCode = 1;
}
