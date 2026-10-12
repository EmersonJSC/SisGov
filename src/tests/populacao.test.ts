/**
 * V1-08 — segmentos do eleitorado e perfis sintéticos
 * (docs/v1/desenho/populacao.md §7).
 */
import { describe, expect, it } from "vitest";
import {
  criarPartida,
  encerrarTurno,
  mudarLei,
  verPartida,
  type Partida,
} from "../app/partida";
import { validateContentFile } from "../engine";
import { profileApproval } from "../engine/mechanisms/profileApproval";
import { loadScenarioPackage } from "../game/pais/loadScenarioPackage";

const arquivos = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>("../conteudo/**/*.json", {
      eager: true,
      query: "?raw",
      import: "default",
    }),
  ).map(([path, text]) => [path.slice("../conteudo/".length), text]),
);
const BRASIL = "paises/brasil/pais.json";
const perfisDoBrasil = JSON.parse(arquivos["paises/brasil/perfis.json"]) as {
  atributos: string[];
  valores: Record<string, string[]>;
  perfis: number[][];
};
const totais = JSON.parse(arquivos["paises/brasil/populacao.json"])
  .totais as Record<string, { valores: Record<string, number> }>;

function turnos(partida: Partida, n: number): Partida {
  let atual = partida;
  for (let i = 0; i < n; i++) {
    const passou = encerrarTurno(atual);
    if (!passou.ok) throw new Error(passou.erros.join(" "));
    atual = passou.value.partida;
  }
  return atual;
}

describe("V1-08 — perfis do eleitorado", () => {
  it("os pesos dos perfis somam 100% (erro abaixo de 0,01%)", () => {
    const soma = perfisDoBrasil.perfis.reduce((s, p) => s + p[0], 0);
    expect(Math.abs(soma - 1)).toBeLessThan(0.0001);
  });

  it("cada total do país bate com a fonte (erro abaixo de 0,1 ponto)", () => {
    perfisDoBrasil.atributos.forEach((atributo, i) => {
      const soma = new Map<string, number>();
      for (const p of perfisDoBrasil.perfis) {
        const valor = perfisDoBrasil.valores[atributo][p[i + 1]];
        soma.set(valor, (soma.get(valor) ?? 0) + p[0]);
      }
      for (const [valor, alvo] of Object.entries(totais[atributo].valores))
        expect(
          Math.abs((soma.get(valor) ?? 0) - alvo),
          `${atributo}=${valor}`,
        ).toBeLessThan(0.001);
    });
  });

  it("o motor recusa perfis cujos pesos não somam 1", () => {
    const manifesto = {
      id: "x",
      tipo: "cenario",
      versaoEsquema: 1,
      nome: "x",
      estadoInicial: "e.json",
      variaveis: "v.json",
      politicas: [],
      consequencias: [],
      aprovacaoPorPerfis: {
        alvo: "popularidade_governo",
        k: 12,
        pesos: { grupo_pobres: 3 },
        perfis: [{ peso: 0.7, segmentos: ["grupo_pobres"] }],
      },
    };
    const r = validateContentFile("x.json", JSON.stringify(manifesto));
    expect(r.ok).toBe(false);
  });
});

describe("V1-08 — aprovação pela curva", () => {
  const um = (satisfacao: number, k = 12) =>
    profileApproval(
      {
        alvo: "a",
        k,
        pesos: { s: 1 },
        perfis: [{ peso: 1, segmentos: ["s"] }],
      },
      () => satisfacao,
    )!;

  it("satisfação 50 aprova metade; acima de 50, a maioria do perfil aprova", () => {
    expect(um(50)).toBeCloseTo(50, 9);
    expect(um(62)).toBeCloseTo(100 / (1 + Math.exp(-1)), 9);
    expect(um(62)).toBeGreaterThan(62);
    expect(um(38)).toBeCloseTo(100 - um(62), 9);
  });

  it("agradar pouco a muitos dá outra aprovação que agradar muito a poucos", () => {
    const dois = (a: number, b: number) =>
      profileApproval(
        {
          alvo: "x",
          k: 12,
          pesos: { a: 1, b: 1 },
          perfis: [
            { peso: 0.5, segmentos: ["a"] },
            { peso: 0.5, segmentos: ["b"] },
          ],
        },
        (id) => (id === "a" ? a : b),
      )!;
    // mesma média (55), aprovações diferentes
    expect(dois(55, 55)).not.toBeCloseTo(dois(80, 30), 1);
  });

  it("a satisfação do perfil pesa os segmentos pelo peso do eixo", () => {
    const valor = profileApproval(
      {
        alvo: "x",
        k: 12,
        pesos: { renda: 3, idade: 1 },
        perfis: [{ peso: 1, segmentos: ["renda", "idade"] }],
      },
      (id) => (id === "renda" ? 60 : 20),
    )!;
    // (3 × 60 + 1 × 20) / 4 = 50
    expect(valor).toBeCloseTo(50, 9);
  });
});

describe("V1-08 — Brasil", () => {
  const partida = (() => {
    const criada = criarPartida({ ocorrencias: false });
    if (!criada.ok) throw new Error(criada.erros.join(" "));
    return criada.value;
  })();

  it("aprovação inicial perto da real: Quaest jan/2025, 47% (teste: 44 a 50)", () => {
    const aprovacao = partida.game.execution.values.popularidade_governo;
    expect(aprovacao).toBeGreaterThanOrEqual(44);
    expect(aprovacao).toBeLessThanOrEqual(50);
  });

  it("escola em tempo integral sobe Famílias com filhos no atraso da ligação", () => {
    const ligacao = partida.graph.relations.find(
      (r) =>
        r.sourceId === "escola-tempo-integral" &&
        r.targetId === "grupo_familias_com_filhos",
    )!;
    expect(ligacao).toBeDefined();
    const lei = verPartida(partida).leis.find(
      (l) => l.id === "escola-tempo-integral",
    )!;
    const mudada = mudarLei(partida, lei.id, lei.maximo!);
    if (!mudada.ok) throw new Error(mudada.erros.join(" "));
    // um turno = 3 meses; a ligação age a partir do mês do atraso
    const n = Math.floor(ligacao.delaySteps / 3) + 1;
    const com = turnos(mudada.value, n).game.execution.values;
    const sem = turnos(partida, n).game.execution.values;
    expect(com.grupo_familias_com_filhos).toBeGreaterThan(
      sem.grupo_familias_com_filhos,
    );
  });

  it("perfil sem nenhum segmento é recusado na carga", () => {
    const semRenda = JSON.parse(arquivos["mundo/populacao.json"]);
    semRenda.eixos = semRenda.eixos.filter(
      (e: { id: string }) => e.id === "ambiente",
    );
    const r = loadScenarioPackage(BRASIL, {
      ...arquivos,
      "mundo/populacao.json": JSON.stringify(semRenda),
    });
    expect(r.ok).toBe(false);
  });
});
