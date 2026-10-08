export const supportedMechanisms = ["afim"] as const;

export type SupportedMechanism = (typeof supportedMechanisms)[number];

export type ScenarioManifest = {
  id: string;
  tipo: "cenario";
  versaoEsquema: 1;
  nome: string;
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
  politicasVigentes?: readonly {
    politica: string;
    nivelDesejado: number;
    nivelImplantado: number;
  }[];
};

export type PolicyCatalogFile = {
  id: string;
  tipo: "catalogo-politicas";
  versaoEsquema: 1;
  politicas: string[];
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

export type PolicyFile = {
  id: string;
  tipo: "lei" | "imposto" | "programa" | "regulamentacao";
  versaoEsquema: 1;
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
    modo: string;
    unidade: string;
    opcoes?: readonly { valor: number; rotulo: string }[];
  };
  consequencias: string[];
};

export type ConsequenceFile = {
  id: string;
  tipo: "consequencia";
  versaoEsquema: 1;
  origem: string;
  alvo: string;
  mecanismo: SupportedMechanism;
  parametros: { coeficiente: number; termoConstante: number };
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
  | VariablesFile
  | InitialStateFile
  | PolicyCatalogFile
  | PoliticalOrganizationFile
  | PolicyFile
  | ConsequenceFile
  | OccurrenceFile;
