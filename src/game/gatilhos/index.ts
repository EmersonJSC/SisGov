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
  | Readonly<{ tipo: "rumo"; eixo: Eixo; sentido: 1 | -1; minimo: number }>;

export type DefinicaoDeGatilho = Readonly<{
  id: string;
  nome: string;
  frase: string;
  regra: RegraDeGatilho;
}>;

export type GatilhosDoMundo = Readonly<{
  tipo: "mundo-gatilhos";
  versaoEsquema: 1;
  metodo: string;
  janela: number;
  minimoDeDecisoes: number;
  gatilhos: readonly DefinicaoDeGatilho[];
}>;

export type GatilhoAtivo = Readonly<{
  id: string;
  nome: string;
  frase: string;
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
  return mundo.gatilhos
    .filter(({ regra }) => {
      if (regra.tipo === "rumo")
        return (
          regra.sentido *
            andouNoEixo(caminho, turno, mundo.janela, regra.eixo) >=
          regra.minimo
        );
      const casam = decisoes.filter(
        (d) =>
          (!regra.areas || regra.areas.includes(d.area)) &&
          (!regra.familias || regra.familias.includes(d.familia)) &&
          (!regra.nivel ||
            (regra.nivel === "subiu" ? d.deltaNivel > 0 : d.deltaNivel < 0)) &&
          (!regra.eixo || regra.sentido! * d.deltaVetor[EIXO[regra.eixo]] > 0),
      );
      const areas = new Set(casam.map((d) => d.area));
      return (
        casam.length >= (regra.minimo ?? mundo.minimoDeDecisoes) &&
        areas.size >= (regra.areasMinimas ?? 1)
      );
    })
    .map(({ id, nome, frase }) => ({ id, nome, frase }));
}
