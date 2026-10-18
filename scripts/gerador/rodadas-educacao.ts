import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { format } from "prettier";
import { advanceExecution } from "../../src/engine/runtime/advanceExecution";
import { createExecution } from "../../src/engine/runtime/createExecution";
import { buildGraph } from "../../src/engine/graph/buildGraph";
import {
  resolvePackage,
  type ResolvedPackage,
} from "../../src/engine/model/resolvePackage";
import { validatePackageCoherence } from "../../src/engine/model/validatePackageCoherence";
import type { PolicyFile } from "../../src/engine/model/contentTypes";
import {
  CAMINHO_CENARIO_EDUCACAO,
  CICLOS_EDUCACAO,
  auditoriaExcludentesEducacao,
  coberturaPoliticaEducacao,
  montarPacoteEducacao,
  SEMENTE_EDUCACAO,
} from "./educacaoC1";
import { programasEducacao, programasParaLeis } from "./programasEducacao";
import { evolucoesProgramas } from "./evolucoesProgramas";

const turnos = 16;
const metricas = [
  "acesso_escolar",
  "vagas_escolares",
  "docentes_disponiveis",
  "permanencia_escolar",
  "frequencia_escolar",
  "abandono_escolar",
  "aprendizagem_escolar",
  "informacao_educacional",
  "custo_educacao_hipotese",
  "caixa_publico",
  "popularidade_governo",
  "grupo_jovens",
  "grupo_familias_com_filhos",
  "grupo_pobres",
  "grupo_interior",
  "grupo_periferias",
  "grupo_servidores",
] as const;

type CenarioSimulado = {
  id: string;
  comandos: Readonly<Record<string, number>>;
  retornarAoAtualNoTurno?: number;
  comandosDaSituacaoAtual?: Readonly<Record<string, number>>;
  decisoes?: readonly { lei: string; opcao: string; valor: number }[];
};

function pacoteValidado(rodada: number): ResolvedPackage {
  const objects = montarPacoteEducacao(rodada);
  const texts = Object.fromEntries(
    Object.entries(objects).map(([path, value]) => [
      path,
      `${JSON.stringify(value, null, 2)}\n`,
    ]),
  );
  const resolved = resolvePackage(CAMINHO_CENARIO_EDUCACAO, texts);
  if (!resolved.ok)
    throw new Error(
      `Rodada ${rodada}: pacote não resolveu:\n${JSON.stringify(resolved.diagnostics, null, 2)}`,
    );
  const coherent = validatePackageCoherence(resolved.value);
  if (!coherent.ok)
    throw new Error(
      `Rodada ${rodada}: incoerência: ${JSON.stringify(coherent.diagnostics, null, 2)}`,
    );
  return coherent.value;
}

function runScenario(
  content: ResolvedPackage,
  scenario: CenarioSimulado,
): Record<string, unknown>[] {
  const graph = buildGraph(content);
  let execution = createExecution(content, graph);
  const activeRelationIds = graph.relations.map((relation) => relation.id);
  const lawControls = new Map(
    content.policies.map((law) => [law.controle.variavel, law.id]),
  );
  const rows: Record<string, unknown>[] = [];
  for (let turn = 0; turn <= turnos; turn += 1) {
    if (turn > 0) {
      const controls = { ...scenario.comandos };
      if (
        scenario.retornarAoAtualNoTurno !== undefined &&
        turn >= scenario.retornarAoAtualNoTurno
      )
        Object.assign(controls, scenario.comandosDaSituacaoAtual);
      const controlCommands = Object.entries(controls).map(
        ([controlId, value]) => {
          if (!lawControls.has(controlId))
            throw new Error(`Controle sem lei no pacote: ${controlId}`);
          return { controlId, policyId: lawControls.get(controlId)!, value };
        },
      );
      const advanced = advanceExecution(
        content,
        graph,
        execution,
        { controlCommands, activeRelationIds },
        1,
        { explain: true },
      );
      if (!advanced.ok)
        throw new Error(
          `${scenario.id}, turno ${turn}: ${JSON.stringify(advanced.diagnostics)}`,
        );
      execution = advanced.value.execution;
    }
    const values = execution.values;
    rows.push({
      turno: turn,
      ...Object.fromEntries(metricas.map((id) => [id, values[id] ?? null])),
    });
  }
  return rows;
}

function controlsFor(
  policies: readonly PolicyFile[],
  value: number,
): Record<string, number> {
  return Object.fromEntries(
    policies.map((policy) => [policy.controle.variavel, value]),
  );
}

function controlsDaSituacaoAtual(
  policies: readonly PolicyFile[],
): Record<string, number> {
  return Object.fromEntries(
    policies.map((policy) => {
      const initial = policy.controle.opcoes?.[0];
      if (!initial)
        throw new Error(
          `Lei sem situação inicial entre as opções: ${policy.id}`,
        );
      return [policy.controle.variavel, initial.valor];
    }),
  );
}

function diagnosticsFor(
  content: ResolvedPackage,
  addedPolicies: readonly PolicyFile[],
  results: Readonly<Record<string, readonly Record<string, unknown>[]>>,
) {
  const graph = buildGraph(content);
  const adjacency = new Map<string, string[]>();
  for (const relation of graph.relations) {
    const list = adjacency.get(relation.originId) ?? [];
    list.push(relation.targetId);
    adjacency.set(relation.originId, list);
  }
  const groupIds = new Set(
    content.variables.variaveis
      .filter((item) => item.tipo === "grupo")
      .map((item) => item.id),
  );
  const paths = addedPolicies.map((policy) => {
    const seen = new Set<string>();
    const queue = [policy.controle.variavel];
    let reachesGroup = false;
    while (queue.length) {
      const current = queue.shift()!;
      if (seen.has(current)) continue;
      seen.add(current);
      if (groupIds.has(current)) reachesGroup = true;
      for (const next of adjacency.get(current) ?? []) queue.push(next);
    }
    return { lei: policy.id, alcancaGrupo: reachesGroup };
  });
  const trajectory = results["combinacao-3"];
  const start = trajectory[0];
  const end = trajectory.at(-1)!;
  const changed = metricas.some(
    (id) =>
      typeof start[id] === "number" &&
      typeof end[id] === "number" &&
      Math.abs((end[id] as number) - (start[id] as number)) > 1e-8,
  );
  const isolatedAndCombined = [
    ...addedPolicies.flatMap((law) =>
      (law.controle.opcoes ?? [])
        .filter((option) => option.valor > 0)
        .map((option) => results[`lei-${law.id}-${option.id}`]?.at(-1)),
    ),
    results["combinacao-1"]?.at(-1),
    results["combinacao-2"]?.at(-1),
    results["combinacao-3"]?.at(-1),
  ];
  const metricasComVariacao = metricas.filter((id) => {
    const values = isolatedAndCombined
      .map((row) => Number(row?.[id]))
      .filter(Number.isFinite);
    return (
      values.length > 1 && Math.max(...values) - Math.min(...values) > 1e-8
    );
  });
  return {
    caminhosDasLeisAosGrupos: paths,
    leiSemCaminhoAteGrupo: paths
      .filter((item) => !item.alcancaGrupo)
      .map((item) => item.lei),
    combinacaoAlteraResultadoObservavel: changed,
    metricasComVariacao,
    caixaFinalNaoNegativo: Number(end.caixa_publico) >= -1e-8,
    variaveisFinitas: Object.values(results).every((rows) =>
      rows.every((row) =>
        metricas.every((id) => row[id] === null || Number.isFinite(row[id])),
      ),
    ),
  };
}

async function writeJson(path: string, value: unknown) {
  mkdirSync(dirname(path), { recursive: true });
  const text = `${JSON.stringify(value, null, 2)}\n`;
  writeFileSync(path, await format(text, { parser: "json" }), "utf8");
}

function removerSaidasGerenciadas(paths: readonly string[]) {
  const roots = [outputRoot, generatedRoot].map((root) => resolve(root));
  for (const relative of paths) {
    const absolute = resolve(process.cwd(), relative);
    if (!roots.some((root) => absolute.startsWith(`${root}${sep}`)))
      throw new Error(
        `Manifesto aponta para fora das saídas do gerador: ${relative}`,
      );
    if (existsSync(absolute)) unlinkSync(absolute);
  }
}

const outputRoot = join(
  process.cwd(),
  "docs/v1/desenho/rodadas-gerador-educacao",
);
const generatedRoot = join(process.cwd(), "src/conteudo");
const manifestPath = join(outputRoot, "manifesto-gerador.json");
const previousManifest = existsSync(manifestPath)
  ? (JSON.parse(readFileSync(manifestPath, "utf8")) as {
      arquivosGerados?: string[];
      contadorGeracao?: number;
    })
  : undefined;
const contadorGeracao = (previousManifest?.contadorGeracao ?? 0) + 1;
const knownOutputs = Object.keys(montarPacoteEducacao(5)).map(
  (path) => `src/conteudo/${path}`,
);
const legacyOutputs = CICLOS_EDUCACAO.flatMap((round) =>
  round.leis.flatMap((law) =>
    ["resultado", "custo-comparativo"].map(
      (suffix) =>
        `src/conteudo/mundo/consequencias/educacao-${law}-${suffix}.json`,
    ),
  ),
);
const reportOutputs = [...CICLOS_EDUCACAO, ...evolucoesProgramas].flatMap(
  (round) => [
    `docs/v1/desenho/rodadas-gerador-educacao/rodada-${round.numero}/relatorio.json`,
    `docs/v1/desenho/rodadas-gerador-educacao/rodada-${round.numero}/pacote-candidato.json`,
  ],
);
removerSaidasGerenciadas([
  ...(previousManifest?.arquivosGerados ?? []).filter(
    (path) =>
      path !==
      "docs/v1/desenho/rodadas-gerador-educacao/manifesto-gerador.json",
  ),
  ...knownOutputs,
  ...legacyOutputs,
  ...reportOutputs,
]);
let previousBaseline: readonly Record<string, unknown>[] | undefined;
let finalFiles: Record<string, object> | undefined;
const aprendizados: Array<Record<string, unknown>> = [];

for (const round of CICLOS_EDUCACAO) {
  const content = pacoteValidado(round.numero);
  const lawIds = new Set(round.leis);
  const addedPolicies = content.policies.filter((law) => lawIds.has(law.id));
  const scenarios: CenarioSimulado[] = [
    { id: "situacao-atual", comandos: controlsDaSituacaoAtual(addedPolicies) },
    ...addedPolicies.flatMap((policy) =>
      (policy.controle.opcoes ?? [])
        .filter((option) => option.valor > 0)
        .map((option) => ({
          id: `lei-${policy.id}-${option.id}`,
          comandos: { [policy.controle.variavel]: option.valor },
          decisoes: [{ lei: policy.id, opcao: option.id, valor: option.valor }],
        })),
    ),
    ...[1, 2, 3].map((value) => ({
      id: `combinacao-${value}`,
      comandos: controlsFor(addedPolicies, value),
      decisoes: addedPolicies.map((policy) => ({
        lei: policy.id,
        opcao:
          policy.controle.opcoes?.find((option) => option.valor === value)
            ?.id ?? "",
        valor: value,
      })),
    })),
    {
      id: "recuperacao",
      comandos: controlsFor(addedPolicies, 3),
      retornarAoAtualNoTurno: 9,
      comandosDaSituacaoAtual: controlsDaSituacaoAtual(addedPolicies),
      decisoes: addedPolicies.map((policy) => ({
        lei: policy.id,
        opcao:
          policy.controle.opcoes?.find((option) => option.valor === 3)?.id ??
          "",
        valor: 3,
      })),
    },
  ];
  const results = Object.fromEntries(
    scenarios.map((scenario) => [scenario.id, runScenario(content, scenario)]),
  );
  const baseline = results["situacao-atual"];
  const comparison = previousBaseline
    ? {
        mesmosCenarios: true,
        estadosIniciaisIguais:
          JSON.stringify(previousBaseline[0]) === JSON.stringify(baseline[0]),
        desvioMaximoNoTurnoFinal: Math.max(
          ...metricas.map((id) =>
            Math.abs(
              Number(previousBaseline.at(-1)?.[id] ?? 0) -
                Number(baseline.at(-1)?.[id] ?? 0),
            ),
          ),
        ),
      }
    : null;
  const diagnosis = diagnosticsFor(content, addedPolicies, results);
  const leisAcumuladas = content.policies.map((policy) => policy.id);
  const programasSemente = programasParaLeis(leisAcumuladas);
  const gruposAtivadosPorProgramas = [
    ...new Set(programasSemente.flatMap((programa) => programa.gruposAfetados)),
  ].sort();
  const optionsTest = addedPolicies.map((policy) => {
    const choices = (policy.controle.opcoes ?? []).filter(
      (option) => option.valor > 0,
    );
    const signatures = choices.map((option) => {
      const row = results[`lei-${policy.id}-${option.id}`]?.at(-1);
      return metricas
        .map((metric) => Number(row?.[metric] ?? 0).toFixed(6))
        .join("|");
    });
    return {
      lei: policy.id,
      opcoes: choices.map((option, index) => ({
        id: option.id,
        rotulo: option.rotulo,
        valor: option.valor,
        resultadoFinal: results[`lei-${policy.id}-${option.id}`]?.at(-1),
        assinatura: signatures[index],
      })),
      opcoesComResultadosDistintos: new Set(signatures).size,
    };
  });
  const alternativasDistintas = optionsTest.every(
    (item) => item.opcoesComResultadosDistintos === 3,
  );
  const aprendizadoDaRodada = {
    testesDeValidacao: [
      "resolvePackage",
      "validatePackageCoherence",
      "fontes e referências incluídas no pacote",
    ],
    testesDeSimulacao: [
      "linha de base",
      "cada opção isolada",
      "três combinações",
      "recuperação após retirar as ações",
    ],
    observacao: alternativasDistintas
      ? "As três estratégias de cada lei produzem trajetórias diferentes no conjunto de métricas acompanhado."
      : "Há estratégias indistinguíveis na simulação; a evolução deve revisar mecanismos e efeitos antes de aprovar esta rodada.",
    alternativasDistintas,
    opcoesTestadas: optionsTest,
  };
  aprendizados.push({ rodada: round.numero, aprendizadoDaRodada });
  const packageObjects = montarPacoteEducacao(round.numero);
  const report = {
    contadorGeracao,
    rodada: round.numero,
    titulo: round.titulo,
    semente: SEMENTE_EDUCACAO,
    duracaoTurnos: turnos,
    configuracao: {
      ciclo: "C1 — acesso e permanência na educação",
      metodoDeGeracao:
        "Procedural orientado por programas-semente pesquisados: problema → programa/fonte → leis → grupos afetados → mecanismos e cenários. A variação futura pode reorganizar sementes e combinações, mas não inventa leis, grupos ou relações sem fonte.",
      programasSemente,
      gruposSociaisCobertosPelosProgramas: gruposAtivadosPorProgramas,
      coberturaDosQuatroQuadrantes: coberturaPoliticaEducacao(round.numero),
      paresExcludentesPesquisados: auditoriaExcludentesEducacao(round.numero),
      gruposDePessoas: content.variables.variaveis
        .filter((variable) => variable.tipo === "grupo")
        .map((variable) => variable.id),
      notas:
        "Escalas, coeficientes, perfis e condição inicial são hipóteses experimentais. Fontes legais ficam nas fichas de lei.",
    },
    leisAdicionadas: addedPolicies.map((law) => ({
      id: law.id,
      nome: law.nome,
      fonte: law.fonte,
      camada: law.mesa?.camada ?? "lei",
      programasSemente: programasSemente
        .filter((programa) => programa.leis.includes(law.id))
        .map((programa) => programa.id),
    })),
    pacoteCandidato: Object.keys(packageObjects).sort(),
    cenarios: scenarios.map((scenario) => ({
      id: scenario.id,
      decisoes: scenario.decisoes ?? [],
      acoes: scenario.comandos,
      retornarAoAtualNoTurno: scenario.retornarAoAtualNoTurno ?? null,
      acoesDeRetorno: scenario.comandosDaSituacaoAtual ?? null,
      trajetoria: results[scenario.id],
    })),
    diagnostico: diagnosis,
    comparacaoComRodadaAnterior: comparison,
    aprendizadoDaRodada,
    evolucaoAplicada: {
      etapa: `Lote ${round.numero} integrado ao mesmo protótipo C1.`,
      regraDoGerador:
        "O lote nasce de programas-semente com fontes e grupos afetados declarados; o gerador conecta seus problemas a leis, opções, mecanismos, grupos e cenários. Cada opção é testada isoladamente. A evolução seguinte pode acrescentar sementes pesquisadas e conexões justificadas; não se exige repetição literal da mesma composição, mas a semente e as fontes ficam registradas.",
      totalProgramasSemente: programasSemente.length,
      totalGruposSociaisCobertos: gruposAtivadosPorProgramas.length,
      codigoDoJogoAlterado: true,
      conteudoDaIlhaRegenerado: true,
    },
    proximaEvolucao:
      round.numero < CICLOS_EDUCACAO.length
        ? CICLOS_EDUCACAO[round.numero].titulo
        : "Playtest humano da Ilha Teste com o ciclo C1 completo.",
  };
  const roundDirectory = join(outputRoot, `rodada-${round.numero}`);
  await writeJson(join(roundDirectory, "relatorio.json"), report);
  await writeJson(
    join(roundDirectory, "pacote-candidato.json"),
    Object.fromEntries(
      Object.entries(packageObjects).map(([path, file]) => [path, file]),
    ),
  );
  if (
    diagnosis.leiSemCaminhoAteGrupo.length > 0 ||
    !diagnosis.combinacaoAlteraResultadoObservavel ||
    !diagnosis.caixaFinalNaoNegativo ||
    !diagnosis.variaveisFinitas ||
    diagnosis.metricasComVariacao.length === 0 ||
    !alternativasDistintas
  )
    throw new Error(
      `Rodada ${round.numero}: diagnóstico bloqueante:\n${JSON.stringify(diagnosis, null, 2)}`,
    );
  previousBaseline = baseline;
  finalFiles = packageObjects;
  console.log(
    `Rodada ${round.numero}: pacote válido, ${addedPolicies.length} leis adicionadas, ${scenarios.length} trajetórias; relatório em ${join(roundDirectory, "relatorio.json")}`,
  );
}

// Rodadas 6–10 evoluem a composição dos programas já pesquisados. Elas não
// inventam leis: testam pacotes integrados e guardam cada trajetória separada.
const pacoteFinalValidado = pacoteValidado(CICLOS_EDUCACAO.length);
const politicasDoPacote = pacoteFinalValidado.policies;
const baselinePacote = controlsDaSituacaoAtual(politicasDoPacote);
let resultadoPacoteAnterior: readonly Record<string, unknown>[] | undefined;
for (const evolucao of evolucoesProgramas) {
  const programaIdsConhecidos = new Set(
    programasEducacao.map((item) => item.id),
  );
  const programas = evolucao.programas.map((id) => {
    const programa = programasEducacao.find((item) => item.id === id);
    if (!programa)
      throw new Error(
        `Rodada ${evolucao.numero}: programa desconhecido ${id}.`,
      );
    return programa;
  });
  const overrides: Record<string, number> = {};
  const politicasDaEvolucao: PolicyFile[] = [];
  for (const [leiId, opcaoId] of Object.entries(evolucao.opcoes)) {
    const policy = politicasDoPacote.find((item) => item.id === leiId);
    const option = policy?.controle.opcoes?.find((item) => item.id === opcaoId);
    if (!policy || !option)
      throw new Error(
        `Rodada ${evolucao.numero}: opção não resolvida ${leiId}/${opcaoId}.`,
      );
    overrides[policy.controle.variavel] = option.valor;
    politicasDaEvolucao.push(policy);
    if (!programas.some((programa) => programa.leis.includes(leiId)))
      throw new Error(
        `Rodada ${evolucao.numero}: ${leiId} não pertence aos programas informados.`,
      );
  }
  if (evolucao.programas.some((id) => !programaIdsConhecidos.has(id)))
    throw new Error(
      `Rodada ${evolucao.numero}: referência de programa inválida.`,
    );
  const comandosPacote = { ...baselinePacote, ...overrides };
  const scenarios: CenarioSimulado[] = [
    { id: "situacao-atual", comandos: baselinePacote },
    {
      id: "combinacao-3",
      comandos: comandosPacote,
      decisoes: politicasDaEvolucao.map((policy) => ({
        lei: policy.id,
        opcao:
          policy.controle.opcoes?.find(
            (option) => option.valor === overrides[policy.controle.variavel],
          )?.id ?? "",
        valor: overrides[policy.controle.variavel],
      })),
    },
    {
      id: "recuperacao",
      comandos: comandosPacote,
      retornarAoAtualNoTurno: 9,
      comandosDaSituacaoAtual: baselinePacote,
    },
  ];
  const results = Object.fromEntries(
    scenarios.map((scenario) => [
      scenario.id,
      runScenario(pacoteFinalValidado, scenario),
    ]),
  );
  const baseline = results["situacao-atual"];
  const trajectory = results["combinacao-3"];
  const finalBaseline = baseline.at(-1)!;
  const finalPackage = trajectory.at(-1)!;
  const deltas = Object.fromEntries(
    metricas.map((id) => [
      id,
      Number(finalPackage[id] ?? 0) - Number(finalBaseline[id] ?? 0),
    ]),
  );
  const mudouResultado = Object.values(deltas).some(
    (delta) => Math.abs(delta) > 1e-8,
  );
  const valoresFinitos = Object.values(results).every((rows) =>
    rows.every((row) =>
      metricas.every((id) => row[id] === null || Number.isFinite(row[id])),
    ),
  );
  const comparacaoComPacoteAnterior = resultadoPacoteAnterior
    ? {
        comparadoComRodada: evolucao.numero - 1,
        mesmasMetricas: true,
        desvioMaximoNoTurnoFinal: Math.max(
          ...metricas.map((id) =>
            Math.abs(
              Number(resultadoPacoteAnterior?.at(-1)?.[id] ?? 0) -
                Number(finalPackage[id] ?? 0),
            ),
          ),
        ),
      }
    : null;
  const gruposAfetados = [
    ...new Set(programas.flatMap((programa) => programa.gruposAfetados)),
  ].sort();
  const aprendizado = {
    testesDeValidacao: [
      "programas e leis resolvidos por referências do catálogo",
      "todas as estratégias do pacote existem no contrato de conteúdo",
      "grupos afetados declarados pelas fontes do programa",
    ],
    testesDeSimulacao: [
      "situação inicial do pacote completo",
      "pacote integrado de intervenções",
      "retirada das intervenções no turno 9 e recuperação",
    ],
    conclusao:
      mudouResultado &&
      valoresFinitos &&
      Number(finalPackage.caixa_publico) >= 0
        ? "O pacote integrado altera resultados observáveis sem violar os limites numéricos acompanhados; comparar ganhos e custos por grupo antes de promover qualquer estratégia."
        : "O pacote requer revisão: não alterou resultados, produziu valores inválidos ou tornou o caixa negativo.",
    deltasNoTurnoFinal: deltas,
    gruposAfetados,
    variaveisFinitas: valoresFinitos,
    caixaFinalNaoNegativo: Number(finalPackage.caixa_publico) >= 0,
  };
  aprendizados.push({
    rodada: evolucao.numero,
    aprendizadoDaRodada: aprendizado,
  });
  const report = {
    contadorGeracao,
    rodada: evolucao.numero,
    tipo: "evolucao-de-pacote-programatico",
    titulo: evolucao.titulo,
    semente: SEMENTE_EDUCACAO,
    duracaoTurnos: turnos,
    ciclo: "C1 — acesso e permanência na educação",
    origemDaEvolucao:
      "Rodadas 1–5 e memória de aprendizados da geração anterior.",
    programasSemente: programas,
    leisComOpcoesAplicadas: politicasDaEvolucao.map((policy) => ({
      lei: policy.id,
      camada: policy.mesa?.camada ?? "lei",
      opcao: policy.controle.opcoes?.find(
        (option) => option.valor === overrides[policy.controle.variavel],
      ),
    })),
    paresExcludentesPesquisados: auditoriaExcludentesEducacao(5),
    gruposSociaisAfetados: gruposAfetados,
    problema: evolucao.problema,
    cenarios: scenarios.map((scenario) => ({
      id: scenario.id,
      decisoes: scenario.decisoes ?? [],
      acoes: scenario.comandos,
      retornarAoAtualNoTurno: scenario.retornarAoAtualNoTurno ?? null,
      trajetoria: results[scenario.id],
    })),
    diagnostico: aprendizado,
    comparacaoComRodadaAnterior: comparacaoComPacoteAnterior,
    evolucaoAplicada: evolucao.evolucao,
    proximaEvolucao:
      evolucao.numero < 10
        ? evolucoesProgramas.find((item) => item.numero === evolucao.numero + 1)
            ?.problema
        : "Regenerar e revisar o pacote acumulado de dez rodadas antes do playtest.",
    leisNovas: 0,
    codigoDoJogoAlterado: true,
  };
  const roundDirectory = join(outputRoot, `rodada-${evolucao.numero}`);
  await writeJson(join(roundDirectory, "relatorio.json"), report);
  await writeJson(join(roundDirectory, "pacote-candidato.json"), {
    tipo: "pacote-de-programas-ilha-teste",
    rodada: evolucao.numero,
    programas: evolucao.programas,
    opcoes: evolucao.opcoes,
    problema: evolucao.problema,
    justificativaDaEvolucao: evolucao.evolucao,
    leisGeradasNovamentePelaFonte: false,
  });
  if (
    !mudouResultado ||
    !valoresFinitos ||
    Number(finalPackage.caixa_publico) < 0
  )
    throw new Error(
      `Rodada ${evolucao.numero}: pacote evolutivo reprovado:\n${JSON.stringify(aprendizado, null, 2)}`,
    );
  resultadoPacoteAnterior = trajectory;
  console.log(
    `Rodada ${evolucao.numero}: pacote ${evolucao.titulo} validado; ${scenarios.length} trajetórias; ${gruposAfetados.length} grupos afetados.`,
  );
}

if (!finalFiles) throw new Error("Nenhuma rodada gerada.");
for (const [path, value] of Object.entries(finalFiles)) {
  const destination = join(generatedRoot, path);
  mkdirSync(dirname(destination), { recursive: true });
  const temporary = `${destination}.gerando`;
  const text = await format(`${JSON.stringify(value, null, 2)}\n`, {
    parser: "json",
  });
  writeFileSync(temporary, text, "utf8");
  renameSync(temporary, destination);
}
const generatedPaths = [
  ...Object.keys(finalFiles).map((path) => `src/conteudo/${path}`),
  ...reportOutputs,
];
await writeJson(manifestPath, {
  tipo: "memoria-gerador-ilha-teste",
  versao: 1,
  contadorGeracao,
  status: "concluida",
  semente: SEMENTE_EDUCACAO,
  ciclo: "C1 — acesso e permanência na educação",
  criadoPor: "scripts/gerador/rodadas-educacao.ts",
  arquivosGerados: generatedPaths,
  aprendizados,
  catalogoDeSementes: programasEducacao.map((programa) => ({
    id: programa.id,
    nome: programa.nome,
    fonte: programa.fonte,
    leis: programa.leis,
    gruposAfetados: programa.gruposAfetados,
  })),
  regraDeRegeracao:
    "Ao executar, remove apenas os arquivos enumerados neste manifesto e os caminhos de saída conhecidos do gerador; depois recria as cinco rodadas-base, cinco rodadas evolutivas de pacotes programáticos e o conteúdo acumulado da Ilha Teste. As rodadas 6–10 não acrescentam leis sem novas fontes. O conteúdo do Brasil é preservado.",
});
console.log(
  `Geração ${contadorGeracao}: 10 rodadas concluídas; 5 lotes-base e 5 pacotes evolutivos testados. O Brasil não foi alterado.`,
);
