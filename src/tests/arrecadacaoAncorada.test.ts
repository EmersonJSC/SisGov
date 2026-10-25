import { describe, expect, it } from "vitest";
import { criarPartida } from "../app/partida";
import economiaDoBrasil from "../conteudo/paises/brasil/economia.json";

const impostos = [
  ["consumo", "aliquota_imposto_sobre_consumo"],
  ["renda_pessoas", "aliquota_imposto_renda_pessoas"],
  ["renda_empresas", "aliquota_imposto_renda_empresas"],
  ["dividendos", "aliquota_tributacao_dividendos"],
  ["heranca", "aliquota_imposto_heranca"],
  ["fortunas", "aliquota_imposto_grandes_fortunas"],
  ["imoveis_urbanos", "aliquota_imposto_propriedade_urbana_rural"],
  ["terras", "aliquota_imposto_terras_rurais"],
  ["transacoes", "aliquota_imposto_transacoes_financeiras"],
] as const;

const antesDoPedido = 31.732002736397646;

describe("arrecadação ancorada no turno zero", () => {
  it("cada imposto com alíquota positiva mantém a arrecadação de partida", () => {
    const criada = criarPartida({ semente: 7, ocorrencias: false });
    if (!criada.ok) throw new Error(criada.erros.join("; "));
    const valores = criada.value.game.execution.values;
    const alvos = economiaDoBrasil.arrecadacaoDePartida;
    for (const [id, aliquota] of impostos) {
      if (valores[aliquota] === 0) continue;
      const alvo = alvos[id];
      const atual = (valores[`arrecadacao_${id}`] / valores.pib_nominal) * 100;
      expect(Math.abs(atual - alvo) / alvo, id).toBeLessThan(0.02);
    }
  });

  it("mantém a arrecadação total de antes da troca das curvas", () => {
    const criada = criarPartida({ semente: 7, ocorrencias: false });
    if (!criada.ok) throw new Error(criada.erros.join("; "));
    const atual = criada.value.game.execution.values.arrecadacao;
    expect(Math.abs(atual - antesDoPedido) / antesDoPedido).toBeLessThan(0.02);
  });
});
