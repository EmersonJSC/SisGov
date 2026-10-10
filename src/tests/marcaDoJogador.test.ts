/**
 * D-58: a marca do jogador. A partida anda junto com o mesmo país no piloto
 * automático (sem nenhuma decisão do jogador); a diferença entre os dois é o
 * que o jogador fez acontecer, e a tela dá destaque a isso.
 */
import { describe, expect, it } from "vitest";
import {
  criarPartida,
  encerrarTurno,
  mudarLei,
  verPartida,
  type Partida,
} from "../app/partida";

function nova(): Partida {
  const criada = criarPartida();
  if (!criada.ok) throw new Error(criada.erros.join(" "));
  return criada.value;
}

function turno(partida: Partida) {
  const passou = encerrarTurno(partida);
  if (!passou.ok) throw new Error(passou.erros.join(" "));
  return passou.value;
}

describe("D-58 — marca do jogador", () => {
  it("sem decisões, nada é do jogador", () => {
    const partida = nova();
    expect(partida.piloto).toBe(partida.game);
    const { partida: depois, relatorio } = turno(partida);
    expect(relatorio.leisAlteradas).toBe(0);
    for (const m of relatorio.mudancas) {
      expect(Math.abs(m.porVoce), m.id).toBeLessThan(1e-9);
      expect(m.sozinho).toBeCloseTo(m.depois - m.antes, 9);
    }
    const visao = verPartida(depois);
    expect(visao.bolhas.every((b) => b.semVoce === undefined)).toBe(true);
    expect(visao.leis.every((l) => !l.alteradaPorVoce)).toBe(true);
  });

  it("subir o IVA: a receita a mais aparece como do jogador", () => {
    const partida = nova();
    const mudada = mudarLei(partida, "imposto-sobre-consumo", 29.5);
    if (!mudada.ok) throw new Error(mudada.erros.join(" "));
    // mudar a lei não mexe no piloto automático
    expect(mudada.value.piloto).toBe(partida.game);
    const lei = verPartida(mudada.value).leis.find(
      (l) => l.id === "imposto-sobre-consumo",
    )!;
    expect(lei.alteradaPorVoce).toBe(true);

    const { partida: depois, relatorio } = turno(mudada.value);
    expect(relatorio.leisAlteradas).toBe(1);
    const receita = relatorio.mudancas.find((m) => m.id === "arrecadacao")!;
    expect(receita.porVoce).toBeGreaterThan(0);
    expect(receita.porVoce + receita.sozinho).toBeCloseTo(
      receita.depois - receita.antes,
      9,
    );
    expect(relatorio.contas.resultado).toBeGreaterThan(
      relatorio.contasSemVoce.resultado,
    );
    const bolha = verPartida(depois).bolhas.find(
      (b) => b.id === "arrecadacao",
    )!;
    expect(bolha.semVoce).toBeDefined();
    expect(bolha.valor).toBeGreaterThan(bolha.semVoce!);
  });

  it("o piloto automático anda igual a uma partida sem decisões", () => {
    const partida = nova();
    const mudada = mudarLei(partida, "imposto-sobre-consumo", 29.5);
    if (!mudada.ok) throw new Error(mudada.erros.join(" "));
    const comVoce = turno(turno(mudada.value).partida).partida;
    const semVoce = turno(turno(partida).partida).partida;
    const a = comVoce.piloto.execution.values;
    const b = semVoce.game.execution.values;
    for (const id of ["pib", "inflacao", "arrecadacao", "divida_publica"])
      expect(a[id], id).toBeCloseTo(b[id], 9);
  });
});
