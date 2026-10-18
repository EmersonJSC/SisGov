import type {
  ConsequenceFile,
  InitialStateFile,
  PolicyCatalogFile,
  PolicyFile,
  ScenarioManifest,
  VariableDefinition,
  VariablesFile,
  WorldFile,
} from "../../src/engine/model/contentTypes";

/**
 * Ilha fictícia para testar jogabilidade. Todos os valores numéricos são
 * hipóteses editáveis do jogo, nunca estatísticas de um país real.
 */
export const BASE_MINIMA = {
  pais: {
    id: "ilha-teste",
    nome: "Ilha Teste — ilha isolada (fictícia)",
    ano: 1,
  },
  indicesHipotese: {
    pibMilhoes: 50_000,
    populacao: 1_000_000,
    inflacaoPct: 5,
    desempregoPct: 8,
    dividaPctPib: 30,
  },
  energiaHipotese: {
    demanda: 100,
    capacidade: 90,
    perdasTecnicas: 5,
    perdasComerciais: 3,
    caixaPublicoMilhoes: 1_000,
    atrasoExpansaoTrimestres: 2,
    capacidadePorNivelPorMes: 0.4,
    custoExpansaoMilhoesPorNivelMes: 5,
    reducaoPerdasPorNivelMes: 0.1,
    custoManutencaoMilhoesPorNivelMes: 1,
    riscoEntra: 15,
    riscoSai: 5,
  },
} as const;

const caminhos = {
  pais: "paises/ilha-teste/pais.json",
  estado: "paises/ilha-teste/estado-inicial.json",
  politica: "paises/ilha-teste/politica.json",
  mundo: "mundo/mundo.json",
  variaveis: "mundo/variaveis.json",
  catalogo: "mundo/catalogo-politicas.json",
  expansao: "mundo/leis/expansao-da-rede-eletrica.json",
  manutencao: "mundo/leis/manutencao-da-rede-eletrica.json",
  bussola: "mundo/bussola.json",
  referencias: "bussola/referencias.json",
  congresso: "bussola/congresso.json",
  eleicao: "mundo/eleicao.json",
  personagens: "mundo/personagens.json",
} as const;

type ArquivosGerados = Readonly<Record<string, object>>;

export function montarBaseMinima(): ArquivosGerados {
  const p = BASE_MINIMA;
  const h = p.energiaHipotese;
  const efeitos: ConsequenceFile[] = [];
  const efeito = (
    id: string,
    origem: string,
    alvo: string,
    unidade: string,
    coeficiente: number,
    atrasoPassos = 0,
    escalaCaixa = false,
    fatorRedutivel = false,
  ) => {
    efeitos.push({
      id,
      tipo: "consequencia",
      versaoEsquema: 1,
      origem,
      alvo,
      mecanismo: "afim",
      parametros: { coeficiente, termoConstante: 0 },
      unidade,
      ...(fatorRedutivel
        ? {
            normalizacao: {
              fator: "perdas_comerciais_rede",
              multiplicador: 1 / h.perdasComerciais,
            },
          }
        : {}),
      ...(escalaCaixa
        ? {
            escala: {
              fator: "caixa_publico",
              referencia: h.caixaPublicoMilhoes,
            },
          }
        : {}),
      atrasoPassos,
      duracao: { modo: "continuo" },
    });
    return `mundo/consequencias/${id}.json`;
  };

  // A ordem efetiva cai com o caixa disponível. Estes dois elos são
  // hipóteses de financiamento da ilha fictícia.
  efeito(
    "expansao-executada",
    "plano_expansao_rede",
    "expansao_executada",
    "quantidade",
    1,
    0,
    true,
  );
  efeito(
    "manutencao-executada",
    "padrao_manutencao_rede",
    "manutencao_executada",
    "quantidade",
    1,
    0,
    true,
    true,
  );

  efeito(
    "expansao-aumenta-capacidade",
    "expansao_executada",
    "capacidade_rede",
    "quantidade_por_passo",
    h.capacidadePorNivelPorMes,
    h.atrasoExpansaoTrimestres * 3,
  );
  efeito(
    "expansao-reduz-caixa",
    "expansao_executada",
    "caixa_publico",
    "moeda_por_passo",
    -h.custoExpansaoMilhoesPorNivelMes,
  );
  efeito(
    "manutencao-reduz-perdas",
    "manutencao_executada",
    "perdas_comerciais_rede",
    "quantidade_por_passo",
    -h.reducaoPerdasPorNivelMes,
    1,
  );
  efeito(
    "manutencao-reduz-caixa",
    "manutencao_executada",
    "caixa_publico",
    "moeda_por_passo",
    -h.custoManutencaoMilhoesPorNivelMes,
  );
  efeito(
    "demanda-pressiona-rede",
    "demanda_rede",
    "pressao_rede",
    "quantidade",
    1,
  );
  efeito(
    "capacidade-alivia-rede",
    "capacidade_rede",
    "pressao_rede",
    "quantidade",
    -1,
  );
  efeito(
    "perdas-pressionam-rede",
    "perdas_rede",
    "pressao_rede",
    "quantidade",
    1,
  );
  efeito(
    "perdas-tecnicas-na-rede",
    "perdas_tecnicas_rede",
    "perdas_rede",
    "quantidade",
    1,
  );
  efeito(
    "perdas-comerciais-na-rede",
    "perdas_comerciais_rede",
    "perdas_rede",
    "quantidade",
    1,
  );
  efeito("pressao-traz-risco", "pressao_rede", "risco_apagao", "quantidade", 1);

  const macro: VariableDefinition[] = [
    {
      id: "pib_nominal",
      tipo: "estoque",
      nome: "PIB anual (hipótese da ilha)",
      unidade: "moeda",
      dominio: { minimo: 0 },
      medida: { unidade: "milhões de créditos por ano", tecnico: true },
      area: "Contas e tributos",
    },
    {
      id: "populacao_total",
      tipo: "estoque",
      nome: "População — todos os residentes, de todas as idades (hipótese da ilha)",
      unidade: "quantidade",
      dominio: { minimo: 0 },
      medida: { unidade: "pessoas", tecnico: true },
      area: "Proteção social",
    },
    {
      id: "inflacao_anual",
      tipo: "estoque",
      nome: "Inflação anual (hipótese da ilha)",
      unidade: "percentual_0_100",
      dominio: { minimo: 0 },
      medida: { unidade: "% ao ano", tecnico: true },
      area: "Contas e tributos",
      avaliacao: "maior_pior",
    },
    {
      id: "desemprego",
      tipo: "estoque",
      nome: "Desemprego (hipótese da ilha)",
      unidade: "percentual_0_100",
      dominio: { minimo: 0 },
      medida: { unidade: "% da força de trabalho", tecnico: true },
      area: "Trabalho e mercado",
      avaliacao: "maior_pior",
    },
    {
      id: "divida_publica",
      tipo: "estoque",
      nome: "Dívida pública (hipótese da ilha)",
      unidade: "percentual_pib",
      dominio: { minimo: 0 },
      medida: { unidade: "% do PIB", tecnico: true },
      area: "Contas e tributos",
      avaliacao: "maior_pior",
    },
  ];
  const variaveis: VariablesFile = {
    id: "variaveis-base-minima",
    tipo: "variaveis",
    versaoEsquema: 1,
    variaveis: [
      ...macro,
      {
        id: "plano_expansao_rede",
        tipo: "controle",
        nome: "Plano de expansão da rede",
        unidade: "nivel",
        dominio: { minimo: 0, maximo: 2 },
        valorInicial: 0,
        area: "Meio ambiente, energia e campo",
      },
      {
        id: "padrao_manutencao_rede",
        tipo: "controle",
        nome: "Padrão de manutenção da rede",
        unidade: "nivel",
        dominio: { minimo: 0, maximo: 2 },
        valorInicial: 0,
        area: "Meio ambiente, energia e campo",
      },
      {
        id: "expansao_executada",
        tipo: "calculado",
        nome: "Expansão executada (hipótese piloto)",
        unidade: "quantidade",
        dominio: { minimo: 0 },
        medida: { unidade: "níveis executados", tecnico: true },
        area: "Meio ambiente, energia e campo",
      },
      {
        id: "manutencao_executada",
        tipo: "calculado",
        nome: "Manutenção executada (hipótese piloto)",
        unidade: "quantidade",
        dominio: { minimo: 0 },
        medida: { unidade: "níveis executados", tecnico: true },
        area: "Meio ambiente, energia e campo",
      },
      {
        id: "demanda_rede",
        tipo: "estoque",
        nome: "Demanda da rede (hipótese piloto)",
        unidade: "quantidade",
        dominio: { minimo: 0 },
        medida: { unidade: "unidades do piloto", tecnico: true },
        area: "Meio ambiente, energia e campo",
      },
      {
        id: "capacidade_rede",
        tipo: "estoque",
        nome: "Capacidade da rede (hipótese piloto)",
        unidade: "quantidade",
        dominio: { minimo: 0 },
        medida: { unidade: "unidades do piloto", tecnico: true },
        area: "Meio ambiente, energia e campo",
      },
      {
        id: "perdas_rede",
        tipo: "calculado",
        nome: "Perdas totais da rede (hipótese piloto)",
        unidade: "quantidade",
        dominio: { minimo: 0 },
        medida: { unidade: "unidades do piloto", tecnico: true },
        area: "Meio ambiente, energia e campo",
      },
      {
        id: "perdas_tecnicas_rede",
        tipo: "estoque",
        nome: "Perdas técnicas da rede (hipótese piloto)",
        unidade: "quantidade",
        dominio: { minimo: 0 },
        medida: { unidade: "unidades do piloto", tecnico: true },
        area: "Meio ambiente, energia e campo",
      },
      {
        id: "perdas_comerciais_rede",
        tipo: "estoque",
        nome: "Perdas comerciais da rede (hipótese piloto)",
        unidade: "quantidade",
        dominio: { minimo: 0 },
        medida: { unidade: "unidades do piloto", tecnico: true },
        area: "Meio ambiente, energia e campo",
      },
      {
        id: "caixa_publico",
        tipo: "estoque",
        nome: "Caixa público (hipótese piloto)",
        unidade: "moeda",
        dominio: { minimo: 0 },
        medida: { unidade: "milhões de créditos do piloto", tecnico: true },
        area: "Contas e tributos",
      },
      {
        id: "pressao_rede",
        tipo: "calculado",
        nome: "Pressão sobre o suprimento (hipótese piloto)",
        unidade: "quantidade",
        dominio: { minimo: 0 },
        medida: { unidade: "unidades do piloto", tecnico: true },
        area: "Meio ambiente, energia e campo",
        avaliacao: "maior_pior",
      },
      {
        id: "risco_apagao",
        tipo: "situacao",
        nome: "Risco de falta de energia (hipótese piloto)",
        unidade: "quantidade",
        dominio: { minimo: 0 },
        entrada: h.riscoEntra,
        saida: h.riscoSai,
        area: "Meio ambiente, energia e campo",
        avaliacao: "maior_pior",
      },
    ],
  };
  const expansao: PolicyFile = {
    id: "expansao-da-rede-eletrica",
    tipo: "lei",
    versaoEsquema: 2,
    grupo: "regulatoria",
    nome: "Programa de expansão da rede elétrica",
    descricao:
      "Escolhe o ritmo de projetos de expansão. Gasto e capacidade nova são apurados em momentos diferentes.",
    area: "Meio ambiente, energia e campo",
    fonte:
      "https://www.gov.br/mme/pt-br/assuntos/secretarias/sntep/publicacoes/plano-decenal-de-expansao-de-energia/pde-2034/relatorio_aprovado/pde2034_aprovado.pdf",
    processoAutorizacao: "execucao-programa",
    nivelLegal: "derivada",
    mesa: {
      id: "suprimento-eletrico",
      nome: "Suprimento elétrico",
      camada: "lei",
    },
    controle: {
      variavel: "plano_expansao_rede",
      unidade: "nivel",
      opcoes: [
        {
          id: "sem-projeto",
          rotulo: "Sem projetos novos",
          valor: 0,
          efeitos:
            "Preserva caixa; a capacidade atual pode ficar aquém da demanda.",
        },
        {
          id: "gradual",
          rotulo: "Expansão gradual",
          valor: 1,
          efeitos:
            "Paga projetos agora; a capacidade cresce após o prazo de obra (hipótese).",
        },
        {
          id: "acelerada",
          rotulo: "Expansão acelerada",
          valor: 2,
          efeitos:
            "Mais gasto e maior formação de capacidade futura (hipótese).",
        },
      ],
    },
    implantacaoTurnos: { minimo: 1, maximo: 1 },
    consequencias: ["expansao-executada"],
  };
  const manutencao: PolicyFile = {
    id: "manutencao-da-rede-eletrica",
    tipo: "lei",
    versaoEsquema: 2,
    grupo: "regulatoria",
    nome: "Padrão de manutenção da rede elétrica",
    descricao:
      "Escolhe a intensidade da manutenção para reduzir perdas ao longo do tempo.",
    area: "Meio ambiente, energia e campo",
    fonte:
      "https://www.gov.br/aneel/pt-br/assuntos/distribuicao/perdas-de-energia/perdas-de-energia",
    processoAutorizacao: "execucao-programa",
    nivelLegal: "derivada",
    mesa: {
      id: "suprimento-eletrico",
      nome: "Suprimento elétrico",
      camada: "lei",
    },
    controle: {
      variavel: "padrao_manutencao_rede",
      unidade: "nivel",
      opcoes: [
        {
          id: "corrente",
          rotulo: "Manutenção corrente",
          valor: 0,
          efeitos: "Mantém as perdas do cenário inicial.",
        },
        {
          id: "reforcada",
          rotulo: "Manutenção reforçada",
          valor: 1,
          efeitos: "Reduz perdas com gasto recorrente (hipótese).",
        },
        {
          id: "intensiva",
          rotulo: "Manutenção intensiva",
          valor: 2,
          efeitos: "Reduz mais perdas com custo maior (hipótese).",
        },
      ],
    },
    implantacaoTurnos: { minimo: 1, maximo: 1 },
    consequencias: ["manutencao-executada"],
  };
  const catalogo: PolicyCatalogFile = {
    id: "catalogo-base-minima",
    tipo: "catalogo-politicas",
    versaoEsquema: 1,
    politicas: [caminhos.expansao, caminhos.manutencao],
  };
  const mundo: WorldFile = {
    id: "mundo-base-minima",
    tipo: "mundo",
    versaoEsquema: 1,
    nome: "Mundo — base mínima experimental",
    variaveis: caminhos.variaveis,
    catalogoPoliticas: caminhos.catalogo,
    consequencias: efeitos.map((item) => `mundo/consequencias/${item.id}.json`),
    eventos: [],
    situacoes: [],
    dilemas: [],
  };
  const pais = {
    id: p.pais.id,
    tipo: "cenario",
    versaoEsquema: 1,
    nome: p.pais.nome,
    mundo: caminhos.mundo,
    estadoInicial: caminhos.estado,
    unidadeTemporal: "mes",
  } as ScenarioManifest;
  const estado: InitialStateFile = {
    id: "ilha-teste-estado-base-minima",
    tipo: "estado-inicial",
    versaoEsquema: 1,
    cenario: { nome: p.pais.nome, ano: p.pais.ano, aquecimentoMeses: 0 },
    economia: { pibAnual: p.indicesHipotese.pibMilhoes },
    valores: {
      pib_nominal: p.indicesHipotese.pibMilhoes,
      populacao_total: p.indicesHipotese.populacao,
      inflacao_anual: p.indicesHipotese.inflacaoPct,
      desemprego: p.indicesHipotese.desempregoPct,
      divida_publica: p.indicesHipotese.dividaPctPib,
      plano_expansao_rede: 0,
      padrao_manutencao_rede: 0,
      demanda_rede: h.demanda,
      capacidade_rede: h.capacidade,
      perdas_tecnicas_rede: h.perdasTecnicas,
      perdas_comerciais_rede: h.perdasComerciais,
      caixa_publico: h.caixaPublicoMilhoes,
    },
    leisVigentes: [
      { lei: "expansao-da-rede-eletrica", opcao: "sem-projeto" },
      { lei: "manutencao-da-rede-eletrica", opcao: "corrente" },
    ],
  };

  const arquivos: Record<string, object> = {
    [caminhos.pais]: pais,
    [caminhos.estado]: estado,
    [caminhos.politica]: {
      tipo: "pais-politica",
      ministerios: {
        areas: [
          {
            id: "instituicoes",
            titulo: "Poder e instituições",
            curto: "Instituições",
            faz: "Não implementado",
            coordenador: "instituicoes",
          },
          {
            id: "seguranca",
            titulo: "Segurança e justiça",
            curto: "Segurança",
            faz: "Não implementado",
            coordenador: "seguranca",
          },
          {
            id: "defesa",
            titulo: "Defesa e mundo",
            curto: "Defesa",
            faz: "Não implementado",
            coordenador: "defesa",
          },
          {
            id: "direitos",
            titulo: "Direitos e liberdades",
            curto: "Direitos",
            faz: "Não implementado",
            coordenador: "direitos",
          },
          {
            id: "contas",
            titulo: "Contas e tributos",
            curto: "Contas",
            faz: "Não implementado: PIB e dívida são referências; receita e despesa ainda não têm ciclo",
            coordenador: "contas",
          },
          {
            id: "trabalho",
            titulo: "Trabalho e mercado",
            curto: "Trabalho",
            faz: "Não implementado: desemprego é referência inicial",
            coordenador: "trabalho",
          },
          {
            id: "protecao",
            titulo: "Proteção social",
            curto: "Proteção",
            faz: "Não implementado: população é referência inicial",
            coordenador: "protecao",
          },
          {
            id: "educacao",
            titulo: "Educação, ciência e cultura",
            curto: "Educação",
            faz: "Não implementado",
            coordenador: "educacao",
          },
          {
            id: "energia",
            titulo: "Energia e ambiente",
            curto: "Energia",
            faz: "Ciclo de rede elétrica em teste",
            coordenador: "energia",
          },
          {
            id: "cidades",
            titulo: "Cidades e transporte",
            curto: "Cidades",
            faz: "Não implementado",
            coordenador: "cidades",
          },
        ],
        ministerios: [
          "instituicoes",
          "seguranca",
          "defesa",
          "direitos",
          "contas",
          "trabalho",
          "protecao",
          "educacao",
          "energia",
          "cidades",
        ].map((id) => ({
          id,
          nome: `Área de ${id}`,
          cargo: `Responsável por ${id}`,
          area: id,
          leis:
            id === "energia"
              ? ["expansao-da-rede-eletrica", "manutencao-da-rede-eletrica"]
              : [],
        })),
      },
    },
    [caminhos.mundo]: mundo,
    [caminhos.variaveis]: variaveis,
    [caminhos.catalogo]: catalogo,
    [caminhos.expansao]: expansao,
    [caminhos.manutencao]: manutencao,
    [caminhos.bussola]: {
      tipo: "mundo-bussola",
      versaoEsquema: 1,
      metodo: "Sem calibração política nesta base mínima",
      importancia: { outras: 1 },
      fatorDoRumo: { economia: 1, costumes: 1 },
      temas: {},
      leis: {},
    },
    [caminhos.referencias]: {
      tipo: "referencias-bussola",
      versaoEsquema: 1,
      fonte: {
        nome: "Sem referências na base mínima",
        versao: "piloto",
        citacao: "Hipótese técnica: lista vazia.",
      },
      metodo: {},
      personalidades: [],
      partidos: [],
      semMedida: [],
    },
    [caminhos.congresso]: {
      tipo: "congresso-bussola",
      versaoEsquema: 1,
      metodo: "Sem bancadas nesta base mínima",
      bancadas: [],
      prova: { pais: p.pais.id, tolerancia: 0, fontes: [], grupos: [] },
    },
    [caminhos.eleicao]: {
      tipo: "mundo-eleicao",
      versaoEsquema: 1,
      metodo: "Eleição indisponível nesta base mínima",
      voto: {
        pesoEconomico: {},
        escalas: {},
        pesoDoGoverno: 0,
        custoDeGovernar: 0,
        carisma: 0,
        experiencia: 0,
        carreira: 0,
        convergencia: 0,
        pesoDosCostumes: 0,
        sensibilidade: 0,
        vantagemDoCargo: 0,
      },
      ruido: 0,
      pesquisas: { tamanhoDaAmostra: 1, viesDoInstituto: 0 },
      estranhamento: {
        tolerancia: 0,
        pesoNoVoto: 0,
        quedaDaDisciplina: 0,
        disciplinaMinima: 0,
        passoDaIdeologia: 0,
      },
    },
    [caminhos.personagens]: {
      tipo: "mundo-personagens",
      versaoEsquema: 1,
      metodo: "Personagens indisponíveis nesta base mínima",
      desvio: 0,
      franqueza: {},
      explicitasDaFranqueza: {},
      opinioesPorPersonagem: [0, 0],
      idade: [0, 0],
      molde: "",
      caminhos: [],
      ideologias: [],
      carreiras: [],
      opinioes: [],
    },
  };
  for (const consequencia of efeitos)
    arquivos[`mundo/consequencias/${consequencia.id}.json`] = consequencia;
  return arquivos;
}

export const CAMINHO_CENARIO_BASE = caminhos.pais;
