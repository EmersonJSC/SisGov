import { describe, expect, it } from "vitest";
import { valorNaMedida } from "../app/partida/medida";
import { diferencaNaTela, valorNaTela } from "../ui/mapa/formatos";
import { validateContentFile } from "../engine";

const variaveis = (medida: unknown, tipo = "calculado") =>
  validateContentFile(
    "variaveis.json",
    JSON.stringify({
      id: "v",
      tipo: "variaveis",
      versaoEsquema: 1,
      variaveis: [
        {
          id: "violencia",
          tipo,
          nome: "Violência",
          unidade: "indice_0_100",
          dominio: { minimo: 0, maximo: 100 },
          ...(tipo === "estoque" ? { valorInicial: 0 } : {}),
          medida,
        },
      ],
    }),
  );
const mensagens = (r: ReturnType<typeof variaveis>) =>
  r.ok ? [] : r.diagnostics.map((d) => d.message);

describe("medida real do índice (V1-07)", () => {
  it("aceita medida com balizas e fonte, sem balizas, e técnica", () => {
    for (const medida of [
      { unidade: "homicídios por 100 mil", zero: 0, cem: 60, fontes: ["SIM"] },
      { unidade: "% do PIB", fontes: ["Banco Central"] },
      { unidade: "folga política", tecnico: true },
    ])
      expect(mensagens(variaveis(medida))).toEqual([]);
  });

  it("recusa medida sem fonte, com uma baliza só ou em situação", () => {
    expect(mensagens(variaveis({ unidade: "x", zero: 0, cem: 1 }))).toContain(
      "Uma medida real precisa de pelo menos uma fonte.",
    );
    expect(
      mensagens(variaveis({ unidade: "x", zero: 0, fontes: ["a"] })),
    ).toContain("Zero e cem vêm juntos, como números.");
    expect(
      mensagens(variaveis({ unidade: "x", fontes: ["a"] }, "situacao")),
    ).toContain("Só índices calculados e estoques têm medida.");
  });

  it("converte o valor do motor para a medida real", () => {
    expect(valorNaMedida({ unidade: "h", zero: 0, cem: 60 }, 50)).toBe(30);
    expect(valorNaMedida({ unidade: "h", zero: 90, cem: 10 }, 25)).toBe(70);
    expect(valorNaMedida({ unidade: "% do PIB" }, 77)).toBe(77);
  });

  it("a tela mostra a medida real e a variação com o sinal real", () => {
    const feminicidio = {
      unidade: "indice_0_100",
      medida: { convertida: true, zero: 5, cem: 0 },
    };
    expect(valorNaTela(feminicidio, 80)).toBe("1");
    // o motor sobe 10 pontos (melhora): na medida real, caem 0,5
    expect(diferencaNaTela(feminicidio, 10)).toBe("−0,5");
    const pobreza = { unidade: "percentual_0_100" };
    expect(valorNaTela(pobreza, 27.4)).toBe("27,4%");
  });
});
