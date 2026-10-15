import type { ResolvedPackage, ValidationResult } from "../engine";
import { updateImplementedLevel, type PolicyState } from "./leis";
import { policyLevelRulesFromContent } from "./policyRulesFromContent";

/** Abaixo desta distância relativa da meta, a lei é considerada implantada. */
const SNAP = 0.005;

/**
 * Um mês de implantação (SG104, versão mínima): cada lei anda uma fração do
 * caminho entre o nível em funcionamento e a meta. A fração vem da própria
 * lei: `respostaTemporal.implantacao` ao subir, `degradacao` ao descer.
 * Sem `respostaTemporal`, vale `implantacaoTurnos` (a camada da lei: Constituição
 * 4 turnos, alavanca 1; V1-34): a fração por mês é a que fecha 95% do caminho
 * nesses turnos. Sem nenhum dos dois, a mudança é imediata.
 */
const MESES_POR_TURNO = 3;

/** Fração por mês que fecha 95% do caminho em `turnos` turnos. */
export function fracaoPorMes(turnos: number): number {
  return 1 - Math.pow(0.05, 1 / (Math.max(1, turnos) * MESES_POR_TURNO));
}

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
    const policy = definition.value.policy;
    const response = policy.respostaTemporal;
    const rising = state.desiredLevel > state.implementedLevel;
    const turns = policy.implantacaoTurnos;
    const rate = response
      ? rising
        ? response.implantacao
        : response.degradacao
      : turns
        ? Math.min(
            1,
            fracaoPorMes((turns.minimo + turns.maximo) / 2) *
              (rising ? 1 : 1.5),
          )
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
