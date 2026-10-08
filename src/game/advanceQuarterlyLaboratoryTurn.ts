import {
  type ResolvedPackage,
  type ScenarioGraph,
  type TargetExplanation,
  type ValidationResult,
} from "../engine";
import {
  advanceLaboratoryTurn,
  type LaboratoryState,
} from "./advanceLaboratoryTurn";
import { appendTurnLog, type TurnLogEntry } from "./turnJournal";

export const MONTHS_PER_POLITICAL_TURN = 3;

export type QuarterlyLaboratoryTurn = Readonly<{
  execution: LaboratoryState["execution"];
  targets: ReadonlyMap<string, number>;
  pending: ReadonlyMap<string, number>;
  activeSituationIds: ReadonlySet<string>;
  occurredEventIds: ReadonlySet<string>;
  absoluteQuarter: number;
  months: readonly Readonly<{
    absoluteMonth: number;
    explanations: readonly TargetExplanation[];
    activeSituationIds: ReadonlySet<string>;
    occurredEventIds: ReadonlySet<string>;
    newEventIds: readonly string[];
  }>[];
  journalEntries: readonly TurnLogEntry[];
}>;

/**
 * Advance one political quarter in the technical laboratory. Decisions staged
 * for this turn are applied in month one; quarterly response rates are converted
 * to equivalent monthly fractions so three steps do not accelerate adoption.
 * Fiscal accounting, proposals, votes and elections are not part of this helper.
 */
export function advanceQuarterlyLaboratoryTurn(
  content: ResolvedPackage,
  graph: ScenarioGraph,
  state: LaboratoryState,
): ValidationResult<QuarterlyLaboratoryTurn> {
  if (
    !Number.isSafeInteger(state.execution.step) ||
    state.execution.step < 0 ||
    !Number.isSafeInteger(state.execution.step + MONTHS_PER_POLITICAL_TURN) ||
    state.execution.step % MONTHS_PER_POLITICAL_TURN !== 0
  ) {
    return {
      ok: false,
      diagnostics: [
        {
          code: "COMANDO_INVALIDO",
          file: "$partida",
          field: "execution.step",
          message:
            "Um turno trimestral deve começar em uma fronteira de trimestre e manter meses inteiros seguros.",
        },
      ],
    };
  }

  const monthlyContent: ResolvedPackage = {
    ...content,
    policies: content.policies.map((policy) => {
      if (
        !policy.respostaTemporal ||
        content.manifest.unidadeTemporal === "mes"
      )
        return policy;
      return {
        ...policy,
        respostaTemporal: {
          implantacao: equivalentMonthlyFraction(
            policy.respostaTemporal.implantacao,
          ),
          degradacao: equivalentMonthlyFraction(
            policy.respostaTemporal.degradacao,
          ),
        },
      };
    }),
  };

  let monthState = state;
  const absoluteQuarter = state.execution.step / MONTHS_PER_POLITICAL_TURN + 1;
  const months: {
    absoluteMonth: number;
    explanations: readonly TargetExplanation[];
    activeSituationIds: ReadonlySet<string>;
    occurredEventIds: ReadonlySet<string>;
    newEventIds: readonly string[];
  }[] = [];
  let journalEntries: readonly TurnLogEntry[] = [];

  for (let index = 0; index < MONTHS_PER_POLITICAL_TURN; index += 1) {
    const situationsBefore = new Set(monthState.activeSituationIds);
    const advanced = advanceLaboratoryTurn(monthlyContent, graph, monthState);
    if (!advanced.ok) return advanced;

    const absoluteMonth = advanced.value.execution.step;
    const changedSituations = content.situations.flatMap((situation) => {
      const wasActive = situationsBefore.has(situation.id);
      const isActive = advanced.value.activeSituationIds.has(situation.id);
      return wasActive === isActive
        ? []
        : [
            `${isActive ? "Situação iniciada" : "Situação encerrada"}: ${situation.nome}.`,
          ];
    });
    const newEvents = advanced.value.newEventIds.map(
      (id) =>
        `Evento acionado: ${
          content.events.find((event) => event.id === id)?.nome ?? id
        }.`,
    );
    journalEntries = appendTurnLog(journalEntries, {
      turn: absoluteQuarter,
      month: absoluteMonth,
      period: "month",
      level: "info",
      title: `Mês ${absoluteMonth} processado`,
      details: [
        `${advanced.value.explanations.length} resultados calculados.`,
        ...changedSituations,
        ...newEvents,
      ],
    });
    monthState = {
      ...advanced.value,
      pending: new Map(),
    };
    months.push({
      absoluteMonth,
      explanations: advanced.value.explanations,
      activeSituationIds: new Set(advanced.value.activeSituationIds),
      occurredEventIds: new Set(advanced.value.occurredEventIds),
      newEventIds: [...advanced.value.newEventIds],
    });
  }

  journalEntries = appendTurnLog(journalEntries, {
    turn: absoluteQuarter,
    period: "quarter",
    level: "success",
    title: `Turno ${absoluteQuarter} concluído`,
    details: [
      `${MONTHS_PER_POLITICAL_TURN} meses processados.`,
      `${months.reduce((count, month) => count + month.newEventIds.length, 0)} eventos acionados no trimestre.`,
    ],
  });

  return {
    ok: true,
    value: {
      ...monthState,
      absoluteQuarter,
      months,
      journalEntries,
    },
  };
}

function equivalentMonthlyFraction(quarterlyFraction: number): number {
  return 1 - Math.pow(1 - quarterlyFraction, 1 / MONTHS_PER_POLITICAL_TURN);
}
