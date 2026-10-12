import { describe, expect, it } from "vitest";
import { checkNetworkRules, createExecution } from "../engine";
import { contextNodeId } from "../engine/model/lawNodes";
import { loadDistributedScenario } from "../game/pais/loadScenarioPackage";
import { prepareMonthlyContent } from "../game/prepareMonthlyContent";

/**
 * Trava da rede sem números soltos (V1-07, desenho/rede.md §9): cada
 * contagem só pode cair. Quando uma limpeza baixar um número, baixe o
 * limite aqui junto; quando todos chegarem a zero, a regra vira erro de
 * carga. Detalhe por índice: `npm run rede:contexto`.
 */
const limites = {
  indicesSemEntrada: 2,
  leisSemModulacao: 1,
  indicesSemMedida: 0,
  contextoAcimaDe5: 110,
  contextoAcimaDe25: 69,
  contextoAcimaDe50: 28,
};

describe("trava da rede (V1-07)", () => {
  it("nenhuma contagem de números soltos sobe no Brasil", () => {
    const loaded = loadDistributedScenario("paises/brasil/pais.json");
    if (!loaded.ok) throw new Error("Brasil não carregou");
    const monthly = prepareMonthlyContent(loaded.value.definition);
    if (!monthly.ok) throw new Error("conteúdo mensal falhou");
    const { content, graph } = monthly.value;
    const rules = checkNetworkRules(content, graph);
    const values = createExecution(content, graph).values;
    const contextos = Object.keys(
      content.initialState.indicesIniciais ?? {},
    ).map((id) => Math.abs(values[contextNodeId(id)] ?? 0));
    const acima = (limite: number) =>
      contextos.filter((valor) => valor > limite).length;
    const agora = {
      indicesSemEntrada: rules.withoutInput.length,
      leisSemModulacao: rules.unmodulatedLaws.length,
      indicesSemMedida: rules.withoutMeasure.length,
      contextoAcimaDe5: acima(5),
      contextoAcimaDe25: acima(25),
      contextoAcimaDe50: acima(50),
    };
    const acimaDoLimite = Object.entries(limites).filter(
      ([regra, limite]) => agora[regra as keyof typeof agora] > limite,
    );
    expect(acimaDoLimite, JSON.stringify(agora)).toEqual([]);
  });
});
