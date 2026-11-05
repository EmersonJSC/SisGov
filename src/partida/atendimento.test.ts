// Rede de atendimento: a fila sai da contagem de vagas, planos e profissionais.
import { describe, expect, it } from "vitest";
import {
  fluxoDeProfissionais,
  indiceDoAtendimento,
  type RegraDoAtendimento,
} from "../motor";
import { avancar, criarPartida, jogar, montarVisao, previaDaLei } from ".";

const TURNOS = 20;
const partida = (pais = "teste") =>
  criarPartida(pais, 42, { semCongresso: true });

/** Estado depois de `TURNOS` turnos, com as leis pedidas no primeiro. */
function depois(leis: Record<string, number | string> = {}, pais = "teste") {
  const pedidos = Object.entries(leis).map(([lei, valor]) => ({
    tipo: "mudar_lei" as const,
    lei,
    valor,
  }));
  return jogar(avancar(partida(pais), pedidos), TURNOS - 1).estado;
}

const regra = partida().regras.atendimento as RegraDoAtendimento;
const rede = { populacao: 1000, profissionais: 10, vagas: 300, planos: 0 };

describe("conta da fila (motor)", () => {
  it("a rede atende o menor entre vagas e profissionais", () => {
    expect(indiceDoAtendimento(regra, rede)).toBeCloseTo(30);
    expect(indiceDoAtendimento(regra, { ...rede, profissionais: 2 })).toBe(10);
  });

  it("hospital sem profissional não atende", () => {
    const vazio = { ...rede, profissionais: 2 };
    expect(indiceDoAtendimento(regra, { ...vazio, vagas: 900 })).toBe(
      indiceDoAtendimento(regra, vazio),
    );
  });

  it("com poucos profissionais, o plano esvazia a rede pública", () => {
    const poucos = { ...rede, profissionais: 4 };
    expect(indiceDoAtendimento(regra, { ...poucos, planos: 0.1 })).toBeLessThan(
      indiceDoAtendimento(regra, poucos),
    );
  });

  it("com médico de sobra, o plano tira gente da fila", () => {
    const muitos = { ...rede, profissionais: 19 };
    expect(
      indiceDoAtendimento(regra, { ...muitos, planos: 0.1 }),
    ).toBeGreaterThan(indiceDoAtendimento(regra, muitos));
  });
});

describe("cobertura gratuita", () => {
  const lei = "cobertura-gratuita";
  const tudo = (pais = "teste", leis = {}) =>
    depois({ ...leis, [lei]: "tudo-para-todos" }, pais);

  it("cada um usa mais a rede: a fila cresce", () => {
    expect(tudo().jogabilidade.atendimento).toBeLessThan(
      depois().jogabilidade.atendimento - 5,
    );
  });

  it("quem se trata cedo sobe a saúde, mesmo com mais fila", () => {
    expect(tudo().jogabilidade.saude).toBeGreaterThan(
      depois().jogabilidade.saude + 1,
    );
  });

  it("a rede de graça baixa a desigualdade", () => {
    expect(tudo().jogabilidade.desigualdade).toBeLessThan(
      depois().jogabilidade.desigualdade - 1,
    );
  });

  it("parte de quem tem plano volta para a rede", () => {
    expect(tudo().atendimento?.planos).toBeLessThan(
      depois().atendimento?.planos ?? 0,
    );
  });

  it("com vagas paradas, a procura as ocupa e o desvio cai", () => {
    const verba = { "gasto-saude": 0.06 };
    expect(tudo("teste-pobre", verba).jogabilidade.corrupcao).toBeLessThan(
      depois(verba, "teste-pobre").jogabilidade.corrupcao,
    );
  });

  it("rende mais no país com rede para atender", () => {
    const ganho = (pais: string) =>
      tudo(pais).jogabilidade.saude - depois({}, pais).jogabilidade.saude;
    expect(ganho("teste")).toBeGreaterThan(ganho("teste-pobre"));
  });

  it("a ficha mostra a fila e a saúde", () => {
    const { indices } = previaDaLei(partida(), lei, "tudo-para-todos");
    const pontos = (id: string) =>
      indices.filter((l) => l.id === id).reduce((s, l) => s + l.pontos, 0);
    expect(pontos("atendimento")).toBeLessThan(0);
    expect(pontos("saude")).toBeGreaterThan(0);
    expect(pontos("desigualdade")).toBeLessThan(0);
  });
});

describe("leis da rede: cada uma tem ganho e custo", () => {
  const comVerba = { "gasto-saude": 0.1 };
  const custo = (estado: ReturnType<typeof depois>) =>
    estado.atendimento?.custo ?? 0;
  const pontosDe = (lei: string, opcao: string, id: string) =>
    previaDaLei(partida(), lei, opcao)
      .indices.filter((l) => l.id === id)
      .reduce((soma, l) => soma + l.pontos, 0);

  it("coparticipação: a fila cai porque quem não pode pagar deixa de ir", () => {
    const com = depois({ coparticipacao: "boa-parte-da-conta" });
    expect(com.jogabilidade.atendimento).toBeGreaterThan(
      depois().jogabilidade.atendimento + 5,
    );
    expect(com.jogabilidade.saude).toBeLessThan(
      depois().jogabilidade.saude - 1,
    );
    expect(com.jogabilidade.desigualdade).toBeGreaterThan(
      depois().jogabilidade.desigualdade + 1,
    );
  });

  it("dedução: mais planos, e o governo deixa de arrecadar", () => {
    const com = depois({ "deducao-plano": "plano-e-familia" });
    expect(com.atendimento?.planos).toBeGreaterThan(
      depois().atendimento?.planos ?? 0,
    );
    expect(custo(com)).toBeGreaterThan(0);
    expect(com.jogabilidade.desigualdade).toBeGreaterThan(
      depois().jogabilidade.desigualdade,
    );
  });

  it("conta de saúde: cobre menos que o seguro e empurra para o informal", () => {
    const conta = depois({ "conta-saude": "obrigatoria-todos" });
    const seguro = depois({ "seguro-folha": "todo-emprego" });
    expect(conta.atendimento?.seguro).toBeGreaterThan(0);
    expect(conta.atendimento?.seguro).toBeLessThan(
      seguro.atendimento?.seguro ?? 0,
    );
    expect(conta.atendimento?.encargo).toBeGreaterThan(0);
    expect(custo(conta)).toBe(0);
  });

  it("filantrópicos: vagas baratas, mas desiguais", () => {
    const com = depois({ filantropicos: "rede-de-entidades" });
    expect(com.jogabilidade.atendimento).toBeGreaterThan(
      depois().jogabilidade.atendimento + 3,
    );
    expect(com.jogabilidade.desigualdade).toBeGreaterThan(
      depois().jogabilidade.desigualdade,
    );
    expect(custo(com)).toBeGreaterThan(0);
  });

  it("filantrópicos sem profissional para atender não abrem atendimento", () => {
    const com = { ...comVerba, filantropicos: "rede-de-entidades" };
    expect(depois(com).jogabilidade.atendimento).toBeCloseTo(
      depois(comVerba).jogabilidade.atendimento,
      0,
    );
  });

  it("carreira: o plano não leva quem é da rede pública", () => {
    const poucos = {
      populacao: 1000,
      profissionais: 4,
      vagas: 900,
      planos: 0.15,
    };
    expect(
      indiceDoAtendimento(regra, { ...poucos, reserva: 0.8 }),
    ).toBeGreaterThan(indiceDoAtendimento(regra, poucos));
  });

  it("carreira: rende, custa salário e perde profissionais", () => {
    const com = depois({ "carreira-exclusiva": "toda-a-rede" });
    expect(com.jogabilidade.atendimento).toBeGreaterThan(
      depois().jogabilidade.atendimento,
    );
    expect(custo(com)).toBeGreaterThan(0);
    expect(com.jogabilidade.profissionais_saude).toBeLessThan(
      depois().jogabilidade.profissionais_saude - 1,
    );
  });

  it("gestão: a verba rende mais, e quem paga mais encarece a rede", () => {
    const com = depois({ "gestao-privada": "toda-a-rede" });
    expect(com.jogabilidade.atendimento).toBeGreaterThan(
      depois().jogabilidade.atendimento + 1,
    );
    expect(custo(com)).toBeGreaterThan(0);
  });

  it("gestão: disputar profissional escasso tira gente da rede pública", () => {
    const poucos = {
      populacao: 1000,
      profissionais: 4,
      vagas: 900,
      planos: 0.05,
    };
    expect(
      indiceDoAtendimento(regra, { ...poucos, disputa: 0.35 }),
    ).toBeLessThan(indiceDoAtendimento(regra, poucos));
  });

  it("missões: com médico sobrando, só trazem dinheiro e reputação", () => {
    const com = depois({ "missoes-medicas": "exportacao" });
    expect(custo(com)).toBeLessThan(0);
    expect(com.jogabilidade.reputacao_internacional).toBeGreaterThan(
      depois().jogabilidade.reputacao_internacional + 1,
    );
    expect(com.jogabilidade.atendimento).toBeCloseTo(
      depois().jogabilidade.atendimento,
      0,
    );
  });

  it("missões: com médico faltando, a fila cresce em casa", () => {
    const com = { ...comVerba, "missoes-medicas": "exportacao" };
    expect(depois(com).jogabilidade.atendimento).toBeLessThan(
      depois(comVerba).jogabilidade.atendimento - 2,
    );
  });

  it("saúde ambiental: sobe a saúde e pesa nas fábricas", () => {
    const com = depois({ "saude-ambiental": "todo-o-territorio" });
    expect(com.jogabilidade.saude).toBeGreaterThan(
      depois().jogabilidade.saude + 1,
    );
    expect(com.jogabilidade.industrializacao).toBeLessThan(
      depois().jogabilidade.industrializacao - 1,
    );
    expect(custo(com)).toBeGreaterThan(0);
  });

  it("o custo entra no gasto do governo", () => {
    const com = depois({ "saude-ambiental": "todo-o-territorio" });
    expect(
      com.essenciais.gasto_publico / com.essenciais.pib_nominal,
    ).toBeGreaterThan(
      depois().essenciais.gasto_publico / depois().essenciais.pib_nominal,
    );
  });

  it("a ficha mostra o que cada lei faz", () => {
    expect(
      pontosDe("coparticipacao", "boa-parte-da-conta", "atendimento"),
    ).toBeGreaterThan(0);
    expect(
      pontosDe("coparticipacao", "boa-parte-da-conta", "saude"),
    ).toBeLessThan(0);
    expect(
      pontosDe("missoes-medicas", "exportacao", "reputacao_internacional"),
    ).toBeGreaterThan(0);
    expect(
      pontosDe("saude-ambiental", "todo-o-territorio", "saude"),
    ).toBeGreaterThan(0);
    expect(
      pontosDe("saude-ambiental", "todo-o-territorio", "industrializacao"),
    ).toBeLessThan(0);
  });

  it("as leis que colidem não valem juntas", () => {
    const regras = partida().regras.colisoes ?? [];
    expect(regras).toContainEqual(["cobertura-gratuita", "coparticipacao"]);
    expect(regras).toContainEqual(["carreira-exclusiva", "gestao-privada"]);
  });
});

describe("seguro na folha", () => {
  const com = (opcao: string, pais = "teste", leis = {}) =>
    depois({ ...leis, "seguro-folha": opcao }, pais);
  const informais = (estado: ReturnType<typeof depois>) =>
    estado.pops["informais-urbanos"].pessoas / estado.essenciais.populacao;

  it("cobre quem tem emprego e passa do teto dos planos", () => {
    expect(com("todo-emprego").atendimento?.planos).toBeGreaterThan(0.25);
    expect(com("todo-emprego").jogabilidade.atendimento).toBeGreaterThan(
      depois().jogabilidade.atendimento + 5,
    );
  });

  it("encarece o emprego: gente vai para o informal", () => {
    expect(informais(com("com-familia"))).toBeGreaterThan(
      informais(depois()) + 0.01,
    );
  });

  it("o índice de emprego informal segue o pop", () => {
    const estado = com("com-familia");
    expect(estado.jogabilidade.emprego_informal).toBeCloseTo(
      informais(estado) * 100,
      0,
    );
    expect(estado.jogabilidade.emprego_informal).toBeGreaterThan(
      depois().jogabilidade.emprego_informal + 1,
    );
  });

  it("quem fica de fora vira segundo andar", () => {
    expect(com("todo-emprego").jogabilidade.desigualdade).toBeGreaterThan(
      depois().jogabilidade.desigualdade + 3,
    );
  });

  it("no país sem profissionais, seguro demais piora a fila", () => {
    const pobre = (opcao: string) =>
      com(opcao, "teste-pobre").jogabilidade.atendimento;
    expect(pobre("com-familia")).toBeLessThan(pobre("grandes-empresas"));
  });

  it("deixa cortar a verba: a rede vazia não precisa do mesmo dinheiro", () => {
    const corte = { "gasto-saude": 0.02 };
    expect(
      com("todo-emprego", "teste", corte).jogabilidade.atendimento,
    ).toBeGreaterThan(depois(corte).jogabilidade.atendimento + 10);
    expect(
      com("todo-emprego", "teste", corte).jogabilidade.corrupcao,
    ).toBeLessThan(com("todo-emprego").jogabilidade.corrupcao);
  });

  it("o limite aos planos não toca o seguro", () => {
    const leis = { "limite-planos": "proibidos" };
    expect(
      com("todo-emprego", "teste", leis).atendimento?.seguro,
    ).toBeGreaterThan(0.2);
  });
});

describe("leis que rompem a falta de profissionais", () => {
  const verba = { teste: 0.08, "teste-pobre": 0.07 };
  const atendimento = (leis: Record<string, number | string>, pais: string) =>
    depois(leis, pais).jogabilidade.atendimento;

  it("atenção preventiva rende mais no país com fila grande", () => {
    const sobe = (pais: string) =>
      atendimento({ "atencao-preventiva": 0.005 }, pais) -
      atendimento({}, pais);
    expect(sobe("teste")).toBeGreaterThan(2);
    expect(sobe("teste-pobre")).toBeGreaterThan(sobe("teste"));
  });

  it("telemedicina só ajuda onde falta profissional", () => {
    const livre = { "telemedicina-livre": "livre" };
    expect(atendimento(livre, "teste-pobre")).toBeCloseTo(
      atendimento({}, "teste-pobre"),
    );
    const parede = { "gasto-saude": verba["teste-pobre"] };
    expect(atendimento({ ...parede, ...livre }, "teste-pobre")).toBeGreaterThan(
      atendimento(parede, "teste-pobre") + 3,
    );
  });

  it("esticar o profissional tira a verba parada da corrupção", () => {
    const parede = { "gasto-saude": verba["teste-pobre"] };
    const com = { ...parede, "telemedicina-livre": "livre" };
    expect(depois(com, "teste-pobre").jogabilidade.corrupcao).toBeLessThan(
      depois(parede, "teste-pobre").jogabilidade.corrupcao,
    );
  });

  it("o atendimento esticado custa saúde", () => {
    const parede = { "gasto-saude": verba["teste-pobre"] };
    const duro = { ...parede, "servico-obrigatorio": "todos-dois-anos" };
    const manso = { ...parede, "servico-obrigatorio": "todos-um-ano" };
    expect(depois(duro, "teste-pobre").jogabilidade.saude).toBeLessThan(
      depois(manso, "teste-pobre").jogabilidade.saude,
    );
  });

  it("lugar sorteado atende mais, mas perde profissionais e liberdade", () => {
    const parede = { "gasto-saude": verba["teste-pobre"] };
    const leis = (nivel: string) => ({
      ...parede,
      "servico-obrigatorio": nivel,
    });
    const sorteado = depois(leis("lugar-sorteado"), "teste-pobre").jogabilidade;
    const doisAnos = depois(
      leis("todos-dois-anos"),
      "teste-pobre",
    ).jogabilidade;
    expect(sorteado.atendimento).toBeGreaterThan(doisAnos.atendimento);
    expect(sorteado.profissionais_saude).toBeLessThan(
      doisAnos.profissionais_saude,
    );
    expect(sorteado.liberdade_civil).toBeLessThan(doisAnos.liberdade_civil);
  });

  it("a ficha mostra o ganho, o custo e quem larga a profissão", () => {
    const p = avancar(partida("teste-pobre"), [
      { tipo: "mudar_lei", lei: "gasto-saude", valor: 0.07 },
    ]);
    const { indices } = previaDaLei(
      jogar(p, 15),
      "servico-obrigatorio",
      "lugar-sorteado",
    );
    const de = (id: string) =>
      indices.filter((i) => i.id === id).reduce((s, i) => s + i.pontos, 0);
    expect(de("atendimento")).toBeGreaterThan(0);
    expect(de("profissionais_saude")).toBeLessThan(0);
  });
});

describe("saúde de dois andares", () => {
  it("mais planos sobem a desigualdade, e pesa mais com a fila grande", () => {
    const sobe = (pais: string) =>
      depois({ "abertura-planos": "mercado-aberto" }, pais).jogabilidade
        .desigualdade - depois({}, pais).jogabilidade.desigualdade;
    expect(sobe("teste")).toBeGreaterThan(1);
    expect(sobe("teste-pobre")).toBeGreaterThan(sobe("teste"));
  });

  it("limitar os planos baixa a desigualdade", () => {
    expect(
      depois({ "limite-planos": "proibidos" }).jogabilidade.desigualdade,
    ).toBeLessThan(depois().jogabilidade.desigualdade);
  });

  it("a ficha da Abertura mostra a desigualdade", () => {
    const { indices } = previaDaLei(
      partida(),
      "abertura-planos",
      "mercado-aberto",
    );
    const linha = indices.find((i) => i.id === "desigualdade");
    expect(linha?.pontos).toBeGreaterThan(0);
  });
});

describe("rede de atendimento", () => {
  it("sem lei nova, o atendimento fica perto de onde começou", () => {
    for (const pais of ["teste", "teste-pobre"]) {
      const inicio = partida(pais).estado.jogabilidade.atendimento;
      expect(
        Math.abs(depois({}, pais).jogabilidade.atendimento - inicio),
      ).toBeLessThan(3);
    }
  });

  it("a verba não mexe direto: a vaga só aparece depois da obra", () => {
    const pedido = [
      { tipo: "mudar_lei" as const, lei: "gasto-saude", valor: 0.05 },
    ];
    const inicio = partida().estado.jogabilidade.atendimento;
    const cedo = jogar(avancar(partida(), pedido), 2).estado.jogabilidade;
    expect(cedo.atendimento).toBeCloseTo(inicio, 0);
    expect(
      depois({ "gasto-saude": 0.05 }).jogabilidade.atendimento,
    ).toBeGreaterThan(inicio + 3);
  });

  it("atendimento maior puxa a saúde", () => {
    expect(depois({ "gasto-saude": 0.05 }).jogabilidade.saude).toBeGreaterThan(
      depois().jogabilidade.saude,
    );
  });

  it("verba cortada fecha vagas e a fila cresce", () => {
    expect(
      depois({ "gasto-saude": 0.02 }).jogabilidade.atendimento,
    ).toBeLessThan(depois().jogabilidade.atendimento - 1);
  });

  it("a mesma verba rende menos onde falta profissional", () => {
    const ganho = (pais: string, verba: number) =>
      depois({ "gasto-saude": verba }, pais).jogabilidade.atendimento -
      depois({}, pais).jogabilidade.atendimento;
    expect(ganho("teste-pobre", 0.1)).toBeLessThan(ganho("teste", 0.11));
  });

  it("cada ponto de verba rende menos que o anterior", () => {
    const vagas = (verba: number) =>
      depois({ "gasto-saude": verba }).atendimento?.vagas ?? 0;
    expect(vagas(0.06) - vagas(0.05)).toBeLessThan(vagas(0.05) - vagas(0.04));
  });

  it("verba que os profissionais não usam vira corrupção", () => {
    const sobra = depois({ "gasto-saude": 0.2 });
    expect(sobra.atendimento?.desvio).toBeGreaterThan(0);
    expect(sobra.jogabilidade.corrupcao).toBeGreaterThan(
      depois().jogabilidade.corrupcao,
    );
  });

  it("instrução nova demora para virar profissional", () => {
    const { regras, estado } = partida();
    const r = regras.atendimento as RegraDoAtendimento;
    const turno = {
      populacao: 1000,
      profissionais: 10,
      instrucao: 2,
      renda: 1,
      abandono: 0,
    };
    const { turmas } = fluxoDeProfissionais(r, estado.atendimento!, turno);
    expect(turmas).toBeLessThan(1.1);
  });

  it("proibir os planos põe quem tinha plano na fila da rede", () => {
    const sem = depois().atendimento?.planos ?? 0;
    const com = depois({ "limite-planos": "proibidos" }).atendimento?.planos;
    expect(com).toBeLessThan(sem * 0.5);
  });

  it("abertura e limite de planos não valem juntos", () => {
    const com = avancar(partida(), [
      { tipo: "mudar_lei", lei: "abertura-planos", valor: "poucos-planos" },
    ]);
    expect(() =>
      avancar(com, [
        { tipo: "mudar_lei", lei: "limite-planos", valor: "so-o-que-falta" },
      ]),
    ).toThrow(/colide/);
  });

  it("instrução melhor forma mais profissionais", () => {
    const hoje = partida();
    const estudo = {
      ...hoje,
      estado: {
        ...hoje.estado,
        base: { ...hoje.estado.base, instrucao: 80 },
      },
    };
    expect(
      jogar(estudo, TURNOS).estado.jogabilidade.profissionais_saude,
    ).toBeGreaterThan(
      jogar(hoje, TURNOS).estado.jogabilidade.profissionais_saude,
    );
  });

  it("quem perde renda real emigra, e a população cai", () => {
    const hoje = partida();
    const crise = {
      ...hoje,
      estado: {
        ...hoje.estado,
        essenciais: { ...hoje.estado.essenciais, inflacao: 60 },
      },
    };
    expect(jogar(crise, TURNOS).estado.essenciais.populacao).toBeLessThan(
      jogar(hoje, TURNOS).estado.essenciais.populacao,
    );
  });

  it("a ficha mostra o atendimento e a saúde", () => {
    const { indices } = previaDaLei(partida(), "gasto-saude", 0.05);
    expect(indices.find((i) => i.id === "atendimento")?.pontos).toBeGreaterThan(
      0,
    );
    expect(indices.find((i) => i.id === "saude")?.aosPoucos).toBe(true);
  });

  it("a bolha mostra a fila: quem falta atender", () => {
    const partida = criarPartida("teste", 1, { semCongresso: true });
    const bolha = montarVisao(partida).bolhas.find(
      (b) => b.id === "atendimento",
    );
    expect(bolha?.medida?.valor).toBeCloseTo(100 - bolha!.valor);
    expect(bolha?.medida?.unidade).toContain("fila");
  });

  it("o mapa liga as leis à fila e os profissionais à instrução", () => {
    const { ligacoes } = montarVisao(partida());
    const sinal = (origem: string, alvo: string) =>
      ligacoes.find((l) => l.origem === origem && l.alvo === alvo)?.sinal;
    expect(sinal("gasto-saude", "atendimento")).toBe(1);
    expect(sinal("profissionais_saude", "atendimento")).toBe(1);
    expect(sinal("instrucao", "profissionais_saude")).toBe(1);
    expect(sinal("atendimento", "saude")).toBe(1);
  });
});
