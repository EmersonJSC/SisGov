import { describe, expect, it } from "vitest";
import {
  advanceExecution,
  applyGradualResponse,
  createExecution,
  translateAuthorizedPolicies,
} from "../engine";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

describe("tempo das políticas no exemplo", () => {
  it("preserva os resultados durante o atraso e degrada gradualmente depois", () => {
    const loaded = loadDistributedScenario("brasil-basico/cenario.json");
    if (!loaded.ok) throw new Error("Pacote inválido");
    const { definition: content, graph } = loaded.value;
    let execution = createExecution(content, graph);
    const policy = content.policies.find(
      (p) => p.id === "lei-11340-maria-da-penha",
    )!;
    const results: number[] = [];
    for (let turn = 0; turn < 5; turn++) {
      const response = applyGradualResponse(
        execution.values[policy.controle.variavel],
        0,
        policy.respostaTemporal!.degradacao,
      );
      if (!response.ok) throw new Error("Resposta inválida");
      const batch = translateAuthorizedPolicies(
        content,
        graph,
        content.policies.map((p) => ({
          policyId: p.id,
          intensity:
            p.id === policy.id
              ? response.value.value
              : execution.values[p.controle.variavel],
        })),
      );
      if (!batch.ok) throw new Error("Lote inválido");
      const result = advanceExecution(content, graph, execution, batch.value);
      if (!result.ok) throw new Error("Passo inválido");
      execution = result.value.execution;
      results.push(execution.values.protecao_mulheres);
    }
    expect(results.slice(0, 2)).toEqual([40, 40]);
    expect(results[2]).toBeCloseTo(38.8);
    expect(results[3]).toBeLessThan(results[2]);
    expect(results[4]).toBeGreaterThan(30);
    expect(execution.values.recursos_protecao_mulheres).toBeGreaterThan(0);
  });
});
