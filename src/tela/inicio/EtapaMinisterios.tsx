import { useState } from "react";
import type { PessoaDaLista, PreparoDoComeco } from "../../partida";
import { ListaDePessoas } from "./ListaDePessoas";
import type { Escolhas } from "./escolhas";

interface Props {
  e: Escolhas;
  mudar: (parcial: Partial<Escolhas>) => void;
  preparo: PreparoDoComeco;
  /** Quem cuida de cada caixa agora: o sorteio mais o que o jogador trocou. */
  ministros: Record<string, string>;
  onTrocar: (caixa: string, pessoa: string) => void;
}

function Linha({
  nome,
  pessoa,
  onTrocar,
}: {
  nome: string;
  pessoa?: PessoaDaLista;
  onTrocar: () => void;
}) {
  return (
    <tr>
      <th>{nome}</th>
      <td>{pessoa?.nome ?? "—"}</td>
      <td>{pessoa?.origemNome}</td>
      <td className="ini-num">{pessoa?.competencia}</td>
      <td className="ini-num">{pessoa?.honestidade}</td>
      <td>
        <button className="ini-fechar" onClick={onTrocar}>
          Trocar
        </button>
      </td>
    </tr>
  );
}

export function EtapaMinisterios({
  e,
  mudar,
  preparo,
  ministros,
  onTrocar,
}: Props) {
  const [caixa, setCaixa] = useState<string | null>(null);
  const daChapa = Object.values(e.chapa);
  const candidatos = preparo.pessoas.filter((p) => !daChapa.includes(p.id));
  return (
    <section className="ini-dossie ini-ministerios">
      <header>
        <h2>Ministérios</h2>
        <button
          className="placa-ferro placa-ferro-pequena"
          onClick={() => mudar({ rodada: e.rodada + 1, trocas: {} })}
        >
          Sortear de novo
        </button>
      </header>
      <p className="ini-observacao">
        O jogo sorteou pela chapa: gente competente e perto das suas ideias.
        Troque quem quiser.
      </p>
      <div className="ini-tabela-rolante">
        <table>
          <thead>
            <tr>
              <th>Ministério</th>
              <th>Ministro</th>
              <th>Partido</th>
              <th>Comp.</th>
              <th>Hon.</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {preparo.caixas.map((c) => (
              <Linha
                key={c.molde}
                nome={c.nome}
                pessoa={preparo.pessoas.find(
                  (p) => p.id === ministros[c.molde],
                )}
                onTrocar={() => setCaixa(c.molde)}
              />
            ))}
          </tbody>
        </table>
      </div>
      {caixa && (
        <ListaDePessoas
          titulo={preparo.caixas.find((c) => c.molde === caixa)?.nome ?? ""}
          pais={e.pais}
          semente={e.semente}
          pessoas={candidatos}
          partidos={preparo.partidos}
          onFechar={() => setCaixa(null)}
          onEscolher={(id) => {
            onTrocar(caixa, id);
            setCaixa(null);
          }}
        />
      )}
    </section>
  );
}
