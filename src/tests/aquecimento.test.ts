import { describe, expect, it } from "vitest";
import { createGame } from "../game/createGame";
import { loadScenarioPackage } from "../game/pais/loadScenarioPackage";
import { prepareMonthlyContent } from "../game/prepareMonthlyContent";

const arquivos = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>("../conteudo/**/*.json", {
      eager: true,
      query: "?raw",
      import: "default",
    }),
  ).map(([path, text]) => [path.slice("../conteudo/".length), text]),
);
const MINIMO = "testes/pais-minimo/pais.json";

function jogo(trimestres?: number) {
  const pais = JSON.parse(arquivos[MINIMO]) as {
    cenario: Record<string, unknown>;
  };
  if (trimestres !== undefined) pais.cenario.aquecimentoTrimestres = trimestres;
  const carregado = loadScenarioPackage(MINIMO, {
    ...arquivos,
    [MINIMO]: JSON.stringify(pais),
  });
  if (!carregado.ok) throw new Error(JSON.stringify(carregado.diagnostics));
  const mensal = prepareMonthlyContent(carregado.value.definition);
  if (!mensal.ok) throw new Error("conteúdo mensal falhou");
  const criado = createGame("teste", mensal.value.content, mensal.value.graph, {
    randomSeed: 1,
    occurrences: false,
  });
  if (!criado.ok) throw new Error(JSON.stringify(criado.diagnostics));
  return criado.value;
}

describe("aquecimento antes do turno 0 (V1-07)", () => {
  it("roda 4 trimestres sozinho e começa no turno 0 com história", () => {
    const frio = jogo();
    const quente = jogo(4);
    expect(frio.execution.step).toBe(0);
    expect(quente.execution.step).toBe(12);
    expect(quente.currentTurn).toBe(0);
    expect(quente.execution.history.length).toBeGreaterThan(0);
    // estoques andam: a dívida não fica parada um ano inteiro
    expect(quente.execution.values.divida_publica).not.toBe(
      frio.execution.values.divida_publica,
    );
    expect(jogo(4).execution.values).toEqual(quente.execution.values);
  });

  it("recusa aquecimento fora de 0 a 60 meses", () => {
    expect(() => jogo(21)).toThrow(
      "Use um número inteiro de meses, de 0 a 60.",
    );
  });
});
