/**
 * O jornal do turno e a faixa "acontecendo agora" (SG106). O tamanho da
 * notícia segue o nível da ocorrência: local vai para o rodapé, catástrofe
 * vira capa.
 */
import type {
  RelatorioTurno,
  VisaoOcorrenciaAtiva,
  VisaoRegistro,
} from "../../app/partida";
import { NOME_NIVEL } from "./MesaDoPresidente";

function Noticia({ item, rotulo }: { item: VisaoRegistro; rotulo?: string }) {
  return (
    <li
      className={`noticia nivel-${item.nivel} ${item.avaliacao === "positiva" ? "boa" : "ruim"}`}
    >
      <span className={`selo-nivel nivel-${item.nivel}`}>
        {rotulo ?? NOME_NIVEL[item.nivel] ?? ""}
      </span>
      <span className="noticia-texto">{item.manchete}</span>
    </li>
  );
}

export function JornalDoTurno({
  jornal,
}: {
  jornal: RelatorioTurno["ocorrencias"];
}) {
  const eventos = [...jornal.eventos].sort((a, b) => b.nivel - a.nivel);
  const vazio =
    !eventos.length &&
    !jornal.surgiram.length &&
    !jornal.acabaram.length &&
    !jornal.dilemas.length;
  if (vazio) return null;
  const capa = eventos.find((e) => e.nivel >= 4);
  return (
    <section className="jornal">
      <h3>Jornal do turno</h3>
      {capa ? <p className="capa-catastrofe">{capa.manchete}</p> : null}
      <ul>
        {eventos
          .filter((e) => e !== capa)
          .map((e) => (
            <Noticia key={`e-${e.id}`} item={e} />
          ))}
        {jornal.surgiram.map((s) => (
          <Noticia key={`s-${s.id}`} item={s} rotulo="Surgiu" />
        ))}
        {jornal.acabaram.map((s) => (
          <li key={`a-${s.id}`} className="noticia boa">
            <span className="selo-nivel acabou">Acabou</span>
            <span className="noticia-texto">{s.nome}</span>
          </li>
        ))}
        {jornal.dilemas.map((d) => (
          <Noticia key={`d-${d.id}`} item={d} rotulo="Na sua mesa" />
        ))}
      </ul>
    </section>
  );
}

export function AcontecendoAgora({
  ocorrencias,
}: {
  ocorrencias: readonly VisaoOcorrenciaAtiva[];
}) {
  if (!ocorrencias.length) return null;
  return (
    <aside className="acontecendo" aria-label="Acontecendo agora">
      <h3>Acontecendo agora</h3>
      <ul>
        {ocorrencias.map((o) => (
          <li
            key={`${o.id}-${o.opcao ?? ""}-${o.inicio}`}
            className={`nivel-${o.nivel} ${o.tipo}`}
            title={o.efeitos
              .map((e) => `${e.pontos > 0 ? "▲" : "▼"} ${e.nome}`)
              .join("\n")}
          >
            <strong>{o.opcao ? o.opcao : o.nome}</strong>
            <small>
              {o.opcao ? `${o.nome} · ` : ""}
              {o.mesesRestantes} {o.mesesRestantes === 1 ? "mês" : "meses"}
            </small>
          </li>
        ))}
      </ul>
    </aside>
  );
}
