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
import { avancar, criarPartida, jogar, montarVisao, previaDaLei } from ".";

const base = () => criarPartida("teste", 42, { semCongresso: true });

const regra: RegraDaMoradia = {
  indice_deficit: "d",
  indice_favela: "f",
  indice_preco: "p",
  indice_terra: "t",
  indice_pobreza: "b",
  pops_campo: [],
  lei_verba: "v",
  pessoas_por_familia: 3,
  custo_casa: 4,
  autoconstrucao: 0.05,
  campo_por_ponto: 0.01,
  exodo_velocidade: 0.1,
  pobreza_por_ponto: 0.01,
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
  familias_campo: 100_000,
  concentracao: 0,
  pobreza: 0,
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

  it("concentração sobe: famílias saem do campo e o êxodo para no limite", () => {
    const limite = (10 / 100) * 100_000; // 10 pontos, em famílias do campo
    let m = moradiaInicial(regra, obras, pais);
    for (let t = 0; t < 200; t++)
      m = andarMoradia(regra, obras, m, { ...parado, concentracao: 10 });
    expect(m.exodo).toBeCloseTo(limite);
    expect(depois(30, { concentracao: 10 }).deficit).toBeGreaterThan(20.5);
  });

  it("concentração volta: as famílias voltam e o déficit cai", () => {
    let m = moradiaInicial(regra, obras, pais);
    for (let t = 0; t < 100; t++)
      m = andarMoradia(regra, obras, m, { ...parado, concentracao: 10 });
    const alto = indicesDaMoradia(regra, m, pais.populacao).deficit;
    for (let t = 0; t < 100; t++) m = andarMoradia(regra, obras, m, parado);
    expect(m.exodo).toBeLessThan(1);
    expect(indicesDaMoradia(regra, m, pais.populacao).deficit).toBeLessThan(alto);
  });

  it("concentração abaixo do turno 0: o déficit fica menor que no começo", () => {
    expect(depois(30, { concentracao: -10 }).deficit).toBeLessThan(19.5);
  });

  it("só volta quem está sem casa formal", () => {
    const cheio = { ...pais, deficit: 1, favela: 0 };
    let m = moradiaInicial(regra, obras, cheio);
    for (let t = 0; t < 100; t++)
      m = andarMoradia(regra, obras, m, {
        ...parado,
        concentracao: -100,
        animo: 2,
      });
    expect(m.formais).toBeLessThanOrEqual(1_000_000);
    expect(-(m.exodo ?? 0)).toBeLessThanOrEqual(100_000);
  });

  it("pobreza sobe: mais famílias sem casa formal levantam casa precária", () => {
    const { deficit, favela } = depois(100, { pobreza: 10 });
    expect(deficit).toBeCloseTo(20, 1);
    expect(favela).toBeGreaterThan(16.5);
    expect(favela).toBeLessThanOrEqual(deficit);
    expect(depois(100, { pobreza: -10 }).favela).toBeLessThan(13.5);
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

  it("lei que divide a terra tira famílias do déficit", () => {
    const sem = jogar(base(), 20).estado;
    const com = jogar(
      avancar(base(), [
        { tipo: "mudar_lei", lei: "verba-orgao-terras", valor: 0.02 },
      ]),
      19,
    ).estado;
    expect(com.jogabilidade.concentracao_terra).toBeLessThan(
      sem.jogabilidade.concentracao_terra,
    );
    expect(com.moradia?.exodo).toBeLessThan(0);
    expect(com.jogabilidade.deficit_habitacional).toBeLessThan(
      sem.jogabilidade.deficit_habitacional,
    );
  });

  it("a ficha da lei de terra mostra o déficit que ela tira", () => {
    const { indices } = previaDaLei(base(), "verba-orgao-terras", 0.02);
    const terra = indices.find((i) => i.id === "concentracao_terra");
    const deficit = indices.find((i) => i.id === "deficit_habitacional");
    expect(terra?.pontos).toBeLessThan(0);
    expect(deficit?.pontos).toBeLessThan(0);
    expect(deficit?.aosPoucos).toBe(true);
    expect(deficit?.atrasoMeses).toBe(terra?.atrasoMeses);
  });

  it("nenhuma lei repete o déficit na ficha", () => {
    const partida = base();
    for (const [id, lei] of Object.entries(partida.regras.leis)) {
      const valor =
        lei.forma === "continua"
          ? lei.faixa.max
          : lei.opcoes[lei.opcoes.length - 1].id;
      const linhas = previaDaLei(partida, id, valor).indices.filter(
        (i) => i.id === "deficit_habitacional",
      );
      expect(linhas.length).toBeLessThanOrEqual(1);
    }
  });

  it("o mapa liga a concentração ao déficit", () => {
    const ligacao = montarVisao(base()).ligacoes.find(
      (l) =>
        l.origem === "concentracao_terra" &&
        l.alvo === "deficit_habitacional",
    );
    expect(ligacao?.sinal).toBe(1);
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
