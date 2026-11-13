/**
 * As cadeiras do Congresso, uma bolinha por cadeira, em meias-luas concêntricas
 * (como os gráficos de parlamento): a Câmara na metade de cima do anel, o Senado
 * na de baixo, cada bolinha na cor do partido e os partidos em fatias, do maior
 * ao menor. Funções puras; só posições e cores.
 */
import type { VisaoCasa } from "../../partida";

export type Assento = Readonly<{
  x: number;
  y: number;
  raio: number;
  cor: string;
  governo: boolean;
}>;

const PI = Math.PI;
const METADE = 0.5;
/** Quantas cadeiras cabem por fila antes de abrir outra. */
const CADEIRAS_POR_FILA = 130;
const MAXIMO_DE_FILAS = 4;
/** Folga angular nas pontas da meia-lua, para as duas metades não se encostarem. */
const FOLGA_DAS_PONTAS = 0.012;
/** O raio da bolinha é esta fração do menor espaço entre vizinhas. */
const FRACAO_DO_ESPACO = 0.42;

export type Metade = "cima" | "baixo";

/** Raios das filas, centradas na faixa entre `de` e `ate`. */
function raiosDasFilas(filas: number, de: number, ate: number): number[] {
  const passo = filas > 1 ? (ate - de) / (filas - 1) : 0;
  const meio = (de + ate) * METADE;
  return Array.from(
    { length: filas },
    (_, k) => meio + (k - (filas - 1) * METADE) * passo,
  );
}

/**
 * Posições das cadeiras de uma casa numa meia-lua. `cima` vai da esquerda à
 * direita por cima do centro; `baixo`, da esquerda à direita por baixo.
 */
export function assentosDaCasa(
  casa: VisaoCasa,
  metade: Metade,
  de: number,
  ate: number,
  opcoes: Readonly<{
    /** Força o número de filas (a casa pequena fica mais encorpada em duas). */
    filas?: number;
    /** Raio fixo da bolinha, em vez do calculado pelo espaço. */
    raio?: number;
  }> = {},
): Assento[] {
  const total = casa.total;
  if (total <= 0) return [];
  const filas =
    opcoes.filas ??
    Math.min(
      MAXIMO_DE_FILAS,
      Math.max(1, Math.ceil(total / CADEIRAS_POR_FILA)),
    );
  const raios = raiosDasFilas(filas, de, ate);
  const somaDosRaios = raios.reduce((s, r) => s + r, 0);
  // cada fila leva cadeiras na proporção do seu comprimento
  const porFila = raios.map((r) => Math.round((total * r) / somaDosRaios));
  porFila[porFila.length - 1] += total - porFila.reduce((s, n) => s + n, 0);

  const sentido = metade === "cima" ? 1 : -1;
  const posicoes = raios.flatMap((r, k) =>
    Array.from({ length: porFila[k] }, (_, i) => {
      const t =
        FOLGA_DAS_PONTAS +
        (1 - 2 * FOLGA_DAS_PONTAS) * ((i + METADE) / porFila[k]);
      // de 180° a 360° por cima, ou de 180° a 0° por baixo
      const angulo = PI + sentido * t * PI;
      return { r, angulo, t };
    }),
  );
  const espacoRadial = filas > 1 ? (ate - de) / (filas - 1) : Infinity;
  const espacoNoArco = Math.min(
    ...raios.map((r, k) => (PI * r * (1 - 2 * FOLGA_DAS_PONTAS)) / porFila[k]),
  );
  const raio =
    opcoes.raio ?? FRACAO_DO_ESPACO * Math.min(espacoRadial, espacoNoArco);

  // os partidos viram fatias: ordena as cadeiras da esquerda para a direita
  const emOrdem = [...posicoes].sort((a, b) => a.t - b.t || a.r - b.r);
  const donos = casa.partidos.flatMap((p) =>
    Array.from({ length: p.cadeiras }, () => p),
  );
  return emOrdem.map((p, i) => {
    const dono = donos[i] ?? casa.partidos[casa.partidos.length - 1];
    return {
      x: Math.cos(p.angulo) * p.r,
      y: Math.sin(p.angulo) * p.r,
      raio,
      cor: dono.cor,
      governo: dono.governo,
    };
  });
}
