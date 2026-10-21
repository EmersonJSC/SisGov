import { describe, expect, it } from "vitest";
import { criarPartida, encerrarTurno, verPartida, type Partida } from "../app/partida";
import { aplicarMeta } from "../app/partida/leis";

function nova() {
  const r = criarPartida({ semente: 7, ocorrencias: false, eleicao: false });
  if (!r.ok) throw new Error(r.erros.join("; "));
  return r.value;
}

function aplicar(p: Partida, id: string, nivel: number) {
  const r = aplicarMeta(p, id, nivel);
  if (!r.ok) throw new Error(r.erros.join("; "));
  return r.value;
}

function avancar(p: Partida, turnos: number) {
  for (let i = 0; i < turnos; i++) {
    const r = encerrarTurno(p);
    if (!r.ok) throw new Error(r.erros.join("; "));
    p = r.value.partida;
  }
  return p;
}

function valor(p: Partida, id: string) {
  return verPartida(p).bolhas.find(x => x.id === id)!.valor;
}

describe("Lote 16: emprego, aprendizagem e cuidado", () => {
  it("rede ampla de recolocação custa verba e reduz desemprego", () => {
    const base = avancar(nova(), 4);
    const ampla = avancar(aplicar(nova(), "intermediacao-e-qualificacao", 100), 4);
    expect(valor(ampla, "gasto_publico")).toBeGreaterThan(valor(base, "gasto_publico"));
    expect(valor(ampla, "desemprego")).toBeLessThan(valor(base, "desemprego"));
    expect(valor(ampla, "desemprego")).toBeGreaterThan(0);
  });

  it("programa de jornada parcial preserva emprego com custo", () => {
    const base = avancar(nova(), 1);
    const parcial = avancar(aplicar(nova(), "reducao-de-jornada-subsidiada", 50), 1);
    expect(valor(parcial, "desemprego")).toBeLessThan(valor(base, "desemprego"));
    expect(valor(parcial, "gasto_publico")).toBeGreaterThan(valor(base, "gasto_publico"));
  });

  it("aprendizagem dual exige oferta de ensino técnico", () => {
    const semTecnico = aplicar(nova(), "ensino-tecnico-e-profissional", 0);
    const tentativa = aplicarMeta(semTecnico, "trabalho-infantil-e-aprendizagem", 100);
    expect(tentativa.ok).toBe(false);
    expect(aplicarMeta(nova(), "trabalho-infantil-e-aprendizagem", 100).ok).toBe(true);
  });
});
