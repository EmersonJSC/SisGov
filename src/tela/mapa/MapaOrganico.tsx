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
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type RefObject,
} from "react";
import type {
  VisaoInstituicao,
  VisaoMinistro,
  VisaoPartida,
} from "../../partida";
import { assentosDaCasa } from "./assentos";
import { interpretarRolagem } from "./gestos";
import { BolhaDoMapa, RECORTE_DO_ROSTO } from "./BolhaDoMapa";
import {
  ControlesDoMapa,
  Miniatura,
  type ItemDeBusca,
} from "./ControlesDoMapa";
import { criarMedidor } from "./medidorDeQuadros";
import { desenharFundo, prepararFundo, type AlertaAceso } from "./fundoDoMapa";
import { ICONE_BOLHA, ICONE_INTERFACE, ICONE_LEI } from "./icones";
import { retratoDaPessoa } from "../inicio/aparencia";
import { iconeEsfera, iconeIndice, iconeLei } from "./iconesPersonalizados";
import {
  CENTRO_DA_TRINDADE,
  ANEL_DO_CONGRESSO_ATE,
  ANEL_DO_CONGRESSO_DE,
  PODER_JUDICIARIO,
  PODER_LEGISLATIVO,
  PREFIXO_INSTITUICAO,
  PREFIXO_MINISTRO,
  RAIO_DA_POTENCIA,
  RAIO_DO_GRUPO,
} from "./organico";
import type { Preparo } from "./organico";
import { PoderesDoMapa } from "./PoderesDoMapa";
import { TrindadeDoMapa } from "./TrindadeDoMapa";
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

/** Zoom de um toque nos botões, no teclado e no duplo clique. */
const FATOR_DO_TOQUE = 1.4;
const FATOR_DO_DUPLO_CLIQUE = 0.55;
/** Quanto uma seta do teclado move o mapa, em fração da largura da vista. */
const PASSO_DAS_SETAS = 0.18;
const ESPERA_DO_DUPLO_CLIQUE = 500;
const LARGURA_MINIMA = 260;
const FOLGA_DO_ALCANCE = 1.6;
const DOBRO_DO_ALCANCE = 2.4;
/** Largura da vista ao ir até uma bolha clicada. */
const LARGURA_NO_FOCO = 1100;
/** Ministro, instituição e índice: aproxima pouco, só o bastante para centrar. */
const LARGURA_NO_FOCO_DOS_GRANDES = 2600;
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
/** Com o mapa parado, o fundo é redesenhado a cada tantos quadros. */
const QUADROS_ENTRE_DESENHOS_PARADO = 2;
/** De quanto em quanto tempo o placar de quadros se atualiza. */
const INTERVALO_DO_PLACAR = 500;
/** O Senado é pequeno: duas filas de bolinhas mais encorpadas, coladas. */
const FILAS_DO_SENADO = 2;
const RAIO_DA_CADEIRA_DO_SENADO = 5.5;
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

/** O que a bolha mostra além da posição: nome, ícone e, no ministro, o rosto. */
type InfoDoNo = Readonly<{ nome: string; icone: string; retrato?: string }>;

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
  onAbrirPainel,
  onAbrirGoverno,
}: {
  visao: VisaoPartida;
  selecionado: string | null;
  onSelecionar: (id: string | null) => void;
  /** Botão ao lado da bolha: abre o painel do que atrapalha e ajuda. */
  onAbrirPainel: (id: string) => void;
  /** Clique na trindade: a janela do Governo. */
  onAbrirGoverno?: () => void;
}) {
  const [visaoId, setVisaoId] = useState<IdDaVisao>("prioridade");
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
  /** O que a roda e o trackpad pediram e ainda não foi aplicado à câmera: uma vez por quadro. */
  const rolagem = useRef<{
    zoom: number;
    dx: number;
    dy: number;
    x: number;
    y: number;
    quadro: number | null;
  }>({ zoom: 0, dx: 0, dy: 0, x: 0, y: 0, quadro: null });
  /** Quando foi o último aperto numa bolha (o duplo clique nela não é zoom). */
  const ultimoNaBolha = useRef(0);
  const [comNome, setComNome] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  // tecla F: mostra quadros por segundo e o custo do desenho do fundo
  const [medindo, setMedindo] = useState(false);
  const placar = useRef<HTMLDivElement>(null);
  const apertada = useRef<{
    id: string;
    x: number;
    y: number;
    moveu: boolean;
  } | null>(null);
  const movendo = useRef<{ x: number; y: number; moveu: boolean } | null>(null);
  const aoSelecionar = useRef(onSelecionar);
  aoSelecionar.current = onSelecionar;
  const aoAbrirPainel = useRef(onAbrirPainel);
  aoAbrirPainel.current = onAbrirPainel;
  const abrirPainel = useCallback(
    (id: string) => aoAbrirPainel.current(id),
    [],
  );

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
  const hierarquia = visao.hierarquia;
  const ministros = useMemo(
    () => new Map((hierarquia?.ministros ?? []).map((x) => [x.id, x])),
    [hierarquia],
  );
  const instituicoes = useMemo(
    () => new Map((hierarquia?.instituicoes ?? []).map((x) => [x.id, x])),
    [hierarquia],
  );
  const info = useMemo(
    () =>
      new Map<string, InfoDoNo>(
        preparo.nos.map((n) => {
          if (n.tipo === "ministro") {
            const x = ministros.get(n.id.slice(PREFIXO_MINISTRO.length));
            return [
              n.id,
              {
                nome: x?.nome ?? n.id,
                icone: "",
                retrato: x?.pessoa ? retratoDaPessoa(x.pessoa) : undefined,
              },
            ] as const;
          }
          if (n.tipo === "instituicao") {
            const id = n.id.slice(PREFIXO_INSTITUICAO.length);
            return [
              n.id,
              {
                nome: instituicoes.get(id)?.nome ?? id,
                icone: iconeEsfera(id, ICONE_INTERFACE.lei),
                retrato: undefined,
              },
            ] as const;
          }
          const lei = leis.get(n.id);
          const nome = lei?.nome ?? indices.get(n.id)?.nome ?? n.id;
          const icone = lei
            ? iconeLei(n.id, ICONE_LEI[n.id] ?? ICONE_INTERFACE.lei)
            : iconeIndice(n.id, ICONE_BOLHA[n.id] ?? "chart-line");
          return [n.id, { nome, icone, retrato: undefined }] as const;
        }),
      ),
    [preparo, leis, indices, ministros, instituicoes],
  );
  const itens = useMemo<ItemDeBusca[]>(
    () =>
      preparo.nos.map((n) => ({
        id: n.id,
        nome:
          n.tipo === "ministro"
            ? `${info.get(n.id)?.nome ?? n.id}: ${ministros.get(n.id.slice(PREFIXO_MINISTRO.length))?.pessoa?.nome ?? "vago"}`
            : (info.get(n.id)?.nome ?? n.id),
        tipo: n.tipo,
      })),
    [preparo, info, ministros],
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
  /** O jogador já mexeu na câmera: o mapa não a reajusta mais sozinho. */
  const mexeu = useRef(false);
  useEffect(() => {
    if (caixa.w === 0) return;
    if (!comecou.current) {
      comecou.current = true;
      vistaAtual.current = enquadrarPontos(miolo(preparo.nos), caixa);
    }
    definirVista(vistaAtual.current);
  }, [caixa, preparo, definirVista]);

  // o mapa continua abrindo depois da primeira imagem: quando assenta, reenquadra
  // sozinho, se o jogador ainda não mexeu na câmera
  useEffect(() => {
    if (assentada === 0 || mexeu.current || caixaAtual.current.w === 0) return;
    irPara(enquadrarPontos(miolo(preparo.nos), caixaAtual.current));
  }, [assentada, irPara, preparo]);

  // ------------------------------------------------------------------ fundo --
  const foco = hover ?? selecionado;
  const vizinhos = useMemo(
    () =>
      foco
        ? new Set(vizinhosDe(foco, preparo, visao.leis, visao.poderes))
        : SEM_VIZINHOS,
    [foco, preparo, visao.leis, visao.poderes],
  );
  // as cadeiras do Congresso: a Câmara em cima, o Senado embaixo
  const assentos = useMemo(() => {
    const l = visao.poderes?.legislativo;
    return l
      ? [
          ...assentosDaCasa(
            l.camara,
            "cima",
            ANEL_DO_CONGRESSO_DE,
            ANEL_DO_CONGRESSO_ATE,
          ),
          ...(l.senado
            ? assentosDaCasa(
                l.senado,
                "baixo",
                ANEL_DO_CONGRESSO_DE,
                ANEL_DO_CONGRESSO_ATE,
                { filas: FILAS_DO_SENADO, raio: RAIO_DA_CADEIRA_DO_SENADO },
              )
            : []),
        ]
      : [];
  }, [visao.poderes]);
  // o caminho de cada índice em alerta, do centro até ele: o pior alerta vence em fio compartilhado
  const alertas = useMemo(() => {
    const gravidade: Readonly<Record<AlertaAceso, number>> = {
      bom: 1,
      preocupante: 2,
      critico: 3,
    };
    const caminhos = new Map<string, AlertaAceso>();
    visao.bolhas.forEach((b) => {
      const ministro = preparo.ministroDoIndice.get(b.id);
      if (!b.alerta || b.alerta === "normal" || !ministro) return;
      const de = `${PREFIXO_MINISTRO}${ministro}`;
      [`h:${CENTRO_DA_TRINDADE}>${de}`, `h:${de}>${b.id}`].forEach((fio) => {
        const antes = caminhos.get(fio);
        if (!antes || gravidade[b.alerta as AlertaAceso] > gravidade[antes])
          caminhos.set(fio, b.alerta as AlertaAceso);
      });
    });
    return caminhos;
  }, [visao.bolhas, preparo]);
  const estadoDoFoco = useRef({ foco, vizinhos });
  estadoDoFoco.current = { foco, vizinhos };

  useLayoutEffect(() => {
    const cv = fundo.current;
    if (!cv || caixa.w === 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAXIMO);
    cv.width = Math.round(caixa.w * dpr);
    cv.height = Math.round(caixa.h * dpr);
  }, [caixa]);

  // o que não muda entre quadros (quem liga a quem, ritmos, cadeiras por cor) fica pronto
  const preparado = useMemo(
    () =>
      prepararFundo({
        nos: preparo.nos,
        fixos: preparo.fixos,
        fios: preparo.fios,
        assentos,
        alertas,
      }),
    [preparo, assentos, alertas],
  );
  const preparadoAtual = useRef(preparado);
  preparadoAtual.current = preparado;

  useEffect(() => {
    const ctx = fundo.current?.getContext("2d");
    if (!ctx) return;
    const animar = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    const medidor = criarMedidor();
    let ultimaLeitura = 0;
    let id = 0;
    let quadros = 0;
    let ultimaVista: Vista | null = null;
    let ultimoFoco: string | null | undefined;
    const passo = (tempo: number) => {
      id = requestAnimationFrame(passo);
      const c = caixaAtual.current;
      const { foco: focoDeAgora, vizinhos: vizinhosDeAgora } =
        estadoDoFoco.current;
      const sim = preparo.simulacao;
      const mudou =
        vistaAtual.current !== ultimaVista ||
        focoDeAgora !== ultimoFoco ||
        sim.alpha() >= sim.alphaMin();
      ultimaVista = vistaAtual.current;
      ultimoFoco = focoDeAgora;
      quadros += 1;
      medidor.quadro(tempo);
      if (tempo - ultimaLeitura >= INTERVALO_DO_PLACAR) {
        ultimaLeitura = tempo;
        const m = medidor.ler();
        if (placar.current)
          placar.current.textContent = `${m.fps.toFixed(0)} fps · pior quadro ${m.piorQuadroMs.toFixed(0)} ms · fundo ${m.fundoMs.toFixed(1)} ms`;
      }
      // parado, os pulsos andam devagar: metade dos quadros basta
      if (!mudou && quadros % QUADROS_ENTRE_DESENHOS_PARADO !== 0) return;
      const inicio = performance.now();
      desenharFundo(ctx, preparadoAtual.current, {
        nos: preparo.nos,
        auras: preparo.auras,
        areas: preparo.areas,
        vista: vistaAtual.current,
        caixa: c,
        dpr: c.w > 0 ? ctx.canvas.width / c.w : 1,
        foco: focoDeAgora,
        vizinhos: vizinhosDeAgora,
        tempo,
        animar,
        reduzido: svg.current?.classList.contains("movendo") ?? false,
      });
      medidor.fundo(performance.now() - inicio);
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
        w: Math.min(
          vistaAtual.current.w,
          n.tipo === "lei" ? LARGURA_NO_FOCO : LARGURA_NO_FOCO_DOS_GRANDES,
        ),
      });
    },
    [irPara, preparo],
  );
  const escolher = useCallback(
    (id: string) => {
      mexeu.current = true;
      aoSelecionar.current(id);
      irParaBolha(id);
    },
    [irParaBolha],
  );

  const aoApertarBolha = useCallback((id: string, e: PointerEvent) => {
    e.stopPropagation();
    ultimoNaBolha.current = performance.now();
    quadro.current?.focus({ preventScroll: true });
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
    quadro.current?.focus({ preventScroll: true });
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
    mexeu.current = true;
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

  const limitesDoZoom = useMemo(
    () => ({
      minimo: LARGURA_MINIMA,
      maximo: preparo.alcance * DOBRO_DO_ALCANCE,
    }),
    [preparo.alcance],
  );

  /** Aproxima (fator < 1) ou afasta (> 1) com animação, em volta de um ponto da tela. */
  const zoomPor = useCallback(
    (fator: number, tela?: { x: number; y: number }) => {
      mexeu.current = true;
      const c = caixaAtual.current;
      irPara(
        zoomEm(
          vistaAtual.current,
          c,
          tela ?? { x: c.w * METADE, y: c.h * METADE },
          fator,
          limitesDoZoom,
        ),
      );
    },
    [irPara, limitesDoZoom],
  );

  // A roda e o trackpad chegam por ouvinte nativo (não passivo): na pinça é preciso
  // impedir o zoom da página. Tudo o que chega num quadro é somado e aplicado uma vez.
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const aoRolarNativo = (e: globalThis.WheelEvent) => {
      e.preventDefault();
      mexeu.current = true;
      cancelarViagem();
      const gesto = interpretarRolagem(e);
      const pendente = rolagem.current;
      if (gesto.tipo === "zoom") {
        pendente.zoom += gesto.expoente;
        pendente.x = e.clientX;
        pendente.y = e.clientY;
      } else {
        pendente.dx += gesto.dx;
        pendente.dy += gesto.dy;
      }
      if (pendente.quadro !== null) return;
      pendente.quadro = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const caixaDoSvg = { w: r.width, h: r.height };
        const porPixel = vistaAtual.current.w / r.width;
        const movida = {
          ...vistaAtual.current,
          cx: vistaAtual.current.cx + pendente.dx * porPixel,
          cy: vistaAtual.current.cy + pendente.dy * porPixel,
        };
        definirVista(
          pendente.zoom === 0
            ? movida
            : zoomEm(
                movida,
                caixaDoSvg,
                { x: pendente.x - r.left, y: pendente.y - r.top },
                Math.exp(pendente.zoom),
                limitesDoZoom,
              ),
        );
        pendente.zoom = 0;
        pendente.dx = 0;
        pendente.dy = 0;
        pendente.quadro = null;
      });
    };
    el.addEventListener("wheel", aoRolarNativo, { passive: false });
    return () => el.removeEventListener("wheel", aoRolarNativo);
  }, [definirVista, limitesDoZoom]);

  /** Duplo clique no fundo aproxima ali; numa bolha não faz zoom. */
  const aoDuploClique = (e: MouseEvent) => {
    if (performance.now() - ultimoNaBolha.current < ESPERA_DO_DUPLO_CLIQUE)
      return;
    const r = svg.current!.getBoundingClientRect();
    zoomPor(FATOR_DO_DUPLO_CLIQUE, {
      x: e.clientX - r.left,
      y: e.clientY - r.top,
    });
  };

  /** Teclado: + e − aproximam e afastam, setas movem, 0 enquadra tudo. */
  const aoTeclar = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement) return;
    const v = vistaAtual.current;
    const passo = v.w * PASSO_DAS_SETAS;
    const mover = (dx: number, dy: number) => {
      mexeu.current = true;
      irPara({ ...v, cx: v.cx + dx, cy: v.cy + dy });
    };
    const teclas: Readonly<Record<string, () => void>> = {
      "+": () => zoomPor(1 / FATOR_DO_TOQUE),
      "=": () => zoomPor(1 / FATOR_DO_TOQUE),
      "-": () => zoomPor(FATOR_DO_TOQUE),
      _: () => zoomPor(FATOR_DO_TOQUE),
      f: () => setMedindo((m) => !m),
      F: () => setMedindo((m) => !m),
      "0": enquadrar,
      Home: enquadrar,
      ArrowLeft: () => mover(-passo, 0),
      ArrowRight: () => mover(passo, 0),
      ArrowUp: () => mover(0, -passo),
      ArrowDown: () => mover(0, passo),
    };
    const acao = teclas[e.key];
    if (!acao) return;
    e.preventDefault();
    acao();
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
    ? textoDoBilhete(
        hover,
        leis,
        indices,
        ministros,
        instituicoes,
        preparo,
        visao.poderes,
      )
    : null;

  return (
    <div
      className="org-mapa"
      ref={quadro}
      tabIndex={0}
      onKeyDown={aoTeclar}
      aria-label="Mapa do governo. Use as setas para mover, mais e menos para o zoom, zero para ver tudo."
    >
      <canvas ref={fundo} className="org-fundo" />
      {medindo ? (
        <div className="org-placar-caixa">
          <div ref={placar} className="org-placar" />
        </div>
      ) : null}
      <svg
        ref={svg}
        className={`org-svg${foco ? " com-foco" : ""}`}
        onDoubleClick={aoDuploClique}
        onPointerDown={aoApertarFundo}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
      >
        <defs>
          <clipPath id={RECORTE_DO_ROSTO} clipPathUnits="objectBoundingBox">
            <circle cx="0.5" cy="0.5" r="0.5" />
          </clipPath>
        </defs>
        {visao.poderes ? (
          <PoderesDoMapa
            poderes={visao.poderes}
            aoEntrar={aoEntrar}
            aoSair={aoSair}
          />
        ) : null}
        {hierarquia?.trindade ? (
          <TrindadeDoMapa
            trindade={hierarquia.trindade}
            fixos={preparo.fixos}
            onClicar={onAbrirGoverno}
          />
        ) : null}
        {preparo.nos.map((n) => {
          const dado = info.get(n.id);
          const lei = leis.get(n.id);
          const peso = pesos?.get(n.id);
          const bolhaDeIndice = indices.get(n.id);
          return (
            <BolhaDoMapa
              key={n.id}
              no={n}
              nome={dado?.nome ?? n.id}
              icone={dado?.icone ?? ""}
              retrato={dado?.retrato}
              selecionada={selecionado === n.id}
              destaque={destaqueDe(n.id, foco, vizinhos)}
              fraca={
                (peso !== undefined && peso < PESO_DO_ESMAECER) ||
                (visaoId === "prioridade" && n.tipo === "lei")
              }
              pulsa={mudou.has(n.id)}
              comNome={comNome}
              contorno={
                visaoId === "dinheiro" && lei
                  ? contornoDoDinheiro(lei)
                  : undefined
              }
              alerta={bolhaDeIndice?.alerta}
              tendencia={bolhaDeIndice?.tendencia}
              alcance={foco === n.id ? alcanceDoFoco : null}
              registrar={registro.no(n.id)}
              aoApertar={aoApertarBolha}
              aoEntrar={aoEntrar}
              aoSair={aoSair}
              aoAbrirPainel={abrirPainel}
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
        onZoom={(fator) => zoomPor(fator)}
      />
      <Miniatura
        nos={preparo.nos}
        alcance={preparo.alcance}
        retangulo={retangulo}
        versao={assentada}
        onIr={(x, y) => {
          mexeu.current = true;
          irPara({ ...vistaAtual.current, cx: x, cy: y });
        }}
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

/** Quem se acende com a bolha em foco: os ligados a ela, ou o que o poder alcança agora. */
function vizinhosDe(
  id: string,
  preparo: Preparo,
  leis: VisaoPartida["leis"],
  poderes: VisaoPartida["poderes"],
): readonly string[] {
  if (id === PODER_LEGISLATIVO) return poderes?.legislativo.emVotacao ?? [];
  if (id === PODER_JUDICIARIO)
    return leis
      .filter(
        (l) => l.nivelLegal === "constitucional" || l.nivelLegal === "petrea",
      )
      .map((l) => l.id);
  return preparo.vizinhos.get(id) ?? [];
}

const ROTULO_DO_ALERTA: Readonly<Record<string, string>> = {
  critico: "crítico",
  preocupante: "preocupante",
  normal: "normal",
  bom: "bom",
};

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
  ministros: ReadonlyMap<string, VisaoMinistro>,
  instituicoes: ReadonlyMap<string, VisaoInstituicao>,
  preparo: Preparo,
  poderes: VisaoPartida["poderes"],
): { titulo: string; linhas: string[] } | null {
  const alcancadas = `${vizinhosDe(id, preparo, [...leis.values()], poderes).length}`;
  if (poderes && id === PODER_LEGISLATIVO) {
    const { camara, senado } = poderes.legislativo;
    const doGoverno = (c: typeof camara) => {
      const g = c.partidos.find((p) => p.governo);
      return g ? `${g.nome} tem ${g.cadeiras}` : "sem partido de governo";
    };
    return {
      titulo: "Legislativo",
      linhas: [
        `Câmara: ${camara.total} cadeiras (${doGoverno(camara)})`,
        ...(senado
          ? [`Senado: ${senado.total} cadeiras (${doGoverno(senado)})`]
          : []),
        `${alcancadas} leis esperando voto agora`,
      ],
    };
  }
  if (poderes && id === PODER_JUDICIARIO)
    return {
      titulo: "Judiciário",
      linhas: [
        poderes.judiciario.pronto
          ? `${poderes.judiciario.juizes.length} juízes`
          : "Em construção: os juízes são de mentira",
        `Guarda ${alcancadas} leis constitucionais ou pétreas`,
      ],
    };
  const ligacoes = `Ligada a ${preparo.vizinhos.get(id)?.length ?? 0}`;
  if (id.startsWith(PREFIXO_MINISTRO)) {
    const x = ministros.get(id.slice(PREFIXO_MINISTRO.length));
    return x
      ? {
          titulo: x.nome,
          linhas: [
            `Ministro: ${x.pessoa?.nome ?? "vago"}`,
            `Cuida de ${x.instituicoes.length} instituições`,
            `Recebe ${x.verba.toFixed(1)}% do PIB em verbas`,
          ],
        }
      : null;
  }
  if (id.startsWith(PREFIXO_INSTITUICAO)) {
    const x = instituicoes.get(id.slice(PREFIXO_INSTITUICAO.length));
    return x
      ? {
          titulo: x.nome,
          linhas: [
            x.ministro
              ? `Instituição sob ${ministros.get(x.ministro)?.nome ?? x.ministro}`
              : `Sem ministro: fica com ${x.poder === "legislativo" ? "o Congresso" : "o Judiciário"}`,
            `Recebe ${x.verba.toFixed(1)}% do PIB em verbas`,
            `${preparo.vizinhos.get(id)?.length ?? 0} leis e índices`,
          ],
        }
      : null;
  }
  const semEfeito = preparo.nos.find((n) => n.id === id)?.semEfeito
    ? ["Nada no motor liga a ela ainda"]
    : [];
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
        ...semEfeito,
      ],
    };
  }
  const indice = indices.get(id);
  return indice
    ? {
        titulo: indice.nome,
        linhas: [
          indice.frase ?? `Valor ${Math.round(indice.valor)}`,
          ...(indice.saude === undefined
            ? []
            : [
                `Saúde ${Math.round(indice.saude)} de 100: ${ROTULO_DO_ALERTA[indice.alerta ?? "normal"]}`,
              ]),
          ...(indice.tendencia && indice.tendencia !== "estavel"
            ? [
                `${indice.tendencia === "piorando" ? "Piorando" : "Melhorando"} ${Math.abs(Math.round(indice.mudancaDaSaude ?? 0))} pontos nos últimos ${indice.mesesDaTendencia ?? 2} meses`,
              ]
            : []),
          ligacoes,
          ...semEfeito,
        ],
      }
    : null;
}
