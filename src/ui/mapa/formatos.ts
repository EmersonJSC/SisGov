/** Números para o jogador: moeda do país, porcentagens e índices. */

const numero = (valor: number, casas = 1) =>
  valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: casas,
  });

/** Valores em milhões da moeda do país (como a `VisaoPartida` entrega). */
export function moeda(milhoes: number): string {
  const sinal = milhoes < 0 ? "−" : "";
  const v = Math.abs(milhoes);
  if (v >= 1_000_000) return `${sinal}Cr ${numero(v / 1_000_000)} tri`;
  if (v >= 1_000) return `${sinal}Cr ${numero(v / 1_000)} bi`;
  return `${sinal}Cr ${numero(v)} mi`;
}

export function valorDaBolha(valor: number, unidade: string): string {
  switch (unidade) {
    case "percentual_0_100":
      return `${numero(valor, 2)}%`;
    case "percentual_pib":
      return `${numero(valor)}% do PIB`;
    case "taxa_por_100_mil":
      return `${numero(valor)} por 100 mil`;
    case "indice_0_100":
      return `${numero(valor, 0)} / 100`;
    case "moeda_ano":
      return `${moeda(valor)}/ano`;
    default:
      return numero(valor);
  }
}

/** Valor numa medida real (V1-07): casas conforme o tamanho do número. */
export function valorReal(valor: number): string {
  const v = Math.abs(valor);
  return numero(valor, v < 10 ? 2 : v < 100 ? 1 : 0);
}

type ComMedida = Readonly<{
  unidade: string;
  medida?: Readonly<{ convertida: boolean; zero?: number; cem?: number }>;
}>;

const escalaReal = (b: ComMedida) =>
  b.medida?.convertida &&
  b.medida.zero !== undefined &&
  b.medida.cem !== undefined
    ? { zero: b.medida.zero, passo: (b.medida.cem - b.medida.zero) / 100 }
    : undefined;

/** Valor da bolha como o jogador lê: na medida real quando há (V1-07). */
export function valorNaTela(b: ComMedida, valor: number): string {
  const e = escalaReal(b);
  return e
    ? valorReal(e.zero + e.passo * valor)
    : valorDaBolha(valor, b.unidade);
}

/** Variação em pontos do motor convertida para a medida real, com sinal real. */
export function variacaoReal(b: ComMedida, delta: number): number {
  const e = escalaReal(b);
  return e ? delta * e.passo : delta;
}

/** Diferença da bolha na medida que a tela usa. */
export function diferencaNaTela(b: ComMedida, delta: number): string {
  return escalaReal(b)
    ? diferenca(variacaoReal(b, delta), "")
    : diferenca(delta, b.unidade);
}

/** Diferença curta, com sinal: "+0,4", "−1,2". */
export function diferenca(valor: number, unidade: string): string {
  const casas = Math.abs(valor) < 0.1 ? 2 : 1;
  const texto = numero(Math.abs(valor), casas);
  const sufixo =
    unidade === "percentual_0_100" || unidade === "percentual_pib"
      ? " p.p."
      : "";
  return `${valor < 0 ? "−" : "+"}${texto}${sufixo}`;
}

export function nivelDaLei(valor: number, unidade: string): string {
  if (unidade === "moeda_ano") return `${moeda(valor)}/ano`;
  // vinculação (SG137): parte da receita que vai para a área
  if (unidade === "percentual_receita")
    return `${numero(valor, 2)}% da receita`;
  if (unidade === "percentual_0_100") return `${numero(valor, 2)}%`;
  return numero(valor, 0);
}

export function atraso(meses: number): string {
  if (meses <= 0) return "imediato";
  if (meses === 1) return "após 1 mês";
  if (meses % 12 === 0)
    return `após ${meses / 12} ${meses === 12 ? "ano" : "anos"}`;
  return `após ${meses} meses`;
}

export const NOME_GRUPO: Readonly<Record<string, string>> = {
  orcamentaria: "Orçamentária",
  tributaria: "Tributária",
  regulatoria: "Regulatória",
  institucional: "Institucional",
};

export const NOME_PROCESSO: Readonly<Record<string, string>> = {
  "emenda-constitucional": "Emenda constitucional",
  "lei-ordinaria": "Lei ordinária",
  "execucao-programa-autorizado": "Execução do Executivo",
  "clausula-petrea": "Constituição",
  decreto: "Decreto",
};
