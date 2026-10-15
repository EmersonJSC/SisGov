import { expect, it } from "vitest";
import {
  carregarPartida,
  criarPartida,
  encerrarTurno,
  escolherCandidato,
  primeirosCandidatos,
  salvarPartida,
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
