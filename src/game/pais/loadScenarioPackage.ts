import {
  analyzePackage,
  buildGraph,
  resolvePackage,
  validatePackageCoherence,
  type PackageFiles,
  type PackageAnalysis,
  type ScenarioGraph,
  type ValidationResult,
} from "../../engine";
import type { ResolvedPackage } from "../../engine";
import { expandirPais } from "./configuracao";
import { expandirFichasV3 } from "./fichaV3";
import { expandirPressao } from "./pressao";

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
  // País da versão 1 vira manifesto + estado inicial, já sem o que ele não
  // comporta (V1-06); depois, fichas v3 viram lei v2 + consequências (V1-05);
  // por fim, os grupos de pressão entram (V1-09).
  const pais = expandirPais(manifestPath, files);
  if (!pais.ok) return pais;
  const expanded = expandirFichasV3(pais.value.files);
  if (!expanded.ok) return expanded;
  // Grupos de pressão (V1-09): nós, setas e eventos dos grupos e patrocinadores.
  const pressao = expandirPressao(pais.value.manifestPath, expanded.value);
  if (!pressao.ok) return pressao;
  const resolved = resolvePackage(pais.value.manifestPath, pressao.value);
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
    import.meta.glob<string>("../../conteudo/**/*.json", {
      eager: true,
      query: "?raw",
      import: "default",
    }),
  ).map(([path, text]) => [path.slice("../../conteudo/".length), text]),
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
    .filter(
      (path) => path.endsWith("/cenario.json") || path.endsWith("/pais.json"),
    )
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
