/**
 * Porcentagem em gente contável (país em frases, fase 2).
 *
 * "8,3% dos ocupados" não diz nada a quem joga; "uma pessoa em cada doze" diz.
 * A frase é calculada, não redigida: serve a qualquer indicador em
 * porcentagem, sem conteúdo novo por indicador.
 */

/** Até onde o denominador vai: acima de doze, "um em cada treze" não ajuda. */
const DENOMINADOR_MAXIMO = 12;
const PORCENTO = 100;
/** Denominador de "metade", que ganha leitura própria. */
const METADE = 2;
/**
 * Quanto a fração pode errar: um décimo da distância até a ponta mais perto
 * (0% ou 100%). Acima disso a bolha não ganha frase e cai no número.
 *
 * O teto existe porque o numerador nunca é zero: sem ele, 1% viraria "um em
 * cada doze" — oito vezes o valor. E é relativo à ponta, não ao valor, porque
 * errar um ponto pesa igual nas duas bordas: em 90%, folga de 15% do valor
 * aceitaria "sete em cada oito" (87,5%); em 54%, folga apertada perderia
 * "metade das pessoas".
 */
const ERRO_MAXIMO_RELATIVO = 0.1;
/** Folga para empate de erro entre duas frações. */
const FOLGA = 1e-9;

/**
 * De quem a frase fala. O gênero existe porque o numeral concorda com o
 * substantivo: "uma pessoa em cada doze", mas "um ocupado em cada doze".
 */
export type Sujeito = Readonly<{
  singular: string;
  plural: string;
  feminino?: boolean;
}>;

const PESSOA: Sujeito = {
  singular: "pessoa",
  plural: "pessoas",
  feminino: true,
};

/** Só um e dois concordam; de três em diante o numeral é invariável. */
const UM = ["um", "uma"] as const;
const DOIS = ["dois", "duas"] as const;
const DE_TRES_EM_DIANTE: readonly string[] = [
  "três",
  "quatro",
  "cinco",
  "seis",
  "sete",
  "oito",
  "nove",
  "dez",
  "onze",
  "doze",
];
const PRIMEIRO_INVARIAVEL = 3;

function numeral(n: number, feminino: boolean): string {
  if (n === 1) return UM[feminino ? 1 : 0];
  if (n === METADE) return DOIS[feminino ? 1 : 0];
  return DE_TRES_EM_DIANTE[n - PRIMEIRO_INVARIAVEL] ?? String(n);
}

export type Fracao = Readonly<{ numerador: number; denominador: number }>;

/**
 * Denominador até onde trocar exatidão por leitura: "metade das pessoas" para
 * 54% é melhor que "cinco em cada nove", mas entre onze e doze ninguém imagina
 * melhor — ali vale o mais exato.
 */
const DENOMINADOR_FACIL = 5;

/**
 * A fração que descreve `percentual`, ou `undefined` quando nenhuma descreve
 * sem mentir.
 *
 * Duas regras, nesta ordem: fração fácil de imaginar (denominador até cinco)
 * ganha da mais exata, se couber na folga; não havendo fácil, vale a mais
 * exata. A folga é um décimo da distância até a ponta mais perto (0% ou 100%),
 * e nada fora dela vira frase.
 */
export function fracaoLegivel(percentual: number): Fracao | undefined {
  const folga =
    Math.min(percentual, PORCENTO - percentual) * ERRO_MAXIMO_RELATIVO + FOLGA;
  const candidatas = Array.from(
    { length: DENOMINADOR_MAXIMO - 1 },
    (_, i) => i + METADE,
  ).map((denominador) => {
    const bruto = Math.round((percentual / PORCENTO) * denominador);
    const numerador = Math.min(Math.max(bruto, 1), denominador);
    return {
      numerador,
      denominador,
      erro: Math.abs(percentual - (numerador / denominador) * PORCENTO),
    };
  });
  const cabem = candidatas.filter(({ erro }) => erro <= folga);
  if (cabem.length === 0) return undefined;
  const facil = cabem.find(
    ({ denominador }) => denominador <= DENOMINADOR_FACIL,
  );
  const escolhida =
    facil ?? cabem.reduce((a, b) => (b.erro < a.erro - FOLGA ? b : a));
  return {
    numerador: escolhida.numerador,
    denominador: escolhida.denominador,
  };
}

/**
 * Que parte da floresta do país se perde por ano, em %. Sem o número do país
 * (`territorio.florestaMilKm2`) não há denominador, e a frase do desmatamento
 * só pode falar de ritmo — nunca de prazo, que foi o erro de 28/out.
 */
export function partePerdidaPorAno(
  desmatamentoMilKm2: number,
  florestaMilKm2: number | undefined,
): number | undefined {
  if (!florestaMilKm2 || florestaMilKm2 <= 0) return undefined;
  if (!Number.isFinite(desmatamentoMilKm2) || desmatamentoMilKm2 < 0)
    return undefined;
  return (desmatamentoMilKm2 / florestaMilKm2) * PORCENTO;
}
/**
 * De quem a unidade fala, lido do próprio texto dela. Deriva em vez de pedir
 * uma palavra por indicador: "% de ocupados informais" dá "ocupado", "% de
 * setores com HHI acima de 2.500" dá "setor".
 *
 * **Sujeito não nomeado na unidade não ganha frase.** Sem essa exigência a
 * unidade "% da malha rodoviária em estado bom" virava "uma pessoa em cada
 * três", que é falso. Perdemos algumas frases verdadeiras ("comparecimento na
 * última eleição (%)") e nenhuma falsa: quem não casa cai no número. Onde
 * faltar, o conserto é uma linha nesta lista.
 */
const SUJEITOS: readonly (readonly [RegExp, Sujeito])[] = [
  [/popula[cç]|habitante/i, PESSOA],
  [/ocupad/i, { singular: "ocupado", plural: "ocupados" }],
  [
    /desocupad|desempreg/i,
    { singular: "pessoa", plural: "pessoas", feminino: true },
  ],
  [/domic[ií]li/i, { singular: "domicílio", plural: "domicílios" }],
  [/setor/i, { singular: "setor", plural: "setores" }],
  [/deputad/i, { singular: "deputado", plural: "deputados" }],
  [/jovem|jovens/i, { singular: "jovem", plural: "jovens" }],
  [/crian[cç]a/i, { singular: "criança", plural: "crianças", feminino: true }],
  [/idos/i, { singular: "idoso", plural: "idosos" }],
  [/adult/i, { singular: "adulto", plural: "adultos" }],
  [/empresa/i, { singular: "empresa", plural: "empresas", feminino: true }],
  [/munic[ií]pi/i, { singular: "município", plural: "municípios" }],
  [/escola/i, { singular: "escola", plural: "escolas", feminino: true }],
];

/** O sujeito que a unidade nomeia, ou nenhum. */
export function sujeitoDaUnidade(unidade: string): Sujeito | undefined {
  return SUJEITOS.find(([casa]) => casa.test(unidade))?.[1];
}

/**
 * Quantos em cada quantos, em palavras. Fora da escala não vira fração:
 * ninguém e todos têm leitura própria, porque "dez em cada dez" é pior que
 * "todas as pessoas".
 */
export function emCada(percentual: number, sujeito: Sujeito = PESSOA): string {
  if (!Number.isFinite(percentual)) return "";
  const { singular, plural, feminino = false } = sujeito;
  const artigo = feminino ? "as" : "os";
  if (percentual <= 0) return `${feminino ? "nenhuma" : "nenhum"} ${singular}`;
  if (percentual >= PORCENTO)
    return `${feminino ? "todas" : "todos"} ${artigo} ${plural}`;
  const fracao = fracaoLegivel(percentual);
  if (fracao === undefined) return "";
  const { numerador, denominador } = fracao;
  if (numerador === 1 && denominador === METADE)
    return `metade d${artigo} ${plural}`;
  const quantos = numeral(numerador, feminino);
  const emCadaQuantos = `em cada ${numeral(denominador, feminino)}`;
  return numerador === 1
    ? `${quantos} ${singular} ${emCadaQuantos}`
    : `${quantos} ${plural} ${emCadaQuantos}`;
}

/** O que a frase precisa saber da bolha, sem depender da visão inteira. */
export type BolhaParaFrase = Readonly<{
  tipo: string;
  valor: number;
  medida?: Readonly<{ valor: number; unidade: string }>;
}>;

/**
 * Porcentagem de uma quantia contínua, que não vira "um em cada N". Casa
 * "carga tributária bruta (% do PIB)"; recusa "% da população com plano".
 */
const DE_QUANTIA =
  /% do PIB|% da receita|% do sal|% da renda|\/ renda|% da folha|% do gasto|encargos sobre/i;
/**
 * Taxa ou índice, que se lê em pontos e não em gente. Casa "inflação ao
 * consumidor em 12 meses (%)"; recusa "% de ocupados informais".
 */
const TAXA =
  /infla[cç]|juros|c[aâ]mbio|crescimento|Gini|[ií]ndice|ao ano|taxa de|diferen[cç]a|raz[aã]o|por vaga|m[eé]dia d/i;

/** Metade da escala de satisfação: acima disso o grupo apoia. */
const MEIO = 50;
/** Satisfação bem alta e bem baixa, para a frase do grupo não ser morna. */
const MUITO = 70;
const POUCO = 30;

/**
 * A frase de uma bolha, pelos jeitos da mecânica (`pais-em-frases.md` 2.6).
 * Devolve `undefined` quando o jeito é faixa escrita e ela ainda não existe —
 * a tela cai no número, em vez de inventar texto.
 */
export function fraseDaBolha(bolha: BolhaParaFrase): string | undefined {
  if (bolha.tipo === "situacao")
    return bolha.valor > 0 ? "está acontecendo agora" : undefined;
  if (bolha.tipo === "grupo") {
    if (bolha.valor >= MUITO) return "está do lado do governo";
    if (bolha.valor >= MEIO) return "apoia o governo, sem entusiasmo";
    if (bolha.valor >= POUCO) return "está insatisfeito com o governo";
    return "virou oposição ao governo";
  }
  const unidade = bolha.medida?.unidade;
  const valor = bolha.medida?.valor;
  if (unidade === undefined || valor === undefined) return undefined;
  if (DE_QUANTIA.test(unidade) || TAXA.test(unidade)) return undefined;
  if (!/%/.test(unidade)) return undefined;
  const sujeito = sujeitoDaUnidade(unidade);
  if (sujeito === undefined) return undefined;
  return emCada(valor, sujeito) || undefined;
}
