// Gargalo do Atendimento (17/nov): o mapa mostra o limite que segura a rede.
import { describe, expect, it } from "vitest";
import { avancar, criarPartida, jogar, montarVisao } from ".";

const fio = (v: ReturnType<typeof montarVisao>, id: string) =>
  v.ligacoes.find((l) => l.id === id);

describe("gargalo do atendimento", () => {
  const p = criarPartida("brasil-2026", 42, {
    semCongresso: true,
    semEleicao: true,
  });

  it("o Brasil começa preso nas vagas: a verba segura, o médico não rende", () => {
    const v = montarVisao(p);
    expect(p.estado.atendimento?.gargalo).toBe("vagas");
    expect(v.bolhas.find((b) => b.id === "atendimento")?.segura?.nome).toBe(
      "vagas",
    );
    expect(fio(v, "gasto-saude>atendimento")?.gargalo).toBe("limita");
    expect(fio(v, "medico_onde_falta>atendimento")?.gargalo).toBe("nao_rende");
  });

  it("com verba alta, o gargalo passa ao médico onde falta", () => {
    const depois = jogar(
      avancar(p, [{ tipo: "mudar_lei", lei: "gasto-saude", valor: 0.1 }]),
      18,
    );
    const v = montarVisao(depois);
    expect(depois.estado.atendimento?.gargalo).toBe("distribuicao");
    expect(fio(v, "medico_onde_falta>atendimento")?.gargalo).toBe("limita");
    expect(fio(v, "gasto-saude>atendimento")?.gargalo).toBe("nao_rende");
  });
});
