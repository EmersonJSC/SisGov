/**
 * Sugestões do inventário das leis (molde-das-leis.md, seção 4, passo 2):
 * área nova, família, o que falta para o molde e lei parecida. Só sugere;
 * quem decide é o autor.
 */
import { textoProibido } from "../../src/game/pais/fichaV3/verificar";
import type { Familia } from "../../src/game/pais/fichaV3";

/** O que o inventário lê de uma lei, em qualquer formato (v2 ou v3). */
export type LeiBruta = {
  id: string;
  nome: string;
  descricao?: string;
  /** Só v4: já declara família, área e frase. */
  familia?: Familia;
  area?: string;
  decide?: string;
  versaoEsquema?: number;
  grupo?: string;
  nivelLegal?: string;
  nivel?: string;
  petrea?: boolean;
  processoAutorizacao?: string;
  consequencias?: unknown[];
  efeitos?: unknown[];
  dinheiro?: { tipo?: string };
  controle?: { opcoes?: unknown[] };
};

export type LinhaDoInventario = {
  id: string;
  nome: string;
  areaSugerida: string;
  familiaSugerida: Familia;
  faltas: string[];
  parecidaCom?: string;
};

/** Ministério do Brasil → área nova (molde-das-leis.md, 2.4). */
const AREA_DO_MINISTERIO: Readonly<Record<string, string>> = {
  fazenda: "contas-publicas",
  planejamento: "contas-publicas",
  mdic: "economia-e-empresas",
  empreendedorismo: "economia-e-empresas",
  turismo: "economia-e-empresas",
  trabalho: "trabalho",
  previdencia: "protecao-social",
  "desenvolvimento-social": "protecao-social",
  saude: "saude",
  esporte: "educacao-e-cultura",
  educacao: "educacao-e-cultura",
  ciencia: "educacao-e-cultura",
  cultura: "educacao-e-cultura",
  comunicacoes: "governo-e-instituicoes",
  cidades: "infraestrutura-e-energia",
  transportes: "infraestrutura-e-energia",
  portos: "infraestrutura-e-energia",
  "minas-energia": "infraestrutura-e-energia",
  integracao: "infraestrutura-e-energia",
  "meio-ambiente": "ambiente-e-campo",
  agricultura: "ambiente-e-campo",
  "desenvolvimento-agrario": "ambiente-e-campo",
  pesca: "ambiente-e-campo",
  "povos-indigenas": "direitos-e-costumes",
  justica: "seguranca-e-defesa",
  defesa: "seguranca-e-defesa",
  "relacoes-exteriores": "seguranca-e-defesa",
  gsi: "seguranca-e-defesa",
  "direitos-humanos": "direitos-e-costumes",
  mulheres: "direitos-e-costumes",
  "igualdade-racial": "direitos-e-costumes",
  "casa-civil": "governo-e-instituicoes",
  "secretaria-geral": "governo-e-instituicoes",
  "relacoes-institucionais": "governo-e-instituicoes",
  "comunicacao-social": "governo-e-instituicoes",
  cgu: "governo-e-instituicoes",
  agu: "governo-e-instituicoes",
  gestao: "governo-e-instituicoes",
};

/** Leis que mudam de área pelo assunto, não pelo ministério de hoje. */
const AREA_DA_LEI: Readonly<Record<string, string>> = {
  "quem-controla-o-banco-central": "economia-e-empresas",
  "mandato-do-banco-central": "economia-e-empresas",
  "regime-cambial": "economia-e-empresas",
  "regulacao-dos-bancos": "economia-e-empresas",
  "controle-de-capitais": "economia-e-empresas",
  "habitacao-publica": "protecao-social",
  "programa-habitacao-popular": "protecao-social",
  "verba-do-programa-habitacional": "protecao-social",
  "credito-rural-e-assistencia-tecnica": "ambiente-e-campo",
};

/** Pagamento direto às pessoas: família programa (verde-água). */
const PROGRAMAS = new Set([
  "transferencia-de-renda",
  "transferencia-de-renda-as-familias-pobres",
  "renda-para-idosos-e-pessoas-com-deficiencia-pobres",
  "farmacia-popular",
  "remedios-em-farmacias-credenciadas",
  "bolsa-de-permanencia-no-ensino-medio",
  "bolsas-de-pos-graduacao",
  "seguro-desemprego",
  "pensao-por-morte",
  "programa-habitacao-popular",
]);

const SEM_PESO = new Set(
  "imposto verba lei de do da dos das e sobre a o na no em para com".split(" "),
);
const palavras = (id: string) =>
  id.split("-").filter((p) => p.length > 2 && !SEM_PESO.has(p));

/** Onde cada lei está hoje no país, já traduzido para a área nova. */
export function areaDasLeisNoPais(
  ministerios: readonly { id: string; leis?: readonly string[] }[],
): Map<string, string> {
  const mapa = new Map<string, string>();
  for (const m of ministerios)
    for (const lei of m.leis ?? [])
      mapa.set(lei, AREA_DO_MINISTERIO[m.id] ?? "sem-area");
  return mapa;
}

function familiaSugerida(lei: LeiBruta): Familia {
  if (lei.versaoEsquema === 4 && lei.familia) return lei.familia;
  if (
    lei.nivelLegal === "petrea" ||
    lei.petrea === true ||
    lei.processoAutorizacao === "clausula-petrea"
  )
    return "petrea";
  if (
    lei.nivelLegal === "constitucional" ||
    lei.nivel === "constituicao" ||
    lei.processoAutorizacao === "emenda-constitucional"
  )
    return "constitucional";
  if (
    lei.grupo === "tributaria" ||
    lei.dinheiro?.tipo === "receita" ||
    /^(imposto|tributacao)-/.test(lei.id)
  )
    return "imposto";
  if (PROGRAMAS.has(lei.id)) return "programa";
  if (
    lei.grupo === "orcamentaria" ||
    lei.dinheiro?.tipo === "gasto" ||
    /^(verba|investimento|gasto)-/.test(lei.id)
  )
    return "verba";
  return "regra";
}

function areaDe(lei: LeiBruta, areaDaLei: ReadonlyMap<string, string>) {
  if (lei.versaoEsquema === 4) return lei.area ?? "centro";
  return familiaSugerida(lei) === "petrea"
    ? "centro"
    : (AREA_DA_LEI[lei.id] ?? areaDaLei.get(lei.id) ?? "sem-area");
}

export function sugerirLinha(
  lei: LeiBruta,
  areaDaLei: ReadonlyMap<string, string>,
  catalogo: readonly LeiBruta[],
): LinhaDoInventario {
  const familia = familiaSugerida(lei);
  const area = areaDe(lei, areaDaLei);

  const faltas: string[] = [];
  if (!lei.consequencias?.length && !lei.efeitos?.length)
    faltas.push("sem efeito na rede");
  if ((lei.decide ?? lei.descricao ?? "").trim().endsWith("?"))
    faltas.push("decide é pergunta");
  const opcoes = lei.controle?.opcoes?.length ?? 0;
  if ((familia === "regra" || familia === "constitucional") && opcoes > 3)
    faltas.push(`${opcoes} opções (máximo 3)`);
  if (textoProibido(lei.nome)) faltas.push("nome de programa ou travessão");
  if (!lei.nivelLegal && !lei.nivel) faltas.push("sem nível");
  if (lei.versaoEsquema === 4) faltas.length = 0; // já passou no verificador

  const minhas = palavras(lei.id);
  const parecidaCom =
    minhas.length === 0
      ? undefined
      : catalogo.find((outra) => {
          if (outra.id === lei.id) return false;
          if (familiaSugerida(outra) !== familia) return false;
          if (areaDe(outra, areaDaLei) !== area) return false;
          const dela = new Set(palavras(outra.id));
          return minhas.every((p) => dela.has(p));
        })?.id;

  return {
    id: lei.id,
    nome: lei.nome,
    areaSugerida: area,
    familiaSugerida: familia,
    faltas,
    ...(parecidaCom ? { parecidaCom } : {}),
  };
}
