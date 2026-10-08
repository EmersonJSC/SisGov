import { expect, it, vi } from "vitest";
import * as laboratoryTurn from "../game/advanceLaboratoryTurn";
import { buildGraph, createExecution } from "../engine";
import {
  advanceQuarterlyLaboratoryTurn,
  MONTHS_PER_POLITICAL_TURN,
} from "../game/advanceQuarterlyLaboratoryTurn";
import type { LaboratoryState } from "../game/advanceLaboratoryTurn";
import { createD4ReferenceSandbox } from "../scenarios/d4ReferenceSandbox";
import { prepareMonthlyContent } from "../game/prepareMonthlyContent";

function laboratory() {
  const sandbox = createD4ReferenceSandbox();
  const state: LaboratoryState = {
    execution: createExecution(sandbox.content, sandbox.graph),
    targets: new Map(),
    pending: new Map(),
    activeSituationIds: new Set(),
    occurredEventIds: new Set(),
  };
  return { ...sandbox, state };
}

it("runs the UI's prepared monthly package for a full sixteen-quarter calendar", () => {
  const prepared = prepareMonthlyContent(createD4ReferenceSandbox().content);
  if (!prepared.ok) throw new Error("Invalid monthly package");
  const { content, graph } = prepared.value;
  let state: LaboratoryState = {
    execution: createExecution(content, graph),
    targets: new Map(),
    pending: new Map([["politica-001", 100]]),
    activeSituationIds: new Set(),
    occurredEventIds: new Set(),
  };
  for (let quarter = 1; quarter <= 16; quarter += 1) {
    const result = advanceQuarterlyLaboratoryTurn(content, graph, state);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(JSON.stringify(result.diagnostics));
    expect(result.value.absoluteQuarter).toBe(quarter);
    expect(result.value.execution.step).toBe(quarter * 3);
    if (quarter === 1)
      expect(result.value.execution.values.verba_001).toBeCloseTo(26.4);
    state = result.value;
  }
});

it("advances exactly one quarter and reports absolute month and quarter", () => {
  const s = laboratory();
  const next = advanceQuarterlyLaboratoryTurn(s.content, s.graph, s.state);

  expect(next.ok).toBe(true);
  if (!next.ok) return;
  expect(MONTHS_PER_POLITICAL_TURN).toBe(3);
  expect(next.value.execution.step).toBe(3);
  expect(next.value.absoluteQuarter).toBe(1);
  expect(next.value.months.map(({ absoluteMonth }) => absoluteMonth)).toEqual([
    1, 2, 3,
  ]);
  expect(next.value.journalEntries.map(({ period }) => period)).toEqual([
    "quarter",
    "month",
    "month",
    "month",
  ]);
  expect(next.value.journalEntries[0].title).toBe("Turno 1 concluído");
});

it("preserves the configured quarterly implementation rate", () => {
  const s = laboratory();
  const state = {
    ...s.state,
    pending: new Map([["politica-001", 100]]),
  };
  const next = advanceQuarterlyLaboratoryTurn(s.content, s.graph, state);

  expect(next.ok).toBe(true);
  if (!next.ok) return;
  expect(next.value.execution.values.verba_001).toBeCloseTo(26.4);
  expect(next.value.targets.get("politica-001")).toBe(100);
  expect(next.value.pending.size).toBe(0);
  expect(state.execution.step).toBe(0);
  expect(state.pending.get("politica-001")).toBe(100);
});

it("preserves the configured quarterly degradation rate", () => {
  const s = laboratory();
  const state = {
    ...s.state,
    pending: new Map([["politica-001", 0]]),
  };
  const startingLevel = state.execution.values.verba_001;
  const quarterlyDegradation = s.content.policies.find(
    (policy) => policy.id === "politica-001",
  )!.respostaTemporal!.degradacao;
  const next = advanceQuarterlyLaboratoryTurn(s.content, s.graph, state);

  expect(next.ok).toBe(true);
  if (!next.ok) return;
  expect(next.value.execution.values.verba_001).toBeCloseTo(
    startingLevel * (1 - quarterlyDegradation),
  );
});

it("evaluates situations monthly and activates their effects from the next month", () => {
  const s = laboratory();
  const content = {
    ...s.content,
    consequences: [
      ...s.content.consequences,
      {
        id: "efeito-situacao-mensal",
        tipo: "consequencia" as const,
        versaoEsquema: 1 as const,
        origem: "verba_001",
        alvo: "saude_populacao",
        mecanismo: "afim" as const,
        parametros: { coeficiente: 0.1, termoConstante: 0 },
        unidade: "indice_0_100",
        atrasoPassos: 0,
        duracao: { modo: "continuo" as const },
      },
    ],
    situations: s.content.situations.map((situation) =>
      situation.id === "crise-saude"
        ? {
            ...situation,
            entraQuando: {
              tipo: "comparacao" as const,
              variavel: "verba_001",
              operador: "menor_ou_igual" as const,
              valor: 7.7,
            },
            saiQuando: {
              tipo: "comparacao" as const,
              variavel: "verba_001",
              operador: "maior_que" as const,
              valor: 8,
            },
            consequencias: ["efeito-situacao-mensal"],
          }
        : situation,
    ),
  };
  const graph = buildGraph(content);
  const state = {
    ...s.state,
    pending: new Map([["politica-001", 0]]),
  };
  const next = advanceQuarterlyLaboratoryTurn(content, graph, state);

  expect(next.ok).toBe(true);
  if (!next.ok) return;
  const situationRelationId = "crise-saude:0:efeito-situacao-mensal";
  const relationIsActiveInMonth = (monthIndex: number) =>
    next.value.months[monthIndex].explanations
      .find((explanation) => explanation.targetId === "saude_populacao")
      ?.contributions.some(
        (contribution) => contribution.relationId === situationRelationId,
      ) ?? false;

  expect(relationIsActiveInMonth(0)).toBe(false);
  expect(relationIsActiveInMonth(1)).toBe(true);
  expect(relationIsActiveInMonth(2)).toBe(true);
  expect(next.value.activeSituationIds.has("crise-saude")).toBe(true);
});

it("fires events monthly once and applies their effects beginning next month", () => {
  const s = laboratory();
  const content = {
    ...s.content,
    events: [
      ...s.content.events,
      {
        id: "evento-mensal-teste",
        tipo: "evento" as const,
        versaoEsquema: 1 as const,
        nome: "Evento mensal de teste",
        entraQuando: {
          tipo: "comparacao" as const,
          variavel: "verba_001",
          operador: "menor_ou_igual" as const,
          valor: 7.7,
        },
        consequencias: ["consequencia-evento-mensal"],
      },
    ],
    consequences: [
      ...s.content.consequences,
      {
        id: "consequencia-evento-mensal",
        tipo: "consequencia" as const,
        versaoEsquema: 1 as const,
        origem: "verba_001",
        alvo: "saude_populacao",
        mecanismo: "afim" as const,
        parametros: { coeficiente: 0.1, termoConstante: 0 },
        unidade: "indice_0_100",
        atrasoPassos: 0,
        duracao: { modo: "continuo" as const },
      },
    ],
  };
  const graph = buildGraph(content);
  const state = {
    ...s.state,
    pending: new Map([["politica-001", 0]]),
  };
  const next = advanceQuarterlyLaboratoryTurn(content, graph, state);

  expect(next.ok).toBe(true);
  if (!next.ok) return;
  const eventId = "evento-mensal-teste";
  const relationId = `${eventId}:0:consequencia-evento-mensal`;
  const relationIsActiveInMonth = (monthIndex: number) =>
    next.value.months[monthIndex].explanations
      .find((explanation) => explanation.targetId === "saude_populacao")
      ?.contributions.some(
        (contribution) => contribution.relationId === relationId,
      ) ?? false;

  expect(next.value.months[0].newEventIds).toContain(eventId);
  expect(next.value.months[1].newEventIds).not.toContain(eventId);
  expect(next.value.months[1].occurredEventIds.has(eventId)).toBe(true);
  expect(relationIsActiveInMonth(0)).toBe(false);
  expect(relationIsActiveInMonth(1)).toBe(true);
  expect(relationIsActiveInMonth(2)).toBe(true);
  expect(
    next.value.journalEntries.find(
      (entry) => entry.period === "month" && entry.month === 1,
    )?.details,
  ).toContain("Evento acionado: Evento mensal de teste.");
});

it("rejects a quarter that starts between quarter boundaries", () => {
  const s = laboratory();
  const state = {
    ...s.state,
    execution: { ...s.state.execution, step: 2 },
  };
  const next = advanceQuarterlyLaboratoryTurn(s.content, s.graph, state);

  expect(next.ok).toBe(false);
  if (next.ok) return;
  expect(next.diagnostics[0]).toMatchObject({
    code: "COMANDO_INVALIDO",
    field: "execution.step",
  });
});

it("leaves the input state unchanged when a month cannot be calculated", () => {
  const s = laboratory();
  const state = {
    ...s.state,
    pending: new Map([["politica-001", 150]]),
  };
  const before = structuredClone(state);
  const next = advanceQuarterlyLaboratoryTurn(s.content, s.graph, state);

  expect(next.ok).toBe(false);
  expect(state).toEqual(before);
});

it("continues absolute months across quarters without changing the previous state", () => {
  const s = laboratory();
  const first = advanceQuarterlyLaboratoryTurn(s.content, s.graph, s.state);
  expect(first.ok).toBe(true);
  if (!first.ok) return;
  const before = structuredClone(first.value);
  const second = advanceQuarterlyLaboratoryTurn(
    s.content,
    s.graph,
    first.value,
  );
  expect(second.ok).toBe(true);
  if (!second.ok) return;
  expect(second.value.absoluteQuarter).toBe(2);
  expect(second.value.execution.step).toBe(6);
  expect(second.value.months.map((month) => month.absoluteMonth)).toEqual([
    4, 5, 6,
  ]);
  expect(first.value).toEqual(before);
});

it.each([-3, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER - 1])(
  "rejects invalid or overflowing absolute month %s",
  (step) => {
    const s = laboratory();
    const state = { ...s.state, execution: { ...s.state.execution, step } };
    const before = structuredClone(state);
    const result = advanceQuarterlyLaboratoryTurn(s.content, s.graph, state);
    expect(result.ok).toBe(false);
    expect(state).toEqual(before);
  },
);

it.each([2, 3])(
  "does not commit earlier months when month %s fails",
  (failedMonth) => {
    const s = laboratory();
    const state = { ...s.state, pending: new Map([["politica-001", 100]]) };
    const before = structuredClone(state);
    const advance = laboratoryTurn.advanceLaboratoryTurn;
    const spy = vi.spyOn(laboratoryTurn, "advanceLaboratoryTurn");
    let calls = 0;
    spy.mockImplementation((content, graph, current) => {
      calls += 1;
      if (calls === failedMonth) {
        return {
          ok: false,
          diagnostics: [
            {
              code: "CALCULO_INVALIDO",
              file: "$teste",
              field: "mes",
              message: "Falha mensal sintética.",
            },
          ],
        };
      }
      return advance(content, graph, current);
    });
    try {
      const result = advanceQuarterlyLaboratoryTurn(s.content, s.graph, state);
      expect(result.ok).toBe(false);
      expect(calls).toBe(failedMonth);
      expect(state).toEqual(before);
    } finally {
      spy.mockRestore();
    }
    const retry = advanceQuarterlyLaboratoryTurn(s.content, s.graph, state);
    expect(retry.ok).toBe(true);
    if (!retry.ok) return;
    expect(retry.value.execution.step).toBe(3);
    expect(retry.value.execution.values.verba_001).toBeCloseTo(26.4);
  },
);
