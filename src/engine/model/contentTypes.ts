export const supportedMechanisms = [
  "afim",
  "saturacao",
  "retornos_decrescentes",
  "limiar",
  "pontos",
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
  /**
   * Fração do caminho que uma bolha calculada anda, por passo, até o valor
   * que recebe (D-54). 1 (padrão) = chega na hora; 0,875 por trimestre =
   * metade do caminho por mês. Amortece os ciclos da rede.
   */
  respostaDasBolhas?: number;
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
  /** Ver `WorldFile.respostaDasBolhas` (D-54); o mundo do país prevalece. */
  respostaDasBolhas?: number;
  organizacaoPolitica?: string;
  /** Aprovação calculada pelos perfis do eleitorado (V1-08). */
  aprovacaoPorPerfis?: ProfileApproval;
  /**
   * Grupos de pressão (V1-09), gerados na carga do país. O motor não lê: os
   * nós, setas e eventos dos grupos já estão no pacote; isto é o mapa que a
   * partida usa para níveis, causas, patrocínio e tela.
   */
  gruposDePressao?: PressureGroupsManifest;
  /**
   * Congresso (V1-11), gerado na carga do país. O motor não lê: é o que a
   * partida usa para eleger as bancadas a partir dos perfis.
   */
  congresso?: CongressManifest;
  perfis?: readonly {
    id: string;
    nome: string;
    peso: number;
    interesses: readonly string[];
  }[];
};

/**
 * Aprovação pelos perfis do eleitorado (V1-08, desenho/populacao.md). Cada
 * perfil é uma fatia do eleitorado (`peso`, somando 1) e está em alguns
 * segmentos (bolhas do tipo `grupo`). A satisfação do perfil é a média dos
 * segmentos dele, ponderada pelo peso do eixo de cada segmento (`pesos`); a
 * chance de aprovar é 1/(1 + e^(−(satisfação − 50)/k)). O alvo recebe
 * 100 × a soma das chances pelos pesos, além das ligações comuns.
 */
export type ProfileApproval = {
  alvo: string;
  k: number;
  pesos: Readonly<Record<string, number>>;
  perfis: readonly { peso: number; segmentos: readonly string[] }[];
  /** Eixos de cada segmento, só para a tela agrupar. O motor não lê. */
  eixos?: readonly { id: string; nome: string; segmentos: readonly string[] }[];
};

/** Congresso na partida (V1-11); ver `ScenarioManifest.congresso`. */
export type CongressManifest = {
  /** Regras do mundo (`mundo/congresso.json`), como estão no arquivo. */
  regras: Readonly<Record<string, unknown>>;
  casas: readonly {
    id: string;
    nome: string;
    cadeiras: number;
    regra: "proporcional";
  }[];
  /** Os perfis do país com os atributos (`perfis.json`). */
  atributos: readonly string[];
  valores: Readonly<Record<string, readonly string[]>>;
  perfis: readonly (readonly number[])[];
  /** `atributo=valor` → segmento, e o peso do eixo de cada segmento. */
  segmentoDe: Readonly<Record<string, string>>;
  pesoDoSegmento: Readonly<Record<string, number>>;
};

/** Grupos de pressão na partida (V1-09); ver `ScenarioManifest.gruposDePressao`. */
export type PressureGroupsManifest = {
  /** Nome de cada nível, do 0 ao último. */
  niveis: readonly string[];
  secoes: readonly { id: string; nome: string }[];
  grupos: readonly PressureGroupManifest[];
  patrocinadores: readonly {
    id: string;
    nome: string;
    tipo: string;
    descricao: string;
    poder: number;
    /** Nó do interesse ameaçado (0 a 100). */
    interesse: string;
    /** Evento que a revelação dispara (só países). */
    eventoRevelado?: string;
  }[];
  investigacao: {
    /** Chance por turno = capacidade ÷ (capacidade + c × poder). */
    c: number;
    turnos: number;
    aoMesmoTempo: number;
    /** Nó da capacidade de investigação. */
    capacidade: string;
  };
};

export type PressureGroupManifest = {
  id: string;
  nome: string;
  plural: boolean;
  secao: string;
  visto: "esquerda" | "direita" | "nenhum";
  recursos: { gente: number; dinheiro: number; midia: number; forca: number };
  /** Nó da pressão (0 a 100) e nó do nível (situação em níveis). */
  pressao: string;
  nivel: string;
  limites: readonly { entrada: number; saida: number }[];
  /** Eventos do grupo e o nível em que cada um pode acontecer. */
  acoes: readonly { evento: string; nivel: number }[];
  /** O que o grupo vigia, para a tela dizer o motivo da ação. */
  causas: readonly {
    origem: string;
    nome: string;
    coeficiente: number;
    constante: number;
    peso: number;
    porPib?: boolean;
  }[];
  patrocinio: readonly {
    patrocinador: string;
    k: number;
    publico: boolean;
    /** Controle 0 ou 1: o dinheiro chega (1) ou foi cortado pela revelação (0). */
    acesso: string;
    /** Pontos de pressão por ponto de interesse. */
    coeficiente: number;
  }[];
  /** Controle 0 ou 1: algum patrocínio oculto foi revelado. */
  revelado?: string;
};

/**
 * Nó da rede (D-41):
 * - controle: valor de uma lei (nível); o país ou o jogador define;
 * - estoque: acumula com o tempo (ex.: dívida); o país declara o valor inicial;
 * - calculado (índice) e situacao: bolhas sem valor próprio nem base — são
 *   exatamente o resultado do que recebem. A situação tem histerese (V1-07):
 *   surge quando a soma chega a `entrada`, só acaba quando cai a `saida` ou
 *   menos, e enquanto existe o valor é o quanto a soma passa de `saida`.
 */
export type VariableDefinition = {
  id: string;
  /**
   * `grupo` (SG143): grupo social; a bolha é a satisfação dele (0–100),
   * calculada como um índice, a partir de leis e indicadores.
   */
  tipo: "controle" | "calculado" | "estoque" | "situacao" | "grupo";
  nome: string;
  unidade: string;
  dominio: { minimo?: number; maximo?: number };
  /** Só controle e estoque; bolhas não têm valor inicial (D-41). */
  valorInicial?: number;
  /** Só situação: soma a partir da qual ela surge. */
  entrada?: number;
  /** Só situação: soma em que ela acaba (no máximo `entrada`). */
  saida?: number;
  /**
   * Só situação, no lugar de `entrada` e `saida` (V1-09): situação em
   * níveis. O valor é o nível (0 a `niveis.length`). Do nível k sobe para
   * k + 1 quando a soma chega a `niveis[k].entrada`; desce de k + 1 para k
   * quando a soma cai a `niveis[k].saida` ou menos. Um degrau por passo.
   */
  niveis?: readonly { entrada: number; saida: number }[];
  /**
   * Só estoque (V1-07): o que passar do domínio ou do `teto` vai para outro
   * estoque da mesma unidade, em vez de sumir. `oposto`: um é bem e o outro
   * é dívida (cofre negativo vira dívida; dívida negativa vira cofre). Acima
   * do teto, só passa o que o outro estoque consegue receber.
   */
  transbordo?: {
    estoque: string;
    sentido: "oposto" | "igual";
    teto?: number;
  };
  area?: string;
  avaliacao?: "maior_melhor" | "maior_pior" | "neutra";
  /**
   * Resposta própria desta bolha (D-54), por passo. 1 = chega na hora: é o
   * caso das contas (receita, gasto, juros, resultado), que são somas e não
   * podem andar separadas das partes (SG159).
   */
  resposta?: number;
  /**
   * Faixa só para desenhar a bolha (tamanho e régua), quando o domínio é
   * aberto. O motor não usa: não limita nada.
   */
  faixaVisual?: { minimo: number; maximo: number };
  /**
   * Só calculado e estoque (V1-07): o que o valor do motor quer dizer no
   * mundo real. O motor segue em 0 a 100; `zero` e `cem` são a medida real
   * nesses dois pontos (uma reta; `zero` maior que `cem` inverte). Sem os
   * dois, o valor do motor já está na unidade. `tecnico`: estado interno sem
   * estatística real (aprovação, base); dispensa fontes.
   */
  medida?: VariableMeasure;
  /**
   * Pilar da área (V1-07): índice que resume a área e vai para a primeira
   * página do jornal. O número é a posição no quadro (1 primeiro).
   */
  pilar?: number;
};

export type VariableMeasure = {
  unidade: string;
  zero?: number;
  cem?: number;
  fontes?: string[];
  tecnico?: boolean;
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
  /** Cenário que este estado representa (ex.: Brasil 2026). */
  cenario?: {
    nome: string;
    ano?: number;
    /**
     * Meses que a carga roda sem o jogador antes do turno 0 (V1-07): os
     * valores declarados são do começo do aquecimento, e a partida começa
     * onde a simulação parou, com os atrasos já tendo história.
     */
    aquecimentoMeses?: number;
  };
  /**
   * Valor de cada índice ou situação no turno 0 do cenário (D-55). A parte
   * que as leis e a rede não explicam vira o nó visível `contexto:<bolha>`
   * ("Contexto do Brasil 2026"): fixo, soma como qualquer outra seta.
   */
  indicesIniciais?: Record<string, number>;
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
  politica?: PoliticalInitialState;
  /**
   * Lugares do país para os textos das ocorrências (SG106): cidades,
   * regiões, bairros… O evento local escolhe um pelo sorteio.
   */
  lugares?: Readonly<Record<string, readonly string[]>>;
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
  /** PIB anual na moeda do país (milhões). */
  pibAnual: number;
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
  /**
   * Nível da lei (D-65; `nivel` é a quantidade, D-24): pétrea não muda por votação; constitucional muda
   * por PEC; derivada é lei ordinária, complementar ou decreto. Sem o campo,
   * a lei é do formato antigo (área ainda não migrada).
   */
  nivelLegal?: PolicyTier;
  /** Pode sair do mapa (voltar ao catálogo)? Padrão: só derivadas (D-65). */
  revogavel?: boolean;
  /**
   * Lei filha (SG138): fora da opção de base (a primeira), só vale com a lei
   * mãe numa destas opções; quando a mãe sai delas, a filha cai para a base.
   * No formato de três níveis (`nivelLegal`), pode exigir mais de uma lei, e a
   * filha sem a base deixa de valer (volta ao catálogo).
   */
  requer?: PolicyRequirementFile | readonly PolicyRequirementFile[];
  consequencias: string[];
};

export const policyTiers = ["petrea", "constitucional", "derivada"] as const;
export type PolicyTier = (typeof policyTiers)[number];

export type PolicyRequirementFile = {
  lei: string;
  opcoes: readonly string[];
  motivo?: string;
};

/** As exigências de uma lei, sempre como lista. */
export function requirementsOf(
  policy: Pick<PolicyFile, "requer">,
): readonly PolicyRequirementFile[] {
  if (!policy.requer) return [];
  return Array.isArray(policy.requer)
    ? (policy.requer as readonly PolicyRequirementFile[])
    : [policy.requer as PolicyRequirementFile];
}

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
  /**
   * `pontos`: pares [entrada, saída] em ordem crescente de entrada; entre dois
   * pontos a saída é a reta que os liga; fora deles, o ponto da ponta. Serve
   * para o custo de cada opção de uma lei (SG157 fase 2, D-52).
   */
  pontos?: readonly (readonly [number, number])[];
};

/**
 * O resultado do mecanismo é multiplicado por `fator ÷ referencia`: um custo
 * que reage ao país (seguro-desemprego × desemprego, D-52).
 */
export type ConsequenceScale = {
  fator: string;
  /** Valor do fator em que o resultado vale o declarado. Maior que zero. */
  referencia: number;
};

/**
 * Lê a origem junto com outros nós antes do mecanismo (D-40, D-50):
 * entrada = origem × fator ÷ divisor × multiplicador. Exige divisor ou fator.
 */
export type ConsequenceNormalization = {
  /** Nó pelo qual a origem é dividida (domínio com mínimo > 0). */
  divisor?: string;
  /** Nó pelo qual a origem é multiplicada (alíquota × base, taxa × dívida). */
  fator?: string;
  /** Multiplica o resultado (100 = percentual). Padrão 1. */
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
  /**
   * Como a origem de uma lei é lida. `efeito` (padrão): nível × eficácia.
   * `nivel`: só o nível, sem a eficácia; para a conta de dinheiro, que custa
   * ou arrecada o que foi aprovado, funcione a lei bem ou mal (SG157).
   */
  leitura?: "efeito" | "nivel";
  escala?: ConsequenceScale;
  unidade: string;
  atrasoPassos: number;
  duracao:
    { modo: "unico" } | { modo: "fixo"; passos: number } | { modo: "continuo" };
};

/** Fator da chance (SG106): de `de` a `ate` na variável, a chance vai de ×1 a ×multiplica. */
export type OccurrenceChanceFactor = {
  variavel: string;
  de: number;
  ate: number;
  multiplica: number;
};

/** Condição de gatilho (mesma forma das condições do motor). */
export type OccurrenceCondition =
  | {
      tipo: "comparacao";
      variavel: string;
      operador:
        | "maior_que"
        | "maior_ou_igual"
        | "menor_que"
        | "menor_ou_igual"
        | "igual";
      valor: number;
    }
  | { tipo: "e" | "ou"; condicoes: readonly OccurrenceCondition[] }
  | { tipo: "nao"; condicao: OccurrenceCondition };

/**
 * Como a ocorrência acontece (SG106): chance por turno com fatores da rede;
 * só quando a condição vale (por `porTurnos` turnos seguidos); e, nas
 * reações, só na janela depois de o jogador mudar uma lei no sentido dado.
 */
export type OccurrenceTrigger = {
  chance: number;
  fatores?: readonly OccurrenceChanceFactor[];
  condicao?: OccurrenceCondition;
  porTurnos?: number;
  reacao?: {
    /** Controle da lei que o jogador mudou. */
    controle: string;
    /** A meta foi para um destes valores… */
    para?: readonly number[];
    /** …ou subiu/desceu pelo menos este tanto. */
    sobe?: number;
    desce?: number;
    janelaTurnos: number;
  };
};

/** O que vem depois (evento → dilema, escolha → evento). */
export type OccurrenceFollowUp = {
  ocorrencia: string;
  chance: number;
  emTurnos: readonly [number, number];
};

/** Opção de um dilema (SG106): nó próprio, duração, setas e leis que muda. */
export type DilemmaOptionFile = {
  id: string;
  rotulo: string;
  descricao?: string;
  controle: string;
  duracaoMeses: number;
  consequencias: readonly string[];
  leis?: readonly { lei: string; nivel: number }[];
  /** Só disponível quando a condição vale; o dilema tem sempre uma opção livre. */
  requer?: OccurrenceCondition;
  /** Por que a opção pode estar indisponível (texto para a tela). */
  motivoRequer?: string;
  desdobramentos?: readonly OccurrenceFollowUp[];
};

export type OccurrenceOrigin =
  | "mundo"
  | "natureza"
  | "pais"
  | "reacao"
  | "desdobramento"
  | "crise"
  | "cotidiano"
  /** Ação de um grupo de pressão (V1-09). */
  | "grupo";

export type OccurrenceFile = {
  id: string;
  tipo: "evento" | "situacao" | "dilema";
  versaoEsquema: 1;
  nome: string;
  descricao?: string;
  area?: string;
  avaliacao?: "positiva" | "negativa";
  /** Título curto para o jornal do turno (SG106). */
  manchete?: string;
  /** De onde vem (SG106). */
  origem?: OccurrenceOrigin;
  /** Tamanho: 1 local, 2 regional, 3 nacional, 4 catástrofe. */
  nivel?: 1 | 2 | 3 | 4;
  /** Só acontece uma vez por partida. */
  unica?: boolean;
  /** Evento: nó de intensidade (controle de 0 a 1) de onde saem as setas. */
  controle?: string;
  /** Evento: quantos meses dura. */
  duracaoMeses?: number;
  /** Turnos mínimos entre dois inícios da mesma ocorrência. */
  intervaloMinimoTurnos?: number;
  gatilho?: OccurrenceTrigger;
  desdobramentos?: readonly OccurrenceFollowUp[];
  /** Dilema: opções (2 a 4) e a que o piloto automático escolhe. */
  opcoes?: readonly DilemmaOptionFile[];
  padrao?: string;
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
