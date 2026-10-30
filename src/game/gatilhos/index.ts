/**
 * Gatilhos (M7.2): o que o jogador anda fazendo e para que lado anda indo.
 * Lê o histórico das leis e o caminho da bússola; nada é guardado, tudo se
 * refaz a cada turno. As regras ficam em `mundo/gatilhos.json`.
 */
import type { ResolvedPackage } from "../../engine";
import dadosDosGatilhos from "../../conteudo/mundo/gatilhos.json";
import {
  bussolaDoMundo,
  faixaDaLei,
  vetorNoNivel,
  type BussolaDoMundo,
  type EstadoDaBussola,
  type VetorDaLei,
} from "../bussola";
import type { PolicyState } from "../leis/policyState";

type Eixo = "economia" | "costumes";

export type RegraDeGatilho =
  | Readonly<{
      tipo: "decisoes";
      areas?: readonly string[];
      familias?: readonly string[];
      nivel?: "subiu" | "baixou";
      eixo?: Eixo;
      sentido?: 1 | -1;
      /** Quantas decisões; sem ele vale `minimoDeDecisoes`. */
      minimo?: number;
      /** Em quantas áreas diferentes as decisões se espalham. */
      areasMinimas?: number;
    }>
  | Readonly<{ tipo: "rumo"; eixo: Eixo; sentido: 1 | -1; minimo: number }>
  /** O resultado fiscal (% do PIB) andou `minimo` pontos no `sentido` na janela. */
  | Readonly<{ tipo: "fiscal"; sentido: 1 | -1; minimo: number }>;

/** Como um grupo reage a um gatilho ligado (M7.3). */
export type ReacaoDeGatilho = Readonly<{
  /** Chave do grupo, sem o prefixo `grupo_`. */
  grupo: string;
  /** Pontos de satisfação, com sinal. */
  pontos: number;
  /** Só reage se as decisões do gatilho foram numa destas áreas. */
  areas?: readonly string[];
  frase: string;
}>;

export type DefinicaoDeGatilho = Readonly<{
  id: string;
  nome: string;
  frase: string;
  regra: RegraDeGatilho;
  reacoes?: readonly ReacaoDeGatilho[];
}>;

export type GatilhosDoMundo = Readonly<{
  tipo: "mundo-gatilhos";
  versaoEsquema: 1;
  metodo: string;
  janela: number;
  minimoDeDecisoes: number;
  /** Teto da soma dos pontos de reação de um grupo, para mais ou para menos. */
  tetoDaReacao: number;
  /** Frase da imprensa quando nenhum gatilho está ligado. */
  semGatilho: string;
  gatilhos: readonly DefinicaoDeGatilho[];
}>;

export type GatilhoAtivo = Readonly<{
  id: string;
  nome: string;
  frase: string;
  /** Áreas em que caíram as decisões que ligaram o gatilho (vazio no rumo). */
  areas: readonly string[];
}>;

export const gatilhosDoMundo = dadosDosGatilhos as unknown as GatilhosDoMundo;

const EIXO: Readonly<Record<Eixo, 0 | 1>> = { economia: 0, costumes: 1 };
const ZERO: VetorDaLei = [0, 0];

type Decisao = Readonly<{
  area: string;
  familia: string;
  /** Meta depois menos meta antes. */
  deltaNivel: number;
  /** Vetor da bússola depois menos antes. */
  deltaVetor: VetorDaLei;
}>;

/** As mudanças de meta feitas nos últimos `janela` turnos. */
function decisoesNaJanela(
  content: ResolvedPackage,
  policies: readonly PolicyState[],
  turno: number,
  janela: number,
  bussola: BussolaDoMundo,
): readonly Decisao[] {
  const decisoes: Decisao[] = [];
  for (const estado of policies) {
    const lei = content.policies.find(
      (p) => p.id === estado.policyDefinitionId,
    );
    if (!lei) continue;
    const dados = bussola.leis[lei.id];
    const faixa = faixaDaLei(content, lei.id);
    const vetor = (nivel: number, revogada: boolean): VetorDaLei =>
      !dados
        ? ZERO
        : revogada
          ? (dados.foraDeVigor ?? ZERO)
          : vetorNoNivel(dados, lei.controle.opcoes, nivel, faixa);
    estado.history.forEach((mudanca, i) => {
      if (mudanca.kind === "herdada" || mudanca.kind === "encerrada") return;
      if (mudanca.kind === "implantacao_atualizada") return;
      if (mudanca.turn <= turno - janela || mudanca.turn > turno) return;
      const antes = i > 0 ? estado.history[i - 1] : undefined;
      const nivelAntes = antes?.desiredLevel ?? 0;
      const revogada =
        mudanca.kind === "revogacao_iniciada" ||
        mudanca.legalStatus === "revogada";
      const nivelDepois = revogada ? 0 : mudanca.desiredLevel;
      const depois = vetor(nivelDepois, revogada);
      const antesV = antes
        ? vetor(nivelAntes, antes.legalStatus === "revogada")
        : (dados?.foraDeVigor ?? ZERO);
      decisoes.push({
        area: lei.area ?? "",
        familia: lei.familia ?? "",
        deltaNivel: nivelDepois - nivelAntes,
        deltaVetor: [depois[0] - antesV[0], depois[1] - antesV[1]],
      });
    });
  }
  return decisoes;
}

/** Quanto o ponto andou no eixo entre `janela` turnos atrás e agora. */
function andouNoEixo(
  caminho: EstadoDaBussola["caminho"],
  turno: number,
  janela: number,
  eixo: Eixo,
): number {
  const ordem = [...caminho]
    .filter((p) => p.turno <= turno)
    .sort((a, b) => a.turno - b.turno);
  if (ordem.length < 2) return 0;
  const agora = ordem[ordem.length - 1];
  const antes =
    [...ordem].reverse().find((p) => p.turno <= turno - janela) ?? ordem[0];
  return agora[eixo] - antes[eixo];
}

/** Quanto o resultado fiscal andou entre `janela` turnos atrás e agora. */
function andouNoResultado(
  caminho: EstadoDaBussola["caminho"],
  turno: number,
  janela: number,
): number {
  const ordem = [...caminho]
    .filter((p) => p.turno <= turno && p.resultado !== undefined)
    .sort((a, b) => a.turno - b.turno);
  if (ordem.length < 2) return 0;
  const agora = ordem[ordem.length - 1];
  const antes =
    [...ordem].reverse().find((p) => p.turno <= turno - janela) ?? ordem[0];
  return agora.resultado! - antes.resultado!;
}

/** Os gatilhos ligados neste turno, na ordem do arquivo. */
export function gatilhosAtivos(
  content: ResolvedPackage,
  policies: readonly PolicyState[],
  caminho: EstadoDaBussola["caminho"],
  turno: number,
  mundo: GatilhosDoMundo = gatilhosDoMundo,
  bussola: BussolaDoMundo = bussolaDoMundo,
): readonly GatilhoAtivo[] {
  const decisoes = decisoesNaJanela(
    content,
    policies,
    turno,
    mundo.janela,
    bussola,
  );
  return mundo.gatilhos.flatMap(({ id, nome, frase, regra }) => {
    if (regra.tipo === "fiscal")
      return regra.sentido * andouNoResultado(caminho, turno, mundo.janela) >=
        regra.minimo
        ? [{ id, nome, frase, areas: [] }]
        : [];
    if (regra.tipo === "rumo")
      return regra.sentido *
        andouNoEixo(caminho, turno, mundo.janela, regra.eixo) >=
        regra.minimo
        ? [{ id, nome, frase, areas: [] }]
        : [];
    const casam = decisoes.filter(
      (d) =>
        (!regra.areas || regra.areas.includes(d.area)) &&
        (!regra.familias || regra.familias.includes(d.familia)) &&
        (!regra.nivel ||
          (regra.nivel === "subiu" ? d.deltaNivel > 0 : d.deltaNivel < 0)) &&
        (!regra.eixo || regra.sentido! * d.deltaVetor[EIXO[regra.eixo]] > 0),
    );
    const areas = [...new Set(casam.map((d) => d.area))];
    return casam.length >= (regra.minimo ?? mundo.minimoDeDecisoes) &&
      areas.length >= (regra.areasMinimas ?? 1)
      ? [{ id, nome, frase, areas }]
      : [];
  });
}

/** Como um grupo está reagindo ao governo agora (M7.3). */
export type ReacaoDoGrupo = Readonly<{
  /** Soma dos pontos de satisfação, dentro do teto. */
  pontos: number;
  /** A frase da reação que mais pesa. */
  frase: string;
}>;

/**
 * As reações dos grupos aos gatilhos ligados, por id de grupo (`grupo_x`).
 * Os pontos de cada grupo somam, com teto; a frase é a da reação mais forte.
 */
export function reacoesDosGrupos(
  ativos: readonly GatilhoAtivo[],
  mundo: GatilhosDoMundo = gatilhosDoMundo,
): Readonly<Record<string, ReacaoDoGrupo>> {
  const soma = new Map<string, { pontos: number; forte: ReacaoDeGatilho }>();
  for (const ativo of ativos) {
    const def = mundo.gatilhos.find((g) => g.id === ativo.id);
    for (const r of def?.reacoes ?? []) {
      if (r.areas && !r.areas.some((a) => ativo.areas.includes(a))) continue;
      const antes = soma.get(r.grupo);
      soma.set(r.grupo, {
        pontos: (antes?.pontos ?? 0) + r.pontos,
        forte:
          antes && Math.abs(antes.forte.pontos) >= Math.abs(r.pontos)
            ? antes.forte
            : r,
      });
    }
  }
  const teto = mundo.tetoDaReacao;
  return Object.fromEntries(
    [...soma].map(([grupo, { pontos, forte }]) => [
      `grupo_${grupo}`,
      {
        pontos: Math.max(-teto, Math.min(teto, pontos)),
        frase: forte.frase,
      },
    ]),
  );
}

/** Os pontos de satisfação por id de grupo, para quem só quer o número. */
export const pontosDasReacoes = (
  reacoes: Readonly<Record<string, ReacaoDoGrupo>>,
): Readonly<Record<string, number>> =>
  Object.fromEntries(Object.entries(reacoes).map(([id, r]) => [id, r.pontos]));
