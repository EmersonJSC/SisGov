/**
 * Leis fora do mapa (D-65): as que não estão em vigor. As livres podem ser
 * aprovadas (o clique abre o documento da lei); as bloqueadas aparecem
 * trancadas, com o motivo (falta uma lei de base ou a lei é pétrea).
 */
import { useEffect, type CSSProperties } from "react";
import type { VisaoArea, VisaoLei } from "../../app/partida";
import { Icone } from "./Icone";
import { ICONE_INTERFACE, ICONE_LEI } from "./icones";

const NOME_NIVEL: Readonly<Record<string, string>> = {
  petrea: "Cláusula pétrea",
  constitucional: "Constitucional",
  derivada: "Lei",
};

export function CatalogoDeLeis({
  leis,
  governo,
  corDoMinisterio,
  onEscolher,
  onFechar,
}: {
  leis: readonly VisaoLei[];
  governo: readonly VisaoArea[];
  corDoMinisterio: (ministerio: string) => string | undefined;
  onEscolher: (lei: VisaoLei) => void;
  onFechar: () => void;
}) {
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFechar();
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [onFechar]);

  const fora = leis.filter((l) => !l.emVigor);
  const porArea = governo
    .map((area) => ({
      area,
      leis: fora
        .filter((l) => l.areas[0] === area.id)
        .sort(
          (a, b) =>
            Number(!!a.bloqueio) - Number(!!b.bloqueio) ||
            a.nome.localeCompare(b.nome, "pt-BR"),
        ),
    }))
    .filter((g) => g.leis.length > 0);

  return (
    <div
      className="busca-fundo"
      role="dialog"
      aria-label="Leis fora do mapa"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <div className="busca catalogo">
        <header className="catalogo-topo">
          <Icone nome={ICONE_INTERFACE.catalogo} tamanho={24} />
          <div>
            <strong>Leis fora do mapa</strong>
            <small>
              Leis que hoje não valem. Aprove uma para ela entrar no mapa; as
              trancadas dependem de outra lei antes.
            </small>
          </div>
          <button
            type="button"
            className="catalogo-fechar"
            aria-label="Fechar"
            onClick={onFechar}
          >
            <Icone nome={ICONE_INTERFACE.fechar} tamanho={20} />
          </button>
        </header>
        {porArea.length === 0 ? (
          <p className="busca-nada">Todas as leis estão em vigor.</p>
        ) : (
          porArea.map(({ area, leis: lista }) => (
            <section key={area.id} className="catalogo-area">
              <h3
                style={{ "--cor": corDoMinisterio(area.id) } as CSSProperties}
              >
                <Icone nome={ICONE_INTERFACE[area.id] ?? "bank"} tamanho={18} />
                {area.titulo}
              </h3>
              <ul className="busca-resultados">
                {lista.map((lei) => (
                  <li key={lei.id}>
                    <button
                      type="button"
                      className={lei.bloqueio ? "trancada" : undefined}
                      onClick={() => {
                        onEscolher(lei);
                        onFechar();
                      }}
                      style={
                        {
                          "--cor": corDoMinisterio(area.id) ?? "#5f7290",
                        } as CSSProperties
                      }
                    >
                      <span className="busca-icone">
                        <Icone
                          nome={
                            lei.bloqueio
                              ? ICONE_INTERFACE.trancada
                              : (ICONE_LEI[lei.id] ?? ICONE_INTERFACE.lei)
                          }
                          tamanho={22}
                        />
                      </span>
                      <span className="busca-texto">
                        <strong>{lei.nome}</strong>
                        <small>
                          <em className="busca-tema">
                            {NOME_NIVEL[lei.nivelLegal ?? ""] ?? "Lei"}
                          </em>
                          {lei.ministerio ? ` · ${lei.ministerio}` : ""}
                          {lei.bloqueio ? " · trancada" : " · pode aprovar"}
                        </small>
                        {lei.bloqueio ? (
                          <small className="busca-motivo">{lei.bloqueio}</small>
                        ) : lei.descricao ? (
                          <small className="busca-motivo">
                            {lei.descricao}
                          </small>
                        ) : null}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
