// Rede de atendimento: a fila sai da contagem de vagas, planos e profissionais.
import { describe, expect, it } from "vitest";
import { indiceDoAtendimento, type RegraDoAtendimento } from "../motor";
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
