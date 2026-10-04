import { expect, it } from "vitest";
import {
  isWorldNodeVisible,
  nearestWorldNode,
  resolveWorldLevelOfDetail,
} from "../world/worldViewModel";

it("selects a compact semantic level of detail from camera zoom", () => {
  expect(resolveWorldLevelOfDetail(0.3)).toBe("overview");
  expect(resolveWorldLevelOfDetail(0.6)).toBe("groups");
  expect(resolveWorldLevelOfDetail(1)).toBe("nodes");
  expect(resolveWorldLevelOfDetail(2)).toBe("details");
});

it("keeps individual nodes visible at every zoom level", () => {
  for (const level of ["overview", "groups", "nodes", "details"] as const) {
    expect(isWorldNodeVisible("policy", level, false)).toBe(true);
    expect(isWorldNodeVisible("indicator", level, false)).toBe(true);
    expect(isWorldNodeVisible("situation", level, false)).toBe(true);
  }
});

it("resolves overlapping pointer targets to the nearest node center", () => {
  const nodes = [
    { id: "left", position: { x: 10, y: 10 } },
    { id: "right", position: { x: 14, y: 10 } },
  ];

  expect(nearestWorldNode(nodes, { x: 13, y: 10 })).toBe("right");
  expect(nearestWorldNode(nodes, { x: 10, y: 10 })).toBe("left");
  expect(nearestWorldNode([], { x: 0, y: 0 })).toBeUndefined();
});
