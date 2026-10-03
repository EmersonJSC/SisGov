import { MapPhysics } from "./mapPhysics";
import type { ResolvedPackage } from "./engine";
import type { FinancialRole } from "./mapMetrics";

export type InfluencePoint = Readonly<{ x: number; y: number }>;
export type VisualNodeKind =
  | "representative"
  | "government"
  | "macro-area"
  | "ministry"
  | "policy"
  | "indicator"
  | "situation";
export type VisualMacroArea = Readonly<{
  id: string;
  name: string;
  color: string;
  areas: readonly string[];
  minimumRadius?: number;
  clearance?: number;
}>;
export type VisualMinistry = Readonly<{
  name: string;
  representativeName?: string;
  macroAreaId: string;
  abbreviation?: string;
  influence?: number;
  minimumRadius?: number;
  clearance?: number;
}>;

/** Contrato só da apresentação. Estes valores nunca entram no motor. */
export type VisualMapDefinition = Readonly<{
  seed?: number;
  /** IDs of controls, indicators or situations; explicit semantics override area. */
  nodes?: Readonly<
    Record<
      string,
      Readonly<{
        scope?: "federal" | "national" | "ministerial";
        affinities?: Readonly<Record<string, number>>;
        /** Optional explicit policy control IDs and orbital weights. */
        parents?: Readonly<Record<string, number>>;
      }>
    >
  >;
  financialTargets?: Readonly<Record<string, FinancialRole>>;
  governmentName?: string;
  presidentName?: string;
  macroAreas?: readonly VisualMacroArea[];
  ministries?: readonly VisualMinistry[];
  policy?: Readonly<
    Record<
      string,
      Readonly<{
        abbreviation?: string;
        influence?: number;
        minimumSize?: number;
        clearance?: number;
      }>
    >
  >;
}>;

export type InfluenceZone = Readonly<{
  ministry: string;
  category: string;
  macroAreaId: string;
  center: InfluencePoint;
  radius: number;
}>;
export type MacroAreaRegion = Readonly<{
  id: string;
  name: string;
  color: string;
  center: InfluencePoint;
  radiusX: number;
  radiusY: number;
}>;
export type Representative = Readonly<{
  id: string;
  name: string;
  role: "president" | "minister";
  institution: string;
  center: InfluencePoint;
  radius: number;
  mass: number;
}>;
export type InfluenceLayout = Readonly<{
  representatives: readonly Representative[];
  positions: ReadonlyMap<string, InfluencePoint>;
  zones: readonly InfluenceZone[];
  macroAreas: readonly MacroAreaRegion[];
  ministryPositions: ReadonlyMap<string, InfluencePoint>;
  government: Readonly<{
    name: string;
    center: InfluencePoint;
    radius: number;
  }>;
  abbreviations: ReadonlyMap<string, string>;
}>;

/** Compatibility snapshot for callers that do not animate. */
export function buildInfluenceLayout(
  content: ResolvedPackage,
  activeInfluence: ReadonlyMap<string, number> = new Map(),
  definition: VisualMapDefinition = {},
  reservedRadii?: ReadonlyMap<string, number>,
): InfluenceLayout {
  const engine = new MapPhysics(content, definition);
  engine.setMetrics(activeInfluence, reservedRadii);
  engine.settle();
  return engine.snapshot();
}
