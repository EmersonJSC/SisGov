// Fisco: as regras de dinheiro que leem leis pelo papel (onda 1 das leis,
// 14/nov). O mundo diz qual lei faz cada papel; o motor não conhece nomes.
// Comportamento em fisco.md.
import type { IdBase } from "../calculos";
import type { Lei, ValorLei } from "../leis";
import type { Estrato } from "../populacao";

/** Papéis das leis de dinheiro, declarados pelo mundo (fisco.json). */
export interface RegrasDoFisco {
  /** Quantas famílias entram na transferência de um estrato. */
  transferencia?: {
    /** Lei de régua: fração da população que recebe. */
    lei_cobertura: string;
    /** Estrato da transferência; o que passa dele vaza para `vaza_para`. */
    estrato: Estrato;
    vaza_para: Estrato;
  };
  /** Banco Central: quem decide o juro e o que ele persegue. */
  juros?: {
    /** Régua: inflação perseguida (fração ao ano). */
    lei_meta: string;
    /** Régua: taxa básica pedida pelo governo (fração ao ano). */
    lei_taxa: string;
    /** Níveis com `valores.autonomia` de 0 a 1 (BC manda); sem a lei, o governo manda. */
    lei_autonomia: string;
    /** Pontos de juro por ponto de inflação acima da meta. */
    peso_da_meta: number;
  };
  /** Regras de orçamento que, estouradas, disparam a punição. */
  regra_fiscal?: {
    /** Régua: quanto o gasto real pode crescer por ano (fração). */
    lei_teto_gasto?: string;
    /** Régua: resultado primário prometido (% do PIB). */
    lei_meta_resultado?: string;
    /** Régua: dívida máxima (% do PIB). */
    lei_limite_divida?: string;
    /** Régua: arrecadação máxima (fração do PIB). */
    lei_teto_carga?: string;
    /** Níveis com `valores.corte` (fração das verbas), `trava` e `crime`. */
    lei_punicao?: string;
    /** Folga do resultado antes de contar como meta perdida (pontos do PIB). */
    folga_da_meta: number;
    /** Piso de verba de uma instituição, em fração da receita. */
    pisos: { lei: string; instituicao: string }[];
  };
  /** Conta da previdência: benefícios menos contribuições vira o índice. */
  previdencia?: {
    indice: string;
    /** Leis de verba que pagam benefícios. */
    leis_gasto: string[];
    /** Base de imposto da contribuição. */
    base_contribuicao: IdBase;
    /** Pontos do índice por ponto do PIB de déficit. */
    pontos_por_pct_pib: number;
  };
}

/** Número declarado na opção em vigor de uma lei de níveis; sem a lei, `padrao`. */
export function numeroDaOpcao(
  lei: Lei | undefined,
  valor: ValorLei | undefined,
  chave: string,
  padrao: number,
): number {
  if (lei?.forma !== "opcoes" || valor === undefined) return padrao;
  return lei.opcoes.find((o) => o.id === valor)?.valores?.[chave] ?? padrao;
}

/**
 * Parte da transferência que passa do estrato dela: cobrir mais gente do que
 * há no estrato manda o resto ao estrato de cima.
 */
export function vazamento(
  cobertura: number | undefined,
  parteDoEstrato: number,
): number {
  if (cobertura === undefined || cobertura <= parteDoEstrato) return 0;
  return (cobertura - parteDoEstrato) / cobertura;
}

/**
 * Juro-alvo com o Banco Central: o mercado (`alvoDoMercado`) mais a pressão da
 * inflação acima da meta, na parte em que o BC manda; o resto é a taxa pedida
 * pelo governo. Tudo em % ao ano.
 */
export function alvoComBancoCentral(
  alvoDoMercado: number,
  inflacao: number,
  pedido: {
    meta?: number;
    taxa?: number;
    autonomia: number;
    peso_da_meta: number;
  },
): number {
  const doBc =
    alvoDoMercado +
    (pedido.meta === undefined
      ? 0
      : pedido.peso_da_meta * (inflacao - pedido.meta));
  if (pedido.taxa === undefined) return doBc;
  return pedido.autonomia * doBc + (1 - pedido.autonomia) * pedido.taxa;
}

/** O que o orçamento mostra neste turno, para conferir as regras. */
export interface ContaDoTurno {
  /** Gasto real deste turno ÷ do turno 0. */
  gastoReal: number;
  anos: number;
  resultado_primario: number;
  divida_publica: number;
  /** Arrecadação em % do PIB. */
  arrecadacao: number;
}

/** Regras do orçamento estouradas, pelo papel (teto_gasto, meta, limite, carga). */
export function estourosFiscais(
  regra: NonNullable<RegrasDoFisco["regra_fiscal"]>,
  valores: Record<string, ValorLei>,
  conta: ContaDoTurno,
): string[] {
  const num = (id?: string) => {
    const v = id === undefined ? undefined : valores[id];
    return typeof v === "number" ? v : undefined;
  };
  const estouros: string[] = [];
  const teto = num(regra.lei_teto_gasto);
  if (teto !== undefined && conta.gastoReal > Math.pow(1 + teto, conta.anos))
    estouros.push("teto_gasto");
  const meta = num(regra.lei_meta_resultado);
  if (
    meta !== undefined &&
    conta.resultado_primario < meta - regra.folga_da_meta
  )
    estouros.push("meta_resultado");
  const limite = num(regra.lei_limite_divida);
  if (limite !== undefined && conta.divida_publica > limite)
    estouros.push("limite_divida");
  const carga = num(regra.lei_teto_carga);
  if (carga !== undefined && conta.arrecadacao > carga * 100)
    estouros.push("teto_carga");
  return estouros;
}

/** O que a punição em vigor faz quando alguma regra estoura. */
export function punicao(
  leis: Record<string, Lei>,
  regra: NonNullable<RegrasDoFisco["regra_fiscal"]>,
  valores: Record<string, ValorLei>,
): { corte: number; trava: boolean; crime: boolean } {
  const id = regra.lei_punicao;
  const lei = id ? leis[id] : undefined;
  const v = id ? valores[id] : undefined;
  return {
    corte: numeroDaOpcao(lei, v, "corte", 0),
    trava: numeroDaOpcao(lei, v, "trava", 0) > 0,
    crime: numeroDaOpcao(lei, v, "crime", 0) > 0,
  };
}

/** Índice da conta da previdência: déficit em % do PIB vezes os pontos. */
export function indiceDaPrevidencia(
  deficitPctPib: number,
  pontos: number,
  dominio: { min: number; max: number },
): number {
  return Math.min(dominio.max, Math.max(dominio.min, deficitPctPib * pontos));
}
