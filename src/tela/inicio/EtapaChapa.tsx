import { useState } from "react";
import type { PreparoDoComeco } from "../../partida";
import { Foto } from "./Foto";
import { ListaDePessoas } from "./ListaDePessoas";
import { VAGAS, type Escolhas, type Vaga } from "./escolhas";

const INCLINACAO = [-2.2, 0.8, 2.4];

interface Props {
  e: Escolhas;
  mudar: (parcial: Partial<Escolhas>) => void;
  preparo: PreparoDoComeco;
}

/** Partidos das pessoas da chapa, sem repetir e sem os "sem partido". */
function partidosDaChapa(e: Escolhas, preparo: PreparoDoComeco) {
  const ids = new Set(
    Object.values(e.chapa).flatMap((id) => {
      const p = preparo.pessoas.find((x) => x.id === id);
      return p && p.origem !== "tecnico" ? [p.origem] : [];
    }),
  );
  return preparo.partidos.filter((p) => ids.has(p.id));
}

export function EtapaChapa({ e, mudar, preparo }: Props) {
  const [vaga, setVaga] = useState<Vaga | null>(null);
  const escolhidos = Object.values(e.chapa);
  const livres = preparo.pessoas.filter(
    (p) => !escolhidos.includes(p.id) || p.id === (vaga && e.chapa[vaga]),
  );
  const aliados = partidosDaChapa(e, preparo);
  const governava = preparo.partidos.find((p) => p.id === preparo.governava);
  return (
    <>
      <div className="ini-chapa">
        {VAGAS.map((v, i) => {
          const pessoa = preparo.pessoas.find((p) => p.id === e.chapa[v.chave]);
          return (
            <button
              key={v.chave}
              className="ini-vaga"
              onClick={() => setVaga(v.chave)}
            >
              <Foto pessoa={pessoa ?? null} inclinacao={INCLINACAO[i]} />
              <span className="ini-vaga-cargo">{v.nome}</span>
              <b>{pessoa ? pessoa.nome : "Escolher"}</b>
              {pessoa && <span>{pessoa.origemNome}</span>}
            </button>
          );
        })}
      </div>
      <section className="ini-papel-solto ini-aliados">
        <h3>Coligação</h3>
        {aliados.length === 0 ? (
          <p>Os partidos das três pessoas entram com você.</p>
        ) : (
          <p>
            Entram com você:{" "}
            {aliados.map((p) => `${p.nome} (${p.cadeiras})`).join(", ")}.
          </p>
        )}
        {governava && (
          <label className="ini-marcar">
            <input
              type="checkbox"
              checked={e.coligarGoverno}
              onChange={(x) => mudar({ coligarGoverno: x.target.checked })}
            />
            Convidar também o {governava.nome}, que governava, para a coligação
          </label>
        )}
      </section>
      {vaga && (
        <ListaDePessoas
          titulo={VAGAS.find((v) => v.chave === vaga)?.nome ?? ""}
          pais={e.pais}
          semente={e.semente}
          pessoas={livres}
          partidos={preparo.partidos}
          onFechar={() => setVaga(null)}
          onEscolher={(id) => {
            mudar({ chapa: { ...e.chapa, [vaga]: id } });
            setVaga(null);
          }}
        />
      )}
    </>
  );
}
