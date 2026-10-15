/**
 * O voto (V1-39, docs/v1/desenho/eleicao.md, seção 6): cada perfil dá a cada
 * candidato a nota da bússola e os bônus; a chance de voto é o logit do
 * Congresso (`chancesDoPerfil`).
 */
import { distancia, type PontoDaBussola } from "../bussola";
import {
  chancesDoPerfil,
  JOGADOR,
  satisfacaoDoPerfil,
  type Candidato,
  type CongressoDoPacote,
} from "../congresso";
import type {
  EleicaoDoPais,
  Personagem,
  RegrasDaEleicao,
  Rodada,
} from "./tipos";

export type Contexto = Readonly<{
  pacote: CongressoDoPacote;
  regras: RegrasDaEleicao;
  pais: EleicaoDoPais;
  valores: Readonly<Record<string, number>>;
  economiaNoInicio: Readonly<Record<string, number>>;
  ideologia: PontoDaBussola;
}>;

/**
 * Na Presidência o eixo dos costumes pesa menos que no Congresso: o voto
 * presidencial no país segue mais a renda e a vida econômica (pesoDosCostumes).
 */
export function pontoNaUrna(
  regras: RegrasDaEleicao,
  ponto: PontoDaBussola,
): PontoDaBussola {
  return {
    economia: ponto.economia,
    costumes: ponto.costumes * regras.voto.pesoDosCostumes,
  };
}

/** Voto econômico: igual para todos os perfis (sociotrópico). */
export function votoEconomico(ctx: Contexto): number {
  const { pesoEconomico, escalas } = ctx.regras.voto;
  return Object.entries(pesoEconomico).reduce((total, [id, peso]) => {
    const mudou = (ctx.valores[id] ?? 0) - (ctx.economiaNoInicio[id] ?? 0);
    return total + (peso * mudou) / (escalas[id] ?? 1);
  }, 0);
}

/** Quanto o candidato passa da tolerância do partido (0 = nada). */
export function excessoDe(
  regras: RegrasDaEleicao,
  ideologia: PontoDaBussola,
  personagem: Personagem,
): number {
  return Math.max(
    0,
    distancia(ideologia, personagem.ponto) - regras.estranhamento.tolerancia,
  );
}

/**
 * Força da base em cada perfil (0 a 1): a chance de ele votar no partido,
 * com o partido no ponto da ideologia contra as bancadas, dividida pela
 * maior.
 */
export function forcaDaBase(ctx: Contexto): number[] {
  const candidatos: Candidato[] = [
    ...ctx.pacote.bancadas.map((b) => ({ id: b.id, ponto: b.ponto })),
    { id: JOGADOR, ponto: ctx.ideologia },
  ];
  const chances = ctx.pacote.perfis.map((p) =>
    chancesDoPerfil(p.ponto, candidatos, ctx.pacote.regras.sensibilidade).at(
      -1,
    )!,
  );
  const maior = Math.max(...chances, 1e-9);
  return chances.map((c) => c / maior);
}

/** Os candidatos com os bônus de cada perfil. */
export function candidatosDaEleicao(
  ctx: Contexto,
  daDisputa: readonly Personagem[],
  doPartido: string,
  /** Id do presidente no cargo: ganha a vantagem do cargo se concorrer. */
  presidente?: string,
): Candidato[] {
  const v = ctx.regras.voto;
  const economico = votoEconomico(ctx);
  const satisfacao = ctx.pacote.perfis.map((p) =>
    satisfacaoDoPerfil(p, ctx.pacote.pesoDoSegmento, ctx.valores),
  );
  const base = forcaDaBase(ctx);
  return daDisputa.map((c) => {
    const proprio = v.carisma * c.carisma + v.experiencia * c.experiencia;
    const atrai = new Set(c.segmentos);
    const doGoverno = c.id === doPartido;
    const noCargo = doGoverno && c.id === presidente ? v.vantagemDoCargo : 0;
    const estranho = doGoverno
      ? ctx.regras.estranhamento.pesoNoVoto *
        excessoDe(ctx.regras, ctx.ideologia, c)
      : 0;
    return {
      id: c.id,
      ponto: pontoNaUrna(ctx.regras, c.ponto),
      bonus: (i: number) => {
        const perfil = ctx.pacote.perfis[i];
        let b = proprio;
        if (perfil.segmentos.some((s) => atrai.has(s))) b += v.carreira;
        if (doGoverno)
          b +=
            economico +
            (v.pesoDoGoverno * (satisfacao[i] - 50)) / 50 -
            v.custoDeGovernar +
            noCargo -
            estranho * base[i];
        return b;
      },
    };
  });
}

/** Peso de cada perfil na urna: o peso dele vezes o comparecimento. */
function comparecimento(ctx: Contexto): number[] {
  const { atributo, valores } = ctx.pais.comparecimento;
  return ctx.pacote.perfis.map(
    (p) => p.peso * (valores[p.atributos[atributo] ?? ""] ?? 1),
  );
}

export type Contagem = Rodada &
  Readonly<{
    /** % do candidato pedido em cada segmento. */
    porSegmento: Readonly<Record<string, number>>;
  }>;

/** Uma rodada sem sorte: % dos válidos de cada candidato. */
export function contar(
  ctx: Contexto,
  candidatos: readonly Candidato[],
  acompanhar?: string,
): Contagem {
  const pesos = comparecimento(ctx);
  const totais = candidatos.map(() => 0);
  const doSegmento: Record<string, number> = {};
  const noSegmento: Record<string, number> = {};
  const alvo = candidatos.findIndex((c) => c.id === acompanhar);
  ctx.pacote.perfis.forEach((perfil, i) => {
    const chances = chancesDoPerfil(
      pontoNaUrna(ctx.regras, perfil.ponto),
      candidatos,
      ctx.regras.voto.sensibilidade,
      i,
    );
    chances.forEach((c, j) => (totais[j] += pesos[i] * c));
    if (alvo >= 0)
      for (const s of perfil.segmentos) {
        doSegmento[s] = (doSegmento[s] ?? 0) + pesos[i] * chances[alvo];
        noSegmento[s] = (noSegmento[s] ?? 0) + pesos[i];
      }
  });
  const geral = totais.reduce((a, b) => a + b, 0);
  const eleitorado = ctx.pacote.perfis.reduce((s, p) => s + p.peso, 0);
  return {
    votos: Object.fromEntries(
      candidatos.map((c, j) => [
        c.id,
        geral > 0 ? (100 * totais[j]) / geral : 0,
      ]),
    ),
    comparecimento: eleitorado > 0 ? (100 * geral) / eleitorado : 0,
    porSegmento: Object.fromEntries(
      Object.keys(noSegmento).map((s) => [
        s,
        (100 * doSegmento[s]) / noSegmento[s],
      ]),
    ),
  };
}

/** Soma um desvio a cada candidato e volta a fechar 100%. */
export function comSorte(
  votos: Readonly<Record<string, number>>,
  desvios: readonly number[],
): Record<string, number> {
  const ids = Object.keys(votos);
  const mexidos = ids.map((id, i) =>
    Math.max(0.1, votos[id] + (desvios[i] ?? 0)),
  );
  const total = mexidos.reduce((a, b) => a + b, 0);
  return Object.fromEntries(
    ids.map((id, i) => [id, (100 * mexidos[i]) / total]),
  );
}
