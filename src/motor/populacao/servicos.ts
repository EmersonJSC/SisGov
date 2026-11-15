// Serviço e direito no pop (passo H, GDD 2.1 e 2.3): o serviço que o pop
// recebe vale renda no padrão de vida; o direito fica guardado no pop.
import { pedacos, type Estrato, type Pop, type TipoPop } from ".";

/** Um serviço do mundo (`pops.json › servicos`). */
export interface Servico {
  id: string;
  /** Índice que diz quem é atendido, em % da população (0 a 100). */
  indice: string;
  /** Quanto vale o serviço inteiro, em parte da renda por pessoa de `de` no turno 0. */
  valor: number;
  de: Estrato;
  /** Quem chega antes: peso por estrato (ausente = 1). */
  acesso?: Partial<Record<Estrato, number>>;
  /** Peso de um pop só, por cima do estrato (ex.: o campo fica por último). */
  pops?: Record<string, number>;
}

/** Peso do pop na fila do serviço: o do pop, ou a média dos seus estratos. */
function pesoDoPop(s: Servico, t: TipoPop): number {
  const proprio = s.pops?.[t.id];
  if (proprio !== undefined) return Math.max(0, proprio);
  return pedacos(t).reduce(
    (soma, [e, pp]) => soma + pp * Math.max(0, s.acesso?.[e] ?? 1),
    0,
  );
}

/**
 * Parte de cada pop que o serviço atende (0 a 1). O país atende `parte` da
 * população; quem tem mais peso chega antes, sem passar de 1 por pop.
 */
export function coberturaDosPops(
  tipos: TipoPop[],
  pops: Record<string, Pop>,
  s: Servico,
  parte: number,
): Record<string, number> {
  const lista = tipos
    .filter((t) => pops[t.id])
    .map((t) => ({ id: t.id, n: pops[t.id].pessoas, w: pesoDoPop(s, t) }));
  const total = lista.reduce((soma, p) => soma + p.n, 0);
  const alvo = Math.min(1, Math.max(0, parte)) * total;
  const atende = (k: number) =>
    lista.reduce((soma, p) => soma + p.n * Math.min(1, k * p.w), 0);
  const cobre = (k: number) =>
    Object.fromEntries(lista.map((p) => [p.id, Math.min(1, k * p.w)]));
  if (!(alvo > 0)) return cobre(0);
  // Acha o k em que os atendidos somam o alvo (cresce com k).
  const maxPeso = Math.max(...lista.map((p) => p.w));
  if (!(maxPeso > 0)) return cobre(0);
  let baixo = 0;
  let alto = 1 / Math.min(...lista.filter((p) => p.w > 0).map((p) => p.w));
  if (atende(alto) <= alvo) return cobre(alto);
  for (let i = 0; i < 60; i++) {
    const meio = (baixo + alto) / 2;
    if (atende(meio) < alvo) baixo = meio;
    else alto = meio;
  }
  return cobre(alto);
}

/** Renda por pessoa de um estrato, somando o pedaço de cada pop nele. */
export function rendaDoEstrato(
  tipos: TipoPop[],
  pops: Record<string, Pop>,
  e: Estrato,
): number {
  let gente = 0;
  let renda = 0;
  for (const t of tipos) {
    const p = pops[t.id];
    if (!p || t.dependente !== undefined) continue;
    for (const [es, pp] of pedacos(t))
      if (es === e) {
        gente += p.pessoas * pp;
        renda += p.pessoas * pp * p.renda;
      }
  }
  return gente > 0 ? renda / gente : 0;
}

/**
 * Direito que o pop sente (−1 a 1): a soma do quanto ele liga para cada chave
 * (`TipoPop.direitos`) × o que as leis em vigor dão nela (tomada da chave).
 */
export function direitoDoPop(
  t: TipoPop,
  tomada: (chave: string) => number,
): number | undefined {
  if (!t.direitos) return undefined;
  let soma = 0;
  for (const [chave, peso] of Object.entries(t.direitos))
    soma += peso * tomada(chave);
  return Math.min(1, Math.max(-1, soma));
}
