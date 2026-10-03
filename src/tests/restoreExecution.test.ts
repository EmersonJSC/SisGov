import { describe, expect, it } from "vitest";
import { createExecution, exportExecution, restoreExecution } from "../engine";
import { loadDistributedScenario } from "../scenarios/loadScenarioPackage";

function setup() {
  const loaded = loadDistributedScenario("exemplo/cenario.json");
  if (!loaded.ok) throw new Error("O cenário deveria carregar.");
  const execution = createExecution(
    loaded.value.definition,
    loaded.value.graph,
  );
  return { loaded: loaded.value, execution };
}

describe("restoreExecution", () => {
  it("restaura uma cópia compatível e independente", () => {
    const { loaded, execution } = setup();
    const serialized = JSON.stringify(
      exportExecution(loaded.definition, execution),
    );
    const restored = restoreExecution(
      loaded.definition,
      JSON.parse(serialized),
    );

    expect(restored).toMatchObject({
      ok: true,
      value: { execution: { step: 0 } },
    });
    if (restored.ok) {
      restored.value.execution.values.educacao_publica = 70;
      expect(execution.values.educacao_publica).toBe(40);
    }
  });

  it("recusa pacote modificado e snapshot incompleto sem alterar a execução atual", () => {
    const { loaded, execution } = setup();
    const snapshot = exportExecution(loaded.definition, execution);
    const modified = structuredClone(snapshot) as unknown as {
      package: { contentIdentity: string };
    };
    modified.package.contentIdentity = "outro-conteudo";

    expect(restoreExecution(loaded.definition, modified)).toMatchObject({
      ok: false,
      diagnostics: [
        { code: "SNAPSHOT_INVALIDO", field: "package.contentIdentity" },
      ],
    });
    expect(
      restoreExecution(loaded.definition, { format: "sisgov-engine-snapshot" }),
    ).toMatchObject({ ok: false });
    expect(execution.values.educacao_publica).toBe(40);
  });
});
