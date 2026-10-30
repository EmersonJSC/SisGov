/**
 * Partido, personagens e eleição na fachada (V1-39). A tela nunca vê o lado
 * nem a ideologia de um personagem: só a biografia e as opiniões.
 */
import type { GameState } from "../../game/createGame";
import { anoComFracao, mesesAteOTurno } from "../../game/calendario";
import { pontoAtual } from "../../game/bussola";
import {
  areasDoGoverno,
  atributosDe,
  candidatoDoPartido,
  escolherChapa as escolherChapaNoJogo,
  primeiraChapa as primeiraChapaNoJogo,
  sortearMinistrosDaChapa,
  type OpcoesDaChapa,
  eleicaoDoPais,
  escolherCandidato as escolherNoJogo,
  estranhamento,
  faltaCandidato,
  mundoDosPersonagens,
  passarTurnoNaEleicao,
  podeConcorrer,
  primeiraEscolha,
  renovarCongresso,
  turnoDoMandato,
  type Personagem,
  type Pesquisa,
  type ResultadoDaEleicao,
} from "../../game/eleicao";
import { notasDoGabinete, valoresComReacao } from "./bussola";
import { verPedidoDoMinistro, type VisaoPedidoDoMinistro } from "./pedidos";
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
  integridade: number;
  articulacao: number;
  comunicacao: number;
  gestao: number;
  /**
   * Nome do retrato em `public/arte/retratos/` (sem extensão): carreira e
   * gênero, ou "pessoa-real" (pessoas reais não ganham rosto de IA).
   */
  retrato: string;
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
  /** Retrato de cada nome da disputa (os adversários mudam depois). */
  retratos: Readonly<Record<string, string>>;
  /** % do candidato do partido em cada segmento, do maior para o menor. */
  porSegmento: readonly Readonly<{ id: string; votos: number }>[];
}>;

/** Uma área do governo (a bolha) e quem pode comandá-la. */
export type VisaoAreaDaChapa = Readonly<{
  id: string;
  titulo: string;
  cargo: string;
  opcoes: readonly VisaoPersonagem[];
  /** Quem ocupa a área agora (ausente na primeira escolha). */
  ministro?: VisaoPersonagem;
  /** Popularidade do ministro (0 a 100), pelos grupos leais a ele (M8.3). */
  popularidade?: number;
  /** Ids dos grupos leais ao ministro. */
  leais?: readonly string[];
}>;

/** Os nomes que o partido escolhe além do presidente: vice e ministros. */
export type VisaoChapa = Readonly<{
  vices: readonly VisaoPersonagem[];
  areas: readonly VisaoAreaDaChapa[];
}>;

export type VisaoEleicao = Readonly<{
  partido: Readonly<{ nome: string; sigla: string }>;
  presidente: VisaoPersonagem;
  vice?: VisaoPersonagem;
  /** Quem comanda cada área hoje. */
  gabinete: readonly VisaoAreaDaChapa[];
  /** O pedido de lei que um ministro trouxe e espera resposta (M8.3). */
  pedido?: VisaoPedidoDoMinistro;
  /** Nomes para trocar vice e ministros na próxima eleição (já sorteados). */
  chapaParaTrocar?: VisaoChapa;
  /** A troca já decidida: id do vice e do ministro de cada área. */
  chapaNova?: Readonly<{
    vice?: string;
    ministros: Readonly<Record<string, string>>;
  }>;
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

function retratoDe(p: Personagem): string {
  if (p.real) return "pessoa-real";
  const carreira = mundoDosPersonagens.carreiras.find(
    (c) => c.nome[p.genero] === p.carreira,
  );
  return carreira ? `${carreira.id}-${p.genero}` : "pessoa-real";
}

function verPersonagem(
  p: Personagem,
  ano: number,
  extra?: { estranhamento?: number },
): VisaoPersonagem {
  const idade = Math.floor(ano - p.nascimento);
  return {
    id: p.id,
    nome: p.nome,
    real: p.real,
    genero: p.genero,
    idade,
    estado: p.estado,
    carreira: p.carreira,
    // a biografia foi escrita com a idade de quando o personagem foi
    // gerado; a idade dela acompanha o ano
    biografia: p.biografia.replace(/^([^,]+), \d+ anos,/, `$1, ${idade} anos,`),
    opinioes: p.opinioes,
    carisma: p.carisma,
    experiencia: p.experiencia,
    ...atributosDe(p),
    retrato: retratoDe(p),
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

function verChapa(
  pais: string,
  ano: number,
  opcoes: OpcoesDaChapa,
  atuais: Readonly<Record<string, Personagem>> = {},
): VisaoChapa {
  return {
    vices: opcoes.vices.map((p) => verPersonagem(p, ano)),
    areas: areasDoGoverno(pais).map((a) => ({
      ...a,
      opcoes: (opcoes.ministros[a.id] ?? []).map((p) => verPersonagem(p, ano)),
      ...(atuais[a.id] ? { ministro: verPersonagem(atuais[a.id], ano) } : {}),
    })),
  };
}

/** Vice e ministros da primeira tela; a mesma semente dá os mesmos. */
export function primeiraChapa(
  opcoes: Readonly<{ pais?: string; semente?: number }> = {},
): VisaoChapa {
  const pais = opcoes.pais ?? "brasil";
  const ano = eleicaoDoPais(pais)?.anoInicial ?? 0;
  return verChapa(pais, ano, primeiraChapaNoJogo(pais, opcoes.semente ?? 1));
}

/**
 * Sorteia um ministro por área a partir da chapa (presidente e vice). Cada
 * `rodada` dá um sorteio novo; devolve o id escolhido de cada área.
 */
export function sortearMinistros(
  opcoes: Readonly<{
    pais?: string;
    semente?: number;
    presidente: string;
    vice: string;
    rodada?: number;
  }>,
): Readonly<Record<string, string>> {
  const pais = opcoes.pais ?? "brasil";
  const semente = opcoes.semente ?? 1;
  const presidente = primeiraEscolha(pais, semente).find(
    (p) => p.id === opcoes.presidente,
  );
  const chapa = primeiraChapaNoJogo(pais, semente);
  const vice = chapa.vices.find((p) => p.id === opcoes.vice);
  if (!presidente) return {};
  return sortearMinistrosDaChapa(
    chapa,
    presidente,
    vice,
    semente,
    opcoes.rodada ?? 0,
  );
}

/**
 * Sorteio para a próxima eleição: parte do candidato do partido e do vice
 * (o novo, se já foi escolhido).
 */
export function sortearMinistrosDaEleicao(
  partida: Partida,
  rodada: number,
): Readonly<Record<string, string>> {
  const e = partida.game.election;
  const pais = eleicaoDoPais(partida.game.scenario.id);
  if (!e || !pais || !e.opcoesDaChapa) return {};
  const candidato = candidatoDoPartido(pais, e) ?? e.presidente;
  return sortearMinistrosDaChapa(
    e.opcoesDaChapa,
    candidato,
    e.chapaNova?.vice ?? e.vice,
    e.semente,
    rodada + e.mandato * 1000,
  );
}

/** O partido troca o vice e/ou ministros para o próximo mandato. */
export function escolherChapa(
  partida: Partida,
  troca: Readonly<{
    vice?: string;
    ministros?: Readonly<Record<string, string>>;
  }>,
): Resultado<Partida> {
  const e = partida.game.election;
  if (!e) return { ok: false, erros: ["Esta partida não tem eleição."] };
  const novo = escolherChapaNoJogo(e, troca);
  if (typeof novo === "string") return { ok: false, erros: [novo] };
  return {
    ok: true,
    value: { ...partida, game: { ...partida.game, election: novo } },
  };
}

const anoDe = (game: GameState): number =>
  anoComFracao(
    eleicaoDoPais(game.scenario.id)?.anoInicial ?? 0,
    mesesAteOTurno(game.currentTurn),
  );

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
      retratos: Object.fromEntries(
        [r.candidato, ...r.adversarios].map((p) => [p.nome, retratoDe(p)]),
      ),
      porSegmento: Object.entries(r.porSegmento)
        .map(([id, votos]) => ({ id, votos }))
        .sort((a, b) => b.votos - a.votos),
    };
  };
  const podeIr = podeConcorrer(pais, e);
  const notas = notasDoGabinete(partida);
  const cargos = new Map(
    verChapa(
      game.scenario.id,
      ano,
      { vices: [], ministros: {} },
      e.ministros,
    ).areas.map((a) => [a.id, a.cargo] as const),
  );
  const pedido = verPedidoDoMinistro(partida, (area) => cargos.get(area));
  return {
    partido: { nome: e.partido.nome, sigla: e.partido.sigla },
    presidente: verPersonagem(e.presidente, ano),
    ...(e.vice ? { vice: verPersonagem(e.vice, ano) } : {}),
    gabinete: verChapa(
      game.scenario.id,
      ano,
      { vices: [], ministros: {} },
      e.ministros,
    ).areas.map((a) => {
      const n = notas.find((x) => x.area === a.id);
      return n ? { ...a, popularidade: n.nota, leais: n.leais } : a;
    }),
    ...(pedido ? { pedido } : {}),
    ...(e.opcoesDaChapa
      ? { chapaParaTrocar: verChapa(game.scenario.id, ano, e.opcoesDaChapa) }
      : {}),
    ...(e.chapaNova
      ? {
          chapaNova: {
            ...(e.chapaNova.vice ? { vice: e.chapaNova.vice.id } : {}),
            ministros: Object.fromEntries(
              Object.entries(e.chapaNova.ministros).map(([a, p]) => [a, p.id]),
            ),
          },
        }
      : {}),
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
    valores: valoresComReacao(partida),
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
          valores: valoresComReacao({ content, game: next }),
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
