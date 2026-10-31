import { describe, expect, it } from "vitest";
import { criarPartida, encerrarTurno } from "../app/partida";
import { aplicarMeta } from "../app/partida/leis";

describe("saúde mexe na mortalidade", () => {
  it("mais verba de saúde baixa a taxa de mortalidade e acelera a população", () => {
    const c = criarPartida({ semente: 7, ocorrencias: false, eleicao: false });
    if (!c.ok) throw new Error(c.erros.join(" "));
    const inicial = c.value.game.execution.values.taxa_mortalidade;
    const m = aplicarMeta(c.value, "piso-saude", 40);
    if (!m.ok) throw new Error(m.erros.join(" "));
    let p = m.value;
    for (let t = 0; t < 6; t++) {
      const r = encerrarTurno(p);
      if (!r.ok) throw new Error(r.erros.join(" "));
      p = r.value.partida;
    }
    const v = p.game.execution.values;
    expect(inicial).toBeCloseTo(7, 0);
    expect(v.saude_populacao).toBeGreaterThan(76);
    expect(v.taxa_mortalidade).toBeLessThan(inicial - 0.1);
  }, 120_000);
});
