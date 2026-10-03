import type {
  ContentDiagnostic,
  ValidationResult,
} from "../diagnostics/contentDiagnostic";
import type { ResolvedPackage } from "../model/resolvePackage";
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
    Array.isArray(value) && value.every((item) => typeof item === "string")
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

function validateExecution(
  raw: JsonObject,
  content: ResolvedPackage,
  diagnostics: ContentDiagnostic[],
): void {
  if (!Number.isInteger(raw.step) || (raw.step as number) < 0)
    diagnostics.push(diagnostic("execution.step", "Passo inválido."));
  if (!isFiniteNumberRecord(raw.values))
    diagnostics.push(
      diagnostic("execution.values", "Valores ausentes ou inválidos."),
    );
  if (!isFiniteNumberRecord(raw.initialValues))
    diagnostics.push(
      diagnostic(
        "execution.initialValues",
        "Valores iniciais ausentes ou inválidos.",
      ),
    );
  if (!Number.isInteger(raw.historyLimit) || (raw.historyLimit as number) < 0)
    diagnostics.push(
      diagnostic("execution.historyLimit", "Limite de histórico inválido."),
    );
  if (!Array.isArray(raw.history))
    diagnostics.push(diagnostic("execution.history", "Histórico ausente."));
  else if (
    typeof raw.historyLimit === "number" &&
    raw.history.length > raw.historyLimit
  )
    diagnostics.push(
      diagnostic("execution.history", "Histórico excede o limite declarado."),
    );
  if (
    !isObject(raw.relationMemory) ||
    !isStringArray(raw.relationMemory.firedRelationIds) ||
    !isFiniteNumberRecord(raw.relationMemory.fixedRemaining)
  ) {
    diagnostics.push(
      diagnostic(
        "execution.relationMemory",
        "Memória das relações está incompleta.",
      ),
    );
  }
  if (isFiniteNumberRecord(raw.values)) {
    for (const variable of content.variables.variaveis) {
      if (!(variable.id in raw.values))
        diagnostics.push(
          diagnostic(
            `execution.values.${variable.id}`,
            "Valor obrigatório ausente.",
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
  else validateExecution(raw.execution, content, diagnostics);
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
