import { describe, expect, it } from "vitest";
import { validateScenario } from "../engine";
import { brazilPresidency } from "../scenarios/brazilPresidency";

describe("validateScenario", () => {
  it("aceita a quantidade de indicadores definida pelo cenário", () => {
    expect(validateScenario(brazilPresidency)).toEqual([]);
  });

  it("não impõe uma quantidade fixa de indicadores", () => {
    expect(
      validateScenario({
        ...brazilPresidency,
        indicators: [
          ...brazilPresidency.indicators,
          { ...brazilPresidency.indicators[0], id: "indicador_extra" },
        ],
      }),
    ).toEqual([]);
  });
});
