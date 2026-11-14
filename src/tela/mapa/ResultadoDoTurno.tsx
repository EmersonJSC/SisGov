/**
 * Documento "Resultado do turno": o que o Congresso votou e, se houve, a
 * eleição. Usa o papel da janela da lei.
 */
import { forcaDoFato } from "../../motor";
import { PACIENCIA_BAIXA, TERMOMETRO_CONVITE } from "../../motor";
import {
  indicesDoMundo,
  manchete,
  nomesDoGoverno,
  nomesPartidos,
  type NomesDoJornal,
  type Partida,
  type Pedido,
  type VisaoPartida,
} from "../../partida";
import { Documento, type JanelaProps } from "./DocumentoLei";
import { papeisParaDecidir } from "./MesaDePapeis";
import { trocar } from "./pedidos";
import { ICONE_INTERFACE } from "./icones";

const ORIGEM: Record<string, string> = {
  emenda: "emenda do Senado",
  volta: "volta à Câmara",
  decreto: "decreto",
  "decreto-derrubado": "decreto derrubado",
  "derrubada-do-veto": "derrubada do veto",
};

const um = (v: number) =>
  v.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

/** Algo para mostrar: votação, eleição ou fato na mesa. */
export function temResultado(partida: Partida): boolean {
  const { estado } = partida;
  return (
    estado.votacoes.length > 0 ||
    estado.eleicao?.turno === estado.turno ||
    (estado.fatos ?? []).some((f) => f.turno === estado.turno) ||
    (estado.congresso?.sancao.length ?? 0) > 0
  );
}

export function ResultadoDoTurno({
  partida,
  visao,
  onFechar,
  extras,
  setExtras,
  ...janela
}: JanelaProps & {
  partida: Partida;
  visao: VisaoPartida;
  onFechar: () => void;
  /** Vetos e convites já marcados neste turno. */
  extras: Pedido[];
  setExtras: (e: Pedido[]) => void;
}) {
  const { estado } = partida;
  const partidos = nomesPartidos(partida.pais, partida.opcoes.comeco);
  const governo = nomesDoGoverno(partida);
  const nomes: NomesDoJornal = {
    lei: (id) => lei(id)?.nome ?? id,
    quem: { ...partidos, ...governo.pessoas },
    caixa: governo.caixas,
    area: governo.instituicoes,
    tribunal: Object.fromEntries(
      (partida.regras.judiciario?.tribunais ?? []).map((t) => [t.id, t.rotulo]),
    ),
    programa: (id) => estado.programas?.vidas[id]?.nome ?? id,
    meta: (id) =>
      estado.programas?.vidas[id]?.nome ??
      indicesDoMundo.find((i) => i.id === id)?.nome ??
      id,
  };
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
        {estado.midia?.jornal.length ? (
          <section className="jornal-do-turno">
            <h2>Jornal do turno</h2>
            <h1 className="titulo-doc">
              {manchete(estado.midia.jornal[0], nomes)}
            </h1>
            <ul className="fatos-turno">
              {estado.midia.jornal.slice(1).map((f, i) => (
                <li key={`${f.tipo}-${f.sobre ?? ""}-${i}`}>
                  <strong>{manchete(f, nomes)}</strong>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {fatos.length ? (
          <section>
            <h2>Fatos do turno</h2>
            <ul className="fatos-turno">
              {fatos.map((f, i) => (
                <li
                  key={`${f.turno}-${f.tipo}-${f.sobre ?? ""}-${i}`}
                  className={`fato-${f.tamanho}`}
                  style={{ opacity: 0.4 + 0.6 * forcaDoFato(f) }}
                >
                  <strong>{manchete(f, nomes)}</strong>
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
        {estado.congresso ? (
          <section>
            <h2>Congresso</h2>
            <p className="congresso-paciencia">
              Paciência: Câmara {Math.round(estado.congresso.paciencia.camara)}
              {partida.regras.congresso?.senado
                ? ` · Senado ${Math.round(estado.congresso.paciencia.senado)}`
                : ""}
              {estado.congresso.paciencia.camara < PACIENCIA_BAIXA
                ? " — a Câmara pune o governo"
                : ""}
            </p>
            {estado.congresso.pauta.length ? (
              <ul className="congresso-pauta">
                {estado.congresso.pauta.map((t) => (
                  <li key={t.lei}>
                    {lei(t.lei)?.nome ?? t.lei} → {valorPedido(t.lei, t.valor)}:{" "}
                    {t.casa === "senado"
                      ? "vai ao Senado"
                      : t.casa === "camara-volta"
                        ? "volta à Câmara"
                        : "espera vaga na pauta"}
                  </li>
                ))}
              </ul>
            ) : null}
            {papeisParaDecidir(partida).length ? (
              <p className="congresso-mesa">
                Há {papeisParaDecidir(partida).length} papel(éis) na sua mesa
                esperando carimbo.
              </p>
            ) : null}
            <ul className="congresso-termometro">
              {Object.entries(estado.congresso.termometro)
                .filter(([id]) => id !== partida.regras.congresso?.governo)
                .sort((a, b) => b[1] - a[1])
                .map(([id, t]) => {
                  const naBase = estado.coligacao.includes(id);
                  const convidando = extras.some(
                    (x) => x.tipo === "convidar" && x.partido === id,
                  );
                  return (
                    <li key={id} className={naBase ? "base" : "oposicao"}>
                      <span>{partidos[id] ?? id}</span>
                      <span
                        className="termometro"
                        role="img"
                        aria-label={`Termômetro ${Math.round(t)}`}
                      >
                        <i style={{ width: `${t}%` }} />
                      </span>
                      <small>{naBase ? "base" : "oposição"}</small>
                      {!naBase && t > TERMOMETRO_CONVITE ? (
                        <button
                          type="button"
                          onClick={() =>
                            setExtras(
                              trocar(
                                extras,
                                (x) =>
                                  x.tipo === "convidar" && x.partido === id,
                                convidando
                                  ? undefined
                                  : { tipo: "convidar", partido: id },
                              ),
                            )
                          }
                        >
                          {convidando ? "Desconvidar" : "Convidar"}
                        </button>
                      ) : null}
                    </li>
                  );
                })}
            </ul>
          </section>
        ) : null}
        {estado.votacoes.length ? (
          <section>
            <h2>Votações</h2>
            <ul className="votacoes-turno">
              {estado.votacoes.map((v, i) => (
                <li
                  key={`${v.lei}-${i}`}
                  className={v.aprovada ? "aprovada" : "rejeitada"}
                >
                  <div className="votacao-linha">
                    <span>
                      <strong>{lei(v.lei)?.nome ?? v.lei}</strong>
                      <small>
                        {" "}
                        → {valorPedido(v.lei, v.valor)}
                        {v.casa
                          ? ` · ${v.casa === "senado" ? "Senado" : "Câmara"}`
                          : ""}
                        {v.origem && ORIGEM[v.origem]
                          ? ` · ${ORIGEM[v.origem]}`
                          : ""}
                      </small>
                    </span>
                    <b>{v.aprovada ? "Aprovada" : "Rejeitada"}</b>
                    <span className="votacao-placar">
                      {v.origem === "decreto"
                        ? "sem voto"
                        : `${v.sim} sim × ${v.nao} não`}
                    </span>
                  </div>
                  {v.exorbitante ? (
                    <small className="votacao-nota">
                      Exorbitante: a conta da lei tirou a maioria.
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
