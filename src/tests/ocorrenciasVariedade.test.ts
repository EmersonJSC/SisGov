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
    const criada = criarPartida({ semente: 3, eleicao: false });
    if (!criada.ok) throw new Error(criada.erros.join(" "));
    let atual = criada.value;
    let calmos = 0;
    const turnosComDilema: number[] = [];
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
      expect(o.dilemas.length).toBeLessThanOrEqual(1);
      if (o.dilemas.length) turnosComDilema.push(t);
    }
    const historia = atual.game.occurrences!.history.filter(
      (h) => h.kind !== "situacao",
    );
    const vezes = new Map<string, number>();
    for (const h of historia) vezes.set(h.id, (vezes.get(h.id) ?? 0) + 1);
    const dilemas = historia.filter((h) => h.kind === "dilema").length;
    expect(vezes.size).toBeGreaterThanOrEqual(60);
    // Ações de grupos de pressão (V1-09) voltam enquanto o grupo segue
    // mobilizado; as outras ocorrências repetem pouco.
    const origem = new Map(atual.content.events.map((e) => [e.id, e.origem]));
    const deGrupo = [...vezes].filter(([id]) => origem.get(id) === "grupo");
    const outras = [...vezes].filter(([id]) => origem.get(id) !== "grupo");
    expect(Math.max(...outras.map(([, n]) => n))).toBeLessThanOrEqual(4);
    expect(Math.max(...deGrupo.map(([, n]) => n))).toBeLessThanOrEqual(12);
    // poucos dilemas (11/out): no máximo um a cada 3 turnos
    expect(dilemas).toBeGreaterThanOrEqual(12);
    expect(dilemas).toBeLessThanOrEqual(27);
    for (let i = 1; i < turnosComDilema.length; i++)
      expect(
        turnosComDilema[i] - turnosComDilema[i - 1],
      ).toBeGreaterThanOrEqual(3);
    expect(calmos).toBeGreaterThan(0);
    expect(calmos).toBeLessThan(40);
  }, 180_000);
});
