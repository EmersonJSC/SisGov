/**
 * Documento "Resultado do turno": o que o Congresso votou e, se houve, a
 * eleição. Usa o papel da janela da lei.
 */
import { forcaDoFato, type Fato } from "../../motor";
import { nomesPartidos, type Partida, type VisaoPartida } from "../../partida";
import { Documento, type JanelaProps } from "./DocumentoLei";
import { ICONE_INTERFACE } from "./icones";

const um = (v: number) =>
  v.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

/** Algo para mostrar: votação, eleição ou fato na mesa. */
export function temResultado(partida: Partida): boolean {
  const { estado } = partida;
  return (
    estado.votacoes.length > 0 ||
    estado.eleicao?.turno === estado.turno ||
    (estado.fatos ?? []).length > 0
  );
}

/** Manchete do fato; o motor só guarda ids. */
function manchete(
  fato: Fato,
  nomeLei: (id: string) => string,
  partidos: Record<string, string>,
): string {
  const lei = fato.sobre ? nomeLei(fato.sobre) : "";
  const ids = fato.quem ?? [];
  const quem =
    ids.length > 3
      ? `${ids.length} partidos`
      : ids.map((p) => partidos[p] ?? p).join(", ");
  switch (fato.tipo) {
    case "lei-aprovada":
      return `Congresso aprova ${lei}`;
    case "lei-rejeitada":
      return `Congresso derruba ${lei}${quem ? ` com votos de ${quem}` : ""}`;
    case "partido-saiu-da-base":
      return `${quem} deixa a base do governo`;
    case "partido-entrou-na-base":
      return `${quem} entra na base do governo`;
    case "eleicao-vencida":
      return "Governo vence a eleição";
    case "eleicao-perdida":
      return "Governo perde a eleição";
  }
}

export function ResultadoDoTurno({
  partida,
  visao,
  onFechar,
  ...janela
}: JanelaProps & {
  partida: Partida;
  visao: VisaoPartida;
  onFechar: () => void;
}) {
  const { estado } = partida;
  const partidos = nomesPartidos(partida.pais);
  const eleicao =
    estado.eleicao?.turno === estado.turno ? estado.eleicao : null;
  const lei = (id: string) => visao.leis.find((l) => l.id === id);
  const fatos = [...(estado.fatos ?? [])].sort(
    (a, b) => b.turno - a.turno || forcaDoFato(b) - forcaDoFato(a),
  );
  const valorPedido = (id: string, valor: number | string) =>
    typeof valor === "number"
      ? `${um(valor * 100)}%`
      : (lei(id)?.opcoes?.find((o) => o.id === valor)?.rotulo ?? valor);

  return (
    <Documento
      orgao={eleicao ? "Justiça Eleitoral" : "Congresso"}
      setor="Resultado do turno"
      numero={`Ano ${Math.floor(estado.turno / 6) + 1} · mês ${(estado.turno % 6) * 2 + 1}`}
      cor="#7a5c2e"
      icone={ICONE_INTERFACE.lei}
      onFechar={onFechar}
      rotulo="Resultado do turno"
      {...janela}
    >
      <div className="folha resultado-turno">
        {eleicao ? (
          <section className={eleicao.venceu ? "ganhou" : "perdeu"}>
            <h1 className="titulo-doc">
              {eleicao.venceu
                ? "O governo venceu a eleição"
                : "O governo perdeu a eleição"}
            </h1>
            <p className="folha-explica">
              Apoio {um(eleicao.apoio)}% contra {um(eleicao.adversario)}% do
              adversário (desgaste {um(eleicao.desgaste)}).
              {estado.encerrada ? " A partida terminou." : ""}
            </p>
          </section>
        ) : null}
        {fatos.length ? (
          <section>
            <h2>Fatos na mesa</h2>
            <ul className="fatos-turno">
              {fatos.map((f, i) => (
                <li
                  key={`${f.turno}-${f.tipo}-${f.sobre ?? ""}-${i}`}
                  className={`fato-${f.tamanho}`}
                  style={{ opacity: 0.4 + 0.6 * forcaDoFato(f) }}
                >
                  <strong>
                    {manchete(f, (id) => lei(id)?.nome ?? id, partidos)}
                  </strong>
                  <small>
                    {f.turno === estado.turno
                      ? " · agora"
                      : ` · há ${estado.turno - f.turno} turno(s)`}
                  </small>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {estado.votacoes.length ? (
          <section>
            <h2>Votações</h2>
            <ul className="votacoes-turno">
              {estado.votacoes.map((v) => (
                <li
                  key={v.lei}
                  className={v.aprovada ? "aprovada" : "rejeitada"}
                >
                  <div className="votacao-linha">
                    <span>
                      <strong>{lei(v.lei)?.nome ?? v.lei}</strong>
                      <small> → {valorPedido(v.lei, v.valor)}</small>
                    </span>
                    <b>{v.aprovada ? "Aprovada" : "Rejeitada"}</b>
                    <span className="votacao-placar">
                      {v.sim} sim × {v.nao} não
                    </span>
                  </div>
                  {v.exorbitante ? (
                    <small className="votacao-nota">
                      Mudança exorbitante: grande demais para um turno.
                    </small>
                  ) : null}
                  <div className="votacao-partidos">
                    {Object.entries(v.votos).map(([id, voto]) => (
                      <span key={id}>
                        {partidos[id] ?? id}: {voto === "nao" ? "não" : voto}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </Documento>
  );
}
