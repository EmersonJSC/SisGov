/**
 * A noite da eleição (V1-39): a apuração do 1º turno urna a urna, o
 * anúncio do 2º turno, a apuração dele e o jornal do dia seguinte. A
 * contagem parcial oscila (cada nome tem uma região forte que chega antes)
 * e fecha no resultado do jogo. Na derrota, a tela fica até o jogador
 * escolher um novo partido ou voltar ao menu.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import type { VisaoResultado } from "../../app/partida";
import { Retrato } from "./Arte";
import { Resultado } from "./EleicaoNoTablet";

const pct = (x: number) => `${x.toFixed(1).replace(".", ",")}%`;
const DURACAO = 9000;

type Linha = Readonly<{ nome: string; votos: number }>;

/** Um número de -1 a 1 fixo para cada nome (a região que chega antes). */
function vies(nome: string): number {
  let h = 2166136261;
  for (const c of nome) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return ((h >>> 0) / 4294967295) * 2 - 1;
}

/** Os votos com `apurado` (0 a 1) das urnas: oscilam no começo e fecham. */
function parcial(linhas: readonly Linha[], apurado: number) {
  const resto = Math.pow(1 - apurado, 1.4);
  const mexidos = linhas.map((l) =>
    Math.max(0.1, l.votos + vies(l.nome) * 9 * resto),
  );
  const total = mexidos.reduce((a, b) => a + b, 0);
  return linhas
    .map((l, i) => ({ nome: l.nome, votos: (100 * mexidos[i]) / total }))
    .sort((a, b) => b.votos - a.votos);
}

function Apuracao({
  turno,
  linhas,
  nosso,
  retratoDe,
  pular,
  onFim,
}: {
  turno: 1 | 2;
  linhas: readonly Linha[];
  nosso: string;
  retratoDe: (nome: string) => string | undefined;
  pular: boolean;
  onFim: () => void;
}) {
  const [apurado, setApurado] = useState(0);
  const pulou = useRef(false);
  useEffect(() => {
    pulou.current = pular;
    if (pular) setApurado(1);
  }, [pular]);
  useEffect(() => {
    const inicio = performance.now();
    let quadro = 0;
    const passo = (agora: number) => {
      if (pulou.current) return;
      // as urnas chegam rápido no começo e devagar no fim
      const t = Math.min(1, (agora - inicio) / DURACAO);
      setApurado(1 - Math.pow(1 - t, 1.6));
      if (t < 1) quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, []);
  const fechou = apurado >= 1;
  useEffect(() => {
    if (fechou) onFim();
  }, [fechou, onFim]);
  const agora = parcial(linhas, apurado);
  return (
    <section className="ap-painel" aria-label={`Apuração do ${turno}º turno`}>
      <header className="ap-placar">
        <span className="ap-titulo">Apuração · {turno}º turno</span>
        <span className="ap-urnas">
          <small>Urnas apuradas</small>
          <strong>{pct(apurado * 100)}</strong>
        </span>
      </header>
      <ol className="ap-linhas">
        {agora.map((l, i) => (
          <li
            key={l.nome}
            className={`${i === 0 ? "ap-frente" : ""}${l.nome === nosso ? " ap-nosso" : ""}`}
          >
            <Retrato
              retrato={retratoDe(l.nome) ?? "pessoa-real"}
              className="ap-retrato"
            />
            <span className="ap-nome">
              {l.nome}
              {l.nome === nosso ? <small>seu candidato</small> : null}
            </span>
            <span className="ap-barra" aria-hidden>
              <span style={{ width: `${Math.min(100, l.votos)}%` }} />
              {turno === 1 ? <i className="ap-meio" /> : null}
            </span>
            <strong className="ap-pct">{pct(l.votos)}</strong>
          </li>
        ))}
      </ol>
    </section>
  );
}

type Fase = "primeiro" | "anuncio" | "segundo" | "jornal";

export function NoiteDaApuracao({
  resultado: r,
  sigla,
  nomeDoSegmento,
  jaApurada = false,
  onContinuar,
  onNovo,
  onMenu,
}: {
  resultado: VisaoResultado;
  sigla?: string;
  nomeDoSegmento: (id: string) => string;
  /** A partida carregada já acabou: abre direto no jornal. */
  jaApurada?: boolean;
  onContinuar: () => void;
  onNovo: () => void;
  onMenu: () => void;
}) {
  const [fase, setFase] = useState<Fase>(jaApurada ? "jornal" : "primeiro");
  const [contou, setContou] = useState(false);
  const [pular, setPular] = useState(false);
  const retratoDe = (nome: string) => r.retratos[nome];
  const terminou = useCallback(() => setContou(true), []);
  const vaiAoSegundo = r.segundo?.map((l) => l.nome) ?? [];
  const nossoNoSegundo = vaiAoSegundo.includes(r.candidato);
  const avancar = () => {
    setContou(false);
    setPular(false);
    if (fase === "primeiro") setFase(r.segundo ? "anuncio" : "jornal");
    else if (fase === "anuncio") setFase("segundo");
    else setFase("jornal");
  };
  return (
    <div
      className="ap-fundo ds-mesa"
      role="dialog"
      aria-label="Noite da eleição"
    >
      <div className="ap-caixa">
        {fase !== "jornal" ? (
          <p className="ap-plantao">
            <span className="ds-lampada" aria-hidden /> Plantão · noite da
            eleição
          </p>
        ) : null}

        {fase === "primeiro" ? (
          <Apuracao
            key="primeiro"
            turno={1}
            linhas={r.primeiro}
            nosso={r.candidato}
            retratoDe={retratoDe}
            pular={pular}
            onFim={terminou}
          />
        ) : null}

        {fase === "anuncio" ? (
          <section className="ds-papel ap-anuncio">
            <h2>Vai ter 2º turno</h2>
            <p>
              Ninguém passou de 50% dos votos válidos.{" "}
              {vaiAoSegundo.join(" e ")} disputam a Presidência daqui a quatro
              semanas.
            </p>
            {!nossoNoSegundo ? (
              <p className="ap-fora">
                {r.candidato} ficou fora do 2º turno
                {sigla ? ` e o ${sigla} perde o governo` : ""}.
              </p>
            ) : null}
            <div className="ap-duelo">
              {vaiAoSegundo.map((nome) => (
                <figure key={nome}>
                  <Retrato
                    retrato={retratoDe(nome) ?? "pessoa-real"}
                    className="ap-retrato-grande"
                  />
                  <figcaption>{nome}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {fase === "segundo" && r.segundo ? (
          <Apuracao
            key="segundo"
            turno={2}
            linhas={r.segundo}
            nosso={r.candidato}
            retratoDe={retratoDe}
            pular={pular}
            onFim={terminou}
          />
        ) : null}

        {fase === "jornal" ? (
          <>
            <Resultado
              r={r}
              sigla={sigla}
              nomeDoSegmento={nomeDoSegmento}
              retratoDe={retratoDe}
            />
            <div className="ap-botoes">
              {r.venceu ? (
                <button
                  type="button"
                  className="ds-placa"
                  onClick={onContinuar}
                >
                  <span className="ds-lampada" aria-hidden />
                  Começar o {r.mandato + 1}º mandato
                </button>
              ) : (
                <>
                  <button type="button" className="ds-placa" onClick={onNovo}>
                    <span className="ds-lampada" aria-hidden />
                    Novo partido
                  </button>
                  <button type="button" className="ds-assinar" onClick={onMenu}>
                    Voltar ao menu
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="ap-botoes">
            {fase === "anuncio" || contou ? (
              <button type="button" className="ds-placa" onClick={avancar}>
                <span className="ds-lampada" aria-hidden />
                {fase === "anuncio"
                  ? "Apurar o 2º turno"
                  : fase === "primeiro" && r.segundo
                    ? "Fechar o 1º turno"
                    : "Ver o jornal de amanhã"}
              </button>
            ) : (
              <button
                type="button"
                className="ds-assinar"
                onClick={() => setPular(true)}
              >
                Pular a contagem
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
