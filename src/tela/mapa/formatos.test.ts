import { describe, expect, it } from "vitest";
import { dinheiro, fluxoDaLei, porAnoEPorTurno } from "./formatos";

describe("dinheiro na tela", () => {
  it("escreve tri, bi, mi e mil com o símbolo e o sinal", () => {
    expect(dinheiro(2e12, "Ƶ")).toBe("Ƶ 2 tri");
    expect(dinheiro(480e9, "Ƶ")).toBe("Ƶ 480 bi");
    expect(dinheiro(-5e9, "Ƶ")).toBe("−Ƶ 5 bi");
    expect(dinheiro(1.2e12, "Ƶ")).toBe("Ƶ 1,2 tri");
    expect(dinheiro(0, "Ƶ")).toBe("Ƶ 0");
    expect(dinheiro(35e6, "Ƶ")).toBe("Ƶ 35 mi");
  });

  it("converte % do PIB em valor por ano e por turno (ano ÷ 6)", () => {
    expect(porAnoEPorTurno(24, 2e12, "Ƶ")).toBe(
      "Ƶ 480 bi por ano · Ƶ 80 bi no turno",
    );
  });
});

describe("dinheiro ao lado das leis", () => {
  it("verba é o próprio valor; imposto lê a curva e interpola entre pontos", () => {
    expect(fluxoDaLei({ tipo: "verba" }, 6)).toBe(6);
    const curva = Array.from({ length: 101 }, (_, i) => i * (100 - i));
    expect(fluxoDaLei({ tipo: "imposto", curva }, 30)).toBe(2100);
    expect(fluxoDaLei({ tipo: "imposto", curva }, 30.5)).toBeCloseTo(
      (2100 + 30.5 * 0 + 31 * 69) / 2,
    );
    expect(fluxoDaLei({ tipo: "imposto", curva }, 100)).toBe(0);
  });
});
