import { domainFailure, type DomainResult } from "./result";

export type PolicyLevelRules = Readonly<{
  policyDefinitionId: string;
  unit: string;
  domain: Readonly<{ minimum?: number; maximum?: number }>;
  options?: readonly number[];
  /** Ends an asymptotic revocation; the execution flow owns its reduction rate. */
  revocationEpsilon?: number;
}>;

export function validatePolicyLevel(
  level: number,
  rules: PolicyLevelRules,
): DomainResult<number> {
  if (!Number.isFinite(level))
    return domainFailure("NIVEL_INVALIDO", "O nível deve ser finito.");
  if (!rules.policyDefinitionId || !rules.unit)
    return domainFailure(
      "DEFINICAO_INVALIDA",
      "A regra da política precisa identificar a política e sua unidade.",
    );
  const { minimum, maximum } = rules.domain;
  if (rules.options && rules.options.length === 0)
    return domainFailure(
      "DEFINICAO_INVALIDA",
      "Uma lista de opções da política não pode estar vazia.",
    );
  if (
    (minimum !== undefined && !Number.isFinite(minimum)) ||
    (maximum !== undefined && !Number.isFinite(maximum)) ||
    (minimum !== undefined && maximum !== undefined && minimum > maximum) ||
    (rules.revocationEpsilon !== undefined &&
      (!Number.isFinite(rules.revocationEpsilon) ||
        rules.revocationEpsilon < 0 ||
        (maximum !== undefined && rules.revocationEpsilon > maximum)))
  )
    return domainFailure(
      "DEFINICAO_INVALIDA",
      "O domínio ou limiar de revogação da política é inválido.",
    );
  if (rules.options && rules.options.length > 0) {
    if (
      !rules.options.every(Number.isFinite) ||
      (minimum !== undefined &&
        rules.options.some((option) => option < minimum)) ||
      (maximum !== undefined &&
        rules.options.some((option) => option > maximum))
    )
      return domainFailure(
        "DEFINICAO_INVALIDA",
        "As opções da política precisam respeitar seu domínio.",
      );
    if (!rules.options.includes(level))
      return domainFailure(
        "NIVEL_INVALIDO",
        `O nível ${level} não é uma opção válida para a política ${rules.policyDefinitionId}.`,
      );
    return { ok: true, value: level };
  }
  if (
    (minimum !== undefined && level < minimum) ||
    (maximum !== undefined && level > maximum)
  )
    return domainFailure(
      "NIVEL_INVALIDO",
      `O nível ${level} está fora do domínio permitido para a política ${rules.policyDefinitionId}.`,
    );
  return { ok: true, value: level };
}

/** Execution may pass between selectable options while remaining in the domain. */
export function validateImplementedPolicyLevel(
  level: number,
  rules: PolicyLevelRules,
): DomainResult<number> {
  const definition = validatePolicyLevel(rules.options?.[0] ?? level, rules);
  if (!definition.ok) return definition;
  return validatePolicyLevel(level, { ...rules, options: undefined });
}
