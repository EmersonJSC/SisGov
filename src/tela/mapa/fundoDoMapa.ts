/**
 * Fundo do mapa, desenhado num canvas por trás das bolhas: as manchas e os nomes
 * das áreas, os fios entre as bolhas e os raios que correm por eles. Um canvas
 * desenha centenas de linhas por quadro sem custo; em SVG, cada linha movida era
 * uma escrita no documento. Só da tela.
 */
import {
  manchasDe,
  PREFIXO_PODER,
  type AreaDoMapa,
  type AuraDoMapa,
  type FioDoMapa,
  type FixoDoMapa,
  type NoVivo,
} from "./organico";
import type { Assento } from "./assentos";
import { alturaDaVista, type Caixa, type Vista } from "./vistaDoMapa";

const METADE = 0.5;
const OPACIDADE_DA_MANCHA = 0.22;
const RAIO_DA_MANCHA = 1.25;
const LETRA_DA_AREA = 72;
const OPACIDADE_DO_NOME = 0.16;
const ESPESSURA_DO_FIO = 1.4;
const ESPESSURA_DO_FIO_EM_FOCO = 3;
const OPACIDADE_DO_FIO = 0.32;
const OPACIDADE_DO_FIO_EM_FOCO = 0.95;
const OPACIDADE_DO_FIO_APAGADO = 0.1;
const ESPESSURA_DO_RAIO = 3.5;
const BRILHO_DO_RAIO = 8;
const TRECHO_DO_RAIO = 0.05;
/** A cada quantos fios um tem raio correndo mesmo sem foco. */
const FIO_AMBIENTE = 11;
const VARIACOES_DO_ATRASO = 7;
const PASSO_DO_ATRASO = 0.35;
const PERIODO_DO_RAIO = 2400;
const PERIODO_DO_RAIO_EM_FOCO = 1200;
const MIL = 1000;
const OURO = "232, 200, 114";
const CONTORNO_DO_GOVERNO = "#e8c872";
const ESPESSURA_DO_GOVERNO = 1.2;
const OPACIDADE_DA_AURA = 0.2;
const MIOLO_DA_AURA = 0.6;
const OPACIDADE_DO_CONTORNO_DA_AURA = 0.35;
const ESPESSURA_DO_CONTORNO_DA_AURA = 1.5;
const AZUL = "120, 190, 255";
const OPACIDADE_DA_HIERARQUIA = 0.2;
const OPACIDADE_DA_HIERARQUIA_APAGADA = 0.07;
const ESPESSURA_DA_HIERARQUIA = 1.2;
const VERDE = "111, 207, 151";
const VERMELHO = "235, 87, 87";
const CLARO_VERDE = "200, 255, 217";
const CLARO_VERMELHO = "255, 190, 190";
const BASE_HEX = 16;
const DIGITOS_DA_COR = 2;

export type EstadoDoFundo = Readonly<{
  nos: readonly NoVivo[];
  fixos: readonly FixoDoMapa[];
  auras: readonly AuraDoMapa[];
  /** As cadeiras do Congresso, uma bolinha cada. */
  assentos: readonly Assento[];
  fios: readonly FioDoMapa[];
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
}>;

function rgb(hex: string): string {
  const n = (i: number) =>
    parseInt(hex.slice(i, i + DIGITOS_DA_COR), BASE_HEX) || 0;
  return `${n(1)}, ${n(3)}, ${n(5)}`;
}

export function desenharFundo(
  ctx: CanvasRenderingContext2D,
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

  const porId = new Map<string, { x: number; y: number }>([
    ...e.nos.map((n) => [n.id, n] as const),
    ...e.fixos.map((x) => [x.id, x] as const),
  ]);
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
    ctx.arc(a.x, a.y, a.raio, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = ESPESSURA_DO_CONTORNO_DA_AURA * px;
    ctx.strokeStyle = `rgba(${rgb(a.cor)}, ${OPACIDADE_DO_CONTORNO_DA_AURA})`;
    ctx.stroke();
  });

  // as cadeiras do Congresso, voltadas para o centro
  e.assentos.forEach((c) => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.raio, 0, Math.PI * 2);
    ctx.fillStyle = c.cor;
    ctx.fill();
    if (c.governo) {
      ctx.lineWidth = ESPESSURA_DO_GOVERNO * px;
      ctx.strokeStyle = CONTORNO_DO_GOVERNO;
      ctx.stroke();
    }
  });

  const emFoco = (f: FioDoMapa) => e.foco === f.de || e.foco === f.para;
  const tracar = (
    lista: readonly FioDoMapa[],
    rgbDaCor: string,
    espessura: number,
    opacidade: number,
  ) => {
    ctx.beginPath();
    lista.forEach((f) => {
      const a = porId.get(f.de);
      const b = porId.get(f.para);
      if (!a || !b) return;
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    });
    ctx.lineWidth = espessura * px;
    ctx.strokeStyle = `rgba(${rgbDaCor}, ${opacidade})`;
    ctx.stroke();
  };
  const temFoco = e.foco !== null;
  const hierarquicos = e.fios.filter((f) => f.tipo === "hierarquia");
  const efeitos = e.fios.filter((f) => f.tipo === "efeito");
  // a hierarquia vai por baixo, em ouro e fina: é o esqueleto
  tracar(
    hierarquicos.filter((f) => !temFoco || !emFoco(f)),
    OURO,
    ESPESSURA_DA_HIERARQUIA,
    temFoco ? OPACIDADE_DA_HIERARQUIA_APAGADA : OPACIDADE_DA_HIERARQUIA,
  );
  const positivos = efeitos.filter((f) => f.sinal > 0);
  const negativos = efeitos.filter((f) => f.sinal < 0);
  const fundo = temFoco ? OPACIDADE_DO_FIO_APAGADO : OPACIDADE_DO_FIO;
  tracar(
    positivos.filter((f) => !temFoco || !emFoco(f)),
    VERDE,
    ESPESSURA_DO_FIO,
    fundo,
  );
  tracar(
    negativos.filter((f) => !temFoco || !emFoco(f)),
    VERMELHO,
    ESPESSURA_DO_FIO,
    fundo,
  );
  if (temFoco) {
    const focais = e.fios.filter(emFoco);
    // um poder em foco: linhas azuis até tudo o que ele alcança agora
    if (e.foco?.startsWith(PREFIXO_PODER))
      tracar(
        [...e.vizinhos].map((v) => ({
          id: `${e.foco}>${v}`,
          de: e.foco as string,
          para: v,
          tipo: "poder",
          sinal: 1,
        })),
        AZUL,
        ESPESSURA_DO_FIO_EM_FOCO,
        OPACIDADE_DO_FIO_EM_FOCO,
      );
    tracar(
      focais.filter((f) => f.tipo === "hierarquia"),
      OURO,
      ESPESSURA_DO_FIO_EM_FOCO,
      OPACIDADE_DO_FIO_EM_FOCO,
    );
    tracar(
      focais.filter((f) => f.tipo === "efeito" && f.sinal > 0),
      VERDE,
      ESPESSURA_DO_FIO_EM_FOCO,
      OPACIDADE_DO_FIO_EM_FOCO,
    );
    tracar(
      focais.filter((f) => f.tipo === "efeito" && f.sinal < 0),
      VERMELHO,
      ESPESSURA_DO_FIO_EM_FOCO,
      OPACIDADE_DO_FIO_EM_FOCO,
    );
  }
  if (!e.animar) return;

  // o raio: um trecho brilhante que corre da origem ao alvo
  ctx.lineCap = "round";
  ctx.lineWidth = ESPESSURA_DO_RAIO * px;
  efeitos.forEach((f, i) => {
    const focal = temFoco && emFoco(f);
    if (!focal && (temFoco || i % FIO_AMBIENTE !== 0)) return;
    const a = porId.get(f.de);
    const b = porId.get(f.para);
    if (!a || !b) return;
    const periodo = focal ? PERIODO_DO_RAIO_EM_FOCO : PERIODO_DO_RAIO;
    const atraso =
      ((i % VARIACOES_DO_ATRASO) * PASSO_DO_ATRASO * MIL) / periodo;
    const t = (e.tempo / periodo + atraso) % 1;
    const de = Math.max(0, t - TRECHO_DO_RAIO);
    ctx.beginPath();
    ctx.moveTo(a.x + (b.x - a.x) * de, a.y + (b.y - a.y) * de);
    ctx.lineTo(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
    ctx.strokeStyle = `rgb(${f.sinal > 0 ? CLARO_VERDE : CLARO_VERMELHO})`;
    ctx.shadowColor = `rgb(${f.sinal > 0 ? VERDE : VERMELHO})`;
    ctx.shadowBlur = BRILHO_DO_RAIO;
    ctx.stroke();
  });
  ctx.shadowBlur = 0;
}
