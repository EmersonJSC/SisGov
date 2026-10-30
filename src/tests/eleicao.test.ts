import { expect, it } from "vitest";
import {
  carregarPartida,
  criarPartida,
  encerrarTurno,
  escolherCandidato,
  escolherChapa,
  primeiraChapa,
  primeirosCandidatos,
  salvarPartida,
  sortearMinistros,
  sortearMinistrosDaEleicao,
  verEleicao,
  type Partida,
} from "../app/partida";
import { congressoDoPacote } from "../game/congresso";
import {
  candidatosDaEleicao,
  contar,
  criarSorte,
  eleicaoDoPais,
  gerarEscolha,
  gerarPersonagem,
  gerarPessoas,
  mundoDosPersonagens,
  passarTurnoNaEleicao,
  regrasDaEleicao,
  type EstadoDaEleicao,
} from "../game/eleicao";

const pais = eleicaoDoPais("brasil")!;

function partida(semente = 3): Partida {
  const p = criarPartida({
    semente,
    partido: { nome: "Partido da Esperança Nacional" },
  });
  if (!p.ok) throw new Error(p.erros.join());
  return p.value;
}

/** O estado da eleição como se o mandato estivesse no último turno. */
function naVespera(p: Partida, mudar: Partial<EstadoDaEleicao> = {}) {
  const e = p.game.election!;
  return {
    ...e,
    inicioDoMandato: p.game.currentTurn - pais.turnoDaEleicao,
    ...mudar,
  };
}

function valoresCom(p: Partida, satisfacao: number) {
  return Object.fromEntries(
    Object.entries(p.game.execution.values).map(([id, v]) => [
      id,
      id.startsWith("grupo_") ? satisfacao : v,
    ]),
  );
}

it("V1-39: o gerador repete com a mesma semente e respeita a idade mínima", () => {
  const a = gerarEscolha(mundoDosPersonagens, pais, criarSorte(9));
  const b = gerarEscolha(mundoDosPersonagens, pais, criarSorte(9));
  expect(a).toEqual(b);
  expect(a).toHaveLength(pais.escolha.quantidade);
  for (let s = 1; s <= 30; s++)
    for (const p of gerarEscolha(mundoDosPersonagens, pais, criarSorte(s))) {
      expect(pais.anoInicial - p.nascimento).toBeGreaterThanOrEqual(35);
      if (p.real) expect(p.opinioes).toEqual([]);
    }
});

it("V1-39: a escolha tem pelo menos um nome de cada lado", () => {
  const lados = new Set(mundoDosPersonagens.ideologias.map((i) => i.lado));
  for (let s = 1; s <= 20; s++) {
    const escolha = gerarEscolha(mundoDosPersonagens, pais, criarSorte(s));
    for (const lado of lados)
      expect(escolha.some((p) => p.lado === lado)).toBe(true);
  }
});

it("V1-39: só a frase explícita do próprio personagem nomeia um lado", () => {
  const rotulos =
    /\b(esquerda|direita|centro|socialista|liberal|conservador)\b/i;
  const explicitas = new Set([
    ...mundoDosPersonagens.ideologias.map((i) => i.explicita),
    ...mundoDosPersonagens.opinioes
      .filter((o) => o.intensidade === 3)
      .map((o) => o.texto),
  ]);
  const sorte = criarSorte(4);
  for (let i = 0; i < 200; i++) {
    const p = gerarPersonagem(mundoDosPersonagens, pais, sorte);
    expect(rotulos.test(p.biografia)).toBe(false);
    for (const frase of p.opinioes)
      if (rotulos.test(frase)) expect(explicitas.has(frase)).toBe(true);
    // o discreto só fala por rodeios
    if (p.franqueza === 0)
      for (const frase of p.opinioes)
        expect(
          mundoDosPersonagens.opinioes.find((o) => o.texto === frase)
            ?.intensidade,
        ).toBe(1);
  }
});

it("V1-39: o partido tem nome, presidente escolhido e a tela não vê o lado", () => {
  const nomes = primeirosCandidatos({ semente: 5 });
  const escolhido = nomes[2];
  const p = criarPartida({
    semente: 5,
    partido: { nome: "Movimento Popular", sigla: "MP" },
    presidente: escolhido.id,
  });
  if (!p.ok) throw new Error(p.erros.join());
  const e = p.value.game.election!;
  expect(e.partido.nome).toBe("Movimento Popular");
  expect(e.presidente.id).toBe(escolhido.id);
  // a ideologia do partido nasce no ponto do presidente
  expect(e.partido.ideologia).toEqual(e.presidente.ponto);
  expect(e.adversarios).toHaveLength(pais.campos.length - 1);
  const visao = verEleicao(p.value)!;
  expect(visao.presidente.nome).toBe(escolhido.nome);
  const texto = JSON.stringify(visao);
  expect(texto).not.toMatch(/"(lado|ideologia|ponto)"/);
});

it("V1-39: governo bem avaliado vence e abre o mandato 2; mal avaliado perde", () => {
  const p = partida();
  const comum = {
    content: p.content,
    pais: "brasil",
    congresso: p.game.congress,
    turno: p.game.currentTurn,
  };
  const bem = passarTurnoNaEleicao({
    ...comum,
    estado: naVespera(p),
    valores: valoresCom(p, 90),
  });
  expect(bem.resultado?.venceu).toBe(true);
  expect(bem.encerrada).toBe(false);
  expect(bem.estado.mandato).toBe(2);
  expect(bem.estado.mandatosDoPresidente).toBe(2);
  expect(bem.estado.inicioDoMandato).toBe(p.game.currentTurn);
  const mal = passarTurnoNaEleicao({
    ...comum,
    estado: naVespera(p),
    valores: valoresCom(p, 10),
  });
  expect(mal.resultado?.venceu).toBe(false);
  expect(mal.encerrada).toBe(true);
});

it("V1-39: sem reeleição possível, o turno da eleição pede um candidato", () => {
  const p = partida();
  const e = naVespera(p, {
    mandatosDoPresidente: pais.limiteDeMandatos,
    inicioDoMandato: p.game.currentTurn + 1 - pais.turnoDaEleicao,
    opcoes: gerarEscolha(mundoDosPersonagens, pais, criarSorte(77)),
  });
  const presa = { ...p, game: { ...p.game, election: e } };
  const bloqueada = encerrarTurno(presa);
  expect(bloqueada.ok).toBe(false);
  // o presidente não está entre os nomes possíveis
  expect(escolherCandidato(presa, e.presidente.id).ok).toBe(false);
  const escolhida = escolherCandidato(presa, e.opcoes[0].id);
  if (!escolhida.ok) throw new Error(escolhida.erros.join());
  expect(escolhida.value.game.election!.candidato?.id).toBe(e.opcoes[0].id);
});

it("V1-39: a base estranha um candidato longe do partido", () => {
  const p = partida();
  const e = p.game.election!;
  const pacote = congressoDoPacote(p.content)!;
  const longe = {
    ...e.presidente,
    id: "longe",
    ponto: {
      economia: -Math.sign(e.partido.ideologia.economia || 1) * 9,
      costumes: -Math.sign(e.partido.ideologia.costumes || 1) * 9,
    },
  };
  const ctx = {
    pacote,
    regras: regrasDaEleicao,
    pais,
    valores: p.game.execution.values,
    economiaNoInicio: e.economiaNoInicio,
    ideologia: e.partido.ideologia,
  };
  const comBase = contar(
    ctx,
    candidatosDaEleicao(ctx, [longe, ...e.adversarios], "longe"),
  ).votos.longe;
  // o mesmo candidato, com o partido no ponto dele: ninguém estranha
  const perto = { ...ctx, ideologia: longe.ponto };
  const semBase = contar(
    perto,
    candidatosDaEleicao(perto, [longe, ...e.adversarios], "longe"),
  ).votos.longe;
  expect(comBase).toBeLessThan(semBase);
  const opcoes = { ...e, opcoes: [longe] };
  const r = escolherCandidato(
    { ...p, game: { ...p.game, election: opcoes } },
    "longe",
  );
  if (!r.ok) throw new Error(r.erros.join());
  const disciplina = congressoDoPacote(p.content)!.regras.voto
    .disciplinaDoJogador;
  expect(r.value.game.election!.disciplina).toBeLessThan(disciplina);
});

it("V1-39: o salvo guarda o partido e a eleição", () => {
  const p = partida();
  const voltou = carregarPartida(salvarPartida(p));
  if (!voltou.ok) throw new Error(voltou.erros.join());
  expect(voltou.value.partida.game.election).toEqual(p.game.election);
});

it("M8: a pessoa tem atributos dentro da faixa da carreira e a tela os recebe", () => {
  const sorte = criarSorte(9);
  for (let i = 0; i < 100; i++) {
    const p = gerarPersonagem(mundoDosPersonagens, pais, sorte);
    const carreira = mundoDosPersonagens.carreiras.find(
      (c) => c.nome[p.genero] === p.carreira,
    )!;
    for (const [nome, [min, max]] of Object.entries(carreira.atributos)) {
      const v = p.atributos![nome as keyof typeof p.atributos];
      expect(v).toBeGreaterThanOrEqual(min);
      expect(v).toBeLessThanOrEqual(max);
    }
  }
  const tela = primeirosCandidatos({ semente: 1 })[0];
  for (const k of ["integridade", "articulacao", "comunicacao", "gestao"])
    expect(typeof (tela as Record<string, unknown>)[k]).toBe("number");
});

it("M8: o gerador faz uma lista de ministros, sem repetir nome", () => {
  const ministros = gerarPessoas(
    mundoDosPersonagens,
    pais,
    criarSorte(5),
    "ministro",
    12,
  );
  expect(ministros).toHaveLength(12);
  expect(new Set(ministros.map((m) => m.nome)).size).toBe(12);
  expect(ministros.every((m) => m.papel === "ministro")).toBe(true);
});

it("M8.3: a primeira tela tem vices e três nomes por área, sempre os mesmos", () => {
  const a = primeiraChapa({ semente: 4 });
  expect(a.vices).toHaveLength(4);
  expect(a.areas).toHaveLength(11);
  expect(a.areas.every((x) => x.opcoes.length === 3 && x.cargo)).toBe(true);
  const ids = [...a.vices, ...a.areas.flatMap((x) => x.opcoes)].map(
    (p) => p.id,
  );
  expect(new Set(ids).size).toBe(ids.length);
  expect(primeiraChapa({ semente: 4 })).toEqual(a);
});

it("M8.3: o sorteio de ministros sai da chapa, em todas as áreas, e muda a cada rodada", () => {
  const chapa = primeiraChapa({ semente: 4 });
  const pres = primeirosCandidatos({ semente: 4 })[0].id;
  const base = { semente: 4, presidente: pres, vice: chapa.vices[0].id };
  const r0 = sortearMinistros({ ...base, rodada: 0 });
  expect(Object.keys(r0)).toHaveLength(11);
  expect(sortearMinistros({ ...base, rodada: 0 })).toEqual(r0);
  for (const a of chapa.areas)
    expect(a.opcoes.map((o) => o.id)).toContain(r0[a.id]);
  const outros = [1, 2, 3].map((rodada) =>
    sortearMinistros({ ...base, rodada }),
  );
  expect(outros.some((o) => JSON.stringify(o) !== JSON.stringify(r0))).toBe(
    true,
  );
});

it("M8.3: a partida nasce com o vice e o ministro de cada área escolhidos", () => {
  const chapa = primeiraChapa({ semente: 4 });
  const pres = primeirosCandidatos({ semente: 4 })[0].id;
  const escolhido = chapa.areas[0].opcoes[2].id;
  const criada = criarPartida({
    semente: 4,
    presidente: pres,
    vice: chapa.vices[1].id,
    ministros: { [chapa.areas[0].id]: escolhido },
  });
  if (!criada.ok) throw new Error(criada.erros.join());
  const e = verEleicao(criada.value)!;
  expect(e.vice?.id).toBe(chapa.vices[1].id);
  expect(e.gabinete).toHaveLength(11);
  expect(e.gabinete.every((a) => a.ministro)).toBe(true);
  expect(e.gabinete[0].ministro?.id).toBe(escolhido);
  // sem escolha, o jogo sorteia pela chapa
  const sem = criarPartida({ semente: 4, presidente: pres });
  if (!sem.ok) throw new Error(sem.erros.join());
  expect(verEleicao(sem.value)!.vice).toBeTruthy();
});

it("M8.3: na eleição o partido escolhe a troca da chapa", () => {
  let p = partida(4);
  const e0 = p.game.election!;
  const turnoDaEscolha = pais.turnoDaEscolha;
  const fim = passarTurnoNaEleicao({
    content: p.content,
    pais: "brasil",
    estado: { ...e0, inicioDoMandato: p.game.currentTurn - turnoDaEscolha },
    valores: p.game.execution.values,
    congresso: p.game.congress,
    turno: p.game.currentTurn,
  });
  p = { ...p, game: { ...p.game, election: fim.estado } };
  const v = verEleicao(p)!;
  expect(v.chapaParaTrocar?.vices.length).toBeGreaterThan(0);
  const novoVice = v.chapaParaTrocar!.vices[0].id;
  const sorteio = sortearMinistrosDaEleicao(p, 0);
  expect(Object.keys(sorteio)).toHaveLength(11);
  const r = escolherChapa(p, { vice: novoVice, ministros: sorteio });
  if (!r.ok) throw new Error(r.erros.join());
  expect(verEleicao(r.value)!.chapaNova?.vice).toBe(novoVice);
  expect(escolherChapa(p, { vice: "nao-existe" }).ok).toBe(false);
});

it("M8.3: vencendo, a troca decidida vale no mandato 2; sem troca, a chapa fica", () => {
  const p = partida(4);
  const e0 = p.game.election!;
  const opcoes = primeiraChapa({ semente: 4 });
  const comum = {
    content: p.content,
    pais: "brasil",
    congresso: p.game.congress,
    turno: p.game.currentTurn,
    valores: valoresCom(p, 90),
  };
  const mantida = passarTurnoNaEleicao({ ...comum, estado: naVespera(p) });
  expect(mantida.estado.vice?.id).toBe(e0.vice?.id);
  expect(mantida.estado.ministros).toEqual(e0.ministros);
  const trocada = passarTurnoNaEleicao({
    ...comum,
    estado: naVespera(p, {
      chapaNova: {
        vice: e0.vice,
        ministros: { [opcoes.areas[0].id]: e0.ministros![opcoes.areas[1].id] },
      },
    }),
  });
  expect(trocada.estado.ministros![opcoes.areas[0].id].id).toBe(
    e0.ministros![opcoes.areas[1].id].id,
  );
  expect(trocada.estado.chapaNova).toBeUndefined();
});
