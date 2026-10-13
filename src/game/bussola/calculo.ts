/**
 * Bússola política (V1-10, docs/v1/desenho/bussola.md).
 *
 * - Cada lei em vigor contribui com o vetor da opção (ou da faixa) vezes a
 *   importância dela (emenda 3, lei 2, o resto 1).
 * - A média divide pela importância de todas as leis do catálogo: lei fora de
 *   vigor vale zero (ou o `foraDeVigor` dela).
 * - A média vira escala de −10 a +10 pela parte do caminho até o país mais
 *   extremo possível com as mesmas leis, em cada sentido.
 * - O ponto é o início mais o rumo ampliado: início + fator × (agora − início),
 *   com um fator por eixo (V1-34).
 */
import type { ResolvedPackage } from "../../engine";
import type { PolicyState } from "../leis/policyState";
import { policyInForce } from "../policyRequirements";
import { policyLevelRulesFromContent } from "../policyRulesFromContent";
import type {
  BussolaDaLei,
  BussolaDoMundo,
  DecisaoNaBussola,
  PontoDaBussola,
  VetorDaLei,
} from "./tipos";

const ZERO: VetorDaLei = [0, 0];

export function importancia(
  bussola: BussolaDoMundo,
  processo: string | undefined,
): number {
  return bussola.importancia[processo ?? ""] ?? bussola.importancia.outras ?? 1;
}

type Faixa = Readonly<{ minimo: number; maximo: number }>;

export function faixaDaLei(
  content: ResolvedPackage,
  id: string,
): Faixa | undefined {
  const regras = policyLevelRulesFromContent(content, id);
  if (!regras.ok) return undefined;
  const { minimum, maximum } = regras.value.rules.domain;
  if (minimum === undefined || maximum === undefined) return undefined;
  return { minimo: minimum, maximo: maximum };
}

/** Vetor da lei num nível (opção mais próxima, ou posição na faixa). */
export function vetorNoNivel(
  dados: BussolaDaLei,
  opcoes: readonly Readonly<{ id: string; valor: number }>[] | undefined,
  nivel: number,
  faixa: Faixa | undefined,
): VetorDaLei {
  if (opcoes && opcoes.length > 0 && dados.opcoes) {
    const perto = opcoes.reduce((best, o) =>
      Math.abs(o.valor - nivel) < Math.abs(best.valor - nivel) ? o : best,
    );
    return dados.opcoes[perto.id] ?? ZERO;
  }
  if (dados.faixa) {
    const { minimo, maximo } = dados.faixa;
    const t =
      faixa && faixa.maximo > faixa.minimo
        ? Math.min(
            1,
            Math.max(0, (nivel - faixa.minimo) / (faixa.maximo - faixa.minimo)),
          )
        : 0.5;
    return [
      minimo[0] + t * (maximo[0] - minimo[0]),
      minimo[1] + t * (maximo[1] - minimo[1]),
    ];
  }
  return ZERO;
}

function vetoresPossiveis(dados: BussolaDaLei): readonly VetorDaLei[] {
  const lista: VetorDaLei[] = [
    ...Object.values(dados.opcoes ?? {}),
    ...(dados.faixa ? [dados.faixa.minimo, dados.faixa.maximo] : []),
    dados.foraDeVigor ?? ZERO,
  ];
  return lista;
}

type Extremos = Readonly<{
  peso: number;
  minimo: VetorDaLei;
  maximo: VetorDaLei;
}>;

/** Soma das importâncias e as médias mais extremas possíveis em cada eixo. */
export function extremos(
  content: ResolvedPackage,
  bussola: BussolaDoMundo,
): Extremos {
  let peso = 0;
  const minimo = [0, 0];
  const maximo = [0, 0];
  for (const policy of content.policies) {
    const w = importancia(bussola, policy.processoAutorizacao);
    peso += w;
    const dados = bussola.leis[policy.id];
    if (!dados) continue;
    const vetores = vetoresPossiveis(dados);
    for (const eixo of [0, 1] as const) {
      minimo[eixo] += w * Math.min(...vetores.map((v) => v[eixo]));
      maximo[eixo] += w * Math.max(...vetores.map((v) => v[eixo]));
    }
  }
  return {
    peso,
    minimo: [minimo[0] / peso, minimo[1] / peso],
    maximo: [maximo[0] / peso, maximo[1] / peso],
  };
}

/** Vetor de cada lei como está agora (em vigor ou não). */
export function vetoresDasLeis(
  content: ResolvedPackage,
  bussola: BussolaDoMundo,
  policies: readonly PolicyState[],
): ReadonlyMap<string, VetorDaLei> {
  const mapa = new Map<string, VetorDaLei>();
  for (const policy of content.policies) {
    const dados = bussola.leis[policy.id];
    if (!dados) continue;
    const estado = policyInForce(policies, policy.id);
    mapa.set(
      policy.id,
      estado
        ? vetorNoNivel(
            dados,
            policy.controle.opcoes,
            estado.desiredLevel,
            faixaDaLei(content, policy.id),
          )
        : (dados.foraDeVigor ?? ZERO),
    );
  }
  return mapa;
}

const escala = (media: number, min: number, max: number) => {
  const v =
    media >= 0 ? (max > 0 ? media / max : 0) : min < 0 ? -media / min : 0;
  return Math.max(-10, Math.min(10, 10 * v));
};

/** Média das leis na escala de −10 a +10. */
export function mediaDasLeis(
  content: ResolvedPackage,
  bussola: BussolaDoMundo,
  policies: readonly PolicyState[],
  decisoes: readonly DecisaoNaBussola[] = [],
): PontoDaBussola {
  const ext = extremos(content, bussola);
  if (ext.peso === 0) return { economia: 0, costumes: 0 };
  const soma = [0, 0];
  const vetores = vetoresDasLeis(content, bussola, policies);
  for (const policy of content.policies) {
    const v = vetores.get(policy.id);
    if (!v) continue;
    const w = importancia(bussola, policy.processoAutorizacao);
    soma[0] += w * v[0];
    soma[1] += w * v[1];
  }
  // V1-13: cada resposta a dilema pesa como uma lei de importância "dilema"
  const wDilema = bussola.importancia.dilema ?? 1;
  for (const d of decisoes) {
    const v = bussola.dilemas?.[d.dilema]?.opcoes[d.opcao];
    if (!v) continue;
    soma[0] += wDilema * v[0];
    soma[1] += wDilema * v[1];
  }
  return {
    economia: escala(soma[0] / ext.peso, ext.minimo[0], ext.maximo[0]),
    costumes: escala(soma[1] / ext.peso, ext.minimo[1], ext.maximo[1]),
  };
}

/** Ponto do jogador: o início mais o rumo ampliado, dentro de −10 e +10. */
export function pontoComRumo(
  inicio: PontoDaBussola,
  agora: PontoDaBussola,
  fator: PontoDaBussola,
): PontoDaBussola {
  const anda = (a: number, b: number, f: number) =>
    Math.max(-10, Math.min(10, a + f * (b - a)));
  return {
    economia: anda(inicio.economia, agora.economia, fator.economia),
    costumes: anda(inicio.costumes, agora.costumes, fator.costumes),
  };
}

/** Distância entre dois pontos da bússola. */
export function distancia(a: PontoDaBussola, b: PontoDaBussola): number {
  return Math.hypot(a.economia - b.economia, a.costumes - b.costumes);
}
