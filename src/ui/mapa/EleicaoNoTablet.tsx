/**
 * App da eleição no tablet (V1-39): o partido, o presidente, as pesquisas,
 * os adversários, a escolha do candidato e os resultados. Ninguém aparece
 * com lado declarado: só biografia e opiniões.
 */
import type {
  VisaoEleicao,
  VisaoPesquisa,
  VisaoResultado,
} from "../../app/partida";
import { CartaoDePersonagem } from "./CartaoDePersonagem";

const pct = (x: number) => `${x.toFixed(1).replace(".", ",")}%`;

function quandoE(e: VisaoEleicao): string {
  if (e.turnosAteAEleicao === 0) return "A eleição é no fim deste trimestre.";
  if (e.turnosAteAEleicao === 1) return "A eleição é no próximo trimestre.";
  return `Faltam ${e.turnosAteAEleicao + 1} trimestres para a eleição.`;
}

function Barras({
  linhas,
}: {
  linhas: readonly Readonly<{ nome: string; votos: number; nosso?: boolean }>[];
}) {
  return (
    <ul className="el-barras">
      {linhas.map((l) => (
        <li key={l.nome} className={l.nosso ? "el-nosso" : undefined}>
          <span className="el-nome">{l.nome}</span>
          <span className="el-barra" aria-hidden>
            <span style={{ width: `${Math.min(100, l.votos)}%` }} />
          </span>
          <span className="el-pct">{pct(l.votos)}</span>
        </li>
      ))}
    </ul>
  );
}

function Pesquisa({ p, candidato }: { p: VisaoPesquisa; candidato?: string }) {
  return (
    <div className="el-pesquisa">
      <p className="el-legenda">
        Turno {p.turno + 1} · margem de erro de {pct(p.margem)}
      </p>
      <h3>1º turno</h3>
      <Barras linhas={p.primeiro.map((l) => ({ ...l, nosso: l.doPartido }))} />
      {p.segundo.length ? (
        <>
          <h3>2º turno{candidato ? `, com ${candidato}` : ""}</h3>
          <ul className="el-duelos">
            {p.segundo.map((s) => (
              <li key={s.contra}>
                contra {s.contra}:{" "}
                <strong className={s.votos >= 50 ? "el-ganha" : "el-perde"}>
                  {pct(s.votos)}
                </strong>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

export function Resultado({
  r,
  nomeDoSegmento,
}: {
  r: VisaoResultado;
  nomeDoSegmento: (id: string) => string;
}) {
  const melhores = r.porSegmento.slice(0, 3);
  const piores = r.porSegmento.slice(-3).reverse();
  return (
    <article className={`el-resultado ${r.venceu ? "el-venceu" : "el-perdeu"}`}>
      <h3>
        {r.venceu
          ? `${r.candidato} venceu a eleição`
          : `${r.candidato} perdeu para ${r.vencedor}`}
      </h3>
      <p className="el-legenda">
        Fim do {r.mandato}º mandato · comparecimento de {pct(r.comparecimento)}
      </p>
      <h4>1º turno</h4>
      <Barras
        linhas={r.primeiro.map((l) => ({
          ...l,
          nosso: l.nome === r.candidato,
        }))}
      />
      {r.segundo ? (
        <>
          <h4>2º turno</h4>
          <Barras
            linhas={r.segundo.map((l) => ({
              ...l,
              nosso: l.nome === r.candidato,
            }))}
          />
        </>
      ) : null}
      {r.porSegmento.length ? (
        <div className="el-segmentos">
          <p>
            <strong>Onde foi melhor:</strong>{" "}
            {melhores
              .map((s) => `${nomeDoSegmento(s.id)} (${pct(s.votos)})`)
              .join(", ")}
          </p>
          <p>
            <strong>Onde foi pior:</strong>{" "}
            {piores
              .map((s) => `${nomeDoSegmento(s.id)} (${pct(s.votos)})`)
              .join(", ")}
          </p>
        </div>
      ) : null}
    </article>
  );
}

/** Falta escolher o candidato (o presidente não pode concorrer de novo). */
export const faltaCandidato = (e: VisaoEleicao) =>
  !e.candidato && !e.presidentePodeConcorrer && e.opcoes.length > 0;

export function EleicaoNoTablet({
  eleicao: e,
  onEscolher,
  nomeDoSegmento,
}: {
  eleicao: VisaoEleicao;
  onEscolher: (id: string) => string | null;
  nomeDoSegmento: (id: string) => string;
}) {
  const ultima = e.pesquisas.at(-1);
  const resultados = [...e.resultados].reverse();
  const novos = e.opcoes.filter((o) => o.id !== e.presidente.id);
  return (
    <div className="el-app">
      <section className="el-topo" aria-label="O partido">
        <h2>
          {e.partido.nome}
          {e.partido.sigla ? ` (${e.partido.sigla})` : ""}
        </h2>
        <p>
          {e.mandato}º mandato · {quandoE(e)}{" "}
          {e.candidato
            ? `Candidato: ${e.candidato.nome}.`
            : e.presidentePodeConcorrer
              ? `${e.presidente.nome} concorre à reeleição, a não ser que o partido lance outro nome.`
              : "O partido ainda não escolheu o candidato."}
        </p>
        {faltaCandidato(e) ? (
          <p className="el-alerta">
            {e.presidente.nome} não pode concorrer de novo. O turno só passa
            depois que o partido escolher quem vai disputar.
          </p>
        ) : null}
      </section>

      {resultados.length && e.encerrada ? (
        <section aria-label="Resultado">
          <Resultado r={resultados[0]} nomeDoSegmento={nomeDoSegmento} />
        </section>
      ) : null}

      <div className="el-colunas">
        <section aria-label="Pesquisas">
          <h2>Pesquisas</h2>
          {ultima ? (
            <Pesquisa
              p={ultima}
              candidato={(e.candidato ?? e.presidente).nome}
            />
          ) : (
            <p className="tb-calmo">
              As pesquisas começam a sair perto da eleição.
            </p>
          )}
        </section>
        <section aria-label="Presidente">
          <h2>Presidente</h2>
          <CartaoDePersonagem personagem={e.presidente} />
        </section>
      </div>

      {!e.encerrada && novos.length ? (
        <section aria-label="Candidato do partido">
          <h2>Quem o partido lança</h2>
          <p className="el-legenda">
            Um nome longe do que o partido sempre defendeu afasta a base e
            afrouxa a bancada no Congresso.
          </p>
          <div className="ps-grade">
            {e.opcoes.map((p) => (
              <CartaoDePersonagem
                key={p.id}
                personagem={p}
                selo={p.id === e.presidente.id ? "Presidente" : undefined}
                selecionado={e.candidato?.id === p.id}
                rotuloDoBotao="Lançar"
                onEscolher={() => onEscolher(p.id)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {e.adversarios.length ? (
        <section aria-label="Adversários">
          <h2>Adversários</h2>
          <div className="ps-grade">
            {e.adversarios.map((p) => (
              <CartaoDePersonagem key={p.id} personagem={p} />
            ))}
          </div>
        </section>
      ) : null}

      {resultados.length && !e.encerrada ? (
        <section aria-label="Eleições passadas">
          <h2>Eleições passadas</h2>
          {resultados.map((r) => (
            <Resultado key={r.turno} r={r} nomeDoSegmento={nomeDoSegmento} />
          ))}
        </section>
      ) : null}
    </div>
  );
}
