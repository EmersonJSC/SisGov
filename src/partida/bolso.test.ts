// Bolso (15/nov): a lei que encarece a cesta pesa mais em quem gasta mais
// da renda nela, e o grupo sente pelo padrão de vida.
import { describe, expect, it } from "vitest";
import { avancar, criarPartida, type Partida } from ".";

/** Brasil sem Congresso, com uma lei de teste que encarece a comida em 20%. */
function comComidaCara(): Partida {
  const p = criarPartida("brasil-2026", 42, { semCongresso: true });
  const lei = p.regras.leis["imposto-consumo"];
  if (lei?.forma !== "continua")
    throw new Error("falta a régua imposto-consumo");
  return {
    ...p,
    regras: {
      ...p.regras,
      leis: {
        ...p.regras.leis,
        "imposto-consumo": { ...lei, valores: { preco_comida: 20 } },
      },
    },
  };
}

describe("bolso pela cesta", () => {
  const p = comComidaCara();
  const lei = p.regras.leis["imposto-consumo"];
  const valor = lei.forma === "continua" ? lei.faixa.max : 0;
  const parado = avancar(p, []);
  const caro = avancar(p, [
    { tipo: "mudar_lei", lei: "imposto-consumo", valor },
  ]);
  const queda = (id: string) =>
    1 - caro.estado.pops[id].poder! / parado.estado.pops[id].poder!;

  it("comida mais cara tira mais do pobre do que do rico", () => {
    expect(queda("operarios-fabrica")).toBeGreaterThan(0);
    expect(queda("operarios-fabrica")).toBeGreaterThan(queda("rentistas"));
  });

  it("o grupo dos operários perde satisfação", () => {
    expect(caro.estado.grupos.operarios.satisfacao).toBeLessThan(
      parado.estado.grupos.operarios.satisfacao,
    );
  });
});
