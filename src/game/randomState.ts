import type { ContentDiagnostic, ValidationResult } from "../engine";

export type RandomState = Readonly<{
  algorithm: "xorshift32-v1";
  seed: number;
  state: number;
}>;

export type RandomDraws = Readonly<{
  state: RandomState;
  values: readonly number[];
}>;

function invalid(field: string, message: string): ValidationResult<never> {
  const diagnostic: ContentDiagnostic = {
    code: "COMANDO_INVALIDO",
    file: "$partida",
    field,
    message,
  };
  return { ok: false, diagnostics: [diagnostic] };
}

function validSeed(seed: number): boolean {
  return Number.isSafeInteger(seed) && seed > 0 && seed <= 0xffffffff;
}

export function createRandomState(seed: number): ValidationResult<RandomState> {
  if (!validSeed(seed))
    return invalid(
      "random.seed",
      "A semente deve ser um inteiro entre 1 e 2^32 - 1.",
    );
  return { ok: true, value: { algorithm: "xorshift32-v1", seed, state: seed } };
}

export function drawRandomValues(
  state: RandomState,
  count: number,
): ValidationResult<RandomDraws> {
  if (state.algorithm !== "xorshift32-v1")
    return invalid("random.algorithm", "Algoritmo aleatório não suportado.");
  if (!validSeed(state.seed) || !validSeed(state.state))
    return invalid("random.state", "Estado aleatório inválido.");
  if (!Number.isSafeInteger(count) || count < 0)
    return invalid(
      "random.count",
      "A quantidade de sorteios deve ser um inteiro não negativo.",
    );
  let current = state.state >>> 0;
  const values: number[] = [];
  for (let index = 0; index < count; index += 1) {
    current ^= current << 13;
    current ^= current >>> 17;
    current ^= current << 5;
    current >>>= 0;
    values.push(current / 0x100000000);
  }
  return {
    ok: true,
    value: {
      values,
      state: { ...state, state: current },
    },
  };
}

// ---------------------------------------------------------------------------
// Sorteio por hash (semente, turno, chave)
// ---------------------------------------------------------------------------

function hash32(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  // mistura final (xorshift)
  h ^= h << 13;
  h ^= h >>> 17;
  h ^= h << 5;
  return h >>> 0;
}

/** Número em [0, 1) fixo para (semente, turno, chave). */
export function roll(seed: number, turn: number, key: string): number {
  return hash32(`${seed}|${turn}|${key}`) / 0x100000000;
}
