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
        domain: {
          minimum: control.dominio.minimo,
          maximum: control.dominio.maximo,
        },
        options: policy.controle.opcoes?.map((option) => option.valor),
      },
    },
  };
}
