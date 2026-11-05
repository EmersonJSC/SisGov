/**
 * Janela da lei, herdada do projeto antigo (src/ui/mapa/Documentos.tsx em
 * f62c3fef): papel com timbre e selo, arrastável, folha dupla. À esquerda a
 * lei e o controle; à direita os efeitos diretos (prévia do motor, sem
 * cadeia). "Enviar ao Congresso" põe o pedido na fila do turno.
 */
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as PointerEventReact,
  type ReactNode,
} from "react";
import type { PreviaLei, VisaoLei, VisaoPartida } from "../../partida";
import {
  NOME_GRUPO,
  atraso,
  dinheiro,
  fluxoDaLei,
  nivelDaLei,
  porAnoEPorTurno,
} from "./formatos";
import { Icone } from "./Icone";
import { ICONE_BOLHA, ICONE_INTERFACE, ICONE_LEI } from "./icones";
import { iconeLei } from "./iconesPersonalizados";
import { ficaNaPresidencia, type BaseMapa } from "./layout";
import { efeitoDe, type Efeito, type IndiceRelacoes } from "./relacoes";
import { COR_EFEITO } from "./tema";

// ---------------------------------------------------------------------------
// Papel, timbre e selo (do antigo)
// ---------------------------------------------------------------------------

function Selo({ icone, cor }: { icone: string; cor: string }) {
  const estrelas = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    return { x: 32 + Math.cos(a) * 25, y: 32 + Math.sin(a) * 25 };
  });
  return (
    <svg viewBox="0 0 64 64" className="selo" aria-hidden="true">
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="#fffaf0"
        stroke="#b8933f"
        strokeWidth="2.5"
      />
      <circle cx="32" cy="32" r="21" fill={cor} />
      {estrelas.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="1.6" fill="#b8933f" />
      ))}
      <g transform="translate(20 20)">
        <Icone nome={icone} tamanho={24} />
      </g>
    </svg>
  );
}

/** Deslocamento da janela a partir do centro da tela, em pixels. */
export type Desvio = Readonly<{ x: number; y: number }>;

/** Retângulo da janela, relativo à área do mapa. */
export type Retangulo = Readonly<{
  left: number;
  top: number;
  right: number;
  bottom: number;
}>;

/** Comportamento comum de janela: posição, arraste e retângulo ocupado. */
export type JanelaProps = Readonly<{
  desvio: Desvio;
  onDesvio: (d: Desvio) => void;
  onRetangulo: (r: Retangulo | null) => void;
  /** Ordem de empilhamento (maior = mais na frente). */
  camada: number;
  /** Janela da frente (a que o mapa destaca). */
  ativa: boolean;
  /** Clicar em qualquer parte traz a janela para a frente. */
  onFocar: () => void;
}>;

/** Quanto da janela precisa continuar visível ao arrastar para a borda. */
const SOBRA_VISIVEL = 140;

export function Documento({
  orgao,
  setor,
  numero,
  cor,
  icone,
  onFechar,
  rodape,
  children,
  rotulo,
  duplo = false,
  desvio,
  onDesvio,
  onRetangulo,
  camada,
  ativa,
  onFocar,
}: JanelaProps & {
  orgao: string;
  setor: string;
  numero: string;
  cor: string;
  icone: string;
  onFechar: () => void;
  rodape?: ReactNode;
  children: ReactNode;
  rotulo: string;
  /** Duas páginas lado a lado, como uma pasta aberta (V1-36). */
  duplo?: boolean;
}) {
  const janela = useRef<HTMLElement>(null);
  const arraste = useRef<{
    x: number;
    y: number;
    dx: number;
    dy: number;
  } | null>(null);

  // Informa ao mapa onde a janela está (para não esconder a seleção).
  const medir = () => {
    const el = janela.current;
    const pai = el?.parentElement;
    if (!el || !pai) return;
    const r = el.getBoundingClientRect();
    const p = pai.getBoundingClientRect();
    onRetangulo({
      left: r.left - p.left,
      top: r.top - p.top,
      right: r.right - p.left,
      bottom: r.bottom - p.top,
    });
  };
  useEffect(() => {
    medir();
    const el = janela.current;
    const observador = new ResizeObserver(medir);
    if (el?.parentElement) observador.observe(el.parentElement);
    return () => {
      observador.disconnect();
      onRetangulo(null);
    };
    // mede ao abrir; o arraste mede ao soltar
  }, []);

  /** Mantém pelo menos um pedaço da janela (e o timbre) dentro da tela. */
  const prender = (x: number, y: number): Desvio => {
    const el = janela.current;
    const pai = el?.parentElement;
    if (!el || !pai) return { x, y };
    const largura = el.offsetWidth;
    const altura = el.offsetHeight;
    const meiaW = pai.clientWidth / 2;
    const meiaH = pai.clientHeight / 2;
    const maxX = meiaW + largura / 2 - SOBRA_VISIVEL;
    const maxYbaixo = meiaH + altura / 2 - 70;
    const maxYcima = meiaH - altura / 2;
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxYbaixo, Math.max(-maxYcima, y)),
    };
  };

  const pegar = (e: PointerEventReact<HTMLElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    arraste.current = {
      x: e.clientX,
      y: e.clientY,
      dx: desvio.x,
      dy: desvio.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    janela.current?.classList.add("arrastando");
  };
  const mover = (e: PointerEventReact<HTMLElement>) => {
    const a = arraste.current;
    if (!a) return;
    onDesvio(prender(a.dx + e.clientX - a.x, a.dy + e.clientY - a.y));
  };
  const soltar = () => {
    if (!arraste.current) return;
    arraste.current = null;
    janela.current?.classList.remove("arrastando");
    requestAnimationFrame(medir);
  };
  return (
    <aside
      ref={janela}
      className={`documento${duplo ? " duplo" : ""}${ativa ? " ativa" : ""}`}
      role="dialog"
      aria-label={rotulo}
      style={
        {
          "--cor": cor,
          "--dx": `${desvio.x}px`,
          "--dy": `${desvio.y}px`,
          zIndex: 10 + camada,
        } as CSSProperties
      }
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (!ativa) onFocar();
      }}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="papel">
        <header
          className="timbre"
          onPointerDown={pegar}
          onPointerMove={mover}
          onPointerUp={soltar}
          onPointerCancel={soltar}
          onDoubleClick={() => {
            onDesvio({ x: 0, y: 0 });
            requestAnimationFrame(medir);
          }}
          title="Arraste para mover o documento · clique duas vezes para centralizar"
        >
          <span className="pegador" aria-hidden="true" />
          <Selo icone={icone} cor={cor} />
          <div className="timbre-texto">
            <strong>{orgao}</strong>
            <span>{setor}</span>
          </div>
          <span className="numero-doc">{numero}</span>
          <button
            type="button"
            className="fechar-doc"
            onClick={onFechar}
            aria-label="Fechar documento"
          >
            <Icone nome={ICONE_INTERFACE.fechar} tamanho={20} />
          </button>
        </header>
        <div className="papel-corpo">{children}</div>
        {rodape ? <footer className="despacho">{rodape}</footer> : null}
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Peças do relatório de impacto

/** Barrinha do efeito: sobe (melhora, verde) ou desce (piora, vermelho) da linha. */
function MiniGrafico({
  delta,
  relativo,
  efeito,
}: {
  delta: number;
  relativo: number;
  efeito: Efeito;
}) {
  const altura = delta === 0 ? 0 : 3 + Math.min(11, relativo * 160);
  return (
    <span className="mini-grafico" aria-hidden="true">
      <i className="linha-base" />
      {delta === 0 ? (
        <i className="barra neutra" />
      ) : (
        <i
          className={`barra ${delta > 0 ? "sobe" : "desce"}`}
          style={{
            height: `${altura}px`,
            background: COR_EFEITO[efeito],
          }}
        />
      )}
    </span>
  );
}

/** "Nome (detalhe)": o nome vai em destaque e o detalhe em letra pequena. */
function partirRotulo(rotulo: string): [string, string] {
  const m = rotulo.match(/^(.*?)\s*\(([^)]*)\)\s*(.*)$/);
  if (!m) return [rotulo, ""];
  const nome = `${m[1]} ${m[3]}`.trim();
  const detalhe = m[2].replace(/o país de referência/gi, "").trim();
  return [nome || rotulo, /^[\s\d–-]*$/.test(detalhe) ? "" : detalhe];
}

/** Deslizador com degraus: um pino por opção, do menor ao maior valor. */
function ControleEmDegraus({
  opcoes,
  indice,
  vigente,
  bloqueada,
  motivo,
  onEscolher,
}: {
  opcoes: NonNullable<VisaoLei["opcoes"]>;
  indice: number;
  vigente: string | undefined;
  bloqueada: (i: number) => boolean;
  motivo: (i: number) => string | undefined;
  onEscolher: (i: number) => void;
}) {
  const n = opcoes.length;
  const atual = opcoes[indice];
  const proporcao = n > 1 ? indice / (n - 1) : 0;
  // 2 opções: dois botões lado a lado; 3 ou mais: deslizador com degraus
  if (n <= 2)
    return (
      <div className="controle-folha" role="radiogroup" aria-label="Escolha">
        <div className="duas-opcoes">
          {opcoes.map((o, i) => (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={i === indice}
              disabled={bloqueada(i)}
              title={bloqueada(i) ? motivo(i) : undefined}
              className={i === indice ? "ativa" : ""}
              onClick={() => onEscolher(i)}
            >
              {partirRotulo(o.rotulo)[0]}
              {o.id === vigente ? <small>em vigor</small> : null}
            </button>
          ))}
        </div>
      </div>
    );
  return (
    <div className="controle-folha">
      <div className="degrau-atual" aria-live="polite">
        <strong>{partirRotulo(atual.rotulo)[0]}</strong>
        {atual.id === vigente ? <small>em vigor</small> : null}
      </div>
      {partirRotulo(atual.rotulo)[1] ? (
        <p className="degrau-detalhe">{partirRotulo(atual.rotulo)[1]}</p>
      ) : null}
      <div className="deslizador" style={{ "--p": proporcao } as CSSProperties}>
        <input
          type="range"
          min={0}
          max={n - 1}
          step={1}
          value={indice}
          aria-label="Nível da lei"
          aria-valuetext={atual.rotulo}
          onChange={(e) => {
            const i = Number(e.target.value);
            if (!bloqueada(i)) onEscolher(i);
          }}
        />
        <div className="degraus" aria-hidden="true">
          {opcoes.map((o, i) => (
            <i
              key={o.id}
              className={`${i <= indice ? "cheio" : ""}${bloqueada(i) ? " trancado" : ""}${o.id === vigente ? " vigente" : ""}`}
              title={o.rotulo}
            />
          ))}
        </div>
      </div>
      <div className="extremos">
        <span>{partirRotulo(opcoes[0].rotulo)[0]}</span>
        <span>{partirRotulo(opcoes[n - 1].rotulo)[0]}</span>
      </div>
    </div>
  );
}

type Zona = "boa" | "atencao" | "perigo";

/** Zona do valor no controle e a frase de aviso (vazia sem alerta). */
function zonaDoValor(lei: VisaoLei, v: number): [Zona, string] {
  const a = lei.alerta;
  if (!a) return ["boa", ""];
  if (a.tipo === "imposto") {
    if (v > a.limite) return ["perigo", "A receita cai a partir daqui."];
    if (v >= a.limite * ZONA_PERTO_DO_PICO)
      return ["atencao", "Perto do pico: a receita quase para de subir."];
    return ["boa", ""];
  }
  return v > a.limite
    ? ["perigo", "Daqui para cima abre déficit."]
    : ["boa", ""];
}

const ZONA_PERTO_DO_PICO = 0.8;
const MARCAS_DA_REGUA = [0, 0.25, 0.5, 0.75, 1];

function ControleNumerico({
  lei,
  valor,
  onValor,
  moeda,
  pib,
}: {
  lei: VisaoLei;
  valor: number;
  onValor: (v: number) => void;
  moeda: string;
  pib: number;
}) {
  const min = lei.minimo ?? 0;
  const max = lei.maximo ?? 100;
  const passo = lei.passo ?? 0.1;
  const pos = (v: number) => (v - min) / (max - min);
  const [zona, aviso] = zonaDoValor(lei, valor);
  const a = lei.alerta;
  // paradas da faixa de cores atrás do trilho
  const cortes =
    a?.tipo === "imposto"
      ? [pos(a.limite * ZONA_PERTO_DO_PICO), pos(a.limite)]
      : a
        ? [pos(a.limite), pos(a.limite)]
        : [1, 1];
  const [c1, c2] = cortes.map((c) => `${Math.min(1, Math.max(0, c)) * 100}%`);
  const estilo = {
    "--p": pos(valor),
    "--vigente": pos(lei.nivel),
    "--c1": c1,
    "--c2": c2,
  } as CSSProperties;
  return (
    <div
      className={`regua-lei zona-${zona}${a?.tipo === "verba" ? " sem-faixas" : ""}`}
      style={estilo}
    >
      <div className="regua-marcas" aria-hidden="true">
        {MARCAS_DA_REGUA.map((m) => (
          <span key={m} style={{ left: `${m * 100}%` }}>
            {nivelDaLei(min + m * (max - min), lei.unidade)}
          </span>
        ))}
      </div>
      <div className="regua-corpo">
        <div className="regua-trilho">
          <div className="regua-zonas" />
          <div className="regua-cheio" />
          <i className="regua-vigente" title="Em vigor" />
        </div>
        <output className="regua-pino" aria-live="polite">
          {nivelDaLei(valor, lei.unidade)}
        </output>
        <input
          type="range"
          min={min}
          max={max}
          step={passo}
          value={valor}
          onChange={(e) => onValor(Number(e.target.value))}
          aria-label={`Nível de ${lei.nome}`}
          aria-valuetext={nivelDaLei(valor, lei.unidade)}
        />
      </div>
      <p className="regua-aviso" aria-live="polite">
        {aviso || "\u00a0"}
      </p>
      {lei.fluxo ? (
        <p className="regua-dinheiro">
          {(() => {
            const f = lei.fluxo;
            const agora = fluxoDaLei(f, valor);
            const dif = agora - fluxoDaLei(f, lei.nivel);
            const verbo = f.tipo === "verba" ? "custa" : "arrecada";
            return `≈ ${verbo} ${porAnoEPorTurno(agora, pib, moeda)}${
              Math.abs(dif) >= 0.005
                ? ` (${dif > 0 ? "+" : "−"}${dinheiro(Math.abs(dif / 100) * pib, moeda)} por ano)`
                : ""
            }`;
          })()}
        </p>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Documento da lei
// ---------------------------------------------------------------------------

type Secao = "indice" | "grupo";
const NOME_DA_SECAO: Readonly<Record<Secao, string>> = {
  indice: "O que muda no país",
  grupo: "Apoio dos grupos",
};

type LinhaDeEfeito = Readonly<{
  id: string;
  nome: string;
  icone: string;
  secao: Secao;
  efeito: Efeito;
  /** A mudança em palavras ("+2,5 pontos"); vazio sem mudança. */
  texto: string;
  detalhe: string;
}>;

const pontos = (p: number) =>
  `${p > 0 ? "+" : "−"}${Math.abs(p).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} ${Math.abs(p) >= 0.95 && Math.abs(p) < 1.05 ? "ponto" : "pontos"}`;

export function DocumentoLei({
  lei,
  visao,
  moeda,
  pib,
  base,
  indice,
  rascunho,
  onRascunho,
  previa,
  naFila,
  travada,
  enviado,
  onEnviar,
  onTirar,
  onFechar,
  ...janela
}: JanelaProps & {
  lei: VisaoLei;
  visao: VisaoPartida;
  moeda: string;
  pib: number;
  base: BaseMapa;
  indice: IndiceRelacoes;
  /** Nível escolhido na janela, na unidade da visão. */
  rascunho: number;
  onRascunho: (nivel: number) => void;
  /** Efeitos diretos do rascunho; null se igual ao vigente. */
  previa: PreviaLei | null;
  /** Há pedido desta lei na fila do turno. */
  naFila: boolean;
  /** Só pode ficar no "nada": não vale junto com outra escolha do jogador. */
  travada: boolean;
  /** O rascunho é o mesmo que já está na fila. */
  enviado: boolean;
  /** Põe (ou troca) o pedido do rascunho na fila. */
  onEnviar: () => void;
  onTirar: () => void;
  onFechar: () => void;
}) {
  const bolhas = useMemo(
    () => new Map(visao.bolhas.map((b) => [b.id, b])),
    [visao],
  );
  const cor = base.porNome.get(lei.areas[0])?.cor ?? "#666";
  // sem valor no país, qualquer escolha é lei nova
  const mudou = !!lei.naoLegislada || Math.abs(rascunho - lei.meta) > 1e-9;
  const constitucional = ficaNaPresidencia(lei);
  const numero = `Nº ${String(visao.leis.indexOf(lei) + 1).padStart(3, "0")}`;
  const [carimbo, setCarimbo] = useState(false);
  const temporizadores = useRef<number[]>([]);
  useEffect(() => () => temporizadores.current.forEach(clearTimeout), []);

  const enviar = () => {
    setCarimbo(true);
    temporizadores.current.push(
      window.setTimeout(onEnviar, 650),
      window.setTimeout(() => setCarimbo(false), 1500),
    );
  };

  const secaoDe = (id: string): Secao =>
    bolhas.get(id)?.tipo === "grupo" ? "grupo" : "indice";
  const linhas: readonly LinhaDeEfeito[] = previa
    ? [
        ...previa.indices.map((e) => {
          const b = bolhas.get(e.id);
          return {
            id: e.id,
            nome: b?.nome ?? e.id,
            icone: ICONE_BOLHA[e.id] ?? "chart-line",
            secao: "indice" as const,
            efeito: efeitoDe(Math.sign(e.pontos), b?.avaliacao),
            texto: pontos(e.pontos),
            detalhe: e.porAno
              ? `por ano, ${atraso(e.atrasoMeses)}`
              : e.aosPoucos
                ? `aos poucos, ${atraso(e.atrasoMeses)}`
                : atraso(e.atrasoMeses),
          };
        }),
        ...previa.grupos.map((g) => ({
          id: g.id,
          nome: bolhas.get(g.id)?.nome ?? g.id,
          icone: ICONE_BOLHA[g.id] ?? "account-group",
          secao: "grupo" as const,
          efeito: efeitoDe(Math.sign(g.pontos), "maior_melhor"),
          texto: pontos(g.pontos),
          detalhe: g.pontos > 0 ? "ganha apoio" : "perde apoio",
        })),
      ]
    : (indice.porNo.get(lei.id) ?? [])
        .filter((r) => r.de === lei.id && !r.eficacia)
        .map((r) => ({
          id: r.para,
          nome: bolhas.get(r.para)?.nome ?? r.para,
          icone: ICONE_BOLHA[r.para] ?? "chart-line",
          secao: secaoDe(r.para),
          efeito: r.efeito,
          texto: "",
          detalhe: `efeito direto, ${atraso(r.atrasoMeses)}`,
        }));
  const secoes = (["indice", "grupo"] as const)
    .map((secao) => ({
      secao,
      linhas: linhas.filter((l) => l.secao === secao),
    }))
    .filter((s) => s.linhas.length);

  const opcoes = lei.opcoes ?? [];

  return (
    <Documento
      duplo
      orgao={lei.ministerios[0]}
      setor={lei.naoLegislada ? "Nova lei" : "Alterar lei"}
      numero={numero}
      cor={cor}
      icone={iconeLei(lei.id, ICONE_LEI[lei.id] ?? ICONE_INTERFACE.lei)}
      onFechar={onFechar}
      rotulo={`Folha da lei ${lei.nome}`}
      {...janela}
      rodape={
        <div className="acoes-doc">
          {naFila ? (
            <button type="button" className="botao-revogar" onClick={onTirar}>
              Tirar da fila
            </button>
          ) : null}
          <button
            type="button"
            className="botao-arquivar"
            disabled={!mudou}
            onClick={() => onRascunho(Math.max(0, lei.meta))}
          >
            Desfazer
          </button>
          <button
            type="button"
            className="botao-assinar"
            disabled={!mudou || carimbo || enviado}
            onClick={enviar}
          >
            <Icone nome={ICONE_INTERFACE.assinar} tamanho={18} />
            Enviar ao Congresso
          </button>
        </div>
      }
    >
      {carimbo ? <div className="carimbo">Enviado</div> : null}
      <div className="folha">
        <section className="pagina pagina-esquerda" aria-label="A lei">
          <p className="folha-tipo">
            {NOME_GRUPO[lei.grupo]}
            {constitucional ? " · § Presidência" : ""}
            {lei.naoLegislada ? " · ainda não legislada" : ""}
          </p>
          <h1 className="titulo-doc">{lei.nome}</h1>
          {lei.descricao ? (
            <p className="folha-explica">{lei.descricao}</p>
          ) : null}
          {travada ? (
            <p className="bloqueio-doc">
              Não vale junto com o que já está em vigor ou na fila.
            </p>
          ) : null}
          {opcoes.length ? (
            <ControleEmDegraus
              opcoes={opcoes}
              indice={Math.round(rascunho)}
              vigente={lei.opcaoAtual}
              bloqueada={(i) => i > 0 && travada}
              motivo={() => undefined}
              onEscolher={onRascunho}
            />
          ) : (
            <ControleNumerico
              lei={lei}
              valor={rascunho}
              onValor={onRascunho}
              moeda={moeda}
              pib={pib}
            />
          )}
          {naFila ? (
            <div className="cg-envio folha-congresso">
              <p>
                <span className="cg-selo">Na fila do Congresso</span>
              </p>
              <small className="folha-caminho">
                Vai a voto ao passar o turno.
              </small>
            </div>
          ) : null}
        </section>
        <span className="lombada" aria-hidden="true" />
        <section className="pagina pagina-direita impacto" aria-label="Efeitos">
          <div className="folha-efeitos-topo">
            <h2>Efeitos</h2>
          </div>
          {previa ? (
            <p className="vazio">
              {previa.indices.some((e) => e.aosPoucos)
                ? "O que esta lei muda; parte vem aos poucos, pela cadeia."
                : "Só o que esta lei muda direto, sem cadeia."}
            </p>
          ) : null}
          {secoes.map((g) => (
            <section key={g.secao} className="efeitos-secao">
              <h3>{NOME_DA_SECAO[g.secao]}</h3>
              <ul className="efeitos-folha">
                {g.linhas.map((l, i) => (
                  <li key={`${l.id}-${i}`}>
                    <div
                      className={`efeito-linha${l.texto ? " com-texto" : ""}`}
                    >
                      <Icone nome={l.icone} tamanho={20} />
                      <span className="efeito-nome">
                        {l.nome}
                        <small>{l.detalhe}</small>
                      </span>
                      {l.texto ? (
                        <span
                          className={`efeito-texto ${l.efeito}`}
                          style={{ color: COR_EFEITO[l.efeito] }}
                        >
                          {l.texto}
                        </span>
                      ) : (
                        <MiniGrafico
                          delta={l.efeito === "piora" ? -1 : 1}
                          relativo={0.05}
                          efeito={l.efeito}
                        />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          {!linhas.length ? <p className="vazio">Sem efeito direto.</p> : null}
        </section>
      </div>
    </Documento>
  );
}
