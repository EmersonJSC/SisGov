import type { PreparoDoComeco } from "../../partida";
import { motivoDoPartido, type Escolhas } from "./escolhas";

export function EtapaPartido({
  e,
  mudar,
  preparo,
}: {
  e: Escolhas;
  mudar: (parcial: Partial<Escolhas>) => void;
  preparo: PreparoDoComeco;
}) {
  const motivo = motivoDoPartido(e, preparo.partidos);
  return (
    <section className="ini-dossie ini-ficha-de-registro">
      <h2>Registro de partido</h2>
      <label>
        Nome do partido
        <input
          value={e.nome}
          maxLength={48}
          onChange={(x) => mudar({ nome: x.target.value })}
        />
      </label>
      <label>
        Sigla
        <input
          className="curto"
          value={e.sigla}
          maxLength={8}
          onChange={(x) => mudar({ sigla: x.target.value.toUpperCase() })}
        />
      </label>
      <p className="ini-observacao">
        O partido nasce sem lado. Quem você pôr na chapa decide onde ele fica.
      </p>
      {motivo ? (
        <p className="ini-aviso-da-ficha">{motivo}</p>
      ) : (
        <span className="ini-selo ini-selo-azul">Registrado</span>
      )}
    </section>
  );
}
