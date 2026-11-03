// R11.6: gente sobe e desce de estrato com a renda e a instrução.
import { describe, expect, it } from "vitest";
import { criarPartida, jogar } from ".";

const base = () => criarPartida("teste", 42, { semCongresso: true });
const gente = (p: ReturnType<typeof base>) =>
  Object.values(p.estado.pops).reduce((s, x) => s + x.pessoas, 0);

describe("mobilidade de estrato (R11.6)", () => {
  const p0 = base();
  const p12 = jogar(base(), 12);

  it("no turno 0 ninguém mudou de pop", () => {
    expect(p0.estado.migracao ?? {}).toEqual({});
  });

  it("depois de 12 turnos há gente que mudou, a população fecha e o PIB também", () => {
    const m = p12.estado.migracao ?? {};
    expect(Object.values(m).some((v) => Math.abs(v) > 1e-9)).toBe(true);
    expect(Object.values(m).reduce((s, v) => s + v, 0)).toBeCloseTo(0, 9);
    expect(gente(p12)).toBeCloseTo(p12.estado.essenciais.populacao, 3);
    const renda = Object.values(p12.estado.pops).reduce(
      (s, x) => s + x.pessoas * x.renda_bruta,
      0,
    );
    expect(renda).toBeCloseTo(p12.estado.essenciais.pib_nominal, -2);
  });

  it("nenhum pop perde nem ganha mais de 30% do que declarou", () => {
    for (const [id, v] of Object.entries(p12.estado.migracao ?? {}))
      expect(Math.abs(v)).toBeLessThanOrEqual(
        0.3 * p12.regras.pais.pops[id].parcela_pessoas + 1e-9,
      );
  });

  it("mesma partida e mesma semente dão o mesmo resultado", () => {
    expect(jogar(base(), 12).estado).toEqual(p12.estado);
  });
});
