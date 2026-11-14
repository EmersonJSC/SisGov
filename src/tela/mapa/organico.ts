/**
 * Layout orgânico do mapa (pedido do autor: bolhas soltas, como o Democracy 4,
 * mas com uma hierarquia por baixo). Do centro para fora:
 *
 *   trindade (presidente do partido, candidato eleito, vice) → ministros →
 *   instituições → leis; os índices ficam presos ao ministro responsável.
 *
 * Cada bolha é um objeto físico: tem raio, peso (a repulsão cresce com o raio) e
 * é puxada pelas ligações. A hierarquia é o esqueleto (puxa forte); os efeitos
 * entre leis e índices cruzam por cima (puxam de leve). Os grupos ficam num anel
 * de fora e as potências mais longe ainda.
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
  forceRadial,
  forceSimulation,
  forceX,
  forceY,
  type Force,
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
const TERCO = 3;

/** Prefixos dos ids que não são lei nem índice (não colidem com eles). */
export const PREFIXO_MINISTRO = "min:";
export const PREFIXO_INSTITUICAO = "inst:";
export const PREFIXO_TRINDADE = "tri:";
export const CENTRO_DA_TRINDADE = `${PREFIXO_TRINDADE}centro`;

/**
 * Prioridade visual (decidida com o autor): Ministro > Instituição > Índice > Lei.
 * Cada degrau tem o seu tamanho, e nenhuma visão faz uma bolha passar para o
 * degrau de cima: as faixas de lei e de índice ficam abaixo da instituição.
 */
export const RAIO_DO_MINISTRO = 58;
export const RAIO_DA_INSTITUICAO = 46;
const RAIO_DO_INDICE = 30;
const RAIO_DA_LEI = 16;
/** Até onde as visões (Nível, Dinheiro…) podem fazer a bolha encolher ou crescer. */
export const FAIXA_DO_RAIO: Readonly<
  Record<"lei" | "indice", Readonly<{ minimo: number; maximo: number }>>
> = {
  lei: { minimo: 11, maximo: 24 },
  indice: { minimo: 24, maximo: 42 },
};
export const RAIO_DO_ROSTO_DA_TRINDADE = 44;
export const RAIO_DO_EMBLEMA = 38;
/**
 * O miolo, em camadas em volta do partido: a trindade no centro (Executivo), os
 * juízes girando em volta dela (Judiciário) e, por fora, o anel das cadeiras do
 * Congresso, a Câmara na metade de cima e o Senado na de baixo, voltadas para
 * dentro. Leis e índices ficam fora do anel (a aura do Legislativo).
 */
export const PREFIXO_PODER = "pod:";
export const PODER_LEGISLATIVO = `${PREFIXO_PODER}legislativo`;
export const PODER_JUDICIARIO = `${PREFIXO_PODER}judiciario`;
/** Raio da órbita dos juízes, em volta da trindade. */
export const RAIO_DA_ORBITA_DOS_JUIZES = 235;
export const RAIO_DO_JUIZ = 20;
/** Faixa do anel das cadeiras. */
export const ANEL_DO_CONGRESSO_DE = 335;
export const ANEL_DO_CONGRESSO_ATE = 395;
/**
 * Instituição sem ministro fica parada logo fora do miolo, no lado do poder que
 * cuida dela: a do Legislativo em cima (a Câmara), a do Judiciário embaixo.
 */
const LADO_DO_PODER = {
  legislativo: -Math.PI * 0.5,
  judiciario: Math.PI * 0.5,
};
const PODER_DO_LADO = {
  legislativo: PODER_LEGISLATIVO,
  judiciario: PODER_JUDICIARIO,
};
const AURA_DO_EXECUTIVO = 175;
const AURA_DO_LEGISLATIVO = 440;
/** Daqui para dentro só o miolo: o resto fica fora da aura do Legislativo, com folga. */
const RAIO_DO_MIOLO = AURA_DO_LEGISLATIVO + 30;
const COR_DO_LEGISLATIVO = "#78bef8";
const COR_SEM_PARTIDO = "#efe4cc";
export const RAIO_DO_GRUPO = 44;
export const RAIO_DA_POTENCIA = 60;
/** Distância do emblema aos três rostos da trindade. */
const DISTANCIA_DO_TRIANGULO = 90;
/** Folga mínima entre duas bolhas: quanto mais alto o degrau, mais ar em volta. */
const FOLGA_POR_TIPO: Readonly<
  Record<"lei" | "indice" | "instituicao" | "ministro", number>
> = {
  lei: 26,
  indice: 34,
  instituicao: 30,
  ministro: 44,
};
/**
 * Cada degrau se repele entre iguais (ministro com ministro, instituição com
 * instituição, índice com índice), além da repulsão de todas as bolhas: assim
 * os de cima se espalham e não ficam colados. Lei também se repele entre leis, mais de leve.
 */
const REPULSAO_ENTRE_IGUAIS: Readonly<
  Record<
    "lei" | "indice" | "instituicao" | "ministro",
    Readonly<{ forca: number; alcance: number }>
  >
> = {
  ministro: { forca: -1400, alcance: 700 },
  instituicao: { forca: -520, alcance: 420 },
  indice: { forca: -320, alcance: 340 },
  lei: { forca: -220, alcance: 260 },
};
/** Em que raio os ministros se alinham, em volta da trindade. */
const RAIO_DO_ANEL_DOS_MINISTROS = 1000;
/** As leis e índices de um ministro se abrem para fora do anel, em pétala. */
const RAIO_DA_PETALA_ALEM = 360;
const FORCA_DA_PETALA = 0.04;
/** Cada ministério pesa isto mais as bolhas dele ao dividir o anel. */
const PESO_BASE_DO_MINISTRO = 6;
const PESO_DA_INSTITUICAO = 3;
const RAIO_DOS_GRUPOS = 1900;
const RAIO_DAS_POTENCIAS = 2400;
const MARGEM_DOS_GRUPOS = 220;
const GRAVIDADE = 0.012;
const FORCA_DO_ANEL = 0.22;
const REPULSAO_POR_RAIO = -7;
/** A hierarquia puxa forte; o efeito entre leis e índices só de leve. */
const FORCA_DA_HIERARQUIA = 0.8;
const FORCA_DO_EFEITO = 0.035;
const DISTANCIA_DA_HIERARQUIA = 70;
const DISTANCIA_DO_EFEITO = 260;
const PASSOS = 500;
const CASAS = 1;
/** Casas decimais da escala da bolha no `transform`. */
const CASAS_DA_ESCALA = 3;
/** Quanto a energia cai a cada passo: maior = assenta mais depressa. */
const DECAIMENTO = 0.045;
/** A repulsão só vale entre bolhas até esta distância: o resto não pesa. */
const ALCANCE_DA_REPULSAO = 420;
/** Espaço pessoal de toda bolha: força e distância (do centro) em que ela empurra as vizinhas. */
const ITERACOES_DA_COLISAO = 3;
const ESPACO_PESSOAL = -420;
const ALCANCE_DO_ESPACO_PESSOAL = 130;
/** Maior = cálculo mais grosso e mais rápido (Barnes-Hut). */
const ABERTURA_DA_ARVORE = 1.2;
/** Passos dados antes da primeira imagem; o resto o mapa assenta à vista. */
export const PASSOS_INICIAIS = 140;
const ANGULO_DOURADO = 2.399963;
const PASSO_DA_ESPIRAL = 18;
const TONS = 4;
const PASSO_DO_TOM = 14;
const PERCENTUAL = 100;
const COR_SEM_AREA = "#777777";

export type TipoDeLei = "petrea" | "constitucional" | "regra";
export type TipoDoNo = "lei" | "indice" | "ministro" | "instituicao";
/** `hierarquia` desce do centro (trindade → ministro → instituição, índice ou lei); `lateral` liga iguais (o gabinete). */
/** `poder`: o que a casa ou o Judiciário alcança; só existe com ele em foco (desenhado no fundo). */
export type TipoDoFio = "efeito" | "hierarquia" | "lateral" | "poder";

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
  /** Lei ou índice que nada no motor afeta nem é afetado por. */
  readonly semEfeito?: boolean;
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
  tipo: TipoDoFio;
  /** Só nos fios de efeito: + melhora, − piora. */
  sinal: 1 | -1;
}>;

/** Peça que não anda: os três rostos da trindade, o emblema e o centro de cada poder. */
export type FixoDoMapa = Readonly<{
  id: string;
  x: number;
  y: number;
  raio: number;
}>;

/** A aura de um poder: leis e índices ficam fora dela; o fundo a desenha como um halo. */
export type AuraDoMapa = Readonly<{
  id: string;
  x: number;
  y: number;
  raio: number;
  cor: string;
}>;

export type AreaDoMapa = Readonly<{ id: string; titulo: string; cor: string }>;

export type Preparo = Readonly<{
  nos: readonly NoVivo[];
  fixos: readonly FixoDoMapa[];
  auras: readonly AuraDoMapa[];
  fios: readonly FioDoMapa[];
  areas: readonly AreaDoMapa[];
  grupos: readonly GrupoNoMapa[];
  potencias: readonly PotenciaNoMapa[];
  /** Id da bolha → ids das bolhas ligadas a ela (hierarquia e efeito). */
  vizinhos: ReadonlyMap<string, readonly string[]>;
  /** Id da bolha → ids das ligadas por efeito (o que dá tamanho). */
  vizinhosDeEfeito: ReadonlyMap<string, readonly string[]>;
  /** Id do índice → id do ministério (molde) responsável por ele. */
  ministroDoIndice: ReadonlyMap<string, string>;
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
  return `translate(${n.x.toFixed(CASAS)} ${n.y.toFixed(CASAS)}) scale(${k.toFixed(CASAS_DA_ESCALA)})`;
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

/** O valor que mais se repete (empate: o primeiro que apareceu). */
function maisComum(valores: readonly string[]): string | undefined {
  const contagem = new Map<string, number>();
  valores.forEach((v) => contagem.set(v, (contagem.get(v) ?? 0) + 1));
  return [...contagem].sort((a, b) => b[1] - a[1])[0]?.[0];
}

// Acento solto depois de decompor a letra: aceita "́" (o agudo de "é" decomposto),
// rejeita "e". Tira os acentos para comparar "Saúde" com "saude".
const ACENTO = /\p{Diacritic}/gu;
const semAcento = (t: string) =>
  t.normalize("NFD").replace(ACENTO, "").toLowerCase();

/** Chave que muda só quando muda o conjunto de bolhas ou de ligações. */
export function chaveDoMapa(visao: VisaoPartida): string {
  const leis = visao.leis.map((l) => l.id).join(",");
  const indices = visao.bolhas
    .filter((b) => b.tipo !== "grupo")
    .map((b) => b.id)
    .join(",");
  const governo = visao.hierarquia?.ministros.map((m) => m.id).join(",") ?? "";
  return `${leis}|${indices}|${visao.ligacoes.length}|${governo}`;
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
      RAIO_DO_EMBLEMA,
    );
    return { ...a, x, y, raio };
  });
}

/** Repulsão só entre bolhas do mesmo degrau: a força enxerga apenas esse subconjunto. */
function repulsaoEntreIguais(
  tipo: keyof typeof REPULSAO_ENTRE_IGUAIS,
): Force<NoVivo, undefined> {
  const { forca, alcance } = REPULSAO_ENTRE_IGUAIS[tipo];
  const interno = forceManyBody<NoVivo>()
    .strength(forca)
    .distanceMax(alcance)
    .theta(ABERTURA_DA_ARVORE);
  const f = ((alpha: number) => interno(alpha)) as Force<NoVivo, undefined>;
  f.initialize = (todos, random) =>
    // as auras (peças paradas) ficam de fora: só os que andam se repelem
    interno.initialize?.(
      todos.filter((n) => n.tipo === tipo && n.fx == null),
      random,
    );
  return f;
}

/**
 * Espaço pessoal: toda bolha que anda (de qualquer degrau) repele todas as outras
 * quando chega perto demais. Curto alcance e forte, para ninguém ficar em cima.
 */
function espacoPessoal(): Force<NoVivo, undefined> {
  const interno = forceManyBody<NoVivo>()
    .strength(ESPACO_PESSOAL)
    .distanceMax(ALCANCE_DO_ESPACO_PESSOAL)
    .theta(ABERTURA_DA_ARVORE);
  const f = ((alpha: number) => interno(alpha)) as Force<NoVivo, undefined>;
  f.initialize = (todos, random) =>
    interno.initialize?.(
      todos.filter((n) => n.fx == null),
      random,
    );
  return f;
}

/**
 * O miolo (trindade, juízes e Congresso) é reservado: nenhuma bolha que anda entra
 * nele. É um limite duro, não uma repulsão, porque as repulsões somadas empurravam
 * leis e índices para dentro.
 */
function foraDoMiolo(): Force<NoVivo, undefined> {
  let moveis: readonly NoVivo[] = [];
  const f = (() => {
    moveis.forEach((n) => {
      const limite = RAIO_DO_MIOLO + n.raio;
      const d = Math.hypot(n.x, n.y);
      if (d >= limite) return;
      const escala = d > 0 ? limite / d : 0;
      n.x = d > 0 ? n.x * escala : limite;
      n.y = d > 0 ? n.y * escala : 0;
    });
  }) as Force<NoVivo, undefined>;
  f.initialize = (todos) => {
    moveis = todos.filter((n) => n.fx == null);
  };
  return f;
}

type LigacaoDaSimulacao = SimulationLinkDatum<NoVivo> & {
  forca: number;
  distancia: number;
};

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
  const corDaAreaId = new Map(areas.map((a) => [a.id, a.cor]));
  const hierarquia = visao.hierarquia;

  const indicesVisao = visao.bolhas.filter((b) => b.tipo !== "grupo");
  const existentes = new Set([
    ...visao.leis.map((l) => l.id),
    ...indicesVisao.map((b) => b.id),
  ]);
  const fiosDeEfeito: FioDoMapa[] = visao.ligacoes
    .filter((l) => existentes.has(l.origem) && existentes.has(l.alvo))
    .map((l) => ({
      id: l.id,
      de: l.origem,
      para: l.alvo,
      tipo: "efeito",
      sinal: l.sinal,
    }));
  const vizinhosDeEfeito = new Map<string, string[]>();
  fiosDeEfeito.forEach((f) => {
    vizinhosDeEfeito.set(f.de, [...(vizinhosDeEfeito.get(f.de) ?? []), f.para]);
    vizinhosDeEfeito.set(f.para, [
      ...(vizinhosDeEfeito.get(f.para) ?? []),
      f.de,
    ]);
  });
  // lei ou índice sem nenhuma ligação (nem com os grupos) não faz nada no motor
  const comAlgumaLigacao = new Set(
    visao.ligacoes.flatMap((l) => [l.origem, l.alvo]),
  );

  // ------------------------------------------------------- quem é de quem --
  const ministroDaLei = hierarquia?.ministroDaLei ?? {};
  const instituicaoDaLei = new Map(
    visao.leis
      .filter((l) => l.esfera)
      .map((l) => [l.id, `${PREFIXO_INSTITUICAO}${l.esfera}`]),
  );
  const instituicoesNoMapa = new Set(
    (hierarquia?.instituicoes ?? []).map(
      (i) => `${PREFIXO_INSTITUICAO}${i.id}`,
    ),
  );
  const ministroDoTema = new Map(
    (hierarquia?.instituicoes ?? []).map((i) => [
      semAcento(i.nome),
      i.ministro,
    ]),
  );
  /** O ministro responsável pelo índice: o das leis ligadas a ele; senão, o do tema. */
  const ministroDoIndice = (id: string, tema: string) =>
    maisComum(
      (vizinhosDeEfeito.get(id) ?? [])
        .map((v) => ministroDaLei[v])
        .filter((m): m is string => Boolean(m)),
    ) ??
    ministroDoTema.get(semAcento(tema)) ??
    undefined;

  // ------------------------------------------------------------- posições --
  const ministrosOrdenados = [...(hierarquia?.ministros ?? [])]
    .map((m) => ({
      m,
      area:
        maisComum(
          visao.leis
            .filter((l) => ministroDaLei[l.id] === m.id)
            .map((l) => l.area),
        ) ?? "",
    }))
    .sort(
      (a, b) =>
        areas.findIndex((x) => x.id === a.area) -
          areas.findIndex((x) => x.id === b.area) ||
        a.m.id.localeCompare(b.m.id),
    );
  // cada ministério ganha do anel uma fatia do tamanho do que cuida
  const pesoDoMinistro = ministrosOrdenados.map(
    ({ m }) =>
      PESO_BASE_DO_MINISTRO +
      m.instituicoes.length * PESO_DA_INSTITUICAO +
      visao.leis.filter((l) => ministroDaLei[l.id] === m.id).length +
      indicesVisao.filter((b) => ministroDoIndice(b.id, b.area) === m.id)
        .length,
  );
  const somaDosPesos = pesoDoMinistro.reduce((a, b) => a + b, 0);
  const anguloDoMinistro = new Map(
    ministrosOrdenados.map(({ m }, i) => [
      m.id,
      COMECO +
        (TAU *
          (pesoDoMinistro.slice(0, i).reduce((a, b) => a + b, 0) +
            pesoDoMinistro[i] * METADE)) /
          somaDosPesos,
    ]),
  );
  const areaDoMinistro = new Map(
    ministrosOrdenados.map((x) => [x.m.id, x.area]),
  );
  const areaDaInstituicao = new Map(
    (hierarquia?.instituicoes ?? []).map((i) => [
      `${PREFIXO_INSTITUICAO}${i.id}`,
      maisComum(
        visao.leis.filter((l) => l.esfera === i.id).map((l) => l.area),
      ) ??
        areaDoMinistro.get(i.ministro ?? "") ??
        "",
    ]),
  );

  /**
   * Ponto de partida: perto de quem puxa a bolha, em espiral e fixo. Cada bolha
   * ganha o seu número, para duas nunca nascerem no mesmo ponto (a física não
   * separa o que começa colado).
   */
  let nascidas = 0;
  const partida = (id: string, pai?: string) => {
    const antes = anteriores?.get(id);
    if (antes) return { x: antes.x, y: antes.y };
    const i = nascidas++;
    const angulo = i * ANGULO_DOURADO;
    const raio = Math.sqrt(i + 1) * PASSO_DA_ESPIRAL;
    const base = pai ? anguloDoMinistro.get(pai) : undefined;
    const centro =
      base === undefined
        ? { x: 0, y: 0 }
        : noPonto(base, RAIO_DO_ANEL_DOS_MINISTROS);
    return {
      x: centro.x + Math.cos(angulo) * raio,
      y: centro.y + Math.sin(angulo) * raio,
    };
  };
  /** Ponto parado da instituição que fica com um poder, fora do miolo. */
  const doPoder = (poder: keyof typeof LADO_DO_PODER) => {
    const p = noPonto(
      LADO_DO_PODER[poder],
      RAIO_DO_MIOLO + RAIO_DA_INSTITUICAO + FOLGA_POR_TIPO.instituicao,
    );
    return { ...p, fx: p.x, fy: p.y };
  };
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

  const ministros: NoVivo[] = ministrosOrdenados.map(({ m, area }) => {
    const id = `${PREFIXO_MINISTRO}${m.id}`;
    const angulo = anguloDoMinistro.get(m.id) ?? COMECO;
    return {
      id,
      tipo: "ministro",
      raio: RAIO_DO_MINISTRO,
      raioAlvo: RAIO_DO_MINISTRO,
      raioBase: RAIO_DO_MINISTRO,
      area,
      cor: corDaAreaId.get(area) ?? COR_SEM_AREA,
      ...(anteriores?.get(id) ?? noPonto(angulo, RAIO_DO_ANEL_DOS_MINISTROS)),
    };
  });
  const instituicoes: NoVivo[] = (hierarquia?.instituicoes ?? []).map(
    (inst) => {
      const id = `${PREFIXO_INSTITUICAO}${inst.id}`;
      const area = areaDaInstituicao.get(id) ?? "";
      return {
        id,
        tipo: "instituicao",
        raio: RAIO_DA_INSTITUICAO,
        raioAlvo: RAIO_DA_INSTITUICAO,
        raioBase: RAIO_DA_INSTITUICAO,
        area,
        cor: corDaAreaId.get(area) ?? COR_SEM_AREA,
        ...(inst.poder
          ? doPoder(inst.poder)
          : partida(id, inst.ministro ?? undefined)),
      };
    },
  );
  const leis: NoVivo[] = visao.leis.map((l) => {
    const cor = corDaAreaId.get(l.area) ?? COR_SEM_AREA;
    const indiceDaEsfera = (esferasDaArea.get(l.area) ?? []).indexOf(
      l.esfera ?? "",
    );
    const raio = RAIO_DA_LEI;
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
      semEfeito: !comAlgumaLigacao.has(l.id),
      ...partida(l.id, ministroDaLei[l.id]),
    };
  });
  const indices: NoVivo[] = indicesVisao.map((b) => {
    const ministro = ministroDoIndice(b.id, b.area);
    const area = (ministro && areaDoMinistro.get(ministro)) || "";
    const raio = RAIO_DO_INDICE;
    return {
      id: b.id,
      tipo: "indice",
      raio,
      raioAlvo: raio,
      raioBase: raio,
      area,
      cor: corDaAreaId.get(area) ?? COR_SEM_AREA,
      semEfeito: !comAlgumaLigacao.has(b.id),
      ...partida(b.id, ministro),
    };
  });
  // a ordem é a do desenho: o que tem mais prioridade fica por cima
  const nos = [...leis, ...indices, ...instituicoes, ...ministros];

  // ------------------------------------------------- peças que não andam --
  const trindade = hierarquia?.trindade;
  const rostos = trindade
    ? [
        { id: `${PREFIXO_TRINDADE}candidato`, angulo: COMECO },
        { id: `${PREFIXO_TRINDADE}presidente`, angulo: COMECO + TAU / TERCO },
        {
          id: `${PREFIXO_TRINDADE}vice`,
          angulo: COMECO + (DOBRO * TAU) / TERCO,
        },
      ].map((r) => ({
        id: r.id,
        raio: RAIO_DO_ROSTO_DA_TRINDADE,
        ...noPonto(r.angulo, DISTANCIA_DO_TRIANGULO),
      }))
    : [];
  const poderes = visao.poderes;
  const doCentro = { x: 0, y: 0 };
  const fixos: FixoDoMapa[] = [
    { id: CENTRO_DA_TRINDADE, ...doCentro, raio: RAIO_DO_EMBLEMA },
    ...rostos,
    ...(poderes
      ? [
          {
            id: PODER_LEGISLATIVO,
            ...doCentro,
            raio: ANEL_DO_CONGRESSO_ATE,
          },
          {
            id: PODER_JUDICIARIO,
            ...doCentro,
            raio: RAIO_DA_ORBITA_DOS_JUIZES,
          },
        ]
      : []),
  ];
  const auras: AuraDoMapa[] = [
    {
      id: "aura:executivo",
      ...doCentro,
      raio: AURA_DO_EXECUTIVO,
      cor: trindade?.cor ?? COR_SEM_PARTIDO,
    },
    ...(poderes
      ? [
          {
            id: "aura:legislativo",
            ...doCentro,
            raio: AURA_DO_LEGISLATIVO,
            cor: COR_DO_LEGISLATIVO,
          },
        ]
      : []),
  ];
  // o corpo da aura é uma peça parada: a física faz as bolhas desviarem dela
  const paraSimulacao: NoVivo[] = auras.map((a) => ({
    id: a.id,
    tipo: "instituicao",
    raio: a.raio,
    raioAlvo: a.raio,
    raioBase: a.raio,
    area: "",
    cor: "",
    x: a.x,
    y: a.y,
    fx: a.x,
    fy: a.y,
  }));

  // ------------------------------------------------------------- ligações --
  const idsDosNos = new Set(nos.map((n) => n.id));
  const raioDe = new Map(nos.map((n) => [n.id, n.raio]));
  const fiosDaHierarquia: FioDoMapa[] = [];
  const hierarquicas: LigacaoDaSimulacao[] = [];
  const pendurar = (de: string, para: string) => {
    if (!idsDosNos.has(de) || !idsDosNos.has(para)) return;
    fiosDaHierarquia.push({
      id: `h:${de}>${para}`,
      de,
      para,
      tipo: "hierarquia",
      sinal: 1,
    });
    hierarquicas.push({
      source: de,
      target: para,
      forca: FORCA_DA_HIERARQUIA,
      distancia:
        DISTANCIA_DA_HIERARQUIA +
        (raioDe.get(de) ?? 0) +
        (raioDe.get(para) ?? 0),
    });
  };
  ministrosOrdenados.forEach(({ m }) => {
    // a trindade manda em todos os ministros: o fio chega ao emblema do meio
    fiosDaHierarquia.push({
      id: `h:${CENTRO_DA_TRINDADE}>${PREFIXO_MINISTRO}${m.id}`,
      de: CENTRO_DA_TRINDADE,
      para: `${PREFIXO_MINISTRO}${m.id}`,
      tipo: "hierarquia",
      sinal: 1,
    });
  });
  (hierarquia?.instituicoes ?? []).forEach((i) => {
    const para = `${PREFIXO_INSTITUICAO}${i.id}`;
    // sem ministro, o poder manda nela: o fio sai do centro dele, como o da trindade
    if (i.poder && poderes)
      fiosDaHierarquia.push({
        id: `h:${PODER_DO_LADO[i.poder]}>${para}`,
        de: PODER_DO_LADO[i.poder],
        para,
        tipo: "hierarquia",
        sinal: 1,
      });
    else pendurar(`${PREFIXO_MINISTRO}${i.ministro}`, para);
  });
  visao.leis.forEach((l) => {
    const inst = instituicaoDaLei.get(l.id);
    if (inst && instituicoesNoMapa.has(inst)) pendurar(inst, l.id);
    else if (ministroDaLei[l.id])
      pendurar(`${PREFIXO_MINISTRO}${ministroDaLei[l.id]}`, l.id);
  });
  indicesVisao.forEach((b) => {
    const ministro = ministroDoIndice(b.id, b.area);
    if (ministro) pendurar(`${PREFIXO_MINISTRO}${ministro}`, b.id);
  });
  const entre = (de: string, para: string): FioDoMapa => ({
    id: `h:${de}>${para}`,
    de,
    para,
    tipo: "lateral",
    sinal: 1,
  });
  // os ministros também se relacionam: cada um com o do lado, fechando o anel
  const fiosDoGabinete: FioDoMapa[] = ministrosOrdenados.map(({ m }, i) =>
    entre(
      `${PREFIXO_MINISTRO}${m.id}`,
      `${PREFIXO_MINISTRO}${ministrosOrdenados[(i + 1) % ministrosOrdenados.length].m.id}`,
    ),
  );
  const fios: FioDoMapa[] = [
    ...fiosDaHierarquia,
    ...fiosDoGabinete,
    ...fiosDeEfeito,
  ];

  const vizinhos = new Map<string, string[]>();
  fios.forEach((f) => {
    vizinhos.set(f.de, [...(vizinhos.get(f.de) ?? []), f.para]);
    vizinhos.set(f.para, [...(vizinhos.get(f.para) ?? []), f.de]);
  });

  const simulacao = forceSimulation<NoVivo>([...nos, ...paraSimulacao])
    .randomSource(() => METADE)
    .alphaDecay(DECAIMENTO)
    .force("x", forceX<NoVivo>(0).strength(GRAVIDADE))
    .force("y", forceY<NoVivo>(0).strength(GRAVIDADE))
    .force(
      "anel",
      forceRadial<NoVivo>(RAIO_DO_ANEL_DOS_MINISTROS, 0, 0).strength((n) =>
        n.tipo === "ministro" ? FORCA_DO_ANEL : 0,
      ),
    )
    .force(
      "petala",
      forceRadial<NoVivo>(
        RAIO_DO_ANEL_DOS_MINISTROS + RAIO_DA_PETALA_ALEM,
        0,
        0,
      ).strength((n) => (n.tipo === "ministro" ? 0 : FORCA_DA_PETALA)),
    )
    .force(
      "repulsao",
      forceManyBody<NoVivo>()
        .strength((n) => n.raio * REPULSAO_POR_RAIO)
        .distanceMax(ALCANCE_DA_REPULSAO)
        .theta(ABERTURA_DA_ARVORE),
    )
    .force("repulsao-ministros", repulsaoEntreIguais("ministro"))
    .force("repulsao-instituicoes", repulsaoEntreIguais("instituicao"))
    .force("repulsao-indices", repulsaoEntreIguais("indice"))
    .force("repulsao-leis", repulsaoEntreIguais("lei"))
    .force("espaco-pessoal", espacoPessoal())
    .force("fora-do-miolo", foraDoMiolo())
    .force(
      "colisao",
      forceCollide<NoVivo>((n) => n.raio + FOLGA_POR_TIPO[n.tipo]).iterations(
        ITERACOES_DA_COLISAO,
      ),
    )
    .force(
      "ligacoes",
      forceLink<NoVivo, LigacaoDaSimulacao>([
        ...hierarquicas,
        ...fiosDeEfeito.map((f) => ({
          source: f.de,
          target: f.para,
          forca: FORCA_DO_EFEITO,
          distancia: DISTANCIA_DO_EFEITO,
        })),
      ])
        .id((n) => n.id)
        .strength((l) => l.forca)
        .distance((l) => l.distancia),
    )
    .stop();
  simulacao.tick(passos);

  const alcanceDasBolhas = nos.reduce(
    (m, n) => Math.max(m, Math.hypot(n.x, n.y) + n.raio),
    RAIO_DO_EMBLEMA,
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
    fixos,
    auras,
    fios,
    areas,
    grupos,
    potencias,
    vizinhos,
    vizinhosDeEfeito,
    ministroDoIndice: new Map(
      indicesVisao.flatMap((b) => {
        const m = ministroDoIndice(b.id, b.area);
        return m ? [[b.id, m] as const] : [];
      }),
    ),
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
