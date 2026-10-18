/**
 * SG157 fase 1 — aceite do orçamento na rede (D-47 a D-50), com o Brasil real.
 */
import { describe, expect, it } from "vitest";
import {
  BOLHAS_DO_ORCAMENTO,
  criarPartida,
  encerrarTurno,
  mudarLei,
  preverLei,
  verPartida,
  type Partida,
} from "../app/partida";
import { calculateContribution } from "../engine";

function nova(): Partida {
  const criada = criarPartida({ ocorrencias: false });
  if (!criada.ok) throw new Error(criada.erros.join(" "));
  return criada.value;
}

function turno(partida: Partida): Partida {
  const passou = encerrarTurno(partida);
  if (!passou.ok) throw new Error(passou.erros.join(" "));
  return passou.value.partida;
}

const valor = (partida: Partida, id: string) =>
  partida.game.execution.values[id];

describe("SG157 — orçamento na rede", () => {
  it("as contas fecham: resultado = receita − gasto − juros", () => {
    const partida = nova();
    const { percentualPib: c } = verPartida(partida).contas;
    expect(c.resultado).toBeCloseTo(c.receita - c.gasto - c.juros, 6);
    // O Brasil começa com déficit: o primeiro problema a resolver.
    expect(c.resultado).toBeLessThan(0);
  });

  it("subir o IVA aumenta a receita no mesmo turno", () => {
    const partida = nova();
    const iva = verPartida(partida).leis.find(
      (lei) => lei.id === "imposto-sobre-consumo",
    )!;
    const mudada = mudarLei(partida, iva.id, iva.nivel + 3);
    if (!mudada.ok) throw new Error(mudada.erros.join(" "));
    const sem = turno(partida);
    const com = turno(mudada.value);
    expect(valor(com, "arrecadacao")).toBeGreaterThan(
      valor(sem, "arrecadacao"),
    );
    // A lei mostra quanto arrecada, e arrecada mais que sem a mudança.
    const saldo = (p: Partida) =>
      verPartida(p).leis.find((lei) => lei.id === iva.id)!.saldoAnual;
    expect(iva.saldoAnual).toBeGreaterThan(0);
    expect(saldo(com)).toBeGreaterThan(saldo(sem));
  });

  it("receita = alíquota × base: consumo menor, receita menor", () => {
    const partida = nova();
    const relacao = partida.graph.relations.find(
      (r) =>
        r.targetId === "arrecadacao" &&
        r.originId === "aliquota_imposto_sobre_consumo",
    )!;
    expect(relacao.normalization?.fator).toBe("consumo");
    expect(relacao.readsLevel).toBe(true);
    const com = (consumo: number) => {
      const r = calculateContribution(relacao, 26.5, (id) =>
        id === "consumo" ? consumo : undefined,
      );
      if (!r.ok) throw new Error(r.diagnostics[0].message);
      return r.value.value;
    };
    expect(com(24)).toBeCloseTo(com(48) / 2, 8);
  });

  it("déficit soma na dívida e superávit abate", () => {
    let partida = nova();
    const resultado = valor(partida, "resultado_fiscal");
    const antes = valor(partida, "divida_publica");
    expect(resultado).toBeLessThan(0);
    partida = turno(partida);
    const subiu = valor(partida, "divida_publica") - antes;
    expect(subiu).toBeGreaterThan(0);
    // Um trimestre de déficit anual: em torno de −resultado ÷ 4.
    expect(subiu).toBeGreaterThan(-resultado / 4 / 3);
    expect(subiu).toBeLessThan((-resultado / 4) * 3);
    const relacao = partida.graph.relations.find(
      (r) =>
        r.originId === "resultado_fiscal" && r.targetId === "divida_publica",
    )!;
    const taxa = (x: number) => {
      const r = calculateContribution(relacao, x, () => undefined);
      if (!r.ok) throw new Error(r.diagnostics[0].message);
      return r.value.value;
    };
    // Mês de superávit de 6% do PIB ao ano abate meio ponto da dívida.
    expect(taxa(6)).toBeCloseTo(-0.5, 8);
    expect(taxa(-6)).toBeCloseTo(0.5, 8);
  });

  it("juros = taxa × dívida, e uma dívida só", () => {
    const partida = nova();
    const v = partida.game.execution.values;
    // taxa e dívida do fim do mês anterior (o último do aquecimento, V1-07)
    const antes = partida.game.execution.history[0].values;
    expect(v.juros_da_divida).toBeCloseTo(
      (0.7 * antes.taxa_juros * antes.divida_publica) / 100,
      6,
    );
    const contas = verPartida(partida).contas;
    expect(contas.divida).toBeCloseTo(
      (v[BOLHAS_DO_ORCAMENTO.divida] * contas.pib) / 100,
      3,
    );
    // A tela vê a dívida também empurrando os juros.
    expect(
      verPartida(partida).ligacoes.some(
        (l) =>
          l.origem === "divida_publica" &&
          l.alvo === "juros_da_divida" &&
          l.mecanismo === "produto",
      ),
    ).toBe(true);
  });

  it("lei de gasto custa o que foi aprovado e piora o resultado", () => {
    const partida = nova();
    const saude = verPartida(partida).leis.find(
      (l) => l.id === "farmacia-popular",
    )!;
    // Elo contábil: custa exatamente o nível, sem a eficácia.
    expect(saude.saldoAnual).toBeCloseTo(-saude.nivel, 0);
    const previa = preverLei(partida, saude.id, saude.nivel * 3 + 50_000, 4);
    if (!previa.ok) throw new Error(previa.erros.join(" "));
    const resultado = previa.value.efeitos.find(
      (e) => e.id === "resultado_fiscal",
    )!;
    expect(resultado.comMudanca.at(-1)!).toBeLessThan(
      resultado.semMudanca.at(-1)!,
    );
  });

  it("fecha o ciclo do IVA: alíquota, caixa, consumo, PIB e nova receita", () => {
    const partida = nova();
    const iva = verPartida(partida).leis.find(
      (lei) => lei.id === "imposto-sobre-consumo",
    )!;
    const mudada = mudarLei(partida, iva.id, iva.nivel + 3);
    if (!mudada.ok) throw new Error(mudada.erros.join(" "));
    let sem = partida;
    let com = mudada.value;
    const antes = {
      consumo: valor(partida, "consumo"),
      pib: valor(partida, "pib"),
      receita: valor(partida, "arrecadacao"),
    };
    sem = turno(sem);
    com = turno(com);
    expect(valor(com, "arrecadacao")).toBeGreaterThan(
      valor(sem, "arrecadacao"),
    );
    expect(valor(com, "resultado_fiscal")).toBeGreaterThan(
      valor(sem, "resultado_fiscal"),
    );
    expect(
      valor(com, "cofre") -
        valor(sem, "cofre") +
        valor(sem, "divida_publica") -
        valor(com, "divida_publica"),
    ).toBeGreaterThan(0);
    for (let i = 0; i < 3; i++) {
      sem = turno(sem);
      com = turno(com);
    }
    expect(valor(com, "consumo")).toBeLessThan(valor(sem, "consumo"));
    expect(valor(com, "pib")).toBeLessThan(valor(sem, "pib"));
    const relacao = partida.graph.relations.filter(
      (r) =>
        r.targetId === "arrecadacao" &&
        r.originId === "aliquota_imposto_sobre_consumo",
    );
    expect(relacao).toHaveLength(1);
    expect(relacao[0].normalization?.fator).toBe("consumo");
    const aliquota = valor(com, "aliquota_imposto_sobre_consumo");
    const receitaDoIva = (base: number) => {
      const calculo = calculateContribution(relacao[0], aliquota, (id) =>
        id === "consumo" ? base : undefined,
      );
      if (!calculo.ok) throw new Error(calculo.diagnostics[0].message);
      return calculo.value.value;
    };
    expect(receitaDoIva(valor(com, "consumo"))).toBeLessThan(
      receitaDoIva(valor(sem, "consumo")),
    );
    expect(valor(com, "consumo")).not.toBe(antes.consumo);
    expect(valor(com, "pib")).not.toBe(antes.pib);
    expect(valor(com, "arrecadacao")).not.toBe(antes.receita);
  });

  it("investimento sai do caixa agora e afeta produtividade e PIB depois", () => {
    const partida = nova();
    const lei = verPartida(partida).leis.find(
      (item) => item.id === "investimento-em-infraestrutura",
    )!;
    const mudada = mudarLei(
      partida,
      lei.id,
      lei.nivel + verPartida(partida).contas.pib * 0.005,
    );
    if (!mudada.ok) throw new Error(mudada.erros.join(" "));
    let sem = partida;
    let com = mudada.value;
    sem = turno(sem);
    com = turno(com);
    expect(valor(com, "gasto_publico")).toBeGreaterThan(
      valor(sem, "gasto_publico"),
    );
    expect(valor(com, "resultado_fiscal")).toBeLessThan(
      valor(sem, "resultado_fiscal"),
    );
    for (let i = 0; i < 7; i++) {
      sem = turno(sem);
      com = turno(com);
    }
    expect(valor(com, "produtividade")).toBeGreaterThan(
      valor(sem, "produtividade"),
    );
    expect(valor(com, "pib")).toBeGreaterThan(valor(sem, "pib"));
    expect(valor(com, "desemprego")).toBeLessThan(valor(sem, "desemprego"));
    expect(valor(com, "consumo")).toBeGreaterThan(valor(sem, "consumo"));
    expect(valor(com, "arrecadacao")).toBeGreaterThan(
      valor(sem, "arrecadacao"),
    );
    expect(
      partida.graph.relations.filter(
        (r) =>
          r.originId === "recursos_investimento_em_infraestrutura" &&
          r.targetId === "pib",
      ),
    ).toHaveLength(0);
  });

  it("cobra os custos declarados das novas alavancas sem multiplicar pela eficácia", () => {
    const partida = nova();
    const casos = [
      {
        lei: "fundo-de-equalizacao",
        controle: "nivel_fundo_de_equalizacao",
        custos: [
          [33.33, 0],
          [66.67, 0.5],
          [100, 1],
        ],
      },
      {
        lei: "verba-de-publicidade-oficial-e-comunicacao-publica",
        controle: "nivel_verba_de_publicidade_oficial_e_comunicacao_publica",
        custos: [
          [33.33, 0],
          [66.67, 0.007],
          [100, 0.02],
        ],
      },
      {
        lei: "intermediacao-e-qualificacao",
        controle: "nivel_intermediacao_e_qualificacao",
        custos: [
          [0, 0],
          [16.67, 0.05],
          [100, 0.3],
        ],
      },
      {
        lei: "orcamento-do-judiciario",
        controle: "nivel_orcamento_do_judiciario",
        custos: [
          [33.33, 0.6],
          [66.67, 1.2],
          [100, 2],
        ],
      },
      {
        lei: "mutirao-de-cirurgias",
        controle: "nivel_mutirao_de_cirurgias",
        custos: [
          [33.33, 0],
          [66.67, 0.01],
          [100, 0.05],
        ],
      },
      {
        lei: "missoes-de-paz",
        controle: "nivel_missoes_de_paz",
        custos: [
          [0, 0],
          [33.33, 0.001],
          [66.67, 0.005],
          [100, 0.01],
        ],
      },
      {
        lei: "bolsa-de-permanencia-no-ensino-medio",
        controle: "nivel_bolsa_de_permanencia_no_ensino_medio",
        custos: [
          [0, 0],
          [50, 0.1],
          [100, 0.3],
        ],
      },
      {
        lei: "alfabetizacao-na-idade-certa",
        controle: "nivel_alfabetizacao_na_idade_certa",
        custos: [
          [0, 0],
          [33.33, 0.01],
          [66.67, 0.01],
          [100, 0.01],
        ],
      },
      {
        lei: "policiamento-orientado",
        controle: "nivel_policiamento_orientado",
        custos: [
          [0, 0],
          [33.33, 0],
          [66.67, 0.02],
          [100, 0.03],
        ],
      },
      {
        lei: "gestao-da-escola-publica",
        controle: "nivel_gestao_da_escola_publica",
        custos: [
          [0, 0],
          [25, 0],
          [50, 0],
          [100, 0.01],
        ],
      },
    ] as const;
    for (const caso of casos) {
      const relacoes = partida.graph.relations.filter(
        (relacao) =>
          relacao.originId === caso.controle &&
          relacao.targetId === "gasto_publico",
      );
      expect(relacoes).toHaveLength(1);
      const relacao = relacoes[0];
      expect(relacao.readsLevel).toBe(true);
      for (const [nivel, custo] of caso.custos) {
        const calculo = calculateContribution(relacao, nivel, () => undefined);
        if (!calculo.ok) throw new Error(calculo.diagnostics[0].message);
        expect(calculo.value.value).toBeCloseTo(custo, 6);
      }
    }

    const mudada = mudarLei(partida, "fundo-de-equalizacao", 66.67);
    if (!mudada.ok) throw new Error(mudada.erros.join(" "));
    const sem = turno(partida);
    const com = turno(mudada.value);
    expect(valor(com, "gasto_publico")).toBeGreaterThan(
      valor(sem, "gasto_publico"),
    );
    expect(valor(com, "resultado_fiscal")).toBeLessThan(
      valor(sem, "resultado_fiscal"),
    );
  });

  it("policiamento orientado altera gasto, resultado e dívida em partida", () => {
    const partida = nova();
    const mudada = mudarLei(partida, "policiamento-orientado", 100);
    if (!mudada.ok) throw new Error(mudada.erros.join(" "));
    const sem = turno(partida);
    const com = turno(mudada.value);
    expect(valor(com, "gasto_publico")).toBeGreaterThan(
      valor(sem, "gasto_publico"),
    );
    expect(valor(com, "resultado_fiscal")).toBeLessThan(
      valor(sem, "resultado_fiscal"),
    );
    expect(valor(com, "divida_publica")).toBeGreaterThan(
      valor(sem, "divida_publica"),
    );
  });
});
