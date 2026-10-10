import type { PolicyFile, VariableDefinition } from "./contentTypes";

/**
 * Cada lei tem dois nós próprios que a rede pode influenciar (D-41, opção C):
 * - `eficacia:<lei>`: quanto do nível vira efeito (neutro 1 = 100%);
 * - `apoio:<lei>`: apoio à lei (neutro 0).
 * Os neutros são estruturais (ausência de influência), não números do país.
 */
export const lawNodeNeutral = { eficacia: 1, apoio: 0 } as const;

export function efficacyNodeId(lawId: string): string {
  return `eficacia:${lawId}`;
}

export function supportNodeId(lawId: string): string {
  return `apoio:${lawId}`;
}

export function lawInfluenceNodes(
  policies: readonly PolicyFile[],
): VariableDefinition[] {
  return policies.flatMap((policy) => [
    {
      id: efficacyNodeId(policy.id),
      tipo: "calculado" as const,
      nome: `Eficácia — ${policy.nome}`,
      unidade: "fator",
      dominio: { minimo: 0, maximo: 2 },
    },
    {
      id: supportNodeId(policy.id),
      tipo: "calculado" as const,
      nome: `Apoio — ${policy.nome}`,
      unidade: "pontos",
      dominio: { minimo: -100, maximo: 100 },
    },
  ]);
}

/** Valor neutro de um nó de lei, ou undefined se o nó não é de lei. */
export function lawNodeBase(nodeId: string): number | undefined {
  if (nodeId.startsWith("eficacia:")) return lawNodeNeutral.eficacia;
  if (nodeId.startsWith("apoio:")) return lawNodeNeutral.apoio;
  return undefined;
}

/**
 * Contexto do cenário (D-55): a parte do valor inicial de uma bolha que as
 * leis e a rede não explicam (história, geografia, cultura). Nó fixo.
 */
export function contextNodeId(bubbleId: string): string {
  return `contexto:${bubbleId}`;
}

export function isContextNode(nodeId: string): boolean {
  return nodeId.startsWith("contexto:");
}

export function isLawNode(nodeId: string): boolean {
  return lawNodeBase(nodeId) !== undefined;
}
