import type { ResolvedPackage } from "../../engine";
import { bolsosDosPerfis } from "./bolso";
import type { VisaoCensoAtributo } from "./tipos";

/**
 * O censo do país (Grupos, camada A): os perfis do eleitorado repartidos por
 * cada atributo.
 *
 * É leitura, não simulação. Os perfis são conteúdo fixo — 2.090 linhas com
 * um peso e um valor por atributo — e contar todos custa ~7 ms, contra ~6 s
 * de um turno. Por isso o censo é recalculado à vontade, sem guardar estado.
 *
 * Os perfis moram no manifesto do congresso porque foi ele quem precisou
 * deles primeiro (eleger as bancadas). Se um terceiro dono aparecer, vale
 * promovê-los a um manifesto próprio — hoje seria mudança sem ganho.
 */
export function censoDoPais(
  content: ResolvedPackage,
  valores: Readonly<Record<string, number>> = {},
): readonly VisaoCensoAtributo[] {
  const congresso = content.manifest.congresso;
  if (!congresso) return [];
  const {
    atributos,
    valores: valoresDoPerfil,
    perfis,
    segmentoDe,
    rotulos,
  } = congresso;
  const bolsos = bolsosDosPerfis(content, valores);
  return atributos.map((atributo, i) => {
    const soma = new Map<string, number>();
    // O bolso da faixa é a média do bolso de quem está nela, pesada pelo
    // tamanho de cada perfil.
    const bolso = new Map<string, { ganha: number; paga: number }>();
    for (const [j, perfil] of perfis.entries()) {
      const valor = valoresDoPerfil[atributo]?.[perfil[i + 1]];
      if (valor === undefined) continue;
      soma.set(valor, (soma.get(valor) ?? 0) + perfil[0]);
      const b = bolsos[j];
      if (!b) continue;
      const acc = bolso.get(valor) ?? { ganha: 0, paga: 0 };
      acc.ganha += perfil[0] * b.ganha;
      acc.paga += perfil[0] * b.paga;
      bolso.set(valor, acc);
    }
    const total = [...soma.values()].reduce((t, p) => t + p, 0);
    return {
      id: atributo,
      nome: rotulos?.atributos[atributo] ?? atributo,
      faixas: [...soma]
        // A maior primeiro: é o país que ela descreve.
        .sort(([, a], [, b]) => b - a)
        .map(([id, peso]) => {
          const grupo = segmentoDe[`${atributo}=${id}`];
          const b = bolso.get(id);
          const medio =
            b && peso > 0
              ? {
                  ganha: b.ganha / peso,
                  paga: b.paga / peso,
                  sobra: (b.ganha - b.paga) / peso,
                }
              : undefined;
          return {
            id,
            nome: rotulos?.faixas[`${atributo}=${id}`] ?? id,
            /** Parte do eleitorado, de 0 a 1. */
            parte: total > 0 ? peso / total : 0,
            // Faixa sem grupo existe na simulação e não tem bolha na tela:
            // nenhuma lei a faz mexer à vista do jogador.
            ...(grupo ? { grupo } : {}),
            ...(medio ? { bolso: medio } : {}),
          };
        }),
    };
  });
}
