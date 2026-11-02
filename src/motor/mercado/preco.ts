// Preço do mundo por produto (src/motor/mercado/mercado.md, fatia 3). O país
// não mexe nele; o ruído depende só do turno e do produto, para não gastar o
// acaso da partida.
import { sortearNormal } from "../acaso";
import type { Mercado } from "./index";
import type { ProducaoDoMundo } from "./producao";

export interface Preco {
  /** Base 100 = oferta igual à demanda do mundo. */
  valor: number;
  /** % contra o turno anterior. */
  variacao: number;
}

const BASE = 100;
const EXPOENTE = 1.5;
const PISO = 40;
const TETO = 250;
/** Parte do caminho até o alvo que o preço anda por turno. */
const PASSO = 0.25;
/** Tamanho do ruído de um turno (fração do preço). */
const RUIDO = 0.02;
const LIMITE_RUIDO = 1;

const limitar = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/** O preço que a oferta e a demanda do mundo pedem. */
export function alvoDoPreco(
  producao: ProducaoDoMundo,
  produto: string,
): number {
  const potencias = Object.values(producao);
  const demanda = BASE * potencias.length;
  const oferta = potencias.reduce((soma, c) => soma + (c[produto] ?? 0), 0);
  if (oferta <= 0) return TETO;
  return limitar(BASE * Math.pow(demanda / oferta, EXPOENTE), PISO, TETO);
}

export function precosIniciais(
  mercado: Mercado,
  producao: ProducaoDoMundo,
): Record<string, Preco> {
  return Object.fromEntries(
    mercado.produtos.map((p) => [
      p.id,
      { valor: alvoDoPreco(producao, p.id), variacao: 0 },
    ]),
  );
}

const ruido = (turno: number, indice: number) =>
  limitar(
    sortearNormal(turno * 7919 + indice * 104729 + 12345)[0],
    -LIMITE_RUIDO * 2,
    LIMITE_RUIDO * 2,
  ) *
  (RUIDO / LIMITE_RUIDO);

/** Um turno: cada preço anda rumo ao alvo e leva o ruído do turno. */
export function andarPrecos(
  mercado: Mercado,
  producao: ProducaoDoMundo,
  atuais: Record<string, Preco>,
  turno: number,
): Record<string, Preco> {
  return Object.fromEntries(
    mercado.produtos.map((p, i) => {
      const antes = atuais[p.id]?.valor ?? alvoDoPreco(producao, p.id);
      const alvo = alvoDoPreco(producao, p.id);
      const valor = limitar(
        (antes + PASSO * (alvo - antes)) * (1 + ruido(turno, i)),
        PISO,
        TETO,
      );
      return [p.id, { valor, variacao: ((valor - antes) / antes) * 100 }];
    }),
  );
}

/** A potência que mais produz o produto: a que vende mais barato. */
export function maisBarata(
  producao: ProducaoDoMundo,
  produto: string,
): string | undefined {
  let melhor: string | undefined;
  let maior = 0;
  for (const [potencia, c] of Object.entries(producao))
    if ((c[produto] ?? 0) > maior) {
      maior = c[produto] ?? 0;
      melhor = potencia;
    }
  return melhor;
}
