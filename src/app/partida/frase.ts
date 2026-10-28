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
 * A fração de denominador pequeno mais perto de `percentual`. Empate fica com
 * o denominador menor, que é o mais fácil de imaginar (um em cada três antes
 * de três em cada nove).
 */
export function fracaoLegivel(percentual: number): Fracao {
  const alvo = percentual / PORCENTO;
  const candidatas = Array.from(
    { length: DENOMINADOR_MAXIMO - 1 },
    (_, i) => i + METADE,
  ).map((denominador) => {
    const bruto = Math.round(alvo * denominador);
    const numerador = Math.min(Math.max(bruto, 1), denominador);
    return {
      numerador,
      denominador,
      erro: Math.abs(alvo - numerador / denominador),
    };
  });
  const melhor = candidatas.reduce((a, b) => (b.erro < a.erro - FOLGA ? b : a));
  return { numerador: melhor.numerador, denominador: melhor.denominador };
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
  const { numerador, denominador } = fracaoLegivel(percentual);
  if (numerador === 1 && denominador === METADE)
    return `metade d${artigo} ${plural}`;
  const quantos = numeral(numerador, feminino);
  const emCadaQuantos = `em cada ${numeral(denominador, feminino)}`;
  return numerador === 1
    ? `${quantos} ${singular} ${emCadaQuantos}`
    : `${quantos} ${plural} ${emCadaQuantos}`;
}
