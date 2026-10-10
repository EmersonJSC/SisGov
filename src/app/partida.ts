/**
 * Camada da partida: a única porta de entrada da interface.
 *
 * A tela chama só estas funções e lê só a `VisaoPartida`. Ela nunca importa
 * nada de `engine/`, `game/` ou `domain/`. Contrato em
 * `docs/arquitetura/api-da-partida.md`.
 */
import type { ResolvedPackage, ScenarioGraph } from "../engine";
import { changePolicyTarget } from "../domain/game";
import { createGame, type GameState } from "../game/createGame";
import { commitPolicyAction } from "../game/commitPolicyAction";
import { prepareMonthlyContent } from "../game/prepareMonthlyContent";
import { prepareGameQuarter } from "../game/prepareGameQuarter";
import { commitGameQuarter } from "../game/commitGameQuarter";
import { buildFiscalQuarterReport } from "../game/fiscalReport";
import { policyLevelRulesFromContent } from "../game/policyRulesFromContent";
import { advancePolicyImplementation } from "../game/advancePolicyImplementation";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

export type Resultado<T> =
  { ok: true; value: T } | { ok: false; erros: readonly string[] };

/**
 * `teste`: toda mudança de lei vale na hora (o Congresso ainda não vota).
 * `real`: leis que exigem o Congresso viram proposta (votação ainda não ligada).
 */
export type ModoPartida = "teste" | "real";

export type Partida = Readonly<{
  modo: ModoPartida;
  content: ResolvedPackage;
  graph: ScenarioGraph;
  game: GameState;
  acoes: number;
}>;

export type VisaoOpcao = Readonly<{
  id: string;
  rotulo: string;
  valor: number;
}>;

export type VisaoLei = Readonly<{
  id: string;
  nome: string;
  descricao: string;
  grupo: "orcamentaria" | "regulatoria" | "tributaria" | "institucional";
  area: string;
  ministerio: string;
  /** Nível que já está funcionando (anda até a meta mês a mês). */
  nivel: number;
  /** Nível escolhido pelo jogador. */
  meta: number;
  minimo?: number;
  maximo?: number;
  unidade: string;
  opcoes?: readonly VisaoOpcao[];
  /** Opção mais próxima do nível em funcionamento. */
  opcaoAtual?: string;
  /** Gasto anual estimado, na moeda do país (0 se a lei não gasta). */
  gastoAnual: number;
}>;

export type VisaoBolha = Readonly<{
  id: string;
  nome: string;
  tipo: string;
  unidade: string;
  area: string;
  avaliacao?: string;
  valor: number;
}>;

export type VisaoLigacao = Readonly<{
  id: string;
  origem: string;
  alvo: string;
  sinal: 1 | -1;
}>;

export type VisaoPartida = Readonly<{
  pais: string;
  turno: number;
  caixa: number;
  divida: number;
  pib: number;
  leis: readonly VisaoLei[];
  bolhas: readonly VisaoBolha[];
  ligacoes: readonly VisaoLigacao[];
}>;

export type RelatorioTurno = Readonly<{
  turno: number;
  receita: number;
  gastoPrimario: number;
  juros: number;
  resultado: number;
  /** As bolhas que mais mudaram no trimestre, da maior mudança para a menor. */
  mudancas: readonly Readonly<{
    id: string;
    nome: string;
    antes: number;
    depois: number;
  }>[];
}>;

function falha<T>(diagnostics: readonly { message: string }[]): Resultado<T> {
  return { ok: false, erros: diagnostics.map((item) => item.message) };
}

export function criarPartida(
  opcoes: Readonly<{
    pais?: string;
    modo?: ModoPartida;
    semente?: number;
  }> = {},
): Resultado<Partida> {
  const loaded = loadDistributedScenario(
    `paises/${opcoes.pais ?? "brasil"}/pais.json`,
  );
  if (!loaded.ok) return falha(loaded.diagnostics);
  const prepared = prepareMonthlyContent(loaded.value.definition);
  if (!prepared.ok) return falha(prepared.diagnostics);
  const { content, graph } = prepared.value;
  const game = createGame("partida", content, graph, {
    randomSeed: opcoes.semente ?? 1,
  });
  if (!game.ok) return falha(game.diagnostics);
  return {
    ok: true,
    value: {
      modo: opcoes.modo ?? "teste",
      content,
      graph,
      game: game.value,
      acoes: 0,
    },
  };
}

/** Escolhe um novo nível (ou o valor de uma opção) para uma lei. */
export function mudarLei(
  partida: Partida,
  leiId: string,
  nivel: number,
): Resultado<Partida> {
  const { game, content } = partida;
  const definition = policyLevelRulesFromContent(content, leiId);
  if (!definition.ok) return falha(definition.diagnostics);
  if (partida.modo === "real") {
    const committed = commitPolicyAction(game, content, {
      id: `acao-${partida.acoes + 1}`,
      policyId: leiId,
      desiredLevel: nivel,
    });
    if (!committed.ok) return falha(committed.diagnostics);
    return {
      ok: true,
      value: { ...partida, game: committed.value, acoes: partida.acoes + 1 },
    };
  }
  const index = game.policies.findIndex(
    (state) => state.policyDefinitionId === leiId,
  );
  if (index < 0)
    return { ok: false, erros: [`A lei ${leiId} não está vigente.`] };
  const changed = changePolicyTarget(
    game.policies[index],
    nivel,
    game.currentTurn,
    definition.value.rules,
  );
  if (!changed.ok) return { ok: false, erros: [changed.error.message] };
  const policies = [...game.policies];
  policies[index] = changed.value;
  return {
    ok: true,
    value: {
      ...partida,
      game: { ...game, policies },
      acoes: partida.acoes + 1,
    },
  };
}

/** Passa um trimestre: três meses de implantação, rede e contas públicas. */
export function encerrarTurno(
  partida: Partida,
): Resultado<Readonly<{ partida: Partida; relatorio: RelatorioTurno }>> {
  const { content, graph, game } = partida;
  const months = [];
  let states = game.policies;
  for (let month = 0; month < 3; month++) {
    const advanced = advancePolicyImplementation(
      content,
      states,
      game.currentTurn,
    );
    if (!advanced.ok) return falha(advanced.diagnostics);
    states = advanced.value;
    months.push(states);
  }
  const prepared = prepareGameQuarter(content, graph, game, months);
  if (!prepared.ok) return falha(prepared.diagnostics);
  const next = commitGameQuarter(game, prepared.value);
  const totals = buildFiscalQuarterReport(prepared.value.fiscal).totals;
  const before = game.execution.values;
  const after = next.execution.values;
  const mudancas = content.variables.variaveis
    .filter((variable) => variable.tipo !== "controle")
    .map((variable) => ({
      id: variable.id,
      nome: variable.nome,
      antes: before[variable.id] ?? 0,
      depois: after[variable.id] ?? 0,
    }))
    .filter((item) => Math.abs(item.depois - item.antes) > 1e-6)
    .sort((a, b) => Math.abs(b.depois - b.antes) - Math.abs(a.depois - a.antes))
    .slice(0, 15);
  return {
    ok: true,
    value: {
      partida: { ...partida, game: next },
      relatorio: {
        turno: next.currentTurn,
        receita: totals.revenue,
        gastoPrimario: totals.primaryExpense,
        juros: totals.interestExpense,
        resultado: totals.nominalResult,
        mudancas,
      },
    },
  };
}

/** Tudo o que a tela precisa desenhar, sem tipos do motor. */
export function verPartida(partida: Partida): VisaoPartida {
  const { content, game } = partida;
  const values = game.execution.values;
  const pib = content.initialState.economia?.pibAnual ?? 0;
  const states = new Map(
    game.policies.map((state) => [state.policyDefinitionId, state]),
  );
  const leis = content.policies.map((policy): VisaoLei => {
    const state = states.get(policy.id);
    const nivel = state?.implementedLevel ?? 0;
    const opcoes = policy.controle.opcoes;
    const nearest = opcoes?.reduce((best, option) =>
      Math.abs(option.valor - nivel) < Math.abs(best.valor - nivel)
        ? option
        : best,
    );
    const custoPib =
      opcoes?.find((option) => option.id === nearest?.id)
        ?.custoAnualPercentualPib ?? 0;
    const variable = content.variables.variaveis.find(
      (item) => item.id === policy.controle.variavel,
    );
    return {
      id: policy.id,
      nome: policy.nome,
      descricao: policy.descricao ?? "",
      grupo: policy.grupo,
      area: policy.area ?? "",
      ministerio: policy.ministerio ?? policy.area ?? "",
      nivel,
      meta: state?.desiredLevel ?? nivel,
      minimo: variable?.dominio.minimo,
      maximo: variable?.dominio.maximo,
      unidade: policy.controle.unidade,
      opcoes: opcoes?.map(({ id, rotulo, valor }) => ({ id, rotulo, valor })),
      opcaoAtual: nearest?.id,
      gastoAnual:
        policy.grupo === "orcamentaria" ? nivel : (custoPib * pib) / 100,
    };
  });
  const bolhas = content.variables.variaveis
    .filter((variable) => variable.tipo !== "controle")
    .map((variable) => ({
      id: variable.id,
      nome: variable.nome,
      tipo: variable.tipo,
      unidade: variable.unidade,
      area: variable.area ?? "",
      avaliacao: variable.avaliacao,
      valor: values[variable.id] ?? 0,
    }));
  const controlToLaw = new Map(
    content.policies.map((policy) => [policy.controle.variavel, policy.id]),
  );
  const ligacoes = content.consequences.map((consequence) => {
    const coefficient = Number(
      (consequence.parametros as { coeficiente?: number }).coeficiente ?? 1,
    );
    return {
      id: consequence.id,
      origem: controlToLaw.get(consequence.origem) ?? consequence.origem,
      alvo: consequence.alvo,
      sinal: (coefficient < 0 ? -1 : 1) as 1 | -1,
    };
  });
  return {
    pais: content.manifest?.nome ?? "",
    turno: game.currentTurn,
    caixa: game.fiscal?.cash ?? 0,
    divida: game.fiscal?.totalDebt ?? 0,
    pib,
    leis,
    bolhas,
    ligacoes,
  };
}
