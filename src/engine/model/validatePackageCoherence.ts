import { resolveInheritedLawLevels } from "./inheritedLaws";
import { lawInfluenceNodes } from "./lawNodes";
import { rateUnitFor } from "../mechanisms/updateStock";
import type {
  ContentDiagnostic,
  ValidationResult,
} from "../diagnostics/contentDiagnostic";
import type { ResolvedPackage } from "./resolvePackage";
import type {
  OccurrenceCondition,
  OccurrenceFile,
  PolicyFile,
  VariableDefinition,
} from "./contentTypes";

const supportedUnits = new Set([
  "indice_0_1",
  "indice_0_100",
  "percentual_0_100",
  "percentual_receita",
  "moeda",
  "moeda_por_passo",
  "taxa_por_passo",
  "quantidade",
  "quantidade_por_passo",
  "moeda_milhoes_2024_ano",
  "moeda_ano",
  "indice_0_100_por_passo",
  "percentual_pib",
  "percentual_pib_por_passo",
  "fator",
  "pontos",
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
    const total = content.manifest.perfis.reduce(
      (sum, profile) => sum + profile.peso,
      0,
    );
    if (!Number.isFinite(total) || Math.abs(total - 1) > 0.000001)
      diagnostics.push(
        issue(
          content.manifest.id,
          "perfis",
          "Os pesos dos perfis devem somar 1.",
        ),
      );
  }
  // Os nós de eficácia e apoio de cada lei também podem ser alvo (D-41).
  const variablesById = new Map(
    [
      ...content.variables.variaveis,
      ...lawInfluenceNodes(content.policies),
    ].map((variable) => [variable.id, variable]),
  );
  const initialStateFile = content.pathsById[content.initialState.id];
  const policiesById = new Map(
    content.policies.map((policy) => [policy.id, policy]),
  );
  for (const [index, relation] of (
    content.initialState.politica?.relacoes ?? []
  ).entries()) {
    const field = `politica.relacoes.${index}.origem.id`;
    if (
      relation.origem.tipo === "politica" &&
      !policiesById.has(relation.origem.id)
    )
      diagnostics.push(
        issue(
          initialStateFile,
          field,
          `Política inexistente: ${relation.origem.id}.`,
        ),
      );
    if (
      relation.origem.tipo === "indicador" &&
      !variablesById.has(relation.origem.id)
    )
      diagnostics.push(
        issue(
          initialStateFile,
          field,
          `Indicador inexistente: ${relation.origem.id}.`,
        ),
      );
  }
  const electoralLaws = content.policyCatalog?.leisEleitorais ?? [];
  const electoralLawsById = new Map(electoralLaws.map((law) => [law.id, law]));
  const organization = content.organizacaoPolitica;
  const initialForm = organization?.formasDeGoverno.find(
    (form) => form.id === organization.formaInicial,
  );
  const activeElectoralScopes = new Set<string>();
  for (const [index, lawId] of (
    content.initialState.leisEleitoraisVigentes ?? []
  ).entries()) {
    const field = `leisEleitoraisVigentes.${index}`;
    const law = electoralLawsById.get(lawId);
    if (!law) {
      diagnostics.push(
        issue(
          initialStateFile,
          field,
          `Lei eleitoral vigente inexistente: ${lawId}.`,
        ),
      );
      continue;
    }
    if (!organization || !initialForm) {
      diagnostics.push(
        issue(
          initialStateFile,
          field,
          "Lei eleitoral exige organização política inicial válida.",
        ),
      );
      continue;
    }
    if (!initialForm.eleicoesAtivas.includes(law.eleicao))
      diagnostics.push(
        issue(
          initialStateFile,
          field,
          `A eleição ${law.eleicao} não está ativa na forma inicial.`,
        ),
      );
    if (!initialForm.instituicoesAtivas.includes(law.instituicao))
      diagnostics.push(
        issue(
          initialStateFile,
          field,
          `A instituição ${law.instituicao} não está ativa na forma inicial.`,
        ),
      );
    const scope = `${law.eleicao}\u0000${law.alcance}`;
    if (activeElectoralScopes.has(scope))
      diagnostics.push(
        issue(
          initialStateFile,
          field,
          `Há duas leis eleitorais vigentes para ${law.eleicao} no alcance ${law.alcance}.`,
        ),
      );
    activeElectoralScopes.add(scope);
  }

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
    if (
      variable.valorInicial !== undefined &&
      !isInDomain(variable.valorInicial, variable)
    ) {
      diagnostics.push(
        issue(
          content.variables.id,
          `variaveis.${variable.id}.valorInicial`,
          "O valor inicial está fora do domínio declarado.",
        ),
      );
    }
  }

  const ownLimits = new Map<string, { minimo?: number; maximo?: number }>();
  for (const [index, limit] of (
    content.initialState.limitesProprios ?? []
  ).entries()) {
    const field = `limitesProprios[${index}].lei`;
    if (!policiesById.has(limit.lei))
      diagnostics.push(
        issue(initialStateFile, field, `Lei inexistente: ${limit.lei}.`),
      );
    else if (ownLimits.has(limit.lei))
      diagnostics.push(
        issue(initialStateFile, field, `Limite repetido para ${limit.lei}.`),
      );
    else ownLimits.set(limit.lei, limit);
  }

  const inheritedPolicies = new Set<string>();
  for (const [index, initial] of (
    content.initialState.leisVigentes ?? []
  ).entries()) {
    const field = `leisVigentes[${index}]`;
    if (inheritedPolicies.has(initial.lei)) {
      diagnostics.push(
        issue(
          initialStateFile,
          `${field}.lei`,
          `Lei vigente duplicada: ${initial.lei}.`,
        ),
      );
      continue;
    }
    inheritedPolicies.add(initial.lei);
    const policy = policiesById.get(initial.lei);
    if (!policy) {
      diagnostics.push(
        issue(
          initialStateFile,
          `${field}.lei`,
          `Lei vigente inexistente: ${initial.lei}.`,
        ),
      );
      continue;
    }
    const levels = resolveInheritedLawLevels(policy, initial);
    if (!levels.ok) {
      diagnostics.push(
        issue(initialStateFile, `${field}.${levels.field}`, levels.message),
      );
      continue;
    }
    const control = variablesById.get(policy.controle.variavel);
    if (!control) continue;
    const limit = ownLimits.get(initial.lei);
    const withinOwnLimit = (level: number) =>
      (limit?.minimo === undefined || level >= limit.minimo) &&
      (limit?.maximo === undefined || level <= limit.maximo);
    if (
      !isInDomain(levels.desiredLevel, control) ||
      !isInDomain(levels.implementedLevel, control) ||
      !withinOwnLimit(levels.desiredLevel)
    )
      diagnostics.push(
        issue(
          initialStateFile,
          field,
          `Nível inicial fora do domínio para a lei ${initial.lei}.`,
        ),
      );
  }

  for (const [variableId, value] of Object.entries(
    content.initialState.valores,
  )) {
    const variable = variablesById.get(variableId);
    if (
      variable &&
      (variable.tipo === "calculado" ||
        variable.tipo === "situacao" ||
        variable.tipo === "grupo")
    ) {
      diagnostics.push(
        issue(
          content.initialState.id,
          `valores.${variableId}`,
          "O país não declara valor de índice ou situação: eles são calculados pela rede (D-41).",
        ),
      );
      continue;
    }
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
  for (const [variableId, value] of Object.entries(
    content.initialState.indicesIniciais ?? {},
  )) {
    const variable = variablesById.get(variableId);
    const field = `indicesIniciais.${variableId}`;
    if (
      !variable ||
      (variable.tipo !== "calculado" &&
        variable.tipo !== "situacao" &&
        variable.tipo !== "grupo")
    )
      diagnostics.push(
        issue(
          content.initialState.id,
          field,
          "Só índice ou situação têm valor inicial de cenário (D-55).",
        ),
      );
    else if (!isInDomain(value, variable))
      diagnostics.push(
        issue(
          content.initialState.id,
          field,
          "O valor inicial está fora do domínio da variável.",
        ),
      );
  }
  for (const variable of content.variables.variaveis) {
    if (
      variable.tipo === "estoque" &&
      !(variable.id in content.initialState.valores)
    ) {
      diagnostics.push(
        issue(
          content.initialState.id,
          `valores.${variable.id}`,
          "O estado inicial precisa informar o valor de todo estoque.",
        ),
      );
    }
  }

  // Uma lei só lista consequências que saem do seu próprio controle; as
  // ligações entre bolhas são da rede e valem sempre (D-41).
  for (const policy of content.policies)
    for (const consequenceId of policy.consequencias) {
      const consequence = content.consequences.find(
        (item) => item.id === consequenceId,
      );
      if (consequence && consequence.origem !== policy.controle.variavel)
        diagnostics.push(
          issue(
            policy.id,
            "consequencias",
            `A consequência ${consequenceId} não sai do controle desta lei; ligações entre bolhas são da rede e não pertencem a uma lei.`,
          ),
        );
    }

  // Ocorrências (SG106): nós, setas, gatilhos, opções e desdobramentos.
  validateOccurrences(content, variablesById, policiesById, diagnostics);

  // Lei filha (SG138): a mãe existe e tem as opções pedidas, não há ciclo e o
  // país começa coerente (filha fora da base só com a mãe numa das opções).
  const initialDesired = new Map<string, number>();
  for (const initial of content.initialState.leisVigentes ?? []) {
    const policy = policiesById.get(initial.lei);
    if (!policy) continue;
    const levels = resolveInheritedLawLevels(policy, initial);
    if (levels.ok) initialDesired.set(initial.lei, levels.desiredLevel);
  }
  for (const policy of content.policies) {
    const requirement = policy.requer;
    if (!requirement) continue;
    const parent = policiesById.get(requirement.lei);
    if (!parent || parent.id === policy.id) {
      diagnostics.push(
        issue(
          policy.id,
          "requer.lei",
          parent
            ? "A lei não pode exigir a si mesma."
            : `Lei mãe inexistente: ${requirement.lei}.`,
        ),
      );
      continue;
    }
    const own = policy.controle.opcoes ?? [];
    if (own.length === 0)
      diagnostics.push(
        issue(
          policy.id,
          "controle.opcoes",
          "A lei filha precisa ter opções: a primeira é a base para onde ela cai.",
        ),
      );
    const parentOptions = parent.controle.opcoes ?? [];
    if (parentOptions.length === 0) {
      diagnostics.push(
        issue(policy.id, "requer.lei", "A lei mãe precisa ter opções."),
      );
      continue;
    }
    const allowed: number[] = [];
    for (const [index, optionId] of requirement.opcoes.entries()) {
      const option = parentOptions.find((item) => item.id === optionId);
      if (!option)
        diagnostics.push(
          issue(
            policy.id,
            `requer.opcoes[${index}]`,
            `A lei ${parent.id} não tem a opção ${optionId}.`,
          ),
        );
      else allowed.push(option.valor);
    }
    let ancestor = parent.requer?.lei;
    const seen = new Set([policy.id, parent.id]);
    while (ancestor !== undefined) {
      if (seen.has(ancestor)) {
        diagnostics.push(
          issue(policy.id, "requer.lei", "Ciclo de leis mães e filhas."),
        );
        break;
      }
      seen.add(ancestor);
      ancestor = policiesById.get(ancestor)?.requer?.lei;
    }
    const childLevel = initialDesired.get(policy.id);
    const parentLevel = initialDesired.get(parent.id);
    if (
      own.length > 0 &&
      childLevel !== undefined &&
      Math.abs(childLevel - own[0].valor) > 1e-9 &&
      (parentLevel === undefined ||
        !allowed.some((value) => Math.abs(value - parentLevel) < 1e-9))
    )
      diagnostics.push(
        issue(
          initialStateFile,
          "leisVigentes",
          `A lei ${policy.id} começa fora da base, mas a lei ${parent.id} não está numa das opções que ela exige.`,
        ),
      );
  }

  for (const policy of content.policies) {
    const control = variablesById.get(policy.controle.variavel);
    if (!control) {
      diagnostics.push(
        issue(
          policy.id,
          "controle.variavel",
          "A política precisa apontar para uma variável de controle existente.",
        ),
      );
      continue;
    }
    if (control.tipo !== "controle") {
      diagnostics.push(
        issue(
          policy.id,
          "controle.variavel",
          "Uma política só pode comandar uma variável do tipo controle.",
        ),
      );
    }
    if (control.dominio.minimo === undefined) {
      diagnostics.push(
        issue(
          content.variables.id,
          `variaveis.${control.id}.dominio.minimo`,
          "Uma variável comandada por política precisa declarar o mínimo do domínio.",
        ),
      );
    }
    for (const [index, option] of (policy.controle.opcoes ?? []).entries()) {
      if (!isInDomain(option.valor, control)) {
        diagnostics.push(
          issue(
            policy.id,
            `controle.opcoes[${index}].valor`,
            "A opção da política precisa estar dentro do domínio do controle.",
          ),
        );
      }
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
    // Mecanismos não lineares só existem para entradas não negativas, e o
    // divisor de uma razão nunca pode chegar a zero: o pacote prova isso antes.
    const origin = variablesById.get(consequence.origem);
    if (
      (consequence.mecanismo === "saturacao" ||
        consequence.mecanismo === "retornos_decrescentes") &&
      origin &&
      (origin.dominio.minimo === undefined || origin.dominio.minimo < 0)
    )
      diagnostics.push(
        issue(
          consequence.id,
          "origem",
          "Saturação e retornos decrescentes exigem origem com domínio mínimo ≥ 0.",
        ),
      );
    if (consequence.normalizacao?.divisor !== undefined) {
      const divisor = variablesById.get(consequence.normalizacao.divisor);
      if (
        divisor &&
        (divisor.dominio.minimo === undefined || divisor.dominio.minimo <= 0)
      )
        diagnostics.push(
          issue(
            consequence.id,
            "normalizacao.divisor",
            "O divisor precisa ter domínio com mínimo maior que zero.",
          ),
        );
    }
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
    const expectedUnit =
      target.tipo === "estoque"
        ? (rateUnitFor(target.unidade) ?? target.unidade)
        : target.unidade;
    if (consequence.unidade !== expectedUnit) {
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

function conditionVariables(
  condition: OccurrenceCondition | undefined,
  out: string[] = [],
): string[] {
  if (!condition) return out;
  if (condition.tipo === "comparacao") out.push(condition.variavel);
  else if (condition.tipo === "nao")
    conditionVariables(condition.condicao, out);
  else for (const item of condition.condicoes) conditionVariables(item, out);
  return out;
}

function validateOccurrences(
  content: ResolvedPackage,
  variablesById: ReadonlyMap<string, VariableDefinition>,
  policiesById: ReadonlyMap<string, PolicyFile>,
  diagnostics: ContentDiagnostic[],
): void {
  const occurrences = [...content.events, ...content.dilemmas];
  const ids = new Set(occurrences.map((o) => o.id));
  const consequencesById = new Map(content.consequences.map((c) => [c.id, c]));
  const needControl = (owner: string, field: string, id: string) => {
    const variable = variablesById.get(id);
    if (!variable || variable.tipo !== "controle")
      diagnostics.push(
        issue(owner, field, `O nó ${id} precisa existir e ser um controle.`),
      );
  };
  const needVariable = (owner: string, field: string, id: string) => {
    if (!variablesById.has(id))
      diagnostics.push(issue(owner, field, `A variável ${id} não existe.`));
  };
  const originsFrom = (
    owner: string,
    field: string,
    list: readonly string[],
    control: string,
  ) => {
    for (const id of list) {
      const consequence = consequencesById.get(id);
      if (consequence && consequence.origem !== control)
        diagnostics.push(
          issue(owner, field, `A consequência ${id} não sai do nó ${control}.`),
        );
    }
  };
  const followUps = (
    owner: string,
    field: string,
    list: OccurrenceFile["desdobramentos"],
  ) => {
    for (const [i, item] of (list ?? []).entries())
      if (!ids.has(item.ocorrencia))
        diagnostics.push(
          issue(
            owner,
            `${field}[${i}].ocorrencia`,
            `Ocorrência inexistente: ${item.ocorrencia}.`,
          ),
        );
  };
  for (const occurrence of occurrences) {
    const trigger = occurrence.gatilho;
    if (trigger) {
      for (const [i, factor] of (trigger.fatores ?? []).entries())
        needVariable(occurrence.id, `gatilho.fatores[${i}]`, factor.variavel);
      for (const id of conditionVariables(trigger.condicao))
        needVariable(occurrence.id, "gatilho.condicao", id);
      if (trigger.reacao)
        needControl(
          occurrence.id,
          "gatilho.reacao.controle",
          trigger.reacao.controle,
        );
      // catástrofe ao acaso é rara; a que nasce de uma condição do país
      // (a dívida explodindo) pode ser provável quando a condição vale
      if (
        occurrence.nivel === 4 &&
        !trigger.condicao &&
        !trigger.reacao &&
        trigger.chance > 0.005
      )
        diagnostics.push(
          issue(
            occurrence.id,
            "gatilho.chance",
            "Catástrofe ao acaso (nível 4, sem condição) não passa de 0,5% por turno.",
          ),
        );
    }
    followUps(occurrence.id, "desdobramentos", occurrence.desdobramentos);
    if (occurrence.tipo === "evento" && occurrence.controle) {
      needControl(occurrence.id, "controle", occurrence.controle);
      if (occurrence.duracaoMeses === undefined)
        diagnostics.push(
          issue(occurrence.id, "duracaoMeses", "O evento precisa de duração."),
        );
      originsFrom(
        occurrence.id,
        "consequencias",
        occurrence.consequencias,
        occurrence.controle,
      );
    }
    if (occurrence.tipo !== "dilema" || !occurrence.opcoes) continue;
    const options = occurrence.opcoes;
    if (options.length < 2 || options.length > 4)
      diagnostics.push(
        issue(occurrence.id, "opcoes", "Um dilema tem de 2 a 4 opções."),
      );
    const optionIds = new Set(options.map((o) => o.id));
    if (optionIds.size !== options.length)
      diagnostics.push(issue(occurrence.id, "opcoes", "Opções repetidas."));
    const fallback = options.find((o) => o.id === occurrence.padrao);
    if (!fallback || fallback.requer)
      diagnostics.push(
        issue(
          occurrence.id,
          "padrao",
          "O dilema precisa de uma opção padrão sempre disponível (sem requer).",
        ),
      );
    const listed = new Set(occurrence.consequencias);
    for (const [i, option] of options.entries()) {
      const field = `opcoes[${i}]`;
      needControl(occurrence.id, `${field}.controle`, option.controle);
      originsFrom(
        occurrence.id,
        `${field}.consequencias`,
        option.consequencias,
        option.controle,
      );
      for (const id of option.consequencias)
        if (!listed.has(id))
          diagnostics.push(
            issue(
              occurrence.id,
              `${field}.consequencias`,
              `A consequência ${id} precisa estar também na lista do dilema.`,
            ),
          );
      for (const id of conditionVariables(option.requer))
        needVariable(occurrence.id, `${field}.requer`, id);
      for (const [j, law] of (option.leis ?? []).entries())
        if (!policiesById.has(law.lei))
          diagnostics.push(
            issue(
              occurrence.id,
              `${field}.leis[${j}]`,
              `Lei inexistente: ${law.lei}.`,
            ),
          );
      followUps(
        occurrence.id,
        `${field}.desdobramentos`,
        option.desdobramentos,
      );
    }
  }
}
