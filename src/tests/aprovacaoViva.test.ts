import { describe, expect, it } from "vitest";
import { criarPartida } from "../app/partida";
import { aprovacaoViva } from "../game/congresso";
import { profileApproval } from "../engine/mechanisms/profileApproval";

const partida = () => {
  const p = criarPartida({ ocorrencias: false, eleicao: false });
  if (!p.ok) throw new Error(p.erros.join(" "));
  return p.value;
};

const leitor = (valores: Readonly<Record<string, number>>) => (id: string) =>
  valores[id];

describe("a popularidade lê o país vivo (M7.1)", () => {
  it("no turno 0 dá o mesmo número dos perfis fixos", () => {
    const { content, game } = partida();
    const ini = game.valoresIniciais!;
    const fixa = content.manifest.aprovacaoPorPerfis!;
    const viva = aprovacaoViva(content, ini)!;
    expect(profileApproval(viva, leitor(ini))).toBeCloseTo(
      profileApproval(fixa, leitor(ini))!,
      0,
    );
  });

  it("o eleitorado vivo tem o mesmo peso total do fixo", () => {
    const { content, game } = partida();
    const ini = game.valoresIniciais!;
    const total = (a: { perfis: readonly { peso: number }[] }) =>
      a.perfis.reduce((s, p) => s + p.peso, 0);
    expect(total(aprovacaoViva(content, ini)!)).toBeCloseTo(
      total(content.manifest.aprovacaoPorPerfis!),
      6,
    );
  });

  it("o bolso entra na conta: sem o ajuste, a popularidade é outra", () => {
    const { content, game } = partida();
    const ini = game.valoresIniciais!;
    const outro = {
      ...ini,
      arrecadacao_renda_pessoas: ini.arrecadacao_renda_pessoas * 3,
    };
    const viva = aprovacaoViva(content, outro)!;
    expect(viva.perfis.some((p) => Math.abs(p.ajuste ?? 0) > 0.5)).toBe(true);
    const semAjuste = {
      ...viva,
      perfis: viva.perfis.map(({ peso, segmentos }) => ({ peso, segmentos })),
    };
    expect(profileApproval(viva, leitor(ini))).not.toBeCloseTo(
      profileApproval(semAjuste, leitor(ini))!,
      1,
    );
  });

  it("o desemprego em alta move a popularidade pelo peso do desempregado", () => {
    const { content, game } = partida();
    const ini = game.valoresIniciais!;
    const chave = Object.keys(ini).find((k) => /desemprego/.test(k));
    expect(chave).toBeDefined();
    const alto = { ...ini, [chave!]: ini[chave!] * 2 };
    const antes = aprovacaoViva(content, ini)!;
    const depois = aprovacaoViva(content, alto)!;
    const pesoDeD = (a: typeof antes) =>
      a.perfis
        .filter((p) => p.segmentos.includes("grupo_desempregados"))
        .reduce((s, p) => s + p.peso, 0);
    expect(pesoDeD(depois)).toBeGreaterThan(pesoDeD(antes));
  });
});
