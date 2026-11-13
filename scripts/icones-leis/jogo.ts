// Ícones do game-icons.net (CC BY 3.0, crédito no jogo), lidos do pacote
// @iconify-json/game-icons. Cada ícone é uma silhueta cheia em grade 512; aqui
// vira um grupo da grade 24 que cabe no selo (estilo.ts) como qualquer desenho.
import iconesJson from "@iconify-json/game-icons/icons.json";

interface Pacote {
  icons: Record<string, { body: string }>;
}

export const ICONES_DO_JOGO = (iconesJson as Pacote).icons;

const GRADE_DO_JOGO = 512;
const GRADE_DO_SELO = 24;

/** O ícone do jogo pelo nome (ex.: "tank"), pronto para entrar no selo. */
export function jogo(nome: string): string {
  const icone = ICONES_DO_JOGO[nome];
  if (!icone) throw new Error(`game-icons: não existe "${nome}"`);
  return `<g transform="scale(${GRADE_DO_SELO / GRADE_DO_JOGO})" fill="currentColor" stroke="none">${icone.body}</g>`;
}
