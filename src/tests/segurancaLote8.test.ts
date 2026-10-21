import { describe, expect, it } from "vitest";
import {
  criarPartida,
  encerrarTurno,
  verPartida,
  type Partida,
} from "../app/partida";
import { aplicarMeta } from "../app/partida/leis";
import { policyLevelRulesFromContent } from "../game/policyRulesFromContent";

function nova() {
  const r = criarPartida({ semente: 7, ocorrencias: false, eleicao: false });
  if (!r.ok) throw new Error(r.erros.join("; "));
  return r.value;
}

function meta(p: Partida, id: string, valor: number) {
  const r = aplicarMeta(p, id, valor);
  if (!r.ok) throw new Error(r.erros.join("; "));
  return r.value;
}

describe("Lote 8: vigilância e verba", () => {
  it("usa o teto monetário real das verbas, sem confundir com percentual", () => {
    let p = nova();
    const cameras = policyLevelRulesFromContent(p.content, "cameras-corporais");
    const fundo = policyLevelRulesFromContent(
      p.content,
      "fundo-seguranca-publica",
    );
    if (!cameras.ok || !fundo.ok) throw new Error("Limites ausentes");
    expect(cameras.value.rules.domain.maximum).toBe(1200);
    expect(fundo.value.rules.domain.maximum).toBe(18000);
    p = meta(p, "cameras-corporais", 1200);
    p = meta(p, "fundo-seguranca-publica", 18000);
    expect(
      p.game.policies.find((x) => x.policyDefinitionId === "cameras-corporais")
        ?.desiredLevel,
    ).toBe(1200);
    expect(
      p.game.policies.find(
        (x) => x.policyDefinitionId === "fundo-seguranca-publica",
      )?.desiredLevel,
    ).toBe(18000);
  });

  it("a expansão de vigilância reduz furtos e sacrifica liberdade após quatro turnos", () => {
    let base = nova();
    let rota = meta(nova(), "cameras-e-reconhecimento-facial", 100);
    rota = meta(rota, "vigilancia-de-bairro", 100);
    for (let i = 0; i < 4; i++) {
      const b = encerrarTurno(base),
        r = encerrarTurno(rota);
      if (!b.ok || !r.ok) throw new Error("Falha no turno focal");
      base = b.value.partida;
      rota = r.value.partida;
    }
    const valor = (p: Partida, id: string) =>
      verPartida(p).bolhas.find((x) => x.id === id)!.valor;
    expect(valor(rota, "crimes_patrimoniais")).toBeLessThan(
      valor(base, "crimes_patrimoniais"),
    );
    expect(valor(rota, "liberdade_civil")).toBeLessThan(
      valor(base, "liberdade_civil"),
    );
  });
});
