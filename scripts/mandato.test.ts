// Cenário do passo 4: confere a direção, não o número.
import { describe, expect, it } from "vitest";
import { criarPartida, jogar } from "../src/partida";
import { ALIQUOTAS, mandato } from "./mandato";

describe("mandato com o imposto de renda em três valores", () => {
  const [baixo, medio, alto] = ALIQUOTAS.map((a) => mandato(a));

  it("imposto mais alto arrecada mais (abaixo do pico)", () => {
    expect(medio.essenciais.arrecadacao).toBeGreaterThan(
      baixo.essenciais.arrecadacao,
    );
    expect(alto.essenciais.arrecadacao).toBeGreaterThan(
      medio.essenciais.arrecadacao,
    );
  });

  it("imposto mais alto baixa o padrão de vida", () => {
    expect(medio.jogabilidade.padrao_vida).toBeLessThan(
      baixo.jogabilidade.padrao_vida,
    );
    expect(alto.jogabilidade.padrao_vida).toBeLessThan(
      medio.jogabilidade.padrao_vida,
    );
  });

  it("o efeito chega inteiro depois do atraso, não antes", () => {
    const pedido = [
      { tipo: "mudar_lei" as const, lei: "imposto-renda", valor: 0.5 },
    ];
    const pv = (turnos: number) =>
      jogar(criarPartida("teste", 1, { semCongresso: true }), turnos, pedido)
        .estado.jogabilidade.padrao_vida;
    expect(pv(1)).toBeGreaterThan(pv(2));
    expect(pv(2)).toBeCloseTo(pv(10), 1);
  });

  it("mesma semente, mesma partida; outra semente, outra", () => {
    expect(mandato(0.3, 7)).toEqual(mandato(0.3, 7));
    expect(mandato(0.3, 7)).not.toEqual(mandato(0.3, 8));
  });

  it("o estado anterior não muda", () => {
    const p = criarPartida("teste", 3, { semCongresso: true });
    const antes = JSON.stringify(p.estado);
    jogar(p, 5, [
      { tipo: "mudar_lei", lei: "pena-de-morte", valor: "crimes-graves" },
    ]);
    expect(JSON.stringify(p.estado)).toBe(antes);
  });
});
