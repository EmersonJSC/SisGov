/**
 * Documento "Resultado do turno": o que o Congresso votou e, se houve, a
 * eleição. Usa o papel da janela da lei.
 */
import { nomesPartidos, type Partida, type VisaoPartida } from "../../partida";
import { Documento, type JanelaProps } from "./DocumentoLei";
import { ICONE_INTERFACE } from "./icones";

const um = (v: number) =>
  v.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

/** Algo para mostrar: votação neste turno ou eleição que acabou de ocorrer. */
export function temResultado(partida: Partida): boolean {
  const { estado } = partida;
  return estado.votacoes.length > 0 || estado.eleicao?.turno === estado.turno;
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
