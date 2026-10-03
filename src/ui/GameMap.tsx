import type { CSSProperties } from "react";
import type {
  IndicatorDefinition,
  ScenarioDefinition,
} from "../types/scenario";

type GameMapProps = {
  scenario: ScenarioDefinition;
};

const goldenAngle = Math.PI * (3 - Math.sqrt(5));

function getNodePosition(index: number, total: number) {
  const angle = index * goldenAngle - Math.PI / 2;
  const radius = 16 + Math.sqrt((index + 0.5) / Math.max(total, 1)) * 28;

  return {
    x: 50 + Math.cos(angle) * radius,
    y: 50 + Math.sin(angle) * radius,
  };
}

function Node({
  indicator,
  index,
  total,
}: {
  indicator: IndicatorDefinition;
  index: number;
  total: number;
}) {
  const position = getNodePosition(index, total);
  const style = {
    "--node-size": `${6.5 + indicator.visualWeight * 4.5}rem`,
    "--node-x": `${position.x}%`,
    "--node-y": `${position.y}%`,
    "--node-delay": `${index * -0.7}s`,
  } as CSSProperties;

  return (
    <button
      aria-label={indicator.name}
      className="map-node"
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

        {scenario.indicators.map((indicator, index) => (
          <Node
            indicator={indicator}
            index={index}
            key={indicator.id}
            total={scenario.indicators.length}
          />
        ))}
      </section>
    </main>
  );
}
