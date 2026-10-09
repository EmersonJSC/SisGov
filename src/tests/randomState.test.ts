import { expect, it } from "vitest";
import { createRandomState, drawRandomValues } from "../game/randomState";

it("produz sequência reproduzível e avança o estado exatamente pelo consumo", () => {
  const first = createRandomState(123456);
  const second = createRandomState(123456);
  if (!first.ok || !second.ok) throw new Error("Semente deveria ser válida.");
  const a = drawRandomValues(first.value, 3);
  const b = drawRandomValues(second.value, 3);
  expect(a).toEqual(b);
  if (!a.ok) return;
  expect(a.value.values).toHaveLength(3);
  expect(a.value.state.state).not.toBe(first.value.state);
  expect(a.value.values.every((value) => value >= 0 && value < 1)).toBe(true);
});

it("não consome sorteio quando a quantidade é zero e rejeita semente inválida", () => {
  const created = createRandomState(1);
  if (!created.ok) throw new Error("Semente deveria ser válida.");
  expect(drawRandomValues(created.value, 0)).toEqual({
    ok: true,
    value: { values: [], state: created.value },
  });
  expect(createRandomState(0)).toMatchObject({
    ok: false,
    diagnostics: [{ field: "random.seed" }],
  });
});
