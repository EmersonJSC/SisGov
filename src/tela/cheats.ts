// Cheats para testar: palavras digitadas fora de qualquer campo de texto.
// Valem na tela inicial; a lista é o contrato (cheats.test.ts).
export const CHEATS = ["senado", "pular"] as const;
export type Cheat = (typeof CHEATS)[number];

/** Letras guardadas: o bastante para a maior palavra. */
const TAMANHO_DO_BUFFER = Math.max(...CHEATS.map((c) => c.length));

/** Cheat que o texto digitado termina de escrever, ou nulo. */
export function cheatDigitado(texto: string): Cheat | null {
  const fim = texto.toLowerCase();
  return CHEATS.find((c) => fim.endsWith(c)) ?? null;
}

/** Acrescenta a tecla ao texto e diz se completou um cheat (e zera o texto). */
export function digitar(
  texto: string,
  tecla: string,
): { texto: string; cheat: Cheat | null } {
  if (tecla.length !== 1) return { texto, cheat: null };
  const novo = (texto + tecla).slice(-TAMANHO_DO_BUFFER);
  const cheat = cheatDigitado(novo);
  return { texto: cheat ? "" : novo, cheat };
}
