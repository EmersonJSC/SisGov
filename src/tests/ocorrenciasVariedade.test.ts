/**
 * SG106 — variedade: cinco mandatos (80 turnos) com o catálogo do mundo não
 * ficam sem drama nem repetem demais, e nem todo turno tem ocorrência.
 */
import { describe, expect, it } from "vitest";
import {
  criarPartida,
  encerrarTurno,
  responderDilema,
  verPartida,
} from "../app/partida";

describe("SG106 — cinco mandatos", () => {
  it("80 turnos: muitas ocorrências distintas, poucas repetições, turnos calmos, textos sem variável solta", () => {
    const criada = criarPartida({ semente: 3 });
    if (!criada.ok) throw new Error(criada.erros.join(" "));
    let atual = criada.value;
    let calmos = 0;
    for (let t = 0; t < 80; t++) {
      const vista = verPartida(atual).ocorrencias;
      // nenhuma variável do texto fica sem trocar ({cidade}, {ministro}…)
      const textos = [
        ...vista.mesa.flatMap((d) => [
          d.nome,
          d.manchete,
          d.descricao,
          d.causa?.nome ?? "",
          ...d.opcoes.flatMap((o) => [o.rotulo, o.descricao]),
        ]),
        ...vista.emCurso.flatMap((o) => [o.nome, o.manchete, o.descricao]),
        ...vista.historico.flatMap((h) => [h.nome, h.manchete]),
      ];
      for (const texto of textos) expect(texto).not.toMatch(/[{}]/);
      for (const d of vista.mesa) {
        const opcao = d.opcoes.find((o) => o.disponivel)!;
        const r = responderDilema(atual, d.id, opcao.id);
        if (!r.ok) throw new Error(r.erros.join(" "));
        atual = r.value;
      }
      const passou = encerrarTurno(atual);
      if (!passou.ok) throw new Error(`turno ${t + 1}: ${passou.erros}`);
      atual = passou.value.partida;
      const o = passou.value.relatorio.ocorrencias;
      if (!o.eventos.length && !o.dilemas.length) calmos++;
    }
    const historia = atual.game.occurrences!.history.filter(
      (h) => h.kind !== "situacao",
    );
    const vezes = new Map<string, number>();
    for (const h of historia) vezes.set(h.id, (vezes.get(h.id) ?? 0) + 1);
    const dilemas = historia.filter((h) => h.kind === "dilema").length;
    expect(vezes.size).toBeGreaterThanOrEqual(60);
    expect(Math.max(...vezes.values())).toBeLessThanOrEqual(4);
    expect(dilemas).toBeGreaterThanOrEqual(25);
    expect(calmos).toBeGreaterThan(0);
    expect(calmos).toBeLessThan(40);
  }, 180_000);
});
