import { beforeAll, describe, expect, it } from "vitest";
import { criarPartida, encerrarTurno, type Partida } from "../app/partida";
import { congressoDoPacote, pacoteVivo } from "../game/congresso";
import {
  lembrancaDoDesempregado,
  lembrancaDoEmpregado,
  passarMemoria,
  passoDaCoorte,
} from "../game/congresso/memoria";
import { motivosDoPerfil } from "../game/congresso/motivos";
import { fracoesDeDesemprego } from "../game/congresso/vivo";

let partida: Partida;
beforeAll(() => {
  const r = criarPartida({ ocorrencias: false });
  if (!r.ok) throw new Error(r.erros.join("\n"));
  partida = r.value;
});

describe("memória de coorte do desemprego", () => {
  it("quem volta a trabalhar vira lembrança, que esfria com o tempo", () => {
    const antes = { fracao: 0.1, ex: 0, meses: 6 };
    const voltou = passoDaCoorte(antes, 0.04, 0.05, 2);
    expect(voltou.ex).toBeCloseTo(0.06);
    expect(voltou.fracao).toBe(0.04);
    // sem mudança no desemprego, a lembrança só esfria
    const depois = passoDaCoorte(voltou, 0.04, 0.05, 2);
    expect(depois.ex).toBeCloseTo(0.06 * 0.95);
  });

  it("quem perde o emprego de novo sai da lembrança e o tempo recomeça diluído", () => {
    const voltou = { fracao: 0.04, ex: 0.06, meses: 8 };
    const perdeu = passoDaCoorte(voltou, 0.1, 0, 2);
    expect(perdeu.ex).toBeLessThan(0.06);
    expect(perdeu.meses).toBeCloseTo((8 + 2) * (0.04 / 0.1));
  });

  it("sem desemprego, o tempo zera", () => {
    expect(
      passoDaCoorte({ fracao: 0.02, ex: 0, meses: 10 }, 0, 0, 2).meses,
    ).toBe(0);
  });

  it("gratidão e desalento saem em pontos, com as tags do JSON", () => {
    const regras = congressoDoPacote(partida.content)!.regras;
    const memoria = {
      desemprego: { 3: { fracao: 0.1, ex: 0.3, meses: 24 } },
    };
    const [g] = lembrancaDoEmpregado(memoria, 3, regras);
    expect(g.pontos).toBeGreaterThan(0);
    expect(g.pontos).toBeLessThanOrEqual(regras.memoria.desemprego.gratidao);
    expect(g.tags).toEqual(regras.memoria.desemprego.tags);
    const [d] = lembrancaDoDesempregado(memoria, 3, regras);
    expect(d.pontos).toBe(-regras.memoria.desemprego.desalento);
    expect(lembrancaDoEmpregado(memoria, 4, regras)).toEqual([]);
  });
});

describe("a memória no eleitorado vivo", () => {
  it("vira um motivo de origem memória, com tags, na linha certa", () => {
    const valores = partida.game.execution.values;
    const fixo = partida.content.manifest.congresso!;
    const regras = congressoDoPacote(partida.content)!.regras;
    const fracoes = fracoesDeDesemprego(fixo, valores);
    const linha = fracoes.findIndex((f) => f > 0.01);
    expect(linha).toBeGreaterThanOrEqual(0);
    const memoria = {
      desemprego: { [linha]: { fracao: fracoes[linha], ex: 0.2, meses: 12 } },
    };
    const sem = pacoteVivo(partida.content, valores)!;
    const com = pacoteVivo(partida.content, valores, memoria)!;
    const motivos = motivosDoPerfil(
      com.perfis[linha],
      com.pesoDoSegmento,
      valores,
    ).filter((m) => m.origem === "memoria");
    expect(motivos.map((m) => m.id)).toEqual(["voltou_a_trabalhar"]);
    expect(motivos[0].tags).toEqual(regras.memoria.desemprego.tags);
    expect(sem.perfis[linha].memoria).toBeUndefined();
    // a gêmea desempregada da mesma linha sente o desalento
    const gemea = com.perfis.findIndex((p) => p.memoria?.[0].pontos! < 0);
    expect(gemea).toBeGreaterThanOrEqual(fixo.perfis.length);
  });

  it("o fim do turno guarda a memória, e ela sobrevive a salvar e carregar", () => {
    let p = partida;
    for (let i = 0; i < 6; i++) {
      const r = encerrarTurno(p);
      if (!r.ok) throw new Error(JSON.stringify(r));
      p = r.value.partida;
    }
    const memoria = p.game.congress!.memoria!;
    expect(Object.keys(memoria.desemprego).length).toBeGreaterThan(0);
    expect(JSON.parse(JSON.stringify(memoria))).toEqual(memoria);
    const regras = congressoDoPacote(p.content)!.regras;
    expect(passarMemoria(memoria, [], regras).desemprego).toEqual({});
  });
});
