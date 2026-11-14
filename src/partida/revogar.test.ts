// Revogar (plano das leis, 6.6): o pedido leva a lei ao valor desligado e,
// aprovado, ela volta a "não legislada"; lei essencial não se revoga.
import { describe, expect, it } from "vitest";
import { valorDesligado } from "../motor";
import { avancar, criarPartida, montarVisao } from ".";

const SEMENTE = 5;
const semCongresso = () =>
  criarPartida("brasil-2026", SEMENTE, { semCongresso: true });

describe("revogar", () => {
  it("aprovada, a lei sai do país e fica entre as não promulgadas", () => {
    const p = semCongresso();
    expect(p.estado.leis.agrotoxicos).toBeDefined();
    const lei = p.regras.leis.agrotoxicos;
    const depois = avancar(p, [
      {
        tipo: "mudar_lei",
        lei: "agrotoxicos",
        valor: valorDesligado(lei),
        revogar: true,
      },
    ]);
    expect(depois.estado.leis.agrotoxicos).toBeUndefined();
    expect(depois.estado.revogacoes).toBeUndefined();
    const naVisao = montarVisao(depois).leis.find(
      (l) => l.id === "agrotoxicos",
    );
    expect(naVisao?.naoLegislada).toBe(true);
    // os efeitos da lei voltam a zero
    expect(
      depois.estado.efeitos
        .filter((e) => e.lei === "agrotoxicos")
        .every((e) => e.para === 0),
    ).toBe(true);
  });

  it("mudar para o valor desligado sem revogar deixa a lei no país", () => {
    const p = semCongresso();
    const lei = p.regras.leis.agrotoxicos;
    const depois = avancar(p, [
      { tipo: "mudar_lei", lei: "agrotoxicos", valor: valorDesligado(lei) },
    ]);
    expect(depois.estado.leis.agrotoxicos).toBe(valorDesligado(lei));
  });

  it("lei essencial não se revoga", () => {
    const p = semCongresso();
    const lei = p.regras.leis["duracao-mandato"];
    expect(() =>
      avancar(p, [
        {
          tipo: "mudar_lei",
          lei: lei.id,
          valor: valorDesligado(lei),
          revogar: true,
        },
      ]),
    ).toThrow(/essencial/);
  });
});
