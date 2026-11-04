// Deriva: déficit, preço e favela andam sozinhos, empurrados por outros índices.
import { describe, expect, it } from "vitest";
import { andarDerivas } from "../motor";
import { avancar, criarPartida, jogar } from ".";

const base = () => criarPartida("teste", 42, { semCongresso: true });

describe("deriva (motor)", () => {
  const dominios = { a: { min: 0, max: 100 }, b: { min: 0, max: 100 } };
  const regra = { indice: "a", por: "b", sentido: 1, forca: "media" } as const;

  it("sem mudança desde o turno 0, nada anda", () => {
    const nova = andarDerivas(
      [regra],
      { a: 40 },
      { b: 30 },
      { b: 30 },
      {},
      dominios,
    );
    expect(nova.a).toBe(40);
  });

  it("quem empurra subiu 10: anda 5% disso por turno", () => {
    const nova = andarDerivas(
      [regra],
      { a: 40 },
      { b: 40 },
      { b: 30 },
      {},
      dominios,
    );
    expect(nova.a).toBeCloseTo(40.5);
  });

  it("não acumula além do teto, contando as leis", () => {
    const nova = andarDerivas(
      [regra],
      { a: 95 },
      { b: 100 },
      { b: 0 },
      { a: 3 },
      dominios,
    );
    expect(nova.a).toBe(97);
  });
});

describe("deriva na partida", () => {
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
});
