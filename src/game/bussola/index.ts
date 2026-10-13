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
  DecisaoNaBussola,
  EstadoDaBussola,
  PontoDaBussola,
  Referencia,
  ReferenciasDaBussola,
} from "./tipos";

export * from "./tipos";
export {
  distancia,
  extremos,
  faixaDaLei,
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
    mediaDasLeis(content, bussola, policies, estado.decisoes),
    bussola.fatorDoRumo,
  );
}

/** Anota a resposta a um dilema: ela passa a contar no ponto (V1-13). */
export function anotarDecisao(
  estado: EstadoDaBussola,
  decisao: DecisaoNaBussola,
): EstadoDaBussola {
  return { ...estado, decisoes: [...(estado.decisoes ?? []), decisao] };
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

/** Quanto o ponto precisa chegar perto, num turno, para virar notícia. */
export const PASSO_DO_RUMO = 0.1;

/**
 * A frase do rumo (V1-10 e V1-13): de quem o último turno aproximou o
 * governo. Vale quando a referência mais perto mudou; senão, é a mais perto
 * de quem o ponto chegou pelo menos `PASSO_DO_RUMO` mais perto no turno.
 */
export function rumoDoTurno(
  caminho: EstadoDaBussola["caminho"],
  lista: readonly Referencia[],
): Readonly<{ referencia: Referencia; antes?: Referencia }> | undefined {
  if (caminho.length < 2 || !lista.length) return undefined;
  const ordem = [...caminho].sort((a, b) => a.turno - b.turno);
  const antes = ordem[ordem.length - 2];
  const agora = ordem[ordem.length - 1];
  const perto = maisProximas(agora, lista, lista.length).map(
    (p) => p.referencia,
  );
  const pertoAntes = maisProximas(antes, lista, 1)[0].referencia;
  if (pertoAntes.id !== perto[0].id)
    return { referencia: perto[0], antes: pertoAntes };
  const alvo = perto.find(
    (r) => distancia(antes, r) - distancia(agora, r) >= PASSO_DO_RUMO,
  );
  return alvo ? { referencia: alvo } : undefined;
}
