import { describe, expect, it } from "vitest";
import {
  criarPartida,
  encerrarTurno,
  verPartida,
  type Partida,
} from "../app/partida";
import { aplicarMeta } from "../app/partida/leis";
import { requirementsOf } from "../engine";

function nova() {
  const r = criarPartida({ semente: 7, ocorrencias: false, eleicao: false });
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

function rota(id: string, nivel: number, turnos = 16) {
  const r = aplicarMeta(nova(), id, nivel);
  if (!r.ok) throw new Error(r.erros.join("; "));
  return avancar(r.value, turnos);
}

function bolha(p: Partida, id: string) {
  return verPartida(p).bolhas.find((x) => x.id === id)!.valor;
}

describe("Lote 10: justiça e prisões", () => {
  it("gestão por PPP produz efeito próprio em rebeliões", () => {
    const base = avancar(nova(), 16);
    const ppp = rota("gestao-dos-presidios", 100);
    expect(bolha(ppp, "rebeliao_presidios")).toBeLessThan(
      bolha(base, "rebeliao_presidios"),
    );
    expect(
      nova().content.policies.find((x) => x.id === "gestao-dos-presidios")
        ?.consequencias,
    ).toContain("gestao-dos-presidios--gasto-publico");
  });

  it("alternativas reduzem lotação e reincidência, com perda de segurança percebida", () => {
    const base = avancar(nova(), 16);
    const alternativas = rota(
      "alternativas-penais-e-audiencia-de-custodia",
      100,
    );
    expect(bolha(alternativas, "lotacao_prisional")).toBeLessThan(
      bolha(base, "lotacao_prisional"),
    );
    expect(bolha(alternativas, "reincidencia")).toBeLessThan(
      bolha(base, "reincidencia"),
    );
    expect(bolha(alternativas, "sensacao_seguranca")).toBeLessThan(
      bolha(base, "sensacao_seguranca"),
    );
  });

  it("lei filha da pena capital exige autorização constitucional", () => {
    const p = nova();
    const lei = p.content.policies.find((x) => x.id === "pena-de-morte");
    const requisito = lei && requirementsOf(lei)[0];
    expect(requisito?.lei).toBe("garantias-penais");
    expect(requisito?.opcoes).toContain("pena-de-morte-permitida");
    expect(aplicarMeta(p, "pena-de-morte", 100).ok).toBe(false);
  });
});
