import { calculateContribution } from "../../engine";
import { efficacyNodeId } from "../../engine/model/lawNodes";
import type { Partida, VisaoLinhaOrcamento } from "./tipos";

const LINHAS_COMPARTILHADAS: Readonly<
  Record<string, { id: string; nome: string; conta: string; leis: string[] }>
> = {
  "quantidade-de-servidores": {
    id: "servidores",
    nome: "Salário dos servidores",
    conta: "quantidade de servidores × salário anual médio",
    leis: [
      "quantidade-de-servidores",
      "salario-dos-servidores",
      "estabilidade-dos-servidores-publicos",
    ],
  },
  "sistema-previdenciario": {
    id: "aposentadorias",
    nome: "Aposentadorias",
    conta: "aposentados × benefício anual médio",
    leis: [
      "sistema-previdenciario",
      "idade-minima-aposentadoria",
      "reajuste-de-beneficios",
      "previdencia-rural",
    ],
  },
  "previdencia-rural": {
    id: "aposentadorias",
    nome: "Aposentadorias",
    conta: "aposentados × benefício anual médio",
    leis: [
      "sistema-previdenciario",
      "idade-minima-aposentadoria",
      "reajuste-de-beneficios",
      "previdencia-rural",
    ],
  },
  "pensao-por-morte": {
    id: "pensoes",
    nome: "Pensões por morte",
    conta: "pensionistas × benefício anual médio",
    leis: ["pensao-por-morte"],
  },
  "protecao-social-dos-militares": {
    id: "militares_inativos",
    nome: "Militares inativos e pensões militares",
    conta: "inativos e pensionistas × benefício anual médio",
    leis: ["protecao-social-dos-militares"],
  },
  "seguro-desemprego": {
    id: "seguro_desemprego",
    nome: "Seguro-desemprego",
    conta: "desempregados formais cobertos × benefício anual médio",
    leis: ["seguro-desemprego"],
  },
  "renda-para-idosos-e-pessoas-com-deficiencia-pobres": {
    id: "renda_idosos",
    nome: "Renda de idosos e pessoas com deficiência pobres",
    conta: "beneficiários × benefício anual médio",
    leis: ["renda-para-idosos-e-pessoas-com-deficiencia-pobres"],
  },
};

/** Linhas do orçamento calculadas das mesmas relações usadas pelo motor. */
export function linhasDoOrcamento(
  partida: Partida,
  values: Readonly<Record<string, number>>,
): VisaoLinhaOrcamento[] {
  const { content, graph, game } = partida;
  const pib =
    values.pib_nominal ?? content.initialState.economia?.pibAnual ?? 0;
  const leis = new Map(content.policies.map((policy) => [policy.id, policy]));
  const leiPorControle = new Map(
    content.policies.map((policy) => [policy.controle.variavel, policy.id]),
  );
  const vigentes = new Set(
    game.policies
      .filter((state) => state.status === "vigente")
      .map((state) => state.policyDefinitionId),
  );
  const linhas = new Map<string, VisaoLinhaOrcamento>();
  const acrescentar = (linha: VisaoLinhaOrcamento) => {
    const chave = `${linha.lado}:${linha.id}`;
    const anterior = linhas.get(chave);
    linhas.set(chave, {
      ...linha,
      valor: (anterior?.valor ?? 0) + linha.valor,
    });
  };
  for (const variable of content.variables.variaveis) {
    if (variable.tipo !== "derivado" || !variable.id.startsWith("arrecadacao_"))
      continue;
    const controle = variable.formula?.termos
      .flatMap((term) => term.fatores)
      .find((factor) => leiPorControle.has(factor.var))?.var;
    const leiId = controle ? leiPorControle.get(controle) : undefined;
    if (!leiId || !vigentes.has(leiId)) continue;
    acrescentar({
      id: variable.id,
      nome: variable.nome.replace(/^Arrecadação: /, ""),
      lado: "receita",
      valor: values[variable.id] ?? 0,
      conta: "alíquota × base econômica",
      leis: [leiId],
    });
  }
  for (const relation of graph.relations) {
    const lado =
      relation.targetId === "gasto_publico"
        ? "gasto"
        : relation.targetId === "arrecadacao"
          ? "receita"
          : undefined;
    if (!lado || relation.sourceType !== "lei") continue;
    if (!vigentes.has(relation.sourceId)) continue;
    const policy = leis.get(relation.sourceId);
    if (!policy) continue;
    const origem = values[relation.originId];
    if (origem === undefined) continue;
    const nivel = relation.readsLevel
      ? origem
      : origem * (values[efficacyNodeId(relation.sourceId)] ?? 1);
    const calculated = calculateContribution(
      relation,
      nivel,
      (id) => values[id],
    );
    if (!calculated.ok) continue;
    const valor = (calculated.value.value * pib) / 100;
    if (Math.abs(valor) < 0.001) continue;
    const comum =
      lado === "gasto" ? LINHAS_COMPARTILHADAS[policy.id] : undefined;
    acrescentar({
      id: comum?.id ?? policy.id,
      nome: comum?.nome ?? policy.nome,
      lado,
      valor,
      conta: comum?.conta ?? "valor da lei e fatores econômicos ligados a ela",
      leis: comum?.leis ?? [policy.id],
    });
  }
  acrescentar({
    id: "juros_divida",
    nome:
      values.juros_da_divida < 0 ? "Rendimento do cofre" : "Juros da dívida",
    lado: "juros",
    valor: ((values.juros_da_divida ?? 0) * pib) / 100,
    conta: "dívida × juro médio",
    leis: ["taxa-basica-de-juros", "quem-controla-o-banco-central"],
  });
  return [...linhas.values()].sort(
    (a, b) => Math.abs(b.valor) - Math.abs(a.valor),
  );
}
