import { describe, expect, it } from "vitest";
import { criarPartida } from "../app/partida";
import { pacoteVivo } from "../game/congresso";
import {
  fracaoDeLealistas,
  fracaoDeRadicais,
  humorDoPais,
} from "../game/congresso/polarizacao";
import { TETO_DO_BOLSO } from "../game/congresso/bolsoNaSatisfacao";

const partida = () => {
  const p = criarPartida({ ocorrencias: false, eleicao: false });
  if (!p.ok) throw new Error(p.erros.join(" "));
  return p.value;
};

describe("o bolso na satisfação", () => {
  it("no turno 0 não muda nada", () => {
    const { content, game } = partida();
    const ini = { ...game.valoresIniciais! };
    const ajuste = pacoteVivo(content, ini)!.perfis.map((p) => p.bolso ?? 0);
    expect(ajuste.every((a) => Math.abs(a) < 1e-9)).toBe(true);
  });

  it("imposto de renda maior tira satisfação de quem paga, dentro do teto", () => {
    const { content, game } = partida();
    const ini = game.valoresIniciais!;
    const depois = {
      ...ini,
      arrecadacao_renda_pessoas: ini.arrecadacao_renda_pessoas * 3,
    };
    const ajuste = pacoteVivo(content, depois)!.perfis.map((p) => p.bolso ?? 0);
    expect(Math.min(...ajuste)).toBeLessThan(-0.5);
    expect(Math.min(...ajuste)).toBeGreaterThanOrEqual(-TETO_DO_BOLSO);
    expect(Math.max(...ajuste)).toBeLessThanOrEqual(TETO_DO_BOLSO);
    const pacote = pacoteVivo(content, depois)!;
    expect(pacote.perfis.some((p) => (p.bolso ?? 0) < -0.5)).toBe(true);
  });

  it("a eleição enxerga as faixas vivas: o país que muda de valores muda de eleitor", () => {
    const { content, game } = partida();
    const ini = game.valoresIniciais!;
    const conservador = (v: Record<string, number>) => {
      const pacote = pacoteVivo(content, v)!;
      const total = pacote.perfis.reduce((s, p) => s + p.peso, 0);
      const parte = pacote.perfis
        .filter((p) => p.atributos.valores === "conservador")
        .reduce((s, p) => s + p.peso, 0);
      return { total, parte };
    };
    const antes = conservador({ ...ini });
    const depois = conservador({
      ...ini,
      sensacao_seguranca: ini.sensacao_seguranca - 40,
    });
    expect(depois.total).toBeCloseTo(antes.total, 6);
    expect(depois.parte).toBeGreaterThan(antes.parte);
  });

  it("radicais e lealistas: não somam 100% e crescem com a insatisfação", () => {
    expect(fracaoDeRadicais(10)).toBeGreaterThan(fracaoDeRadicais(50));
    expect(fracaoDeLealistas(90)).toBeGreaterThan(fracaoDeLealistas(50));
    expect(fracaoDeRadicais(50) + fracaoDeLealistas(50)).toBeLessThan(0.5);
    const { content, game } = partida();
    const pacote = pacoteVivo(content, game.valoresIniciais!)!;
    const h = humorDoPais(
      pacote.perfis,
      pacote.pesoDoSegmento,
      game.valoresIniciais!,
    );
    expect(h.radicais + h.lealistas).toBeLessThan(1);
    expect(h.dividido).toBeLessThanOrEqual(
      Math.min(h.radicais, h.lealistas) * 2 + 1e-9,
    );
  });
});
