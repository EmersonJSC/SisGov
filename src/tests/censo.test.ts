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

  it("a visão entrega o censo, como entrega as bolhas", () => {
    expect(verPartida(partida()).censo.length).toBeGreaterThan(0);
  });
});
