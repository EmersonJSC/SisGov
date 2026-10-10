import {
  buildGraph,
  type ConsequenceFile,
  type ResolvedPackage,
  type ScenarioGraph,
  type ValidationResult,
} from "../engine";

/**
 * Reescreve os parâmetros de uma consequência quando a entrada muda de escala
 * (origem "por passo": x_trimestre = k · x_mês) e a saída é dividida por d
 * (alvo "por passo"). Cada mecanismo tem sua regra para que g(x_mês) =
 * f(k · x_mês) / d, exatamente:
 * - afim: c' = c·k/d, k' = k₀/d
 * - saturação: máximo' = máximo/d, escala' = escala/k
 * - retornos decrescentes: c' = c·k/d, escala' = escala/k
 * - limiar: c' = c·k/d, limiar' = limiar/k
 */
export function scaleConsequenceParameters(
  mechanism: ConsequenceFile["mecanismo"],
  parameters: ConsequenceFile["parametros"],
  k: number,
  d: number,
): ConsequenceFile["parametros"] {
  switch (mechanism) {
    case "afim":
      return {
        coeficiente: (parameters.coeficiente! * k) / d,
        termoConstante: parameters.termoConstante! / d,
      };
    case "saturacao":
      return { maximo: parameters.maximo! / d, escala: parameters.escala! / k };
    case "retornos_decrescentes":
      return {
        coeficiente: (parameters.coeficiente! * k) / d,
        escala: parameters.escala! / k,
      };
    case "limiar":
      return {
        coeficiente: (parameters.coeficiente! * k) / d,
        limiar: parameters.limiar! / k,
        direcao: parameters.direcao,
      };
    case "pontos":
      return {
        pontos: parameters.pontos!.map(([x, y]) => [x / k, y / d] as const),
      };
  }
}

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
  // Nó com taxa por passo vale um terço por mês.
  const scaleOf = (id: string) =>
    content.variables.variaveis
      .find((variable) => variable.id === id)
      ?.unidade.endsWith("_por_passo")
      ? 3
      : 1;
  const consequences = content.consequences.map((effect) => {
    const rate = effect.unidade.endsWith("_por_passo");
    const origin = content.variables.variaveis.find(
      (variable) => variable.id === effect.origem,
    );
    const originDivisor = origin?.unidade.endsWith("_por_passo") ? 3 : 1;
    // One-shot stock contributions represent one total, not three recurring payments.
    const divisor = rate && effect.duracao.modo !== "unico" ? 3 : 1;
    // Com normalização, a mudança de escala da origem e do divisor vai para o
    // multiplicador; o mecanismo recebe a mesma razão de antes.
    const divisorNode = effect.normalizacao?.divisor
      ? content.variables.variaveis.find(
          (variable) => variable.id === effect.normalizacao!.divisor,
        )
      : undefined;
    const divisorScale = divisorNode?.unidade.endsWith("_por_passo") ? 3 : 1;
    const factorNode = effect.normalizacao?.fator
      ? content.variables.variaveis.find(
          (variable) => variable.id === effect.normalizacao!.fator,
        )
      : undefined;
    const factorScale = factorNode?.unidade.endsWith("_por_passo") ? 3 : 1;
    const normalizacao = effect.normalizacao && {
      ...effect.normalizacao,
      multiplicador:
        ((effect.normalizacao.multiplicador ?? 1) *
          originDivisor *
          factorScale) /
        divisorScale,
    };
    const inputScale = effect.normalizacao ? 1 : originDivisor;
    return {
      ...effect,
      atrasoPassos: effect.atrasoPassos * 3,
      duracao:
        effect.duracao.modo === "fixo"
          ? { modo: "fixo" as const, passos: effect.duracao.passos * 3 }
          : effect.duracao,
      parametros: scaleConsequenceParameters(
        effect.mecanismo,
        effect.parametros,
        inputScale,
        divisor,
      ),
      ...(normalizacao ? { normalizacao } : {}),
      ...(effect.escala
        ? {
            escala: {
              ...effect.escala,
              referencia:
                effect.escala.referencia / scaleOf(effect.escala.fator),
            },
          }
        : {}),
    };
  });
  const manifest = { ...content.manifest, unidadeTemporal: "mes" as const };
  const variables = {
    ...content.variables,
    variaveis: content.variables.variaveis.map((variable) => {
      if (!variable.unidade.endsWith("_por_passo")) return variable;
      return {
        ...variable,
        ...(variable.valorInicial !== undefined
          ? { valorInicial: variable.valorInicial / 3 }
          : {}),
        ...(variable.surgimento !== undefined
          ? { surgimento: variable.surgimento / 3 }
          : {}),
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
