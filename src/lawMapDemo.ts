import { advanceQuarterlyLaboratoryTurn } from "./game/advanceQuarterlyLaboratoryTurn";
import { prepareMonthlyContent } from "./game/prepareMonthlyContent";
import { appendTurnLog, type TurnLogEntry } from "./game/turnJournal";
import { TurnLogPanel } from "./ui/TurnLogPanel";
import { MapPhysics } from "./mapPhysics";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { MapFilters } from "./ui/MapFilters";
import {
  measureInfluence,
  measureFinances,
  sizeMap,
  MAP_PIXELS_PER_UNIT,
  MIN_NODE_DIAMETER,
  type MapFilter,
} from "./mapMetrics";
// Símbolos locais: o JSON escolhe uma chave, nunca HTML ou URL executável.
import fallbackIcon from "./assets/svg/landmark.svg";
const policyIcons = import.meta.glob<string>("./assets/svg/**/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});
import {
  buildInfluenceLayout,
  type VisualMapDefinition,
} from "./influenceLayout";
import {
  createExecution,
  evaluateSituation,
  type EngineExecution,
  type PolicyFile,
  type ResolvedPackage,
  type ScenarioGraph,
} from "./engine";
import { createD4ReferenceSandbox } from "./scenarios/d4ReferenceSandbox";

const stage = document.querySelector<HTMLElement>("#law-stage")!;
const editor = document.querySelector<HTMLDialogElement>("#law-editor")!;
const turn = document.querySelector<HTMLElement>("#turn")!;
const pendingLabel = document.querySelector<HTMLElement>("#pending")!;
const advanceButton = document.querySelector<HTMLButtonElement>("#advance")!;
const resetButton = document.querySelector<HTMLButtonElement>("#reset")!;
const zoomInButton = document.querySelector<HTMLButtonElement>("#zoom-in")!;
const zoomOutButton = document.querySelector<HTMLButtonElement>("#zoom-out")!;
const format = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
const coefficientFormat = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2,
});

type MapState = {
  content: ResolvedPackage;
  graph: ScenarioGraph;
  execution: EngineExecution;
  pending: Map<string, number>;
  targets: Map<string, number>;
  selectedPolicyId: string;
  activeSituationIds: Set<string>;
  occurredEventIds: Set<string>;
  visualMap: VisualMapDefinition;
};

const categoryStyle: Record<
  string,
  { color: string; halo: string; background: string; border: string }
> = {
  Saúde: {
    color: "#2f7c63",
    halo: "rgb(47 124 99 / 12%)",
    background: "#f5fbf8",
    border: "#cfe7dc",
  },
  Segurança: {
    color: "#416b9c",
    halo: "rgb(65 107 156 / 12%)",
    background: "#f5f8fc",
    border: "#d2dfed",
  },
  Mulheres: {
    color: "#9b5276",
    halo: "rgb(155 82 118 / 12%)",
    background: "#fdf7fa",
    border: "#efd7e2",
  },
  Educação: {
    color: "#7456c7",
    halo: "rgb(116 86 199 / 12%)",
    background: "#f8f5ff",
    border: "#ded5f5",
  },
  Fazenda: {
    color: "#2879bd",
    halo: "rgb(40 121 189 / 12%)",
    background: "#f3f8fd",
    border: "#cbdff0",
  },
  Economia: {
    color: "#2879bd",
    halo: "rgb(40 121 189 / 12%)",
    background: "#f3f8fd",
    border: "#cbdff0",
  },
  Transportes: {
    color: "#23956f",
    halo: "rgb(35 149 111 / 12%)",
    background: "#f1fbf7",
    border: "#c8e9dc",
  },
  "Desenvolvimento Social": {
    color: "#db783c",
    halo: "rgb(219 120 60 / 12%)",
    background: "#fff7f1",
    border: "#f1d5c4",
  },
};

let mapState: MapState | undefined;
let processing = false;
let activeFilter: MapFilter = "influence";
let cachedLayout: ReturnType<typeof buildInfluenceLayout> | undefined;
let physics: MapPhysics | undefined;
let animationFrame = 0;
let pinnedRelationId: string | undefined;
let latestMapBounds = { minX: 0, minY: 0, maxX: 100, maxY: 100 };

const journalRoot = createRoot(document.getElementById("turn-journal")!);
let journal: readonly TurnLogEntry[] = [];
function recordLog(
  level: TurnLogEntry["level"],
  title: string,
  details: readonly string[] = [],
  time: { turn?: number; month?: number; period?: TurnLogEntry["period"] } = {},
): void {
  journal = appendTurnLog(journal, {
    turn: time.turn ?? Math.floor((mapState?.execution.step ?? 0) / 3),
    ...(time.month === undefined ? {} : { month: time.month }),
    ...(time.period === undefined ? {} : { period: time.period }),
    level,
    title,
    details,
  });
  journalRoot.render(createElement(TurnLogPanel, { entries: journal }));
}

function updateSituations(): void {
  if (!mapState) return;
  for (const situation of mapState.content.situations) {
    if (!situation.entraQuando || !situation.saiQuando) continue;
    const result = evaluateSituation(
      {
        id: situation.id,
        enterWhen: situation.entraQuando,
        exitWhen: situation.saiQuando,
      },
      mapState.activeSituationIds.has(situation.id),
      mapState.execution.values,
    );
    if (!result.ok) continue;
    if (result.value) mapState.activeSituationIds.add(situation.id);
    else mapState.activeSituationIds.delete(situation.id);
  }
}

function showNotice(message: string): void {
  stage.querySelector(".notice")?.remove();
  const notice = document.createElement("div");
  notice.className = "notice";
  notice.textContent = message;
  stage.append(notice);
}

function targetReading(targetId: string): string {
  const evaluation = mapState?.graph.nodesById[targetId]?.avaliacao;
  if (evaluation === "maior_melhor") return "quanto maior, melhor";
  if (evaluation === "maior_pior") return "quanto menor, melhor";
  return "sem direção de melhoria definida";
}

function setRelationHighlight(nodeId?: string): void {
  const feedback = stage.querySelector<HTMLElement>(".relation-feedback");
  const lines = stage.querySelectorAll<SVGLineElement>(".law-lines line");
  for (const line of lines) {
    const related =
      Boolean(nodeId) &&
      (line.dataset.origin === nodeId || line.dataset.target === nodeId);
    line.classList.toggle("visible", related);
  }
  stage
    .querySelectorAll<HTMLElement>(".map-node")
    .forEach((node) =>
      node.classList.toggle("relation-focus", node.dataset.nodeId === nodeId),
    );
  if (!feedback) return;
  if (!nodeId || !mapState) {
    feedback.hidden = true;
    feedback.replaceChildren();
    return;
  }
  const relations = mapState.graph.relations.filter(
    (relation) => relation.originId === nodeId || relation.targetId === nodeId,
  );
  const entries = relations.map((relation) => {
    const outgoing = relation.originId === nodeId;
    const targetId = outgoing ? relation.targetId : relation.originId;
    const target = mapState!.graph.nodesById[targetId];
    const rises = relation.parameters.coeficiente >= 0;
    const direction = rises ? "↑ aumenta" : "↓ reduz";
    const reading = outgoing ? targetReading(targetId) : "relação de entrada";
    return `${direction} ${target?.nome ?? targetId} · ${reading}`;
  });
  feedback.hidden = entries.length === 0;
  feedback.replaceChildren(
    ...entries.map((entry) => {
      const line = document.createElement("span");
      line.textContent = entry;
      return line;
    }),
  );
}

const currentInfluence = measureInfluence;

function formatMoney(value: number): string {
  if (Math.abs(value) >= 1_000)
    return `R$ ${format.format(value / 1_000)} bi/ano`;
  return `R$ ${format.format(value)} mi/ano`;
}

function compactControlLabel(policy: PolicyFile, value: number): string {
  if (policy.controle.unidade === "moeda_milhoes_2024_ano") {
    if (Math.abs(value) >= 1_000)
      return `R$ ${format.format(value / 1_000)} bi`;
    return `R$ ${format.format(value)} mi`;
  }
  return controlLabel(policy, value);
}

function controlLabel(policy: PolicyFile, value: number): string {
  if (policy.controle.unidade === "moeda_milhoes_2024_ano")
    return formatMoney(value);
  const options = policy.controle.opcoes;
  if (options?.length) {
    const nearest = [...options].sort(
      (left, right) =>
        Math.abs(left.valor - value) - Math.abs(right.valor - value),
    )[0];
    return nearest.rotulo;
  }
  return format.format(value);
}

function abbreviation(name: string): string {
  const relevant = name
    .split(/\s+/)
    .filter(
      (word) =>
        !["de", "da", "do", "das", "dos", "à", "e"].includes(
          word.toLowerCase(),
        ),
    )
    .slice(0, 2);
  return relevant
    .map((word) => `${word.slice(0, 4)}.`)
    .join(" ")
    .toUpperCase();
}

function consequenceTone(
  targetId: string,
  coefficient: number,
): "positive" | "negative" | "neutral" {
  const evaluation = mapState?.graph.nodesById[targetId]?.avaliacao ?? "neutra";
  if (evaluation === "neutra") return "neutral";
  const favorable =
    evaluation === "maior_melhor" ? coefficient >= 0 : coefficient < 0;
  return favorable ? "positive" : "negative";
}

function renderEditor(policy: PolicyFile): void {
  if (!mapState) return;
  editor.innerHTML = "";
  const close = document.createElement("button");
  close.className = "dialog-close";
  close.type = "button";
  close.setAttribute("aria-label", "Fechar");
  close.textContent = "×";
  close.addEventListener("click", () => editor.close());
  const info = document.createElement("div");
  info.className = "dialog-copy";
  const eyebrow = document.createElement("span");
  eyebrow.className = "dialog-eyebrow";
  eyebrow.textContent = `POLÍTICA PÚBLICA · ${policy.tipo.toUpperCase()} · ${policy.area ?? policy.categoria ?? "OUTRAS"}`;
  const title = document.createElement("h2");
  title.textContent = policy.nome;
  const description = document.createElement("p");
  description.textContent = policy.descricao;
  info.append(eyebrow, title, description);
  const timing = document.createElement("p");
  timing.textContent = `Em funcionamento: ${controlLabel(policy, mapState.execution.values[policy.controle.variavel])}. A meta é aplicada gradualmente: implantação e degradação têm ritmos próprios.`;
  info.append(timing);
  if (policy.fonte) {
    const source = document.createElement("a");
    source.className = "source";
    source.href = policy.fonte;
    source.target = "_blank";
    source.rel = "noreferrer";
    source.textContent = "Consultar texto oficial";
    info.append(document.createElement("br"), source);
  }

  const current = mapState.execution.values[policy.controle.variavel];
  const prepared =
    mapState.pending.get(policy.id) ??
    mapState.targets.get(policy.id) ??
    current;
  const control = mapState.graph.nodesById[policy.controle.variavel];
  const label = document.createElement(
    policy.controle.opcoes?.length ? "div" : "label",
  );
  label.className = "control-decision";
  const labelText = document.createElement("span");
  labelText.textContent = `Decisão desejada: ${controlLabel(policy, prepared)}`;
  let selectedValue = prepared;
  if (policy.controle.opcoes?.length) {
    const choices = document.createElement("div");
    choices.className = "scope-choices";
    for (const option of policy.controle.opcoes) {
      const choice = document.createElement("button");
      choice.type = "button";
      choice.textContent = option.rotulo;
      choice.classList.toggle("selected", option.valor === prepared);
      choice.addEventListener("click", () => {
        selectedValue = option.valor;
        labelText.textContent = `Decisão desejada: ${option.rotulo}`;
        choices
          .querySelectorAll("button")
          .forEach((button) =>
            button.classList.toggle("selected", button === choice),
          );
      });
      choices.append(choice);
    }
    label.append(labelText, choices);
  } else {
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = String(control.dominio.minimo ?? 0);
    slider.max = String(control.dominio.maximo ?? 100);
    slider.step =
      policy.controle.unidade === "moeda_milhoes_2024_ano" ? "10" : "1";
    slider.value = String(prepared);
    slider.addEventListener("input", () => {
      selectedValue = slider.valueAsNumber;
      labelText.textContent = `Decisão desejada: ${controlLabel(policy, selectedValue)}`;
    });
    label.append(labelText, slider);
  }

  const effects = document.createElement("div");
  effects.className = "effects";
  const effectsTitle = document.createElement("h3");
  effectsTitle.textContent = "Consequências desta política";
  effects.append(effectsTitle);
  for (const relation of mapState.graph.relations.filter(
    (item) => item.sourceId === policy.id,
  )) {
    const target = mapState.graph.nodesById[relation.targetId];
    const item = document.createElement("div");
    const rises = relation.parameters.coeficiente >= 0;
    item.className = `effect ${consequenceTone(relation.targetId, relation.parameters.coeficiente)}`;
    item.innerHTML = `<strong>${rises ? "↑" : "↓"} ${target.nome}</strong><span>${rises ? "aumenta" : "diminui"} conforme a implementação · peso ${coefficientFormat.format(Math.abs(relation.parameters.coeficiente))}</span>`;
    effects.append(item);
  }

  const prepare = document.createElement("button");
  prepare.type = "button";
  prepare.textContent = "Preparar mudança";
  prepare.addEventListener("click", () => {
    mapState?.pending.set(policy.id, selectedValue);
    recordLog("info", `Mudança preparada: ${policy.nome}`, [
      `Meta: ${controlLabel(policy, selectedValue)}.`,
      "Será aplicada gradualmente ao avançar. Preparar não altera o turno atual.",
    ]);
    editor.close();
    render();
  });
  const controls = document.createElement("div");
  controls.className = "policy-controls";
  controls.append(label, prepare);
  editor.append(close, info, effects, controls);
  if (!editor.open) editor.showModal();
}

function openIndicator(variableId: string): void {
  if (!mapState) return;
  const variable = mapState.graph.nodesById[variableId];
  const incoming = mapState.graph.relations.filter(
    (relation) => relation.targetId === variableId,
  );
  editor.innerHTML = `<button class="dialog-close" type="button" aria-label="Fechar">×</button><div class="dialog-copy"><span class="dialog-eyebrow">INDICADOR · ${variable.area ?? "OUTRAS"}</span><h2>${variable.nome}</h2><p>Valor atual: <strong>${format.format(mapState.execution.values[variableId])}</strong>. Este valor não pode ser alterado diretamente; ele responde às políticas e situações ligadas a ele.</p></div><div class="effects"><h3>O que está influenciando</h3>${incoming
    .map((relation) => {
      const policy = mapState!.content.policies.find(
        (item) => item.id === relation.sourceId,
      );
      const situation = mapState!.content.situations.find(
        (item) => item.id === relation.sourceId,
      );
      const name = policy?.nome ?? situation?.nome ?? relation.sourceId;
      const rises = relation.parameters.coeficiente >= 0;
      return `<div class="effect ${consequenceTone(relation.targetId, relation.parameters.coeficiente)}"><strong>${rises ? "↑" : "↓"} ${name}</strong><span>${rises ? "pressiona para cima" : "pressiona para baixo"} · peso ${coefficientFormat.format(Math.abs(relation.parameters.coeficiente))}</span></div>`;
    })
    .join("")}</div>`;
  editor
    .querySelector(".dialog-close")!
    .addEventListener("click", () => editor.close());
  if (!editor.open) editor.showModal();
}

function openSituation(situationId: string): void {
  if (!mapState) return;
  const situation = mapState.content.situations.find(
    (item) => item.id === situationId,
  )!;
  const active = mapState.activeSituationIds.has(situation.id);
  const source = situation.entraQuando
    ? mapState.graph.nodesById[situation.entraQuando.variavel]
    : undefined;
  editor.innerHTML = `<button class="dialog-close" type="button" aria-label="Fechar">×</button><div class="dialog-copy"><span class="dialog-eyebrow">SITUAÇÃO ${situation.avaliacao === "positiva" ? "POSITIVA" : "NEGATIVA"} · ${situation.area ?? "OUTRAS"}</span><h2>${situation.nome}</h2><p>${situation.descricao ?? ""}</p><p class="status ${active ? "active" : ""}">${active ? "ATIVA" : "INATIVA"}</p></div><div class="effects"><h3>Regras de ativação</h3><div class="effect"><strong>Começa</strong><span>${source?.nome ?? "Indicador"} cruza o limite ${format.format(situation.entraQuando?.valor ?? 0)}</span></div><div class="effect"><strong>Termina</strong><span>${source?.nome ?? "Indicador"} cruza o limite ${format.format(situation.saiQuando?.valor ?? 0)}</span></div></div>`;
  editor
    .querySelector(".dialog-close")!
    .addEventListener("click", () => editor.close());
  if (!editor.open) editor.showModal();
}

function render(
  previousValues?: Readonly<Record<string, number>>,
  previousInfluence?: ReadonlyMap<string, number>,
): void {
  if (!mapState) return;
  const { content, graph, execution, pending } = mapState;
  cancelAnimationFrame(animationFrame);
  stage.innerHTML = "";
  turn.textContent = String(Math.floor(execution.step / 3));
  pendingLabel.textContent =
    pending.size === 0
      ? ""
      : `${pending.size} ${pending.size === 1 ? "decisão preparada" : "decisões preparadas"}`;
  const influenceByNode = currentInfluence(graph, execution.values);
  const influenceMetrics = new Map(
    [...influenceByNode].map(([id, value]) => [id, { value }]),
  );
  const financeMetrics = measureFinances(
    content,
    graph,
    execution.values,
    mapState.visualMap.financialTargets,
  );
  const influenceSizes = sizeMap(content, influenceMetrics);
  const financeSizes = sizeMap(content, financeMetrics);
  const metrics =
    activeFilter === "financial" ? financeMetrics : influenceMetrics;
  const sizes = activeFilter === "financial" ? financeSizes : influenceSizes;
  const priorLayout = cachedLayout;
  const fresh = !physics;
  physics ??= new MapPhysics(content, mapState.visualMap);
  const radii = new Map(
    [...sizes].map(([id, size]) => [id, size / (2 * MAP_PIXELS_PER_UNIT)]),
  );
  physics.setMetrics(
    new Map([...metrics].map(([id, metric]) => [id, metric.value ?? 0])),
    radii,
  );
  if (fresh || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    physics.settle();
  cachedLayout = physics.snapshot();
  const layout = cachedLayout;
  const {
    positions,
    zones,
    macroAreas,
    ministryPositions,
    government,
    representatives,
  } = layout;
  const horizontal = [
    government.center.x - government.radius,
    government.center.x + government.radius,
    ...macroAreas.flatMap((area) => [
      area.center.x - area.radiusX,
      area.center.x + area.radiusX,
    ]),
    ...zones.flatMap((zone) => [
      zone.center.x - zone.radius,
      zone.center.x + zone.radius,
    ]),
    ...[...positions.values()].map((point) => point.x),
  ];
  const vertical = [
    government.center.y - government.radius,
    government.center.y + government.radius,
    ...macroAreas.flatMap((area) => [
      area.center.y - area.radiusY,
      area.center.y + area.radiusY,
    ]),
    ...zones.flatMap((zone) => [
      zone.center.y - zone.radius,
      zone.center.y + zone.radius,
    ]),
    ...[...positions.values()].map((point) => point.y),
  ];
  latestMapBounds = {
    minX: Math.min(...horizontal) - 3,
    maxX: Math.max(...horizontal) + 3,
    minY: Math.min(...vertical) - 3,
    maxY: Math.max(...vertical) + 3,
  };
  const previousLayout = previousInfluence ? priorLayout : undefined;
  for (const macroArea of macroAreas) {
    const region = document.createElement("div");
    region.className = "macro-area-region";
    region.style.left = `${macroArea.center.x}%`;
    region.style.top = `${macroArea.center.y}%`;
    region.style.width = `${macroArea.radiusX * 2}%`;
    region.style.height = `${macroArea.radiusY * 2}%`;
    region.style.setProperty("--macro-color", macroArea.color);
    const label = document.createElement("span");
    label.textContent = macroArea.name;
    region.append(label);
    stage.append(region);
  }
  const federal = document.createElement("div");
  federal.className = "federal-sphere";
  federal.style.left = `${government.center.x}%`;
  federal.style.top = `${government.center.y}%`;
  federal.style.width = `${government.radius * 2}%`;
  federal.style.height = `${government.radius * 2}%`;
  const federalLabel = document.createElement("span");
  federalLabel.textContent = government.name;
  federal.append(federalLabel);
  stage.append(federal);
  for (const representative of representatives) {
    const element = document.createElement("div");
    element.className = `representative-node ${representative.role}`;
    element.dataset.representative = representative.id;
    element.setAttribute("role", "img");
    element.setAttribute(
      "aria-label",
      `${representative.name} · ${representative.institution}`,
    );
    element.title = `${representative.name} · ${representative.institution}`;
    element.style.left = `${representative.center.x}%`;
    element.style.top = `${representative.center.y}%`;
    element.style.setProperty(
      "--size",
      `${representative.radius * 2 * MAP_PIXELS_PER_UNIT}px`,
    );
    const symbol = document.createElement("span");
    symbol.className = "representative-symbol";
    symbol.textContent = representative.role === "president" ? "P" : "M";
    const label = document.createElement("strong");
    label.textContent = representative.name;
    element.append(symbol, label);
    stage.append(element);
  }
  for (const zone of zones) {
    const style = categoryStyle[zone.category] ?? {
      color: "#6c6677",
      halo: "rgb(108 102 119 / 12%)",
      background: "#faf9fb",
      border: "#dfdbe3",
    };
    const element = document.createElement("div");
    element.className = "category-zone ministry-zone";
    element.dataset.ministry = zone.ministry;
    const previousZone = previousLayout?.zones.find(
      (item) => item.ministry === zone.ministry,
    );
    const initialZone = previousZone ?? zone;
    element.style.left = `${initialZone.center.x}%`;
    element.style.top = `${initialZone.center.y}%`;
    element.style.width = `${initialZone.radius * 2}%`;
    element.style.height = `${initialZone.radius * 2}%`;
    if (previousZone) {
      requestAnimationFrame(() => {
        element.style.left = `${zone.center.x}%`;
        element.style.top = `${zone.center.y}%`;
        element.style.width = `${zone.radius * 2}%`;
        element.style.height = `${zone.radius * 2}%`;
      });
    }
    element.style.setProperty("--category-bg", style.background);
    element.style.setProperty("--category-border", style.border);
    element.style.setProperty("--category-color", style.color);
    stage.append(element);
  }
  for (const zone of zones) {
    const position = ministryPositions.get(zone.ministry);
    if (!position) continue;
    const ministry = document.createElement("div");
    ministry.className = "ministry-node";
    ministry.dataset.ministry = zone.ministry;
    ministry.style.left = `${position.x}%`;
    ministry.style.top = `${zone.center.y - zone.radius + 1.3}%`;
    ministry.textContent = zone.ministry
      .replace("Ministério da ", "")
      .replace("Ministério do ", "")
      .replace("Ministério de ", "");
    ministry.style.setProperty(
      "--category-color",
      (categoryStyle[zone.category] ?? { color: "#52677c" }).color,
    );
    stage.append(ministry);
  }
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("law-lines");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  // O texto equivalente é apresentado no painel de relação ao focar uma bolinha.
  svg.setAttribute("aria-hidden", "true");
  const definitions = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "defs",
  );
  definitions.innerHTML =
    '<marker id="law-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#8da3b7"/></marker><marker id="law-arrow-rise" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#25865a"/></marker><marker id="law-arrow-fall" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#be4f4f"/></marker>';
  svg.append(definitions);
  const rawStrengths = graph.relations.map(
    (relation) =>
      Math.abs(relation.parameters.coeficiente) *
      Math.abs(execution.values[relation.originId] ?? 0),
  );
  const maximumStrength = Math.max(...rawStrengths, 0.01);
  for (const relation of graph.relations) {
    const origin = positions.get(
      relation.sourceType === "situacao"
        ? relation.sourceId
        : relation.originId,
    );
    const target = positions.get(relation.targetId);
    if (!origin || !target) continue;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const rises = relation.parameters.coeficiente >= 0;
    const normalizedStrength = Math.min(
      1,
      (Math.abs(relation.parameters.coeficiente) *
        Math.abs(execution.values[relation.originId] ?? 0)) /
        maximumStrength,
    );
    line.setAttribute("x1", String(origin.x));
    line.setAttribute("y1", String(origin.y));
    line.setAttribute("x2", String(target.x));
    line.setAttribute("y2", String(target.y));
    line.setAttribute(
      "marker-end",
      rises ? "url(#law-arrow-rise)" : "url(#law-arrow-fall)",
    );
    line.dataset.positionOrigin =
      relation.sourceType === "situacao"
        ? relation.sourceId
        : relation.originId;
    line.dataset.origin = relation.originId;
    line.dataset.target = relation.targetId;
    line.classList.add("relation", rises ? "rise" : "fall");
    line.style.setProperty(
      "--flow-duration",
      `${2.5 - normalizedStrength * 1.7}s`,
    );
    line.style.setProperty(
      "--flow-width",
      `${0.22 + normalizedStrength * 0.25}`,
    );
    svg.append(line);
  }
  for (const situation of content.situations) {
    const origin = situation.entraQuando
      ? positions.get(situation.entraQuando.variavel)
      : undefined;
    const target = positions.get(situation.id);
    if (!origin || !target) continue;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", String(origin.x));
    line.setAttribute("y1", String(origin.y));
    line.setAttribute("x2", String(target.x));
    line.setAttribute("y2", String(target.y));
    line.setAttribute("marker-end", "url(#law-arrow)");
    line.dataset.positionOrigin = situation.entraQuando!.variavel;
    line.dataset.origin = situation.entraQuando!.variavel;
    line.dataset.target = situation.id;
    line.classList.add("condition");
    svg.append(line);
  }
  stage.append(svg);
  const feedback = document.createElement("aside");
  feedback.className = "relation-feedback";
  feedback.hidden = true;
  feedback.setAttribute("aria-live", "polite");
  stage.append(feedback);

  const addNode = (
    id: string,
    name: string,
    value: number,
    kind: "policy" | "indicator" | "situation-positive" | "situation-negative",
    onClick: () => void,
    category?: string,
    typeLabel?: string,
    iconKey?: string,
    displayedValue = format.format(value),
  ): void => {
    const position = positions.get(id);
    if (!position) return;
    const previousPosition = previousLayout?.positions.get(id) ?? position;
    const node = document.createElement("button");
    node.type = "button";
    node.className = `map-node ${kind}`;
    node.dataset.nodeId = id;
    node.style.setProperty(
      "--orbit-index",
      String(stage.querySelectorAll(".map-node.policy").length),
    );
    node.style.left = `${previousPosition.x}%`;
    node.style.top = `${previousPosition.y}%`;
    if (previousLayout) {
      requestAnimationFrame(() => {
        node.style.left = `${position.x}%`;
        node.style.top = `${position.y}%`;
      });
    }
    const finalSize = sizes.get(id) ?? MIN_NODE_DIAMETER;
    node.style.setProperty("--size", `${finalSize}px`);
    node.dataset.metric = String(metrics.get(id)?.value ?? "unavailable");
    node.classList.toggle(
      "metric-unavailable",
      activeFilter === "financial" && metrics.get(id)?.value == null,
    );
    const style = categoryStyle[category ?? ""];
    if (style) {
      node.style.setProperty("--node-color", style.color);
      node.style.setProperty("--node-halo", style.halo);
    }
    const title = document.createElement("span");
    title.className = "node-name";
    title.textContent = name;
    const number = document.createElement("span");
    number.className = "node-value";
    number.textContent = displayedValue;
    const type = document.createElement("span");
    type.className = "node-type";
    type.textContent =
      typeLabel ?? (kind === "indicator" ? "INDICADOR" : "POLÍTICA");
    if (kind === "policy") {
      node.setAttribute("aria-label", `${name}, ${displayedValue}`);
      node.title = name;
      title.className = "policy-tooltip";
      title.setAttribute("aria-hidden", "true");
      if (content.policies.length > 30) {
        const label = document.createElement("span");
        label.className = "policy-abbreviation";
        label.textContent = layout.abbreviations.get(id) ?? abbreviation(name);
        node.append(label, number, title);
      } else {
        const icon = document.createElement("img");
        icon.className = "policy-icon";
        icon.src = policyIcons[`./assets/svg/${iconKey}.svg`] ?? fallbackIcon;
        icon.alt = "";
        icon.draggable = false;
        node.append(icon, number, title);
      }
    } else node.append(type, title, number);
    const metric = financeMetrics.get(id);
    const metricLabel =
      activeFilter === "financial"
        ? metric?.value == null
          ? "Sem métrica financeira"
          : `Volume financeiro: ${formatMoney(metric.value)}`
        : `Força direta estimada: ${new Intl.NumberFormat("pt-BR", { maximumSignificantDigits: 3 }).format(influenceByNode.get(id) ?? 0)}`;
    node.title = `${name} · ${metricLabel}`;
    node.setAttribute(
      "aria-label",
      `${name}, ${displayedValue}. ${metricLabel}`,
    );
    if (
      activeFilter === "financial" &&
      kind === "policy" &&
      metric?.value != null
    ) {
      number.textContent = `${metric.income ? "↑" : ""}${metric.expense ? "↓" : ""} ${format.format(metric.value)} mi`;
    }
    const previous = previousValues?.[id];
    const delta = previous === undefined ? 0 : value - previous;
    if (delta !== 0) {
      const badge = document.createElement("span");
      badge.className = `node-delta${delta < 0 ? " negative" : ""}`;
      badge.textContent = `${delta > 0 ? "+" : ""}${format.format(delta)}`;
      node.append(badge);
    }
    node.addEventListener("pointerenter", () => setRelationHighlight(id));
    node.addEventListener("pointerleave", () =>
      setRelationHighlight(pinnedRelationId),
    );
    node.addEventListener("focus", () => setRelationHighlight(id));
    node.addEventListener("blur", () => setRelationHighlight(pinnedRelationId));
    node.addEventListener("click", () => {
      pinnedRelationId = id;
      setRelationHighlight(id);
      onClick();
    });
    stage.append(node);
  };

  for (const policy of content.policies) {
    const value = execution.values[policy.controle.variavel];
    addNode(
      policy.controle.variavel,
      policy.nome,
      value,
      "policy",
      () => {
        mapState!.selectedPolicyId = policy.id;
        renderEditor(policy);
      },
      policy.area ?? policy.categoria,
      (
        {
          lei: "LEI",
          imposto: "TRIBUTO",
          programa: "PROGRAMA",
          regulamentacao: "REGRA",
        } as const
      )[policy.tipo],
      policy.icone,
      compactControlLabel(policy, value),
    );
    const node = [...stage.querySelectorAll<HTMLElement>(".map-node")].at(-1);
    if (
      node &&
      (pending.has(policy.id) ||
        Math.abs((mapState.targets.get(policy.id) ?? value) - value) > 0.05)
    ) {
      const prepared = document.createElement("span");
      prepared.className = "prepared";
      prepared.textContent = `${pending.has(policy.id) ? "Preparado" : "Meta"}: ${controlLabel(policy, pending.get(policy.id) ?? mapState.targets.get(policy.id)!)}`;
      node.append(prepared);
    }
  }
  for (const variable of content.variables.variaveis.filter(
    (item) => item.tipo !== "controle" && item.area !== "Técnica",
  )) {
    addNode(
      variable.id,
      variable.nome,
      execution.values[variable.id],
      "indicator",
      () => openIndicator(variable.id),
      variable.area,
      "INDICADOR",
    );
  }
  for (const situation of content.situations) {
    const active = mapState.activeSituationIds.has(situation.id);
    addNode(
      situation.id,
      situation.nome,
      active ? 100 : 0,
      situation.avaliacao === "positiva"
        ? "situation-positive"
        : "situation-negative",
      () => openSituation(situation.id),
      situation.area,
      situation.avaliacao === "positiva" ? "SITUAÇÃO +" : "SITUAÇÃO −",
    );
    const node = [...stage.querySelectorAll<HTMLElement>(".map-node")].at(-1);
    if (node) {
      node.classList.toggle("inactive", !active);
      node.querySelector<HTMLElement>(".node-value")!.textContent = active
        ? "ATIVA"
        : "INATIVA";
    }
  }
  const nodes = [...stage.querySelectorAll<HTMLElement>(".map-node")];
  const zoneElements = [
    ...stage.querySelectorAll<HTMLElement>(".category-zone"),
  ];
  const labels = [...stage.querySelectorAll<HTMLElement>(".ministry-node")];
  const representativeElements = [
    ...stage.querySelectorAll<HTMLElement>(".representative-node"),
  ];
  const lines = [...stage.querySelectorAll<SVGLineElement>(".law-lines line")];
  let lastTime = performance.now();
  const animate = (now: number) => {
    if (!physics) return;
    physics.advance((now - lastTime) / 1000);
    lastTime = now;
    const snapshot = physics.snapshot();
    cachedLayout = snapshot;
    federal.style.width = `${snapshot.government.radius * 2}%`;
    federal.style.height = `${snapshot.government.radius * 2}%`;
    for (const representative of snapshot.representatives) {
      const element = representativeElements.find(
        (el) => el.dataset.representative === representative.id,
      );
      if (element) {
        element.style.left = `${representative.center.x}%`;
        element.style.top = `${representative.center.y}%`;
      }
    }
    for (const node of nodes) {
      const body = physics.bodies.get(node.dataset.nodeId!);
      if (!body) continue;
      node.style.left = `${body.x}%`;
      node.style.top = `${body.y}%`;
      node.style.setProperty(
        "--size",
        `${body.radius * 2 * MAP_PIXELS_PER_UNIT}px`,
      );
    }
    for (const zone of snapshot.zones) {
      const el = zoneElements.find(
        (el) => el.dataset.ministry === zone.ministry,
      );
      if (el) {
        el.style.left = `${zone.center.x}%`;
        el.style.top = `${zone.center.y}%`;
        el.style.width = `${zone.radius * 2}%`;
        el.style.height = `${zone.radius * 2}%`;
      }
      const label = labels.find((el) => el.dataset.ministry === zone.ministry);
      if (label) {
        label.style.left = `${zone.center.x}%`;
        label.style.top = `${zone.center.y - zone.radius - 1.2}%`;
      }
    }
    for (const line of lines) {
      const a = snapshot.positions.get(line.dataset.positionOrigin!);
      const b = snapshot.positions.get(line.dataset.target!);
      if (a && b) {
        line.setAttribute("x1", String(a.x));
        line.setAttribute("y1", String(a.y));
        line.setAttribute("x2", String(b.x));
        line.setAttribute("y2", String(b.y));
      }
    }
    if (!physics.sleeping) animationFrame = requestAnimationFrame(animate);
  };
  animationFrame = requestAnimationFrame(animate);
}

advanceButton.addEventListener("click", (event) => {
  if (!mapState || processing || event.detail > 1) return;
  processing = true;
  advanceButton.disabled = true;
  const current = mapState;
  let committed = false;
  try {
    const next = advanceQuarterlyLaboratoryTurn(
      current.content,
      current.graph,
      current,
    );
    if (!next.ok) {
      const nextTurn = current.execution.step / 3 + 1;
      const details = next.diagnostics.map(
        (d) => `${d.message} [${d.file} · ${d.field} · ${d.code}]`,
      );
      recordLog(
        "error",
        `Turno ${nextTurn} não confirmado`,
        ["O estado e as decisões preparadas foram preservados.", ...details],
        { turn: nextTurn, period: "quarter" },
      );
      showNotice(details.join(" "));
      return;
    }
    const previous = current.execution.values;
    const details = [
      `${current.pending.size} decisões preparadas; três meses técnicos foram processados.`,
      "Laboratório: calendário eleitoral, votação e financiamento da dívida ainda não estão integrados.",
    ];
    for (const policy of current.content.policies) {
      const id = policy.controle.variavel;
      if (next.value.execution.values[id] !== previous[id])
        details.push(
          `${policy.nome}: ${controlLabel(policy, previous[id])} → ${controlLabel(policy, next.value.execution.values[id])}; meta ${controlLabel(policy, next.value.targets.get(policy.id) ?? next.value.execution.values[id])}.`,
        );
    }
    mapState = {
      ...current,
      execution: next.value.execution,
      targets: new Map(next.value.targets),
      activeSituationIds: new Set(next.value.activeSituationIds),
      occurredEventIds: new Set(next.value.occurredEventIds),
      pending: new Map(),
    };
    committed = true;
    turn.textContent = String(next.value.absoluteQuarter);
    const monthlyEntries = [...next.value.journalEntries]
      .filter((entry) => entry.period === "month")
      .reverse();
    for (const entry of monthlyEntries) {
      const month = next.value.months.find(
        (item) => item.absoluteMonth === entry.month,
      );
      const resultDetails = (month?.explanations ?? []).map((explanation) => {
        const node = current.graph.nodesById[explanation.targetId];
        return `${node.nome}: ${format.format(explanation.previousValue)} → ${format.format(explanation.result)} ${node.unidade}.`;
      });
      recordLog(
        entry.level,
        entry.title,
        [...entry.details, ...resultDetails],
        { turn: entry.turn, month: entry.month, period: entry.period },
      );
    }
    const quarterSummary = next.value.journalEntries.find(
      (entry) => entry.period === "quarter",
    );
    recordLog(
      quarterSummary?.level ?? "success",
      quarterSummary?.title ?? "Trimestre concluído",
      [...(quarterSummary?.details ?? []), ...details],
      { turn: next.value.absoluteQuarter, period: "quarter" },
    );
    render(previous, currentInfluence(current.graph, previous));
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    recordLog(
      "error",
      committed
        ? "Trimestre confirmado; falha ao atualizar a tela"
        : "Falha ao preparar o trimestre",
      [
        detail,
        committed
          ? "O trimestre já foi confirmado. Não repita a decisão para corrigir a exibição."
          : "O estado e as decisões preparadas foram preservados.",
      ],
      { turn: Math.floor(current.execution.step / 3) + 1, period: "quarter" },
    );
    showNotice(detail);
  } finally {
    window.setTimeout(() => {
      processing = false;
      advanceButton.disabled = false;
    }, 300);
  }
});

resetButton.addEventListener("click", () => {
  if (!mapState || processing) return;
  if (
    (mapState.execution.step > 0 || mapState.pending.size > 0) &&
    !window.confirm("Reiniciar este exemplo e descartar as mudanças?")
  )
    return;
  cachedLayout = undefined;
  physics = undefined;
  mapState.execution = createExecution(mapState.content, mapState.graph);
  mapState.targets.clear();
  mapState.activeSituationIds.clear();
  mapState.occurredEventIds.clear();
  updateSituations();
  mapState.pending.clear();
  recordLog("info", "Partida reiniciada", [
    "Estado inicial restaurado. Os registros anteriores permanecem nesta sessão.",
  ]);
  render();
});

try {
  const sandbox = createD4ReferenceSandbox();
  const prepared = prepareMonthlyContent(sandbox.content);
  if (!prepared.ok)
    throw new Error(
      prepared.diagnostics.map((issue) => issue.message).join(" "),
    );
  const { content, graph } = prepared.value;
  mapState = {
    content,
    graph,
    execution: createExecution(content, graph),
    pending: new Map(),
    targets: new Map(),
    selectedPolicyId: sandbox.content.policies[0].id,
    activeSituationIds: new Set(),
    occurredEventIds: new Set(),
    visualMap: sandbox.visualMap,
  };
  updateSituations();
  recordLog("info", "Laboratório iniciado", [
    `${sandbox.content.policies.length} políticas carregadas.`,
    "Parâmetros demonstrativos; orçamento, dívida e votação completos ainda estão em planejamento.",
  ]);
  render();
} catch (error) {
  advanceButton.disabled = true;
  recordLog("error", "Falha ao iniciar o laboratório", [
    error instanceof Error ? error.message : String(error),
  ]);
}

// A câmera transforma apenas o desenho. Turnos e janelas mantêm seu comportamento.
const viewport = document.querySelector<HTMLElement>("#map-viewport")!;

let camera = { x: 0, y: 0, scale: 1 };
function paintCamera(): void {
  stage.style.transform = `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`;
}
function zoomAt(scale: number, x: number, y: number): void {
  const next = Math.max(0.25, Math.min(3, scale));
  const ratio = next / camera.scale;
  camera = {
    x: x - (x - camera.x) * ratio,
    y: y - (y - camera.y) * ratio,
    scale: next,
  };
  paintCamera();
}
function fitMap(): void {
  const pixelsPerUnit = MAP_PIXELS_PER_UNIT;
  const contentWidth =
    (latestMapBounds.maxX - latestMapBounds.minX) * pixelsPerUnit;
  const contentHeight =
    (latestMapBounds.maxY - latestMapBounds.minY) * pixelsPerUnit;
  const scale = Math.max(
    0.65,
    Math.min(
      viewport.clientWidth / contentWidth,
      viewport.clientHeight / contentHeight,
      1,
    ),
  );
  camera = {
    x:
      (viewport.clientWidth - contentWidth * scale) / 2 -
      latestMapBounds.minX * pixelsPerUnit * scale,
    y:
      (viewport.clientHeight - contentHeight * scale) / 2 -
      latestMapBounds.minY * pixelsPerUnit * scale,
    scale,
  };
  paintCamera();
}
zoomInButton.addEventListener("click", () => {
  zoomAt(
    camera.scale * 1.25,
    viewport.clientWidth / 2,
    viewport.clientHeight / 2,
  );
});
zoomOutButton.addEventListener("click", () => {
  zoomAt(
    camera.scale / 1.25,
    viewport.clientWidth / 2,
    viewport.clientHeight / 2,
  );
});
viewport.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    const rect = viewport.getBoundingClientRect();
    zoomAt(
      camera.scale * Math.exp(-event.deltaY * 0.002),
      event.clientX - rect.left,
      event.clientY - rect.top,
    );
  },
  { passive: false },
);
let drag: { id: number; x: number; y: number } | undefined;
viewport.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 || (event.target as HTMLElement).closest("button, a"))
    return;
  drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
  viewport.setPointerCapture(event.pointerId);
  viewport.classList.add("dragging");
  event.preventDefault();
});
viewport.addEventListener("pointermove", (event) => {
  if (!drag || drag.id !== event.pointerId) return;
  camera.x += event.clientX - drag.x;
  camera.y += event.clientY - drag.y;
  drag.x = event.clientX;
  drag.y = event.clientY;
  paintCamera();
});
for (const type of ["pointerup", "pointercancel", "lostpointercapture"])
  viewport.addEventListener(type, () => {
    drag = undefined;
    viewport.classList.remove("dragging");
  });
viewport.addEventListener("keydown", (event) => {
  if (event.target !== viewport) return;
  const moves: Record<string, [number, number]> = {
    ArrowLeft: [40, 0],
    ArrowRight: [-40, 0],
    ArrowUp: [0, 40],
    ArrowDown: [0, -40],
  };
  if (moves[event.key]) {
    event.preventDefault();
    camera.x += moves[event.key][0];
    camera.y += moves[event.key][1];
    paintCamera();
  } else if (["+", "=", "-"].includes(event.key)) {
    event.preventDefault();
    zoomAt(
      camera.scale * (event.key === "-" ? 1 / 1.2 : 1.2),
      viewport.clientWidth / 2,
      viewport.clientHeight / 2,
    );
  }
});
fitMap();

createRoot(document.getElementById("map-filters")!).render(
  createElement(MapFilters, {
    onChange: (filter: MapFilter) => {
      activeFilter = filter;
      render();
    },
  }),
);
