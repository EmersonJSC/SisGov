import {
  calculateContribution,
  type GraphRelation,
  type ResolvedPackage,
} from "../../engine";
import { efficacyNodeId } from "../../engine/model/lawNodes";
import type {
  Partida,
  Contas,
  VisaoContas,
  VisaoMotivo,
  VisaoGrupo,
} from "./tipos";

/** Os nós do orçamento na rede (SG157, D-47): são bolhas como as outras. */
export const BOLHAS_DO_ORCAMENTO = {
  receita: "arrecadacao",
  gasto: "gasto_publico",
  juros: "juros_da_divida",
  resultado: "resultado_fiscal",
  divida: "divida_publica",
} as const;

/** PIB anual na moeda do país: o nó `pib_nominal` ou o declarado pelo país. */
function pibNominal(
  content: ResolvedPackage,
  values: Readonly<Record<string, number>>,
): number {
  return values.pib_nominal ?? content.initialState.economia?.pibAnual ?? 0;
}

export function lerContas(
  content: ResolvedPackage,
  values: Readonly<Record<string, number>>,
): VisaoContas {
  const pib = pibNominal(content, values);
  const ids = Object.entries(BOLHAS_DO_ORCAMENTO) as [
    keyof typeof BOLHAS_DO_ORCAMENTO,
    string,
  ][];
  const lidas = Object.fromEntries(
    ids.map(([conta, id]) => [conta, values[id] ?? 0]),
  ) as Record<keyof typeof BOLHAS_DO_ORCAMENTO, number>;
  const percentualPib: Contas = {
    ...lidas,
    divida: Math.max(0, lidas.divida),
    cofre: Math.max(0, -lidas.divida),
  };
  const emMoeda = Object.fromEntries(
    Object.entries(percentualPib).map(([conta, v]) => [conta, (v * pib) / 100]),
  ) as Contas;
  return { ...emMoeda, pib, percentualPib };
}

/**
 * Quanto cada lei arrecada (+) ou custa (−) por ano: a soma das setas dela
 * para a receita e para o gasto, com os valores de agora. `saldo(lei, nivel)`
 * responde para qualquer nível (o de cada opção, por exemplo).
 */
export function saldoDasLeis(
  partida: Partida,
  values: Readonly<Record<string, number>>,
): (leiId: string, nivel?: number) => number {
  const { content, graph } = partida;
  const pib = pibNominal(content, values);
  const lawByControl = new Map(
    content.policies.map((policy) => [policy.controle.variavel, policy.id]),
  );
  const delivered = (id: string) => {
    const law = lawByControl.get(id);
    return law === undefined
      ? values[id]
      : (values[id] ?? 0) * (values[efficacyNodeId(law)] ?? 1);
  };
  const porLei = new Map<
    string,
    { relation: GraphRelation; sinal: 1 | -1 }[]
  >();
  for (const relation of graph.relations) {
    const sinal =
      relation.targetId === BOLHAS_DO_ORCAMENTO.receita
        ? 1
        : relation.targetId === BOLHAS_DO_ORCAMENTO.gasto
          ? -1
          : 0;
    if (sinal === 0 || relation.sourceType !== "lei") continue;
    porLei.set(relation.sourceId, [
      ...(porLei.get(relation.sourceId) ?? []),
      { relation, sinal },
    ]);
  }
  return (leiId, nivel) => {
    let saldo = 0;
    for (const { relation, sinal } of porLei.get(leiId) ?? []) {
      const law = lawByControl.get(relation.originId);
      const level = nivel ?? values[relation.originId];
      const origem =
        nivel === undefined && !relation.readsLevel
          ? delivered(relation.originId)
          : relation.readsLevel || law === undefined
            ? level
            : level * (values[efficacyNodeId(law)] ?? 1);
      if (origem === undefined) continue;
      const contribution = calculateContribution(relation, origem, delivered);
      if (contribution.ok)
        saldo += (sinal * contribution.value.value * pib) / 100;
    }
    return saldo;
  };
}

/**
 * Situação na régua da tela: o motor guarda só o quanto ela passou do ponto
 * de surgimento; a tela mostra a soma inteira, para o jogador ver quando ela
 * está chegando perto de surgir (ex.: juros em 26% da receita, surge em 32%).
 */
/** Aprovação do governo: a média dos grupos pelos pesos (SG143). */
const APROVACAO = "popularidade_governo";

/** Por que cada grupo está como está: as setas que chegam nele, agora. */
export function gruposDaPartida(
  partida: Partida,
  values: Readonly<Record<string, number>>,
  /** Leis mudadas pelo jogador: num empate, o motivo dele vem primeiro (D-58). */
  doJogador: ReadonlySet<string>,
): VisaoGrupo[] {
  const { content, graph } = partida;
  const lawByControl = new Map(
    content.policies.map((policy) => [policy.controle.variavel, policy]),
  );
  const delivered = (id: string) => {
    const law = lawByControl.get(id);
    if (law === undefined) return values[id];
    const ceiling = graph.nodesById[id]?.dominio.maximo;
    const effect = (values[id] ?? 0) * (values[efficacyNodeId(law.id)] ?? 1);
    return ceiling !== undefined ? Math.min(effect, ceiling) : effect;
  };
  const peso = new Map(
    graph.relations
      .filter((r) => r.targetId === APROVACAO)
      .map((r) => [r.originId, r.parameters.coeficiente ?? 0]),
  );
  // Muitas leis batem no teto da oscilação (±10): em meio ponto de
  // diferença, a lei que o jogador mudou vem antes das outras.
  const degrau = (m: VisaoMotivo) => Math.round(Math.abs(m.pontos) * 2);
  const maiores = (lista: VisaoMotivo[]) =>
    lista
      .sort(
        (a, b) =>
          degrau(b) - degrau(a) ||
          Number(doJogador.has(b.id)) - Number(doJogador.has(a.id)) ||
          Math.abs(b.pontos) - Math.abs(a.pontos),
      )
      .slice(0, 5);
  return content.variables.variaveis
    .filter((variable) => variable.tipo === "grupo")
    .map((variable): VisaoGrupo => {
      const motivos: VisaoMotivo[] = [];
      for (const relation of graph.relations) {
        if (relation.targetId !== variable.id) continue;
        if (relation.originId.startsWith("contexto:")) continue;
        const origem = relation.readsLevel
          ? values[relation.originId]
          : delivered(relation.originId);
        if (origem === undefined) continue;
        const c = calculateContribution(relation, origem, delivered);
        if (!c.ok || Math.abs(c.value.value) < 0.05) continue;
        const lei = lawByControl.get(relation.originId);
        motivos.push({
          id: lei?.id ?? relation.originId,
          nome: lei?.nome ?? graph.nodesById[relation.originId]?.nome ?? "",
          tipo: lei ? "lei" : "bolha",
          pontos: c.value.value,
        });
      }
      return {
        id: variable.id,
        nome: variable.nome,
        satisfacao: values[variable.id] ?? 0,
        peso: peso.get(variable.id) ?? 0,
        gosta: maiores(motivos.filter((m) => m.pontos > 0)),
        odeia: maiores(motivos.filter((m) => m.pontos < 0)),
      };
    })
    .sort((a, b) => b.satisfacao - a.satisfacao);
}

export function brutoDasSituacoes(
  partida: Partida,
  values: Readonly<Record<string, number>>,
): (id: string, surgimento: number) => number {
  const { content, graph } = partida;
  const lawByControl = new Map(
    content.policies.map((policy) => [policy.controle.variavel, policy.id]),
  );
  const delivered = (id: string) => {
    const law = lawByControl.get(id);
    if (law === undefined) return values[id];
    const ceiling = graph.nodesById[id]?.dominio.maximo;
    const effect = (values[id] ?? 0) * (values[efficacyNodeId(law)] ?? 1);
    return ceiling !== undefined ? Math.min(effect, ceiling) : effect;
  };
  return (id, surgimento) => {
    const now = values[id] ?? 0;
    if (now > 0) return now + surgimento;
    let soma = 0;
    for (const relation of graph.relations) {
      // aproximação: as setas com atraso entram com os valores de agora
      if (relation.targetId !== id) continue;
      const origem = relation.readsLevel
        ? values[relation.originId]
        : delivered(relation.originId);
      if (origem === undefined) continue;
      const c = calculateContribution(relation, origem, delivered);
      if (c.ok) soma += c.value.value;
    }
    return Math.min(surgimento, Math.max(0, soma));
  };
}
