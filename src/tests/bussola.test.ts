/**
 * Bússola política (V1-10): aceite do chamado (docs/v1/desenho/bussola.md,
 * seção 7).
 */
import { beforeAll, describe, expect, it } from "vitest";
import {
  criarPartida,
  encerrarTurno,
  mudarLei,
  verBussola,
  type Partida,
} from "../app/partida";
import {
  bussolaDoMundo,
  criarBussola,
  distancia,
  pontoComRumo,
  referenciasDaBussola,
  rumoDoTurno,
} from "../game/bussola";
import { noticiaDoRumo } from "../ui/mapa/jornal";

const leisDoMundo = Object.values(
  import.meta.glob<{ id: string; controle: { opcoes?: { id: string }[] } }>(
    "../conteudo/mundo/leis/*.json",
    { eager: true, import: "default" },
  ),
);

let partida: Partida;
beforeAll(() => {
  const r = criarPartida({ ocorrencias: false });
  if (!r.ok) throw new Error(r.erros.join("\n"));
  partida = r.value;
});

describe("peso das leis", () => {
  it("toda lei do mundo tem seta nos dois eixos, de −2 a +2, com tema e motivo", () => {
    const temas = new Set(Object.keys(bussolaDoMundo.temas));
    for (const lei of leisDoMundo) {
      const dados = bussolaDoMundo.leis[lei.id];
      expect(dados, lei.id).toBeDefined();
      expect(dados.porque.length, lei.id).toBeGreaterThan(0);
      for (const tema of dados.manifesto)
        expect(temas.has(tema), `${lei.id}: ${tema}`).toBe(true);
      const opcoes = lei.controle.opcoes?.map((o) => o.id);
      if (opcoes)
        expect(Object.keys(dados.opcoes ?? {}).sort()).toEqual(
          [...opcoes].sort(),
        );
      else expect(dados.faixa, lei.id).toBeDefined();
      const vetores = [
        ...Object.values(dados.opcoes ?? {}),
        ...(dados.faixa ? [dados.faixa.minimo, dados.faixa.maximo] : []),
      ];
      for (const v of vetores)
        for (const n of v) expect(Math.abs(n), lei.id).toBeLessThanOrEqual(2);
    }
    expect(Object.keys(bussolaDoMundo.leis).sort()).toEqual(
      leisDoMundo.map((l) => l.id).sort(),
    );
  });
});

describe("o ponto", () => {
  it("o ponto inicial vem das leis em vigor", () => {
    const { content, game } = partida;
    const inicio = criarBussola(content, game.policies).inicio;
    expect(game.compass?.inicio).toEqual(inicio);
    // aborto proibido antes do turno 0: o país começa mais para a autoridade
    const proibido = game.policies.map((p) =>
      p.policyDefinitionId === "aborto" ? { ...p, desiredLevel: 0 } : p,
    );
    const outro = criarBussola(content, proibido).inicio;
    expect(outro.costumes).toBeGreaterThan(inicio.costumes);
    expect(outro.economia).toBeCloseTo(inicio.economia, 9);
    for (const v of [inicio.economia, inicio.costumes]) {
      expect(v).toBeGreaterThanOrEqual(-10);
      expect(v).toBeLessThanOrEqual(10);
    }
  });

  it("o rumo do jogador conta o fator do desenho e fica dentro da bússola", () => {
    const inicio = { economia: -1, costumes: 2 };
    const fator = { economia: 4, costumes: 1.5 };
    expect(
      pontoComRumo(inicio, { economia: -0.5, costumes: 3 }, fator),
    ).toEqual({
      economia: 1,
      costumes: 3.5,
    });
    expect(pontoComRumo(inicio, { economia: 5, costumes: -9 }, fator)).toEqual({
      economia: 10,
      costumes: -10,
    });
    expect(bussolaDoMundo.fatorDoRumo).toEqual(fator);
  });

  it("aprovar uma lei move o ponto, e o fim do turno guarda o caminho", () => {
    const antes = verBussola(partida)!;
    expect(antes.ponto).toEqual(antes.inicio);
    // tarifa zero no transporte: mais Estado
    const lei = partida.content.policies.find(
      (p) => p.id === "transporte-publico",
    )!;
    const zero = lei.controle.opcoes!.find((o) => o.id === "tarifa-zero")!;
    const r = mudarLei(partida, lei.id, zero.valor);
    if (!r.ok) throw new Error(r.erros.join("\n"));
    const depois = verBussola(r.value)!;
    expect(depois.ponto.economia).toBeLessThan(antes.ponto.economia);
    expect(depois.ponto.costumes).toBeCloseTo(antes.ponto.costumes, 9);
    const turno = encerrarTurno(r.value);
    if (!turno.ok) throw new Error(turno.erros.join("\n"));
    const caminho = verBussola(turno.value.partida)!.caminho;
    expect(caminho.map((p) => p.turno)).toEqual([0, 1]);
    expect(caminho[1].economia).toBeCloseTo(depois.ponto.economia, 9);
  });
});

describe("referências", () => {
  it("toda referência tem fonte, partido, anos e ponto dentro da bússola", () => {
    expect(referenciasDaBussola.fonte.nome).toMatch(/V-Party/);
    const todas = [
      ...referenciasDaBussola.personalidades,
      ...referenciasDaBussola.partidos,
    ];
    expect(new Set(todas.map((r) => r.id)).size).toBe(todas.length);
    expect(referenciasDaBussola.personalidades.length).toBeGreaterThan(50);
    expect(referenciasDaBussola.partidos.length).toBeGreaterThan(40);
    for (const r of todas) {
      expect(r.partidoNaFonte.length, r.id).toBeGreaterThan(0);
      expect(r.anos.length, r.id).toBeGreaterThan(0);
      for (const v of [r.economia, r.costumes]) {
        expect(Math.abs(v), r.id).toBeLessThanOrEqual(10);
      }
    }
  });

  it("a tela mostra quem está mais perto e o que mais puxa o ponto", () => {
    const v = verBussola(partida)!;
    expect(v.pertoPersonalidades).toHaveLength(5);
    expect(v.pertoPersonalidades[0].distancia).toBeLessThanOrEqual(
      v.pertoPersonalidades[4].distancia,
    );
    expect(v.leisQueMaisPuxam.length).toBeGreaterThan(0);
  });
});

describe("frase do rumo no jornal (V1-13)", () => {
  const refs = referenciasDaBussola.personalidades;
  const alvo = refs[0];
  const outro = refs.find(
    (r) =>
      Math.hypot(r.economia - alvo.economia, r.costumes - alvo.costumes) > 4,
  )!;

  it("sai quando o ponto chega perto de uma referência", () => {
    const longe = { economia: alvo.economia + 1, costumes: alvo.costumes };
    const perto = { economia: alvo.economia + 0.2, costumes: alvo.costumes };
    const rumo = rumoDoTurno(
      [
        { turno: 0, ...longe },
        { turno: 1, ...perto },
      ],
      [alvo, outro],
    );
    expect(rumo?.referencia.id).toBe(alvo.id);
    expect(rumo?.antes).toBeUndefined();
  });

  it("diz quem era o mais perto quando muda", () => {
    const rumo = rumoDoTurno(
      [
        { turno: 0, economia: outro.economia, costumes: outro.costumes },
        { turno: 1, economia: alvo.economia, costumes: alvo.costumes },
      ],
      [alvo, outro],
    );
    expect(rumo?.antes?.id).toBe(outro.id);
  });

  it("não sai quando o ponto fica parado", () => {
    const p = { economia: alvo.economia + 1, costumes: alvo.costumes };
    expect(
      rumoDoTurno(
        [
          { turno: 0, ...p },
          { turno: 1, ...p },
        ],
        [alvo, outro],
      ),
    ).toBeUndefined();
  });

  it("vira notícia no jornal quando a lei muda o rumo", () => {
    // tarifa zero no transporte: o ponto anda para o Estado
    const lei = partida.content.policies.find(
      (p) => p.id === "transporte-publico",
    )!;
    const zero = lei.controle.opcoes!.find((o) => o.id === "tarifa-zero")!;
    const mudada = mudarLei(partida, lei.id, zero.valor);
    if (!mudada.ok) throw new Error(mudada.erros.join("\n"));
    const turno = encerrarTurno(mudada.value);
    if (!turno.ok) throw new Error(turno.erros.join("\n"));
    const v = verBussola(turno.value.partida)!;
    const [antes, agora] = v.caminho;
    const alvo = referenciasDaBussola.personalidades.find(
      (r) => r.id === v.rumo?.referencia.id,
    )!;
    expect(distancia(antes, alvo) - distancia(agora, alvo)).toBeGreaterThan(
      0.1,
    );
    const noticia = noticiaDoRumo(v.rumo);
    expect(noticia?.manchete).toMatch(/O governo .*perto de/);
    expect(noticia?.texto).toContain("app Bússola");
    // sem lei nova, o ponto fica e não há notícia
    const parado = encerrarTurno(turno.value.partida);
    if (!parado.ok) throw new Error(parado.erros.join("\n"));
    expect(verBussola(parado.value.partida)!.rumo).toBeUndefined();
  });
});
