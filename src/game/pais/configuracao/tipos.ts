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
  cenario: { nome: string; ano: number };
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
  /** Perfis de interesse antigos; viram segmentos na V1-08. */
  perfis?: ScenarioManifest["perfis"];
};

/** `historia.json`: abertura, metas do mandato e lugares para os textos. */
export type HistoriaDoPais = {
  tipo: "pais-historia";
  abertura: string;
  metas: { id: string; texto: string }[];
  lugares?: InitialStateFile["lugares"];
};
