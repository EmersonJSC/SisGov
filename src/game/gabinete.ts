/**
 * Popularidade dos ministros (M8.3, fatia B). Cada ministro é o rosto de uma
 * área; a popularidade dele nasce dos grupos sociais mais perto do lado
 * ideológico dele (conta, não sorteio), pesada pelo tamanho de cada grupo e
 * pela satisfação dele agora. Como a satisfação já vem do aquecimento (o país
 * anda um ano antes da posse), a nota nasce calibrada pelo próprio país; e
 * como a satisfação lê as leis, os índices e a reação aos gatilhos, a nota
 * anda com eles. Função pura do estado: nada é guardado.
 */
import { distancia, type PontoDaBussola } from "./bussola";
import type { CongressoDoPacote } from "./congresso";
import type { Personagem } from "./eleicao";

/** Grupos leais a cada ministro (o exemplo do autor: segurança, 3 grupos). */
export const GRUPOS_LEAIS = 3;
/** Quanto a nota média do gabinete, fora de 50, mexe na satisfação de todos. */
export const PESO_DO_GABINETE = 0.1;
/** Teto do ajuste do gabinete, em pontos de satisfação. */
export const TETO_DO_GABINETE = 4;
/** Satisfação neutra. */
const NEUTRA = 50;

export type GrupoNaBussola = Readonly<{
  id: string;
  ponto: PontoDaBussola;
  /** Parte do eleitorado no grupo (os perfis em que ele entra). */
  peso: number;
}>;

/** O ponto de cada grupo: a média dos perfis em que ele entra, pelo peso. */
export function gruposNaBussola(
  pacote: CongressoDoPacote,
): readonly GrupoNaBussola[] {
  const soma = new Map<string, { e: number; c: number; peso: number }>();
  for (const perfil of pacote.perfis)
    for (const id of perfil.segmentos) {
      const s = soma.get(id) ?? { e: 0, c: 0, peso: 0 };
      s.e += perfil.peso * perfil.ponto.economia;
      s.c += perfil.peso * perfil.ponto.costumes;
      s.peso += perfil.peso;
      soma.set(id, s);
    }
  return [...soma.entries()]
    .filter(([, s]) => s.peso > 0)
    .map(([id, s]) => ({
      id,
      ponto: { economia: s.e / s.peso, costumes: s.c / s.peso },
      peso: s.peso,
    }));
}

export type NotaDoMinistro = Readonly<{
  area: string;
  /** 0 a 100. */
  nota: number;
  /** Ids dos grupos leais, do mais perto ao mais longe. */
  leais: readonly string[];
}>;

/** Os grupos leais ao ministro: os mais perto dele na bússola. */
export function gruposLeais(
  ministro: Personagem,
  grupos: readonly GrupoNaBussola[],
): readonly GrupoNaBussola[] {
  return [...grupos]
    .sort(
      (a, b) =>
        distancia(a.ponto, ministro.ponto) -
          distancia(b.ponto, ministro.ponto) || a.id.localeCompare(b.id),
    )
    .slice(0, GRUPOS_LEAIS);
}

/**
 * A nota de cada ministro: a satisfação (`valores[grupo]`, 0 a 100) dos
 * grupos leais, pesada pelo tamanho deles.
 */
export function notasDosMinistros(
  ministros: Readonly<Record<string, Personagem>>,
  pacote: CongressoDoPacote,
  valores: Readonly<Record<string, number>>,
): readonly NotaDoMinistro[] {
  const grupos = gruposNaBussola(pacote).filter(
    (g) => valores[g.id] !== undefined,
  );
  if (grupos.length === 0) return [];
  return Object.entries(ministros).map(([area, ministro]) => {
    const leais = gruposLeais(ministro, grupos);
    const peso = leais.reduce((s, g) => s + g.peso, 0);
    const nota =
      leais.reduce((s, g) => s + g.peso * (valores[g.id] ?? NEUTRA), 0) / peso;
    return { area, nota, leais: leais.map((g) => g.id) };
  });
}

/**
 * Pontos de satisfação que o gabinete soma (ou tira) de todo o eleitorado:
 * a nota média fora de 50, vezes o peso, com teto.
 */
export function ajusteDoGabinete(notas: readonly NotaDoMinistro[]): number {
  if (notas.length === 0) return 0;
  const media = notas.reduce((s, n) => s + n.nota, 0) / notas.length;
  const ajuste = (media - NEUTRA) * PESO_DO_GABINETE;
  return Math.max(-TETO_DO_GABINETE, Math.min(TETO_DO_GABINETE, ajuste));
}

/** O ajuste do gabinete como pontos por grupo, no formato das reações. */
export function pontosDoGabinete(
  ministros: Readonly<Record<string, Personagem>> | undefined,
  pacote: CongressoDoPacote | undefined,
  valores: Readonly<Record<string, number>>,
): Readonly<Record<string, number>> {
  if (!ministros || !pacote) return {};
  const ajuste = ajusteDoGabinete(
    notasDosMinistros(ministros, pacote, valores),
  );
  if (ajuste === 0) return {};
  return Object.fromEntries(gruposNaBussola(pacote).map((g) => [g.id, ajuste]));
}

/** Soma dois conjuntos de pontos por grupo. */
export function somarPontos(
  a: Readonly<Record<string, number>>,
  b: Readonly<Record<string, number>>,
): Readonly<Record<string, number>> {
  const soma: Record<string, number> = { ...a };
  for (const [id, p] of Object.entries(b)) soma[id] = (soma[id] ?? 0) + p;
  return soma;
}

/** Os pontos somados à satisfação de cada grupo, entre 0 e 100. */
export function somarSatisfacao(
  valores: Readonly<Record<string, number>>,
  pontos: Readonly<Record<string, number>>,
): Readonly<Record<string, number>> {
  const novos = { ...valores };
  for (const [id, p] of Object.entries(pontos))
    novos[id] = Math.max(0, Math.min(100, (valores[id] ?? NEUTRA) + p));
  return novos;
}
