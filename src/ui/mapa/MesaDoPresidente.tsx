/**
 * O cartão do dilema (SG106): cada opção mostra o que mexe, quanto tempo
 * dura, as leis que muda e, escolhida, a prévia de um ano. Desde o V1-13 ele
 * aparece no app de notificações do tablet, não numa janela própria.
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

/** Para onde a opção puxa o governo na bússola (V1-13). */
function LadoNaBussola({ lado }: { lado: readonly [number, number] }) {
  const [economia, costumes] = lado;
  const parte = (v: number, menos: string, mais: string) =>
    Math.abs(v) < 0.25
      ? null
      : `${Math.abs(v) >= 1 ? "" : "um pouco "}${v < 0 ? menos : mais}`;
  const partes = [
    parte(economia, "Estado", "mercado"),
    parte(costumes, "liberdade", "autoridade"),
  ].filter((p): p is string => p !== null);
  const r = 9;
  const x = 12 + (economia / 2) * r;
  const y = 12 - (costumes / 2) * r;
  return (
    <span
      className="lado-bussola"
      title="Para onde esta escolha puxa o governo na bússola"
    >
      <svg width={24} height={24} viewBox="0 0 24 24" aria-hidden>
        <circle cx={12} cy={12} r={r + 1} className="lado-aro" />
        <line x1={2} x2={22} y1={12} y2={12} className="lado-eixo" />
        <line x1={12} x2={12} y1={2} y2={22} className="lado-eixo" />
        {partes.length ? (
          <line x1={12} y1={12} x2={x} y2={y} className="lado-seta" />
        ) : null}
        <circle cx={x} cy={y} r={2.4} className="lado-ponta" />
      </svg>
      {partes.length
        ? `Puxa para ${partes.join(" e ")}`
        : "Não puxa para lado nenhum"}
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

export function CartaoDilema({
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
      <p className="legenda-dilema">
        <span>
          <i style={{ "--cor-efeito": COR_EFEITO.melhora } as CSSProperties} />
          bom para o país
        </span>
        <span>
          <i style={{ "--cor-efeito": COR_EFEITO.piora } as CSSProperties} />
          ruim para o país
        </span>
        <span>
          <i style={{ "--cor-efeito": COR_EFEITO.neutro } as CSSProperties} />
          depende
        </span>
        <span>▲ sobe · ▼ desce</span>
      </p>
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
              {op.lado ? <LadoNaBussola lado={op.lado} /> : null}
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
