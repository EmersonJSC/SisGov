import type {
  InitialStateFile,
  PoliticalOrganizationFile,
  ScenarioManifest,
} from "../../../engine";
import type { EstruturaDeGoverno } from "../../ministerios";

/** Marcas de sim ou não que ligam leis, eventos e dilemas (conteudo.md 2). */
export const caracteristicasDoPais = [
  "litoral",
  "fronteira-terrestre",
  "moeda-propria",
  "federacao",
  "petroleo",
  "mineracao",
  "floresta-tropical",
  "seca",
  "terremotos",
  "furacoes",
  "povos-originarios",
  "tecnologia-nuclear",
  "crime-organizado-forte",
  "membro-de-bloco-economico",
] as const;

export type CaracteristicaDoPais = (typeof caracteristicasDoPais)[number];

/** Campo `requer` de lei v3, evento e dilema: características exigidas ou proibidas. */
export type RequerCaracteristicas = {
  exige?: CaracteristicaDoPais[];
  proibe?: CaracteristicaDoPais[];
};

/**
 * `pais.json` da versão 1 (arquitetura.md 3): identidade e características.
 * Os outros arquivos ficam na mesma pasta, com nome fixo.
 */
export type PaisV2 = {
  id: string;
  tipo: "pais";
  versaoEsquema: 2;
  nome: string;
  /**
   * `ano`: o ano em que a partida começa. Com `aquecimentoTrimestres`, os
   * valores do país são do começo do aquecimento (V1-07: jan/2025 e 4
   * trimestres para começar em 2026).
   */
  cenario: { nome: string; ano: number; aquecimentoTrimestres?: number };
  mundo: string;
  unidadeTemporal: NonNullable<ScenarioManifest["unidadeTemporal"]>;
  caracteristicas: CaracteristicaDoPais[];
};

/** `politica.json`: mandato, ministérios e o que ainda resta da política antiga. */
export type PoliticaDoPais = {
  tipo: "pais-politica";
  ministerios?: EstruturaDeGoverno;
  /** Formas de governo e instituições (o Congresso volta na versão 2). */
  organizacao?: PoliticalOrganizationFile;
  /** Partidos e perfis eleitorais antigos; saem com a eleição nova (V1-12). */
  estadoPolitico?: InitialStateFile["politica"];
  leisEleitorais?: readonly string[];
  /** Casas do Congresso (V1-11): cadeiras e regra de cada uma. */
  congresso?: {
    fonte?: string;
    casas: {
      id: string;
      nome: string;
      cadeiras: number;
      regra: "proporcional";
      nota?: string;
    }[];
  };
};

/** `economia.json`: PIB e limites do orçamento de partida. */
export type EconomiaDoPais = {
  tipo: "pais-economia";
  economia: NonNullable<InitialStateFile["economia"]>;
  limitesProprios?: InitialStateFile["limitesProprios"];
};

/** `leis.json`: leis em vigor e o valor de cada controle. */
export type LeisDoPais = {
  tipo: "pais-leis";
  emVigor: NonNullable<InitialStateFile["leisVigentes"]>;
  /** Valor de cada controle (nível, opção ou verba) no começo. */
  controles: Record<string, number>;
};

/** `valores.json`: valor inicial dos índices e dos estoques. */
export type ValoresDoPais = {
  tipo: "pais-valores";
  indices: Record<string, number>;
  estoques: Record<string, number>;
};

/** `populacao.json`: segmentos e grupos de pressão (V1-08 e V1-09). */
export type PopulacaoDoPais = {
  tipo: "pais-populacao";
  /** Perfis eleitorais antigos; ficam até a eleição nova (V1-12). */
  perfis?: ScenarioManifest["perfis"];
  /** Totais de cada atributo do eleitorado, com fonte (lidos pelo gerador). */
  totais?: Record<string, { fonte: string; valores: Record<string, number> }>;
  /** Hipóteses da semente do ajuste (lidas pelo gerador). */
  afinidades?: { se: Record<string, string>; fator: number; motivo: string }[];
  afinidadesNota?: string;
};

/** `perfis.json`: perfis do eleitorado gerados por `npm run populacao:gerar`. */
export type PerfisDoPais = {
  tipo: "pais-perfis";
  atributos: string[];
  valores: Record<string, string[]>;
  /** Cada perfil: [peso, índice do valor de cada atributo, na ordem]. */
  perfis: number[][];
};

/** `mundo/populacao.json`: atributos viram segmentos; peso de cada eixo. */
export type PopulacaoDoMundo = {
  tipo: "mundo-populacao";
  alvo: string;
  k: number;
  eixos: {
    id: string;
    nome: string;
    peso: number;
    atributos: Record<string, Record<string, string>>;
  }[];
};

/** `historia.json`: abertura, metas do mandato e lugares para os textos. */
export type HistoriaDoPais = {
  tipo: "pais-historia";
  abertura: string;
  metas: { id: string; texto: string }[];
  lugares?: InitialStateFile["lugares"];
};
