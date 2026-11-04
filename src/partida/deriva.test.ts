// Deriva: um índice anda sozinho, empurrado por outro.
import { describe, expect, it } from "vitest";
import { andarDerivas } from "../motor";

describe("deriva (motor)", () => {
  const dominios = { a: { min: 0, max: 100 }, b: { min: 0, max: 100 } };
  const regra = { indice: "a", por: "b", sentido: 1, forca: "media" } as const;

  it("sem mudança desde o turno 0, nada anda", () => {
    const nova = andarDerivas(
      [regra],
      { a: 40 },
      { b: 30 },
      { b: 30 },
      {},
      dominios,
    );
    expect(nova.a).toBe(40);
  });

  it("quem empurra subiu 10: anda 5% disso por turno", () => {
    const nova = andarDerivas(
      [regra],
      { a: 40 },
      { b: 40 },
      { b: 30 },
      {},
      dominios,
    );
    expect(nova.a).toBeCloseTo(40.5);
  });

  it("não acumula além do teto, contando as leis", () => {
    const nova = andarDerivas(
      [regra],
      { a: 95 },
      { b: 100 },
      { b: 0 },
      { a: 3 },
      dominios,
    );
    expect(nova.a).toBe(97);
  });
});
