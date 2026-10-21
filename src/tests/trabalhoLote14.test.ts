import { describe, expect, it } from "vitest";
import { criarPartida, encerrarTurno, verPartida, type Partida } from "../app/partida";
import { aplicarMeta } from "../app/partida/leis";

function nova() {
  const r = criarPartida({ semente: 7, ocorrencias: false, eleicao: false });
  if (!r.ok) throw new Error(r.erros.join("; "));
  return r.value;
}
function aplicar(p: Partida, id: string, valor: number) {
  const r = aplicarMeta(p, id, valor);
  if (!r.ok) throw new Error(r.erros.join("; "));
  return r.value;
}
function avancar(p: Partida, turnos = 8) {
  for (let i = 0; i < turnos; i++) {
    const r = encerrarTurno(p);
    if (!r.ok) throw new Error(r.erros.join("; "));
    p = r.value.partida;
  }
  return p;
}
function valor(p: Partida, id: string) {
  return verPartida(p).bolhas.find((x) => x.id === id)!.valor;
}

describe("Lote 14: piso salarial e rede de segurança", () => {
  it("fórmula de ganho real move renda, pobreza e custo após quatro turnos", () => {
    const base = avancar(nova());
    const soInflacao = avancar(aplicar(nova(), "formula-do-salario-minimo", 33));
    expect(valor(base, "renda_familias")).toBeGreaterThan(valor(soInflacao, "renda_familias"));
    expect(valor(base, "pobreza")).toBeLessThan(valor(soInflacao, "pobreza"));
    expect(valor(base, "custo_trabalhista")).toBeGreaterThan(valor(soInflacao, "custo_trabalhista"));
  });

  it("valor do piso obedece ao decisor e à regra de reajuste", () => {
    const p = nova();
    expect(aplicarMeta(p, "salario-minimo", 0).ok).toBe(false);
    const semPisoNacional = aplicar(p, "quem-decide-o-salario-minimo", 33);
    expect(aplicarMeta(semPisoNacional, "salario-minimo", 100).ok).toBe(false);
  });

  it("fundo com multa exige direitos mínimos constitucionais", () => {
    const p = aplicar(nova(), "legislacao-trabalhista", 0);
    expect(aplicarMeta(p, "fundo-de-garantia", 67).ok).toBe(false);
  });
});
