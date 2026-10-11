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
    expect(v.juros_da_divida).toBeCloseTo(
      (0.7 * v.taxa_juros * v.divida_publica) / 100,
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
});
