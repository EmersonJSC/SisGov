/**
 * SG143 — grupos sociais como nós da rede: a satisfação de cada grupo vem de
 * leis e indicadores; a aprovação do governo é a média dos grupos pelo peso
 * de cada um no eleitorado (sem dupla contagem).
 */
import { describe, expect, it } from "vitest";
import {
  criarPartida,
  encerrarTurno,
  mudarLei,
  verPartida,
  type Partida,
} from "../app/partida";

function nova(): Partida {
  const criada = criarPartida();
  if (!criada.ok) throw new Error(criada.erros.join(" "));
  return criada.value;
}

function turnos(partida: Partida, n: number): Partida {
  let atual = partida;
  for (let i = 0; i < n; i++) {
    const passou = encerrarTurno(atual);
    if (!passou.ok) throw new Error(passou.erros.join(" "));
    atual = passou.value.partida;
  }
  return atual;
}

describe("SG143 — grupos sociais", () => {
  const partida = nova();
  const visao = verPartida(partida);
  const grupos = visao.bolhas.filter((b) => b.tipo === "grupo");
  const pesos = new Map(
    partida.graph.relations
      .filter((r) => r.targetId === "popularidade_governo")
      .map((r) => [r.originId, r.parameters.coeficiente ?? 0]),
  );

  it("onze grupos, cada pessoa conta em um só (pesos somam 1)", () => {
    expect(grupos).toHaveLength(11);
    expect([...pesos.keys()].sort()).toEqual(grupos.map((g) => g.id).sort());
    const soma = [...pesos.values()].reduce((a, b) => a + b, 0);
    expect(soma).toBeCloseTo(1, 9);
  });

  it("a aprovação é a média dos grupos e começa como a do país (D-35)", () => {
    const v = partida.game.execution.values;
    const media = grupos.reduce((s, g) => s + g.valor * pesos.get(g.id)!, 0);
    expect(v.popularidade_governo).toBeCloseTo(media, 6);
    // valores declarados do Brasil 2026: vencedor da eleição com ~51%
    expect(v.popularidade_governo).toBeGreaterThan(48);
    expect(v.popularidade_governo).toBeLessThan(55);
  });

  it("a satisfação é explicável: leis e indicadores ligados a cada grupo", () => {
    for (const g of grupos) {
      const origens = visao.ligacoes.filter((l) => l.alvo === g.id);
      const leis = origens.filter((l) =>
        visao.leis.some((x) => x.id === l.origem),
      );
      const indicadores = origens.filter((l) =>
        visao.bolhas.some((x) => x.id === l.origem),
      );
      expect(leis.length, g.id).toBeGreaterThan(0);
      expect(indicadores.length, g.id).toBeGreaterThan(0);
    }
    const pobres = visao.ligacoes.filter((l) => l.alvo === "grupo_pobres");
    expect(pobres.some((l) => l.origem === "pobreza" && l.sinal < 0)).toBe(
      true,
    );
    // juros pesam nos grupos (antigo SG121)
    expect(
      visao.ligacoes.some(
        (l) => l.origem === "taxa_juros" && l.alvo === "grupo_empresarios",
      ),
    ).toBe(true);
  });

  it("uma lei liga no máximo uma vez a cada grupo (sem dupla contagem)", () => {
    const pares = new Set<string>();
    for (const l of visao.ligacoes) {
      if (!l.alvo.startsWith("grupo_") || l.mecanismo === "produto") continue;
      if (!visao.leis.some((x) => x.id === l.origem)) continue;
      const par = `${l.origem}>${l.alvo}`;
      expect(pares.has(par), par).toBe(false);
      pares.add(par);
    }
  });

  it("mais transferência de renda: pobres mais satisfeitos, classe média menos", () => {
    const lei = visao.leis.find((l) => l.id === "transferencia-de-renda")!;
    const mudada = mudarLei(partida, lei.id, lei.maximo!);
    if (!mudada.ok) throw new Error(mudada.erros.join(" "));
    const com = turnos(mudada.value, 2).game.execution.values;
    const sem = turnos(partida, 2).game.execution.values;
    expect(com.grupo_pobres).toBeGreaterThan(sem.grupo_pobres + 1);
    expect(com.grupo_classe_media).toBeLessThan(sem.grupo_classe_media);
  });
});
