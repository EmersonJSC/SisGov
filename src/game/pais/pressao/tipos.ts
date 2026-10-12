/**
 * Arquivos dos grupos de pressão (V1-09, docs/v1/desenho/pressao.md): o mundo
 * diz quem são os grupos, o que vigiam e o que fazem; o país diz os limites
 * de cada nível, os nomes locais e as regiões.
 */

/** Lei ou índice que o grupo (ou o patrocinador) vigia. */
export type Vigia = {
  lei?: string;
  indice?: string;
  /** A pressão sobe com o valor alto ou baixo. */
  sobe: "alto" | "baixo";
  /** Pontos de pressão (ou de interesse) entre as pontas da faixa. */
  peso: number;
  /** Faixa do valor que vai de 0 ao peso. Padrão: 0 a 100. */
  faixa?: [number, number];
  /** Lei em dinheiro: lida em % do PIB. */
  porPib?: boolean;
  /** Só nos grupos por região: multiplica o valor pela razão da região. */
  fator?: "aprovacaoDaRegiao";
};

export type AcaoDoGrupo =
  | string
  | {
      id: string;
      /** Evento que já existe no mundo e passa a ser a ação do grupo. */
      evento: string;
      nivel: number;
    };

export type GrupoDoMundo = {
  id: string;
  /** Nos grupos por região, `{regiao}` vira "do Nordeste", "do Sul"… */
  nome: string;
  plural: boolean;
  secao: string;
  requer?: { exige?: string[]; proibe?: string[] };
  /** Segmentos do eleitorado (pesos somando 1). */
  base?: Record<string, number>;
  reage: Vigia[];
  recursos: { gente: number; dinheiro: number; midia: number; forca: number };
  /** "regiao": o país diz, por região. */
  visto: "esquerda" | "direita" | "nenhum" | "regiao";
  acoes: AcaoDoGrupo[];
  /** Grupos do outro lado, além dos que vigiam o mesmo tema. */
  contra?: string[];
  patrocinio?: { patrocinador: string; k: number; publico?: boolean }[];
};

export type AcaoDoMundo = {
  nome: string;
  /** 2: o grupo mobilizado; 3: preocupação nacional. */
  nivel: number;
  meses: number;
  recurso: "gente" | "dinheiro" | "midia" | "forca";
  /** Pontos em cada índice enquanto dura (antes dos recursos). */
  efeitos: Record<string, number>;
  manchete: { singular: string; plural: string };
  descricao: string;
  /** "calmo": só com o grupo sem muitos adeptos (pauta positiva). */
  quando?: "calmo";
};

/** `mundo/pressao.json`. */
export type PressaoDoMundo = {
  tipo: "mundo-pressao";
  niveis: string[];
  pesoDaBase: number;
  secoes: { id: string; nome: string }[];
  acoes: Record<string, AcaoDoMundo>;
  grupos: GrupoDoMundo[];
  /** Um grupo para cada região do país. */
  porRegiao?: GrupoDoMundo[];
};

/** `mundo/patrocinadores.json`. */
export type PatrocinadoresDoMundo = {
  tipo: "mundo-patrocinadores";
  /** Pontos de pressão = k × interesse × poder ÷ 5 × escala. */
  escala: number;
  investigacao: {
    c: number;
    turnos: number;
    aoMesmoTempo: number;
    /** Pontos de pressão que o grupo perde quando o patrocínio oculto aparece. */
    legitimidade: number;
  };
  patrocinadores: {
    id: string;
    nome: string;
    tipo: "pais" | "empresa" | "igreja" | "fundacao";
    descricao: string;
    poder: number;
    interesses: Vigia[];
  }[];
};

export type Limites = { entrada: number; saida: number }[];

/** `paises/<pais>/pressao.json`. */
export type PressaoDoPais = {
  tipo: "pais-pressao";
  /** Nome local de um grupo (a mídia do país). */
  nomes?: Record<string, string>;
  regioes?: {
    id: string;
    /** Com a preposição: "do Nordeste". */
    nome: string;
    populacao: number;
    aprovacao: number;
    visto: "esquerda" | "direita" | "nenhum";
  }[];
  /** Aprovação nacional da mesma pesquisa das regiões. */
  aprovacaoNacional?: number;
  /** Nível de cada grupo no turno 0 (o calibrador ajusta os limites a ele). */
  turno0: Record<string, number>;
  /** Folga até o próximo nível, por grupo (padrão no calibrador). */
  folga?: Record<string, number>;
  /** Limites de cada nível, gerados por `npm run pressao:calibrar`. */
  limites?: Record<string, Limites>;
};
