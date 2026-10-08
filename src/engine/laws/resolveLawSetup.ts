export type LawDefinition = Readonly<{
  id: string;
  scope: "ordinary" | "constitutional";
  requiresActive?: readonly string[];
  excludes?: readonly string[];
}>;

export type CountryLawSetup = Readonly<{
  countryId: string;
  activeLawIds: readonly string[];
}>;

export type LawSetupIssue = Readonly<{
  path: string;
  message: string;
}>;

export type ResolvedLawSetup = Readonly<{
  countryId: string;
  catalog: ReadonlyMap<string, LawDefinition>;
  active: ReadonlySet<string>;
}>;

type Resolution =
  | Readonly<{ ok: true; value: ResolvedLawSetup }>
  | Readonly<{ ok: false; issues: readonly LawSetupIssue[] }>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

/** Entry point for JSON content; malformed input returns diagnostics, never throws. */
export function resolveLawSetupJson(
  definitionsJson: string,
  countryJson: string,
): Resolution {
  let definitions: unknown;
  let setup: unknown;
  try {
    definitions = JSON.parse(definitionsJson);
    setup = JSON.parse(countryJson);
  } catch {
    return {
      ok: false,
      issues: [{ path: "$", message: "JSON de leis ou país inválido." }],
    };
  }
  const issues: LawSetupIssue[] = [];
  if (!Array.isArray(definitions)) {
    issues.push({
      path: "laws",
      message: "Catálogo de leis deve ser uma lista.",
    });
  } else {
    for (const [index, value] of definitions.entries()) {
      if (
        !isRecord(value) ||
        typeof value.id !== "string" ||
        (value.scope !== "ordinary" && value.scope !== "constitutional") ||
        (value.requiresActive !== undefined &&
          !isStringArray(value.requiresActive)) ||
        (value.excludes !== undefined && !isStringArray(value.excludes))
      )
        issues.push({
          path: `laws[${index}]`,
          message: "Definição de lei inválida.",
        });
    }
  }
  if (
    !isRecord(setup) ||
    typeof setup.countryId !== "string" ||
    !isStringArray(setup.activeLawIds)
  )
    issues.push({
      path: "country",
      message: "Estado inicial do país inválido.",
    });
  if (issues.length) return { ok: false, issues };
  return resolveLawSetup(
    definitions as LawDefinition[],
    setup as CountryLawSetup,
  );
}

/** Picks one country after loading a shared catalog and country JSON list. */
export function selectCountryLawSetupJson(
  definitionsJson: string,
  countriesJson: string,
  countryId: string,
): Resolution {
  let countries: unknown;
  try {
    countries = JSON.parse(countriesJson);
  } catch {
    return {
      ok: false,
      issues: [{ path: "countries", message: "JSON de países inválido." }],
    };
  }
  if (
    !Array.isArray(countries) ||
    countries.some(
      (country) =>
        !isRecord(country) ||
        typeof country.countryId !== "string" ||
        !isStringArray(country.activeLawIds),
    )
  )
    return {
      ok: false,
      issues: [{ path: "countries", message: "Lista de países inválida." }],
    };
  const ids = countries.map((country) => country.countryId as string);
  const issues: LawSetupIssue[] = [];
  uniqueIds(ids, "countries", issues);
  if (issues.length) return { ok: false, issues };
  const selected = countries.find((country) => country.countryId === countryId);
  if (!selected)
    return {
      ok: false,
      issues: [
        { path: "countryId", message: `País desconhecido: ${countryId}.` },
      ],
    };
  return resolveLawSetupJson(definitionsJson, JSON.stringify(selected));
}

function uniqueIds(
  ids: readonly string[],
  path: string,
  issues: LawSetupIssue[],
): void {
  const seen = new Set<string>();
  for (const [index, id] of ids.entries()) {
    if (!id.trim() || seen.has(id)) {
      issues.push({
        path: `${path}[${index}]`,
        message: "ID vazio ou duplicado.",
      });
    }
    seen.add(id);
  }
}

/** Resolves content definitions separately from a country's initial law state. */
export function resolveLawSetup(
  definitions: readonly LawDefinition[],
  setup: CountryLawSetup,
): Resolution {
  const issues: LawSetupIssue[] = [];
  if (!setup.countryId.trim())
    issues.push({ path: "countryId", message: "País sem identidade." });
  uniqueIds(
    definitions.map((law) => law.id),
    "laws",
    issues,
  );
  uniqueIds(setup.activeLawIds, "activeLawIds", issues);

  const catalog = new Map(definitions.map((law) => [law.id, law]));
  const active = new Set(setup.activeLawIds);

  for (const [index, id] of setup.activeLawIds.entries()) {
    if (!catalog.has(id))
      issues.push({
        path: `activeLawIds[${index}]`,
        message: `Lei vigente desconhecida: ${id}.`,
      });
  }

  for (const law of definitions) {
    if (law.scope !== "ordinary" && law.scope !== "constitutional")
      issues.push({
        path: `laws.${law.id}.scope`,
        message: "Âmbito inválido.",
      });
    const requirements = law.requiresActive ?? [];
    const exclusions = law.excludes ?? [];
    uniqueIds(requirements, `laws.${law.id}.requiresActive`, issues);
    uniqueIds(exclusions, `laws.${law.id}.excludes`, issues);
    for (const [index, id] of requirements.entries()) {
      if (!catalog.has(id))
        issues.push({
          path: `laws.${law.id}.requiresActive[${index}]`,
          message: `Lei exigida inexistente: ${id}.`,
        });
      if (active.has(law.id) && !active.has(id))
        issues.push({
          path: `laws.${law.id}.requiresActive[${index}]`,
          message: `Lei vigente sem requisito ativo: ${id}.`,
        });
    }
    for (const [index, id] of exclusions.entries()) {
      if (!catalog.has(id))
        issues.push({
          path: `laws.${law.id}.excludes[${index}]`,
          message: `Lei excluída inexistente: ${id}.`,
        });
      if (id === law.id || (active.has(law.id) && active.has(id)))
        issues.push({
          path: `laws.${law.id}.excludes[${index}]`,
          message: `Leis incompatíveis vigentes ou autoexclusão: ${law.id}, ${id}.`,
        });
    }
  }

  if (issues.length) return { ok: false, issues };
  return {
    ok: true,
    value: {
      countryId: setup.countryId,
      catalog,
      active,
    },
  };
}
