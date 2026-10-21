/**
 * Cofre (SG157 fase 4; V1-07): dívida e cofre são dois estoques. A lei
 * "Destino do resultado fiscal" reparte o superávit entre os dois; o déficit
 * sai do cofre na mesma parte e o resto vira dívida. Com dívida, o cofre tem
 * teto de 10% do PIB. O cofre rende juros e, pela lei "Uso do cofre", pode ser
 * emprestado ou virar obra.
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

/** Mesma partida com dívida e cofre trocados (dois estoques, V1-07). */
function comContas(partida: Partida, divida: number, cofre: number): Partida {
  const execution = partida.game.execution;
  return {
    ...partida,
    game: {
      ...partida.game,
      execution: {
        ...execution,
        values: { ...execution.values, divida_publica: divida, cofre },
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
  it("o Brasil 2026 começa sem cofre, dividindo o resultado", () => {
    const visao = verPartida(nova());
    expect(visao.contas.cofre).toBe(0);
    expect(visao.bolhas.find((b) => b.id === "cofre")!.valor).toBe(0);
    const fundo = visao.leis.find((l) => l.id === "fundo-soberano")!;
    expect(fundo.opcaoAtual).toBe("guardar");
    const destino = visao.leis.find(
      (l) => l.id === "destino-do-resultado-fiscal",
    )!;
    expect(destino.opcaoAtual).toBe("dividir");
  });

  it("com dívida, o superávit paga a dívida e enche o cofre ao mesmo tempo", () => {
    const iva = mudarLei(comContas(nova(), 5, 0), "imposto-sobre-consumo", 30);
    if (!iva.ok) throw new Error(iva.erros.join(" "));
    const depois = turnos(iva.value, 4);
    expect(v(depois, "resultado_fiscal")).toBeGreaterThan(0);
    expect(v(depois, "divida_publica")).toBeLessThan(5);
    expect(v(depois, "divida_publica")).toBeGreaterThan(0);
    expect(v(depois, "cofre")).toBeGreaterThan(0);
  });

  it("'tudo para a dívida' não guarda nada no cofre", () => {
    const iva = mudarLei(comContas(nova(), 5, 0), "imposto-sobre-consumo", 30);
    if (!iva.ok) throw new Error(iva.erros.join(" "));
    const depois = turnos(
      lei(iva.value, "destino-do-resultado-fiscal", "pagar-a-divida"),
      4,
    );
    expect(v(depois, "cofre")).toBe(0);
    expect(v(depois, "divida_publica")).toBeLessThan(5);
  });

  it("sem dívida, todo o superávit vai para o cofre, que rende juros", () => {
    const iva = mudarLei(
      comContas(nova(), 0.5, 0),
      "imposto-sobre-consumo",
      30,
    );
    if (!iva.ok) throw new Error(iva.erros.join(" "));
    const depois = turnos(iva.value, 9);
    expect(v(depois, "resultado_fiscal")).toBeGreaterThan(0);
    const contas = verPartida(depois).contas;
    expect(v(depois, "divida_publica")).toBe(0);
    expect(contas.divida).toBe(0);
    expect(contas.cofre).toBeGreaterThan(0);
    // juros negativos = rendimento do cofre
    expect(contas.juros).toBeLessThan(0);
  });

  it("com dívida, o cofre não passa do teto: o resto abate a dívida", () => {
    const iva = mudarLei(
      comContas(nova(), 5, 9.9),
      "imposto-sobre-consumo",
      30,
    );
    if (!iva.ok) throw new Error(iva.erros.join(" "));
    const depois = turnos(
      lei(iva.value, "destino-do-resultado-fiscal", "guardar"),
      4,
    );
    expect(v(depois, "cofre")).toBeLessThanOrEqual(10 + 1e-9);
    expect(v(depois, "divida_publica")).toBeLessThan(5);
  });

  it("déficit gasta o cofre e o que falta vira dívida", () => {
    const comCofre = comContas(nova(), 50, 10);
    // corta o IVA pela metade: déficit
    const corte = mudarLei(comCofre, "imposto-sobre-consumo", 13.35);
    if (!corte.ok) throw new Error(corte.erros.join(" "));
    const depois = turnos(corte.value, 4);
    expect(v(depois, "resultado_fiscal")).toBeLessThan(0);
    expect(v(depois, "cofre")).toBeLessThan(10);
    expect(v(depois, "divida_publica")).toBeGreaterThan(50);
  });

  it("emprestar o cofre às empresas mexe no crédito e no investimento", () => {
    const comCofre = comContas(nova(), 0, 10);
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
    const comCofre = comContas(nova(), 0, 10);
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
