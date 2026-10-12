/**
 * SG105 — o turno usa só a rede para as contas: sem livro fiscal à parte,
 * 16 turnos do Brasil sem erro, uma única dívida, e o juro da dívida nova só
 * aparece no mês seguinte.
 */
import { describe, expect, it } from "vitest";
import {
  criarPartida,
  encerrarTurno,
  mudarLei,
  verPartida,
  type Partida,
} from "../app/partida";
import { advancePolicyImplementation } from "../game/advancePolicyImplementation";
import { prepareGameQuarter } from "../game/prepareGameQuarter";
import economiaDoBrasil from "../conteudo/paises/brasil/economia.json";

function nova(): Partida {
  const criada = criarPartida({ ocorrencias: false });
  if (!criada.ok) throw new Error(criada.erros.join(" "));
  return criada.value;
}

describe("SG105 — fiscal no turno real", () => {
  it("16 turnos do Brasil sem erro, com a conta fechando todo turno", () => {
    let partida = nova();
    for (let t = 0; t < 16; t++) {
      const antes = partida.game.execution.values.divida_publica;
      const passou = encerrarTurno(partida);
      if (!passou.ok) throw new Error(`turno ${t + 1}: ${passou.erros}`);
      partida = passou.value.partida;
      const v = partida.game.execution.values;
      expect(v.resultado_fiscal).toBeCloseTo(
        v.arrecadacao - v.gasto_publico - v.juros_da_divida,
        6,
      );
      // com déficit, a dívida sobe; nada mais mexe nela
      if (v.resultado_fiscal < 0)
        expect(v.divida_publica).toBeGreaterThan(antes);
    }
    expect(partida.game.currentTurn).toBe(16);
  }, 90_000);

  it("uma única fonte de caixa e dívida: a rede", () => {
    const partida = nova();
    expect("fiscal" in partida.game).toBe(false);
    expect("credit" in partida.game).toBe(false);
    expect("fiscal" in economiaDoBrasil.economia).toBe(false);
    const { contas } = verPartida(partida);
    // a dívida em R$ da tela é a bolha da rede × PIB
    expect(contas.divida).toBeCloseTo(
      (partida.game.execution.values.divida_publica / 100) * contas.pib,
      0,
    );
  });

  it("o juro da dívida nova só entra no mês seguinte", () => {
    // impostos no mínimo: déficit grande, a dívida sobe todo mês
    let partida = nova();
    for (const lei of verPartida(partida).leis)
      if (lei.grupo === "tributaria") {
        const mudada = mudarLei(partida, lei.id, lei.minimo ?? 0);
        if (mudada.ok) partida = mudada.value;
      }
    const { content, graph, game } = partida;
    let estados = game.policies;
    const meses = [];
    for (let i = 0; i < 3; i++) {
      const andou = advancePolicyImplementation(
        content,
        estados,
        game.currentTurn,
      );
      if (!andou.ok) throw new Error(andou.diagnostics[0].message);
      estados = andou.value;
      meses.push(estados);
    }
    const trimestre = prepareGameQuarter(content, graph, game, meses);
    if (!trimestre.ok) throw new Error(trimestre.diagnostics[0].message);
    let anterior = game.execution.values;
    for (const mes of trimestre.value.months) {
      const v = mes.execution.values;
      expect(v.divida_publica).toBeGreaterThan(anterior.divida_publica);
      // juros = 0,7 × taxa × dívida, as duas do fim do mês anterior
      expect(v.juros_da_divida).toBeCloseTo(
        (0.7 * anterior.taxa_juros * anterior.divida_publica) / 100,
        9,
      );
      expect(v.juros_da_divida).toBeLessThan(
        (0.7 * v.taxa_juros * v.divida_publica) / 100,
      );
      anterior = v;
    }
  });
});

describe("SG104 — implantação mensal pela partida", () => {
  function meses(partida: Partida, id: string, n: number) {
    const { content, game } = partida;
    let estados = game.policies;
    const niveis: number[] = [];
    for (let i = 0; i < n; i++) {
      const andou = advancePolicyImplementation(
        content,
        estados,
        game.currentTurn,
      );
      if (!andou.ok) throw new Error(andou.diagnostics[0].message);
      estados = andou.value;
      niveis.push(
        estados.find((e) => e.policyDefinitionId === id)!.implementedLevel,
      );
    }
    return niveis;
  }

  it("a lei anda até a meta pela fração dela e chega lá", () => {
    const partida = nova();
    const lei = verPartida(partida).leis.find(
      (l) => l.id === "farmacia-popular",
    )!;
    const meta = lei.nivel * 3;
    const mudada = mudarLei(partida, lei.id, meta);
    if (!mudada.ok) throw new Error(mudada.erros.join(" "));
    const niveis = meses(mudada.value, lei.id, 48);
    // primeiro turno (3 meses): 30% do caminho (respostaTemporal.implantacao)
    expect(niveis[2]).toBeCloseTo(lei.nivel + 0.3 * (meta - lei.nivel), 6);
    for (let i = 1; i < niveis.length; i++)
      expect(niveis[i]).toBeGreaterThanOrEqual(niveis[i - 1]);
    expect(niveis.at(-1)).toBe(meta);
  });

  it("revogar nunca sobe o nível", () => {
    const partida = nova();
    const lei = verPartida(partida).leis.find(
      (l) => l.id === "farmacia-popular",
    )!;
    const mudada = mudarLei(partida, lei.id, 0);
    if (!mudada.ok) throw new Error(mudada.erros.join(" "));
    const niveis = meses(mudada.value, lei.id, 36);
    let anterior = lei.nivel;
    for (const nivel of niveis) {
      expect(nivel).toBeLessThanOrEqual(anterior);
      anterior = nivel;
    }
    // desce pela degradação: 20% do caminho por turno
    expect(niveis[2]).toBeCloseTo(lei.nivel * 0.8, 6);
    // a degradação é geométrica: em 3 anos sobra menos de 10%
    expect(niveis.at(-1)).toBeLessThan(lei.nivel * 0.1);
  });
});
