/**
 * O emprego dos perfis (População, camada C): o conteúdo que diz quem perde o
 * emprego primeiro e dá ao desempregado um lugar no mapa.
 */
import { describe, expect, it } from "vitest";
import { criarPartida } from "../app/partida";
import { eleitoradoDoInicio, rendasDoManifesto } from "../game/congresso/bolso";
import { congressoVivo, origemDoDesempregado } from "../game/congresso/vivo";

function congresso() {
  const criada = criarPartida({ ocorrencias: false, eleicao: false });
  if (!criada.ok) throw new Error(criada.erros.join(" "));
  return criada.value.content.manifest.congresso!;
}

describe("o conteúdo do emprego", () => {
  it("o país traz a tabela de quem perde o emprego primeiro", () => {
    const v = congresso().emprego!.vulnerabilidade;
    expect(v.ocupacao.carteira).toBeGreaterThan(v.ocupacao.servidor);
    expect(v.renda.pobre).toBeGreaterThan(v.renda.rica);
    expect(v.idade["16-29"]).toBeGreaterThan(v.idade["30-59"]);
  });

  it("só ex-carteira tem seguro-desemprego, e a informalidade inicial vem do país", () => {
    const e = congresso().emprego!;
    expect(e.desempregado.origemComBeneficio).toEqual(["carteira"]);
    expect(e.informalidadeInicial).toBeGreaterThan(0);
  });

  it("o desempregado é ocupação, fonte de dinheiro e grupo no mapa", () => {
    const c = congresso();
    expect(c.segmentoDe["ocupacao=desempregado"]).toBe("grupo_desempregados");
    expect(c.bolso!.fontes.desempregado.trabalha).toBe(false);
    expect(c.rotulos!.faixas["ocupacao=desempregado"]).toBe("Desempregados");
  });
});

describe("o bico de quem vinha sem carteira", () => {
  it("o ex-informal desempregado ganha parte do que ganhava; o ex-carteira, nada de salário", () => {
    const criada = criarPartida({ ocorrencias: false, eleicao: false });
    if (!criada.ok) throw new Error(criada.erros.join(" "));
    const { content, game } = criada.value;
    const fixo = content.manifest.congresso!;
    const valores = { ...game.execution.values, desemprego: 15 };
    const vivo = congressoVivo(fixo, valores);
    const rendas = rendasDoManifesto(
      vivo,
      game.execution.values.salario_medio,
      0,
      eleitoradoDoInicio(content, valores),
    );
    const doTipo = (origem: string) =>
      rendas.filter(
        (r, i) =>
          r.fonte.id === "desempregado" &&
          origemDoDesempregado(vivo, i) === origem,
      );
    const bico = doTipo("informal");
    const carteira = doTipo("carteira");
    expect(bico.length).toBeGreaterThan(0);
    expect(bico.every((r) => r.bicoPorAno > 0)).toBe(true);
    expect(carteira.every((r) => r.bicoPorAno === 0)).toBe(true);
  });
});
