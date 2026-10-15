/**
 * SG157 fase 2 (D-52): custo de cada opção (`pontos`) e custos que reagem
 * ao país (`escala`).
 */
import { describe, expect, it } from "vitest";
import {
  criarPartida,
  mudarLei,
  verPartida,
  type Partida,
} from "../app/partida";
import {
  calculateContribution,
  validateContentFile,
  type ConsequenceFile,
  type GraphRelation,
} from "../engine";
import { scaleConsequenceParameters } from "../game/prepareMonthlyContent";

function relation(
  parameters: ConsequenceFile["parametros"],
  scale?: ConsequenceFile["escala"],
): GraphRelation {
  return {
    id: "r",
    sourceId: "lei",
    sourceType: "lei",
    sourcePath: "lei.json",
    consequenceId: "c",
    consequencePath: "c.json",
    originId: "nivel",
    targetId: "gasto",
    mechanism: "pontos",
    parameters,
    scale,
    unit: "percentual_pib",
    delaySteps: 0,
    duration: { modo: "continuo" },
  };
}

const valor = (
  rel: GraphRelation,
  x: number,
  nodes: Record<string, number> = {},
) => {
  const r = calculateContribution(rel, x, (id) => nodes[id]);
  if (!r.ok) throw new Error(r.diagnostics[0].message);
  return r.value.value;
};

describe("SG157 fase 2 — mecanismo pontos", () => {
  const tabela = relation({
    pontos: [
      [0, 0.5],
      [33, 0],
      [67, 0.15],
      [100, 0.4],
    ],
  });

  it("vale o ponto de cada opção e liga as opções em retas", () => {
    expect(valor(tabela, 0)).toBe(0.5);
    expect(valor(tabela, 33)).toBe(0);
    expect(valor(tabela, 100)).toBe(0.4);
    expect(valor(tabela, 50)).toBeCloseTo(0.075);
    // Fora da tabela, o ponto da ponta.
    expect(valor(tabela, 140)).toBe(0.4);
    expect(valor(tabela, -5)).toBe(0.5);
  });

  it("a conversão trimestre → mês é exata", () => {
    for (const [k, d] of [
      [3, 3],
      [1, 3],
      [3, 1],
    ]) {
      const mensal = relation(
        scaleConsequenceParameters("pontos", tabela.parameters, k, d),
      );
      for (const x of [0, 5, 11, 20, 40])
        expect(valor(mensal, x)).toBeCloseTo(valor(tabela, k * x) / d, 10);
    }
  });

  it("escala: o custo reage a um nó (seguro × desemprego)", () => {
    const seguro = relation(
      {
        pontos: [
          [0, 0],
          [100, 0.6],
        ],
      },
      { fator: "desemprego", referencia: 14 },
    );
    expect(valor(seguro, 100, { desemprego: 14 })).toBeCloseTo(0.6);
    expect(valor(seguro, 100, { desemprego: 28 })).toBeCloseTo(1.2);
    const r = calculateContribution(seguro, 100, () => 7);
    expect(r).toMatchObject({ ok: true, value: { scaleValue: 7 } });
  });

  it("valida a tabela e a escala", () => {
    const check = (fields: Record<string, unknown>) =>
      validateContentFile(
        "c.json",
        JSON.stringify({
          id: "c",
          tipo: "consequencia",
          versaoEsquema: 1,
          origem: "a",
          alvo: "b",
          mecanismo: "pontos",
          unidade: "percentual_pib",
          atrasoPassos: 0,
          duracao: { modo: "continuo" },
          ...fields,
        }),
      );
    expect(
      check({
        parametros: {
          pontos: [
            [0, 0],
            [100, 1],
          ],
        },
        escala: { fator: "desemprego", referencia: 14 },
      }).ok,
    ).toBe(true);
    expect(check({ parametros: { pontos: [[0, 1]] } }).ok).toBe(false);
    expect(
      check({
        parametros: {
          pontos: [
            [50, 0],
            [10, 1],
          ],
        },
      }).ok,
    ).toBe(false);
    expect(
      check({
        parametros: {
          pontos: [
            [0, 0],
            [100, 1],
          ],
        },
        escala: { fator: "desemprego", referencia: 0 },
      }).ok,
    ).toBe(false);
  });
});

function nova(): Partida {
  const criada = criarPartida({ ocorrencias: false });
  if (!criada.ok) throw new Error(criada.erros.join(" "));
  return criada.value;
}

describe("SG157 fase 2 — custos das leis no Brasil", () => {
  const partida = nova();
  const visao = verPartida(partida);
  const lei = (id: string) => visao.leis.find((l) => l.id === id)!;

  it("cada opção mostra o seu custo, e trocar de opção muda o custo", () => {
    const drogas = lei("lei-de-drogas");
    const custos = drogas.opcoes!.map((o) => o.saldoAnual);
    // Prender o usuário custa mais (presídio) que tratá-lo como saúde.
    expect(custos[0]).toBeLessThan(custos[2]);
    expect(custos[0]).toBeLessThan(0);
    expect(drogas.saldoAnual).toBeCloseTo(
      drogas.opcoes!.find((o) => o.id === drogas.opcaoAtual)!.saldoAnual,
      0,
    );
    const mudada = mudarLei(partida, drogas.id, drogas.opcoes![2].valor);
    expect(mudada.ok).toBe(true);
  });

  it("custo pode estar nas pontas do eixo (matriz energética)", () => {
    const matriz = lei("matriz-energetica").opcoes!.map((o) => o.saldoAnual);
    // Subsídio fóssil e transição forçada custam mais que a matriz neutra.
    expect(matriz[0]).toBeLessThan(matriz[1]);
    expect(matriz[3]).toBeLessThan(matriz[1]);
  });

  it("estatais e royalties arrecadam; renúncia tira receita", () => {
    expect(lei("regime-do-petroleo-e-mineracao").saldoAnual).toBeGreaterThan(0);
    expect(lei("papel-do-estado-empresario").opcoes![2].saldoAnual).not.toBe(0);
    expect(
      lei("regime-simplificado-para-pequenas-empresas").saldoAnual,
    ).toBeLessThan(0);
  });

  it("custos que reagem: seguro-desemprego segue o desemprego", () => {
    const rel = partida.graph.relations.find(
      (r) =>
        r.originId === "nivel_seguro_desemprego" &&
        r.targetId === "gasto_publico",
    )!;
    expect(rel.mechanism).toBe("pontos");
    expect(rel.scale?.fator).toBe("desemprego");
    expect(
      visao.ligacoes.some(
        (l) => l.origem === "desemprego" && l.alvo === "gasto_publico",
      ),
    ).toBe(true);
    const nivel = partida.game.execution.values.nivel_seguro_desemprego;
    const custo = (desemprego: number) => valor(rel, nivel, { desemprego });
    expect(custo(28)).toBeCloseTo(2 * custo(14), 8);
  });

  it("previdência reage ao envelhecimento", () => {
    const rel = partida.graph.relations.find(
      (r) =>
        r.originId === "nivel_sistema_previdenciario" &&
        r.targetId === "gasto_publico",
    )!;
    expect(rel.scale?.fator).toBe("envelhecimento");
  });

  it("o Brasil começa com déficit e contas do setor público inteiro", () => {
    const c = visao.contas.percentualPib;
    expect(c.receita).toBeGreaterThan(25);
    expect(c.receita).toBeLessThan(36);
    expect(c.gasto).toBeGreaterThan(25);
    expect(c.gasto).toBeLessThan(36);
    expect(c.resultado).toBeLessThan(-3);
    expect(c.resultado).toBeGreaterThan(-12);
  });

  it("nenhuma lei de opções tem menos de 3 opções (três níveis: 2 a 3)", () => {
    for (const l of visao.leis)
      if (l.opcoes && l.nivelLegal)
        expect(l.opcoes.length, l.id).toBeGreaterThanOrEqual(2);
      else if (l.opcoes)
        expect(l.opcoes.length, l.id).toBeGreaterThanOrEqual(3);
  });
});
