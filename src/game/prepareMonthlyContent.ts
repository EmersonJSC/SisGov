import {
  buildGraph,
  type ResolvedPackage,
  type ScenarioGraph,
  type ValidationResult,
} from "../engine";

/** Prepare definitions before creating a monthly execution; never migrate a running save. */
export function prepareMonthlyContent(
  content: ResolvedPackage,
): ValidationResult<{ content: ResolvedPackage; graph: ScenarioGraph }> {
  const unit = content.manifest.unidadeTemporal;
  if (unit !== "mes" && unit !== "trimestre") {
    return {
      ok: false,
      diagnostics: [
        {
          code: "VALOR_INVALIDO",
          file: content.manifest.id,
          field: "unidadeTemporal",
          message:
            "Declare mes ou trimestre antes de preparar a execução mensal.",
        },
      ],
    };
  }
  if (unit === "mes")
    return { ok: true, value: { content, graph: buildGraph(content) } };
  const policies = content.policies.map((policy) => ({
    ...policy,
    ...(policy.respostaTemporal
      ? {
          respostaTemporal: {
            implantacao:
              1 - Math.pow(1 - policy.respostaTemporal.implantacao, 1 / 3),
            degradacao:
              1 - Math.pow(1 - policy.respostaTemporal.degradacao, 1 / 3),
          },
        }
      : {}),
  }));
  const consequences = content.consequences.map((effect) => {
    const rate = effect.unidade.endsWith("_por_passo");
    const origin = content.variables.variaveis.find(
      (variable) => variable.id === effect.origem,
    );
    const originDivisor = origin?.unidade.endsWith("_por_passo") ? 3 : 1;
    // One-shot stock contributions represent one total, not three recurring payments.
    const divisor = rate && effect.duracao.modo !== "unico" ? 3 : 1;
    return {
      ...effect,
      atrasoPassos: effect.atrasoPassos * 3,
      duracao:
        effect.duracao.modo === "fixo"
          ? { modo: "fixo" as const, passos: effect.duracao.passos * 3 }
          : effect.duracao,
      parametros: {
        coeficiente: (effect.parametros.coeficiente * originDivisor) / divisor,
        termoConstante: effect.parametros.termoConstante / divisor,
      },
    };
  });
  const manifest = { ...content.manifest, unidadeTemporal: "mes" as const };
  const variables = {
    ...content.variables,
    variaveis: content.variables.variaveis.map((variable) => {
      if (!variable.unidade.endsWith("_por_passo")) return variable;
      return {
        ...variable,
        valorInicial: variable.valorInicial / 3,
        dominio: {
          ...(variable.dominio.minimo !== undefined
            ? { minimo: variable.dominio.minimo / 3 }
            : {}),
          ...(variable.dominio.maximo !== undefined
            ? { maximo: variable.dominio.maximo / 3 }
            : {}),
        },
      };
    }),
  };
  const initialState = {
    ...content.initialState,
    valores: { ...content.initialState.valores },
  };
  for (const variable of content.variables.variaveis) {
    if (variable.unidade.endsWith("_por_passo"))
      initialState.valores[variable.id] /= 3;
  }
  const occurrences = (items: ResolvedPackage["events"]) =>
    items.map((item) => {
      const convert = (condition: typeof item.entraQuando) =>
        condition && {
          ...condition,
          valor:
            condition.valor /
            (content.variables.variaveis
              .find((variable) => variable.id === condition.variavel)
              ?.unidade.endsWith("_por_passo")
              ? 3
              : 1),
        };
      return {
        ...item,
        ...(item.entraQuando ? { entraQuando: convert(item.entraQuando) } : {}),
        ...(item.saiQuando ? { saiQuando: convert(item.saiQuando) } : {}),
      };
    });
  const events = occurrences(content.events);
  const situations = occurrences(content.situations);
  const dilemmas = occurrences(content.dilemmas);
  const filesById = { ...content.filesById };
  for (const file of [
    manifest,
    variables,
    initialState,
    ...policies,
    ...consequences,
    ...events,
    ...situations,
    ...dilemmas,
  ])
    filesById[file.id] = file;
  const monthly = {
    ...content,
    manifest,
    variables,
    initialState,
    policies,
    consequences,
    events,
    situations,
    dilemmas,
    filesById,
  };
  return { ok: true, value: { content: monthly, graph: buildGraph(monthly) } };
}
