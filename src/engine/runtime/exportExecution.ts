import type { ResolvedPackage } from "../model/resolvePackage";
import type { EngineExecution } from "./createExecution";
import type { PendingDilemma } from "./evaluateDilemma";

export const executionSnapshotVersion = 1 as const;
export const executorVersion = 1 as const;

export type OccurrenceState = Readonly<{
  activeSituationIds: readonly string[];
  occurredEventIds: readonly string[];
  pendingDilemmas: readonly PendingDilemma[];
}>;

export type ExecutionAuxiliaryState = Readonly<{
  occurrences: OccurrenceState;
  gradualMemory: Readonly<Record<string, number>>;
}>;

export type ExecutionSnapshotExport = Readonly<{
  format: "sisgov-engine-snapshot";
  snapshotVersion: typeof executionSnapshotVersion;
  executorVersion: typeof executorVersion;
  package: Readonly<{
    id: string;
    schemaVersion: number;
    contentIdentity: string;
  }>;
  execution: EngineExecution;
  auxiliary: ExecutionAuxiliaryState;
}>;

function hashText(text: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

/** Identifica a definição completa usada para criar uma execução. */
export function createPackageContentIdentity(content: ResolvedPackage): string {
  return hashText(
    JSON.stringify({
      manifest: content.manifest,
      initialState: content.initialState,
      variables: content.variables,
      policies: content.policies,
      consequences: content.consequences,
      events: content.events,
      situations: content.situations,
      dilemmas: content.dilemmas,
    }),
  );
}

/** Exporta um retrato independente e serializável sem alterar a partida aberta. */
export function exportExecution(
  content: ResolvedPackage,
  execution: EngineExecution,
  auxiliary: ExecutionAuxiliaryState = {
    occurrences: {
      activeSituationIds: [],
      occurredEventIds: [],
      pendingDilemmas: [],
    },
    gradualMemory: {},
  },
): ExecutionSnapshotExport {
  return structuredClone({
    format: "sisgov-engine-snapshot" as const,
    snapshotVersion: executionSnapshotVersion,
    executorVersion,
    package: {
      id: content.manifest.id,
      schemaVersion: content.manifest.versaoEsquema,
      contentIdentity: createPackageContentIdentity(content),
    },
    execution,
    auxiliary,
  });
}
