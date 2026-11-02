// Demanda dos pops, oferta e preço do país (src/motor/mercado/mercado.md,
// fatia 6a). Só os produtos que atendem uma cesta (ex.: comida). Tudo em % do
// PIB inicial, a preço base. O motor não conhece nomes de produto.
import type { Mercado, Produto } from "./index";
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
    ): Record<string, LinhaDeDemanda> => {
      const parte = partes(doGrupo, preco);
      return Object.fromEntries(
        doGrupo.map((p) => {
          const demanda = total(pessoas) * parte[p.id]!;
          const feito = producao(p);
          const excedente = Object.values(potencias).reduce(
            (s, c) => s + Math.max(0, (c[p.id] ?? 0) - BASE),
            0,
          );
          const importa = Math.min(
            Math.max(0, demanda - feito),
            (excedente * demanda) / BASE,
          );
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
              preco: precoDoPais(demanda, oferta, importa, noMundo(p.id)),
            } satisfies LinhaDeDemanda,
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
