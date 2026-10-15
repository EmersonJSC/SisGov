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
    // resposta gradual: igual até a terceira casa (V1-34: com as 28 leis
    // novas a diferença ficou em 0,0005; a tolerância passou a 0,001)
    expect(
      Math.abs(
        v.popularidade_governo - profileApproval(aprovacao, (id) => v[id])!,
      ),
    ).toBeLessThan(0.002); // V1-34 (troca de Economia): 0,0016
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
      // o painel mostra o que MUDOU desde o início (15/out): no turno 0 ainda
      // nada mudou, então não há o que gostar nem odiar
      expect(g.gosta, g.id).toEqual([]);
      expect(g.odeia, g.id).toEqual([]);
    }
  });

  it("depois que o jogador muda leis, os motivos aparecem do lado e com o sinal certos", () => {
    const lei = visao.leis.find((l) => l.id === "transferencia-de-renda")!;
    const mudada = mudarLei(partida, lei.id, lei.maximo!);
    if (!mudada.ok) throw new Error(mudada.erros.join(" "));
    const depois = verPartida(turnos(mudada.value, 4));
    let comMotivo = 0;
    for (const g of depois.grupos) {
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
      for (const m of [...g.gosta, ...g.odeia]) {
        comMotivo += 1;
        expect(
          depois.ligacoes.some((l) => l.origem === m.id && l.alvo === g.id),
          `${m.id} > ${g.id}`,
        ).toBe(true);
      }
    }
    expect(comMotivo).toBeGreaterThan(0);
    // a transferência de renda é motivo para os pobres gostarem e para a
    // classe média desgostar (o que a lei mudou, não o que ela é)
    const pobres = depois.grupos.find((g) => g.id === "grupo_pobres")!;
    const classeMedia = depois.grupos.find(
      (g) => g.id === "grupo_classe_media",
    )!;
    expect(pobres.gosta.some((m) => m.id === lei.id)).toBe(true);
    expect(classeMedia.odeia.some((m) => m.id === lei.id)).toBe(true);
  });

  it("a lei que o jogador não mexeu não vira motivo só por existir", () => {
    // regra fiscal está em vigor desde o início: sem mudar, não aparece
    const antes = visao.grupos.find((g) => g.id === "grupo_pobres")!;
    expect(antes.odeia.some((m) => m.id === "regra-fiscal")).toBe(false);
    const lei = visao.leis.find((l) => l.id === "regra-fiscal")!;
    const mudada = mudarLei(partida, lei.id, lei.minimo!);
    if (!mudada.ok) throw new Error(mudada.erros.join(" "));
    const depois = verPartida(turnos(mudada.value, 4));
    const motivos = depois.grupos.flatMap((g) => [...g.gosta, ...g.odeia]);
    // ao mexer nela, ela passa a pesar em quem se liga a ela
    expect(motivos.some((m) => m.id === "regra-fiscal")).toBe(true);
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
