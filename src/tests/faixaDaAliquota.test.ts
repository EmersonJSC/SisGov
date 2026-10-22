import { describe, expect, it } from "vitest";
import type { VisaoLei } from "../app/partida";
import { faixaNumerica } from "../ui/mapa/Documentos";

const aliquota = (nivel: number) =>
  ({
    nivel,
    meta: nivel,
    minimo: 0,
    maximo: 100,
    unidade: "percentual_0_100",
  }) as unknown as VisaoLei;

describe("controle de alíquota (mecânica 2, 2.1: de 0% a 100%, sem trava)", () => {
  it("imposto sobre imóveis em 0,5% vai até 100%, não só até 2%", () => {
    expect(faixaNumerica(aliquota(0.5)).max).toBe(100);
  });

  it("imposto que o país não cobra (0%) também vai até 100%", () => {
    expect(faixaNumerica(aliquota(0)).max).toBe(100);
  });

  it("o passo deixa escolher décimos de ponto", () => {
    expect(faixaNumerica(aliquota(0.5)).passo).toBeLessThanOrEqual(0.1);
  });
});
