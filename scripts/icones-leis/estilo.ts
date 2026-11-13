// Estilo dos ícones (receita em .claude/skills/sisgov-icones/SKILL.md): traço de
// tinta numa grade 24x24 e uma mancha de tinta clara na forma principal. A cor é
// sempre `currentColor`; quem usa decide a tinta.

/** A mancha: a forma principal do desenho ganha tinta clara por dentro. */
export const CHEIO = 'fill="currentColor" fill-opacity=".22"';
/** Cheio sem contorno (líquido num copo, terra num vaso). */
export const MANCHA = 'fill="currentColor" fill-opacity=".22" stroke="none"';
/** Ponto ou peça pequena em tinta cheia. */
export const TINTA = 'fill="currentColor" stroke="none"';

const PAPEL = "var(--fundo-lei,#efe4cc)";
const RAIZ = `xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"`;

/** O ícone da lei no selo: escala e centro na grade 24x24. */
const LEI = { escala: 0.62, centro: 10.4 };
/** A bolinha da esfera no pé do selo, sem sair do círculo de raio 12. */
const BOLINHA = { centro: 16.9, raio: 4.6, escala: 0.27 };

const mover = (centro: number, escala: number) =>
  `translate(${(centro - 12 * escala).toFixed(2)} ${(centro - 12 * escala).toFixed(2)}) scale(${escala})`;

/** O ícone da esfera sozinho (área do mapa, cabeçalhos). */
export function svgDaEsfera(desenho: string): string {
  return `<svg ${RAIZ} stroke-width="1.8">${desenho}</svg>`;
}

/** O ícone da lei: o desenho dela no selo e, no pé, a bolinha com a esfera. */
export function svgDaLei(desenho: string, esfera: string): string {
  const { centro, raio, escala } = BOLINHA;
  return (
    `<svg ${RAIZ} stroke-width="1.8">` +
    `<g transform="${mover(LEI.centro, LEI.escala)}" stroke-width="${(1.8 / LEI.escala) * 0.62}">${desenho}</g>` +
    `<circle cx="${centro}" cy="${centro}" r="${raio + 1}" fill="${PAPEL}" stroke="none"/>` +
    `<circle cx="${centro}" cy="${centro}" r="${raio}" fill="${PAPEL}" stroke-width=".8"/>` +
    `<g transform="${mover(centro, escala)}" stroke-width="${(1.8 / escala) * 0.3}">${esfera}</g>` +
    `</svg>`
  );
}
