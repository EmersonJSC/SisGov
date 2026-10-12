import type { ResolvedPackage, ValidationResult } from "../engine";
import { updateImplementedLevel, type PolicyState } from "./leis";
import { policyLevelRulesFromContent } from "./policyRulesFromContent";

/** Abaixo desta distância relativa da meta, a lei é considerada implantada. */
const SNAP = 0.005;

/**
 * Um mês de implantação (SG104, versão mínima): cada lei anda uma fração do
 * caminho entre o nível em funcionamento e a meta. A fração vem da própria
 * lei: `respostaTemporal.implantacao` ao subir, `degradacao` ao descer.
 * Sem `respostaTemporal`, a mudança é imediata.
 */
export function advancePolicyImplementation(
  content: ResolvedPackage,
  states: readonly PolicyState[],
  turn: number,
): ValidationResult<PolicyState[]> {
  const next: PolicyState[] = [];
  for (const state of states) {
    if (
      state.status === "encerrada" ||
      state.implementedLevel === state.desiredLevel
    ) {
      next.push(state);
      continue;
    }
    const definition = policyLevelRulesFromContent(
      content,
      state.policyDefinitionId,
    );
    if (!definition.ok) return definition;
    const response = definition.value.policy.respostaTemporal;
    const rising = state.desiredLevel > state.implementedLevel;
    const rate = response
      ? rising
        ? response.implantacao
        : response.degradacao
      : 1;
    let level =
      state.implementedLevel +
      (state.desiredLevel - state.implementedLevel) * Math.min(1, rate);
    const scale = Math.max(
      Math.abs(state.desiredLevel),
      Math.abs(state.implementedLevel),
      1,
    );
    if (Math.abs(state.desiredLevel - level) <= scale * SNAP)
      level = state.desiredLevel;
    const updated = updateImplementedLevel(
      state,
      level,
      turn,
      definition.value.rules,
    );
    if (!updated.ok)
      return {
        ok: false,
        diagnostics: [
          {
            code: "COMANDO_INVALIDO",
            file: "$partida",
            field: `policies.${state.policyDefinitionId}`,
            message: updated.error.message,
          },
        ],
      };
    next.push(updated.value);
  }
  return { ok: true, value: next };
}
