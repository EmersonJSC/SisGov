/**
 * Relações que o mapa destaca. Lê só as `ligacoes` da `VisaoPartida`: uma
 * seta no mapa sempre corresponde a uma consequência real do conteúdo.
 */
import type { VisaoLigacao, VisaoPartida } from "../../partida";

export type Efeito = "melhora" | "piora" | "neutro";

export type Relacao = Readonly<{
  id: string;
  /** Nó de onde a influência sai (lei ou bolha). */
  de: string;
  /** Nó que recebe a influência (bolha, ou a lei cuja eficácia muda). */
  para: string;
  sinal: 1 | -1;
  atrasoMeses: number;
  efeito: Efeito;
  /** A origem muda a eficácia de uma lei, não um indicador. */
  eficacia: boolean;
  /** `afim` (proporcional) ou `limiar` (só reage depois de certo ponto). */
  mecanismo: string;
  /** A origem é uma ocorrência em curso (evento ou opção de dilema). */
  ocorrencia?: Readonly<{ id: string; nome: string }>;
}>;

const PREFIXO_EFICACIA = "eficacia:";

/** Sobe ou desce é bom ou ruim? Depende de como a bolha é avaliada. */
export function efeitoDe(sinal: number, avaliacao?: string): Efeito {
  if (avaliacao === "maior_melhor") return sinal > 0 ? "melhora" : "piora";
  if (avaliacao === "maior_pior") return sinal > 0 ? "piora" : "melhora";
  return "neutro";
}

export type IndiceRelacoes = Readonly<{
  todas: readonly Relacao[];
  /** Relações por nó (entrando ou saindo). */
  porNo: ReadonlyMap<string, readonly Relacao[]>;
}>;

export function indexarRelacoes(visao: VisaoPartida): IndiceRelacoes {
  const avaliacao = new Map(visao.bolhas.map((b) => [b.id, b.avaliacao]));
  const todas = visao.ligacoes.map((ligacao: VisaoLigacao): Relacao => {
    const eficacia = ligacao.alvo.startsWith(PREFIXO_EFICACIA);
    const para = eficacia
      ? ligacao.alvo.slice(PREFIXO_EFICACIA.length)
      : ligacao.alvo;
    return {
      id: ligacao.id,
      de: ligacao.origem,
      para,
      sinal: ligacao.sinal,
      atrasoMeses: ligacao.atrasoMeses,
      efeito: eficacia
        ? "neutro"
        : efeitoDe(ligacao.sinal, avaliacao.get(para)),
      eficacia,
      mecanismo: ligacao.mecanismo,
      ...(ligacao.ocorrencia ? { ocorrencia: ligacao.ocorrencia } : {}),
    };
  });
  const porNo = new Map<string, Relacao[]>();
  for (const relacao of todas) {
    for (const no of [relacao.de, relacao.para]) {
      const lista = porNo.get(no) ?? [];
      lista.push(relacao);
      porNo.set(no, lista);
    }
  }
  return { todas, porNo };
}
