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

describe("Lote 7: segurança", () => {
  it("aceita as opções concretas e preserva cannabis como lei filha", () => {
    let p = nova();
    p = aplicar(p, "armas-de-fogo", 75);
    p = aplicar(p, "lei-de-drogas", 75);
    const filha = aplicarMeta(p, "cannabis-legal", 33);
    expect(filha.ok).toBe(true);
    expect(
      p.game.policies.find((x) => x.policyDefinitionId === "armas-de-fogo")
        ?.desiredLevel,
    ).toBe(75);
    expect(
      p.game.policies.find((x) => x.policyDefinitionId === "lei-de-drogas")
        ?.desiredLevel,
    ).toBe(75);
  });

  it("o policiamento reduz crimes patrimoniais após entrar em vigor", () => {
    let base = nova();
    let rota = aplicar(nova(), "policiamento-orientado", 100);
    for (let i = 0; i < 4; i++) {
      const b = encerrarTurno(base);
      const r = encerrarTurno(rota);
      if (!b.ok || !r.ok) throw new Error("Falha no turno focal");
      base = b.value.partida;
      rota = r.value.partida;
    }
    const valor = (p: Partida, id: string) =>
      verPartida(p).bolhas.find((v) => v.id === id)?.valor;
    expect(valor(rota, "crimes_patrimoniais")).toBeLessThan(
      valor(base, "crimes_patrimoniais")!,
    );
  });
});
