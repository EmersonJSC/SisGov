import type {
  ContentDiagnostic,
  PolicyFile,
  ResolvedPackage,
  ValidationResult,
} from "../engine";
import type { PolicyLevelRules } from "../domain/game";

export type PolicyDefinitionWithRules = Readonly<{
  policy: PolicyFile;
  rules: PolicyLevelRules;
}>;

function invalid(
  file: string,
  field: string,
  message: string,
): ValidationResult<never> {
  return {
    ok: false,
    diagnostics: [
      {
        code: "COERENCIA_INVALIDA",
        file,
        field,
        message,
      } satisfies ContentDiagnostic,
    ],
  };
}

/**
 * Única origem das regras de nível de uma política: o domínio e a unidade
 * vêm da variável de controle; as opções autorizáveis, do controle da política.
 */
export function policyLevelRulesFromContent(
  content: ResolvedPackage,
  policyId: string,
): ValidationResult<PolicyDefinitionWithRules> {
  const policy = content.policies.find((item) => item.id === policyId);
  if (!policy)
    return invalid(
      "$conteudo",
      "politica",
      `Política inexistente: ${policyId}.`,
    );
  const file = content.pathsById[policy.id] ?? policy.id;
  const control = content.variables.variaveis.find(
    (variable) => variable.id === policy.controle.variavel,
  );
  if (!control)
    return invalid(
      file,
      "controle.variavel",
      `Controle inexistente para ${policy.id}.`,
    );
  if (control.dominio.minimo === undefined)
    return invalid(
      content.pathsById[content.variables.id] ?? content.variables.id,
      `variaveis.${control.id}.dominio.minimo`,
      `O controle de ${policy.id} precisa declarar o mínimo do domínio.`,
    );
  if (policy.controle.unidade !== control.unidade)
    return invalid(
      file,
      "controle.unidade",
      "A unidade do controle da política difere da unidade da variável.",
    );
  return {
    ok: true,
    value: {
      policy,
      rules: {
        policyDefinitionId: policy.id,
        unit: control.unidade,
        domain: intersectDomain(
          control.dominio.minimo,
          control.dominio.maximo,
          percentLimits(policy),
        ),
        options: policy.controle.opcoes?.map((option) => option.valor),
      },
    },
  };
}

/** Limites em % escritos na lei (percentual do orçamento e alíquota). */
function percentLimits(
  policy: PolicyFile,
): Readonly<{ minimo?: number; maximo?: number }> | undefined {
  if (policy.orcamento?.modo === "percentual_orcamento")
    return policy.orcamento.limites;
  return policy.tributo?.limites;
}

/** O nível respeita ao mesmo tempo o domínio do país e o limite da lei. */
function intersectDomain(
  minimum: number,
  maximum: number | undefined,
  limits: Readonly<{ minimo?: number; maximo?: number }> | undefined,
): PolicyLevelRules["domain"] {
  const lawMinimum = limits?.minimo;
  const lawMaximum = limits?.maximo;
  return {
    minimum: lawMinimum === undefined ? minimum : Math.max(minimum, lawMinimum),
    maximum:
      lawMaximum === undefined
        ? maximum
        : maximum === undefined
          ? lawMaximum
          : Math.min(maximum, lawMaximum),
  };
}
