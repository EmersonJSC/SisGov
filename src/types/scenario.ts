export type IndicatorUnit = "percentual" | "indice";

export type IndicatorDefinition = {
  id: string;
  name: string;
  icon: string;
  unit: IndicatorUnit;
  description: string;
  rationale: string;
  initialValue: number | null;
  /** Peso provisório de apresentação; não representa dado nacional. */
  visualWeight: number;
};

export type ScenarioDefinition = {
  id: string;
  title: string;
  summary: string;
  indicators: IndicatorDefinition[];
};
