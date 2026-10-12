/**
 * SG143, V1-08 — segmentos do eleitorado como nós da rede: a satisfação de
 * cada segmento vem de leis e indicadores; a aprovação do governo é a parte
 * do eleitorado que aprova, somada pelos perfis (desenho/populacao.md).
 */
import { describe, expect, it } from "vitest";
import {
  criarPartida,
  encerrarTurno,
  mudarLei,
  verPartida,
  type Partida,
} from "../app/partida";
import { profileApproval } from "../engine/mechanisms/profileApproval";

function nova(): Partida {
  const criada = criarPartida({ ocorrencias: false });
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
  const aprovacao = partida.content.manifest.aprovacaoPorPerfis!;
  // parte do eleitorado em cada segmento: soma dos perfis em que ele entra
  const pesos = new Map<string, number>();
  for (const perfil of aprovacao.perfis)
    for (const id of perfil.segmentos)
      pesos.set(id, (pesos.get(id) ?? 0) + perfil.peso);

  it("vinte segmentos, todos presentes nos perfis do eleitorado", () => {
    expect(grupos).toHaveLength(20);
    expect([...pesos.keys()].sort()).toEqual(grupos.map((g) => g.id).sort());
    expect(Object.keys(aprovacao.pesos).sort()).toEqual(
      grupos.map((g) => g.id).sort(),
    );
  });

  it("a aprovação sai dos perfis e começa perto da real (Quaest jan/2025: 47%)", () => {
    const v = partida.game.execution.values;
    // depois do aquecimento (V1-07) a aprovação segue os segmentos com a
    // resposta gradual: igual até a terceira casa
    expect(v.popularidade_governo).toBeCloseTo(
      profileApproval(aprovacao, (id) => v[id])!,
      3,
    );
    expect(v.popularidade_governo).toBeGreaterThanOrEqual(44);
    expect(v.popularidade_governo).toBeLessThanOrEqual(50);
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
      // Evangélicos só recebem das leis de costumes (desenho/populacao.md §4)
      if (g.id !== "grupo_evangelicos")
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

  it("lista dos grupos: do mais ao menos satisfeito, com o que gostam e odeiam", () => {
    expect(visao.grupos.map((g) => g.id).sort()).toEqual(
      grupos.map((g) => g.id).sort(),
    );
    for (let i = 1; i < visao.grupos.length; i++)
      expect(visao.grupos[i - 1].satisfacao).toBeGreaterThanOrEqual(
        visao.grupos[i].satisfacao,
      );
    for (const g of visao.grupos) {
      expect(g.peso).toBeCloseTo(pesos.get(g.id)!, 9);
      expect(g.satisfacao).toBeCloseTo(
        grupos.find((b) => b.id === g.id)!.valor,
        9,
      );
      // Ricos só recebem ligações que derrubam (impostos, juros, risco):
      // não há nada de que gostem ainda (desenho/populacao.md §4).
      if (g.id !== "grupo_ricos")
        expect(g.gosta.length, g.id).toBeGreaterThan(0);
      expect(g.odeia.length, g.id).toBeGreaterThan(0);
      expect(g.gosta.length).toBeLessThanOrEqual(5);
      expect(g.odeia.length).toBeLessThanOrEqual(5);
      // cada lado vem do maior para o menor, com o sinal certo
      g.gosta.forEach((m, i) => {
        expect(m.pontos).toBeGreaterThan(0);
        if (i) expect(g.gosta[i - 1].pontos).toBeGreaterThanOrEqual(m.pontos);
      });
      g.odeia.forEach((m, i) => {
        expect(m.pontos).toBeLessThan(0);
        if (i) expect(g.odeia[i - 1].pontos).toBeLessThanOrEqual(m.pontos);
      });
      // o motivo é um nó que existe e liga mesmo ao grupo
      for (const m of [...g.gosta, ...g.odeia])
        expect(
          visao.ligacoes.some((l) => l.origem === m.id && l.alvo === g.id),
          `${m.id} > ${g.id}`,
        ).toBe(true);
    }
  });

  it("revogar a lei que o grupo odeia tira ela da lista", () => {
    const antes = visao.grupos.find((g) => g.id === "grupo_pobres")!;
    expect(antes.odeia.some((m) => m.id === "regra-fiscal")).toBe(true);
    const lei = visao.leis.find((l) => l.id === "regra-fiscal")!;
    const mudada = mudarLei(partida, lei.id, lei.minimo!);
    if (!mudada.ok) throw new Error(mudada.erros.join(" "));
    const depois = verPartida(turnos(mudada.value, 4)).grupos.find(
      (g) => g.id === "grupo_pobres",
    )!;
    expect(depois.odeia.some((m) => m.id === "regra-fiscal")).toBe(false);
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
