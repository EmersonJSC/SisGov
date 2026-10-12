/**
 * Grupos de pressão (V1-09): aceite do chamado (docs/v1/desenho/pressao.md,
 * seção 7).
 */
import { beforeAll, describe, expect, it } from "vitest";
import { advanceExecution, type EngineExecution } from "../engine";
import { contextNodeId } from "../engine/model/lawNodes";
import {
  criarPartida,
  investigarGrupo,
  verPartida,
  type Partida,
} from "../app/partida";
import { rollTurn, emptyOccurrenceState } from "../game/occurrences";
import { lawTargets } from "../game/createGame";
import { preparePolicyExecution } from "../game/preparePolicyExecution";
import {
  parRevelado,
  pressureMonth,
  rollPressure,
  type PressureState,
} from "../game/pressao";
import { AREA_PATROCINIO, AREA_PRESSAO } from "../game/pais/pressao";

const arquivos = import.meta.glob<string>("../conteudo/**/*.json", {
  eager: true,
  query: "?raw",
  import: "default",
});

let partida: Partida;
beforeAll(() => {
  const r = criarPartida({ ocorrencias: false });
  if (!r.ok) throw new Error(r.erros.join("\n"));
  partida = r.value;
});

const config = () => partida.content.manifest.gruposDePressao!;
const grupo = (id: string) => config().grupos.find((g) => g.id === id)!;

describe("níveis", () => {
  /** Anda um mês com a satisfação dos servidores deslocada em `delta`. */
  function mes(execution: EngineExecution, ctx: string, valor: number) {
    const batch = preparePolicyExecution(
      partida.content,
      partida.graph,
      partida.game.policies,
    );
    if (!batch.ok) throw new Error(batch.diagnostics[0].message);
    const r = advanceExecution(
      partida.content,
      partida.graph,
      { ...execution, values: { ...execution.values, [ctx]: valor } },
      batch.value,
      1,
      { explain: false },
    );
    if (!r.ok) throw new Error(r.diagnostics[0].message);
    return r.value.execution;
  }

  it("servidores insatisfeitos levam os sindicatos de 1 a 2 e de volta, um degrau por vez", () => {
    const g = grupo("sindicatos_servidores");
    const ctx = contextNodeId("grupo_servidores");
    const base = partida.game.execution.values[ctx] ?? 0;
    let ex = partida.game.execution;
    expect(ex.values[g.nivel]).toBe(1);
    // a satisfação cai aos poucos até a pressão passar da entrada do nível 2
    let queda = 0;
    while (ex.values[g.nivel] < 2 && queda < 100) {
      queda += 2;
      ex = mes(ex, ctx, base - queda);
    }
    expect(ex.values[g.pressao]).toBeGreaterThanOrEqual(g.limites[1].entrada);
    expect(ex.values[g.nivel]).toBe(2);
    // volta ao meio: entre a saída e a entrada, continua mobilizado
    let meio = base - queda;
    for (let i = 0; i < 40; i += 1) {
      ex = mes(ex, ctx, meio);
      const p = ex.values[g.pressao];
      if (p < g.limites[1].entrada && p > g.limites[1].saida) break;
      meio += 0.5;
    }
    const p = ex.values[g.pressao];
    expect(p).toBeLessThan(g.limites[1].entrada);
    expect(p).toBeGreaterThan(g.limites[1].saida);
    expect(ex.values[g.nivel]).toBe(2);
    // satisfeitos de novo: cai à saída e volta a organizando
    for (let i = 0; i < 6; i += 1) ex = mes(ex, ctx, base + 10);
    expect(ex.values[g.pressao]).toBeLessThanOrEqual(g.limites[1].saida);
    expect(ex.values[g.nivel]).toBe(1);
  });

  it("um salto grande sobe um degrau por mês", () => {
    const g = grupo("sindicatos_servidores");
    const ctx = contextNodeId("grupo_servidores");
    const base = partida.game.execution.values[ctx] ?? 0;
    let ex = partida.game.execution;
    const vistos: number[] = [];
    for (let i = 0; i < 6; i += 1) {
      ex = mes(ex, ctx, base - 100);
      vistos.push(ex.values[g.nivel]);
    }
    for (let i = 1; i < vistos.length; i += 1)
      expect(Math.abs(vistos[i] - vistos[i - 1])).toBeLessThanOrEqual(1);
    expect(vistos.at(-1)).toBe(3);
  });

  it("turno 0: cada grupo está no nível da tabela do país", () => {
    const pais = JSON.parse(
      arquivos["../conteudo/paises/brasil/pressao.json"],
    ) as { turno0: Record<string, number> };
    expect(config().grupos).toHaveLength(54);
    for (const g of config().grupos)
      expect(partida.game.pressure?.levels[g.id], g.id).toBe(pais.turno0[g.id]);
  });
});

describe("ações", () => {
  it("toda ação mexe num índice ou na aprovação", () => {
    const variaveis = new Map(
      partida.content.variables.variaveis.map((v) => [v.id, v]),
    );
    const consequencias = new Map(
      partida.content.consequences.map((c) => [c.id, c]),
    );
    const eventos = new Map(partida.content.events.map((e) => [e.id, e]));
    let total = 0;
    for (const g of config().grupos)
      for (const acao of g.acoes) {
        const evento = eventos.get(acao.evento);
        expect(evento, acao.evento).toBeDefined();
        const alvos = (evento!.consequencias ?? []).map(
          (id) => consequencias.get(id)?.alvo,
        );
        const indice = alvos.some((alvo) => {
          const v = alvo ? variaveis.get(alvo) : undefined;
          return (
            v !== undefined &&
            v.tipo !== "controle" &&
            v.area !== AREA_PRESSAO &&
            v.area !== AREA_PATROCINIO
          );
        });
        expect(indice, `${g.id}: ${acao.evento}`).toBe(true);
        total += 1;
      }
    expect(total).toBeGreaterThan(54);
  });

  it("no máximo uma ação pesada e duas leves por turno, uma por grupo, com a causa", () => {
    const values: Record<string, number> = {
      ...partida.game.execution.values,
    };
    for (const g of config().grupos) {
      values[g.nivel] = 3;
      values[g.pressao] = 100;
    }
    const pesadas = new Set(
      config().grupos.flatMap((g) =>
        g.acoes.filter((a) => a.nivel >= 3).map((a) => a.evento),
      ),
    );
    const doGrupo = new Map(
      config().grupos.flatMap((g) => g.acoes.map((a) => [a.evento, g.id])),
    );
    let state = emptyOccurrenceState();
    for (let turn = 1; turn <= 12; turn += 1) {
      const r = rollTurn({
        content: partida.content,
        state,
        values,
        turn,
        seed: 7,
        laws: lawTargets(partida.content, partida.game.policies),
      });
      state = r.state;
      const acoes = r.events.filter((id) => doGrupo.has(id));
      expect(acoes.filter((id) => pesadas.has(id)).length).toBeLessThanOrEqual(
        1,
      );
      expect(acoes.filter((id) => !pesadas.has(id)).length).toBeLessThanOrEqual(
        2,
      );
      const grupos = acoes.map((id) => doGrupo.get(id));
      expect(new Set(grupos).size).toBe(grupos.length);
      for (const record of r.state.history.filter(
        (h) => h.turn === turn && doGrupo.has(h.id),
      )) {
        const evento = partida.content.events.find((e) => e.id === record.id);
        if (evento?.descricao?.includes("{causa}"))
          expect(record.vars?.causa, record.id).toBeTruthy();
      }
    }
  });
});

describe("patrocínio", () => {
  it("nenhum nome real de país, empresa ou igreja nos arquivos", () => {
    const reais = [
      "Google",
      "Meta",
      "Amazon",
      "Microsoft",
      "Nvidia",
      "TikTok",
      "Apple",
      "Facebook",
      "Instagram",
      "WhatsApp",
      "Twitter",
      "Shein",
      "Binance",
      "Monsanto",
      "Bayer",
      "Petrobras",
      "Vale",
      "Lockheed",
      "Taurus",
      "Glock",
      "Soros",
      "Gates",
      "Open Society",
      "Globo",
      "Record",
      "SBT",
      "Estadão",
      "Universal",
      "Itaú",
      "Bradesco",
      "JBS",
      "Estados Unidos",
      "EUA",
      "China",
      "Rússia",
      "Irã",
      "Arábia",
      "Índia",
      "União Europeia",
      "Venezuela",
      "Israel",
    ];
    for (const caminho of [
      "../conteudo/mundo/pressao.json",
      "../conteudo/mundo/patrocinadores.json",
      "../conteudo/paises/brasil/pressao.json",
    ]) {
      const json = JSON.parse(arquivos[caminho]) as Record<string, unknown>;
      // as fontes citam institutos e jornais de propósito
      const texto = JSON.stringify({ ...json, fontes: undefined });
      for (const nome of reais)
        expect(
          new RegExp(`(^|[^\\p{L}])${nome}([^\\p{L}]|$)`, "u").test(texto),
          `${caminho} cita ${nome}`,
        ).toBe(false);
    }
  });

  it("patrocínio oculto não aparece; a investigação revela e corta o dinheiro", () => {
    const alvo = "plataformas";
    const g = grupo(alvo);
    const ocultos = g.patrocinio.filter((p) => !p.publico);
    expect(ocultos.length).toBeGreaterThan(0);
    const antes = verPartida(partida).pressao!.grupos.find(
      (x) => x.id === alvo,
    )!;
    for (const p of ocultos)
      expect(antes.financiadoPor.map((f) => f.id)).not.toContain(
        p.patrocinador,
      );

    const aberta = investigarGrupo(partida, alvo);
    if (!aberta.ok) throw new Error(aberta.erros.join(" "));
    let state: PressureState = aberta.value.game.pressure!;
    // capacidade alta: a investigação acha alguém em poucos turnos
    const values = {
      ...partida.game.execution.values,
      [config().investigacao.capacidade]: 100,
    };
    let achados: readonly string[] = [];
    for (let turn = 1; turn <= 8 && achados.length === 0; turn += 1) {
      const r = rollPressure({
        content: partida.content,
        state,
        values,
        turn,
        seed: 3,
      });
      state = r.state;
      achados = r.finished.flatMap((f) => f.sponsorIds);
      if (r.finished.length && !achados.length) {
        const de_novo = investigarGrupo(
          { ...aberta.value, game: { ...aberta.value.game, pressure: state } },
          alvo,
        );
        if (!de_novo.ok) throw new Error(de_novo.erros.join(" "));
        state = de_novo.value.game.pressure!;
      }
    }
    expect(achados.length).toBeGreaterThan(0);
    const depois = verPartida({
      ...partida,
      game: { ...partida.game, pressure: state },
    }).pressao!.grupos.find((x) => x.id === alvo)!;
    for (const id of achados)
      expect(depois.financiadoPor).toContainEqual(
        expect.objectContaining({ id, revelado: true }),
      );
    // o dinheiro do revelado é cortado e o grupo perde legitimidade
    const comandos = new Map(
      pressureMonth(partida.content, partida.graph, state).map((c) => [
        c.controlId,
        c.value,
      ]),
    );
    for (const p of g.patrocinio)
      expect(comandos.get(p.acesso)).toBe(
        state.revealed.includes(parRevelado(alvo, p.patrocinador)) ? 0 : 1,
      );
    expect(comandos.get(g.revelado!)).toBe(1);
  });
});
