import { describe, expect, it } from "vitest";
import type { TipoGrupo } from "../grupos";
import type { Lei } from "../leis";
import type { Fato } from "../fatos";
import {
  esfriarEEsquentar,
  iniciarCongresso,
  motivoCongressoInvalido,
  placarPrevisto,
  tramitar,
  votar as votarCasa,
  type Cenario,
  type Congresso,
  type EntradaTramitar,
  type Moeda,
  type PedidoCongresso,
} from ".";

const lei: Lei = {
  versao: 1,
  id: "l",
  camada: "jogabilidade",
  canal: "espera",
  espera: "teste",
  forma: "continua",
  unidade: "fracao",
  faixa: { min: 0, max: 0.3 },
  passo: 0.01,
  // subir a lei vai para a direita: perto de a, longe de b
  bussola: { min: { economico: -1 }, max: { economico: 1 } },
  efeitos: [],
};

const opcoes: Lei = {
  versao: 1,
  id: "o",
  camada: "jogabilidade",
  canal: "espera",
  espera: "teste",
  forma: "opcoes",
  opcoes: [
    { id: "x", bussola: { economico: 1 }, efeitos: [] },
    { id: "y", bussola: { economico: -1 }, efeitos: [] },
  ],
};

// gov 40, aliado (neutro) 15, ped (defende b) 30, opo (neutro) 15
const congresso: Congresso = {
  partidos: [
    { id: "gov", cadeiras: 40, defende: { a: 1 } },
    { id: "aliado", cadeiras: 15, defende: { c: 1 } },
    { id: "ped", cadeiras: 30, defende: { b: 1 } },
    { id: "opo", cadeiras: 15, defende: { c: 1 } },
  ],
  governo: "gov",
  maioria: 0.5,
};
const base = ["gov", "aliado"];

// a à direita, b à esquerda, c não liga para a economia
const tipo = (id: string, economico: number, peso: number): TipoGrupo => ({
  id,
  membros: {},
  cobra: [],
  bussola: { economico },
  peso: { economico: peso },
});
const tipos = [tipo("a", 1, 1), tipo("b", -1, 1), tipo("c", 0, 0)];

const fixo = (
  congresso: Congresso,
  coligacao: string[],
  extra: Partial<Cenario> = {},
): Cenario => ({
  congresso,
  tipos,
  coligacao,
  grupos: {},
  leis: {},
  termometro: Object.fromEntries(
    congresso.partidos.map((p) => [p.id, coligacao.includes(p.id) ? 60 : 40]),
  ),
  preco: {},
  paciencia: { camara: 70, senado: 70 },
  deficit: 0,
  fatos: [],
  turnosParaEleicao: null,
  quorumDaLei: null,
  ministros: {},
  ...extra,
});
const votar = (
  c: Congresso,
  coligacao: string[],
  t: TipoGrupo[],
  l: Lei,
  de: number | string | undefined,
  para: number | string,
) => votarCasa({ ...fixo(c, coligacao), tipos: t }, l, de, para);

describe("voto", () => {
  it("base vota sim, oposição neutra vota não, grupo contra vota não", () => {
    const v = votar(congresso, base, tipos, lei, 0.1, 0.15);
    expect(v.votos).toEqual({
      gov: "sim",
      aliado: "sim",
      ped: "nao",
      opo: "nao",
    });
    expect(v.aprovada).toBe(true);
    // descer a lei: ped (b quer menos) passa a votar sim
    expect(votar(congresso, base, tipos, lei, 0.1, 0.05).votos.ped).toBe("sim");
  });

  it("sem maioria, cai", () => {
    expect(votar(congresso, ["gov"], tipos, lei, 0.1, 0.15).aprovada).toBe(
      false,
    );
  });

  it("lei de opções usa a posição de cada opção", () => {
    expect(votar(congresso, base, tipos, opcoes, "x", "y").votos.ped).toBe(
      "sim",
    );
    expect(votar(congresso, base, tipos, opcoes, "y", "x").votos.ped).toBe(
      "nao",
    );
  });

  it("a conta pesa mais com déficit e derruba a lei: exorbitante", () => {
    const cara: Lei = { ...lei, conta: "gasto", faixa: { min: 0, max: 0.3 } };
    const folgado = votarCasa(fixo(congresso, base), cara, 0.1, 0.15);
    expect(folgado.aprovada).toBe(true);
    expect(folgado.exorbitante).toBe(false);
    const apertado = votarCasa(
      fixo(congresso, base, { deficit: 10 }),
      cara,
      0.01,
      0.3,
    );
    expect(apertado.aprovada).toBe(false);
    expect(apertado.exorbitante).toBe(true);
  });

  it("não há sorteio: o mesmo cenário dá o mesmo placar", () => {
    const c = fixo(congresso, base);
    expect(votarCasa(c, lei, 0.1, 0.15)).toEqual(votarCasa(c, lei, 0.1, 0.15));
  });

  it("fiéis seguem o partido; livres votam pelos grupos", () => {
    const solto: Congresso = {
      ...congresso,
      partidos: congresso.partidos.map((p) =>
        p.id === "aliado" ? { ...p, coesao: 0.5, defende: { b: 1 } } : p,
      ),
    };
    const v = votarCasa(
      fixo(solto, base, {
        termometro: { gov: 100, aliado: 90, ped: 40, opo: 40 },
      }),
      lei,
      0.1,
      0.15,
    );
    expect(v.votos.aliado).toBe("sim");
    expect(v.livres?.aliado).toBe("nao");
    expect(v.sim).toBe(40 + 8);
  });

  it("quórum: classe constitucional pede mais que a comum", () => {
    const c = fixo(congresso, base);
    const comum = votarCasa(c, lei, 0.1, 0.15);
    const constitucional = votarCasa(
      c,
      { ...lei, classe: "constitucional" },
      0.1,
      0.15,
    );
    expect(comum.quorum).toBe(0.5);
    expect(constitucional.quorum).toBeCloseTo(0.6);
    expect(constitucional.aprovada).toBe(false);
    const mudado = fixo(congresso, base, { quorumDaLei: 0.55 });
    expect(
      votarCasa(mudado, { ...lei, classe: "absoluta" }, 0.1, 0.15).quorum,
    ).toBe(0.55);
  });

  it("partido perto do zero aparece como indeciso", () => {
    // a oposição com termômetro alto fica perto do zero
    const c = fixo(congresso, base, {
      termometro: { gov: 100, aliado: 60, ped: 40, opo: 85 },
    });
    const v = votarCasa(c, lei, 0.1, 0.1);
    expect(v.indecisos).toBe(15);
  });

  it("valida o congresso do país", () => {
    expect(motivoCongressoInvalido(congresso, base, ["a", "b", "c"])).toBe(
      null,
    );
    expect(motivoCongressoInvalido(congresso, base, ["a", "b"])).toMatch(
      /grupo "c"/,
    );
    expect(
      motivoCongressoInvalido(congresso, ["aliado"], ["a", "b", "c"]),
    ).toMatch(/incluir o governo/);
  });
});

// ---- tramitação: Câmara, Senado, sanção, moedas, decreto ----

const comSenado: Congresso = {
  ...congresso,
  senado: { gov: 5, aliado: 3, ped: 3, opo: 1 },
  leis: { decreto: "d", cargos: "cg", emendas: "em" },
};
// Câmara decidida pelo governo; no Senado a base só passa a lei se ela custar menos.
const emendavel: Congresso = {
  ...comSenado,
  partidos: [
    { id: "gov", cadeiras: 60, defende: { a: 1 } },
    { id: "aliado", cadeiras: 10, defende: { c: 1 } },
    { id: "ped", cadeiras: 20, defende: { b: 1 } },
    { id: "opo", cadeiras: 10, defende: { c: 1 } },
  ],
  senado: { gov: 3, aliado: 4, ped: 0, opo: 3 },
};
const decreto: Lei = {
  versao: 1,
  id: "d",
  camada: "jogabilidade",
  canal: "espera",
  espera: "teste",
  forma: "opcoes",
  opcoes: ["sem", "verba", "amplo", "tudo"].map((id) => ({
    id,
    bussola: {},
    efeitos: [],
  })),
};
const cargos: Lei = {
  ...lei,
  id: "cg",
  faixa: { min: 0, max: 0.05 },
  passo: 0.01,
};
const emendas: Lei = { ...opcoes, id: "em" };
const gasta: Lei = { ...lei, id: "g", conta: "gasto" };
const leis = {
  l: lei,
  o: opcoes,
  d: decreto,
  cg: cargos,
  em: emendas,
  g: gasta,
};

function mesa(
  pedidos: PedidoCongresso[],
  extra: Partial<EntradaTramitar> = {},
): EntradaTramitar {
  const c = extra.congresso ?? comSenado;
  return {
    congresso: c,
    tipos,
    leis,
    valores: { l: 0.1, o: "x", d: "sem", cg: 0.03, em: "x", g: 0.1 },
    turno: 1,
    estado: iniciarCongresso(c, base),
    coligacao: base,
    grupos: {},
    deficit: 0,
    fatos: [],
    turnosParaEleicao: null,
    pedidos,
    ministros: {},
    candidato: () => false,
    ...extra,
  };
}
const pedir = (valor: number): PedidoCongresso => ({
  tipo: "mudar_lei",
  lei: "l",
  valor,
});
/** Roda turnos seguidos, passando o estado do Congresso adiante. */
function rodar(
  turnos: number,
  primeiro: PedidoCongresso[],
  extra: Partial<EntradaTramitar> = {},
) {
  let entrada = mesa(primeiro, extra);
  const todas: ReturnType<typeof tramitar>[] = [];
  for (let t = 0; t < turnos; t++) {
    const saida = tramitar(entrada);
    todas.push(saida);
    const valores = { ...entrada.valores };
    for (const v of saida.votacoes) if (v.muda_lei) valores[v.lei] = v.valor;
    entrada = {
      ...entrada,
      turno: entrada.turno + 1,
      valores,
      estado: saida.estado,
      coligacao: saida.coligacao,
      pedidos: [],
      fatos: [...entrada.fatos, ...saida.fatos],
    };
  }
  return todas;
}

describe("duas casas", () => {
  it("Câmara no turno 1, Senado no turno 2; só então a lei muda", () => {
    const [t1, t2] = rodar(2, [pedir(0.15)]);
    expect(t1.votacoes.map((v) => [v.casa, v.aprovada, v.muda_lei])).toEqual([
      ["camara", true, false],
    ]);
    expect(t2.votacoes.map((v) => [v.casa, v.aprovada, v.muda_lei])).toEqual([
      ["senado", true, true],
    ]);
  });

  it("país de uma casa vota uma vez e a lei muda no turno 1", () => {
    const [t1] = rodar(1, [pedir(0.15)], { congresso: congresso });
    expect(t1.votacoes.map((v) => [v.casa, v.muda_lei])).toEqual([
      ["camara", true],
    ]);
  });

  it("o placar previsto é o placar real", () => {
    const previsto = placarPrevisto(mesa([]), "l", 0.15);
    const [t1] = rodar(1, [pedir(0.15)]);
    expect(previsto?.sim).toBe(t1.votacoes[0].sim);
    expect(previsto?.votos).toEqual(t1.votacoes[0].votos);
  });

  it("Senado que muda devolve à Câmara; depois vai à mesa e é sancionada", () => {
    const pedido: PedidoCongresso = {
      tipo: "mudar_lei",
      lei: "g",
      valor: 0.22,
    };
    const turnos = rodar(4, [pedido], { congresso: emendavel });
    expect(
      turnos.map((t) =>
        t.votacoes.map((v) => [v.casa, v.origem, v.aprovada, v.muda_lei]),
      ),
    ).toEqual([
      [["camara", "pedido", true, false]],
      [
        ["senado", "pedido", false, false],
        ["senado", "emenda", true, false],
      ],
      [["camara", "volta", true, false]],
      [[undefined, "emenda", true, true]],
    ]);
    expect(turnos[1].votacoes[1].valor).toBeCloseTo(0.16);
    expect(turnos[1].fatos.map((f) => f.tipo)).toContain("emenda");
    expect(turnos[2].estado.sancao).toHaveLength(1);
  });

  it("lei derrotada fica 2 turnos sem voltar", () => {
    const [t1] = rodar(1, [pedir(0.3)], {
      congresso: { ...congresso, maioria: 0.9 },
    });
    expect(t1.estado.barradas).toEqual([{ lei: "l", ate: 3 }]);
    expect(() =>
      tramitar(
        mesa([pedir(0.3)], {
          congresso: { ...congresso, maioria: 0.9 },
          estado: t1.estado,
          turno: 2,
        }),
      ),
    ).toThrow(/só volta no turno 3/);
  });
});

describe("carga e paciência", () => {
  it("passou da carga, a lei espera na fila", () => {
    const leve: Congresso = { ...congresso, carga: 1 };
    const [t1, t2] = rodar(
      2,
      [pedir(0.15), { tipo: "mudar_lei", lei: "o", valor: "y" }],
      { congresso: leve },
    );
    expect(t1.votacoes).toHaveLength(1);
    expect(t1.estado.pauta).toHaveLength(1);
    expect(t2.votacoes.map((v) => v.lei)).toEqual(["o"]);
  });

  it("lei demais cansa a casa; turno sem lei nova descansa", () => {
    const leis3: PedidoCongresso[] = [
      pedir(0.15),
      { tipo: "mudar_lei", lei: "o", valor: "y" },
      { tipo: "mudar_lei", lei: "g", valor: 0.15 },
    ];
    const cansou = rodar(1, leis3, {
      congresso: { ...congresso, carga: 5 },
    })[0];
    expect(cansou.estado.paciencia.camara).toBe(70 + 3 - 2);
    const quieto = rodar(1, [])[0];
    expect(quieto.estado.paciencia.camara).toBe(76);
  });

  it("paciência baixa derruba votos da lei do governo", () => {
    const estado = iniciarCongresso(congresso, base);
    estado.paciencia = { camara: 10, senado: 10 };
    const v = tramitar(mesa([pedir(0.15)], { congresso, estado })).votacoes[0];
    const normal = tramitar(mesa([pedir(0.15)], { congresso })).votacoes[0];
    expect(v.sim).toBeLessThanOrEqual(normal.sim);
    expect(v.notas?.aliado).toBeLessThan(normal.notas?.aliado ?? 0);
  });
});

const comLeis: Congresso = { ...congresso, leis: comSenado.leis };

describe("moedas", () => {
  const oferta = (moeda: Moeda, partido = "ped"): PedidoCongresso => ({
    tipo: "oferecer",
    lei: "l",
    moeda,
    partido,
  });

  it("cargos compram o voto do partido, gastam a reserva e encarecem o próximo", () => {
    const [t1] = rodar(1, [pedir(0.15), oferta("cargos")], {
      congresso: comLeis,
    });
    const sem = rodar(1, [pedir(0.15)], { congresso: comLeis })[0];
    expect(t1.votacoes[0].notas?.ped).toBeGreaterThan(
      sem.votacoes[0].notas?.ped ?? 0,
    );
    expect(t1.estado.cargosUsados).toBe(1);
    expect(t1.estado.preco.ped).toBeCloseTo(0.15 - 0.05);
    expect(t1.estado.termometro.ped).toBeGreaterThan(sem.estado.termometro.ped);
  });

  it("sem reserva de cargos ou emendas a moeda não existe", () => {
    const sem = { ...congresso, leis: { cargos: "cg", emendas: "em" } };
    // sem a lei de emendas, nenhuma emenda (nada = não legislada)
    const valores = { l: 0.1, o: "x", d: "sem", cg: 0, g: 0.1 };
    expect(() =>
      tramitar(
        mesa([pedir(0.15), oferta("cargos")], { congresso: sem, valores }),
      ),
    ).toThrow(/reserva de cargos/);
    expect(() =>
      tramitar(
        mesa([pedir(0.15), oferta("emenda")], { congresso: sem, valores }),
      ),
    ).toThrow(/reserva de emendas/);
  });

  it("ceder na régua aproxima o valor pedido do atual", () => {
    const [t1] = rodar(
      1,
      [pedir(0.25), { tipo: "oferecer", lei: "l", moeda: "ceder" }],
      { congresso: comLeis },
    );
    expect(t1.votacoes[0].valor).toBeLessThan(0.25);
    expect(t1.votacoes[0].valor).toBeGreaterThan(0.1);
  });

  it("promessa cumprida no prazo anima o partido; quebrada, cai o termômetro", () => {
    const promessa: PedidoCongresso = {
      tipo: "oferecer",
      lei: "l",
      moeda: "promessa",
      partido: "ped",
      promessa: { lei: "o", valor: "y" },
    };
    const quebrada = rodar(5, [pedir(0.15), promessa], { congresso: comLeis });
    expect(quebrada[4].fatos.map((f) => f.tipo)).toContain(
      "promessa-descumprida",
    );
    const cumprida = rodar(5, [pedir(0.15), promessa], {
      congresso,
      valores: { l: 0.1, o: "y", d: "sem", cg: 0.03, em: "x", g: 0.1 },
    });
    expect(cumprida[4].fatos.map((f) => f.tipo)).toContain("promessa-cumprida");
  });

  it("ministério pede a caixa e alguém livre do partido", () => {
    const ministerio: PedidoCongresso = {
      tipo: "oferecer",
      lei: "l",
      moeda: "ministerio",
      partido: "ped",
    };
    const livre = { congresso: comLeis, candidato: () => true };
    expect(() => tramitar(mesa([pedir(0.15), ministerio], livre))).toThrow(
      /pede a caixa/,
    );
    const comCaixa = { ...ministerio, caixa: "fazenda" };
    expect(() =>
      tramitar(mesa([pedir(0.15), comCaixa], { congresso: comLeis })),
    ).toThrow(/não tem quem nomear/);
    const r = tramitar(mesa([pedir(0.15), comCaixa], livre));
    expect(r.fatos).toContainEqual(
      expect.objectContaining({
        tipo: "ministerio-oferecido",
        sobre: "fazenda",
        quem: ["ped"],
      }),
    );
    expect(r.estado.termometro.ped).toBeGreaterThan(40);
    expect(r.estado.preco.ped).toBeGreaterThan(0);
  });

  it("quem tem ministro vota mais com o governo; quem perde o ministério fica ressentido", () => {
    const sem = votarCasa(fixo(congresso, base), lei, 0.1, 0.15);
    const com = votarCasa(
      fixo(congresso, base, { ministros: { ped: 1 } }),
      lei,
      0.1,
      0.15,
    );
    expect(com.notas?.ped).toBeGreaterThan(sem.notas?.ped ?? 0);
    const demitido: Fato = {
      tipo: "ministro-demitido",
      turno: 1,
      tamanho: "medio",
      quem: ["ped"],
      restam: 2,
    };
    const r = tramitar(mesa([], { turno: 2, fatos: [demitido] }));
    expect(r.estado.termometro.ped).toBe(40 - 8);
  });
});

describe("decreto", () => {
  const decretar: PedidoCongresso = { tipo: "decretar", lei: "g", valor: 0.2 };
  const comDecreto = (degrau: string): Partial<EntradaTramitar> => ({
    congresso,
    valores: { l: 0.1, o: "x", d: degrau, cg: 0.03, em: "x", g: 0.1 },
  });
  const decretavel = { ...congresso, leis: { decreto: "d" } };

  it("sem o poder de decreto, o pedido é recusado", () => {
    expect(() => tramitar(mesa([decretar], comDecreto("sem")))).toThrow(
      /Poder de decreto/,
    );
  });

  it("vale já, sem voto, e cansa a paciência", () => {
    const [t1] = rodar(1, [decretar], {
      ...comDecreto("verba"),
      congresso: decretavel,
    });
    expect(t1.votacoes[0]).toMatchObject({
      origem: "decreto",
      muda_lei: true,
      valor: 0.2,
    });
    expect(t1.estado.paciencia.camara).toBeLessThan(70);
    expect(t1.estado.decretos).toHaveLength(1);
  });

  it("verba e preço não alcança o que é de classe comum fora do gasto", () => {
    const fora: PedidoCongresso = { tipo: "decretar", lei: "l", valor: 0.2 };
    expect(() =>
      tramitar(mesa([fora], { ...comDecreto("verba"), congresso: decretavel })),
    ).toThrow(/não alcança/);
  });

  it("em 2 turnos o Congresso derruba e a lei volta ao que era", () => {
    const hostil: Congresso = { ...decretavel, maioria: 0.95 };
    const turnos = rodar(3, [decretar], {
      ...comDecreto("verba"),
      congresso: hostil,
    });
    const volta = turnos[2].votacoes.find(
      (v) => v.origem === "decreto-derrubado",
    );
    expect(volta).toMatchObject({ lei: "g", valor: 0.1, muda_lei: true });
    expect(turnos[2].fatos.map((f) => f.tipo)).toContain("decreto-derrubado");
  });

  it("confirmado, o decreto fica", () => {
    const barato: PedidoCongresso = { tipo: "decretar", lei: "g", valor: 0.11 };
    const turnos = rodar(3, [barato], {
      ...comDecreto("verba"),
      congresso: decretavel,
    });
    expect(
      turnos[2].votacoes.some((v) => v.origem === "decreto-derrubado"),
    ).toBe(false);
    expect(turnos[2].estado.decretos).toHaveLength(0);
  });
});

describe("veto", () => {
  const pedido: PedidoCongresso = { tipo: "mudar_lei", lei: "g", valor: 0.22 };
  /** Roda até a lei emendada chegar à mesa e devolve a entrada do turno seguinte. */
  function ateAMesa(vetar: boolean) {
    let entrada = mesa([pedido], { congresso: emendavel });
    let saida = tramitar(entrada);
    while (saida.estado.sancao.length === 0) {
      entrada = {
        ...entrada,
        turno: entrada.turno + 1,
        estado: saida.estado,
        pedidos: [],
      };
      saida = tramitar(entrada);
    }
    return {
      ...entrada,
      turno: entrada.turno + 1,
      estado: saida.estado,
      pedidos: vetar
        ? [{ tipo: "vetar" as const, lei: "g", observacao: "caro" }]
        : [],
    };
  }

  it("sem veto, a lei emendada é sancionada no turno seguinte", () => {
    const r = tramitar(ateAMesa(false));
    expect(r.votacoes).toHaveLength(1);
    expect(r.votacoes[0]).toMatchObject({
      lei: "g",
      muda_lei: true,
      valor: 0.16,
    });
    expect(r.estado.sancao).toHaveLength(0);
  });

  it("o veto cansa as casas e o quórum absoluto pode derrubá-lo", () => {
    const entrada = ateAMesa(true);
    const sem = tramitar({ ...entrada, pedidos: [] });
    const r = tramitar(entrada);
    expect(r.votacoes[0]).toMatchObject({
      origem: "derrubada-do-veto",
      observacao: "caro",
      classe: "absoluta",
    });
    expect(r.estado.paciencia.camara).toBe(sem.estado.paciencia.camara - 8);
  });

  it("assinar explícito sanciona; ignorar vale o que o país declara", () => {
    const entrada = ateAMesa(false);
    const assinada = tramitar({
      ...entrada,
      pedidos: [{ tipo: "assinar", lei: "g" }],
    });
    expect(assinada.fatos.map((f) => f.tipo)).toContain("papel-assinado");
    expect(assinada.votacoes[0]).toMatchObject({ muda_lei: true, valor: 0.16 });

    const tacita = tramitar(entrada);
    expect(tacita.fatos.map((f) => f.tipo)).toContain("papel-ignorado");
    expect(tacita.votacoes[0].muda_lei).toBe(true);

    const veto = tramitar({
      ...entrada,
      congresso: { ...emendavel, ignorar: "veto" },
    });
    expect(veto.fatos.map((f) => f.tipo)).toEqual(
      expect.arrayContaining(["papel-ignorado"]),
    );
    expect(veto.votacoes[0].origem).toBe("derrubada-do-veto");
  });

  it("veto que se mantém deixa a lei como estava", () => {
    const entrada = ateAMesa(true);
    const cadeiras: Record<string, number> = {
      gov: 30,
      aliado: 10,
      ped: 30,
      opo: 30,
    };
    const hostil = {
      ...emendavel,
      partidos: emendavel.partidos.map((p) => ({
        ...p,
        cadeiras: cadeiras[p.id],
      })),
    };
    const r = tramitar({ ...entrada, congresso: hostil });
    expect(r.votacoes[0].muda_lei).toBe(false);
    expect(r.fatos.map((f) => f.tipo)).toContain("papel-vetado");
  });
});

describe("relação com os partidos", () => {
  const grupos = { a: 60, b: 60, c: 10 };
  const sat = (id: string) =>
    id === "aliado" ? grupos.c : id === "ped" ? grupos.b : grupos.a;

  it("termômetro anda para a satisfação; abaixo de 30 avisa, abaixo de 20 sai", () => {
    let ec = iniciarCongresso(congresso, base);
    let col = base;
    const fatos: Fato[] = [];
    for (let t = 1; t <= 6; t++) {
      const r = esfriarEEsquentar(congresso, ec, col, sat, t);
      ec = r.estado;
      col = r.coligacao;
      fatos.push(...r.fatos);
    }
    expect(fatos.map((f) => f.tipo)).toContain("partido-ameaca-sair");
    expect(col).toEqual(["gov"]);
  });

  it("a oposição só aceita o convite com termômetro acima de 70", () => {
    const frio = mesa([{ tipo: "convidar", partido: "opo" }]);
    expect(() => tramitar(frio)).toThrow(/acima de 70/);
    const estado = iniciarCongresso(comSenado, base);
    estado.termometro.opo = 80;
    const r = tramitar(
      mesa([{ tipo: "convidar", partido: "opo" }], { estado }),
    );
    expect(r.coligacao).toContain("opo");
    expect(r.fatos.map((f) => f.tipo)).toContain("partido-entrou-na-base");
  });
});
