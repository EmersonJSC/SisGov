import { gerarRelatorioPolitico } from "./relatorioPolitico";
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
import {
  BASE_MINIMA,
  CAMINHO_CENARIO_BASE,
  montarBaseMinima,
} from "./baseMinima";
import { validarSementesEducacao } from "./programasEducacao";
import {
  auditarLeisExcludentes,
  contrapartesPesquisadas,
  validarParesExcludentes,
} from "./excludentes";

export const SEMENTE_EDUCACAO = 1;

export const CICLOS_EDUCACAO = [
  {
    numero: 1,
    titulo: "Acesso obrigatório e financiamento da oferta",
    leis: [
      "ensino-obrigatorio",
      "piso-educacao",
      "escolha-escolar-financiada",
      "provisao-publica-exclusiva",
    ],
    teste: "Demanda, capacidade, matrícula e apoio das famílias.",
  },
  {
    numero: 2,
    titulo: "Permanência e jornada escolar",
    leis: ["bolsa-de-permanencia-no-ensino-medio", "escola-em-tempo-integral"],
    teste: "Frequência e permanência para perfis familiares distintos.",
  },
  {
    numero: 3,
    titulo: "Docência e alfabetização",
    leis: ["piso-salarial-professores", "alfabetizacao-na-idade-certa"],
    teste: "Capacidade docente, atraso e aprendizagem.",
  },
  {
    numero: 4,
    titulo: "Acesso territorial e alimentação escolar",
    leis: ["transporte-escolar", "alimentacao-escolar"],
    teste: "Acesso rural, frequência e custo de apoio.",
  },
  {
    numero: 5,
    titulo: "Avaliação e realimentação por resultados",
    leis: ["avaliacao-das-escolas", "financiamento-com-resultado"],
    teste: "Informação, apoio por resultados e nova decisão.",
  },
] as const;

type DefinicaoLei = {
  id: string;
  nome: string;
  descricao: string;
  fonte: string;
  camada?: "constituicao" | "lei" | "alavanca";
  variavel: string;
  processo: string;
  implantacao: number;
  alvo: string;
  coeficiente: number;
  atraso: number;
  custo?: number;
  grupos: { apoiam: string[]; rejeitam: string[] };
};

type Alternativa = {
  id: string;
  rotulo: string;
  explicacao: string;
  efeitos: Readonly<Record<string, number>>;
};

const alternativas: Readonly<
  Record<string, readonly [Alternativa, Alternativa, Alternativa]>
> = {
  "ensino-obrigatorio": [
    {
      id: "busca-ativa",
      rotulo: "Busca ativa",
      explicacao:
        "Localiza crianças fora da escola e prioriza matrícula e acompanhamento das famílias. No piloto, melhora acesso e frequência com custo comparativo moderado.",
      efeitos: {
        acesso_escolar: 8,
        frequencia_escolar: 5,
        custo_educacao_hipotese: 1,
      },
    },
    {
      id: "expandir-vagas",
      rotulo: "Expandir vagas",
      explicacao:
        "Prioriza ampliar a capacidade de atendimento escolar. Tem atraso de implantação e custo comparativo maior; o efeito depende de obras e pessoal.",
      efeitos: {
        vagas_escolares: 12,
        acesso_escolar: 5,
        custo_educacao_hipotese: 2.5,
      },
    },
    {
      id: "apoio-permanencia",
      rotulo: "Apoiar permanência",
      explicacao:
        "Prioriza acompanhamento e apoio para que estudantes matriculados continuem frequentando. Não cria vagas por si só.",
      efeitos: {
        permanencia_escolar: 10,
        abandono_escolar: -6,
        custo_educacao_hipotese: 1.5,
      },
    },
  ],
  "piso-educacao": [
    {
      id: "novas-vagas",
      rotulo: "Ampliar vagas",
      explicacao:
        "Direciona recursos experimentais à capacidade de receber mais estudantes; tem custo e prazo de implantação maiores.",
      efeitos: {
        vagas_escolares: 14,
        acesso_escolar: 5,
        custo_educacao_hipotese: 2.5,
      },
    },
    {
      id: "manter-escolas",
      rotulo: "Manter escolas",
      explicacao:
        "Prioriza conservar a capacidade já existente para evitar perda de atendimento. O ganho é gradual e o custo comparativo é intermediário.",
      efeitos: {
        vagas_escolares: 8,
        frequencia_escolar: 2,
        custo_educacao_hipotese: 1.5,
      },
    },
    {
      id: "reduzir-desigualdade",
      rotulo: "Reduzir desigualdade",
      explicacao:
        "Prioriza redes e territórios com maior dificuldade de acesso. O efeito maior é reduzir a barreira territorial, não expandir toda a rede igualmente.",
      efeitos: {
        dificuldade_territorial: -10,
        acesso_escolar: 4,
        grupo_interior: 5,
        custo_educacao_hipotese: 1.8,
      },
    },
  ],
  "escolha-escolar-financiada": [
    {
      id: "rede-publica-com-escolha",
      rotulo: "Escolha com garantia pública",
      explicacao:
        "Permite escolher entre escolas públicas e independentes financiadas pelo poder público. A escolha, sozinha, não presume melhora na aprendizagem.",
      efeitos: {
        acesso_escolar: 5,
        informacao_educacional: 2,
        custo_educacao_hipotese: 2.2,
      },
    },
    {
      id: "contratos-com-metas",
      rotulo: "Financiar provedores com metas",
      explicacao:
        "Mantém a escolha entre provedores, mas condiciona parte do financiamento a requisitos e metas públicas; o efeito direto modelado é mais informação e capacidade.",
      efeitos: {
        vagas_escolares: 6,
        informacao_educacional: 4,
        custo_educacao_hipotese: 2.8,
      },
    },
    {
      id: "prioridade-rede-municipal",
      rotulo: "Priorizar a rede municipal",
      explicacao:
        "Concentra o planejamento e os recursos na rede diretamente administrada pelo poder público, com expansão mais gradual no piloto.",
      efeitos: {
        vagas_escolares: 4,
        dificuldade_territorial: -3,
        custo_educacao_hipotese: 1.5,
      },
    },
  ],
  "provisao-publica-exclusiva": [
    {
      id: "incorporacao-indenizada",
      rotulo: "Incorporar com indenização",
      explicacao:
        "Transfere escolas privadas para a administração pública com indenização. Valor dos ativos e pagamento ainda são hipóteses do piloto; custo e impacto transitório sobre famílias são hipóteses, sem presumir ganho de aprendizagem.",
      efeitos: { custo_educacao_hipotese: 3, grupo_familias_com_filhos: -2 },
    },
    {
      id: "incorporacao-seletiva",
      rotulo: "Incorporar com indenização seletiva",
      explicacao:
        "Transfere a rede privada à administração pública e diferencia a indenização conforme os critérios da lei. Ativos e pagamentos exigem avaliação individual; o custo comparativo é hipotético.",
      efeitos: { custo_educacao_hipotese: 2.5, grupo_familias_com_filhos: -2 },
    },
    {
      id: "excecoes-transitorias",
      rotulo: "Incorporar com exceções transitórias",
      explicacao:
        "Prevê exceções autorizadas durante a transferência da oferta para a rede pública. O custo comparativo e o prazo de transição são hipóteses; a exclusividade vale para a oferta ordinária.",
      efeitos: { custo_educacao_hipotese: 2, grupo_familias_com_filhos: -1 },
    },
  ],
  "bolsa-de-permanencia-no-ensino-medio": [
    {
      id: "foco-baixa-renda",
      rotulo: "Priorizar baixa renda",
      explicacao:
        "Concentra o apoio em estudantes de famílias de baixa renda. No piloto, beneficia mais os perfis pobres; o alcance total é menor.",
      efeitos: {
        permanencia_escolar: 9,
        grupo_pobres: 8,
        custo_educacao_hipotese: 1.8,
      },
    },
    {
      id: "ampliar-cobertura",
      rotulo: "Ampliar cobertura",
      explicacao:
        "Leva o incentivo a mais estudantes elegíveis, com menor concentração nos casos de maior vulnerabilidade.",
      efeitos: {
        permanencia_escolar: 7,
        frequencia_escolar: 5,
        grupo_jovens: 5,
        custo_educacao_hipotese: 2.8,
      },
    },
    {
      id: "foco-conclusao",
      rotulo: "Priorizar conclusão",
      explicacao:
        "Concentra o apoio nos estudantes em maior risco de abandonar antes de concluir o ensino médio. Não aumenta vagas escolares.",
      efeitos: {
        abandono_escolar: -10,
        permanencia_escolar: 8,
        grupo_jovens: 7,
        custo_educacao_hipotese: 2.2,
      },
    },
  ],
  "escola-em-tempo-integral": [
    {
      id: "territorios-vulneraveis",
      rotulo: "Priorizar territórios vulneráveis",
      explicacao:
        "Começa por escolas em áreas com maior vulnerabilidade, ampliando a jornada onde o apoio pode reduzir barreiras de permanência.",
      efeitos: {
        permanencia_escolar: 8,
        grupo_pobres: 5,
        custo_educacao_hipotese: 1.8,
      },
    },
    {
      id: "expandir-gradualmente",
      rotulo: "Expandir gradualmente",
      explicacao:
        "Cria vagas de jornada ampliada em etapas, limitadas pela capacidade de escolas e docentes. Cresce mais devagar e reduz risco de expansão sem estrutura.",
      efeitos: {
        vagas_escolares: 7,
        docentes_disponiveis: 4,
        permanencia_escolar: 4,
        custo_educacao_hipotese: 2,
      },
    },
    {
      id: "jornada-completa",
      rotulo: "Ampliar jornada",
      explicacao:
        "Acelera a oferta de jornada ampliada. Pode elevar permanência e aprendizagem, mas exige mais capacidade e apresenta custo comparativo maior.",
      efeitos: {
        vagas_escolares: 10,
        permanencia_escolar: 9,
        aprendizagem_escolar: 4,
        custo_educacao_hipotese: 3,
      },
    },
  ],
  "piso-salarial-professores": [
    {
      id: "fiscalizar-piso",
      rotulo: "Fiscalizar cumprimento",
      explicacao:
        "Prioriza identificar redes que não cumprem o piso legal e apoiar a regularização. O modelo não presume aumento automático de aprendizagem.",
      efeitos: {
        docentes_disponiveis: 4,
        grupo_servidores: 5,
        custo_educacao_hipotese: 1,
      },
    },
    {
      id: "complementar-redes",
      rotulo: "Apoiar redes com dificuldade",
      explicacao:
        "Prioriza assistência às redes com menor capacidade de financiar o piso. Tem custo comparativo maior e pode reduzir desigualdades de atendimento.",
      efeitos: {
        docentes_disponiveis: 8,
        grupo_interior: 4,
        custo_educacao_hipotese: 2.5,
      },
    },
    {
      id: "reter-professores",
      rotulo: "Reter professores",
      explicacao:
        "Prioriza reduzir a saída de docentes e estabilizar equipes. O efeito sobre disponibilidade docente é uma hipótese do piloto.",
      efeitos: {
        docentes_disponiveis: 12,
        permanencia_escolar: 2,
        custo_educacao_hipotese: 2,
      },
    },
  ],
  "alfabetizacao-na-idade-certa": [
    {
      id: "alfabetizacao-inicial",
      rotulo: "Foco na alfabetização inicial",
      explicacao:
        "Concentra apoio pedagógico nos primeiros anos escolares. A melhora de aprendizagem demora a aparecer.",
      efeitos: { aprendizagem_escolar: 10, custo_educacao_hipotese: 1.2 },
    },
    {
      id: "recomposicao-aprendizagem",
      rotulo: "Recompor aprendizagem",
      explicacao:
        "Prioriza estudantes que já apresentam defasagem, buscando recuperar habilidades essenciais; exige identificar necessidades diferentes.",
      efeitos: {
        aprendizagem_escolar: 8,
        frequencia_escolar: 2,
        grupo_jovens: 3,
        custo_educacao_hipotese: 1.8,
      },
    },
    {
      id: "formacao-docente",
      rotulo: "Apoiar professores",
      explicacao:
        "Direciona assistência técnica e formação a docentes. O resultado depende da aplicação pedagógica e não é automático.",
      efeitos: {
        docentes_disponiveis: 3,
        aprendizagem_escolar: 7,
        grupo_servidores: 3,
        custo_educacao_hipotese: 1.5,
      },
    },
  ],
  "transporte-escolar": [
    {
      id: "rotas-rurais-distantes",
      rotulo: "Atender rotas distantes",
      explicacao:
        "Prioriza estudantes rurais com trajetos mais longos, reduzindo a barreira territorial onde ela é maior.",
      efeitos: {
        dificuldade_territorial: -12,
        acesso_escolar: 8,
        grupo_interior: 8,
        custo_educacao_hipotese: 2.4,
      },
    },
    {
      id: "ampliar-rotas",
      rotulo: "Ampliar cobertura",
      explicacao:
        "Leva transporte a mais localidades, com cobertura mais ampla e menor concentração por estudante atendido.",
      efeitos: {
        dificuldade_territorial: -8,
        acesso_escolar: 6,
        frequencia_escolar: 3,
        custo_educacao_hipotese: 2,
      },
    },
    {
      id: "regularidade-rotas",
      rotulo: "Melhorar regularidade",
      explicacao:
        "Prioriza a confiabilidade das rotas existentes para reduzir faltas causadas por interrupções do transporte.",
      efeitos: {
        frequencia_escolar: 9,
        permanencia_escolar: 4,
        grupo_interior: 4,
        custo_educacao_hipotese: 1.5,
      },
    },
  ],
  "alimentacao-escolar": [
    {
      id: "cobertura-alimentar",
      rotulo: "Ampliar cobertura",
      explicacao:
        "Prioriza garantir refeição durante os dias letivos para mais estudantes, com efeito esperado na frequência.",
      efeitos: {
        frequencia_escolar: 9,
        grupo_pobres: 6,
        custo_educacao_hipotese: 2,
      },
    },
    {
      id: "qualidade-nutricional",
      rotulo: "Priorizar qualidade nutricional",
      explicacao:
        "Direciona esforço à qualidade nutricional e adequação das refeições; o efeito sobre frequência é menor no piloto.",
      efeitos: {
        frequencia_escolar: 5,
        aprendizagem_escolar: 2,
        grupo_pobres: 4,
        custo_educacao_hipotese: 1.8,
      },
    },
    {
      id: "compras-locais",
      rotulo: "Fortalecer compras locais",
      explicacao:
        "Prioriza aquisição de alimentos da produção local, com ganho potencial para a oferta territorial e maior custo operacional hipotético.",
      efeitos: {
        frequencia_escolar: 6,
        grupo_interior: 5,
        grupo_pobres: 3,
        custo_educacao_hipotese: 2.4,
      },
    },
  ],
  "avaliacao-das-escolas": [
    {
      id: "diagnostico-continuo",
      rotulo: "Diagnóstico frequente",
      explicacao:
        "Produz informação frequente para detectar dificuldades durante o ano. Coletar dados não melhora a aprendizagem por si só.",
      efeitos: { informacao_educacional: 12, custo_educacao_hipotese: 1.5 },
    },
    {
      id: "avaliacao-amostral",
      rotulo: "Avaliação amostral",
      explicacao:
        "Avalia amostras para acompanhar tendências gerais com menor custo e menor detalhe por escola.",
      efeitos: { informacao_educacional: 7, custo_educacao_hipotese: 0.7 },
    },
    {
      id: "devolutiva-por-escola",
      rotulo: "Devolutiva por escola",
      explicacao:
        "Entrega resultados detalhados a cada escola e rede. A informação é mais específica, com maior esforço de coleta e análise.",
      efeitos: { informacao_educacional: 10, custo_educacao_hipotese: 2 },
    },
  ],
  "financiamento-com-resultado": [
    {
      id: "premiar-equidade",
      rotulo: "Priorizar equidade",
      explicacao:
        "Distribui maior apoio para redes que melhoram resultados entre estudantes em desvantagem, para evitar premiar apenas quem já parte de condições melhores.",
      efeitos: {
        vagas_escolares: 4,
        grupo_pobres: 6,
        grupo_interior: 5,
        custo_educacao_hipotese: 1.5,
      },
    },
    {
      id: "premiar-frequencia",
      rotulo: "Priorizar frequência",
      explicacao:
        "Vincula o apoio ao avanço na presença e permanência, sem tratar frequência como prova suficiente de aprendizagem.",
      efeitos: {
        vagas_escolares: 3,
        frequencia_escolar: 5,
        permanencia_escolar: 4,
        custo_educacao_hipotese: 1.2,
      },
    },
    {
      id: "premiar-aprendizagem",
      rotulo: "Priorizar aprendizagem",
      explicacao:
        "Vincula o apoio à melhora demonstrada de aprendizagem, com salvaguardas para considerar as condições iniciais das redes.",
      efeitos: {
        vagas_escolares: 5,
        aprendizagem_escolar: 6,
        informacao_educacional: 3,
        custo_educacao_hipotese: 2,
      },
    },
  ],
};

// Cada lei começa em uma estratégia concreta já listada. O valor zero fica
// reservado à ausência/revogação da lei, nunca a uma opção de “manter”.
const situacoesIniciais: Readonly<Record<string, string>> = {
  "ensino-obrigatorio": "busca-ativa",
  "piso-educacao": "novas-vagas",
  "escolha-escolar-financiada": "rede-publica-com-escolha",
  "provisao-publica-exclusiva": "incorporacao-indenizada",
  "bolsa-de-permanencia-no-ensino-medio": "foco-baixa-renda",
  "escola-em-tempo-integral": "territorios-vulneraveis",
  "piso-salarial-professores": "fiscalizar-piso",
  "alfabetizacao-na-idade-certa": "alfabetizacao-inicial",
  "transporte-escolar": "rotas-rurais-distantes",
  "alimentacao-escolar": "cobertura-alimentar",
  "avaliacao-das-escolas": "diagnostico-continuo",
  "financiamento-com-resultado": "premiar-equidade",
};

const camadaPorLei: Readonly<
  Record<string, "constituicao" | "lei" | "alavanca">
> = {
  "ensino-obrigatorio": "constituicao",
  "piso-educacao": "alavanca",
  "escolha-escolar-financiada": "lei",
  "provisao-publica-exclusiva": "lei",
  "bolsa-de-permanencia-no-ensino-medio": "lei",
  "escola-em-tempo-integral": "alavanca",
  "piso-salarial-professores": "lei",
  "alfabetizacao-na-idade-certa": "lei",
  "transporte-escolar": "alavanca",
  "alimentacao-escolar": "lei",
  "avaliacao-das-escolas": "lei",
  "financiamento-com-resultado": "alavanca",
};

const grupoPorLei: Readonly<Record<string, PolicyFile["grupo"]>> = {
  // O contrato atual só permite opções em leis regulatórias/institucionais;
  // custo comparativo continua explicado como hipótese nas opções.
  "ensino-obrigatorio": "regulatoria",
  "piso-educacao": "regulatoria",
  "escolha-escolar-financiada": "regulatoria",
  "provisao-publica-exclusiva": "regulatoria",
  "bolsa-de-permanencia-no-ensino-medio": "regulatoria",
  "escola-em-tempo-integral": "regulatoria",
  "piso-salarial-professores": "regulatoria",
  "alfabetizacao-na-idade-certa": "regulatoria",
  "transporte-escolar": "regulatoria",
  "alimentacao-escolar": "regulatoria",
  "avaliacao-das-escolas": "regulatoria",
  "financiamento-com-resultado": "regulatoria",
};

// Vetores políticos são estimativas editoriais do protótipo. A evidência do
// Manifesto Project classifica temas; não determina sozinha o lado político.
const vetoresPoliticos: Readonly<
  Record<string, readonly (readonly [number, number])[]>
> = {
  "ensino-obrigatorio": [
    [-0.8, 0],
    [-1, 0],
    [-0.7, 0],
  ],
  "piso-educacao": [
    [-1, 0],
    [-0.7, 0],
    [-0.8, 0],
  ],
  "bolsa-de-permanencia-no-ensino-medio": [
    [-1, 0],
    [-0.6, 0],
    [-0.8, 0],
  ],
  "escola-em-tempo-integral": [
    [-0.8, 0],
    [-0.6, 0],
    [-1, 0],
  ],
  "piso-salarial-professores": [
    [-0.3, 0],
    [-0.8, 0],
    [-0.6, 0],
  ],
  "alfabetizacao-na-idade-certa": [
    [-0.7, 0],
    [-0.7, 0],
    [-0.4, 0],
  ],
  "transporte-escolar": [
    [-0.9, 0],
    [-0.8, 0],
    [-0.6, 0],
  ],
  "alimentacao-escolar": [
    [-0.9, 0],
    [-0.7, 0],
    [-0.5, 0],
  ],
  "avaliacao-das-escolas": [
    [-0.4, 0],
    [0, 0],
    [-0.2, 0],
  ],
  "financiamento-com-resultado": [
    [-0.9, 0],
    [-0.5, 0],
    [-0.3, 0],
  ],
};

/** A bússola reporta cobertura; não inventa lados políticos para preencher lacunas. */
export function coberturaPoliticaEducacao(rodada: number) {
  const ids = CICLOS_EDUCACAO.slice(0, rodada).flatMap((cycle) => cycle.leis);
  const gruposPorLei = new Map<string, string>();
  for (const par of contrapartesPesquisadas) {
    gruposPorLei.set(par.leiBaseId, par.problemaEquivalente);
    gruposPorLei.set(par.leiContraparteId, par.problemaEquivalente);
  }
  return gerarRelatorioPolitico(
    ids.flatMap((lei) =>
      (alternativas[lei] ?? []).map((opcao, index) => ({
        objeto: gruposPorLei.get(lei) ?? lei,
        lei,
        opcao: opcao.id,
        vetor: vetoresPoliticos[lei]?.[index] ?? null,
      })),
    ),
  );
}

export function auditoriaExcludentesEducacao(rodada: number) {
  const ids = CICLOS_EDUCACAO.slice(0, rodada).flatMap((cycle) => cycle.leis);
  return auditarLeisExcludentes(ids);
}

function valorDaSituacaoInicial(leiId: string): number {
  const choices = alternativas[leiId];
  const idInicial = situacoesIniciais[leiId];
  const indice = choices?.findIndex((choice) => choice.id === idInicial) ?? -1;
  if (indice < 0)
    throw new Error(`Situação inicial sem opção válida para a lei ${leiId}.`);
  return indice + 1;
}

const definicoes: readonly DefinicaoLei[] = [
  {
    id: "ensino-obrigatorio",
    nome: "Garantia da escolaridade obrigatória",
    descricao:
      "Organiza a busca ativa e o atendimento da população em idade escolar. A obrigação jurídica permanece; as opções representam a capacidade de colocá-la em prática.",
    fonte:
      "https://planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm",
    variavel: "implementacao_escolaridade_obrigatoria",
    processo: "coordenacao-federativa",
    implantacao: 1,
    alvo: "acesso_escolar",
    coeficiente: 0.2,
    atraso: 0,
    custo: 0.005,
    grupos: {
      apoiam: ["jovens", "familias com filhos"],
      rejeitam: [],
    },
  },
  {
    id: "piso-educacao",
    nome: "Financiamento da educação básica",
    descricao:
      "Define a prioridade de financiamento e cooperação para a oferta da educação básica. As intensidades e os custos da ilha são hipóteses de teste.",
    fonte:
      "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/lei/l14113.htm",
    variavel: "prioridade_financiamento_educacao",
    processo: "transferencia-educacional",
    implantacao: 1,
    alvo: "vagas_escolares",
    coeficiente: 0.08,
    atraso: 2,
    custo: 0.015,
    grupos: { apoiam: ["familias com filhos"], rejeitam: [] },
  },
  {
    id: "escolha-escolar-financiada",
    nome: "Escolha entre provedores escolares com financiamento público",
    descricao:
      "Permite organizar a oferta por escolas diretamente administradas pelo poder público e por escolas independentes financiadas publicamente. A referência sueca fundamenta a existência do modelo; os efeitos da ilha são hipóteses. A posição desta lei na bússola ainda precisa de fundamentação.",
    fonte:
      "https://www.skolverket.se/styrning-och-ansvar/regler-och-ansvar/ansvar-i-skolfragor/valja-forskoleklass-och-grundskola-eller-anpassad-grundskola",
    variavel: "modelo_provisao_escolar",
    processo: "organizacao-da-oferta-escolar",
    implantacao: 2,
    alvo: "vagas_escolares",
    coeficiente: 0.05,
    atraso: 2,
    custo: 0.02,
    grupos: {
      apoiam: ["familias com filhos", "classe media"],
      rejeitam: [],
    },
  },
  {
    id: "provisao-publica-exclusiva",
    nome: "Provisão pública exclusiva da educação",
    descricao:
      "Transfere a oferta escolar ordinária privada à administração pública. A lei cubana de 1961 fundamenta o modelo, a nacionalização, a indenização e exceções; números e efeitos da ilha são hipóteses. Posição na bússola pendente de fundamentação.",
    fonte:
      "https://siteal.iiep.unesco.org/sites/default/files/sit_accion_files/ley_de_nacionalizacion_de_la_educacion.pdf",
    variavel: "provisao_publica_exclusiva",
    processo: "organizacao-da-oferta-escolar",
    implantacao: 2,
    alvo: "custo_educacao_hipotese",
    coeficiente: 0,
    atraso: 0,
    grupos: { apoiam: [], rejeitam: [] },
  },
  {
    id: "bolsa-de-permanencia-no-ensino-medio",
    nome: "Incentivo à permanência no ensino médio",
    descricao:
      "Estabelece apoio financeiro educacional à permanência e conclusão do ensino médio público. O alcance quantitativo do piloto é hipotético.",
    fonte:
      "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l14818.htm",
    variavel: "apoio_financeiro_permanencia",
    processo: "incentivo-educacional",
    implantacao: 1,
    alvo: "permanencia_escolar",
    coeficiente: 0.2,
    atraso: 1,
    custo: 0.025,
    grupos: { apoiam: ["jovens", "pobres"], rejeitam: [] },
  },
  {
    id: "escola-em-tempo-integral",
    nome: "Oferta de jornada escolar ampliada",
    descricao:
      "Apoia a expansão de matrículas em tempo integral, sujeita a vagas, docentes e serviços de apoio.",
    fonte:
      "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14640.htm",
    variavel: "oferta_jornada_integral",
    processo: "expansao-de-oferta",
    implantacao: 2,
    alvo: "vagas_escolares",
    coeficiente: 0.06,
    atraso: 3,
    custo: 0.02,
    grupos: { apoiam: ["familias com filhos"], rejeitam: [] },
  },
  {
    id: "piso-salarial-professores",
    nome: "Piso e valorização do magistério público",
    descricao:
      "Define o piso nacional do magistério público da educação básica e sua atualização. O efeito de retenção docente no piloto é hipótese.",
    fonte:
      "https://planalto.gov.br/ccivil_03/_ato2023-2026/2026/lei/l15437.htm",
    variavel: "valorizacao_magisterio",
    processo: "remuneracao-magisterio",
    implantacao: 2,
    alvo: "docentes_disponiveis",
    coeficiente: 0.06,
    atraso: 3,
    custo: 0.02,
    grupos: { apoiam: ["servidores públicos"], rejeitam: [] },
  },
  {
    id: "alfabetizacao-na-idade-certa",
    nome: "Cooperação para alfabetização na idade certa",
    descricao:
      "Organiza assistência técnica e colaboração federativa para alfabetização e recomposição da aprendizagem.",
    fonte:
      "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15247.htm",
    variavel: "apoio_alfabetizacao",
    processo: "cooperacao-alfabetizacao",
    implantacao: 2,
    alvo: "aprendizagem_escolar",
    coeficiente: 0.18,
    atraso: 4,
    custo: 0.01,
    grupos: { apoiam: ["jovens", "familias com filhos"], rejeitam: [] },
  },
  {
    id: "transporte-escolar",
    nome: "Apoio ao transporte escolar rural",
    descricao:
      "Organiza assistência financeira suplementar para o transporte escolar de estudantes da educação básica pública residentes em área rural.",
    fonte:
      "https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2004/lei/l10.880.htm",
    variavel: "apoio_transporte_escolar",
    processo: "apoio-transporte-escolar",
    implantacao: 1,
    alvo: "acesso_escolar",
    coeficiente: 0.18,
    atraso: 1,
    custo: 0.012,
    grupos: { apoiam: ["interior", "familias com filhos"], rejeitam: [] },
  },
  {
    id: "alimentacao-escolar",
    nome: "Oferta de alimentação escolar",
    descricao:
      "Organiza a oferta de alimentação escolar e ações associadas no período letivo. O efeito quantitativo na frequência é hipótese do piloto.",
    fonte:
      "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/lei/l11947.htm",
    variavel: "apoio_alimentacao_escolar",
    processo: "alimentacao-escolar",
    implantacao: 1,
    alvo: "frequencia_escolar",
    coeficiente: 0.14,
    atraso: 1,
    custo: 0.015,
    grupos: { apoiam: ["pobres", "familias com filhos"], rejeitam: [] },
  },
  {
    id: "avaliacao-das-escolas",
    nome: "Avaliação e monitoramento educacional",
    descricao:
      "Organiza avaliação e acompanhamento para identificar lacunas de aprendizagem e orientar apoio às redes.",
    fonte:
      "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/lei/l15388.htm",
    variavel: "intensidade_avaliacao_educacional",
    processo: "avaliacao-educacional",
    implantacao: 1,
    alvo: "informacao_educacional",
    coeficiente: 0.2,
    atraso: 1,
    custo: 0.005,
    grupos: { apoiam: ["familias com filhos"], rejeitam: [] },
  },
  {
    id: "financiamento-com-resultado",
    nome: "Complementação financeira por resultados educacionais",
    descricao:
      "Vincula parte da complementação financeira ao cumprimento de condicionalidades e à evolução de indicadores de atendimento, aprendizagem e equidade.",
    fonte:
      "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/lei/l14113.htm",
    variavel: "complementacao_resultados_educacionais",
    processo: "financiamento-por-resultados",
    implantacao: 2,
    alvo: "vagas_escolares",
    coeficiente: 0.05,
    atraso: 3,
    custo: 0.01,
    grupos: { apoiam: ["familias com filhos"], rejeitam: [] },
  },
];

const caminhos = {
  variaveis: "mundo/variaveis.json",
  catalogo: "mundo/catalogo-politicas.json",
  mundo: "mundo/mundo.json",
  estado: "paises/ilha-teste/estado-inicial.json",
  pais: "paises/ilha-teste/pais.json",
  politica: "paises/ilha-teste/politica.json",
};

const area = "Educação, ciência e cultura";
const pessoas = [
  "grupo_jovens",
  "grupo_familias_com_filhos",
  "grupo_pobres",
  "grupo_classe_media",
  "grupo_interior",
  "grupo_periferias",
  "grupo_servidores",
];

const explicacoesVariaveis: Readonly<Record<string, string>> = {
  implementacao_escolaridade_obrigatoria:
    "Intensidade da busca ativa e da capacidade de atender crianças e jovens que devem frequentar a escola.",
  prioridade_financiamento_educacao:
    "Prioridade experimental dada à expansão e manutenção da oferta de educação básica.",
  modelo_provisao_escolar:
    "Modelo de organização da oferta escolar entre rede pública diretamente administrada e provedores independentes financiados publicamente; hipótese do protótipo.",
  apoio_financeiro_permanencia:
    "Alcance hipotético do apoio financeiro destinado a reduzir obstáculos econômicos à permanência no ensino médio.",
  oferta_jornada_integral:
    "Escala hipotética de expansão de vagas com jornada ampliada, limitada pela capacidade de escolas e docentes.",
  valorizacao_magisterio:
    "Intensidade hipotética de medidas para valorizar e reter profissionais do magistério; não altera automaticamente a quantidade de professores.",
  apoio_alfabetizacao:
    "Alcance hipotético da assistência pedagógica e da cooperação para alfabetização; não garante aprendizagem automática.",
  apoio_transporte_escolar:
    "Alcance hipotético do suporte ao transporte, sobretudo para estudantes rurais com trajetos longos.",
  apoio_alimentacao_escolar:
    "Alcance hipotético da oferta de alimentação durante o período escolar.",
  intensidade_avaliacao_educacional:
    "Intensidade de coleta e acompanhamento de informações sobre escolas e aprendizagem.",
  complementacao_resultados_educacionais:
    "Intensidade hipotética de apoio financeiro orientado por metas, atendimento, aprendizagem e equidade.",
  demanda_escolar:
    "Índice hipotético da procura por vagas entre crianças e jovens em idade de escolaridade obrigatória. Não é a população total nem uma contagem real de estudantes.",
  vagas_escolares:
    "Capacidade estimada de receber estudantes com as escolas, salas e turnos disponíveis. O valor é um índice de teste, não uma contagem de vagas.",
  docentes_disponiveis:
    "Capacidade estimada de professores para atender as turmas. O índice não informa o número real de docentes nem sua distribuição por disciplina.",
  dificuldade_territorial:
    "Barreiras de distância, tempo de viagem e falta de transporte entre a casa e a escola. Valor alto significa acesso mais difícil; a escala é uma hipótese do piloto.",
  satisfacao_base_pessoas:
    "Ponto inicial hipotético usado para calcular a satisfação dos perfis sociais da ilha. Não é pesquisa de opinião real.",
  acesso_escolar:
    "Quanto da procura escolar consegue chegar a uma vaga. Acesso maior indica menos pessoas impedidas por falta de capacidade ou barreiras territoriais.",
  permanencia_escolar:
    "Condições para estudantes continuarem matriculados ao longo do tempo, incluindo apoio financeiro e jornada adequada. Não representa conclusão escolar por si só.",
  frequencia_escolar:
    "Presença dos estudantes nas aulas. Pode cair mesmo quando há matrícula, por distância, renda ou falta de serviços de apoio.",
  abandono_escolar:
    "Pressão estimada para deixar a escola antes de concluir a etapa. Valor maior é pior; é um indicador hipotético, não uma taxa oficial de evasão.",
  aprendizagem_escolar:
    "Aprendizagem acumulada estimada a partir de frequência, docentes e apoio pedagógico. Não equivale a uma nota de prova observada.",
  informacao_educacional:
    "Informação disponível para identificar diferenças entre escolas e orientar apoio. Avaliar mede informação; não melhora a aprendizagem automaticamente.",
  custo_educacao_hipotese:
    "Índice comparativo hipotético do esforço de recursos exigido pelas escolhas. Não é dinheiro, orçamento oficial nem estimativa de custo real.",
  popularidade_governo:
    "Aprovação calculada a partir da satisfação dos perfis sintéticos da ilha. Não é uma pesquisa eleitoral real.",
  grupo_jovens:
    "Satisfação modelada dos perfis de jovens. O valor não conta quantos jovens existem.",
  grupo_familias_com_filhos:
    "Satisfação modelada dos perfis de famílias com filhos. O valor não é o tamanho dessas famílias.",
  grupo_pobres:
    "Satisfação modelada dos perfis de baixa renda; não mede quantas pessoas estão na pobreza.",
  grupo_classe_media:
    "Satisfação modelada dos perfis de classe média; não mede o tamanho desse grupo.",
  grupo_interior:
    "Satisfação modelada dos perfis que vivem fora das periferias metropolitanas; não é uma contagem de moradores do interior.",
  grupo_periferias:
    "Satisfação modelada dos perfis que vivem em periferias metropolitanas; não é uma contagem de moradores.",
  grupo_servidores:
    "Satisfação modelada dos perfis de servidores públicos; não mede o número de servidores.",
};

function variavel(
  id: string,
  tipo: VariableDefinition["tipo"],
  nome: string,
  unidade: string,
  extra: Partial<VariableDefinition> = {},
): VariableDefinition {
  return {
    id,
    tipo,
    nome: explicacoesVariaveis[id]
      ? `${nome} — ${explicacoesVariaveis[id]}`
      : nome,
    unidade,
    dominio: {
      minimo: 0,
      ...(tipo === "calculado" || tipo === "grupo" ? { maximo: 100 } : {}),
    },
    area,
    ...(tipo === "calculado" || tipo === "estoque"
      ? { medida: { unidade, tecnico: true } }
      : {}),
    ...extra,
  };
}

function variaveisEducacao(): VariableDefinition[] {
  const controls = definicoes.map((law) =>
    variavel(law.variavel, "controle", law.nome, "nivel", {
      dominio: { minimo: 0, maximo: 3 },
      valorInicial: valorDaSituacaoInicial(law.id),
    }),
  );
  return [
    ...controls,
    variavel(
      "demanda_escolar",
      "estoque",
      "Demanda escolar elegível",
      "indice_0_100",
      {
        valorInicial: 70,
      },
    ),
    variavel(
      "vagas_escolares",
      "estoque",
      "Capacidade de vagas escolares",
      "indice_0_100",
      {
        valorInicial: 48,
      },
    ),
    variavel(
      "docentes_disponiveis",
      "estoque",
      "Capacidade docente disponível",
      "indice_0_100",
      {
        valorInicial: 52,
      },
    ),
    variavel(
      "dificuldade_territorial",
      "estoque",
      "Barreira territorial de acesso",
      "indice_0_100",
      {
        valorInicial: 45,
      },
    ),
    variavel(
      "satisfacao_base_pessoas",
      "estoque",
      "Referência inicial de satisfação (hipótese)",
      "indice_0_100",
      {
        valorInicial: 50,
      },
    ),
    variavel("acesso_escolar", "calculado", "Acesso à escola", "indice_0_100", {
      avaliacao: "maior_melhor",
    }),
    variavel(
      "permanencia_escolar",
      "calculado",
      "Permanência escolar",
      "indice_0_100",
      {
        avaliacao: "maior_melhor",
      },
    ),
    variavel(
      "frequencia_escolar",
      "calculado",
      "Frequência escolar",
      "indice_0_100",
      {
        avaliacao: "maior_melhor",
      },
    ),
    variavel(
      "abandono_escolar",
      "calculado",
      "Pressão de abandono escolar",
      "indice_0_100",
      {
        avaliacao: "maior_pior",
      },
    ),
    variavel(
      "aprendizagem_escolar",
      "calculado",
      "Aprendizagem escolar",
      "indice_0_100",
      {
        avaliacao: "maior_melhor",
      },
    ),
    variavel(
      "informacao_educacional",
      "calculado",
      "Informação para gestão educacional",
      "indice_0_100",
    ),
    variavel(
      "custo_educacao_hipotese",
      "calculado",
      "Custo comparativo da política educacional (hipótese)",
      "indice_0_100",
    ),
    variavel(
      "popularidade_governo",
      "calculado",
      "Aprovação calculada pelos perfis",
      "indice_0_100",
    ),
    ...pessoas.map((id) =>
      variavel(
        id,
        "grupo",
        id.replace(/^grupo_/, "").replaceAll("_", " "),
        "indice_0_100",
        {
          avaliacao: "maior_melhor",
        },
      ),
    ),
  ];
}

function consequence(
  id: string,
  origem: string,
  alvo: string,
  coeficiente: number,
  atrasoPassos = 0,
  termoConstante = 0,
  unidade = "indice_0_100",
): ConsequenceFile {
  return {
    id,
    tipo: "consequencia",
    versaoEsquema: 1,
    origem,
    alvo,
    mecanismo: "afim",
    parametros: { coeficiente, termoConstante },
    unidade,
    atrasoPassos,
    duracao: { modo: "continuo" },
  };
}

function leisDaRodada(rodada: number): PolicyFile[] {
  const permitidas = new Set<string>(
    CICLOS_EDUCACAO.slice(0, rodada).flatMap((cycle) => cycle.leis),
  );
  return definicoes
    .filter((law) => permitidas.has(law.id))
    .map((law) => {
      const choices = alternativas[law.id];
      if (!choices.some((choice) => choice.id === situacoesIniciais[law.id]))
        throw new Error(
          `Situação inicial sem opção válida para a lei ${law.id}.`,
        );
      const targets = [
        ...new Set(choices.flatMap((choice) => Object.keys(choice.efeitos))),
      ];
      const lawConsequences = targets.map(
        (target) => `educacao-${law.id}-${target}`,
      );
      return {
        id: law.id,
        tipo: "lei" as const,
        versaoEsquema: 2 as const,
        grupo: grupoPorLei[law.id] ?? "regulatoria",
        nome: law.nome,
        descricao: law.descricao,
        area,
        fonte: law.fonte,
        processoAutorizacao: law.processo,
        nivelLegal:
          (law.camada ?? camadaPorLei[law.id]) === "constituicao"
            ? ("constitucional" as const)
            : ("derivada" as const),
        revogavel: true,
        ...(law.id === "provisao-publica-exclusiva" ||
        law.id === "escolha-escolar-financiada"
          ? {
              exclui: [
                law.id === "provisao-publica-exclusiva"
                  ? "escolha-escolar-financiada"
                  : "provisao-publica-exclusiva",
              ],
            }
          : {}),
        mesa: {
          id: "acesso-e-permanencia",
          nome: "Acesso e permanência escolar",
          camada: law.camada ?? camadaPorLei[law.id] ?? "lei",
        },
        controle: {
          variavel: law.variavel,
          unidade: "nivel",
          opcoes: choices.map((choice, index) => ({
            id: choice.id,
            rotulo: `${choice.rotulo} — ${choice.explicacao}`,
            valor: index + 1,
            efeitos: `${choice.explicacao} ${explicacoesVariaveis[law.variavel]}`,
            apoiam: law.grupos.apoiam,
            rejeitam: law.grupos.rejeitam,
          })),
        },
        implantacaoTurnos: { minimo: law.implantacao, maximo: law.implantacao },
        consequencias: lawConsequences,
      } satisfies PolicyFile;
    });
}

function consequenciasEducacao(rodada: number): ConsequenceFile[] {
  const laws = definicoes.filter((law) =>
    new Set<string>(
      CICLOS_EDUCACAO.slice(0, rodada).flatMap((cycle) => cycle.leis),
    ).has(law.id),
  );
  const edges: ConsequenceFile[] = [
    consequence(
      "educacao-demanda-vagas",
      "demanda_escolar",
      "acesso_escolar",
      -0.25,
      0,
      100,
    ),
    consequence(
      "educacao-vagas-acesso",
      "vagas_escolares",
      "acesso_escolar",
      0.4,
      0,
      0,
      "indice_0_100",
    ),
    consequence(
      "educacao-docentes-acesso",
      "docentes_disponiveis",
      "acesso_escolar",
      0.35,
      0,
      0,
      "indice_0_100",
    ),
    consequence(
      "educacao-barreira-acesso",
      "dificuldade_territorial",
      "acesso_escolar",
      -0.25,
      0,
      0,
      "indice_0_100",
    ),
    consequence(
      "educacao-acesso-frequencia",
      "acesso_escolar",
      "frequencia_escolar",
      0.45,
    ),
    consequence(
      "educacao-permanencia-frequencia",
      "permanencia_escolar",
      "frequencia_escolar",
      0.4,
    ),
    consequence(
      "educacao-frequencia-abandono",
      "frequencia_escolar",
      "abandono_escolar",
      -0.65,
      0,
      65,
    ),
    consequence(
      "educacao-frequencia-aprendizagem",
      "frequencia_escolar",
      "aprendizagem_escolar",
      0.45,
    ),
    consequence(
      "educacao-docentes-aprendizagem",
      "docentes_disponiveis",
      "aprendizagem_escolar",
      0.25,
    ),
    consequence(
      "educacao-info-aprendizagem",
      "informacao_educacional",
      "aprendizagem_escolar",
      0.15,
    ),
    consequence(
      "educacao-satisfacao-jovens",
      "satisfacao_base_pessoas",
      "grupo_jovens",
      1,
      0,
      0,
      "indice_0_100",
    ),
    consequence(
      "educacao-satisfacao-familias",
      "satisfacao_base_pessoas",
      "grupo_familias_com_filhos",
      1,
      0,
      0,
      "indice_0_100",
    ),
    consequence(
      "educacao-satisfacao-pobres",
      "satisfacao_base_pessoas",
      "grupo_pobres",
      1,
      0,
      0,
      "indice_0_100",
    ),
    consequence(
      "educacao-satisfacao-classe-media",
      "satisfacao_base_pessoas",
      "grupo_classe_media",
      1,
      0,
      0,
      "indice_0_100",
    ),
    consequence(
      "educacao-satisfacao-interior",
      "satisfacao_base_pessoas",
      "grupo_interior",
      1,
      0,
      0,
      "indice_0_100",
    ),
    consequence(
      "educacao-satisfacao-periferias",
      "satisfacao_base_pessoas",
      "grupo_periferias",
      1,
      0,
      0,
      "indice_0_100",
    ),
    consequence(
      "educacao-satisfacao-servidores",
      "satisfacao_base_pessoas",
      "grupo_servidores",
      1,
      0,
      0,
      "indice_0_100",
    ),
    consequence(
      "educacao-frequencia-grupo-jovens",
      "frequencia_escolar",
      "grupo_jovens",
      0.15,
    ),
    consequence(
      "educacao-frequencia-grupo-familias",
      "frequencia_escolar",
      "grupo_familias_com_filhos",
      0.18,
    ),
    consequence(
      "educacao-acesso-grupo-pobres",
      "acesso_escolar",
      "grupo_pobres",
      0.12,
    ),
    consequence(
      "educacao-acesso-grupo-interior",
      "acesso_escolar",
      "grupo_interior",
      0.15,
    ),
    consequence(
      "educacao-acesso-grupo-periferias",
      "acesso_escolar",
      "grupo_periferias",
      0.12,
    ),
    consequence(
      "educacao-aprendizagem-grupo-familias",
      "aprendizagem_escolar",
      "grupo_familias_com_filhos",
      0.12,
    ),
    consequence(
      "educacao-aprendizagem-grupo-servidores",
      "aprendizagem_escolar",
      "grupo_servidores",
      0.08,
    ),
  ];
  for (const law of laws) {
    const choices = alternativas[law.id];
    const targets = [
      ...new Set(choices.flatMap((choice) => Object.keys(choice.efeitos))),
    ];
    for (const target of targets) {
      const targetVariable = variaveisEducacao().find(
        (variable) => variable.id === target,
      )!;
      const outputPoints = [
        [0, 0],
        [1, choices[0].efeitos[target] ?? 0],
        [2, choices[1].efeitos[target] ?? 0],
        [3, choices[2].efeitos[target] ?? 0],
      ] as const;
      edges.push({
        id: `educacao-${law.id}-${target}`,
        tipo: "consequencia",
        versaoEsquema: 1,
        origem: law.variavel,
        alvo: target,
        mecanismo: "pontos",
        parametros: { pontos: outputPoints },
        unidade:
          targetVariable.tipo === "estoque"
            ? "indice_0_100_por_passo"
            : targetVariable.unidade,
        atrasoPassos: law.atraso,
        duracao: { modo: "continuo" },
      });
    }
  }
  return edges;
}

function atualizarPolitica(
  file: Record<string, unknown>,
  lawIds: readonly string[],
) {
  const root = file as {
    ministerios?: {
      areas?: Array<{ id: string; faz: string }>;
      ministerios?: Array<{ id: string; leis: string[] }>;
    };
  };
  const education = root.ministerios?.areas?.find(
    (item) => item.id === "educacao",
  );
  if (education)
    education.faz = "Ciclo C1 de acesso e permanência escolar em teste";
  const ministry = root.ministerios?.ministerios?.find(
    (item) => item.id === "educacao",
  );
  if (ministry) ministry.leis = [...lawIds];
}

export function montarPacoteEducacao(rodada: number): Record<string, object> {
  if (
    !Number.isInteger(rodada) ||
    rodada < 1 ||
    rodada > CICLOS_EDUCACAO.length
  )
    throw new Error("A rodada educacional deve ser um inteiro entre 1 e 5.");
  const leiIds = CICLOS_EDUCACAO.slice(0, rodada).flatMap(
    (cycle) => cycle.leis,
  );
  const errosDeSementes = validarSementesEducacao(leiIds);
  if (errosDeSementes.length > 0)
    throw new Error(
      `Sementes de programa inválidas:\n${errosDeSementes.join("\n")}`,
    );
  const errosDeContrapartes = validarParesExcludentes(contrapartesPesquisadas);
  if (errosDeContrapartes.length > 0)
    throw new Error(
      `Pares excludentes inválidos:\n${errosDeContrapartes.join("\n")}`,
    );
  const auditoria = auditoriaExcludentesEducacao(rodada);
  if (auditoria.some((pair) => !pair.regrasDeProvisaoIncompativeis))
    throw new Error(
      `Par excludente sem regras incompatíveis: ${JSON.stringify(auditoria)}`,
    );
  const files = montarBaseMinima();
  const variables = files[caminhos.variaveis] as VariablesFile;
  const policyCatalog = files[caminhos.catalogo] as PolicyCatalogFile;
  const world = files[caminhos.mundo] as WorldFile;
  const state = files[caminhos.estado] as InitialStateFile;
  const manifest = files[caminhos.pais] as ScenarioManifest;
  const politics = files[caminhos.politica] as Record<string, unknown>;
  const policies = leisDaRodada(rodada);
  const laws = policies.map((policy) => policy.id);
  const consequences = consequenciasEducacao(rodada);
  const educationVariables = variaveisEducacao();

  variables.variaveis.push(...educationVariables);
  policyCatalog.politicas.push(
    ...policies.map((policy) => `mundo/leis/${policy.id}.json`),
  );
  world.consequencias.push(
    ...consequences.map((item) => `mundo/consequencias/${item.id}.json`),
  );
  state.valores.demanda_escolar = 70;
  state.valores.vagas_escolares = 48;
  state.valores.docentes_disponiveis = 52;
  state.valores.dificuldade_territorial = 45;
  state.valores.satisfacao_base_pessoas = 50;
  for (const law of policies) {
    const control = law.controle.variavel;
    const initialOptionId = situacoesIniciais[law.id];
    const initialValue = law.controle.opcoes?.find(
      (option) => option.id === initialOptionId,
    )?.valor;
    if (initialValue === undefined)
      throw new Error(
        `Situação inicial sem opção válida para a lei ${law.id}.`,
      );
    if (law.id === "provisao-publica-exclusiva") {
      state.valores[control] = 0;
      continue;
    }
    state.valores[control] = initialValue;
    state.leisVigentes = [
      ...(state.leisVigentes ?? []),
      { lei: law.id, opcao: initialOptionId },
    ];
  }

  const segmentos = pessoas;
  manifest.aprovacaoPorPerfis = {
    alvo: "popularidade_governo",
    k: 12,
    pesos: Object.fromEntries(segmentos.map((segment) => [segment, 1])),
    perfis: [
      {
        peso: 0.25,
        segmentos: [
          "grupo_jovens",
          "grupo_familias_com_filhos",
          "grupo_pobres",
          "grupo_periferias",
        ],
      },
      {
        peso: 0.25,
        segmentos: [
          "grupo_jovens",
          "grupo_familias_com_filhos",
          "grupo_pobres",
          "grupo_interior",
        ],
      },
      {
        peso: 0.25,
        segmentos: [
          "grupo_jovens",
          "grupo_familias_com_filhos",
          "grupo_classe_media",
          "grupo_periferias",
        ],
      },
      {
        peso: 0.25,
        segmentos: ["grupo_jovens", "grupo_classe_media", "grupo_interior"],
      },
    ],
    eixos: [
      {
        id: "familia",
        nome: "Famílias e jovens",
        segmentos: ["grupo_jovens", "grupo_familias_com_filhos"],
      },
      {
        id: "renda",
        nome: "Renda",
        segmentos: ["grupo_pobres", "grupo_classe_media"],
      },
      {
        id: "territorio",
        nome: "Território",
        segmentos: ["grupo_interior", "grupo_periferias"],
      },
      { id: "ocupacao", nome: "Ocupação", segmentos: ["grupo_servidores"] },
    ],
  };
  atualizarPolitica(politics, laws);

  const result: Record<string, object> = {
    ...files,
    [caminhos.variaveis]: variables,
    [caminhos.catalogo]: policyCatalog,
    [caminhos.mundo]: world,
    [caminhos.estado]: state,
    [caminhos.pais]: manifest,
    [caminhos.politica]: politics,
  };
  for (const policy of policies)
    result[`mundo/leis/${policy.id}.json`] = policy;
  for (const item of consequences)
    result[`mundo/consequencias/${item.id}.json`] = item;
  return result;
}

export const CAMINHO_CENARIO_EDUCACAO = CAMINHO_CENARIO_BASE;
export const CENARIO_ILHA_EDUCACAO = BASE_MINIMA.pais.nome;
