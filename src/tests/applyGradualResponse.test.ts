import { describe, expect, it } from "vitest";
import { applyGradualResponse } from "../engine";

describe("applyGradualResponse", () => {
  it("aproxima o alvo em passos sucessivos", () => {
    const first = applyGradualResponse(0, 10, 0.5);
    expect(first).toMatchObject({ ok: true, value: { value: 5 } });
    if (first.ok)
      expect(applyGradualResponse(first.value.value, 10, 0.5)).toMatchObject({
        ok: true,
        value: { value: 7.5 },
      });
  });
});
