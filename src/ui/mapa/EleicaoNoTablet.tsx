/**
 * App da eleição no tablet (V1-39), no estilo "Dossiê Tropical": a mesa do
 * partido com o presidente, o relatório da pesquisa, o dossiê dos nomes
 * que o partido pode lançar e dos adversários, e os recortes de jornal das
 * eleições passadas. Ninguém aparece com lado declarado.
 */
import type {
  VisaoEleicao,
  VisaoPersonagem,
  VisaoPesquisa,
  VisaoResultado,
} from "../../app/partida";
import { Arte, Retrato } from "./Arte";
import { Dossie, Folha, Polaroide } from "./Dossie";

const pct = (x: number) => `${x.toFixed(1).replace(".", ",")}%`;

function quandoE(e: VisaoEleicao): string {
  if (e.turnosAteAEleicao === 0) return "A eleição é no fim deste trimestre.";
  if (e.turnosAteAEleicao === 1) return "A eleição é no próximo trimestre.";
  return `Faltam ${e.turnosAteAEleicao + 1} trimestres para a eleição.`;
}

type Linha = Readonly<{ nome: string; votos: number; nosso?: boolean }>;

function Barras({
  linhas,
  retratoDe,
}: {
  linhas: readonly Linha[];
  retratoDe?: (nome: string) => string | undefined;
}) {
  return (
    <ul className="el-barras">
      {linhas.map((l) => {
        const retrato = retratoDe?.(l.nome);
        return (
          <li key={l.nome} className={l.nosso ? "el-nosso" : undefined}>
            {retrato ? (
              <Retrato retrato={retrato} className="el-mini" />
            ) : (
              <span className="el-mini" aria-hidden />
            )}
            <span className="el-nome">{l.nome}</span>
            <span className="el-barra" aria-hidden>
              <span style={{ width: `${Math.min(100, l.votos)}%` }} />
            </span>
            <span className="el-pct">{pct(l.votos)}</span>
          </li>
        );
      })}
    </ul>
  );
}

function Pesquisa({
  p,
  candidato,
  retratoDe,
}: {
  p: VisaoPesquisa;
  candidato?: string;
  retratoDe: (nome: string) => string | undefined;
}) {
  return (
    <div className="ds-papel el-relatorio">
      <header className="el-timbre">
        <span>Instituto de Opinião Pública</span>
        <span>Relatório do turno {p.turno + 1}</span>
      </header>
      <h3>Intenção de voto, 1º turno</h3>
      <Barras
        linhas={p.primeiro.map((l) => ({ ...l, nosso: l.doPartido }))}
        retratoDe={retratoDe}
      />
      {p.segundo.length ? (
        <>
          <h3>2º turno{candidato ? `: ${candidato} contra` : ""}</h3>
          <ul className="el-duelos">
            {p.segundo.map((s) => (
              <li key={s.contra}>
                <span>{s.contra}</span>
                <strong className={s.votos >= 50 ? "el-ganha" : "el-perde"}>
                  {pct(s.votos)}
                </strong>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <p className="el-rodape">
        Margem de erro de {pct(p.margem)}, para mais ou para menos.
      </p>
    </div>
  );
}

/** A eleição como recorte de jornal, com a foto da noite. */
export function Resultado({
  r,
  sigla,
  nomeDoSegmento,
  retratoDe,
}: {
  r: VisaoResultado;
  sigla?: string;
  nomeDoSegmento: (id: string) => string;
  retratoDe?: (nome: string) => string | undefined;
}) {
  const retrato = (nome: string) => r.retratos[nome] ?? retratoDe?.(nome);
  const melhores = r.porSegmento.slice(0, 3);
  const piores = r.porSegmento.slice(-3).reverse();
  const final = r.segundo ?? r.primeiro;
  const nosso = final.find((l) => l.nome === r.candidato)?.votos;
  return (
    <article
      className={`el-jornal ${r.venceu ? "el-venceu" : "el-perdeu"}`}
      aria-label={`Eleição do ${r.mandato}º mandato`}
    >
      <header className="el-cabeca">
        <span>Diário da República</span>
        <span>Edição extra · fim do {r.mandato}º mandato</span>
      </header>
      <h3 className="el-manchete">
        {r.venceu
          ? `${r.candidato} vence${sigla ? ` e o ${sigla} fica no poder` : ""}`
          : `${r.vencedor} derrota ${r.candidato}${sigla ? ` e tira o ${sigla} do poder` : ""}`}
      </h3>
      <figure>
        <Arte
          caminho={r.venceu ? "cenas/vitoria.jpg" : "cenas/derrota.jpg"}
          className="el-foto"
        />
        <figcaption>
          {r.venceu
            ? `A noite no comitê de ${r.candidato}${nosso !== undefined ? `, eleito com ${pct(nosso)} dos votos válidos` : ""}.`
            : `O comitê de ${r.candidato} na manhã seguinte${nosso !== undefined ? ` aos ${pct(nosso)} das urnas` : ""}.`}
        </figcaption>
      </figure>
      <div className="el-colunas-jornal">
        <section>
          <h4>1º turno</h4>
          <Barras
            linhas={r.primeiro.map((l) => ({
              ...l,
              nosso: l.nome === r.candidato,
            }))}
            retratoDe={retrato}
          />
          {r.segundo ? (
            <>
              <h4>2º turno</h4>
              <Barras
                linhas={r.segundo.map((l) => ({
                  ...l,
                  nosso: l.nome === r.candidato,
                }))}
                retratoDe={retrato}
              />
            </>
          ) : null}
          <p className="el-rodape">
            Comparecimento de {pct(r.comparecimento)}.
          </p>
        </section>
        {r.porSegmento.length ? (
          <section className="el-segmentos">
            <h4>Onde ganhou e onde perdeu</h4>
            <p>
              <strong>Melhor:</strong>{" "}
              {melhores
                .map((s) => `${nomeDoSegmento(s.id)} (${pct(s.votos)})`)
                .join(", ")}
            </p>
            <p>
              <strong>Pior:</strong>{" "}
              {piores
                .map((s) => `${nomeDoSegmento(s.id)} (${pct(s.votos)})`)
                .join(", ")}
            </p>
          </section>
        ) : null}
      </div>
    </article>
  );
}

/** Falta escolher o candidato (o presidente não pode concorrer de novo). */
export const faltaCandidato = (e: VisaoEleicao) =>
  !e.candidato && !e.presidentePodeConcorrer && e.opcoes.length > 0;

/** Retrato de cada nome que aparece na eleição (para as pesquisas). */
export function retratosDaEleicao(e: VisaoEleicao) {
  const todos: VisaoPersonagem[] = [
    e.presidente,
    ...e.opcoes,
    ...e.adversarios,
    ...(e.candidato ? [e.candidato] : []),
  ];
  const mapa = new Map(todos.map((p) => [p.nome, p.retrato]));
  return (nome: string) => mapa.get(nome);
}

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
  const retratoDe = retratosDaEleicao(e);
  const candidato = e.candidato ?? e.presidente;
  return (
    <div className="el-app ds-mesa">
      <section className="el-faixa" aria-label="O partido">
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
        <Resultado
          r={resultados[0]}
          sigla={e.partido.sigla}
          nomeDoSegmento={nomeDoSegmento}
          retratoDe={retratoDe}
        />
      ) : null}

      <div className="el-topo">
        <section className="el-presidente" aria-label="Presidente">
          <h2 className="ds-aba">Presidente</h2>
          <div className="el-gabinete">
            <Polaroide
              personagem={e.presidente}
              grande
              carimbo={
                e.candidato?.id === e.presidente.id ? "Candidato" : undefined
              }
            />
            <Folha personagem={e.presidente} carimbo="Gabinete" />
          </div>
        </section>
        <section className="el-pesquisas" aria-label="Pesquisas">
          <h2 className="ds-aba ds-aba-turquesa">Pesquisa</h2>
          {ultima ? (
            <Pesquisa
              p={ultima}
              candidato={candidato.nome}
              retratoDe={retratoDe}
            />
          ) : (
            <div className="ds-papel el-relatorio el-sem-pesquisa">
              <header className="el-timbre">
                <span>Instituto de Opinião Pública</span>
              </header>
              <p>
                Nenhum relatório ainda. As pesquisas começam a sair perto da
                eleição.
              </p>
            </div>
          )}
        </section>
      </div>

      {!e.encerrada && novos.length ? (
        <section aria-label="Quem o partido lança">
          <h2 className="ds-aba">Dossiê: quem o partido lança</h2>
          <p className="ds-dica">
            Um nome longe do que o partido sempre defendeu afasta a base e
            afrouxa a bancada no Congresso.
          </p>
          <Dossie
            personagens={e.opcoes}
            escolhido={e.candidato?.id ?? null}
            onEscolher={(id) => onEscolher(id)}
            rotuloDaEscolha="Lançar candidatura"
            carimboDoEscolhido="Candidato"
            selo={(p) => (p.id === e.presidente.id ? "Presidente" : undefined)}
          />
        </section>
      ) : null}

      {e.adversarios.length ? (
        <section aria-label="Adversários">
          <h2 className="ds-aba ds-aba-coral">Dossiê: adversários</h2>
          <Dossie personagens={e.adversarios} />
        </section>
      ) : null}

      {resultados.length && !e.encerrada ? (
        <section className="el-arquivo" aria-label="Eleições passadas">
          <h2 className="ds-aba">Arquivo: eleições passadas</h2>
          {resultados.map((r) => (
            <Resultado
              key={r.turno}
              r={r}
              sigla={e.partido.sigla}
              nomeDoSegmento={nomeDoSegmento}
              retratoDe={retratoDe}
            />
          ))}
        </section>
      ) : null}
    </div>
  );
}
