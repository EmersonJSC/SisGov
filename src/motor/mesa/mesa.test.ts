import { describe, expect, it } from "vitest";
import type { Tramitacao, Votacao } from "../politica";
import { montarMesa, traduzirCarimbos } from ".";

const espera: Tramitacao = {
  lei: "a",
  valor: 0.2,
  casa: "camara-volta",
  desde: 3,
  ofertas: [],
};
const votacao = (extra: Partial<Votacao>): Votacao => ({
  lei: "b",
  valor: 1,
  exorbitante: false,
  votos: {},
  sim: 1,
  nao: 0,
  aprovada: true,
  muda_lei: true,
  ...extra,
});

describe("mesa", () => {
  it("lei emendada vira papel de decisão com prazo de um turno", () => {
    const [p] = montarMesa(2, [espera], []);
    expect(p).toMatchObject({
      familia: "leis",
      tipo: "sancao",
      lei: "a",
      valor: 0.2,
      prazo: 4,
    });
  });

  it("lei aprovada, decreto e veto viram aviso; votação que não muda nada, não", () => {
    const mesa = montarMesa(
      5,
      [],
      [
        votacao({}),
        votacao({ origem: "decreto" }),
        votacao({ origem: "derrubada-do-veto" }),
        votacao({ origem: "derrubada-do-veto", muda_lei: false }),
        votacao({ aprovada: false, muda_lei: false }),
        votacao({ aprovada: true, muda_lei: false, casa: "camara" }),
      ],
    );
    expect(mesa.map((p) => p.motivo)).toEqual([
      "lei-aprovada",
      "decreto",
      "veto-derrubado",
      "veto-mantido",
    ]);
    expect(mesa.every((p) => p.tipo === "aviso" && p.prazo === null)).toBe(
      true,
    );
    expect(new Set(mesa.map((p) => p.id)).size).toBe(4);
  });

  it("carimbo vira assinar ou vetar da lei do papel", () => {
    const mesa = montarMesa(2, [espera], []);
    const id = mesa[0].id;
    expect(
      traduzirCarimbos(mesa, [
        { tipo: "carimbar", papel: id, carimbo: "assinar" },
      ]),
    ).toEqual([{ tipo: "assinar", lei: "a" }]);
    expect(
      traduzirCarimbos(mesa, [
        { tipo: "carimbar", papel: id, carimbo: "vetar", observacao: "caro" },
      ]),
    ).toEqual([{ tipo: "vetar", lei: "a", observacao: "caro" }]);
    expect(
      traduzirCarimbos(mesa, [{ tipo: "mudar_lei", lei: "x", valor: 1 }]),
    ).toEqual([{ tipo: "mudar_lei", lei: "x", valor: 1 }]);
  });

  it("papel que não existe ou que só avisa não aceita carimbo", () => {
    const mesa = montarMesa(2, [], [votacao({})]);
    expect(() =>
      traduzirCarimbos(mesa, [
        { tipo: "carimbar", papel: "x", carimbo: "assinar" },
      ]),
    ).toThrow(/não está na mesa/);
    expect(() =>
      traduzirCarimbos(mesa, [
        { tipo: "carimbar", papel: mesa[0].id, carimbo: "assinar" },
      ]),
    ).toThrow(/não pede carimbo/);
  });
});
