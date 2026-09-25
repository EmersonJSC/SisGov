import type { ScenarioDefinition } from '../types/scenario'

/**
 * Conteúdo inicial do mapa. Os valores serão definidos com fontes e data de
 * referência em uma etapa posterior; esta fase escolhe apenas o recorte.
 */
export const brazilPresidency: ScenarioDefinition = {
  id: 'brasil-presidencia-inicial',
  title: 'Brasil',
  summary: 'Mapa nacional para uma presidência brasileira.',
  indicators: [
    {
      id: 'renda_e_emprego',
      name: 'Renda e emprego',
      icon: '↗',
      unit: 'indice',
      description: 'Condições de renda, trabalho e acesso a oportunidades no país.',
      rationale: 'É uma dimensão central para observar os efeitos econômicos das políticas.',
      initialValue: null,
      visualWeight: 0.95,
    },
    {
      id: 'saude_publica',
      name: 'Saúde pública',
      icon: '+',
      unit: 'indice',
      description: 'Condições de acesso e qualidade da saúde pública no recorte do jogo.',
      rationale: 'Permite acompanhar resultados sociais para além de recursos financeiros.',
      initialValue: null,
      visualWeight: 0.82,
    },
    {
      id: 'educacao_basica',
      name: 'Educação básica',
      icon: '✦',
      unit: 'indice',
      description: 'Condições de aprendizagem e acesso à educação básica.',
      rationale: 'Representa uma consequência de longo prazo de escolhas nacionais.',
      initialValue: null,
      visualWeight: 0.72,
    },
    {
      id: 'desigualdade_social',
      name: 'Desigualdade social',
      icon: '≠',
      unit: 'indice',
      description: 'Distância entre grupos no acesso à renda, direitos e oportunidades.',
      rationale: 'Evita que a evolução do país seja reduzida a uma única medida econômica.',
      initialValue: null,
      visualWeight: 0.88,
    },
  ],
}
