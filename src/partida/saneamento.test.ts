// Rede de água e esgoto: o índice sai da contagem, e cada caminho cobra um preço.
import { describe, expect, it } from "vitest";
import {
  andarSaneamento,
  indiceDoSaneamento,
  ritmoDoSetor,
  saneamentoInicial,
  type LeisDoSaneamento,
  type RegraDoSaneamento,
  type TurnoDoSaneamento,
} from "../motor";
import { avancar, criarPartida, jogar, montarVisao, previaDaLei } from ".";

const base = () => criarPartida("teste", 42, { semCongresso: true });
const TURNOS = 20;

/** Índices depois de `TURNOS` turnos, com as leis pedidas no primeiro. */
function depois(leis: Record<string, number | string> = {}) {
  const pedidos = Object.entries(leis).map(([lei, valor]) => ({
    tipo: "mudar_lei" as const,
    lei,
    valor,
  }));
  return jogar(avancar(base(), pedidos), TURNOS - 1).estado.jogabilidade;
}

const regra: RegraDoSaneamento = {
  indice: "s",
  indice_vida: "v",
  indice_ambiente: "a",
  lei_verba: "lv",
  lei_concessao: "lc",
  lei_teto: "lt",
  lei_tratamento: "lx",
  pessoas_por_familia: 3,
  custo_ligacao: 2,
  prazo: 4,
  desgaste: 0.02,
  concessao_por_ano: 0.05,
  vida_por_concessao: 5,
  vida_por_teto: 5,
  custo_tratamento: 1,
  ambiente_por_tratamento: 20,
  renda_minima: 0.25,
  tarifa_por_concessao: 0.5,
  corte: 0.5,
  velocidade: 0.05,
  folga_do_setor: 2,
};
const nada: LeisDoSaneamento = {
  verba: 0,
  concessao: 0,
  teto: 0,
  tratamento: 0,
};
const pais = {
  populacao: 3_000_000,
  saneamento: 50,
  leis: nada,
  atraso: 0,
  sem_bolso: 0,
  trabalho_casas: 0,
};
const parado: TurnoDoSaneamento = {
  populacao: pais.populacao,
  leis: nada,
  atraso: 0,
  atraso_inicial: 0,
  setor: 1,
  animo: 1,
  sem_lucro: 0,
  ritmo: 1,
  aperto: 0,
};

/** Índice depois de `turnos` turnos com as mesmas condições. */
function rede(turnos: number, mudanca: Partial<TurnoDoSaneamento> = {}) {
  let s = saneamentoInicial(regra, pais);
  for (let t = 0; t < turnos; t++)
    s = andarSaneamento(regra, s, { ...parado, ...mudanca });
  return indiceDoSaneamento(regra, s, pais.populacao);
}

describe("rede (motor)", () => {
  it("com tudo como no turno 0, a rede fica parada", () => {
    expect(rede(50)).toBeCloseTo(50, 1);
  });

  it("sem obra nova, a rede desgasta", () => {
    expect(rede(50, { animo: 0 })).toBeLessThan(45);
  });

  it("a empresa para onde acaba o lucro: favela e campo ficam de fora", () => {
    const leis = { ...nada, concessao: 1 };
    expect(rede(300, { leis, sem_lucro: 400_000 })).toBeLessThan(62);
    expect(rede(300, { leis })).toBeGreaterThan(90);
  });

  it("o índice do turno 0 é o do país, mesmo com gente cortada", () => {
    const s = saneamentoInicial(regra, { ...pais, sem_bolso: 0.4 });
    expect(s.cortadas).toBeGreaterThan(0);
    expect(indiceDoSaneamento(regra, s, pais.populacao)).toBeCloseTo(50);
  });

  it("quem não paga é cortado; quem volta a pagar é religado", () => {
    let s = saneamentoInicial(regra, { ...pais, sem_bolso: 0.4 });
    const andar = (aperto: number) => {
      for (let t = 0; t < 100; t++)
        s = andarSaneamento(regra, s, { ...parado, aperto });
      return indiceDoSaneamento(regra, s, pais.populacao);
    };
    expect(andar(0.2)).toBeLessThan(47);
    expect(andar(-0.2)).toBeGreaterThan(53);
  });

  it("setor cheio atrasa a obra, e setor maior aguenta mais", () => {
    expect(ritmoDoSetor(regra, 1, 150, 100)).toBe(1);
    expect(ritmoDoSetor(regra, 1, 400, 100)).toBeCloseTo(0.5);
    expect(ritmoDoSetor(regra, 2, 400, 100)).toBe(1);
    expect(
      rede(10, { leis: { ...nada, verba: 0.02 }, ritmo: 0.25 }),
    ).toBeLessThan(rede(10, { leis: { ...nada, verba: 0.02 } }));
  });
});

describe("bolso: a mesma lei, países diferentes", () => {
  /** Saneamento depois de 20 turnos, contra o país sem a lei. */
  function ganho(pais: string, lei: string, valor: string) {
    const partida = () => criarPartida(pais, 42, { semCongresso: true });
    const fim = (p: ReturnType<typeof partida>) =>
      jogar(p, TURNOS - 1).estado.jogabilidade.saneamento;
    return (
      fim(avancar(partida(), [{ tipo: "mudar_lei", lei, valor }])) -
      fim(avancar(partida()))
    );
  }

  it("a concessão rende menos no país pobre: a conta corta gente", () => {
    expect(ganho("teste-pobre", "concessao-rede", "quase-todas")).toBeLessThan(
      ganho("teste", "concessao-rede", "quase-todas"),
    );
  });

  it("o teto da tarifa ajuda mais no país pobre: a conta cabe no bolso", () => {
    expect(ganho("teste-pobre", "teto-tarifa", "so-inflacao")).toBeGreaterThan(
      ganho("teste", "teto-tarifa", "so-inflacao"),
    );
  });
});

describe("rede de saneamento", () => {
  it("sem lei nova, o saneamento fica perto de onde começou", () => {
    const inicio = base().estado.jogabilidade.saneamento;
    expect(Math.abs(depois().saneamento - inicio)).toBeLessThan(3);
  });

  it("a lei não mexe direto: a verba só aparece depois da obra", () => {
    const pedido = [
      { tipo: "mudar_lei" as const, lei: "saneamento-basico", valor: 0.02 },
    ];
    const cedo = jogar(avancar(base(), pedido), 5).estado.jogabilidade;
    expect(cedo.saneamento).toBeCloseTo(
      jogar(base(), 6).estado.jogabilidade.saneamento,
      1,
    );
    expect(depois({ "saneamento-basico": 0.02 }).saneamento).toBeGreaterThan(
      depois().saneamento + 1,
    );
  });

  it("saneamento maior puxa saúde e meio ambiente", () => {
    const sem = depois();
    const com = depois({ "saneamento-basico": 0.02 });
    expect(com.saude).toBeGreaterThan(sem.saude);
    expect(com.meio_ambiente).toBeGreaterThan(sem.meio_ambiente);
  });

  it("concessão sobe o saneamento e cobra no padrão de vida", () => {
    const sem = depois();
    const com = depois({ "concessao-rede": "quase-todas" });
    expect(com.saneamento).toBeGreaterThan(sem.saneamento);
    expect(com.padrao_vida).toBeLessThan(sem.padrao_vida);
  });

  it("teto da tarifa dá padrão de vida e desgasta a rede", () => {
    const sem = depois();
    const com = depois({ "teto-tarifa": "so-inflacao" });
    expect(com.padrao_vida).toBeGreaterThan(sem.padrao_vida);
    expect(com.saneamento).toBeLessThan(sem.saneamento);
  });

  it("concessão e teto da tarifa não valem juntos", () => {
    const com = avancar(base(), [
      { tipo: "mudar_lei", lei: "concessao-rede", valor: "poucas-cidades" },
    ]);
    expect(() =>
      avancar(com, [
        { tipo: "mudar_lei", lei: "teto-tarifa", valor: "so-inflacao" },
      ]),
    ).toThrow(/colide/);
  });

  it("tratamento melhora o meio ambiente e a rede cresce menos", () => {
    const verba = { "saneamento-basico": 0.02 };
    const sem = depois(verba);
    const com = depois({ ...verba, "tratamento-esgoto": "noventa" });
    expect(com.saneamento).toBeLessThan(sem.saneamento);
    expect(com.meio_ambiente).toBeGreaterThan(sem.meio_ambiente);
  });

  it("a ficha mostra o saneamento por ano e o resto aos poucos", () => {
    const { indices } = previaDaLei(base(), "saneamento-basico", 0.02);
    const rede = indices.find((i) => i.id === "saneamento");
    expect(rede?.pontos).toBeGreaterThan(0);
    expect(rede?.porAno).toBe(true);
    for (const id of ["saude", "meio_ambiente"]) {
      const linha = indices.find((i) => i.id === id);
      expect(linha?.pontos).toBeGreaterThan(0);
      expect(linha?.aosPoucos).toBe(true);
    }
    expect(indices.some((i) => i.id === "favela")).toBe(false);
  });

  it("o mapa liga as leis à rede e a rede ao que ela puxa", () => {
    const { ligacoes } = montarVisao(base());
    const sinal = (origem: string, alvo: string) =>
      ligacoes.find((l) => l.origem === origem && l.alvo === alvo)?.sinal;
    expect(sinal("saneamento-basico", "saneamento")).toBe(1);
    expect(sinal("concessao-rede", "padrao_vida")).toBe(-1);
    expect(sinal("saneamento", "saude")).toBe(1);
    expect(sinal("saneamento", "meio_ambiente")).toBe(1);
  });
});
