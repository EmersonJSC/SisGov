import { describe, expect, it } from "vitest";
import { criarPartida, mudarLei, verPartida } from "../app/partida";

function brasil() {
  const criada = criarPartida({ ocorrencias: false, eleicao: false });
  if (!criada.ok) throw new Error(criada.erros.join("; "));
  return criada.value;
}

describe("economia em reais — gastos da fase 4", () => {
  it("a folha e os benefícios saem de pessoas × valor médio", () => {
    const values = brasil().game.execution.values;
    expect(values.base_folha_servidores_real).toBeCloseTo(
      (values.ocupados *
        values.salario_medio *
        values.percentual_servidores_publicos *
        values.percentual_salario_servidores) /
        1e10,
      5,
    );
    expect(values.base_aposentadorias).toBeCloseTo(
      (values.aposentados *
        values.beneficio_anual_aposentadoria *
        values.nivel_reajuste_de_beneficios) /
        1e8,
      5,
    );
    expect(values.base_pensoes).toBeCloseTo(
      (values.pensionistas * values.beneficio_anual_pensao) / 1e6,
      5,
    );
  });

  it("taxas arrecadam e todas as linhas mostram a lei responsável", () => {
    const partida = brasil();
    expect(partida.game.execution.values.arrecadacao_taxas).toBeGreaterThan(0);
    const visao = verPartida(partida);
    expect(
      visao.orcamento.find((linha) => linha.id === "servidores")?.leis,
    ).toContain("salario-dos-servidores");
    expect(
      visao.orcamento.find((linha) => linha.id === "arrecadacao_taxas")?.leis,
    ).toContain("taxas-e-tarifas-publicas");
    expect(visao.orcamento.every((linha) => linha.leis.length > 0)).toBe(true);
  });

  it("reserva duas mudanças pendentes no mesmo limite de 100% do PIB", () => {
    const partida = brasil();
    const primeira = mudarLei(partida, "transferencia-de-renda", 4_000_000);
    expect(primeira.ok).toBe(true);
    if (!primeira.ok) return;
    const segunda = mudarLei(
      primeira.value,
      "investimento-em-infraestrutura",
      5_000_000,
    );
    expect(segunda.ok).toBe(false);
    if (!segunda.ok) expect(segunda.erros.join(" ")).toContain("100% do PIB");
  });
});
