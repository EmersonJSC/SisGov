/**
 * Bússola política (V1-10): onde as leis em vigor põem o país, o rumo do
 * jogador e as personalidades e partidos de referência.
 */
import type { ResolvedPackage } from "../../engine";
import type { PolicyState } from "../leis/policyState";
import dadosDoMundo from "../../conteudo/mundo/bussola.json";
import dadosDasReferencias from "../../conteudo/bussola/referencias.json";
import { distancia, mediaDasLeis, pontoComRumo } from "./calculo";
import type {
  BussolaDoMundo,
  EstadoDaBussola,
  PontoDaBussola,
  Referencia,
  ReferenciasDaBussola,
} from "./tipos";

export * from "./tipos";
export {
  distancia,
  extremos,
  importancia,
  mediaDasLeis,
  pontoComRumo,
  vetoresDasLeis,
  vetorNoNivel,
} from "./calculo";

export const bussolaDoMundo = dadosDoMundo as unknown as BussolaDoMundo;
export const referenciasDaBussola =
  dadosDasReferencias as unknown as ReferenciasDaBussola;

/** Estado do turno 0: a média das leis é o início e o primeiro passo. */
export function criarBussola(
  content: ResolvedPackage,
  policies: readonly PolicyState[],
  bussola: BussolaDoMundo = bussolaDoMundo,
): EstadoDaBussola {
  const inicio = mediaDasLeis(content, bussola, policies);
  return { inicio, caminho: [{ turno: 0, ...inicio }] };
}

/** Ponto do jogador com as leis de agora. */
export function pontoAtual(
  content: ResolvedPackage,
  estado: EstadoDaBussola,
  policies: readonly PolicyState[],
  bussola: BussolaDoMundo = bussolaDoMundo,
): PontoDaBussola {
  return pontoComRumo(
    estado.inicio,
    mediaDasLeis(content, bussola, policies),
    bussola.fatorDoRumo,
  );
}

/** Anota o ponto no fim do turno. */
export function anotarTurno(
  content: ResolvedPackage,
  estado: EstadoDaBussola,
  policies: readonly PolicyState[],
  turno: number,
  bussola: BussolaDoMundo = bussolaDoMundo,
): EstadoDaBussola {
  const ponto = pontoAtual(content, estado, policies, bussola);
  return {
    ...estado,
    caminho: [
      ...estado.caminho.filter((p) => p.turno !== turno),
      { turno, ...ponto },
    ],
  };
}

/** As referências mais próximas de um ponto, da mais perto para a mais longe. */
export function maisProximas(
  ponto: PontoDaBussola,
  lista: readonly Referencia[],
  quantas = 3,
): readonly Readonly<{ referencia: Referencia; distancia: number }>[] {
  return lista
    .map((referencia) => ({
      referencia,
      distancia: distancia(ponto, referencia),
    }))
    .sort((a, b) => a.distancia - b.distancia)
    .slice(0, quantas);
}
