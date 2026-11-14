// A lei age pela instituição (plano das leis, 6.4): o efeito vezes o
// rendimento do órgão onde ela mora, com teto em 1.
import { describe, expect, it } from "vitest";
import { somaPorIndice, type EfeitoEmCurso } from "../efeitos";
import type { Lei } from "../leis";
import { rendimentoDasLeis } from "./orgaos";

const verba: Lei = {
  versao: 1,
  id: "verba-da-saude",
  camada: "jogabilidade",
  esfera: "saude",
  canal: "verba",
  forma: "continua",
  unidade: "fracao",
  faixa: { min: 0, max: 0.1 },
  passo: 0.001,
  conta: "gasto",
  efeitos: [],
};
const regra = (id: string, esfera: string): Lei => ({
  versao: 1,
  id,
  camada: "jogabilidade",
  esfera,
  canal: "direito",
  forma: "opcoes",
  opcoes: [
    { id: "nao", efeitos: [] },
    { id: "sim", efeitos: [] },
  ],
});
const leis: Record<string, Lei> = {
  [verba.id]: verba,
  vacina: regra("vacina", "saude"),
  bandeira: regra("bandeira", "regras-dos-poderes"),
};
/** Órgão da saúde que no começo pedia 4% do PIB, com as duas leis dele ativas. */
const orgaos = { saude: { necessidade: 4, leisBase: 2, corrupcao: 0 } };
const comVerba = (fracao: number) =>
  rendimentoDasLeis(orgaos, leis, {
    [verba.id]: fracao,
    vacina: "sim",
    bandeira: "sim",
  });

describe("lei pela instituição", () => {
  it("metade da verba que o órgão pede: as leis dele rendem metade", () => {
    expect(comVerba(0.02)("vacina")).toBeCloseTo(0.5);
  });

  it("verba de sobra não passa de inteira (vira corrupção, não efeito)", () => {
    expect(comVerba(0.08)("vacina")).toBe(1);
  });

  it("lei sem órgão rende inteira", () => {
    expect(comVerba(0.02)("bandeira")).toBe(1);
  });

  it("a soma dos índices pesa cada lei pelo rendimento", () => {
    const fila: EfeitoEmCurso[] = [
      { lei: "vacina", indice: "saude", de: 10, para: 10, atraso: 0, idade: 0 },
      {
        lei: "bandeira",
        indice: "saude",
        de: 4,
        para: 4,
        atraso: 0,
        idade: 0,
      },
    ];
    expect(somaPorIndice(fila, comVerba(0.02)).saude).toBeCloseTo(9);
    expect(somaPorIndice(fila).saude).toBe(14);
  });
});
