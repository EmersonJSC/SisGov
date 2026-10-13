/**
 * O cartão do dilema (SG106): desde o V1-13 ele aparece no app de
 * notificações do tablet. As opções não contam o que vão mexer: o
 * resultado só aparece depois de assinar, e a bússola muda calada (o
 * jogador vê no app dela).
 */
import { useEffect, useState, type CSSProperties } from "react";
import {
  preverDilema,
  type EfeitoPrevisto,
  type Partida,
  type VisaoDilema,
  type VisaoEfeitoOcorrencia,
} from "../../app/partida";
import { diferenca } from "./formatos";
import { Icone } from "./Icone";
import { ICONE_INTERFACE } from "./icones";
import { efeitoDe } from "./relacoes";
import { COR_EFEITO } from "./tema";

export const NOME_NIVEL: Readonly<Record<number, string>> = {
  1: "Local",
  2: "Regional",
  3: "Nacional",
  4: "Catástrofe",
};

export const NOME_ORIGEM: Readonly<Record<string, string>> = {
  mundo: "Vem do mundo",
  natureza: "Natureza",
  pais: "Estado do país",
  reacao: "Reação a uma decisão",
  desdobramento: "Desdobramento",
  crise: "Crise",
  cotidiano: "Cotidiano do governo",
};

function Chip({ efeito }: { efeito: VisaoEfeitoOcorrencia }) {
  const tipo = efeitoDe(Math.sign(efeito.pontos), efeito.avaliacao);
  return (
    <span
      className="chip-efeito"
      style={{ "--cor-efeito": COR_EFEITO[tipo] } as CSSProperties}
    >
      {efeito.pontos > 0 ? "▲" : "▼"} {efeito.nome}
    </span>
  );
}

function Previa({
  efeitos,
  calculando,
}: {
  efeitos: readonly EfeitoPrevisto[] | null;
  calculando: boolean;
}) {
  if (calculando) return <p className="previa-dilema vazio">Simulando…</p>;
  if (!efeitos) return null;
  // o pico da diferença no ano (a opção pode durar menos que um ano)
  const itens = efeitos
    .map((e) => {
      let d = 0;
      e.comMudanca.forEach((v, i) => {
        const x = v - e.semMudanca[i];
        if (Math.abs(x) > Math.abs(d)) d = x;
      });
      return { e, d };
    })
    .filter((x) => Math.abs(x.d) >= 0.05)
    .sort((a, b) => Math.abs(b.d) - Math.abs(a.d))
    .slice(0, 8);
  if (!itens.length)
    return (
      <p className="previa-dilema vazio">Efeito pequeno demais em um ano.</p>
    );
  return (
    <div className="previa-dilema">
      <strong>
        No próximo ano, o maior efeito (comparado com não ter decidido):
      </strong>
      <ul>
        {itens.map(({ e, d }) => (
          <li key={e.id}>
            <span>{e.nome}</span>
            <b
              style={{
                color: COR_EFEITO[efeitoDe(Math.sign(d), e.avaliacao)],
              }}
            >
              {diferenca(d, e.unidade)}
            </b>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** O que a decisão assinada mexe: só aparece depois de assinar. */
export type DilemaRespondido = Readonly<{
  dilema: VisaoDilema;
  opcao: VisaoDilema["opcoes"][number];
  efeitos: readonly EfeitoPrevisto[] | null;
}>;

export function ResultadoDoDilema({
  resultado,
  onFechar,
}: {
  resultado: DilemaRespondido;
  onFechar: () => void;
}) {
  const { dilema, opcao, efeitos } = resultado;
  const chips = [...opcao.efeitos]
    .sort((a, b) => Math.abs(b.pontos) - Math.abs(a.pontos))
    .slice(0, 6);
  return (
    <article className={`dilema nivel-${dilema.nivel} dilema-resultado`}>
      <header className="dilema-topo">
        <span className={`selo-nivel nivel-${dilema.nivel}`}>Decidido</span>
        <span className="dilema-origem">{dilema.manchete}</span>
      </header>
      <h2>{opcao.rotulo}</h2>
      <p className="dilema-texto">{opcao.descricao}</p>
      {chips.length ? (
        <span className="chips-efeito">
          {chips.map((e) => (
            <Chip key={e.id} efeito={e} />
          ))}
        </span>
      ) : null}
      {opcao.leis.map((l) => (
        <span key={l.id} className="opcao-lei">
          Muda a lei {l.nome} → {l.para}
        </span>
      ))}
      <small className="opcao-duracao">
        Vale por {opcao.duracaoMeses}{" "}
        {opcao.duracaoMeses === 1 ? "mês" : "meses"}
      </small>
      <Previa efeitos={efeitos} calculando={false} />
      <footer className="dilema-rodape">
        <button type="button" className="assinar-dilema" onClick={onFechar}>
          Entendi
        </button>
      </footer>
    </article>
  );
}

export function CartaoDilema({
  dilema,
  partida,
  onEscolher,
  onRespondido = () => {},
}: {
  dilema: VisaoDilema;
  partida: Partida;
  onEscolher: (dilemaId: string, opcaoId: string) => string | null;
  onRespondido?: (resultado: DilemaRespondido) => void;
}) {
  const [escolhida, setEscolhida] = useState<string | null>(null);
  const [assinando, setAssinando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setEscolhida(null);
    setAssinando(false);
    setErro(null);
  }, [dilema.id]);

  const assinar = () => {
    const opcao = dilema.opcoes.find((o) => o.id === escolhida);
    if (!opcao) return;
    setAssinando(true);
    // deixa o botão mostrar o estado antes de simular o ano
    window.setTimeout(() => {
      const previa = preverDilema(partida, dilema.id, opcao.id, 4);
      const falha = onEscolher(dilema.id, opcao.id);
      setAssinando(false);
      setErro(falha);
      if (!falha)
        onRespondido({
          dilema,
          opcao,
          efeitos: previa.ok ? previa.value.efeitos : null,
        });
    }, 30);
  };

  const nivel = dilema.nivel;
  return (
    <article className={`dilema nivel-${nivel}`}>
      <header className="dilema-topo">
        <span className={`selo-nivel nivel-${nivel}`}>
          {NOME_NIVEL[nivel] ?? "Regional"}
        </span>
        <span className="dilema-origem">
          {NOME_ORIGEM[dilema.origem] ?? dilema.origem}
          {dilema.area ? ` · ${dilema.area}` : ""}
        </span>
      </header>
      <h2>{dilema.manchete}</h2>
      {dilema.causa ? (
        <p className="dilema-causa">Por causa de: {dilema.causa.nome}</p>
      ) : null}
      <p className="dilema-texto">{dilema.descricao}</p>
      <div className="opcoes-dilema" role="radiogroup" aria-label="Opções">
        {dilema.opcoes.map((op) => {
          const ativa = escolhida === op.id;
          return (
            <button
              key={op.id}
              type="button"
              role="radio"
              aria-checked={ativa}
              disabled={!op.disponivel || assinando}
              className={`opcao-dilema${ativa ? " ativa" : ""}${op.disponivel ? "" : " bloqueada"}`}
              onClick={() => {
                setEscolhida(op.id);
                setErro(null);
              }}
            >
              <strong>{op.rotulo}</strong>
              <span className="opcao-texto">{op.descricao}</span>
              {op.disponivel ? null : (
                <small className="opcao-duracao">{op.motivo}</small>
              )}
            </button>
          );
        })}
      </div>
      {erro ? <p className="erro">{erro}</p> : null}
      <footer className="dilema-rodape">
        <button
          type="button"
          className="assinar-dilema"
          disabled={!escolhida || assinando}
          onClick={assinar}
        >
          <Icone nome={ICONE_INTERFACE.assinar} tamanho={18} />
          {assinando ? "Assinando…" : "Assinar decisão"}
        </button>
      </footer>
    </article>
  );
}
