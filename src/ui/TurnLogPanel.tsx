import { useState } from "react";
import { TURN_LOG_LIMIT, type TurnLogEntry } from "../game/turnJournal";

export function TurnLogPanel({
  entries,
}: {
  entries: readonly TurnLogEntry[];
}) {
  const [open, setOpen] = useState(true);
  return (
    <aside className="turn-log" aria-label="Registro da partida">
      <button
        type="button"
        className="turn-log-toggle"
        aria-expanded={open}
        aria-controls="turn-log-content"
        onClick={() => setOpen(!open)}
      >
        Registro da partida · {entries.length} {open ? "▾" : "▴"}
      </button>
      <p className="turn-log-latest" role="status" aria-live="polite">
        {entries[0]?.title ?? "Aguardando início."}
      </p>
      <div id="turn-log-content" hidden={!open}>
        <p className="turn-log-help">
          Últimos {TURN_LOG_LIMIT} registros desta sessão. Não são salvos ao
          recarregar.
        </p>
        <ol>
          {entries.map((entry) => (
            <li key={entry.id} className={`turn-log-${entry.level}`}>
              <details>
                <summary>
                  #{entry.id} · Turno {entry.turn} ·{" "}
                  {entry.level === "error" ? "Erro · " : ""}
                  {entry.title}
                </summary>
                <ul>
                  {entry.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}
