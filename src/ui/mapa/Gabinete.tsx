/**
 * O gabinete (M8.3): uma ficha por área do governo. O jogador escolhe quem
 * comanda cada bolha entre os nomes da área, ou manda sortear a partir da
 * chapa. Só biografia, opiniões e atributos aparecem; ninguém diz de que
 * lado está.
 */
import { useState } from "react";
import type { VisaoAreaDaChapa } from "../../app/partida";
import { Dossie } from "./Dossie";

export function Gabinete({
  areas,
  escolhidos,
  onEscolher,
  onSortear,
  mantidos = false,
}: {
  areas: readonly VisaoAreaDaChapa[];
  /** Id escolhido em cada área (id da área → id do ministro). */
  escolhidos: Readonly<Record<string, string>>;
  onEscolher: (area: string, id: string) => void;
  /** Sorteia os ministros a partir da chapa. */
  onSortear?: () => void;
  /** Sem escolha, a área fica com quem já está (na troca da eleição). */
  mantidos?: boolean;
}) {
  const [aberta, setAberta] = useState(areas[0]?.id ?? "");
  const area = areas.find((a) => a.id === aberta) ?? areas[0];
  if (!area) return null;
  const nomeDe = (a: VisaoAreaDaChapa) =>
    a.opcoes.find((o) => o.id === escolhidos[a.id])?.nome ??
    (mantidos ? (a.ministro?.nome ?? "vago") : "a escolher");
  return (
    <div className="gb-gabinete">
      <div className="gb-areas" role="tablist" aria-label="Áreas do governo">
        {areas.map((a) => (
          <button
            key={a.id}
            type="button"
            role="tab"
            aria-selected={a.id === area.id}
            className={`gb-area${a.id === area.id ? " gb-aberta" : ""}${
              escolhidos[a.id] ? " gb-escolhida" : ""
            }`}
            onClick={() => setAberta(a.id)}
          >
            <strong>{a.cargo}</strong>
            <small>{nomeDe(a)}</small>
          </button>
        ))}
        {onSortear ? (
          <button type="button" className="ds-assinar" onClick={onSortear}>
            Sortear ministros
          </button>
        ) : null}
      </div>
      <p className="ds-dica">
        {area.titulo}
        {mantidos && area.ministro
          ? `. Hoje: ${area.ministro.nome}. Sem escolha, ele continua.`
          : "."}
      </p>
      <Dossie
        key={area.id}
        personagens={area.opcoes}
        escolhido={escolhidos[area.id] ?? null}
        onEscolher={(id) => onEscolher(area.id, id)}
        escolherNoClique
        vazio
      />
    </div>
  );
}
