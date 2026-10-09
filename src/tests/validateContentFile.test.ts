import { describe, expect, it } from "vitest";
import { validateContentFile } from "../engine";

const consequence = JSON.stringify({
  id: "melhora_educacao",
  tipo: "consequencia",
  versaoEsquema: 1,
  origem: "verba_educacao",
  alvo: "educacao_publica",
  mecanismo: "afim",
  parametros: { coeficiente: 0.02, termoConstante: 0 },
  unidade: "indice",
  atrasoPassos: 1,
  duracao: { modo: "continuo" },
});

describe("validateContentFile", () => {
  it("aceita uma consequência com mecanismo implementado", () => {
    expect(
      validateContentFile("consequencias/melhora-educacao.json", consequence),
    ).toMatchObject({
      ok: true,
      value: { tipo: "consequencia", mecanismo: "afim" },
    });
  });

  it("informa arquivo e campo quando o JSON está inválido", () => {
    expect(validateContentFile("politicas/invalida.json", '{"tipo":')).toEqual({
      ok: false,
      diagnostics: [
        {
          code: "JSON_INVALIDO",
          file: "politicas/invalida.json",
          field: "$",
          message: "O arquivo não contém JSON válido.",
        },
      ],
    });
  });

  it("recusa campo que não pertence ao formato", () => {
    const result = validateContentFile(
      "consequencias/melhora-educacao.json",
      consequence.replace(
        '"atrasoPassos":1',
        '"atrasoPassos":1,"formula":"x + 1"',
      ),
    );

    expect(result).toMatchObject({
      ok: false,
      diagnostics: [
        {
          code: "CAMPO_DESCONHECIDO",
          file: "consequencias/melhora-educacao.json",
          field: "formula",
        },
      ],
    });
  });

  it("recusa mecanismo que o motor ainda não implementou", () => {
    const result = validateContentFile(
      "consequencias/melhora-educacao.json",
      consequence.replace('"afim"', '"produto"'),
    );

    expect(result).toMatchObject({
      ok: false,
      diagnostics: [
        {
          code: "MECANISMO_NAO_SUPORTADO",
          file: "consequencias/melhora-educacao.json",
          field: "mecanismo",
        },
      ],
    });
  });

  it("valida ficha fiscal declarada pelo país e identifica a origem dos dados", () => {
    const result = validateContentFile(
      "estado-inicial.json",
      JSON.stringify({
        id: "estado",
        tipo: "estado-inicial",
        versaoEsquema: 1,
        valores: {},
        fiscal: {
          periodoInicial: "2026-01",
          referenciaPrecos: "preços constantes de 2026-01",
          unidadeMonetaria: "créditos",
          origem: { tipo: "hipotese", descricao: "Exemplo de teste." },
          caixa: 0,
          dividaTotal: 100,
          jurosHerdadosMensais: 5,
          taxaJurosDividaNovaMensal: 0.01,
        },
      }),
    );
    expect(result).toMatchObject({
      ok: true,
      value: { fiscal: { origem: { tipo: "hipotese" } } },
    });
  });

  it("recusa taxa fiscal negativa com o campo preciso", () => {
    const result = validateContentFile(
      "estado-inicial.json",
      JSON.stringify({
        id: "estado",
        tipo: "estado-inicial",
        versaoEsquema: 1,
        valores: {},
        fiscal: {
          periodoInicial: "2026-01",
          referenciaPrecos: "preços constantes",
          unidadeMonetaria: "créditos",
          origem: { tipo: "hipotese", descricao: "Teste." },
          caixa: 0,
          dividaTotal: 100,
          jurosHerdadosMensais: 5,
          taxaJurosDividaNovaMensal: -0.01,
        },
      }),
    );
    expect(result).toMatchObject({
      ok: false,
      diagnostics: [{ field: "fiscal.taxaJurosDividaNovaMensal" }],
    });
  });

  it("valida o fechamento da carteira de crédito agregado", () => {
    const result = validateContentFile(
      "estado-inicial.json",
      JSON.stringify({
        id: "estado",
        tipo: "estado-inicial",
        versaoEsquema: 1,
        valores: {},
        fiscal: {
          periodoInicial: "2026-01",
          referenciaPrecos: "teste",
          unidadeMonetaria: "creditos",
          origem: { tipo: "hipotese", descricao: "Teste." },
          caixa: 0,
          dividaTotal: 100,
          jurosHerdadosMensais: 5,
          taxaJurosDividaNovaMensal: 0.01,
          credito: {
            principalPendente: 100,
            principalPerformante: 90,
            principalInadimplente: 5,
            capitalAgregado: 50,
            receitaJurosMensal: 2,
          },
        },
      }),
    );
    expect(result).toMatchObject({
      ok: false,
      diagnostics: [{ field: "fiscal.credito" }],
    });
  });
});
