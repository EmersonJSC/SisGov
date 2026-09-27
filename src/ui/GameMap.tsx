import type { CSSProperties } from "react";
import type {
  IndicatorDefinition,
  ScenarioDefinition,
} from "../types/scenario";

type GameMapProps = {
  scenario: ScenarioDefinition;
};

const nodeLayouts: Record<string, { position: string; drift: string }> = {
  renda_e_emprego: { position: "node--one", drift: "node--drift-one" },
  saude_publica: { position: "node--two", drift: "node--drift-two" },
  educacao_basica: { position: "node--three", drift: "node--drift-three" },
  desigualdade_social: { position: "node--four", drift: "node--drift-four" },
};

function Node({ indicator }: { indicator: IndicatorDefinition }) {
  const layout = nodeLayouts[indicator.id];
  const style = {
    "--node-size": `${6.5 + indicator.visualWeight * 4.5}rem`,
  } as CSSProperties;

  return (
    <button
      aria-label={indicator.name}
      className={`map-node ${layout.position} ${layout.drift}`}
      data-tooltip={indicator.name}
      style={style}
      type="button"
    >
      <span aria-hidden="true" className="map-node__icon">
        {indicator.icon}
      </span>
      <span className="map-node__name">{indicator.name}</span>
    </button>
  );
}

export function GameMap({ scenario }: GameMapProps) {
  return (
    <main className="game-map">
      <section
        aria-label="Mapa de indicadores nacionais"
        className="game-map__field"
      >
        <p className="map-filter" aria-label="Filtro ativo">
          Valor
        </p>

        {scenario.indicators.map((indicator) => (
          <Node indicator={indicator} key={indicator.id} />
        ))}
      </section>
    </main>
  );
}
