import type { ValidationResult } from "../diagnostics/contentDiagnostic";
import type { GraphRelation, ScenarioGraph } from "../graph/buildGraph";
import { calculateContribution } from "../mechanisms/calculateContribution";
import { updateStock, type StockRate } from "../mechanisms/updateStock";
import { efficacyNodeId, isLawNode, lawNodeBase } from "../model/lawNodes";
import type { ResolvedPackage } from "../model/resolvePackage";

export type ContributionExplanation = Readonly<{
  relationId: string;
  policyOrEventId: string;
  consequenceId: string;
  originId: string;
  targetId: string;
  sourceValue: number;
  /** Mecanismo e parâmetros usados: a explicação diz como o valor foi obtido. */
  mechanism: GraphRelation["mechanism"];
  parameters: GraphRelation["parameters"];
  /** Entrada do mecanismo (a razão, quando há normalização). */
  inputValue: number;
  divisorId?: string;
  divisorValue?: number;
  /** Produto entre nós (D-50): a origem foi multiplicada por este nó. */
  factorId?: string;
  factorValue?: number;
  /** Custo que reage (D-52): o resultado foi multiplicado por este nó. */
  scaleId?: string;
  scaleValue?: number;
  /** A origem foi lida do mês anterior (lei lendo bolha, ou elo de ciclo). */
  readsPreviousMonth?: boolean;
  contribution: number;
}>;

export type TargetExplanation = Readonly<{
  targetId: string;
  previousValue: number;
  /** Neutro estrutural: 0 para bolhas; 1 para eficácia de lei (D-41). */
  baseValue: number;
  contributions: readonly ContributionExplanation[];
  /** Soma antes do surgimento (situação) e dos limites do domínio. */
  rawValue: number;
  /**
   * Para onde a bolha vai (soma depois do surgimento e dos limites). Com
   * resposta menor que 1 (D-54), o resultado anda só parte do caminho.
   */
  targetValue: number;
  /** O resultado bateu no limite do domínio. */
  limited: boolean;
  result: number;
}>;

export type NetworkResult = Readonly<{
  values: Record<string, number>;
  explanations: readonly TargetExplanation[];
  /** Intensidade de cada nó (D-43): lei pelo efeito, bolha pelo valor. */
  intensities: Readonly<Record<string, number>>;
}>;

function failure(field: string, message: string): ValidationResult<never> {
  return {
    ok: false,
    diagnostics: [
      { code: "CALCULO_INVALIDO", file: "$execucao", field, message },
    ],
  };
}

function clamp(
  value: number,
  minimum: number | undefined,
  maximum: number | undefined,
): number {
  let result = value;
  if (minimum !== undefined && result < minimum) result = minimum;
  if (maximum !== undefined && result > maximum) result = maximum;
  return result;
}

/** Bolha calculada: índice ou situação (sem valor próprio, D-41). */
const isCalculatedBubble = (graph: ScenarioGraph, id: string) => {
  const node = graph.nodesById[id];
  return (
    node !== undefined &&
    !isLawNode(id) &&
    (node.tipo === "calculado" || node.tipo === "situacao")
  );
};

const orderCache = new WeakMap<ScenarioGraph, readonly string[]>();

/** Componente fortemente conexa de cada nó (Tarjan); `inputs` = quem envia. */
function stronglyConnected(
  nodes: readonly string[],
  inputs: ReadonlyMap<string, ReadonlySet<string>>,
): Map<string, number> {
  const index = new Map<string, number>();
  const low = new Map<string, number>();
  const component = new Map<string, number>();
  const stack: string[] = [];
  const onStack = new Set<string>();
  let counter = 0;
  let components = 0;
  const visit = (node: string) => {
    index.set(node, counter);
    low.set(node, counter);
    counter += 1;
    stack.push(node);
    onStack.add(node);
    for (const next of inputs.get(node) ?? []) {
      if (!index.has(next)) {
        visit(next);
        low.set(node, Math.min(low.get(node)!, low.get(next)!));
      } else if (onStack.has(next))
        low.set(node, Math.min(low.get(node)!, index.get(next)!));
    }
    if (low.get(node) === index.get(node)) {
      let member: string;
      do {
        member = stack.pop()!;
        onStack.delete(member);
        component.set(member, components);
      } while (member !== node);
      components += 1;
    }
  };
  for (const node of nodes) if (!index.has(node)) visit(node);
  return component;
}

/**
 * Ordem determinística das bolhas no mês: quem recebe depois de quem envia.
 * Num ciclo só entre bolhas, a de menor ID entra primeiro e lê o mês anterior
 * no elo que fecha o ciclo (D-42).
 */
export function calculatedBubbleOrder(graph: ScenarioGraph): readonly string[] {
  const cached = orderCache.get(graph);
  if (cached) return cached;
  const bubbles = Object.keys(graph.nodesById)
    .filter((id) => isCalculatedBubble(graph, id))
    .sort((left, right) => left.localeCompare(right));
  const pending = new Map(bubbles.map((id) => [id, new Set<string>()]));
  for (const relation of graph.relations) {
    if (relation.delaySteps > 0 || !pending.has(relation.targetId)) continue;
    // A origem e os nós da normalização (divisor, fator) entram antes.
    const reads = [
      relation.originId,
      relation.normalization?.divisor,
      relation.normalization?.fator,
      relation.scale?.fator,
    ];
    for (const id of reads)
      if (id !== undefined && id !== relation.targetId && pending.has(id))
        pending.get(relation.targetId)!.add(id);
  }
  const component = stronglyConnected(bubbles, pending);
  const order: string[] = [];
  const done = new Set<string>();
  while (order.length < bubbles.length) {
    const ready = bubbles.find(
      (id) =>
        !done.has(id) &&
        [...pending.get(id)!].every((origin) => done.has(origin)),
    );
    // Sem ninguém pronto, há ciclo: entra a bolha de menor ID de um ciclo
    // cujas entradas de fora já foram calculadas. Quem só depende do ciclo
    // (sem fazer parte dele) espera o ciclo, não lê o mês anterior.
    const next =
      ready ??
      bubbles.find(
        (id) =>
          !done.has(id) &&
          [...pending.get(id)!].every(
            (origin) =>
              done.has(origin) || component.get(origin) === component.get(id),
          ),
      )!;
    order.push(next);
    done.add(next);
  }
  orderCache.set(graph, order);
  return order;
}

export type NetworkInput = Readonly<{
  content: ResolvedPackage;
  graph: ScenarioGraph;
  /** Estado do mês anterior (completo). */
  previous: Readonly<Record<string, number>>;
  /** Controles (níveis das leis) já aplicados para este mês. */
  controls: Readonly<Record<string, number>>;
  activeRelations: readonly GraphRelation[];
  /** Retrato de n meses atrás, para relações com atraso. */
  readDelayed: (stepsAgo: number) => Readonly<Record<string, number>>;
  duration: number;
  /** false no turno 0: estoques ficam no valor declarado pelo país. */
  accumulateStocks?: boolean;
}>;

/**
 * Calcula um mês da rede viva (D-41/D-42):
 * 1. eficácia e apoio de cada lei, lendo o mês anterior;
 * 2. bolhas em cadeia (sem valor próprio nem base);
 * 3. estoques.
 */
export function computeNetwork(
  input: NetworkInput,
): ValidationResult<NetworkResult> {
  const { content, graph, previous } = input;
  const response = content.manifest.respostaDasBolhas ?? 1;
  const next: Record<string, number> = { ...previous, ...input.controls };
  const lawByControl = new Map(
    content.policies.map((policy) => [policy.controle.variavel, policy.id]),
  );
  const computed = new Set<string>();
  const byTarget = new Map<string, GraphRelation[]>();
  for (const relation of input.activeRelations) {
    const list = byTarget.get(relation.targetId) ?? [];
    list.push(relation);
    byTarget.set(relation.targetId, list);
  }

  // Valor que uma origem entrega: lei = nível × eficácia; demais = valor.
  const delivered = (
    values: Readonly<Record<string, number>>,
    nodeId: string,
  ): number | undefined => {
    const law = lawByControl.get(nodeId);
    if (law === undefined || graph.nodesById[nodeId]?.tipo !== "controle")
      return values[nodeId];
    const level = values[nodeId];
    const efficacy = values[efficacyNodeId(law)] ?? 1;
    if (level === undefined) return undefined;
    // Eficácia acima de 1 reforça a lei, mas não passa da opção mais forte
    // (o teto do controle): sem isso, um limiar na última opção dispara.
    const ceiling = graph.nodesById[nodeId]?.dominio.maximo;
    const effect = level * efficacy;
    return ceiling !== undefined && level <= ceiling
      ? Math.min(effect, ceiling)
      : effect;
  };

  const explain = (
    targetId: string,
    phase: "lei" | "rede",
  ): ValidationResult<{
    sum: number;
    contributions: ContributionExplanation[];
    rates: StockRate[];
  }> => {
    const contributions: ContributionExplanation[] = [];
    const rates: StockRate[] = [];
    let sum = 0;
    const relations = [...(byTarget.get(targetId) ?? [])].sort((left, right) =>
      left.id.localeCompare(right.id),
    );
    for (const relation of relations) {
      let source: Readonly<Record<string, number>>;
      let readsPreviousMonth = false;
      if (relation.delaySteps > 0)
        source = input.readDelayed(relation.delaySteps);
      else if (phase === "lei") {
        source = previous;
        readsPreviousMonth = true;
      } else {
        const origin = graph.nodesById[relation.originId];
        const pendingBubble =
          isCalculatedBubble(graph, relation.originId) &&
          !computed.has(relation.originId);
        const stock = origin?.tipo === "estoque";
        source = pendingBubble || stock ? previous : next;
        readsPreviousMonth = pendingBubble;
      }
      const sourceValue = relation.readsLevel
        ? source[relation.originId]
        : delivered(source, relation.originId);
      if (sourceValue === undefined)
        return failure(
          `relacoes.${relation.id}`,
          `A origem ${relation.originId} não tem valor.`,
        );
      const calculated = calculateContribution(relation, sourceValue, (id) =>
        delivered(source, id),
      );
      if (!calculated.ok) return calculated;
      sum += calculated.value.value;
      rates.push({
        relationId: relation.id,
        value: calculated.value.value,
        unit: relation.unit,
      });
      contributions.push({
        relationId: relation.id,
        policyOrEventId: relation.sourceId,
        consequenceId: relation.consequenceId,
        originId: relation.originId,
        targetId: relation.targetId,
        sourceValue,
        mechanism: relation.mechanism,
        parameters: relation.parameters,
        inputValue: calculated.value.inputValue,
        ...(relation.normalization?.divisor !== undefined
          ? {
              divisorId: relation.normalization.divisor,
              divisorValue: calculated.value.divisorValue,
            }
          : {}),
        ...(relation.normalization?.fator !== undefined
          ? {
              factorId: relation.normalization.fator,
              factorValue: calculated.value.factorValue,
            }
          : {}),
        ...(relation.scale
          ? {
              scaleId: relation.scale.fator,
              scaleValue: calculated.value.scaleValue,
            }
          : {}),
        ...(readsPreviousMonth ? { readsPreviousMonth } : {}),
        contribution: calculated.value.value,
      });
    }
    if (!Number.isFinite(sum))
      return failure(
        `valores.${targetId}`,
        "A soma das influências não é finita.",
      );
    return { ok: true, value: { sum, contributions, rates } };
  };

  const explanations: TargetExplanation[] = [];
  const settle = (
    targetId: string,
    base: number,
    raw: number,
    contributions: ContributionExplanation[],
  ) => {
    const node = graph.nodesById[targetId];
    const emerged =
      node.tipo === "situacao"
        ? Math.max(0, raw - (node.surgimento ?? 0))
        : raw;
    const target = clamp(emerged, node.dominio.minimo, node.dominio.maximo);
    const before = previous[targetId];
    // D-54: bolha calculada anda parte do caminho por passo (amortece ciclos).
    // Bolha com resposta própria (as contas, SG159) usa a dela.
    const own = node.resposta ?? response;
    const result =
      own < 1 && !isLawNode(targetId) && before !== undefined
        ? before + own * (target - before)
        : target;
    next[targetId] = result;
    computed.add(targetId);
    explanations.push({
      targetId,
      previousValue: previous[targetId] ?? base,
      baseValue: base,
      contributions,
      rawValue: raw,
      targetValue: target,
      limited: target !== emerged,
      result,
    });
  };

  // 1. Eficácia e apoio das leis, lendo o mês anterior.
  for (const id of Object.keys(graph.nodesById)
    .filter(isLawNode)
    .sort((left, right) => left.localeCompare(right))) {
    const base = lawNodeBase(id)!;
    const result = explain(id, "lei");
    if (!result.ok) return result;
    settle(id, base, base + result.value.sum, result.value.contributions);
  }

  // 2. Bolhas em cadeia: sem valor próprio, só o que recebem.
  for (const id of calculatedBubbleOrder(graph)) {
    const result = explain(id, "rede");
    if (!result.ok) return result;
    settle(id, 0, result.value.sum, result.value.contributions);
  }

  // 3. Estoques acumulam o que recebem neste mês.
  for (const variable of content.variables.variaveis) {
    if (variable.tipo !== "estoque" || input.accumulateStocks === false)
      continue;
    const result = explain(variable.id, "rede");
    if (!result.ok) return result;
    const updated = updateStock(
      variable,
      previous[variable.id],
      result.value.rates,
      input.duration,
    );
    if (!updated.ok) return { ok: false, diagnostics: updated.diagnostics };
    next[variable.id] = updated.value.value;
  }

  const intensities: Record<string, number> = {};
  for (const policy of content.policies) {
    const value = delivered(next, policy.controle.variavel);
    if (value !== undefined) intensities[policy.id] = value;
  }
  for (const id of Object.keys(graph.nodesById))
    if (!isLawNode(id) && graph.nodesById[id].tipo !== "controle")
      intensities[id] = next[id];

  return {
    ok: true,
    value: {
      values: next,
      explanations: explanations.sort((left, right) =>
        left.targetId.localeCompare(right.targetId),
      ),
      intensities,
    },
  };
}
