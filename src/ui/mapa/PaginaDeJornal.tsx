/**
 * A página de jornal (pedido do autor, 11/out): chega a cada fim de turno e
 * pode ser aberta pela barra. Manchete e notícias (clicar mostra as
 * consequências), o quadro dos principais índices e as opiniões da rua, do
 * mercado e da imprensa estrangeira. O conteúdo vem de `montarJornal`.
 */
import { useEffect, useState } from "react";
import type {
  EdicaoDoJornal,
  HumorDoGrupo,
  IndiceDoJornal,
  NoticiaDoJornal,
} from "./jornal";
import { Icone } from "./Icone";
import { ICONE_INTERFACE } from "./icones";
import { corDaBondade } from "./intensidade";

/** Linha de evolução do índice desde o começo da partida. */
function Linha({ serie, cor }: { serie: readonly number[]; cor: string }) {
  const largura = 96;
  const altura = 28;
  if (serie.length < 2)
    return (
      <svg className="jp-linha-grafico" width={largura} height={altura}>
        <line
          x1={0}
          x2={largura}
          y1={altura - 3 - serie[0] * (altura - 6)}
          y2={altura - 3 - serie[0] * (altura - 6)}
          stroke={cor}
          strokeWidth={2}
          strokeDasharray="3 4"
        />
      </svg>
    );
  // a linha mostra a forma: estica entre o menor e o maior valor da série,
  // com folga mínima para variações pequenas não parecerem enormes
  const min = Math.min(...serie);
  const max = Math.max(...serie);
  const folga = Math.max(0, 0.05 - (max - min)) / 2;
  const baixo = min - folga;
  const alto = max + folga || 1;
  const pontos = serie.map((v, i) => [
    (i / (serie.length - 1)) * (largura - 6) + 3,
    altura - 3 - ((v - baixo) / (alto - baixo || 1)) * (altura - 6),
  ]);
  const [ux, uy] = pontos[pontos.length - 1];
  return (
    <svg
      className="jp-linha-grafico"
      width={largura}
      height={altura}
      aria-hidden
    >
      <polyline
        points={pontos.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke={cor}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <circle cx={ux} cy={uy} r={3} fill={cor} />
    </svg>
  );
}

function CartaoIndice({ indice }: { indice: IndiceDoJornal }) {
  const cor = corDaBondade(indice.bondade);
  return (
    <li className="jp-indice">
      <div className="jp-indice-topo">
        <span className="jp-indice-nome">{indice.nome}</span>
        <span className={`jp-indice-var efeito-${indice.efeito}`}>
          {indice.variacao
            ? `${indice.sobe ? "▲" : "▼"} ${indice.variacao}`
            : "="}
        </span>
      </div>
      <div className="jp-indice-meio">
        <strong>{indice.valor}</strong>
        <Linha serie={indice.serie} cor={cor} />
      </div>
      {indice.unidadeReal ? (
        <small className="jp-indice-unidade">{indice.unidadeReal}</small>
      ) : null}
      <div className="jp-barra" aria-hidden>
        <span style={{ width: `${indice.t * 100}%`, background: cor }} />
      </div>
    </li>
  );
}

function Humor({ grupos }: { grupos: readonly HumorDoGrupo[] }) {
  return (
    <ul className="jp-humor" aria-label="Satisfação dos grupos sociais">
      {grupos.map((g) => (
        <li key={g.id}>
          <span className="jp-humor-nome">{g.nome}</span>
          <span className="jp-barra jp-humor-barra">
            <span
              style={{
                width: `${g.satisfacao}%`,
                background: corDaBondade(g.satisfacao / 100),
              }}
            />
          </span>
          <span className="jp-humor-valor">
            {Math.round(g.satisfacao)}
            {Math.abs(g.delta) >= 0.5 ? (
              <small
                className={g.delta > 0 ? "efeito-melhora" : "efeito-piora"}
              >
                {g.delta > 0 ? " ▲" : " ▼"}
                {Math.abs(g.delta).toFixed(0)}
              </small>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

const SECOES = [
  { id: "povo", titulo: "Na rua" },
  { id: "mercado", titulo: "Mercado" },
  { id: "internacional", titulo: "Lá fora" },
] as const;

function Consequencias({ noticia }: { noticia: NoticiaDoJornal }) {
  if (!noticia.efeitos.length)
    return (
      <p className="jp-sem-efeito">
        {noticia.tipo === "dilema"
          ? "Está na sua mesa: as consequências dependem da sua resposta."
          : "Sem efeito direto nos índices."}
      </p>
    );
  return (
    <ul className="jp-efeitos">
      {noticia.efeitos.map((e) => (
        <li key={e.nome} className={`efeito-${e.efeito}`}>
          <span aria-hidden>{e.sobe ? "▲" : "▼"}</span> {e.nome}
        </li>
      ))}
      {noticia.meses ? (
        <li className="jp-duracao">
          por mais {noticia.meses} {noticia.meses === 1 ? "mês" : "meses"}
        </li>
      ) : null}
    </ul>
  );
}

function Materia({
  noticia,
  aberta,
  onAlternar,
  principal = false,
}: {
  noticia: NoticiaDoJornal;
  aberta: boolean;
  onAlternar: () => void;
  principal?: boolean;
}) {
  return (
    <article
      className={`jp-materia nivel-${noticia.nivel}${noticia.boa ? " boa" : ""}${principal ? " principal" : ""}`}
    >
      <button
        type="button"
        className="jp-titulo-materia"
        aria-expanded={aberta}
        onClick={onAlternar}
      >
        {principal ? null : <span>{noticia.manchete}</span>}
        <small>{aberta ? "Fechar" : "Consequências"}</small>
      </button>
      {aberta ? (
        <div className="jp-corpo">
          {noticia.texto ? <p>{noticia.texto}</p> : null}
          <Consequencias noticia={noticia} />
        </div>
      ) : null}
    </article>
  );
}

export function PaginaDeJornal({
  edicao,
  data,
  numero,
  onFechar,
}: {
  edicao: EdicaoDoJornal;
  /** "2º trimestre · ano 1". */
  data: string;
  numero: number;
  onFechar: () => void;
}) {
  const [aberta, setAberta] = useState<string | null>(null);
  const alternar = (id: string) => setAberta((a) => (a === id ? null : id));
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFechar();
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [onFechar]);

  return (
    <div
      className="jp-fundo"
      role="dialog"
      aria-label="Jornal"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <div className="jp-pagina">
        <button
          type="button"
          className="jp-fechar"
          onClick={onFechar}
          aria-label="Fechar o jornal"
        >
          <Icone nome={ICONE_INTERFACE.fechar} tamanho={20} />
        </button>
        <header className="jp-cabecalho">
          <p className="jp-linha">
            <span>Edição nº {numero}</span>
            <span>{data}</span>
            <span>Brasília</span>
          </p>
          <h1>Diário da República</h1>
        </header>

        <section className="jp-capa">
          <h2>{edicao.manchete}</h2>
          {edicao.principal ? (
            <Materia
              noticia={edicao.principal}
              principal
              aberta={aberta === edicao.principal.id}
              onAlternar={() => alternar(edicao.principal!.id)}
            />
          ) : null}
        </section>

        <div className="jp-colunas">
          <section className="jp-noticias" aria-label="Notícias">
            <h3>Notícias</h3>
            {edicao.noticias.length ? (
              edicao.noticias.map((n) => (
                <Materia
                  key={n.id}
                  noticia={n}
                  aberta={aberta === n.id}
                  onAlternar={() => alternar(n.id)}
                />
              ))
            ) : (
              <p className="jp-calmo">Nenhuma outra notícia no trimestre.</p>
            )}
          </section>

          <aside className="jp-indices" aria-label="Indicadores do país">
            <h3>O país em números</h3>
            <ul className="jp-lista-indices">
              {edicao.indices.map((i) => (
                <CartaoIndice key={i.id} indice={i} />
              ))}
            </ul>
          </aside>
        </div>

        <section className="jp-opiniao" aria-label="Opinião">
          <h3>Opinião</h3>
          <div className="jp-opiniao-colunas">
            {SECOES.map((s) => (
              <div key={s.id}>
                <h4>{s.titulo}</h4>
                {s.id === "povo" ? <Humor grupos={edicao.humor} /> : null}
                {edicao.opinioes
                  .filter((o) => o.secao === s.id)
                  .map((o) => (
                    <blockquote key={o.autor} className={`efeito-${o.tom}`}>
                      <p>{o.texto}</p>
                      <cite>{o.autor}</cite>
                    </blockquote>
                  ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
