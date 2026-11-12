// Chapas: o governo com a coligação dele, e a oposição, que lança uma chapa por
// partido e deixa que se juntem os que defendem os mesmos grupos.
import type { Chapa, PartidoEleitoral } from "./tipos";

/** Semelhança (0 a 1) a partir da qual dois partidos da oposição se coligam. */
const LIMITE_DA_COLIGACAO = 0.6;

const soma = (a: Record<string, number>, b: Record<string, number>) => {
  const total = { ...a };
  for (const [g, v] of Object.entries(b)) total[g] = (total[g] ?? 0) + v;
  return total;
};

/** Cosseno entre dois mapas de afinidade: 1 defendem o mesmo, 0 nada em comum. */
export function semelhanca(
  a: Record<string, number>,
  b: Record<string, number>,
): number {
  let ponto = 0;
  for (const [g, v] of Object.entries(a)) ponto += v * (b[g] ?? 0);
  const norma = (m: Record<string, number>) =>
    Math.sqrt(Object.values(m).reduce((s, v) => s + v * v, 0));
  const fundo = norma(a) * norma(b);
  return fundo > 0 ? ponto / fundo : 0;
}

const chapaDe = (p: PartidoEleitoral, governo: boolean): Chapa => ({
  id: p.id,
  partidos: [p.id],
  governo,
  afinidade: p.defende,
});

/** Junta um partido a uma chapa. */
const juntar = (chapa: Chapa, p: PartidoEleitoral): Chapa => ({
  ...chapa,
  partidos: [...chapa.partidos, p.id],
  afinidade: soma(chapa.afinidade, p.defende),
});

/** Oposição: do maior partido para o menor, cada um entra na primeira chapa parecida ou abre a sua. */
function chapasDaOposicao(partidos: PartidoEleitoral[]): Chapa[] {
  return [...partidos]
    .sort((a, b) => b.cadeiras - a.cadeiras)
    .reduce<Chapa[]>((chapas, p) => {
      const par = chapas.findIndex(
        (c) => semelhanca(c.afinidade, p.defende) >= LIMITE_DA_COLIGACAO,
      );
      return par < 0
        ? [...chapas, chapaDe(p, false)]
        : chapas.map((c, i) => (i === par ? juntar(c, p) : c));
    }, []);
}

/**
 * As chapas da eleição. Sem partidos (país sem Congresso), o governo enfrenta
 * uma oposição só, sem afinidade com grupo nenhum.
 */
export function montarChapas(
  partidos: PartidoEleitoral[],
  governo: string,
  coligacao: string[],
): { governo: Chapa; oposicao: Chapa[] } {
  if (partidos.length === 0)
    return {
      governo: { id: "governo", partidos: [], governo: true, afinidade: {} },
      oposicao: [
        { id: "oposicao", partidos: [], governo: false, afinidade: {} },
      ],
    };
  const base = (p: PartidoEleitoral) =>
    p.id === governo || coligacao.includes(p.id);
  const dela = partidos.filter(base);
  const [primeiro, ...resto] = [
    ...dela.filter((p) => p.id === governo),
    ...dela.filter((p) => p.id !== governo),
  ];
  return {
    governo: resto.reduce(juntar, chapaDe(primeiro, true)),
    oposicao: chapasDaOposicao(partidos.filter((p) => !base(p))),
  };
}
