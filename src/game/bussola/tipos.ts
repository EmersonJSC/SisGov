/** Formato dos dados da bússola (V1-10, docs/v1/desenho/bussola.md). */

/** [economia, costumes], cada um de −2 a +2. */
export type VetorDaLei = readonly [number, number];

export type BussolaDaLei = Readonly<{
  /** Temas do Manifesto Project que dão a direção. */
  manifesto: readonly string[];
  porque: string;
  /** Leis com opções: o vetor de cada opção. */
  opcoes?: Readonly<Record<string, VetorDaLei>>;
  /** Leis com faixa: o vetor no mínimo e no máximo; o resto é proporcional. */
  faixa?: Readonly<{ minimo: VetorDaLei; maximo: VetorDaLei }>;
  /** Vetor da lei fora de vigor; sem ele, a lei fora de vigor vale zero. */
  foraDeVigor?: VetorDaLei;
}>;

/**
 * Lado de cada opção de um dilema (V1-13, docs/v1/desenho/dilemas.md). Dilema
 * de governo (`eixo: "governo"`) troca apoio no Congresso por confiança nas
 * instituições e pode ter as opções no mesmo lugar da bússola.
 */
export type BussolaDoDilema = Readonly<{
  manifesto: readonly string[];
  porque: string;
  eixo?: "governo";
  opcoes: Readonly<Record<string, VetorDaLei>>;
}>;

/** Uma resposta a dilema: entra no ponto como uma lei de importância 1. */
export type DecisaoNaBussola = Readonly<{
  dilema: string;
  opcao: string;
  turno: number;
}>;

export type BussolaDoMundo = Readonly<{
  tipo: "mundo-bussola";
  versaoEsquema: 1;
  metodo: string;
  importancia: Readonly<Record<string, number>>;
  /** Quanto conta o rumo em cada eixo (ajustado na prova real, V1-34). */
  fatorDoRumo: PontoDaBussola;
  temas: Readonly<Record<string, string>>;
  leis: Readonly<Record<string, BussolaDaLei>>;
  dilemas?: Readonly<Record<string, BussolaDoDilema>>;
}>;

export type Referencia = Readonly<{
  id: string;
  nome: string;
  pais: string;
  /** Sigla do partido como está na fonte. */
  partido?: string;
  partidoNaFonte: string;
  anos: readonly number[];
  economia: number;
  costumes: number;
}>;

export type ReferenciasDaBussola = Readonly<{
  tipo: "referencias-bussola";
  versaoEsquema: 1;
  fonte: Readonly<{ nome: string; versao: string; citacao: string }>;
  metodo: Readonly<Record<string, string>>;
  personalidades: readonly Referencia[];
  partidos: readonly Referencia[];
  semMedida: readonly Readonly<{
    id: string;
    nome: string;
    pais: string;
    motivo: string;
  }>[];
}>;

/** Um ponto da bússola: de −10 a +10 em cada eixo. */
export type PontoDaBussola = Readonly<{ economia: number; costumes: number }>;

export type EstadoDaBussola = Readonly<{
  /** Média das leis no turno 0 (já na escala de −10 a +10). */
  inicio: PontoDaBussola;
  /** O ponto ao fim de cada turno, a partir do turno 0. */
  caminho: readonly Readonly<PontoDaBussola & { turno: number }>[];
  /** Respostas a dilemas (V1-13); ausente nas partidas de antes. */
  decisoes?: readonly DecisaoNaBussola[];
}>;
