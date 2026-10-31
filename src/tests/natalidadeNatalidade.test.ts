import { describe, expect, it } from "vitest";
import { criarPartida, encerrarTurno } from "../app/partida";
import { aplicarMeta } from "../app/partida/leis";

describe("fecundidade mexe na natalidade", () => {
  it("a política de natalidade intensa sobe a taxa de natalidade; no início ela é neutra", () => {
    const c = criarPartida({ semente: 7, ocorrencias: false, eleicao: false });
    if (!c.ok) throw new Error(c.erros.join(" "));
    const inicial = c.value.game.execution.values.taxa_natalidade;
    expect(inicial).toBeCloseTo(12, 0);
    const m = aplicarMeta(c.value, "politica-de-natalidade", 80);
    if (!m.ok) throw new Error(m.erros.join(" "));
    let p = m.value;
    for (let t = 0; t < 12; t++) {
      const r = encerrarTurno(p);
      if (!r.ok) throw new Error(r.erros.join(" "));
      p = r.value.partida;
    }
    const v = p.game.execution.values;
    expect(v.natalidade).toBeGreaterThan(24.06 + 0.5);
    expect(v.taxa_natalidade).toBeGreaterThan(inicial + 0.1);
  }, 120_000);
});
