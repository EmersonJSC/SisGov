import type { ScenarioDefinition } from "../types/scenario";

export function validateScenario(scenario: ScenarioDefinition): string[] {
  const errors: string[] = [];

  for (const indicator of scenario.indicators) {
    if (
      !indicator.id ||
      !indicator.name ||
      !indicator.description ||
      !indicator.rationale
    ) {
      errors.push(
        "Todo indicador precisa ter identificação, nome, descrição e justificativa.",
      );
    }
  }

  return errors;
}
