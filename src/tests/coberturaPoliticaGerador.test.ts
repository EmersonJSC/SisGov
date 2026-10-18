import { describe, expect, it } from "vitest";
import { gerarRelatorioPolitico } from "../../scripts/gerador/relatorioPolitico";

describe("relatório político do gerador", () => {
  it("classifica os quatro quadrantes e soma a cobertura", () => {
    const relatorio = gerarRelatorioPolitico([
      {
        objeto: "educacao",
        lei: "lei-a",
        opcao: "estado-livre",
        vetor: [-1, -1],
      },
      {
        objeto: "educacao",
        lei: "lei-b",
        opcao: "estado-autoridade",
        vetor: [-1, 1],
      },
      {
        objeto: "educacao",
        lei: "lei-c",
        opcao: "mercado-livre",
        vetor: [1, -1],
      },
      {
        objeto: "educacao",
        lei: "lei-d",
        opcao: "mercado-autoridade",
        vetor: [1, 1],
      },
    ]);

    expect(relatorio.resumo).toMatchObject({
      totalOpcoes: 4,
      sobreEixos: 0,
      centro: 0,
      semPosicao: 0,
      vetoresInvalidos: 0,
      quadrantesCobertos: 4,
      totalQuadrantes: 4,
    });
    expect(Object.values(relatorio.quadrantes).every((q) => q.coberto)).toBe(
      true,
    );
    expect(relatorio.quadrantes.estado_liberdade.opcoes).toEqual([
      "lei-a/estado-livre",
    ]);
    expect(relatorio.quadrantes.estado_autoridade.opcoes).toEqual([
      "lei-b/estado-autoridade",
    ]);
    expect(relatorio.quadrantes.mercado_liberdade.opcoes).toEqual([
      "lei-c/mercado-livre",
    ]);
    expect(relatorio.quadrantes.mercado_autoridade.opcoes).toEqual([
      "lei-d/mercado-autoridade",
    ]);
    expect(relatorio.objetos[0].quadrantes.estado_liberdade).toMatchObject({
      quantidadeOpcoes: 1,
      quantidadeLeis: 1,
      opcoes: ["lei-a/estado-livre"],
      leis: ["lei-a"],
    });
  });

  it("separa opções sobre eixos, no centro e sem posição", () => {
    const relatorio = gerarRelatorioPolitico([
      { objeto: "educacao", lei: "lei", opcao: "estado-eixo", vetor: [-1, 0] },
      { objeto: "educacao", lei: "lei", opcao: "mercado-eixo", vetor: [1, 0] },
      {
        objeto: "educacao",
        lei: "lei",
        opcao: "costumes-eixo",
        vetor: [0, -1],
      },
      {
        objeto: "educacao",
        lei: "lei",
        opcao: "costumes-positivo-eixo",
        vetor: [0, 1],
      },
      { objeto: "educacao", lei: "lei", opcao: "centro", vetor: [0, 0] },
      { objeto: "educacao", lei: "lei", opcao: "ausente" },
      { objeto: "educacao", lei: "lei", opcao: "nulo", vetor: null },
    ]);

    expect(relatorio.resumo).toMatchObject({
      totalOpcoes: 7,
      sobreEixos: 4,
      centro: 1,
      semPosicao: 2,
      vetoresInvalidos: 0,
      quadrantesCobertos: 0,
    });
    expect(relatorio.objetos[0].sobreEixos).toHaveLength(4);
    expect(relatorio.objetos[0].centro).toEqual(["lei/centro"]);
    expect(relatorio.objetos[0].semPosicao).toEqual([
      "lei/ausente",
      "lei/nulo",
    ]);
  });

  it("usa o sinal sem limiar e aceita decimais e os limites da escala", () => {
    const relatorio = gerarRelatorioPolitico([
      {
        objeto: "educacao",
        lei: "lei-a",
        opcao: "decimal",
        vetor: [0.05, -0.05],
      },
      { objeto: "educacao", lei: "lei-b", opcao: "limites", vetor: [-2, 2] },
    ]);

    expect(relatorio.resumo).toMatchObject({
      totalOpcoes: 2,
      quadrantesCobertos: 2,
      vetoresInvalidos: 0,
    });
    expect(relatorio.quadrantes.mercado_liberdade.opcoes).toContain(
      "lei-a/decimal",
    );
    expect(relatorio.quadrantes.estado_autoridade.opcoes).toContain(
      "lei-b/limites",
    );
  });

  it("separa vetor ausente, não finito e fora da escala", () => {
    const relatorio = gerarRelatorioPolitico([
      { objeto: "educacao", lei: "lei", opcao: "ausente" },
      { objeto: "educacao", lei: "lei", opcao: "nan", vetor: [Number.NaN, 1] },
      {
        objeto: "educacao",
        lei: "lei",
        opcao: "infinito",
        vetor: [1, Number.POSITIVE_INFINITY],
      },
      { objeto: "educacao", lei: "lei", opcao: "abaixo", vetor: [-2.01, 1] },
      { objeto: "educacao", lei: "lei", opcao: "acima", vetor: [1, 2.01] },
    ]);

    expect(relatorio.resumo).toMatchObject({
      totalOpcoes: 5,
      semPosicao: 1,
      vetoresInvalidos: 4,
      quadrantesCobertos: 0,
    });
    expect(relatorio.objetos[0].semPosicao).toEqual(["lei/ausente"]);
    expect(relatorio.objetos[0].vetoresInvalidos).toEqual([
      "lei/nan",
      "lei/infinito",
      "lei/abaixo",
      "lei/acima",
    ]);
  });

  it("conta opções e leis distintas separadamente em cada quadrante", () => {
    const relatorio = gerarRelatorioPolitico([
      { objeto: "educacao", lei: "lei-a", opcao: "a1", vetor: [-1, -1] },
      { objeto: "educacao", lei: "lei-a", opcao: "a2", vetor: [-0.5, -0.5] },
      { objeto: "educacao", lei: "lei-b", opcao: "b1", vetor: [-2, -2] },
    ]);

    expect(relatorio.objetos[0].quadrantes.estado_liberdade).toMatchObject({
      coberto: true,
      quantidadeOpcoes: 3,
      quantidadeLeis: 2,
      opcoes: ["lei-a/a1", "lei-a/a2", "lei-b/b1"],
      leis: ["lei-a", "lei-b"],
    });
    expect(relatorio.resumo.quadrantesCobertos).toBe(1);
  });

  it("calcula cobertura separadamente para cada objeto de política", () => {
    const relatorio = gerarRelatorioPolitico([
      {
        objeto: "educacao",
        lei: "lei-a",
        opcao: "estado-livre",
        vetor: [-1, -1],
      },
      {
        objeto: "saude",
        lei: "lei-b",
        opcao: "mercado-autoridade",
        vetor: [1, 1],
      },
    ]);

    const educacao = relatorio.objetos.find(
      (objeto) => objeto.id === "educacao",
    );
    const saude = relatorio.objetos.find((objeto) => objeto.id === "saude");
    expect(educacao?.quadrantes.estado_liberdade.quantidadeOpcoes).toBe(1);
    expect(educacao?.quadrantes.mercado_autoridade.quantidadeOpcoes).toBe(0);
    expect(saude?.quadrantes.mercado_autoridade.quantidadeOpcoes).toBe(1);
    expect(saude?.quadrantes.estado_liberdade.quantidadeOpcoes).toBe(0);
    expect(relatorio.resumo.quadrantesCobertos).toBe(2);
  });

  it("reconcilia o total com todas as classificações do relatório", () => {
    const relatorio = gerarRelatorioPolitico([
      { objeto: "educacao", lei: "lei-a", opcao: "quadrante", vetor: [-1, -1] },
      { objeto: "educacao", lei: "lei-a", opcao: "eixo", vetor: [1, 0] },
      { objeto: "saude", lei: "lei-b", opcao: "centro", vetor: [0, 0] },
      { objeto: "saude", lei: "lei-b", opcao: "ausente" },
      { objeto: "saude", lei: "lei-c", opcao: "invalido", vetor: [3, 1] },
    ]);
    const { resumo } = relatorio;

    expect(
      resumo.sobreEixos +
        resumo.centro +
        resumo.semPosicao +
        resumo.vetoresInvalidos +
        Object.values(relatorio.quadrantes).reduce(
          (total, quadrante) => total + quadrante.opcoes.length,
          0,
        ),
    ).toBe(resumo.totalOpcoes);
    expect(
      relatorio.objetos.reduce(
        (total, objeto) => total + objeto.totalOpcoes,
        0,
      ),
    ).toBe(resumo.totalOpcoes);
  });

  it("recusa a mesma opção duplicada dentro do mesmo objeto", () => {
    expect(() =>
      gerarRelatorioPolitico([
        { objeto: "educacao", lei: "lei-a", opcao: "opcao-a", vetor: [-1, -1] },
        { objeto: "educacao", lei: "lei-a", opcao: "opcao-a", vetor: [1, 1] },
      ]),
    ).toThrow("Opção política duplicada: lei-a/opcao-a");
  });

  it("recusa a mesma opção atribuída a objetos diferentes", () => {
    expect(() =>
      gerarRelatorioPolitico([
        { objeto: "educacao", lei: "lei-a", opcao: "opcao-a", vetor: [-1, -1] },
        { objeto: "saude", lei: "lei-a", opcao: "opcao-a", vetor: [1, 1] },
      ]),
    ).toThrow("Opção política duplicada: lei-a/opcao-a");
  });
});
