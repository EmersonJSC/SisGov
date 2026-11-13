// O partido do jogador: nasce da chapa. O lado vem da bússola das pessoas,
// as cadeiras vêm dos partidos delas e a coligação é feita por elas.
import type { Partido } from "../politica";
import { EIXOS, type PontoBussola } from "../leis";

/** Quantos grupos o partido novo diz defender e o peso total entre eles. */
const GRUPOS_DEFENDIDOS = 5;
const PESO_TOTAL = 1.2;
/** Fração das cadeiras que o partido novo toma dos partidos da chapa. */
export const FRACAO_DE_ESTREIA = 0.06;

/** Grupos mais perto da posição da chapa, com peso que cai com a distância. */
export function defendeDaBussola(
  centro: PontoBussola,
  grupos: { id: string; bussola: PontoBussola }[],
): Record<string, number> {
  const proximidade = grupos
    .map((g) => ({
      id: g.id,
      pontos: Math.max(
        0.01,
        1 -
          Math.sqrt(
            EIXOS.reduce(
              (soma, e) => soma + ((g.bussola[e] ?? 0) - (centro[e] ?? 0)) ** 2,
              0,
            ),
          ) /
            2,
      ),
    }))
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, GRUPOS_DEFENDIDOS);
  const soma = proximidade.reduce((total, g) => total + g.pontos, 0);
  return Object.fromEntries(
    proximidade.map((g) => [
      g.id,
      Math.round((g.pontos / soma) * PESO_TOTAL * 100) / 100,
    ]),
  );
}

/** Tira `total` cadeiras dos doadores (ou de todos) na proporção do que têm. */
export function tomarCadeiras(
  cadeiras: Record<string, number>,
  doadores: string[],
  total: number,
): Record<string, number> {
  const alvo = doadores.length > 0 ? doadores : Object.keys(cadeiras);
  const soma = alvo.reduce((s, id) => s + (cadeiras[id] ?? 0), 0);
  return Object.fromEntries(
    Object.entries(cadeiras).map(([id, n]) => [
      id,
      alvo.includes(id) ? n - Math.round((n / soma) * total) : n,
    ]),
  );
}

/** Soma do que `tomarCadeiras` tirou: pode diferir de `total` por arredondamento. */
export const cadeirasTomadas = (
  antes: Record<string, number>,
  depois: Record<string, number>,
) => Object.keys(antes).reduce((s, id) => s + antes[id] - (depois[id] ?? 0), 0);

/** O Congresso com o partido novo, que toma as cadeiras dos `doadores`. */
export function comPartidoNovo<P extends Partido>(
  partidos: P[],
  novo: Omit<P, "cadeiras">,
  doadores: string[],
): P[] {
  const antes = Object.fromEntries(partidos.map((p) => [p.id, p.cadeiras]));
  const total = Object.values(antes).reduce((s, n) => s + n, 0);
  const depois = tomarCadeiras(
    antes,
    doadores,
    Math.round(total * FRACAO_DE_ESTREIA),
  );
  return [
    ...partidos.map((p) => ({ ...p, cadeiras: depois[p.id] })),
    { ...novo, cadeiras: cadeirasTomadas(antes, depois) } as P,
  ];
}
