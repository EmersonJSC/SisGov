// Lei não legislada: o país não declarou, a partida abre e o jogador propõe.
import { describe, expect, it } from "vitest";
import { montarMesa, TIPOS_DE_FATO, type Ficha } from "../motor";
import {
  criarPartida,
  jogar,
  manchete,
  mesesParaEleicao,
  placarDaLei,
  type Partida,
} from ".";

describe("lei não legislada", () => {
  it("fica fora do estado e passa a arrecadar quando proposta", () => {
    const partida = criarPartida("teste", 42, { semCongresso: true });
    expect(partida.estado.leis["imposto-poluicao"]).toBeUndefined();
    const sem = jogar(partida, 1).estado.essenciais.arrecadacao;
    const com = jogar(partida, 1, [
      { tipo: "mudar_lei", lei: "imposto-poluicao", valor: 0.2 },
    ]).estado;
    expect(com.leis["imposto-poluicao"]).toBe(0.2);
    expect(com.essenciais.arrecadacao).toBeGreaterThan(sem);
  });
});

describe("congresso", () => {
  it("lei só muda com voto: a que cai não muda nem enfileira efeito", () => {
    const partida = criarPartida("teste", 42);
    const caiu = jogar(partida, 1, [
      { tipo: "mudar_lei", lei: "areas-protegidas", valor: 0.3 },
    ]).estado;
    expect(caiu.votacoes[0].aprovada).toBe(false);
    expect(caiu.leis["areas-protegidas"]).toBe(0.1);
    expect(caiu.efeitos).toEqual(jogar(partida, 1).estado.efeitos);

    const sem = jogar(criarPartida("teste", 42, { semCongresso: true }), 1, [
      { tipo: "mudar_lei", lei: "areas-protegidas", valor: 0.3 },
    ]).estado;
    expect(sem.leis["areas-protegidas"]).toBe(0.3);
  });
});

describe("eleição", () => {
  it("conta os meses até a eleição: 48 no começo, 2 no último turno antes dela", () => {
    const partida = criarPartida("teste", 42);
    expect(mesesParaEleicao(partida)).toBe(48);
    expect(mesesParaEleicao(jogar(partida, 5))).toBe(38);
    expect(mesesParaEleicao(jogar(partida, 23))).toBe(2);
  });

  it("governo parado perde no turno 24 e a partida acaba", () => {
    const partida = criarPartida("teste", 42);
    const antes = jogar(partida, 23).estado;
    expect(antes.eleicao).toBeNull();
    expect(antes.desgaste).toBeCloseTo((2.25 * 23) / 24);
    const fim = jogar(partida, 24).estado;
    expect(fim.eleicao?.turno).toBe(24);
    expect(fim.eleicao?.venceu).toBe(false);
    expect(fim.encerrada).toBe(true);
    expect(() => jogar({ ...partida, estado: fim }, 1)).toThrow(/encerrada/);
  });

  it("governo que agrada o maior grupo vence e começa outro mandato", () => {
    const fim = jogar(criarPartida("teste", 42), 24, [
      { tipo: "mudar_lei", lei: "transferencia-renda", valor: 0.04 },
    ]).estado;
    expect(fim.eleicao?.venceu).toBe(true);
    expect(fim.encerrada).toBe(false);
    expect(fim.inicio_mandato).toBe(24);
    expect(fim.desgaste).toBeCloseTo(2.25);
  });
});

describe("opinião das potências", () => {
  it("começa a do país e anda pela bússola quando a lei muda", () => {
    const partida = criarPartida("teste", 42, { semCongresso: true });
    expect(partida.estado.opinioes["uniao-continental"]).toBe(99);
    const igual = jogar(partida, 12).estado.opinioes;
    const pena = jogar(partida, 12, [
      { tipo: "mudar_lei", lei: "pena-de-morte", valor: "crimes-graves" },
    ]).estado.opinioes;
    // Pena de morte é autoritária: quem é autoritário gosta, quem não é, não.
    expect(pena["liga-do-golfo"]).toBeGreaterThan(igual["liga-do-golfo"]);
    expect(pena["federacao-do-leste"]).toBeGreaterThan(
      igual["federacao-do-leste"],
    );
    expect(pena["uniao-continental"]).toBeLessThan(igual["uniao-continental"]);
  });
});

describe("reputação internacional", () => {
  it("é a média das opiniões pesada, no turno 0 e depois", () => {
    const media = (p: ReturnType<typeof criarPartida>) =>
      p.regras.potencias!.reduce(
        (s, x) => s + x.peso * p.estado.opinioes[x.id],
        0,
      );
    const partida = criarPartida("teste", 42, { semCongresso: true });
    const indice = partida.regras.indiceReputacao!;
    expect(partida.estado.jogabilidade[indice]).toBeCloseTo(media(partida));
    const depois = jogar(partida, 3, [
      { tipo: "mudar_lei", lei: "pena-de-morte", valor: "crimes-graves" },
    ]);
    // A fome e a carência também mexem na reputação (reação da cesta): 1 casa.
    expect(depois.estado.jogabilidade[indice]).toBeCloseTo(media(depois), 1);
    expect(depois.estado.jogabilidade[indice]).not.toBeCloseTo(
      partida.estado.jogabilidade[indice],
    );
  });
});

describe("segurança externa", () => {
  it("vale poder defensivo menos a perda de reputação, no turno 0 e depois", () => {
    const esperada = (p: ReturnType<typeof criarPartida>) => {
      const { indiceReputacao, indicePoderDefensivo } = p.regras;
      const j = p.estado.jogabilidade;
      return j[indicePoderDefensivo!] - (100 - j[indiceReputacao!]);
    };
    const partida = criarPartida("teste", 42, { semCongresso: true });
    const id = partida.regras.indiceSegurancaExterna!;
    expect(partida.estado.jogabilidade[id]).toBeCloseTo(esperada(partida));
    const depois = jogar(partida, 3, [
      { tipo: "mudar_lei", lei: "pena-de-morte", valor: "crimes-graves" },
    ]);
    expect(depois.estado.jogabilidade[id]).toBeCloseTo(esperada(depois));
    // anda para o mesmo lado da reputação (o poder defensivo não mudou)
    const rep = partida.regras.indiceReputacao!;
    const dRep =
      depois.estado.jogabilidade[rep] - partida.estado.jogabilidade[rep];
    const dSeg =
      depois.estado.jogabilidade[id] - partida.estado.jogabilidade[id];
    expect(dRep).not.toBeCloseTo(0);
    expect(Math.sign(dSeg)).toBe(Math.sign(dRep));
    expect(dSeg).toBeCloseTo(dRep);
  });
});

describe("fatos do turno", () => {
  it("votação e eleição vão para a mesa; a mesa envelhece", () => {
    const partida = criarPartida("teste", 42);
    const um = jogar(partida, 1, [
      { tipo: "mudar_lei", lei: "areas-protegidas", valor: 0.3 },
    ]).estado;
    expect(um.fatos).toContainEqual(
      expect.objectContaining({
        tipo: "lei-rejeitada",
        turno: 1,
        sobre: "areas-protegidas",
      }),
    );
    expect(jogar(partida, 2).estado.fatos ?? []).not.toContainEqual(
      expect.objectContaining({ sobre: "areas-protegidas" }),
    );
    const fim = jogar(partida, 24).estado;
    expect(fim.fatos).toContainEqual(
      expect.objectContaining({ tipo: "eleicao-perdida", turno: 24 }),
    );
  });

  it("mesma semente e mesmos pedidos, mesma mesa", () => {
    const pedidos = [
      { tipo: "mudar_lei" as const, lei: "transferencia-renda", valor: 0.04 },
    ];
    const a = jogar(criarPartida("teste", 7), 12, pedidos).estado.fatos;
    const b = jogar(criarPartida("teste", 7), 12, pedidos).estado.fatos;
    expect(a).toEqual(b);
  });
});

describe("congresso novo", () => {
  it("o placar previsto é o placar da votação, sem sorteio", () => {
    const partida = criarPartida("teste", 42);
    const previsto = placarDaLei(partida, "areas-protegidas", 0.3);
    const real = jogar(partida, 1, [
      { tipo: "mudar_lei", lei: "areas-protegidas", valor: 0.3 },
    ]).estado.votacoes[0];
    expect(previsto?.votos).toEqual(real.votos);
    expect([previsto?.sim, previsto?.nao]).toEqual([real.sim, real.nao]);
    expect(placarDaLei(partida, "areas-protegidas", 0.1)).toBeNull();
  });

  it("Brasil: Câmara num turno, Senado no seguinte, e só então a lei muda", () => {
    const partida = criarPartida("brasil-2026", 1);
    const pedido = [
      { tipo: "mudar_lei" as const, lei: "areas-protegidas", valor: 0.2 },
    ];
    const um = jogar(partida, 1, pedido).estado;
    expect(um.votacoes.map((v) => v.casa)).toEqual(["camara"]);
    expect(um.leis["areas-protegidas"]).toBe(0.3);
    const dois = jogar(partida, 2, pedido).estado;
    expect(dois.votacoes.map((v) => v.casa)).toEqual(["senado"]);
    expect(dois.leis["areas-protegidas"]).toBe(0.2);
  });

  it("classe da lei: imposto pede quórum absoluto; mandato, mais", () => {
    const { regras } = criarPartida("brasil-2026", 1);
    expect(regras.leis["imposto-renda-medio"].classe).toBe("absoluta");
    expect(regras.leis["duracao-mandato"].classe).toBe("mandato");
    expect(regras.leis["quorum-das-votacoes"].classe).toBe("constitucional");
  });
});

describe("mesa", () => {
  /** Uma lei emendada esperando carimbo, como o Congresso a deixa. */
  function comPapel() {
    const partida = criarPartida("brasil-2026", 1);
    const espera = {
      lei: "areas-protegidas",
      valor: 0.2,
      casa: "camara-volta" as const,
      desde: 1,
      ofertas: [],
    };
    const congresso = {
      ...(partida.estado.congresso as NonNullable<
        typeof partida.estado.congresso
      >),
      sancao: [espera],
    };
    return {
      ...partida,
      estado: {
        ...partida.estado,
        congresso,
        mesa: montarMesa(0, [espera], []),
      },
    };
  }

  it("papel assinado vira lei e deixa um aviso na mesa", () => {
    const partida = comPapel();
    const id = partida.estado.mesa?.[0].id as string;
    const depois = jogar(partida, 1, [
      { tipo: "carimbar", papel: id, carimbo: "assinar" },
    ]).estado;
    expect(depois.leis["areas-protegidas"]).toBe(0.2);
    expect(depois.fatos?.map((f) => f.tipo)).toContain("papel-assinado");
    expect(
      depois.mesa?.flatMap((p) =>
        p.familia === "leis" ? [[p.tipo, p.motivo]] : [],
      ),
    ).toEqual([["aviso", "lei-aprovada"]]);
  });

  it("papel vetado vai à derrubada do veto, com a observação", () => {
    const partida = comPapel();
    const id = partida.estado.mesa?.[0].id as string;
    const depois = jogar(partida, 1, [
      { tipo: "carimbar", papel: id, carimbo: "vetar", observacao: "caro" },
    ]).estado;
    expect(depois.fatos?.map((f) => f.tipo)).toContain("papel-vetado");
    expect(depois.votacoes[0]).toMatchObject({
      origem: "derrubada-do-veto",
      observacao: "caro",
    });
  });

  it("papel ignorado segue a regra do país: sanção tácita no Brasil", () => {
    const depois = jogar(comPapel(), 1).estado;
    expect(depois.fatos?.map((f) => f.tipo)).toContain("papel-ignorado");
    expect(depois.leis["areas-protegidas"]).toBe(0.2);
  });

  it("a mesa não guarda papel resolvido", () => {
    const depois = jogar(comPapel(), 2).estado;
    // a vaga do STF que o Brasil já tem no começo não é papel de lei
    expect(depois.mesa?.filter((p) => p.familia === "leis")).toEqual([]);
  });
});

describe("governo", () => {
  /** O Brasil com o ministro de uma caixa trocado por quem a gente escolhe. */
  function comMinistro(caixa: string, escolher: (livres: Ficha[]) => Ficha) {
    const partida = criarPartida("brasil-2026", 1, { semCongresso: true });
    const governo = partida.estado.governo as NonNullable<
      typeof partida.estado.governo
    >;
    const ocupados = new Set(governo.caixas.map((c) => c.ministro));
    const livres = (partida.regras.governo?.pessoas ?? []).filter(
      (p) => !ocupados.has(p.id),
    );
    const ministro = escolher(livres);
    return {
      ministro,
      partida: {
        ...partida,
        estado: {
          ...partida.estado,
          governo: {
            ...governo,
            caixas: governo.caixas.map((c) =>
              c.id === caixa ? { ...c, ministro: ministro.id } : c,
            ),
          },
        },
      },
    };
  }
  const maisCompetente = (l: Ficha[]) =>
    [...l].sort((a, b) => b.competencia - a.competencia)[0];
  const menosCompetente = (l: Ficha[]) =>
    [...l].sort((a, b) => a.competencia - b.competencia)[0];
  const efeitosDe = (p: Partida) =>
    jogar(p, 1, [
      { tipo: "mudar_lei", lei: "areas-protegidas", valor: 0.9 },
    ]).estado.efeitos.filter((e) => e.lei === "areas-protegidas");

  it("ministro competente faz a lei chegar antes e mais forte", () => {
    const bom = efeitosDe(comMinistro("meio-ambiente", maisCompetente).partida);
    const ruim = efeitosDe(
      comMinistro("meio-ambiente", menosCompetente).partida,
    );
    expect(bom.length).toBeGreaterThan(0);
    expect(bom.length).toBe(ruim.length);
    const atraso = (l: typeof bom) => Math.max(...l.map((e) => e.atraso));
    const forca = (l: typeof bom) =>
      l.reduce((s, e) => s + Math.abs(e.para), 0);
    expect(atraso(bom)).toBeLessThan(atraso(ruim));
    expect(forca(bom)).toBeGreaterThan(forca(ruim));
  });

  it("sem decisão do governo, a corrupção dos órgãos fica onde estava", () => {
    const partida = criarPartida("brasil-2026", 1, { semCongresso: true });
    const antes = partida.estado.governo?.orgaos ?? {};
    const depois = jogar(partida, 12).estado.governo?.orgaos ?? {};
    for (const [esfera, o] of Object.entries(antes))
      expect(depois[esfera].corrupcao).toBeCloseTo(o.corrupcao, 6);
  });

  it("nomear troca o ministro e vira fato", () => {
    const partida = criarPartida("brasil-2026", 1, { semCongresso: true });
    const livre = (partida.regras.governo?.pessoas ?? []).find(
      (p) => !partida.estado.governo?.caixas.some((c) => c.ministro === p.id),
    ) as Ficha;
    const depois = jogar(partida, 1, [
      { tipo: "nomear", caixa: "saude", ministro: livre.id },
    ]).estado;
    expect(depois.governo?.caixas.find((c) => c.id === "saude")?.ministro).toBe(
      livre.id,
    );
    expect(depois.fatos?.map((f) => f.tipo)).toContain("ministro-nomeado");
  });

  it("trocar ministro magoa no turno seguinte os grupos parecidos com quem saiu", () => {
    const partida = criarPartida("brasil-2026", 1, { semCongresso: true });
    const livre = (partida.regras.governo?.pessoas ?? []).find(
      (p) => !partida.estado.governo?.caixas.some((c) => c.ministro === p.id),
    ) as Ficha;
    const com = jogar(
      jogar(partida, 1, [
        { tipo: "nomear", caixa: "saude", ministro: livre.id },
      ]),
      1,
    ).estado.grupos;
    const sem = jogar(jogar(partida, 1), 1).estado.grupos;
    const quedas = Object.keys(sem).map(
      (id) => sem[id].satisfacao - com[id].satisfacao,
    );
    expect(Math.max(...quedas)).toBeGreaterThan(2);
  });

  it("moeda Ministério: o partido recebe a caixa e vota mais com o governo", () => {
    const partida = criarPartida("brasil-2026", 1);
    const pedidos = [
      { tipo: "mudar_lei" as const, lei: "areas-protegidas", valor: 0.2 },
      {
        tipo: "oferecer" as const,
        lei: "areas-protegidas",
        moeda: "ministerio" as const,
        partido: "pl",
        caixa: "defesa",
      },
    ];
    const depois = jogar(partida, 1, pedidos).estado;
    const ministro = depois.governo?.caixas.find(
      (c) => c.id === "defesa",
    )?.ministro;
    expect(
      partida.regras.governo?.pessoas.find((p) => p.id === ministro)?.origem,
    ).toBe("pl");
    expect(depois.congresso?.termometro.pl).toBeGreaterThan(
      partida.estado.congresso?.termometro.pl ?? 100,
    );
    expect(depois.fatos?.map((f) => f.tipo)).toContain("ministerio-oferecido");
  });

  it("país sem governo.json joga como antes", () => {
    const partida = criarPartida("teste", 42);
    expect(partida.regras.governo).toBeUndefined();
    expect(partida.estado.governo).toBeUndefined();
    expect(jogar(partida, 3).estado.turno).toBe(3);
  });
});

describe("programas", () => {
  /** O Brasil sem Congresso, com `quantas` leis do programa levadas ao extremo. */
  function aprovando(id: string, quantas: number) {
    const partida = criarPartida("brasil-2026", 1, { semCongresso: true });
    const programa = partida.regras.programas?.programas.find(
      (p) => p.id === id,
    ) as NonNullable<Partida["regras"]["programas"]>["programas"][number];
    const pedidos = programa.leis
      .map((p) => {
        const lei = partida.regras.leis[p.lei];
        const valor =
          lei.forma === "continua"
            ? lei.faixa.max
            : (lei.opcoes.at(-1)?.id as string);
        return { tipo: "mudar_lei" as const, lei: p.lei, valor };
      })
      // o que o Brasil já tem no extremo não anda
      .filter((p) => partida.estado.leis[p.lei] !== p.valor)
      .slice(0, quantas);
    return jogar(partida, 1, pedidos).estado;
  }

  it("o Brasil já começa com os programas que declara, com o nome dele", () => {
    const vidas = criarPartida("brasil-2026", 1).estado.programas?.vidas ?? {};
    expect(Object.keys(vidas).sort()).toEqual([
      "remedio-barato",
      "renda-da-familia",
      "saude-da-familia",
    ]);
    expect(vidas["renda-da-familia"] as unknown).toMatchObject({
      situacao: "formado",
      nome: "Bolsa Família",
    });
  });

  it("sem nome do país, o programa recebe um nome gerado", () => {
    const vida = aprovando("escola-o-dia-todo", 3).programas?.vidas[
      "escola-o-dia-todo"
    ];
    expect(vida?.situacao).toBe("formado");
    expect(vida?.nome).toMatch(/\S/);
    expect(vida?.nome).not.toBe("escola-o-dia-todo");
  });

  it("leis a menos do mínimo não formam nada", () => {
    expect(
      aprovando("escola-o-dia-todo", 2).programas?.vidas,
    ).not.toHaveProperty("escola-o-dia-todo");
  });

  it("sem mexer nas leis, nada se forma nem se desfaz sozinho", () => {
    const partida = criarPartida("brasil-2026", 1, { semCongresso: true });
    const antes = partida.estado.programas?.vidas;
    expect(jogar(partida, 12).estado.programas?.vidas).toEqual(antes);
  });
});

describe("jornal", () => {
  it("o Brasil tem as mídias dele e começa com a credibilidade declarada", () => {
    const partida = criarPartida("brasil-2026", 1);
    const midias = partida.regras.midia?.midias ?? [];
    expect(midias.length).toBe(9);
    expect(partida.estado.midia?.credibilidade).toEqual(
      Object.fromEntries(midias.map((m) => [m.id, m.credibilidade])),
    );
  });

  it("todo tipo de fato tem molde de manchete", () => {
    const nomes = {
      lei: (id: string) => id,
      quem: {},
      caixa: {},
      area: {},
      tribunal: {},
      programa: (id: string) => id,
      meta: (id: string) => id,
    };
    for (const tipo of TIPOS_DE_FATO)
      expect(
        manchete({ tipo, turno: 1, tamanho: "medio", restam: 1 }, nomes),
        tipo,
      ).not.toBe(tipo);
  });

  it("a manchete troca os ids pelos nomes", () => {
    const nomes = {
      lei: () => "Lei X",
      quem: { p1: "Partido Um", p2: "Partido Dois" },
      caixa: {},
      area: {},
      tribunal: {},
      programa: (id: string) => id,
      meta: (id: string) => id,
    };
    const f = {
      tipo: "lei-rejeitada" as const,
      turno: 1,
      tamanho: "pequeno" as const,
      restam: 1,
      sobre: "x",
      quem: ["p1", "p2"],
    };
    expect(manchete(f, nomes)).toBe(
      "Congresso derruba Lei X com votos de Partido Um, Partido Dois",
    );
    expect(manchete({ ...f, quem: undefined }, nomes)).toBe(
      "Congresso derruba Lei X",
    );
  });

  it("depois do turno, o jornal traz o que aconteceu, o maior primeiro", () => {
    const partida = criarPartida("brasil-2026", 1);
    const livre = (partida.regras.governo?.pessoas ?? []).find(
      (p) => !partida.estado.governo?.caixas.some((c) => c.ministro === p.id),
    ) as Ficha;
    const caixa = partida.estado.governo?.caixas[0].id as string;
    const jornal =
      jogar(partida, 1, [{ tipo: "nomear", caixa, ministro: livre.id }]).estado
        .midia?.jornal ?? [];
    expect(jornal.length).toBeGreaterThan(0);
    expect(jornal.every((f) => f.turno === 1)).toBe(true);
  });
});

describe("eleição em dois turnos e promessa", () => {
  /** Um índice de jogabilidade que o país de teste declara. */
  const indice = (p: Partida) =>
    Object.keys(p.estado.jogabilidade).find(
      (id) => p.regras.dominios[id],
    ) as string;
  const prometendo = (p: Partida, meta: number) => [
    {
      tipo: "prometer" as const,
      alvo: { tipo: "indice" as const, id: indice(p) },
      meta,
    },
  ];

  it("o primeiro turno vem um turno antes do fim, sem encerrar nada", () => {
    const partida = criarPartida("teste", 42);
    const antes = jogar(partida, 22).estado;
    expect(antes.campanha?.primeiro).toBeUndefined();
    const primeiro = jogar(partida, 23).estado;
    expect(primeiro.campanha?.primeiro?.rodada.votos).toBeDefined();
    expect(primeiro.eleicao).toBeNull();
    expect(primeiro.encerrada).toBe(false);
  });

  it("sem maioria no primeiro turno, há segundo turno", () => {
    const partida = criarPartida("teste", 42);
    expect(jogar(partida, 23).estado.fatos?.map((f) => f.tipo)).toContain(
      "segundo-turno",
    );
    const fim = jogar(partida, 24).estado;
    expect(fim.eleicao?.rodadas).toBe(2);
    expect(fim.eleicao?.chapas).toHaveLength(2);
  });

  it("governo muito popular vence no primeiro turno", () => {
    const fim = jogar(criarPartida("teste", 42), 24, [
      { tipo: "mudar_lei", lei: "transferencia-renda", valor: 0.04 },
    ]).estado;
    expect(fim.eleicao?.rodadas).toBe(1);
    expect(fim.eleicao?.venceu).toBe(true);
  });

  it("promessa quebrada vira fato e custa voto e desgaste", () => {
    const partida = criarPartida("teste", 42);
    const dele = jogar(partida, 1, prometendo(partida, 99)).estado;
    expect(dele.campanha?.promessa?.tamanho).toBeGreaterThan(0);
    const com = jogar({ ...partida, estado: dele }, 22).estado;
    const sem = jogar(partida, 23).estado;
    expect(com.fatos?.map((f) => f.tipo)).toContain("meta-quebrada");
    expect(com.desgaste).toBeGreaterThan(sem.desgaste);
    expect(com.campanha?.primeiro?.rodada.votos.trabalhista).toBeLessThan(
      sem.campanha?.primeiro?.rodada.votos.trabalhista as number,
    );
  });

  it("trocar a promessa no meio do mandato conta como quebrar a antiga", () => {
    const partida = criarPartida("teste", 42);
    const um = jogar(partida, 1, prometendo(partida, 99)).estado;
    const dois = jogar(
      { ...partida, estado: um },
      1,
      prometendo(partida, 90),
    ).estado;
    expect(dois.campanha?.quebradas).toHaveLength(1);
    const igual = jogar(
      { ...partida, estado: um },
      1,
      prometendo(partida, 99),
    ).estado;
    expect(igual.campanha?.quebradas).toHaveLength(0);
  });

  it("promessa que não pode ser feita é recusada", () => {
    const partida = criarPartida("teste", 42);
    expect(() => jogar(partida, 1, prometendo(partida, 1e9))).toThrow(
      /meta inválida/,
    );
    expect(() =>
      jogar(partida, 1, [
        { tipo: "prometer", alvo: { tipo: "indice", id: "fantasma" }, meta: 5 },
      ]),
    ).toThrow(/não existe/);
    const brasil = criarPartida("brasil-2026", 1, { semCongresso: true });
    expect(() =>
      jogar(brasil, 1, [
        {
          tipo: "prometer",
          alvo: { tipo: "programa", id: "saude-da-familia" },
        },
      ]),
    ).toThrow(/já está formado/);
  });

  it("promessa de programa: cumprida quando ele se forma", () => {
    const brasil = criarPartida("brasil-2026", 1, { semCongresso: true });
    const estado = jogar(brasil, 1, [
      { tipo: "prometer", alvo: { tipo: "programa", id: "escola-o-dia-todo" } },
    ]).estado;
    expect(estado.campanha?.promessa?.alvo.id).toBe("escola-o-dia-todo");
  });
});
