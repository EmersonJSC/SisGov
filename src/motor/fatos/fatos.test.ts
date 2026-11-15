import { describe, expect, it } from "vitest";
import {
  consultar,
  envelhecerFatos,
  forcaDoFato,
  motivoFatoInvalido,
  novoFato,
} from ".";

const aprovada = novoFato({
  tipo: "lei-aprovada",
  turno: 3,
  tamanho: "medio",
  sobre: "imposto-renda-medio",
  quem: ["p1", "p2"],
});
const saiu = novoFato({
  tipo: "partido-saiu-da-base",
  turno: 3,
  tamanho: "grande",
  quem: ["p2"],
});
const caiu = novoFato({ tipo: "lei-rejeitada", turno: 2, tamanho: "pequeno" });
const mesa = [aprovada, saiu, caiu];

describe("mesa de fatos", () => {
  it("fica 1, 2 ou 3 turnos conforme o tamanho e perde força", () => {
    expect(forcaDoFato(saiu)).toBe(1);
    const um = envelhecerFatos(mesa);
    expect(um.map((f) => f.tipo)).toEqual([
      "lei-aprovada",
      "partido-saiu-da-base",
    ]);
    expect(forcaDoFato(um[1])).toBeCloseTo(2 / 3);
    const dois = envelhecerFatos(um);
    expect(dois.map((f) => f.tipo)).toEqual(["partido-saiu-da-base"]);
    expect(envelhecerFatos(dois)).toEqual([]);
  });

  it("responde só o que o módulo pergunta", () => {
    expect(consultar(mesa, { quem: "p2" })).toEqual([aprovada, saiu]);
    expect(consultar(mesa, { sobre: "imposto-renda-medio" })).toEqual([
      aprovada,
    ]);
    expect(consultar(mesa, { tamanhoMinimo: "grande" })).toEqual([saiu]);
    expect(consultar(mesa, { tipo: ["lei-rejeitada"], turno: 2 })).toEqual([
      caiu,
    ]);
    expect(consultar(mesa)).toEqual(mesa);
  });

  it("recusa tipo desconhecido", () => {
    expect(motivoFatoInvalido(aprovada)).toBeNull();
    expect(motivoFatoInvalido({ ...aprovada, tipo: "boato" as never })).toMatch(
      /desconhecido/,
    );
  });
});
