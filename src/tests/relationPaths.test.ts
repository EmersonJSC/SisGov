import { expect, it } from "vitest";
import { relationPath } from "../relationPaths";

it("curves directed relations without changing their endpoints", () => {
  expect(relationPath({ x: 10, y: 20 }, { x: 50, y: 60 })).toBe(
    "M 10 20 Q 24.4 45.6 50 60",
  );
});

it("separates parallel relations between the same pair of nodes", () => {
  const start = { x: 0, y: 0 };
  const end = { x: 20, y: 0 };

  expect(relationPath(start, end, 0, 2)).not.toBe(
    relationPath(start, end, 1, 2),
  );
});

it("keeps arrow tips outside the source and target bubbles", () => {
  expect(relationPath({ x: 0, y: 0 }, { x: 20, y: 0 }, 0, 1, 2, 3)).toBe(
    "M 2 0 Q 9.5 2.1 17 0",
  );
});

it("draws a small loop for a relation whose endpoints coincide", () => {
  expect(relationPath({ x: 5, y: 5 }, { x: 5, y: 5 })).toBe(
    "M 5 5 C 8 2 2 2 5 5",
  );
});
