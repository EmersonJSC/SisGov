// Texto do jornal: o motor guarda fatos com ids; aqui eles viram manchetes,
// pelos moldes do mundo (`mundo/jornal/manchetes.json`) e pelos nomes.
import type { Fato, TipoFato } from "../motor";
import moldes from "../conteudo/mundo/jornal/manchetes.json";

interface Molde {
  texto: string;
  /** Usado quando o fato diz quem está envolvido. */
  comQuem?: string;
}

/** Mais que isto de envolvidos vira "N partidos". */
const NOMES_POR_EXTENSO = 3;

/** Os nomes que as manchetes usam; o motor só guarda ids. */
export interface NomesDoJornal {
  lei: (id: string) => string;
  /** Partidos e pessoas, pelo id. */
  quem: Record<string, string>;
  /** Nome da caixa de ministério, pelo id. */
  caixa: Record<string, string>;
  /** Nome da área (esfera), pelo id. */
  area: Record<string, string>;
  /** Rótulo do tribunal (STF, Corte Suprema…), pelo id. */
  tribunal: Record<string, string>;
  programa: (id: string) => string;
  /** Nome do índice (ou do programa) que o governo prometeu. */
  meta: (id: string) => string;
}

const MOLDES = moldes.manchetes as Partial<Record<TipoFato, Molde>>;

/** Quem está envolvido, em texto. */
function envolvidos(fato: Fato, nomes: NomesDoJornal): string {
  const ids = fato.quem ?? [];
  return ids.length > NOMES_POR_EXTENSO
    ? `${ids.length} partidos`
    : ids.map((id) => nomes.quem[id] ?? id).join(", ");
}

/** A manchete do fato: o molde do tipo com os nomes no lugar dos ids. */
export function manchete(fato: Fato, nomes: NomesDoJornal): string {
  const molde = MOLDES[fato.tipo];
  if (!molde) return fato.tipo;
  const sobre = fato.sobre ?? "";
  const quem = envolvidos(fato, nomes);
  const texto = quem && molde.comQuem ? molde.comQuem : molde.texto;
  const valores: Record<string, string> = {
    lei: nomes.lei(sobre),
    quem,
    caixa: nomes.caixa[sobre] ?? sobre,
    area: nomes.area[sobre] ?? sobre,
    tribunal: nomes.tribunal[sobre] ?? sobre,
    programa: nomes.programa(sobre),
    meta: nomes.meta(sobre),
  };
  return texto.replace(
    /\{(\w+)\}/g,
    (_, chave: string) => valores[chave] ?? "",
  );
}
