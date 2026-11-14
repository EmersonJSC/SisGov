/**
 * Painel que abre pelo botão ao lado de um índice, ministério ou instituição:
 * à esquerda, em vermelho, as leis que atrapalham; à direita, em verde, as que
 * ajudam, cada uma com uma barra do tamanho do efeito. Clicar numa lei abre a
 * janela dela. Só leitura.
 */
import type { ReactNode } from "react";
import type { Afetadas, LeiAfetante } from "./afetadas";
import { ICONE_INTERFACE, ICONE_LEI } from "./icones";
import { Icone } from "./Icone";
import { iconeLei } from "./iconesPersonalizados";
import "./PainelDeAfetadas.css";

const ROTULO_DO_TIPO: Readonly<Record<Afetadas["tipo"], string>> = {
  indice: "Índice",
  ministro: "Ministério",
  instituicao: "Instituição",
};
const TAMANHO_DO_ICONE = 18;
const PERCENTUAL = 100;

type Props = Readonly<{
  afetadas: Afetadas;
  onFechar: () => void;
  onAbrirLei: (id: string) => void;
  /** O que vem antes das leis (ex.: a troca do ministro). */
  topo?: ReactNode;
}>;

function Lado({
  classe,
  titulo,
  seta,
  leis,
  maior,
  onAbrirLei,
}: Readonly<{
  classe: "atrapalham" | "ajudam";
  titulo: string;
  seta: string;
  leis: readonly LeiAfetante[];
  maior: number;
  onAbrirLei: (id: string) => void;
}>) {
  return (
    <section className={`afetadas-lado afetadas-${classe}`}>
      <h3>
        <span aria-hidden="true">{seta}</span> {titulo}
        <span className="afetadas-conta">{leis.length}</span>
      </h3>
      {leis.length === 0 ? (
        <p className="afetadas-vazio">Nenhuma lei.</p>
      ) : (
        <ul>
          {leis.map((l) => (
            <li key={l.id}>
              <button type="button" onClick={() => onAbrirLei(l.id)}>
                <Icone
                  nome={iconeLei(l.id, ICONE_LEI[l.id] ?? ICONE_INTERFACE.lei)}
                  tamanho={TAMANHO_DO_ICONE}
                />
                <span className="afetadas-nome">{l.nome}</span>
                <span
                  className="afetadas-barra"
                  style={{ width: `${(l.peso / maior) * PERCENTUAL}%` }}
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function PainelDeAfetadas({
  afetadas,
  onFechar,
  onAbrirLei,
  topo,
}: Props) {
  const maior = Math.max(
    1,
    ...[...afetadas.ajudam, ...afetadas.atrapalham].map((l) => l.peso),
  );
  return (
    <aside
      className="afetadas"
      aria-label={`Leis que mexem em ${afetadas.nome}`}
    >
      <header>
        <div>
          <span className="afetadas-tipo">{ROTULO_DO_TIPO[afetadas.tipo]}</span>
          <h2>{afetadas.nome}</h2>
        </div>
        <button
          type="button"
          className="afetadas-fechar"
          onClick={onFechar}
          aria-label="Fechar"
        >
          ×
        </button>
      </header>
      {topo}
      <p className="afetadas-explicacao">{afetadas.explicacao}</p>
      <div className="afetadas-colunas">
        <Lado
          classe="atrapalham"
          titulo="Atrapalham"
          seta="▼"
          leis={afetadas.atrapalham}
          maior={maior}
          onAbrirLei={onAbrirLei}
        />
        <Lado
          classe="ajudam"
          titulo="Ajudam"
          seta="▲"
          leis={afetadas.ajudam}
          maior={maior}
          onAbrirLei={onAbrirLei}
        />
      </div>
    </aside>
  );
}
