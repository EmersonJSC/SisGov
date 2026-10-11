/**
 * A cadeira do presidente (SG106): os dilemas da mesa. O jogo pausa até o
 * jogador escolher uma opção; cada opção mostra o que mexe, quanto tempo
 * dura, as leis que muda e, escolhida, a prévia de um ano. O jogador pode
 * baixar a mesa para olhar o país antes de decidir.
 */
import { useEffect, useMemo, useState, type CSSProperties } from "react";
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
        No próximo ano, o maior efeito (comparado com não responder):
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

function CartaoDilema({
  dilema,
  partida,
  onEscolher,
}: {
  dilema: VisaoDilema;
  partida: Partida;
  onEscolher: (dilemaId: string, opcaoId: string) => string | null;
}) {
  const [escolhida, setEscolhida] = useState<string | null>(null);
  const [previa, setPrevia] = useState<readonly EfeitoPrevisto[] | null>(null);
  const [calculando, setCalculando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setEscolhida(null);
    setPrevia(null);
    setErro(null);
  }, [dilema.id]);

  useEffect(() => {
    if (!escolhida) return;
    setCalculando(true);
    const id = window.setTimeout(() => {
      const r = preverDilema(partida, dilema.id, escolhida, 4);
      setCalculando(false);
      setPrevia(r.ok ? r.value.efeitos : null);
    }, 60);
    return () => window.clearTimeout(id);
  }, [partida, dilema.id, escolhida]);

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
          const efeitos = [...op.efeitos]
            .sort((a, b) => Math.abs(b.pontos) - Math.abs(a.pontos))
            .slice(0, 6);
          return (
            <button
              key={op.id}
              type="button"
              role="radio"
              aria-checked={ativa}
              disabled={!op.disponivel}
              className={`opcao-dilema${ativa ? " ativa" : ""}${op.disponivel ? "" : " bloqueada"}`}
              onClick={() => {
                setEscolhida(op.id);
                setErro(null);
              }}
            >
              <strong>{op.rotulo}</strong>
              <span className="opcao-texto">{op.descricao}</span>
              {efeitos.length ? (
                <span className="chips-efeito">
                  {efeitos.map((e) => (
                    <Chip key={e.id} efeito={e} />
                  ))}
                </span>
              ) : null}
              {op.leis.map((l) => (
                <span key={l.id} className="opcao-lei">
                  Muda a lei {l.nome} → {l.para}
                </span>
              ))}
              <small className="opcao-duracao">
                {op.disponivel
                  ? `Vale por ${op.duracaoMeses} ${op.duracaoMeses === 1 ? "mês" : "meses"}`
                  : op.motivo}
              </small>
            </button>
          );
        })}
      </div>
      {escolhida ? <Previa efeitos={previa} calculando={calculando} /> : null}
      {erro ? <p className="erro">{erro}</p> : null}
      <footer className="dilema-rodape">
        <button
          type="button"
          className="assinar-dilema"
          disabled={!escolhida}
          onClick={() => escolhida && setErro(onEscolher(dilema.id, escolhida))}
        >
          <Icone nome={ICONE_INTERFACE.assinar} tamanho={18} />
          Assinar decisão
        </button>
      </footer>
    </article>
  );
}

export function MesaDoPresidente({
  dilemas,
  partida,
  onEscolher,
  aberta,
  onAbrir,
  onBaixar,
}: {
  dilemas: readonly VisaoDilema[];
  partida: Partida;
  onEscolher: (dilemaId: string, opcaoId: string) => string | null;
  aberta: boolean;
  onAbrir: () => void;
  onBaixar: () => void;
}) {
  const [indice, setIndice] = useState(0);
  const atual = dilemas[Math.min(indice, dilemas.length - 1)];
  const quantos = dilemas.length;
  useEffect(() => setIndice(0), [quantos]);
  const titulo = useMemo(
    () =>
      quantos === 1
        ? "Um dilema na sua mesa"
        : `${quantos} dilemas na sua mesa`,
    [quantos],
  );
  if (!atual) return null;
  if (!aberta)
    return (
      <button type="button" className="mesa-minimizada" onClick={onAbrir}>
        <Icone nome={ICONE_INTERFACE.caneta} tamanho={18} />
        {titulo}: decida para encerrar o turno
      </button>
    );
  return (
    <div className="mesa-fundo" role="dialog" aria-label={titulo}>
      <div className="mesa">
        <div className="mesa-barra">
          <span className="mesa-titulo">A cadeira do presidente</span>
          {quantos > 1 ? (
            <span className="mesa-paginas">
              {dilemas.map((d, i) => (
                <button
                  key={d.id}
                  type="button"
                  className={i === indice ? "ativa" : undefined}
                  onClick={() => setIndice(i)}
                >
                  {i + 1}
                </button>
              ))}
            </span>
          ) : null}
          <button type="button" className="mesa-baixar" onClick={onBaixar}>
            Ver o país antes
          </button>
        </div>
        <CartaoDilema
          dilema={atual}
          partida={partida}
          onEscolher={onEscolher}
        />
      </div>
    </div>
  );
}
