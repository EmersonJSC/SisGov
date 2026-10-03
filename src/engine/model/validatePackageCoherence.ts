import type {
  ContentDiagnostic,
  ValidationResult,
} from "../diagnostics/contentDiagnostic";
import type { ResolvedPackage } from "./resolvePackage";
import type { VariableDefinition } from "./contentTypes";

const supportedUnits = new Set([
  "indice_0_1",
  "indice_0_100",
  "percentual_0_100",
  "moeda",
  "moeda_por_passo",
  "taxa_por_passo",
  "quantidade",
  "quantidade_por_passo",
  "moeda_milhoes_2024_ano",
  "nivel_escopo",
  "taxa_por_100_mil",
]);

function issue(
  file: string,
  field: string,
  message: string,
): ContentDiagnostic {
  return { code: "COERENCIA_INVALIDA", file, field, message };
}

function isInDomain(value: number, variable: VariableDefinition): boolean {
  const { minimo, maximo } = variable.dominio;
  return (
    (minimo === undefined || value >= minimo) &&
    (maximo === undefined || value <= maximo)
  );
}

/** Confere se as peças resolvidas podem ser calculadas juntas. */
export function validatePackageCoherence(
  content: ResolvedPackage,
): ValidationResult<ResolvedPackage> {
  const diagnostics: ContentDiagnostic[] = [];
  if (content.manifest.perfis) {
    const total = content.manifest.perfis.reduce((sum, profile) => sum + profile.peso, 0);
    if (!Number.isFinite(total) || Math.abs(total - 1) > 0.000001)
      diagnostics.push(
        issue(content.manifest.id, "perfis", "Os pesos dos perfis devem somar 1."),
      );
  }
  const variablesById = new Map(
    content.variables.variaveis.map((variable) => [variable.id, variable]),
  );

  for (const variable of content.variables.variaveis) {
    if (!supportedUnits.has(variable.unidade)) {
      diagnostics.push(
        issue(
          content.variables.id,
          `variaveis.${variable.id}.unidade`,
          `Unidade não suportada: ${variable.unidade}.`,
        ),
      );
    }
    if (!isInDomain(variable.valorInicial, variable)) {
      diagnostics.push(
        issue(
          content.variables.id,
          `variaveis.${variable.id}.valorInicial`,
          "O valor inicial está fora do domínio declarado.",
        ),
      );
    }
  }

  for (const [variableId, value] of Object.entries(
    content.initialState.valores,
  )) {
    const variable = variablesById.get(variableId);
    if (variable && !isInDomain(value, variable)) {
      diagnostics.push(
        issue(
          content.initialState.id,
          `valores.${variableId}`,
          "O estado inicial está fora do domínio da variável.",
        ),
      );
    }
  }
  for (const variable of content.variables.variaveis) {
    if (!(variable.id in content.initialState.valores)) {
      diagnostics.push(
        issue(
          content.initialState.id,
          `valores.${variable.id}`,
          "O estado inicial precisa informar todas as variáveis do cenário.",
        ),
      );
    }
  }

  for (const policy of content.policies) {
    const control = variablesById.get(policy.controle.variavel);
    if (!control) continue;
    if (control.tipo !== "controle") {
      diagnostics.push(
        issue(
          policy.id,
          "controle.variavel",
          "Uma política só pode comandar uma variável do tipo controle.",
        ),
      );
    }
    if (policy.controle.unidade !== control.unidade) {
      diagnostics.push(
        issue(
          policy.id,
          "controle.unidade",
          "A unidade do controle da política difere da unidade da variável.",
        ),
      );
    }
  }

  for (const consequence of content.consequences) {
    const target = variablesById.get(consequence.alvo);
    if (!target) continue;
    if (target.tipo === "controle") {
      diagnostics.push(
        issue(
          consequence.id,
          "alvo",
          "Uma consequência numérica não pode alterar um controle.",
        ),
      );
    }
    if (consequence.unidade !== target.unidade) {
      diagnostics.push(
        issue(
          consequence.id,
          "unidade",
          "A unidade da contribuição precisa ser igual à unidade do alvo.",
        ),
      );
    }
  }

  return diagnostics.length === 0
    ? { ok: true, value: content }
    : { ok: false, diagnostics };
}
