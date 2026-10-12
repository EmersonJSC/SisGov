import { describe, expect, it } from "vitest";
import {
  advanceExecution,
  applyGradualResponse,
  createExecution,
  translateAuthorizedPolicies,
} from "../engine";
import { loadDistributedScenario } from "../game/pais/loadScenarioPackage";

type TrajectoryPoint = Readonly<{
  turn: number;
  resources: number;
  coverage: number;
  health: number;
  pressure: number;
  violence: number;
}>;

function runAttentionTrajectory(target: number): readonly TrajectoryPoint[] {
  const loaded = loadDistributedScenario("testes/legado/brasil/pais.json");
  if (!loaded.ok) throw new Error("Cenário inválido");
  const { definition: content, graph } = loaded.value;
  const attention = content.policies.find(
    (policy) => policy.id === "atencao-basica",
  )!;
  let execution = createExecution(content, graph);
  const rows: TrajectoryPoint[] = [];

  for (let turn = 1; turn <= 8; turn++) {
    const current = execution.values[attention.controle.variavel];
    const response = applyGradualResponse(
      current,
      target,
      target >= current
        ? attention.respostaTemporal!.implantacao
        : attention.respostaTemporal!.degradacao,
    );
    if (!response.ok) throw new Error("Resposta temporal inválida");
    const batch = translateAuthorizedPolicies(
      content,
      graph,
      content.policies.map((policy) => ({
        policyId: policy.id,
        intensity:
          policy.id === attention.id
            ? response.value.value
            : execution.values[policy.controle.variavel],
      })),
    );
    if (!batch.ok) throw new Error("Comando de política inválido");
    const advanced = advanceExecution(content, graph, execution, batch.value);
    if (!advanced.ok) throw new Error("Execução inválida");
    execution = advanced.value.execution;
    rows.push({
      turn,
      resources: execution.values.recursos_atencao_basica,
      coverage: execution.values.cobertura_aps,
      health: execution.values.saude_populacao,
      pressure: execution.values.pressao_hospitalar,
      violence: execution.values.violencia_letal,
    });
  }
  return rows;
}

describe("SG055 — cenários de referência", () => {
  it("compara base, expansão e redução da atenção básica", () => {
    const base = runAttentionTrajectory(4000);
    const expansion = runAttentionTrajectory(5000);
    const reduction = runAttentionTrajectory(3000);

    // Até o SG142: a rede do Brasil foi calibrada em torno de bases que não
    // existem mais (D-41), então só o sentido dos efeitos é conferido.
    expect(base.at(-1)!.resources).toBe(4000);
    expect(expansion.at(-1)!.coverage).toBeGreaterThan(base.at(-1)!.coverage);
    expect(expansion.at(-1)!.pressure).toBeLessThan(base.at(-1)!.pressure);
    expect(reduction.at(-1)!.coverage).toBeLessThanOrEqual(
      base.at(-1)!.coverage,
    );
    expect(reduction.at(-1)!.pressure).toBeGreaterThanOrEqual(
      base.at(-1)!.pressure,
    );
  });

  it("permite alterar alimentação escolar e propaga o efeito para educação", () => {
    const loaded = loadDistributedScenario("testes/legado/brasil/pais.json");
    if (!loaded.ok) throw new Error("Cenário inválido");
    const { definition: content, graph } = loaded.value;
    const schoolMeals = content.policies.find(
      (policy) => policy.id === "alimentacao-escolar",
    )!;
    let execution = createExecution(content, graph);

    for (let turn = 0; turn < 6; turn++) {
      const current = execution.values[schoolMeals.controle.variavel];
      const response = applyGradualResponse(
        current,
        700,
        schoolMeals.respostaTemporal!.implantacao,
      );
      if (!response.ok) throw new Error("Resposta temporal inválida");
      const batch = translateAuthorizedPolicies(
        content,
        graph,
        content.policies.map((policy) => ({
          policyId: policy.id,
          intensity:
            policy.id === schoolMeals.id
              ? response.value.value
              : execution.values[policy.controle.variavel],
        })),
      );
      if (!batch.ok) throw new Error("Comando de política inválido");
      const advanced = advanceExecution(content, graph, execution, batch.value);
      if (!advanced.ok) throw new Error("Execução inválida");
      execution = advanced.value.execution;
    }

    expect(execution.values.recursos_alimentacao_escolar).toBeGreaterThan(300);
    // A merenda alimenta a escolaridade, uma bolha lenta.
    expect(execution.values.escolaridade).toBeGreaterThan(0);
  });
});
