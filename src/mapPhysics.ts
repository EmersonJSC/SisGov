import type { ResolvedPackage } from "./engine";
import type { InfluenceLayout, VisualMapDefinition } from "./influenceLayout";

export type Scope = "federal" | "national" | "ministerial";
type Point = { x: number; y: number };
type Body = Point & {
  id: string;
  vx: number;
  vy: number;
  metric: number;
  radius: number;
  targetRadius: number;
  mass: number;
  kind: "policy" | "indicator" | "situation";
  parents: Record<string, number>;
  scope: Scope;
  affinities: Record<string, number>;
};
type Well = Point & {
  name: string;
  category: string;
  macroAreaId: string;
  radius: number;
  angle: number;
  policyOrbit: number;
  mass: number;
  representativeRadius: number;
};
const TAU = 2 * Math.PI;
const CENTER = { x: 50, y: 50 };
const GAP = 0.8;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
function hash(id: string, seed: number): number {
  let h = seed;
  for (const c of id) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0) / 4294967296;
}

/** Independent presentation simulation: fixed 60 Hz, no writes to game state. */
export class MapPhysics {
  readonly bodies = new Map<string, Body>();
  private wells: Well[] = [];
  private abbreviations = new Map<string, string>();
  private accumulator = 0;
  private quietSteps = 0;
  private temperature = 1;
  private federalRadius = 14;
  private federalPolicyOrbit = 7;
  private orbit = 12;
  private seed: number;
  constructor(
    private content: ResolvedPackage,
    private definition: VisualMapDefinition = {},
  ) {
    this.seed = definition.seed ?? 56065;
    const names = [
      ...new Set(
        content.policies
          .filter(
            (p) =>
              p.ministerio &&
              definition.nodes?.[p.controle.variavel]?.scope !== "federal",
          )
          .map((p) => p.ministerio!),
      ),
    ].sort();
    this.wells = names.map((name, i) => {
      const policy = content.policies.find(
        (p) => (p.ministerio ?? p.area ?? "Outras") === name,
      )!;
      const category = policy.area ?? policy.categoria ?? "Outras";
      const macroAreaId =
        definition.ministries?.find((m) => m.name === name)?.macroAreaId ??
        definition.macroAreas?.find((m) => m.areas.includes(category))?.id ??
        category;
      const angle = -Math.PI / 2 + (i * TAU) / Math.max(1, names.length);
      return {
        name,
        category,
        macroAreaId,
        angle,
        radius: 10,
        policyOrbit: 7,
        mass: 24,
        representativeRadius: 4,
        x: 50 + 32 * Math.cos(angle),
        y: 50 + 32 * Math.sin(angle),
      };
    });
    const add = (
      id: string,
      scope: Scope,
      affinities: Record<string, number>,
      radius: number,
      kind: Body["kind"],
    ) => {
      const meta = definition.nodes?.[id];
      const valid = Object.fromEntries(
        Object.entries(meta?.affinities ?? affinities).filter(
          ([name, weight]) =>
            names.includes(name) && Number.isFinite(weight) && weight > 0,
        ),
      );
      const total = Object.values(valid).reduce((a, b) => a + b, 0);
      for (const name of Object.keys(valid)) valid[name] /= total;
      const actualScope = meta?.scope ?? scope;
      const primary = this.wells.find(
        (w) =>
          w.name === Object.keys(valid).sort((a, b) => valid[b] - valid[a])[0],
      );
      const origin =
        actualScope === "ministerial" && primary ? primary : CENTER;
      const angle = hash(id, this.seed) * TAU;
      const distance =
        actualScope === "federal"
          ? 3
          : actualScope === "national"
            ? 12
            : 3 + 7 * hash(id + ":r", this.seed);
      this.bodies.set(id, {
        id,
        kind,
        parents: {},
        scope: actualScope,
        affinities: valid,
        x: origin.x + Math.cos(angle) * distance,
        y: origin.y + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        metric: 0,
        radius,
        targetRadius: radius,
        mass: 1,
      });
    };
    for (const p of content.policies) {
      add(
        p.controle.variavel,
        p.ministerio ? "ministerial" : "federal",
        { [p.ministerio ?? p.area ?? "Outras"]: 1 },
        1.7,
        "policy",
      );
      this.abbreviations.set(
        p.controle.variavel,
        definition.policy?.[p.id]?.abbreviation ??
          p.nome
            .split(/\s+/)
            .filter((w) => !["de", "da", "do", "e"].includes(w))
            .slice(0, 2)
            .map((w) => w.slice(0, 4).toUpperCase())
            .join("·"),
      );
    }
    for (const v of content.variables.variaveis.filter(
      (v) => v.tipo !== "controle" && v.area !== "Técnica",
    )) {
      const matches = this.wells.filter((w) => w.category === v.area);
      add(
        v.id,
        matches.length === 1 ? "ministerial" : "national",
        Object.fromEntries(matches.map((w) => [w.name, 1])),
        2.45,
        "indicator",
      );
    }
    for (const s of content.situations) {
      const matches = this.wells.filter((w) => w.category === s.area);
      add(
        s.id,
        matches.length ? "ministerial" : "national",
        Object.fromEntries(matches.map((w) => [w.name, 1])),
        2.2,
        "situation",
      );
    }
    // Causal effects are edges. One shared result stays one node with several parents.
    for (const result of this.bodies.values()) {
      if (result.kind === "policy") continue;
      const sources: Record<string, number> = {};
      const situation = content.situations.find((s) => s.id === result.id);
      const targets = new Set([
        result.id,
        situation?.entraQuando?.variavel,
        situation?.saiQuando?.variavel,
      ]);
      for (const effect of content.consequences) {
        if (
          !targets.has(effect.alvo) ||
          this.bodies.get(effect.origem)?.kind !== "policy"
        )
          continue;
        const domain = content.variables.variaveis.find(
          (v) => v.id === effect.origem,
        )?.dominio;
        const span = Math.max(1, (domain?.maximo ?? 1) - (domain?.minimo ?? 0));
        const weight = Math.abs(effect.parametros.coeficiente) * span;
        if (Number.isFinite(weight) && weight > 0)
          sources[effect.origem] = (sources[effect.origem] ?? 0) + weight;
      }
      const chosen = definition.nodes?.[result.id]?.parents ?? sources;
      const valid = Object.entries(chosen).filter(
        ([id, w]) =>
          this.bodies.get(id)?.kind === "policy" && Number.isFinite(w) && w > 0,
      );
      const total = valid.reduce((sum, [, w]) => sum + w, 0);
      result.parents = Object.fromEntries(
        valid.map(([id, w]) => [id, w / total]),
      );
    }
  }
  /** Changing mode wakes the same bodies; positions and velocities survive. */
  setMetrics(
    metrics: ReadonlyMap<string, number>,
    radii?: ReadonlyMap<string, number>,
  ): boolean {
    const max = Math.max(
      0.0001,
      ...[...metrics.values()].filter(Number.isFinite),
    );
    let changed = false;
    for (const b of this.bodies.values()) {
      const rawMetric = metrics.get(b.id) ?? 0;
      const metric = Number.isFinite(rawMetric) ? rawMetric : 0;
      const u = clamp(metric / max, 0, 1);
      const radius = radii?.get(b.id) ?? 1.35 + 0.75 * u;
      const targetRadius = Number.isFinite(radius)
        ? Math.max(0.5, radius)
        : 1.35;
      const mass = 1 + 3 * u;
      if (
        Math.abs(b.metric - metric) < 1e-6 &&
        Math.abs(b.targetRadius - targetRadius) < 1e-6 &&
        Math.abs(b.mass - mass) < 1e-6
      )
        continue;
      b.metric = metric;
      b.targetRadius = targetRadius;
      b.mass = mass;
      changed = true;
    }
    if (!changed) return false;
    this.quietSteps = 0;
    this.temperature = 1;
    return true;
  }
  get sleeping(): boolean {
    return this.quietSteps >= 60;
  }
  advance(seconds: number): void {
    this.accumulator += clamp(seconds, 0, 0.1);
    while (this.accumulator >= 1 / 60 && !this.sleeping) {
      this.tick();
      this.accumulator -= 1 / 60;
    }
    if (this.sleeping) this.accumulator = 0;
  }
  settle(): void {
    for (let i = 0; i < 900 && !this.sleeping; i++) this.tick();
  }
  private tick(): void {
    let movement = 0;
    this.temperature *= 0.99;
    const bodies = [...this.bodies.values()];
    const orbitFor = (members: Body[], representativeRadius: number) =>
      Math.max(
        representativeRadius +
          Math.max(1.5, ...members.map((b) => b.targetRadius)) +
          2,
        members.reduce((sum, b) => sum + 2 * b.targetRadius + GAP, 0) / TAU +
          1.5,
      );
    const federalPolicies = bodies.filter(
      (b) => b.kind === "policy" && b.scope !== "ministerial",
    );
    const national = bodies.filter(
      (b) => b.kind !== "policy" && b.scope !== "ministerial",
    );
    this.federalPolicyOrbit = orbitFor(federalPolicies, 4.5);
    const policyEdge =
      this.federalPolicyOrbit +
      Math.max(1.5, ...federalPolicies.map((b) => b.targetRadius));
    this.orbit = Math.max(
      policyEdge + Math.max(1.5, ...national.map((b) => b.targetRadius)) + 3,
      national.reduce((sum, b) => sum + 2 * b.targetRadius + GAP, 0) / TAU +
        1.5,
    );
    this.federalRadius =
      this.orbit + Math.max(1.5, ...national.map((b) => b.targetRadius)) + 2;
    for (const w of this.wells) {
      const laws = bodies.filter(
        (b) =>
          b.kind === "policy" &&
          b.scope === "ministerial" &&
          (b.affinities[w.name] ?? 0) > 0,
      );
      const results = bodies.filter(
        (b) =>
          b.kind !== "policy" &&
          b.scope === "ministerial" &&
          (b.affinities[w.name] ?? 0) > 0,
      );
      w.policyOrbit = orbitFor(laws, w.representativeRadius);
      const edge =
        w.policyOrbit + Math.max(1.5, ...laws.map((b) => b.targetRadius));
      w.radius =
        edge +
        (results.length
          ? 2 * Math.max(...results.map((b) => b.targetRadius)) + 4
          : 2);
    }
    const maxRadius = Math.max(5, ...this.wells.map((w) => w.radius));
    const ring = Math.max(
      this.federalRadius + maxRadius + 5,
      (maxRadius + 2) /
        Math.max(0.15, Math.sin(Math.PI / Math.max(2, this.wells.length))),
    );
    for (const w of this.wells) {
      const dx = (50 + ring * Math.cos(w.angle) - w.x) * 0.04;
      const dy = (50 + ring * Math.sin(w.angle) - w.y) * 0.04;
      w.x += dx;
      w.y += dy;
      movement = Math.max(movement, Math.hypot(dx, dy));
    }
    for (const b of bodies) {
      const dr = (b.targetRadius - b.radius) * 0.12;
      b.radius += dr;
      let fx = 0,
        fy = 0;
      const orbitForce = (center: Point, desired: number, strength: number) => {
        let dx = b.x - center.x,
          dy = b.y - center.y;
        let distance = Math.hypot(dx, dy);
        if (distance < 1e-6) {
          const angle = hash(b.id, this.seed) * TAU;
          dx = Math.cos(angle);
          dy = Math.sin(angle);
          distance = 1;
        }
        const force = (desired - distance) * strength;
        fx += (dx / distance) * force;
        fy += (dy / distance) * force;
      };
      if (b.kind === "policy") {
        if (b.scope === "ministerial" && Object.keys(b.affinities).length) {
          for (const w of this.wells) {
            const affinity = b.affinities[w.name] ?? 0;
            if (affinity)
              orbitForce(
                w,
                w.policyOrbit,
                0.07 * affinity * Math.sqrt(w.mass / 24),
              );
          }
        } else orbitForce(CENTER, this.federalPolicyOrbit, 0.08);
      } else {
        // Shared outcomes use a weighted law center instead of duplicating nodes.
        const parents = Object.entries(b.parents).map(([id, weight]) => ({
          body: this.bodies.get(id)!,
          weight,
        }));
        const anchor = parents.reduce(
          (p, { body, weight }) => ({
            x: p.x + body.x * weight,
            y: p.y + body.y * weight,
          }),
          { x: 0, y: 0 },
        );
        if (b.scope !== "ministerial") {
          orbitForce(CENTER, this.orbit, 0.09);
          // National outcomes stay in the federal shell; laws influence their angle.
          if (parents.length) {
            const radial = { x: b.x - 50, y: b.y - 50 };
            const length = Math.max(0.001, Math.hypot(radial.x, radial.y));
            const tx = -radial.y / length,
              ty = radial.x / length;
            const tangential =
              ((anchor.x - b.x) * tx + (anchor.y - b.y) * ty) * 0.006;
            fx += tx * tangential;
            fy += ty * tangential;
          }
        } else {
          if (parents.length) {
            const parentRadius = parents.reduce(
              (r, p) => r + p.body.radius * p.weight,
              0,
            );
            orbitForce(anchor, b.radius + parentRadius + 2, 0.055);
          }
          // Outer result band keeps the representative → laws → results hierarchy.
          for (const w of this.wells) {
            const affinity = b.affinities[w.name] ?? 0;
            if (affinity)
              orbitForce(
                w,
                w.radius - b.radius - 1.5,
                parents.length ? 0.04 * affinity : 0.09 * affinity,
              );
          }
        }
      }
      b.vx = (b.vx + (fx * this.temperature) / b.mass) * 0.82;
      b.vy = (b.vy + (fy * this.temperature) / b.mass) * 0.82;
      b.x += clamp(b.vx, -0.5, 0.5);
      b.y += clamp(b.vy, -0.5, 0.5);
      movement = Math.max(movement, Math.abs(dr));
    }
    // Position-based contacts enforce clearance with inverse-mass correction.
    for (let pass = 0; pass < 5; pass++) {
      for (const body of bodies)
        for (const representative of [
          { ...CENTER, representativeRadius: 4.5 },
          ...this.wells,
        ]) {
          let dx = body.x - representative.x,
            dy = body.y - representative.y;
          let d = Math.hypot(dx, dy);
          if (d < 1e-8) {
            const angle = hash(body.id, this.seed) * TAU;
            dx = Math.cos(angle) * 1e-4;
            dy = Math.sin(angle) * 1e-4;
            d = 1e-4;
          }
          const required =
            body.radius + representative.representativeRadius + GAP;
          if (d < required) {
            body.x += (dx / d) * (required - d);
            body.y += (dy / d) * (required - d);
          }
        }
      for (let i = 0; i < bodies.length; i++)
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i],
            b = bodies[j];
          if (
            Math.abs(b.x - a.x) >= a.radius + b.radius + GAP ||
            Math.abs(b.y - a.y) >= a.radius + b.radius + GAP
          )
            continue;
          let dx = b.x - a.x,
            dy = b.y - a.y,
            d = Math.hypot(dx, dy);
          if (d < 1e-8) {
            const angle = hash(a.id + ":" + b.id, this.seed) * TAU;
            dx = Math.cos(angle);
            dy = Math.sin(angle);
            d = 1;
          }
          const overlap = a.radius + b.radius + GAP - d;
          if (overlap <= 0) continue;
          const share = b.mass / (a.mass + b.mass);
          const nx = dx / d,
            ny = dy / d;
          a.x -= nx * overlap * share;
          a.y -= ny * overlap * share;
          b.x += nx * overlap * (1 - share);
          b.y += ny * overlap * (1 - share);
          const closing = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (closing < 0) {
            a.vx += closing * nx * share;
            a.vy += closing * ny * share;
            b.vx -= closing * nx * (1 - share);
            b.vy -= closing * ny * (1 - share);
          }
        }
    }
    // Sleep uses displacement after constraint correction, not unresolved forces.
    const signature = bodies.map((b) => [b.x, b.y]);
    const delta = this.lastPositions
      ? Math.max(
          ...signature.map((p, i) =>
            Math.hypot(
              p[0] - this.lastPositions![i][0],
              p[1] - this.lastPositions![i][1],
            ),
          ),
        )
      : Infinity;
    this.lastPositions = signature;
    this.quietSteps = delta < 0.02 && movement < 0.02 ? this.quietSteps + 1 : 0;
  }
  private lastPositions?: number[][];
  snapshot(): InfluenceLayout {
    return {
      representatives: [
        {
          id: "representative:president",
          name: this.definition.presidentName ?? "Presidente",
          role: "president",
          institution: this.definition.governmentName ?? "Governo Federal",
          center: { ...CENTER },
          radius: 4.5,
          mass: 32,
        },
        ...this.wells.map((w) => ({
          id: `representative:${w.name}`,
          name:
            this.definition.ministries?.find((m) => m.name === w.name)
              ?.representativeName ?? "Ministro",
          role: "minister" as const,
          institution: w.name,
          center: { x: w.x, y: w.y },
          radius: w.representativeRadius,
          mass: w.mass,
        })),
      ],
      positions: new Map(
        [...this.bodies].map(([id, b]) => [id, { x: b.x, y: b.y }]),
      ),
      zones: this.wells.map((w) => ({
        ministry: w.name,
        category: w.category,
        macroAreaId: w.macroAreaId,
        center: { x: w.x, y: w.y },
        radius: w.radius,
      })),
      // Macro areas remain metadata; giant enclosing ellipses obscure the table.
      macroAreas: [],
      ministryPositions: new Map(
        this.wells.map((w) => [w.name, { x: w.x, y: w.y }]),
      ),
      government: {
        name: this.definition.governmentName ?? "Governo Federal",
        center: { ...CENTER },
        radius: Math.max(
          this.federalRadius,
          ...[...this.bodies.values()]
            .filter((b) => b.scope !== "ministerial")
            .map(
              (b) => Math.hypot(b.x - CENTER.x, b.y - CENTER.y) + b.radius + 1,
            ),
        ),
      },
      abbreviations: new Map(this.abbreviations),
    };
  }
}
