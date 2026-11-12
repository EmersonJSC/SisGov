/**
 * Placar previsto de uma lei e a negociação com os indecisos: o mesmo
 * placar que a votação vai dar (sem sorteio), com a linha do quórum.
 */
import { INDECISO } from "../../motor";
import type { PedidoOferecer, Votacao } from "../../partida";

const MOEDAS_DA_TELA = [
  ["cargos", "Cargos"],
  ["emenda", "Emenda"],
] as const;

const pct = (v: number, total: number) => (total ? (v / total) * 100 : 0);

export function PlacarDaLei({
  placar,
  partidos,
  governo,
  naFila,
  ofertas,
  podeCeder,
  onOferecer,
  onTirarOferta,
}: {
  placar: Votacao;
  partidos: Record<string, string>;
  governo: string;
  /** A lei está na fila: dá para oferecer moedas. */
  naFila: boolean;
  ofertas: PedidoOferecer[];
  podeCeder: boolean;
  onOferecer: (p: Omit<PedidoOferecer, "tipo" | "lei">) => void;
  onTirarOferta: (i: number) => void;
}) {
  const total = placar.total ?? placar.sim + placar.nao;
  const quorum = placar.quorum ?? 0.5;
  const notas = Object.entries(placar.notas ?? {}).filter(
    ([id]) => id !== governo,
  );
  const indecisos = notas
    .filter(([, n]) => Math.abs(n) < INDECISO)
    .map(([id]) => id);
  const casa = placar.casa === "senado" ? "Senado" : "Câmara";
  return (
    <section className="placar-lei" aria-label="Placar previsto">
      <h3>
        Placar previsto · {casa}{" "}
        <span className={placar.aprovada ? "passa" : "cai"}>
          {placar.aprovada ? "passa" : "cai"}
        </span>
      </h3>
      <div
        className="placar-barra"
        role="img"
        aria-label={`${placar.sim} sim, ${placar.nao} não, precisa de mais de ${Math.round(quorum * total)}`}
      >
        <span
          className="placar-sim"
          style={{ width: `${pct(placar.sim, total)}%` }}
        />
        <span
          className="placar-quorum"
          style={{ left: `${quorum * 100}%` }}
          title={`Quórum ${Math.round(quorum * 100)}%`}
        />
      </div>
      <p className="placar-texto">
        {placar.sim} sim · {placar.nao} não
        {placar.indecisos ? ` · ${placar.indecisos} indecisos` : ""} · precisa
        de mais de {Math.round(quorum * total)}
      </p>
      {placar.exorbitante ? (
        <p className="placar-aviso">
          Exorbitante: a conta da lei tira a maioria. Ceda na régua ou compre
          votos.
        </p>
      ) : null}
      {indecisos.length ? (
        <p className="placar-texto">
          Perto do zero: {indecisos.map((id) => partidos[id] ?? id).join(", ")}
        </p>
      ) : null}
      {naFila ? (
        <div className="placar-negociar">
          <h4>Negociar</h4>
          {podeCeder ? (
            <button
              type="button"
              onClick={() => onOferecer({ moeda: "ceder" })}
              disabled={ofertas.some((o) => o.moeda === "ceder")}
            >
              Ceder na régua
            </button>
          ) : null}
          <PartidosEMoedas
            candidatos={notas
              .sort((a, b) => Math.abs(a[1]) - Math.abs(b[1]))
              .map(([id]) => id)
              .slice(0, 5)}
            partidos={partidos}
            onOferecer={onOferecer}
          />
          {ofertas.length ? (
            <ul className="placar-ofertas">
              {ofertas.map((o, i) => (
                <li key={`${o.moeda}-${o.partido ?? ""}-${i}`}>
                  {o.moeda === "ceder"
                    ? "Cede na régua"
                    : `${o.moeda === "cargos" ? "Cargos" : "Emenda"} a ${partidos[o.partido ?? ""] ?? o.partido}`}{" "}
                  <button type="button" onClick={() => onTirarOferta(i)}>
                    tirar
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function PartidosEMoedas({
  candidatos,
  partidos,
  onOferecer,
}: {
  candidatos: string[];
  partidos: Record<string, string>;
  onOferecer: (p: Omit<PedidoOferecer, "tipo" | "lei">) => void;
}) {
  return (
    <ul className="placar-partidos">
      {candidatos.map((id) => (
        <li key={id}>
          <span>{partidos[id] ?? id}</span>
          {MOEDAS_DA_TELA.map(([moeda, rotulo]) => (
            <button
              key={moeda}
              type="button"
              onClick={() => onOferecer({ moeda, partido: id })}
            >
              {rotulo}
            </button>
          ))}
        </li>
      ))}
    </ul>
  );
}
