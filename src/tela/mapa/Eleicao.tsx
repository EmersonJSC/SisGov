/**
 * Janela da Eleição: aprovação e desgaste de hoje, a pesquisa do primeiro
 * turno e a promessa de campanha (a meta do mandato).
 */
import { useState } from "react";
import { satisfacaoMedia } from "../../motor";
import {
  indicesDoMundo,
  mesesParaEleicao,
  nomesPartidos,
  pesquisaDeVoto,
  type Partida,
  type Pedido,
} from "../../partida";
import { Documento, type JanelaProps } from "./DocumentoLei";
import { ICONE_INTERFACE } from "./icones";
import { trocar } from "./pedidos";

const um = (v: number) =>
  v.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

type Alvo = "indice" | "programa";
const ehPrometer = (p: Pedido) => p.tipo === "prometer";

export function Eleicao({
  partida,
  extras,
  setExtras,
  onFechar,
  ...janela
}: JanelaProps & {
  partida: Partida;
  /** Pedidos já marcados neste turno (a promessa entra aqui). */
  extras: Pedido[];
  setExtras: (e: Pedido[]) => void;
  onFechar: () => void;
}) {
  const { regras, estado } = partida;
  const partidos = nomesPartidos(partida.pais, partida.opcoes.comeco);
  const principais = regras.indicesPrincipais ?? [];
  const [tipo, setTipo] = useState<Alvo>("indice");
  const [alvo, setAlvo] = useState(principais[0] ?? "");
  const [meta, setMeta] = useState("");

  const meses = mesesParaEleicao(partida);
  const pesquisa = pesquisaDeVoto(partida);
  const promessa = estado.campanha?.promessa;
  const marcada = extras.find(ehPrometer);
  const nomeDoIndice = (id: string) =>
    indicesDoMundo.find((i) => i.id === id)?.nome ?? id;
  const indices = indicesDoMundo.filter((i) => regras.dominios[i.id]);
  const programas = (regras.programas?.programas ?? []).filter(
    (p) => estado.programas?.vidas[p.id]?.situacao !== "formado",
  );
  const nomeDaChapa = (ids: string[], governo: boolean) =>
    governo
      ? "Governo"
      : ids.length
        ? ids.map((id) => partidos[id] ?? id).join(" + ")
        : "Oposição";

  const prometer = () => {
    const valor = Number(meta.replace(",", "."));
    if (!alvo || (tipo === "indice" && !Number.isFinite(valor))) return;
    setExtras(
      trocar(extras, ehPrometer, {
        tipo: "prometer",
        alvo: { tipo, id: alvo },
        ...(tipo === "indice" ? { meta: valor } : {}),
      }),
    );
  };

  return (
    <Documento
      orgao="Justiça Eleitoral"
      setor="Eleição"
      numero={meses === null ? "sem eleição" : `em ${meses} meses`}
      cor="#7a3e5c"
      icone={ICONE_INTERFACE.lei}
      onFechar={onFechar}
      rotulo="Eleição"
      {...janela}
    >
      <div className="folha governo-janela">
        <section>
          <h2>Hoje</h2>
          <p className="vazio">
            Aprovação {um(satisfacaoMedia(estado.grupos))}% · desgaste{" "}
            {um(estado.desgaste)}
            {meses !== null && meses > 2
              ? ` · primeiro turno em ${meses - 2} meses, segundo no último turno do mandato`
              : ""}
            .
          </p>
        </section>
        <section>
          <h2>Pesquisa do primeiro turno</h2>
          <ul className="governo-orgaos">
            {pesquisa.map((c) => (
              <li
                key={c.chapa}
                className={`orgao orgao-${c.governo ? "rende" : "falta"}`}
              >
                <span>{nomeDaChapa(c.partidos, c.governo)}</span>
                <span
                  className="termometro"
                  role="img"
                  aria-label={`${um(c.votos * 100)}%`}
                >
                  <i style={{ width: `${c.votos * 100}%` }} />
                </span>
                <small>{um(c.votos * 100)}%</small>
              </li>
            ))}
          </ul>
          <p className="vazio">
            Quem passar da metade vence; senão, os dois mais votados disputam o
            segundo turno. A pesquisa não conta a promessa.
          </p>
        </section>
        <section>
          <h2>Promessa de campanha</h2>
          {promessa ? (
            <p className="caixa-orgaos">
              Prometido:{" "}
              {promessa.alvo.tipo === "indice"
                ? `${nomeDoIndice(promessa.alvo.id)} de ${um(promessa.de)} para ${um(promessa.meta)}`
                : `formar o programa ${regras.programas?.programas.find((p) => p.id === promessa.alvo.id)?.nome ?? promessa.alvo.id}`}{" "}
              (tamanho {um(promessa.tamanho * 100)}%). Avaliada no primeiro
              turno; trocar agora conta como quebrar.
            </p>
          ) : (
            <p className="vazio">
              Sem promessa. Prometer uma meta grande rende voto se cumprir e
              custa se quebrar; cumprir em parte vale em parte.
            </p>
          )}
          <label className="caixa-nomear">
            Prometer{" "}
            <select
              value={tipo}
              onChange={(e) => {
                const novo = e.target.value as Alvo;
                setTipo(novo);
                setAlvo(
                  novo === "indice"
                    ? (principais[0] ?? "")
                    : (programas[0]?.id ?? ""),
                );
              }}
            >
              <option value="indice">um índice</option>
              {programas.length ? (
                <option value="programa">um programa</option>
              ) : null}
            </select>{" "}
            <select value={alvo} onChange={(e) => setAlvo(e.target.value)}>
              {tipo === "indice"
                ? [...indices]
                    .sort(
                      (a, b) =>
                        Number(principais.includes(b.id)) -
                        Number(principais.includes(a.id)),
                    )
                    .map((i) => (
                      <option key={i.id} value={i.id}>
                        {principais.includes(i.id) ? "★ " : ""}
                        {i.nome}
                      </option>
                    ))
                : programas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
            </select>{" "}
            {tipo === "indice" ? (
              <input
                type="number"
                value={meta}
                placeholder="meta"
                onChange={(e) => setMeta(e.target.value)}
              />
            ) : null}{" "}
            <button type="button" onClick={prometer}>
              Prometer
            </button>
          </label>
          {marcada && marcada.tipo === "prometer" ? (
            <small>
              Marcada para este turno:{" "}
              {marcada.alvo.tipo === "indice"
                ? nomeDoIndice(marcada.alvo.id)
                : marcada.alvo.id}
              {marcada.meta !== undefined ? ` → ${um(marcada.meta)}` : ""}.{" "}
              <button
                type="button"
                onClick={() => setExtras(trocar(extras, ehPrometer))}
              >
                Desmarcar
              </button>
            </small>
          ) : null}
        </section>
      </div>
    </Documento>
  );
}
