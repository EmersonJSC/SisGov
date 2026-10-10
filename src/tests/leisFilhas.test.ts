/**
 * SG138 — leis com opções e leis filhas: trocar de opção muda custo e
 * consequências; nenhuma lei com menos de 3 opções; a lei filha só sai da
 * base com a mãe numa das opções exigidas e cai quando a mãe sai delas.
 */
import { describe, expect, it } from "vitest";
import {
  criarPartida,
  leisQueCaem,
  mudarLei,
  preverLei,
  verPartida,
  type Partida,
} from "../app/partida";
import { validatePackageCoherence } from "../engine";

function nova(): Partida {
  const criada = criarPartida();
  if (!criada.ok) throw new Error(criada.erros.join(" "));
  return criada.value;
}

function mudar(partida: Partida, id: string, opcao: string): Partida {
  const lei = verPartida(partida).leis.find((l) => l.id === id)!;
  const valor = lei.opcoes!.find((o) => o.id === opcao)!.valor;
  const mudada = mudarLei(partida, id, valor);
  if (!mudada.ok) throw new Error(mudada.erros.join(" "));
  return mudada.value;
}

const lei = (partida: Partida, id: string) =>
  verPartida(partida).leis.find((l) => l.id === id)!;

const opcaoDaMeta = (partida: Partida, id: string) => {
  const l = lei(partida, id);
  return l.opcoes!.find((o) => Math.abs(o.valor - l.meta) < 1e-9)?.id;
};

describe("SG138 — leis com opções", () => {
  const partida = nova();

  it("nenhuma lei regulatória ou institucional tem menos de 3 opções", () => {
    for (const l of verPartida(partida).leis)
      if (l.grupo === "regulatoria" || l.grupo === "institucional")
        expect(l.opcoes?.length ?? 0, l.id).toBeGreaterThanOrEqual(3);
  });

  it("trocar de opção muda o custo e as consequências", () => {
    const cameras = lei(partida, "cameras-corporais");
    const custos = new Set(cameras.opcoes!.map((o) => o.saldoAnual));
    expect(custos.size).toBeGreaterThan(1);
    const continua = cameras.opcoes!.find((o) => o.id === "gravacao-continua")!;
    const previa = preverLei(partida, cameras.id, continua.valor, 4);
    if (!previa.ok) throw new Error(previa.erros.join(" "));
    const ids = previa.value.efeitos.map((e) => e.id);
    expect(ids).toContain("gasto_publico");
    expect(ids.some((id) => id !== "gasto_publico")).toBe(true);
  });
});

describe("SG138 — leis filhas", () => {
  it("a tela sabe quem exige quem", () => {
    const partida = nova();
    const meta = lei(partida, "meta-de-inflacao");
    expect(meta.exige).toMatchObject({
      lei: "regime-cambial",
      atendida: true,
      base: "Sem meta",
    });
    expect(meta.exige!.opcoes.length).toBe(3);
    const cambio = lei(partida, "regime-cambial");
    expect(cambio.filhas.map((f) => f.id)).toEqual(["meta-de-inflacao"]);
    expect(cambio.filhas[0].ativa).toBe(true);
    const sistema = lei(partida, "sistema-previdenciario");
    expect(sistema.filhas.map((f) => f.id).sort()).toEqual([
      "pensao-por-morte",
      "previdencia-rural",
    ]);
  });

  it("câmbio fixo derruba a meta de inflação, e a tela avisa antes", () => {
    const partida = nova();
    const fixo = lei(partida, "regime-cambial").opcoes!.find(
      (o) => o.id === "fixo",
    )!.valor;
    expect(leisQueCaem(partida, "regime-cambial", fixo)).toEqual([
      { id: "meta-de-inflacao", nome: "Meta de inflação", base: "Sem meta" },
    ]);
    // trocar entre opções que mantêm a filha não derruba nada
    const bandas = lei(partida, "regime-cambial").opcoes!.find(
      (o) => o.id === "bandas",
    )!.valor;
    expect(leisQueCaem(partida, "regime-cambial", bandas)).toEqual([]);

    const depois = mudar(partida, "regime-cambial", "fixo");
    expect(opcaoDaMeta(depois, "meta-de-inflacao")).toBe("sem-meta");
    expect(lei(depois, "meta-de-inflacao").exige!.atendida).toBe(false);
    // uma única ação do jogador
    expect(depois.acoes).toBe(partida.acoes + 1);
  });

  it("com a mãe fora, a filha só aceita a base", () => {
    const partida = mudar(nova(), "regime-cambial", "fixo");
    const meta = lei(partida, "meta-de-inflacao");
    const estrita = meta.opcoes!.find((o) => o.id === "meta-estrita")!.valor;
    const recusada = mudarLei(partida, meta.id, estrita);
    expect(recusada.ok).toBe(false);
    if (!recusada.ok)
      expect(recusada.erros[0]).toMatch(/exige Regime cambial em:/);
    // a prévia também recusa
    expect(preverLei(partida, meta.id, estrita, 1).ok).toBe(false);
    // a base continua permitida (repetir a meta não vira ação)
    expect(mudarLei(partida, meta.id, meta.opcoes![0].valor).ok).toBe(true);
    // voltar a mãe não religa a filha: o jogador decide de novo
    const voltou = mudar(partida, "regime-cambial", "flutuante");
    expect(opcaoDaMeta(voltou, "meta-de-inflacao")).toBe("sem-meta");
    expect(lei(voltou, "meta-de-inflacao").exige!.atendida).toBe(true);
    expect(
      opcaoDaMeta(
        mudar(voltou, "meta-de-inflacao", "meta-estrita"),
        "meta-de-inflacao",
      ),
    ).toBe("meta-estrita");
  });

  it("acabar com a previdência derruba as duas filhas", () => {
    const partida = nova();
    const depois = mudar(partida, "sistema-previdenciario", "sem-sistema");
    expect(opcaoDaMeta(depois, "previdencia-rural")).toBe("nenhuma");
    expect(opcaoDaMeta(depois, "pensao-por-morte")).toBe("nenhuma");
    // a prévia da mãe já inclui a queda das filhas: o gasto cai mais
    const sistema = lei(partida, "sistema-previdenciario");
    const sem = sistema.opcoes!.find((o) => o.id === "sem-sistema")!.valor;
    const previa = preverLei(partida, sistema.id, sem, 2);
    if (!previa.ok) throw new Error(previa.erros.join(" "));
    expect(previa.value.efeitos.some((e) => e.id === "gasto_publico")).toBe(
      true,
    );
  });

  it("o validador recusa mãe sem a opção, ciclo e país incoerente", () => {
    const { content } = nova();
    const trocar = (id: string, requer: unknown) => ({
      ...content,
      policies: content.policies.map((p) =>
        p.id === id ? ({ ...p, requer } as typeof p) : p,
      ),
    });
    const semOpcao = validatePackageCoherence(
      trocar("meta-de-inflacao", {
        lei: "regime-cambial",
        opcoes: ["nao-existe"],
      }),
    );
    expect(semOpcao.ok).toBe(false);
    const ciclo = validatePackageCoherence({
      ...trocar("meta-de-inflacao", {
        lei: "regime-cambial",
        opcoes: ["flutuante"],
      }),
      policies: content.policies.map((p) =>
        p.id === "meta-de-inflacao"
          ? { ...p, requer: { lei: "regime-cambial", opcoes: ["flutuante"] } }
          : p.id === "regime-cambial"
            ? {
                ...p,
                requer: { lei: "meta-de-inflacao", opcoes: ["meta-estrita"] },
              }
            : p,
      ),
    });
    expect(ciclo.ok).toBe(false);
    // o Brasil começa com meta estrita: exigir câmbio fixo deixa o país incoerente
    const incoerente = validatePackageCoherence(
      trocar("meta-de-inflacao", { lei: "regime-cambial", opcoes: ["fixo"] }),
    );
    expect(incoerente.ok).toBe(false);
    expect(validatePackageCoherence(content).ok).toBe(true);
  });
});
