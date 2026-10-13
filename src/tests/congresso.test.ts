/**
 * Câmara e Senado (V1-11): aceite do chamado (docs/v1/desenho/congresso.md).
 */
import { beforeAll, describe, expect, it } from "vitest";
import { criarPartida, encerrarTurno, type Partida } from "../app/partida";
import regrasDoMundo from "../conteudo/mundo/congresso.json";
import {
  JOGADOR,
  chanceDeSim,
  chancesDoPerfil,
  congressoDaBussola,
  congressoDoPacote,
  danoDasLeis,
  dhondt,
  eleicaoDasBancadas,
  maioresRestos,
  misturar,
  passarTurnoNoCongresso,
  passoDaInfluencia,
  pontoDoPerfil,
  retratoDoCongresso,
  type RegrasDoCongresso,
} from "../game/congresso";
import { pressureGroups } from "../game/pressao";

const regras = regrasDoMundo as unknown as RegrasDoCongresso;
const soma = (c: Readonly<Record<string, number>>) =>
  Object.values(c).reduce((a, b) => a + b, 0);

let partida: Partida;
beforeAll(() => {
  const r = criarPartida({ ocorrencias: false });
  if (!r.ok) throw new Error(r.erros.join("\n"));
  partida = r.value;
});

describe("contas", () => {
  it("D'Hondt reparte 10 cadeiras entre 50%, 30% e 20% em 5, 3 e 2", () => {
    expect(dhondt({ a: 0.5, b: 0.3, c: 0.2 }, 10)).toEqual({
      a: 5,
      b: 3,
      c: 2,
    });
  });

  it("maiores restos: empate vai para quem vem antes", () => {
    expect(maioresRestos({ a: 1, b: 1, c: 1 }, 10)).toEqual({
      a: 4,
      b: 3,
      c: 3,
    });
  });

  it("misturar não muda o total da casa", () => {
    const atual = { a: 60, b: 40 };
    const alvo = { a: 20, b: 50, c: 30 };
    expect(misturar(atual, alvo, 0)).toEqual({ a: 60, b: 40, c: 0 });
    expect(misturar(atual, alvo, 1)).toEqual({ a: 20, b: 50, c: 30 });
    const meio = misturar(atual, alvo, 0.06);
    expect(soma(meio)).toBeCloseTo(100);
    expect(meio.a).toBeCloseTo(0.94 * 60 + 0.06 * 20);
  });

  it("o ponto do perfil é a soma dos pesos dos atributos", () => {
    const p = pontoDoPerfil(regras, {
      renda: "pobre",
      ocupacao: "carteira",
      valores: "conservador",
      religiao: "evangelica",
      idade: "30-59",
      ambientalista: "nao",
    });
    expect(p.economia).toBeCloseTo(-0.8 - 0.4);
    expect(p.costumes).toBeCloseTo(2.0 + 1.2);
  });

  it("o perfil vota mais em quem está mais perto, e as chances somam 1", () => {
    const c = chancesDoPerfil(
      { economia: 0, costumes: 0 },
      [
        { id: "perto", ponto: { economia: 1, costumes: 0 } },
        { id: "longe", ponto: { economia: 5, costumes: 0 } },
      ],
      0.3,
    );
    expect(c[0] + c[1]).toBeCloseTo(1);
    // e^(−0,3) ÷ (e^(−0,3) + e^(−1,5))
    expect(c[0]).toBeCloseTo(
      Math.exp(-0.3) / (Math.exp(-0.3) + Math.exp(-1.5)),
    );
  });

  it("camada 2: nota zero dá meio a meio; lei boa para o eleitor dá mais sim", () => {
    const zero = { segmentos: 0, bussola: 0, disposicao: 0, frentes: 0 };
    expect(chanceDeSim(regras, zero)).toBeCloseTo(0.5);
    expect(chanceDeSim(regras, { ...zero, segmentos: 0.2 })).toBeGreaterThan(
      0.5,
    );
    expect(chanceDeSim(regras, { ...zero, disposicao: -0.5 })).toBeLessThan(
      0.5,
    );
  });

  it("influência: lei que machuca o grupo puxa o fator para baixo", () => {
    const { minimo, maximo, passo } = regras.influencia;
    expect(passoDaInfluencia(regras, 1, 1)).toBeCloseTo(
      1 + passo * (minimo - 1),
    );
    expect(passoDaInfluencia(regras, 1, 0)).toBeCloseTo(
      1 + passo * (maximo - 1),
    );
    const causas = [
      { origem: "nivel_lei", coeficiente: 0.1, constante: 0, peso: 10 },
      { origem: "indice", coeficiente: 1, constante: 0, peso: 10 },
    ];
    // só a lei conta: 0,1 × 50 = 5 de 10
    expect(
      danoDasLeis(causas, new Set(["nivel_lei"]), {
        nivel_lei: 50,
        indice: 99,
      }),
    ).toBeCloseTo(0.5);
  });
});

describe("Brasil", () => {
  it("as cadeiras somam 513 na Câmara e 81 no Senado", () => {
    const casas = partida.game.congress!.casas;
    expect(soma(casas.camara)).toBe(513);
    expect(soma(casas.senado)).toBe(81);
  });

  it("o seu partido começa pequeno: 5% de cada casa", () => {
    const casas = partida.game.congress!.casas;
    expect(casas.camara[JOGADOR]).toBe(26);
    expect(casas.senado[JOGADOR]).toBe(4);
  });

  it("as 6 bancadas existem, com ponto vindo das referências", () => {
    const pacote = congressoDoPacote(partida.content)!;
    expect(pacote.bancadas.map((b) => b.id)).toEqual(
      congressoDaBussola.bancadas.map((b) => b.id),
    );
    expect(pacote.perfis.length).toBeGreaterThan(1000);
  });

  it("prova: na Câmara passam centro e direita, medidos em 13/out (a meta é os três grupos e o Senado)", () => {
    const pacote = congressoDoPacote(partida.content)!;
    const eleicao = eleicaoDasBancadas(pacote);
    const { tolerancia, grupos } = congressoDaBussola.prova;
    const passam: string[] = [];
    for (const casa of pacote.casas) {
      const cadeiras = dhondt(eleicao.fatias, casa.cadeiras);
      for (const g of grupos) {
        const modelo = g.bancadas.reduce((s, b) => s + (cadeiras[b] ?? 0), 0);
        const real =
          casa.id === "camara" ? g.camara.cadeiras : g.senado.cadeiras;
        if (Math.abs(modelo - real) / real <= tolerancia)
          passam.push(`${casa.id}:${g.id}`);
      }
    }
    expect(passam.sort()).toEqual(["camara:centro", "camara:direita"]);
  });
});

describe("troca-troca", () => {
  const ano = regras.trocaTroca.turnosPorAno;
  const todos = (valor: number) => {
    const pacote = congressoDoPacote(partida.content)!;
    return {
      ...partida.game.execution.values,
      ...Object.fromEntries(
        Object.keys(pacote.pesoDoSegmento).map((s) => [s, valor]),
      ),
    };
  };
  const centro = { economia: 2.4, costumes: -1.3 };

  it("só acontece uma vez por ano, e a casa não muda de tamanho", () => {
    const estado = partida.game.congress!;
    const meio = passarTurnoNoCongresso({
      content: partida.content,
      estado,
      valores: todos(80),
      pontoDoJogador: centro,
      turno: ano - 1,
    });
    expect(meio.casas).toEqual(estado.casas);
    const fim = passarTurnoNoCongresso({
      content: partida.content,
      estado,
      valores: todos(80),
      pontoDoJogador: centro,
      turno: ano,
    });
    expect(soma(fim.casas.camara)).toBe(513);
    expect(fim.trocas.length).toBeGreaterThan(0);
  });

  it("num mandato, governo popular ganha cadeiras e impopular perde", () => {
    const estado = partida.game.congress!;
    const mandato = (satisfacao: number) => {
      let e = estado;
      for (let t = 1; t <= 4 * ano; t++)
        e = passarTurnoNoCongresso({
          content: partida.content,
          estado: e,
          valores: todos(satisfacao),
          pontoDoJogador: centro,
          turno: t,
        });
      return e.casas.camara[JOGADOR];
    };
    expect(mandato(75)).toBeGreaterThan(estado.casas.camara[JOGADOR]);
    expect(mandato(20)).toBeLessThan(estado.casas.camara[JOGADOR]);
  });

  it("indo para a direita, as cadeiras vêm mais da direita do que da esquerda", () => {
    const estado = partida.game.congress!;
    const fim = passarTurnoNoCongresso({
      content: partida.content,
      estado,
      valores: todos(80),
      pontoDoJogador: { economia: 6, costumes: 4 },
      turno: ano,
    });
    const perdeu = (id: string) =>
      estado.casas.camara[id] - fim.casas.camara[id];
    expect(
      perdeu("extrema_direita") + perdeu("direita") + perdeu("centrao"),
    ).toBeGreaterThan(perdeu("extrema_esquerda") + perdeu("esquerda"));
  });

  it("lei que machuca o grupo tira influência dele", () => {
    const grupo = pressureGroups(partida.content)!.grupos.find(
      (g) => g.id === "agronegocio",
    )!;
    const leis = new Set(
      partida.content.policies.map((p) => p.controle.variavel),
    );
    const daLei = grupo.causas.filter((c) => leis.has(c.origem) && !c.porPib);
    expect(daLei.length).toBeGreaterThan(0);
    // cada lei no ponto que mais machuca (pressão = peso) ou que não machuca (0)
    const nivel = (alvo: "max" | "zero") =>
      Object.fromEntries(
        daLei.map((c) => [
          c.origem,
          ((alvo === "max" ? c.peso : 0) - c.constante) / c.coeficiente,
        ]),
      );
    const depois = (alvo: "max" | "zero") =>
      passarTurnoNoCongresso({
        content: partida.content,
        estado: partida.game.congress!,
        valores: { ...partida.game.execution.values, ...nivel(alvo) },
        pontoDoJogador: centro,
        turno: 1,
      }).influencia.agronegocio;
    expect(depois("max")).toBeLessThan(1);
    expect(depois("zero")).toBeGreaterThan(1);
  });

  it("pressão social dá força à frente: o movimento feminista em nível 3 cresce", () => {
    const grupo = pressureGroups(partida.content)!.grupos.find(
      (g) => g.id === "feminista",
    )!;
    const fator = (nivel: number) => {
      let estado = partida.game.congress!;
      for (let turno = 1; turno <= 4; turno++)
        estado = passarTurnoNoCongresso({
          content: partida.content,
          estado,
          valores: { ...partida.game.execution.values, [grupo.nivel]: nivel },
          pontoDoJogador: centro,
          turno: turno * 10 + 1,
        });
      return estado.influencia.feminista;
    };
    expect(fator(3)).toBeGreaterThan(fator(0));
    expect(fator(3)).toBeLessThanOrEqual(regras.influencia.teto);
  });

  it("a frente se concentra onde a base é forte", () => {
    const retrato = retratoDoCongresso({
      content: partida.content,
      estado: partida.game.congress!,
      valores: partida.game.execution.values,
      pontoDoJogador: centro,
    });
    const de = (id: string) => retrato.find((b) => b.id === id)!.frentes;
    expect(de("extrema_direita").evangelica).toBeGreaterThan(
      2 * de("extrema_esquerda").evangelica,
    );
    expect(de("esquerda").mulheres).toBeGreaterThan(
      2 * de("extrema_direita").mulheres,
    );
  });
});

describe("partida", () => {
  it("o turno passa com o Congresso e mostra o retrato das 6 bancadas e do seu partido", () => {
    const r = encerrarTurno(partida);
    if (!r.ok) throw new Error(r.erros.join("\n"));
    const game = r.value.partida.game;
    expect(game.congress).toBeDefined();
    const retrato = retratoDoCongresso({
      content: partida.content,
      estado: game.congress!,
      valores: game.execution.values,
      pontoDoJogador: game.compass!.caminho.at(-1)!,
    });
    expect(retrato).toHaveLength(7);
    for (const b of retrato) {
      expect(b.disposicao).toBeGreaterThanOrEqual(0);
      expect(b.disposicao).toBeLessThanOrEqual(100);
      for (const f of Object.values(b.frentes)) {
        expect(f).toBeGreaterThanOrEqual(0);
        expect(f).toBeLessThanOrEqual(1);
      }
    }
  });
});
