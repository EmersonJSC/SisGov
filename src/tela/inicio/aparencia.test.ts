import { describe, expect, it } from "vitest";
import type { PessoaDaLista } from "../../partida";
import { retratoDaPessoa } from "./aparencia";

const pessoa = (extra: Partial<PessoaDaLista> = {}): PessoaDaLista => ({
  id: "g001",
  nome: "Ana Alves",
  sexo: "f",
  idade: 40,
  origem: "tecnico",
  origemNome: "Sem partido",
  competencia: 50,
  habilidade: 50,
  carisma: 50,
  honestidade: 50,
  lealdade: 50,
  ...extra,
});

describe("retrato da pessoa", () => {
  it("é um SVG embutido e é sempre o mesmo para a mesma pessoa", () => {
    const a = retratoDaPessoa(pessoa());
    expect(a.startsWith("data:image/svg+xml")).toBe(true);
    expect(retratoDaPessoa(pessoa())).toBe(a);
  });

  it("pessoas diferentes têm rostos diferentes", () => {
    expect(retratoDaPessoa(pessoa({ id: "g002" }))).not.toBe(
      retratoDaPessoa(pessoa({ id: "g003" })),
    );
  });
});
