import { describe, expect, it } from "vitest";
import {
  listDistributedScenarios,
  loadDistributedScenario,
  loadScenarioPackage,
} from "../scenarios/loadScenarioPackage";

describe("loadDistributedScenario", () => {
  it("descobre todos os manifestos válidos sem cadastro na interface", () => {
    expect(listDistributedScenarios()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "exemplo/cenario.json" }),
        expect.objectContaining({ path: "inclusao/cenario.json" }),
      ]),
    );
  });

  it("valida todo manifesto distribuído", () => {
    const manifests = import.meta.glob<string>("../scenarios/*/cenario.json", {
      eager: true,
      query: "?raw",
      import: "default",
    });
    for (const path of Object.keys(manifests)) {
      const manifestPath = path.replace("../scenarios/", "");
      expect(loadDistributedScenario(manifestPath), manifestPath).toMatchObject(
        { ok: true },
      );
    }
  });

  it("carrega o pacote JSON distribuído sem cadastro manual de arquivos", () => {
    expect(loadDistributedScenario("exemplo/cenario.json")).toMatchObject({
      ok: true,
      value: {
        definition: { manifest: { id: "pais-exemplo" } },
        graph: {
          relations: [
            {
              sourceId: "material-escolar",
              originId: "verba_educacao",
              targetId: "educacao_publica",
            },
          ],
        },
      },
    });
  });

  it("carrega outro país artificial pelo mesmo fluxo", () => {
    expect(loadDistributedScenario("alternativo/cenario.json")).toMatchObject({
      ok: true,
      value: {
        definition: { manifest: { id: "pais-alternativo" } },
        graph: {
          relations: [
            {
              sourceId: "bolsa-estudo",
              originId: "bolsa_estudo",
              targetId: "acesso_educacao",
            },
          ],
        },
      },
    });
  });

  it("identifica ciclo e componente isolado no laboratório de extremos", () => {
    expect(loadDistributedScenario("extremos/cenario.json")).toMatchObject({
      ok: true,
      value: {
        definition: {
          manifest: { id: "laboratorio-extremos" },
          events: [{ id: "choque-externo" }],
        },
        analysis: {
          cycles: [["indice_a", "indice_b"]],
          disconnectedComponents: expect.arrayContaining([["no_isolado"]]),
        },
      },
    });
  });

  it("carrega a lei e o evento adicionados somente por JSON", () => {
    expect(loadDistributedScenario("inclusao/cenario.json")).toMatchObject({
      ok: true,
      value: {
        definition: {
          policies: [{ id: "lei-de-bibliotecas", tipo: "lei" }],
          events: [{ id: "seca-regional", tipo: "evento" }],
        },
        graph: {
          relations: expect.arrayContaining([
            expect.objectContaining({ sourceId: "lei-de-bibliotecas" }),
            expect.objectContaining({ sourceId: "seca-regional" }),
          ]),
        },
      },
    });
  });

  it("não muda a definição quando os arquivos chegam em outra ordem", () => {
    const imported = import.meta.glob<string>(
      "../scenarios/exemplo/**/*.json",
      {
        eager: true,
        query: "?raw",
        import: "default",
      },
    );
    const files = Object.fromEntries(
      Object.entries(imported).map(([path, text]) => [
        path.replace("../scenarios/", ""),
        text,
      ]),
    );
    const reordered = Object.fromEntries(Object.entries(files).reverse());

    expect(loadScenarioPackage("exemplo/cenario.json", files)).toEqual(
      loadScenarioPackage("exemplo/cenario.json", reordered),
    );
  });

  it("devolve falha sem alterar uma definição já carregada", () => {
    const current = loadDistributedScenario("exemplo/cenario.json");
    const invalid = loadScenarioPackage("ausente/cenario.json", {});

    expect(current.ok).toBe(true);
    expect(invalid).toMatchObject({
      ok: false,
      diagnostics: [{ code: "ARQUIVO_AUSENTE" }],
    });
  });
});
