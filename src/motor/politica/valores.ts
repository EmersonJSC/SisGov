// Contas sobre o valor das leis: ceder, emendar, alcance do decreto, reservas.
import type { Lei, ValorLei } from "../leis";
import {
  CARGOS_POR_FRACAO,
  CEDER_NA_REGUA,
  EMENDA_A_MEIO_CAMINHO,
  EMENDAS_POR_DEGRAU,
} from "./constantes";
import type { Congresso } from "./tipos";

type Leis = Record<string, Lei>;
type Valores = Record<string, ValorLei>;

/** Posição da opção em uso na lei de opções; -1 se não há. */
const degrau = (lei: Lei | undefined, valores: Valores): number =>
  lei?.forma === "opcoes"
    ? lei.opcoes.findIndex((o) => o.id === valores[lei.id])
    : -1;

/** Valor da régua depois de andar `fracao` do atual até o pedido, em passos da lei. */
function andar(
  lei: Lei,
  de: ValorLei | undefined,
  para: ValorLei,
  fracao: number,
): ValorLei | null {
  if (lei.forma !== "continua") return null;
  const antes = (de as number | undefined) ?? lei.faixa.min;
  const alvo = antes + ((para as number) - antes) * fracao;
  return (
    lei.faixa.min + Math.round((alvo - lei.faixa.min) / lei.passo) * lei.passo
  );
}

/** O governo cede na régua; null se a lei não tem régua. */
export const valorCedido = (
  lei: Lei,
  de: ValorLei | undefined,
  pedido: ValorLei,
) => andar(lei, de, pedido, 1 - CEDER_NA_REGUA);

/** O Senado emenda a meio caminho; null se não há régua ou o valor não muda. */
export function valorEmendado(
  lei: Lei,
  de: ValorLei | undefined,
  para: ValorLei,
): ValorLei | null {
  const meio = andar(lei, de, para, EMENDA_A_MEIO_CAMINHO);
  const antes = lei.forma === "continua" ? (de ?? lei.faixa.min) : null;
  return meio === antes || meio === para ? null : meio;
}

/** 0 nenhum, 1 verba e preço, 2 tudo de classe comum, 3 tudo sem confirmar. */
export type Alcance = 0 | 1 | 2 | 3;

/** Degrau do Poder de decreto em uso (as opções crescem em alcance). */
export function alcanceDoDecreto(
  c: Congresso,
  leis: Leis,
  valores: Valores,
): Alcance {
  const lei = c.leis?.decreto ? leis[c.leis.decreto] : undefined;
  const i = degrau(lei, valores);
  if (!lei || lei.forma !== "opcoes" || i <= 0) return 0;
  if (i === lei.opcoes.length - 1) return 3;
  return i === 1 ? 1 : 2;
}

/** O decreto alcança esta lei neste degrau? */
export function decretoAlcanca(lei: Lei, alcance: Alcance): boolean {
  if (alcance === 1) return lei.forma === "continua" && lei.conta === "gasto";
  if (alcance === 2) return (lei.classe ?? "comum") === "comum";
  return alcance === 3;
}

/** Cargos de livre nomeação que o mandato permite. */
export function reservaDeCargos(
  c: Congresso,
  leis: Leis,
  valores: Valores,
): number {
  const id = c.leis?.cargos;
  const v = id && leis[id] ? valores[id] : undefined;
  return typeof v === "number" ? Math.round(v * CARGOS_POR_FRACAO) : 0;
}

/** Emendas dos parlamentares que o mandato permite. */
export function reservaDeEmendas(
  c: Congresso,
  leis: Leis,
  valores: Valores,
): number {
  const id = c.leis?.emendas;
  // sem a lei, nenhuma emenda; cada degrau dela libera mais (nada = não legislada)
  return (degrau(id ? leis[id] : undefined, valores) + 1) * EMENDAS_POR_DEGRAU;
}
