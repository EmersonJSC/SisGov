import { useState } from "react";
import type { MapFilter } from "../mapMetrics";

export function MapFilters({
  onChange,
}: {
  onChange: (filter: MapFilter) => void;
}) {
  const [active, setActive] = useState<MapFilter>("influence");
  return (
    <div className="map-filters" role="group" aria-label="Tamanho das bolinhas">
      <div>
        {(
          [
            ["influence", "Influência"],
            ["financial", "Financeiro"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={active === id}
            onClick={() => {
              setActive(id);
              onChange(id);
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <small>
        {active === "financial"
          ? "Maior receita ou despesa → maior bolinha · ↑ receita / ↓ despesa"
          : "Maior força das relações → maior bolinha"}
      </small>
    </div>
  );
}
