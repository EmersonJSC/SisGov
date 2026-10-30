/** Gatilhos (M7.2): o que o jogador anda fazendo e para que lado anda indo. */
import { beforeAll, describe, expect, it } from "vitest";
import { criarPartida, type Partida } from "../app/partida";
import { gatilhosAtivos, gatilhosDoMundo } from "../game/gatilhos";
import { bussolaDoMundo, faixaDaLei, vetorNoNivel } from "../game/bussola";
import type { PolicyState } from "../game/leis/policyState";

let partida: Partida;
beforeAll(() => {
  const r = criarPartida({ ocorrencias: false });
  if (!r.ok) throw new Error(r.erros.join("\n"));
  partida = r.value;
});

/** A lei com uma mudança de meta no turno dado (e a meta de antes). */
function mexida(id: string, de: number, para: number, turno: number) {
  const base = partida.game.policies.find((p) => p.policyDefinitionId === id);
  if (!base) throw new Error(`lei ${id} não está em vigor no início`);
  const ponto = (
    nivel: number,
    turn: number,
    kind: "herdada" | "meta_alterada",
  ) => ({
    kind,
    turn,
    legalStatus: "vigente" as const,
    desiredLevel: nivel,
    implementedLevel: nivel,
  });
  return {
    ...base,
    desiredLevel: para,
    history: [ponto(de, 0, "herdada"), ponto(para, turno, "meta_alterada")],
  } satisfies PolicyState;
}

const ativos = (
  policies: readonly PolicyState[],
  turno: number,
  caminho = [{ turno: 0, economia: 0, costumes: 0 }],
) => gatilhosAtivos(partida.content, policies, caminho, turno).map((g) => g.id);

/** Verbas de áreas diferentes que o jogo traz em vigor, com o nível de hoje. */
const verbas = ["piso-saude", "piso-educacao", "gasto-com-defesa"];

describe("gatilhos de gasto", () => {
  it("3 verbas baixadas em 2 áreas ligam o corte de gastos", () => {
    const leis = verbas.map((id) => {
      const nivel = partida.game.policies.find(
        (p) => p.policyDefinitionId === id,
      )!.desiredLevel;
      return mexida(id, nivel, nivel * 0.5, 2);
    });
    expect(ativos(leis, 2)).toContain("corte-de-gastos");
    expect(ativos(leis, 2)).not.toContain("expansao-de-gastos");
  });

  it("3 verbas subidas ligam a expansão de gastos", () => {
    const leis = verbas.map((id) => {
      const nivel = partida.game.policies.find(
        (p) => p.policyDefinitionId === id,
      )!.desiredLevel;
      return mexida(id, nivel, nivel * 1.5 + 1, 2);
    });
    expect(ativos(leis, 2)).toContain("expansao-de-gastos");
    expect(ativos(leis, 2)).not.toContain("corte-de-gastos");
  });

  it("2 cortes não bastam", () => {
    const leis = verbas.slice(0, 2).map((id) => {
      const nivel = partida.game.policies.find(
        (p) => p.policyDefinitionId === id,
      )!.desiredLevel;
      return mexida(id, nivel, nivel * 0.5, 2);
    });
    expect(ativos(leis, 2)).not.toContain("corte-de-gastos");
  });

  it("cortes velhos saem da janela", () => {
    const leis = verbas.map((id) => {
      const nivel = partida.game.policies.find(
        (p) => p.policyDefinitionId === id,
      )!.desiredLevel;
      return mexida(id, nivel, nivel * 0.5, 2);
    });
    expect(ativos(leis, 2 + gatilhosDoMundo.janela)).not.toContain(
      "corte-de-gastos",
    );
  });
});

describe("gatilhos de rumo", () => {
  const caminho = (economia: number, costumes: number) => [
    { turno: 0, economia: 0, costumes: 0 },
    { turno: 4, economia, costumes },
  ];

  it("o rumo para o mercado liga a agenda de mercado, e só ela", () => {
    const ids = ativos([], 4, caminho(1, 0));
    expect(ids).toContain("agenda-de-mercado");
    expect(ids).not.toContain("agenda-estatista");
  });

  it("o rumo para o Estado liga a agenda estatista", () => {
    expect(ativos([], 4, caminho(-1, 0))).toContain("agenda-estatista");
  });

  it("costumes: autoridade e liberdade", () => {
    expect(ativos([], 4, caminho(0, 1))).toContain("agenda-conservadora");
    expect(ativos([], 4, caminho(0, -1))).toContain(
      "agenda-liberal-nos-costumes",
    );
  });

  it("um passo pequeno não liga nada", () => {
    expect(ativos([], 4, caminho(0.1, 0.1))).toEqual([]);
  });
});

describe("os gatilhos do mundo", () => {
  it("têm id único, nome e frase", () => {
    const ids = gatilhosDoMundo.gatilhos.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const g of gatilhosDoMundo.gatilhos) {
      expect(g.nome).toBeTruthy();
      expect(g.frase).toBeTruthy();
    }
  });

  it("só citam áreas e famílias que existem", () => {
    const areas = new Set(partida.content.policies.map((p) => p.area));
    for (const g of gatilhosDoMundo.gatilhos)
      if (g.regra.tipo === "decisoes")
        for (const a of g.regra.areas ?? []) expect(areas.has(a)).toBe(true);
  });
});

describe("gatilhos por área e eixo", () => {
  const casos = gatilhosDoMundo.gatilhos.filter(
    (g) => g.regra.tipo === "decisoes" && g.regra.areas && g.regra.eixo,
  );

  /** Leis em vigor da área que, mexidas entre dois níveis, andam no sentido. */
  function mexidas(areas: readonly string[], eixo: 0 | 1, sentido: 1 | -1) {
    const leis: PolicyState[] = [];
    for (const lei of partida.content.policies) {
      const dados = bussolaDoMundo.leis[lei.id];
      if (!dados || !areas.includes(lei.area ?? "")) continue;
      if (!partida.game.policies.some((p) => p.policyDefinitionId === lei.id))
        continue;
      const faixa = faixaDaLei(partida.content, lei.id);
      const niveis = lei.controle.opcoes?.length
        ? lei.controle.opcoes.map((o) => o.valor)
        : faixa
          ? [faixa.minimo, faixa.maximo]
          : [];
      const v = (n: number) =>
        vetorNoNivel(dados, lei.controle.opcoes, n, faixa)[eixo];
      const pares = niveis.flatMap((de) => niveis.map((para) => [de, para]));
      const [de, para] = pares.reduce(
        (melhor, par) =>
          sentido * (v(par[1]) - v(par[0])) >
          sentido * (v(melhor[1]) - v(melhor[0]))
            ? par
            : melhor,
        [0, 0],
      );
      if (sentido * (v(para) - v(de)) > 0)
        leis.push(mexida(lei.id, de, para, 2));
    }
    return leis;
  }

  it.each(casos.map((g) => [g.id, g] as const))(
    "%s liga com 3 decisões",
    (_, g) => {
      if (g.regra.tipo !== "decisoes") return;
      const leis = mexidas(
        g.regra.areas!,
        EIXO[g.regra.eixo!],
        g.regra.sentido!,
      );
      expect(leis.length).toBeGreaterThanOrEqual(3);
      expect(ativos(leis.slice(0, 3), 2)).toContain(g.id);
      expect(ativos(leis.slice(0, 2), 2)).not.toContain(g.id);
    },
  );
});

const EIXO = { economia: 0, costumes: 1 } as const;
