import type { ProfileApproval } from "../model/contentTypes";

/** Perfis já em índices: o turno não procura texto a cada mês. */
type Compiled = Readonly<{
  segments: readonly string[];
  /** Onde começam os membros de cada perfil (comprimento = perfis + 1). */
  start: Int32Array;
  member: Int32Array;
  /** Peso do eixo de cada membro, já dividido pela soma do perfil. */
  share: Float64Array;
  weight: Float64Array;
}>;

const compiledCache = new WeakMap<ProfileApproval, Compiled>();

function compile(definition: ProfileApproval): Compiled {
  const cached = compiledCache.get(definition);
  if (cached) return cached;
  const segments = Object.keys(definition.pesos).sort();
  const index = new Map(segments.map((id, i) => [id, i]));
  const profiles = definition.perfis;
  const start = new Int32Array(profiles.length + 1);
  const size = profiles.reduce((n, p) => n + p.segmentos.length, 0);
  const member = new Int32Array(size);
  const share = new Float64Array(size);
  const weight = new Float64Array(profiles.length);
  let at = 0;
  profiles.forEach((profile, p) => {
    start[p] = at;
    weight[p] = profile.peso;
    const total = profile.segmentos.reduce(
      (sum, id) => sum + definition.pesos[id],
      0,
    );
    for (const id of profile.segmentos) {
      member[at] = index.get(id)!;
      share[at] = definition.pesos[id] / total;
      at += 1;
    }
  });
  start[profiles.length] = at;
  const compiled = { segments, start, member, share, weight };
  compiledCache.set(definition, compiled);
  return compiled;
}

/** Segmentos que a aprovação lê (para a ordem das bolhas no mês). */
export function profileApprovalInputs(
  definition: ProfileApproval,
): readonly string[] {
  return compile(definition).segments;
}

/**
 * Aprovação, de 0 a 100: a parte do eleitorado que aprova, somando a chance
 * de cada perfil pelo peso dele (V1-08). `undefined` se faltar um segmento.
 */
export function profileApproval(
  definition: ProfileApproval,
  read: (nodeId: string) => number | undefined,
): number | undefined {
  const { segments, start, member, share, weight } = compile(definition);
  const values = new Float64Array(segments.length);
  for (let i = 0; i < segments.length; i++) {
    const value = read(segments[i]);
    if (value === undefined || !Number.isFinite(value)) return undefined;
    values[i] = value;
  }
  const k = definition.k;
  let total = 0;
  for (let p = 0; p < weight.length; p++) {
    let satisfaction = 0;
    for (let at = start[p]; at < start[p + 1]; at++)
      satisfaction += share[at] * values[member[at]];
    total += weight[p] / (1 + Math.exp(-(satisfaction - 50) / k));
  }
  return 100 * total;
}
