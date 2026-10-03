import {
  analyzePackage,
  buildGraph,
  resolvePackage,
  validatePackageCoherence,
  type PackageFiles,
  type PackageAnalysis,
  type ScenarioGraph,
  type ValidationResult,
} from "../engine";
import type { ResolvedPackage } from "../engine";

export type LoadedScenarioPackage = Readonly<{
  definition: ResolvedPackage;
  graph: ScenarioGraph;
  analysis: PackageAnalysis;
}>;

export function loadScenarioPackage(
  manifestPath: string,
  files: PackageFiles,
  distributedFiles: readonly string[] = [],
): ValidationResult<LoadedScenarioPackage> {
  const resolved = resolvePackage(manifestPath, files);
  if (!resolved.ok) return resolved;
  const coherent = validatePackageCoherence(resolved.value);
  if (!coherent.ok) return coherent;
  const graph = buildGraph(coherent.value);
  return {
    ok: true,
    value: {
      definition: coherent.value,
      graph,
      analysis: analyzePackage(coherent.value, graph, distributedFiles),
    },
  };
}

const distributedFiles = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>("./**/*.json", {
      eager: true,
      query: "?raw",
      import: "default",
    }),
  ).map(([path, text]) => [path.slice(2), text]),
);

export function loadDistributedScenario(
  manifestPath: string,
): ValidationResult<LoadedScenarioPackage> {
  const packageRoot = manifestPath.slice(0, manifestPath.lastIndexOf("/") + 1);
  const packageFiles = Object.keys(distributedFiles).filter((path) =>
    path.startsWith(packageRoot),
  );
  return loadScenarioPackage(manifestPath, distributedFiles, packageFiles);
}

export type DistributedScenarioSummary = Readonly<{
  path: string;
  id: string;
  name: string;
}>;

/** Descobre manifestos distribuídos para que conteúdo novo não exija cadastro na interface. */
export function listDistributedScenarios(): readonly DistributedScenarioSummary[] {
  return Object.keys(distributedFiles)
    .filter((path) => path.endsWith("/cenario.json"))
    .flatMap((path) => {
      const loaded = loadDistributedScenario(path);
      return loaded.ok
        ? [
            {
              path,
              id: loaded.value.definition.manifest.id,
              name: loaded.value.definition.manifest.nome,
            },
          ]
        : [];
    })
    .sort((left, right) => left.name.localeCompare(right.name, "pt-BR"));
}
