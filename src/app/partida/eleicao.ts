/**
 * Partido, personagens e eleição na fachada (V1-39). A tela nunca vê o lado
 * nem a ideologia de um personagem: só a biografia e as opiniões.
 */
import type { GameState } from "../../game/createGame";
import { pontoAtual } from "../../game/bussola";
import {
  candidatoDoPartido,
  eleicaoDoPais,
  escolherCandidato as escolherNoJogo,
  estranhamento,
  faltaCandidato,
  passarTurnoNaEleicao,
  podeConcorrer,
  primeiraEscolha,
  renovarCongresso,
  turnoDoMandato,
  type Personagem,
  type Pesquisa,
  type ResultadoDaEleicao,
} from "../../game/eleicao";
import type { Partida, Resultado } from "./tipos";

export type VisaoPersonagem = Readonly<{
  id: string;
  nome: string;
  real: boolean;
  genero: "m" | "f";
  idade: number;
  estado: string;
  carreira: string;
  biografia: string;
  opinioes: readonly string[];
  carisma: number;
  experiencia: number;
  /**
   * Quanto a base do partido estranharia este nome (0 nenhum … 3 muito).
   * Ausente na primeira escolha, quando o partido ainda não tem base.
   */
  estranhamento?: number;
}>;

export type VisaoPesquisa = Readonly<{
  turno: number;
  /** % dos válidos no 1º turno, por nome. */
  primeiro: readonly Readonly<{
    nome: string;
    votos: number;
    doPartido: boolean;
  }>[];
  /** % do candidato do partido no 2º turno contra cada adversário. */
  segundo: readonly Readonly<{ contra: string; votos: number }>[];
  margem: number;
}>;

export type VisaoResultado = Readonly<{
  turno: number;
  mandato: number;
  candidato: string;
  venceu: boolean;
  vencedor: string;
  primeiro: readonly Readonly<{ nome: string; votos: number }>[];
  segundo?: readonly Readonly<{ nome: string; votos: number }>[];
  comparecimento: number;
  /** % do candidato do partido em cada segmento, do maior para o menor. */
  porSegmento: readonly Readonly<{ id: string; votos: number }>[];
}>;

export type VisaoEleicao = Readonly<{
  partido: Readonly<{ nome: string; sigla: string }>;
  presidente: VisaoPersonagem;
  mandato: number;
  /** Turnos até a eleição (0 = o próximo encerramento é a eleição). */
  turnosAteAEleicao: number;
  presidentePodeConcorrer: boolean;
  candidato?: VisaoPersonagem;
  /** Nomes que o partido pode lançar (o presidente, se puder, e os novos). */
  opcoes: readonly VisaoPersonagem[];
  adversarios: readonly VisaoPersonagem[];
  pesquisas: readonly VisaoPesquisa[];
  resultados: readonly VisaoResultado[];
  encerrada: boolean;
}>;

const ANO_POR_TURNO = 0.25;

function verPersonagem(
  p: Personagem,
  ano: number,
  extra?: { estranhamento?: number },
): VisaoPersonagem {
  return {
    id: p.id,
    nome: p.nome,
    real: p.real,
    genero: p.genero,
    idade: Math.floor(ano - p.nascimento),
    estado: p.estado,
    carreira: p.carreira,
    biografia: p.biografia,
    opinioes: p.opinioes,
    carisma: p.carisma,
    experiencia: p.experiencia,
    ...(extra?.estranhamento !== undefined
      ? { estranhamento: Math.min(3, Math.round(extra.estranhamento)) }
      : {}),
  };
}

/** Os nomes da primeira tela; a mesma semente dá os mesmos na partida. */
export function primeirosCandidatos(
  opcoes: Readonly<{ pais?: string; semente?: number }> = {},
): readonly VisaoPersonagem[] {
  const pais = opcoes.pais ?? "brasil";
  const ano = eleicaoDoPais(pais)?.anoInicial ?? 0;
  return primeiraEscolha(pais, opcoes.semente ?? 1).map((p) =>
    verPersonagem(p, ano),
  );
}

const anoDe = (game: GameState) =>
  (eleicaoDoPais(game.scenario.id)?.anoInicial ?? 0) +
  game.currentTurn * ANO_POR_TURNO;

export function verEleicao(partida: Partida): VisaoEleicao | undefined {
  const { game } = partida;
  const e = game.election;
  const pais = eleicaoDoPais(game.scenario.id);
  if (!e || !pais) return undefined;
  const ano = anoDe(game);
  const nomes = new Map<string, string>(
    [
      e.presidente,
      ...e.adversarios,
      ...e.opcoes,
      ...(e.candidato ? [e.candidato] : []),
    ].map((p) => [p.id, p.nome]),
  );
  const candidato = candidatoDoPartido(pais, e);
  const verPesquisa = (p: Pesquisa): VisaoPesquisa => ({
    turno: p.turno,
    primeiro: Object.entries(p.primeiro)
      .map(([id, votos]) => ({
        nome: nomes.get(id) ?? id,
        votos,
        doPartido: !e.adversarios.some((a) => a.id === id),
      }))
      .sort((a, b) => b.votos - a.votos),
    segundo: Object.entries(p.segundo).map(([id, votos]) => ({
      contra: nomes.get(id) ?? id,
      votos,
    })),
    margem: p.margem,
  });
  const verResultado = (r: ResultadoDaEleicao): VisaoResultado => {
    const nome = (id: string) =>
      [r.candidato, ...r.adversarios].find((p) => p.id === id)?.nome ?? id;
    const lista = (votos: Readonly<Record<string, number>>) =>
      Object.entries(votos)
        .map(([id, v]) => ({ nome: nome(id), votos: v }))
        .sort((a, b) => b.votos - a.votos);
    return {
      turno: r.turno,
      mandato: r.mandato,
      candidato: r.candidato.nome,
      venceu: r.venceu,
      vencedor: nome(r.vencedor),
      primeiro: lista(r.primeiro.votos),
      ...(r.segundo ? { segundo: lista(r.segundo.votos) } : {}),
      comparecimento: (r.segundo ?? r.primeiro).comparecimento,
      porSegmento: Object.entries(r.porSegmento)
        .map(([id, votos]) => ({ id, votos }))
        .sort((a, b) => b.votos - a.votos),
    };
  };
  const podeIr = podeConcorrer(pais, e);
  return {
    partido: { nome: e.partido.nome, sigla: e.partido.sigla },
    presidente: verPersonagem(e.presidente, ano),
    mandato: e.mandato,
    turnosAteAEleicao: Math.max(
      0,
      pais.turnoDaEleicao - turnoDoMandato(e, game.currentTurn) - 1,
    ),
    presidentePodeConcorrer: podeIr,
    ...(candidato ? { candidato: verPersonagem(candidato, ano) } : {}),
    opcoes: [...(podeIr ? [e.presidente] : []), ...e.opcoes].map((p) =>
      verPersonagem(p, ano, { estranhamento: estranhamento(e, p) }),
    ),
    adversarios: e.adversarios.map((p) => verPersonagem(p, ano)),
    pesquisas: e.pesquisas.map(verPesquisa),
    resultados: e.resultados.map(verResultado),
    encerrada: game.gameStatus === "encerrada",
  };
}

/** O partido escolhe quem disputa a próxima eleição. */
export function escolherCandidato(
  partida: Partida,
  id: string,
): Resultado<Partida> {
  const e = partida.game.election;
  if (!e) return { ok: false, erros: ["Esta partida não tem eleição."] };
  const novo = escolherNoJogo(partida.content, partida.game.scenario.id, e, id);
  if (typeof novo === "string") return { ok: false, erros: [novo] };
  return {
    ok: true,
    value: { ...partida, game: { ...partida.game, election: novo } },
  };
}

/** Por que o turno não pode passar (partida encerrada ou sem candidato). */
export function bloqueioDaEleicao(game: GameState): string | undefined {
  if (game.gameStatus === "encerrada")
    return "A partida acabou: o partido perdeu a eleição.";
  const e = game.election;
  const pais = eleicaoDoPais(game.scenario.id);
  if (e && pais && faltaCandidato(pais, e, game.currentTurn + 1))
    return "O presidente não pode concorrer de novo. Escolha o candidato do partido antes da eleição.";
  return undefined;
}

export type EleicaoNoTurno = Readonly<{
  pesquisa?: VisaoPesquisa;
  resultado?: VisaoResultado;
}>;

/** Fim do turno: pesquisas, eleição e, se o partido vence, o novo Congresso. */
export function passarEleicao(partida: Partida): {
  game: GameState;
  eleicao?: EleicaoNoTurno;
} {
  const { content, game } = partida;
  const e = game.election;
  const pais = eleicaoDoPais(game.scenario.id);
  if (!e || !pais) return { game };
  const fim = passarTurnoNaEleicao({
    content,
    pais: game.scenario.id,
    estado: e,
    valores: game.execution.values,
    congresso: game.congress,
    turno: game.currentTurn,
  });
  let next: GameState = { ...game, election: fim.estado };
  if (fim.resultado) {
    next = {
      ...next,
      elections: [
        ...next.elections,
        {
          electionId: "presidente",
          turn: fim.resultado.turno,
          winnerId: fim.resultado.vencedor,
          status: fim.resultado.venceu ? "novo_mandato" : "derrota",
          tieRolls: [],
        },
      ],
      ...(fim.encerrada ? { gameStatus: "encerrada" as const } : {}),
    };
    if (fim.resultado.venceu && next.congress && next.compass)
      next = {
        ...next,
        congress: renovarCongresso({
          content,
          pais,
          estado: next.congress,
          valores: next.execution.values,
          pontoDoJogador: pontoAtual(content, next.compass, next.policies),
          mandato: fim.estado.mandato - 1,
        }),
      };
  }
  const visao = verEleicao({ ...partida, game: next });
  return {
    game: next,
    eleicao:
      fim.pesquisa || fim.resultado
        ? {
            ...(fim.pesquisa && visao
              ? { pesquisa: visao.pesquisas.at(-1) }
              : {}),
            ...(fim.resultado && visao
              ? { resultado: visao.resultados.at(-1) }
              : {}),
          }
        : undefined,
  };
}
