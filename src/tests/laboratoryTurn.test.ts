import { expect, it } from "vitest";
import {
  advanceExecution,
  createExecution,
  translateAuthorizedPolicies,
} from "../engine";
import { createD4ReferenceSandbox } from "../scenarios/d4ReferenceSandbox";

it("advances the visual laboratory from its inherited initial state", () => {
  const { content, graph } = createD4ReferenceSandbox();
  const execution = createExecution(content, graph);
  const batch = translateAuthorizedPolicies(
    content,
    graph,
    content.policies.map((p) => ({
      policyId: p.id,
      intensity: execution.values[p.controle.variavel],
    })),
  );
  if (!batch.ok) throw new Error(JSON.stringify(batch.diagnostics));
  const next = advanceExecution(content, graph, execution, batch.value);
  if (!next.ok) throw new Error(JSON.stringify(next.diagnostics));
  expect(next.value.execution.step).toBe(1);
});

import { buildGraph } from "../engine";
import {
  advanceLaboratoryTurn,
  type LaboratoryState,
} from "../game/advanceLaboratoryTurn";
import {
  appendTurnLog,
  TURN_LOG_LIMIT,
  type TurnLogEntry,
} from "../game/turnJournal";

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
it("runs many turns at both control extremes and permits a financial deficit", () => {
  for (const target of [0, 100]) {
    const s = laboratory();
    let state = s.state;
    state = {
      ...state,
      pending: new Map(s.content.policies.map((p) => [p.id, target])),
    };
    for (let i = 0; i < 60; i++) {
      const next = advanceLaboratoryTurn(s.content, s.graph, state);
      if (!next.ok) throw new Error(JSON.stringify(next.diagnostics));
      state = { ...next.value, pending: new Map() };
    }
    expect(state.execution.step).toBe(60);
    expect(state.execution.values.saude_populacao).toBeGreaterThanOrEqual(50);
    expect(state.execution.values.saude_populacao).toBeLessThanOrEqual(
      95.000001,
    );
    if (target === 100)
      expect(state.execution.values.saldo_publico).toBeLessThan(0);
  }
});
it("retains desired targets while applying them gradually and explains changes", () => {
  const s = laboratory();
  const state = { ...s.state, pending: new Map([["politica-001", 100]]) };
  const next = advanceLaboratoryTurn(s.content, s.graph, state);
  if (!next.ok) throw new Error(JSON.stringify(next.diagnostics));
  expect(next.value.execution.values.verba_001).toBeCloseTo(26.4);
  expect(next.value.targets.get("politica-001")).toBe(100);
  expect(
    next.value.explanations.find((e) => e.targetId === "saude_populacao")
      ?.contributions.length,
  ).toBe(15);
  expect(state.execution.step).toBe(0);
  expect(state.pending.get("politica-001")).toBe(100);
});
it("rejects invalid desired targets before gradual interpolation", () => {
  const s = laboratory();
  const state = { ...s.state, pending: new Map([["politica-001", 150]]) };
  const before = structuredClone(state);
  expect(advanceLaboratoryTurn(s.content, s.graph, state).ok).toBe(false);
  expect(state).toEqual(before);
});
it("reports the offending variable and preserves all state on late calculation failure", () => {
  const s = laboratory();
  const content = {
    ...s.content,
    consequences: s.content.consequences.map((c) =>
      c.id === "efeito-001"
        ? { ...c, parametros: { ...c.parametros, coeficiente: 1000 } }
        : c,
    ),
  };
  const before = structuredClone(s.state);
  const next = advanceLaboratoryTurn(content, buildGraph(content), s.state);
  expect(next.ok).toBe(false);
  if (next.ok) return;
  expect(next.diagnostics[0].field).toBe("valores.saude_populacao");
  expect(next.diagnostics[0].message).toContain("Saúde da população");
  expect(s.state).toEqual(before);
});
it("keeps a bounded journal independently of step history", () => {
  let entries: readonly TurnLogEntry[] = [];
  for (let i = 0; i < 120; i++)
    entries = appendTurnLog(entries, {
      turn: i,
      level: "success",
      title: "Confirmado",
      details: [String(i)],
    });
  expect(entries).toHaveLength(TURN_LOG_LIMIT);
  expect(entries[0]).toMatchObject({ id: 120, turn: 119 });
  expect(entries.at(-1)?.id).toBe(21);
  const before = entries;
  const failed = appendTurnLog(entries, {
    turn: 119,
    level: "error",
    title: "Não confirmado",
    details: ["Domínio inválido"],
  });
  expect(failed[0].turn).toBe(119);
  expect(before[0].level).toBe("success");
});
