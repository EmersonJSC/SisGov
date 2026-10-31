/**
 * V1-34: leis em camadas. A mesa do salário mínimo tem três camadas: quem
 * decide (Constituição), o reajuste (lei) e o aumento real (alavanca, só sem
 * regra automática). O nível do mínimo é um estoque em % da mediana dos salários
 * (23/out): sobe com o aumento real e cai com o crescimento dos salários.
 */
import { beforeAll, describe, expect, it } from "vitest";
import {
  criarPartida,
  encerrarTurno,
  mudarLei,
  verPartida,
  type Partida,
} from "../app/partida";

const QUEM = "quem-decide-o-salario-minimo";
const FORMULA = "formula-do-salario-minimo";
const AUMENTO = "aumento-real-do-salario-minimo";

let partida: Partida;
beforeAll(() => {
  const r = criarPartida({ ocorrencias: false });
  if (!r.ok) throw new Error(r.erros.join("\n"));
  partida = r.value;
});

const lei = (p: Partida, id: string) =>
  verPartida(p).leis.find((l) => l.id === id)!;
const valorDa = (p: Partida, id: string, opcao: string) =>
  p.content.policies
    .find((x) => x.id === id)!
    .controle.opcoes!.find((o) => o.id === opcao)!.valor;
function mudar(p: Partida, id: string, opcao: string): Partida {
  const r = mudarLei(p, id, valorDa(p, id, opcao));
  if (!r.ok) throw new Error(r.erros.join("\n"));
  return r.value;
}
function turnos(p: Partida, n: number): Partida {
  for (let i = 0; i < n; i += 1) {
    const r = encerrarTurno(p);
    if (!r.ok) throw new Error(r.erros.join("\n"));
    p = r.value.partida;
  }
  return p;
}
const v = (p: Partida, id: string) => p.game.execution.values[id];

describe("mesa do salário mínimo", () => {
  it("as três camadas, de cima para baixo; o aumento livre começa fora", () => {
    const mesa = lei(partida, AUMENTO).mesa!;
    expect(mesa.camadas.map((c) => [c.lei, c.camada, c.emVigor])).toEqual([
      [QUEM, "constituicao", true],
      [FORMULA, "lei", true],
      [AUMENTO, "alavanca", false],
    ]);
    expect(v(partida, "salario_minimo_relativo")).toBeCloseTo(66, 0);
  });

  it("com regra de reajuste, o aumento é automático e o controle fica travado", () => {
    const r = mudarLei(partida, AUMENTO, 10);
    expect(r.ok).toBe(false);
    if (!r.ok)
      expect(r.erros.join(" ")).toContain("Reajuste do salário mínimo");
    // inflação + PIB: o mínimo acompanha os outros salários
    const p = turnos(partida, 8);
    expect(v(p, "salario_minimo_relativo")).toBeCloseTo(66, 0);
  });

  it("sem regra, o jogador escolhe o aumento: +10% ao ano sobe o mínimo", () => {
    let p = mudar(partida, FORMULA, "sem-regra");
    const r = mudarLei(p, AUMENTO, 10);
    if (!r.ok) throw new Error(r.erros.join("\n"));
    p = turnos(r.value, 6);
    expect(v(p, "salario_minimo_relativo")).toBeGreaterThan(70);
    expect(v(p, "aumento_real_do_minimo")).toBeCloseTo(10, 0);
  });

  it("cortar em dinheiro derruba o apoio e traz greve", () => {
    let p = mudar(partida, FORMULA, "sem-regra");
    const r = mudarLei(p, AUMENTO, -20);
    if (!r.ok) throw new Error(r.erros.join("\n"));
    const base = turnos(partida, 4);
    p = turnos(r.value, 6);
    expect(v(p, "reajuste_nominal_do_minimo")).toBeLessThan(0);
    expect(v(p, "popularidade_governo")).toBeLessThan(
      v(base, "popularidade_governo") - 5,
    );
    expect(v(p, "greve_geral")).toBeGreaterThan(0);
  });

  it("sem salário mínimo na Constituição, a regra sai e o mínimo deixa de valer", () => {
    const p = turnos(mudar(partida, QUEM, "nao-existe"), 1);
    expect(lei(p, FORMULA).emVigor).toBe(false);
    expect(v(p, "salario_minimo_efetivo")).toBe(0);
  });

  it("com comissão técnica, a fórmula fica entre as que a comissão usa", () => {
    const p = mudar(partida, QUEM, "comissao-tecnica");
    const formula = lei(p, FORMULA);
    expect(formula.emVigor).toBe(true);
    expect([
      valorDa(p, FORMULA, "so-inflacao"),
      valorDa(p, FORMULA, "meta-da-mediana"),
    ]).toContain(formula.meta);
    expect(
      formula.opcoes!.find((o) => o.id === "inflacao-mais-pib")!.trava?.lei,
    ).toBe(QUEM);
  });

  it("o gasto do governo vem dos benefícios atrelados, não do mínimo", () => {
    const gasto = (reajuste: string) => {
      let p = mudar(partida, "reajuste-de-beneficios", reajuste);
      p = mudar(p, FORMULA, "sem-regra");
      const r = mudarLei(p, AUMENTO, 15);
      if (!r.ok) throw new Error(r.erros.join("\n"));
      const sem = turnos(p, 4);
      return v(turnos(r.value, 4), "gasto_publico") - v(sem, "gasto_publico");
    };
    expect(gasto("salario-minimo")).toBeGreaterThan(0.1);
    expect(Math.abs(gasto("discricionario"))).toBeLessThan(0.05);
  });
});
