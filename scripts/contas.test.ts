// Cenário do passo 5: confere a direção, não o número.
import { describe, expect, it } from "vitest";
import { fecharTurno, motivoContaNaoFecha } from "../src/motor";
import { comDivida, comImposto, DIVIDAS } from "./contas";

describe("contas em um mandato", () => {
  it("imposto baixo endivida; imposto alto enche o cofre", () => {
    const baixo = comImposto(0.1).essenciais;
    const alto = comImposto(0.5).essenciais;
    expect(baixo.divida_publica).toBeGreaterThan(60);
    expect(baixo.cofre).toBe(0);
    expect(alto.cofre).toBeGreaterThan(2);
    expect(alto.divida_publica).toBeLessThan(baixo.divida_publica);
  });

  it("dívida acima da tolerância sobe os juros", () => {
    const [d40, d80, d120] = DIVIDAS.map((d) => comDivida(d).essenciais);
    expect(d40.taxa_juros).toBeCloseTo(8, 1);
    expect(d80.taxa_juros).toBeGreaterThan(d40.taxa_juros);
    expect(d120.taxa_juros).toBeGreaterThan(d80.taxa_juros);
  });

  it("falta sai do cofre antes de virar dívida", () => {
    const antes = { cofre: 10, divida: 100, resultado: 0 };
    const depois = fecharTurno(antes, { receita: 5, gasto: 12, juros: 1 });
    expect(depois).toEqual({ cofre: 2, divida: 100, resultado: -8 });
    const sem = fecharTurno(depois, { receita: 0, gasto: 5, juros: 0 });
    expect(sem).toEqual({ cofre: 0, divida: 103, resultado: -5 });
  });

  it("conta que não fecha é apontada", () => {
    const antes = { cofre: 0, divida: 100, resultado: 0 };
    expect(motivoContaNaoFecha(antes, { ...antes, resultado: -5 })).toMatch(
      /não fecha/,
    );
  });
});
