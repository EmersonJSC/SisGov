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
        // Domínio do nó no mundo, apertado pelo limite da lei e pelo do país.
        domain: narrow(
          narrow(
            narrow(
              {
                minimum: control.dominio.minimo,
                maximum: control.dominio.maximo,
              },
              percentLimits(policy),
            ),
            gdpLimits(policy, content.initialState.economia?.pibAnual),
          ),
          content.initialState.limitesProprios?.find(
            (limit) => limit.lei === policy.id,
          ),
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

type Limits = Readonly<{ minimo?: number; maximo?: number }> | undefined;

/**
 * Limites de valor fixo escritos na lei em % do PIB viram valores com o PIB do
 * país. Sem economia declarada (pacotes de teste), não há como convertê-los.
 */
function gdpLimits(policy: PolicyFile, gdp: number | undefined): Limits {
  const limits = policy.orcamento?.limites;
  if (policy.orcamento?.modo !== "valor_fixo" || !limits || gdp === undefined)
    return undefined;
  return {
    minimo:
      limits.minimoPercentualPib === undefined
        ? undefined
        : (limits.minimoPercentualPib / 100) * gdp,
    maximo:
      limits.maximoPercentualPib === undefined
        ? undefined
        : (limits.maximoPercentualPib / 100) * gdp,
  };
}

/** Aperta um domínio com um limite: vale sempre o mais restritivo. */
function narrow(
  domain: PolicyLevelRules["domain"],
  limits: Limits,
): PolicyLevelRules["domain"] {
  const minimum =
    limits?.minimo === undefined
      ? domain.minimum
      : Math.max(domain.minimum ?? limits.minimo, limits.minimo);
  const maximum =
    limits?.maximo === undefined
      ? domain.maximum
      : Math.min(domain.maximum ?? limits.maximo, limits.maximo);
  return { minimum, maximum };
}
