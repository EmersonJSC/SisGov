import { describe, expect, it } from "vitest";
import type { VisaoCasa } from "../../partida";
import { assentosDaCasa } from "./assentos";

const casa = (...cadeiras: number[]): VisaoCasa => ({
  total: cadeiras.reduce((a, b) => a + b, 0),
  partidos: cadeiras.map((n, i) => ({
    id: `p${i}`,
    nome: `Partido ${i}`,
    cor: `#00${i}000`,
    cadeiras: n,
    governo: i === 0,
  })),
});

describe("cadeiras do Congresso", () => {
  const camara = casa(92, 80, 60, 50, 40, 40, 30, 30, 20, 20, 15, 10, 8, 8);
  const cadeiras = assentosDaCasa(camara, "cima", 470, 560);

  it("uma bolinha por cadeira", () => {
    expect(cadeiras).toHaveLength(camara.total);
  });

  it("a Câmara fica na metade de cima e o Senado na de baixo", () => {
    expect(cadeiras.every((a) => a.y < 0)).toBe(true);
    const senado = assentosDaCasa(casa(30, 25, 26), "baixo", 470, 560);
    expect(senado.every((a) => a.y > 0)).toBe(true);
  });

  it("nenhuma cadeira cai em cima de outra", () => {
    const encostadas = cadeiras.flatMap((a, i) =>
      cadeiras
        .slice(i + 1)
        .filter(
          (b) => Math.hypot(a.x - b.x, a.y - b.y) < a.raio + b.raio - 0.001,
        ),
    );
    expect(encostadas).toHaveLength(0);
  });

  it("cada partido leva o número das suas cadeiras", () => {
    const doGoverno = cadeiras.filter((a) => a.governo).length;
    expect(doGoverno).toBe(92);
  });

  it("dá sempre o mesmo resultado", () => {
    expect(assentosDaCasa(camara, "cima", 470, 560)).toEqual(cadeiras);
  });

  it("casa sem cadeira não dá bolinha", () => {
    expect(assentosDaCasa(casa(), "baixo", 470, 560)).toEqual([]);
  });
});
