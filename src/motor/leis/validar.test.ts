import { describe, expect, it } from "vitest";
import { validarLei } from "./validar";

const indices = ["padrao_vida", "seguranca"];
const valida = {
  versao: 1,
  id: "teste",
  camada: "jogabilidade",
  forma: "continua",
  unidade: "fracao",
  faixa: { min: 0, max: 0.5 },
  passo: 0.01,
  calculo: { base: "renda", modelo: "laffer" },
  efeitos: [
    { indice: "padrao_vida", sentido: -1, forca: "fraca", atraso_turnos: 1 },
  ],
};
const campos = (dado: unknown) =>
  validarLei(dado, "leis/teste.json", indices).map((e) => e.campo);

describe("validarLei", () => {
  it("aceita lei válida", () => {
    expect(validarLei(valida, "leis/teste.json", indices)).toEqual([]);
  });

  it('lei de gasto: conta só aceita "gasto" e não tem cálculo', () => {
    const { calculo: _, ...gasto } = valida;
    expect(campos({ ...gasto, conta: "gasto" })).toEqual([]);
    expect(campos({ ...gasto, conta: "lucro" })).toEqual(["conta"]);
    expect(campos({ ...valida, conta: "gasto" })).toEqual(["conta"]);
  });

  it("diz arquivo, campo e motivo", () => {
    const [erro] = validarLei(
      { ...valida, passo: 0 },
      "leis/teste.json",
      indices,
    );
    expect(erro).toEqual({
      arquivo: "leis/teste.json",
      campo: "passo",
      motivo: "precisa ser > 0",
    });
  });

  it("barra índice inexistente, índice essencial e base desconhecida", () => {
    expect(
      campos({
        ...valida,
        calculo: { base: "petroleo", modelo: "laffer" },
        efeitos: [
          {
            indice: "felicidade",
            sentido: 1,
            forca: "fraca",
            atraso_turnos: 0,
          },
          {
            indice: "arrecadacao",
            sentido: 1,
            forca: "fraca",
            atraso_turnos: 0,
          },
        ],
      }),
    ).toEqual(["calculo.base", "efeitos[0].indice", "efeitos[1].indice"]);
  });

  it("barra faixa invertida, força numérica e id diferente do arquivo", () => {
    expect(
      campos({
        ...valida,
        id: "outra",
        faixa: { min: 0.5, max: 0.2 },
        efeitos: [
          { indice: "seguranca", sentido: 1, forca: 3, atraso_turnos: 0 },
        ],
      }),
    ).toEqual(["id", "faixa", "efeitos[0].forca"]);
  });

  it("lei de opções precisa de duas opções sem id repetido", () => {
    const base = {
      versao: 1,
      id: "teste",
      camada: "jogabilidade",
      forma: "opcoes",
    };
    expect(campos({ ...base, opcoes: [{ id: "a", efeitos: [] }] })).toEqual([
      "opcoes",
    ]);
    expect(
      campos({
        ...base,
        opcoes: [
          { id: "a", efeitos: [] },
          { id: "a", efeitos: [] },
        ],
      }),
    ).toEqual(["opcoes[1].id"]);
  });
});
