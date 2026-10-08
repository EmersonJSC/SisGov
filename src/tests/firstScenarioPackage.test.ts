import { describe, expect, it } from "vitest";
import {
  advanceExecution,
  createExecution,
  translateAuthorizedPolicies,
} from "../engine";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

describe("primeiro cenário brasileiro", () => {
  it("carrega o estado herdado e conserva a base sem nova decisão", () => {
    const loaded = loadDistributedScenario(
      "brasil-primeiro-cenario/cenario.json",
    );
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
    expect(advanced.value.execution.values).toMatchObject({
      cobertura_aps: 72,
      saude_populacao: 60,
      pressao_hospitalar: 54,
      violencia_letal: 21.2,
      protecao_efetiva_mulheres: 42,
      frequencia_escolar: 75,
      participacao_trabalho_cuidadoras: 62,
      oportunidades_juvenis: 45,
      despesa_recorte: 5640,
      saldo_recorte: 360,
    });
  });
});
