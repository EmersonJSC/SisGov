import { expect, it } from "vitest";
import { MapPhysics } from "../mapPhysics";
import { buildInfluenceLayout } from "../influenceLayout";
import { createD4ReferenceSandbox } from "../scenarios/d4ReferenceSandbox";
import {
  measureFinances,
  measureInfluence,
  sizeMap,
  MAP_PIXELS_PER_UNIT,
} from "../mapMetrics";

function setup() {
  const s = createD4ReferenceSandbox();
  const engine = new MapPhysics(s.content, s.visualMap);
  return { ...s, engine };
}
it("is deterministic and never changes game data", () => {
  const s = setup();
  const before = JSON.stringify(s.content);
  expect(buildInfluenceLayout(s.content, new Map(), s.visualMap)).toEqual(
    buildInfluenceLayout(s.content, new Map(), s.visualMap),
  );
  expect(JSON.stringify(s.content)).toBe(before);
});
it("keeps laws around institutional anchors without adding officeholders", () => {
  const s = setup();
  s.engine.settle();
  const layout = s.engine.snapshot();
  expect("representatives" in layout).toBe(false);
  expect(layout.government.center).toEqual({ x: 50, y: 50 });
  for (const zone of layout.zones)
    expect(Number.isFinite(zone.center.x + zone.center.y)).toBe(true);
});
it("orbits federal laws around the government sphere with results in an outer shell", () => {
  const s = setup();
  s.engine.settle();
  const distance = (id: string) => {
    const b = s.engine.bodies.get(id)!;
    return Math.hypot(b.x - 50, b.y - 50);
  };
  const laws = [...s.engine.bodies.values()].filter(
    (b) => b.kind === "policy" && b.scope === "federal",
  );
  expect(laws.length).toBeGreaterThan(0);
  for (const law of laws) {
    expect(distance(law.id)).toBeGreaterThan(4.5 + law.radius);
    expect(distance(law.id)).toBeLessThan(distance("capacidade_institucional"));
  }
  const national = [...s.engine.bodies.values()].filter(
    (b) => b.kind !== "policy" && b.scope === "national",
  );
  for (const body of national)
    expect(distance(body.id) + body.radius).toBeLessThanOrEqual(
      s.engine.snapshot().government.radius + 0.5,
    );
});
it("keeps shared indicators unique and derives situation parents through triggers", () => {
  const s = setup();
  expect(
    Object.keys(s.engine.bodies.get("saude_populacao")!.parents),
  ).toHaveLength(15);
  expect(s.engine.bodies.get("crise-saude")!.parents).toEqual(
    s.engine.bodies.get("saude_populacao")!.parents,
  );
  expect(
    [...s.engine.bodies.keys()].filter((id) => id === "saude_populacao"),
  ).toHaveLength(1);
  expect(s.engine.bodies.get("verba_001")!.kind).toBe("policy");
});
it("resolves contacts and remains finite after changes of mode", () => {
  const s = setup();
  const values = s.content.initialState.valores;
  for (const metrics of [
    new Map(
      [...measureInfluence(s.graph, values)].map(([id, value]) => [
        id,
        { value },
      ]),
    ),
    measureFinances(s.content, s.graph, values, s.visualMap.financialTargets),
  ]) {
    const radii = new Map(
      [...sizeMap(s.content, metrics)].map(([id, size]) => [
        id,
        size / (2 * MAP_PIXELS_PER_UNIT),
      ]),
    );
    s.engine.setMetrics(
      new Map([...metrics].map(([id, m]) => [id, m.value ?? 0])),
      radii,
    );
    s.engine.settle();
    const nodes = [...s.engine.bodies.values()];
    for (let i = 0; i < nodes.length; i++)
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i],
          b = nodes[j];
        expect(Number.isFinite(a.x + a.y)).toBe(true);
        expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThanOrEqual(
          a.radius + b.radius + 0.7,
        );
      }
  }
});
it("preserves positions when changing metrics then physically rearranges", () => {
  const s = setup();
  s.engine.settle();
  const before = s.engine.snapshot();
  s.engine.setMetrics(
    new Map([["verba_001", 100]]),
    new Map([["verba_001", 5]]),
  );
  expect(s.engine.snapshot().positions).toEqual(before.positions);
  s.engine.settle();
  const a = before.positions.get("verba_001")!,
    b = s.engine.bodies.get("verba_001")!;
  expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(0.1);
});
it("uses explicit selective affinities rather than pulling unrelated nodes", () => {
  const s = setup();
  expect(s.engine.bodies.get("verba_024")!.affinities).toEqual({
    "Ministério da Educação": 0.8,
    "Ministério dos Transportes": 0.2,
  });
  expect(s.engine.bodies.get("saldo_publico")!.affinities).toEqual({});
});
it("integrates at a fixed time step independent of frame frequency", () => {
  const a = setup().engine,
    b = setup().engine;
  for (let i = 0; i < 60; i++) a.advance(1 / 60);
  for (let i = 0; i < 30; i++) b.advance(1 / 30);
  expect(a.snapshot()).toEqual(b.snapshot());
});

it("sleeps after settling and wakes on new metrics", () => {
  const s = setup();
  s.engine.settle();
  expect(s.engine.sleeping).toBe(true);
  s.engine.setMetrics(new Map([["verba_001", 4]]));
  expect(s.engine.sleeping).toBe(false);
});
