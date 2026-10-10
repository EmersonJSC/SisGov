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
  if (v >= 1_000_000) return `${sinal}R$ ${numero(v / 1_000_000)} tri`;
  if (v >= 1_000) return `${sinal}R$ ${numero(v / 1_000)} bi`;
  return `${sinal}R$ ${numero(v)} mi`;
}

export function valorDaBolha(valor: number, unidade: string): string {
  switch (unidade) {
    case "percentual_0_100":
      return `${numero(valor)}%`;
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
};
