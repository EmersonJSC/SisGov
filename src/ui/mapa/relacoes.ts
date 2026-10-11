/**
 * Relações que o mapa destaca. Lê só as `ligacoes` da `VisaoPartida`: uma
 * seta no mapa sempre corresponde a uma consequência real do conteúdo.
 */
import type { VisaoLigacao, VisaoPartida } from "../../app/partida";

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

export type Vizinhanca = Readonly<{
  /** Relações diretas do nó em foco. */
  relacoes: readonly Relacao[];
  /** O nó em foco e todos os que ele toca diretamente. */
  nos: ReadonlySet<string>;
  /** Leis tocadas diretamente (para revelar nas esferas fechadas). */
  leis: ReadonlySet<string>;
}>;

const VAZIA: Vizinhanca = { relacoes: [], nos: new Set(), leis: new Set() };

export function vizinhanca(
  indice: IndiceRelacoes,
  foco: string | null,
  ehLei: (id: string) => boolean,
): Vizinhanca {
  if (!foco) return VAZIA;
  const relacoes = indice.porNo.get(foco) ?? [];
  const nos = new Set<string>([foco]);
  const leis = new Set<string>();
  for (const relacao of relacoes) {
    nos.add(relacao.de);
    nos.add(relacao.para);
  }
  for (const no of nos) if (ehLei(no)) leis.add(no);
  return { relacoes, nos, leis };
}

/**
 * Ligações de fundo da visão geral: para cada bolha, o ministério (ou os
 * dois) cujas leis mais a afetam. Somam relações reais; não são enfeite.
 */
export type LigacaoDeFundo = Readonly<{
  ministerio: string;
  bolha: string;
  peso: number;
}>;

export function ligacoesDeFundo(
  visao: VisaoPartida,
): readonly LigacaoDeFundo[] {
  const ministerioDaLei = new Map(
    visao.leis.map((lei) => [lei.id, lei.areas[0]]),
  );
  const contagem = new Map<string, Map<string, number>>();
  for (const ligacao of visao.ligacoes) {
    const ministerio = ministerioDaLei.get(ligacao.origem);
    if (!ministerio || ligacao.alvo.startsWith(PREFIXO_EFICACIA)) continue;
    const mapa = contagem.get(ligacao.alvo) ?? new Map<string, number>();
    mapa.set(ministerio, (mapa.get(ministerio) ?? 0) + 1);
    contagem.set(ligacao.alvo, mapa);
  }
  const saida: LigacaoDeFundo[] = [];
  for (const [bolha, mapa] of contagem) {
    const ordem = [...mapa].sort((a, b) => b[1] - a[1]);
    const [primeiro, segundo] = ordem;
    saida.push({ ministerio: primeiro[0], bolha, peso: primeiro[1] });
    if (segundo && segundo[1] >= 2 && segundo[1] >= primeiro[1] * 0.5)
      saida.push({ ministerio: segundo[0], bolha, peso: segundo[1] });
  }
  return saida;
}
