import { useState, type CSSProperties } from "react";
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

export function GameMap({ scenario }: GameMapProps) {
  const [selectedId, setSelectedId] = useState(scenario.indicators[0]?.id);
  const selected =
    scenario.indicators.find((indicator) => indicator.id === selectedId) ??
    scenario.indicators[0];

  return (
    <main className="game-map">
      <header className="game-map__header">
        <div>
          <p className="eyebrow">República Federativa do Brasil</p>
          <h1>{scenario.title}</h1>
        </div>
        <div className="game-map__status" aria-label="Estado da partida">
          <span>Mandato 01</span>
          <strong>1º trimestre</strong>
        </div>
        <button className="game-map__turn" type="button">
          Encerrar trimestre <span>→</span>
        </button>
      </header>
      <section
        aria-label="Mapa de indicadores nacionais"
        className="game-map__field"
      >
        <div className="map-filter" aria-label="Filtro ativo">
          <span>Mapa de influência</span>
          <strong>Indicadores nacionais</strong>
        </div>

        {scenario.indicators.map((indicator, index) => (
          <button
            aria-label={indicator.name}
            className={`map-node ${selectedId === indicator.id ? "map-node--selected" : ""}`}
            data-tooltip={indicator.name}
            key={indicator.id}
            onClick={() => setSelectedId(indicator.id)}
            style={(() => {
              const position = getNodePosition(
                index,
                scenario.indicators.length,
              );
              return {
                "--node-size": `${6.5 + indicator.visualWeight * 4.5}rem`,
                "--node-x": `${position.x}%`,
                "--node-y": `${position.y}%`,
                "--node-delay": `${index * -0.7}s`,
              } as CSSProperties;
            })()}
            type="button"
          >
            <span aria-hidden="true" className="map-node__icon">
              {indicator.icon}
            </span>
            <span className="map-node__name">{indicator.name}</span>
          </button>
        ))}

        {selected && (
          <aside className="indicator-card" aria-live="polite">
            <p className="eyebrow">Indicador selecionado</p>
            <div className="indicator-card__title">
              <span>{selected.icon}</span>
              <h2>{selected.name}</h2>
            </div>
            <p>{selected.description}</p>
            <div className="indicator-card__meter">
              <span style={{ width: `${selected.visualWeight * 100}%` }} />
            </div>
            <small>
              Relevância estrutural · {Math.round(selected.visualWeight * 100)}%
            </small>
          </aside>
        )}
      </section>
    </main>
  );
}
