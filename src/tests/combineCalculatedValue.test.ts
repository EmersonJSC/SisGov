import { describe, expect, it } from "vitest";
import { combineCalculatedValue } from "../engine";

describe("combineCalculatedValue", () => {
  it("soma contribuições em ordem estável sobre a base", () => {
    expect(
      combineCalculatedValue("educacao_publica", 10, [
        { relationId: "z-politica", value: 3 },
        { relationId: "a-crise", value: -2 },
      ]),
    ).toEqual({
      ok: true,
      value: {
        targetId: "educacao_publica",
        baseValue: 10,
        contributions: [
          { relationId: "a-crise", value: -2 },
          { relationId: "z-politica", value: 3 },
        ],
        value: 11,
      },
    });
  });
});
