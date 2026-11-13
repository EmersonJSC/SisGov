/**
 * Visões do mapa: cada uma escolhe o que dá peso à bolha. Na visão "Popularidade"
 * as leis mais populares ficam maiores e mais pesadas; em "Dinheiro", as que mais
 * gastam ou arrecadam; em "Nível", as que estão mais fortes. A bolha fraca encolhe
 * e esmaece, mas não some. Só da tela: nenhum cálculo do motor muda.
 */
import type { VisaoLei, VisaoPartida } from "../../partida";
import { FAIXA_DO_RAIO } from "./organico";

export type IdDaVisao =
  "prioridade" | "ligacoes" | "popularidade" | "dinheiro" | "nivel";

export type Visao = Readonly<{
  id: IdDaVisao;
  rotulo: string;
  dica: string;
}>;

export const VISOES: readonly Visao[] = [
  {
    id: "prioridade",
    rotulo: "Padrão",
    dica: "Ministro, instituição, índice, lei: quem manda aparece mais. A lei cresce com o dinheiro que move e com o quanto mexe no país.",
  },
  {
    id: "ligacoes",
    rotulo: "Ligações",
    dica: "Quanto mais coisas a bolha mexe, maior ela é.",
  },
  {
    id: "popularidade",
    rotulo: "Popularidade",
    dica: "As leis mais queridas pela população crescem. (O motor ainda não calcula isto.)",
  },
  {
    id: "dinheiro",
    rotulo: "Dinheiro",
    dica: "Impostos (verde) e verbas (vermelho): quanto maior o valor, maior a bolha.",
  },
  {
    id: "nivel",
    rotulo: "Nível",
    dica: "As leis e índices mais fortes agora crescem.",
  },
];

const NEUTRO = 0.2;
/** Na visão padrão, o tamanho da lei: parte vem do dinheiro, o resto da importância. */
const PARTE_DO_DINHEIRO = 0.55;
const FIM_DA_ESCALA = 100;
/** Fração do peso abaixo da qual a bolha esmaece. */
export const PESO_DO_ESMAECER = 0.25;

const ate1 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Quanto a lei move no caixa, em % do PIB: positivo arrecada (imposto), negativo
 * gasta (verba). 0 para a lei que não toca o orçamento.
 */
export function dinheiroDaLei(lei: VisaoLei): number {
  if (!lei.fluxo) return 0;
  return lei.fluxo.tipo === "verba"
    ? -lei.nivel
    : (lei.fluxo.curva[Math.round(lei.nivel)] ?? 0);
}

/** A visão tem algum dado para mostrar agora? (popularidade ainda não existe no motor) */
export function visaoTemDados(visao: VisaoPartida, id: IdDaVisao): boolean {
  if (id === "popularidade") return visao.leis.some((l) => l.popularidade);
  if (id === "dinheiro") return visao.leis.some((l) => dinheiroDaLei(l) !== 0);
  return true;
}

function pesoDoNivel(lei: VisaoLei): number {
  if (lei.minimo !== undefined && lei.maximo !== undefined) {
    const faixa = lei.maximo - lei.minimo;
    return faixa > 0 ? ate1((lei.nivel - lei.minimo) / faixa) : NEUTRO;
  }
  const opcoes = lei.opcoes ?? [];
  const i = opcoes.findIndex((o) => o.id === lei.opcaoAtual);
  return opcoes.length > 1 && i >= 0 ? i / (opcoes.length - 1) : NEUTRO;
}

/**
 * Peso de cada bolha de 0 a 1 na visão escolhida. Na visão padrão só as leis
 * ganham peso (dinheiro que movem e quanto mexem no país); índices ficam como são.
 */
export function pesosDaVisao(
  visao: VisaoPartida,
  id: IdDaVisao,
): ReadonlyMap<string, number> | null {
  const leis = visao.leis;
  const indices = visao.bolhas.filter((b) => b.tipo !== "grupo");
  const maiorValor = Math.max(
    Number.EPSILON,
    ...leis.map((l) => Math.abs(dinheiroDaLei(l))),
  );
  // quantas ligações cada bolha tem (leis, índices e grupos): o peso da visão Ligações
  const grau = new Map<string, number>();
  visao.ligacoes.forEach((l) => {
    grau.set(l.origem, (grau.get(l.origem) ?? 0) + 1);
    grau.set(l.alvo, (grau.get(l.alvo) ?? 0) + 1);
  });
  // o maior só entre as bolhas de lei e índice: os grupos têm mais ligações e distorceriam
  const maiorGrau = Math.max(
    1,
    ...[...leis.map((l) => l.id), ...indices.map((i) => i.id)].map(
      (idDaBolha) => grau.get(idDaBolha) ?? 0,
    ),
  );
  const dasLigacoes = (idDaBolha: string) =>
    Math.sqrt((grau.get(idDaBolha) ?? 0) / maiorGrau);
  const doIndice = (i: (typeof indices)[number]) => {
    if (id === "ligacoes") return dasLigacoes(i.id);
    if (id !== "nivel") return NEUTRO;
    const faixa = i.maximo - i.minimo;
    return faixa > 0 ? ate1((i.valor - i.minimo) / faixa) : NEUTRO;
  };
  const dinheiro = (l: VisaoLei) =>
    Math.sqrt(Math.abs(dinheiroDaLei(l)) / maiorValor);
  if (id === "prioridade")
    return new Map(
      leis.map((l) => [
        l.id,
        PARTE_DO_DINHEIRO * dinheiro(l) +
          (1 - PARTE_DO_DINHEIRO) * dasLigacoes(l.id),
      ]),
    );
  const daLei = (l: VisaoLei) => {
    if (id === "ligacoes") return dasLigacoes(l.id);
    if (id === "popularidade")
      return l.popularidade
        ? ate1(l.popularidade.pais / FIM_DA_ESCALA)
        : NEUTRO;
    if (id === "dinheiro") return dinheiro(l);
    return pesoDoNivel(l);
  };
  return new Map([
    ...leis.map((l) => [l.id, daLei(l)] as const),
    ...indices.map((i) => [i.id, doIndice(i)] as const),
  ]);
}

/** Raio da bolha para um peso de 0 a 1, dentro da faixa do degrau dela. */
export function raioDoPeso(peso: number, tipo: "lei" | "indice"): number {
  const { minimo, maximo } = FAIXA_DO_RAIO[tipo];
  return minimo + peso * (maximo - minimo);
}
