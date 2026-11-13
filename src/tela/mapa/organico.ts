/**
 * Layout orgânico do mapa (pedido do autor: bolhas espalhadas, como o Democracy 4).
 * Cada bolha é um objeto físico: tem raio, peso (a repulsão cresce com o raio) e
 * as ligações a puxam para quem ela afeta. A área só dá uma tendência fraca. Os
 * grupos ficam num anel de fora e as potências mais longe ainda.
 *
 * `prepararOrganico` monta a simulação e a deixa viva: a tela continua dando
 * passos (ao mudar o tamanho das bolhas, arrastar uma bolha…). `montarOrganico`
 * roda tudo até assentar e devolve só as posições (testes).
 * O motor não lê nada daqui.
 */
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type Simulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force";
import type { VisaoPartida } from "../../partida";
import { corDaArea } from "./tema";

const TAU = Math.PI * 2;
const COMECO = -Math.PI * 0.5;
const METADE = 0.5;
const DOBRO = 2;

/** Raio de uma bolha sem ligação; cada ligação a mais a faz crescer. */
const RAIO_DA_LEI = 20;
const RAIO_DO_INDICE = 24;
const CRESCIMENTO_POR_LIGACAO = 6;
export const RAIO_MAXIMO = 62;
export const RAIO_MINIMO = 11;
export const RAIO_DO_GRUPO = 44;
export const RAIO_DA_POTENCIA = 60;
export const RAIO_DA_PRESIDENCIA = 130;
const FOLGA = 16;
/** Distância do centro até o canto de cada área. */
const RAIO_DAS_AREAS = 780;
const RAIO_DOS_GRUPOS = 1700;
const RAIO_DAS_POTENCIAS = 2150;
const MARGEM_DOS_GRUPOS = 260;
const FORCA_DA_AREA = 0.025;
const FORCA_DO_ISOLADO = 0.09;
const REPULSAO_POR_RAIO = -9;
const DISTANCIA_DA_LIGACAO = 45;
const PASSOS = 500;
const CASAS = 1;
/** Quanto a energia cai a cada passo: maior = assenta mais depressa. */
const DECAIMENTO = 0.045;
/** A repulsão só vale entre bolhas até esta distância: o resto não pesa. */
const ALCANCE_DA_REPULSAO = 420;
/** Maior = cálculo mais grosso e mais rápido (Barnes-Hut). */
const ABERTURA_DA_ARVORE = 1.2;
/** Passos dados antes da primeira imagem; o resto o mapa assenta à vista. */
export const PASSOS_INICIAIS = 140;
const ANGULO_DOURADO = 2.399963;
const PASSO_DA_ESPIRAL = 22;
const TONS = 4;
const PASSO_DO_TOM = 14;
const PERCENTUAL = 100;

export type TipoDeLei = "petrea" | "constitucional" | "regra";
export type TipoDoNo = "lei" | "indice";

/** Uma bolha. `x`, `y` e `raio` mudam enquanto a simulação anda. */
export type NoVivo = SimulationNodeDatum & {
  readonly id: string;
  readonly tipo: TipoDoNo;
  x: number;
  y: number;
  raio: number;
  /** Para onde o raio anda (a visão escolhida muda o tamanho aos poucos). */
  raioAlvo: number;
  /** Raio sem filtro nenhum: depende só das ligações. */
  readonly raioBase: number;
  readonly area: string;
  readonly cor: string;
  readonly esfera?: string;
  readonly forca?: TipoDeLei;
  readonly alvoX: number;
  readonly alvoY: number;
};

export type ManchaDaArea = Readonly<{
  id: string;
  titulo: string;
  cor: string;
  x: number;
  y: number;
  raio: number;
}>;

export type GrupoNoMapa = Readonly<{
  id: string;
  nome: string;
  x: number;
  y: number;
  valor: number;
}>;

export type PotenciaNoMapa = Readonly<{
  id: string;
  nome: string;
  x: number;
  y: number;
  opiniao: number;
}>;

export type FioDoMapa = Readonly<{
  id: string;
  de: string;
  para: string;
  sinal: 1 | -1;
}>;

export type AreaDoMapa = Readonly<{ id: string; titulo: string; cor: string }>;

export type Preparo = Readonly<{
  nos: readonly NoVivo[];
  fios: readonly FioDoMapa[];
  areas: readonly AreaDoMapa[];
  grupos: readonly GrupoNoMapa[];
  potencias: readonly PotenciaNoMapa[];
  /** Id da bolha → ids das bolhas ligadas a ela. */
  vizinhos: ReadonlyMap<string, readonly string[]>;
  /** Raio que contém tudo, para a vista inicial. */
  alcance: number;
  simulacao: Simulation<NoVivo, undefined>;
}>;

export type MapaOrganico = Readonly<{
  nos: readonly NoVivo[];
  manchas: readonly ManchaDaArea[];
  fios: readonly FioDoMapa[];
  grupos: readonly GrupoNoMapa[];
  potencias: readonly PotenciaNoMapa[];
  alcance: number;
}>;

/** Onde a bolha está e o quanto cresceu, no formato do atributo `transform`. */
export function transformDoNo(n: NoVivo): string {
  const k = n.raio / n.raioBase;
  return `translate(${n.x.toFixed(CASAS)} ${n.y.toFixed(CASAS)}) scale(${k.toFixed(3)})`;
}

export function tipoDaLei(nivel: string | undefined): TipoDeLei {
  if (nivel === "petrea") return "petrea";
  return nivel === "constitucional" ? "constitucional" : "regra";
}

/** Cor da esfera: a da área, clareando um pouco de uma esfera para a outra. */
function corDaEsfera(corDaAreaHex: string, i: number): string {
  const clareamento = (i % TONS) * PASSO_DO_TOM;
  return `color-mix(in srgb, ${corDaAreaHex} ${PERCENTUAL - clareamento}%, white)`;
}

const noPonto = (angulo: number, raio: number) => ({
  x: Math.cos(angulo) * raio,
  y: Math.sin(angulo) * raio,
});

/** Chave que muda só quando muda o conjunto de bolhas ou de ligações. */
export function chaveDoMapa(visao: VisaoPartida): string {
  const leis = visao.leis.map((l) => l.id).join(",");
  const indices = visao.bolhas
    .filter((b) => b.tipo !== "grupo")
    .map((b) => b.id)
    .join(",");
  return `${leis}|${indices}|${visao.ligacoes.length}`;
}

/** Mancha de cada área: o centro e o alcance das bolhas dela, onde estiverem. */
export function manchasDe(
  nos: readonly NoVivo[],
  areas: readonly AreaDoMapa[],
): ManchaDaArea[] {
  return areas.map((a) => {
    const dela = nos.filter((n) => n.area === a.id);
    const quantas = Math.max(1, dela.length);
    const x = dela.reduce((s, n) => s + n.x, 0) / quantas;
    const y = dela.reduce((s, n) => s + n.y, 0) / quantas;
    const raio = dela.reduce(
      (m, n) => Math.max(m, Math.hypot(n.x - x, n.y - y) + n.raio),
      RAIO_DA_PRESIDENCIA,
    );
    return { ...a, x, y, raio };
  });
}

export function prepararOrganico(
  visao: VisaoPartida,
  opcoes: Readonly<{
    passos?: number;
    /** Posições de um mapa anterior, para as bolhas não pularem. */
    anteriores?: ReadonlyMap<string, Readonly<{ x: number; y: number }>>;
  }> = {},
): Preparo {
  const { passos = PASSOS, anteriores } = opcoes;
  const areas = visao.governo.map((a, i) => ({
    id: a.id,
    titulo: a.titulo,
    cor: corDaArea(a.id, i),
  }));
  const ancoras = new Map(
    areas.map((a, i) => [
      a.id,
      noPonto(COMECO + ((i + METADE) * TAU) / areas.length, RAIO_DAS_AREAS),
    ]),
  );
  const esferasDaArea = new Map(
    areas.map((a) => [
      a.id,
      [
        ...new Set(
          visao.leis.filter((l) => l.area === a.id).map((l) => l.esfera ?? ""),
        ),
      ].sort(),
    ]),
  );
  const centro = { x: 0, y: 0 };

  const indicesVisao = visao.bolhas.filter((b) => b.tipo !== "grupo");
  const existentes = new Set([
    ...visao.leis.map((l) => l.id),
    ...indicesVisao.map((b) => b.id),
  ]);
  const fios: FioDoMapa[] = visao.ligacoes
    .filter((l) => existentes.has(l.origem) && existentes.has(l.alvo))
    .map((l) => ({ id: l.id, de: l.origem, para: l.alvo, sinal: l.sinal }));

  const vizinhosPorId = new Map<string, string[]>();
  fios.forEach((f) => {
    vizinhosPorId.set(f.de, [...(vizinhosPorId.get(f.de) ?? []), f.para]);
    vizinhosPorId.set(f.para, [...(vizinhosPorId.get(f.para) ?? []), f.de]);
  });
  // quanto mais ligações, maior a bolha: o que mexe com muita coisa se vê de longe
  const tamanho = (base: number, id: string) =>
    Math.min(
      RAIO_MAXIMO,
      base +
        Math.sqrt(vizinhosPorId.get(id)?.length ?? 0) * CRESCIMENTO_POR_LIGACAO,
    );
  // ponto de partida espalhado em espiral e fixo: o resultado é sempre o mesmo
  const partida = (id: string, i: number) => {
    const antes = anteriores?.get(id);
    if (antes) return { x: antes.x, y: antes.y };
    const angulo = i * ANGULO_DOURADO;
    const raio = Math.sqrt(i + 1) * PASSO_DA_ESPIRAL + RAIO_DA_PRESIDENCIA;
    return { x: Math.cos(angulo) * raio, y: Math.sin(angulo) * raio };
  };

  const leis: NoVivo[] = visao.leis.map((l, i) => {
    const alvo = ancoras.get(l.area) ?? centro;
    const cor = areas.find((a) => a.id === l.area)?.cor ?? "#777";
    const indiceDaEsfera = (esferasDaArea.get(l.area) ?? []).indexOf(
      l.esfera ?? "",
    );
    const raio = tamanho(RAIO_DA_LEI, l.id);
    return {
      id: l.id,
      tipo: "lei",
      raio,
      raioAlvo: raio,
      raioBase: raio,
      area: l.area,
      cor: corDaEsfera(cor, Math.max(0, indiceDaEsfera)),
      esfera: l.esfera,
      forca: tipoDaLei(l.nivelLegal),
      alvoX: alvo.x,
      alvoY: alvo.y,
      ...partida(l.id, i),
    };
  });
  const indices: NoVivo[] = indicesVisao.map((b, i) => {
    const alvo = ancoras.get(b.area) ?? centro;
    const raio = tamanho(RAIO_DO_INDICE, b.id);
    return {
      id: b.id,
      tipo: "indice",
      raio,
      raioAlvo: raio,
      raioBase: raio,
      area: b.area,
      cor: areas.find((a) => a.id === b.area)?.cor ?? "#777",
      alvoX: alvo.x,
      alvoY: alvo.y,
      ...partida(b.id, i + visao.leis.length),
    };
  });
  const nos = [...leis, ...indices];
  // quem não tem ligação nenhuma só tem a área para o puxar
  const forcaDaArea = (n: NoVivo) =>
    vizinhosPorId.has(n.id) ? FORCA_DA_AREA : FORCA_DO_ISOLADO;

  // a Presidência fica parada no centro e as bolhas desviam dela
  const presidencia: NoVivo = {
    id: "presidencia",
    tipo: "indice",
    raio: RAIO_DA_PRESIDENCIA,
    raioAlvo: RAIO_DA_PRESIDENCIA,
    raioBase: RAIO_DA_PRESIDENCIA,
    area: "",
    cor: "",
    alvoX: 0,
    alvoY: 0,
    x: 0,
    y: 0,
    fx: 0,
    fy: 0,
  };

  const simulacao = forceSimulation<NoVivo>([...nos, presidencia])
    .randomSource(() => METADE)
    .alphaDecay(DECAIMENTO)
    .force("x", forceX<NoVivo>((n) => n.alvoX).strength(forcaDaArea))
    .force("y", forceY<NoVivo>((n) => n.alvoY).strength(forcaDaArea))
    .force(
      "repulsao",
      forceManyBody<NoVivo>()
        .strength((n) => n.raio * REPULSAO_POR_RAIO)
        .distanceMax(ALCANCE_DA_REPULSAO)
        .theta(ABERTURA_DA_ARVORE),
    )
    .force(
      "colisao",
      forceCollide<NoVivo>((n) => n.raio + FOLGA),
    )
    .force(
      "ligacoes",
      forceLink<NoVivo, SimulationLinkDatum<NoVivo>>(
        fios.map((f) => ({ source: f.de, target: f.para })),
      )
        .id((n) => n.id)
        .distance(
          (l) =>
            DISTANCIA_DA_LIGACAO +
            (l.source as NoVivo).raio +
            (l.target as NoVivo).raio,
        ),
    )
    .stop();
  simulacao.tick(passos);

  const alcanceDasBolhas = nos.reduce(
    (m, n) => Math.max(m, Math.hypot(n.x, n.y) + n.raio),
    RAIO_DA_PRESIDENCIA,
  );
  const raioDosGrupos = Math.max(
    RAIO_DOS_GRUPOS,
    alcanceDasBolhas + MARGEM_DOS_GRUPOS,
  );
  const grupos = visao.bolhas
    .filter((b) => b.tipo === "grupo")
    .map((g, i, todos) => ({
      id: g.id,
      nome: g.nome,
      valor: g.valor,
      ...noPonto(COMECO + ((i + METADE) * TAU) / todos.length, raioDosGrupos),
    }));
  const raioDasPotencias = Math.max(
    RAIO_DAS_POTENCIAS,
    raioDosGrupos + RAIO_DO_GRUPO + RAIO_DA_POTENCIA * DOBRO,
  );
  const potencias = visao.potencias.map((p, i) => ({
    id: p.id,
    nome: p.nome,
    opiniao: p.opiniao,
    ...noPonto(
      COMECO + ((i + METADE) * TAU) / visao.potencias.length,
      raioDasPotencias,
    ),
  }));

  return {
    nos,
    fios,
    areas,
    grupos,
    potencias,
    vizinhos: vizinhosPorId,
    alcance: raioDasPotencias + RAIO_DA_POTENCIA,
    simulacao,
  };
}

/** Roda a simulação até assentar e devolve só as posições. */
export function montarOrganico(
  visao: VisaoPartida,
  passos?: number,
): MapaOrganico {
  const p = prepararOrganico(visao, { passos });
  return {
    nos: p.nos,
    manchas: manchasDe(p.nos, p.areas),
    fios: p.fios,
    grupos: p.grupos,
    potencias: p.potencias,
    alcance: p.alcance,
  };
}
