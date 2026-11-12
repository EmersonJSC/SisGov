// Quanto uma lei andou desde o começo do mandato, e se isso basta ao programa.
import { leiAtiva, type Lei, type ValorLei } from "../leis";
import type { LeiDoPrograma } from "./tipos";

/** Folga do arredondamento ao comparar com o mínimo. */
const FOLGA = 1e-9;

/** Valor da lei quando ninguém a mexeu: o mínimo da faixa ou a primeira opção. */
export const valorPadrao = (lei: Lei): ValorLei =>
  lei.forma === "continua" ? lei.faixa.min : (lei.opcoes[0]?.id ?? "");

/** Onde o valor está na régua da lei, de 0 (começo) a 1 (fim). */
export function posicaoNaRegua(lei: Lei, valor: ValorLei): number {
  if (lei.forma === "continua") {
    const { min, max } = lei.faixa;
    return max > min ? ((valor as number) - min) / (max - min) : 0;
  }
  const ultima = lei.opcoes.length - 1;
  const indice = lei.opcoes.findIndex((o) => o.id === valor);
  return ultima > 0 && indice > 0 ? indice / ultima : 0;
}

/** Tamanho de um degrau na régua (um passo, ou uma opção da escada). */
function tamanhoDoDegrau(lei: Lei): number {
  if (lei.forma === "continua") {
    const { min, max } = lei.faixa;
    return max > min ? lei.passo / (max - min) : 1;
  }
  return 1 / Math.max(1, lei.opcoes.length - 1);
}

/** A lei ligou ou desligou na direção pedida? */
function mudouDeEstado(
  lei: Lei,
  { direcao }: LeiDoPrograma,
  de: ValorLei,
  para: ValorLei,
): boolean {
  const antes = leiAtiva(lei, de);
  const agora = leiAtiva(lei, para);
  if (antes === agora) return false;
  return direcao === "desce" ? !agora : direcao === "sobe" ? agora : true;
}

/** A lei andou, de `de` para `para`, o que o programa pede dela? */
export function andou(
  lei: Lei,
  pedido: LeiDoPrograma,
  de: ValorLei,
  para: ValorLei,
): boolean {
  if (pedido.minimo === "ativa") return mudouDeEstado(lei, pedido, de, para);
  const delta = posicaoNaRegua(lei, para) - posicaoNaRegua(lei, de);
  const naDirecao =
    pedido.direcao === "sobe"
      ? delta
      : pedido.direcao === "desce"
        ? -delta
        : Math.abs(delta);
  const minimo =
    pedido.minimo === "degrau" ? tamanhoDoDegrau(lei) : pedido.minimo;
  return naDirecao > FOLGA && naDirecao + FOLGA >= minimo;
}
