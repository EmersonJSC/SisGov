import { describe, expect, it } from "vitest";
import {
  criarPartida,
  encerrarTurno,
  verPartida,
  type Partida,
} from "../app/partida";
import { aplicarMeta } from "../app/partida/leis";
import { requirementsOf } from "../engine";

function nova() {
  const r = criarPartida({ semente: 7, ocorrencias: false, eleicao: false });
  if (!r.ok) throw new Error(r.erros.join("; "));
  return r.value;
}
function aplicar(p: Partida, id: string, valor: number) {
  const r = aplicarMeta(p, id, valor);
  if (!r.ok) throw new Error(r.erros.join("; "));
  return r.value;
}
function avancar(p: Partida, turnos = 8) {
  for (let i = 0; i < turnos; i++) {
    const r = encerrarTurno(p);
    if (!r.ok) throw new Error(r.erros.join("; "));
    p = r.value.partida;
  }
  return p;
}
function valor(p: Partida, id: string) {
  return verPartida(p).bolhas.find((x) => x.id === id)!.valor;
}

describe("Lote 11: facções, drogas e investigação", () => {
  it("regime de exceção reduz crime e aumenta lotação e rebeliões", () => {
    const base = avancar(nova());
    const excecao = avancar(aplicar(nova(), "regime-contra-faccoes", 100));
    expect(valor(excecao, "crime_organizado")).toBeLessThan(
      valor(base, "crime_organizado"),
    );
    expect(valor(excecao, "lotacao_prisional")).toBeGreaterThan(
      valor(base, "lotacao_prisional"),
    );
    expect(valor(excecao, "rebeliao_presidios")).toBeGreaterThan(
      valor(base, "rebeliao_presidios"),
    );
  });

  it("lojas licenciadas exigem lei de drogas compatível e alteram a rede", () => {
    const p = nova();
    const cannabis = p.content.policies.find((x) => x.id === "cannabis-legal");
    const requisito = cannabis && requirementsOf(cannabis)[0];
    expect(requisito?.opcoes).toContain("criterio-objetivo-uso-pessoal");
    const base = avancar(p);
    const lojas = avancar(aplicar(nova(), "cannabis-legal", 100));
    expect(valor(lojas, "crime_organizado")).toBeLessThan(
      valor(base, "crime_organizado"),
    );
    expect(valor(lojas, "uso_drogas")).toBeGreaterThan(
      valor(base, "uso_drogas"),
    );
  });

  it("poderes, escutas e verba da agência são alavancas diferentes", () => {
    const p = nova();
    const ids = [
      "poderes-de-investigacao",
      "interceptacao-de-comunicacoes",
      "agencia-de-inteligencia",
    ];
    expect(
      new Set(
        ids.map(
          (id) =>
            p.content.policies.find((x) => x.id === id)?.controle.variavel,
        ),
      ).size,
    ).toBe(3);
    expect(
      p.content.policies.some((x) => x.id === "agencia-de-inteligencia"),
    ).toBe(true);
  });

  it("encaminhamento a tratamento não altera diretamente a expectativa de vida nacional", () => {
    const lei = nova().content.policies.find((x) => x.id === "lei-de-drogas");
    expect(lei?.consequencias).not.toContain("lei-de-drogas--saude-populacao");
    expect(
      lei?.controle.opcoes?.find((x) => x.id === "uso-e-saude")?.efeitos,
    ).toContain("capacidade de atendimento");
  });
});
