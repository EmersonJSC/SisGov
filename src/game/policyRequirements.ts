/**
 * Leis mães e filhas (SG138) e os três níveis (D-65).
 *
 * Formato antigo (lei sem `nivel`): uma filha só sai da opção de base (a
 * primeira) com a mãe numa das opções que ela exige; quando a mãe muda para
 * fora delas, a filha cai para a base no mesmo instante, em cascata.
 *
 * Três níveis (lei com `nivel`): a derivada pode exigir várias leis. Sem
 * todas elas nas opções exigidas, a derivada fica bloqueada: não entra em
 * vigor e, se já estava, é revogada (volta ao catálogo), em cascata. A lei
 * pétrea não muda por votação (até a ruptura do M9, a ação é recusada).
 *
 * A regra lê as metas (`desiredLevel`): o que o governo decidiu, não o que já
 * foi implantado.
 */
import {
  requirementsOf,
  type PolicyFile,
  type PolicyRequirementFile,
  type ResolvedPackage,
} from "../engine";
import {
  beginPolicyRevocation,
  changePolicyTarget,
  type PolicyState,
} from "../domain/game";
import { policyLevelRulesFromContent } from "./policyRulesFromContent";

export type PolicyRequirement = Readonly<{
  childId: string;
  parentId: string;
  /** Valores da mãe que liberam a filha. */
  allowedLevels: readonly number[];
  /** Rótulos dessas opções, para a tela. */
  allowedLabels: readonly string[];
  /**
   * Opção de base da filha, para onde ela cai (formato antigo). Ausente nas
   * leis de três níveis: sem a mãe, a filha sai de vigor.
   */
  baseLevel?: number;
  baseLabel?: string;
  /** Por que a filha depende da mãe (texto do conteúdo). */
  reason?: string;
}>;

const same = (a: number, b: number) => Math.abs(a - b) < 1e-9;

function requirementOf(
  policy: PolicyFile,
  requer: PolicyRequirementFile,
  parent: PolicyFile | undefined,
): PolicyRequirement | undefined {
  const own = policy.controle.opcoes ?? [];
  const parentOptions = parent?.controle.opcoes ?? [];
  if (!parent) return undefined;
  if (!policy.nivel && own.length === 0) return undefined;
  const allowed = parentOptions.filter((option) =>
    requer.opcoes.includes(option.id),
  );
  return {
    childId: policy.id,
    parentId: parent.id,
    allowedLevels: allowed.map((option) => option.valor),
    allowedLabels: allowed.map((option) => option.rotulo),
    ...(policy.nivel
      ? {}
      : { baseLevel: own[0].valor, baseLabel: own[0].rotulo }),
    reason: requer.motivo,
  };
}

/** Exigências de todas as leis filhas, por id da filha. */
export function policyRequirements(
  content: ResolvedPackage,
): ReadonlyMap<string, readonly PolicyRequirement[]> {
  const byId = new Map(content.policies.map((policy) => [policy.id, policy]));
  const result = new Map<string, PolicyRequirement[]>();
  for (const policy of content.policies) {
    const list = requirementsOf(policy)
      .map((requer) => requirementOf(policy, requer, byId.get(requer.lei)))
      .filter((item) => item !== undefined);
    if (list.length > 0) result.set(policy.id, list);
  }
  return result;
}

/** A lei está em vigor (vale juridicamente)? */
export function policyInForce(
  policies: readonly PolicyState[],
  policyId: string,
): PolicyState | undefined {
  const state = policies.find((item) => item.policyDefinitionId === policyId);
  return state && state.status === "vigente" && state.legalStatus === "vigente"
    ? state
    : undefined;
}

/** A mãe está numa opção que libera a filha? */
export function requirementMet(
  requirement: PolicyRequirement,
  policies: readonly PolicyState[],
): boolean {
  const parent = policyInForce(policies, requirement.parentId)?.desiredLevel;
  return (
    parent !== undefined &&
    requirement.allowedLevels.some((level) => same(level, parent))
  );
}

function nameOf(content: ResolvedPackage, id: string): string {
  return content.policies.find((p) => p.id === id)?.nome ?? id;
}

function unmetMessage(
  content: ResolvedPackage,
  requirement: PolicyRequirement,
): string {
  return `Esta lei exige ${nameOf(content, requirement.parentId)} em: ${requirement.allowedLabels.join(", ")}.`;
}

/**
 * Motivo para recusar a meta pedida para a lei, ou `undefined` se pode.
 * Vale também para pôr em vigor uma lei do catálogo.
 */
export function requirementBlock(
  content: ResolvedPackage,
  policies: readonly PolicyState[],
  policyId: string,
  desiredLevel: number,
): string | undefined {
  const policy = content.policies.find((item) => item.id === policyId);
  if (!policy) return;
  const current = policyInForce(policies, policyId);
  if (
    policy.nivel === "petrea" &&
    !(current && same(current.desiredLevel, desiredLevel))
  )
    return "Lei pétrea: não muda por votação. Mexer nela é romper a ordem constitucional.";
  const requirements = policyRequirements(content).get(policyId) ?? [];
  for (const requirement of requirements) {
    if (requirementMet(requirement, policies)) continue;
    // formato antigo: a base da filha é sempre permitida
    if (
      requirement.baseLevel !== undefined &&
      same(desiredLevel, requirement.baseLevel)
    )
      continue;
    return unmetMessage(content, requirement);
  }
  return undefined;
}

/** A lei pode sair do mapa (voltar ao catálogo)? Padrão: só derivadas. */
export function policyRevocable(policy: PolicyFile): boolean {
  return policy.revogavel ?? policy.nivel === "derivada";
}

/** Motivo para recusar a revogação, ou `undefined` se pode. */
export function revocationBlock(
  content: ResolvedPackage,
  policies: readonly PolicyState[],
  policyId: string,
): string | undefined {
  const policy = content.policies.find((item) => item.id === policyId);
  if (!policy) return `Lei inexistente: ${policyId}.`;
  if (!policyInForce(policies, policyId)) return "Esta lei não está em vigor.";
  if (policy.nivel === "petrea")
    return "Lei pétrea: não pode ser revogada. Mexer nela é romper a ordem constitucional.";
  if (!policyRevocable(policy))
    return "Esta lei não sai do mapa; mude a opção dela.";
  return undefined;
}

export type FallenPolicy = Readonly<{
  policyId: string;
  /** Meta antes da queda. */
  from: number;
  /** Opção de base, para onde caiu (formato antigo). */
  to?: number;
  /** A lei saiu de vigor (três níveis): voltou ao catálogo. */
  revoked: boolean;
}>;

/** Começa a revogação de uma lei em vigor (sem checar se pode). */
export function revokePolicyState(
  content: ResolvedPackage,
  state: PolicyState,
  turn: number,
): PolicyState | undefined {
  const rules = policyLevelRulesFromContent(content, state.policyDefinitionId);
  if (!rules.ok) return undefined;
  const revoked = beginPolicyRevocation(state, turn, rules.value.rules);
  return revoked.ok ? revoked.value : undefined;
}

/**
 * Derruba as filhas cuja mãe saiu das opções exigidas (em cascata): no
 * formato antigo, para a base; nas leis de três níveis, para fora de vigor.
 * Devolve as leis atualizadas e quais caíram; sem quedas, as mesmas leis.
 */
export function applyRequirementFalls(
  content: ResolvedPackage,
  policies: readonly PolicyState[],
  turn: number,
): { policies: readonly PolicyState[]; fallen: readonly FallenPolicy[] } {
  const requirements = [...policyRequirements(content).values()].flat();
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
      if (child.status !== "vigente" || child.legalStatus !== "vigente")
        continue;
      if (requirementMet(requirement, current)) continue;
      let next: PolicyState | undefined;
      if (requirement.baseLevel === undefined)
        next = revokePolicyState(content, child, turn);
      else {
        if (same(child.desiredLevel, requirement.baseLevel)) continue;
        const rules = policyLevelRulesFromContent(content, requirement.childId);
        if (!rules.ok) continue;
        const down = changePolicyTarget(
          child,
          requirement.baseLevel,
          turn,
          rules.value.rules,
        );
        next = down.ok ? down.value : undefined;
      }
      if (!next) continue;
      const updated = [...current];
      updated[index] = next;
      current = updated;
      fallen.push({
        policyId: requirement.childId,
        from: child.desiredLevel,
        ...(requirement.baseLevel === undefined
          ? {}
          : { to: requirement.baseLevel }),
        revoked: requirement.baseLevel === undefined,
      });
      changed = true;
    }
    if (!changed) break;
  }
  return { policies: current, fallen };
}
