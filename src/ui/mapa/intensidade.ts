/**
 * Intensidade das bolhas (decisão D-43 do plano): cada nó infla ou desinfla
 * conforme o seu valor.
 *
 * - Índice e bolha lenta: pelo valor dentro da própria escala (domínio).
 * - Situação: some (vira um ponto apagado) abaixo do ponto de surgimento;
 *   acima dele cresce com a gravidade e pisca quando fica séria.
 * - Lei: pelo quanto está "ligada" — posição entre as opções, gasto (leis de
 *   dinheiro, comparadas entre si) ou alíquota (impostos, comparados entre si).
 *
 * O tamanho é só da tela; nada aqui volta para o motor.
 */
import type { VisaoBolha, VisaoLei } from "../../app/partida";

export type IntensidadeBolha = Readonly<{
  /** Valor na escala 0–1 do domínio. */
  t: number;
  /** Fator de escala do nó (1 = tamanho de referência). */
  escala: number;
  /** 0 = ruim para o país, 1 = bom; `null` quando a bolha é neutra. */
  bondade: number | null;
  /** Situação acima do ponto de surgimento. */
  ativa: boolean;
  /** Situação séria: pisca. */
  grave: boolean;
}>;

/** Raio de referência dos nós de bolha (o desenho base). */
export const RAIO_BASE_BOLHA = 30;
/** Raio de referência dos nós de lei. */
export const RAIO_BASE_LEI = 23;

const prender = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Curva entre raio proporcional (expoente 1) e área proporcional (0,5):
 * diferenças pequenas continuam visíveis, sem que bolhas altas engulam o mapa.
 */
const curva = (t: number) => Math.pow(t, 0.7);

export function intensidadeDaBolha(bolha: VisaoBolha): IntensidadeBolha {
  const amplitude = bolha.maximo - bolha.minimo || 1;
  const t = prender((bolha.valor - bolha.minimo) / amplitude);
  const bondade =
    bolha.avaliacao === "maior_melhor"
      ? t
      : bolha.avaliacao === "maior_pior"
        ? 1 - t
        : null;
  if (bolha.tipo === "situacao") {
    const surgimento = bolha.surgimento ?? bolha.minimo;
    const ativa = bolha.valor > surgimento;
    const gravidade = prender(
      (bolha.valor - surgimento) / (bolha.maximo - surgimento || 1),
    );
    // Situação boa (o cofre): aparece verde, cresce e não pisca.
    if (bolha.avaliacao === "maior_melhor")
      return {
        t,
        escala: ativa ? 1 + 0.55 * curva(gravidade) : 0.62,
        bondade: ativa ? Math.max(0.75, bondade ?? 0.75) : bondade,
        ativa,
        grave: false,
      };
    return {
      t,
      escala: ativa ? 1 + 0.55 * curva(gravidade) : 0.62,
      bondade: ativa ? Math.min(bondade ?? 0.3, 0.35) : bondade,
      ativa,
      grave: ativa && gravidade >= 0.35,
    };
  }
  // raio entre 19 e 42 (referência 30)
  const raio = 19 + 23 * curva(t);
  return {
    t,
    escala: raio / RAIO_BASE_BOLHA,
    bondade,
    ativa: true,
    grave: false,
  };
}

/** Referências para comparar leis de dinheiro e impostos entre si. */
export type ReferenciaLeis = Readonly<{
  maiorGasto: number;
  maiorAliquota: number;
}>;

export function referenciaDasLeis(leis: readonly VisaoLei[]): ReferenciaLeis {
  let maiorGasto = 1;
  let maiorAliquota = 1;
  for (const lei of leis) {
    if (lei.unidade === "moeda_ano")
      maiorGasto = Math.max(maiorGasto, lei.nivel, lei.meta);
    else if (!lei.opcoes?.length)
      maiorAliquota = Math.max(maiorAliquota, lei.nivel, lei.meta);
  }
  // folga para que a maior lei ainda possa crescer
  return { maiorGasto: maiorGasto * 1.25, maiorAliquota: maiorAliquota * 1.25 };
}

/** Quanto a lei está "ligada", de 0 a 1. */
export function nivelRelativo(
  lei: VisaoLei,
  referencia: ReferenciaLeis,
  valor = lei.nivel,
): number {
  if (lei.opcoes?.length) {
    const valores = lei.opcoes.map((o) => o.valor);
    const min = Math.min(...valores);
    const max = Math.max(...valores);
    return prender((valor - min) / (max - min || 1));
  }
  if (lei.unidade === "moeda_ano")
    return prender(valor / referencia.maiorGasto);
  return prender(valor / referencia.maiorAliquota);
}

/** Fator de escala da lei: raio entre 15 e 31 (referência 23). */
export function escalaDaLei(t: number): number {
  return (15 + 16 * curva(t)) / RAIO_BASE_LEI;
}

/** Cor do anel: vermelho (ruim) → âmbar → verde (bom); ardósia se neutro. */
export function corDaBondade(bondade: number | null): string {
  if (bondade === null) return "#6f8098";
  const paradas = [
    [0, [205, 64, 78]],
    [0.5, [222, 156, 46]],
    [1, [38, 150, 102]],
  ] as const;
  const b = prender(bondade);
  const i = b <= 0.5 ? 0 : 1;
  const [t0, c0] = paradas[i];
  const [t1, c1] = paradas[i + 1];
  const u = (b - t0) / (t1 - t0);
  const c = c0.map((v, k) => Math.round(v + (c1[k] - v) * u));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

/** Caminho de um arco circular de raio r, de 12h no sentido horário. */
export function arco(r: number, fracao: number): string {
  const f = prender(fracao);
  if (f <= 0) return "";
  if (f >= 0.999)
    return `M0,${-r} A${r},${r} 0 1 1 0,${r} A${r},${r} 0 1 1 0,${-r}`;
  const a = -Math.PI / 2 + f * Math.PI * 2;
  const x = Math.cos(a) * r;
  const y = Math.sin(a) * r;
  return `M0,${-r} A${r},${r} 0 ${f > 0.5 ? 1 : 0} 1 ${x},${y}`;
}
