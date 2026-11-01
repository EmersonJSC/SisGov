// Estrutura do mundo para o mapa da tela: áreas, leis, índices e grupos, e
// quem se liga a quem. Não calcula nada de jogo.
import type { Lei, TipoGrupo } from "../motor";
import areas from "../conteudo/mundo/areas/areas.json";

export interface AreaDoMapa {
  id: string;
  nome: string;
  cor: string;
  leis: string[];
}

export interface MapaDoMundo {
  areas: AreaDoMapa[];
  /** Cada lei com a área e os índices de jogabilidade que ela mexe. */
  leis: { id: string; area: string; indices: string[] }[];
  indices: { id: string; nome: string }[];
  /** Cada grupo com os índices que cobra e as leis que o citam. */
  grupos: { id: string; nome: string; indices: string[]; leis: string[] }[];
}

export function montarMapa(
  leis: Record<string, Lei>,
  grupos: TipoGrupo[],
  nomesGrupos: Record<string, string>,
  indices: { id: string; nome: string }[],
): MapaDoMundo {
  if (areas.versao !== 1)
    throw new Error("mundo/areas/areas.json › versao: precisa ser 1");
  const areaDa: Record<string, string> = {};
  for (const a of areas.areas)
    for (const id of a.leis) {
      if (!leis[id])
        throw new Error(
          `mundo/areas/areas.json › ${a.id}: lei "${id}" não existe`,
        );
      if (areaDa[id])
        throw new Error(
          `mundo/areas/areas.json › lei "${id}" está em duas áreas`,
        );
      areaDa[id] = a.id;
    }
  for (const id of Object.keys(leis))
    if (!areaDa[id])
      throw new Error(`mundo/areas/areas.json › lei "${id}" sem área`);

  const ids = new Set(indices.map((i) => i.id));
  const mexidos = (lei: Lei): string[] => {
    const efeitos =
      lei.forma === "continua"
        ? lei.efeitos
        : lei.opcoes.flatMap((o) => o.efeitos);
    return [...new Set(efeitos.map((e) => e.indice))];
  };

  return {
    areas: areas.areas.map((a) => ({ ...a, leis: [...a.leis] })),
    leis: areas.areas.flatMap((a) =>
      a.leis.map((id) => ({
        id,
        area: a.id,
        indices: mexidos(leis[id]),
      })),
    ),
    indices,
    grupos: grupos.map((g) => ({
      id: g.id,
      nome: nomesGrupos[g.id] ?? g.id,
      indices: g.cobra.map((c) => c.indice).filter((i) => ids.has(i)),
      leis: Object.values(leis)
        .filter((l) => l.forma === "continua" && l.grupos?.[g.id])
        .map((l) => l.id),
    })),
  };
}
