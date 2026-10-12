/**
 * SG157 fase 3: o turno 0 é o Brasil 2026 (D-55), a rede é estável (D-54)
 * e as contas começam com déficit real, com juros explosivos à vista.
 */
import { describe, expect, it } from "vitest";
import {
  criarPartida,
  encerrarTurno,
  verPartida,
  type Partida,
} from "../app/partida";
import {
  advanceExecution,
  buildGraph,
  createExecution,
  resolvePackage,
  translateAuthorizedPolicies,
  validatePackageCoherence,
} from "../engine";
import valoresDoBrasil from "../conteudo/paises/brasil/valores.json";

function nova(): Partida {
  const criada = criarPartida({ ocorrencias: false });
  if (!criada.ok) throw new Error(criada.erros.join(" "));
  return criada.value;
}

function turnos(partida: Partida, n: number): Partida[] {
  const lista = [partida];
  for (let i = 0; i < n; i++) {
    const passou = encerrarTurno(lista.at(-1)!);
    if (!passou.ok) throw new Error(passou.erros.join(" "));
    lista.push(passou.value.partida);
  }
  return lista;
}

describe("SG157 fase 3 — Brasil 2026", () => {
  const partida = nova();
  const visao = verPartida(partida);
  const declarados = valoresDoBrasil.indices as Record<string, number>;

  it("o turno 0 tem os índices declarados do cenário", () => {
    expect(visao.cenario).toBe("Brasil 2026");
    const motor = partida.game.execution.values;
    for (const [id, valor] of Object.entries(declarados)) {
      // situação: o motor guarda o quanto a soma passa da saída (0 = não existe)
      expect(motor[id], id).toBeCloseTo(valor, 3);
      const bolha = visao.bolhas.find((b) => b.id === id)!;
      if (bolha.tipo === "situacao")
        // a tela mostra a soma, abaixo da entrada
        expect(bolha.valor, id).toBeLessThanOrEqual(bolha.entrada ?? 0);
      else expect(bolha.valor, id).toBeCloseTo(valor, 3);
    }
  });

  it("o contexto do país é um nó visível, não um número escondido", () => {
    const inflacao = visao.bolhas.find((b) => b.id === "inflacao")!;
    expect(inflacao.contexto).toBeDefined();
    const rel = partida.graph.relations.find(
      (r) => r.originId === "contexto:inflacao",
    )!;
    expect(partida.graph.nodesById[rel.originId].nome).toBe(
      "Contexto do Brasil 2026",
    );
  });

  it("oito turnos sem ação mudam pouco", () => {
    const lista = turnos(partida, 8).map((p) => verPartida(p));
    for (const bolha of visao.bolhas) {
      const escala = bolha.maximo - bolha.minimo || 1;
      const serie = lista.map(
        (v) => v.bolhas.find((b) => b.id === bolha.id)!.valor,
      );
      const salto = Math.max(
        ...serie.slice(1).map((x, i) => Math.abs(x - serie[i])),
      );
      // nenhum indicador pula mais de 3% da escala num turno
      expect(salto / escala, bolha.id).toBeLessThan(0.03);
      // e nenhum anda mais de 10% da escala em dois anos
      expect(Math.abs(serie[8] - serie[0]) / escala, bolha.id).toBeLessThan(
        0.1,
      );
    }
  });

  it("contas do setor público com déficit real e dívida subindo", () => {
    const c = visao.contas.percentualPib;
    expect(c.receita).toBeGreaterThan(28);
    expect(c.receita).toBeLessThan(34);
    expect(c.gasto).toBeGreaterThan(28);
    expect(c.gasto).toBeLessThan(34);
    expect(c.juros).toBeGreaterThan(7);
    expect(c.juros).toBeLessThan(9);
    expect(c.resultado).toBeLessThan(-6.5);
    expect(c.resultado).toBeGreaterThan(-9);
  });

  it("juros explosivos não existem no início e surgem se nada for feito", () => {
    const valor = (p: Partida) => p.game.execution.values.juros_explosivos ?? 0;
    expect(valor(partida)).toBe(0);
    const lista = turnos(partida, 16);
    // antes do fim do primeiro mandato, ainda não
    expect(valor(lista[8])).toBe(0);
    expect(valor(lista[16])).toBeGreaterThan(0);
  });
});

describe("SG157 fase 3 — motor", () => {
  function pkg(resposta?: number, indice?: number) {
    const json = (value: object) => JSON.stringify(value);
    return {
      "cenario.json": json({
        id: "p",
        tipo: "cenario",
        versaoEsquema: 1,
        nome: "P",
        estadoInicial: "estado.json",
        variaveis: "variaveis.json",
        politicas: ["lei.json"],
        consequencias: ["c.json"],
        ...(resposta ? { respostaDasBolhas: resposta } : {}),
      }),
      "estado.json": json({
        id: "estado",
        tipo: "estado-inicial",
        versaoEsquema: 1,
        cenario: { nome: "Teste 2030" },
        valores: { gasto: 0 },
        ...(indice !== undefined ? { indicesIniciais: { saude: indice } } : {}),
      }),
      "variaveis.json": json({
        id: "variaveis",
        tipo: "variaveis",
        versaoEsquema: 1,
        variaveis: [
          {
            id: "gasto",
            tipo: "controle",
            nome: "Gasto",
            unidade: "moeda",
            dominio: { minimo: 0 },
            valorInicial: 0,
          },
          {
            id: "saude",
            tipo: "calculado",
            nome: "Saúde",
            unidade: "indice_0_100",
            dominio: { minimo: 0, maximo: 100 },
          },
        ],
      }),
      "lei.json": json({
        id: "lei",
        tipo: "lei",
        versaoEsquema: 2,
        grupo: "orcamentaria",
        nome: "Lei",
        descricao: "Teste",
        processoAutorizacao: "x",
        controle: { variavel: "gasto", unidade: "moeda" },
        orcamento: { modo: "valor_fixo" },
        consequencias: ["c"],
      }),
      "c.json": json({
        id: "c",
        tipo: "consequencia",
        versaoEsquema: 1,
        origem: "gasto",
        alvo: "saude",
        mecanismo: "afim",
        parametros: { coeficiente: 1, termoConstante: 0 },
        unidade: "indice_0_100",
        atrasoPassos: 0,
        duracao: { modo: "continuo" },
      }),
    };
  }

  function montar(resposta?: number, indice?: number) {
    const resolved = resolvePackage("cenario.json", pkg(resposta, indice));
    if (!resolved.ok) throw new Error(resolved.diagnostics[0].message);
    const coherent = validatePackageCoherence(resolved.value);
    if (!coherent.ok) throw new Error(coherent.diagnostics[0].message);
    const graph = buildGraph(coherent.value);
    return { content: coherent.value, graph };
  }

  function passo(resposta: number | undefined, nivel: number) {
    const { content, graph } = montar(resposta);
    const batch = translateAuthorizedPolicies(content, graph, [
      { policyId: "lei", intensity: nivel },
    ]);
    if (!batch.ok) throw new Error(batch.diagnostics[0].message);
    const step = advanceExecution(
      content,
      graph,
      createExecution(content, graph),
      batch.value,
    );
    if (!step.ok) throw new Error(step.diagnostics[0].message);
    return step.value;
  }

  it("resposta das bolhas: anda só parte do caminho por passo (D-54)", () => {
    expect(passo(undefined, 40).execution.values.saude).toBeCloseTo(40);
    const meio = passo(0.5, 40);
    expect(meio.execution.values.saude).toBeCloseTo(20);
    expect(meio.explanations.find((e) => e.targetId === "saude")).toMatchObject(
      { targetValue: 40, result: 20 },
    );
  });

  it("contexto: o turno 0 bate com o declarado e as leis mexem a partir dele", () => {
    const { content, graph } = montar(undefined, 30);
    const inicio = createExecution(content, graph);
    expect(inicio.values.saude).toBeCloseTo(30, 6);
    expect(inicio.values["contexto:saude"]).toBeCloseTo(30, 6);
    expect(graph.nodesById["contexto:saude"].nome).toBe(
      "Contexto do Teste 2030",
    );
    const batch = translateAuthorizedPolicies(content, graph, [
      { policyId: "lei", intensity: 10 },
    ]);
    if (!batch.ok) throw new Error(batch.diagnostics[0].message);
    const step = advanceExecution(content, graph, inicio, batch.value);
    if (!step.ok) throw new Error(step.diagnostics[0].message);
    expect(step.value.execution.values.saude).toBeCloseTo(40, 6);
  });

  it("recusa valor inicial para estoque ou controle", () => {
    const files = pkg(undefined, 30);
    const estadoJson = JSON.parse(files["estado.json"]);
    estadoJson.indicesIniciais = { gasto: 5 };
    files["estado.json"] = JSON.stringify(estadoJson);
    const resolved = resolvePackage("cenario.json", files);
    if (!resolved.ok) throw new Error(resolved.diagnostics[0].message);
    expect(validatePackageCoherence(resolved.value)).toMatchObject({
      ok: false,
      diagnostics: [
        expect.objectContaining({ field: "indicesIniciais.gasto" }),
      ],
    });
  });
});
