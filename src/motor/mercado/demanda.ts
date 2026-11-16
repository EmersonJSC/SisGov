// Demanda dos pops, oferta e preço do país (src/motor/mercado/mercado.md,
// fatia 6a). Só os produtos que atendem uma cesta (ex.: comida). Tudo em % do
// PIB inicial, a preço base. O motor não conhece nomes de produto.
import { PONTOS_FORCA } from "../efeitos";
import { ESPALHO } from "../populacao";
import type { Mercado, Produto, ReacaoDaCesta } from "./index";
import { alvoDoPreco, type Preco } from "./preco";
import type { Cobertura, ProducaoDoMundo } from "./producao";

const BASE = 100;
/** Quanto a falta ou a sobra mexe no preço: 25% a 175% do base. */
const FORCA_DA_FAIXA = 0.75;

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
}

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

/** Demanda, produção, importação e preço de um produto, dado o que o país produz. */
function linhaDeDemanda(
  p: Produto,
  demanda: number,
  feito: number,
  potencias: ProducaoDoMundo,
  precoMundo: number,
): LinhaDeDemanda {
  const excedente = Object.values(potencias).reduce(
    (s, c) => s + Math.max(0, (c[p.id] ?? 0) - BASE),
    0,
  );
  const importa = Math.min(
    Math.max(0, demanda - feito),
    (excedente * demanda) / BASE,
  );
  const oferta = feito + importa;
  return {
    id: p.id,
    demanda,
    producao: feito,
    importa,
    oferta,
    cobertura: demanda > 0 ? (100 * feito) / demanda : 0,
    preco: precoDoPais(demanda, oferta, importa, precoMundo),
  };
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
  /** Consumo médio por pessoa de cada cesta hoje (1 = o do turno 0). */
  consumo: Record<string, number> = {},
): ContaDoPais {
  const produtos: Record<string, LinhaDeDemanda> = {};
  const noMundo = (id: string) => precosMundo[id]?.valor ?? BASE;
  const noInicio = (id: string) => alvoDoPreco(potencias, id);
  for (const cesta of mercado.cestas) {
    const doGrupo = mercado.produtos.filter((p) => p.cesta?.id === cesta.id);
    if (doGrupo.length === 0 || populacaoBase <= 0) continue;
    const total = (gente: number) =>
      BASE * cesta.tamanho * (gente / populacaoBase);
    const hoje = consumo[cesta.id] ?? 1;
    // Produção declarada: cobertura × demanda do dia 0, com os preços do dia 0.
    const parteInicial = partes(doGrupo, noInicio);
    const producao = (p: Produto) =>
      ((cobertura[p.id] ?? 0) * total(populacaoBase) * parteInicial[p.id]!) /
      BASE;
    const conta = (
      preco: (id: string) => number,
    ): Record<string, LinhaDeDemanda> => {
      const parte = partes(doGrupo, preco);
      return Object.fromEntries(
        doGrupo.map((p) => {
          const demanda = total(pessoas) * hoje * parte[p.id]!;
          return [
            p.id,
            linhaDeDemanda(p, demanda, producao(p), potencias, noMundo(p.id)),
          ];
        }),
      );
    };
    // O preço do país depende da parte de cada um, que depende do preço:
    // duas passadas (a primeira com o preço do mundo) fecham a conta.
    const primeira = conta(noMundo);
    const final = conta((id) => primeira[id]!.preco);
    for (const p of doGrupo) {
      const linha = final[p.id]!;
      if (p.unidade)
        linha.unidades = {
          nome: p.unidade.nome,
          quantas: linha.producao / p.unidade.tamanho,
        };
      produtos[p.id] = linha;
    }
  }
  return { produtos };
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
  /** Cesta → pop → quanto a pessoa consome contra a média (sem isso, 1). */
  quanto: Record<string, Record<string, number>> = {},
  /** Cesta → quanto as leis mudam o preço, em % (tomada `preco_<cesta>`). */
  porLei: Record<string, number> = {},
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
    const preco =
      linhas.reduce((s, l) => s + (l.demanda * l.preco) / demanda, 0) *
      Math.max(0, 1 + (porLei[cesta.id] ?? 0) / 100);
    const falta = linhas.reduce(
      (s, l) =>
        s +
        (l.demanda * Math.max(0, l.demanda - l.oferta)) / l.demanda / demanda,
      0,
    );
    const lista = Object.entries(pops).map(([id, p]) => {
      const q = quanto[cesta.id]?.[id] ?? 1;
      const gasto =
        p.renda > 0
          ? (100 * cesta.tamanho * q * (preco / BASE)) / (p.renda / media)
          : 100;
      const faltaPct = 100 * falta;
      return {
        id,
        gasto,
        falta: faltaPct,
        seguranca: limitar(100 - gasto - faltaPct, 0, 100),
      };
    });
    // Dentro do pop a renda se espalha (motor/populacao): a parte mais pobre
    // dele cai abaixo do corte antes da média. Abaixo do corte está quem tem
    // renda menor que a média × gasto ÷ (100 − falta − corte).
    const abaixo = (l: SegurancaDoPop, corte: number) => {
      const folga = 100 - l.falta - corte;
      if (folga <= 0) return 1;
      const razao = l.gasto / folga;
      return limitar((razao - (1 - ESPALHO)) / (2 * ESPALHO), 0, 1);
    };
    const parte = (corte: number) =>
      gente > 0
        ? lista.reduce(
            (s, l) => s + abaixo(l, corte) * pops[l.id]!.pessoas,
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
