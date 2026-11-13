import { describe, expect, it } from "vitest";
import {
  bussolaDoPartido,
  comPartidoNovo,
  defendeDaBussola,
  gerarPessoas,
  motivoModeloInvalido,
  sortearMinistros,
  type ModeloDePessoas,
} from ".";

const modelo: ModeloDePessoas = {
  proprios: {
    f: ["Ana", "Bia", "Clara", "Dora", "Eva", "Flora"],
    m: ["Caio", "Davi", "Elias", "Fabio", "Gil", "Hugo"],
  },
  sobrenomes: ["Alves", "Braga", "Costa", "Dias", "Esteves", "Farias", "Gomes"],
  quantidade: 40,
  tecnicos: 0.25,
};
const partidos = [
  { id: "a", cadeiras: 300, bussola: { economico: -0.6, social: -0.4 } },
  { id: "b", cadeiras: 100, bussola: { economico: 0.6, social: 0.5 } },
];

describe("gerador de pessoas", () => {
  it("mesma semente, mesmas pessoas; semente outra, outras", () => {
    expect(gerarPessoas(7, modelo, partidos)).toEqual(
      gerarPessoas(7, modelo, partidos),
    );
    expect(gerarPessoas(8, modelo, partidos)).not.toEqual(
      gerarPessoas(7, modelo, partidos),
    );
  });

  it("gera a quantidade pedida, sem nome repetido e com notas de 0 a 100", () => {
    const gente = gerarPessoas(1, modelo, partidos);
    expect(gente).toHaveLength(40);
    expect(new Set(gente.map((p) => p.nome)).size).toBe(40);
    for (const p of gente)
      for (const n of [p.competencia, p.habilidade, p.carisma, p.honestidade])
        expect(n >= 0 && n <= 100).toBe(true);
  });

  it("a origem segue o peso dos partidos e inclui técnicos", () => {
    const gente = gerarPessoas(3, { ...modelo, quantidade: 120 }, partidos);
    const de = (id: string) => gente.filter((p) => p.origem === id).length;
    expect(de("a")).toBeGreaterThan(de("b"));
    expect(de("tecnico")).toBeGreaterThan(0);
  });

  it("a bússola da pessoa fica perto do partido dela", () => {
    const gente = gerarPessoas(5, { ...modelo, quantidade: 120 }, partidos);
    const media = (id: string) => {
      const meus = gente.filter((p) => p.origem === id);
      return (
        meus.reduce((s, p) => s + (p.bussola.economico ?? 0), 0) / meus.length
      );
    };
    expect(media("a")).toBeLessThan(0);
    expect(media("b")).toBeGreaterThan(0);
  });

  it("recusa modelo com poucos nomes", () => {
    expect(motivoModeloInvalido(modelo)).toBeNull();
    expect(
      motivoModeloInvalido({
        ...modelo,
        sobrenomes: ["Alves"],
        quantidade: 40,
      }),
    ).toMatch(/poucos nomes/);
  });
});

describe("ministros sorteados", () => {
  const gente = gerarPessoas(2, modelo, partidos);
  const vagas = [{ id: "x" }, { id: "y" }, { id: "z" }];
  const centro = { economico: 0, social: 0 };

  it("cada caixa tem uma pessoa diferente e quem é da chapa fica de fora", () => {
    const r = sortearMinistros(1, vagas, gente, centro, {}, [gente[0].id]);
    const ids = Object.values(r);
    expect(ids).toHaveLength(3);
    expect(new Set(ids).size).toBe(3);
    expect(ids).not.toContain(gente[0].id);
  });

  it("o que o jogador escolheu fica e não se repete em outra caixa", () => {
    const r = sortearMinistros(1, vagas, gente, centro, { y: gente[5].id }, []);
    expect(r.y).toBe(gente[5].id);
    expect([r.x, r.z]).not.toContain(gente[5].id);
  });
});

describe("partido do jogador", () => {
  it("o lado sai da bússola: grupos mais perto pesam mais", () => {
    const grupos = [
      { id: "p", bussola: { economico: -0.8, social: 0 } },
      { id: "q", bussola: { economico: 0.8, social: 0 } },
    ];
    const defende = defendeDaBussola({ economico: -0.7, social: 0 }, grupos);
    expect(defende.p).toBeGreaterThan(defende.q);
    expect(bussolaDoPartido({ p: 1 }, grupos).economico).toBe(-0.8);
  });

  it("as cadeiras do partido novo vêm dos partidos da chapa e o total não muda", () => {
    const base = [
      { id: "a", cadeiras: 300, defende: {} },
      { id: "b", cadeiras: 200, defende: {} },
    ];
    const r = comPartidoNovo(base, { id: "novo", defende: {} }, ["a"]);
    const novo = r.find((p) => p.id === "novo");
    expect(novo?.cadeiras).toBeGreaterThan(0);
    expect(r.find((p) => p.id === "b")?.cadeiras).toBe(200);
    expect(r.reduce((s, p) => s + p.cadeiras, 0)).toBe(500);
  });
});
