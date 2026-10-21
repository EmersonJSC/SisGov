import { describe, expect, it } from "vitest";
import { criarPartida, encerrarTurno, verPartida, type Partida } from "../app/partida";
import { aplicarMeta } from "../app/partida/leis";

function nova() {
  const r = criarPartida({ semente: 7, ocorrencias: false, eleicao: false });
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
function rota(id: string, level: number) {
  const r = aplicarMeta(nova(), id, level);
  if (!r.ok) throw new Error(r.erros.join("; "));
  return avancar(r.value);
}
function valor(p: Partida, id: string) {
  return verPartida(p).bolhas.find((x) => x.id === id)!.valor;
}

describe("Lote 15: sindicatos e acesso a direitos", () => {
  it("cobrar a parte derrotada reduz ações trabalhistas", () => {
    const base = avancar(nova());
    const custo = rota("custo-de-processar-na-justica-do-trabalho", 100);
    expect(valor(custo, "litigio_trabalhista")).toBeLessThan(valor(base, "litigio_trabalhista"));
  });

  it("auditoria salarial reduz diferença e discriminação com atraso", () => {
    const base = avancar(nova());
    const auditoria = rota("igualdade-salarial-de-genero", 100);
    expect(valor(auditoria, "diferenca_salarial_genero")).toBeLessThan(valor(base, "diferenca_salarial_genero"));
    expect(valor(auditoria, "discriminacao")).toBeLessThan(valor(base, "discriminacao"));
  });

  it("proibir greve reduz paralisações e liberdades", () => {
    const base = avancar(nova());
    const proibida = rota("direito-de-greve", 0);
    expect(valor(proibida, "greve_geral")).toBeLessThan(valor(base, "greve_geral"));
    expect(valor(proibida, "liberdade_civil")).toBeLessThan(valor(base, "liberdade_civil"));
  });
});
