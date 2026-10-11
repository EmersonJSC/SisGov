/**
 * A página de jornal (pedido do autor, 11/out): chega a cada fim de turno e
 * pode ser aberta pela barra. Manchete e notícias (clicar mostra as
 * consequências), o quadro dos principais índices e as opiniões da rua, do
 * mercado e da imprensa estrangeira. O conteúdo vem de `montarJornal`.
 */
import { useEffect, useState } from "react";
import type { NoticiaDoJornal, EdicaoDoJornal } from "./jornal";
import { Icone } from "./Icone";
import { ICONE_INTERFACE } from "./icones";

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
            <table>
              <tbody>
                {edicao.indices.map((i) => (
                  <tr key={i.id}>
                    <th scope="row">{i.nome}</th>
                    <td>{i.valor}</td>
                    <td className={`efeito-${i.efeito}`}>
                      {i.variacao ? `${i.sobe ? "▲" : "▼"} ${i.variacao}` : "="}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </aside>
        </div>

        <section className="jp-opiniao" aria-label="Opinião">
          <h3>Opinião</h3>
          <div className="jp-opiniao-colunas">
            {SECOES.map((s) => (
              <div key={s.id}>
                <h4>{s.titulo}</h4>
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
