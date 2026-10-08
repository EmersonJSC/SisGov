import type {
  ContentDiagnostic,
  ValidationResult,
} from "../diagnostics/contentDiagnostic";
import { validateContentFile } from "./validateContentFile";
import type {
  ConsequenceFile,
  ContentFile,
  InitialStateFile,
  PolicyCatalogFile,
  OccurrenceFile,
  PolicyFile,
  PoliticalOrganizationFile,
  ScenarioManifest,
  VariablesFile,
} from "./contentTypes";

export type PackageFiles = Readonly<Record<string, string>>;

export type ResolvedPackage = {
  manifest: ScenarioManifest;
  organizacaoPolitica?: PoliticalOrganizationFile;
  initialState: InitialStateFile;
  policyCatalog?: PolicyCatalogFile;
  variables: VariablesFile;
  policies: readonly PolicyFile[];
  consequences: readonly ConsequenceFile[];
  events: readonly OccurrenceFile[];
  situations: readonly OccurrenceFile[];
  dilemmas: readonly OccurrenceFile[];
  filesById: Readonly<Record<string, ContentFile>>;
  pathsById: Readonly<Record<string, string>>;
};

function issue(
  file: string,
  field: string,
  code: ContentDiagnostic["code"],
  message: string,
): ContentDiagnostic {
  return { file, field, code, message };
}

function readFile(
  path: string,
  files: PackageFiles,
  diagnostics: ContentDiagnostic[],
): ContentFile | undefined {
  const text = files[path];
  if (text === undefined) {
    diagnostics.push(
      issue(
        path,
        "$",
        "ARQUIVO_AUSENTE",
        "Arquivo declarado no manifesto não foi encontrado.",
      ),
    );
    return undefined;
  }
  const result = validateContentFile(path, text);
  if (!result.ok) {
    diagnostics.push(...result.diagnostics);
    return undefined;
  }
  return result.value;
}

function expectType(
  file: ContentFile | undefined,
  expected: readonly string[],
  path: string,
  diagnostics: ContentDiagnostic[],
): ContentFile | undefined {
  if (!file) return undefined;
  if (!expected.includes(file.tipo)) {
    diagnostics.push(
      issue(
        path,
        "tipo",
        "TIPO_DE_ARQUIVO_INCORRETO",
        `O manifesto esperava ${expected.join(" ou ")}, mas encontrou ${file.tipo}.`,
      ),
    );
    return undefined;
  }
  return file;
}

function readList(
  paths: readonly string[],
  expected: readonly string[],
  files: PackageFiles,
  diagnostics: ContentDiagnostic[],
): ContentFile[] {
  const seenPaths = new Set<string>();
  const resolved: ContentFile[] = [];
  for (const path of paths) {
    if (seenPaths.has(path)) {
      diagnostics.push(
        issue(
          path,
          "$",
          "ARQUIVO_DUPLICADO",
          "O manifesto declarou este arquivo mais de uma vez.",
        ),
      );
      continue;
    }
    seenPaths.add(path);
    const file = expectType(
      readFile(path, files, diagnostics),
      expected,
      path,
      diagnostics,
    );
    if (file) resolved.push(file);
  }
  return resolved;
}

function checkIds(
  files: readonly ContentFile[],
  diagnostics: ContentDiagnostic[],
): Readonly<Record<string, ContentFile>> {
  const byId: Record<string, ContentFile> = {};
  for (const file of files) {
    if (byId[file.id]) {
      diagnostics.push(
        issue(
          "$pacote",
          `id.${file.id}`,
          "ID_DUPLICADO",
          `O ID ${file.id} foi declarado mais de uma vez.`,
        ),
      );
    } else byId[file.id] = file;
  }
  return byId;
}

function checkReferences(
  initialState: InitialStateFile | undefined,
  variables: VariablesFile | undefined,
  policies: readonly PolicyFile[],
  consequences: readonly ConsequenceFile[],
  occurrences: readonly OccurrenceFile[],
  diagnostics: ContentDiagnostic[],
): void {
  const variableIds = new Set(
    variables?.variaveis.map((variable) => variable.id),
  );
  const consequenceIds = new Set(
    consequences.map((consequence) => consequence.id),
  );
  for (const id of Object.keys(initialState?.valores ?? {})) {
    if (!variableIds.has(id)) {
      diagnostics.push(
        issue(
          "estado-inicial",
          `valores.${id}`,
          "REFERENCIA_QUEBRADA",
          `A variável ${id} não existe.`,
        ),
      );
    }
  }
  for (const consequence of consequences) {
    for (const field of ["origem", "alvo"] as const) {
      if (!variableIds.has(consequence[field])) {
        diagnostics.push(
          issue(
            consequence.id,
            field,
            "REFERENCIA_QUEBRADA",
            `A variável ${consequence[field]} não existe.`,
          ),
        );
      }
    }
  }
  for (const source of [...policies, ...occurrences]) {
    for (const consequenceId of source.consequencias) {
      if (!consequenceIds.has(consequenceId)) {
        diagnostics.push(
          issue(
            source.id,
            "consequencias",
            "REFERENCIA_QUEBRADA",
            `A consequência ${consequenceId} não existe.`,
          ),
        );
      }
    }
  }
}

function sorted<T extends { id: string }>(files: readonly T[]): readonly T[] {
  return [...files].sort((left, right) => left.id.localeCompare(right.id));
}

/** Lê um manifesto e devolve somente um pacote com arquivos, IDs e referências válidos. */
export function resolvePackage(
  manifestPath: string,
  files: PackageFiles,
): ValidationResult<ResolvedPackage> {
  const diagnostics: ContentDiagnostic[] = [];
  const rawManifest = expectType(
    readFile(manifestPath, files, diagnostics),
    ["cenario"],
    manifestPath,
    diagnostics,
  );
  if (!rawManifest) return { ok: false, diagnostics };
  const manifest = rawManifest as ScenarioManifest;

  const initialState = expectType(
    readFile(manifest.estadoInicial, files, diagnostics),
    ["estado-inicial"],
    manifest.estadoInicial,
    diagnostics,
  ) as InitialStateFile | undefined;
  const variables = expectType(
    readFile(manifest.variaveis, files, diagnostics),
    ["variaveis"],
    manifest.variaveis,
    diagnostics,
  ) as VariablesFile | undefined;
  const policyCatalog = manifest.catalogoPoliticas
    ? (expectType(
        readFile(manifest.catalogoPoliticas, files, diagnostics),
        ["catalogo-politicas"],
        manifest.catalogoPoliticas,
        diagnostics,
      ) as PolicyCatalogFile | undefined)
    : undefined;
  const policies = readList(
    policyCatalog?.politicas ?? manifest.politicas ?? [],
    ["lei", "imposto", "programa", "regulamentacao"],
    files,
    diagnostics,
  ) as PolicyFile[];
  const consequences = readList(
    manifest.consequencias,
    ["consequencia"],
    files,
    diagnostics,
  ) as ConsequenceFile[];
  const events = readList(
    manifest.eventos ?? [],
    ["evento"],
    files,
    diagnostics,
  ) as OccurrenceFile[];
  const situations = readList(
    manifest.situacoes ?? [],
    ["situacao"],
    files,
    diagnostics,
  ) as OccurrenceFile[];
  const dilemmas = readList(
    manifest.dilemas ?? [],
    ["dilema"],
    files,
    diagnostics,
  ) as OccurrenceFile[];
  const politicalOrganization = manifest.organizacaoPolitica
    ? (expectType(
        readFile(manifest.organizacaoPolitica, files, diagnostics),
        ["organizacao-politica"],
        manifest.organizacaoPolitica,
        diagnostics,
      ) as PoliticalOrganizationFile | undefined)
    : undefined;
  const allFiles: ContentFile[] = [
    manifest,
    ...policies,
    ...consequences,
    ...events,
    ...situations,
    ...dilemmas,
  ];
  if (politicalOrganization) allFiles.push(politicalOrganization);
  if (policyCatalog) allFiles.push(policyCatalog);
  if (initialState) allFiles.push(initialState);
  if (variables) allFiles.push(variables);
  const filesById = checkIds(allFiles, diagnostics);
  const pathsById: Record<string, string> = {};
  const declaredPaths = [
    manifestPath,
    manifest.estadoInicial,
    manifest.variaveis,
    ...(manifest.catalogoPoliticas ? [manifest.catalogoPoliticas] : []),
    ...(policyCatalog?.politicas ?? manifest.politicas ?? []),
    ...manifest.consequencias,
    ...(manifest.eventos ?? []),
    ...(manifest.situacoes ?? []),
    ...(manifest.dilemas ?? []),
    ...(manifest.organizacaoPolitica ? [manifest.organizacaoPolitica] : []),
  ];
  for (const path of declaredPaths) {
    const text = files[path];
    if (text === undefined) continue;
    const file = validateContentFile(path, text);
    if (file.ok) pathsById[file.value.id] = path;
  }
  checkReferences(
    initialState,
    variables,
    policies,
    consequences,
    [...events, ...situations, ...dilemmas],
    diagnostics,
  );
  if (diagnostics.length > 0 || !initialState || !variables)
    return { ok: false, diagnostics };

  return {
    ok: true,
    value: {
      manifest,
      organizacaoPolitica: politicalOrganization,
      policyCatalog,
      initialState,
      variables,
      policies: sorted(policies),
      consequences: sorted(consequences),
      events: sorted(events),
      situations: sorted(situations),
      dilemmas: sorted(dilemmas),
      filesById,
      pathsById,
    },
  };
}
