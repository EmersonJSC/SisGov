// Índices essenciais: sem eles um Estado não funciona. São do motor; os de
// jogabilidade ficam no JSON do mundo. Unidade de cada um em
// src/conteudo/mundo/indicadores/variaveis.json.
export const INDICES_ESSENCIAIS = [
  "populacao",
  "ocupados",
  "desemprego",
  "pib",
  "crescimento_real",
  "indice_precos",
  "inflacao",
  "pib_nominal",
  "arrecadacao",
  "gasto_publico",
  "resultado_fiscal",
  "divida_publica",
  "taxa_juros",
] as const;

export type IdIndiceEssencial = (typeof INDICES_ESSENCIAIS)[number];

export type IndicesEssenciais = Record<IdIndiceEssencial, number>;
