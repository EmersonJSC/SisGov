/**
 * SG159 — contas sem furos (achados A1, A2, N1–N4 do relatório de testes de
 * 10/out): a conta fecha sempre, nada trava a partida e os controles só
 * oferecem o que a partida aceita.
 */
import { describe, expect, it } from "vitest";
import {
  MAXIMO_TRIMESTRES_PREVIA,
  criarPartida,
  encerrarTurno,
  mudarLei,
  preverLei,
  verPartida,
  type Partida,
} from "../app/partida";
import { updateStock, type VariableDefinition } from "../engine";

function nova(): Partida {
  const criada = criarPartida({ ocorrencias: false, eleicao: false });
  if (!criada.ok) throw new Error(criada.erros.join(" "));
  return criada.value;
}

/** Leva todos os impostos e todas as leis de gasto a um extremo. */
function extremo(partida: Partida, impostos: "min" | "max"): Partida {
  let atual = partida;
  for (const lei of verPartida(partida).leis) {
    const alvo =
      lei.grupo === "tributaria"
        ? impostos === "min"
          ? lei.minimo
          : lei.maximo
        : lei.grupo === "orcamentaria"
          ? impostos === "min"
            ? lei.maximo
            : lei.minimo
          : undefined;
    if (alvo === undefined) continue;
    // lei com opções (ex.: imposto sobre apostas) vai à opção da ponta
    const valores = lei.opcoes?.map((o) => o.valor) ?? [];
    const ponta = valores.length
      ? alvo === lei.minimo
        ? Math.min(...valores)
        : Math.max(...valores)
      : alvo;
    const mudada = mudarLei(atual, lei.id, ponta);
    if (!mudada.ok) {
      if (
        lei.grupo === "orcamentaria" &&
        mudada.erros.some((erro) => erro.includes("100% do PIB"))
      )
        continue;
      throw new Error(`${lei.id}: ${mudada.erros.join(" ")}`);
    }
    atual = mudada.value;
  }
  return atual;
}

function confereContas(partida: Partida) {
  const { percentualPib: c } = verPartida(partida).contas;
  const v = partida.game.execution.values;
  expect(v.resultado_fiscal).toBeCloseTo(
    v.arrecadacao - v.gasto_publico - v.juros_da_divida,
    6,
  );
  return c;
}

describe("SG159 — contas sem furos", () => {
  it("a conta fecha todo turno, mesmo com impostos zerados (A2)", () => {
    let partida = extremo(nova(), "min");
    let maiorDeficit = 0;
    for (let t = 0; t < 40; t++) {
      const passou = encerrarTurno(partida);
      if (!passou.ok) throw new Error(`turno ${t + 1}: ${passou.erros}`);
      partida = passou.value.partida;
      const c = confereContas(partida);
      maiorDeficit = Math.max(maiorDeficit, -c.resultado);
    }
    // A soma dos gastos respeita o teto; o déficit permitido entra na dívida.
    expect(maiorDeficit).toBeGreaterThan(30);
    // e a dívida passa dos 300% sem travar o turno (A1)
    expect(partida.game.execution.values.divida_publica).toBeGreaterThan(300);
  }, 60_000);

  // Religado na fase 5: sem o teto de 10% do PIB, o superávit acumula no cofre.
  it("superávit enorme também não trava: o cofre passa de 100% (A1)", () => {
    let partida = extremo(nova(), "max");
    for (let t = 0; t < 72; t++) {
      const passou = encerrarTurno(partida);
      if (!passou.ok) throw new Error(`turno ${t + 1}: ${passou.erros}`);
      partida = passou.value.partida;
      confereContas(partida);
    }
    expect(verPartida(partida).contas.percentualPib.cofre).toBeGreaterThan(100);
  }, 90_000);

  it("estoque comum para no limite em vez de travar", () => {
    const escolaridade: VariableDefinition = {
      id: "escolaridade",
      tipo: "estoque",
      nome: "Escolaridade",
      unidade: "indice_0_100",
      dominio: { minimo: 0, maximo: 100 },
    };
    const r = updateStock(
      escolaridade,
      95,
      [{ relationId: "r", value: 20, unit: "indice_0_100_por_passo" }],
      1,
    );
    expect(r).toMatchObject({ ok: true, value: { value: 100, limited: true } });
  });

  it("o domínio das leis e o limite conjunto aparecem na partida (N1)", () => {
    // A lei de aumento real só pode ser testada quando o reajuste fica a
    // cargo de votação anual, como exige o próprio conteúdo da lei.
    const inicio = nova();
    const liberada = mudarLei(inicio, "formula-do-salario-minimo", 0);
    if (!liberada.ok) throw new Error(liberada.erros.join(" "));
    const partida = liberada.value;
    for (const lei of verPartida(partida).leis) {
      if (
        lei.opcoes ||
        lei.maximo === undefined ||
        lei.grupo === "orcamentaria"
      )
        continue;
      expect(mudarLei(partida, lei.id, lei.maximo).ok, lei.id).toBe(true);
      expect(mudarLei(partida, lei.id, lei.maximo * 1.01 + 1).ok, lei.id).toBe(
        false,
      );
    }
    // Valor fixo pode usar até o PIB inteiro como escala na tela, mas a
    // ação respeita a soma de todas as verbas.
    const farmacia = verPartida(partida).leis.find(
      (l) => l.id === "farmacia-popular",
    )!;
    expect(farmacia.unidade).toBe("moeda_ano");
    expect(farmacia.maximo).toBeGreaterThan(farmacia.nivel);
    expect(mudarLei(partida, farmacia.id, farmacia.maximo!).ok).toBe(false);
    // A vinculação constitucional pode chegar a 100% da receita, desde que
    // caiba no teto conjunto de gastos.
    const educacao = verPartida(partida).leis.find(
      (l) => l.id === "piso-educacao",
    )!;
    expect(educacao.maximo).toBe(100);
  });

  it("a prévia recusa horizonte inválido (N3)", () => {
    const partida = nova();
    for (const horizonte of [0, -1, 0.5, Number.NaN, Infinity])
      expect(
        preverLei(partida, "controle-de-precos", 100, horizonte).ok,
        String(horizonte),
      ).toBe(false);
    expect(
      preverLei(
        partida,
        "controle-de-precos",
        100,
        MAXIMO_TRIMESTRES_PREVIA + 1,
      ).ok,
    ).toBe(false);
    expect(preverLei(partida, "controle-de-precos", 100, 1).ok).toBe(true);
  });

  it("repetir a meta que já vale não vira ação (N4)", () => {
    const partida = nova();
    const lei = verPartida(partida).leis.find(
      (l) => l.id === "imposto-renda-pessoas",
    )!;
    let atual = partida;
    for (let i = 0; i < 50; i++) {
      const r = mudarLei(atual, lei.id, lei.meta);
      if (!r.ok) throw new Error(r.erros.join(" "));
      atual = r.value;
    }
    expect(atual).toBe(partida);
    expect(atual.acoes).toBe(0);
  });
});
