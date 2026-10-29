import type { ResolvedPackage } from "../../engine";
import { bolsosDoEleitorado, type EleitoradoComBolso } from "./bolso";

/**
 * O bolso entra na satisfação (População, mecânica 2.7, passo 1 dos Grupos).
 *
 * Cada linha do eleitorado ganha (ou perde) pontos de satisfação pelo que
 * mudou na sobra dela, em salários médios, desde o turno 0. A régua é a mesma
 * da renda viva: o país que cresce inteiro não festeja, e no turno 0 o ajuste
 * é zero, então a popularidade de partida não muda. O efeito tem teto, para
 * não haver país que se revolta por centavos.
 */

/** Pontos de satisfação por salário médio anual de diferença na sobra. */
export const PONTOS_POR_SALARIO = 50;
/** O bolso nunca passa disto, para mais ou para menos. */
export const TETO_DO_BOLSO = 10;

type Valores = Readonly<Record<string, number>>;

const inicios = new WeakMap<ResolvedPackage, Valores>();

/**
 * Guarda os valores do turno 0 do pacote: a régua do bolso. Sem isto, o ajuste
 * vale zero. Quem cria ou carrega a partida chama.
 */
export function registrarInicioDoBolso(
  content: ResolvedPackage,
  valoresIniciais: Valores | undefined,
): void {
  if (valoresIniciais) inicios.set(content, valoresIniciais);
  else inicios.delete(content);
}

const chaveDe = (perfil: readonly number[]): string =>
  perfil.slice(1).join(",");

function posicoes(
  { manifesto, bolsos }: EleitoradoComBolso,
  salarioMedio: number | undefined,
): ReadonlyMap<string, number> | undefined {
  if (!(salarioMedio && salarioMedio > 0)) return undefined;
  return new Map(
    manifesto.perfis.map((p, i) => [
      chaveDe(p),
      (bolsos[i]?.sobra ?? 0) / salarioMedio,
    ]),
  );
}

const doInicio = new WeakMap<Valores, ReadonlyMap<string, number> | null>();

/** Os valores do turno 0 que a partida registrou para este pacote. */
export const inicioDoBolso = (content: ResolvedPackage): Valores | undefined =>
  inicios.get(content);

/**
 * Pontos de satisfação de cada linha do eleitorado vivo, na ordem dela.
 * `undefined` sem início registrado.
 */
export function ajusteDoBolso(
  content: ResolvedPackage,
  valores: Valores,
  agora: EleitoradoComBolso,
): readonly number[] | undefined {
  const inicio = inicios.get(content);
  if (!inicio) return undefined;
  let antes = doInicio.get(inicio);
  if (antes === undefined) {
    const e = bolsosDoEleitorado(content, inicio);
    antes = (e && posicoes(e, inicio.salario_medio)) ?? null;
    doInicio.set(inicio, antes);
  }
  const depois = posicoes(agora, valores.salario_medio);
  if (!antes || !depois) return undefined;
  return agora.manifesto.perfis.map((p) => {
    const a = antes.get(chaveDe(p));
    const d = depois.get(chaveDe(p));
    if (a === undefined || d === undefined) return 0;
    return Math.max(
      -TETO_DO_BOLSO,
      Math.min(TETO_DO_BOLSO, PONTOS_POR_SALARIO * (d - a)),
    );
  });
}
