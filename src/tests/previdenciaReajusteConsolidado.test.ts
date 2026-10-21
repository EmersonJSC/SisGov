import { readFileSync } from "node:fs";
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
function avancar(p: Partida, turnos = 4) {
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

describe("Reajuste de benefícios consolidado", () => {
  it("catálogo contém uma única lei de reajuste", () => {
    const catalogo = JSON.parse(readFileSync("src/conteudo/mundo/catalogo-leis.json", "utf8"));
    expect(catalogo.politicas).toContain("mundo/leis/reajuste-de-beneficios.json");
    expect(catalogo.politicas).not.toContain("mundo/leis/regra-de-reajuste-dos-beneficios.json");
  });

  it("trava tripla eleva gasto e reduz desigualdade frente à correção pela inflação", () => {
    const inflacao = avancar(aplicar(nova(), "reajuste-de-beneficios", 25));
    const tripla = avancar(aplicar(nova(), "reajuste-de-beneficios", 100));
    expect(valor(tripla, "gasto_publico")).toBeGreaterThan(valor(inflacao, "gasto_publico"));
    expect(valor(tripla, "desigualdade")).toBeLessThan(valor(inflacao, "desigualdade"));
  });

  it("trava tripla exige pilar público de aposentadoria", () => {
    const capitalizacao = aplicar(nova(), "sistema-previdenciario", 33);
    expect(aplicarMeta(capitalizacao, "reajuste-de-beneficios", 100).ok).toBe(false);
  });
});
