export const supportedMechanisms = [
  "afim",
  "saturacao",
  "retornos_decrescentes",
  "limiar",
] as const;

export type SupportedMechanism = (typeof supportedMechanisms)[number];

/**
 * O mundo: tudo que vale para qualquer país (D-38). Um país só declara seu
 * pacote inicial e aponta para o mundo.
 */
export type WorldFile = {
  id: string;
  tipo: "mundo";
  versaoEsquema: 1;
  nome: string;
  variaveis: string;
  catalogoPoliticas: string;
  consequencias: string[];
  eventos?: string[];
  situacoes?: string[];
  dilemas?: string[];
};

/**
 * Manifesto do pacote. Um país usa `mundo`; os pacotes de teste podem listar
 * variáveis, leis e consequências diretamente. Depois de resolvido, o
 * manifesto sempre traz as listas efetivas.
 */
export type ScenarioManifest = {
  id: string;
  tipo: "cenario";
  versaoEsquema: 1;
  nome: string;
  mundo?: string;
  unidadeTemporal?: "mes" | "trimestre";
  estadoInicial: string;
  variaveis: string;
  politicas?: string[];
  catalogoPoliticas?: string;
  consequencias: string[];
  eventos?: string[];
  situacoes?: string[];
  dilemas?: string[];
  organizacaoPolitica?: string;
  perfis?: readonly {
    id: string;
    nome: string;
    peso: number;
    interesses: readonly string[];
  }[];
};

export type VariableDefinition = {
  id: string;
  tipo: "controle" | "calculado" | "estoque";
  nome: string;
  unidade: string;
  dominio: { minimo?: number; maximo?: number };
  valorInicial: number;
  area?: string;
  avaliacao?: "maior_melhor" | "maior_pior" | "neutra";
};

export type VariablesFile = {
  id: string;
  tipo: "variaveis";
  versaoEsquema: 1;
  variaveis: VariableDefinition[];
};

export type InitialStateFile = {
  id: string;
  tipo: "estado-inicial";
  versaoEsquema: 1;
  valores: Record<string, number>;
  /** Economia do país; o PIB converte limites "% do PIB" das leis em valores. */
  economia?: EconomyInitialState;
  /** Limites que o país impõe a uma lei, além dos limites da própria lei. */
  limitesProprios?: readonly {
    lei: string;
    minimo?: number;
    maximo?: number;
  }[];
  /** Leis já vigentes no país: nível (ou opção) e, se diferente, o já implantado. */
  leisVigentes?: readonly {
    lei: string;
    nivel?: number;
    opcao?: string;
    nivelImplantado?: number;
  }[];
  leisEleitoraisVigentes?: readonly string[];
  fiscal?: FiscalInitialState;
  politica?: PoliticalInitialState;
};

/** Country-specific initial political data; it is intentionally not engine law. */
export type PoliticalInitialState = {
  origem: { tipo: "observado" | "hipotese"; descricao: string };
  partidos: readonly { id: string; nome: string; pesoReferencia?: number }[];
  grupos: readonly { id: string; nome: string }[];
  perfis: readonly {
    id: string;
    nome: string;
    pesoEleitoral: number;
    associacoes: readonly { grupo: string; peso: number }[];
    preferenciaBase: Readonly<Record<string, number>>;
  }[];
  relacoes: readonly {
    id: string;
    origem: { tipo: "politica" | "indicador"; id: string; referencia: number };
    grupo: string;
    pontosEmReferencia: number;
  }[];
  cadeirasSenadoPorPartido: Readonly<Record<string, number>>;
  coalizaoGoverno: readonly string[];
};

export type EconomyInitialState = {
  /** PIB anual na moeda da ficha fiscal. */
  pibAnual: number;
};

/** Parte do orçamento que ainda não é lei: entra inteira no fluxo do mês. */
export type FiscalAggregate = {
  id: string;
  nome: string;
  valorAnual: number;
};

/** Fiscal values belong to the country state, never to the generic engine. */
export type FiscalInitialState = {
  periodoInicial: string;
  referenciaPrecos: string;
  unidadeMonetaria: string;
  origem: {
    tipo: "observado" | "hipotese";
    descricao: string;
  };
  caixa: number;
  dividaTotal: number;
  jurosHerdadosMensais: number;
  taxaJurosDividaNovaMensal: number;
  /** Receitas e despesas que ainda não são leis (D-29). */
  agregados?: {
    receitas: readonly FiscalAggregate[];
    despesas: readonly FiscalAggregate[];
  };
  credito?: AggregateCreditInitialState;
};

/** Optional aggregate private-credit stock for the SG060-C extension. */
export type AggregateCreditInitialState = {
  principalPendente: number;
  principalPerformante: number;
  principalInadimplente: number;
  capitalAgregado: number;
  receitaJurosMensal: number;
};

export type ElectoralLawDefinition = {
  id: string;
  nome: string;
  ambito: "constitucional";
  eleicao: string;
  instituicao: string;
  alcance: "nacional" | "territorial";
  mecanismo: "pluralidade_nacional" | "maiores_quotientes_por_unidade";
  parametros: Readonly<Record<string, string | number>>;
};

export type PolicyCatalogFile = {
  id: string;
  tipo: "catalogo-politicas";
  versaoEsquema: 1;
  politicas: string[];
  leisEleitorais?: readonly ElectoralLawDefinition[];
};

export type PoliticalOrganizationFile = {
  id: string;
  tipo: "organizacao-politica";
  versaoEsquema: 1;
  formaInicial: string;
  formasDeGoverno: readonly {
    id: string;
    nome: string;
    instituicoesAtivas: readonly string[];
    eleicoesAtivas: readonly string[];
    poderes: readonly {
      id: string;
      relacao:
        | "independente"
        | "compartilhado"
        | "concentrado"
        | "subordinado"
        | "ausente";
    }[];
  }[];
  instituicoes: readonly {
    id: string;
    nome: string;
    poder: string;
    composicao:
      | { modo: "nacional"; quantidade: number }
      | {
          modo: "territorial";
          unidade: string;
          quantidadeUnidades: number;
          quantidadePorUnidade: number;
        };
    mandatoMeses?: number;
    renovacao?: {
      intervaloMeses: number;
      cadeirasPorUnidade: readonly number[];
    };
    votacaoOrdinaria?: {
      regra: "maioria_absoluta" | "maioria_simples" | "maioria_qualificada";
      base: "cadeiras_ativas" | "votos_validos";
      fracao?: number;
    };
  }[];
  processosConstitucionais: readonly {
    id: string;
    orgaosAprovadores: readonly string[];
    fracaoFavoravel: number;
    rodadas: number;
  }[];
  mudancasConstitucionais: readonly (
    | {
        id: string;
        processo: string;
        tipo: "mudar_forma";
        formaGoverno: string;
      }
    | {
        id: string;
        processo: string;
        tipo: "alterar_vagas_por_unidade";
        instituicao: string;
        valor: number;
        mandatoMeses?: number;
        intervaloRenovacaoMeses?: number;
        cadeirasPorCiclo?: readonly number[];
      }
    | {
        id: string;
        processo: string;
        tipo: "desativar_instituicao";
        instituicao: string;
      }
  )[];
};

/** Os quatro grupos de lei (D-23). */
export type PolicyGroup =
  "orcamentaria" | "regulatoria" | "tributaria" | "institucional";

/**
 * Limites gerais escritos na lei. Valores em dinheiro são relativos ao PIB
 * (D-27); `minimo`/`maximo` valem para níveis em % (percentual, alíquota).
 */
export type PolicyLimits = {
  minimo?: number;
  maximo?: number;
  minimoPercentualPib?: number;
  maximoPercentualPib?: number;
};

export type PolicyOption = {
  id: string;
  rotulo: string;
  /** Intensidade que a opção coloca no grafo (definição da opção, não quantidade do país). */
  valor: number;
  custoAnualPercentualPib?: number;
};

/**
 * Lei do catálogo comum, esquema v2: diz o que a lei é e seus limites, nunca
 * quanto (D-24). O nível vem do país (`leisVigentes`) ou do jogador.
 */
export type PolicyFile = {
  id: string;
  tipo: "lei";
  versaoEsquema: 2;
  grupo: PolicyGroup;
  nome: string;
  descricao: string;
  area?: string;
  categoria?: string;
  fonte?: string;
  icone?: string;
  ministerio?: string;
  respostaTemporal?: { implantacao: number; degradacao: number };
  processoAutorizacao: string;
  controle: {
    variavel: string;
    unidade: string;
    opcoes?: readonly PolicyOption[];
  };
  orcamento?: {
    modo: "valor_fixo" | "percentual_orcamento";
    base?: "receita_total";
    limites?: PolicyLimits;
  };
  tributo?: { base: string; limites?: PolicyLimits };
  consequencias: string[];
};

/**
 * Parâmetros por mecanismo (o validador exige os campos de cada um):
 * - afim: coeficiente, termoConstante → c·x + k
 * - saturacao: maximo, escala → máximo·(1 − e^(−x/escala)); efeito com teto
 * - retornos_decrescentes: coeficiente, escala → c·escala·ln(1 + x/escala)
 * - limiar: limiar, coeficiente, direcao → c·max(0, x − L) ("acima") ou
 *   c·max(0, L − x) ("abaixo"); só age depois do ponto
 */
export type ConsequenceParameters = {
  coeficiente?: number;
  termoConstante?: number;
  maximo?: number;
  escala?: number;
  limiar?: number;
  direcao?: "acima" | "abaixo";
};

export type ConsequenceNormalization = {
  /** Nó pelo qual a origem é dividida (domínio com mínimo > 0). */
  divisor: string;
  /** Multiplica a razão (100 = percentual). Padrão 1. */
  multiplicador?: number;
};

export type ConsequenceFile = {
  id: string;
  tipo: "consequencia";
  versaoEsquema: 1;
  origem: string;
  alvo: string;
  mecanismo: SupportedMechanism;
  parametros: ConsequenceParameters;
  /** Lê a origem como razão (ex.: gasto ÷ PIB × 100), antes do mecanismo (D-40). */
  normalizacao?: ConsequenceNormalization;
  unidade: string;
  atrasoPassos: number;
  duracao:
    { modo: "unico" } | { modo: "fixo"; passos: number } | { modo: "continuo" };
};

export type OccurrenceFile = {
  id: string;
  tipo: "evento" | "situacao" | "dilema";
  versaoEsquema: 1;
  nome: string;
  descricao?: string;
  area?: string;
  avaliacao?: "positiva" | "negativa";
  entraQuando?: {
    tipo: "comparacao";
    variavel: string;
    operador:
      "maior_que" | "maior_ou_igual" | "menor_que" | "menor_ou_igual" | "igual";
    valor: number;
  };
  saiQuando?: {
    tipo: "comparacao";
    variavel: string;
    operador:
      "maior_que" | "maior_ou_igual" | "menor_que" | "menor_ou_igual" | "igual";
    valor: number;
  };
  consequencias: string[];
};

export type ContentFile =
  | ScenarioManifest
  | WorldFile
  | VariablesFile
  | InitialStateFile
  | PolicyCatalogFile
  | PoliticalOrganizationFile
  | PolicyFile
  | ConsequenceFile
  | OccurrenceFile;
