/**
 * Painel da área aberta (docs/jogo/interface/area-aberta.md): as leis da área
 * em prateleiras (impostos, verbas, regras, Constituição), cada uma com o
 * estado em palavras e uma barra. Gaveta à direita; o mapa segue visível.
 */
import { useMemo, useState } from "react";
import type { VisaoLei, VisaoPartida } from "../../app/partida";
import { familiaDaLei, PRATELEIRAS, type Familia } from "./familia";
import { nivelDaLei } from "./formatos";
import { Icone } from "./Icone";
import { iconeLei } from "./iconesPersonalizados";
import { ICONE_INTERFACE, ICONE_LEI } from "./icones";

type Filtro = Familia | "todas" | "principais";

/** O estado da lei em palavras: a opção em vigor ou o valor com unidade. */
function estadoDaLei(lei: VisaoLei): string {
  if (lei.opcoes?.length) {
    const atual =
      lei.opcoes.find((o) => o.id === lei.opcaoAtual) ??
      lei.opcoes.reduce((a, b) =>
        Math.abs(b.valor - lei.nivel) < Math.abs(a.valor - lei.nivel) ? b : a,
      );
    return atual.rotulo;
  }
  return nivelDaLei(lei.nivel, lei.unidade);
}

/** Posição da lei na barra, de 0 a 1. */
function posicaoDaLei(lei: VisaoLei): number {
  const min = lei.minimo ?? 0;
  const max =
    lei.maximo ??
    (lei.unidade === "moeda_ano" ? Math.max(1, lei.nivel * 2) : 100);
  if (max <= min) return 0;
  return Math.min(1, Math.max(0, (lei.nivel - min) / (max - min)));
}

/** As leis que mais mexem no dinheiro da área (até 3) são as principais. */
function principaisDa(leis: readonly VisaoLei[]): Set<string> {
  return new Set(
    [...leis]
      .filter((l) => Math.abs(l.saldoAnual) > 0)
      .sort((a, b) => Math.abs(b.saldoAnual) - Math.abs(a.saldoAnual))
      .slice(0, 3)
      .map((l) => l.id),
  );
}

export function PainelDaArea({
  visao,
  aberta,
  selecionado,
  onSelecionar,
  onFechar,
}: {
  visao: VisaoPartida;
  aberta: string;
  selecionado: string | null;
  onSelecionar: (id: string) => void;
  onFechar: () => void;
}) {
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const area = visao.governo.find((a) => a.id === aberta);
  const leis = useMemo(
    () =>
      visao.leis
        .filter((l) => l.emVigor && l.areas.includes(aberta))
        .sort((a, b) => a.nome.localeCompare(b.nome, "pt")),
    [visao.leis, aberta],
  );
  const principais = useMemo(() => principaisDa(leis), [leis]);
  if (!area || leis.length === 0) return null;

  const prateleiras = PRATELEIRAS.map((p) => ({
    ...p,
    leis: leis.filter((l) => familiaDaLei(l) === p.familia),
  })).filter((p) => p.leis.length > 0);
  const visiveis =
    filtro === "todas"
      ? prateleiras
      : filtro === "principais"
        ? [
            {
              familia: "regra" as Familia,
              titulo: "Principais",
              leis: leis.filter((l) => principais.has(l.id)),
            },
          ]
        : prateleiras.filter((p) => p.familia === filtro);

  return (
    <aside className="painel-area" aria-label={`Leis: ${area.titulo}`}>
      <header className="painel-area-topo">
        <div>
          <h2>{area.titulo}</h2>
          <span>
            {area.cargo} · {leis.length} leis
          </span>
        </div>
        <button
          type="button"
          className="painel-area-fechar"
          onClick={onFechar}
          aria-label="Fechar a área"
        >
          ×
        </button>
      </header>
      <nav className="painel-area-abas" aria-label="Filtrar as leis">
        {(
          [
            ["todas", "Todas"],
            ...prateleiras.map((p) => [p.familia, p.titulo] as const),
            ["principais", "★ Principais"],
          ] as const
        ).map(([id, rotulo]) => (
          <button
            key={id}
            type="button"
            className={filtro === id ? "on" : ""}
            onClick={() => setFiltro(id)}
          >
            {rotulo}
          </button>
        ))}
      </nav>
      <div className="painel-area-corpo">
        {visiveis.map((p) => (
          <section key={p.titulo} className="prateleira">
            <h3>
              <i className={`marca familia-${p.familia}`} />
              {p.titulo} · {p.leis.length}
            </h3>
            {p.leis.map((lei) => {
              const familia = familiaDaLei(lei);
              const principal = principais.has(lei.id);
              const pos = posicaoDaLei(lei);
              return (
                <button
                  key={lei.id}
                  type="button"
                  className={`cartao-lei familia-${familia}${principal ? " principal" : ""}${lei.id === selecionado ? " selecionado" : ""}`}
                  onClick={() => onSelecionar(lei.id)}
                >
                  <span className="cartao-icone">
                    <Icone
                      nome={iconeLei(
                        lei.id,
                        ICONE_LEI[lei.id] ?? ICONE_INTERFACE.lei,
                      )}
                      tamanho={22}
                    />
                  </span>
                  <span className="cartao-texto">
                    <span className="cartao-nome">
                      {lei.nome}
                      {principal ? (
                        <span className="cartao-selo">★ principal</span>
                      ) : null}
                    </span>
                    <span className="cartao-estado">{estadoDaLei(lei)}</span>
                    <span className="cartao-barra" aria-hidden>
                      <span style={{ width: `${pos * 100}%` }} />
                    </span>
                  </span>
                </button>
              );
            })}
          </section>
        ))}
      </div>
    </aside>
  );
}
