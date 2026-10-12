/**
 * Posições do mapa político. Funções puras: recebem a `VisaoPartida` e o que
 * está aberto ou em foco; devolvem onde desenhar cada esfera, lei e bolha.
 *
 * A posição é só da tela: o motor não lê nada daqui (regra 6 do projeto).
 */
import type {
  VisaoBolha,
  VisaoLei,
  VisaoMinisterio,
  VisaoPartida,
} from "../../app/partida";
import { MEDIDAS, corDaArea } from "./tema";

export const PRESIDENCIA = "presidencia";

export type Ponto = Readonly<{ x: number; y: number }>;

/**
 * Uma esfera do anel: uma área do governo (D-64), com os ministérios reais
 * dentro. `nome` é o id da área.
 */
export type Ministerio = Readonly<{
  nome: string;
  titulo: string;
  /** Título curto, para a esfera vista de longe. */
  curto: string;
  /** Cargo de quem dá o rosto da área. */
  cargo: string;
  faz: string;
  /** Ministérios da área, na ordem do conteúdo. */
  pastas: readonly VisaoMinisterio[];
  cor: string;
  indice: number;
  /** Ângulo do ministério no anel fechado (radianos, 0 = direita). */
  anguloBase: number;
  /** Leis que pertencem ao ministério, inclusive as compartilhadas. */
  leis: readonly string[];
}>;

export type Esfera = Readonly<{
  id: string;
  x: number;
  y: number;
  r: number;
  angulo: number;
  aberta: boolean;
}>;

export type LugarLei = "interna" | "lente" | "presidencia" | "revelada";

export type PosicaoLei = Readonly<{
  id: string;
  x: number;
  y: number;
  r: number;
  /** Esfera onde o nó está desenhado. */
  esfera: string;
  lugar: LugarLei;
  /** Tamanho da letra do rótulo (menor quando a grade aperta). */
  rotulo: number;
}>;

export type PosicaoBolha = Readonly<{
  id: string;
  x: number;
  y: number;
  r: number;
}>;

export type Limites = Readonly<{
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}>;

/** Parte do mapa que não depende do que está aberto: calculada uma vez. */
export type BaseMapa = Readonly<{
  ministerios: readonly Ministerio[];
  porNome: ReadonlyMap<string, Ministerio>;
  leis: ReadonlyMap<string, VisaoLei>;
  /** Leis que mudam por emenda constitucional: também são da Presidência. */
  constitucionais: readonly string[];
  bolhas: ReadonlyMap<string, PosicaoBolha>;
  limites: Limites;
}>;

export type LayoutMapa = Readonly<{
  presidencia: Readonly<{ x: number; y: number; r: number; aberta: boolean }>;
  esferas: ReadonlyMap<string, Esfera>;
  leis: ReadonlyMap<string, PosicaoLei>;
  /** Leis reveladas que não couberam na esfera fechada, por esfera. */
  excedentes: ReadonlyMap<string, number>;
  /** Nome de cada ministério na borda da área aberta, sobre a sua fatia. */
  pastas: readonly RotuloPasta[];
}>;

export type RotuloPasta = Readonly<{
  id: string;
  cargo: string;
  x: number;
  y: number;
  /** Ângulo a partir do centro da esfera (para alinhar o texto). */
  angulo: number;
}>;

const TAU = Math.PI * 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export function ehConstitucional(lei: VisaoLei): boolean {
  return lei.processo === "emenda-constitucional";
}

/**
 * Leis que ficam também no centro, na Presidência: as pétreas (D-65) e, nas
 * áreas ainda no formato antigo, as constitucionais. As constitucionais de
 * três níveis ficam só no ministério (quadradas).
 */
export function ficaNaPresidencia(lei: VisaoLei): boolean {
  return lei.nivelLegal ? lei.nivelLegal === "petrea" : ehConstitucional(lei);
}

const ORDEM_GRUPO: Readonly<Record<string, number>> = {
  orcamentaria: 0,
  tributaria: 1,
  regulatoria: 2,
  institucional: 3,
};

function porGrupoENome(a: VisaoLei, b: VisaoLei) {
  return (
    (ORDEM_GRUPO[a.grupo] ?? 9) - (ORDEM_GRUPO[b.grupo] ?? 9) ||
    a.nome.localeCompare(b.nome, "pt-BR")
  );
}

function anguloBase(indice: number, total: number) {
  return -Math.PI / 2 + (indice * TAU) / total;
}

/** Diferença angular em (−π, π]. */
function diferenca(a: number, b: number) {
  let d = (a - b) % TAU;
  if (d > Math.PI) d -= TAU;
  if (d <= -Math.PI) d += TAU;
  return d;
}

/** Quebra um nome em até `linhas` linhas de no máximo `largura` letras. */
export function quebrarNome(texto: string, largura = 16, linhas = 2) {
  const saida: string[] = [];
  // palavras longas com hífen podem quebrar no hífen ("Seguro-" "desemprego")
  const palavras = texto
    .split(/\s+/)
    .flatMap((p) =>
      p.length > largura && p.includes("-") ? p.split(/(?<=-)/) : [p],
    );
  for (const palavra of palavras) {
    const ultima = saida.length - 1;
    const junta = ultima >= 0 && saida[ultima].endsWith("-") ? "" : " ";
    if (ultima >= 0 && `${saida[ultima]}${junta}${palavra}`.length <= largura)
      saida[ultima] += `${junta}${palavra}`;
    else saida.push(palavra);
  }
  if (saida.length > linhas) {
    const resto = saida.slice(linhas - 1).join(" ");
    saida.length = linhas - 1;
    saida.push(
      resto.length > largura ? `${resto.slice(0, largura - 1)}…` : resto,
    );
  }
  return saida;
}

// ---------------------------------------------------------------------------
// Base: ministérios e bolhas
// ---------------------------------------------------------------------------

export function montarBase(completa: VisaoPartida): BaseMapa {
  // só as leis em vigor ocupam o mapa; as outras ficam no catálogo (D-65)
  const visao = { ...completa, leis: completa.leis.filter((l) => l.emVigor) };
  const areas = visao.governo.filter((area) =>
    visao.leis.some((lei) => lei.areas.includes(area.id)),
  );
  const ordemDaPasta = new Map(
    areas.flatMap((area) => area.ministerios.map((m, i) => [m.id, i])),
  );
  const ministerios = areas.map((area, indice): Ministerio => ({
    nome: area.id,
    titulo: area.titulo,
    curto: area.curto,
    cargo: area.cargo,
    faz: area.faz,
    pastas: area.ministerios,
    cor: corDaArea(area.id, indice),
    indice,
    anguloBase: anguloBase(indice, areas.length),
    // as leis de cada ministério ficam juntas: viram uma fatia da área aberta
    leis: visao.leis
      .filter((lei) => lei.areas.includes(area.id))
      .sort(
        (a, b) =>
          (ordemDaPasta.get(a.ministerioId) ?? 99) -
            (ordemDaPasta.get(b.ministerioId) ?? 99) || porGrupoENome(a, b),
      )
      .map((lei) => lei.id),
  }));
  const porNome = new Map(ministerios.map((m) => [m.nome, m]));
  const leis = new Map(visao.leis.map((lei) => [lei.id, lei]));
  const constitucionais = visao.leis
    .filter(ficaNaPresidencia)
    .map((lei) => lei.id);
  const bolhas = posicionarBolhas(visao, porNome, leis);
  const limites = calcularLimites(bolhas);
  return { ministerios, porNome, leis, constitucionais, bolhas, limites };
}

type Caixa = {
  id: string;
  x: number;
  y: number;
  alvoX: number;
  alvoY: number;
  largura: number;
  altura: number;
};

/** Medida aproximada do rótulo da bolha (mesma regra do desenho). */
export function caixaDaBolha(nome: string) {
  const linhas = quebrarNome(nome, 15, 2);
  const maior = Math.max(...linhas.map((linha) => linha.length));
  return {
    largura: Math.max(2 * MEDIDAS.raioBolhaMaximo + 8, maior * 9.2 + 14),
    // nó + espaço + linhas de 19 unidades
    // o nó no tamanho máximo (as bolhas incham e desincham sem se mover)
    altura: 2 * MEDIDAS.raioBolhaMaximo + 6 + linhas.length * 19,
  };
}

/**
 * Cada bolha fica perto dos ministérios cujas leis a afetam. Bolhas afetadas
 * por muitas áreas vão mais para fora; depois um relaxamento separa os nós e
 * os rótulos para que nada se sobreponha.
 */
function posicionarBolhas(
  visao: VisaoPartida,
  porNome: ReadonlyMap<string, Ministerio>,
  leis: ReadonlyMap<string, VisaoLei>,
): Map<string, PosicaoBolha> {
  const pesos = new Map<string, Map<string, number>>();
  const somar = (bolha: string, ministerio: string, peso: number) => {
    const mapa = pesos.get(bolha) ?? new Map<string, number>();
    mapa.set(ministerio, (mapa.get(ministerio) ?? 0) + peso);
    pesos.set(bolha, mapa);
  };
  const vizinhos = new Map<string, string[]>();
  for (const ligacao of visao.ligacoes) {
    const lei = leis.get(ligacao.origem);
    if (lei) {
      for (const m of lei.areas) somar(ligacao.alvo, m, 1);
      continue;
    }
    if (ligacao.alvo.startsWith("eficacia:")) {
      const alvo = leis.get(ligacao.alvo.slice("eficacia:".length));
      for (const m of alvo?.areas ?? []) somar(ligacao.origem, m, 0.4);
      continue;
    }
    vizinhos.set(ligacao.origem, [
      ...(vizinhos.get(ligacao.origem) ?? []),
      ligacao.alvo,
    ]);
    vizinhos.set(ligacao.alvo, [
      ...(vizinhos.get(ligacao.alvo) ?? []),
      ligacao.origem,
    ]);
  }

  const vetor = new Map<string, { x: number; y: number }>();
  for (const bolha of visao.bolhas) {
    const mapa = pesos.get(bolha.id);
    if (!mapa) continue;
    let x = 0,
      y = 0,
      total = 0;
    for (const [nome, peso] of mapa) {
      const m = porNome.get(nome);
      if (!m) continue;
      x += Math.cos(m.anguloBase) * peso;
      y += Math.sin(m.anguloBase) * peso;
      total += peso;
    }
    if (total > 0) vetor.set(bolha.id, { x: x / total, y: y / total });
  }
  // Bolhas sem lei direta herdam a direção das bolhas vizinhas.
  for (let volta = 0; volta < 3; volta++) {
    for (const bolha of visao.bolhas) {
      if (vetor.has(bolha.id)) continue;
      const lista = (vizinhos.get(bolha.id) ?? [])
        .map((id) => vetor.get(id))
        .filter((v): v is { x: number; y: number } => Boolean(v));
      if (!lista.length) continue;
      vetor.set(bolha.id, {
        x: (lista.reduce((s, v) => s + v.x, 0) / lista.length) * 0.6,
        y: (lista.reduce((s, v) => s + v.y, 0) / lista.length) * 0.6,
      });
    }
  }

  const inicio = MEDIDAS.inicioBolhas;
  // Grupos sociais (SG143) ficam num anel próprio, por fora de tudo.
  const grupos = visao.bolhas.filter((b) => b.tipo === "grupo");
  const ordenadas = [...visao.bolhas]
    .filter((b) => b.tipo !== "grupo")
    .sort((a, b) => a.id.localeCompare(b.id));
  const caixas: Caixa[] = ordenadas.map((bolha: VisaoBolha, i) => {
    const v = vetor.get(bolha.id) ?? {
      x: Math.cos(i * 2.39996),
      y: Math.sin(i * 2.39996) * 0.1,
    };
    const concentracao = Math.min(1, Math.hypot(v.x, v.y));
    const angulo = Math.atan2(v.y, v.x);
    // t = 0 encosta no núcleo; t = 1 vai até a elipse externa.
    const t = 0.12 + (1 - concentracao) * 0.8;
    const x = Math.cos(angulo) * mix(inicio + 40, ELIPSE_EXTERNA.rx - 90, t);
    const y = Math.sin(angulo) * mix(inicio + 40, ELIPSE_EXTERNA.ry - 70, t);
    const { largura, altura } = caixaDaBolha(bolha.nome);
    return { id: bolha.id, x, y, alvoX: x, alvoY: y, largura, altura };
  });

  relaxar(caixas);
  desembaracar(caixas);

  return new Map([
    ...caixas.map((c): [string, PosicaoBolha] => [
      c.id,
      { id: c.id, x: c.x, y: c.y, r: MEDIDAS.raioBolha },
    ]),
    ...posicionarGrupos(grupos, vetor),
  ]);
}

/** Anel dos grupos sociais: a sociedade em volta do governo (SG143). */
export const ELIPSE_GRUPOS = { rx: 2500, ry: 1520 } as const;

/**
 * Cada grupo vai para o lado dos ministérios cujas leis mais o afetam, mas
 * os medalhões se espalham pelo anel para nunca se encostarem.
 */
function posicionarGrupos(
  grupos: readonly VisaoBolha[],
  vetor: ReadonlyMap<string, { x: number; y: number }>,
): [string, PosicaoBolha][] {
  if (!grupos.length) return [];
  const n = grupos.length;
  const itens = grupos
    .map((g, i) => {
      const v = vetor.get(g.id);
      const a = v ? Math.atan2(v.y, v.x) : (i / n) * Math.PI * 2;
      return { id: g.id, a };
    })
    .sort((x, y) => x.a - y.a || x.id.localeCompare(y.id));
  const espaco = ((Math.PI * 2) / n) * 0.92;
  for (let volta = 0; volta < 200; volta++) {
    let mexeu = false;
    for (let i = 0; i < n; i++) {
      const atual = itens[i];
      const prox = itens[(i + 1) % n];
      const gap = i + 1 < n ? prox.a - atual.a : prox.a + Math.PI * 2 - atual.a;
      if (gap < espaco) {
        const passo = (espaco - gap) / 2;
        atual.a -= passo;
        prox.a += passo;
        mexeu = true;
      }
    }
    itens.sort((x, y) => x.a - y.a);
    if (!mexeu) break;
  }
  return itens.map(({ id, a }) => [
    id,
    {
      id,
      x: Math.cos(a) * ELIPSE_GRUPOS.rx,
      y: Math.sin(a) * ELIPSE_GRUPOS.ry,
      r: MEDIDAS.raioGrupo,
    },
  ]);
}

/** Topo da caixa em relação ao centro do nó. */
const TOPO = -MEDIDAS.raioBolhaMaximo;

/** Elipse que contém as bolhas: larga, para caber em telas largas. */
export const ELIPSE_EXTERNA = { rx: 2300, ry: 1360 } as const;

const FOLGA_CAIXAS = 10;

function sobrepoe(a: Caixa, b: Caixa) {
  return (
    Math.abs(a.x - b.x) < (a.largura + b.largura) / 2 + FOLGA_CAIXAS &&
    Math.abs(a.y - b.y) < (a.altura + b.altura) / 2 + FOLGA_CAIXAS
  );
}

/** A caixa inteira fica entre o núcleo de esferas e a elipse externa. */
function dentroDaFaixa(c: Caixa) {
  for (const dy of [TOPO, TOPO + c.altura])
    for (const dx of [-c.largura / 2, 0, c.largura / 2]) {
      const px = c.x + dx;
      const py = c.y + dy;
      if (Math.hypot(px, py) < MEDIDAS.inicioBolhas) return false;
      if (Math.hypot(px / ELIPSE_EXTERNA.rx, py / ELIPSE_EXTERNA.ry) > 1)
        return false;
    }
  return true;
}

/**
 * O relaxamento às vezes trava duas caixas entre o núcleo e a borda. Aqui
 * cada caixa ainda sobreposta procura, em espiral, o lugar livre mais perto.
 */
function desembaracar(caixas: Caixa[]) {
  for (let volta = 0; volta < 8; volta++) {
    let mexeu = false;
    for (const c of caixas) {
      if (!caixas.some((o) => o !== c && sobrepoe(c, o))) continue;
      const x0 = c.x;
      const y0 = c.y;
      let achou = false;
      for (let raio = 16; raio <= 1400 && !achou; raio += 16) {
        // passos de ~12 px ao longo do círculo: a faixa perto da elipse é fina
        const passos = Math.max(32, Math.ceil((raio * Math.PI * 2) / 12));
        for (let k = 0; k < passos && !achou; k++) {
          const a = (k / passos) * Math.PI * 2;
          c.x = x0 + Math.cos(a) * raio;
          c.y = y0 + Math.sin(a) * raio;
          achou =
            dentroDaFaixa(c) && !caixas.some((o) => o !== c && sobrepoe(c, o));
        }
      }
      if (!achou) {
        c.x = x0;
        c.y = y0;
      } else mexeu = true;
    }
    if (!mexeu) break;
  }
}

function relaxar(caixas: Caixa[]) {
  const folga = 10;
  const nucleo = MEDIDAS.inicioBolhas;
  for (let volta = 0; volta < 1200; volta++) {
    const forca = volta < 200 ? 0.02 : 0;
    for (const c of caixas) {
      c.x += (c.alvoX - c.x) * forca;
      c.y += (c.alvoY - c.y) * forca;
    }
    for (let i = 0; i < caixas.length; i++) {
      const a = caixas[i];
      for (let j = i + 1; j < caixas.length; j++) {
        const b = caixas[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const sobraX = (a.largura + b.largura) / 2 + folga - Math.abs(dx);
        if (sobraX <= 0) continue;
        const sobraY = (a.altura + b.altura) / 2 + folga - Math.abs(dy);
        if (sobraY <= 0) continue;
        if (sobraX < sobraY) {
          const passo = (sobraX / 2) * (dx >= 0 ? 1 : -1);
          a.x -= passo;
          b.x += passo;
        } else {
          const passo = (sobraY / 2) * (dy >= 0 ? 1 : -1);
          a.y -= passo;
          b.y += passo;
        }
      }
    }
    // Nada entra no núcleo de esferas: nem o nó, nem o rótulo.
    // E nada sai da elipse externa.
    for (const c of caixas) {
      for (const dy of [TOPO, TOPO + c.altura]) {
        for (const dx of [-c.largura / 2, c.largura / 2]) {
          const px = c.x + dx;
          const py = c.y + dy;
          const e = Math.hypot(px / ELIPSE_EXTERNA.rx, py / ELIPSE_EXTERNA.ry);
          if (e > 1) {
            c.x -= px * (1 - 1 / e);
            c.y -= py * (1 - 1 / e);
          }
        }
      }
      for (const dy of [TOPO, TOPO + c.altura]) {
        for (const dx of [-c.largura / 2, 0, c.largura / 2]) {
          const px = c.x + dx;
          const py = c.y + dy;
          const d = Math.hypot(px, py);
          if (d < nucleo) {
            const fator = (nucleo - d) / Math.max(d, 1);
            c.x += px * fator;
            c.y += py * fator;
          }
        }
      }
    }
  }
}

function calcularLimites(bolhas: ReadonlyMap<string, PosicaoBolha>): Limites {
  let minX: number = -MEDIDAS.inicioBolhas,
    maxX: number = MEDIDAS.inicioBolhas,
    minY: number = -MEDIDAS.inicioBolhas,
    maxY: number = MEDIDAS.inicioBolhas;
  for (const b of bolhas.values()) {
    // grupos são medalhões grandes, com rótulo embaixo
    const grande = b.r > MEDIDAS.raioBolha;
    const lado = grande ? MEDIDAS.raioGrupoMaximo + 40 : 100;
    minX = Math.min(minX, b.x - lado);
    maxX = Math.max(maxX, b.x + lado);
    minY = Math.min(minY, b.y - (grande ? MEDIDAS.raioGrupoMaximo + 10 : 60));
    maxY = Math.max(maxY, b.y + (grande ? MEDIDAS.raioGrupoMaximo + 80 : 90));
  }
  const margem = 60;
  return {
    minX: minX - margem,
    minY: minY - margem,
    maxX: maxX + margem,
    maxY: maxY + margem,
  };
}

// ---------------------------------------------------------------------------
// Layout do momento: esfera aberta e leis reveladas pelo foco
// ---------------------------------------------------------------------------

/**
 * Ângulos do anel com esferas de tamanhos diferentes: vizinhas ficam
 * tangentes e a sobra é repartida. A esfera aberta fica no seu lugar e as
 * outras abrem espaço.
 */
/** Ângulo que cada esfera precisa para não tocar a seguinte. */
function passosDoAnel(
  raios: readonly number[],
  distancias: readonly number[],
): number[] {
  const n = raios.length;
  return raios.map((r, i) => {
    const j = (i + 1) % n;
    const di = distancias[i];
    const dj = distancias[j];
    const corda = r + raios[j] + MEDIDAS.folgaEsferas;
    const cos = (di * di + dj * dj - corda * corda) / (2 * di * dj);
    return Math.acos(Math.max(-1, Math.min(1, cos)));
  });
}

/**
 * Distância do anel em que as esferas fechadas cabem lado a lado: com mais
 * ministérios, o anel se afasta em vez de as esferas se sobreporem.
 */
export function distanciaDoAnel(
  raios: readonly number[],
  aberta: number,
): number {
  let d: number = MEDIDAS.distanciaAnel;
  for (let i = 0; i < 120; i++) {
    const distancias = raios.map((_, j) =>
      j === aberta ? MEDIDAS.distanciaAberta : d,
    );
    const total = passosDoAnel(raios, distancias).reduce((a, b) => a + b, 0);
    if (total <= TAU) break;
    d += 10;
  }
  return d;
}

function angulosDoAnel(
  raios: readonly number[],
  distancias: readonly number[],
  fixa: number,
  base: readonly number[],
): number[] {
  const n = raios.length;
  if (n === 1) return [base[0]];
  const passos = passosDoAnel(raios, distancias);
  const total = passos.reduce((s, p) => s + p, 0);
  const ajustados =
    total < TAU
      ? passos.map((p) => p + (TAU - total) / n)
      : passos.map((p) => (p * TAU) / total);
  const angulos = [0];
  for (let i = 1; i < n; i++) angulos.push(angulos[i - 1] + ajustados[i - 1]);
  const desvio =
    fixa >= 0
      ? base[fixa] - angulos[fixa]
      : Math.atan2(
          angulos.reduce((s, a, i) => s + Math.sin(base[i] - a), 0),
          angulos.reduce((s, a, i) => s + Math.cos(base[i] - a), 0),
        );
  return angulos.map((a) => a + desvio);
}

/** Ordena pontos no sentido horário a partir de um ângulo, em volta de um centro. */
function horario(pontos: Ponto[], centro: Ponto, inicio: number) {
  return [...pontos].sort((a, b) => {
    const aa =
      (Math.atan2(a.y - centro.y, a.x - centro.x) - inicio + TAU * 2) % TAU;
    const ab =
      (Math.atan2(b.y - centro.y, b.x - centro.x) - inicio + TAU * 2) % TAU;
    return aa - ab;
  });
}

/** Meia largura do bloco: nome, "12 leis · 3 constitucionais" ou retrato. */
function larguraDoBloco(
  linhas: readonly string[],
  tamanho: number,
  tamanhoContagem: number,
  r: number,
) {
  const nome = Math.max(...linhas.map((l) => l.length)) * tamanho * 0.56;
  const contagem = 27 * tamanhoContagem * 0.55;
  return Math.max(r, nome / 2, contagem / 2);
}

/** Retrato, nome e contagem no meio da esfera. */
export type BlocoCentral = Readonly<{
  retrato: Readonly<{ x: number; y: number; r: number }>;
  titulo: Readonly<{
    x: number;
    /** Linha de base da primeira linha. */
    y: number;
    linhas: readonly string[];
    tamanho: number;
    entrelinha: number;
  }>;
  contagem: Readonly<{ x: number; y: number; tamanho: number }>;
  caixa: Limites;
}>;

/**
 * Onde ficam o retrato e o nome. Na esfera aberta, o bloco se afasta da
 * Presidência e o nome vai para o lado de fora, deixando a lente livre.
 */
export function blocoCentral(esfera: Esfera, titulo: string): BlocoCentral {
  const linhas = quebrarNome(titulo, 18, 2);
  if (!esfera.aberta) {
    const s = esfera.r / MEDIDAS.raioFechada;
    const r = MEDIDAS.raioRetratoMinistro * s;
    const y = esfera.y - 34 * s;
    const tamanho = (titulo.length > 18 ? 27 : 34) * s;
    const entrelinha = 29 * s;
    const yTitulo = y + r + 44 * s;
    const yContagem = y + r + (linhas.length > 1 ? 100 : 74) * s;
    const meia = larguraDoBloco(linhas, tamanho, 21 * s, r);
    return {
      retrato: { x: esfera.x, y, r },
      titulo: { x: esfera.x, y: yTitulo, linhas, tamanho, entrelinha },
      contagem: { x: esfera.x, y: yContagem, tamanho: 21 * s },
      caixa: {
        minX: esfera.x - meia,
        maxX: esfera.x + meia,
        minY: y - r,
        maxY: yContagem + 6 * s,
      },
    };
  }
  const r = 66;
  const ux = Math.cos(esfera.angulo);
  const uy = Math.sin(esfera.angulo);
  const x = esfera.x + ux * 34;
  const y = esfera.y + uy * 34;
  const tamanho = titulo.length > 18 ? 28 : 32;
  const entrelinha = 31;
  const acima = uy < -0.35;
  const altura = (linhas.length - 1) * entrelinha;
  let yTitulo: number, yContagem: number, minY: number, maxY: number;
  if (acima) {
    yContagem = y - r - 18;
    yTitulo = yContagem - 30 - altura;
    minY = yTitulo - tamanho;
    maxY = y + r;
  } else {
    yTitulo = y + r + 40;
    yContagem = yTitulo + altura + 30;
    minY = y - r;
    maxY = yContagem + 6;
  }
  const meia = larguraDoBloco(linhas, tamanho, 20, r);
  return {
    retrato: { x, y, r },
    titulo: { x, y: yTitulo, linhas, tamanho, entrelinha },
    contagem: { x, y: yContagem, tamanho: 20 },
    caixa: { minX: x - meia, maxX: x + meia, minY, maxY },
  };
}

/**
 * Vagas da esfera aberta numa grade alinhada à tela (assim os rótulos, que
 * ficam abaixo dos nós, nunca se cruzam). Pontos dentro da Presidência formam
 * a lente das leis constitucionais; os de fora, as vagas internas.
 */
function vagasDaEsfera(
  esfera: Esfera,
  bloco: BlocoCentral,
  naLente: number,
  dentro: number,
): { lente: Ponto[]; interna: Ponto[]; passo: number } {
  const rp = MEDIDAS.raioPresidencia;
  const rl = MEDIDAS.raioLei;
  const c = bloco.caixa;
  const livreDoBloco = (p: Ponto) =>
    p.x + 52 < c.minX - 6 ||
    p.x - 52 > c.maxX + 6 ||
    p.y + 62 < c.minY - 6 ||
    p.y - rl > c.maxY + 6;
  const centroLente = (() => {
    const meio = (rp + Math.hypot(esfera.x, esfera.y) - esfera.r) / 2;
    return {
      x: Math.cos(esfera.angulo) * meio,
      y: Math.sin(esfera.angulo) * meio,
    };
  })();
  let melhor: {
    lente: Ponto[];
    interna: Ponto[];
    nota: number;
    passo: number;
  } | null = null;
  // grades da maior para a menor; as menores só quando a área tem muitas
  // leis (V1-09: a Segurança ganhou as de inteligência)
  for (const [dx, dy] of [
    [112, 92],
    [106, 88],
    [100, 84],
    [94, 80],
    [88, 80],
    [82, 80],
  ]) {
    if (melhor && melhor.nota >= 0) break;
    for (const fx of [0, 0.25, 0.5, 0.75]) {
      for (const fy of [0, 0.5]) {
        const lente: Ponto[] = [];
        const interna: Ponto[] = [];
        const n = Math.ceil(esfera.r / dy) + 1;
        for (let j = -n; j <= n; j++) {
          const y = esfera.y + (j + fy) * dy;
          const desloca = (j & 1 ? 0.5 : 0) + fx;
          const m = Math.ceil(esfera.r / dx) + 1;
          for (let i = -m; i <= m; i++) {
            const p = { x: esfera.x + (i + desloca) * dx, y };
            if (Math.hypot(p.x - esfera.x, p.y - esfera.y) + rl > esfera.r - 10)
              continue;
            if (!livreDoBloco(p)) continue;
            // o nó e o rótulo inteiros ficam de um lado da borda da Presidência
            const cantos = [
              [p.x - 46, p.y - rl],
              [p.x + 46, p.y - rl],
              [p.x - 46, p.y + 58],
              [p.x + 46, p.y + 58],
            ].map(([x, y]) => Math.hypot(x, y));
            const c = BLOCO_PRESIDENCIA_ABERTA;
            const livreDoCentro =
              p.x + 46 < c.minX ||
              p.x - 46 > c.maxX ||
              p.y + 58 < c.minY ||
              p.y - rl > c.maxY;
            if (Math.max(...cantos) <= rp - 6 && livreDoCentro) lente.push(p);
            else if (Math.min(...cantos) >= rp + 30) interna.push(p);
          }
        }
        const nota =
          Math.min(lente.length - naLente, 0) * 10 +
          Math.min(interna.length - dentro, 0) * 10 +
          Math.min(lente.length - naLente, 3) +
          Math.min(interna.length - dentro, 3);
        if (!melhor || nota > melhor.nota)
          melhor = { lente, interna, nota, passo: dx };
      }
    }
  }
  const { lente, interna, passo } = melhor!;
  const perto = (alvo: Ponto) => (a: Ponto, b: Ponto) =>
    Math.hypot(a.x - alvo.x, a.y - alvo.y) -
    Math.hypot(b.x - alvo.x, b.y - alvo.y);
  return {
    lente: horario(
      [...lente].sort(perto(centroLente)).slice(0, naLente),
      centroLente,
      -Math.PI / 2,
    ),
    interna: horario(
      [...interna].sort(perto(esfera)).slice(0, dentro),
      esfera,
      -Math.PI / 2,
    ),
    passo,
  };
}

/** Vagas no anel interno de uma esfera fechada, para leis reveladas. */
function vagasReveladas(esfera: Esfera, outras: readonly Esfera[]): Ponto[] {
  // Contas na borda da esfera: não cobrem o retrato nem o nome.
  const raio = esfera.r - 4;
  const quantos = Math.floor((TAU * raio) / 46);
  const vagas: Ponto[] = [];
  for (let k = 0; k < quantos; k++) {
    const a = esfera.angulo + Math.PI + (k * TAU) / quantos;
    const p = {
      x: esfera.x + Math.cos(a) * raio,
      y: esfera.y + Math.sin(a) * raio,
    };
    const encosta = outras.some(
      (o) => o.id !== esfera.id && Math.hypot(p.x - o.x, p.y - o.y) < o.r + 24,
    );
    if (!encosta) vagas.push(p);
  }
  return vagas;
}

/**
 * Caixa do centro compacto da Presidência (retrato menor e Constituição numa
 * linha), usado sempre que alguma área está aberta.
 */
export const BLOCO_PRESIDENCIA_ABERTA: Limites = {
  minX: -120,
  maxX: 120,
  minY: -142,
  maxY: 90,
};

/**
 * Leis constitucionais dentro da Presidência aberta, numa grade alinhada à
 * tela; cada ministério ganha uma fatia voltada para a sua esfera.
 */
function vagasDaPresidencia(base: BaseMapa): {
  vagas: Map<string, Ponto>;
  passo: number;
} {
  const grupos = base.ministerios
    .map((m) => ({
      angulo: m.anguloBase,
      ids: m.leis.filter(
        (id) =>
          base.constitucionais.includes(id) &&
          base.leis.get(id)?.areas[0] === m.nome,
      ),
    }))
    .filter((g) => g.ids.length);
  const total = grupos.reduce((s, g) => s + g.ids.length, 0);
  const saida = new Map<string, Ponto>();
  if (!total) return { vagas: saida, passo: 112 };
  const rp = MEDIDAS.raioPresidencia;
  const c = BLOCO_PRESIDENCIA_ABERTA;
  let passo = 112;
  const angulo = (p: Ponto) => Math.atan2(p.y, p.x);
  let pontos: Ponto[] = [];
  procura: for (const [dx, dy] of [
    [112, 92],
    [104, 88],
    [98, 84],
    [94, 82],
  ]) {
    for (const oy of [0, 20, 40]) {
      for (const ox of [0, 0.25, 0.5]) {
        pontos = [];
        const n = Math.ceil(rp / dy) + 1;
        for (let j = -n; j <= n; j++) {
          const desloca = (j & 1 ? 0.5 : 0) + ox;
          for (let i = -n - 2; i <= n + 2; i++) {
            const p = { x: (i + desloca) * dx, y: j * dy + oy };
            if (Math.hypot(p.x, p.y) + MEDIDAS.raioLeiRevelada > rp - 14)
              continue;
            if (
              p.x + 48 > c.minX &&
              p.x - 48 < c.maxX &&
              p.y + 58 > c.minY &&
              p.y - 22 < c.maxY
            )
              continue;
            pontos.push(p);
          }
        }
        passo = dx;
        if (pontos.length >= total) break procura;
      }
    }
  }
  // Fatias: os pontos em ordem de ângulo, mais distantes primeiro em cada
  // direção; cada grupo pega uma sequência contínua.
  pontos.sort((a, b) => angulo(a) - angulo(b));
  const sobra = pontos.length - total;
  let melhor = { erro: Infinity, inicio: 0, folgas: [] as number[] };
  for (let inicio = 0; inicio < pontos.length; inicio++) {
    // distribui a sobra igualmente entre os grupos
    const folgas = grupos.map(
      (_, i) =>
        Math.floor(((i + 1) * sobra) / grupos.length) -
        Math.floor((i * sobra) / grupos.length),
    );
    let k = inicio;
    let erro = 0;
    grupos.forEach((g, gi) => {
      const fatia = g.ids.length + folgas[gi];
      const meio = pontos[(k + Math.floor(fatia / 2)) % pontos.length];
      erro += Math.abs(diferenca(angulo(meio), g.angulo)) * g.ids.length;
      k += fatia;
    });
    if (erro < melhor.erro) melhor = { erro, inicio, folgas };
  }
  let k = melhor.inicio;
  grupos.forEach((g, gi) => {
    const fatia = g.ids.length + melhor.folgas[gi];
    const escolhidos = Array.from(
      { length: fatia },
      (_, i) => pontos[(k + i) % pontos.length],
    )
      // dentro da fatia, prefere os pontos mais perto da borda (da esfera)
      .sort((a, b) => Math.hypot(b.x, b.y) - Math.hypot(a.x, a.y))
      .slice(0, g.ids.length)
      .sort((a, b) => angulo(a) - angulo(b));
    g.ids.forEach((id, i) => saida.set(id, escolhidos[i]));
    k += fatia;
  });
  return { vagas: saida, passo };
}

/** A letra encolhe junto com a grade, para os rótulos não se tocarem. */
function tamanhoDoRotulo(passo: number) {
  return 14.5 * Math.min(1, passo / 112);
}

export function montarLayout(
  base: BaseMapa,
  aberta: string | null,
  revelar: ReadonlySet<string>,
): LayoutMapa {
  const m = MEDIDAS;
  const presidenciaAberta = aberta === PRESIDENCIA;
  const indiceAberto = base.ministerios.findIndex((x) => x.nome === aberta);
  const raios = base.ministerios.map((_, i) =>
    i === indiceAberto
      ? m.raioAberta
      : indiceAberto >= 0
        ? m.raioFechadaRecuada
        : m.raioFechada,
  );
  const anel = distanciaDoAnel(raios, indiceAberto);
  const distancias = base.ministerios.map((_, i) =>
    i === indiceAberto ? m.distanciaAberta : anel,
  );
  const angulos = angulosDoAnel(
    raios,
    distancias,
    indiceAberto,
    base.ministerios.map((x) => x.anguloBase),
  );
  const esferas = new Map<string, Esfera>();
  base.ministerios.forEach((ministerio, i) => {
    esferas.set(ministerio.nome, {
      id: ministerio.nome,
      x: Math.cos(angulos[i]) * distancias[i],
      y: Math.sin(angulos[i]) * distancias[i],
      r: raios[i],
      angulo: angulos[i],
      aberta: i === indiceAberto,
    });
  });

  const leis = new Map<string, PosicaoLei>();
  const excedentes = new Map<string, number>();
  const pastas: RotuloPasta[] = [];
  const constitucional = new Set(base.constitucionais);

  // 1. Esfera ministerial aberta: lente (constitucionais) + vagas internas.
  if (indiceAberto >= 0) {
    const ministerio = base.ministerios[indiceAberto];
    const esfera = esferas.get(ministerio.nome)!;
    const naLente = ministerio.leis.filter((id) => constitucional.has(id));
    const dentro = ministerio.leis.filter((id) => !constitucional.has(id));
    const bloco = blocoCentral(esfera, ministerio.titulo);
    const vagas = vagasDaEsfera(esfera, bloco, naLente.length, dentro.length);
    vagas.lente.forEach((p, i) =>
      leis.set(naLente[i], {
        id: naLente[i],
        ...p,
        r: m.raioLei,
        esfera: ministerio.nome,
        lugar: "lente",
        rotulo: tamanhoDoRotulo(vagas.passo),
      }),
    );
    vagas.interna.forEach((p, i) =>
      leis.set(dentro[i], {
        id: dentro[i],
        ...p,
        r: m.raioLei,
        esfera: ministerio.nome,
        lugar: "interna",
        rotulo: tamanhoDoRotulo(vagas.passo),
      }),
    );
    pastas.push(...rotulosDasPastas(base, ministerio, esfera, leis));
  }

  // 2. Presidência aberta: todas as constitucionais no anel interno.
  if (presidenciaAberta) {
    const { vagas, passo } = vagasDaPresidencia(base);
    for (const [id, p] of vagas) {
      leis.set(id, {
        id,
        ...p,
        r: m.raioLeiRevelada + 2,
        esfera: PRESIDENCIA,
        lugar: "presidencia",
        rotulo: tamanhoDoRotulo(passo),
      });
    }
  }

  // 3. Leis reveladas pelo foco nas esferas fechadas.
  const porEsfera = new Map<string, string[]>();
  for (const id of revelar) {
    if (leis.has(id)) continue;
    const lei = base.leis.get(id);
    if (!lei) continue;
    const nome = lei.areas[0];
    if (!esferas.has(nome)) continue;
    porEsfera.set(nome, [...(porEsfera.get(nome) ?? []), id]);
  }
  for (const [nome, ids] of porEsfera) {
    const esfera = esferas.get(nome)!;
    const vagas = vagasReveladas(esfera, [...esferas.values()]);
    const ordenadas = [...ids].sort(
      (a, b) =>
        Number(constitucional.has(b)) - Number(constitucional.has(a)) ||
        a.localeCompare(b),
    );
    // Constitucionais nas contas voltadas para a Presidência; as outras,
    // nas voltadas para fora.
    const paraDentro = [...vagas].sort(
      (a, b) => Math.hypot(a.x, a.y) - Math.hypot(b.x, b.y),
    );
    const usadas = new Set<Ponto>();
    ordenadas.slice(0, vagas.length).forEach((id) => {
      const fila = constitucional.has(id)
        ? paraDentro
        : [...paraDentro].reverse();
      const vaga = fila.find((v) => !usadas.has(v))!;
      usadas.add(vaga);
      leis.set(id, {
        id,
        ...vaga,
        r: m.raioLeiRevelada,
        esfera: nome,
        lugar: "revelada",
        rotulo: 14.5,
      });
    });
    if (ordenadas.length > vagas.length)
      excedentes.set(nome, ordenadas.length - vagas.length);
  }

  return {
    presidencia: {
      x: 0,
      y: 0,
      r: m.raioPresidencia,
      aberta: presidenciaAberta,
    },
    esferas,
    leis,
    excedentes,
    pastas,
  };
}

/**
 * O nome de cada ministério fica na borda da área aberta, no meio da sua
 * fatia de leis (as leis de uma pasta ocupam vagas seguidas). Só as leis
 * de dentro contam: as da lente ficam na Presidência.
 */
function rotulosDasPastas(
  base: BaseMapa,
  area: Ministerio,
  esfera: Esfera,
  leis: ReadonlyMap<string, PosicaoLei>,
): RotuloPasta[] {
  if (area.pastas.length < 2) return [];
  return area.pastas.flatMap((pasta) => {
    const pontos = pasta.leis
      .map((id) => leis.get(id))
      .filter((p): p is PosicaoLei => p?.lugar === "interna");
    if (!pontos.length) return [];
    const x = pontos.reduce((s, p) => s + p.x - esfera.x, 0);
    const y = pontos.reduce((s, p) => s + p.y - esfera.y, 0);
    const angulo = Math.atan2(y, x);
    const raio = esfera.r + 30;
    return [
      {
        id: pasta.id,
        cargo: pasta.cargo,
        x: esfera.x + Math.cos(angulo) * raio,
        y: esfera.y + Math.sin(angulo) * raio,
        angulo,
      },
    ];
  });
}
