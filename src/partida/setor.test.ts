// R11.5: gente estuda e muda para o setor que paga mais, devagar e pela instrução.
import { describe, expect, it } from "vitest";
import { criarPartida, jogar } from ".";
import { empregoDoPais } from "../motor";

const soma = (m: Record<string, number>) =>
  Object.values(m).reduce((a, b) => a + b, 0);

describe("estudar e mudar de setor (R11.5)", () => {
  const p0 = criarPartida("teste", 42, { semCongresso: true });
  const p12 = jogar(p0, 12);

  it("no turno 0 vale o setor declarado pelo mundo", () => {
    expect(p0.estado.setores ?? {}).toEqual({});
  });

  it("depois de alguns turnos alguém mudou e cada pop segue somando 1", () => {
    const mix = p12.estado.setores ?? {};
    expect(Object.keys(mix).length).toBeGreaterThan(0);
    for (const [id, m] of Object.entries(mix)) expect(soma(m), id).toBeCloseTo(1, 6);
    const o = p12.regras.mercado!.ocupacao;
    const mudou = Object.entries(mix).some(([id, m]) =>
      Object.entries(m).some(([s, v]) => Math.abs(v - (o[id].setores[s] ?? 0)) > 1e-6),
    );
    expect(mudou).toBe(true);
  });

  it("onde há mais instrução a mudança é maior", () => {
    const quanto = (pais: string) => {
      const f = jogar(criarPartida(pais, 42, { semCongresso: true }), 12);
      const o = f.regras.mercado!.ocupacao;
      let total = 0;
      for (const [id, m] of Object.entries(f.estado.setores ?? {}))
        for (const [s, v] of Object.entries(m))
          total += Math.abs(v - (o[id].setores[s] ?? 0));
      return total;
    };
    expect(quanto("teste")).toBeGreaterThan(quanto("teste-pobre"));
  });

  it("a conta de empregos usa o setor de hoje e a gente total não muda", () => {
    const { mercado, ocupacao } = p12.regras.mercado!;
    const a = empregoDoPais(mercado, ocupacao, p12.estado.pops);
    const b = empregoDoPais(mercado, ocupacao, p12.estado.pops, p12.estado.setores);
    expect(b.semEmprego).toBeCloseTo(a.semEmprego, 6);
    const tot = (r: typeof a) => r.setores.reduce((x, s) => x + s.empregos, 0);
    expect(tot(b)).toBeCloseTo(tot(a), 4);
  });

  it("mesma partida e mesma semente dão o mesmo resultado", () => {
    expect(jogar(p0, 12).estado.setores).toEqual(p12.estado.setores);
  });
});
