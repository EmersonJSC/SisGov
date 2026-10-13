/**
 * Contas do Congresso (V1-11, docs/v1/desenho/congresso.md, seção 0.1).
 *
 * - Camada 1: o perfil vota em cada bancada com chance proporcional a
 *   e^(−sensibilidade × distância + bônus); as cadeiras saem por D'Hondt.
 * - Camada 2: a nota da bancada numa lei vira a chance de sim (logística).
 * - Camada 3: a cada ano, uma parte das cadeiras vai para a eleição de agora.
 */
import { distancia, type PontoDaBussola } from "../bussola";
import type { Cadeiras, PerfilDoEleitor, RegrasDoCongresso } from "./tipos";

const limitar = (x: number, min: number, max: number) =>
  Math.max(min, Math.min(max, x));

/** Ponto do perfil: a soma dos pesos dos atributos dele, de −10 a +10. */
export function pontoDoPerfil(
  regras: RegrasDoCongresso,
  atributos: Readonly<Record<string, string>>,
): PontoDaBussola {
  const soma = (eixo: "economia" | "costumes") =>
    Object.entries(regras.pontoDoPerfil[eixo]).reduce(
      (total, [atributo, pesos]) =>
        total + (pesos[atributos[atributo] ?? ""] ?? 0),
      0,
    );
  return {
    economia: limitar(soma("economia"), -10, 10),
    costumes: limitar(soma("costumes"), -10, 10),
  };
}

export type Candidato = Readonly<{
  id: string;
  ponto: PontoDaBussola;
  /** Bônus do candidato para cada perfil (na ordem dos perfis). */
  bonus?: (indice: number) => number;
}>;

/** Chance de um perfil votar em cada candidato (somam 1). */
export function chancesDoPerfil(
  ponto: PontoDaBussola,
  candidatos: readonly Candidato[],
  sensibilidade: number,
  indice = 0,
): number[] {
  const u = candidatos.map(
    (c) =>
      -sensibilidade * distancia(ponto, c.ponto) + (c.bonus?.(indice) ?? 0),
  );
  const maior = Math.max(...u);
  const e = u.map((x) => Math.exp(x - maior));
  const total = e.reduce((a, b) => a + b, 0);
  return e.map((x) => x / total);
}

export type Eleicao = Readonly<{
  /** Fatia dos votos de cada candidato (somam 1). */
  fatias: Readonly<Record<string, number>>;
  /** Peso de cada perfil no voto de cada candidato (soma 1 por candidato). */
  eleitor: Readonly<Record<string, readonly number[]>>;
}>;

/** Camada 1: os perfis votam; sai a fatia e o eleitor de cada candidato. */
export function eleger(
  perfis: readonly PerfilDoEleitor[],
  candidatos: readonly Candidato[],
  sensibilidade: number,
): Eleicao {
  const votos = candidatos.map(() => perfis.map(() => 0));
  perfis.forEach((perfil, i) => {
    const chances = chancesDoPerfil(perfil.ponto, candidatos, sensibilidade, i);
    chances.forEach((c, j) => (votos[j][i] = perfil.peso * c));
  });
  const totais = votos.map((v) => v.reduce((a, b) => a + b, 0));
  const geral = totais.reduce((a, b) => a + b, 0);
  return {
    fatias: Object.fromEntries(
      candidatos.map((c, j) => [c.id, geral > 0 ? totais[j] / geral : 0]),
    ),
    eleitor: Object.fromEntries(
      candidatos.map((c, j) => [
        c.id,
        votos[j].map((v) => (totais[j] > 0 ? v / totais[j] : 0)),
      ]),
    ),
  };
}

/** D'Hondt: cada cadeira vai a quem tem o maior votos ÷ (cadeiras + 1). */
export function dhondt(
  fatias: Readonly<Record<string, number>>,
  cadeiras: number,
): Cadeiras {
  const ids = Object.keys(fatias);
  const ganhou: Record<string, number> = Object.fromEntries(
    ids.map((id) => [id, 0]),
  );
  for (let n = 0; n < cadeiras; n++) {
    let melhor = ids[0];
    for (const id of ids)
      if (fatias[id] / (ganhou[id] + 1) > fatias[melhor] / (ganhou[melhor] + 1))
        melhor = id;
    ganhou[melhor] += 1;
  }
  return ganhou;
}

/**
 * Maiores restos: reparte `total` cadeiras na proporção de `quanto`. Empate
 * no resto vai para o id que vem antes.
 */
export function maioresRestos(
  quanto: Readonly<Record<string, number>>,
  total: number,
): Cadeiras {
  const ids = Object.keys(quanto);
  const soma = ids.reduce((a, id) => a + Math.max(0, quanto[id]), 0);
  if (soma <= 0) return Object.fromEntries(ids.map((id) => [id, 0]));
  const exato = ids.map((id) => (Math.max(0, quanto[id]) / soma) * total);
  const inteiro = exato.map(Math.floor);
  let faltam = total - inteiro.reduce((a, b) => a + b, 0);
  const ordem = ids
    .map((_, i) => i)
    .sort((a, b) => exato[b] - inteiro[b] - (exato[a] - inteiro[a]) || a - b);
  for (const i of ordem) {
    if (faltam <= 0) break;
    inteiro[i] += 1;
    faltam -= 1;
  }
  return Object.fromEntries(ids.map((id, i) => [id, inteiro[i]]));
}

/**
 * Camada 3: `taxa` das cadeiras vai para a composição `alvo`, sem arredondar
 * (o total da casa não muda).
 */
export function misturar(
  atual: Readonly<Record<string, number>>,
  alvo: Readonly<Record<string, number>>,
  taxa: number,
): Readonly<Record<string, number>> {
  const ids = [...new Set([...Object.keys(atual), ...Object.keys(alvo)])];
  return Object.fromEntries(
    ids.map((id) => [
      id,
      (1 - taxa) * (atual[id] ?? 0) + taxa * (alvo[id] ?? 0),
    ]),
  );
}

/**
 * Satisfação do perfil: média dos segmentos dele, pesada pelo peso do eixo
 * (como a aprovação, V1-08). Sem segmento, 50.
 */
export function satisfacaoDoPerfil(
  perfil: PerfilDoEleitor,
  pesoDoSegmento: Readonly<Record<string, number>>,
  valores: Readonly<Record<string, number>>,
): number {
  let soma = 0;
  let pesos = 0;
  for (const s of perfil.segmentos) {
    const w = pesoDoSegmento[s] ?? 1;
    soma += w * (valores[s] ?? 50);
    pesos += w;
  }
  return pesos > 0 ? soma / pesos : 50;
}

/**
 * Disposição da bancada com o governo (0 a 100): a satisfação de quem votou
 * nela e a distância até o ponto do jogador.
 */
export function disposicao(
  regras: RegrasDoCongresso,
  satisfacaoDoEleitor: number,
  distanciaDoJogador: number,
): number {
  const { pesoDoEleitor, distanciaZero } = regras.disposicao;
  const perto = 100 * Math.max(0, 1 - distanciaDoJogador / distanciaZero);
  return limitar(
    pesoDoEleitor * satisfacaoDoEleitor + (1 - pesoDoEleitor) * perto,
    0,
    100,
  );
}

/** Parte do eleitor (pesos por perfil) que está em cada segmento. */
export function segmentosDoEleitor(
  perfis: readonly PerfilDoEleitor[],
  eleitor: readonly number[],
): Readonly<Record<string, number>> {
  const parte: Record<string, number> = {};
  perfis.forEach((perfil, i) => {
    for (const s of perfil.segmentos)
      parte[s] = (parte[s] ?? 0) + (eleitor[i] ?? 0);
  });
  return parte;
}

/**
 * O dano das leis a um grupo (0 a 1): os pontos de pressão que vêm das leis
 * que ele vigia, divididos pelo máximo possível.
 */
export function danoDasLeis(
  causas: readonly Readonly<{
    origem: string;
    coeficiente: number;
    constante: number;
    peso: number;
    porPib?: boolean;
  }>[],
  controlesDeLei: ReadonlySet<string>,
  valores: Readonly<Record<string, number>>,
): number {
  let pontos = 0;
  let maximo = 0;
  const pib = valores.pib_nominal ?? 0;
  for (const c of causas) {
    if (!controlesDeLei.has(c.origem)) continue;
    const bruto = valores[c.origem] ?? 0;
    const x = c.porPib ? (pib > 0 ? (bruto / pib) * 100 : 0) : bruto;
    pontos += limitar(c.coeficiente * x + c.constante, 0, Math.abs(c.peso));
    maximo += Math.abs(c.peso);
  }
  return maximo > 0 ? limitar(pontos / maximo, 0, 1) : 0;
}

/**
 * Um passo do fator de influência rumo ao alvo: o dano das leis puxa para
 * baixo, a pressão social do grupo (nível 0 a 3) puxa para cima.
 */
export function passoDaInfluencia(
  regras: RegrasDoCongresso,
  fator: number,
  dano: number,
  nivel = 0,
): number {
  const { minimo, maximo, passo, pesoDaPressao, teto } = regras.influencia;
  const alvo = limitar(
    maximo - (maximo - minimo) * dano + pesoDaPressao * nivel,
    minimo,
    teto,
  );
  return limitar(fator + passo * (alvo - fator), minimo, teto);
}

/**
 * Tamanho da frente de um grupo numa bancada (0 a 1): a parte do eleitor dela
 * na base do grupo, vezes quanto essa parte passa da média do país (a frente
 * se concentra onde a base é forte e some onde é fraca), mais a influência do
 * grupo.
 */
export function frente(
  regras: RegrasDoCongresso,
  base: Readonly<Record<string, number>>,
  parteDoEleitor: Readonly<Record<string, number>>,
  parteDoPais: Readonly<Record<string, number>>,
  influencia: number,
): number {
  const naBase = (parte: Readonly<Record<string, number>>) =>
    Object.entries(base).reduce(
      (total, [segmento, peso]) => total + peso * (parte[segmento] ?? 0),
      0,
    );
  const voto = naBase(parteDoEleitor);
  const media = naBase(parteDoPais);
  const relativo = media > 0 ? voto / media : 0;
  return limitar(
    voto * relativo * (1 + regras.influencia.pesoNaFrente * influencia),
    0,
    1,
  );
}

/** Termos da nota de uma bancada numa lei, cada um de −1 a 1 (camada 2). */
export type TermosDoVoto = Readonly<{
  /** Efeito da lei na satisfação do eleitor dela (pontos ÷ 100). */
  segmentos: number;
  /** Quanto a lei aproxima (+) ou afasta (−) o país da bancada (÷ 10). */
  bussola: number;
  /** (disposição − 50) ÷ 50. */
  disposicao: number;
  /** Frentes a favor menos contra, pesadas pelo tamanho delas. */
  frentes: number;
}>;

/** Camada 2: a chance de cada cadeira da bancada votar sim. */
export function chanceDeSim(
  regras: RegrasDoCongresso,
  termos: TermosDoVoto,
): number {
  const v = regras.voto;
  const t = (x: number) => limitar(x, -1, 1);
  const nota =
    v.pesoDosSegmentos * t(termos.segmentos) +
    v.pesoDaBussola * t(termos.bussola) +
    v.pesoDaDisposicao * t(termos.disposicao) +
    v.pesoDasFrentes * t(termos.frentes);
  return 1 / (1 + Math.exp(-v.inclinacao * nota));
}
