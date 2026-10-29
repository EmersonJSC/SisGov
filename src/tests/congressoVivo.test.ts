/**
 * O eleitorado vivo (População, camada C): o desemprego e a informalidade do
 * motor movem o peso dos perfis, sem estado guardado. O teste prende o que não
 * pode mudar — a soma dos pesos, a ordem de quem perde o emprego, o gêmeo — e
 * não os números, que ainda vão ser calibrados.
 */
import { describe, expect, it } from "vitest";
import type { CongressManifest } from "../engine/model/contentTypes";
import {
  carregarPartida,
  criarPartida,
  salvarPartida,
  verPartida,
} from "../app/partida";
import {
  congressoDoPacote,
  eleicaoComJogador,
  pacoteVivo,
} from "../game/congresso";
import { congressoVivo, origemDoDesempregado } from "../game/congresso/vivo";

let guardado: CongressManifest | undefined;
function manifesto(): CongressManifest {
  if (!guardado) {
    const criada = criarPartida({ ocorrencias: false, eleicao: false });
    if (!criada.ok) throw new Error(criada.erros.join(" "));
    guardado = criada.value.content.manifest.congresso!;
  }
  return guardado;
}

const PAIS = { desemprego: 6.2, informalidade: 38.6 };

const soma = (m: CongressManifest): number =>
  m.perfis.reduce((s, p) => s + p[0], 0);

function coluna(m: CongressManifest, atributo: string): number {
  return m.atributos.indexOf(atributo) + 1;
}

/** Peso das linhas de uma ocupação (nome), das originais ou das gêmeas. */
function pesoDa(m: CongressManifest, ocupacao: string): number {
  const c = coluna(m, "ocupacao");
  return m.perfis
    .filter((p) => m.valores.ocupacao[p[c]] === ocupacao)
    .reduce((s, p) => s + p[0], 0);
}

/**
 * Fração do peso original dos perfis que passam no filtro que virou
 * desempregada. A linha gêmea é lida pela ocupação de onde saiu.
 */
function fracaoDe(
  fixo: CongressManifest,
  vivo: CongressManifest,
  filtro: (valor: (atributo: string) => string) => boolean,
): number {
  const primeira = vivo.vivo!.primeiraLinhaDeDesempregado;
  const valorDe =
    (m: CongressManifest, p: readonly number[], linha?: number) =>
    (atributo: string): string =>
      atributo === "ocupacao" && linha !== undefined
        ? origemDoDesempregado(vivo, linha)!
        : m.valores[atributo][p[coluna(m, atributo)]];
  const original = fixo.perfis
    .filter((p) => filtro(valorDe(fixo, p)))
    .reduce((s, p) => s + p[0], 0);
  const desempregado = vivo.perfis
    .map((p, i) => ({ p, i }))
    .filter(({ i }) => i >= primeira)
    .filter(({ p, i }) => filtro(valorDe(vivo, p, i)))
    .reduce((s, { p }) => s + p[0], 0);
  return original > 0 ? desempregado / original : 0;
}

describe("o eleitorado vivo: quem perde o emprego", () => {
  it("a soma dos pesos continua a mesma, com qualquer desemprego e informalidade", () => {
    const m = manifesto();
    for (const desemprego of [0, 6.2, 30, 100])
      for (const informalidade of [20, 38.6, 60])
        expect(
          soma(congressoVivo(m, { desemprego, informalidade })),
        ).toBeCloseTo(soma(m), 9);
  });

  it("desemprego zero não cria desempregado", () => {
    const vivo = congressoVivo(manifesto(), { ...PAIS, desemprego: 0 });
    expect(pesoDa(vivo, "desempregado")).toBe(0);
  });

  it("o desempregado soma o desemprego vezes a força de trabalho", () => {
    const m = manifesto();
    const vivo = congressoVivo(m, { ...PAIS, desemprego: 10 });
    const forca = ["carteira", "informal", "servidor", "agricultura-familiar"]
      .map((o) => pesoDa(m, o))
      .reduce((a, b) => a + b, 0);
    expect(pesoDa(vivo, "desempregado")).toBeCloseTo(0.1 * forca, 6);
  });

  it("desemprego total não passa de um por perfil e esvazia quem pode perder", () => {
    const m = manifesto();
    const vivo = congressoVivo(m, { ...PAIS, desemprego: 100 });
    const fixoPorLinha = new Map(m.perfis.map((p, i) => [i, p[0]]));
    vivo.perfis.slice(0, m.perfis.length).forEach((p, i) => {
      expect(p[0]).toBeGreaterThanOrEqual(0);
      expect(p[0]).toBeLessThanOrEqual(fixoPorLinha.get(i)! + 1e-12);
    });
    // Servidor não perde (peso de vulnerabilidade baixo, mas nunca zero),
    // então com 100% quase ninguém sobra empregado.
    expect(pesoDa(vivo, "desempregado")).toBeGreaterThan(0);
  });

  it("jovem pobre de carteira perde mais que adulto rico de carteira", () => {
    const m = manifesto();
    const vivo = congressoVivo(m, { ...PAIS, desemprego: 15 });
    const jovemPobre = fracaoDe(
      m,
      vivo,
      (v) =>
        v("ocupacao") === "carteira" &&
        v("renda") === "pobre" &&
        v("idade") === "16-29",
    );
    const adultoRico = fracaoDe(
      m,
      vivo,
      (v) =>
        v("ocupacao") === "carteira" &&
        v("renda") === "rica" &&
        v("idade") === "30-59",
    );
    expect(jovemPobre).toBeGreaterThan(adultoRico);
  });

  it("servidor perde menos que carteira, no mesmo desemprego", () => {
    const m = manifesto();
    const vivo = congressoVivo(m, { ...PAIS, desemprego: 15 });
    const de = (ocupacao: string) =>
      fracaoDe(m, vivo, (v) => v("ocupacao") === ocupacao);
    expect(de("servidor")).toBeLessThan(de("carteira"));
  });

  it("quem não trabalha não perde emprego", () => {
    const m = manifesto();
    const vivo = congressoVivo(m, { ...PAIS, desemprego: 40 });
    for (const o of ["aposentado", "fora", "empresario", "agro-patronal"])
      expect(pesoDa(vivo, o)).toBeCloseTo(pesoDa(m, o), 12);
  });

  it("a linha gêmea diz de que ocupação o desempregado saiu", () => {
    const m = manifesto();
    const vivo = congressoVivo(m, { ...PAIS, desemprego: 15 });
    const primeira = vivo.vivo!.primeiraLinhaDeDesempregado;
    expect(primeira).toBe(m.perfis.length);
    const origens = new Set(
      vivo.perfis
        .slice(primeira)
        .map((_, i) => origemDoDesempregado(vivo, primeira + i)),
    );
    expect(origens).toContain("carteira");
    expect(origens).toContain("informal");
    expect(origemDoDesempregado(vivo, 0)).toBeUndefined();
  });
});

describe("o eleitorado vivo: informalidade", () => {
  /** Peso de uma ocupação, descontado o carving do desemprego. */
  const empregado = (m: CongressManifest, o: string) => pesoDa(m, o);

  it("com a informalidade de partida, ninguém troca de ocupação", () => {
    const m = manifesto();
    const sem = congressoVivo(m, { ...PAIS, desemprego: 0 });
    expect(empregado(sem, "carteira")).toBeCloseTo(pesoDa(m, "carteira"), 9);
    expect(empregado(sem, "informal")).toBeCloseTo(pesoDa(m, "informal"), 9);
  });

  it("informalidade sobe: o peso passa de carteira para informal", () => {
    const m = manifesto();
    const base = congressoVivo(m, { ...PAIS, desemprego: 0 });
    const alta = congressoVivo(m, {
      ...PAIS,
      desemprego: 0,
      informalidade: 50,
    });
    expect(empregado(alta, "informal")).toBeGreaterThan(
      empregado(base, "informal"),
    );
    expect(empregado(alta, "carteira")).toBeLessThan(
      empregado(base, "carteira"),
    );
    expect(soma(alta)).toBeCloseTo(soma(m), 9);
  });

  it("informalidade cai: o peso volta para a carteira", () => {
    const m = manifesto();
    const base = congressoVivo(m, { ...PAIS, desemprego: 0 });
    const baixa = congressoVivo(m, {
      ...PAIS,
      desemprego: 0,
      informalidade: 30,
    });
    expect(empregado(baixa, "carteira")).toBeGreaterThan(
      empregado(base, "carteira"),
    );
  });

  it("não move mais peso do que há em carteira com gêmeo", () => {
    const m = manifesto();
    const extrema = congressoVivo(m, {
      ...PAIS,
      desemprego: 0,
      informalidade: 100,
    });
    expect(empregado(extrema, "carteira")).toBeGreaterThan(0);
    expect(empregado(extrema, "carteira")).toBeLessThanOrEqual(
      pesoDa(m, "carteira"),
    );
  });
});

describe("o eleitorado vivo: sem a tabela", () => {
  it("país sem bloco emprego devolve o mesmo manifesto", () => {
    const m = manifesto();
    const sem: CongressManifest = { ...m, emprego: undefined };
    expect(congressoVivo(sem, { ...PAIS, desemprego: 30 })).toBe(sem);
  });

  it("não altera o manifesto que recebe", () => {
    const m = manifesto();
    const antes = JSON.stringify(m.perfis);
    congressoVivo(m, { desemprego: 25, informalidade: 60 });
    expect(JSON.stringify(m.perfis)).toBe(antes);
    expect(m.valores.ocupacao).not.toContain("desempregado");
  });

  it("valor ausente ou torto não derruba: vale a partida", () => {
    const m = manifesto();
    const vivo = congressoVivo(m, { desemprego: Number.NaN });
    expect(soma(vivo)).toBeCloseTo(soma(m), 9);
  });
});

describe("o pacote vivo: eleição e Congresso", () => {
  const conteudo = () => {
    const criada = criarPartida({ ocorrencias: false, eleicao: false });
    if (!criada.ok) throw new Error(criada.erros.join(" "));
    return criada.value.content;
  };
  const pesoTotal = (p: { perfis: readonly { peso: number }[] }) =>
    p.perfis.reduce((t, x) => t + x.peso, 0);
  const pesoDoGrupo = (p: {
    perfis: readonly { peso: number; segmentos: readonly string[] }[];
  }) =>
    p.perfis
      .filter((x) => x.segmentos.includes("grupo_desempregados"))
      .reduce((t, x) => t + x.peso, 0);

  it("o eleitorado vivo soma o mesmo que o fixo", () => {
    const c = conteudo();
    expect(
      pesoTotal(pacoteVivo(c, { desemprego: 20, informalidade: 50 })!),
    ).toBeCloseTo(pesoTotal(congressoDoPacote(c)!), 9);
  });

  it("desemprego maior dá mais peso político ao desempregado", () => {
    const c = conteudo();
    const peso = (desemprego: number) =>
      pesoDoGrupo(pacoteVivo(c, { desemprego, informalidade: 38.6 })!);
    expect(peso(25)).toBeGreaterThan(peso(6));
    expect(peso(0)).toBe(0);
    // os perfis fixos da partida não têm ninguém no grupo
    expect(pesoDoGrupo(congressoDoPacote(c)!)).toBe(0);
  });

  it("no país de partida a eleição quase não muda com o eleitorado vivo", () => {
    const c = conteudo();
    const ponto = { economia: 0, costumes: 0 };
    const vs = { desemprego: 6.2, informalidade: 38.6 };
    const fixo = eleicaoComJogador(congressoDoPacote(c)!, ponto, vs);
    const vivo = eleicaoComJogador(pacoteVivo(c, vs)!, ponto, vs);
    for (const [id, fatia] of Object.entries(fixo.fatias))
      expect(Math.abs(vivo.fatias[id] - fatia)).toBeLessThan(0.03);
  });

  it("partida salva carrega e mostra o desempregado no censo", () => {
    const criada = criarPartida({ ocorrencias: false, eleicao: false });
    if (!criada.ok) throw new Error(criada.erros.join(" "));
    const lida = carregarPartida(salvarPartida(criada.value));
    if (!lida.ok) throw new Error(lida.erros.join(" "));
    const ocupacao = verPartida(lida.value.partida).censo.find(
      (a) => a.id === "ocupacao",
    )!;
    expect(
      ocupacao.faixas.some((f) => f.id === "desempregado" && f.parte > 0),
    ).toBe(true);
  });
});
