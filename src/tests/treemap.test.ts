/**
 * Treemap do censo: as faixas como retângulos, a área de cada uma
 * proporcional à parte do país que ela tem.
 *
 * O teste existe porque é aqui que treemap dá errado calado: sobra um canto,
 * dois retângulos se montam um no outro, ou a área deixa de ser proporcional
 * e o desenho passa a mentir sem avisar.
 */
import { describe, expect, it } from "vitest";
import { retangulos } from "../ui/mapa/treemap";

const CAIXA = { x: 0, y: 0, largura: 100, altura: 60 };

function encostam(
  a: { x: number; y: number; largura: number; altura: number },
  b: { x: number; y: number; largura: number; altura: number },
): boolean {
  const folga = 1e-9;
  return (
    a.x < b.x + b.largura - folga &&
    b.x < a.x + a.largura - folga &&
    a.y < b.y + b.altura - folga &&
    b.y < a.y + a.altura - folga
  );
}

describe("treemap do censo", () => {
  it("a área de cada retângulo é a parte que ele representa", () => {
    const partes = [0.5, 0.25, 0.15, 0.1];
    const area = CAIXA.largura * CAIXA.altura;
    for (const [i, r] of retangulos(partes, CAIXA).entries())
      expect(r.largura * r.altura).toBeCloseTo(partes[i] * area, 6);
  });

  it("os retângulos cobrem a caixa inteira, sem sobra", () => {
    const soma = retangulos([0.4, 0.3, 0.2, 0.1], CAIXA).reduce(
      (t, r) => t + r.largura * r.altura,
      0,
    );
    expect(soma).toBeCloseTo(CAIXA.largura * CAIXA.altura, 6);
  });

  it("nenhum retângulo monta em cima de outro", () => {
    const rs = retangulos(
      [0.25, 0.2, 0.19, 0.16, 0.08, 0.05, 0.04, 0.02, 0.01],
      CAIXA,
    );
    const montados = rs.flatMap((a, i) =>
      rs.slice(i + 1).filter((b) => encostam(a, b)),
    );
    expect(montados).toEqual([]);
  });

  it("todo retângulo cabe dentro da caixa", () => {
    const fora = retangulos([0.6, 0.3, 0.1], CAIXA).filter(
      (r) =>
        r.x < -1e-9 ||
        r.y < -1e-9 ||
        r.x + r.largura > CAIXA.largura + 1e-9 ||
        r.y + r.altura > CAIXA.altura + 1e-9,
    );
    expect(fora).toEqual([]);
  });

  it("uma faixa só ocupa a caixa toda", () => {
    expect(retangulos([1], CAIXA)).toEqual([CAIXA]);
  });

  it("lista vazia não vira retângulo nenhum", () => {
    expect(retangulos([], CAIXA)).toEqual([]);
  });
});
