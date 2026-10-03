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

function withHistory() {
  const { loaded, execution } = setup();
  return exportExecution(loaded.definition, {
    ...execution,
    step: 1,
    historyLimit: 1,
    history: [
      {
        step: 0,
        values: { ...execution.values },
        commands: { controlCommands: [], activeRelationIds: [] },
      },
    ],
  });
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

  it("recusa retratos históricos malformados sem lançar exceções", () => {
    const { loaded } = setup();
    const snapshot = withHistory();
    expect(restoreExecution(loaded.definition, snapshot)).toMatchObject({
      ok: true,
    });

    const malformedCommands = structuredClone(snapshot) as unknown as {
      execution: { history: Array<{ commands: unknown }> };
    };
    malformedCommands.execution.history[0].commands = null;
    expect(
      restoreExecution(loaded.definition, malformedCommands),
    ).toMatchObject({
      ok: false,
      diagnostics: expect.arrayContaining([
        expect.objectContaining({
          field: "execution.history[0].commands",
          code: "SNAPSHOT_INVALIDO",
        }),
      ]),
    });

    const malformedValues = structuredClone(snapshot) as unknown as {
      execution: { history: Array<{ values: Record<string, number> }> };
    };
    malformedValues.execution.history[0].values.educacao_publica =
      Number.POSITIVE_INFINITY;
    expect(restoreExecution(loaded.definition, malformedValues)).toMatchObject({
      ok: false,
      diagnostics: expect.arrayContaining([
        expect.objectContaining({
          field: "execution.history[0].values",
          code: "SNAPSHOT_INVALIDO",
        }),
      ]),
    });

    const malformedControl = structuredClone(snapshot) as unknown as {
      execution: {
        history: Array<{
          commands: {
            controlCommands: Array<{
              controlId: string;
              value: number;
              policyId: string;
            }>;
          };
        }>;
      };
    };
    malformedControl.execution.history[0].commands.controlCommands = [
      {
        controlId: "verba_educacao",
        policyId: "material-escolar",
        value: Number.NaN,
      },
    ];
    expect(restoreExecution(loaded.definition, malformedControl)).toMatchObject(
      {
        ok: false,
        diagnostics: expect.arrayContaining([
          expect.objectContaining({
            field: "execution.history[0].commands.controlCommands[0]",
            code: "SNAPSHOT_INVALIDO",
          }),
        ]),
      },
    );
  });

  it("recusa passos fora de sequência e relações históricas inexistentes", () => {
    const { loaded } = setup();
    const snapshot = withHistory();
    const malformed = structuredClone(snapshot) as unknown as {
      execution: {
        history: Array<{
          step: number;
          commands: { activeRelationIds: string[] };
        }>;
      };
    };
    malformed.execution.history[0].step = 2;
    malformed.execution.history[0].commands.activeRelationIds = [
      "relacao-inexistente",
    ];

    expect(restoreExecution(loaded.definition, malformed)).toMatchObject({
      ok: false,
      diagnostics: expect.arrayContaining([
        expect.objectContaining({
          field: "execution.history",
          code: "SNAPSHOT_INVALIDO",
        }),
        expect.objectContaining({
          field: "execution.history[0].commands.activeRelationIds[0]",
          code: "SNAPSHOT_INVALIDO",
        }),
      ]),
    });
  });
});
