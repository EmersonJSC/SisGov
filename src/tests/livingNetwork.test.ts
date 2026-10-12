import { describe, expect, it } from "vitest";
import {
  advanceExecution,
  buildGraph,
  createExecution,
  resolvePackage,
  translateAuthorizedPolicies,
  validateContentFile,
  validatePackageCoherence,
  type EngineExecution,
  type ResolvedPackage,
  type ScenarioGraph,
} from "../engine";
import { loadDistributedScenario } from "../game/pais/loadScenarioPackage";

const json = (value: object) => JSON.stringify(value);

function consequence(
  id: string,
  origem: string,
  alvo: string,
  unidade: string,
  mecanismo: string,
  parametros: object,
) {
  return {
    [`c/${id}.json`]: json({
      id,
      tipo: "consequencia",
      versaoEsquema: 1,
      origem,
      alvo,
      mecanismo,
      parametros,
      unidade,
      atrasoPassos: 0,
      duracao: { modo: "continuo" },
    }),
  };
}

const index = (id: string, nome: string) => ({
  id,
  tipo: "calculado",
  nome,
  unidade: "indice_0_100",
  dominio: { minimo: 0, maximo: 100 },
});

/** O exemplo de docs/arquitetura/rede-viva.md, com números ilustrativos. */
function healthNetwork(): Record<string, string> {
  const consequences = {
    ...consequence(
      "verba-cobertura",
      "verba",
      "cobertura",
      "indice_0_100",
      "afim",
      { coeficiente: 2, termoConstante: 0 },
    ),
    ...consequence(
      "sigilo-corrupcao",
      "sigilo",
      "corrupcao",
      "indice_0_100",
      "afim",
      { coeficiente: 0.2, termoConstante: 0 },
    ),
    ...consequence(
      "drogas-uso",
      "drogas",
      "uso_drogas",
      "indice_0_100",
      "afim",
      { coeficiente: 0.6, termoConstante: 0 },
    ),
    ...consequence(
      "corrupcao-eficacia",
      "corrupcao",
      "eficacia:verba-saude",
      "fator",
      "afim",
      { coeficiente: -0.01, termoConstante: 0 },
    ),
    ...consequence(
      "falta-cobertura-pressao",
      "cobertura",
      "pressao",
      "indice_0_100",
      "limiar",
      { limiar: 100, coeficiente: 0.9, direcao: "abaixo" },
    ),
    ...consequence(
      "uso-pressao",
      "uso_drogas",
      "pressao",
      "indice_0_100",
      "afim",
      { coeficiente: 1, termoConstante: 0 },
    ),
    ...consequence(
      "pressao-crise",
      "pressao",
      "crise",
      "indice_0_100",
      "afim",
      { coeficiente: 1, termoConstante: 0 },
    ),
    ...consequence(
      "cobertura-saude",
      "cobertura",
      "saude",
      "indice_0_100",
      "afim",
      { coeficiente: 1, termoConstante: 0 },
    ),
    ...consequence("crise-saude", "crise", "saude", "indice_0_100", "afim", {
      coeficiente: -2,
      termoConstante: 0,
    }),
    ...consequence(
      "crise-apoio",
      "crise",
      "apoio:verba-saude",
      "pontos",
      "afim",
      { coeficiente: 2, termoConstante: 0 },
    ),
    ...consequence(
      "crise-eficacia",
      "crise",
      "eficacia:verba-saude",
      "fator",
      "afim",
      { coeficiente: -0.02, termoConstante: 0 },
    ),
  };
  const law = (
    id: string,
    grupo: string,
    variavel: string,
    extra: object,
    consequencias: string[],
  ) => ({
    [`leis/${id}.json`]: json({
      id,
      tipo: "lei",
      versaoEsquema: 2,
      grupo,
      nome: id,
      descricao: "Teste",
      processoAutorizacao: "x",
      controle: {
        variavel,
        unidade: grupo === "orcamentaria" ? "moeda" : "nivel_escopo",
        ...extra,
      },
      ...(grupo === "orcamentaria"
        ? { orcamento: { modo: "valor_fixo" } }
        : {}),
      consequencias,
    }),
  });
  const options = (values: number[]) => ({
    opcoes: values.map((valor, position) => ({
      id: `o${position}`,
      rotulo: `O${position}`,
      valor,
    })),
  });
  return {
    "cenario.json": json({
      id: "saude",
      tipo: "cenario",
      versaoEsquema: 1,
      nome: "Rede viva",
      estadoInicial: "estado.json",
      variaveis: "variaveis.json",
      politicas: [
        "leis/verba-saude.json",
        "leis/drogas.json",
        "leis/sigilo.json",
      ],
      consequencias: Object.keys(consequences),
    }),
    "estado.json": json({
      id: "estado",
      tipo: "estado-inicial",
      versaoEsquema: 1,
      leisVigentes: [
        { lei: "verba-saude", nivel: 35 },
        { lei: "drogas", opcao: "o1" },
        { lei: "sigilo", opcao: "o2" },
      ],
      valores: { verba: 35, drogas: 25, sigilo: 100 },
    }),
    "variaveis.json": json({
      id: "variaveis",
      tipo: "variaveis",
      versaoEsquema: 1,
      variaveis: [
        {
          id: "verba",
          tipo: "controle",
          nome: "Verba",
          unidade: "moeda",
          dominio: { minimo: 0 },
        },
        {
          id: "drogas",
          tipo: "controle",
          nome: "Drogas",
          unidade: "nivel_escopo",
          dominio: { minimo: 0, maximo: 100 },
        },
        {
          id: "sigilo",
          tipo: "controle",
          nome: "Sigilo",
          unidade: "nivel_escopo",
          dominio: { minimo: 0, maximo: 100 },
        },
        index("cobertura", "Cobertura"),
        index("corrupcao", "Corrupção"),
        index("uso_drogas", "Uso de drogas"),
        index("pressao", "Pressão hospitalar"),
        index("saude", "Saúde da população"),
        {
          id: "crise",
          tipo: "situacao",
          nome: "Crise no atendimento",
          unidade: "indice_0_100",
          dominio: { minimo: 0, maximo: 100 },
          surgimento: 70,
        },
      ],
    }),
    ...law("verba-saude", "orcamentaria", "verba", {}, ["verba-cobertura"]),
    ...law("drogas", "regulatoria", "drogas", options([0, 25, 60, 100]), [
      "drogas-uso",
    ]),
    ...law("sigilo", "regulatoria", "sigilo", options([0, 50, 100]), [
      "sigilo-corrupcao",
    ]),
    ...consequences,
  };
}

function load(files: Record<string, string>) {
  const resolved = resolvePackage("cenario.json", files);
  if (!resolved.ok) throw new Error(JSON.stringify(resolved.diagnostics));
  const coherent = validatePackageCoherence(resolved.value);
  if (!coherent.ok) throw new Error(JSON.stringify(coherent.diagnostics));
  return { content: coherent.value, graph: buildGraph(coherent.value) };
}

function month(
  content: ResolvedPackage,
  graph: ScenarioGraph,
  execution: EngineExecution,
  levels: Record<string, number>,
) {
  const batch = translateAuthorizedPolicies(
    content,
    graph,
    Object.entries(levels).map(([policyId, intensity]) => ({
      policyId,
      intensity,
    })),
  );
  if (!batch.ok) throw new Error(JSON.stringify(batch.diagnostics));
  const step = advanceExecution(content, graph, execution, batch.value);
  if (!step.ok) throw new Error(JSON.stringify(step.diagnostics));
  return step.value;
}

describe("SG154 — a rede viva (exemplo de rede-viva.md)", () => {
  it("roda o exemplo da saúde", () => {
    const { content, graph } = load(healthNetwork());
    const start = createExecution(content, graph);
    // Turno 0: nenhum índice declarado; tudo calculado a partir das leis.
    expect(start.values.corrupcao).toBe(20);
    expect(start.values.uso_drogas).toBe(15);
    expect(start.values.crise).toBe(0);
    // O turno 0 é o país já funcionando: a eficácia já reflete a corrupção.
    expect(start.values["eficacia:verba-saude"]).toBeCloseTo(0.8);

    // Mês 1: a corrupção do mês anterior come 20% da verba.
    let state = month(content, graph, start, {
      "verba-saude": 35,
      drogas: 25,
      sigilo: 100,
    });
    expect(state.execution.values["eficacia:verba-saude"]).toBeCloseTo(0.8);
    expect(state.intensities["verba-saude"]).toBeCloseTo(28);
    expect(state.execution.values.cobertura).toBeCloseTo(56);
    expect(state.execution.values.crise).toBe(0);

    // Mês 2: cannabis recreativa → mais uso → pressão passa de 70 → a crise nasce.
    state = month(content, graph, state.execution, {
      "verba-saude": 35,
      drogas: 60,
      sigilo: 100,
    });
    const crisis = state.execution.values.crise;
    expect(crisis).toBeGreaterThan(0);
    expect(state.execution.values.pressao).toBeGreaterThan(70);
    expect(state.intensities.crise).toBe(crisis);

    // Mês 3: a crise volta para a lei — pede mais verba e faz a verba render menos.
    state = month(content, graph, state.execution, {
      "verba-saude": 35,
      drogas: 60,
      sigilo: 100,
    });
    expect(state.execution.values["apoio:verba-saude"]).toBeCloseTo(2 * crisis);
    expect(state.execution.values["eficacia:verba-saude"]).toBeCloseTo(
      0.8 - 0.02 * crisis,
    );
    const health = state.explanations.find(
      (item) => item.targetId === "saude",
    )!;
    expect(health.contributions.map((item) => item.originId).sort()).toEqual([
      "cobertura",
      "crise",
    ]);

    // Aumentar a verba baixa a pressão e a crise desaparece sozinha.
    for (let index = 0; index < 4; index += 1)
      state = month(content, graph, state.execution, {
        "verba-saude": 60,
        drogas: 60,
        sigilo: 100,
      });
    expect(state.execution.values.crise).toBe(0);
    expect(state.execution.values.pressao).toBeLessThan(70);
  });

  it("é determinístico: mesma entrada, mesmo resultado", () => {
    const run = () => {
      const { content, graph } = load(healthNetwork());
      let state = { execution: createExecution(content, graph) };
      for (let index = 0; index < 6; index += 1)
        state = month(content, graph, state.execution, {
          "verba-saude": 35 + index,
          drogas: 60,
          sigilo: 50,
        });
      return state.execution.values;
    };
    expect(run()).toEqual(run());
  });
});

describe("SG154 — o país não declara bolhas (D-41)", () => {
  it("recusa valor de índice no estado inicial", () => {
    const files = healthNetwork();
    files["estado.json"] = files["estado.json"].replace(
      '"sigilo":100}',
      '"sigilo":100,"saude":60}',
    );
    const resolved = resolvePackage("cenario.json", files);
    if (!resolved.ok) throw new Error("deveria resolver");
    expect(validatePackageCoherence(resolved.value)).toMatchObject({
      ok: false,
      diagnostics: [expect.objectContaining({ field: "valores.saude" })],
    });
  });

  it("recusa valor inicial ou base em índice e situação", () => {
    const files = healthNetwork();
    const variables = JSON.parse(files["variaveis.json"]);
    variables.variaveis.find(
      (item: { id: string }) => item.id === "saude",
    ).valorInicial = 60;
    expect(
      validateContentFile("variaveis.json", json(variables)),
    ).toMatchObject({
      ok: false,
      diagnostics: [
        expect.objectContaining({ field: "variaveis[7].valorInicial" }),
      ],
    });
    delete variables.variaveis[7].valorInicial;
    delete variables.variaveis[8].surgimento;
    expect(
      validateContentFile("variaveis.json", json(variables)),
    ).toMatchObject({
      ok: false,
      diagnostics: [
        expect.objectContaining({ field: "variaveis[8].surgimento" }),
      ],
    });
  });

  it("recusa lei que lista ligação entre bolhas (é da rede)", () => {
    const files = healthNetwork();
    files["leis/verba-saude.json"] = files["leis/verba-saude.json"].replace(
      '"consequencias":["verba-cobertura"]',
      '"consequencias":["verba-cobertura","cobertura-saude"]',
    );
    const resolved = resolvePackage("cenario.json", files);
    if (!resolved.ok) throw new Error("deveria resolver");
    expect(validatePackageCoherence(resolved.value)).toMatchObject({
      ok: false,
      diagnostics: [
        expect.objectContaining({
          file: "verba-saude",
          field: "consequencias",
        }),
      ],
    });
  });
});

describe("SG154 — ciclo só entre bolhas (D-42)", () => {
  it("um elo do ciclo lê o mês anterior e a explicação diz qual", () => {
    const loaded = loadDistributedScenario("testes/extremos/cenario.json");
    if (!loaded.ok) throw new Error(JSON.stringify(loaded.diagnostics));
    const { definition: content, graph } = loaded.value;
    const execution = createExecution(content, graph);
    const step = advanceExecution(content, graph, execution, {
      controlCommands: [],
      activeRelationIds: [],
    });
    if (!step.ok) throw new Error(JSON.stringify(step.diagnostics));
    const delayed = step.value.explanations
      .flatMap((item) => item.contributions)
      .filter((item) => item.readsPreviousMonth);
    expect(delayed.length).toBeGreaterThan(0);
  });
});
