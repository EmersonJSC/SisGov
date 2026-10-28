/**
 * Porcentagem em gente contável (país em frases, fase 2).
 *
 * A frase de indicador em porcentagem é calculada, não escrita à mão: uma
 * função serve a dezenas de indicadores. O teste fixa o que o jogador lê nos
 * pontos que importam, principalmente os extremos — 100% é "todas", não
 * "nove em cada dez".
 */
import { describe, expect, it } from "vitest";
import {
  emCada,
  fracaoLegivel,
  partePerdidaPorAno,
} from "../app/partida/frase";
import { criarPartida } from "../app/partida";

describe("país em frases — porcentagem em gente", () => {
  it("acha a fração de denominador pequeno mais perto", () => {
    expect(fracaoLegivel(8.33)).toEqual({ numerador: 1, denominador: 12 });
    expect(fracaoLegivel(12.5)).toEqual({ numerador: 1, denominador: 8 });
    expect(fracaoLegivel(25)).toEqual({ numerador: 1, denominador: 4 });
    expect(fracaoLegivel(90)).toEqual({ numerador: 9, denominador: 10 });
  });

  it("lê o desemprego do jogo em pessoas", () => {
    expect(emCada(8.3)).toBe("uma pessoa em cada doze");
    expect(emCada(12.5)).toBe("uma pessoa em cada oito");
    expect(emCada(33)).toBe("uma pessoa em cada três");
  });

  it("usa o plural quando é mais de uma", () => {
    expect(emCada(90)).toBe("nove pessoas em cada dez");
    expect(emCada(66.7)).toBe("duas pessoas em cada três");
  });

  it("metade ganha leitura própria", () => {
    expect(emCada(50)).toBe("metade das pessoas");
  });

  it("os extremos não viram fração", () => {
    expect(emCada(0)).toBe("nenhuma pessoa");
    expect(emCada(100)).toBe("todas as pessoas");
    expect(emCada(-5)).toBe("nenhuma pessoa");
    expect(emCada(140)).toBe("todas as pessoas");
  });

  it("o numeral concorda com o sujeito", () => {
    const ocupado = { singular: "ocupado", plural: "ocupados" };
    expect(emCada(25, ocupado)).toBe("um ocupado em cada quatro");
    expect(emCada(66.7, ocupado)).toBe("dois ocupados em cada três");
    expect(emCada(90, ocupado)).toBe("nove ocupados em cada dez");
    expect(emCada(0, ocupado)).toBe("nenhum ocupado");
    expect(emCada(100, ocupado)).toBe("todos os ocupados");
    expect(emCada(50, ocupado)).toBe("metade dos ocupados");
  });

  it("valor sem sentido não vira frase", () => {
    expect(emCada(Number.NaN)).toBe("");
  });

  it("sem o número do país, não há parte perdida — só ritmo", () => {
    expect(partePerdidaPorAno(22, undefined)).toBeUndefined();
    expect(partePerdidaPorAno(22, 0)).toBeUndefined();
  });

  it("com a floresta do país, a parte perdida por ano sai da conta", () => {
    // Brasil: 4.966 mil km² de floresta (FAO 2020).
    expect(partePerdidaPorAno(22, 4966)).toBeCloseTo(0.443, 3);
    expect(partePerdidaPorAno(6, 4966)).toBeCloseTo(0.121, 3);
  });

  it("o Brasil declara a floresta, e ela chega na partida", () => {
    const criada = criarPartida({ ocorrencias: false });
    if (!criada.ok) throw new Error(criada.erros.join(" "));
    const territorio = criada.value.content.manifest.territorio;
    expect(territorio?.florestaMilKm2).toBeGreaterThan(0);
    expect(territorio?.fonte).toBeTruthy();
  });

  it("nenhuma porcentagem inteira de 1 a 99 fica sem frase", () => {
    const vazias = Array.from({ length: 99 }, (_, i) => i + 1).filter(
      (p) => emCada(p).length === 0,
    );
    expect(vazias).toEqual([]);
  });
});
