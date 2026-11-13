import { describe, expect, it } from "vitest";
import { interpretarRolagem } from "./gestos";

const evento = (
  extra: Partial<Parameters<typeof interpretarRolagem>[0]> = {},
) => ({ deltaX: 0, deltaY: 0, deltaMode: 0, ctrlKey: false, ...extra });

describe("roda e trackpad", () => {
  it("a pinça (ctrl) dá zoom e desce o expoente com o gesto", () => {
    const r = interpretarRolagem(evento({ ctrlKey: true, deltaY: -4 }));
    expect(r.tipo).toBe("zoom");
    expect(r.tipo === "zoom" && r.expoente).toBeLessThan(0);
  });

  it("um clique de roda de mouse dá zoom", () => {
    const r = interpretarRolagem(evento({ deltaY: 100 }));
    expect(r.tipo).toBe("zoom");
    expect(r.tipo === "zoom" && r.expoente).toBeCloseTo(0.16, 2);
  });

  it("a roda em linhas (Firefox) também dá zoom", () => {
    expect(interpretarRolagem(evento({ deltaMode: 1, deltaY: 3 })).tipo).toBe(
      "zoom",
    );
  });

  it("dois dedos no trackpad arrastam o mapa, nos dois eixos", () => {
    const r = interpretarRolagem(evento({ deltaX: 7.5, deltaY: -12.25 }));
    expect(r).toEqual({ tipo: "arrasto", dx: 7.5, dy: -12.25 });
  });

  it("rolagem vertical pequena de trackpad não vira zoom", () => {
    expect(interpretarRolagem(evento({ deltaY: 8 })).tipo).toBe("arrasto");
  });

  it("zoom para fora e para dentro são opostos", () => {
    const fora = interpretarRolagem(evento({ deltaY: 100 }));
    const dentro = interpretarRolagem(evento({ deltaY: -100 }));
    expect(
      fora.tipo === "zoom" && dentro.tipo === "zoom" && fora.expoente,
    ).toBe(dentro.tipo === "zoom" ? -dentro.expoente : NaN);
  });
});
