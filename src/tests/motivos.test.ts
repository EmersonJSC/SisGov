import { describe, expect, it } from "vitest";
import {
  motivosDoPerfil,
  satisfacaoDosMotivos,
} from "../game/congresso/motivos";
import type { PerfilDoEleitor } from "../game/congresso/tipos";

const perfil = (extra: Partial<PerfilDoEleitor> = {}): PerfilDoEleitor => ({
  peso: 1,
  atributos: {},
  segmentos: ["grupo_a", "grupo_b"],
  ponto: { economia: 0, costumes: 0 } as PerfilDoEleitor["ponto"],
  ...extra,
});

describe("motivos da satisfação", () => {
  it("cada grupo puxa a satisfação para o valor dele, pesado pelo eixo", () => {
    const m = motivosDoPerfil(
      perfil(),
      { grupo_a: 3, grupo_b: 1 },
      { grupo_a: 80, grupo_b: 20 },
    );
    expect(m.map((x) => x.id)).toEqual(["grupo_a", "grupo_b"]);
    expect(m[0].pontos).toBeCloseTo((3 * 30) / 4);
    expect(m[1].pontos).toBeCloseTo((1 * -30) / 4);
    expect(satisfacaoDosMotivos(m)).toBeCloseTo(50 + 22.5 - 7.5);
  });

  it("o bolso é mais um motivo, e o total fica entre 0 e 100", () => {
    const m = motivosDoPerfil(
      perfil({ bolso: 10 }),
      {},
      { grupo_a: 100, grupo_b: 100 },
    );
    expect(m.some((x) => x.origem === "bolso" && x.pontos === 10)).toBe(true);
    expect(satisfacaoDosMotivos(m)).toBe(100);
  });

  it("sem grupo e sem bolso, a pessoa fica em 50", () => {
    expect(
      satisfacaoDosMotivos(motivosDoPerfil(perfil({ segmentos: [] }), {}, {})),
    ).toBe(50);
  });
});
