/**
 * Mapa político navegável: Presidência no centro, esferas ministeriais ao
 * redor, leis dentro das esferas e indicadores no anel externo.
 *
 * Só desenha. Recebe a `VisaoPartida` já lida e devolve as escolhas do
 * jogador por callbacks; não conhece o motor.
 */
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as KeyboardEventReact,
  type PointerEvent as PointerEventReact,
  type ReactNode,
} from "react";
import type { VisaoBolha, VisaoLei, VisaoPartida } from "../../app/partida";
import {
  focarCirculo,
  limitar,
  paraTela,
  visaoGeral,
  zoomNoPonto,
  ESCALA_MAXIMA,
  type Camera,
  type Tela,
} from "./camera";
import { diferenca, valorDaBolha } from "./formatos";
import {
  RAIO_BASE_BOLHA,
  RAIO_BASE_LEI,
  corDaBondade,
  escalaDaLei,
  intensidadeDaBolha,
  nivelRelativo,
  referenciaDasLeis,
  type IntensidadeBolha,
} from "./intensidade";
import { Icone, IconeSvg } from "./Icone";
import { ICONE_BOLHA, ICONE_INTERFACE, ICONE_LEI } from "./icones";
import {
  PRESIDENCIA,
  ehConstitucional,
  montarLayout,
  quebrarNome,
  blocoCentral,
  BLOCO_PRESIDENCIA_ABERTA,
  type BaseMapa,
  type Esfera,
  type LayoutMapa,
  type Ponto,
  type PosicaoLei,
} from "./layout";
import type { Retangulo } from "./Documentos";
import {
  efeitoDe,
  vizinhanca,
  type Efeito,
  type IndiceRelacoes,
  type LigacaoDeFundo,
  type Relacao,
} from "./relacoes";
import { PRESIDENTE, Retrato, pessoaDoCargo } from "./Retrato";
import { COR_EFEITO, COR_PRESIDENCIA, MEDIDAS } from "./tema";

export type MarcaPrevista = Readonly<{ efeito: Efeito; sobe: boolean }>;

type Props = Readonly<{
  visao: VisaoPartida;
  base: BaseMapa;
  indice: IndiceRelacoes;
  fundo: readonly LigacaoDeFundo[];
  aberta: string | null;
  onAbrir: (id: string | null) => void;
  selecionado: string | null;
  onSelecionar: (id: string | null) => void;
  /** Bolhas que a prévia da lei selecionada mexe. */
  marcas: ReadonlyMap<string, MarcaPrevista>;
  /** Bolhas que mudaram no último turno (piscam por alguns segundos). */
  pulsos: ReadonlySet<string>;
  /** Quanto cada bolha mudou no último turno (só as que mudaram). */
  variacoes: ReadonlyMap<string, number>;
  /** Mostrar as etiquetas de variação do turno sobre as bolhas. */
  mostrarVariacoes: boolean;
  onAlternarVariacoes: () => void;
  /** Largura do painel lateral aberto, em pixels (0 se fechado). */
  painel: number;
  /** Janela aberta sobre o mapa (pixels da área do mapa), se houver. */
  cobertura: Retangulo | null;
}>;

const DURACAO = 420;
const suave = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// ---------------------------------------------------------------------------
// Animação do layout (esferas abrindo, leis aparecendo)
// ---------------------------------------------------------------------------

function interpolar(de: LayoutMapa, para: LayoutMapa, t: number): LayoutMapa {
  if (t >= 1) return para;
  const esferas = new Map<string, Esfera>();
  for (const [id, e] of para.esferas) {
    const a = de.esferas.get(id);
    esferas.set(
      id,
      a
        ? {
            ...e,
            x: mix(a.x, e.x, t),
            y: mix(a.y, e.y, t),
            r: mix(a.r, e.r, t),
            angulo: mix(a.angulo, e.angulo, t),
          }
        : e,
    );
  }
  const leis = new Map<string, PosicaoLei>();
  for (const [id, l] of para.leis) {
    const a = de.leis.get(id);
    leis.set(
      id,
      a
        ? {
            ...l,
            x: mix(a.x, l.x, t),
            y: mix(a.y, l.y, t),
            r: mix(a.r, l.r, t),
          }
        : l,
    );
  }
  return { ...para, esferas, leis };
}

function useLayoutAnimado(alvo: LayoutMapa): LayoutMapa {
  const [quadro, setQuadro] = useState(alvo);
  const atual = useRef(alvo);
  useEffect(() => {
    const de = atual.current;
    if (de === alvo) return;
    const inicio = performance.now();
    let id = 0;
    const passo = (agora: number) => {
      const t = Math.min(1, (agora - inicio) / DURACAO);
      const proximo = interpolar(de, alvo, suave(t));
      atual.current = proximo;
      setQuadro(proximo);
      if (t < 1) id = requestAnimationFrame(passo);
    };
    id = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(id);
  }, [alvo]);
  return quadro;
}

// ---------------------------------------------------------------------------
// Geometria das setas
// ---------------------------------------------------------------------------

type Curva = Readonly<{ d: string; ponta: string; meio: Ponto }>;

function curva(
  a: Ponto,
  b: Ponto,
  raioA: number,
  raioB: number,
  tamanhoPonta: number,
  curvatura = 0.16,
): Curva | null {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const comprimento = Math.hypot(dx, dy);
  if (comprimento < raioA + raioB + 8) return null;
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  let nx = -dy / comprimento;
  let ny = dx / comprimento;
  // dobra para fora do centro do mapa
  if (nx * mx + ny * my < 0) {
    nx = -nx;
    ny = -ny;
  }
  const c = {
    x: mx + nx * comprimento * curvatura,
    y: my + ny * comprimento * curvatura,
  };
  const recuar = (de: Ponto, ate: Ponto, r: number) => {
    const ux = ate.x - de.x;
    const uy = ate.y - de.y;
    const n = Math.hypot(ux, uy) || 1;
    return { x: de.x + (ux / n) * r, y: de.y + (uy / n) * r };
  };
  const inicio = recuar(a, c, raioA + 3);
  const fim = recuar(b, c, raioB + 4);
  const tx = fim.x - c.x;
  const ty = fim.y - c.y;
  const tn = Math.hypot(tx, ty) || 1;
  const ux = tx / tn;
  const uy = ty / tn;
  const s = tamanhoPonta;
  const base = { x: fim.x - ux * s, y: fim.y - uy * s };
  const ponta = `M${fim.x},${fim.y} L${base.x - uy * s * 0.55},${base.y + ux * s * 0.55} L${base.x + uy * s * 0.55},${base.y - ux * s * 0.55} Z`;
  const linhaFim = { x: fim.x - ux * s * 0.7, y: fim.y - uy * s * 0.7 };
  const meio = {
    x: 0.25 * inicio.x + 0.5 * c.x + 0.25 * fim.x,
    y: 0.25 * inicio.y + 0.5 * c.y + 0.25 * fim.y,
  };
  return {
    d: `M${inicio.x},${inicio.y} Q${c.x},${c.y} ${linhaFim.x},${linhaFim.y}`,
    ponta,
    meio,
  };
}

/** Arco logo fora da Presidência, para o nome da lente ficar de pé. */
function arcoDaLente(angulo: number) {
  const embaixo = Math.sin(angulo) > 0;
  const r = MEDIDAS.raioPresidencia + (embaixo ? 21 : 9);
  const abertura = 0.55;
  const a0 = embaixo ? angulo + abertura : angulo - abertura;
  const a1 = embaixo ? angulo - abertura : angulo + abertura;
  return `M${Math.cos(a0) * r},${Math.sin(a0) * r} A${r},${r} 0 0 ${embaixo ? 0 : 1} ${Math.cos(a1) * r},${Math.sin(a1) * r}`;
}

// ---------------------------------------------------------------------------
// Nós
// ---------------------------------------------------------------------------

function Rotulo({
  linhas,
  y,
  tamanho,
  classe,
}: {
  linhas: readonly string[];
  y: number;
  tamanho: number;
  classe: string;
}) {
  return (
    <text className={classe} y={y} fontSize={tamanho} textAnchor="middle">
      {linhas.map((linha, i) => (
        <tspan key={i} x={0} dy={i === 0 ? 0 : tamanho * 1.15}>
          {linha}
        </tspan>
      ))}
    </text>
  );
}

type EstadoNo = "normal" | "foco" | "vizinho" | "apagado";

function aoTeclar(acao: () => void) {
  return (evento: KeyboardEventReact) => {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      acao();
    }
  };
}

/** Anel de nível: trilha + parte cheia, animável pelo `stroke-dasharray`. */
function Anel({
  r,
  fracao,
  cor,
  largura,
  classe,
}: {
  r: number;
  fracao: number;
  cor: string;
  largura: number;
  classe: string;
}) {
  const f = Math.min(1, Math.max(0, fracao));
  return (
    <g className={classe} transform="rotate(-90)">
      <circle className="trilha" r={r} strokeWidth={largura} />
      {f > 0.005 ? (
        <circle
          className="cheio"
          r={r}
          pathLength={100}
          stroke={cor}
          strokeWidth={largura}
          strokeDasharray={`${f * 100} 100`}
        />
      ) : null}
    </g>
  );
}

const NoLei = memo(function NoLei({
  lei,
  pos,
  cor,
  coresExtras,
  estado,
  selecionada,
  mostrarRotulo,
  nivel,
  onEntrar,
  onSair,
  onClicar,
}: {
  lei: VisaoLei;
  pos: PosicaoLei;
  cor: string;
  coresExtras: readonly string[];
  estado: EstadoNo;
  selecionada: boolean;
  mostrarRotulo: boolean;
  /** Quanto a lei está ligada (0–1): define o tamanho e o anel. */
  nivel: number;
  onEntrar: (id: string) => void;
  onSair: () => void;
  onClicar: (id: string) => void;
}) {
  const constitucional = ehConstitucional(lei);
  const pendente = Math.abs(lei.meta - lei.nivel) > 1e-6;
  const r = RAIO_BASE_LEI * (pos.r / MEDIDAS.raioLei);
  const escala = escalaDaLei(nivel);
  const raioVisivel = r * escala;
  return (
    <g
      className={`no-lei ${estado}${selecionada ? " selecionada" : ""}${pos.lugar === "revelada" ? " revelada" : ""}`}
      transform={`translate(${pos.x} ${pos.y})`}
      style={{ "--cor": cor } as React.CSSProperties}
      role="button"
      tabIndex={0}
      aria-label={`${lei.nome}${constitucional ? ", lei constitucional" : ""}`}
      aria-pressed={selecionada}
      onPointerEnter={() => onEntrar(lei.id)}
      onPointerLeave={onSair}
      onFocus={() => onEntrar(lei.id)}
      onBlur={onSair}
      onClick={(e) => {
        e.stopPropagation();
        onClicar(lei.id);
      }}
      onKeyDown={aoTeclar(() => onClicar(lei.id))}
      data-id={lei.id}
    >
      <circle className="alvo-toque" r={r * 1.35 + 10} />
      <g className="corpo">
        <g className="inflavel" style={{ transform: `scale(${escala})` }}>
          <circle className="halo" r={r + 9} />
          <circle className="disco" r={r} />
          <Anel
            r={r + 4.5}
            fracao={nivel}
            cor={cor}
            largura={3.5}
            classe="anel-nivel"
          />
          <IconeSvg
            nome={ICONE_LEI[lei.id] ?? ICONE_INTERFACE.lei}
            tamanho={r * 1.08}
            cor="var(--icone)"
          />
        </g>
        {constitucional ? (
          <g
            transform={`translate(${raioVisivel * 0.74 + 2} ${-raioVisivel * 0.74 - 2})`}
            className="selo-constituicao"
          >
            <circle r={8.5} />
            <text y={3.2} fontSize={10.5} textAnchor="middle">
              §
            </text>
          </g>
        ) : null}
        {coresExtras.map((extra, i) => (
          <circle
            key={extra}
            cx={-raioVisivel * 0.78 + i * 9}
            cy={-raioVisivel * 0.78}
            r={5}
            fill={extra}
            stroke="#fff"
            strokeWidth={2}
          />
        ))}
        {pendente ? (
          <g
            transform={`translate(${raioVisivel * 0.74 + 2} ${raioVisivel * 0.74 + 2})`}
            className="selo-pendente"
          >
            <circle r={8.5} />
            <IconeSvg
              nome={ICONE_INTERFACE.relogio}
              tamanho={11.5}
              cor="#fff"
            />
          </g>
        ) : null}
      </g>
      {mostrarRotulo ? (
        <Rotulo
          linhas={quebrarNome(lei.nome, 14, 2)}
          y={raioVisivel + 19}
          tamanho={pos.rotulo}
          classe="rotulo-lei"
        />
      ) : null}
    </g>
  );
});

const NoBolha = memo(function NoBolha({
  bolha,
  x,
  y,
  intensidade,
  variacao,
  estado,
  selecionada,
  mostrarRotulo,
  mostrarValor,
  marca,
  pulsa,
  etiqueta,
  escalaTela,
  onEntrar,
  onSair,
  onClicar,
}: {
  bolha: VisaoBolha;
  x: number;
  y: number;
  intensidade: IntensidadeBolha;
  /** Quanto mudou no último turno (na unidade da bolha). */
  variacao?: number;
  estado: EstadoNo;
  selecionada: boolean;
  mostrarRotulo: boolean;
  mostrarValor: boolean;
  marca?: MarcaPrevista;
  pulsa: boolean;
  /** Mostrar a etiqueta com a variação do turno. */
  etiqueta: boolean;
  /** Escala da câmera, para a etiqueta ter tamanho fixo na tela. */
  escalaTela: number;
  onEntrar: (id: string) => void;
  onSair: () => void;
  onClicar: (id: string) => void;
}) {
  const r = RAIO_BASE_BOLHA;
  const { escala, bondade, ativa, grave } = intensidade;
  const raioVisivel = r * escala + 6;
  const linhas = quebrarNome(bolha.nome, 15, 2);
  const cor = corDaBondade(bondade);
  const situacao = bolha.tipo === "situacao";
  const mudou = variacao !== undefined && Math.abs(variacao) >= 0.05;
  const corVariacao =
    mudou && bolha.avaliacao !== "neutra"
      ? COR_EFEITO[efeitoDe(Math.sign(variacao!), bolha.avaliacao)]
      : COR_EFEITO.neutro;
  return (
    <g
      className={`no-bolha ${estado} tipo-${bolha.tipo}${selecionada ? " selecionada" : ""}${pulsa ? ` pulsa ${corVariacao === COR_EFEITO.melhora ? "pulsa-melhora" : corVariacao === COR_EFEITO.piora ? "pulsa-piora" : ""}` : ""}${situacao ? (ativa ? " ativa" : " inativa") : ""}${grave ? " grave" : ""}`}
      transform={`translate(${x} ${y})`}
      style={{ "--bondade": cor } as React.CSSProperties}
      role="button"
      tabIndex={0}
      aria-label={`${bolha.nome}: ${valorDaBolha(bolha.valor, bolha.unidade)}${situacao && !ativa ? " (ainda não surgiu)" : ""}`}
      aria-pressed={selecionada}
      onPointerEnter={() => onEntrar(bolha.id)}
      onPointerLeave={onSair}
      onFocus={() => onEntrar(bolha.id)}
      onBlur={onSair}
      onClick={(e) => {
        e.stopPropagation();
        onClicar(bolha.id);
      }}
      onKeyDown={aoTeclar(() => onClicar(bolha.id))}
      data-id={bolha.id}
    >
      <circle className="alvo-toque" r={raioVisivel + 8} />
      <g className="corpo">
        {pulsa ? <circle className="onda" r={raioVisivel - 4} /> : null}
        {grave ? <circle className="alarme" r={raioVisivel - 4} /> : null}
        <g className="inflavel" style={{ transform: `scale(${escala})` }}>
          <circle className="halo" r={r + 10} />
          <circle className="disco" r={r} />
          {bolha.tipo === "estoque" ? (
            <circle className="anel-estoque" r={r - 5} />
          ) : null}
          {pulsa ? <circle className="flash" r={r + 7} /> : null}
          {!situacao || ativa ? (
            <Anel
              r={r + 5}
              fracao={intensidade.t}
              cor={cor}
              largura={5}
              classe="anel-valor"
            />
          ) : null}
          <IconeSvg
            nome={ICONE_BOLHA[bolha.id] ?? "chart-line"}
            tamanho={r * 1.05}
            cor="var(--icone)"
          />
        </g>
        {marca ? (
          <g
            transform={`translate(${raioVisivel * 0.72} ${-raioVisivel * 0.72})`}
            className="marca-prevista"
          >
            <circle r={12} fill={COR_EFEITO[marca.efeito]} />
            <IconeSvg
              nome={marca.sobe ? ICONE_INTERFACE.subir : ICONE_INTERFACE.descer}
              tamanho={16}
              cor="#fff"
            />
          </g>
        ) : null}
      </g>
      {mostrarRotulo ? (
        <>
          <Rotulo
            linhas={linhas}
            y={raioVisivel + 16}
            tamanho={16}
            classe="rotulo-bolha"
          />
          {mostrarValor ? (
            <text
              className="valor-bolha"
              y={raioVisivel + 16 + linhas.length * 18.4}
              fontSize={14}
              textAnchor="middle"
            >
              {valorDaBolha(bolha.valor, bolha.unidade)}
              {mudou ? (
                <tspan fill={corVariacao} dx={6}>
                  {variacao! > 0 ? "▲" : "▼"}{" "}
                  {diferenca(variacao!, bolha.unidade)}
                </tspan>
              ) : null}
            </text>
          ) : null}
        </>
      ) : null}
      {etiqueta && variacao !== undefined ? (
        <EtiquetaVariacao
          texto={`${variacao > 0 ? "▲" : "▼"} ${diferenca(variacao, bolha.unidade)}`}
          cor={corVariacao}
          y={-raioVisivel - 2}
          escala={Math.min(2.8, Math.max(0.75, 0.95 / escalaTela))}
        />
      ) : null}
    </g>
  );
});

/** Etiqueta verde/vermelha com quanto a bolha mudou no turno. */
function EtiquetaVariacao({
  texto,
  cor,
  y,
  escala,
}: {
  texto: string;
  cor: string;
  y: number;
  escala: number;
}) {
  const largura = texto.length * 7.4 + 16;
  return (
    <g
      className="etiqueta-turno"
      transform={`translate(0 ${y}) scale(${escala})`}
      pointerEvents="none"
    >
      <g className="etiqueta-turno-corpo">
        <rect
          x={-largura / 2}
          y={-25}
          width={largura}
          height={22}
          rx={11}
          fill={cor}
        />
        <path d="M-5,-3.5 L0,2 L5,-3.5 Z" fill={cor} />
        <text y={-9.5} fontSize={12.5} textAnchor="middle">
          {texto}
        </text>
      </g>
    </g>
  );
}

// ---------------------------------------------------------------------------
// Mapa
// ---------------------------------------------------------------------------

export function MapaPolitico({
  visao,
  base,
  indice,
  fundo,
  aberta,
  onAbrir,
  selecionado,
  onSelecionar,
  marcas,
  pulsos,
  variacoes,
  mostrarVariacoes,
  onAlternarVariacoes,
  painel,
  cobertura,
}: Props) {
  const caixa = useRef<HTMLDivElement>(null);
  const mundo = useRef<SVGGElement>(null);
  const camera = useRef<Camera>({ x: 0, y: 0, k: 0.4 });
  const tela = useRef<Tela>({ largura: 1200, altura: 800 });
  const animacaoCamera = useRef(0);
  const arraste = useRef<{
    x: number;
    y: number;
    cx: number;
    cy: number;
    moveu: boolean;
    id: number;
  } | null>(null);
  const [escala, setEscala] = useState(0.4);
  const [pronto, setPronto] = useState(false);
  const [sobre, setSobre] = useState<string | null>(null);
  const [esferaSobre, setEsferaSobre] = useState<string | null>(null);
  const [explorou, setExplorou] = useState(false);

  const ehLei = useCallback((id: string) => base.leis.has(id), [base]);
  const foco = sobre ?? selecionado;
  const viz = useMemo(
    () => vizinhanca(indice, foco, ehLei),
    [indice, foco, ehLei],
  );

  // Leis a revelar nas esferas fechadas: a selecionada e as tocadas pelo foco.
  const chaveRevelar = useMemo(() => {
    const ids = new Set(viz.leis);
    if (selecionado && base.leis.has(selecionado)) ids.add(selecionado);
    return [...ids].sort().join("|");
  }, [viz, selecionado, base]);
  const alvo = useMemo(
    () =>
      montarLayout(
        base,
        aberta,
        new Set(chaveRevelar ? chaveRevelar.split("|") : []),
      ),
    [base, aberta, chaveRevelar],
  );
  const layout = useLayoutAnimado(alvo);

  const leisPorId = useMemo(
    () => new Map(visao.leis.map((lei) => [lei.id, lei])),
    [visao],
  );
  // Referência fixa (do início da partida) para comparar leis de dinheiro e
  // impostos: o tamanho de uma lei não muda porque outra mudou.
  const referencia = useMemo(
    () => referenciaDasLeis([...base.leis.values()]),
    [base],
  );
  const intensidades = useMemo(
    () => new Map(visao.bolhas.map((b) => [b.id, intensidadeDaBolha(b)])),
    [visao],
  );

  // --- câmera -------------------------------------------------------------

  const painelAtual = useRef(painel);
  painelAtual.current = painel;
  const aplicar = useCallback(
    (proxima: Camera) => {
      const c = limitar(
        proxima,
        base.limites,
        tela.current,
        painelAtual.current,
      );
      camera.current = c;
      if (mundo.current)
        mundo.current.style.transform = paraTela(c, tela.current);
      setEscala((anterior) =>
        Math.abs(anterior - c.k) / anterior > 0.05 ? c.k : anterior,
      );
    },
    [base],
  );

  const animarPara = useCallback(
    (destino: Camera, duracao = 520) => {
      cancelAnimationFrame(animacaoCamera.current);
      const de = camera.current;
      const fim = limitar(
        destino,
        base.limites,
        tela.current,
        painelAtual.current,
      );
      const inicio = performance.now();
      const passo = (agora: number) => {
        const t = Math.min(1, (agora - inicio) / duracao);
        const e = suave(t);
        // zoom em escala logarítmica para não "pular"
        const k = Math.exp(mix(Math.log(de.k), Math.log(fim.k), e));
        aplicar({ x: mix(de.x, fim.x, e), y: mix(de.y, fim.y, e), k });
        if (t < 1) animacaoCamera.current = requestAnimationFrame(passo);
      };
      animacaoCamera.current = requestAnimationFrame(passo);
    },
    [aplicar, base],
  );

  const irParaVisaoGeral = useCallback(() => {
    animarPara(visaoGeral(base.limites, tela.current));
  }, [animarPara, base]);

  useLayoutEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const medir = () => {
      const r = el.getBoundingClientRect();
      const primeira = !pronto;
      tela.current = { largura: r.width, altura: r.height };
      if (primeira) {
        aplicar(visaoGeral(base.limites, tela.current));
        setPronto(true);
      } else aplicar(camera.current);
    };
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    return () => observador.disconnect();
  }, [aplicar, base, pronto]);

  // Abrir ou fechar uma área move a câmera até ela.
  const abertaAnterior = useRef<string | null>(null);
  useEffect(() => {
    if (!pronto || abertaAnterior.current === aberta) return;
    abertaAnterior.current = aberta;
    if (aberta === null) {
      irParaVisaoGeral();
      return;
    }
    const alvoCirculo =
      aberta === PRESIDENCIA
        ? { x: 0, y: 0, r: MEDIDAS.raioPresidencia + 30 }
        : alvo.esferas.get(aberta);
    if (!alvoCirculo) return;
    const r = alvoCirculo.r + (aberta === PRESIDENCIA ? 0 : 30);
    const destino = focarCirculo(
      alvoCirculo.x,
      alvoCirculo.y,
      r,
      tela.current,
      painel,
    );
    // perto o bastante para ler as leis, longe o bastante para ver as vizinhas
    animarPara({ ...destino, k: Math.min(destino.k, 0.86) });
  }, [aberta, alvo, animarPara, irParaVisaoGeral, painel, pronto]);

  // O painel lateral empurra o centro da câmera para a área livre. Uma
  // seleção escondida pela janela (ou fora da tela) desliza para o lado
  // livre da janela.
  const painelAnterior = useRef(painel);
  const coberturaAtual = useRef(cobertura);
  coberturaAtual.current = cobertura;
  useEffect(() => {
    if (!pronto) return;
    const atual = camera.current;
    let c = atual;
    if (painelAnterior.current !== painel) {
      c = { ...c, x: c.x + (painel - painelAnterior.current) / 2 / c.k };
      painelAnterior.current = painel;
    }
    const p = selecionado
      ? (alvo.leis.get(selecionado) ?? base.bolhas.get(selecionado))
      : undefined;
    if (p) {
      const t = tela.current;
      const sx = t.largura / 2 + (p.x - c.x) * c.k;
      const sy = t.altura / 2 + (p.y - c.y) * c.k;
      const livre = t.largura - painel;
      const j = coberturaAtual.current;
      const margem = 40;
      const escondido =
        j !== null &&
        sx > j.left - margem &&
        sx < j.right + margem &&
        sy > j.top - margem &&
        sy < j.bottom + margem;
      const fora = sx < 60 || sx > livre - 60 || sy < 60 || sy > t.altura - 60;
      if (escondido || fora) {
        let alvoX = livre / 2;
        if (j) {
          const esquerda = j.left;
          const direita = t.largura - j.right;
          alvoX = esquerda >= direita ? esquerda / 2 : j.right + direita / 2;
        }
        const alvoY = sy > 60 && sy < t.altura - 60 ? sy : t.altura / 2;
        c = {
          k: c.k,
          x: p.x - (alvoX - t.largura / 2) / c.k,
          y: p.y - (alvoY - t.altura / 2) / c.k,
        };
      }
    }
    if (c !== atual) animarPara(c, 420);
    // só quando a seleção, o painel ou a janela mudam
  }, [selecionado, painel, pronto, cobertura !== null]);

  // Esc fecha a seleção e depois a área aberta.
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (selecionado) onSelecionar(null);
      else if (aberta) onAbrir(null);
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [aberta, onAbrir, onSelecionar, selecionado]);

  // --- arrastar e zoom ------------------------------------------------------

  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const roda = (e: WheelEvent) => {
      e.preventDefault();
      setExplorou(true);
      cancelAnimationFrame(animacaoCamera.current);
      const r = el.getBoundingClientRect();
      const fator = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0016));
      aplicar(
        zoomNoPonto(
          camera.current,
          fator,
          e.clientX - r.left,
          e.clientY - r.top,
          tela.current,
        ),
      );
    };
    el.addEventListener("wheel", roda, { passive: false });
    return () => el.removeEventListener("wheel", roda);
  }, [aplicar]);

  const aoApertar = (e: PointerEventReact<HTMLDivElement>) => {
    if (e.button !== 0) return;
    cancelAnimationFrame(animacaoCamera.current);
    arraste.current = {
      x: e.clientX,
      y: e.clientY,
      cx: camera.current.x,
      cy: camera.current.y,
      moveu: false,
      id: e.pointerId,
    };
  };
  const aoMover = (e: PointerEventReact<HTMLDivElement>) => {
    const a = arraste.current;
    if (!a || a.id !== e.pointerId) return;
    const dx = e.clientX - a.x;
    const dy = e.clientY - a.y;
    if (!a.moveu && Math.hypot(dx, dy) < 5) return;
    if (!a.moveu) {
      a.moveu = true;
      setExplorou(true);
      caixa.current?.setPointerCapture(e.pointerId);
      caixa.current?.classList.add("arrastando");
    }
    const k = camera.current.k;
    aplicar({ k, x: a.cx - dx / k, y: a.cy - dy / k });
  };
  const aoSoltar = (e: PointerEventReact<HTMLDivElement>) => {
    const a = arraste.current;
    if (a && a.moveu) {
      caixa.current?.releasePointerCapture(e.pointerId);
      caixa.current?.classList.remove("arrastando");
      // engole o clique que viria depois do arraste
      const engolir = (ev: MouseEvent) => {
        ev.stopPropagation();
        window.removeEventListener("click", engolir, true);
      };
      window.addEventListener("click", engolir, true);
      setTimeout(() => window.removeEventListener("click", engolir, true), 0);
    }
    arraste.current = null;
  };

  const zoomBotao = (fator: number) => {
    const c = camera.current;
    animarPara({ ...c, k: c.k * fator }, 260);
  };

  // --- interação com nós -----------------------------------------------------

  const entrar = useCallback((id: string) => setSobre(id), []);
  const sair = useCallback(() => setSobre(null), []);
  const clicarNo = useCallback(
    (id: string) => onSelecionar(id === selecionado ? null : id),
    [onSelecionar, selecionado],
  );
  const abrirEsfera = (id: string) => {
    setExplorou(true);
    if (aberta !== id) onAbrir(id);
  };

  // --- desenho --------------------------------------------------------------

  const k = escala;
  const comFoco = Boolean(foco);
  const corDaEsfera = (nome: string) =>
    nome === PRESIDENCIA
      ? COR_PRESIDENCIA
      : (base.porNome.get(nome)?.cor ?? "#777");
  const posicao = (id: string): (Ponto & { r: number }) | null => {
    const lei = layout.leis.get(id);
    if (lei) {
      const visao = leisPorId.get(id);
      const escala = visao ? escalaDaLei(nivelRelativo(visao, referencia)) : 1;
      return { ...lei, r: lei.r * escala * 1.2 };
    }
    const bolha = base.bolhas.get(id);
    if (bolha) {
      const i = intensidades.get(id);
      return { ...bolha, r: RAIO_BASE_BOLHA * (i?.escala ?? 1) + 6 };
    }
    const dono = base.leis.get(id)?.ministerios[0];
    const esfera = dono ? layout.esferas.get(dono) : undefined;
    return esfera ? { x: esfera.x, y: esfera.y, r: 40 } : null;
  };
  const estadoDe = (id: string): EstadoNo =>
    !comFoco
      ? "normal"
      : id === foco
        ? "foco"
        : viz.nos.has(id)
          ? "vizinho"
          : "apagado";

  const ministerioDoFoco = foco ? (base.leis.get(foco)?.ministerios ?? []) : [];
  const esferaRelacionada = (nome: string) =>
    !comFoco ||
    ministerioDoFoco.includes(nome) ||
    [...viz.leis].some((id) => base.leis.get(id)?.ministerios.includes(nome));

  const pontaFundo = Math.min(18, Math.max(9, 7 / k));
  const pontaFoco = Math.min(24, Math.max(12, 10 / k));

  const setasDeFundo: ReactNode[] = [];
  if (!comFoco) {
    for (const ligacao of fundo) {
      const esfera = layout.esferas.get(ligacao.ministerio);
      const bolha = base.bolhas.get(ligacao.bolha);
      if (!esfera || !bolha) continue;
      if (
        aberta &&
        aberta !== PRESIDENCIA &&
        ligacao.ministerio !== aberta &&
        esferaSobre !== ligacao.ministerio
      )
        continue;
      const geo = curva(esfera, bolha, esfera.r, bolha.r, pontaFundo, 0.07);
      if (!geo) continue;
      const destaque =
        esferaSobre === ligacao.ministerio || aberta === ligacao.ministerio;
      setasDeFundo.push(
        <g
          key={`${ligacao.ministerio}>${ligacao.bolha}`}
          className={`seta-fundo${destaque ? " destaque" : ""}`}
          style={
            {
              "--cor": esfera ? corDaEsfera(ligacao.ministerio) : "#999",
            } as React.CSSProperties
          }
        >
          <path d={geo.d} />
          <path d={geo.ponta} className="ponta" />
        </g>,
      );
    }
  }

  const setasDeFoco: ReactNode[] = [];
  const atrasos: ReactNode[] = [];
  for (const relacao of viz.relacoes as readonly Relacao[]) {
    const a = posicao(relacao.de);
    const b = posicao(relacao.para);
    if (!a || !b) continue;
    const geo = curva(a, b, a.r, b.r, pontaFoco, 0.14);
    if (!geo) continue;
    const cor = relacao.eficacia ? "#7d68b8" : COR_EFEITO[relacao.efeito];
    setasDeFoco.push(
      <g
        key={relacao.id}
        className={`seta-foco${relacao.atrasoMeses > 0 ? " atrasada" : ""}${relacao.eficacia ? " eficacia" : ""}`}
        style={{ "--cor": cor } as React.CSSProperties}
      >
        <path d={geo.d} />
        <path d={geo.ponta} className="ponta" />
      </g>,
    );
    if (relacao.atrasoMeses > 0 && viz.relacoes.length <= 24) {
      const texto =
        relacao.atrasoMeses >= 12 && relacao.atrasoMeses % 12 === 0
          ? `${relacao.atrasoMeses / 12} a`
          : `${relacao.atrasoMeses} m`;
      const s = Math.min(1.6, Math.max(0.8, 0.75 / k));
      atrasos.push(
        <g
          key={`atraso-${relacao.id}`}
          className="selo-atraso"
          transform={`translate(${geo.meio.x} ${geo.meio.y}) scale(${s})`}
        >
          <rect x={-27} y={-11} width={54} height={22} rx={11} />
          <IconeSvg
            nome={ICONE_INTERFACE.relogio}
            x={-14}
            y={0}
            tamanho={13}
            cor="currentColor"
          />
          <text x={6} y={4.5} fontSize={12.5} textAnchor="middle">
            {texto}
          </text>
        </g>,
      );
    }
  }

  const esferasOrdenadas = [...base.ministerios].sort(
    (a, b) => Number(a.nome === aberta) - Number(b.nome === aberta),
  );
  const esferaAberta =
    aberta && aberta !== PRESIDENCIA ? layout.esferas.get(aberta) : undefined;

  const p = layout.presidencia;
  const totalConstitucionais = base.constitucionais.length;
  const presidenciaApagada =
    comFoco && ![...viz.leis].some((id) => base.constitucionais.includes(id));

  return (
    <div
      ref={caixa}
      className={`mapa${pronto ? " pronto" : ""}${comFoco ? " com-foco" : ""}`}
      onPointerDown={aoApertar}
      onPointerMove={aoMover}
      onPointerUp={aoSoltar}
      onPointerCancel={aoSoltar}
      onClick={() => {
        if (selecionado) onSelecionar(null);
      }}
    >
      <svg
        className="mapa-svg"
        role="application"
        aria-label="Mapa político do governo"
      >
        <defs>
          <pattern
            id="grade"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="24" cy="24" r="1.6" fill="#d9d2c0" />
          </pattern>
          <radialGradient id="fundo-presidencia" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="0.55" stopColor="#eef5ee" stopOpacity="0.8" />
            <stop offset="1" stopColor="#d5e8da" stopOpacity="0.85" />
          </radialGradient>
          <clipPath id="corte-presidencia">
            <circle cx={p.x} cy={p.y} r={p.r} />
          </clipPath>
          <filter id="sombra" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="9"
              floodColor="#2b2a20"
              floodOpacity="0.16"
            />
          </filter>
        </defs>
        <g ref={mundo} className="mundo">
          <rect
            x={base.limites.minX}
            y={base.limites.minY}
            width={base.limites.maxX - base.limites.minX}
            height={base.limites.maxY - base.limites.minY}
            fill="url(#grade)"
            className="limite-mundo"
            rx={60}
          />

          {/* Presidência */}
          <g
            className={`area-presidencia${p.aberta ? " aberta" : ""}${presidenciaApagada ? " apagada" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelecionar(null);
              onAbrir(p.aberta ? null : PRESIDENCIA);
            }}
            role="button"
            tabIndex={0}
            aria-label={`Presidência e Constituição, ${totalConstitucionais} leis constitucionais. ${p.aberta ? "Fechar área" : "Abrir área"}`}
            onKeyDown={aoTeclar(() => onAbrir(p.aberta ? null : PRESIDENCIA))}
          >
            <circle cx={p.x} cy={p.y} r={p.r} className="disco-presidencia" />
            <circle
              cx={p.x}
              cy={p.y}
              r={p.r - 16}
              className="anel-presidencia"
            />
          </g>

          {/* Esferas ministeriais */}
          {esferasOrdenadas.map((ministerio) => {
            const e = layout.esferas.get(ministerio.nome)!;
            const relacionada = esferaRelacionada(ministerio.nome);
            return (
              <g
                key={ministerio.nome}
                className={`esfera${e.aberta ? " aberta" : ""}${relacionada ? "" : " apagada"}${esferaSobre === ministerio.nome ? " sobre" : ""}`}
                style={{ "--cor": ministerio.cor } as React.CSSProperties}
                onPointerEnter={() => setEsferaSobre(ministerio.nome)}
                onPointerLeave={() => setEsferaSobre(null)}
                onClick={(ev) => {
                  ev.stopPropagation();
                  if (selecionado) onSelecionar(null);
                  abrirEsfera(ministerio.nome);
                }}
              >
                <circle
                  cx={e.x}
                  cy={e.y}
                  r={e.r}
                  className="disco-esfera"
                  filter="url(#sombra)"
                />
              </g>
            );
          })}

          {/* Lente: a parte da esfera aberta que também é da Presidência */}
          {esferaAberta ? (
            <g className="lente" pointerEvents="none">
              <circle
                cx={esferaAberta.x}
                cy={esferaAberta.y}
                r={esferaAberta.r}
                clipPath="url(#corte-presidencia)"
                style={{ "--cor": corDaEsfera(aberta!) } as React.CSSProperties}
              />
              <path
                id="arco-lente"
                d={arcoDaLente(esferaAberta.angulo)}
                fill="none"
              />
              <text className="rotulo-lente">
                <textPath
                  href="#arco-lente"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  § LEIS CONSTITUCIONAIS · TAMBÉM DA PRESIDÊNCIA
                </textPath>
              </text>
            </g>
          ) : null}

          {/* Ligações de fundo */}
          <g className="camada-setas-fundo">{setasDeFundo}</g>

          {/* Conteúdo das esferas: retrato, nome, contagem */}
          {esferasOrdenadas.map((ministerio) => {
            const e = layout.esferas.get(ministerio.nome)!;
            const relacionada = esferaRelacionada(ministerio.nome);
            const revelando = [...layout.leis.values()].some(
              (l) => l.esfera === ministerio.nome && l.lugar === "revelada",
            );
            const bloco = blocoCentral(e, ministerio.titulo);
            const constit = ministerio.leis.filter((id) =>
              base.constitucionais.includes(id),
            ).length;
            const excedente = layout.excedentes.get(ministerio.nome);
            const rr = bloco.retrato.r;
            return (
              <g
                key={`conteudo-${ministerio.nome}`}
                className={`conteudo-esfera${e.aberta ? " aberta" : ""}${relacionada ? "" : " apagada"}${revelando ? " revelando" : ""}`}
                style={{ "--cor": ministerio.cor } as React.CSSProperties}
                onPointerEnter={() => setEsferaSobre(ministerio.nome)}
                onPointerLeave={() => setEsferaSobre(null)}
                onClick={(ev) => {
                  ev.stopPropagation();
                  if (selecionado) onSelecionar(null);
                  abrirEsfera(ministerio.nome);
                }}
                role="button"
                tabIndex={0}
                aria-label={`${ministerio.nome}, ${ministerio.leis.length} leis. ${e.aberta ? "Área aberta" : "Abrir área"}`}
                aria-expanded={e.aberta}
                onKeyDown={aoTeclar(() => abrirEsfera(ministerio.nome))}
              >
                <Retrato
                  pessoa={pessoaDoCargo(ministerio.nome, ministerio.indice)}
                  cor={ministerio.cor}
                  r={rr}
                  x={bloco.retrato.x}
                  y={bloco.retrato.y}
                />
                <g
                  transform={`translate(${bloco.retrato.x + rr * 0.7} ${bloco.retrato.y + rr * 0.7})`}
                  className="selo-ministerio"
                >
                  <circle r={rr * 0.24} />
                  <IconeSvg
                    nome={ICONE_INTERFACE[ministerio.nome] ?? "bank"}
                    tamanho={rr * 0.28}
                    cor="#fff"
                  />
                </g>
                <text
                  className="titulo-esfera"
                  y={bloco.titulo.y}
                  fontSize={bloco.titulo.tamanho}
                  textAnchor="middle"
                >
                  {bloco.titulo.linhas.map((linha, i) => (
                    <tspan
                      key={i}
                      x={bloco.titulo.x}
                      dy={i === 0 ? 0 : bloco.titulo.entrelinha}
                    >
                      {linha}
                    </tspan>
                  ))}
                </text>
                {!e.aberta || !revelando ? (
                  <text
                    className="contagem-esfera"
                    x={bloco.contagem.x}
                    y={bloco.contagem.y}
                    fontSize={bloco.contagem.tamanho}
                    textAnchor="middle"
                  >
                    {ministerio.leis.length} leis
                    {constit && e.aberta
                      ? ` · ${constit} constituciona${constit > 1 ? "is" : "l"}`
                      : ""}
                  </text>
                ) : null}
                {excedente ? (
                  <g
                    transform={`translate(${e.x + Math.cos(e.angulo) * (e.r + 30)} ${e.y + Math.sin(e.angulo) * (e.r + 30)})`}
                    className="selo-excedente"
                  >
                    <rect x={-26} y={-12} width={52} height={24} rx={12} />
                    <text y={5} fontSize={14} textAnchor="middle">
                      +{excedente}
                    </text>
                  </g>
                ) : null}
                {e.aberta ? (
                  <g
                    className="fechar-esfera"
                    transform={`translate(${e.x + Math.cos(-Math.PI / 4) * e.r} ${e.y + Math.sin(-Math.PI / 4) * e.r})`}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      onSelecionar(null);
                      onAbrir(null);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Fechar ${ministerio.nome}`}
                    onKeyDown={aoTeclar(() => onAbrir(null))}
                  >
                    <circle r={20} />
                    <IconeSvg
                      nome={ICONE_INTERFACE.fechar}
                      tamanho={22}
                      cor="currentColor"
                    />
                  </g>
                ) : null}
              </g>
            );
          })}

          {/* Centro: Presidente e Constituição */}
          <g
            className={`centro-presidencia${presidenciaApagada ? " apagada" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelecionar(null);
              onAbrir(p.aberta ? null : PRESIDENCIA);
            }}
          >
            {aberta ? (
              <>
                <circle cy={-62} r={78} className="aro-presidente" />
                <Retrato
                  pessoa={PRESIDENTE}
                  cor={COR_PRESIDENCIA}
                  r={70}
                  y={-62}
                />
                <g transform="translate(0 40)" className="placa-presidente">
                  <rect x={-112} y={-22} width={224} height={44} rx={22} />
                  <text y={9} fontSize={24} textAnchor="middle">
                    PRESIDENTE
                  </text>
                </g>
                <g
                  transform={`translate(0 ${BLOCO_PRESIDENCIA_ABERTA.maxY - 12})`}
                >
                  <rect
                    className="pilula-constituicao"
                    x={-118}
                    y={-20}
                    width={236}
                    height={28}
                    rx={14}
                  />
                  <IconeSvg
                    nome={ICONE_INTERFACE.constituicao}
                    tamanho={22}
                    cor={COR_PRESIDENCIA}
                    x={-98}
                    y={-6}
                  />
                  <text
                    fontSize={17}
                    textAnchor="middle"
                    className="rotulo-constituicao"
                    x={10}
                  >
                    Constituição · {totalConstitucionais} leis
                  </text>
                </g>
              </>
            ) : (
              <>
                <circle
                  cy={-48}
                  r={MEDIDAS.raioRetratoPresidente + 10}
                  className="aro-presidente"
                />
                <Retrato
                  pessoa={PRESIDENTE}
                  cor={COR_PRESIDENCIA}
                  r={MEDIDAS.raioRetratoPresidente}
                  y={-48}
                />
                <g transform="translate(0 76)" className="placa-presidente">
                  <rect x={-118} y={-25} width={236} height={50} rx={25} />
                  <text y={10} fontSize={28} textAnchor="middle">
                    PRESIDENTE
                  </text>
                </g>
                <text
                  y={124}
                  fontSize={16}
                  className="sub-presidencia"
                  textAnchor="middle"
                >
                  PRESIDÊNCIA · CONSTITUIÇÃO
                </text>
                <g transform="translate(0 180)" className="no-constituicao">
                  <circle r={34} />
                  <IconeSvg
                    nome={ICONE_INTERFACE.constituicao}
                    tamanho={34}
                    cor={COR_PRESIDENCIA}
                    y={-2}
                  />
                  <text
                    y={60}
                    fontSize={22}
                    textAnchor="middle"
                    className="rotulo-constituicao"
                  >
                    Constituição Federal
                  </text>
                  <text
                    y={86}
                    fontSize={18}
                    textAnchor="middle"
                    className="contagem-constituicao"
                  >
                    {totalConstitucionais} leis constitucionais
                  </text>
                </g>
              </>
            )}
          </g>

          {/* Setas da seleção */}
          <g className="camada-setas-foco">{setasDeFoco}</g>

          {/* Leis visíveis */}
          {[...layout.leis.values()].map((pos) => {
            const lei = leisPorId.get(pos.id);
            if (!lei) return null;
            const cor = corDaEsfera(lei.ministerios[0]);
            const extras = [...lei.ministerios.slice(1).map(corDaEsfera)];
            const estado = estadoDe(pos.id);
            const mostrarRotulo =
              pos.lugar !== "revelada" ||
              pos.id === foco ||
              pos.id === selecionado;
            return (
              <NoLei
                key={pos.id}
                lei={lei}
                pos={pos}
                cor={cor}
                coresExtras={extras}
                estado={estado}
                selecionada={pos.id === selecionado}
                mostrarRotulo={mostrarRotulo}
                nivel={nivelRelativo(lei, referencia)}
                onEntrar={entrar}
                onSair={sair}
                onClicar={clicarNo}
              />
            );
          })}

          {/* Indicadores, situações e estoques */}
          {visao.bolhas.map((bolha) => {
            const pos = base.bolhas.get(bolha.id);
            if (!pos) return null;
            const estado = estadoDe(bolha.id);
            const marca = marcas.get(bolha.id);
            const emFoco = estado === "foco" || estado === "vizinho";
            return (
              <NoBolha
                key={bolha.id}
                bolha={bolha}
                x={pos.x}
                y={pos.y}
                intensidade={intensidades.get(bolha.id)!}
                variacao={variacoes.get(bolha.id)}
                etiqueta={mostrarVariacoes && variacoes.has(bolha.id)}
                escalaTela={k}
                estado={estado}
                selecionada={bolha.id === selecionado}
                mostrarRotulo={
                  k >= 0.6 || emFoco || Boolean(marca) || pulsos.has(bolha.id)
                }
                mostrarValor={k >= 0.85 || estado === "foco"}
                marca={marca}
                pulsa={pulsos.has(bolha.id)}
                onEntrar={entrar}
                onSair={sair}
                onClicar={clicarNo}
              />
            );
          })}

          <g className="camada-atrasos">{atrasos}</g>
        </g>
      </svg>

      <div
        className="controles-mapa"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => zoomBotao(1.3)}
          aria-label="Aproximar"
          disabled={k >= ESCALA_MAXIMA - 0.01}
        >
          <Icone nome={ICONE_INTERFACE.mais} />
        </button>
        <button
          type="button"
          onClick={() => zoomBotao(1 / 1.3)}
          aria-label="Afastar"
        >
          <Icone nome={ICONE_INTERFACE.menos} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelecionar(null);
            if (aberta) onAbrir(null);
            else irParaVisaoGeral();
          }}
          aria-label="Voltar à visão geral"
          title="Visão geral"
        >
          <Icone nome={ICONE_INTERFACE.visao} />
        </button>
      </div>

      {variacoes.size ? (
        <button
          type="button"
          className={`alternar-variacoes${mostrarVariacoes ? " ligado" : ""}`}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onAlternarVariacoes();
          }}
          aria-pressed={mostrarVariacoes}
        >
          <Icone nome={ICONE_INTERFACE.variacoes} tamanho={18} />
          {mostrarVariacoes ? "Ocultar" : "Mostrar"} mudanças do turno
          <b>{variacoes.size}</b>
        </button>
      ) : null}
      {comFoco ? (
        <div className="legenda" aria-hidden="true">
          <span>
            <i style={{ background: COR_EFEITO.melhora }} />
            melhora
          </span>
          <span>
            <i style={{ background: COR_EFEITO.piora }} />
            piora
          </span>
          <span>
            <i style={{ background: COR_EFEITO.neutro }} />
            neutro
          </span>
          <span>
            <i className="tracejado" />
            com atraso
          </span>
          <span>
            <i className="pontilhado" />
            muda a eficácia
          </span>
        </div>
      ) : null}
      {!explorou && aberta === null && !comFoco ? (
        <div className="dica-mapa" aria-hidden="true">
          Clique numa esfera para abrir as leis · arraste para mover · role para
          aproximar
        </div>
      ) : null}
      <span className="sr-only" aria-live="polite">
        {foco ? `${viz.relacoes.length} relações diretas` : ""}
      </span>
    </div>
  );
}
