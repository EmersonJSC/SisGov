/**
 * Mapa orgânico (pedido do autor: bolhas espalhadas, como o Democracy 4).
 * Cada bolha é um objeto físico (ver `organico.ts`); a simulação anda em
 * `useMapaVivo.ts`; os fios e as manchas das áreas são desenhados num canvas por
 * trás (`fundoDoMapa.ts`). Aqui ficam a câmera, o mouse (arrastar o mapa ou uma
 * bolha, passar por cima, clicar), o bilhete e os controles. Classes `org-`.
 *
 * A câmera não passa pelo React: zoom e arrasto escrevem o `viewBox` direto no
 * SVG, senão cada gesto refazia as 600 bolhas.
 */
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
  type WheelEvent,
} from "react";
import type { VisaoPartida } from "../../partida";
import { BolhaDoMapa } from "./BolhaDoMapa";
import {
  ControlesDoMapa,
  Miniatura,
  type ItemDeBusca,
} from "./ControlesDoMapa";
import { desenharFundo } from "./fundoDoMapa";
import { ICONE_BOLHA, ICONE_INTERFACE, ICONE_LEI } from "./icones";
import { iconeIndice, iconeLei } from "./iconesPersonalizados";
import {
  RAIO_DA_POTENCIA,
  RAIO_DA_PRESIDENCIA,
  RAIO_DO_GRUPO,
} from "./organico";
import { COR_PRESIDENCIA } from "./tema";
import { useMapaVivo } from "./useMapaVivo";
import {
  alturaDaVista,
  enquadrarPontos,
  miolo,
  mundoDe,
  viewBoxDe,
  zoomEm,
  type Caixa,
  type Vista,
} from "./vistaDoMapa";
import {
  dinheiroDaLei,
  pesosDaVisao,
  PESO_DO_ESMAECER,
  visaoTemDados,
  VISOES,
  type IdDaVisao,
} from "./visoes";
import "./organico.css";

const FATOR_DO_ZOOM = 1.15;
const LARGURA_MINIMA = 260;
const FOLGA_DO_ALCANCE = 1.6;
const DOBRO_DO_ALCANCE = 2.4;
/** Largura da vista ao ir até uma bolha clicada. */
const LARGURA_NO_FOCO = 1100;
/** Daqui para perto (pixels por unidade do mundo) os nomes aparecem. */
const ESCALA_DOS_NOMES = 0.6;
const LIMIAR_DO_ARRASTO = 5;
const DURACAO_DA_VIAGEM = 520;
/** Depois do último gesto, os ícones voltam após este tempo (ms). */
const ESPERA_DO_DETALHE = 150;
const DURACAO_DO_PULSO = 3200;
const FIM_DA_ESCALA = 100;
const VERDE_MAXIMO = 120;
const LADOS_DO_HEXAGONO = 6;
const TERCO = 3;
const METADE = 0.5;
const TINTA = "#2a2118";
const PAPEL = "#efe4cc";
const LETRA_DO_GRUPO = 20;
const DESLOCAMENTO_DO_BILHETE = 16;
const DPR_MAXIMO = 2;
const VERDE = "#6fcf97";
const VERMELHO = "#eb5757";
const LARGURA_INICIAL = 4000;
const VISTA_VAZIA: Vista = { cx: 0, cy: 0, w: LARGURA_INICIAL };
const SEM_VIZINHOS: ReadonlySet<string> = new Set();

function hexagono(r: number): string {
  const pontos = Array.from({ length: LADOS_DO_HEXAGONO }, (_, i) => {
    const a = (Math.PI / TERCO) * i + Math.PI / LADOS_DO_HEXAGONO;
    return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
  });
  return `M ${pontos.join(" L ")} Z`;
}

function corDaSatisfacao(valor: number): string {
  const verde =
    (Math.max(0, Math.min(FIM_DA_ESCALA, valor)) * VERDE_MAXIMO) /
    FIM_DA_ESCALA;
  return `hsl(${verde} 55% 48%)`;
}

function useCaixa(ref: RefObject<HTMLElement | null>): Caixa {
  const [caixa, setCaixa] = useState<Caixa>({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const olho = new ResizeObserver(([e]) =>
      setCaixa({ w: e.contentRect.width, h: e.contentRect.height }),
    );
    olho.observe(el);
    return () => olho.disconnect();
  }, [ref]);
  return caixa;
}

export function MapaOrganico({
  visao,
  selecionado,
  onSelecionar,
}: {
  visao: VisaoPartida;
  selecionado: string | null;
  onSelecionar: (id: string | null) => void;
}) {
  const [visaoId, setVisaoId] = useState<IdDaVisao>("ligacoes");
  const { preparo, registro, assentada, arrastar, soltar } = useMapaVivo(
    visao,
    visaoId,
  );
  const quadro = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const fundo = useRef<HTMLCanvasElement>(null);
  const bilhete = useRef<HTMLDivElement>(null);
  const retangulo = useRef<SVGRectElement>(null);
  const caixa = useCaixa(quadro);
  const caixaAtual = useRef(caixa);
  caixaAtual.current = caixa;
  const vistaAtual = useRef<Vista>(VISTA_VAZIA);
  const viagem = useRef<number | null>(null);
  const parouDeMexer = useRef<number | null>(null);
  /** Voltas da roda acumuladas e ainda não aplicadas à câmera. */
  const rolagem = useRef<{
    passos: number;
    x: number;
    y: number;
    quadro: number | null;
  }>({ passos: 0, x: 0, y: 0, quadro: null });
  const [comNome, setComNome] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const apertada = useRef<{
    id: string;
    x: number;
    y: number;
    moveu: boolean;
  } | null>(null);
  const movendo = useRef<{ x: number; y: number; moveu: boolean } | null>(null);
  const aoSelecionar = useRef(onSelecionar);
  aoSelecionar.current = onSelecionar;

  const leis = useMemo(
    () => new Map(visao.leis.map((l) => [l.id, l])),
    [visao.leis],
  );
  const indices = useMemo(
    () =>
      new Map(
        visao.bolhas.filter((b) => b.tipo !== "grupo").map((b) => [b.id, b]),
      ),
    [visao.bolhas],
  );
  const pesos = useMemo(() => pesosDaVisao(visao, visaoId), [visao, visaoId]);
  const info = useMemo(
    () =>
      new Map(
        preparo.nos.map((n) => {
          const lei = leis.get(n.id);
          const nome = lei?.nome ?? indices.get(n.id)?.nome ?? n.id;
          const icone = lei
            ? iconeLei(n.id, ICONE_LEI[n.id] ?? ICONE_INTERFACE.lei)
            : iconeIndice(n.id, ICONE_BOLHA[n.id] ?? "chart-line");
          return [n.id, { nome, icone }] as const;
        }),
      ),
    [preparo, leis, indices],
  );
  const itens = useMemo<ItemDeBusca[]>(
    () =>
      preparo.nos.map((n) => ({
        id: n.id,
        nome: info.get(n.id)?.nome ?? n.id,
        tipo: n.tipo,
      })),
    [preparo, info],
  );
  const semDados = useMemo(
    () => VISOES.filter((v) => !visaoTemDados(visao, v.id)).map((v) => v.id),
    [visao],
  );

  // bolhas cujo valor mudou desde a última leitura: pulsam por um instante
  const assinatura = useMemo(
    () =>
      new Map<string, string>([
        ...visao.leis.map((l) => [l.id, `${l.nivel}|${l.meta}`] as const),
        ...visao.bolhas
          .filter((b) => b.tipo !== "grupo")
          .map((b) => [b.id, b.valor.toFixed(1)] as const),
      ]),
    [visao],
  );
  const anterior = useRef<Map<string, string> | null>(null);
  const [mudou, setMudou] = useState<ReadonlySet<string>>(new Set());
  useEffect(() => {
    const antes = anterior.current;
    anterior.current = assinatura;
    if (!antes) return;
    const ids = [...assinatura]
      .filter(([id, v]) => antes.has(id) && antes.get(id) !== v)
      .map(([id]) => id);
    if (!ids.length) return;
    setMudou(new Set(ids));
    const t = setTimeout(() => setMudou(new Set()), DURACAO_DO_PULSO);
    return () => clearTimeout(t);
  }, [assinatura]);

  // ----------------------------------------------------------------- câmera --
  /** Põe a câmera onde se quer: escreve no SVG e na miniatura, sem React. */
  const definirVista = useCallback((v: Vista) => {
    vistaAtual.current = v;
    // em movimento os ícones somem (só o círculo fica): desenhar 600 ícones por quadro pesa
    svg.current?.classList.add("movendo");
    if (parouDeMexer.current !== null) clearTimeout(parouDeMexer.current);
    parouDeMexer.current = window.setTimeout(() => {
      svg.current?.classList.remove("movendo");
      parouDeMexer.current = null;
    }, ESPERA_DO_DETALHE);
    const c = caixaAtual.current;
    if (c.w === 0) return;
    svg.current?.setAttribute("viewBox", viewBoxDe(v, c));
    const r = retangulo.current;
    if (r) {
      const h = alturaDaVista(v, c);
      r.setAttribute("x", String(v.cx - v.w * METADE));
      r.setAttribute("y", String(v.cy - h * METADE));
      r.setAttribute("width", String(v.w));
      r.setAttribute("height", String(h));
    }
    setComNome(c.w / v.w >= ESCALA_DOS_NOMES);
  }, []);

  const cancelarViagem = () => {
    if (viagem.current !== null) cancelAnimationFrame(viagem.current);
    viagem.current = null;
  };

  const irPara = useCallback(
    (alvo: Vista) => {
      cancelarViagem();
      const de = vistaAtual.current;
      const inicio = performance.now();
      const passo = (agora: number) => {
        const k = Math.min(1, (agora - inicio) / DURACAO_DA_VIAGEM);
        const suave = 1 - (1 - k) ** TERCO;
        definirVista({
          cx: de.cx + (alvo.cx - de.cx) * suave,
          cy: de.cy + (alvo.cy - de.cy) * suave,
          w: de.w + (alvo.w - de.w) * suave,
        });
        viagem.current = k < 1 ? requestAnimationFrame(passo) : null;
      };
      viagem.current = requestAnimationFrame(passo);
    },
    [definirVista],
  );

  const enquadrar = useCallback(
    () => irPara(enquadrarPontos(miolo(preparo.nos), caixaAtual.current)),
    [irPara, preparo],
  );

  // primeira imagem: o miolo do mapa à vista; ao mudar o tamanho da janela, reaplica
  const comecou = useRef(false);
  useEffect(() => {
    if (caixa.w === 0) return;
    if (!comecou.current) {
      comecou.current = true;
      vistaAtual.current = enquadrarPontos(miolo(preparo.nos), caixa);
    }
    definirVista(vistaAtual.current);
  }, [caixa, preparo, definirVista]);

  // ------------------------------------------------------------------ fundo --
  const foco = hover ?? selecionado;
  const vizinhos = useMemo(
    () => (foco ? new Set(preparo.vizinhos.get(foco) ?? []) : SEM_VIZINHOS),
    [foco, preparo],
  );
  const estadoDoFoco = useRef({ foco, vizinhos });
  estadoDoFoco.current = { foco, vizinhos };

  useLayoutEffect(() => {
    const cv = fundo.current;
    if (!cv || caixa.w === 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAXIMO);
    cv.width = Math.round(caixa.w * dpr);
    cv.height = Math.round(caixa.h * dpr);
  }, [caixa]);

  useEffect(() => {
    const ctx = fundo.current?.getContext("2d");
    if (!ctx) return;
    const animar = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    let id = 0;
    const passo = (tempo: number) => {
      const c = caixaAtual.current;
      desenharFundo(ctx, {
        nos: preparo.nos,
        fios: preparo.fios,
        areas: preparo.areas,
        vista: vistaAtual.current,
        caixa: c,
        dpr: c.w > 0 ? ctx.canvas.width / c.w : 1,
        foco: estadoDoFoco.current.foco,
        vizinhos: estadoDoFoco.current.vizinhos,
        tempo,
        animar,
      });
      id = requestAnimationFrame(passo);
    };
    id = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(id);
  }, [preparo]);

  // ------------------------------------------------------------------ mouse --
  const mundoDoMouse = (e: { clientX: number; clientY: number }) => {
    const r = svg.current!.getBoundingClientRect();
    return mundoDe(
      vistaAtual.current,
      { w: r.width, h: r.height },
      { x: e.clientX - r.left, y: e.clientY - r.top },
    );
  };

  const irParaBolha = useCallback(
    (id: string) => {
      const n = preparo.nos.find((b) => b.id === id);
      if (!n) return;
      irPara({
        cx: n.x,
        cy: n.y,
        w: Math.min(vistaAtual.current.w, LARGURA_NO_FOCO),
      });
    },
    [irPara, preparo],
  );
  const escolher = useCallback(
    (id: string) => {
      aoSelecionar.current(id);
      irParaBolha(id);
    },
    [irParaBolha],
  );

  const aoApertarBolha = useCallback((id: string, e: PointerEvent) => {
    e.stopPropagation();
    apertada.current = { id, x: e.clientX, y: e.clientY, moveu: false };
    svg.current?.setPointerCapture(e.pointerId);
  }, []);
  // com uma bolha apertada, o foco não pula para as que passam por baixo
  const aoEntrar = useCallback((id: string) => {
    if (!apertada.current) setHover(id);
  }, []);
  const aoSair = useCallback(() => {
    if (!apertada.current) setHover(null);
  }, []);

  const aoApertarFundo = (e: PointerEvent) => {
    movendo.current = { x: e.clientX, y: e.clientY, moveu: false };
    svg.current?.setPointerCapture(e.pointerId);
  };

  const aoMover = (e: PointerEvent) => {
    const dica = bilhete.current;
    const dono = quadro.current;
    if (dica && dono) {
      const r = dono.getBoundingClientRect();
      dica.style.transform = `translate(${e.clientX - r.left + DESLOCAMENTO_DO_BILHETE}px, ${e.clientY - r.top + DESLOCAMENTO_DO_BILHETE}px)`;
    }
    const a = apertada.current;
    if (a) {
      if (
        !a.moveu &&
        Math.hypot(e.clientX - a.x, e.clientY - a.y) > LIMIAR_DO_ARRASTO
      )
        a.moveu = true;
      if (a.moveu) {
        const p = mundoDoMouse(e);
        arrastar(a.id, p.x, p.y);
      }
      return;
    }
    const m = movendo.current;
    if (!m) return;
    cancelarViagem();
    const v = vistaAtual.current;
    const porPixel = v.w / caixaAtual.current.w;
    if (Math.hypot(e.clientX - m.x, e.clientY - m.y) > LIMIAR_DO_ARRASTO)
      m.moveu = true;
    definirVista({
      ...v,
      cx: v.cx - (e.clientX - m.x) * porPixel,
      cy: v.cy - (e.clientY - m.y) * porPixel,
    });
    movendo.current = { ...m, x: e.clientX, y: e.clientY };
  };

  const aoSoltar = () => {
    const a = apertada.current;
    apertada.current = null;
    if (a) {
      if (a.moveu) soltar(a.id);
      else escolher(a.id);
      return;
    }
    const m = movendo.current;
    movendo.current = null;
    if (m && !m.moveu) aoSelecionar.current(null);
  };

  // a roda manda vários eventos por quadro: soma tudo e muda a câmera uma vez só
  const aoRolar = (e: WheelEvent) => {
    cancelarViagem();
    const pendente = rolagem.current;
    pendente.passos += e.deltaY > 0 ? 1 : -1;
    pendente.x = e.clientX;
    pendente.y = e.clientY;
    if (pendente.quadro !== null) return;
    pendente.quadro = requestAnimationFrame(() => {
      const r = svg.current?.getBoundingClientRect();
      if (r)
        definirVista(
          zoomEm(
            vistaAtual.current,
            { w: r.width, h: r.height },
            { x: pendente.x - r.left, y: pendente.y - r.top },
            FATOR_DO_ZOOM ** pendente.passos,
            {
              minimo: LARGURA_MINIMA,
              maximo: preparo.alcance * DOBRO_DO_ALCANCE,
            },
          ),
        );
      pendente.passos = 0;
      pendente.quadro = null;
    });
  };

  // ---------------------------------------------------------------- desenho --
  const noEmFoco = foco ? preparo.nos.find((n) => n.id === foco) : undefined;
  const alcanceDoFoco = noEmFoco
    ? Math.max(
        noEmFoco.raio * FOLGA_DO_ALCANCE,
        ...[...vizinhos].map((id) => {
          const v = preparo.nos.find((n) => n.id === id);
          return v
            ? Math.hypot(v.x - noEmFoco.x, v.y - noEmFoco.y) + v.raio
            : 0;
        }),
      )
    : 0;
  const bilheteDe = hover
    ? textoDoBilhete(hover, leis, indices, preparo.vizinhos)
    : null;

  return (
    <div className="org-mapa" ref={quadro}>
      <canvas ref={fundo} className="org-fundo" />
      <svg
        ref={svg}
        className={`org-svg${foco ? " com-foco" : ""}`}
        onWheel={aoRolar}
        onPointerDown={aoApertarFundo}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
      >
        <circle
          r={RAIO_DA_PRESIDENCIA}
          fill={COR_PRESIDENCIA}
          stroke={PAPEL}
          strokeWidth={4}
        />
        <text
          fontSize={34}
          fill="white"
          textAnchor="middle"
          dominantBaseline="middle"
          fontWeight={700}
          pointerEvents="none"
        >
          Presidência
        </text>
        {preparo.nos.map((n) => {
          const dado = info.get(n.id);
          const lei = leis.get(n.id);
          const peso = pesos?.get(n.id);
          return (
            <BolhaDoMapa
              key={n.id}
              no={n}
              nome={dado?.nome ?? n.id}
              icone={dado?.icone ?? ""}
              selecionada={selecionado === n.id}
              destaque={destaqueDe(n.id, foco, vizinhos)}
              fraca={peso !== undefined && peso < PESO_DO_ESMAECER}
              pulsa={mudou.has(n.id)}
              comNome={comNome}
              contorno={
                visaoId === "dinheiro" && lei
                  ? contornoDoDinheiro(lei)
                  : undefined
              }
              alcance={foco === n.id ? alcanceDoFoco : null}
              registrar={registro.no(n.id)}
              aoApertar={aoApertarBolha}
              aoEntrar={aoEntrar}
              aoSair={aoSair}
            />
          );
        })}
        {preparo.grupos.map((g) => (
          <g key={g.id} transform={`translate(${g.x} ${g.y})`}>
            <title>{g.nome}</title>
            <path
              d={hexagono(RAIO_DO_GRUPO)}
              fill={PAPEL}
              stroke={corDaSatisfacao(g.valor)}
              strokeWidth={6}
            />
            <text
              fontSize={LETRA_DO_GRUPO}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={TINTA}
              fontWeight={700}
              pointerEvents="none"
            >
              {Math.round(g.valor)}
            </text>
            <text
              y={RAIO_DO_GRUPO + LETRA_DO_GRUPO}
              fontSize={LETRA_DO_GRUPO}
              textAnchor="middle"
              fill={PAPEL}
              pointerEvents="none"
            >
              {g.nome}
            </text>
          </g>
        ))}
        {preparo.potencias.map((p) => (
          <g key={p.id} transform={`translate(${p.x} ${p.y})`}>
            <title>{p.nome}</title>
            <circle
              r={RAIO_DA_POTENCIA}
              fill={PAPEL}
              stroke={TINTA}
              strokeWidth={4}
            />
            <text
              fontSize={LETRA_DO_GRUPO}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={TINTA}
              fontWeight={700}
              pointerEvents="none"
            >
              {Math.round(p.opiniao)}
            </text>
            <text
              y={RAIO_DA_POTENCIA + LETRA_DO_GRUPO}
              fontSize={LETRA_DO_GRUPO}
              textAnchor="middle"
              fill={PAPEL}
              pointerEvents="none"
            >
              {p.nome}
            </text>
          </g>
        ))}
      </svg>
      <ControlesDoMapa
        visao={visaoId}
        semDados={semDados}
        onVisao={setVisaoId}
        itens={itens}
        onEscolher={escolher}
        onEnquadrar={enquadrar}
      />
      <Miniatura
        nos={preparo.nos}
        alcance={preparo.alcance}
        retangulo={retangulo}
        versao={assentada}
        onIr={(x, y) => irPara({ ...vistaAtual.current, cx: x, cy: y })}
      />
      <div ref={bilhete} className="org-bilhete" hidden={!bilheteDe}>
        {bilheteDe ? (
          <>
            <b>{bilheteDe.titulo}</b>
            {bilheteDe.linhas.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
}

function destaqueDe(
  id: string,
  foco: string | null,
  vizinhos: ReadonlySet<string>,
): "foco" | "vizinha" | undefined {
  if (foco === id) return "foco";
  return vizinhos.has(id) ? "vizinha" : undefined;
}

/** Verde para a lei que arrecada, vermelho para a que gasta. */
function contornoDoDinheiro(lei: VisaoPartida["leis"][number]) {
  const valor = dinheiroDaLei(lei);
  if (valor === 0) return undefined;
  return valor > 0 ? VERDE : VERMELHO;
}

function textoDoBilhete(
  id: string,
  leis: ReadonlyMap<string, VisaoPartida["leis"][number]>,
  indices: ReadonlyMap<string, VisaoPartida["bolhas"][number]>,
  vizinhos: ReadonlyMap<string, readonly string[]>,
): { titulo: string; linhas: string[] } | null {
  const ligacoes = `Ligada a ${vizinhos.get(id)?.length ?? 0}`;
  const lei = leis.get(id);
  if (lei) {
    const opcao = lei.opcoes?.find((o) => o.id === lei.opcaoAtual)?.rotulo;
    return {
      titulo: lei.nome,
      linhas: [
        opcao ? `Em vigor: ${opcao}` : `Nível ${Math.round(lei.nivel)}`,
        lei.popularidade
          ? `Popularidade ${Math.round(lei.popularidade.pais)}`
          : "Popularidade: sem dado",
        ligacoes,
      ],
    };
  }
  const indice = indices.get(id);
  return indice
    ? {
        titulo: indice.nome,
        linhas: [indice.frase ?? `Valor ${Math.round(indice.valor)}`, ligacoes],
      }
    : null;
}
