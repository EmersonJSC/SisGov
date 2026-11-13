/**
 * Como vai um índice (decidido com o autor, 13/nov): a *saúde* vai de 0 (péssimo) a
 * 100 (ótimo), no sentido que o índice declara ("maior é melhor" ou "maior é
 * pior"). O estado junta o nível e a tendência:
 *
 * - crítico: saúde abaixo de 15 e piorando;
 * - preocupante: saúde abaixo de 33, ou piorou 5 pontos ou mais desde o turno anterior;
 * - bom: saúde acima de 66 e sem piorar;
 * - normal: o resto (os índices neutros ficam sempre aqui).
 *
 * Os cortes são palpites para a calibração do fim.
 */
import type { AlertaDoIndice, TendenciaDoIndice } from "./tiposVisao";

const FIM_DA_ESCALA = 100;
const SAUDE_CRITICA = 15;
const SAUDE_PREOCUPANTE = 33;
const SAUDE_BOA = 66;
/** Pontos de saúde que contam como piorar ou melhorar de um turno para o outro. */
export const PASSO_DA_TENDENCIA = 5;

export type SituacaoDoIndice = Readonly<{
  saude?: number;
  alerta: AlertaDoIndice;
  tendencia: TendenciaDoIndice;
  mudancaDaSaude?: number;
}>;

/** Posição do valor na faixa do índice, de 0 a 100. */
const naFaixa = (valor: number, minimo: number, maximo: number) =>
  maximo > minimo
    ? Math.max(
        0,
        Math.min(
          FIM_DA_ESCALA,
          ((valor - minimo) / (maximo - minimo)) * FIM_DA_ESCALA,
        ),
      )
    : FIM_DA_ESCALA / 2;

export function situacaoDoIndice(
  entrada: Readonly<{
    avaliacao: string;
    valor: number;
    anterior?: number;
    minimo: number;
    maximo: number;
  }>,
): SituacaoDoIndice {
  const { avaliacao, valor, anterior, minimo, maximo } = entrada;
  if (avaliacao !== "maior_melhor" && avaliacao !== "maior_pior")
    return { alerta: "normal", tendencia: "estavel" };
  const paraSaude = (v: number) => {
    const posicao = naFaixa(v, minimo, maximo);
    return avaliacao === "maior_melhor" ? posicao : FIM_DA_ESCALA - posicao;
  };
  const saude = paraSaude(valor);
  const mudancaDaSaude =
    anterior === undefined ? undefined : saude - paraSaude(anterior);
  const tendencia: TendenciaDoIndice =
    mudancaDaSaude === undefined
      ? "estavel"
      : mudancaDaSaude <= -PASSO_DA_TENDENCIA
        ? "piorando"
        : mudancaDaSaude >= PASSO_DA_TENDENCIA
          ? "melhorando"
          : "estavel";
  const alerta: AlertaDoIndice =
    saude < SAUDE_CRITICA && tendencia === "piorando"
      ? "critico"
      : saude < SAUDE_PREOCUPANTE || tendencia === "piorando"
        ? "preocupante"
        : saude > SAUDE_BOA
          ? "bom"
          : "normal";
  return { saude, alerta, tendencia, mudancaDaSaude };
}
