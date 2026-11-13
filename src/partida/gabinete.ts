// O gabinete que o jogador monta na tela inicial: quantos ministérios, quais
// instituições cada um leva e quanto rende quem senta em cada cadeira.
import {
  competenciaEfetiva,
  instituicoesDaCaixa,
  instituicoesSoltas,
  type Caixa,
  type Instituicao,
  type Molde,
  type RegrasGoverno,
} from "../motor";
import instituicoesDoMundo from "../conteudo/mundo/ministerios/instituicoes.json";
import moldesDeMinisterio from "../conteudo/mundo/ministerios/moldes.json";
import tamanhos from "../conteudo/mundo/ministerios/tamanhos.json";

/** Uma caixa antes de ter ministro. */
export type CaixaDoGabinete = Omit<Caixa, "ministro">;

export const TAMANHOS = [
  { id: "enxuto", nome: "Enxuto" },
  { id: "classico", nome: "Clássico" },
  { id: "pais", nome: "Do país" },
  { id: "inchado", nome: "Inchado" },
] as const;
export type Tamanho = (typeof TAMANHOS)[number]["id"];

/** Ministérios sem pasta que o governo inchado põe a mais que o do país. */
const SEM_PASTA_A_MAIS = 5;
/** Parecido o bastante com um molde para levar o nome dele. */
const PARECIDO = 0.5;
/** Competência máxima: rende isto quem cuida sem dividir a atenção. */
const COMPETENCIA_CHEIA = 100;
/** Instituições que o nome montado mostra; as outras viram "+n". */
const NO_NOME = 2;

const instituicoes = instituicoesDoMundo.instituicoes as Instituicao[];
const moldes = moldesDeMinisterio.moldes as Molde[];
const regras: RegrasGoverno = { instituicoes, moldes, pessoas: [] };

/** As instituições do mundo, com nome e se ficam sem ministro. */
export const instituicoesDoGabinete = (): Instituicao[] => instituicoes;

const semPasta = (n: number): CaixaDoGabinete => ({
  id: `sem-pasta-${n}`,
  nome: "Ministério sem pasta",
  instituicoes: [],
});

/** O governo pronto de cada parada da régua; o do país vem do arquivo dele. */
export function governoPronto(
  tamanho: Tamanho,
  doPais: CaixaDoGabinete[],
): CaixaDoGabinete[] {
  if (tamanho === "pais") return doPais;
  if (tamanho === "inchado")
    return [
      ...doPais,
      ...Array.from({ length: SEM_PASTA_A_MAIS }, (_, i) => semPasta(i + 1)),
    ];
  return tamanhos[tamanho];
}

const comMinistro = (caixas: CaixaDoGabinete[]): Caixa[] =>
  caixas.map((c) => ({ ...c, ministro: "" }));

/** Instituições que nenhuma caixa cita: ficam com a caixa da sobra. */
export const soltasDoGabinete = (caixas: CaixaDoGabinete[]): string[] =>
  instituicoesSoltas(regras, comMinistro(caixas));

/** Quantas instituições a caixa leva, contando o peso da sobra. */
export function cargaDaCaixa(
  caixas: CaixaDoGabinete[],
  caixa: CaixaDoGabinete,
): number {
  return instituicoesDaCaixa(regras, comMinistro(caixas), {
    ...caixa,
    ministro: "",
  });
}

/** Quanto rende, de 0 a 100, alguém com esta competência nesta caixa. */
export const rendeNaCaixa = (
  competencia: number,
  caixas: CaixaDoGabinete[],
  caixa: CaixaDoGabinete,
): number =>
  Math.round(competenciaEfetiva(competencia, cargaDaCaixa(caixas, caixa)));

/** Parte da atenção, em %, que cada instituição da caixa recebe. */
export const atencaoDaCaixa = (
  caixas: CaixaDoGabinete[],
  caixa: CaixaDoGabinete,
): number => rendeNaCaixa(COMPETENCIA_CHEIA, caixas, caixa);

/** Nome do molde mais parecido com estas instituições, ou um nome montado com elas. */
export function nomeAutomatico(lista: string[]): string {
  if (lista.length === 0) return "Ministério sem pasta";
  const nomeDe = (id: string) =>
    instituicoes.find((i) => i.id === id)?.nome ?? id;
  const parecenca = (m: Molde) =>
    m.instituicoes.filter((i) => lista.includes(i)).length /
    new Set([...m.instituicoes, ...lista]).size;
  const melhor = moldes.reduce<Molde | null>(
    (a, m) => (a && parecenca(a) >= parecenca(m) ? a : m),
    null,
  );
  if (melhor && parecenca(melhor) > PARECIDO) return melhor.nome;
  const [primeira, segunda] = lista.map(nomeDe);
  if (!segunda) return primeira;
  const resto = lista.length > NO_NOME ? ` +${lista.length - NO_NOME}` : "";
  return `${primeira} e ${segunda}${resto}`;
}

/**
 * Põe a instituição na caixa `destino` (tira de onde estava). Destino nulo:
 * fica solta, com a caixa da sobra.
 */
export function moverInstituicao(
  caixas: CaixaDoGabinete[],
  instituicao: string,
  destino: string | null,
): CaixaDoGabinete[] {
  return caixas.map((c) => {
    const sem = c.instituicoes.filter((i) => i !== instituicao);
    return {
      ...c,
      instituicoes: c.id === destino ? [...sem, instituicao] : sem,
    };
  });
}

/** Caixa nova, vazia, com um id que ainda não existe. */
export function caixaNova(caixas: CaixaDoGabinete[]): CaixaDoGabinete {
  const usados = new Set(caixas.map((c) => c.id));
  const n =
    Array.from({ length: caixas.length + 1 }, (_, i) => i + 1).find(
      (i) => !usados.has(`nova-${i}`),
    ) ?? caixas.length + 1;
  return { id: `nova-${n}`, nome: "Ministério sem pasta", instituicoes: [] };
}
