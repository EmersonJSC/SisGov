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
  const criada = criarPartida({ ocorrencias: false });
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

  it("nenhuma lei regulatória ou institucional antiga tem menos de 3 opções", () => {
    // nas leis de três níveis (D-65) a regra é outra: de 2 a 3
    for (const l of verPartida(partida).leis)
      if (
        !l.nivelLegal &&
        (l.grupo === "regulatoria" || l.grupo === "institucional")
      )
        expect(l.opcoes?.length ?? 0, l.id).toBeGreaterThanOrEqual(3);
  });

  it("trocar de opção muda o custo e as consequências", () => {
    const drogas = lei(partida, "lei-de-drogas");
    const custos = new Set(drogas.opcoes!.map((o) => o.saldoAnual));
    expect(custos.size).toBeGreaterThan(1);
    const guerra = drogas.opcoes!.find((o) => o.id === "guerra-as-drogas")!;
    const previa = preverLei(partida, drogas.id, guerra.valor, 4);
    if (!previa.ok) throw new Error(previa.erros.join(" "));
    const ids = previa.value.efeitos.map((e) => e.id);
    expect(ids).toContain("gasto_publico");
    expect(ids.some((id) => id !== "gasto_publico")).toBe(true);
  });
});

describe("SG138 — leis filhas", () => {
  // D-65 (mecânica 2, 2.5): sem a mãe, a filha de três níveis é revogada.
  // O par do câmbio saiu com o molde das leis (Moeda e câmbio foi arquivada).
  it("a tela sabe quem exige quem", () => {
    const partida = nova();
    const formula = lei(partida, "formula-do-salario-minimo");
    expect(formula.exige).toMatchObject({
      lei: "quem-decide-o-salario-minimo",
      atendida: true,
    });
    expect(formula.exige!.opcoes.length).toBe(2);
    const quem = lei(partida, "quem-decide-o-salario-minimo");
    expect(quem.filhas.map((f) => f.id)).toContain("formula-do-salario-minimo");
    const sistema = lei(partida, "sistema-previdenciario");
    expect(sistema.filhas.map((f) => f.id).sort()).toEqual([
      "pensao-por-morte",
      "previdencia-rural",
    ]);
  });

  it("acabar com o salário mínimo nacional revoga a fórmula, e a tela avisa antes", () => {
    const partida = nova();
    const naoExiste = lei(partida, "quem-decide-o-salario-minimo").opcoes!.find(
      (o) => o.id === "nao-existe",
    )!.valor;
    expect(
      leisQueCaem(partida, "quem-decide-o-salario-minimo", naoExiste),
    ).toContainEqual({
      id: "formula-do-salario-minimo",
      nome: "Fórmula do salário mínimo",
      base: "",
      revogada: true,
    });
    const depois = mudar(partida, "quem-decide-o-salario-minimo", "nao-existe");
    expect(lei(depois, "formula-do-salario-minimo").exige!.atendida).toBe(
      false,
    );
    // uma única ação do jogador
    expect(depois.acoes).toBe(partida.acoes + 1);
  });

  it("com a mãe fora, a filha não pode ser escolhida", () => {
    const partida = mudar(nova(), "quem-decide-o-salario-minimo", "nao-existe");
    const formula = lei(partida, "formula-do-salario-minimo");
    const so = formula.opcoes!.find((o) => o.id === "so-inflacao")!.valor;
    const recusada = mudarLei(partida, formula.id, so);
    expect(recusada.ok).toBe(false);
    expect(preverLei(partida, formula.id, so, 1).ok).toBe(false);
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
    const FILHA = "formula-do-salario-minimo";
    const MAE = "quem-decide-o-salario-minimo";
    const semOpcao = validatePackageCoherence(
      trocar(FILHA, { lei: MAE, opcoes: ["nao-existe-essa"] }),
    );
    expect(semOpcao.ok).toBe(false);
    const ciclo = validatePackageCoherence({
      ...content,
      policies: content.policies.map((p) =>
        p.id === FILHA
          ? { ...p, requer: { lei: MAE, opcoes: ["lei-nacional"] } }
          : p.id === MAE
            ? { ...p, requer: { lei: FILHA, opcoes: ["inflacao-mais-pib"] } }
            : p,
      ),
    });
    expect(ciclo.ok).toBe(false);
    // o Brasil começa com o salário mínimo por lei: exigir que ele não
    // exista deixa o país incoerente
    const incoerente = validatePackageCoherence(
      trocar(FILHA, { lei: MAE, opcoes: ["nao-existe"] }),
    );
    expect(incoerente.ok).toBe(false);
    expect(validatePackageCoherence(content).ok).toBe(true);
  });
});
