import { describe, expect, it } from "vitest";
import {
  analyzePackage,
  buildGraph,
  resolvePackage,
  validatePackageCoherence,
} from "../engine";

function content(value: object): string {
  return JSON.stringify(value);
}

function validPackage(): Record<string, string> {
  return {
    "cenario.json": content({
      id: "pais-teste",
      tipo: "cenario",
      versaoEsquema: 1,
      nome: "País de teste",
      estadoInicial: "estado-inicial.json",
      variaveis: "variaveis.json",
      politicas: ["politicas/material-escolar.json"],
      consequencias: ["consequencias/melhora-educacao.json"],
    }),
    "estado-inicial.json": content({
      id: "estado-inicial",
      tipo: "estado-inicial",
      versaoEsquema: 1,
      valores: { verba_educacao: 0, educacao_publica: 40 },
    }),
    "variaveis.json": content({
      id: "variaveis-principais",
      tipo: "variaveis",
      versaoEsquema: 1,
      variaveis: [
        {
          id: "verba_educacao",
          tipo: "controle",
          nome: "Verba",
          unidade: "moeda_por_passo",
          dominio: { minimo: 0 },
          valorInicial: 0,
        },
        {
          id: "educacao_publica",
          tipo: "calculado",
          nome: "Educação",
          unidade: "indice_0_100",
          dominio: { minimo: 0, maximo: 100 },
          valorInicial: 40,
        },
      ],
    }),
    "politicas/material-escolar.json": content({
      id: "material-escolar",
      tipo: "lei",
      versaoEsquema: 2,
      grupo: "orcamentaria",
      nome: "Material escolar",
      descricao: "Exemplo artificial.",
      processoAutorizacao: "decisao-executiva",
      controle: {
        variavel: "verba_educacao",
        unidade: "moeda_por_passo",
      },
      orcamento: { modo: "valor_fixo" },
      consequencias: ["melhora-educacao"],
    }),
    "consequencias/melhora-educacao.json": content({
      id: "melhora-educacao",
      tipo: "consequencia",
      versaoEsquema: 1,
      origem: "verba_educacao",
      alvo: "educacao_publica",
      mecanismo: "afim",
      parametros: { coeficiente: 0.02, termoConstante: 0 },
      unidade: "indice_0_100",
      atrasoPassos: 1,
      duracao: { modo: "continuo" },
    }),
  };
}

describe("resolvePackage", () => {
  it("conecta o manifesto a arquivos que existem e têm referências válidas", () => {
    const result = resolvePackage("cenario.json", validPackage());

    expect(result).toMatchObject({
      ok: true,
      value: {
        manifest: { id: "pais-teste" },
        policies: [{ id: "material-escolar" }],
        consequences: [{ id: "melhora-educacao" }],
      },
    });
  });

  it("recusa um arquivo declarado que não existe", () => {
    const files = validPackage();
    delete files["consequencias/melhora-educacao.json"];

    const result = resolvePackage("cenario.json", files);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.diagnostics).toContainEqual(
        expect.objectContaining({
          code: "ARQUIVO_AUSENTE",
          file: "consequencias/melhora-educacao.json",
        }),
      );
    }
  });

  it("recusa uma referência para consequência inexistente", () => {
    const files = validPackage();
    files["politicas/material-escolar.json"] = files[
      "politicas/material-escolar.json"
    ].replace("melhora-educacao", "educacao-inexistente");

    expect(resolvePackage("cenario.json", files)).toMatchObject({
      ok: false,
      diagnostics: [
        {
          code: "REFERENCIA_QUEBRADA",
          file: "material-escolar",
          field: "consequencias",
        },
      ],
    });
  });

  it("recusa IDs repetidos, sem deixar um arquivo sobrescrever o outro", () => {
    const files = validPackage();
    files["consequencias/melhora-educacao.json"] = files[
      "consequencias/melhora-educacao.json"
    ].replace("melhora-educacao", "material-escolar");

    const result = resolvePackage("cenario.json", files);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.diagnostics).toContainEqual(
        expect.objectContaining({
          code: "ID_DUPLICADO",
          field: "id.material-escolar",
        }),
      );
    }
  });
});

describe("validatePackageCoherence", () => {
  it("aceita um pacote cujas unidades, domínios e controles são coerentes", () => {
    const resolved = resolvePackage("cenario.json", validPackage());
    expect(resolved.ok).toBe(true);
    if (resolved.ok)
      expect(validatePackageCoherence(resolved.value)).toMatchObject({
        ok: true,
      });
  });

  it("recusa contribuição destinada a um controle", () => {
    const files = validPackage();
    files["consequencias/melhora-educacao.json"] = files[
      "consequencias/melhora-educacao.json"
    ].replace("educacao_publica", "verba_educacao");
    const resolved = resolvePackage("cenario.json", files);

    expect(resolved.ok).toBe(true);
    if (resolved.ok) {
      const result = validatePackageCoherence(resolved.value);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.diagnostics).toContainEqual(
          expect.objectContaining({
            field: "alvo",
            code: "COERENCIA_INVALIDA",
          }),
        );
      }
    }
  });

  it("recusa valor inicial fora do domínio", () => {
    const files = validPackage();
    files["estado-inicial.json"] = files["estado-inicial.json"].replace(
      '"educacao_publica":40',
      '"educacao_publica":140',
    );
    const resolved = resolvePackage("cenario.json", files);

    expect(resolved.ok).toBe(true);
    if (resolved.ok) {
      const result = validatePackageCoherence(resolved.value);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.diagnostics).toContainEqual(
          expect.objectContaining({
            field: "valores.educacao_publica",
            code: "COERENCIA_INVALIDA",
          }),
        );
      }
    }
  });

  it("recusa política que referencia uma variável de controle inexistente", () => {
    const files = validPackage();
    files["politicas/material-escolar.json"] = files[
      "politicas/material-escolar.json"
    ].replace("verba_educacao", "controle_inexistente");
    const resolved = resolvePackage("cenario.json", files);

    expect(resolved.ok).toBe(true);
    if (resolved.ok) {
      const result = validatePackageCoherence(resolved.value);
      expect(result).toMatchObject({
        ok: false,
        diagnostics: [
          {
            code: "COERENCIA_INVALIDA",
            file: "material-escolar",
            field: "controle.variavel",
          },
        ],
      });
    }
  });
});

describe("validatePackageCoherence — regras de nível (SG102)", () => {
  it("recusa variável de controle sem mínimo de domínio", () => {
    const files = validPackage();
    files["variaveis.json"] = files["variaveis.json"].replace(
      '"dominio":{"minimo":0},"valorInicial":0',
      '"dominio":{},"valorInicial":0',
    );
    const resolved = resolvePackage("cenario.json", files);
    expect(resolved.ok).toBe(true);
    if (resolved.ok)
      expect(validatePackageCoherence(resolved.value)).toMatchObject({
        ok: false,
        diagnostics: [
          {
            code: "COERENCIA_INVALIDA",
            file: "variaveis-principais",
            field: "variaveis.verba_educacao.dominio.minimo",
          },
        ],
      });
  });

  it("recusa opção de política fora do domínio do controle", () => {
    const files = validPackage();
    files["politicas/material-escolar.json"] = files[
      "politicas/material-escolar.json"
    ]
      .replace('"grupo":"orcamentaria"', '"grupo":"regulatoria"')
      .replace(',"orcamento":{"modo":"valor_fixo"}', "")
      .replace(
        '"unidade":"moeda_por_passo"}',
        '"unidade":"moeda_por_passo","opcoes":[{"id":"a","rotulo":"A","valor":-1},{"id":"b","rotulo":"B","valor":0},{"id":"c","rotulo":"C","valor":1}]}',
      );
    const resolved = resolvePackage("cenario.json", files);
    expect(resolved.ok).toBe(true);
    if (resolved.ok)
      expect(validatePackageCoherence(resolved.value)).toMatchObject({
        ok: false,
        diagnostics: [
          {
            file: "material-escolar",
            field: "controle.opcoes[0].valor",
          },
        ],
      });
  });
});

describe("validatePackageCoherence — moeda fiscal (SG103/SG135)", () => {
  it("recusa lei de valor fixo fora da moeda anual da ficha do país", () => {
    const files = validPackage();
    files["estado-inicial.json"] = files["estado-inicial.json"].replace(
      '"valores":',
      '"fiscal":{"periodoInicial":"2026-01","referenciaPrecos":"2024","unidadeMonetaria":"creditos","origem":{"tipo":"hipotese","descricao":"Teste."},"caixa":0,"dividaTotal":0,"jurosHerdadosMensais":0,"taxaJurosDividaNovaMensal":0},"valores":',
    );
    const resolved = resolvePackage("cenario.json", files);
    expect(resolved.ok).toBe(true);
    if (resolved.ok)
      expect(validatePackageCoherence(resolved.value)).toMatchObject({
        ok: false,
        diagnostics: [{ file: "material-escolar", field: "controle.unidade" }],
      });
  });
});

describe("leis v2 (SG135)", () => {
  function policyWith(change: (law: Record<string, unknown>) => void) {
    const files = validPackage();
    const law = JSON.parse(files["politicas/material-escolar.json"]);
    change(law);
    files["politicas/material-escolar.json"] = JSON.stringify(law);
    return resolvePackage("cenario.json", files);
  }

  it("recusa quantidade escrita na lei", () => {
    const result = policyWith((law) => {
      law.impactoFiscal = { natureza: "despesa" };
    });
    expect(result).toMatchObject({ ok: false });
    if (!result.ok)
      expect(result.diagnostics).toContainEqual(
        expect.objectContaining({
          file: "politicas/material-escolar.json",
          field: "impactoFiscal",
        }),
      );
  });

  it("recusa regulatória com só duas opções (não existe sim ou não)", () => {
    const result = policyWith((law) => {
      law.grupo = "regulatoria";
      delete law.orcamento;
      (law.controle as Record<string, unknown>).opcoes = [
        { id: "nao", rotulo: "Não", valor: 0 },
        { id: "sim", rotulo: "Sim", valor: 1 },
      ];
    });
    expect(result).toMatchObject({ ok: false });
    if (!result.ok)
      expect(result.diagnostics).toContainEqual(
        expect.objectContaining({ field: "controle.opcoes" }),
      );
  });

  it("recusa lei sem grupo e lei no esquema antigo", () => {
    const withoutGroup = policyWith((law) => {
      delete law.grupo;
    });
    const oldSchema = policyWith((law) => {
      law.tipo = "programa";
      law.versaoEsquema = 1;
    });
    expect(withoutGroup).toMatchObject({
      ok: false,
      diagnostics: expect.arrayContaining([
        expect.objectContaining({ field: "grupo" }),
      ]),
    });
    expect(oldSchema).toMatchObject({
      ok: false,
      diagnostics: expect.arrayContaining([
        expect.objectContaining({ field: "tipo" }),
        expect.objectContaining({ field: "versaoEsquema" }),
      ]),
    });
  });

  it("exige o bloco certo para cada grupo", () => {
    const tax = policyWith((law) => {
      law.grupo = "tributaria";
    });
    expect(tax).toMatchObject({ ok: false });
    if (!tax.ok)
      expect(tax.diagnostics.map((item) => item.field)).toEqual(
        expect.arrayContaining(["orcamento", "tributo"]),
      );
    const validTax = policyWith((law) => {
      law.grupo = "tributaria";
      delete law.orcamento;
      law.tributo = {
        base: "verba_educacao",
        limites: { minimo: 0, maximo: 40 },
      };
    });
    expect(validTax).toMatchObject({ ok: true });
  });

  it("aceita lei percentual do orçamento com limites em %", () => {
    const result = policyWith((law) => {
      law.orcamento = {
        modo: "percentual_orcamento",
        base: "receita_total",
        limites: { minimo: 15, maximo: 30 },
      };
    });
    expect(result).toMatchObject({ ok: true });
  });
});

describe("buildGraph", () => {
  it("preserva duas utilizações da mesma consequência como relações distintas", () => {
    const files = validPackage();
    files["politicas/material-escolar.json"] = files[
      "politicas/material-escolar.json"
    ].replace(
      '["melhora-educacao"]',
      '["melhora-educacao","melhora-educacao"]',
    );
    const resolved = resolvePackage("cenario.json", files);

    expect(resolved.ok).toBe(true);
    if (resolved.ok) {
      const graph = buildGraph(resolved.value);
      expect(graph.relations).toMatchObject([
        {
          id: "material-escolar:0:melhora-educacao",
          originId: "verba_educacao",
          targetId: "educacao_publica",
        },
        {
          id: "material-escolar:1:melhora-educacao",
          originId: "verba_educacao",
          targetId: "educacao_publica",
        },
      ]);
    }
  });

  it("preserva uma autorrelação", () => {
    const files = validPackage();
    files["consequencias/melhora-educacao.json"] = files[
      "consequencias/melhora-educacao.json"
    ].replace("verba_educacao", "educacao_publica");
    const resolved = resolvePackage("cenario.json", files);

    expect(resolved.ok).toBe(true);
    if (resolved.ok) {
      const graph = buildGraph(resolved.value);
      const relation = graph.relations[0];
      expect(relation.originId).toBe(relation.targetId);
      expect(analyzePackage(resolved.value, graph).cycles).toEqual([
        ["educacao_publica"],
      ]);
    }
  });

  it("avisa sobre arquivo distribuído que não pertence ao manifesto", () => {
    const resolved = resolvePackage("cenario.json", validPackage());

    expect(resolved.ok).toBe(true);
    if (resolved.ok) {
      expect(
        analyzePackage(resolved.value, buildGraph(resolved.value), [
          ...Object.values(resolved.value.pathsById),
          "politicas/nao-listada.json",
        ]).orphanFiles,
      ).toEqual(["politicas/nao-listada.json"]);
    }
  });
});
