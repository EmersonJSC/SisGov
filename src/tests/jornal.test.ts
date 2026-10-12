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
import {
  pilaresDoJornal,
  fotoDoTurno,
  montarJornal,
  type FotoDoTurno,
} from "../ui/mapa/jornal";

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
    // um pilar por área (saúde e proteção social com dois), na ordem do quadro
    expect(edicao.indices.map((i) => i.id)).toEqual([
      "violencia_letal",
      "pib",
      "popularidade_governo",
      "liberdade_civil",
      "reputacao_internacional",
      "desemprego",
      "pobreza",
      "saude_populacao",
      "aprendizagem",
      "desmatamento",
      "infraestrutura",
    ]);
    expect(pilaresDoJornal(verPartida(criada.value))).toHaveLength(11);
    // medida real (V1-07): convertida mostra a unidade; mantida, não
    const pib = edicao.indices.find((i) => i.id === "pib")!;
    expect(pib.unidadeReal).toBe("PIB real (jan/2025 = 100)");
    const letal = edicao.indices.find((i) => i.id === "violencia_letal")!;
    expect(letal.unidadeReal).toBeUndefined();
    expect(letal.valor).toMatch(/por 100 mil$/);
    // sem edição anterior, nada "mudou"
    expect(edicao.indices.every((i) => i.variacao === "")).toBe(true);
    const secoes = new Set(edicao.opinioes.map((o) => o.secao));
    expect([...secoes].sort()).toEqual(["internacional", "mercado", "povo"]);
  });

  it("depois de alguns turnos: variação dos índices e consequências das notícias", () => {
    let atual = criada.value;
    let comVariacao = false;
    let comEfeitos = false;
    const historico: FotoDoTurno[] = [];
    for (let t = 0; t < 8; t++) {
      const r = passar(atual);
      historico.push(fotoDoTurno(r.antes));
      atual = r.partida;
      const edicao = montarJornal(
        verPartida(atual),
        r.antes,
        r.relatorio,
        historico,
      );
      // gráficos: barra e linha na escala 0–1, uma ponta por turno
      for (const i of edicao.indices) {
        expect(i.t).toBeGreaterThanOrEqual(0);
        expect(i.t).toBeLessThanOrEqual(1);
        expect(i.serie).toHaveLength(t + 2);
      }
      expect(edicao.humor.length).toBe(verPartida(atual).grupos.length);
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
