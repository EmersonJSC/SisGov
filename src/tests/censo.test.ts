/**
 * Censo da população (Grupos, camada A).
 *
 * O país repartido pelos atributos dos perfis, para o jogador ver quem mora
 * no país dele. É leitura dos 2.090 perfis que já chegam na partida: nenhuma
 * conta nova, nenhum estado novo.
 *
 * Teste de comportamento, não de número: a demografia ainda vai ser
 * recalibrada, então travar "40% pobres" só daria teste quebrado. O que não
 * pode mudar é a estrutura — todo mundo está em alguma faixa, cada atributo
 * reparte o país inteiro, e nenhuma faixa aparece sem nome.
 */
import { describe, expect, it } from "vitest";
import { censoDoPais } from "../app/partida/censo";
import { criarPartida, verPartida } from "../app/partida";

// Uma partida para todos os testes: criar uma custa ~7 s e o censo não muda
// nada — é leitura. Seis partidas aqui seriam 40 s para provar o mesmo.
let guardada: ReturnType<typeof criarPartida> | undefined;
function partida() {
  guardada ??= criarPartida({ ocorrencias: false, eleicao: false });
  if (!guardada.ok) throw new Error(guardada.erros.join(" "));
  return guardada.value;
}

describe("censo da população", () => {
  it("reparte o país por cada atributo do perfil", () => {
    const censo = censoDoPais(partida().content);
    expect(censo.length).toBeGreaterThan(0);
    for (const atributo of censo) {
      expect(atributo.faixas.length).toBeGreaterThan(0);
      expect(atributo.nome).toBeTruthy();
    }
  });

  it("cada atributo reparte o país inteiro, sem sobra nem buraco", () => {
    for (const atributo of censoDoPais(partida().content)) {
      const soma = atributo.faixas.reduce((t, f) => t + f.parte, 0);
      expect(soma).toBeCloseTo(1, 3);
    }
  });

  it("nenhuma faixa chega na tela sem nome de gente", () => {
    const semNome = censoDoPais(partida().content)
      .flatMap((a) => a.faixas)
      .filter((f) => !f.nome || f.nome === f.id);
    expect(semNome).toEqual([]);
  });

  it("a faixa diz se tem grupo na tela, para o buraco ficar à vista", () => {
    const faixas = censoDoPais(partida().content).flatMap((a) => a.faixas);
    // Quem tem apelido: informal é "Informais e de aplicativo" no mapa de
    // segmentos. Quem não tem: centro, que é 30% do eleitorado e não tem bolha.
    expect(faixas.find((f) => f.id === "informal")?.grupo).toBeTruthy();
    expect(faixas.find((f) => f.id === "centro")?.grupo).toBeUndefined();
  });

  it("a faixa maior vem antes, porque é o país que ela descreve", () => {
    for (const atributo of censoDoPais(partida().content)) {
      const partes = atributo.faixas.map((f) => f.parte);
      expect([...partes].sort((a, b) => b - a)).toEqual(partes);
    }
  });

  it("a visão diz de quantos perfis o censo saiu", () => {
    // O número é a prova de que o censo não é estimativa: ele conta gente
    // perfil a perfil. Quantos exatamente muda quando a demografia for
    // recalibrada, então o teste exige só que sejam muitos.
    expect(verPartida(partida()).perfis).toBeGreaterThan(100);
  });

  it("cada faixa do censo diz quanto ganha, paga e sobra", () => {
    const renda = verPartida(partida()).censo.find((a) => a.id === "renda")!;
    for (const f of renda.faixas) expect(f.bolso?.sobra).toBeGreaterThan(0);
  });

  it("a faixa rica sobra mais que a pobre", () => {
    const renda = verPartida(partida()).censo.find((a) => a.id === "renda")!;
    const parte = (id: string) => renda.faixas.find((f) => f.id === id)!.bolso!;
    expect(parte("rica").sobra).toBeGreaterThan(parte("pobre").sobra);
  });

  it("a visão entrega o censo, como entrega as bolhas", () => {
    expect(verPartida(partida()).censo.length).toBeGreaterThan(0);
  });

  it("o desempregado aparece no censo de ocupação, com nome, e o país continua inteiro", () => {
    const valores = { ...partida().game.execution.values, desemprego: 12 };
    const censo = censoDoPais(partida().content, valores);
    const ocupacao = censo.find((a) => a.id === "ocupacao")!;
    const desempregados = ocupacao.faixas.find((f) => f.id === "desempregado");
    expect(desempregados?.parte).toBeGreaterThan(0);
    expect(desempregados?.nome).toBe("Desempregados");
    expect(desempregados?.grupo).toBe("grupo_desempregados");
    for (const atributo of censo)
      expect(atributo.faixas.reduce((t, f) => t + f.parte, 0)).toBeCloseTo(
        1,
        6,
      );
  });

  it("desemprego maior: o desempregado cresce e quem tem carteira diminui", () => {
    const base = partida().game.execution.values;
    const parte = (desemprego: number, faixa: string) =>
      censoDoPais(partida().content, { ...base, desemprego })
        .find((a) => a.id === "ocupacao")!
        .faixas.find((f) => f.id === faixa)?.parte ?? 0;
    expect(parte(25, "desempregado")).toBeGreaterThan(parte(5, "desempregado"));
    expect(parte(25, "carteira")).toBeLessThan(parte(5, "carteira"));
  });

  it("o bolso do desempregado sobra menos que o de quem tem carteira", () => {
    const valores = { ...partida().game.execution.values, desemprego: 12 };
    const ocupacao = censoDoPais(partida().content, valores).find(
      (a) => a.id === "ocupacao",
    )!;
    const sobra = (id: string) =>
      ocupacao.faixas.find((f) => f.id === id)!.bolso!.sobra;
    expect(sobra("desempregado")).toBeLessThan(sobra("carteira"));
  });

  it("no início da partida ninguém se moveu: a variação é de décimos de ponto", () => {
    const valores = partida().game.execution.values;
    for (const atributo of censoDoPais(partida().content, valores))
      for (const faixa of atributo.faixas)
        expect(Math.abs(faixa.variacao ?? 0), faixa.id).toBeLessThan(0.5);
  });

  it("desemprego sobe: o desempregado ganha pontos e quem tem carteira perde", () => {
    const valores = { ...partida().game.execution.values, desemprego: 25 };
    const ocupacao = censoDoPais(partida().content, valores).find(
      (a) => a.id === "ocupacao",
    )!;
    const variacao = (id: string) =>
      ocupacao.faixas.find((f) => f.id === id)?.variacao ?? 0;
    expect(variacao("desempregado")).toBeGreaterThan(5);
    expect(variacao("carteira")).toBeLessThan(0);
  });

  it("faixa que não se moveu não traz o campo, para a tela não escrever 0,0", () => {
    const valores = { ...partida().game.execution.values, desemprego: 25 };
    const renda = censoDoPais(partida().content, valores).find(
      (a) => a.id === "renda",
    )!;
    // A renda não muda com o emprego neste desenho (o desempregado herda a faixa);
    // por isso a maior parte das faixas de renda mexe só pela troca de peso.
    const ocupacao = censoDoPais(partida().content, valores).find(
      (a) => a.id === "ocupacao",
    )!;
    const aposentados = ocupacao.faixas.find((f) => f.id === "aposentado")!;
    expect(aposentados).not.toHaveProperty("variacao");
    expect(renda.faixas.length).toBeGreaterThan(0);
  });

  describe("renda pela sobra", () => {
    const inicio = () => partida().game.valoresIniciais!;
    const renda = (valores: Record<string, number>) =>
      censoDoPais(partida().content, valores, inicio()).find(
        (a) => a.id === "renda",
      )!;

    it("no início ninguém muda de faixa e o país continua inteiro", () => {
      const faixas = renda(inicio()).faixas;
      for (const f of faixas) expect(f.variacao, f.id).toBeUndefined();
      expect(faixas.reduce((t, f) => t + f.parte, 0)).toBeCloseTo(1, 6);
    });

    it("imposto de renda maior tira gente de cima: os pobres crescem e os ricos encolhem", () => {
      const faixas = renda({
        ...inicio(),
        arrecadacao_renda_pessoas: inicio().arrecadacao_renda_pessoas * 3,
      }).faixas;
      const variacao = (id: string) =>
        faixas.find((f) => f.id === id)?.variacao ?? 0;
      expect(faixas.reduce((t, f) => t + f.parte, 0)).toBeCloseTo(1, 6);
      expect(variacao("pobre")).toBeGreaterThan(0);
      expect(variacao("rica")).toBeLessThanOrEqual(0);
    });

    it("sem os valores do início a renda fica como está", () => {
      const faixas = censoDoPais(partida().content, {
        ...inicio(),
        desemprego: 25,
      }).find((a) => a.id === "renda")!.faixas;
      expect(faixas.reduce((t, f) => t + f.parte, 0)).toBeCloseTo(1, 6);
    });
  });
});
