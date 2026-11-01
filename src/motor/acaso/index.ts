// Acaso com semente. O estado do sorteio mora no estado da partida, então
// mesma semente e mesmos pedidos dão a mesma partida. Gerador: mulberry32
// (domínio público), 32 bits, rápido e suficiente para jogo.

/** Estado do gerador: inteiro de 32 bits sem sinal. */
export type Acaso = number;

export function semear(semente: number): Acaso {
  return semente >>> 0;
}

/** Número em [0, 1) e o próximo estado. */
export function sortear(acaso: Acaso): [number, Acaso] {
  const proximo = (acaso + 0x6d2b79f5) >>> 0;
  let t = proximo;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return [((t ^ (t >>> 14)) >>> 0) / 4294967296, proximo];
}

/** Normal padrão (média 0, desvio 1) por Box-Muller, e o próximo estado. */
export function sortearNormal(acaso: Acaso): [number, Acaso] {
  const [u1, a1] = sortear(acaso);
  const [u2, a2] = sortear(a1);
  const z = Math.sqrt(-2 * Math.log(1 - u1)) * Math.cos(2 * Math.PI * u2);
  return [z, a2];
}
