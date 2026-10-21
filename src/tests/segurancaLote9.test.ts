import { describe, expect, it } from "vitest";
import {
  criarPartida,
  encerrarTurno,
  verPartida,
  type Partida,
} from "../app/partida";
import { aplicarMeta } from "../app/partida/leis";

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

function avancar(p: Partida, turnos: number) {
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

describe("Lote 9: organização policial", () => {
  it("mantém uma única escolha de natureza militar ou civil", () => {
    const p = nova();
    expect(p.content.policies.some((x) => x.id === "policia-militar")).toBe(
      true,
    );
    expect(
      p.content.policies.some((x) => x.id === "natureza-da-policia-de-rua"),
    ).toBe(false);
    expect(
      p.content.policies
        .find((x) => x.id === "coordenacao-das-policias")
        ?.controle.opcoes?.map((x) => x.id),
    ).toContain("forcas-tarefa-nacionais-permanentes");
  });

  it("cooperação e ciclo completo reduzem crime organizado e impunidade", () => {
    const base = avancar(nova(), 8);
    let rota = aplicar(nova(), "coordenacao-das-policias", 100);
    rota = aplicar(rota, "ciclo-policial", 100);
    rota = avancar(rota, 8);
    expect(valor(rota, "crime_organizado")).toBeLessThan(
      valor(base, "crime_organizado"),
    );
    expect(valor(rota, "impunidade")).toBeLessThan(valor(base, "impunidade"));
  });

  it("a carreira civil reduz letalidade após implantação", () => {
    const base = avancar(nova(), 8);
    const civil = avancar(aplicar(nova(), "policia-militar", 100), 8);
    expect(valor(civil, "letalidade_policial")).toBeLessThan(
      valor(base, "letalidade_policial"),
    );
  });
});
