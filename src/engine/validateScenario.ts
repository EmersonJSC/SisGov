import type { ScenarioDefinition } from "../types/scenario";

export function validateScenario(scenario: ScenarioDefinition): string[] {
  const errors: string[] = [];

  if (scenario.indicators.length !== 4) {
    errors.push("O cenário inicial precisa ter quatro indicadores nacionais.");
  }

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
