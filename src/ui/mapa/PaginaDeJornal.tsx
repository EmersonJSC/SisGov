/**
 * O tablet do turno (pedido do autor, 11/out; virou tablet em 13/out): chega
 * a cada fim de turno e pode ser aberto pela barra. Cabe numa tela só: os
 * números do país em destaque no topo, as notícias (clicar mostra as
 * consequências) e os posts da rua, dos grupos de pressão, do mercado e de
 * fora. O conteúdo vem de `montarJornal`.
 */
import { useEffect, useState } from "react";
import type {
  EdicaoDoJornal,
  IndiceDoJornal,
  NoticiaDoJornal,
  OpiniaoDoJornal,
} from "./jornal";
import { Icone } from "./Icone";
import { ICONE_INTERFACE } from "./icones";
import { corDaBondade } from "./intensidade";
import { NOME_NIVEL } from "./MesaDoPresidente";

/** Linha de evolução do índice desde o começo da partida. */
function Linha({ serie, cor }: { serie: readonly number[]; cor: string }) {
  const largura = 72;
  const altura = 22;
  if (serie.length < 2)
    return (
      <svg className="tb-linha" width={largura} height={altura} aria-hidden>
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
    <svg className="tb-linha" width={largura} height={altura} aria-hidden>
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

function Numero({ indice }: { indice: IndiceDoJornal }) {
  const cor = corDaBondade(indice.bondade);
  return (
    <li
      className="tb-numero"
      title={indice.unidadeReal}
      style={{ borderTopColor: cor }}
    >
      <span className="tb-numero-nome">{indice.nome}</span>
      <strong>{indice.valor}</strong>
      <span className="tb-numero-pe">
        <Linha serie={indice.serie} cor={cor} />
        <span className={`tb-variacao efeito-${indice.efeito}`}>
          {indice.variacao
            ? `${indice.sobe ? "▲" : "▼"} ${indice.variacao}`
            : "="}
        </span>
      </span>
    </li>
  );
}

function Consequencias({ noticia }: { noticia: NoticiaDoJornal }) {
  if (!noticia.efeitos.length)
    return (
      <p className="tb-sem-efeito">
        {noticia.tipo === "dilema"
          ? "Está na sua mesa: as consequências dependem da sua resposta."
          : "Sem efeito direto nos índices."}
      </p>
    );
  return (
    <ul className="tb-efeitos">
      {noticia.efeitos.map((e) => (
        <li key={e.nome} className={`efeito-${e.efeito}`}>
          <span aria-hidden>{e.sobe ? "▲" : "▼"}</span> {e.nome}
        </li>
      ))}
      {noticia.meses ? (
        <li className="tb-duracao">
          por mais {noticia.meses} {noticia.meses === 1 ? "mês" : "meses"}
        </li>
      ) : null}
    </ul>
  );
}

function Noticia({
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
  const rotulo =
    noticia.tipo === "dilema"
      ? "Na sua mesa"
      : (NOME_NIVEL[noticia.nivel] ?? "Local");
  return (
    <article
      className={`tb-noticia nivel-${noticia.nivel}${noticia.boa ? " boa" : ""}${principal ? " principal" : ""}`}
    >
      <button type="button" aria-expanded={aberta} onClick={onAlternar}>
        <span className="tb-selo">{rotulo}</span>
        <strong>{noticia.manchete}</strong>
        {noticia.texto && !aberta ? (
          <span className="tb-resumo">{noticia.texto}</span>
        ) : null}
      </button>
      {aberta ? (
        <div className="tb-corpo-noticia">
          {noticia.texto ? <p>{noticia.texto}</p> : null}
          <Consequencias noticia={noticia} />
        </div>
      ) : null}
    </article>
  );
}

const iniciais = (nome: string) =>
  nome
    .split(/\s+/)
    .filter((p) => p.length > 2 || /^[A-ZÀ-Ú]/.test(p))
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

function Post({ post }: { post: OpiniaoDoJornal }) {
  return (
    <article className={`tb-post secao-${post.secao}`}>
      <span className="tb-avatar" aria-hidden>
        {iniciais(post.autor)}
      </span>
      <div>
        <p className="tb-post-topo">
          <strong>{post.autor}</strong> <span>{post.arroba}</span>
        </p>
        {post.quem ? <p className="tb-post-quem">{post.quem}</p> : null}
        <p className="tb-post-texto">{post.texto}</p>
      </div>
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
  const principal = edicao.principal;

  return (
    <div
      className="tb-fundo"
      role="dialog"
      aria-label="Notícias do turno"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <div className="tb-aparelho">
        <span className="tb-camera" aria-hidden />
        <div className="tb-tela">
          <header className="tb-app">
            <div>
              <h1>Diário da República</h1>
              <p>
                Edição nº {numero} · {data}
              </p>
            </div>
            <button
              type="button"
              className="tb-fechar"
              onClick={onFechar}
              aria-label="Fechar"
            >
              <Icone nome={ICONE_INTERFACE.fechar} tamanho={20} />
            </button>
          </header>

          <section className="tb-numeros" aria-label="O país em números">
            <ul>
              {edicao.indices.map((i) => (
                <Numero key={i.id} indice={i} />
              ))}
            </ul>
          </section>

          <div className="tb-colunas">
            <section className="tb-noticias" aria-label="Notícias">
              <h2>Notícias</h2>
              {principal ? (
                <Noticia
                  noticia={principal}
                  principal
                  aberta={aberta === principal.id}
                  onAlternar={() => alternar(principal.id)}
                />
              ) : (
                <p className="tb-manchete-calma">{edicao.manchete}</p>
              )}
              {edicao.noticias.map((n) => (
                <Noticia
                  key={n.id}
                  noticia={n}
                  aberta={aberta === n.id}
                  onAlternar={() => alternar(n.id)}
                />
              ))}
              {!principal && !edicao.noticias.length ? (
                <p className="tb-calmo">Nenhuma outra notícia no trimestre.</p>
              ) : null}
            </section>

            <section className="tb-rede" aria-label="O que dizem na rede">
              <h2>Na rede</h2>
              {edicao.opinioes.map((o) => (
                <Post key={o.arroba} post={o} />
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
