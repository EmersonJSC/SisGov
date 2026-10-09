import { describe, expect, it } from "vitest";
import {
  advanceExecution,
  createExecution,
  translateAuthorizedPolicies,
} from "../engine";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

describe("primeiro cenário brasileiro", () => {
  it("carrega o estado herdado e calcula os índices pela rede", () => {
    const loaded = loadDistributedScenario("paises/brasil/pais.json");
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) return;

    const { definition: content, graph } = loaded.value;
    expect(content.manifest.perfis).toEqual([
      expect.objectContaining({ id: "dependencia-rede-publica", peso: 0.55 }),
      expect.objectContaining({
        id: "trabalho-circulacao-violencia",
        peso: 0.45,
      }),
    ]);
    const politicalOrganization = content.organizacaoPolitica;
    expect(politicalOrganization?.formaInicial).toBe(
      "republica-presidencialista",
    );
    expect(
      politicalOrganization?.instituicoes.find(({ id }) => id === "senado"),
    ).toMatchObject({
      composicao: expect.objectContaining({ quantidadePorUnidade: 3 }),
      mandatoMeses: 96,
      renovacao: { intervaloMeses: 48, cadeirasPorUnidade: [2, 1] },
    });
    expect(politicalOrganization?.mudancasConstitucionais).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "reduzir-senado-para-uma-vaga-por-unidade",
        }),
        expect.objectContaining({ id: "abolir-senado" }),
        expect.objectContaining({ id: "instaurar-ditadura-executiva" }),
      ]),
    );
    const execution = createExecution(content, graph);
    const batch = translateAuthorizedPolicies(
      content,
      graph,
      content.policies.map((policy) => ({
        policyId: policy.id,
        intensity: execution.values[policy.controle.variavel],
      })),
    );
    expect(batch.ok).toBe(true);
    if (!batch.ok) return;

    const advanced = advanceExecution(content, graph, execution, batch.value);
    expect(advanced.ok).toBe(true);
    if (!advanced.ok) return;
    // Até o SG142 reconstruir a rede: índices são calculados (D-41), nunca
    // declarados pelo país, e ficam dentro do domínio.
    expect(content.initialState.valores).not.toHaveProperty("cobertura_aps");
    for (const variable of content.variables.variaveis) {
      if (variable.tipo !== "calculado") continue;
      const value = advanced.value.execution.values[variable.id];
      expect(Number.isFinite(value)).toBe(true);
      if (variable.dominio.minimo !== undefined)
        expect(value).toBeGreaterThanOrEqual(variable.dominio.minimo);
      if (variable.dominio.maximo !== undefined)
        expect(value).toBeLessThanOrEqual(variable.dominio.maximo);
    }
  });
});
