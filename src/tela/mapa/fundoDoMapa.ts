/**
 * Fundo do mapa, desenhado num canvas por trás das bolhas: as manchas e os nomes
 * das áreas, as auras, as cadeiras do Congresso, os fios entre as bolhas e os
 * pulsos que correm por eles. Só da tela.
 *
 * O que não muda entre um quadro e outro (quem liga a quem, o ritmo de cada
 * pulso, as cadeiras por cor) é montado uma vez em `prepararFundo`; cada quadro
 * só calcula onde está cada pulso e desenha em poucos traços agrupados. Fora da
 * tela, nada é riscado; durante o gesto e longe demais, só o que mais importa.
 */
import type { AlertaDoIndice } from "../../partida";
import type { Assento } from "./assentos";
import {
  manchasDe,
  PREFIXO_PODER,
  type AreaDoMapa,
  type AuraDoMapa,
  type FioDoMapa,
  type FixoDoMapa,
  type NoVivo,
} from "./organico";
import { alturaDaVista, type Caixa, type Vista } from "./vistaDoMapa";

const METADE = 0.5;
const GIRO = Math.PI * 2;
const OPACIDADE_DA_MANCHA = 0.22;
const RAIO_DA_MANCHA = 1.25;
const LETRA_DA_AREA = 72;
const OPACIDADE_DO_NOME = 0.16;
const ESPESSURA_DO_FIO = 1.4;
const ESPESSURA_DO_FIO_EM_FOCO = 3;
const OPACIDADE_DO_FIO = 0.32;
const OPACIDADE_DO_FIO_EM_FOCO = 0.95;
const OPACIDADE_DO_FIO_APAGADO = 0.1;
/** Os fios de efeito da bolha em foco vibram: espessura e opacidade oscilam. */
const ESPESSURA_DO_FOCO = 4;
const OPACIDADE_DO_FOCO = 0.55;
const VIBRACAO_DO_FOCO = 0.35;
const PERIODO_DO_FOCO = 700;
const OURO = "232, 200, 114";
const AZUL = "120, 190, 255";
const VERDE = "111, 207, 151";
const VERMELHO = "235, 87, 87";
const CONTORNO_DO_GOVERNO = "#e8c872";
const ESPESSURA_DO_GOVERNO = 1.2;
const OPACIDADE_DA_AURA = 0.2;
const MIOLO_DA_AURA = 0.6;
const OPACIDADE_DO_CONTORNO_DA_AURA = 0.35;
const ESPESSURA_DO_CONTORNO_DA_AURA = 1.5;
const OPACIDADE_DA_HIERARQUIA = 0.2;
const OPACIDADE_DA_HIERARQUIA_APAGADA = 0.07;
const ESPESSURA_DA_HIERARQUIA = 1.2;
const BASE_HEX = 16;
const DIGITOS_DA_COR = 2;
/** Margem, no mundo, em volta da tela onde ainda se desenha (os pulsos entram sem pular). */
const MARGEM_DA_TELA = 120;

const BASE_DO_HASH = 31;
const MODULO_DO_HASH = 1000003;
const SEMENTE_DO_HASH = 7;
const VARIACAO_DO_RITMO = 0.5;

export type AlertaAceso = Exclude<AlertaDoIndice, "normal">;
/**
 * O alerta de um índice faz o caminho dele, do centro ao índice, vibrar na cor do
 * estado: a espessura e a opacidade oscilam, mais rápido e mais forte quanto pior.
 */
const ESTILO_DO_ALERTA: Readonly<
  Record<
    AlertaAceso,
    Readonly<{
      periodo: number;
      cor: string;
      base: number;
      espessura: number;
      vibracao: number;
      halo: number;
    }>
  >
> = {
  critico: {
    periodo: 450,
    cor: VERMELHO,
    base: 0.8,
    espessura: 3,
    vibracao: 0.6,
    halo: 3,
  },
  preocupante: {
    periodo: 800,
    cor: VERMELHO,
    base: 0.65,
    espessura: 2.6,
    vibracao: 0.45,
    halo: 2.4,
  },
  bom: {
    periodo: 2400,
    cor: VERDE,
    base: 0.55,
    espessura: 2.2,
    vibracao: 0.3,
    halo: 0,
  },
};
const OPACIDADE_DO_HALO_DO_ALERTA = 0.25;

type Ponto = Readonly<{ x: number; y: number }>;
/** Um fio já resolvido: as duas pontas são as próprias bolhas (a posição é a de agora). */
type Seg = Readonly<{
  a: Ponto;
  b: Ponto;
  tipo: FioDoMapa["tipo"];
  sinal: 1 | -1;
}>;
type Alertado = Readonly<{
  seg: Seg;
  estado: AlertaAceso;
  ritmo: number;
  fase: number;
}>;

export type FundoPreparado = Readonly<{
  porId: ReadonlyMap<string, Ponto>;
  esqueleto: readonly Seg[];
  positivos: readonly Seg[];
  negativos: readonly Seg[];
  /** Id da bolha → os fios que chegam nela ou saem dela. */
  incidentes: ReadonlyMap<string, readonly Seg[]>;
  alertados: readonly Alertado[];
  /** Cadeiras agrupadas por cor: cada cor é riscada num traço só. */
  cadeiras: readonly (readonly [string, readonly Assento[]])[];
  cadeirasDoGoverno: readonly Assento[];
}>;

/** Número de 0 a 1 que depende só do texto: o mesmo fio sempre cai no mesmo tempo. */
function semente(texto: string): number {
  const h = [...texto].reduce(
    (acc, c) => (acc * BASE_DO_HASH + c.charCodeAt(0)) % MODULO_DO_HASH,
    SEMENTE_DO_HASH,
  );
  return h / MODULO_DO_HASH;
}

function rgb(hex: string): string {
  const n = (i: number) =>
    parseInt(hex.slice(i, i + DIGITOS_DA_COR), BASE_HEX) || 0;
  return `${n(1)}, ${n(3)}, ${n(5)}`;
}

/** Monta uma vez o que não muda a cada quadro. */
export function prepararFundo(
  entrada: Readonly<{
    nos: readonly NoVivo[];
    fixos: readonly FixoDoMapa[];
    fios: readonly FioDoMapa[];
    assentos: readonly Assento[];
    alertas: ReadonlyMap<string, AlertaAceso>;
  }>,
): FundoPreparado {
  const porId = new Map<string, Ponto>([
    ...entrada.nos.map((n) => [n.id, n] as const),
    ...entrada.fixos.map((x) => [x.id, x] as const),
  ]);
  const segmentos = entrada.fios.flatMap((f) => {
    const a = porId.get(f.de);
    const b = porId.get(f.para);
    return a && b
      ? [{ f, seg: { a, b, tipo: f.tipo, sinal: f.sinal } as Seg }]
      : [];
  });
  const incidentes = new Map<string, Seg[]>();
  segmentos.forEach(({ f, seg }) => {
    [f.de, f.para].forEach((id) =>
      incidentes.set(id, [...(incidentes.get(id) ?? []), seg]),
    );
  });

  const alertados: Alertado[] = segmentos
    .filter(({ f }) => entrada.alertas.has(f.id))
    .map(({ f, seg }) => ({
      seg,
      estado: entrada.alertas.get(f.id) as AlertaAceso,
      ritmo:
        1 -
        VARIACAO_DO_RITMO * METADE +
        VARIACAO_DO_RITMO * semente(`${f.id}a`),
      fase: semente(`${f.id}b`),
    }));

  const porCor = new Map<string, Assento[]>();
  entrada.assentos.forEach((c) =>
    porCor.set(c.cor, [...(porCor.get(c.cor) ?? []), c]),
  );

  return {
    porId,
    esqueleto: segmentos
      .filter(({ f }) => f.tipo === "hierarquia" || f.tipo === "lateral")
      .map(({ seg }) => seg),
    positivos: segmentos
      .filter(({ f }) => f.tipo === "efeito" && f.sinal > 0)
      .map(({ seg }) => seg),
    negativos: segmentos
      .filter(({ f }) => f.tipo === "efeito" && f.sinal < 0)
      .map(({ seg }) => seg),
    incidentes,
    alertados,
    cadeiras: [...porCor],
    cadeirasDoGoverno: entrada.assentos.filter((c) => c.governo),
  };
}

export type EstadoDoFundo = Readonly<{
  nos: readonly NoVivo[];
  auras: readonly AuraDoMapa[];
  areas: readonly AreaDoMapa[];
  vista: Vista;
  caixa: Caixa;
  /** Pixels reais por pixel de CSS. */
  dpr: number;
  /** Bolha em foco e as ligadas a ela (ou null). */
  foco: string | null;
  vizinhos: ReadonlySet<string>;
  /** Milissegundos desde que a página abriu. */
  tempo: number;
  animar: boolean;
  /** Zoom ou arrasto em curso: só o que mais importa é desenhado. */
  reduzido: boolean;
}>;

export function desenharFundo(
  ctx: CanvasRenderingContext2D,
  p: FundoPreparado,
  e: EstadoDoFundo,
): void {
  const { vista, caixa, dpr } = e;
  if (caixa.w === 0) return;
  const k = caixa.w / vista.w;
  const h = alturaDaVista(vista, caixa);
  const px = 1 / k;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.setTransform(
    dpr * k,
    0,
    0,
    dpr * k,
    -(vista.cx - vista.w * METADE) * k * dpr,
    -(vista.cy - h * METADE) * k * dpr,
  );
  const x0 = vista.cx - vista.w * METADE - MARGEM_DA_TELA;
  const x1 = vista.cx + vista.w * METADE + MARGEM_DA_TELA;
  const y0 = vista.cy - h * METADE - MARGEM_DA_TELA;
  const y1 = vista.cy + h * METADE + MARGEM_DA_TELA;
  /** O fio, ao menos em parte, cai na tela? */
  const naTela = (s: Pick<Seg, "a" | "b">) =>
    Math.max(s.a.x, s.b.x) >= x0 &&
    Math.min(s.a.x, s.b.x) <= x1 &&
    Math.max(s.a.y, s.b.y) >= y0 &&
    Math.min(s.a.y, s.b.y) <= y1;

  const cor = new Map(e.areas.map((a) => [a.id, a.cor]));
  manchasDe(e.nos, e.areas).forEach((m) => {
    const c = cor.get(m.id) ?? "#777777";
    const raio = m.raio * RAIO_DA_MANCHA;
    const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, raio);
    g.addColorStop(0, `rgba(${rgb(c)}, ${OPACIDADE_DA_MANCHA})`);
    g.addColorStop(1, `rgba(${rgb(c)}, 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(m.x - raio, m.y - raio, raio * 2, raio * 2);
    ctx.font = `700 ${LETRA_DA_AREA}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = `rgba(${rgb(c)}, ${OPACIDADE_DO_NOME})`;
    ctx.fillText(m.titulo, m.x, m.y);
  });

  // a aura de cada poder: um halo onde leis e índices não entram
  e.auras.forEach((a) => {
    const g = ctx.createRadialGradient(
      a.x,
      a.y,
      a.raio * MIOLO_DA_AURA,
      a.x,
      a.y,
      a.raio,
    );
    g.addColorStop(0, `rgba(${rgb(a.cor)}, 0)`);
    g.addColorStop(1, `rgba(${rgb(a.cor)}, ${OPACIDADE_DA_AURA})`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(a.x, a.y, a.raio, 0, GIRO);
    ctx.fill();
    ctx.lineWidth = ESPESSURA_DO_CONTORNO_DA_AURA * px;
    ctx.strokeStyle = `rgba(${rgb(a.cor)}, ${OPACIDADE_DO_CONTORNO_DA_AURA})`;
    ctx.stroke();
  });

  // as cadeiras do Congresso, voltadas para o centro: uma passada por cor
  p.cadeiras.forEach(([c, lista]) => {
    ctx.beginPath();
    lista.forEach((a) => {
      ctx.moveTo(a.x + a.raio, a.y);
      ctx.arc(a.x, a.y, a.raio, 0, GIRO);
    });
    ctx.fillStyle = c;
    ctx.fill();
  });
  if (p.cadeirasDoGoverno.length) {
    ctx.beginPath();
    p.cadeirasDoGoverno.forEach((a) => {
      ctx.moveTo(a.x + a.raio, a.y);
      ctx.arc(a.x, a.y, a.raio, 0, GIRO);
    });
    ctx.lineWidth = ESPESSURA_DO_GOVERNO * px;
    ctx.strokeStyle = CONTORNO_DO_GOVERNO;
    ctx.stroke();
  }

  /** Risca uma lista de fios num traço só. */
  const tracar = (
    lista: readonly Seg[],
    rgbDaCor: string,
    espessura: number,
    opacidade: number,
  ) => {
    ctx.beginPath();
    lista.forEach((s) => {
      if (!naTela(s)) return;
      ctx.moveTo(s.a.x, s.a.y);
      ctx.lineTo(s.b.x, s.b.y);
    });
    ctx.lineWidth = espessura * px;
    ctx.strokeStyle = `rgba(${rgbDaCor}, ${opacidade})`;
    ctx.stroke();
  };
  const temFoco = e.foco !== null;
  tracar(
    p.esqueleto,
    OURO,
    ESPESSURA_DA_HIERARQUIA,
    temFoco ? OPACIDADE_DA_HIERARQUIA_APAGADA : OPACIDADE_DA_HIERARQUIA,
  );
  const fundo = temFoco ? OPACIDADE_DO_FIO_APAGADO : OPACIDADE_DO_FIO;
  tracar(p.positivos, VERDE, ESPESSURA_DO_FIO, fundo);
  tracar(p.negativos, VERMELHO, ESPESSURA_DO_FIO, fundo);

  const focais = temFoco ? (p.incidentes.get(e.foco as string) ?? []) : [];
  if (temFoco) {
    // um poder em foco: linhas azuis até tudo o que ele alcança agora
    const origem = p.porId.get(e.foco as string);
    if (origem && (e.foco as string).startsWith(PREFIXO_PODER))
      tracar(
        [...e.vizinhos].flatMap((v) => {
          const b = p.porId.get(v);
          return b ? [{ a: origem, b, tipo: "poder", sinal: 1 } as Seg] : [];
        }),
        AZUL,
        ESPESSURA_DO_FIO_EM_FOCO,
        OPACIDADE_DO_FIO_EM_FOCO,
      );
    tracar(
      focais.filter((s) => s.tipo === "hierarquia" || s.tipo === "lateral"),
      OURO,
      ESPESSURA_DO_FIO_EM_FOCO,
      OPACIDADE_DO_FIO_EM_FOCO,
    );
    tracar(
      focais.filter((s) => s.tipo === "efeito" && s.sinal > 0),
      VERDE,
      ESPESSURA_DO_FIO_EM_FOCO,
      OPACIDADE_DO_FIO_EM_FOCO,
    );
    tracar(
      focais.filter((s) => s.tipo === "efeito" && s.sinal < 0),
      VERMELHO,
      ESPESSURA_DO_FIO_EM_FOCO,
      OPACIDADE_DO_FIO_EM_FOCO,
    );
  }

  // o caminho de um índice em alerta vibra na cor do estado, do centro até ele
  p.alertados.forEach((al) => {
    if (!naTela(al.seg)) return;
    const estilo = ESTILO_DO_ALERTA[al.estado];
    const onda = e.animar
      ? Math.sin((e.tempo / (estilo.periodo * al.ritmo) + al.fase) * GIRO)
      : 0;
    const forca = 1 + estilo.vibracao * onda;
    ctx.beginPath();
    ctx.moveTo(al.seg.a.x, al.seg.a.y);
    ctx.lineTo(al.seg.b.x, al.seg.b.y);
    if (estilo.halo > 0 && !e.reduzido) {
      ctx.lineWidth = estilo.espessura * estilo.halo * forca * px;
      ctx.strokeStyle = `rgba(${estilo.cor}, ${OPACIDADE_DO_HALO_DO_ALERTA * forca})`;
      ctx.stroke();
    }
    ctx.lineWidth = estilo.espessura * forca * px;
    ctx.strokeStyle = `rgba(${estilo.cor}, ${Math.min(1, estilo.base * forca)})`;
    ctx.stroke();
  });
  if (!e.animar) return;

  // com uma bolha em foco, os fios de efeito dela vibram (nada corre pelos fios)
  if (!temFoco) return;
  const onda =
    1 + VIBRACAO_DO_FOCO * Math.sin((e.tempo / PERIODO_DO_FOCO) * GIRO);
  [1, -1].forEach((sinal) => {
    ctx.beginPath();
    focais
      .filter((s) => s.tipo === "efeito" && s.sinal === sinal)
      .forEach((s) => {
        ctx.moveTo(s.a.x, s.a.y);
        ctx.lineTo(s.b.x, s.b.y);
      });
    ctx.lineWidth = ESPESSURA_DO_FOCO * onda * px;
    ctx.strokeStyle = `rgba(${sinal > 0 ? VERDE : VERMELHO}, ${OPACIDADE_DO_FOCO * onda})`;
    ctx.stroke();
  });
}
