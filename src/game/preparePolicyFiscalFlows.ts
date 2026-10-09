import type { PolicyFile, ResolvedPackage, ValidationResult } from "../engine";
import type { FiscalMonthInput } from "../domain/fiscal";
import type { PolicyState } from "../domain/game";

export type PolicyFiscalFlow = Readonly<{
  policyDefinitionId: string;
  nature: "revenue" | "primaryExpense";
  amount: number;
}>;

export type PreparedPolicyFiscalFlows = Readonly<{
  month: FiscalMonthInput;
  flows: readonly PolicyFiscalFlow[];
}>;

function invalid(field: string, message: string): ValidationResult<never> {
  return {
    ok: false,
    diagnostics: [
      { code: "COMANDO_INVALIDO", file: "$partida", field, message },
    ],
  };
}

/**
 * Converts the implemented levels of authorised policies into the month's
 * primary revenue and expense. It deliberately does not perform accounting;
 * accountFiscalMonth remains the only place that changes fiscal balances.
 */
export function preparePolicyFiscalFlows(
  content: ResolvedPackage,
  states: readonly PolicyState[],
): ValidationResult<PreparedPolicyFiscalFlows> {
  const policiesById = new Map(
    content.policies.map((policy) => [policy.id, policy]),
  );
  const seen = new Set<string>();
  const flows: PolicyFiscalFlow[] = [];

  for (const [index, state] of states.entries()) {
    const field = `policies.${index}`;
    if (seen.has(state.policyDefinitionId))
      return invalid(field, "Há dois estados para a mesma lei.");
    seen.add(state.policyDefinitionId);
    const policy = policiesById.get(state.policyDefinitionId);
    if (!policy)
      return invalid(
        field,
        `Política inexistente: ${state.policyDefinitionId}.`,
      );
    const flow = preparePolicyFlow(policy, state);
    if (!flow) continue;
    flows.push(flow);
  }

  return {
    ok: true,
    value: {
      flows,
      month: {
        revenue: flows
          .filter((flow) => flow.nature === "revenue")
          .reduce((sum, flow) => sum + flow.amount, 0),
        primaryExpense: flows
          .filter((flow) => flow.nature === "primaryExpense")
          .reduce((sum, flow) => sum + flow.amount, 0),
      },
    },
  };
}

/**
 * Lei orçamentária de valor fixo: o nível implantado é o gasto anual, então o
 * gasto mensal é nível ÷ 12. Percentual do orçamento, custo de opções
 * regulatórias e receita tributária entram nos chamados SG136–SG139.
 */
function preparePolicyFlow(
  policy: PolicyFile,
  state: PolicyState,
): PolicyFiscalFlow | undefined {
  if (
    policy.orcamento?.modo !== "valor_fixo" ||
    state.implementedLevel <= 0 ||
    state.status === "encerrada"
  )
    return undefined;
  return {
    policyDefinitionId: policy.id,
    nature: "primaryExpense",
    amount: state.implementedLevel / 12,
  };
}
