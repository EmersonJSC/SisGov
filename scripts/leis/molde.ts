// O molde da lei na planilha `docs/jogo/gdd.xlsx` (plano das leis, 6.1 e
// 6.7): três abas, uma linha por lei, por degrau e por efeito. A planilha é a
// fonte; `npm run leis` gera os JSONs de `src/conteudo/mundo/leis/`.
// Lei → linhas e linhas → lei são inversas: o teste confere a volta.
import type { Efeito, Estrato, Lei, LeiContinua, Opcao } from "../../src/motor";

export const PLANILHA = "docs/jogo/gdd.xlsx";
export const PASTA_DAS_LEIS = "src/conteudo/mundo/leis";
export const ABA_LEIS = "Leis";
export const ABA_DEGRAUS = "Leis - degraus";
export const ABA_EFEITOS = "Leis - efeitos";

/** Uma linha de planilha: coluna → valor (vazio = ausente). */
export type Linha = Record<string, string | number | undefined>;

/** Colunas da aba Leis, na ordem. As de "acervo" e "trabalho" são só leitura do autor. */
export const COLUNAS_LEIS = [
  "id",
  "Nome",
  "O que muda",
  "Instituição",
  "Camada",
  "Quórum",
  "Canal",
  "Espera",
  "Tipo",
  "Prazo (turnos)",
  "Jeito",
  "Forma",
  "Unidade",
  "Nome da unidade",
  "Mínimo",
  "Máximo",
  "Passo",
  "Bússola no mínimo: econômico",
  "Bússola no mínimo: social",
  "Bússola no máximo: econômico",
  "Bússola no máximo: social",
  "Bússola até",
  "Imposto sobre",
  "Imposto do estrato",
  "Conta",
  "Renda para",
  "Encolhe",
  "Muda o gasto",
  "Arrecada (% do PIB)",
  "Valores",
  "Parte de",
  "Origem",
  "Veredito",
  "Canal proposto",
  "Notas",
] as const;

export const COLUNAS_DEGRAUS = [
  "Lei",
  "Degrau",
  "Rótulo",
  "Econômico",
  "Social",
  "Mandato (anos)",
  "Falta paga pelo cofre",
  "Sobra ao cofre",
  "Valores",
] as const;

export const COLUNAS_EFEITOS = [
  "Lei",
  "Degrau",
  "Índice",
  "Sentido",
  "Força",
  "Atraso (turnos)",
] as const;

const FORMA_NA_PLANILHA = { continua: "Régua", opcoes: "Degraus" } as const;
/** Tipo e jeito na planilha, em palavra de leigo; o JSON guarda o id. */
const TIPO_NA_PLANILHA = {
  lei: "Lei",
  prazo: "Lei com prazo",
  ato: "Ato",
} as const;
const JEITO_NA_PLANILHA = {
  regua: "Régua",
  verba: "Verba",
  niveis: "Níveis",
  escolha: "Escolha",
} as const;
/** O id de volta a partir da palavra da planilha. */
const doRotulo = <K extends string>(
  mapa: Record<K, string>,
  v: Linha[string],
): K | undefined =>
  (Object.keys(mapa) as K[]).find((k) => mapa[k] === texto(v));

const texto = (v: Linha[string]) =>
  v === undefined || v === "" ? undefined : String(v);
const numero = (v: Linha[string]) =>
  v === undefined || v === "" ? undefined : Number(v);

/** Só os campos com valor (o JSON não guarda campo vazio). */
function semVazios<T extends object>(o: T): T {
  return Object.fromEntries(
    Object.entries(o).filter(([, v]) => v !== undefined),
  ) as T;
}

function ponto(economico: Linha[string], social: Linha[string]) {
  return semVazios({ economico: numero(economico), social: numero(social) });
}

// ---------- lei → linhas ----------

export function linhaDaLei(lei: Lei): Linha {
  const extra = lei as Lei & {
    nome?: string;
    descricao?: string;
    origem?: string;
    parte_de?: string;
  };
  const comum: Linha = {
    id: lei.id,
    Nome: extra.nome,
    "O que muda": extra.descricao,
    Instituição: lei.esfera,
    Camada: lei.camada,
    Quórum: lei.classe,
    Canal: lei.canal,
    Espera: lei.espera,
    Tipo: lei.tipo && TIPO_NA_PLANILHA[lei.tipo],
    "Prazo (turnos)": lei.prazo_turnos,
    Jeito: lei.jeito && JEITO_NA_PLANILHA[lei.jeito],
    Forma: FORMA_NA_PLANILHA[lei.forma],
    "Parte de": extra.parte_de,
    Origem: extra.origem,
  };
  if (lei.forma === "opcoes")
    return {
      ...comum,
      "Muda o gasto": lei.escala_gasto && JSON.stringify(lei.escala_gasto),
    };
  return {
    ...comum,
    Unidade: lei.unidade,
    "Nome da unidade": lei.rotulo_unidade,
    Mínimo: lei.faixa.min,
    Máximo: lei.faixa.max,
    Passo: lei.passo,
    "Bússola no mínimo: econômico": lei.bussola?.min.economico,
    "Bússola no mínimo: social": lei.bussola?.min.social,
    "Bússola no máximo: econômico": lei.bussola?.max.economico,
    "Bússola no máximo: social": lei.bussola?.max.social,
    "Bússola até": lei.bussola?.ate,
    "Imposto sobre": lei.calculo?.base,
    "Imposto do estrato": lei.calculo?.estrato,
    Conta: lei.conta,
    "Renda para": lei.para && rendaPara(lei.para),
    Encolhe: lei.encolhe && JSON.stringify(lei.encolhe),
    "Muda o gasto": lei.escala_gasto && JSON.stringify(lei.escala_gasto),
    "Arrecada (% do PIB)": lei.arrecada,
    Valores: lei.valores && JSON.stringify(lei.valores),
  };
}

/** "pobre", ou "pobre 0.6; medio 0.4" quando a renda se divide. */
function rendaPara(para: NonNullable<LeiContinua["para"]>): string {
  if ("pop" in para) return `pop ${para.pop}`;
  return "pesos" in para
    ? Object.entries(para.pesos)
        .map(([e, p]) => `${e} ${p}`)
        .join("; ")
    : para.estrato;
}

function paraDaPlanilha(v: string): LeiContinua["para"] {
  if (!v.includes(" ")) return { estrato: v as Estrato };
  if (v.startsWith("pop ")) return { pop: v.slice(4).trim() };
  const pesos = Object.fromEntries(
    v.split(";").map((par) => {
      const [e, p] = par.trim().split(/\s+/);
      return [e, Number(p)];
    }),
  );
  return { pesos };
}

export function linhasDosDegraus(lei: Lei): Linha[] {
  if (lei.forma !== "opcoes") return [];
  return lei.opcoes.map((o) => {
    const extra = o as Opcao & { rotulo?: string };
    return {
      Lei: lei.id,
      Degrau: o.id,
      Rótulo: extra.rotulo,
      Econômico: o.bussola?.economico,
      Social: o.bussola?.social,
      "Mandato (anos)": o.mandato_anos,
      "Falta paga pelo cofre": o.deficit_do_cofre,
      "Sobra ao cofre": o.superavit_ao_cofre,
      Valores: o.valores ? JSON.stringify(o.valores) : undefined,
    };
  });
}

const linhaDoEfeito = (lei: string, degrau: string | undefined, e: Efeito) => ({
  Lei: lei,
  Degrau: degrau,
  Índice: e.indice,
  Sentido: e.sentido,
  Força: e.forca,
  "Atraso (turnos)": e.atraso_turnos,
});

export function linhasDosEfeitos(lei: Lei): Linha[] {
  return lei.forma === "opcoes"
    ? lei.opcoes.flatMap((o) =>
        o.efeitos.map((e) => linhaDoEfeito(lei.id, o.id, e)),
      )
    : lei.efeitos.map((e) => linhaDoEfeito(lei.id, undefined, e));
}

// ---------- linhas → lei ----------

function efeitosDe(linhas: readonly Linha[]): Efeito[] {
  return linhas.map((l) => ({
    indice: String(l["Índice"]),
    sentido: Number(l.Sentido) as 1 | -1,
    forca: String(l["Força"]) as Efeito["forca"],
    atraso_turnos: Number(l["Atraso (turnos)"]),
  }));
}

function bussolaDaRegua(l: Linha) {
  const min = ponto(
    l["Bússola no mínimo: econômico"],
    l["Bússola no mínimo: social"],
  );
  const max = ponto(
    l["Bússola no máximo: econômico"],
    l["Bússola no máximo: social"],
  );
  const ate = numero(l["Bússola até"]);
  if (!Object.keys(min).length && !Object.keys(max).length) return undefined;
  return semVazios({ min, max, ate });
}

/** A lei de volta, com os campos na ordem de sempre. */
export function leiDasLinhas(
  l: Linha,
  degraus: readonly Linha[],
  efeitos: readonly Linha[],
): Lei {
  const id = String(l.id);
  const cabeca = {
    versao: 1 as const,
    id,
    nome: texto(l.Nome),
    descricao: texto(l["O que muda"]),
    camada: String(l.Camada) as Lei["camada"],
    classe: texto(l["Quórum"]) as Lei["classe"],
    origem: texto(l.Origem),
    parte_de: texto(l["Parte de"]),
    esfera: texto(l["Instituição"]),
    canal: String(l.Canal) as Lei["canal"],
    espera: texto(l.Espera),
    jeito: doRotulo(JEITO_NA_PLANILHA, l.Jeito),
    tipo: doRotulo(TIPO_NA_PLANILHA, l.Tipo),
    prazo_turnos: numero(l["Prazo (turnos)"]),
  };
  if (l.Forma === FORMA_NA_PLANILHA.opcoes)
    return semVazios({
      ...cabeca,
      forma: "opcoes" as const,
      escala_gasto: l["Muda o gasto"]
        ? JSON.parse(String(l["Muda o gasto"]))
        : undefined,
      opcoes: degraus.map((d) =>
        semVazios({
          id: String(d.Degrau),
          rotulo: texto(d["Rótulo"]),
          bussola: Object.keys(ponto(d["Econômico"], d.Social)).length
            ? ponto(d["Econômico"], d.Social)
            : undefined,
          mandato_anos: numero(d["Mandato (anos)"]),
          deficit_do_cofre: numero(d["Falta paga pelo cofre"]),
          superavit_ao_cofre: numero(d["Sobra ao cofre"]),
          valores: d.Valores ? JSON.parse(String(d.Valores)) : undefined,
          efeitos: efeitosDe(efeitos.filter((e) => e.Degrau === d.Degrau)),
        }),
      ),
    }) as Lei;
  const base = texto(l["Imposto sobre"]);
  const doEstrato = texto(l["Imposto do estrato"]);
  const para = texto(l["Renda para"]);
  return semVazios({
    ...cabeca,
    forma: "continua" as const,
    unidade: String(l.Unidade) as "fracao",
    rotulo_unidade: texto(l["Nome da unidade"]),
    faixa: { min: Number(l["Mínimo"]), max: Number(l["Máximo"]) },
    passo: Number(l.Passo),
    calculo: base
      ? semVazios({ base, modelo: "laffer", estrato: doEstrato })
      : undefined,
    conta: texto(l.Conta),
    para: para ? paraDaPlanilha(para) : undefined,
    encolhe: l.Encolhe ? JSON.parse(String(l.Encolhe)) : undefined,
    escala_gasto: l["Muda o gasto"]
      ? JSON.parse(String(l["Muda o gasto"]))
      : undefined,
    arrecada: numero(l["Arrecada (% do PIB)"]),
    valores: l.Valores ? JSON.parse(String(l.Valores)) : undefined,
    bussola: bussolaDaRegua(l),
    efeitos: efeitosDe(efeitos),
  }) as Lei;
}

/** Junta as três abas em leis, pelo id. */
export function leisDasAbas(
  leis: readonly Linha[],
  degraus: readonly Linha[],
  efeitos: readonly Linha[],
): Lei[] {
  const por = (linhas: readonly Linha[]) =>
    linhas.reduce((m, l) => {
      const id = String(l.Lei);
      return m.set(id, [...(m.get(id) ?? []), l]);
    }, new Map<string, Linha[]>());
  const degrausPorLei = por(degraus);
  const efeitosPorLei = por(efeitos);
  return leis
    .filter((l) => texto(l.id))
    .map((l) =>
      leiDasLinhas(
        l,
        degrausPorLei.get(String(l.id)) ?? [],
        efeitosPorLei.get(String(l.id)) ?? [],
      ),
    );
}
