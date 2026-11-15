import { describe, expect, it } from "vitest";
import {
  avancar,
  carregarPartida,
  criarPartida,
  jogar,
  salvarPartida,
} from ".";

describe("salvar e carregar", () => {
  it("volta igual e continua igual", () => {
    const meio = jogar(criarPartida("teste", 42), 5, [
      { tipo: "mudar_lei", lei: "transferencia-renda", valor: 0.03 },
    ]);
    const volta = carregarPartida(salvarPartida(meio));
    expect(volta.estado).toEqual(meio.estado);
    expect(jogar(volta, 7).estado).toEqual(jogar(meio, 7).estado);
  });

  it("partida encerrada continua encerrada", () => {
    const fim = jogar(criarPartida("teste", 42), 24);
    expect(fim.estado.encerrada).toBe(true);
    const volta = carregarPartida(salvarPartida(fim));
    expect(volta.estado.encerrada).toBe(true);
    expect(() => avancar(volta)).toThrow(/encerrada/);
  });

  it("texto ruim dá erro com motivo", () => {
    expect(() => carregarPartida("{")).toThrow(/não é JSON/);
    expect(() => carregarPartida('{"versao":2}')).toThrow(/versao/);
    expect(() =>
      carregarPartida(
        '{"versao":1,"pais":"nao-existe","semente":1,"estado":{}}',
      ),
    ).toThrow(/nao-existe/);
  });
});

describe("partida salva antes das potências", () => {
  it("carrega com as opiniões de partida do país", () => {
    const p = criarPartida("teste", 7);
    const antigo = JSON.parse(salvarPartida(p)) as {
      estado: { opinioes?: unknown };
    };
    delete antigo.estado.opinioes;
    const carregada = carregarPartida(JSON.stringify(antigo));
    expect(carregada.estado.opinioes).toEqual(p.estado.opinioes);
  });
});

describe("partida salva antes de a lei mudar", () => {
  it("lei que saiu do mundo sai; opção trocada volta; lei nova entra", () => {
    const p = jogar(criarPartida("brasil-2026", 7), 2);
    const antigo = JSON.parse(salvarPartida(p)) as {
      estado: {
        leis: Record<string, unknown>;
        marco: { leis: Record<string, unknown> };
        efeitos: { lei: string }[];
      };
    };
    for (const leis of [antigo.estado.leis, antigo.estado.marco.leis]) {
      delete leis["imposto-renda-rico"];
      leis["imposto-renda"] = 0.2;
      leis["aposentadoria-flexivel"] = "opcao-que-nao-existe";
    }
    antigo.estado.efeitos.push({
      ...antigo.estado.efeitos[0],
      lei: "imposto-renda",
    });
    const volta = carregarPartida(JSON.stringify(antigo));
    expect(volta.estado.leis["imposto-renda"]).toBeUndefined();
    expect(volta.estado.leis["imposto-renda-rico"]).toBe(
      p.estado.leis["imposto-renda-rico"],
    );
    expect(volta.estado.marco.leis["imposto-renda-rico"]).toBeDefined();
    expect(volta.estado.efeitos.some((e) => e.lei === "imposto-renda")).toBe(
      false,
    );
    expect(() => jogar(volta, 2)).not.toThrow();
  });
});
