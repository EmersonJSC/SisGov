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
    const antigo = JSON.parse(salvarPartida(p)) as { estado: { opinioes?: unknown } };
    delete antigo.estado.opinioes;
    const carregada = carregarPartida(JSON.stringify(antigo));
    expect(carregada.estado.opinioes).toEqual(p.estado.opinioes);
  });
});
