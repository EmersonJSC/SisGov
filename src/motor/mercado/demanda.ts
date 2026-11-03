// Demanda dos pops, oferta e preço do país (src/motor/mercado/mercado.md,
// fatia 6a). Só os produtos que atendem uma cesta (ex.: comida). Tudo em % do
// PIB inicial, a preço base. O motor não conhece nomes de produto.
import { PONTOS_FORCA } from "../efeitos";
import type { Mercado, Produto, ReacaoDaCesta } from "./index";
import { alvoDoPreco, type Preco } from "./preco";
import type { Cobertura, ProducaoDoMundo } from "./producao";

const BASE = 100;
/** Quanto a falta ou a sobra mexe no preço: 25% a 175% do base. */
const FORCA_DA_FAIXA = 0.75;
/** Quanto o produtor corta (teto de preço) ou aumenta (piso) a produção. */
const CORTE_MIN = 0.6;
const CORTE_MAX = 1.15;

export interface LinhaDeDemanda {
  id: string;
  /** O que os pops querem comprar, em % do PIB inicial. */
  demanda: number;
  /** O que o país produz (fixo até a 5b), em % do PIB inicial. */
  producao: number;
  /** O que o país compra de fora, limitado ao excedente das potências. */
  importa: number;
  /** Produção + importação. */
  oferta: number;
  /** Produção ÷ demanda, em %. */
  cobertura: number;
  /** Preço no país; 100 = preço base. */
  preco: number;
  /** Quantas unidades (prédios) a produção equivale; ausente sem `unidade`. */
  unidades?: { nome: string; quantas: number };
}

export interface ContaDoPais {
  /** Entrada de cada produto de cesta. */
  produtos: Record<string, LinhaDeDemanda>;
  /** Produtos sem cesta (ficha do setor): demanda cresce com a gente. */
  outros: Record<string, LinhaDeDemanda>;
}

/** O que a ficha do setor faz com um produto (motor/mercado/ficha). */
export interface Ajuste {
  /** Parte da importação que a regra deixa entrar (0 a 1). */
  importacao: number;
  /** Multiplica a produção (eficiência do dono, capital de fora). */
  producao: number;
  /** Multiplica o preço (política da estatal). */
  preco?: number;
  precoMin?: number;
  precoMax?: number;
}

export type Ajustes = Record<string, Ajuste>;

const limitar = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/** Parte de cada produto na cesta: peso ÷ preço, somando 1. */
function partes(
  produtos: Produto[],
  preco: (id: string) => number,
): Record<string, number> {
  const bruto = produtos.map(
    (p) => [p.id, (p.cesta?.peso ?? 0) / Math.max(preco(p.id), 1e-9)] as const,
  );
  const soma = bruto.reduce((s, [, v]) => s + v, 0);
  return Object.fromEntries(
    bruto.map(([id, v]) => [id, soma > 0 ? v / soma : 0]),
  );
}

/** Preço do país: faixa da falta/sobra, misturada com o preço do mundo. */
export function precoDoPais(
  demanda: number,
  oferta: number,
  importa: number,
  precoMundo: number,
): number {
  const menor = Math.min(demanda, oferta);
  const saldo = demanda - oferta;
  const razao = menor > 0 ? limitar(saldo / menor, -1, 1) : saldo > 0 ? 1 : 0;
  const faixa = 1 + FORCA_DA_FAIXA * razao;
  const m = oferta > 0 ? importa / oferta : 0;
  return BASE * faixa * (1 - m + (m * precoMundo) / BASE);
}

/**
 * A conta de cada produto de cesta: demanda dos pops, produção, importação
 * e preço do país. `populacaoBase` é a população do turno 0 (a produção
 * declarada é cobertura × demanda daquele dia).
 */
export function contaDoPais(
  mercado: Mercado,
  potencias: ProducaoDoMundo,
  cobertura: Cobertura,
  populacaoBase: number,
  pessoas: number,
  precosMundo: Record<string, Preco>,
  ajustes: Ajustes = {},
): ContaDoPais {
  const produtos: Record<string, LinhaDeDemanda> = {};
  const noMundo = (id: string) => precosMundo[id]?.valor ?? BASE;
  const noInicio = (id: string) => alvoDoPreco(potencias, id);
  for (const cesta of mercado.cestas) {
    const doGrupo = mercado.produtos.filter((p) => p.cesta?.id === cesta.id);
    if (doGrupo.length === 0 || populacaoBase <= 0) continue;
    const total = (gente: number) =>
      BASE * cesta.tamanho * (gente / populacaoBase);
    // Produção declarada: cobertura × demanda do dia 0, com os preços do dia 0.
    const parteInicial = partes(doGrupo, noInicio);
    const producao = (p: Produto) =>
      ((cobertura[p.id] ?? 0) * total(populacaoBase) * parteInicial[p.id]!) /
      BASE;
    const conta = (
      preco: (id: string) => number,
      corte: Record<string, number> = {},
    ): Record<string, LinhaDeDemanda> => {
      const parte = partes(doGrupo, preco);
      return Object.fromEntries(
        doGrupo.map((p) => {
          const demanda = total(pessoas) * parte[p.id]!;
          const feito =
            producao(p) * (ajustes[p.id]?.producao ?? 1) * (corte[p.id] ?? 1);
          const excedente = Object.values(potencias).reduce(
            (s, c) => s + Math.max(0, (c[p.id] ?? 0) - BASE),
            0,
          );
          const importa =
            Math.min(
              Math.max(0, demanda - feito),
              (excedente * demanda) / BASE,
            ) * (ajustes[p.id]?.importacao ?? 1);
          const oferta = feito + importa;
          return [
            p.id,
            {
              id: p.id,
              demanda,
              producao: feito,
              importa,
              oferta,
              cobertura: demanda > 0 ? (100 * feito) / demanda : 0,
              preco:
                precoDoPais(demanda, oferta, importa, noMundo(p.id)) *
                (ajustes[p.id]?.preco ?? 1),
            } satisfies LinhaDeDemanda,
          ];
        }),
      );
    };
    // O preço do país depende da parte de cada um, que depende do preço:
    // duas passadas (a primeira com o preço do mundo) fecham a conta.
    const primeira = conta(noMundo);
    let final = conta((id) => primeira[id]!.preco);
    // Teto de preço faz o produtor produzir menos; piso faz produzir mais.
    const corte: Record<string, number> = {};
    for (const p of doGrupo) {
      const { precoMin, precoMax } = ajustes[p.id] ?? {};
      const livre = final[p.id]!.preco;
      if (precoMax !== undefined && livre > precoMax)
        corte[p.id] = limitar(precoMax / livre, CORTE_MIN, 1);
      else if (precoMin !== undefined && livre < precoMin)
        corte[p.id] = limitar(precoMin / livre, 1, CORTE_MAX);
    }
    if (Object.keys(corte).length > 0)
      final = conta((id) => primeira[id]!.preco, corte);
    for (const p of doGrupo) {
      const linha = final[p.id]!;
      const { precoMin, precoMax } = ajustes[p.id] ?? {};
      if (precoMax !== undefined) linha.preco = Math.min(linha.preco, precoMax);
      if (precoMin !== undefined) linha.preco = Math.max(linha.preco, precoMin);
      if (p.unidade)
        linha.unidades = {
          nome: p.unidade.nome,
          quantas: linha.producao / p.unidade.tamanho,
        };
      produtos[p.id] = linha;
    }
  }
  const outros: Record<string, LinhaDeDemanda> = {};
  if (populacaoBase > 0)
    for (const p of mercado.produtos) {
      if (p.cesta) continue;
      const a = ajustes[p.id];
      const demanda = (BASE * pessoas) / populacaoBase;
      const feito = (cobertura[p.id] ?? 0) * (pessoas / populacaoBase);
      const excedente = Object.values(potencias).reduce(
        (s, c) => s + Math.max(0, (c[p.id] ?? 0) - BASE),
        0,
      );
      const linha = (corte: number, prender: boolean): LinhaDeDemanda => {
        const produz = feito * (a?.producao ?? 1) * corte;
        const importa =
          Math.min(
            Math.max(0, demanda - produz),
            (excedente * demanda) / BASE,
          ) * (a?.importacao ?? 1);
        const oferta = produz + importa;
        let preco =
          precoDoPais(demanda, oferta, importa, noMundo(p.id)) *
          (a?.preco ?? 1);
        if (prender && a?.precoMax !== undefined)
          preco = Math.min(preco, a.precoMax);
        if (prender && a?.precoMin !== undefined)
          preco = Math.max(preco, a.precoMin);
        return {
          id: p.id,
          demanda,
          producao: produz,
          importa,
          oferta,
          cobertura: demanda > 0 ? (100 * produz) / demanda : 0,
          preco,
        };
      };
      const livre = linha(1, false).preco;
      const corte =
        a?.precoMax !== undefined && livre > a.precoMax
          ? limitar(a.precoMax / livre, CORTE_MIN, 1)
          : a?.precoMin !== undefined && livre < a.precoMin
            ? limitar(a.precoMin / livre, 1, CORTE_MAX)
            : 1;
      outros[p.id] = linha(corte, true);
    }
  return { produtos, outros };
}

/** Fome leve abaixo de 40 de segurança; grave abaixo de 20 (pontos de partida). */
export const FOME_LEVE = 40;
export const FOME_GRAVE = 20;

export interface SegurancaDoPop {
  id: string;
  /** Parte da renda gasta com a cesta, em %. */
  gasto: number;
  /** Falta de comida, em % (igual para todos os pops). */
  falta: number;
  /** 100 − gasto − falta, entre 0 e 100. */
  seguranca: number;
}

export interface SegurancaDaCesta {
  id: string;
  nome: string;
  pops: SegurancaDoPop[];
  /** Segurança média da população, pesada por pessoas (0 a 100). */
  media: number;
  /** % da população em fome leve (inclui a grave) e em fome grave. */
  leve: number;
  grave: number;
}

/** Segurança alimentar por pop (fatia 6b), uma entrada por cesta. */
export function segurancaDaCesta(
  mercado: Mercado,
  conta: ContaDoPais,
  pops: Record<string, { pessoas: number; renda: number }>,
): SegurancaDaCesta[] {
  const gente = Object.values(pops).reduce((s, p) => s + p.pessoas, 0);
  const renda = Object.values(pops).reduce(
    (s, p) => s + p.pessoas * p.renda,
    0,
  );
  const media = gente > 0 ? renda / gente : 0;
  return mercado.cestas.flatMap((cesta) => {
    const linhas = mercado.produtos
      .filter((p) => p.cesta?.id === cesta.id)
      .map((p) => conta.produtos[p.id])
      .filter((l): l is LinhaDeDemanda => l !== undefined);
    const demanda = linhas.reduce((s, l) => s + l.demanda, 0);
    if (demanda <= 0 || media <= 0) return [];
    const preco = linhas.reduce(
      (s, l) => s + (l.demanda * l.preco) / demanda,
      0,
    );
    const falta = linhas.reduce(
      (s, l) =>
        s +
        (l.demanda * Math.max(0, l.demanda - l.oferta)) / l.demanda / demanda,
      0,
    );
    const lista = Object.entries(pops).map(([id, p]) => {
      const gasto =
        p.renda > 0
          ? (100 * cesta.tamanho * (preco / BASE)) / (p.renda / media)
          : 100;
      const faltaPct = 100 * falta;
      return {
        id,
        gasto,
        falta: faltaPct,
        seguranca: limitar(100 - gasto - faltaPct, 0, 100),
      };
    });
    const parte = (corte: number) =>
      gente > 0
        ? lista.reduce(
            (s, l) => s + (l.seguranca < corte ? pops[l.id]!.pessoas : 0),
            0,
          ) *
          (100 / gente)
        : 0;
    return [
      {
        id: cesta.id,
        nome: cesta.nome,
        pops: lista,
        media:
          gente > 0
            ? lista.reduce((s, l) => s + l.seguranca * pops[l.id]!.pessoas, 0) /
              gente
            : 0,
        leve: parte(FOME_LEVE),
        grave: parte(FOME_GRAVE),
      },
    ];
  });
}

/**
 * Fatia 6c: pontos que a comida soma em outros índices. `desvio` é o índice
 * de hoje menos o do turno 0: piora pesa inteira, melhora pesa `ganho` vezes.
 * Voltar ao normal zera o desvio e devolve tudo.
 */
export function reacaoDaCesta(
  reacao: ReacaoDaCesta,
  desvio: number,
): Record<string, number> {
  const parte =
    limitar(desvio / reacao.escala, -1, 1) * (desvio > 0 ? reacao.ganho : 1);
  return reacao.efeitos.reduce<Record<string, number>>(
    (soma, e) => ({
      ...soma,
      [e.indice]:
        (soma[e.indice] ?? 0) + e.sentido * PONTOS_FORCA[e.forca] * parte,
    }),
    {},
  );
}
