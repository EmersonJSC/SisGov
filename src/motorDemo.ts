import {
  advanceExecution,
  createExecution,
  translateAuthorizedPolicies,
  type EngineExecution,
  type PackageAnalysis,
  type ResolvedPackage,
  type ScenarioGraph,
  type StepExecutionResult,
} from "./engine";
import {
  listDistributedScenarios,
  loadDistributedScenario,
} from "./scenarios/loadScenarioPackage";

const scenarioName = document.querySelector<HTMLElement>("#scenario-name")!;
const scenarioId = document.querySelector<HTMLElement>("#scenario-id")!;
const scenarioSelect =
  document.querySelector<HTMLSelectElement>("#scenario-select")!;
const loadScenarioButton =
  document.querySelector<HTMLButtonElement>("#load-scenario")!;
const turn = document.querySelector<HTMLElement>("#turn")!;
const values = document.querySelector<HTMLTableSectionElement>("#values")!;
const policies = document.querySelector<HTMLElement>("#policies")!;
const occurrences = document.querySelector<HTMLElement>("#occurrences")!;
const causes = document.querySelector<HTMLElement>("#causes")!;
const graphStage = document.querySelector<HTMLElement>("#graph-stage")!;
const graphEditor = document.querySelector<HTMLElement>("#graph-editor")!;
const pendingStatus = document.querySelector<HTMLElement>("#pending-status")!;
const advanceTurnButton =
  document.querySelector<HTMLButtonElement>("#advance-turn")!;
const resetExecutionButton =
  document.querySelector<HTMLButtonElement>("#reset-execution")!;
const comparisonPolicy =
  document.querySelector<HTMLSelectElement>("#comparison-policy")!;
const comparisonVariable = document.querySelector<HTMLSelectElement>(
  "#comparison-variable",
)!;
const comparisonA = document.querySelector<HTMLInputElement>("#comparison-a")!;
const comparisonB = document.querySelector<HTMLInputElement>("#comparison-b")!;
const comparisonSteps =
  document.querySelector<HTMLInputElement>("#comparison-steps")!;
const runComparisonButton =
  document.querySelector<HTMLButtonElement>("#run-comparison")!;
const comparisonOutput =
  document.querySelector<HTMLElement>("#comparison-output")!;
const dependencyVariable = document.querySelector<HTMLSelectElement>(
  "#dependency-variable",
)!;
const dependencyOutput =
  document.querySelector<HTMLElement>("#dependency-output")!;
const extremesOutput = document.querySelector<HTMLElement>("#extremes-output")!;
const format = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 4 });
const typeLabels = {
  controle: "Controle",
  calculado: "Calculado",
  estoque: "Estoque",
} as const;

function showError(messages: readonly string[]): void {
  causes.innerHTML = "";
  const error = document.createElement("div");
  error.className = "error";
  error.textContent = messages.join("\n");
  causes.append(error);
}

function renderValues(
  content: ResolvedPackage,
  execution: EngineExecution,
): void {
  values.innerHTML = "";
  for (const variable of content.variables.variaveis) {
    const row = values.insertRow();
    row.insertCell().textContent = variable.nome;
    row.insertCell().textContent = typeLabels[variable.tipo];
    row.insertCell().textContent = variable.unidade;
    const cell = row.insertCell();
    cell.className = "value";
    cell.textContent = format.format(execution.values[variable.id]);
  }
  turn.textContent = String(execution.step);
}

function renderOccurrences(
  content: ResolvedPackage,
  graph: ScenarioGraph,
  execution: EngineExecution,
  pendingEvents: ReadonlySet<string>,
  toggleEvent: (eventId: string) => void,
): void {
  const items = [...content.events, ...content.situations, ...content.dilemmas];
  occurrences.innerHTML = "";
  if (items.length === 0) {
    occurrences.innerHTML =
      '<p class="empty">Este cenário não declarou eventos, situações ou dilemas.</p>';
    return;
  }
  const list = document.createElement("ul");
  list.className = "causes";
  for (const occurrence of items) {
    const item = document.createElement("li");
    item.className = "cause";
    const name = document.createElement("strong");
    name.textContent = occurrence.nome;
    const kind = document.createElement("p");
    kind.textContent = occurrence.tipo;
    item.append(name, kind);
    if (occurrence.tipo === "evento") {
      const relationIds = graph.relations
        .filter((relation) => relation.sourceId === occurrence.id)
        .map((relation) => relation.id);
      const alreadyOccurred =
        relationIds.length > 0 &&
        relationIds.every((id) =>
          execution.relationMemory.firedRelationIds.includes(id),
        );
      const button = document.createElement("button");
      button.type = "button";
      button.className = "secondary-button occurrence-button";
      button.disabled = alreadyOccurred;
      button.textContent = alreadyOccurred
        ? "Evento já ocorreu"
        : pendingEvents.has(occurrence.id)
          ? "Cancelar evento preparado"
          : "Preparar evento na bancada";
      button.addEventListener("click", () => toggleEvent(occurrence.id));
      item.append(button);
    }
    list.append(item);
  }
  occurrences.append(list);
}

function renderCauses(
  content: ResolvedPackage,
  graph: ScenarioGraph,
  result?: StepExecutionResult,
): void {
  causes.innerHTML = "";
  if (!result || result.explanations.length === 0) {
    causes.innerHTML =
      '<p class="empty">Aplique uma política para avançar um turno e ver a explicação.</p>';
    return;
  }
  const variableNames = new Map(
    content.variables.variaveis.map((item) => [item.id, item.nome]),
  );
  const sourceNames = new Map(
    [
      ...content.policies,
      ...content.events,
      ...content.situations,
      ...content.dilemmas,
    ].map((item) => [item.id, item.nome]),
  );
  const list = document.createElement("ul");
  list.className = "causes";
  for (const explanation of result.explanations) {
    const item = document.createElement("li");
    item.className = "cause";
    const title = document.createElement("strong");
    title.textContent = `${variableNames.get(explanation.targetId) ?? explanation.targetId}: ${format.format(explanation.previousValue)} → ${format.format(explanation.result)}`;
    item.append(title);
    const totalContribution = explanation.contributions.reduce(
      (total, contribution) => total + contribution.contribution,
      0,
    );
    const summary = document.createElement("p");
    summary.className = "cause-summary";
    summary.textContent = `Fechamento: base ${format.format(explanation.baseValue)} + contribuições ${format.format(totalContribution)} = ${format.format(explanation.result)}`;
    item.append(summary);
    for (const contribution of explanation.contributions) {
      const relation = graph.relationsById[contribution.relationId];
      const detail = document.createElement("p");
      detail.textContent = `${sourceNames.get(contribution.policyOrEventId) ?? contribution.policyOrEventId}: ${format.format(contribution.sourceValue)} × ${format.format(contribution.coefficient)} + ${format.format(contribution.constant)} = ${format.format(contribution.contribution)}`;
      item.append(detail);
      const audit = document.createElement("dl");
      audit.className = "cause-audit";
      const remaining =
        relation.duration.modo === "fixo"
          ? (result.execution.relationMemory.fixedRemaining[relation.id] ?? 0)
          : undefined;
      const duration =
        relation.duration.modo === "continuo"
          ? "Ativo neste turno; continua enquanto a política estiver vigente"
          : relation.duration.modo === "unico"
            ? "Executado uma única vez"
            : `Ativo neste turno; ${remaining} passo(s) restante(s)`;
      const fields = [
        [
          "Contribuição",
          `${format.format(contribution.contribution)} ${relation.unit}`,
        ],
        ["Política/evento JSON", relation.sourcePath],
        ["Consequência JSON", relation.consequencePath],
        [
          "Atraso",
          relation.delaySteps === 0
            ? "Sem atraso"
            : `${relation.delaySteps} passo(s)`,
        ],
        ["Efeito", duration],
        [
          "Mecanismo",
          relation.mechanism === "afim"
            ? "Afim; não usa convergência gradual"
            : relation.mechanism,
        ],
        ["Relação", relation.id],
      ];
      for (const [label, value] of fields) {
        const term = document.createElement("dt");
        term.textContent = label;
        const description = document.createElement("dd");
        description.textContent = value;
        audit.append(term, description);
      }
      item.append(audit);
    }
    list.append(item);
  }
  causes.append(list);
}

function graphPositions(count: number): readonly { x: number; y: number }[] {
  if (count === 1) return [{ x: 50, y: 48 }];
  if (count === 2)
    return [
      { x: 28, y: 48 },
      { x: 72, y: 48 },
    ];
  return Array.from({ length: count }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / count;
    return { x: 50 + Math.cos(angle) * 36, y: 49 + Math.sin(angle) * 34 };
  });
}

function bubbleSize(value: number, minimum?: number, maximum?: number): number {
  const low = minimum ?? 0;
  const high = maximum ?? Math.max(100, Math.abs(value), low + 1);
  const normalized = Math.max(0, Math.min(1, (value - low) / (high - low)));
  return 86 + normalized * 72;
}

function renderGraph(
  content: ResolvedPackage,
  graph: ScenarioGraph,
  execution: EngineExecution,
  previousValues: Readonly<Record<string, number>> | undefined,
  pending: ReadonlyMap<string, number>,
  stage: (policyId: string, value: number) => void,
): void {
  graphStage.innerHTML = "";
  graphEditor.innerHTML = "";
  const variables = content.variables.variaveis;
  const positions = graphPositions(variables.length);
  const positionById = new Map(
    variables.map((item, index) => [item.id, positions[index]]),
  );
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("graph-lines");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  const definitions = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "defs",
  );
  definitions.innerHTML =
    '<marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#7890a8"/></marker>';
  svg.append(definitions);
  for (const relation of graph.relations) {
    const origin = positionById.get(relation.originId);
    const target = positionById.get(relation.targetId);
    if (!origin || !target) continue;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", String(origin.x));
    line.setAttribute("y1", String(origin.y));
    line.setAttribute("x2", String(target.x));
    line.setAttribute("y2", String(target.y));
    line.setAttribute("marker-end", "url(#arrow)");
    svg.append(line);
  }
  graphStage.append(svg);

  const policiesByControl = new Map(
    content.policies.map((policy) => [policy.controle.variavel, policy]),
  );
  let selectedId = variables.find((item) => item.tipo === "controle")?.id;

  const selectNode = (variableId: string): void => {
    selectedId = variableId;
    for (const node of graphStage.querySelectorAll<HTMLElement>(".graph-node"))
      node.classList.toggle(
        "is-selected",
        node.dataset.variableId === selectedId,
      );
    const variable = graph.nodesById[variableId];
    const policy = policiesByControl.get(variableId);
    graphEditor.innerHTML = "";
    const description = document.createElement("div");
    const name = document.createElement("h3");
    name.textContent = policy?.nome ?? variable.nome;
    const help = document.createElement("p");
    help.className = "muted";
    help.textContent = policy
      ? policy.descricao
      : "Este indicador é resultado das consequências e não pode ser alterado diretamente.";
    description.append(name, help);
    graphEditor.append(description);
    if (!policy) return;
    const label = document.createElement("label");
    label.textContent = `Novo valor (${policy.controle.unidade})`;
    const input = document.createElement("input");
    input.type = "number";
    input.step = "any";
    input.value = String(
      pending.get(policy.id) ?? execution.values[variableId],
    );
    if (variable.dominio.minimo !== undefined)
      input.min = String(variable.dominio.minimo);
    if (variable.dominio.maximo !== undefined)
      input.max = String(variable.dominio.maximo);
    label.append(input);
    const prepared = document.createElement("p");
    prepared.className = "muted";
    prepared.textContent = pending.has(policy.id)
      ? "Esta mudança está preparada para o próximo turno."
      : "Altere o valor para preparar esta decisão.";
    input.addEventListener("change", () =>
      stage(policy.id, input.valueAsNumber),
    );
    graphEditor.append(label, prepared);
  };

  for (const [index, variable] of variables.entries()) {
    const value = execution.values[variable.id];
    const previous = previousValues?.[variable.id];
    const delta = previous === undefined ? 0 : value - previous;
    const position = positions[index];
    const node = document.createElement("button");
    node.type = "button";
    node.className = "graph-node";
    node.dataset.variableId = variable.id;
    node.dataset.kind = variable.tipo;
    node.style.left = `${position.x}%`;
    node.style.top = `${position.y}%`;
    node.style.setProperty(
      "--bubble-size",
      `${bubbleSize(value, variable.dominio.minimo, variable.dominio.maximo)}px`,
    );
    if (delta > 0) node.classList.add("changed-up");
    if (delta < 0) node.classList.add("changed-down");
    const policy = policiesByControl.get(variable.id);
    const name = document.createElement("span");
    name.className = "graph-node__name";
    name.textContent = policy?.nome ?? variable.nome;
    const displayedValue = document.createElement("span");
    displayedValue.className = "graph-node__value";
    displayedValue.textContent = format.format(value);
    node.append(name, displayedValue);
    if (policy && pending.has(policy.id)) {
      node.classList.add("has-pending");
      const prepared = document.createElement("span");
      prepared.className = "graph-node__pending";
      prepared.textContent = `Preparado: ${format.format(pending.get(policy.id)!)}`;
      node.append(prepared);
    }
    if (delta !== 0) {
      const change = document.createElement("span");
      change.className = `graph-node__delta${delta < 0 ? " is-negative" : ""}`;
      change.textContent = `${delta > 0 ? "+" : ""}${format.format(delta)}`;
      node.append(change);
    }
    node.addEventListener("click", () => selectNode(variable.id));
    graphStage.append(node);
  }
  if (selectedId) selectNode(selectedId);
}

function renderPolicies(
  content: ResolvedPackage,
  execution: EngineExecution,
  pending: ReadonlyMap<string, number>,
): void {
  policies.innerHTML = "";
  if (content.policies.length === 0) {
    policies.innerHTML = '<p class="empty">Nenhuma política disponível.</p>';
    return;
  }
  for (const policy of content.policies) {
    const wrapper = document.createElement("article");
    wrapper.className = "policy";
    const description = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = policy.nome;
    const text = document.createElement("p");
    text.className = "muted";
    text.textContent = policy.descricao;
    description.append(title, text);
    const state = document.createElement("strong");
    const current = execution.values[policy.controle.variavel];
    state.textContent = pending.has(policy.id)
      ? `${format.format(current)} → ${format.format(pending.get(policy.id)!)}`
      : format.format(current);
    wrapper.append(description, state);
    policies.append(wrapper);
  }
}

function renderComparison(
  content: ResolvedPackage,
  graph: ScenarioGraph,
): void {
  comparisonPolicy.innerHTML = "";
  comparisonVariable.innerHTML = "";
  comparisonOutput.innerHTML =
    '<p class="empty">Escolha dois valores e execute a comparação.</p>';
  for (const policy of content.policies) {
    const option = document.createElement("option");
    option.value = policy.id;
    option.textContent = policy.nome;
    comparisonPolicy.append(option);
  }
  for (const variable of content.variables.variaveis.filter(
    (item) => item.tipo !== "controle",
  )) {
    const option = document.createElement("option");
    option.value = variable.id;
    option.textContent = variable.nome;
    comparisonVariable.append(option);
  }
  const firstPolicy = content.policies[0];
  if (!firstPolicy) {
    runComparisonButton.disabled = true;
    return;
  }
  runComparisonButton.disabled = false;
  const initial = content.initialState.valores[firstPolicy.controle.variavel];
  comparisonA.value = String(initial);
  comparisonB.value = String(initial + 20);

  runComparisonButton.onclick = () => {
    const policy = content.policies.find(
      (item) => item.id === comparisonPolicy.value,
    );
    const variable = content.variables.variaveis.find(
      (item) => item.id === comparisonVariable.value,
    );
    const turns = comparisonSteps.valueAsNumber;
    const a = comparisonA.valueAsNumber;
    const b = comparisonB.valueAsNumber;
    if (
      !policy ||
      !variable ||
      !Number.isInteger(turns) ||
      turns < 1 ||
      turns > 20 ||
      !Number.isFinite(a) ||
      !Number.isFinite(b)
    ) {
      comparisonOutput.innerHTML =
        '<div class="error">Informe decisões numéricas e uma quantidade de 1 a 20 turnos.</div>';
      return;
    }
    let executionA = createExecution(content, graph);
    let executionB = createExecution(content, graph);
    const rows = [
      {
        turn: 0,
        a: executionA.values[variable.id],
        b: executionB.values[variable.id],
      },
    ];
    for (let stepNumber = 1; stepNumber <= turns; stepNumber += 1) {
      const batchA = translateAuthorizedPolicies(content, graph, [
        { policyId: policy.id, intensity: a },
      ]);
      const batchB = translateAuthorizedPolicies(content, graph, [
        { policyId: policy.id, intensity: b },
      ]);
      if (!batchA.ok || !batchB.ok) {
        const diagnostics = [
          ...(batchA.ok ? [] : batchA.diagnostics),
          ...(batchB.ok ? [] : batchB.diagnostics),
        ];
        comparisonOutput.innerHTML = `<div class="error">${diagnostics.map((item) => item.message).join("\n")}</div>`;
        return;
      }
      const nextA = advanceExecution(content, graph, executionA, batchA.value);
      const nextB = advanceExecution(content, graph, executionB, batchB.value);
      if (!nextA.ok || !nextB.ok) {
        const diagnostics = [
          ...(nextA.ok ? [] : nextA.diagnostics),
          ...(nextB.ok ? [] : nextB.diagnostics),
        ];
        comparisonOutput.innerHTML = `<div class="error">${diagnostics.map((item) => item.message).join("\n")}</div>`;
        return;
      }
      executionA = nextA.value.execution;
      executionB = nextB.value.execution;
      rows.push({
        turn: stepNumber,
        a: executionA.values[variable.id],
        b: executionB.values[variable.id],
      });
    }
    comparisonOutput.innerHTML = "";
    const summary = document.createElement("div");
    summary.className = "comparison-summary";
    summary.innerHTML = `<span><span class="comparison-a">A</span>: ${format.format(a)} ${policy.controle.unidade}</span><span><span class="comparison-b">B</span>: ${format.format(b)} ${policy.controle.unidade}</span><span>Indicador: ${variable.nome} (${variable.unidade})</span>`;
    const table = document.createElement("table");
    table.innerHTML = `<thead><tr><th>Turno</th><th class="comparison-a">Execução A</th><th class="comparison-b">Execução B</th><th>Diferença B − A</th></tr></thead>`;
    const body = document.createElement("tbody");
    for (const row of rows) {
      const line = body.insertRow();
      line.insertCell().textContent = String(row.turn);
      line.insertCell().textContent = `${format.format(row.a)} ${variable.unidade}`;
      line.insertCell().textContent = `${format.format(row.b)} ${variable.unidade}`;
      const difference = row.b - row.a;
      const differenceCell = line.insertCell();
      differenceCell.className =
        difference > 0
          ? "difference-positive"
          : difference < 0
            ? "difference-negative"
            : "";
      differenceCell.textContent = `${difference > 0 ? "+" : ""}${format.format(difference)} ${variable.unidade}`;
    }
    table.append(body);
    comparisonOutput.append(summary, table);
  };
}

function renderDependencies(
  content: ResolvedPackage,
  graph: ScenarioGraph,
): void {
  dependencyVariable.innerHTML = "";
  for (const variable of content.variables.variaveis) {
    const option = document.createElement("option");
    option.value = variable.id;
    option.textContent = variable.nome;
    dependencyVariable.append(option);
  }
  const variableNames = new Map(
    content.variables.variaveis.map((variable) => [variable.id, variable.nome]),
  );
  const sourceNames = new Map(
    [
      ...content.policies,
      ...content.events,
      ...content.situations,
      ...content.dilemmas,
    ].map((source) => [source.id, source.nome]),
  );

  const draw = (): void => {
    const selectedId = dependencyVariable.value;
    const incoming = graph.relations.filter(
      (relation) => relation.targetId === selectedId,
    );
    const outgoing = graph.relations.filter(
      (relation) => relation.originId === selectedId,
    );
    dependencyOutput.innerHTML = "";
    const columns = document.createElement("div");
    columns.className = "dependency-columns";

    const createGroup = (
      title: string,
      relations: typeof graph.relations,
      direction: "incoming" | "outgoing",
    ): HTMLElement => {
      const group = document.createElement("section");
      group.className = "dependency-group";
      const heading = document.createElement("h3");
      heading.textContent = title;
      const count = document.createElement("p");
      count.className = "dependency-count";
      count.textContent = `${relations.length} ${relations.length === 1 ? "relação" : "relações"}`;
      group.append(heading, count);
      if (relations.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty";
        empty.textContent =
          direction === "incoming"
            ? "Nenhuma relação termina nesta variável."
            : "Nenhuma relação parte desta variável.";
        group.append(empty);
        return group;
      }
      const list = document.createElement("div");
      list.className = "dependency-list";
      for (const relation of relations) {
        const parallel = graph.relations.filter(
          (candidate) =>
            candidate.originId === relation.originId &&
            candidate.targetId === relation.targetId,
        );
        const parallelIndex = parallel.findIndex(
          (candidate) => candidate.id === relation.id,
        );
        const card = document.createElement("details");
        card.className = "dependency-card";
        const summary = document.createElement("summary");
        const origin =
          variableNames.get(relation.originId) ?? relation.originId;
        const target =
          variableNames.get(relation.targetId) ?? relation.targetId;
        summary.textContent = `${origin} → ${target}`;
        const details = document.createElement("dl");
        details.className = "dependency-details";
        const fields = [
          [
            "Direção",
            direction === "incoming"
              ? "Entra na variável selecionada"
              : "Sai da variável selecionada",
          ],
          ["Causa", sourceNames.get(relation.sourceId) ?? relation.sourceId],
          ["Consequência", relation.consequenceId],
          ["Relação", relation.id],
          [
            "Paralela",
            parallel.length > 1
              ? `${parallelIndex + 1} de ${parallel.length} entre os mesmos nós`
              : "Não",
          ],
          ["Atraso", `${relation.delaySteps} passo(s)`],
          ["Origem JSON", relation.sourcePath],
          ["Consequência JSON", relation.consequencePath],
        ];
        for (const [label, value] of fields) {
          const term = document.createElement("dt");
          term.textContent = label;
          const description = document.createElement("dd");
          description.textContent = value;
          details.append(term, description);
        }
        card.append(summary, details);
        list.append(card);
      }
      group.append(list);
      return group;
    };

    columns.append(
      createGroup("Origens — o que afeta", incoming, "incoming"),
      createGroup("Destinos — o que é afetado", outgoing, "outgoing"),
    );
    dependencyOutput.append(columns);
  };
  dependencyVariable.onchange = draw;
  draw();
}

function renderExtremes(
  content: ResolvedPackage,
  graph: ScenarioGraph,
  analysis: PackageAnalysis,
): void {
  extremesOutput.innerHTML = "";
  const connected = new Set(
    graph.relations.flatMap((relation) => [
      relation.originId,
      relation.targetId,
    ]),
  );
  const isolated = content.variables.variaveis.filter(
    (variable) => !connected.has(variable.id),
  );
  const delayed = graph.relations.filter((relation) => relation.delaySteps > 0);
  const boundedControls = content.variables.variaveis.filter(
    (variable) =>
      variable.tipo === "controle" && variable.dominio.maximo !== undefined,
  );
  const cases = [
    {
      title: "Nó isolado",
      found: isolated.length > 0,
      text:
        isolated.length > 0
          ? isolated.map((item) => item.nome).join(", ")
          : "Nenhuma bolinha isolada neste pacote.",
    },
    {
      title: "Ciclo",
      found: analysis.cycles.length > 0,
      text:
        analysis.cycles.length > 0
          ? analysis.cycles.map((cycle) => cycle.join(" ↔ ")).join("; ")
          : "Nenhum ciclo detectado neste pacote.",
    },
    {
      title: "Efeito atrasado",
      found: delayed.length > 0,
      text:
        delayed.length > 0
          ? delayed
              .map((item) => `${item.id}: ${item.delaySteps} passo(s)`)
              .join("; ")
          : "Nenhuma relação atrasada neste pacote.",
    },
    {
      title: "Evento",
      found: content.events.length > 0,
      text:
        content.events.length > 0
          ? `${content.events.map((item) => item.nome).join(", ")}. Sua relação já pode ser inspecionada; o disparo automático entra na integração do turno.`
          : "Nenhum evento declarado neste pacote.",
    },
    {
      title: "Erro de domínio",
      found: boundedControls.length > 0,
      text:
        boundedControls.length > 0
          ? `Teste: informe acima de ${boundedControls[0].dominio.maximo} em ${boundedControls[0].nome}. O turno deve ser recusado sem zerar os valores.`
          : "Nenhum controle com máximo declarado neste pacote.",
    },
  ];
  for (const item of cases) {
    const card = document.createElement("article");
    card.className = `extreme-card${item.found ? " extreme-found" : ""}`;
    const title = document.createElement("strong");
    title.textContent = `${item.found ? "Encontrado" : "Ausente"}: ${item.title}`;
    const text = document.createElement("p");
    text.textContent = item.text;
    card.append(title, text);
    extremesOutput.append(card);
  }
}

type WorkbenchSession = {
  definition: ResolvedPackage;
  graph: ScenarioGraph;
  execution: EngineExecution;
  pending: Map<string, number>;
  pendingEvents: Set<string>;
};

let session: WorkbenchSession | undefined;
let processingTurn = false;

function updateTurnControls(): void {
  const count =
    (session?.pending.size ?? 0) + (session?.pendingEvents.size ?? 0);
  pendingStatus.textContent =
    count === 0
      ? "Nenhuma decisão preparada"
      : `${count} ${count === 1 ? "decisão preparada" : "decisões preparadas"}`;
  advanceTurnButton.disabled = !session || processingTurn;
  resetExecutionButton.disabled = !session || processingTurn;
}

function renderSession(
  previousValues?: Readonly<Record<string, number>>,
  result?: StepExecutionResult,
): void {
  if (!session) return;
  const { definition, graph, execution, pending, pendingEvents } = session;
  renderValues(definition, execution);
  renderPolicies(definition, execution, pending);
  renderOccurrences(definition, graph, execution, pendingEvents, (eventId) => {
    if (pendingEvents.has(eventId)) pendingEvents.delete(eventId);
    else pendingEvents.add(eventId);
    renderSession();
  });
  if (result) renderCauses(definition, graph, result);
  renderGraph(
    definition,
    graph,
    execution,
    previousValues,
    pending,
    (policyId, value) => {
      if (!Number.isFinite(value)) {
        showError(["O valor preparado deve ser um número finito."]);
        return;
      }
      pending.set(policyId, value);
      renderSession();
    },
  );
  updateTurnControls();
}

function loadScenario(manifestPath: string): void {
  const loaded = loadDistributedScenario(manifestPath);
  if (!loaded.ok) {
    showError(
      loaded.diagnostics.map(
        (item) => `${item.file} · ${item.field}: ${item.message}`,
      ),
    );
    return;
  }

  const { definition, graph, analysis } = loaded.value;
  session = {
    definition,
    graph,
    execution: createExecution(definition, graph),
    pending: new Map(),
    pendingEvents: new Set(),
  };
  scenarioName.textContent = definition.manifest.nome;
  scenarioId.textContent = `Pacote: ${definition.manifest.id}`;
  renderCauses(definition, graph);
  renderComparison(definition, graph);
  renderDependencies(definition, graph);
  renderExtremes(definition, graph, analysis);
  renderSession();
}

loadScenarioButton.addEventListener("click", () => {
  loadScenarioButton.disabled = true;
  loadScenario(scenarioSelect.value);
  loadScenarioButton.disabled = false;
});

advanceTurnButton.addEventListener("click", (event) => {
  // O segundo evento produzido por um clique duplo nunca representa outro turno.
  if (event.detail > 1) return;
  if (!session || processingTurn) return;
  processingTurn = true;
  updateTurnControls();
  const { definition, graph, execution, pending, pendingEvents } = session;
  const changes = definition.policies.map((policy) => ({
    policyId: policy.id,
    intensity:
      pending.get(policy.id) ?? execution.values[policy.controle.variavel],
  }));
  const batch = translateAuthorizedPolicies(definition, graph, changes);
  if (!batch.ok) {
    showError(batch.diagnostics.map((item) => item.message));
    processingTurn = false;
    updateTurnControls();
    return;
  }
  const eventRelationIds = graph.relations
    .filter((relation) => pendingEvents.has(relation.sourceId))
    .map((relation) => relation.id);
  const step = advanceExecution(definition, graph, execution, {
    controlCommands: batch.value.controlCommands,
    activeRelationIds: [
      ...new Set([...batch.value.activeRelationIds, ...eventRelationIds]),
    ].sort((left, right) => left.localeCompare(right)),
  });
  if (!step.ok) {
    showError(step.diagnostics.map((item) => item.message));
    processingTurn = false;
    updateTurnControls();
    return;
  }
  const previousValues = execution.values;
  session.execution = step.value.execution;
  pending.clear();
  pendingEvents.clear();
  renderSession(previousValues, step.value);
  window.setTimeout(() => {
    processingTurn = false;
    updateTurnControls();
  }, 500);
});

resetExecutionButton.addEventListener("click", () => {
  if (!session || processingTurn) return;
  const hasProgress =
    session.execution.step > 0 ||
    session.pending.size > 0 ||
    session.pendingEvents.size > 0;
  if (
    hasProgress &&
    !window.confirm(
      "Reiniciar esta execução? O progresso e as decisões preparadas serão descartados.",
    )
  )
    return;
  session.execution = createExecution(session.definition, session.graph);
  session.pending.clear();
  session.pendingEvents.clear();
  renderCauses(session.definition, session.graph);
  renderSession();
});

for (const scenario of listDistributedScenarios()) {
  const option = document.createElement("option");
  option.value = scenario.path;
  option.textContent = scenario.name;
  option.selected = scenario.path === "exemplo/cenario.json";
  scenarioSelect.append(option);
}
const invalidScenarioOption = document.createElement("option");
invalidScenarioOption.value = "invalido/cenario.json";
invalidScenarioOption.textContent = "Pacote inválido (teste de diagnóstico)";
scenarioSelect.append(invalidScenarioOption);

loadScenario(scenarioSelect.value);
