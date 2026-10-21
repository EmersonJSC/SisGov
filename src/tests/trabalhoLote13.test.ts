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

describe("Lote 13: contratos de trabalho", () => {
  it("substitui a opção provisória de fiscalização por ação concreta", () => {
    const p = nova();
    const lei = p.content.policies.find((x) => x.id === "fiscalizacao-do-trabalho");
    expect(lei?.controle.opcoes?.map((x) => x.id)).toContain("sem-fiscalizacao-ativa");
    expect(lei?.controle.opcoes?.map((x) => x.id)).not.toContain("ponto-da-faixa");
    expect(lei?.consequencias).toContain("fiscalizacao-do-trabalho--gasto-publico");
  });

  it("mais fiscalização reduz informalidade e trabalho infantil", () => {
    const base = avancar(nova());
    const equipes = avancar(aplicar(nova(), "fiscalizacao-do-trabalho", 100));
    expect(valor(equipes, "informalidade")).toBeLessThan(valor(base, "informalidade"));
    expect(valor(equipes, "trabalho_infantil")).toBeLessThan(valor(base, "trabalho_infantil"));
  });

  it("opções extremas declaram sua dependência da regra constitucional", () => {
    const p = nova();
    for (const [leiId, opcaoId] of [
      ["terceirizacao", "livre"],
      ["jornada-de-trabalho", "35-horas"],
      ["trabalho-por-aplicativo", "emprego-obrigatorio"],
    ]) {
      const lei = p.content.policies.find((x) => x.id === leiId);
      expect(lei?.controle.opcoes?.find((x) => x.id === opcaoId)?.requer?.[0]?.lei)
        .toBe("legislacao-trabalhista");
    }
    const protecao = aplicar(p, "legislacao-trabalhista", 100);
    expect(aplicarMeta(protecao, "terceirizacao", 0).ok).toBe(false);
  });
});
