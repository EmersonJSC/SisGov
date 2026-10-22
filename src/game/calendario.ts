/**
 * Calendário da partida (mecânica 1, docs/jogo/mecanicas/tempo.md).
 *
 * O motor calcula um passo por mês. O turno do jogador ainda é um trimestre;
 * o tempo corrido com semanas vem depois. Toda conversão entre turno, mês,
 * semana e ano passa por aqui, para não haver contas soltas pelo código.
 */

export const MESES_POR_TURNO = 3;
export const MESES_POR_ANO = 12;
export const SEMANAS_POR_MES = 4;
export const TURNOS_POR_ANO = MESES_POR_ANO / MESES_POR_TURNO;

/** Data do jogo. `mes` vai de 1 a 12; `trimestre`, de 1 a 4. */
export type DataDoJogo = Readonly<{
  ano: number;
  mes: number;
  trimestre: number;
}>;

/** Meses de jogo passados até o início de um turno. */
export function mesesAteOTurno(turno: number): number {
  return turno * MESES_POR_TURNO;
}

/** Turno em que cai um mês de jogo (o mês 0 é o primeiro do turno 0). */
export function turnoDoMes(meses: number): number {
  return Math.floor(meses / MESES_POR_TURNO);
}

/** Data de um mês de jogo, contado a partir de janeiro do ano inicial. */
export function dataDoMes(anoInicial: number, meses: number): DataDoJogo {
  const ano = anoInicial + Math.floor(meses / MESES_POR_ANO);
  const mes = (((meses % MESES_POR_ANO) + MESES_POR_ANO) % MESES_POR_ANO) + 1;
  return { ano, mes, trimestre: Math.ceil(mes / MESES_POR_TURNO) };
}

/** Ano com fração (2027,25 = abril de 2027), para idades e prazos. */
export function anoComFracao(anoInicial: number, meses: number): number {
  return anoInicial + meses / MESES_POR_ANO;
}
