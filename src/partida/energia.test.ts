// Fatia 7: energia é capacidade contra demanda. Sem investir, o país fica para
// trás: as empresas perdem energia primeiro (freio e preço); os civis só em
// crise grave.
import { describe, expect, it } from "vitest";
import { criarPartida, jogar, type Partida, type Pedido } from ".";

const LEIS = [
  "energia-hidreletrica",
  "energia-termica",
  "energia-nuclear",
  "energia-solar",
  "energia-eolica",
];
const base = () => criarPartida("teste", 42, { semCongresso: true });
const parar: Pedido[] = LEIS.map((lei) => ({
  tipo: "mudar_lei",
  lei,
  valor: 0,
}));
const pronta = (p: Partida) =>
  Object.values(p.estado.capacidade).reduce((s, f) => s + f.pronta, 0);
const semCapacidade = (p: Partida, fator: number): Partida => ({
  ...p,
  estado: {
    ...p.estado,
    capacidade: Object.fromEntries(
      Object.entries(p.estado.capacidade).map(([id, f]) => [
        id,
        { ...f, pronta: f.pronta * fator },
      ]),
    ),
  },
});
const energia = (p: Partida) => p.regras.mercado!.mercado.capacidades![0]!;

describe("energia (7)", () => {
  const normal = jogar(base(), 20);
  const parado = jogar(base(), 20, parar);

  it("nasce no turno 0 com as fontes declaradas", () => {
    expect(pronta(base())).toBeCloseTo(105, 6);
    expect(Object.keys(base().estado.capacidade)).toHaveLength(5);
  });

  it("investindo no ritmo de hoje, a capacidade acompanha a demanda", () => {
    expect(pronta(normal)).toBeGreaterThan(pronta(base()));
  });

  it("sem investir, a capacidade encolhe e o país fica para trás", () => {
    expect(pronta(parado)).toBeLessThan(pronta(normal));
  });

  it("faltando energia, o crescimento freia e os preços sobem", () => {
    const falta = jogar(semCapacidade(base(), 0.7), 6);
    const ok = jogar(base(), 6);
    expect(falta.estado.essenciais.crescimento_real).toBeLessThan(
      ok.estado.essenciais.crescimento_real,
    );
    expect(falta.estado.essenciais.indice_precos).toBeGreaterThan(
      ok.estado.essenciais.indice_precos,
    );
  });

  it("o investimento só vira capacidade depois do prazo da obra", () => {
    const solar = energia(base()).fontes.find((f) => f.id === "solar")!;
    const antes = jogar(base(), solar.prazo - 1);
    const dobra = jogar(base(), solar.prazo + 6, [
      { tipo: "mudar_lei", lei: "energia-solar", valor: 0.01 },
    ]);
    const igual = jogar(base(), solar.prazo + 6);
    expect(antes.estado.capacidade.solar!.pronta).toBeGreaterThan(0);
    expect(dobra.estado.capacidade.solar!.pronta).toBeGreaterThan(
      igual.estado.capacidade.solar!.pronta,
    );
  });

  it("a falta atinge as empresas antes dos civis", () => {
    const p = jogar(semCapacidade(base(), 0.8), 1);
    const c = energia(p);
    const ctx = {
      pessoas: p.estado.essenciais.populacao,
      pessoasBase: p.regras.mercado!.populacaoBase,
      pibReal: 1,
    };
    const demanda = c.demanda.pessoas + c.demanda.empresas;
    expect(pronta(p)).toBeLessThan(demanda);
    expect(ctx.pessoas).toBeGreaterThan(0);
  });

  it("crise grave derruba a saúde; falta leve não", () => {
    const leve = jogar(semCapacidade(base(), 0.9), 2);
    const grave = jogar(semCapacidade(base(), 0.1), 2);
    expect(grave.estado.jogabilidade.saude).toBeLessThan(
      leve.estado.jogabilidade.saude,
    );
    expect(leve.estado.jogabilidade.saude).toBeCloseTo(
      jogar(base(), 2).estado.jogabilidade.saude,
      6,
    );
  });

  it("mesma partida e mesma semente dão o mesmo resultado", () => {
    expect(jogar(base(), 12, parar).estado).toEqual(
      jogar(base(), 12, parar).estado,
    );
  });
});
