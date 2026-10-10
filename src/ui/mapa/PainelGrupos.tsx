/**
 * Lista lateral dos grupos sociais (SG143): do mais satisfeito ao menos
 * satisfeito, com o peso de cada um no eleitorado e o que mais gosta e mais
 * odeia agora (o grupo escolhido mostra os três maiores de cada lado).
 * Clicar num grupo ou num motivo abre o documento dele.
 */
import type { VisaoGrupo, VisaoMotivo } from "../../app/partida";
import { Icone } from "./Icone";
import { ICONE_BOLHA, ICONE_LEI } from "./icones";
import { corDaBondade } from "./intensidade";

function Motivo({
  motivo,
  onSelecionar,
}: {
  motivo: VisaoMotivo;
  onSelecionar: (id: string) => void;
}) {
  const bom = motivo.pontos > 0;
  return (
    <button
      type="button"
      className={`motivo-grupo ${bom ? "gosta" : "odeia"}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelecionar(motivo.id);
      }}
      title={`${motivo.tipo === "lei" ? "Lei" : "Indicador"}: ${bom ? "+" : "−"}${Math.abs(motivo.pontos).toFixed(1)} pontos de satisfação`}
    >
      <Icone
        nome={
          (motivo.tipo === "lei" ? ICONE_LEI : ICONE_BOLHA)[motivo.id] ??
          (motivo.tipo === "lei" ? "file-document-outline" : "chart-line")
        }
        tamanho={12}
      />
      <span>{motivo.nome}</span>
      <b>
        {bom ? "+" : "−"}
        {Math.abs(motivo.pontos).toFixed(0)}
      </b>
    </button>
  );
}

/** Largura que a lista aberta cobre do mapa (CSS: 300 + 14 de margem + folga). */
export const LARGURA_PAINEL_GRUPOS = 328;

export function PainelGrupos({
  grupos,
  aprovacao,
  variacoes,
  selecionado,
  onSelecionar,
  aberto,
  onAlternar,
}: {
  grupos: readonly VisaoGrupo[];
  aprovacao?: number;
  /** Quanto cada grupo mudou no último turno. */
  variacoes: ReadonlyMap<string, number>;
  selecionado: string | null;
  onSelecionar: (id: string) => void;
  aberto: boolean;
  onAlternar: () => void;
}) {
  if (!grupos.length) return null;
  return (
    <aside
      className={`painel-grupos${aberto ? " aberto" : ""}`}
      aria-label="Grupos sociais"
    >
      <button
        type="button"
        className="painel-grupos-topo"
        onClick={onAlternar}
        aria-expanded={aberto}
      >
        <Icone nome="account-group" tamanho={18} />
        <span>
          <strong>Grupos sociais</strong>
          {aprovacao !== undefined ? (
            <small>aprovação {Math.round(aprovacao)}%</small>
          ) : null}
        </span>
        <i aria-hidden="true">{aberto ? "‹" : "›"}</i>
      </button>
      {aberto ? (
        <ol className="lista-grupos">
          {grupos.map((g) => {
            const cor = corDaBondade(g.satisfacao / 100);
            const d = variacoes.get(g.id);
            // o que mais gosta e mais odeia; o grupo escolhido mostra mais
            const quantos = g.id === selecionado ? 3 : 1;
            return (
              <li
                key={g.id}
                className={g.id === selecionado ? "selecionado" : undefined}
              >
                <button
                  type="button"
                  className="grupo-linha"
                  onClick={() => onSelecionar(g.id)}
                >
                  <span className="grupo-icone" style={{ color: cor }}>
                    <Icone
                      nome={ICONE_BOLHA[g.id] ?? "account-group"}
                      tamanho={18}
                    />
                  </span>
                  <span className="grupo-nome">
                    <strong>{g.nome}</strong>
                    <small>{Math.round(g.peso * 100)}% do eleitorado</small>
                  </span>
                  <span className="grupo-valor" style={{ color: cor }}>
                    {Math.round(g.satisfacao)}
                    {d !== undefined && Math.abs(d) >= 0.1 ? (
                      <small className={d > 0 ? "sobe" : "desce"}>
                        {d > 0 ? "▲" : "▼"}
                        {Math.abs(d).toFixed(1)}
                      </small>
                    ) : null}
                  </span>
                  <span className="grupo-barra" aria-hidden="true">
                    <i style={{ width: `${g.satisfacao}%`, background: cor }} />
                  </span>
                </button>
                <div className="grupo-motivos">
                  <div className="motivos-coluna">
                    {g.gosta.slice(0, quantos).map((m) => (
                      <Motivo
                        key={m.id}
                        motivo={m}
                        onSelecionar={onSelecionar}
                      />
                    ))}
                  </div>
                  <div className="motivos-coluna">
                    {g.odeia.slice(0, quantos).map((m) => (
                      <Motivo
                        key={m.id}
                        motivo={m}
                        onSelecionar={onSelecionar}
                      />
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      ) : null}
    </aside>
  );
}
