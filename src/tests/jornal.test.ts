/**
 * A página de jornal (11/out): índices com variação, notícias com as
 * consequências e opiniões da rua, do mercado e de fora, tudo lido da partida.
 */
import { describe, expect, it } from "vitest";
import {
  criarPartida,
  encerrarTurno,
  responderDilema,
  verPartida,
  type Partida,
} from "../app/partida";
import { INDICES_DO_JORNAL, montarJornal } from "../ui/mapa/jornal";

function passar(partida: Partida) {
  let atual = partida;
  for (const d of verPartida(atual).ocorrencias.mesa) {
    const opcao = d.opcoes.find((o) => o.disponivel)!;
    const r = responderDilema(atual, d.id, opcao.id);
    if (!r.ok) throw new Error(r.erros.join(" "));
    atual = r.value;
  }
  const r = encerrarTurno(atual);
  if (!r.ok) throw new Error(r.erros.join(" "));
  return { antes: verPartida(atual), ...r.value };
}

describe("jornal", () => {
  const criada = criarPartida({ semente: 7 });
  if (!criada.ok) throw new Error(criada.erros.join(" "));

  it("primeira edição: índices, manchete e as três seções de opinião", () => {
    const edicao = montarJornal(verPartida(criada.value), null, null);
    expect(edicao.manchete).not.toBe("");
    expect(edicao.indices.map((i) => i.id)).toEqual(
      INDICES_DO_JORNAL.filter((id) =>
        verPartida(criada.value).bolhas.some((b) => b.id === id),
      ),
    );
    expect(edicao.indices.length).toBeGreaterThanOrEqual(8);
    // sem edição anterior, nada "mudou"
    expect(edicao.indices.every((i) => i.variacao === "")).toBe(true);
    const secoes = new Set(edicao.opinioes.map((o) => o.secao));
    expect([...secoes].sort()).toEqual(["internacional", "mercado", "povo"]);
  });

  it("depois de alguns turnos: variação dos índices e consequências das notícias", () => {
    let atual = criada.value;
    let comVariacao = false;
    let comEfeitos = false;
    for (let t = 0; t < 8; t++) {
      const r = passar(atual);
      atual = r.partida;
      const edicao = montarJornal(verPartida(atual), r.antes, r.relatorio);
      if (edicao.indices.some((i) => i.variacao)) comVariacao = true;
      const todas = [
        ...(edicao.principal ? [edicao.principal] : []),
        ...edicao.noticias,
      ];
      if (todas.some((n) => n.efeitos.length > 0)) comEfeitos = true;
      for (const o of edicao.opinioes)
        expect(o.texto).not.toMatch(/undefined|NaN/);
    }
    expect(comVariacao).toBe(true);
    expect(comEfeitos).toBe(true);
  }, 120_000);
});
