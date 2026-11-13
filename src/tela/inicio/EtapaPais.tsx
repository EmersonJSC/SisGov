import { paisesJogaveis } from "../../partida";
import { nomeDoPais } from "../mapa/formatos";
import type { Escolhas } from "./escolhas";

export function EtapaPais({
  e,
  mudar,
}: {
  e: Escolhas;
  mudar: (parcial: Partial<Escolhas>) => void;
}) {
  return (
    <div className="mesa-dossies">
      {paisesJogaveis().map((id, i) => (
        <button
          key={id}
          className={`ini-pasta ${id === e.pais ? "ini-pasta-aberta" : ""}`}
          style={{ transform: `rotate(${i % 2 ? 1.2 : -1.6}deg)` }}
          onClick={() => mudar({ pais: id })}
        >
          <span className="ini-pasta-aba">Estado</span>
          <b>{nomeDoPais(id)}</b>
          <span>
            O país como está hoje, com o Congresso, os partidos e as leis.
          </span>
          {id === e.pais && <span className="ini-selo">Escolhido</span>}
        </button>
      ))}
      <label className="ini-papel-solto">
        Semente do sorteio
        <input
          type="number"
          value={e.semente}
          onChange={(x) => mudar({ semente: Number(x.target.value) })}
        />
        <small>Mesma semente, mesmas pessoas e mesma partida.</small>
      </label>
    </div>
  );
}
