export type WorldPoint = Readonly<{ x: number; y: number }>;
export type WorldNodeKind = "policy" | "indicator" | "situation";
export type WorldNode = Readonly<{
  id: string;
  kind: WorldNodeKind;
  label: string;
  position: WorldPoint;
  diameter: number;
  color: number;
  fillColor: number;
  borderColor: number;
  iconUrl?: string;
  abbreviation?: string;
  value?: string;
  details?: string;
  inactive?: boolean;
  prepared?: string;
  delta?: string;
}>;
export type WorldArea = Readonly<{
  id: string;
  kind: "federal" | "macro" | "ministry";
  label: string;
  center: WorldPoint;
  radiusX: number;
  radiusY: number;
  color: number;
}>;
export type WorldRepresentative = Readonly<{
  id: string;
  label: string;
  institution: string;
  role: "president" | "minister";
  center: WorldPoint;
  radius: number;
}>;
export type WorldConnection = Readonly<{
  id: string;
  originId: string;
  targetId: string;
  color: number;
  strength: number;
  condition?: boolean;
}>;
export type WorldGroup = Readonly<{
  id: string;
  label: string;
  center: WorldPoint;
  color: number;
  count: number;
}>;
export type WorldViewModel = Readonly<{
  areas: readonly WorldArea[];
  representatives: readonly WorldRepresentative[];
  nodes: readonly WorldNode[];
  connections: readonly WorldConnection[];
  groups: readonly WorldGroup[];
}>;

export function nearestWorldNode(
  nodes: readonly Pick<WorldNode, "id" | "position">[],
  point: WorldPoint,
): string | undefined {
  let nearestId: string | undefined;
  let nearestDistance = Number.POSITIVE_INFINITY;
  for (const node of nodes) {
    const dx = node.position.x - point.x;
    const dy = node.position.y - point.y;
    const distance = dx * dx + dy * dy;
    if (distance < nearestDistance) {
      nearestId = node.id;
      nearestDistance = distance;
    }
  }
  return nearestId;
}

export function buildWorldAreas(
  layout: InfluenceLayout,
  categoryColors: Readonly<Record<string, number>>,
): WorldArea[] {
  return [
    {
      id: "government",
      kind: "federal",
      label: layout.government.name,
      center: {
        x: layout.government.center.x * MAP_PIXELS_PER_UNIT,
        y: layout.government.center.y * MAP_PIXELS_PER_UNIT,
      },
      radiusX: layout.government.radius * MAP_PIXELS_PER_UNIT,
      radiusY: layout.government.radius * MAP_PIXELS_PER_UNIT,
      color: 0x1f4064,
    },
    ...layout.macroAreas.map((area) => ({
      id: area.id,
      kind: "macro" as const,
      label: area.name,
      center: {
        x: area.center.x * MAP_PIXELS_PER_UNIT,
        y: area.center.y * MAP_PIXELS_PER_UNIT,
      },
      radiusX: area.radiusX * MAP_PIXELS_PER_UNIT,
      radiusY: area.radiusY * MAP_PIXELS_PER_UNIT,
      color: parseColor(area.color, 0x657a8d),
    })),
    ...layout.zones.map((zone) => ({
      id: `ministry:${zone.ministry}`,
      kind: "ministry" as const,
      label: zone.ministry
        .replace("Ministério da ", "")
        .replace("Ministério do ", "")
        .replace("Ministério de ", ""),
      center: {
        x: zone.center.x * MAP_PIXELS_PER_UNIT,
        y: zone.center.y * MAP_PIXELS_PER_UNIT,
      },
      radiusX: zone.radius * MAP_PIXELS_PER_UNIT,
      radiusY: zone.radius * MAP_PIXELS_PER_UNIT,
      color: categoryColors[zone.category] ?? 0x6c6677,
    })),
  ];
}

export function buildWorldRepresentatives(
  layout: InfluenceLayout,
): WorldRepresentative[] {
  return layout.representatives.map((representative) => ({
    id: representative.id,
    label: representative.name,
    institution: representative.institution,
    role: representative.role,
    center: {
      x: representative.center.x * MAP_PIXELS_PER_UNIT,
      y: representative.center.y * MAP_PIXELS_PER_UNIT,
    },
    radius: representative.radius * MAP_PIXELS_PER_UNIT,
  }));
}

export function buildWorldConnections(
  graph: ScenarioGraph,
  execution: EngineExecution,
  content: ResolvedPackage,
): WorldConnection[] {
  const strengths = graph.relations.map(
    (relation) =>
      Math.abs(relation.parameters.coeficiente) *
      Math.abs(execution.values[relation.originId] ?? 0),
  );
  const maximum = Math.max(...strengths, 0.01);
  const connections: WorldConnection[] = graph.relations.map((relation) => ({
    id: relation.id,
    originId:
      relation.sourceType === "situacao"
        ? relation.sourceId
        : relation.originId,
    targetId: relation.targetId,
    color: relation.parameters.coeficiente >= 0 ? 0x25865a : 0xbe4f4f,
    strength: Math.min(
      1,
      (Math.abs(relation.parameters.coeficiente) *
        Math.abs(execution.values[relation.originId] ?? 0)) /
        maximum,
    ),
  }));
  for (const situation of content.situations) {
    if (!situation.entraQuando) continue;
    connections.push({
      id: `condition:${situation.id}`,
      originId: situation.entraQuando.variavel,
      targetId: situation.id,
      color: 0x8da3b7,
      strength: 0,
      condition: true,
    });
  }
  return connections;
}

export function buildWorldGroups(
  content: ResolvedPackage,
  layout: InfluenceLayout,
  categoryColors: Readonly<Record<string, number>>,
): WorldGroup[] {
  return layout.zones.flatMap((zone) => {
    const count = content.policies.filter(
      (policy) => policy.ministerio === zone.ministry,
    ).length;
    if (count === 0) return [];
    return [
      {
        id: `group:${zone.ministry}`,
        label: zone.ministry,
        center: {
          x: zone.center.x * MAP_PIXELS_PER_UNIT,
          y: (zone.center.y + zone.radius * 0.46) * MAP_PIXELS_PER_UNIT,
        },
        color: categoryColors[zone.category] ?? 0x52677c,
        count,
      },
    ];
  });
}

export function buildWorldViewModel(
  layout: InfluenceLayout,
  content: ResolvedPackage,
  graph: ScenarioGraph,
  execution: EngineExecution,
  nodes: readonly WorldNode[],
  categoryColors: Readonly<Record<string, number>>,
): WorldViewModel {
  return {
    areas: buildWorldAreas(layout, categoryColors),
    representatives: buildWorldRepresentatives(layout),
    nodes,
    connections: buildWorldConnections(graph, execution, content),
    groups: buildWorldGroups(content, layout, categoryColors),
  };
}

function parseColor(color: string, fallback: number): number {
  return color.startsWith("#") ? Number.parseInt(color.slice(1), 16) : fallback;
}

export type WorldLevelOfDetail = "overview" | "groups" | "nodes" | "details";

export function resolveWorldLevelOfDetail(zoom: number): WorldLevelOfDetail {
  if (zoom < 0.42) return "overview";
  if (zoom < 0.78) return "groups";
  if (zoom < 1.5) return "nodes";
  return "details";
}

export function isWorldNodeVisible(
  kind: WorldNodeKind,
  level: WorldLevelOfDetail,
  selected: boolean,
): boolean {
  void kind;
  void level;
  void selected;
  return true;
}
import type {
  EngineExecution,
  ResolvedPackage,
  ScenarioGraph,
} from "../engine";
import { MAP_PIXELS_PER_UNIT } from "../mapMetrics";
import type { InfluenceLayout } from "../influenceLayout";
