/**
 * O tablet do presidente (pedido do autor, 11/out; virou tablet em 13/out):
 * chega com o jornal a cada fim de turno e abre pela barra. Tela inicial com
 * as notificações e os apps (V1-13): notificações (dilemas e pedidos do
 * Congresso), jornal (os números do país e as notícias), rede (os posts da
 * rua, dos grupos de pressão, do mercado e de fora), Congresso e bússola. O
 * conteúdo do jornal vem de `montarJornal`.
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
import type {
  Partida,
  VisaoBussola,
  VisaoDaTramitacao,
  VisaoDilema,
} from "../../app/partida";
import { BussolaPolitica } from "./BussolaPolitica";
import { CongressoNoTablet } from "./CongressoNoTablet";
import {
  NotificacoesNoTablet,
  TituloDaNotificacao,
  notificacoesDe,
  type Notificacao,
} from "./NotificacoesNoTablet";

export type AppDoTablet =
  "inicio" | "notificacoes" | "jornal" | "rede" | "bussola" | "congresso";

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

type App = Readonly<{
  id: AppDoTablet;
  nome: string;
  icone: string;
  titulo: string;
}>;

const APPS: readonly App[] = [
  {
    id: "notificacoes",
    nome: "Notificações",
    icone: ICONE_INTERFACE.notificacoes,
    titulo: "Notificações",
  },
  {
    id: "jornal",
    nome: "Jornal",
    icone: ICONE_INTERFACE.jornal,
    titulo: "Diário da República",
  },
  { id: "rede", nome: "Rede", icone: ICONE_INTERFACE.rede, titulo: "Na rede" },
  {
    id: "congresso",
    nome: "Congresso",
    icone: ICONE_INTERFACE.congresso,
    titulo: "Congresso Nacional",
  },
  {
    id: "bussola",
    nome: "Bússola",
    icone: ICONE_INTERFACE.bussola,
    titulo: "Bússola política",
  },
];

/** Tela inicial: a data, as notificações e os apps. */
function Inicio({
  apps,
  data,
  notificacoes,
  contagem,
  onAbrir,
  onNotificacao,
}: {
  apps: readonly App[];
  data: string;
  notificacoes: readonly Notificacao[];
  contagem: (app: AppDoTablet) => number;
  onAbrir: (app: AppDoTablet) => void;
  onNotificacao: (id: string) => void;
}) {
  return (
    <div className="ti-inicio">
      <p className="ti-data">{data}</p>
      <section className="ti-avisos" aria-label="Notificações">
        {notificacoes.length ? (
          <ul>
            {notificacoes.slice(0, 4).map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  className={`nt-item nt-${n.tipo}`}
                  onClick={() => onNotificacao(n.id)}
                >
                  <TituloDaNotificacao n={n} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="tb-calmo">Nenhuma notificação.</p>
        )}
      </section>
      <nav className="ti-apps" aria-label="Apps">
        {apps.map((a) => (
          <button key={a.id} type="button" onClick={() => onAbrir(a.id)}>
            <span className="ti-icone">
              <Icone nome={a.icone} tamanho={30} />
              {contagem(a.id) ? (
                <span className="tb-contador">{contagem(a.id)}</span>
              ) : null}
            </span>
            {a.nome}
          </button>
        ))}
      </nav>
    </div>
  );
}

export function PaginaDeJornal({
  edicao,
  data,
  numero,
  onFechar,
  bussola,
  congresso,
  partida,
  dilemas = [],
  onEscolherDilema = () => null,
  nomeDaLei = (id) => id,
  onResponderPedido = () => {},
  appInicial = "inicio",
}: {
  edicao: EdicaoDoJornal;
  /** "2º trimestre · ano 1". */
  data: string;
  numero: number;
  onFechar: () => void;
  /** App da bússola (V1-10). */
  bussola?: VisaoBussola;
  /** App do Congresso (V1-12): as cadeiras, a fila e as votações. */
  congresso?: VisaoDaTramitacao;
  /** A partida, para a prévia dos dilemas (V1-13). */
  partida?: Partida;
  /** Dilemas esperando resposta: viram notificações (V1-13). */
  dilemas?: readonly VisaoDilema[];
  onEscolherDilema?: (dilemaId: string, opcaoId: string) => string | null;
  nomeDaLei?: (id: string) => string;
  onResponderPedido?: (pedidoId: string, aceitar: boolean) => void;
  appInicial?: AppDoTablet;
}) {
  const [app, setApp] = useState<AppDoTablet>(appInicial);
  useEffect(() => setApp(appInicial), [appInicial]);
  const [selecionada, setSelecionada] = useState<string | null>(null);
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
  const notificacoes = notificacoesDe(partida ? dilemas : [], congresso);
  const tem = (a: AppDoTablet) =>
    a === "bussola" ? !!bussola : a === "congresso" ? !!congresso : true;
  const apps = APPS.filter((a) => tem(a.id));
  const contagem = (a: AppDoTablet) =>
    a === "notificacoes" ? notificacoes.length : 0;
  const abrirNotificacao = (id: string) => {
    setSelecionada(id);
    setApp("notificacoes");
  };
  const titulo =
    app === "inicio"
      ? "Tablet do presidente"
      : (APPS.find((a) => a.id === app)?.titulo ?? "");
  const subtitulo =
    app === "jornal"
      ? `Edição nº ${numero} · ${data}`
      : app === "bussola"
        ? `Para onde as suas leis levam o país · ${data}`
        : app === "congresso"
          ? `Quem senta onde e o que vai a voto · ${data}`
          : app === "rede"
            ? `O que dizem do governo · ${data}`
            : app === "notificacoes"
              ? "Os dilemas seguram o turno até a resposta"
              : "Notificações e apps";

  return (
    <div
      className="tb-fundo"
      role="dialog"
      aria-label={titulo}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <div className="tb-aparelho">
        <span className="tb-camera" aria-hidden />
        <div className="tb-tela">
          <header className="tb-app">
            <div>
              <h1>{titulo}</h1>
              <p>{subtitulo}</p>
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

          {app === "inicio" ? (
            <Inicio
              apps={apps}
              data={data}
              notificacoes={notificacoes}
              contagem={contagem}
              onAbrir={setApp}
              onNotificacao={abrirNotificacao}
            />
          ) : app === "notificacoes" && partida ? (
            <NotificacoesNoTablet
              notificacoes={notificacoes}
              selecionada={selecionada}
              onSelecionar={setSelecionada}
              partida={partida}
              onEscolherDilema={onEscolherDilema}
              onResponderPedido={onResponderPedido}
            />
          ) : app === "bussola" && bussola ? (
            <BussolaPolitica bussola={bussola} />
          ) : app === "congresso" && congresso ? (
            <CongressoNoTablet
              congresso={congresso}
              nomeDaLei={nomeDaLei}
              onResponder={onResponderPedido}
            />
          ) : app === "rede" ? (
            <div className="tb-colunas tb-uma-coluna">
              <section className="tb-rede" aria-label="O que dizem na rede">
                {edicao.opinioes.map((o) => (
                  <Post key={o.arroba} post={o} />
                ))}
              </section>
            </div>
          ) : (
            <div className="tb-jornal">
              <section className="tb-numeros" aria-label="O país em números">
                <ul>
                  {edicao.indices.map((i) => (
                    <Numero key={i.id} indice={i} />
                  ))}
                </ul>
              </section>

              <div className="tb-colunas tb-uma-coluna">
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
                    <p className="tb-calmo">
                      Nenhuma outra notícia no trimestre.
                    </p>
                  ) : null}
                </section>
              </div>
            </div>
          )}
          <nav className="tb-dock" aria-label="Apps do tablet">
            <button
              type="button"
              aria-pressed={app === "inicio"}
              onClick={() => setApp("inicio")}
            >
              <Icone nome={ICONE_INTERFACE.inicio} tamanho={20} />
              Início
            </button>
            {apps.map((a) => (
              <button
                key={a.id}
                type="button"
                aria-pressed={app === a.id}
                onClick={() => setApp(a.id)}
              >
                <Icone nome={a.icone} tamanho={20} />
                {a.nome}
                {contagem(a.id) ? (
                  <span
                    className="tb-contador"
                    aria-label={`${contagem(a.id)} esperando`}
                  >
                    {contagem(a.id)}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
