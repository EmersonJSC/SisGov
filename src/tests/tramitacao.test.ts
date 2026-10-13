/**
 * Tramitação e votação (V1-12): aceite do chamado
 * (docs/v1/desenho/tramitacao.md, seção 7).
 */
import { beforeAll, describe, expect, it } from "vitest";
import {
  criarPartida,
  encerrarTurno,
  enviarAoCongresso,
  responderPedido,
  type Partida,
} from "../app/partida";
import {
  chancesDoProjeto,
  estadoDaTramitacao,
  votarNoCongresso,
} from "../app/partida/tramitacao";
import {
  JOGADOR,
  congressoDoPacote,
  maioresRestos,
  retratoDoCongresso,
} from "../game/congresso";
import { pontoAtual } from "../game/bussola";
import { policyInForce } from "../game/policyRequirements";
import {
  etapasDo,
  etapasPorTurno,
  nivelNoCongresso,
  ordemDaFila,
  quorum,
  votacoesNoTurno,
  type NivelNoCongresso,
  type Saida,
} from "../game/tramitacao";

let partida: Partida;
beforeAll(() => {
  const r = criarPartida({ ocorrencias: false });
  if (!r.ok) throw new Error(r.erros.join("\n"));
  partida = r.value;
});

/** O Congresso com o partido do jogador numa fatia e todos de mau humor. */
function comCongresso(p: Partida, fatia: number, humor: number): Partida {
  const pacote = congressoDoPacote(p.content)!;
  const congress = p.game.congress!;
  const casas = Object.fromEntries(
    pacote.casas.map((casa) => {
      const outros = Object.fromEntries(
        Object.entries(congress.casas[casa.id]).filter(
          ([id]) => id !== JOGADOR,
        ),
      );
      const doJogador = Math.round(fatia * casa.cadeiras);
      return [
        casa.id,
        {
          ...maioresRestos(outros, casa.cadeiras - doJogador),
          [JOGADOR]: doJogador,
        },
      ];
    }),
  );
  return {
    ...p,
    game: {
      ...p.game,
      congress: {
        ...congress,
        casas,
        exatas: casas,
        humor: Object.fromEntries(pacote.bancadas.map((b) => [b.id, humor])),
      },
    },
  };
}

/** Primeira lei do nível pedido com uma opção diferente da que vale. */
function leiDo(
  p: Partida,
  tipo: NivelNoCongresso,
  aceita: (area?: string) => boolean = () => true,
): { id: string; nivel: number; antes?: number } {
  for (const policy of p.content.policies) {
    if (nivelNoCongresso(policy) !== tipo || !aceita(policy.area)) continue;
    const atual = policyInForce(p.game.policies, policy.id);
    const nivel = policy.controle.opcoes
      ?.map((o) => o.valor)
      .find((v) => !atual || Math.abs(v - atual.desiredLevel) > 1e-9);
    if (nivel === undefined) continue;
    if (!enviarAoCongresso(p, policy.id, nivel).ok) continue;
    return { id: policy.id, nivel, antes: atual?.desiredLevel };
  }
  throw new Error(`Nenhuma lei ${tipo} disponível.`);
}

/** Encerra turnos até a lei sair da fila (ou o limite). */
function ateSair(p: Partida, lei: string, limite = 6) {
  let atual = p;
  for (let t = 0; t < limite; t++) {
    const r = encerrarTurno(atual);
    if (!r.ok) throw new Error(r.erros.join("\n"));
    atual = r.value.partida;
    const saida = r.value.relatorio.congresso.saidas.find((s) => s.lei === lei);
    if (saida) return { partida: atual, saida, relatorio: r.value.relatorio };
  }
  throw new Error(`A lei ${lei} não saiu da fila em ${limite} turnos.`);
}

const nivelDe = (p: Partida, lei: string) =>
  policyInForce(p.game.policies, lei)?.desiredLevel;

describe("contas", () => {
  it("quórum: 3/5 dá 308 e 49; maioria absoluta dá 257 e 41", () => {
    expect(quorum(0.6, 513)).toBe(308);
    expect(quorum(0.6, 81)).toBe(49);
    expect(quorum("maioria-absoluta", 513)).toBe(257);
    expect(quorum("maioria-absoluta", 81)).toBe(41);
  });

  it("emenda vota duas vezes em cada casa; lei, uma", () => {
    expect(etapasDo("emenda", ["camara", "senado"], 2)).toHaveLength(4);
    expect(etapasDo("lei-ordinaria", ["camara", "senado"], 2)).toHaveLength(2);
    expect(etapasPorTurno("lei-ordinaria", "urgencia")).toBe(2);
    expect(etapasPorTurno("emenda", "urgencia")).toBe(1);
    expect(etapasPorTurno("emenda", "emergencia")).toBe(2);
  });

  it("sem apoio o Congresso ignora a fila; com mais apoio, vota mais", () => {
    expect(votacoesNoTurno(15, 4, 20)).toBe(0);
    expect(votacoesNoTurno(20, 4, 20)).toBe(1);
    expect(votacoesNoTurno(50, 4, 20)).toBe(2);
    expect(votacoesNoTurno(100, 4, 20)).toBe(4);
  });

  it("a lei que o povo mais quer passa na frente", () => {
    const projeto = (id: string, opiniao: number) => ({
      id,
      lei: id,
      nivel: 1,
      tipo: "lei-ordinaria" as const,
      pressa: "normal" as const,
      enviadoNoTurno: 0,
      etapas: [],
      previsao: {
        segmentos: {},
        opiniao,
        antes: { economia: 0, costumes: 0 },
        depois: { economia: 0, costumes: 0 },
        dano: {},
      },
    });
    const ordem = ordemDaFila(
      [projeto("a", 0.1), projeto("b", 2), projeto("c", -1)],
      1,
      { urgencia: 5, emergencia: 10 },
      2,
    );
    expect(ordem.map((p) => p.id)).toEqual(["b", "a", "c"]);
  });
});

describe("envio", () => {
  it("pétrea e decreto não vão ao Congresso; emenda não tem urgência", () => {
    const petrea = partida.content.policies.find(
      (p) => nivelNoCongresso(p) === "petrea",
    );
    if (petrea) expect(enviarAoCongresso(partida, petrea.id, 1).ok).toBe(false);
    const emenda = leiDo(partida, "emenda");
    expect(
      enviarAoCongresso(partida, emenda.id, emenda.nivel, {
        pressa: "urgencia",
      }).ok,
    ).toBe(false);
  });

  it("modo emergência tem limite por ano e irrita as bancadas", () => {
    let p = partida;
    const pacote = congressoDoPacote(p.content)!;
    const limite = pacote.regras.tramitacao.emergenciasPorAno;
    const usadas: string[] = [];
    for (const policy of p.content.policies) {
      if (usadas.length > limite) break;
      if (nivelNoCongresso(policy) !== "lei-ordinaria") continue;
      const atual = policyInForce(p.game.policies, policy.id);
      const nivel = policy.controle.opcoes
        ?.map((o) => o.valor)
        .find((v) => !atual || Math.abs(v - atual.desiredLevel) > 1e-9);
      if (nivel === undefined) continue;
      const r = enviarAoCongresso(p, policy.id, nivel, {
        pressa: "emergencia",
      });
      if (usadas.length < limite) {
        if (!r.ok) continue;
        p = r.value;
        usadas.push(policy.id);
      } else {
        expect(r.ok).toBe(false);
        usadas.push(policy.id);
      }
    }
    expect(usadas).toHaveLength(limite + 1);
    const humor = p.game.congress!.humor;
    expect(humor.centrao).toBeCloseTo(
      limite * pacote.regras.tramitacao.humor.emergencia,
    );
  });

  it("a mesma lei não entra duas vezes na fila", () => {
    const lei = leiDo(partida, "lei-ordinaria");
    const r = enviarAoCongresso(partida, lei.id, lei.nivel);
    if (!r.ok) throw new Error(r.erros.join("\n"));
    expect(enviarAoCongresso(r.value, lei.id, lei.nivel).ok).toBe(false);
  });
});

describe("votação", () => {
  it("emenda sem 3/5 nas duas casas não passa", () => {
    const p = comCongresso(partida, 0.55, -100);
    const lei = leiDo(p, "emenda");
    const r = enviarAoCongresso(p, lei.id, lei.nivel);
    if (!r.ok) throw new Error(r.erros.join("\n"));
    const fim = ateSair(r.value, lei.id);
    expect(fim.saida.motivo).toBe("caiu");
    expect(nivelDe(fim.partida, lei.id)).toBe(lei.antes);
    // rejeitada, só volta no ano seguinte
    expect(enviarAoCongresso(fim.partida, lei.id, lei.nivel).ok).toBe(false);
  });

  it("com maioria própria, lei ordinária passa sem acordo", () => {
    const p = comCongresso(partida, 0.7, -100);
    const lei = leiDo(p, "lei-ordinaria");
    const r = enviarAoCongresso(p, lei.id, lei.nivel);
    if (!r.ok) throw new Error(r.erros.join("\n"));
    const fim = ateSair(r.value, lei.id);
    expect(fim.saida.motivo).toBe<Saida["motivo"]>("passou");
    expect(nivelDe(fim.partida, lei.id)).toBe(lei.nivel);
    expect(estadoDaTramitacao(fim.partida.game).pedidos).toHaveLength(0);
  });

  it("mesma semente, mesma votação", () => {
    const lei = leiDo(partida, "lei-ordinaria");
    const r = enviarAoCongresso(partida, lei.id, lei.nivel);
    if (!r.ok) throw new Error(r.erros.join("\n"));
    const a = votarNoCongresso(r.value).resultado;
    const b = votarNoCongresso(r.value).resultado;
    expect(a.votacoes.length).toBeGreaterThan(0);
    expect(b).toEqual(a);
  });

  it("sem apoio, o Congresso ignora a fila", () => {
    const p = comCongresso(partida, 0.05, -100);
    const lei = leiDo(p, "lei-ordinaria");
    const r = enviarAoCongresso(p, lei.id, lei.nivel);
    if (!r.ok) throw new Error(r.erros.join("\n"));
    const semApoio: Partida = {
      ...r.value,
      game: {
        ...r.value.game,
        execution: {
          ...r.value.game.execution,
          values: {
            ...r.value.game.execution.values,
            popularidade_governo: 0,
          },
        },
      },
    };
    const votado = votarNoCongresso(semApoio);
    expect(votado.resultado.votacoes).toHaveLength(0);
    expect(estadoDaTramitacao(votado.partida.game).fila).toHaveLength(1);
  });

  it("medida provisória vale na hora e, se cair, desfaz o efeito", () => {
    const p = comCongresso(partida, 0.05, -100);
    const proibidas = ["Segurança, justiça e drogas"];
    const lei = leiDo(
      p,
      "lei-ordinaria",
      (area) => !proibidas.includes(area ?? ""),
    );
    const r = enviarAoCongresso(p, lei.id, lei.nivel, {
      medidaProvisoria: true,
    });
    if (!r.ok) throw new Error(r.erros.join("\n"));
    expect(nivelDe(r.value, lei.id)).toBe(lei.nivel);
    const fim = ateSair(r.value, lei.id);
    expect(["caiu", "caducou"]).toContain(fim.saida.motivo);
    expect(nivelDe(fim.partida, lei.id)).toBe(lei.antes);
  });
});

describe("frentes dos dois lados (congresso.md 5.3)", () => {
  /** Chance de sim de cada bancada se a lei for mandada nesse nível. */
  function chances(lei: string, nivel: number) {
    const r = enviarAoCongresso(partida, lei, nivel);
    if (!r.ok) throw new Error(r.erros.join("\n"));
    const pacote = congressoDoPacote(partida.content)!;
    const retrato = retratoDoCongresso({
      content: partida.content,
      estado: partida.game.congress!,
      valores: partida.game.execution.values,
      pontoDoJogador: pontoAtual(
        partida.content,
        partida.game.compass!,
        partida.game.policies,
      ),
    });
    const previsao = estadoDaTramitacao(r.value.game).fila[0].previsao;
    return chancesDoProjeto(pacote, retrato, previsao);
  }

  it.each([
    ["aborto", 0, "direita"],
    ["aborto", 100, "esquerda"],
    ["armas-de-fogo", 100, "direita"],
    ["armas-de-fogo", 0, "esquerda"],
  ] as const)(
    "lei de costumes %s = %d divide: a %s a favor, o outro lado contra",
    (lei, nivel, lado) => {
      const c = chances(lei, nivel);
      const aFavor =
        lado === "direita"
          ? ["direita", "extrema_direita"]
          : ["esquerda", "extrema_esquerda"];
      const contra =
        lado === "direita"
          ? ["esquerda", "extrema_esquerda"]
          : ["direita", "extrema_direita"];
      for (const b of aFavor) expect(c[b], b).toBeGreaterThan(0.5);
      for (const b of contra) expect(c[b], b).toBeLessThan(0.5);
    },
  );

  it("medida provisória da lei que acabou de cair irrita mais", () => {
    const lei = leiDo(
      partida,
      "lei-ordinaria",
      (a) => a !== "Segurança, justiça e drogas",
    );
    const pacote = congressoDoPacote(partida.content)!;
    const { humor } = pacote.regras.tramitacao;
    const derrotada: Partida = {
      ...partida,
      game: {
        ...partida.game,
        bills: {
          ...estadoDaTramitacao(partida.game),
          saidas: [
            { turno: 0, projeto: "projeto-0", lei: lei.id, motivo: "caiu" },
          ],
        },
      },
    };
    const comum = enviarAoCongresso(partida, lei.id, lei.nivel, {
      medidaProvisoria: true,
    });
    const depois = enviarAoCongresso(derrotada, lei.id, lei.nivel, {
      medidaProvisoria: true,
    });
    if (!comum.ok || !depois.ok) throw new Error("medida provisória");
    expect(comum.value.game.congress!.humor.centro).toBeCloseTo(
      humor.medidaProvisoria,
    );
    expect(depois.value.game.congress!.humor.centro).toBeCloseTo(
      humor.medidaProvisoriaDepoisDaDerrota,
    );
  });
});

describe("pedidos", () => {
  it("pedido aceito muda o voto da bancada que pediu", () => {
    const lei = leiDo(partida, "lei-ordinaria");
    const r = enviarAoCongresso(partida, lei.id, lei.nivel);
    if (!r.ok) throw new Error(r.erros.join("\n"));
    const estado = estadoDaTramitacao(r.value.game);
    const projeto = estado.fila[0];
    const comPedido: Partida = {
      ...r.value,
      game: {
        ...r.value.game,
        bills: {
          ...estado,
          fila: [{ ...projeto, aguardando: "pedido-x", pediu: true }],
          pedidos: [
            {
              id: "pedido-x",
              projeto: projeto.id,
              bancada: "centrao",
              tipo: "verba",
              turno: 0,
            },
          ],
        },
      },
    };
    const chance = (p: Partida) => {
      const pacote = congressoDoPacote(p.content)!;
      const retrato = retratoDoCongresso({
        content: p.content,
        estado: p.game.congress!,
        valores: p.game.execution.values,
        pontoDoJogador: pontoAtual(p.content, p.game.compass!, p.game.policies),
      });
      return chancesDoProjeto(pacote, retrato, projeto.previsao).centrao;
    };
    const aceito = responderPedido(comPedido, "pedido-x", true);
    const recusado = responderPedido(comPedido, "pedido-x", false);
    if (!aceito.ok || !recusado.ok) throw new Error("pedido");
    expect(chance(aceito.value)).toBeGreaterThan(chance(comPedido));
    expect(chance(recusado.value)).toBeLessThan(chance(comPedido));
    // a verba sai do cofre (ou vira dívida) e o projeto volta a andar
    const antes = comPedido.game.execution.values;
    const depois = aceito.value.game.execution.values;
    expect(
      (antes.cofre ?? 0) -
        (depois.cofre ?? 0) +
        (depois.divida_publica ?? 0) -
        (antes.divida_publica ?? 0),
    ).toBeCloseTo(0.05);
    expect(estadoDaTramitacao(aceito.value.game).fila[0].aguardando).toBe(
      undefined,
    );
  });
});
