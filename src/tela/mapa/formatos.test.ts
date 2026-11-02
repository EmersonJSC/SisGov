import { describe, expect, it } from "vitest";
import { dinheiro, porAnoEPorTurno } from "./formatos";

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
