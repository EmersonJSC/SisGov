import { describe, expect, it } from "vitest";
import {
  implausibility,
  theilDecomposition,
} from "../engine/diagnostics/calibration";

describe("medidas de calibragem (V1-07)", () => {
  it("erro só de nível vira viés", () => {
    const t = theilDecomposition([1, 2, 3, 4], [3, 4, 5, 6]);
    expect(t.mse).toBe(4);
    expect(t.bias).toBeCloseTo(1, 12);
    expect(t.variance).toBeCloseTo(0, 12);
    expect(t.covariance).toBeCloseTo(0, 12);
  });

  it("as três partes somam 1", () => {
    const t = theilDecomposition([5, 7, 6, 9, 8], [6, 6, 8, 7, 11]);
    expect(t.bias + t.variance + t.covariance).toBeCloseTo(1, 12);
  });

  it("oscilar o dobro do real aparece na variância", () => {
    const t = theilDecomposition([0, 2, 0, 2], [-1, 3, -1, 3]);
    expect(t.variance).toBeCloseTo(1, 12);
  });

  it("implausibilidade divide a distância pelo desvio total", () => {
    expect(implausibility(10, 16, 3, 1)).toBe(3);
  });
});
