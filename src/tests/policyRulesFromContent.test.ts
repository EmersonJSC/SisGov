import { expect, it } from "vitest";
import { policyLevelRulesFromContent } from "../game/policyRulesFromContent";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

function content() {
  const loaded = loadDistributedScenario(
    "brasil-primeiro-cenario/cenario.json",
  );
  if (!loaded.ok) throw new Error(loaded.diagnostics[0]?.message);
  return structuredClone(loaded.value.definition);
}

it("lê domínio e unidade da variável de controle do JSON", () => {
  expect(
    policyLevelRulesFromContent(content(), "atencao-basica"),
  ).toMatchObject({
    ok: true,
    value: {
      rules: {
        policyDefinitionId: "atencao-basica",
        unit: "moeda_milhoes_2024_ano",
        domain: { minimum: 2400, maximum: 6000 },
        options: undefined,
      },
    },
  });
});

it("lê as opções autorizáveis do controle da política", () => {
  const value = content();
  const policy = value.policies.find((item) => item.id === "atencao-basica")!;
  policy.controle.opcoes = [
    { id: "baixo", valor: 3000, rotulo: "Baixo" },
    { id: "alto", valor: 5000, rotulo: "Alto" },
  ];
  const result = policyLevelRulesFromContent(value, "atencao-basica");
  expect(result).toMatchObject({
    ok: true,
    value: { rules: { options: [3000, 5000] } },
  });
});

it("recusa controle sem mínimo de domínio, apontando arquivo e campo", () => {
  const value = content();
  const variable = value.variables.variaveis.find(
    (item) => item.id === "recursos_atencao_basica",
  )!;
  variable.dominio = { maximo: 6000 };
  const result = policyLevelRulesFromContent(value, "atencao-basica");
  expect(result).toMatchObject({
    ok: false,
    diagnostics: [
      {
        file: expect.stringContaining("variaveis"),
        field: "variaveis.recursos_atencao_basica.dominio.minimo",
      },
    ],
  });
});

it("recusa política inexistente", () => {
  expect(policyLevelRulesFromContent(content(), "nao-existe")).toMatchObject({
    ok: false,
    diagnostics: [{ field: "politica" }],
  });
});
