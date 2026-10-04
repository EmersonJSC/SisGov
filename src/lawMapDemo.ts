import { advanceLaboratoryTurn } from "./game/advanceLaboratoryTurn";
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
  advanceCameraMomentum,
  fitWorldCamera,
  focusCameraAt,
  panCamera,
  zoomCameraAt,
  type CameraVelocity,
  type WorldCamera,
} from "./world/worldCamera";
import type {
  WorldNode,
  WorldNodeKind,
  WorldPoint,
  WorldViewModel,
} from "./world/worldViewModel";
import {
  buildWorldAreas,
  buildWorldRepresentatives,
  buildWorldViewModel,
  nearestWorldNode,
} from "./world/worldViewModel";
import { PixiWorldRenderer } from "./ui/PixiWorldRenderer";
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
const viewport = document.querySelector<HTMLElement>("#map-viewport")!;
const worldHost = document.querySelector<HTMLElement>("#world-canvas")!;
const editor = document.querySelector<HTMLDialogElement>("#law-editor")!;
const turn = document.querySelector<HTMLElement>("#turn")!;
const pendingLabel = document.querySelector<HTMLElement>("#pending")!;
const advanceButton = document.querySelector<HTMLButtonElement>("#advance")!;
const resetButton = document.querySelector<HTMLButtonElement>("#reset")!;
const zoomInButton = document.querySelector<HTMLButtonElement>("#zoom-in")!;
const zoomOutButton = document.querySelector<HTMLButtonElement>("#zoom-out")!;
const accessibilityLayer = document.createElement("div");
accessibilityLayer.className = "world-accessibility-layer";
stage.append(accessibilityLayer);
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
const worldCategoryColors: Record<string, number> = {};
for (const [category, style] of Object.entries(categoryStyle))
  worldCategoryColors[category] = Number.parseInt(style.color.slice(1), 16);
function lightenColor(color: number, amount: number): number {
  const mix = (channel: number) =>
    Math.round(channel + (255 - channel) * amount);
  const red = mix((color >> 16) & 0xff);
  const green = mix((color >> 8) & 0xff);
  const blue = mix(color & 0xff);
  return (red << 16) | (green << 8) | blue;
}

function nearestMapNodeAt(
  clientX: number,
  clientY: number,
): HTMLElement | null {
  if (!physics) return null;
  const bounds = viewport.getBoundingClientRect();
  const scale = camera.scale * MAP_PIXELS_PER_UNIT;
  const point = {
    x: (clientX - bounds.left - camera.x) / scale,
    y: (clientY - bounds.top - camera.y) / scale,
  };
  const id = nearestWorldNode(
    [...physics.bodies.values()].map((body) => ({
      id: body.id,
      position: { x: body.x, y: body.y },
    })),
    point,
  );
  return id
    ? accessibilityLayer.querySelector<HTMLElement>(
        `[data-node-id="${CSS.escape(id)}"]`,
      )
    : null;
}

let mapState: MapState | undefined;
let processing = false;
let activeFilter: MapFilter = "influence";
let cachedLayout: ReturnType<typeof buildInfluenceLayout> | undefined;
let physics: MapPhysics | undefined;
let pointerHighlightedNodeId: string | undefined;
let animationFrame = 0;
let pinnedRelationId: string | undefined;
let camera: WorldCamera = { x: 0, y: 0, scale: 1 };
let worldRenderer: PixiWorldRenderer | undefined;
let latestMapBounds = { minX: 0, minY: 0, maxX: 100, maxY: 100 };
let cameraVelocity: CameraVelocity = { x: 0, y: 0 };
let cameraAnimationFrame = 0;

const journalRoot = createRoot(document.getElementById("turn-journal")!);
let journal: readonly TurnLogEntry[] = [];
function recordLog(
  level: TurnLogEntry["level"],
  title: string,
  details: readonly string[] = [],
): void {
  journal = appendTurnLog(journal, {
    turn: mapState?.execution.step ?? 0,
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
  worldRenderer?.setHighlightedNode(nodeId);
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

function render(previousValues?: Readonly<Record<string, number>>): void {
  if (!mapState) return;
  const { content, graph, execution, pending } = mapState;
  cancelAnimationFrame(animationFrame);
  animationFrame = 0;
  stage.innerHTML = "";
  stage.append(accessibilityLayer);
  accessibilityLayer.replaceChildren();
  turn.textContent = String(execution.step);
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
  const { positions, zones, macroAreas, ministryPositions, government } =
    layout;
  const worldNodes: WorldNode[] = [];
  for (const zone of zones) {
    const position = ministryPositions.get(zone.ministry);
    if (!position) continue;
    const focusButton = document.createElement("button");
    focusButton.type = "button";
    focusButton.className = "world-ministry-focus";
    focusButton.setAttribute(
      "aria-label",
      `Focar no ministério ${zone.ministry}`,
    );
    focusButton.title = `Focar no ministério ${zone.ministry}`;
    focusButton.style.left = `${position.x * MAP_PIXELS_PER_UNIT}px`;
    focusButton.style.top = `${
      (zone.center.y - zone.radius + 1.3) * MAP_PIXELS_PER_UNIT
    }px`;
    focusButton.addEventListener("click", () =>
      focusOnWorldPoint(
        {
          x: position.x * MAP_PIXELS_PER_UNIT,
          y: position.y * MAP_PIXELS_PER_UNIT,
        },
        Math.max(camera.scale, 0.9),
      ),
    );
    accessibilityLayer.append(focusButton);
  }
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
    minX: (Math.min(...horizontal) - 3) * MAP_PIXELS_PER_UNIT,
    maxX: (Math.max(...horizontal) + 3) * MAP_PIXELS_PER_UNIT,
    minY: (Math.min(...vertical) - 3) * MAP_PIXELS_PER_UNIT,
    maxY: (Math.max(...vertical) + 3) * MAP_PIXELS_PER_UNIT,
  };
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
    const node = document.createElement("button");
    node.type = "button";
    node.className = `map-node ${kind}`;
    node.dataset.nodeId = id;
    node.style.setProperty(
      "--orbit-index",
      String(stage.querySelectorAll(".map-node.policy").length),
    );
    node.style.left = `${position.x * MAP_PIXELS_PER_UNIT}px`;
    node.style.top = `${position.y * MAP_PIXELS_PER_UNIT}px`;
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
    const nodeKind: WorldNodeKind =
      kind === "situation-positive" || kind === "situation-negative"
        ? "situation"
        : kind;
    const nodeColor = worldCategoryColors[category ?? ""] ?? 0x52677c;
    const situationActive =
      nodeKind !== "situation" ||
      (mapState?.activeSituationIds.has(id) ?? false);
    const accessibleValue =
      nodeKind === "situation"
        ? situationActive
          ? "ATIVA"
          : "INATIVA"
        : (number.textContent ?? displayedValue);
    worldNodes.push({
      id,
      kind: nodeKind,
      label: name,
      position: {
        x: position.x * MAP_PIXELS_PER_UNIT,
        y: position.y * MAP_PIXELS_PER_UNIT,
      },
      diameter: finalSize,
      color: nodeColor,
      fillColor:
        kind === "policy"
          ? lightenColor(nodeColor, 0.58)
          : kind === "indicator"
            ? 0xeaf4fc
            : kind === "situation-positive"
              ? 0xeaf8f0
              : 0xfdeeee,
      borderColor:
        kind === "policy"
          ? nodeColor
          : kind === "indicator"
            ? 0x397ab5
            : kind === "situation-positive"
              ? 0x2d8a5c
              : 0xb64b4b,
      iconUrl:
        kind === "policy"
          ? (policyIcons[`./assets/svg/${iconKey}.svg`] ?? fallbackIcon)
          : undefined,
      value: accessibleValue,
      details: metricLabel,
      inactive:
        (nodeKind === "situation" && !situationActive) ||
        (activeFilter === "financial" && metrics.get(id)?.value == null),
      delta:
        delta === 0
          ? undefined
          : `${delta > 0 ? "+" : ""}${format.format(delta)}`,
    });
    node.addEventListener("focus", () => setRelationHighlight(id));
    node.addEventListener("blur", () => setRelationHighlight(pinnedRelationId));
    node.addEventListener("click", () => {
      pinnedRelationId = id;
      setRelationHighlight(id);
      onClick();
    });
    node.addEventListener("dblclick", () => focusOnWorldNode(id));
    node.addEventListener("keydown", (event) => {
      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        focusOnWorldNode(id);
      }
    });
    accessibilityLayer.append(node);
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
    const node = accessibilityLayer
      .querySelectorAll<HTMLElement>(".map-node")
      .item(worldNodes.length - 1);
    const worldNode = worldNodes.at(-1);
    if (
      worldNode &&
      (pending.has(policy.id) ||
        Math.abs((mapState.targets.get(policy.id) ?? value) - value) > 0.05)
    ) {
      worldNodes[worldNodes.length - 1] = {
        ...worldNode,
        prepared: `${pending.has(policy.id) ? "Preparado" : "Meta"}: ${controlLabel(policy, pending.get(policy.id) ?? mapState.targets.get(policy.id)!)}`,
      };
    }
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
    const node = accessibilityLayer
      .querySelectorAll<HTMLElement>(".map-node")
      .item(worldNodes.length - 1);
    if (node) {
      node.classList.toggle("inactive", !active);
    }
    const worldNode = worldNodes.at(-1);
    if (worldNode)
      worldNodes[worldNodes.length - 1] = {
        ...worldNode,
        value: active ? "ATIVA" : "INATIVA",
        inactive: !active,
      };
  }
  const worldModel: WorldViewModel = buildWorldViewModel(
    layout,
    content,
    graph,
    execution,
    worldNodes,
    worldCategoryColors,
  );
  worldRenderer?.setModel(worldModel);
  const nodes = [
    ...accessibilityLayer.querySelectorAll<HTMLElement>(".map-node"),
  ];
  if (!physics.sleeping) {
    let lastTime = performance.now();
    const animate = (now: number) => {
      if (!physics) return;
      physics.advance((now - lastTime) / 1000);
      lastTime = now;
      const snapshot = physics.snapshot();
      cachedLayout = snapshot;
      for (const node of nodes) {
        const body = physics.bodies.get(node.dataset.nodeId!);
        if (!body) continue;
        node.style.left = `${body.x * MAP_PIXELS_PER_UNIT}px`;
        node.style.top = `${body.y * MAP_PIXELS_PER_UNIT}px`;
        node.style.setProperty(
          "--size",
          `${body.radius * 2 * MAP_PIXELS_PER_UNIT}px`,
        );
      }
      worldRenderer?.setPositions(
        new Map(
          [...snapshot.positions].map(([id, position]) => [
            id,
            {
              x: position.x * MAP_PIXELS_PER_UNIT,
              y: position.y * MAP_PIXELS_PER_UNIT,
            },
          ]),
        ),
        buildWorldRepresentatives(snapshot),
        buildWorldAreas(snapshot, worldCategoryColors),
        new Map(
          [...physics.bodies].map(([id, body]) => [
            id,
            body.radius * 2 * MAP_PIXELS_PER_UNIT,
          ]),
        ),
      );
      if (!physics.sleeping) animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
  }
}

advanceButton.addEventListener("click", (event) => {
  if (!mapState || processing || event.detail > 1) return;
  processing = true;
  advanceButton.disabled = true;
  const current = mapState;
  let committed = false;
  try {
    const next = advanceLaboratoryTurn(current.content, current.graph, current);
    if (!next.ok) {
      const details = next.diagnostics.map(
        (d) => `${d.message} [${d.file} · ${d.field} · ${d.code}]`,
      );
      recordLog("error", `Turno ${current.execution.step + 1} não confirmado`, [
        "O estado e as decisões preparadas foram preservados.",
        ...details,
      ]);
      showNotice(details.join(" "));
      return;
    }
    const previous = current.execution.values;
    const beforeSituations = current.activeSituationIds;
    const details: string[] = [
      `${current.pending.size} decisões preparadas; ${next.value.explanations.length} resultados calculados.`,
      "Laboratório: um clique executa um passo técnico. Calendário, votação e financiamento da dívida ainda não estão integrados.",
    ];
    for (const policy of current.content.policies) {
      const id = policy.controle.variavel;
      if (next.value.execution.values[id] !== previous[id])
        details.push(
          `${policy.nome}: ${controlLabel(policy, previous[id])} → ${controlLabel(policy, next.value.execution.values[id])}; meta ${controlLabel(policy, next.value.targets.get(policy.id) ?? next.value.execution.values[id])}.`,
        );
    }
    for (const explanation of next.value.explanations) {
      const node = current.graph.nodesById[explanation.targetId];
      const causes = explanation.contributions.map((c) => {
        const source =
          current.content.policies.find((p) => p.id === c.policyOrEventId)
            ?.nome ?? c.policyOrEventId;
        const relation = current.graph.relationsById[c.relationId];
        return `${source}: ${format.format(c.contribution)} (origem ${format.format(c.sourceValue)}, atraso ${relation.delaySteps})`;
      });
      details.push(
        `${node.nome}: ${format.format(explanation.previousValue)} → ${format.format(explanation.result)} ${node.unidade}. Base ${format.format(explanation.baseValue)}; ${causes.join("; ") || "sem contribuições ativas"}.`,
      );
    }
    for (const situation of current.content.situations) {
      const was = beforeSituations.has(situation.id),
        now = next.value.activeSituationIds.has(situation.id);
      if (was !== now)
        details.push(
          `${now ? "Situação iniciada" : "Situação encerrada"}: ${situation.nome}.`,
        );
    }
    mapState = {
      ...current,
      execution: next.value.execution,
      targets: next.value.targets,
      activeSituationIds: next.value.activeSituationIds,
      pending: new Map(),
    };
    committed = true;
    turn.textContent = String(mapState.execution.step);
    recordLog(
      "success",
      `Turno ${mapState.execution.step} confirmado`,
      details,
    );
    render(previous);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    recordLog(
      "error",
      committed
        ? "Turno confirmado; falha ao atualizar a tela"
        : "Falha ao preparar o turno",
      [
        detail,
        committed
          ? "O turno já foi confirmado. Não repita a decisão para corrigir a exibição."
          : "O estado e as decisões preparadas foram preservados.",
      ],
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
  updateSituations();
  mapState.pending.clear();
  recordLog("info", "Partida reiniciada", [
    "Estado inicial restaurado. Os registros anteriores permanecem nesta sessão.",
  ]);
  render();
});

try {
  const sandbox = createD4ReferenceSandbox();
  mapState = {
    content: sandbox.content,
    graph: sandbox.graph,
    execution: createExecution(sandbox.content, sandbox.graph),
    pending: new Map(),
    targets: new Map(),
    selectedPolicyId: sandbox.content.policies[0].id,
    activeSituationIds: new Set(),
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

function paintCamera(): void {
  worldRenderer?.setCamera(camera);
}

function zoomAt(scale: number, x: number, y: number): void {
  camera = zoomCameraAt(camera, scale, { x, y });
  cameraVelocity = { x: 0, y: 0 };
  paintCamera();
}

function focusOnWorldPoint(point: WorldPoint, scale = camera.scale): void {
  camera = focusCameraAt(
    camera,
    point,
    { x: viewport.clientWidth, y: viewport.clientHeight },
    scale,
  );
  cameraVelocity = { x: 0, y: 0 };
  paintCamera();
}

function focusOnWorldNode(id: string): void {
  const body = physics?.bodies.get(id);
  if (!body) return;
  focusOnWorldPoint(
    {
      x: body.x * MAP_PIXELS_PER_UNIT,
      y: body.y * MAP_PIXELS_PER_UNIT,
    },
    Math.max(camera.scale, 1.1),
  );
}

function fitMap(): void {
  camera = fitWorldCamera(latestMapBounds, {
    x: viewport.clientWidth,
    y: viewport.clientHeight,
  });
  cameraVelocity = { x: 0, y: 0 };
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
let lastDragTime = 0;
let inertiaTime = 0;
function animateCameraInertia(now: number): void {
  if (drag || Math.hypot(cameraVelocity.x, cameraVelocity.y) < 8) {
    cameraVelocity = { x: 0, y: 0 };
    cameraAnimationFrame = 0;
    return;
  }
  const elapsed = inertiaTime === 0 ? 0 : (now - inertiaTime) / 1000;
  inertiaTime = now;
  const next = advanceCameraMomentum(camera, cameraVelocity, elapsed);
  camera = next.camera;
  cameraVelocity = next.velocity;
  paintCamera();
  if (next.active)
    cameraAnimationFrame = requestAnimationFrame(animateCameraInertia);
  else cameraAnimationFrame = 0;
}

viewport.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 || (event.target as HTMLElement).closest("button, a"))
    return;
  cancelAnimationFrame(cameraAnimationFrame);
  cameraAnimationFrame = 0;
  cameraVelocity = { x: 0, y: 0 };
  drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
  lastDragTime = performance.now();
  viewport.setPointerCapture(event.pointerId);
  viewport.classList.add("dragging");
  event.preventDefault();
});
viewport.addEventListener("pointermove", (event) => {
  if (!drag) {
    const target =
      event.target instanceof Element
        ? event.target.closest(".map-node")
        : null;
    const nearest = target
      ? nearestMapNodeAt(event.clientX, event.clientY)
      : null;
    const hoveredId = nearest?.dataset.nodeId;
    if (hoveredId !== pointerHighlightedNodeId) {
      pointerHighlightedNodeId = hoveredId;
      setRelationHighlight(hoveredId ?? pinnedRelationId);
    }
  }
  if (!drag || drag.id !== event.pointerId) return;
  const delta = { x: event.clientX - drag.x, y: event.clientY - drag.y };
  const now = performance.now();
  const seconds = Math.max((now - lastDragTime) / 1000, 0.001);
  camera = panCamera(camera, delta);
  cameraVelocity = {
    x: Math.max(-1800, Math.min(1800, delta.x / seconds)),
    y: Math.max(-1800, Math.min(1800, delta.y / seconds)),
  };
  drag.x = event.clientX;
  drag.y = event.clientY;
  lastDragTime = now;
  paintCamera();
});
viewport.addEventListener(
  "click",
  (event) => {
    if (event.detail === 0 || !(event.target instanceof Element)) return;
    const clicked = event.target.closest<HTMLElement>(".map-node");
    if (!clicked) return;
    const nearest = nearestMapNodeAt(event.clientX, event.clientY);
    if (!nearest || nearest === clicked) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    nearest.click();
  },
  true,
);
viewport.addEventListener("pointerleave", () => {
  if (drag || !pointerHighlightedNodeId) return;
  pointerHighlightedNodeId = undefined;
  setRelationHighlight(pinnedRelationId);
});
for (const type of ["pointerup", "pointercancel", "lostpointercapture"])
  viewport.addEventListener(type, () => {
    if (type === "pointerup" && drag) {
      inertiaTime = 0;
      cameraAnimationFrame = requestAnimationFrame(animateCameraInertia);
    }
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
    camera = panCamera(camera, {
      x: moves[event.key][0],
      y: moves[event.key][1],
    });
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
const resizeObserver = new ResizeObserver(() => {
  cameraVelocity = { x: 0, y: 0 };
  paintCamera();
});
resizeObserver.observe(viewport);

const worldRendererInstance = new PixiWorldRenderer(
  worldHost,
  accessibilityLayer,
);
worldRenderer = worldRendererInstance;
void worldRendererInstance
  .initialize()
  .then(() => {
    render();
    fitMap();
  })
  .catch((error: unknown) => {
    recordLog("error", "Falha ao iniciar o mapa gráfico", [
      error instanceof Error ? error.message : String(error),
      "Os controles HTML continuam disponíveis, mas a renderização espacial não foi iniciada.",
    ]);
    showNotice("Não foi possível iniciar o renderizador do mapa.");
  });

fitMap();

window.addEventListener(
  "pagehide",
  () => {
    cancelAnimationFrame(animationFrame);
    cancelAnimationFrame(cameraAnimationFrame);
    resizeObserver.disconnect();
    worldRendererInstance.destroy();
    worldRenderer = undefined;
  },
  { once: true },
);

createRoot(document.getElementById("map-filters")!).render(
  createElement(MapFilters, {
    onChange: (filter: MapFilter) => {
      activeFilter = filter;
      render();
    },
  }),
);
