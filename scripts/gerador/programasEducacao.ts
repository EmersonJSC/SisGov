/**
 * Seeds documentais do ecossistema C1. Cada seed parte de uma política ou
 * programa público verificável; leis, grupos e mecanismos não são sorteados.
 * Novas sementes podem ser acrescentadas quando a pesquisa trouxer evidência.
 */
export type ProgramaSemente = Readonly<{
  id: string;
  nome: string;
  problema: string;
  descricao: string;
  fonte: string;
  leis: readonly string[];
  gruposAfetados: readonly string[];
  problemaEquivalente?: string;
}>;

export const programasEducacao: readonly ProgramaSemente[] = [
  {
    id: "direito-a-educacao",
    nome: "Direito à educação básica",
    problema: "Acesso e garantia da escolaridade obrigatória.",
    descricao:
      "A Constituição define a educação básica obrigatória e deveres do Estado e da família; o protótipo explora formas de executar esse dever.",
    fonte:
      "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
    leis: ["ensino-obrigatorio"],
    gruposAfetados: ["grupo_jovens", "grupo_familias_com_filhos"],
  },
  {
    id: "fundeb",
    nome: "Fundeb",
    problema: "Financiamento e redistribuição de recursos da educação básica.",
    descricao:
      "Fundo de financiamento da educação básica pública e valorização dos profissionais da educação.",
    fonte:
      "https://www.gov.br/fnde/pt-br/acesso-a-informacao/acoes-e-programas/financiamento/fundeb/fundeb-home",
    leis: ["piso-educacao", "financiamento-com-resultado"],
    gruposAfetados: [
      "grupo_familias_com_filhos",
      "grupo_pobres",
      "grupo_servidores",
      "grupo_interior",
    ],
  },
  {
    id: "escolha-escolar-suecia",
    nome: "Escolha entre escolas municipais e independentes",
    problema: "Financiamento e provisão da educação básica.",
    descricao:
      "Na Suécia, famílias podem escolher escolas municipais ou independentes; escolas independentes recebem financiamento público por estudante. O piloto usa o modelo como alternativa sistêmica de organização da oferta.",
    fonte:
      "https://www.skolverket.se/styrning-och-ansvar/regler-och-ansvar/ansvar-i-skolfragor/valja-forskoleklass-och-grundskola-eller-anpassad-grundskola",
    leis: ["escolha-escolar-financiada"],
    gruposAfetados: [
      "grupo_familias_com_filhos",
      "grupo_classe_media",
      "grupo_interior",
    ],
    problemaEquivalente: "regime-de-provisao-escolar",
  },
  {
    id: "nacionalizacao-ensino-cuba",
    nome: "Nacionalização geral e gratuita do ensino",
    problema: "Quem pode prover a educação escolar.",
    descricao:
      "A lei cubana de 1961 atribuiu o ensino ao Estado e nacionalizou centros privados, com exceções e indenizações previstas. É candidata pesquisada; ainda não gera uma lei jogável.",
    fonte:
      "https://siteal.iiep.unesco.org/sites/default/files/sit_accion_files/ley_de_nacionalizacion_de_la_educacion.pdf",
    leis: ["provisao-publica-exclusiva"],
    gruposAfetados: ["grupo_jovens", "grupo_familias_com_filhos"],
    problemaEquivalente: "regime-de-provisao-escolar",
  },
  {
    id: "pe-de-meia",
    nome: "Pé-de-Meia",
    problema: "Permanência e conclusão do ensino médio público.",
    descricao:
      "Incentivo financeiro-educacional voltado a estudantes do ensino médio público inscritos no CadÚnico, conforme os critérios oficiais.",
    fonte: "https://www.gov.br/mec/pt-br/pe-de-meia",
    leis: ["bolsa-de-permanencia-no-ensino-medio"],
    gruposAfetados: [
      "grupo_jovens",
      "grupo_pobres",
      "grupo_familias_com_filhos",
    ],
  },
  {
    id: "escola-em-tempo-integral",
    nome: "Programa Escola em Tempo Integral",
    problema: "Ampliação de matrículas com jornada escolar integral.",
    descricao:
      "Fomento federal a matrículas em tempo integral por adesão e pactuação com as redes de ensino.",
    fonte:
      "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14640.htm",
    leis: ["escola-em-tempo-integral"],
    gruposAfetados: [
      "grupo_jovens",
      "grupo_familias_com_filhos",
      "grupo_pobres",
    ],
  },
  {
    id: "valorizacao-do-magisterio",
    nome: "Piso nacional do magistério",
    problema:
      "Remuneração mínima nacional dos profissionais do magistério público.",
    descricao:
      "A legislação federal estabelece o piso salarial profissional nacional do magistério público da educação básica.",
    fonte:
      "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/lei/l11738.htm",
    leis: ["piso-salarial-professores"],
    gruposAfetados: [
      "grupo_servidores",
      "grupo_familias_com_filhos",
      "grupo_interior",
    ],
  },
  {
    id: "crianca-alfabetizada",
    nome: "Compromisso Nacional Criança Alfabetizada",
    problema: "Alfabetização e recomposição das aprendizagens.",
    descricao:
      "Regime de colaboração para garantir alfabetização e apoiar a recomposição das aprendizagens.",
    fonte:
      "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/decreto/d11556.htm",
    leis: ["alfabetizacao-na-idade-certa"],
    gruposAfetados: [
      "grupo_jovens",
      "grupo_familias_com_filhos",
      "grupo_pobres",
    ],
  },
  {
    id: "pnate",
    nome: "Programa Nacional de Apoio ao Transporte Escolar",
    problema: "Acesso de estudantes rurais à escola.",
    descricao:
      "Assistência financeira suplementar para apoiar o transporte de estudantes da educação básica pública residentes em áreas rurais.",
    fonte:
      "https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2004/lei/l10.880.htm",
    leis: ["transporte-escolar"],
    gruposAfetados: [
      "grupo_interior",
      "grupo_familias_com_filhos",
      "grupo_pobres",
    ],
  },
  {
    id: "pnae",
    nome: "Programa Nacional de Alimentação Escolar",
    problema:
      "Alimentação escolar e condições de aprendizagem durante o período letivo.",
    descricao:
      "Repasse suplementar para oferta de alimentação escolar e ações de educação alimentar e nutricional.",
    fonte:
      "https://www.gov.br/fnde/pt-br/acesso-a-informacao/acoes-e-programas/programas/pnae",
    leis: ["alimentacao-escolar"],
    gruposAfetados: [
      "grupo_jovens",
      "grupo_pobres",
      "grupo_familias_com_filhos",
    ],
  },
  {
    id: "saeb",
    nome: "Sistema de Avaliação da Educação Básica",
    problema:
      "Produção de informação para diagnosticar aprendizagem e orientar políticas.",
    descricao:
      "Avaliações e questionários em larga escala que apoiam diagnóstico, monitoramento e aprimoramento de políticas educacionais.",
    fonte:
      "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/saeb",
    leis: ["avaliacao-das-escolas"],
    gruposAfetados: [
      "grupo_jovens",
      "grupo_familias_com_filhos",
      "grupo_interior",
      "grupo_periferias",
    ],
  },
];

export function programasParaLeis(leiIds: readonly string[]) {
  const ids = new Set(leiIds);
  return programasEducacao.filter((programa) =>
    programa.leis.some((lei) => ids.has(lei)),
  );
}

export function validarSementesEducacao(leiIds: readonly string[]): string[] {
  const erros: string[] = [];
  const cobertas = new Set(
    programasEducacao.flatMap((programa) => programa.leis),
  );
  for (const lei of leiIds)
    if (!cobertas.has(lei)) erros.push(`Lei sem programa-semente: ${lei}`);
  for (const programa of programasEducacao) {
    if (!/^https:\/\//.test(programa.fonte))
      erros.push(`Programa sem fonte verificável: ${programa.id}`);
    if (programa.leis.length === 0 || programa.gruposAfetados.length === 0)
      erros.push(`Programa incompleto: ${programa.id}`);
  }
  return erros;
}
