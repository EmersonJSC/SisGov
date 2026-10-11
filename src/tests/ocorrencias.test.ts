/**
 * SG106 — ocorrências: eventos que o país sofre, dilemas na mesa do
 * presidente, situações que surgem e somem. Mecânica com ocorrências de
 * teste (sorteio por hash da semente) e com o catálogo do mundo.
 */
import { describe, expect, it } from "vitest";
import {
  criarPartida,
  encerrarTurno,
  preverDilema,
  responderDilema,
  verPartida,
  type Partida,
} from "../app/partida";
import type { OccurrenceFile, ResolvedPackage } from "../engine";
import {
  advanceOccurrenceMonths,
  answerDilemma,
  emptyOccurrenceState,
  occurrenceChance,
  roll,
  rollTurn,
  type OccurrenceState,
} from "../game/occurrences";

function nova(semente = 1): Partida {
  const criada = criarPartida({ semente });
  if (!criada.ok) throw new Error(criada.erros.join(" "));
  return criada.value;
}

/** Responde a mesa com a primeira opção disponível e encerra o turno. */
function jogar(partida: Partida, turnos: number): Partida {
  let atual = partida;
  for (let t = 0; t < turnos; t++) {
    for (const dilema of verPartida(atual).ocorrencias.mesa) {
      const opcao = dilema.opcoes.find((o) => o.disponivel)!;
      const r = responderDilema(atual, dilema.id, opcao.id);
      if (!r.ok) throw new Error(r.erros.join(" "));
      atual = r.value;
    }
    const passou = encerrarTurno(atual);
    if (!passou.ok) throw new Error(`turno ${t + 1}: ${passou.erros}`);
    atual = passou.value.partida;
  }
  return atual;
}

// ---------------------------------------------------------------------------
// Ocorrências de teste
// ---------------------------------------------------------------------------

const base = nova().content;

function evento(
  id: string,
  campos: Partial<OccurrenceFile> = {},
): OccurrenceFile {
  return {
    id,
    tipo: "evento",
    versaoEsquema: 1,
    nome: id,
    origem: "mundo",
    nivel: 2,
    gatilho: { chance: 1 },
    consequencias: [],
    ...campos,
  };
}

function dilema(
  id: string,
  campos: Partial<OccurrenceFile> = {},
): OccurrenceFile {
  return {
    id,
    tipo: "dilema",
    versaoEsquema: 1,
    nome: id,
    origem: "cotidiano",
    nivel: 2,
    gatilho: { chance: 1 },
    padrao: "nada",
    opcoes: [
      {
        id: "agir",
        rotulo: "Agir",
        controle: "ocorrencia_crise_da_divida__moratoria",
        duracaoMeses: 3,
        consequencias: [],
      },
      {
        id: "nada",
        rotulo: "Nada",
        controle: "ocorrencia_crise_da_divida__empurrar",
        duracaoMeses: 3,
        consequencias: [],
      },
    ],
    consequencias: [],
    ...campos,
  };
}

function com(
  events: OccurrenceFile[],
  dilemmas: OccurrenceFile[],
): ResolvedPackage {
  return { ...base, events, dilemmas };
}

const valores = nova().game.execution.values;

function rolar(
  content: ResolvedPackage,
  state: OccurrenceState,
  turn: number,
  extra: Partial<Parameters<typeof rollTurn>[0]> = {},
) {
  return rollTurn({
    content,
    state,
    values: valores,
    turn,
    seed: 7,
    laws: {},
    ...extra,
  });
}

describe("SG106 — sorteio", () => {
  it("o número sai sempre igual para a mesma semente, turno e chave", () => {
    expect(roll(1, 5, "x")).toBe(roll(1, 5, "x"));
    expect(roll(1, 5, "x")).not.toBe(roll(2, 5, "x"));
    expect(roll(1, 5, "x")).not.toBe(roll(1, 6, "x"));
    const n = Array.from({ length: 2000 }, (_, i) => roll(3, i, "k"));
    const media = n.reduce((a, b) => a + b, 0) / n.length;
    expect(media).toBeGreaterThan(0.45);
    expect(media).toBeLessThan(0.55);
  });

  it("a chance multiplica os fatores da rede, em linha reta entre de e até", () => {
    const o = evento("e", {
      gatilho: {
        chance: 0.02,
        fatores: [{ variavel: "corrupcao", de: 0, ate: 100, multiplica: 5 }],
      },
    });
    const c = occurrenceChance(o, { corrupcao: 50 });
    expect(c.factors[0].multiplier).toBeCloseTo(3, 9);
    expect(c.chance).toBeCloseTo(0.06, 9);
    // depois de visto, cai
    const visto = { ...emptyOccurrenceState(), timesSeen: { e: 1 } };
    expect(occurrenceChance(o, { corrupcao: 50 }, visto).chance).toBeCloseTo(
      0.018,
      9,
    );
  });
});

describe("SG106 — eventos", () => {
  it("no máximo um evento grande e um local por turno", () => {
    const content = com(
      [
        evento("a"),
        evento("b"),
        evento("c", { nivel: 1 }),
        evento("d", { nivel: 1 }),
      ],
      [],
    );
    const r = rolar(content, emptyOccurrenceState(), 1);
    expect(r.events).toHaveLength(2);
    const niveis = r.events.map((id) => (id === "a" || id === "b" ? 2 : 1));
    expect(niveis.sort()).toEqual([1, 2]);
  });

  it("intervalo mínimo, única e condição mantida por turnos", () => {
    const content = com(
      [
        evento("unica", { unica: true }),
        evento("espera", {
          gatilho: {
            chance: 1,
            condicao: {
              tipo: "comparacao",
              variavel: "corrupcao",
              operador: "maior_que",
              valor: -1,
            },
            porTurnos: 3,
          },
        }),
      ],
      [],
    );
    let state = emptyOccurrenceState();
    const disparos: string[][] = [];
    for (let t = 1; t <= 4; t++) {
      const r = rolar(content, state, t);
      disparos.push([...r.events]);
      state = r.state;
    }
    expect(disparos.flat().filter((id) => id === "unica")).toHaveLength(1);
    // "espera" só pode disparar a partir do 3º turno de condição valendo
    const primeiro = disparos.findIndex((d) => d.includes("espera"));
    expect(primeiro).toBeGreaterThanOrEqual(2);
  });

  it("reação: só na janela depois de o jogador mudar a lei", () => {
    const content = com(
      [
        evento("greve", {
          origem: "reacao",
          gatilho: {
            chance: 1,
            reacao: {
              controle: "nivel_empresas_estatais_e_privatizacao",
              para: [0],
              janelaTurnos: 2,
            },
          },
        }),
      ],
      [],
    );
    let state = rolar(content, emptyOccurrenceState(), 1, {
      laws: { nivel_empresas_estatais_e_privatizacao: 67 },
    }).state;
    // sem mudança, nada
    let r = rolar(content, state, 2, {
      laws: { nivel_empresas_estatais_e_privatizacao: 67 },
    });
    expect(r.events).toEqual([]);
    state = r.state;
    // vendeu tudo: a greve vem
    r = rolar(content, state, 3, {
      laws: { nivel_empresas_estatais_e_privatizacao: 0 },
    });
    expect(r.events).toEqual(["greve"]);
    // fora da janela (e já vista), não repete sozinha
    r = rolar(content, r.state, 7, {
      laws: { nivel_empresas_estatais_e_privatizacao: 0 },
    });
    expect(r.events).toEqual([]);
  });

  it("desdobramento: o evento arma um dilema para o turno seguinte", () => {
    const content = com(
      [
        evento("enchente", {
          desdobramentos: [
            { ocorrencia: "reconstrucao", chance: 1, emTurnos: [1, 1] },
          ],
        }),
      ],
      [
        dilema("reconstrucao", {
          origem: "desdobramento",
          gatilho: { chance: 0 },
        }),
      ],
    );
    const r1 = rolar(content, emptyOccurrenceState(), 1);
    expect(r1.events).toEqual(["enchente"]);
    expect(r1.dilemmas).toEqual([]);
    const r2 = rolar(content, r1.state, 2);
    expect(r2.dilemmas).toEqual(["reconstrucao"]);
    expect(r2.state.pending[0].causeId).toBe("enchente");
  });
});

describe("SG106 — dilemas", () => {
  it("a mesa: desdobramento e crise antes do cotidiano, no máximo dois", () => {
    const content = com(
      [],
      [
        dilema("rotina"),
        dilema("crise", { origem: "crise" }),
        dilema("outra-crise", { origem: "crise" }),
      ],
    );
    const r = rolar(content, emptyOccurrenceState(), 1);
    expect(r.dilemmas).toHaveLength(1);
    expect(["crise", "outra-crise"]).toContain(r.dilemmas[0]);
  });

  it("o cotidiano sai pela chance: há turnos sem dilema e nunca mais de dois", () => {
    const content = com(
      [],
      [
        dilema("a", {
          area: "Economia",
          gatilho: { chance: 0.3 },
          intervaloMinimoTurnos: 0,
        }),
        dilema("b", {
          area: "Saúde",
          gatilho: { chance: 0.3 },
          intervaloMinimoTurnos: 0,
        }),
      ],
    );
    let state = emptyOccurrenceState();
    const porTurno: number[] = [];
    for (let t = 1; t <= 30; t++) {
      const r = rolar(content, state, t);
      porTurno.push(r.dilemmas.length);
      expect(r.state.pending.length).toBeLessThanOrEqual(2);
      state = r.state;
      // responde para liberar a mesa
      for (const id of r.dilemmas) {
        const a = answerDilemma({
          content,
          state,
          occurrenceId: id,
          optionId: "nada",
          turn: t,
          seed: 7,
          values: valores,
        });
        if (!a.ok) throw new Error(a.error);
        state = a.state;
      }
      // o turno passa: a resposta dura 3 meses e acaba
      state = advanceOccurrenceMonths(state, 3, t + 1);
    }
    expect(porTurno.filter((n) => n === 0).length).toBeGreaterThan(0);
    expect(porTurno.filter((n) => n > 0).length).toBeGreaterThan(0);
  });

  it("opção com requisito fica indisponível, a padrão nunca", () => {
    const content = com(
      [],
      [
        dilema("caro", {
          opcoes: [
            {
              id: "agir",
              rotulo: "Agir",
              controle: "ocorrencia_crise_da_divida__moratoria",
              duracaoMeses: 3,
              consequencias: [],
              requer: {
                tipo: "comparacao",
                variavel: "cofre",
                operador: "maior_que",
                valor: 50,
              },
              motivoRequer: "Sem dinheiro no cofre.",
            },
            {
              id: "nada",
              rotulo: "Nada",
              controle: "ocorrencia_crise_da_divida__empurrar",
              duracaoMeses: 3,
              consequencias: [],
            },
          ],
        }),
      ],
    );
    const r = rolar(content, emptyOccurrenceState(), 1);
    const tentar = (optionId: string) =>
      answerDilemma({
        content,
        state: r.state,
        occurrenceId: "caro",
        optionId,
        turn: 1,
        seed: 7,
        values: valores,
      });
    expect(tentar("agir")).toMatchObject({
      ok: false,
      error: "Sem dinheiro no cofre.",
    });
    expect(tentar("nada").ok).toBe(true);
  });
});

/** Uma partida com dilema na mesa (o primeiro que o sorteio der). */
function comDilema(): Partida {
  for (let semente = 1; semente < 200; semente++) {
    let p = nova(semente);
    for (let t = 0; t < 6; t++) {
      if (verPartida(p).ocorrencias.mesa.length > 0) return p;
      const passou = encerrarTurno(p);
      if (!passou.ok) break;
      p = passou.value.partida;
    }
  }
  throw new Error("nenhuma semente pôs dilema na mesa");
}

describe("SG106 — na partida", () => {
  it("o turno não passa com dilema na mesa", () => {
    const partida = comDilema();
    const mesa = verPartida(partida).ocorrencias.mesa;
    expect(mesa.length).toBeGreaterThan(0);
    const recusado = encerrarTurno(partida);
    expect(recusado.ok).toBe(false);
    if (!recusado.ok) expect(recusado.erros[0]).toMatch(/dilema/);
    const opcao = mesa[0].opcoes.find((o) => o.disponivel)!;
    const respondida = responderDilema(partida, mesa[0].id, opcao.id);
    if (!respondida.ok) throw new Error(respondida.erros.join(" "));
    expect(verPartida(respondida.value).ocorrencias.mesa).toHaveLength(
      mesa.length - 1,
    );
    const emCurso = verPartida(respondida.value).ocorrencias.emCurso;
    expect(emCurso.some((o) => o.id === mesa[0].id && o.opcao)).toBe(true);
  });

  it("a prévia da opção mostra o que ela mexe", () => {
    const partida = comDilema();
    const dilema = verPartida(partida).ocorrencias.mesa[0];
    const comEfeito = dilema.opcoes.find(
      (o) => o.disponivel && o.efeitos.length > 0,
    )!;
    const previa = preverDilema(partida, dilema.id, comEfeito.id, 2);
    if (!previa.ok) throw new Error(previa.erros.join(" "));
    const ids = previa.value.efeitos.map((e) => e.id);
    expect(ids).toContain(comEfeito.efeitos[0].id);
  });

  it("mesma semente, mesma história; outra semente, outra história", () => {
    const historia = (p: Partida) =>
      verPartida(p)
        .ocorrencias.historico.map((h) => `${h.turno}:${h.id}`)
        .join(" ");
    const a = jogar(nova(11), 12);
    const b = jogar(nova(11), 12);
    const c = jogar(nova(12345), 12);
    expect(historia(a)).toBe(historia(b));
    expect(historia(a)).not.toBe(historia(c));
  }, 120_000);

  it("um evento em curso mexe na rede pelo próprio nó e acaba no prazo", () => {
    // procura uma semente em que um evento com efeito aconteça cedo
    let achado: { partida: Partida; id: string } | undefined;
    for (let semente = 1; semente < 60 && !achado; semente++) {
      const p = jogar(nova(semente), 2);
      const ev = verPartida(p).ocorrencias.emCurso.find(
        (o) => o.tipo === "evento" && o.efeitos.length > 0,
      );
      if (ev) achado = { partida: p, id: ev.id };
    }
    expect(achado).toBeDefined();
    const { partida, id } = achado!;
    const ev = verPartida(partida).ocorrencias.emCurso.find(
      (o) => o.id === id,
    )!;
    // o nó liga a seta: o próximo turno explica o alvo pelo evento
    const ligacoes = partida.graph.relations.filter(
      (r) => r.sourceId === id && r.targetId === ev.efeitos[0].id,
    );
    expect(ligacoes.length).toBe(1);
    // a tela vê a seta do evento em curso entre as causas da bolha
    const seta = verPartida(partida).ligacoes.find(
      (l) => l.ocorrencia?.id === id && l.alvo === ev.efeitos[0].id,
    );
    expect(seta?.ocorrencia?.nome).toBe(ev.nome);
    const depois = jogar(partida, Math.ceil(ev.mesesRestantes / 3) + 1);
    expect(
      verPartida(depois).ocorrencias.emCurso.some(
        (o) => o.id === id && o.inicio === ev.inicio,
      ),
    ).toBe(false);
    expect(
      verPartida(depois).ligacoes.some(
        (l) =>
          l.ocorrencia?.id === id &&
          !verPartida(depois).ocorrencias.emCurso.some((o) => o.id === id),
      ),
    ).toBe(false);
    const registro = verPartida(depois).ocorrencias.historico.find(
      (h) => h.id === id && h.turno === ev.inicio,
    );
    expect(registro?.fim).toBeDefined();
  }, 120_000);
});
