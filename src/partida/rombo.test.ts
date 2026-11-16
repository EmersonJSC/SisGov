// Rombo pesa no bolso (15/nov, GDD 3.7): gastar além do turno 0 sobe a
// inflação, e a inflação come o salário, mais do pobre que do rico.
import { describe, expect, it } from "vitest";
import { criarPartida, jogar } from ".";

describe("rombo vira inflação", () => {
  const p = criarPartida("brasil-2026", 42, { semCongresso: true });
  const parado = jogar(p, 12, []).estado;
  const corte = jogar(p, 12, [
    { tipo: "mudar_lei", lei: "imposto-consumo", valor: 0.07 },
  ]).estado;

  it("parado, a inflação fica na normal do país", () => {
    expect(parado.essenciais.inflacao).toBeCloseTo(
      p.estado.essenciais.inflacao,
      0,
    );
  });

  it("cortar imposto sem cortar gasto sobe a inflação e come o salário", () => {
    expect(corte.essenciais.inflacao).toBeGreaterThan(
      parado.essenciais.inflacao + 1,
    );
    expect(corte.inflacao!.perda).toBeGreaterThan(0.01);
  });
});
