// Renda por fonte (GDD 2.1, 15/nov): salário e lucro dos setores, salário do
// Estado e o que outros pops pagam.
import { describe, expect, it } from "vitest";
import { avancar, criarPartida, jogar, type Partida } from ".";

const base = (pais = "teste") => criarPartida(pais, 42, { semCongresso: true });
const parte = (p: Partida, id: string) =>
  (p.estado.pops[id].pessoas * p.estado.pops[id].renda_bruta) /
  p.estado.essenciais.pib_nominal;
const soma = (p: Partida) =>
  Object.values(p.estado.pops).reduce(
    (s, x) => s + x.pessoas * x.renda_bruta,
    0,
  ) / p.estado.essenciais.pib_nominal;

describe("renda por fonte", () => {
  it("no turno 0 cada pop fica com a parte declarada do PIB", () => {
    for (const pais of ["teste", "brasil-2026"]) {
      const p = base(pais);
      for (const [id, d] of Object.entries(p.regras.pais.pops))
        expect(parte(p, id)).toBeCloseTo(d.parcela_renda, 6);
    }
  });

  it("nenhum dinheiro some: a renda bruta soma o PIB em todo turno", () => {
    expect(soma(jogar(base(), 8))).toBeCloseTo(1, 6);
  });

  it("mais gasto do Estado paga mais quem trabalha para ele", () => {
    const sem = jogar(base(), 3);
    const com = jogar(
      avancar(base(), [{ tipo: "mudar_lei", lei: "gasto-saude", valor: 0.06 }]),
      2,
    );
    expect(parte(com, "burocratas")).toBeGreaterThan(
      parte(sem, "burocratas") * 1.02,
    );
    expect(parte(com, "industriais")).toBeLessThan(parte(sem, "industriais"));
  });

  it("setor que perde capacidade paga menos a quem está nele", () => {
    const p = base();
    const c = p.estado.construcoes!;
    const menor: Partida = {
      ...p,
      estado: {
        ...p.estado,
        construcoes: {
          ...c,
          prontas: { ...c.prontas, industria: c.prontas.industria * 0.7 },
        },
      },
    };
    expect(parte(jogar(menor, 1), "industriais")).toBeLessThan(
      parte(jogar(p, 1), "industriais") * 0.9,
    );
    expect(parte(jogar(menor, 1), "operarios-fabrica")).toBeLessThan(
      parte(jogar(p, 1), "operarios-fabrica"),
    );
  });

  it("quem é pago por outros pops anda com a renda deles", () => {
    // Mais transferência aos pobres: eles compram mais do vendedor de rua.
    const lei = "transferencia-renda";
    const sem = jogar(base(), 3);
    const valor = (sem.estado.leis[lei] as number) * 2;
    const com = jogar(avancar(base(), [{ tipo: "mudar_lei", lei, valor }]), 2);
    expect(parte(com, "informais-urbanos")).toBeGreaterThan(
      parte(sem, "informais-urbanos"),
    );
  });

  it("a corrupção desvia verba: quem recebe ganha, o servidor perde", () => {
    const p = base("brasil-2026");
    const g = p.estado.governo!;
    const corrupto: Partida = {
      ...p,
      estado: {
        ...p.estado,
        governo: {
          ...g,
          orgaos: Object.fromEntries(
            Object.entries(g.orgaos).map(([id, o]) => [
              id,
              { ...o, corrupcao: 80 },
            ]),
          ),
        },
      },
    };
    const limpo = jogar(p, 1);
    const sujo = jogar(corrupto, 1);
    expect(parte(sujo, "altos-funcionarios")).toBeGreaterThan(
      parte(limpo, "altos-funcionarios") * 1.2,
    );
    expect(parte(sujo, "burocratas")).toBeLessThan(parte(limpo, "burocratas"));
    expect(soma(sujo)).toBeCloseTo(1, 6);
  });

  it("aposentado e estudante têm pobre, médio e rico por dentro", () => {
    const p = base();
    const mudar = (lei: string, valor: number) =>
      jogar(avancar(p, [{ tipo: "mudar_lei", lei, valor }]), 1).estado.pops;
    const agora = jogar(p, 1).estado.pops;
    // O imposto de renda do rico pega o aposentado rico.
    expect(
      mudar("imposto-renda-rico", 0.4).aposentados.imposto,
    ).toBeGreaterThan(agora.aposentados.imposto);
    // A transferência aos pobres chega ao estudante pobre.
    const lei = "transferencia-renda";
    const dobro = (p.estado.leis[lei] as number) * 2;
    expect(mudar(lei, dobro).estudantes.transferencia).toBeGreaterThan(
      agora.estudantes.transferencia,
    );
  });
});
