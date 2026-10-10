/**
 * Leis mães e filhas (SG138). Uma lei filha (`requer` no conteúdo) só sai da
 * opção de base (a primeira) com a mãe numa das opções que ela exige; quando
 * a mãe muda para fora delas, a filha cai para a base no mesmo instante, em
 * cascata (netas também caem). A regra lê as metas (`desiredLevel`): o que o
 * governo decidiu, não o que já foi implantado.
 */
import type { PolicyFile, ResolvedPackage } from "../engine";
import { changePolicyTarget, type PolicyState } from "../domain/game";
import { policyLevelRulesFromContent } from "./policyRulesFromContent";

export type PolicyRequirement = Readonly<{
  childId: string;
  parentId: string;
  /** Valores da mãe que liberam a filha. */
  allowedLevels: readonly number[];
  /** Rótulos dessas opções, para a tela. */
  allowedLabels: readonly string[];
  /** Opção de base da filha: para onde ela cai. */
  baseLevel: number;
  baseLabel: string;
  /** Por que a filha depende da mãe (texto do conteúdo). */
  reason?: string;
}>;

const same = (a: number, b: number) => Math.abs(a - b) < 1e-9;

function requirementOf(
  policy: PolicyFile,
  parent: PolicyFile | undefined,
): PolicyRequirement | undefined {
  const own = policy.controle.opcoes ?? [];
  const parentOptions = parent?.controle.opcoes ?? [];
  if (!policy.requer || !parent || own.length === 0) return undefined;
  const allowed = parentOptions.filter((option) =>
    policy.requer!.opcoes.includes(option.id),
  );
  return {
    childId: policy.id,
    parentId: parent.id,
    allowedLevels: allowed.map((option) => option.valor),
    allowedLabels: allowed.map((option) => option.rotulo),
    baseLevel: own[0].valor,
    baseLabel: own[0].rotulo,
    reason: policy.requer.motivo,
  };
}

/** Exigências de todas as leis filhas, por id da filha. */
export function policyRequirements(
  content: ResolvedPackage,
): ReadonlyMap<string, PolicyRequirement> {
  const byId = new Map(content.policies.map((policy) => [policy.id, policy]));
  const result = new Map<string, PolicyRequirement>();
  for (const policy of content.policies) {
    const requirement = requirementOf(
      policy,
      policy.requer ? byId.get(policy.requer.lei) : undefined,
    );
    if (requirement) result.set(policy.id, requirement);
  }
  return result;
}

function desiredOf(
  policies: readonly PolicyState[],
  policyId: string,
): number | undefined {
  const state = policies.find((item) => item.policyDefinitionId === policyId);
  return state && state.status === "vigente" ? state.desiredLevel : undefined;
}

/** A mãe está numa opção que libera a filha? */
export function requirementMet(
  requirement: PolicyRequirement,
  policies: readonly PolicyState[],
): boolean {
  const parent = desiredOf(policies, requirement.parentId);
  return (
    parent !== undefined &&
    requirement.allowedLevels.some((level) => same(level, parent))
  );
}

/**
 * Motivo para recusar a meta pedida para a lei, ou `undefined` se pode.
 * A base da filha é sempre permitida.
 */
export function requirementBlock(
  content: ResolvedPackage,
  policies: readonly PolicyState[],
  policyId: string,
  desiredLevel: number,
): string | undefined {
  const requirement = policyRequirements(content).get(policyId);
  if (!requirement || same(desiredLevel, requirement.baseLevel)) return;
  if (requirementMet(requirement, policies)) return;
  const parent = content.policies.find((p) => p.id === requirement.parentId);
  return `Esta lei exige ${parent?.nome ?? requirement.parentId} em: ${requirement.allowedLabels.join(", ")}.`;
}

export type FallenPolicy = Readonly<{
  policyId: string;
  /** Meta antes da queda. */
  from: number;
  /** Opção de base, para onde caiu. */
  to: number;
}>;

/**
 * Derruba as filhas cuja mãe saiu das opções exigidas (em cascata). Devolve
 * as leis atualizadas e quais caíram; sem quedas, devolve as mesmas leis.
 */
export function applyRequirementFalls(
  content: ResolvedPackage,
  policies: readonly PolicyState[],
  turn: number,
): { policies: readonly PolicyState[]; fallen: readonly FallenPolicy[] } {
  const requirements = [...policyRequirements(content).values()];
  let current = policies;
  const fallen: FallenPolicy[] = [];
  // cada volta derruba uma geração; o conteúdo não tem ciclos (validador)
  for (let round = 0; round <= requirements.length; round++) {
    let changed = false;
    for (const requirement of requirements) {
      const index = current.findIndex(
        (state) => state.policyDefinitionId === requirement.childId,
      );
      if (index < 0) continue;
      const child = current[index];
      if (child.status !== "vigente") continue;
      if (same(child.desiredLevel, requirement.baseLevel)) continue;
      if (requirementMet(requirement, current)) continue;
      const rules = policyLevelRulesFromContent(content, requirement.childId);
      if (!rules.ok) continue;
      const down = changePolicyTarget(
        child,
        requirement.baseLevel,
        turn,
        rules.value.rules,
      );
      if (!down.ok) continue;
      const next = [...current];
      next[index] = down.value;
      current = next;
      fallen.push({
        policyId: requirement.childId,
        from: child.desiredLevel,
        to: requirement.baseLevel,
      });
      changed = true;
    }
    if (!changed) break;
  }
  return { policies: current, fallen };
}
