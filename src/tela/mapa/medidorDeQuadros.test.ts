import { describe, expect, it } from "vitest";
import { criarMedidor } from "./medidorDeQuadros";

describe("medidor de quadros", () => {
  it("dá 60 fps para quadros de 16,67 ms e acha o pior quadro", () => {
    const m = criarMedidor();
    [0, 1000 / 60, 2000 / 60, 3000 / 60 + 30].forEach((t, i) =>
      m.quadro(t + (i > 0 ? 1 : 0)),
    );
    const r = m.ler();
    expect(r.fps).toBeGreaterThan(30);
    expect(r.piorQuadroMs).toBeGreaterThan(40);
  });

  it("tira a média do custo do fundo e recomeça a janela", () => {
    const m = criarMedidor();
    m.fundo(2);
    m.fundo(4);
    expect(m.ler().fundoMs).toBe(3);
    expect(m.ler()).toEqual({ fps: 0, piorQuadroMs: 0, fundoMs: 0 });
  });
});
