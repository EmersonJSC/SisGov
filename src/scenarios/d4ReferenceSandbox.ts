import {
  buildGraph,
  type ResolvedPackage,
  type ScenarioGraph,
} from "../engine";
import type { VisualMapDefinition } from "../influenceLayout";

type Group =
  | "Governo Federal"
  | "Saúde"
  | "Educação"
  | "Segurança"
  | "Fazenda"
  | "Economia"
  | "Transportes"
  | "Desenvolvimento Social";

const referencePolicies: readonly (readonly [Group, string])[] = [
  ...[
    "Vacinação de rotina",
    "Saúde mental comunitária",
    "Assistência farmacêutica",
    "Telemedicina no SUS",
    "Atenção materna",
    "Saúde bucal",
    "Prevenção de epidemias",
    "Tratamento de dependências",
    "Alimentação saudável",
    "Controle do tabaco",
    "Prevenção do álcool",
    "Doação de órgãos",
    "Vigilância sanitária",
    "Formação de profissionais",
    "Prontuário integrado",
  ].map((name) => ["Saúde" as const, name] as const),
  ...[
    "Alimentação escolar",
    "Creches públicas",
    "Escola em tempo integral",
    "Formação docente",
    "Bibliotecas públicas",
    "Bolsas universitárias",
    "Educação profissional",
    "Inclusão digital escolar",
    "Transporte escolar",
    "Combate à evasão",
    "Material didático",
    "Esporte escolar",
    "Educação de jovens e adultos",
    "Apoio à pesquisa",
    "Cultura nas escolas",
  ].map((name) => ["Educação" as const, name] as const),
  ...[
    "Policiamento comunitário",
    "Câmeras corporais",
    "Investigação de homicídios",
    "Proteção de testemunhas",
    "Defensoria pública",
    "Mediação de conflitos",
    "Prevenção à violência juvenil",
    "Combate ao crime organizado",
    "Polícia científica",
    "Proteção de mulheres",
    "Segurança digital",
    "Sistema prisional",
    "Justiça restaurativa",
    "Capacitação policial",
    "Controle de armas",
  ].map((name) => ["Segurança" as const, name] as const),
  ...[
    "Imposto de renda progressivo",
    "Tributação de patrimônio",
    "Combate à evasão fiscal",
    "Nota fiscal cidadã",
    "Fiscalização aduaneira",
    "Simplificação tributária",
    "Imposto ambiental",
    "Tributo sobre luxo",
    "Crédito tributário à inovação",
    "Desoneração de alimentos",
    "Transparência fiscal",
    "Cobrança da dívida ativa",
    "Tributação de dividendos",
    "Imposto sobre herança",
    "Gestão da dívida pública",
  ].map((name) => ["Fazenda" as const, name] as const),
  ...[
    "Microcrédito produtivo",
    "Apoio a pequenas empresas",
    "Inovação industrial",
    "Qualificação profissional",
    "Intermediação de emprego",
    "Segurança do trabalho",
    "Economia solidária",
    "Cooperativas de produção",
    "Crédito rural",
    "Agricultura familiar",
    "Defesa da concorrência",
    "Proteção ao consumidor",
    "Incentivo à exportação",
    "Infraestrutura digital",
    "Pesquisa tecnológica",
  ].map((name) => ["Economia" as const, name] as const),
  ...[
    "Transporte coletivo urbano",
    "Corredores de ônibus",
    "Mobilidade ativa",
    "Segurança viária",
    "Ferrovias de carga",
    "Manutenção rodoviária",
    "Transporte escolar",
    "Acessibilidade urbana",
    "Eletrificação de frotas",
    "Tarifa social de transporte",
    "Planejamento metropolitano",
    "Logística regional",
  ].map((name) => ["Transportes" as const, name] as const),
  ...[
    "Transferência de renda",
    "Assistência social",
    "Moradia social",
    "Regularização fundiária",
    "Cozinhas comunitárias",
    "Apoio à primeira infância",
    "Inclusão de pessoas com deficiência",
    "Proteção à população de rua",
    "Cuidado a idosos",
    "Combate à fome",
    "Apoio a migrantes",
    "Acesso à água",
    "Defesa civil",
  ].map((name) => ["Desenvolvimento Social" as const, name] as const),
  ["Governo Federal", "Coordenação nacional de emergências"],
  ["Governo Federal", "Transparência do governo federal"],
];

const ministry: Record<Group, string> = {
  "Governo Federal": "Presidência",
  Saúde: "Ministério da Saúde",
  Educação: "Ministério da Educação",
  Segurança: "Ministério da Justiça e Segurança Pública",
  Fazenda: "Ministério da Fazenda",
  Economia: "Ministério do Desenvolvimento",
  Transportes: "Ministério dos Transportes",
  "Desenvolvimento Social": "Ministério do Desenvolvimento Social",
};

const target: Record<Group, string> = {
  "Governo Federal": "capacidade_institucional",
  Saúde: "saude_populacao",
  Educação: "qualidade_educacao",
  Segurança: "seguranca_cotidiana",
  Fazenda: "equilibrio_fiscal",
  Economia: "atividade_economica",
  Transportes: "mobilidade_urbana",
  "Desenvolvimento Social": "protecao_social",
};

const icon: Record<Group, string> = {
  "Governo Federal": "landmark",
  Saúde: "stethoscope",
  Educação: "landmark",
  Segurança: "shield-user",
  Fazenda: "landmark",
  Economia: "network",
  Transportes: "network",
  "Desenvolvimento Social": "shield-user",
};

/** Cenário de escala visual: adapta temas dos CSVs, sem reutilizar fórmulas ou valores do Democracy 4. */
export function createD4ReferenceSandbox(): {
  content: ResolvedPackage;
  graph: ScenarioGraph;
  visualMap: VisualMapDefinition;
} {
  const controls = referencePolicies.map(([area], index) => ({
    id: `verba_${String(index + 1).padStart(3, "0")}`,
    tipo: "controle" as const,
    nome: `Verba de ${referencePolicies[index][1]}`,
    unidade: "moeda_milhoes_2024_ano",
    dominio: { minimo: 0, maximo: 100 },
    // Faixas demonstrativas para exercitar proporções, sem estimativa real.
    valorInicial: [8, 18, 35, 60, 95][index % 5],
    area,
  }));
  const indicators = Object.entries(target).map(([area, id]) => ({
    id,
    tipo: "calculado" as const,
    nome: (
      {
        capacidade_institucional: "Capacidade institucional",
        saude_populacao: "Saúde da população",
        qualidade_educacao: "Qualidade educacional",
        seguranca_cotidiana: "Segurança cotidiana",
        equilibrio_fiscal: "Equilíbrio fiscal",
        atividade_economica: "Atividade econômica",
        mobilidade_urbana: "Mobilidade urbana",
        protecao_social: "Proteção social",
      } as Record<string, string>
    )[id],
    unidade: "indice_0_100",
    dominio: { minimo: 0, maximo: 100 },
    valorInicial: 50,
    area,
    avaliacao: "maior_melhor" as const,
  }));
  const policies = referencePolicies.map(([area, name], index) => {
    const number = String(index + 1).padStart(3, "0");
    return {
      id: `politica-${number}`,
      tipo: area === "Fazenda" ? ("imposto" as const) : ("programa" as const),
      versaoEsquema: 1 as const,
      nome: name,
      descricao: `Política de referência adaptada para testar a esfera de ${area} e suas consequências no SisGov.`,
      area,
      icone: icon[area],
      ministerio: area === "Governo Federal" ? undefined : ministry[area],
      processoAutorizacao: "execucao-programa-autorizado",
      controle: {
        variavel: `verba_${number}`,
        modo: "orcamento",
        unidade: "moeda_milhoes_2024_ano",
      },
      consequencias: [
        `efeito-${number}`,
        `despesa-${number}`,
        `saldo-${number}`,
      ],
      respostaTemporal: { implantacao: 0.2, degradacao: 0.12 },
    };
  });
  // Each sector's combined maximum fits in the 50→95 demonstration range.
  // This fixes inconsistent sample data; the engine still rejects invalid domains.
  const demoCoefficients = [0.02, 0.05, 0.09, 0.14, 0.2];
  const maximumByArea = new Map<Group, number>();
  referencePolicies.forEach(([area], index) =>
    maximumByArea.set(
      area,
      (maximumByArea.get(area) ?? 0) + demoCoefficients[index % 5] * 100,
    ),
  );
  const consequences = referencePolicies.flatMap(([area], index) => {
    const number = String(index + 1).padStart(3, "0");
    const source = `verba_${number}`;
    return [
      {
        id: `efeito-${number}`,
        tipo: "consequencia" as const,
        versaoEsquema: 1 as const,
        origem: source,
        alvo: target[area],
        mecanismo: "afim" as const,
        parametros: {
          coeficiente:
            demoCoefficients[index % 5] *
            Math.min(1, 45 / maximumByArea.get(area)!),
          termoConstante: 0,
        },
        unidade: "indice_0_100",
        atrasoPassos: 1,
        duracao: { modo: "continuo" as const },
      },
      {
        id: `despesa-${number}`,
        tipo: "consequencia" as const,
        versaoEsquema: 1 as const,
        origem: source,
        alvo: area === "Fazenda" ? "receita_publica" : "despesa_publica",
        mecanismo: "afim" as const,
        parametros: { coeficiente: 1, termoConstante: 0 },
        unidade: "moeda_milhoes_2024_ano",
        atrasoPassos: 0,
        duracao: { modo: "continuo" as const },
      },
      {
        id: `saldo-${number}`,
        tipo: "consequencia" as const,
        versaoEsquema: 1 as const,
        origem: source,
        alvo: "saldo_publico",
        mecanismo: "afim" as const,
        parametros: {
          coeficiente: area === "Fazenda" ? 1 : -1,
          termoConstante: 0,
        },
        unidade: "moeda_milhoes_2024_ano",
        atrasoPassos: 0,
        duracao: { modo: "continuo" as const },
      },
    ];
  });
  const finance = [
    {
      id: "receita_publica",
      tipo: "calculado" as const,
      nome: "Receita pública do laboratório",
      unidade: "moeda_milhoes_2024_ano",
      dominio: { minimo: 0 },
      valorInicial: 0,
      area: "Fazenda",
      avaliacao: "maior_melhor" as const,
    },
    {
      id: "despesa_publica",
      tipo: "calculado" as const,
      nome: "Despesa pública do laboratório",
      unidade: "moeda_milhoes_2024_ano",
      dominio: { minimo: 0 },
      valorInicial: 0,
      area: "Fazenda",
      avaliacao: "maior_pior" as const,
    },
    {
      id: "saldo_publico",
      tipo: "calculado" as const,
      nome: "Saldo público do laboratório",
      unidade: "moeda_milhoes_2024_ano",
      dominio: {},
      valorInicial: 6000,
      area: "Fazenda",
      avaliacao: "maior_melhor" as const,
    },
  ];
  const situations = [
    ["crise-saude", "Crise de atendimento", "Saúde", "saude_populacao"],
    [
      "crise-educacao",
      "Crise de aprendizagem",
      "Educação",
      "qualidade_educacao",
    ],
    [
      "inseguranca-urbana",
      "Insegurança urbana",
      "Segurança",
      "seguranca_cotidiana",
    ],
    ["crise-fiscal", "Crise fiscal", "Fazenda", "equilibrio_fiscal"],
    [
      "desassistencia-social",
      "Desassistência social",
      "Desenvolvimento Social",
      "protecao_social",
    ],
  ].map(([id, nome, area, variavel]) => ({
    id,
    tipo: "situacao" as const,
    versaoEsquema: 1 as const,
    nome,
    area,
    avaliacao: "negativa" as const,
    entraQuando: {
      tipo: "comparacao" as const,
      variavel,
      operador: "menor_ou_igual" as const,
      valor: 30,
    },
    saiQuando: {
      tipo: "comparacao" as const,
      variavel,
      operador: "maior_ou_igual" as const,
      valor: 40,
    },
    consequencias: [],
  }));
  const allVariables = [...controls, ...indicators, ...finance];
  const content = {
    manifest: {
      id: "laboratorio-referencia-d4",
      tipo: "cenario" as const,
      versaoEsquema: 1 as const,
      nome: "Laboratório — políticas e órbitas institucionais",
      estadoInicial: "gerado",
      variaveis: "gerado",
      politicas: [],
      consequencias: [],
      situacoes: [],
    },
    initialState: {
      id: "estado-gerado",
      tipo: "estado-inicial" as const,
      versaoEsquema: 1 as const,
      valores: Object.fromEntries(
        allVariables.map((item) => [item.id, item.valorInicial]),
      ),
    },
    variables: {
      id: "variaveis-geradas",
      tipo: "variaveis" as const,
      versaoEsquema: 1 as const,
      variaveis: allVariables,
    },
    policies,
    consequences,
    events: [],
    situations,
    dilemmas: [],
    filesById: {},
    pathsById: {},
  } as unknown as ResolvedPackage;
  const visualMap: VisualMapDefinition = {
    financialTargets: {
      receita_publica: "income",
      despesa_publica: "expense",
      saldo_publico: "balance",
    },
    nodes: {
      receita_publica: { scope: "national", affinities: {} },
      despesa_publica: { scope: "national", affinities: {} },
      saldo_publico: { scope: "national", affinities: {} },
      capacidade_institucional: { scope: "national", affinities: {} },
      "crise-fiscal": { scope: "national", affinities: {} },
      atividade_economica: { scope: "national" },
      equilibrio_fiscal: { scope: "national" },
      saude_populacao: { scope: "national" },
      qualidade_educacao: { scope: "national" },
      seguranca_cotidiana: { scope: "national" },
      mobilidade_urbana: { scope: "national" },
      protecao_social: { scope: "national" },
      verba_024: {
        affinities: {
          "Ministério da Educação": 0.8,
          "Ministério dos Transportes": 0.2,
        },
      },
    },
    seed: 56065,
    governmentName: "Governo Federal",
    macroAreas: [
      {
        id: "bem-estar",
        name: "Conhecimento, cultura e bem-estar",
        color: "#7456c7",
        areas: ["Saúde", "Educação"],
      },
      {
        id: "protecao",
        name: "Direitos e proteção social",
        color: "#db783c",
        areas: ["Segurança", "Desenvolvimento Social"],
      },
      {
        id: "economia",
        name: "Economia, trabalho e gestão",
        color: "#2879bd",
        areas: ["Fazenda", "Economia"],
      },
      {
        id: "territorio",
        name: "Infraestrutura e território",
        color: "#23956f",
        areas: ["Transportes"],
      },
    ],
    ministries: Object.entries(ministry)
      .filter(([area]) => area !== "Governo Federal")
      .map(([area, name]) => ({
        name,
        macroAreaId:
          area === "Saúde" || area === "Educação"
            ? "bem-estar"
            : area === "Segurança" || area === "Desenvolvimento Social"
              ? "protecao"
              : area === "Transportes"
                ? "territorio"
                : "economia",
        abbreviation: name.replace("Ministério d", "M. d"),
        minimumRadius: 9,
      })),
  };
  return { content, graph: buildGraph(content), visualMap };
}
