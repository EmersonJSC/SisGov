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

describe("Orçamento e critérios da transferência de renda", () => {
  it("ao cortar verba, o efeito dos critérios encolhe junto", () => {
    // A degradação é gradual: após oito turnos ainda resta parte da verba.
    const corte = avancar(aplicar(nova(), "transferencia-de-renda", 0), 8);
    const nivel = corte.game.policies.find(p => p.policyDefinitionId === "transferencia-de-renda")!.implementedLevel;
    expect(nivel).toBeGreaterThan(0);
    expect(nivel).toBeLessThan(168000 * 0.2);
    const focal = avancar(aplicar(corte,
      "transferencia-de-renda-as-familias-pobres", 0));
    const universal = avancar(aplicar(corte,
      "transferencia-de-renda-as-familias-pobres", 100));
    expect(Math.abs(valor(focal, "pobreza") - valor(universal, "pobreza")))
      .toBeLessThan(0.2);
  });

  it("com verba, focalização e universalização oferecem resultados distintos", () => {
    const focal = avancar(aplicar(nova(), "transferencia-de-renda-as-familias-pobres", 0));
    const universal = avancar(aplicar(nova(), "transferencia-de-renda-as-familias-pobres", 100));
    expect(valor(focal, "pobreza")).toBeLessThan(valor(universal, "pobreza"));
    expect(valor(universal, "corrupcao")).toBeLessThan(valor(focal, "corrupcao"));
  });
});
