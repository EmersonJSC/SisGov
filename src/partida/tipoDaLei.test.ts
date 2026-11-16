// Tipo da lei (16/nov): decreto muda sem voto; cláusula pétrea não muda.
import { describe, expect, it } from "vitest";
import { avancar, criarPartida, placarDaLei } from ".";

describe("tipo da lei", () => {
  const p = criarPartida("brasil-2026", 42);
  const lei = "remedio-pago-pelo-governo-na-farmacia";

  it("decreto não tem placar e vale no turno, com Congresso", () => {
    expect(p.regras.leis[lei].classe).toBe("decreto");
    expect(placarDaLei(p, lei, "desconto-na-lista-basica")).toBeNull();
    const depois = avancar(p, [
      { tipo: "mudar_lei", lei, valor: "desconto-na-lista-basica" },
    ]);
    expect(depois.estado.leis[lei]).toBe("desconto-na-lista-basica");
  });

  it("cláusula pétrea é recusada", () => {
    const petrea = {
      ...p,
      regras: {
        ...p.regras,
        leis: {
          ...p.regras.leis,
          [lei]: { ...p.regras.leis[lei], classe: "petrea" as const },
        },
      },
    };
    expect(() =>
      avancar(petrea, [
        { tipo: "mudar_lei", lei, valor: "desconto-na-lista-basica" },
      ]),
    ).toThrow(/pétrea/);
  });
});
