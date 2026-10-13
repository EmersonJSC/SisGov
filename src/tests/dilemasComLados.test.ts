/**
 * Dilemas com lados (V1-13): aceite do chamado e regra do verificador
 * (docs/v1/desenho/dilemas.md, seção 1).
 */
import { beforeAll, describe, expect, it } from "vitest";
import {
  criarPartida,
  responderDilema,
  verBussola,
  type Partida,
} from "../app/partida";
import { efeitosDoNo } from "../app/partida/visao";
import { bussolaDoMundo } from "../game/bussola";

let partida: Partida;
beforeAll(() => {
  const r = criarPartida({ ocorrencias: false });
  if (!r.ok) throw new Error(r.erros.join("\n"));
  partida = r.value;
});

/** O efeito é ganho (+1), perda (−1) ou neutro (0) para o país. */
function sinal(id: string, pontos: number, avaliacao?: string): number {
  // gasto sobe = custo para as contas, mesmo sem avaliação na variável
  if (id === "gasto_publico") return -Math.sign(pontos);
  if (avaliacao === "maior_melhor") return Math.sign(pontos);
  if (avaliacao === "maior_pior") return -Math.sign(pontos);
  return 0;
}

/** Saldo das instituições: corrupção e captura pesam contra. */
const INSTITUICOES: Readonly<Record<string, number>> = {
  confianca_instituicoes: 1,
  forca_instituicoes: 1,
  corrupcao: -1,
  captura_politica: -1,
};

describe("lados (verificador)", () => {
  it("todo dilema tem lado em todas as opções, com tema e motivo, de −2 a +2", () => {
    const temas = new Set(Object.keys(bussolaDoMundo.temas));
    for (const d of partida.content.dilemmas) {
      const dados = bussolaDoMundo.dilemas?.[d.id];
      expect(dados, d.id).toBeDefined();
      expect(dados!.porque.length, d.id).toBeGreaterThan(0);
      expect(dados!.manifesto.length, d.id).toBeGreaterThan(0);
      for (const t of dados!.manifesto)
        expect(temas.has(t), `${d.id} ${t}`).toBe(true);
      expect(Object.keys(dados!.opcoes).sort(), d.id).toEqual(
        (d.opcoes ?? []).map((o) => o.id).sort(),
      );
      for (const v of Object.values(dados!.opcoes))
        for (const x of v) expect(Math.abs(x), d.id).toBeLessThanOrEqual(2);
    }
  });

  it("as opções ficam em lugares diferentes da bússola (distância de 1 ou mais)", () => {
    for (const d of partida.content.dilemmas) {
      const dados = bussolaDoMundo.dilemas![d.id];
      if (dados.eixo === "governo") continue;
      const v = Object.values(dados.opcoes);
      const maior = Math.max(
        ...v.flatMap((a) => v.map((b) => Math.hypot(a[0] - b[0], a[1] - b[1]))),
      );
      expect(maior, d.id).toBeGreaterThanOrEqual(1);
    }
  });

  it("dilema de governo troca base no Congresso por confiança nas instituições", () => {
    for (const d of partida.content.dilemmas) {
      if (bussolaDoMundo.dilemas![d.id].eixo !== "governo") continue;
      const contas = (d.opcoes ?? []).map((op) => {
        const ef = efeitosDoNo(partida.content, op.controle);
        return {
          base: ef
            .filter((e) => e.id === "base_congresso")
            .reduce((s, e) => s + e.pontos, 0),
          inst: ef.reduce(
            (s, e) => s + (INSTITUICOES[e.id] ?? 0) * e.pontos,
            0,
          ),
        };
      });
      const troca = contas.some((a) =>
        contas.some((b) => a.base > b.base && a.inst < b.inst),
      );
      expect(troca, d.id).toBe(true);
    }
  });

  it("nenhuma opção sai de graça: toda opção tem alguma perda", () => {
    const semCusto: string[] = [];
    for (const d of partida.content.dilemmas)
      for (const op of d.opcoes ?? []) {
        const ef = efeitosDoNo(partida.content, op.controle);
        if (!ef.some((e) => sinal(e.id, e.pontos, e.avaliacao) < 0))
          semCusto.push(`${d.id}/${op.id}`);
      }
    expect(semCusto).toEqual([]);
  });
});

describe("resposta anda o ponto", () => {
  it("a resposta entra na bússola para o lado da opção", () => {
    const comMesa = criarPartida({ semente: 5 });
    if (!comMesa.ok) throw new Error(comMesa.erros.join("\n"));
    // põe um dilema de lado econômico na mesa
    const p0: Partida = {
      ...comMesa.value,
      game: {
        ...comMesa.value.game,
        occurrences: {
          ...comMesa.value.game.occurrences!,
          pending: [{ occurrenceId: "resgate-bancario", openedTurn: 0 }],
        },
      },
    };
    const antes = verBussola(p0)!.ponto.economia;
    const mercado = responderDilema(p0, "resgate-bancario", "deixar-quebrar");
    const estado = responderDilema(p0, "resgate-bancario", "salvar");
    if (!mercado.ok) throw new Error(mercado.erros.join("\n"));
    if (!estado.ok) throw new Error(estado.erros.join("\n"));
    expect(verBussola(mercado.value)!.ponto.economia).toBeGreaterThan(antes);
    expect(verBussola(estado.value)!.ponto.economia).toBeLessThan(antes);
    expect(mercado.value.game.compass?.decisoes).toEqual([
      { dilema: "resgate-bancario", opcao: "deixar-quebrar", turno: 0 },
    ]);
  });
});
