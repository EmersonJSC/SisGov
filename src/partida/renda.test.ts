// Renda por fonte (GDD 2.1, 15/nov): salário e lucro dos setores, salário do
// Estado e o que outros pops pagam.
import { describe, expect, it } from "vitest";
import { avancar, criarPartida, jogar, montarVisao, type Partida } from ".";
import {
  arrecadacao,
  coberturaDosPops,
  comIndicesDasCestas,
  consumoDasCestas,
  direitoDoPop,
  dinheiroFora,
  motivoTerritoriosInvalidos,
  popsPorTerritorio,
  saidaDoTurno,
  tomada,
} from "../motor";

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

  it("setor que encolhe demite; o seguro paga quem foi demitido", () => {
    const p = base("brasil-2026");
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
    const normal = jogar(p, 4).estado;
    const crise = jogar(menor, 4).estado;
    expect(crise.essenciais.desemprego).toBeGreaterThan(
      normal.essenciais.desemprego + 1,
    );
    expect(crise.emprego!.seguro).toBeGreaterThan(normal.emprego!.seguro);
    expect(crise.pops.desempregados.transferencia).toBeGreaterThan(
      normal.pops.desempregados.transferencia,
    );
    const semSeguro = jogar(
      avancar(menor, [
        { tipo: "mudar_lei", lei: "seguro-desemprego-valor", valor: 0 },
      ]),
      3,
    ).estado;
    expect(semSeguro.emprego!.seguro).toBe(0);
  });

  it("cesta pela renda: o pobre gasta mais da renda, o rico consome mais", () => {
    const p = base("brasil-2026");
    const q = consumoDasCestas(p.regras, p.estado);
    expect(q.media.comida).toBeCloseTo(1, 6);
    expect(q.porPop.comida["grandes-empresarios"]).toBeGreaterThan(
      q.porPop.comida["informais-urbanos"],
    );
    const comida = montarVisao(p).mercado!.cestas.find(
      (c) => c.id === "comida",
    )!;
    const gasto = (id: string) => comida.pops.find((x) => x.id === id)!.gasto;
    expect(gasto("informais-urbanos")).toBeGreaterThan(
      gasto("grandes-empresarios") * 3,
    );
  });

  it("padrão de vida: 50 no começo, cai em quem perde renda", () => {
    const p = base("brasil-2026");
    expect(p.estado.pops.aposentados.padrao).toBe(50);
    const corte = jogar(
      avancar(p, [
        { tipo: "mudar_lei", lei: "verba-das-aposentadorias", valor: 0.04 },
      ]),
      3,
    ).estado.pops;
    expect(corte.aposentados.padrao!).toBeLessThan(40);
    expect(corte.professores.padrao!).toBeGreaterThan(45);
  });

  it("a criança vive da família: a casa divide a renda dos adultos", () => {
    const p = base("brasil-2026");
    const c = p.estado.pops.criancas;
    const op = p.estado.pops["operarios-fabrica"];
    expect(c.renda_bruta).toBe(0);
    expect(c.familia!).toBeGreaterThan(0);
    expect(op.familia!).toBeLessThan(0);
    expect(op.casa!.pessoas).toBeGreaterThan(op.pessoas);
    expect(op.casa!.renda).toBeLessThan(op.renda - op.familia!);
    // Nenhum dinheiro some: o que a família dá é o que a criança recebe.
    const familia = Object.values(p.estado.pops).reduce(
      (s, x) => s + x.pessoas * (x.familia ?? 0),
      0,
    );
    expect(Math.abs(familia) / p.estado.essenciais.pib_nominal).toBeLessThan(
      1e-9,
    );
  });

  it("ciclo da vida: sem lei a população fica; idade menor aposenta mais", () => {
    const p = base("brasil-2026");
    const parte = (x: Partida, id: string) =>
      x.estado.pops[id].pessoas / x.estado.essenciais.populacao;
    const sem = jogar(p, 12);
    for (const id of ["criancas", "estudantes", "aposentados"])
      expect(parte(sem, id)).toBeCloseTo(parte(p, id), 3);
    const cedo = jogar(
      avancar(p, [
        { tipo: "mudar_lei", lei: "idade-minima-de-aposentadoria", valor: 55 },
      ]),
      11,
    );
    expect(parte(cedo, "aposentados")).toBeGreaterThan(
      parte(sem, "aposentados") + 0.01,
    );
    expect(parte(cedo, "criancas")).toBeCloseTo(parte(sem, "criancas"), 3);
  });
});

describe("estados", () => {
  it("o Brasil tem 27 estados e a soma deles dá cada pop inteiro", () => {
    const p = base("brasil-2026");
    expect(p.regras.territorios).toHaveLength(27);
    const porEstado = popsPorTerritorio(
      p.regras.territorios,
      p.regras.moradia?.pops_campo ?? [],
      p.estado.pops,
    );
    for (const [id, pop] of Object.entries(p.estado.pops)) {
      const total = Object.values(porEstado).reduce((s, e) => s + e[id], 0);
      expect(total / pop.pessoas).toBeCloseTo(1, 9);
    }
  });

  it("o pop do campo segue a gente do campo de cada estado", () => {
    const p = base("brasil-2026");
    const campo = p.regras.moradia?.pops_campo ?? [];
    expect(campo.length).toBeGreaterThan(0);
    const porEstado = popsPorTerritorio(
      p.regras.territorios,
      campo,
      p.estado.pops,
    );
    const pa = (uf: string, id: string) =>
      porEstado[uf][id] / p.estado.pops[id].pessoas;
    // São Paulo tem mais gente; o Maranhão, mais campo.
    const urbano = Object.keys(p.estado.pops).find(
      (id) => !campo.includes(id),
    )!;
    expect(pa("sp", urbano)).toBeGreaterThan(pa("ma", urbano));
    expect(pa("ma", campo[0]) / pa("ma", urbano)).toBeGreaterThan(
      pa("sp", campo[0]) / pa("sp", urbano),
    );
  });

  it("país sem estados é um estado só", () => {
    const p = base("teste");
    expect(p.regras.territorios).toBeUndefined();
    const porEstado = popsPorTerritorio(undefined, [], p.estado.pops);
    expect(Object.keys(porEstado)).toEqual(["pais"]);
  });

  it("estados que não somam 1 não servem", () => {
    expect(
      motivoTerritoriosInvalidos([
        { id: "a", nome: "A", pessoas: 0.5, campo: 0.1 },
      ]),
    ).toContain("precisam dar 1");
  });
});

describe("saída", () => {
  const brasil = () => base("brasil-2026");
  const lei = (id: string, valor: number | string) => ({
    tipo: "mudar_lei" as const,
    lei: id,
    valor,
  });
  // Pops com o padrão de vida no chão (estrato escolhido).
  const comPadrao = (p: Partida, padrao: number, estrato?: string) => ({
    ...p.estado,
    pops: Object.fromEntries(
      Object.entries(p.estado.pops).map(([id, x]) => [
        id,
        !estrato || p.regras.pops.find((t) => t.id === id)?.estrato === estrato
          ? { ...x, padrao }
          : x,
      ]),
    ),
  });
  const turnos = (p: Partida, estado: Partida["estado"], n: number) => {
    let e = estado;
    for (let i = 0; i < n; i++) e = saidaDoTurno(p.regras, e);
    return e;
  };

  it("a tomada soma a opção e a régua pela posição na faixa", () => {
    const p = brasil();
    expect(tomada(p.regras.leis, {}, "informal")).toBe(0);
    expect(
      tomada(p.regras.leis, { "seguro-folha": "com-familia" }, "informal"),
    ).toBeCloseTo(0.1);
  });

  it("encargo na folha leva formais ao informal; sem fiscal, leva mais", () => {
    const p = brasil();
    const inf = (pedidos: ReturnType<typeof lei>[]) =>
      jogar(p, 12, pedidos).estado.pops["informais-urbanos"].pessoas;
    const com = inf([lei("seguro-folha", "com-familia")]);
    expect(com).toBeGreaterThan(inf([]) * 1.05);
    expect(
      inf([
        lei("seguro-folha", "com-familia"),
        lei("fiscalizacao-do-trabalho", 0),
      ]),
    ).toBeGreaterThan(com);
  });

  it("padrão de vida baixo leva gente para fora; quem melhora volta", () => {
    const p = brasil();
    const fora = turnos(p, comPadrao(p, 25), 12);
    const s = fora.saida;
    expect(s?.fator).toBeLessThan(1);
    // O rico sai mais que o pobre; quem não declara (crianças) não sai.
    expect(s?.fora["profissionais-liberais"]).toBeGreaterThan(
      s?.fora["operarios-fabrica"] ?? 0,
    );
    expect(s?.fora.criancas ?? 0).toBe(0);
    const voltou = turnos(p, { ...comPadrao(p, 75), saida: s }, 12);
    expect(voltou.saida?.fora["profissionais-liberais"]).toBeLessThan(
      s?.fora["profissionais-liberais"] ?? 0,
    );
  });

  it("quem emigra sai da população no turno seguinte, e os pops fecham", () => {
    const p = brasil();
    const e = turnos(p, comPadrao(p, 20), 1);
    const depois = avancar({ ...p, estado: e });
    expect(depois.estado.essenciais.populacao).toBeLessThan(
      p.estado.essenciais.populacao,
    );
  });

  it("dinheiro do rico sai com o padrão baixo; o controle segura", () => {
    const p = brasil();
    const sai = turnos(p, comPadrao(p, 20, "rico"), 12);
    expect(sai.saida?.dinheiro).toBeGreaterThan(0.05);
    const controle = turnos(
      p,
      {
        ...comPadrao(p, 20, "rico"),
        leis: { ...p.estado.leis, "controle-de-capital": "controle-de-saida" },
      },
      12,
    );
    expect(controle.saida?.dinheiro).toBeLessThan(
      (sai.saida?.dinheiro ?? 0) / 2,
    );
  });

  it("o dinheiro fora não paga o imposto de renda do rico", () => {
    const p = brasil();
    const sai = turnos(p, comPadrao(p, 20, "rico"), 12);
    const arrec = (e: Partida["estado"]) =>
      arrecadacao(p.regras, e.leis, e.essenciais, dinheiroFora(p.regras, e));
    expect(arrec(sai)).toBeLessThan(arrec(p.estado));
  });
});

describe("serviço e direito", () => {
  const brasil = () => base("brasil-2026");

  it("o serviço atende a parte do índice; quem tem mais acesso chega antes", () => {
    const p = brasil();
    const s = p.regras.servicos!.find((x) => x.id === "saneamento")!;
    const c = coberturaDosPops(p.regras.pops, p.estado.pops, s, 0.55);
    const pops = p.estado.pops;
    const gente = Object.values(pops).reduce((t, x) => t + x.pessoas, 0);
    const atendidos = Object.entries(c).reduce(
      (t, [id, parte]) => t + parte * pops[id].pessoas,
      0,
    );
    expect(atendidos / gente).toBeCloseTo(0.55, 6);
    // O campo fica por último; o rico chega antes do pobre.
    expect(c["pequenos-agricultores"]).toBeLessThan(c["operarios-fabrica"]);
    expect(c["operarios-fabrica"]).toBeLessThan(c["grandes-empresarios"]);
    expect(Object.values(c).every((x) => x >= 0 && x <= 1)).toBe(true);
    expect(
      coberturaDosPops(p.regras.pops, pops, s, 1)["pequenos-agricultores"],
    ).toBe(1);
  });

  it("turno 0 no padrão 50; perder o serviço baixa o padrão, mais do pobre", () => {
    const p = brasil();
    expect(p.estado.pops["informais-urbanos"].servicos?.saude).toBeGreaterThan(
      0,
    );
    for (const x of Object.values(p.estado.pops))
      expect(x.padrao).toBeCloseTo(50, 6);
    const sem = comIndicesDasCestas(p.regras, {
      ...p.estado,
      jogabilidade: { ...p.estado.jogabilidade, atendimento: 0, saneamento: 0 },
    }).pops;
    const pobre = sem["informais-urbanos"].padrao!;
    const rico = sem["grandes-empresarios"].padrao!;
    expect(pobre).toBeLessThan(50);
    expect(rico).toBeLessThan(50);
    expect(50 - pobre).toBeGreaterThan(50 - rico);
    expect(sem["informais-urbanos"].servicos?.saude).toBe(0);
  });

  it("direito: o pop soma o quanto liga × o que as leis dão na chave", () => {
    const p = brasil();
    const t = { ...p.regras.pops[0], direitos: { privacidade: 1, jogo: -0.5 } };
    const leis = { privacidade: 0.6, jogo: 0.4 } as Record<string, number>;
    expect(direitoDoPop(t, (k) => leis[k] ?? 0)).toBeCloseTo(0.4);
    expect(direitoDoPop(t, () => 2)).toBe(1);
    expect(direitoDoPop(p.regras.pops[0], () => 1)).toBeUndefined();
  });
});

describe("país parado", () => {
  it("sem lei, ninguém perde: Estado, quem é pago por outros e quem não tem fonte andam com o PIB", () => {
    const p = jogar(base("brasil-2026"), 24, []);
    const padroes = Object.values(p.estado.pops).map((x) => x.padrao ?? 50);
    expect(Math.min(...padroes)).toBeGreaterThan(49);
    expect(Math.max(...padroes) - Math.min(...padroes)).toBeLessThan(8);
    expect(p.estado.organizacoes?.vivas ?? []).toEqual([]);
  });
});
