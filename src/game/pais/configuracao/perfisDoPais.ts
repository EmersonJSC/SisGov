import type { ProfileApproval } from "../../../engine";
import type { PerfisDoPais, PopulacaoDoMundo } from "./tipos";

/**
 * Aprovação pelos perfis (V1-08): cada perfil do país vira a lista dos
 * segmentos em que entra, pelo mapa de atributos do mundo. Perfis que caem
 * nos mesmos segmentos (ex.: só diferem num atributo sem segmento, como
 * religião "outra") viram um só, somando os pesos.
 */
export function aprovacaoDosPerfis(
  mundo: PopulacaoDoMundo,
  pais: PerfisDoPais,
): ProfileApproval | string {
  const pesos: Record<string, number> = {};
  const segmentoDe = new Map<string, string>();
  for (const eixo of mundo.eixos)
    for (const [atributo, mapa] of Object.entries(eixo.atributos))
      for (const [valor, segmento] of Object.entries(mapa)) {
        segmentoDe.set(`${atributo}=${valor}`, segmento);
        pesos[segmento] = eixo.peso;
      }
  const juntos = new Map<string, number>();
  for (const [index, linha] of pais.perfis.entries()) {
    if (linha.length !== pais.atributos.length + 1)
      return `O perfil ${index} não tem um valor para cada atributo.`;
    const segmentos = new Set<string>();
    for (const [i, atributo] of pais.atributos.entries()) {
      const valor = pais.valores[atributo]?.[linha[i + 1]];
      if (valor === undefined)
        return `O perfil ${index} tem um valor desconhecido de ${atributo}.`;
      const segmento = segmentoDe.get(`${atributo}=${valor}`);
      if (segmento) segmentos.add(segmento);
    }
    if (segmentos.size === 0)
      return `O perfil ${index} não entra em nenhum segmento.`;
    const chave = [...segmentos].sort().join(" ");
    juntos.set(chave, (juntos.get(chave) ?? 0) + linha[0]);
  }
  return {
    alvo: mundo.alvo,
    k: mundo.k,
    pesos,
    perfis: [...juntos]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([chave, peso]) => ({ peso, segmentos: chave.split(" ") })),
    eixos: mundo.eixos.map((eixo) => ({
      id: eixo.id,
      nome: eixo.nome,
      segmentos: Object.values(eixo.atributos).flatMap((mapa) =>
        Object.values(mapa),
      ),
    })),
  };
}
