/**
 * Régua da janela da lei (leis com controle deslizante): onde o valor da lei
 * (ou o índice que ela move) fica numa escala com faixas verde, amarela e
 * vermelha, e os cartões do que muda. Os dados vêm de
 * `conteudo/mundo/reguas.json`; os números do país em dinheiro, de
 * `conteudo/paises/<pais>/referencias.json`.
 */
import reguasDoMundo from "../../conteudo/mundo/reguas.json";

export type Tom = "bom" | "atencao" | "ruim";

export type Faixa = Readonly<{ ate: number; tom: Tom; rotulo: string }>;

/** Cartão calculado de um índice: valor × fator × referência ÷ referência. */
export type LeituraDerivada = Readonly<{
  de: string;
  rotulo: string;
  fator?: number;
  multiplicaPor?: string;
  dividePor?: string;
  formato: "moeda" | "numero";
}>;

export type Regua = Readonly<{
  /** controle: o valor da lei; pib: o valor em dinheiro em % do PIB; variavel: um índice. */
  mede: "controle" | "pib" | "variavel";
  variavel?: string;
  /** Sufixo do número quando a régua mede um índice (ex.: "%"). */
  sufixo?: string;
  rotulo: string;
  escala: readonly [number, number];
  faixas: readonly Faixa[];
  /** Cartões do índice convertido em dinheiro do país (opcional). */
  leituras?: readonly LeituraDerivada[];
  alerta?: Readonly<{ variavel: string; abaixoDe: number; texto: string }>;
  fonte: string;
}>;

/** Números do país em dinheiro (mediana dos salários, cesta básica…). */
export type Referencias = Readonly<Record<string, number>>;

const PORCENTO = 100;
/** No máximo tantos intervalos entre as marcas do eixo. */
const MAXIMO_DE_INTERVALOS = 7;
/** Folga numérica ao arredondar as marcas. */
const FOLGA = 1e-6;
const CASAS_DA_MARCA = 6;
/** Passos "redondos" possíveis entre as marcas do eixo. */
const UM = 1;
const DOIS = 2;
const DOIS_E_MEIO = 2.5;
const CINCO = 5;
const BASES_DO_PASSO: readonly number[] = [UM, DOIS, DOIS_E_MEIO, CINCO];
const BASE_DECIMAL = 10;
const MENOR_EXPOENTE = -3;
const QUANTOS_EXPOENTES = 7;
const PASSOS_DO_EIXO: readonly number[] = Array.from(
  { length: QUANTOS_EXPOENTES },
  (_, i) => BASE_DECIMAL ** (MENOR_EXPOENTE + i),
)
  .flatMap((potencia) => BASES_DO_PASSO.map((base) => base * potencia))
  .sort((a, b) => a - b);

const REGUAS = reguasDoMundo.reguas as unknown as Readonly<
  Record<string, Regua>
>;

export function reguaDaLei(id: string): Regua | undefined {
  return REGUAS[id];
}

export function idsComRegua(): readonly string[] {
  return Object.keys(REGUAS);
}

const ARQUIVOS_DE_REFERENCIA = import.meta.glob<{ default: unknown }>(
  "../../conteudo/paises/*/referencias.json",
  { eager: true },
);

/**
 * Tira acentos e caixa: aceita "Brasil" e "brasil" como iguais; "São Tomé"
 * vira "sao tome". O intervalo U+0300–U+036F são os acentos soltos do NFD:
 * casa o acento de "á" e não casa "a". Teste:
 * https://regex101.com/?regex=%5B%5Cu0300-%5Cu036f%5D&flags=g&testString=a%CC%81%20a
 */
const MARCAS_DE_ACENTO = /[̀-ͯ]/g;
const semAcento = (texto: string): string =>
  texto.normalize("NFD").replace(MARCAS_DE_ACENTO, "").toLowerCase().trim();

/** Pasta do país no caminho do arquivo: ".../paises/brasil/referencias.json" → "brasil". */
const pastaDoPais = (caminho: string): string =>
  caminho.split("/").slice(0, -1).pop() ?? "";

const soNumeros = (dados: Readonly<Record<string, unknown>>): Referencias =>
  Object.fromEntries(
    Object.entries(dados).filter(
      (par): par is [string, number] => typeof par[1] === "number",
    ),
  );

/** Referências do país pelo nome (a pasta do país é o nome sem acento). */
export function referenciasDoPais(pais: string): Referencias {
  const alvo = semAcento(pais);
  const achado = Object.entries(ARQUIVOS_DE_REFERENCIA).find(([caminho]) => {
    const pasta = semAcento(pastaDoPais(caminho));
    return pasta !== "" && (pasta === alvo || alvo.startsWith(pasta));
  });
  if (!achado) return {};
  const modulo = achado[1] as { default?: unknown };
  return soNumeros((modulo.default ?? modulo) as Record<string, unknown>);
}

/** O que o país tem hoje para a régua da lei (o exemplo em palavras). */
export function notaDoPais(pais: string, leiId: string): string | undefined {
  const alvo = semAcento(pais);
  const achado = Object.entries(ARQUIVOS_DE_REFERENCIA).find(([caminho]) => {
    const pasta = semAcento(pastaDoPais(caminho));
    return pasta !== "" && (pasta === alvo || alvo.startsWith(pasta));
  });
  if (!achado) return undefined;
  const modulo = achado[1] as { default?: unknown };
  const dados = (modulo.default ?? modulo) as {
    noPais?: Readonly<Record<string, string>>;
  };
  return dados.noPais?.[leiId];
}

/** Casas decimais para um número pequeno continuar legível (0,0075%). */
const LIMITES_DAS_CASAS: readonly (readonly [number, number])[] = [
  [0.01, 4],
  [0.1, 3],
  [10, 2],
];
const CASAS_DO_NUMERO_GRANDE = 1;
export function casasPara(valor: number): number {
  const absoluto = Math.abs(valor);
  if (absoluto === 0) return 0;
  return (
    LIMITES_DAS_CASAS.find(([limite]) => absoluto < limite)?.[1] ??
    CASAS_DO_NUMERO_GRANDE
  );
}

/** A faixa onde o valor cai (abaixo da escala: a primeira; acima: a última). */
export function faixaDe(regua: Regua, valor: number): Faixa {
  return (
    regua.faixas.find((f) => valor <= f.ate) ??
    regua.faixas[regua.faixas.length - 1]
  );
}

/** Onde o valor da lei fica na régua (só para `controle` e `pib`). */
export function valorDaLeiNaRegua(
  regua: Regua,
  valor: number,
  pib: number,
): number {
  if (regua.mede !== "pib") return valor;
  return pib > 0 ? (valor / pib) * PORCENTO : 0;
}

/** Leitura derivada: o índice convertido em dinheiro ou em cestas. */
export function valorDerivado(
  leitura: LeituraDerivada,
  valorDoIndice: number,
  referencias: Referencias,
): number | null {
  const vezes = leitura.multiplicaPor ? referencias[leitura.multiplicaPor] : 1;
  const divide = leitura.dividePor ? referencias[leitura.dividePor] : 1;
  if (vezes === undefined || divide === undefined || divide === 0) return null;
  return (valorDoIndice * (leitura.fator ?? 1) * vezes) / divide;
}

/** Marcas do eixo: passo "redondo" com no máximo 8 marcas. */
export function marcasDaEscala(
  minimo: number,
  maximo: number,
): readonly number[] {
  const largura = maximo - minimo || 1;
  const passo =
    PASSOS_DO_EIXO.find((p) => largura / p <= MAXIMO_DE_INTERVALOS) ??
    largura / MAXIMO_DE_INTERVALOS;
  const inicio = Math.ceil(minimo / passo - FOLGA) * passo;
  const quantas = Math.floor((maximo - inicio) / passo + FOLGA) + 1;
  return Array.from({ length: Math.max(0, quantas) }, (_, i) =>
    Number((inicio + i * passo).toFixed(CASAS_DA_MARCA)),
  );
}
