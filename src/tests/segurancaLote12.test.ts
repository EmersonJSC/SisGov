import { describe, expect, it } from "vitest";
import { criarPartida, encerrarTurno, verPartida, type Partida } from "../app/partida";
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

describe("Lote 12: justiça e proteção", () => {
  it("mantém uma única lei de delação com controle judicial", () => {
    const p = nova();
    expect(p.content.policies.some((x) => x.id === "delacao-premiada")).toBe(true);
    expect(p.content.policies.some((x) => x.id === "delacao-premiada-e-acordos")).toBe(false);
    expect(p.content.policies.find((x) => x.id === "delacao-premiada")?.controle.opcoes?.map((x) => x.id))
      .toContain("delacao-com-juiz");
  });

  it("excludente amplo aumenta letalidade e reduz confiança", () => {
    const base = avancar(nova());
    const amplo = avancar(aplicar(nova(), "excludente-de-ilicitude", 100));
    expect(valor(amplo, "letalidade_policial")).toBeGreaterThan(valor(base, "letalidade_policial"));
    expect(valor(amplo, "confianca_instituicoes")).toBeLessThan(valor(base, "confianca_instituicoes"));
  });

  it("rede de abrigo melhora proteção efetiva com atraso", () => {
    const base = avancar(nova());
    const rede = avancar(aplicar(nova(), "protecao-contra-violencia-domestica", 100));
    expect(valor(rede, "protecao_efetiva_mulheres")).toBeGreaterThan(valor(base, "protecao_efetiva_mulheres"));
  });
});
