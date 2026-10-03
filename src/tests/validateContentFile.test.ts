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
});
