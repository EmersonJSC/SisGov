// Estoque de casas: déficit e favela saem da contagem; governo e empresas constroem.
import { describe, expect, it } from "vitest";
import {
  andarMoradia,
  indicesDaMoradia,
  moradiaInicial,
  type RegraDaMoradia,
  type RegraDasObras,
  type TurnoDaMoradia,
} from "../motor";
import { avancar, criarPartida, jogar, previaDaLei } from ".";

const base = () => criarPartida("teste", 42, { semCongresso: true });

const regra: RegraDaMoradia = {
  indice_deficit: "d",
  indice_favela: "f",
  indice_preco: "p",
  lei_verba: "v",
  pessoas_por_familia: 3,
  custo_casa: 4,
  autoconstrucao: 0.05,
};
const obras: RegraDasObras = {
  setor: "s",
  indice_atraso: "a",
  prazo: 4,
  desgaste: 0.04,
};
const pais = {
  populacao: 3_000_000,
  deficit: 20,
  favela: 15,
  verba: 0,
  atraso: 0,
};
const parado: TurnoDaMoradia = {
  populacao: pais.populacao,
  verba: 0,
  atraso: 0,
  atraso_inicial: 0,
  setor: 1,
  preco: 1,
  animo: 1,
};

/** Índices depois de `turnos` turnos com as mesmas condições. */
function depois(turnos: number, mudanca: Partial<TurnoDaMoradia> = {}) {
  let m = moradiaInicial(regra, obras, pais);
  for (let t = 0; t < turnos; t++)
    m = andarMoradia(regra, obras, m, { ...parado, ...mudanca });
  return indicesDaMoradia(regra, m, pais.populacao);
}

describe("estoque de casas (motor)", () => {
  it("a contagem do turno 0 devolve os índices do país", () => {
    const m = moradiaInicial(regra, obras, pais);
    const { deficit, favela } = indicesDaMoradia(regra, m, pais.populacao);
    expect(deficit).toBeCloseTo(20);
    expect(favela).toBeCloseTo(15);
  });

  it("com tudo como no turno 0, o país fica parado", () => {
    expect(depois(30).deficit).toBeCloseTo(20, 1);
    expect(depois(30).favela).toBeCloseTo(15, 1);
  });

  it("sem obra nova, as casas desgastam e a favela cresce", () => {
    const { deficit, favela } = depois(30, { animo: 0 });
    expect(deficit).toBeGreaterThan(25);
    expect(favela).toBeGreaterThan(15);
  });

  it("preço alto faz as empresas construírem mais", () => {
    expect(depois(30, { preco: 1.5 }).deficit).toBeLessThan(depois(30).deficit);
  });

  it("corrupção faz a mesma verba render menos casas", () => {
    const limpo = depois(30, { verba: 0.02 }).deficit;
    const sujo = depois(30, { verba: 0.02, atraso: 80 }).deficit;
    expect(limpo).toBeLessThan(20);
    expect(sujo).toBeGreaterThan(limpo);
  });

  it("a casa do governo só chega depois do prazo da obra", () => {
    expect(depois(4, { verba: 0.03 }).deficit).toBeCloseTo(depois(4).deficit);
    expect(depois(6, { verba: 0.03 }).deficit).toBeLessThan(depois(6).deficit);
  });
});

describe("estoque na partida", () => {
  it("o turno 0 conta as casas do país", () => {
    const { moradia, jogabilidade, essenciais } = base().estado;
    expect(moradia?.formais).toBeCloseTo(
      (essenciais.populacao / 3) *
        (1 - jogabilidade.deficit_habitacional / 100),
    );
  });

  it("verba de habitação alta derruba o déficit e, com o tempo, o preço e a favela", () => {
    const sem = jogar(base(), 20).estado.jogabilidade;
    const com = jogar(
      avancar(base(), [
        { tipo: "mudar_lei", lei: "verba-habitacao", valor: 0.03 },
      ]),
      19,
    ).estado.jogabilidade;
    expect(com.deficit_habitacional).toBeLessThan(sem.deficit_habitacional);
    expect(com.preco_moradia).toBeLessThan(sem.preco_moradia);
    expect(com.favela).toBeLessThan(sem.favela);
  });

  it("a ficha da verba mostra o que ela tira por ano, depois da obra", () => {
    const { indices } = previaDaLei(base(), "verba-habitacao", 0.03);
    const deficit = indices.find((i) => i.id === "deficit_habitacional");
    expect(deficit?.pontos).toBeLessThan(0);
    expect(deficit?.porAno).toBe(true);
    expect(deficit?.atrasoMeses).toBeGreaterThan(0);
    expect(indices.some((i) => i.id === "favela")).toBe(true);
  });
});
