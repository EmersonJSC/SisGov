import type {
  ContentDiagnostic,
  ValidationResult,
} from "../diagnostics/contentDiagnostic";
import { buildGraph } from "../graph/buildGraph";
import type { ResolvedPackage } from "../model/resolvePackage";
import type { VariableDefinition } from "../model/contentTypes";
import type { EngineExecution } from "./createExecution";
import {
  createPackageContentIdentity,
  executionSnapshotVersion,
  executorVersion,
  type ExecutionAuxiliaryState,
  type ExecutionSnapshotExport,
} from "./exportExecution";

export type RestoredExecution = Readonly<{
  execution: EngineExecution;
  auxiliary: ExecutionAuxiliaryState;
}>;

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function diagnostic(field: string, message: string): ContentDiagnostic {
  return { code: "SNAPSHOT_INVALIDO", file: "$snapshot", field, message };
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string" && item.length > 0)
  );
}

function isFiniteNumberRecord(value: unknown): value is Record<string, number> {
  return (
    isObject(value) &&
    Object.values(value).every(
      (item) => typeof item === "number" && Number.isFinite(item),
    )
  );
}

function isNonNegativeInteger(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) >= 0;
}

function isInDomain(value: number, variable: VariableDefinition): boolean {
  return (
    (variable.dominio.minimo === undefined ||
      value >= variable.dominio.minimo) &&
    (variable.dominio.maximo === undefined || value <= variable.dominio.maximo)
  );
}

function validateValues(
  value: unknown,
  field: string,
  content: ResolvedPackage,
  diagnostics: ContentDiagnostic[],
): value is Record<string, number> {
  if (!isFiniteNumberRecord(value)) {
    diagnostics.push(diagnostic(field, "Valores ausentes ou inválidos."));
    return false;
  }
  const variablesById = new Map(
    content.variables.variaveis.map((variable) => [variable.id, variable]),
  );
  for (const variable of content.variables.variaveis) {
    if (!Object.prototype.hasOwnProperty.call(value, variable.id)) {
      diagnostics.push(
        diagnostic(`${field}.${variable.id}`, "Valor obrigatório ausente."),
      );
    } else if (!isInDomain(value[variable.id], variable)) {
      diagnostics.push(
        diagnostic(
          `${field}.${variable.id}`,
          "O valor está fora do domínio da variável.",
        ),
      );
    }
  }
  for (const id of Object.keys(value)) {
    if (!variablesById.has(id))
      diagnostics.push(
        diagnostic(`${field}.${id}`, "Variável desconhecida no estado."),
      );
  }
  return true;
}

function validateCommands(
  value: unknown,
  field: string,
  content: ResolvedPackage,
  relationIds: ReadonlySet<string>,
  diagnostics: ContentDiagnostic[],
): void {
  if (!isObject(value)) {
    diagnostics.push(diagnostic(field, "Comandos ausentes ou inválidos."));
    return;
  }
  if (!Array.isArray(value.controlCommands)) {
    diagnostics.push(
      diagnostic(`${field}.controlCommands`, "Comandos de controle inválidos."),
    );
  } else {
    const changedControls = new Set<string>();
    const variablesById = new Map(
      content.variables.variaveis.map((variable) => [variable.id, variable]),
    );
    for (const [index, item] of value.controlCommands.entries()) {
      const commandField = `${field}.controlCommands[${index}]`;
      if (
        !isObject(item) ||
        typeof item.controlId !== "string" ||
        item.controlId.length === 0 ||
        typeof item.policyId !== "string" ||
        item.policyId.length === 0 ||
        typeof item.value !== "number" ||
        !Number.isFinite(item.value)
      ) {
        diagnostics.push(
          diagnostic(commandField, "Comando de controle malformado."),
        );
        continue;
      }
      const control = variablesById.get(item.controlId);
      if (!control || control.tipo !== "controle") {
        diagnostics.push(
          diagnostic(
            `${commandField}.controlId`,
            "O comando aponta para um controle inexistente.",
          ),
        );
      } else if (!isInDomain(item.value, control)) {
        diagnostics.push(
          diagnostic(`${commandField}.value`, "Valor de controle inválido."),
        );
      }
      if (changedControls.has(item.controlId))
        diagnostics.push(
          diagnostic(
            `${field}.controlCommands`,
            "Há mais de um comando para o mesmo controle.",
          ),
        );
      changedControls.add(item.controlId);
    }
  }
  if (!isStringArray(value.activeRelationIds)) {
    diagnostics.push(
      diagnostic(`${field}.activeRelationIds`, "Relações ativas inválidas."),
    );
  } else {
    for (const [index, id] of value.activeRelationIds.entries()) {
      if (!relationIds.has(id))
        diagnostics.push(
          diagnostic(
            `${field}.activeRelationIds[${index}]`,
            "A relação ativa não existe.",
          ),
        );
    }
  }
}

function validateExecution(
  raw: JsonObject,
  content: ResolvedPackage,
  relationIds: ReadonlySet<string>,
  diagnostics: ContentDiagnostic[],
): void {
  const step = isNonNegativeInteger(raw.step) ? raw.step : undefined;
  if (step === undefined)
    diagnostics.push(diagnostic("execution.step", "Passo inválido."));
  validateValues(raw.values, "execution.values", content, diagnostics);
  const rawInitialValues = raw.initialValues;
  const initialValuesValid = validateValues(
    rawInitialValues,
    "execution.initialValues",
    content,
    diagnostics,
  );
  if (!isNonNegativeInteger(raw.historyLimit))
    diagnostics.push(
      diagnostic("execution.historyLimit", "Limite de histórico inválido."),
    );
  if (!Array.isArray(raw.history))
    diagnostics.push(diagnostic("execution.history", "Histórico ausente."));
  else {
    if (
      isNonNegativeInteger(raw.historyLimit) &&
      raw.history.length > raw.historyLimit
    )
      diagnostics.push(
        diagnostic("execution.history", "Histórico excede o limite declarado."),
      );
    if (
      step !== undefined &&
      raw.history.some(
        (entry, index) => !isObject(entry) || entry.step !== step - index - 1,
      )
    )
      diagnostics.push(
        diagnostic(
          "execution.history",
          "Os passos do histórico estão fora de sequência.",
        ),
      );
    for (const [index, entry] of raw.history.entries()) {
      const field = `execution.history[${index}]`;
      if (!isObject(entry)) {
        diagnostics.push(diagnostic(field, "Retrato de histórico inválido."));
        continue;
      }
      if (!isNonNegativeInteger(entry.step))
        diagnostics.push(diagnostic(`${field}.step`, "Passo inválido."));
      validateValues(entry.values, `${field}.values`, content, diagnostics);
      validateCommands(
        entry.commands,
        `${field}.commands`,
        content,
        relationIds,
        diagnostics,
      );
    }
  }
  const relationMemory = raw.relationMemory;
  if (
    !isObject(relationMemory) ||
    !isStringArray(relationMemory.firedRelationIds) ||
    !isFiniteNumberRecord(relationMemory.fixedRemaining)
  ) {
    diagnostics.push(
      diagnostic(
        "execution.relationMemory",
        "Memória das relações está incompleta.",
      ),
    );
  } else {
    const graph = buildGraph(content);
    const firedIds = new Set<string>();
    for (const id of relationMemory.firedRelationIds) {
      const relation = Object.prototype.hasOwnProperty.call(
        graph.relationsById,
        id,
      )
        ? graph.relationsById[id]
        : undefined;
      if (!relation || relation.duration.modo !== "unico")
        diagnostics.push(
          diagnostic(
            `execution.relationMemory.firedRelationIds.${id}`,
            "A relação disparada não é válida.",
          ),
        );
      if (firedIds.has(id))
        diagnostics.push(
          diagnostic(
            "execution.relationMemory.firedRelationIds",
            "A relação disparada está duplicada.",
          ),
        );
      firedIds.add(id);
    }
    for (const [id, remaining] of Object.entries(
      relationMemory.fixedRemaining,
    )) {
      const relation = Object.prototype.hasOwnProperty.call(
        graph.relationsById,
        id,
      )
        ? graph.relationsById[id]
        : undefined;
      if (
        !relation ||
        relation.duration.modo !== "fixo" ||
        !Number.isInteger(remaining) ||
        remaining < 0 ||
        remaining > relation.duration.passos
      )
        diagnostics.push(
          diagnostic(
            `execution.relationMemory.fixedRemaining.${id}`,
            "A duração restante da relação é inválida.",
          ),
        );
    }
  }
  if (initialValuesValid && isFiniteNumberRecord(rawInitialValues)) {
    for (const variable of content.variables.variaveis) {
      if (
        rawInitialValues[variable.id] !==
        content.initialState.valores[variable.id]
      )
        diagnostics.push(
          diagnostic(
            `execution.initialValues.${variable.id}`,
            "O valor inicial difere do estado inicial do pacote.",
          ),
        );
    }
  }
}

/** Restaura somente snapshots completos e compatíveis com a definição atual. */
export function restoreExecution(
  content: ResolvedPackage,
  raw: unknown,
): ValidationResult<RestoredExecution> {
  const diagnostics: ContentDiagnostic[] = [];
  if (!isObject(raw))
    return {
      ok: false,
      diagnostics: [diagnostic("$", "O snapshot deve ser um objeto.")],
    };
  if (raw.format !== "sisgov-engine-snapshot")
    diagnostics.push(diagnostic("format", "Formato de snapshot desconhecido."));
  if (raw.snapshotVersion !== executionSnapshotVersion)
    diagnostics.push(
      diagnostic("snapshotVersion", "Versão de snapshot incompatível."),
    );
  if (raw.executorVersion !== executorVersion)
    diagnostics.push(
      diagnostic("executorVersion", "Versão do executor incompatível."),
    );
  if (!isObject(raw.package))
    diagnostics.push(diagnostic("package", "Identidade do pacote ausente."));
  else {
    if (
      raw.package.id !== content.manifest.id ||
      raw.package.schemaVersion !== content.manifest.versaoEsquema
    )
      diagnostics.push(
        diagnostic("package", "O snapshot pertence a outro pacote ou versão."),
      );
    if (raw.package.contentIdentity !== createPackageContentIdentity(content))
      diagnostics.push(
        diagnostic(
          "package.contentIdentity",
          "O conteúdo do pacote foi modificado.",
        ),
      );
  }
  if (!isObject(raw.execution))
    diagnostics.push(diagnostic("execution", "Estado numérico ausente."));
  else {
    const relationIds = new Set(buildGraph(content).relations.map((r) => r.id));
    validateExecution(raw.execution, content, relationIds, diagnostics);
  }
  if (
    !isObject(raw.auxiliary) ||
    !isObject(raw.auxiliary.occurrences) ||
    !isStringArray(raw.auxiliary.occurrences.activeSituationIds) ||
    !isStringArray(raw.auxiliary.occurrences.occurredEventIds) ||
    !Array.isArray(raw.auxiliary.occurrences.pendingDilemmas) ||
    !isFiniteNumberRecord(raw.auxiliary.gradualMemory)
  ) {
    diagnostics.push(
      diagnostic(
        "auxiliary",
        "Estado de ocorrências ou memória gradual está incompleto.",
      ),
    );
  }
  if (diagnostics.length > 0) return { ok: false, diagnostics };
  const snapshot = raw as ExecutionSnapshotExport;
  return {
    ok: true,
    value: structuredClone({
      execution: snapshot.execution,
      auxiliary: snapshot.auxiliary,
    }),
  };
}
