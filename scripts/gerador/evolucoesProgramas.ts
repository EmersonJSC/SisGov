/** Pacotes de programas para as rodadas evolutivas 6–10 do mesmo C1. */
export type EvolucaoDePrograma = Readonly<{
  numero: number;
  titulo: string;
  problema: string;
  programas: readonly string[];
  opcoes: Readonly<Record<string, string>>;
  evolucao: string;
}>;

export const evolucoesProgramas: readonly EvolucaoDePrograma[] = [
  {
    numero: 6,
    titulo: "Pacote integrado de acesso territorial",
    problema: "Vagas e serviços não chegam igualmente a todos os territórios.",
    programas: ["fundeb", "pnate", "pnae"],
    opcoes: {
      "piso-educacao": "novas-vagas",
      "transporte-escolar": "ampliar-rotas",
      "alimentacao-escolar": "cobertura-alimentar",
    },
    evolucao:
      "Agrupa expansão de capacidade com transporte e alimentação para testar se o pacote supera barreiras de acesso melhor que medidas isoladas.",
  },
  {
    numero: 7,
    titulo: "Pacote integrado de permanência",
    problema:
      "Matrícula sem apoio material e jornada adequada não garante frequência e conclusão.",
    programas: ["pe-de-meia", "escola-em-tempo-integral", "pnae"],
    opcoes: {
      "bolsa-de-permanencia-no-ensino-medio": "foco-conclusao",
      "escola-em-tempo-integral": "jornada-completa",
      "alimentacao-escolar": "qualidade-nutricional",
    },
    evolucao:
      "Combina transferência, jornada ampliada e alimentação e observa efeitos conjuntos por renda e perfil familiar.",
  },
  {
    numero: 8,
    titulo: "Pacote integrado de aprendizagem",
    problema:
      "A frequência precisa se converter em aprendizagem com capacidade docente e diagnóstico.",
    programas: ["valorizacao-do-magisterio", "crianca-alfabetizada", "saeb"],
    opcoes: {
      "piso-salarial-professores": "reter-professores",
      "alfabetizacao-na-idade-certa": "recomposicao-aprendizagem",
      "avaliacao-das-escolas": "devolutiva-por-escola",
    },
    evolucao:
      "Liga capacidade de profissionais, alfabetização e informação; mantém a hipótese de que avaliar sozinho não produz aprendizagem.",
  },
  {
    numero: 9,
    titulo: "Pacote integrado de equidade territorial",
    problema:
      "Uma média nacional pode esconder barreiras rurais e de baixa renda.",
    programas: ["fundeb", "pnate", "pnae", "pe-de-meia"],
    opcoes: {
      "transporte-escolar": "regularidade-rotas",
      "alimentacao-escolar": "compras-locais",
      "financiamento-com-resultado": "premiar-equidade",
      "bolsa-de-permanencia-no-ensino-medio": "foco-conclusao",
    },
    evolucao:
      "Direciona apoio a estudantes e territórios com maiores obstáculos e compara ganhos agregados com resultados dos grupos afetados.",
  },
  {
    numero: 10,
    titulo: "Ciclo de informação e realimentação",
    problema: "Dados só ajudam quando orientam apoio e uma decisão posterior.",
    programas: ["saeb", "crianca-alfabetizada", "fundeb"],
    opcoes: {
      "avaliacao-das-escolas": "devolutiva-por-escola",
      "alfabetizacao-na-idade-certa": "formacao-docente",
      "financiamento-com-resultado": "premiar-aprendizagem",
    },
    evolucao:
      "Fecha o laço entre avaliação, intervenção pedagógica e financiamento; compara informação sem resposta com informação usada na alocação de apoio.",
  },
];
