// Colisão: duas leis que não valem juntas; o jogador escolhe uma ou outra.
import { describe, expect, it } from "vitest";
import { avancar, criarPartida, leiTravada } from ".";

const base = () => criarPartida("teste", 42, { semCongresso: true });
const teto = {
  tipo: "mudar_lei",
  lei: "teto-aluguel",
  valor: "so-inflacao",
} as const;
const despejo = {
  tipo: "mudar_lei",
  lei: "despejo-rapido",
  valor: "um-mes",
} as const;

describe("colisão", () => {
  it("com teto de aluguel em vigor, despejo rápido é recusado", () => {
    const comTeto = avancar(base(), [teto]);
    expect(() => avancar(comTeto, [despejo])).toThrow(/colide/);
  });

  it("os dois no mesmo turno também são recusados", () => {
    expect(() => avancar(base(), [teto, despejo])).toThrow(/colide/);
  });

  it("revogou o teto: o despejo entra no turno seguinte, não no mesmo", () => {
    const comTeto = avancar(base(), [teto]);
    const voltou = { ...teto, valor: "sem-teto" } as const;
    expect(() => avancar(comTeto, [voltou, despejo])).toThrow(/colide/);
    const p = avancar(avancar(comTeto, [voltou]), [despejo]);
    expect(p.estado.leis["despejo-rapido"]).toBe("um-mes");
  });

  it("vale igual nos dois sentidos, em vigor ou na fila", () => {
    const comDespejo = avancar(base(), [despejo]);
    expect(leiTravada(comDespejo, "teto-aluguel", [])).toBe(true);
    expect(leiTravada(base(), "teto-aluguel", [despejo])).toBe(true);
    expect(leiTravada(base(), "despejo-rapido", [teto])).toBe(true);
    expect(leiTravada(base(), "teto-aluguel", [])).toBe(false);
    expect(leiTravada(comDespejo, "remocao-area-risco", [])).toBe(false);
  });
});
