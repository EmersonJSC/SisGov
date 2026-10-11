/**
 * SG157 fase 4 (D-49, D-57): sem dívida, o superávit enche o cofre; o cofre
 * rende juros, cobre déficits e, pela lei "Uso do cofre", pode ser emprestado
 * ou virar obra.
 */
import { describe, expect, it } from "vitest";
import {
  criarPartida,
  encerrarTurno,
  mudarLei,
  verPartida,
  type Partida,
} from "../app/partida";

function nova(): Partida {
  const criada = criarPartida({ ocorrencias: false });
  if (!criada.ok) throw new Error(criada.erros.join(" "));
  return criada.value;
}

/** Mesma partida com a dívida líquida trocada (negativa = cofre). */
function comDivida(partida: Partida, divida: number): Partida {
  const execution = partida.game.execution;
  return {
    ...partida,
    game: {
      ...partida.game,
      execution: {
        ...execution,
        values: { ...execution.values, divida_publica: divida },
      },
    },
  };
}

function turnos(partida: Partida, n: number): Partida {
  let atual = partida;
  for (let i = 0; i < n; i++) {
    const passou = encerrarTurno(atual);
    if (!passou.ok) throw new Error(passou.erros.join(" "));
    atual = passou.value.partida;
  }
  return atual;
}

function lei(partida: Partida, id: string, opcao: string): Partida {
  const visao = verPartida(partida).leis.find((l) => l.id === id)!;
  const valor = visao.opcoes!.find((o) => o.id === opcao)!.valor;
  const mudada = mudarLei(partida, id, valor);
  if (!mudada.ok) throw new Error(mudada.erros.join(" "));
  return mudada.value;
}

const v = (p: Partida, id: string) => p.game.execution.values[id] ?? 0;

describe("SG157 fase 4 — cofre", () => {
  it("o Brasil 2026 começa sem cofre e com a lei em 'guardar'", () => {
    const visao = verPartida(nova());
    expect(visao.contas.cofre).toBe(0);
    expect(visao.bolhas.find((b) => b.id === "cofre")!.valor).toBe(0);
    const fundo = visao.leis.find((l) => l.id === "fundo-soberano")!;
    expect(fundo.opcaoAtual).toBe("guardar");
  });

  it("sem dívida, o superávit enche o cofre e o cofre rende juros", () => {
    // contas primárias com sobra e dívida quase paga
    const quase = comDivida(nova(), 0.5);
    const iva = mudarLei(quase, "imposto-sobre-consumo", 30);
    if (!iva.ok) throw new Error(iva.erros.join(" "));
    const depois = turnos(iva.value, 9);
    expect(v(depois, "resultado_fiscal")).toBeGreaterThan(0);
    const contas = verPartida(depois).contas;
    expect(v(depois, "divida_publica")).toBeLessThan(0);
    expect(contas.divida).toBe(0);
    expect(contas.cofre).toBeGreaterThan(0);
    expect(v(depois, "cofre")).toBeGreaterThan(0);
    // juros negativos = rendimento do cofre
    expect(contas.juros).toBeLessThan(0);
  });

  it("déficit gasta o cofre antes de criar dívida", () => {
    const comCofre = comDivida(nova(), -10);
    // corta o IVA pela metade: déficit
    const corte = mudarLei(comCofre, "imposto-sobre-consumo", 13);
    if (!corte.ok) throw new Error(corte.erros.join(" "));
    const depois = turnos(corte.value, 4);
    expect(v(depois, "resultado_fiscal")).toBeLessThan(0);
    expect(v(depois, "cofre")).toBeLessThan(10);
    expect(v(depois, "divida_publica")).toBeGreaterThan(-10);
  });

  it("emprestar o cofre às empresas mexe no crédito e no investimento", () => {
    const comCofre = comDivida(nova(), -10);
    // a corrupção chega com atraso de um ano: olha dois anos
    const guardar = turnos(comCofre, 8);
    const emprestar = turnos(
      lei(comCofre, "fundo-soberano", "emprestar-empresas"),
      8,
    );
    expect(v(emprestar, "credito")).toBeGreaterThan(v(guardar, "credito") + 1);
    expect(v(emprestar, "investimento")).toBeGreaterThan(
      v(guardar, "investimento"),
    );
    expect(v(emprestar, "pib")).toBeGreaterThan(v(guardar, "pib"));
    expect(v(emprestar, "corrupcao")).toBeGreaterThan(v(guardar, "corrupcao"));
  });

  it("investir em obras gasta o cofre e melhora a infraestrutura", () => {
    const comCofre = comDivida(nova(), -10);
    const guardar = turnos(comCofre, 4);
    const obras = turnos(lei(comCofre, "fundo-soberano", "investir-obras"), 4);
    expect(v(obras, "gasto_publico")).toBeGreaterThan(
      v(guardar, "gasto_publico"),
    );
    expect(v(obras, "cofre")).toBeLessThan(v(guardar, "cofre"));
    expect(v(obras, "infraestrutura")).toBeGreaterThan(
      v(guardar, "infraestrutura"),
    );
  });

  it("sem cofre, a lei não faz nada", () => {
    const partida = nova();
    const guardar = turnos(partida, 2);
    const emprestar = turnos(
      lei(partida, "fundo-soberano", "emprestar-empresas"),
      2,
    );
    expect(v(emprestar, "credito")).toBeCloseTo(v(guardar, "credito"), 8);
  });
});
