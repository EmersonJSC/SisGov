import {
  Application,
  Container,
  Graphics,
  Sprite,
  Text,
  Texture,
} from "pixi.js";
import {
  isWorldNodeVisible,
  resolveWorldLevelOfDetail,
  type WorldArea,
  type WorldGroup,
  type WorldNode,
  type WorldPoint,
  type WorldRepresentative,
  type WorldViewModel,
} from "../world/worldViewModel";
import type { WorldCamera as Camera } from "../world/worldCamera";

const formatText = (
  fill: number,
  fontSize: number,
  fontWeight: "700" | "800" | "900",
) => ({
  fill,
  fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
  fontSize,
  fontWeight,
  align: "center" as const,
});

type NodeDisplay = {
  container: Container;
  shape: Graphics;
  nameBackground: Graphics;
  diameter: number;
  icon?: Sprite;
  iconFallback?: Text;
  name: Text;
  value: Text;
  prepared: Text;
};

export class PixiWorldRenderer {
  private readonly app = new Application();
  private readonly world = new Container();
  private readonly areas = new Graphics();
  private readonly connections = new Graphics();
  private readonly groups = new Container();
  private readonly representatives = new Container();
  private readonly nodes = new Container();
  private readonly labels = new Container();
  private readonly nodeDisplays = new Map<string, NodeDisplay>();
  private readonly groupDisplays = new Map<string, Container>();
  private readonly representativeDisplays = new Map<string, Container>();
  private readonly representativeLabels = new Map<string, Text>();
  private readonly areaLabels = new Map<string, Text>();
  private readonly resizeObserver: ResizeObserver;
  private model: WorldViewModel = {
    areas: [],
    representatives: [],
    nodes: [],
    connections: [],
    groups: [],
  };
  private positions = new Map<string, WorldPoint>();
  private highlightedNodeId: string | undefined;
  private connectionAnimationFrame = 0;
  private connectionAnimationTime = 0;
  private connectionAnimationLastTime = 0;
  private camera: Camera = { x: 0, y: 0, scale: 1 };
  private initialized = false;
  private destroyed = false;

  constructor(
    private readonly host: HTMLElement,
    private readonly accessibilityLayer: HTMLElement,
  ) {
    this.resizeObserver = new ResizeObserver((entries) => {
      const bounds = entries[0]?.contentRect;
      if (!bounds || !this.initialized) return;
      this.app.renderer.resize(bounds.width, bounds.height);
      this.drawAreas();
      this.drawConnections();
      this.drawDetail();
      this.app.render();
    });
  }

  async initialize(): Promise<void> {
    try {
      await this.app.init({
        antialias: true,
        autoStart: false,
        backgroundAlpha: 0,
        preference: "webgl",
        resolution: Math.min(window.devicePixelRatio || 1, 2),
      });
      if (this.destroyed) {
        this.app.destroy(
          { removeView: true },
          { children: true, texture: false, textureSource: false },
        );
        return;
      }
      this.initialized = true;
      this.world.addChild(
        this.areas,
        this.connections,
        this.groups,
        this.representatives,
        this.nodes,
        this.labels,
      );
      this.app.stage.addChild(this.world);
      this.app.canvas.setAttribute("aria-hidden", "true");
      this.app.canvas.setAttribute("role", "presentation");
      this.app.canvas.tabIndex = -1;
      this.app.canvas.style.pointerEvents = "none";
      this.host.appendChild(this.app.canvas);
      this.resizeObserver.observe(this.host);
      const bounds = this.host.getBoundingClientRect();
      this.app.renderer.resize(bounds.width, bounds.height);
      this.setModel(this.model);
      this.setCamera(this.camera);
    } catch (error) {
      this.destroy();
      throw error;
    }
  }

  get canvas(): HTMLCanvasElement {
    return this.app.canvas;
  }

  setModel(model: WorldViewModel): void {
    this.model = model;
    this.positions = new Map(
      model.nodes.map((node) => [node.id, node.position]),
    );
    if (!this.initialized) return;
    this.reconcileNodes(model.nodes);
    this.reconcileGroups(model.groups);
    this.drawAreas();
    this.drawConnections();
    this.drawDetail();
    this.app.render();
    this.animateHighlightedConnections();
  }

  setPositions(
    positions: ReadonlyMap<string, WorldPoint>,
    representatives: readonly WorldRepresentative[],
    areas: readonly WorldArea[],
    diameters?: ReadonlyMap<string, number>,
  ): void {
    this.positions = new Map(positions);
    this.model = {
      ...this.model,
      representatives,
      areas,
    };
    if (!this.initialized) return;
    for (const node of this.model.nodes) {
      const position = positions.get(node.id);
      const display = this.nodeDisplays.get(node.id);
      if (position && display) {
        this.updateNodeDisplay(display, node, diameters?.get(node.id));
      }
    }
    for (const representative of representatives) {
      const display = this.representativeDisplays.get(representative.id);
      display?.position.set(representative.center.x, representative.center.y);
      const label = this.representativeLabels.get(representative.id);
      label?.position.set(
        representative.center.x,
        representative.center.y + representative.radius + 5,
      );
    }
    for (const area of areas) {
      const label = this.areaLabels.get(area.id);
      if (!label) continue;
      label.position.set(
        area.center.x,
        area.center.y - area.radiusY + (area.kind === "federal" ? 0 : 20.8),
      );
    }
    this.drawAreas();
    this.drawConnections();
    this.app.render();
  }

  setCamera(camera: Camera): void {
    this.camera = camera;
    if (!this.initialized) return;
    this.world.position.set(camera.x, camera.y);
    this.world.scale.set(camera.scale);
    this.accessibilityLayer.style.transform = `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`;
    this.updateLevelOfDetail();
    this.app.render();
  }

  setHighlightedNode(id: string | undefined): void {
    if (this.highlightedNodeId === id) return;
    this.highlightedNodeId = id;
    if (!this.initialized) return;
    if (!id && this.connectionAnimationFrame) {
      cancelAnimationFrame(this.connectionAnimationFrame);
      this.connectionAnimationFrame = 0;
    }
    this.connectionAnimationLastTime = 0;
    this.drawConnections();
    this.updateLevelOfDetail();
    this.app.render();
    this.animateHighlightedConnections();
  }

  destroy(): void {
    this.destroyed = true;
    if (this.connectionAnimationFrame)
      cancelAnimationFrame(this.connectionAnimationFrame);
    this.connectionAnimationFrame = 0;
    this.resizeObserver.disconnect();
    if (!this.initialized) return;
    this.initialized = false;
    this.app.destroy(
      { removeView: true },
      { children: true, texture: false, textureSource: false },
    );
    this.nodeDisplays.clear();
    this.groupDisplays.clear();
    this.representativeDisplays.clear();
    this.representativeLabels.clear();
    this.areaLabels.clear();
  }

  private reconcileNodes(nodes: readonly WorldNode[]): void {
    const activeIds = new Set(nodes.map((node) => node.id));
    for (const [id, display] of this.nodeDisplays) {
      if (activeIds.has(id)) continue;
      this.nodes.removeChild(display.container);
      display.container.destroy({ children: true });
      this.nodeDisplays.delete(id);
    }

    for (const node of nodes) {
      let display = this.nodeDisplays.get(node.id);
      if (!display) {
        display = this.createNodeDisplay(node);
        this.nodeDisplays.set(node.id, display);
        this.nodes.addChild(display.container);
      }
      this.updateNodeDisplay(display, node, undefined, true);
    }
  }

  private createNodeDisplay(node: WorldNode): NodeDisplay {
    const container = new Container();
    const shape = new Graphics();
    const nameBackground = new Graphics();
    let icon: Sprite | undefined;
    let iconFallback: Text | undefined;
    if (node.iconUrl) {
      icon = new Sprite(Texture.from(node.iconUrl));
      icon.anchor.set(0.5);
    } else if (node.abbreviation) {
      iconFallback = new Text({
        text: node.abbreviation,
        style: formatText(0x33485b, 11, "800"),
      });
      iconFallback.anchor.set(0.5);
    }
    const name = new Text({
      text: node.label,
      style: formatText(0x25394d, 13, "700"),
    });
    name.anchor.set(0.5, 0);
    const value = new Text({
      text: node.value ?? "",
      style: formatText(0x25394d, 12, "800"),
    });
    value.anchor.set(0.5);
    const prepared = new Text({
      text: node.prepared ?? "",
      style: formatText(0xffffff, 10, "700"),
    });
    prepared.anchor.set(0.5, 0);
    container.addChild(
      shape,
      nameBackground,
      ...(icon ? [icon] : []),
      ...(iconFallback ? [iconFallback] : []),
      name,
      value,
      prepared,
    );
    return {
      container,
      shape,
      nameBackground,
      diameter: 0,
      icon,
      iconFallback,
      name,
      value,
      prepared,
    };
  }

  private updateNodeDisplay(
    display: NodeDisplay,
    node: WorldNode,
    diameter = node.diameter,
    forceShapeUpdate = false,
  ): void {
    const position = this.positions.get(node.id) ?? node.position;
    const radius = diameter / 2;
    display.container.position.set(position.x, position.y);
    display.container.alpha = node.inactive ? 0.62 : 1;
    if (forceShapeUpdate || Math.abs(display.diameter - diameter) >= 0.1) {
      display.shape
        .clear()
        .circle(0, 0, radius + 7)
        .fill({ color: node.color, alpha: 0.2 })
        .circle(0, 0, radius + 2)
        .fill({ color: node.borderColor, alpha: 0.2 })
        .circle(0, 0, radius)
        .fill({ color: node.fillColor, alpha: 0.96 })
        .stroke({ color: 0xffffff, alpha: 0.95, width: 3 })
        .circle(0, 0, Math.max(1, radius - 2))
        .stroke({ color: node.borderColor, alpha: 0.9, width: 1.5 });
      display.diameter = diameter;
    }
    if (display.icon) {
      const iconSize = Math.min(36, Math.max(16, radius * 0.62));
      display.icon.width = iconSize;
      display.icon.height = iconSize;
      display.icon.y = node.value ? -radius * 0.28 : 0;
    }
    if (display.iconFallback) {
      display.iconFallback.text = node.abbreviation ?? "";
      display.iconFallback.y = node.value ? -radius * 0.28 : 0;
    }
    if (display.name.text !== node.label) display.name.text = node.label;
    display.name.position.set(0, radius + 8);
    display.name.style.wordWrap = true;
    display.name.style.wordWrapWidth = Math.max(80, radius * 4);
    const labelWidth = Math.min(220, Math.max(84, display.name.width + 16));
    const labelHeight = Math.max(24, display.name.height + 10);
    display.nameBackground
      .clear()
      .roundRect(-labelWidth / 2, radius + 3, labelWidth, labelHeight, 6)
      .fill({ color: 0xffffff, alpha: 0.97 })
      .stroke({ color: node.color, alpha: 0.62, width: 1 });
    if (display.value.text !== (node.value ?? ""))
      display.value.text = node.value ?? "";
    display.value.position.set(0, radius * 0.43);
    if (display.prepared.text !== (node.prepared ?? ""))
      display.prepared.text = node.prepared ?? "";
    display.prepared.position.set(0, radius + 26);
  }

  private reconcileGroups(groups: readonly WorldGroup[]): void {
    const activeIds = new Set(groups.map((group) => group.id));
    for (const [id, display] of this.groupDisplays) {
      if (activeIds.has(id)) continue;
      this.groups.removeChild(display);
      display.destroy({ children: true });
      this.groupDisplays.delete(id);
    }
    for (const group of groups) {
      let display = this.groupDisplays.get(group.id);
      if (!display) {
        display = new Container();
        const shape = new Graphics()
          .circle(0, 0, 28)
          .fill({ color: group.color, alpha: 0.2 })
          .stroke({ color: group.color, alpha: 0.82, width: 2 });
        const count = new Text({
          text: String(group.count),
          style: formatText(group.color, 16, "800"),
        });
        count.anchor.set(0.5);
        const labelBackground = new Graphics()
          .roundRect(-82, 34, 164, 24, 8)
          .fill({ color: 0xffffff, alpha: 0.96 })
          .stroke({ color: group.color, alpha: 0.55, width: 1 });
        const label = new Text({
          text: group.label.replace(/^Ministério (?:da|do|de|dos|das) /, ""),
          style: formatText(0x24394d, 10, "800"),
        });
        label.anchor.set(0.5);
        label.style.wordWrap = true;
        label.style.wordWrapWidth = 154;
        label.position.set(0, 46);
        display.addChild(shape, count, labelBackground, label);
        this.groupDisplays.set(group.id, display);
        this.groups.addChild(display);
      }
      display.position.set(group.center.x, group.center.y);
      const count = display.children[1];
      if (count instanceof Text) count.text = String(group.count);
      const label = display.children[3];
      if (label instanceof Text)
        label.text = group.label.replace(
          /^Ministério (?:da|do|de|dos|das) /,
          "",
        );
    }
  }

  private drawAreas(): void {
    this.areas.clear();
    for (const area of this.model.areas) {
      const x = area.center.x;
      const y = area.center.y;
      const radiusX = area.radiusX;
      const radiusY = area.radiusY;
      const alpha =
        area.kind === "federal" ? 0.055 : area.kind === "ministry" ? 0.1 : 0.08;
      this.areas
        .ellipse(x, y, radiusX, radiusY)
        .fill({ color: area.color, alpha })
        .ellipse(x, y, radiusX, radiusY)
        .stroke({
          color: area.color,
          alpha: area.kind === "ministry" ? 0.36 : 0.24,
          width: area.kind === "ministry" ? 2.5 : 1.5,
        });
    }
    const policyOrbits = new Map<string, number[]>(
      this.model.representatives.map((representative) => [
        representative.id,
        [],
      ]),
    );
    for (const node of this.model.nodes) {
      if (node.kind !== "policy") continue;
      const position = this.positions.get(node.id) ?? node.position;
      let nearest: WorldRepresentative | undefined;
      let nearestDistance = Number.POSITIVE_INFINITY;
      for (const representative of this.model.representatives) {
        const distance = Math.hypot(
          position.x - representative.center.x,
          position.y - representative.center.y,
        );
        if (distance < nearestDistance) {
          nearest = representative;
          nearestDistance = distance;
        }
      }
      if (nearest) policyOrbits.get(nearest.id)?.push(nearestDistance);
    }
    for (const representative of this.model.representatives) {
      const distances = policyOrbits.get(representative.id);
      if (!distances?.length) continue;
      const radius =
        distances.reduce((sum, distance) => sum + distance, 0) /
        distances.length;
      const color = representative.role === "president" ? 0x318978 : 0x5c82a6;
      this.areas
        .circle(representative.center.x, representative.center.y, radius)
        .stroke({ color, alpha: 0.08, width: 7 })
        .circle(representative.center.x, representative.center.y, radius)
        .stroke({ color, alpha: 0.34, width: 1.5 });
    }
    for (const representative of this.model.representatives) {
      const radius = representative.radius;
      this.areas
        .circle(representative.center.x, representative.center.y, radius + 6)
        .fill({
          color: representative.role === "president" ? 0x194b43 : 0x203b57,
          alpha: 0.09,
        });
    }
  }

  private drawConnections(): void {
    this.connections.clear();
    if (!this.highlightedNodeId) return;
    for (const relation of this.model.connections) {
      if (
        relation.originId !== this.highlightedNodeId &&
        relation.targetId !== this.highlightedNodeId
      )
        continue;
      const origin = this.positions.get(relation.originId);
      const target = this.positions.get(relation.targetId);
      if (!origin || !target) continue;
      const x1 = origin.x;
      const y1 = origin.y;
      const x2 = target.x;
      const y2 = target.y;
      const strength = Math.max(0, Math.min(1, relation.strength));
      const width = 1.1 + strength * 1.5;
      this.connections
        .moveTo(x1, y1)
        .lineTo(x2, y2)
        .stroke({
          color: relation.color,
          alpha: relation.condition ? 0.55 : 0.88,
          width,
        });
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const arrowLength = 8 + width * 2;
      this.connections
        .moveTo(x2, y2)
        .lineTo(
          x2 - Math.cos(angle - 0.48) * arrowLength,
          y2 - Math.sin(angle - 0.48) * arrowLength,
        )
        .lineTo(
          x2 - Math.cos(angle + 0.48) * arrowLength,
          y2 - Math.sin(angle + 0.48) * arrowLength,
        )
        .closePath()
        .fill({ color: relation.color, alpha: 0.9 });
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const speed = 0.35 + strength * 1.1;
        for (const offset of [0, 0.5]) {
          const progress = (this.connectionAnimationTime * speed + offset) % 1;
          this.connections
            .circle(
              x1 + (x2 - x1) * progress,
              y1 + (y2 - y1) * progress,
              2 + strength * 2,
            )
            .fill({ color: relation.color, alpha: 0.98 });
        }
      }
    }
  }

  private animateHighlightedConnections(): void {
    if (
      this.connectionAnimationFrame ||
      !this.initialized ||
      !this.highlightedNodeId ||
      !this.hasHighlightedConnections() ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const animate = (now: number) => {
      this.connectionAnimationFrame = 0;
      if (
        this.destroyed ||
        !this.initialized ||
        !this.highlightedNodeId ||
        !this.hasHighlightedConnections() ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;
      const elapsed =
        this.connectionAnimationLastTime === 0
          ? 0
          : Math.min((now - this.connectionAnimationLastTime) / 1000, 0.05);
      this.connectionAnimationLastTime = now;
      this.connectionAnimationTime += elapsed;
      this.drawConnections();
      this.app.render();
      this.connectionAnimationFrame = requestAnimationFrame(animate);
    };

    this.connectionAnimationFrame = requestAnimationFrame(animate);
  }

  private hasHighlightedConnections(): boolean {
    return this.model.connections.some(
      (relation) =>
        (relation.originId === this.highlightedNodeId ||
          relation.targetId === this.highlightedNodeId) &&
        this.positions.has(relation.originId) &&
        this.positions.has(relation.targetId),
    );
  }

  private drawDetail(): void {
    this.representatives.removeChildren().forEach((child) => {
      child.destroy({ children: true });
    });
    this.labels.removeChildren().forEach((child) => {
      child.destroy({ children: true });
    });
    this.representativeDisplays.clear();
    this.representativeLabels.clear();
    this.areaLabels.clear();
    for (const representative of this.model.representatives) {
      const container = new Container({
        x: representative.center.x,
        y: representative.center.y,
      });
      const radius = representative.radius;
      const circle = new Graphics()
        .circle(0, 0, radius)
        .fill({
          color: representative.role === "president" ? 0x194b43 : 0x203b57,
        })
        .stroke({
          color: 0xdbe5ef,
          alpha: 0.88,
          width: representative.role === "president" ? 3 : 2,
        });
      const symbol = new Text({
        text: representative.role === "president" ? "P" : "M",
        style: formatText(0xffffff, 20, "800"),
      });
      symbol.anchor.set(0.5);
      container.addChild(circle, symbol);
      this.representatives.addChild(container);
      this.representativeDisplays.set(representative.id, container);

      const label = new Text({
        text:
          representative.role === "minister"
            ? representative.institution
            : representative.label,
        style: formatText(0x25394d, 12, "700"),
      });
      label.anchor.set(0.5, 0);
      label.position.set(
        representative.center.x,
        representative.center.y + radius + 5,
      );
      this.labels.addChild(label);
      this.representativeLabels.set(representative.id, label);
    }
    for (const area of this.model.areas) {
      const label = new Text({
        text: area.label,
        style: formatText(area.color, area.kind === "federal" ? 14 : 13, "800"),
      });
      label.anchor.set(0.5);
      label.position.set(area.center.x, area.center.y - area.radiusY + 20.8);
      this.labels.addChild(label);
      this.areaLabels.set(area.id, label);
    }
    this.representatives.visible = true;
    this.labels.visible = true;
    this.updateLevelOfDetail();
  }

  private updateLevelOfDetail(): void {
    if (!this.initialized) return;
    const level = resolveWorldLevelOfDetail(this.camera.scale);
    this.accessibilityLayer.dataset.lod = level;
    const viewport = this.host.getBoundingClientRect();
    const margin = 140 / this.camera.scale;
    const minX = -this.camera.x / this.camera.scale - margin;
    const minY = -this.camera.y / this.camera.scale - margin;
    const maxX = (viewport.width - this.camera.x) / this.camera.scale + margin;
    const maxY = (viewport.height - this.camera.y) / this.camera.scale + margin;
    this.groups.visible = false;
    for (const [id, label] of this.areaLabels) {
      const area = this.model.areas.find((item) => item.id === id);
      if (!area) continue;
      label.visible =
        area.kind === "federal"
          ? level === "overview" || level === "groups"
          : level !== "overview";
    }
    for (const label of this.representativeLabels.values())
      label.visible = level === "overview" || level === "groups";
    for (const node of this.model.nodes) {
      const display = this.nodeDisplays.get(node.id);
      if (!display) continue;
      const selected = node.id === this.highlightedNodeId;
      const visible = isWorldNodeVisible(node.kind, level, selected);
      const position = this.positions.get(node.id) ?? node.position;
      const radius = node.diameter / 2;
      display.container.visible =
        visible &&
        position.x + radius >= minX &&
        position.x - radius <= maxX &&
        position.y + radius >= minY &&
        position.y - radius <= maxY;
      display.name.visible = level === "details" || selected;
      display.nameBackground.visible = display.name.visible;
      display.value.visible = level !== "overview" && node.value !== undefined;
      display.prepared.visible =
        level === "details" && selected && node.prepared !== undefined;
    }
    this.drawConnections();
  }
}
